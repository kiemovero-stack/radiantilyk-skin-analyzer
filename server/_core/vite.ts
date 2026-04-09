import express, { type Express, type Request } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

/**
 * Domains that serve the STAFF dashboard.
 * Only these exact domains serve the staff app.
 */
const STAFF_DOMAINS = new Set([
  "rkaaiskin.com",
  "www.rkaaiskin.com",
  "rkaaiskin.manus.space",
]);

/**
 * Domains that explicitly serve the CLIENT site.
 * If a domain matches here, it always serves the client app.
 */
const CLIENT_DOMAINS = new Set([
  "rkaskinai.com",
  "www.rkaskinai.com",
  "skinanalyz-yxdmlvyu.manus.space",
]);

/**
 * Extract the public-facing hostname from the request.
 *
 * In the Manus deployment stack (Cloudflare Workers → Google Cloud Run),
 * the original public hostname may be passed via various headers.
 * We check all common proxy headers to find the real public hostname.
 */
function getPublicHost(req: Request): string {
  // Check all common proxy headers in priority order
  const headerCandidates = [
    req.headers["x-original-host"],
    req.headers["x-forwarded-host"],
    req.headers["x-real-host"],
    req.headers["cf-connecting-host"],  // Cloudflare
  ];

  for (const h of headerCandidates) {
    if (typeof h === "string" && h.length > 0) {
      return h.split(":")[0].toLowerCase();
    }
  }

  // Fallback to Express hostname (reads Host header when trust proxy is set)
  const hostname = req.hostname || "";
  if (hostname) return hostname.split(":")[0].toLowerCase();

  // Last resort: raw Host header
  const hostHeader = req.headers.host || "";
  return hostHeader.split(":")[0].toLowerCase();
}

/** Determine if a request should be served the client site */
function isClientDomain(req: Request): boolean {
  const host = getPublicHost(req);
  console.log(`[DomainRouter] host="${host}" url="${req.originalUrl}" headers: x-original-host="${req.headers["x-original-host"]}" x-forwarded-host="${req.headers["x-forwarded-host"]}" hostname="${req.hostname}" host-header="${req.headers.host}"`);

  // Explicit client domains → always client app
  if (CLIENT_DOMAINS.has(host)) {
    console.log(`[DomainRouter] → CLIENT (matched CLIENT_DOMAINS)`);
    return true;
  }

  // Explicit staff domains → staff app
  if (STAFF_DOMAINS.has(host)) {
    console.log(`[DomainRouter] → STAFF (matched STAFF_DOMAINS)`);
    return false;
  }

  // localhost / dev server → check for /__client path or cookie
  if (host === "localhost" || host === "127.0.0.1" || host.includes("manus.computer")) {
    // If the URL starts with /__client, this is the initial client entry
    if (req.originalUrl.startsWith("/__client")) return true;
    // Check for the client-mode cookie (set when /__client is first visited)
    const cookies = req.headers.cookie || "";
    if (cookies.includes("client_mode=1")) return true;
    return false; // default to staff in dev
  }

  // Check if the hostname contains "skinai" or "client" keywords → client
  if (host.includes("skinai") || host.includes("skinanalyz")) {
    console.log(`[DomainRouter] → CLIENT (hostname contains skinai/skinanalyz)`);
    return true;
  }

  // Any other unknown domain → default to client site
  // (Cloud Run internal domains, other custom domains, etc.)
  console.log(`[DomainRouter] → CLIENT (fallback for unknown domain)`);
  return true;
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientDir = path.resolve(import.meta.dirname, "../..", "client");
      const useClientSite = isClientDomain(req);

      // If entering via /__client, set a session cookie and redirect to /
      if (url.startsWith("/__client")) {
        res.cookie("client_mode", "1", { httpOnly: false, path: "/" });
        const cleanUrl = url.replace("/__client", "") || "/";
        res.redirect(302, cleanUrl);
        return;
      }

      const templateFile = useClientSite ? "client-index.html" : "index.html";
      const entryScript = useClientSite ? "/src/client-main.tsx" : "/src/main.tsx";

      let template = await fs.promises.readFile(
        path.resolve(clientDir, templateFile),
        "utf-8"
      );
      template = template.replace(
        `src="${entryScript}"`,
        `src="${entryScript}?v=${nanoid()}"`
      );

      // For client domain, set a data attribute so clientPaths.ts can detect standalone mode
      if (useClientSite) {
        template = template.replace(
          '<div id="root"></div>',
          '<div id="root" data-client-mode="true"></div>'
        );
        template = template.replace(
          '<html lang="en">',
          '<html lang="en" data-client-mode="true">'
        );
      }

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Serve static assets (JS, CSS, images) but NOT index.html files.
  // We need the domain-aware catch-all to decide which HTML to serve.
  // express.static automatically serves index.html for "/" which bypasses
  // our domain detection logic — so we must prevent that.
  app.use(
    express.static(distPath, {
      index: false, // Do NOT auto-serve index.html for directory requests
    })
  );

  // Domain-based SPA fallback: serve the correct index.html
  app.use("*", (req, res) => {
    const useClientSite = isClientDomain(req);

    // If entering via /__client in production, redirect
    if (req.originalUrl.startsWith("/__client")) {
      res.cookie("client_mode", "1", { httpOnly: false, path: "/" });
      const cleanUrl = req.originalUrl.replace("/__client", "") || "/";
      res.redirect(302, cleanUrl);
      return;
    }

    const htmlFile = useClientSite ? "client-index.html" : "index.html";
    const htmlPath = path.resolve(distPath, htmlFile);

    // Fall back to main index.html if client-index.html doesn't exist
    if (useClientSite && !fs.existsSync(htmlPath)) {
      console.warn(`[DomainRouter] client-index.html not found at ${htmlPath}, falling back to index.html`);
      res.sendFile(path.resolve(distPath, "index.html"));
      return;
    }

    let html = fs.readFileSync(htmlPath, "utf-8");
    if (useClientSite) {
      html = html.replace(
        '<html lang="en">',
        '<html lang="en" data-client-mode="true">'
      );
    }
    console.log(`[DomainRouter] Serving ${htmlFile} for host="${getPublicHost(req)}"`);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });
}
