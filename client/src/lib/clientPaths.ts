/**
 * Client path configuration.
 *
 * When running on the standalone client domain, routes are at the root:
 *   /          → Landing
 *   /start     → Analyze
 *   /report/X  → Report
 *
 * When running on the staff domain (rkaaiskin.com), routes are prefixed:
 *   /client          → Landing
 *   /client/start    → Analyze
 *   /client/report/X → Report
 *
 * This utility auto-detects which mode we're in based on the hostname.
 */

const STAFF_DOMAINS = [
  "rkaaiskin.com",
  "www.rkaaiskin.com",
  "rkaaiskin.manus.space",
];

/**
 * Returns true if we're running on the standalone client domain
 * (i.e., NOT on the staff dashboard domain).
 */
export function isStandaloneClient(): boolean {
  // Check the data attribute set by the server based on domain detection
  if (document.documentElement.dataset.clientMode === "true") return true;
  // Also check the root div (set by server for client domain)
  const root = document.getElementById("root");
  if (root?.dataset.clientMode === "true") return true;
  
  const hostname = window.location.hostname;
  // In dev, check for client_mode cookie (set when entering via /__client)
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes("manus.computer")) {
    return document.cookie.includes("client_mode=1");
  }
  return !STAFF_DOMAINS.some((d) => hostname === d);
}

/** Get the base path prefix for client routes */
export function getClientPrefix(): string {
  return isStandaloneClient() ? "" : "/client";
}

/** Build a client-facing path */
export function clientPath(path: string): string {
  const prefix = getClientPrefix();
  if (path === "/") return prefix || "/";
  return `${prefix}${path}`;
}

/** Build a client-facing URL (full origin + path) */
export function clientUrl(path: string): string {
  return `${window.location.origin}${clientPath(path)}`;
}

// Convenience paths
export const paths = {
  get landing() { return clientPath("/"); },
  get start() { return clientPath("/start"); },
  report(id: string | number) { return clientPath(`/report/${id}`); },
  referral(code: string) {
    const base = isStandaloneClient() ? "/" : "/client";
    return `${window.location.origin}${base}?ref=${code}`;
  },
};
