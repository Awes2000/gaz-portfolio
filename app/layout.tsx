import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono, Roboto_Slab } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/siteUrl";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-roboto-slab",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  themeColor: "#0A192F",
};

/* Pre-paint gate script, verbatim from Portfolio.html: adds the
   `js` + `locked` classes before first paint so the blurred/locked
   state never flashes. Reduced motion and unlocked sessions skip
   the lock entirely. */
const PREPAINT_SCRIPT = `(function(){var h=document.documentElement;h.className+=' js';try{if('scrollRestoration' in history)history.scrollRestoration='manual';}catch(e){}var rm=false;try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}var u=window.__gateUnlocked;try{u=u||sessionStorage.getItem('aws_unlocked')==='1';}catch(e){}if(!rm&&!u){h.className+=' locked';try{window.scrollTo(0,0);}catch(e){}}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
        <JsonLd />
      </head>
      <body className={`${robotoSlab.variable} ${inter.variable} ${robotoMono.variable}`}>{children}</body>
    </html>
  );
}
