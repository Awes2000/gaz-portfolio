import { CASES } from "@/lib/cases";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Structured data (JSON-LD) for rich results and entity understanding.
 * Server-rendered into <head> so crawlers get Person + ProfilePage +
 * each project as a CreativeWork without executing JS.
 */

const PERSON = {
  "@type": "Person",
  "@id": `${SITE_URL}/#gabriel`,
  name: "Gabriël Awes Zoretić",
  alternateName: "Awes",
  jobTitle: "Full-stack developer",
  description:
    "Full-stack developer in Amsterdam with a front-end and design edge. Next.js-focused, moving into cybersecurity, cloud and Linux.",
  url: SITE_URL,
  image: `${SITE_URL}/headshot.jpg`,
  email: "mailto:aweszoretic@hotmail.nl",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Amsterdam",
    addressCountry: "NL",
  },
  knowsLanguage: ["nl", "en", "sh"],
  knowsAbout: [
    "Next.js",
    "TypeScript",
    "React",
    "Full-stack web development",
    "Front-end design",
    "Cybersecurity",
    "Cloud",
    "Linux",
  ],
  sameAs: ["https://github.com/Awes2000"],
  worksFor: { "@type": "Organization", name: "H2B IT Solutions" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Hogeschool Utrecht" },
};

function projectWorks() {
  return CASES.map((c) => ({
    "@type": "CreativeWork",
    name: c.title,
    description: c.desc,
    url: c.links.live ?? c.links.github,
    dateCreated: c.meta.year,
    keywords: c.tech.join(", "),
    author: { "@id": `${SITE_URL}/#gabriel` },
    ...(c.links.github ? { codeRepository: c.links.github } : {}),
  }));
}

export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      PERSON,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Gabriël Awes Zoretić · Portfolio",
        inLanguage: ["en", "nl"],
        publisher: { "@id": `${SITE_URL}/#gabriel` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        mainEntity: { "@id": `${SITE_URL}/#gabriel` },
        about: { "@id": `${SITE_URL}/#gabriel` },
        hasPart: projectWorks(),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
