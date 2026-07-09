import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SonarCanvas } from "@/components/SonarCanvas";
import { ScannerCursor } from "@/components/ScannerCursor";
import { CASES } from "@/lib/cases";
import { SITE_URL } from "@/lib/siteUrl";

interface WorkParams {
  slug: string;
}

export function generateStaticParams(): WorkParams[] {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<WorkParams> }): Promise<Metadata> {
  const { slug } = await params;
  const c = CASES.find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: `${c.title} · Case file · Gabriël Awes Zoretić`,
    description: c.desc,
    alternates: { canonical: `/work/${c.slug}` },
    openGraph: {
      type: "article",
      title: `${c.title} · Case file`,
      description: c.desc,
      images: [{ url: c.shots?.[0]?.src ?? "/og-card.jpg" }],
    },
  };
}

/* deep links must load readable — clear any locked state before paint */
const UNLOCK_SCRIPT = `try{var h=document.documentElement;h.classList.remove('locked');h.classList.add('unlocked');}catch(e){}`;

const SECTION_LABELS: Array<[keyof NonNullable<(typeof CASES)[number]["sections"]>, string]> = [
  ["problem", "PROBLEM"],
  ["approach", "APPROACH"],
  ["decisions", "KEY DECISIONS"],
  ["result", "RESULT"],
];

export default async function WorkPage({ params }: { params: Promise<WorkParams> }) {
  const { slug } = await params;
  const idx = CASES.findIndex((x) => x.slug === slug);
  if (idx === -1) notFound();
  const c = CASES[idx];
  const next = CASES[(idx + 1) % CASES.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: c.title,
    description: c.desc,
    url: `${SITE_URL}/work/${c.slug}`,
    dateCreated: c.meta.year,
    keywords: c.tech.join(", "),
    author: { "@id": `${SITE_URL}/#gabriel` },
    ...(c.links.github ? { codeRepository: c.links.github } : {}),
  };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: UNLOCK_SCRIPT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SonarCanvas />
      <ScannerCursor />
      <main id="app" className="work-page">
        <div className="wrap work-wrap">
          <nav className="work-top" aria-label="Case file navigation">
            <Link className="link-mono" href="/#projects">
              ↩ cd ~/projects
            </Link>
            <span className="work-declass">{"// DECLASSIFIED"}</span>
          </nav>

          <header className="work-head">
            <span className="case-id">{c.id}</span>
            <h1 className="work-title">{c.title}</h1>
            {c.tag && <span className="case-tag">{c.tag}</span>}
            <p className="work-desc">{c.desc}</p>
            <ul className="case-tech" aria-label="Technology">
              {c.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </header>

          <div className="detail-meta work-meta">
            <div><div className="k">Role</div><div className="v">{c.meta.role}</div></div>
            <div><div className="k">Year</div><div className="v">{c.meta.year}</div></div>
            <div><div className="k">Stack</div><div className="v">{c.meta.stack}</div></div>
            <div><div className="k">Status</div><div className="v">{c.meta.status}</div></div>
          </div>

          <section className="work-brief" aria-label="Briefing">
            <h2 className="work-sec-label">{"// BRIEFING"}</h2>
            <p>{c.detail}</p>
          </section>

          {c.sections &&
            SECTION_LABELS.map(([key, label]) =>
              c.sections?.[key] ? (
                <section key={key} className="work-brief">
                  <h2 className="work-sec-label">{`// ${label}`}</h2>
                  <p>{c.sections[key]}</p>
                </section>
              ) : null,
            )}

          {c.shots && (
            <section className="work-gallery" aria-label="Field media">
              <h2 className="work-sec-label">{"// FIELD MEDIA"}</h2>
              <div className="detail-shots">
                {c.shots.map((s) => (
                  <Image key={s.src} src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 680px) 30vw, 240px" />
                ))}
              </div>
            </section>
          )}

          <div className="detail-actions work-actions">
            {c.links.live && (
              <a className="btn-ghost" href={c.links.live} target="_blank" rel="noopener noreferrer">
                Open live ↗
              </a>
            )}
            {c.links.github && (
              <a className="link-mono" href={c.links.github} target="_blank" rel="noopener noreferrer">
                {"</>"} source on GitHub
              </a>
            )}
          </div>

          <footer className="work-next">
            <Link className="link-mono" href={`/work/${next.slug}`}>
              next case → {next.id} {next.title}
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}
