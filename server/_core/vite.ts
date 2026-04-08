import express, { type Express, type Request } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

/**
 * Domains that serve the STAFF dashboard.
 * All other domains serve the standalone CLIENT site.
 */
const STAFF_DOMAINS = new Set([
  "rkaaiskin.com",
  "www.rkaaiskin.com",
  "rkaaiskin.manus.space",
]);

/** Determine if a request should be served the client site */
function isClientDomain(req: Request): boolean {
  const host = (req.hostname || req.headers.host || "").split(":")[0].toLowerCase();

  // Explicit staff domains → staff app
  if (STAFF_DOMAINS.has(host)) return false;

  // localhost / dev server → check for /__client path or cookie
  if (host === "localhost" || host === "127.0.0.1" || host.includes("manus.computer")) {
    // If the URL starts with /__client, this is the initial client entry
    if (req.originalUrl.startsWith("/__client")) return true;
    // Check for the client-mode cookie (set when /__client is first visited)
    const cookies = req.headers.cookie || "";
    if (cookies.includes("client_mode=1")) return true;
    return false; // default to staff in dev
  }

  // Any other domain (e.g., skinanalyz-*.manus.space) → client site
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

  app.use(express.static(distPath));

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
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });
}
