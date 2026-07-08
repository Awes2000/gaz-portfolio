import type { MetadataRoute } from "next";
import { CASES } from "@/lib/cases";
import { SITE_URL } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { en: SITE_URL, nl: `${SITE_URL}/nl` } },
    },
    {
      url: `${SITE_URL}/nl`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: { en: SITE_URL, nl: `${SITE_URL}/nl` } },
    },
    ...CASES.map((c) => ({
      url: `${SITE_URL}/work/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
