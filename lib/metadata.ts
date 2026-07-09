import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/siteUrl";

/* Shared site defaults for both language root layouts. Per-route
   pages (en home, /nl, /work/[slug]) override title/description/
   openGraph/alternates on top of this base. */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Gabriël Awes Zoretić · Full-stack developer, Amsterdam",
  description:
    "Full-stack developer in Amsterdam with a front-end and design edge. Next.js-focused, now going deep on cybersecurity, cloud and Linux. Open to freelance front-end and collaborations.",
  authors: [{ name: "Gabriël Awes Zoretić" }],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    title: "Gabriël Awes Zoretić · full-stack developer",
    description:
      "Builds full-stack web apps and is learning to secure them. Next.js · cybersecurity · cloud · Linux. Based in Amsterdam.",
    images: [{ url: "/og-card.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabriël Awes Zoretić · full-stack developer",
    description:
      "Builds full-stack web apps and is learning to secure them. Next.js · cybersecurity · cloud · Linux.",
    images: ["/og-card.jpg"],
  },
};

export const baseViewport: Viewport = {
  themeColor: "#0A192F",
};
