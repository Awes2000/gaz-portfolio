/* ============================================================
   Canonical site origin, resolved once for metadata, robots,
   sitemap and JSON-LD.

   Priority:
   1. NEXT_PUBLIC_SITE_URL          — committed in .env.production
                                      (public URL, not a secret)
   2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel at build time
   3. localhost                     — local dev

   Every candidate is validated so a malformed or empty env value
   can never crash the build (metadataBase does `new URL(...)`).
   ============================================================ */

function resolve(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      new URL(candidate);
      return candidate;
    } catch {
      /* skip malformed values */
    }
  }
  return "http://localhost:3000";
}

export const SITE_URL = resolve();
