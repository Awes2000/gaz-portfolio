/* ============================================================
   Canonical site origin, resolved once for metadata, robots,
   sitemap and JSON-LD.

   Priority:
   1. NEXT_PUBLIC_SITE_URL          — explicit override (custom domain)
   2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel at build time,
                                      so production URLs are correct
                                      with zero dashboard config
   3. localhost                     — local dev
   ============================================================ */

function resolve(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolve();
