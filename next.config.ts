import type { NextConfig } from "next";

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
};

export default nextConfig;
