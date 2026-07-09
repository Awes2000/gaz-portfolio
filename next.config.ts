import type { NextConfig } from "next";

/* Content-Security-Policy. The site ships no external resources: fonts
   are self-hosted by next/font, images are local or next/image, there
   is no analytics, CDN or third-party embed. So everything is 'self'
   plus the data: URIs used for the grain texture and inline SVG. Inline
   scripts (the pre-paint gate, JSON-LD, hydration) and inline styles are
   allowed because the app is statically generated and cannot mint a
   per-request nonce without opting out of static rendering. */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    /* No image on this site renders wider than the 1120px content
       column (the headshot tops out near 340px). The default device
       sizes go to 3840, which made next/image emit a 3840-wide src
       fallback that upscaled the 1365px headshot. Cap at 1200 so the
       srcset and fallback stay sane and nothing is ever upscaled. */
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
