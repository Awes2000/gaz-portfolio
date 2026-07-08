import type { Metadata } from "next";
import { LangProvider } from "@/components/LangProvider";
import { Portfolio } from "@/components/Portfolio";

export const metadata: Metadata = {
  title: "Gabriël Awes Zoretić · Full-stack developer, Amsterdam",
  description:
    "Full-stack developer in Amsterdam met een front-end- en design-inslag. Next.js-gericht, nu de diepte in met cybersecurity, cloud en Linux. Open voor freelance front-end en samenwerkingen.",
  alternates: {
    canonical: "/nl",
    languages: { en: "/", nl: "/nl", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    title: "Gabriël Awes Zoretić · full-stack developer",
    description:
      "Bouwt full-stack webapps en leert ze te beveiligen. Next.js · cybersecurity · cloud · Linux. Gevestigd in Amsterdam.",
    images: [{ url: "/og-card.jpg", width: 1200, height: 630 }],
  },
};

/* Dutch entry point: same server-rendered portfolio with NL as the
   route language, so crawlers index the Dutch copy at its own URL.
   The tiny inline script stamps <html lang="nl"> before hydration. */
export default function PageNl() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='nl'" }} />
      <LangProvider initial="nl">
        <Portfolio />
      </LangProvider>
    </>
  );
}
