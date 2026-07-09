import { Inter, Roboto_Mono, Roboto_Slab } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";

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

/* Pre-paint gate script, verbatim from Portfolio.html: adds the
   `js` + `locked` classes before first paint so the blurred/locked
   state never flashes. Reduced motion and unlocked sessions skip
   the lock entirely. */
const PREPAINT_SCRIPT = `(function(){var h=document.documentElement;h.className+=' js';try{if('scrollRestoration' in history)history.scrollRestoration='manual';}catch(e){}var rm=false;try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}var u=window.__gateUnlocked;try{u=u||sessionStorage.getItem('aws_unlocked')==='1';}catch(e){}if(!rm&&!u){h.className+=' locked';try{window.scrollTo(0,0);}catch(e){}}})();`;

/* The single HTML shell shared by both language root layouts. The
   only thing that varies per route group is the `lang` attribute, so
   the Dutch route serves lang="nl" in the raw SSR HTML while English
   serves lang="en" — no client-side stamping required. */
export function RootShell({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html lang={lang} suppressHydrationWarning>
      {/* App Router root shell: a raw <head> is the correct pattern here
          (next/head is Pages Router only), so the no-head-element rule
          is a false positive in this context. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
        <JsonLd />
      </head>
      <body className={`${robotoSlab.variable} ${inter.variable} ${robotoMono.variable}`}>{children}</body>
    </html>
  );
}
