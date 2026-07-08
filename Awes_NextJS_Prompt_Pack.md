# AWES Portfolio (Next.js) — Re-analysis + Prompt Pack

*Based on a full read of the rebuilt repo (Next.js 16 · React 19 · Tailwind 4 · Motion). Each prompt below is paste-ready for your coding agent and references your real files. Do them in order — SEO first (fast, high value), then the experience-tier upgrades.*

---

## RE-ANALYSIS SCORECARD (rebuild vs the $10k checklist)

**Landed well (keep):**
- Clean App-Router componentization; content is **server-rendered** (crawlers/SR see the full page — the gate is an overlay, not a wall). Strong.
- **RippleCanvas upgraded to a real WebGL fragment shader** (domain-warped fbm) — a genuine craft jump over the old gradient.
- `next/font` self-hosting, `next/image` on the portrait with priority, Suspense boundaries for lower TBT, reduced-motion respected throughout.
- Heading hierarchy is sane: one `<h1>` (hero), `<h2>` section titles, `<h3>` case titles, `<h4>` skills.

**Still missing vs the $10k plan:**
- ❌ **No case-study routes** — still a single `page.tsx`; no `/work/[slug]`, so no deep-linkable dossiers.
- ❌ **No real project media** — only Flurter has screenshots; Property Pulse / ProStore / Colorpicker still render placeholders. No hover-play video.
- ❌ **No signature hero "resolve" moment** or scroll-driven scene — motion is still reveal-on-scroll; the shader is ambient background, not a hero payoff.
- ❌ **No route/page transitions**, no proof/outcomes layer.

**SEO gaps found (technical audit):**
- ❌ No `sitemap.ts`, no `robots.ts` (crawl directives + sitemap URL missing).
- ❌ No **JSON-LD** structured data (Person / ProfilePage / CreativeWork) → no rich-result eligibility.
- ❌ No **canonical** (`alternates.canonical`).
- ⚠️ `metadataBase` falls back to `http://localhost:3000` unless `NEXT_PUBLIC_SITE_URL` is set in Vercel — OG/Twitter/canonical URLs break in prod until it is.
- ⚠️ **i18n is client-only** (LangProvider) → crawlers only ever see English. Dutch content is invisible to search. Real hreflang needs localized routes/params, not just a client toggle.
- ⚠️ Title is `· Secure System` (on-brand but zero keyword value). For name + "freelance front-end developer Amsterdam" ranking, lead with role/location.
- ✅ Good already: OG + Twitter tags with sized image, themeColor, server-rendered copy, semantic `<main>`.

---

## PROMPT 1 — SEO infrastructure (do first · ~30 min)

```
In this Next.js App Router repo, add technical SEO without changing any visual output.

1. Create app/robots.ts (MetadataRoute.Robots): allow all, reference `${SITE_URL}/sitemap.xml`,
   set host. Read SITE_URL from process.env.NEXT_PUBLIC_SITE_URL with a localhost fallback.
2. Create app/sitemap.ts (MetadataRoute.Sitemap): the root URL for now, monthly/priority 1.
   Leave a comment to map /work/[slug] from lib/cases.ts once those routes exist.
3. Create components/JsonLd.tsx — a server component rendering <script type="application/ld+json">
   with a @graph containing:
   - Person (@id #gabriel): name "Gabriël Awes Zoretić", alternateName "Awes",
     jobTitle "Full-stack developer", address Amsterdam/NL, email aweszoretic@hotmail.nl,
     knowsLanguage [nl,en,sh], knowsAbout [Next.js, TypeScript, React, cybersecurity, cloud, Linux],
     sameAs ["https://github.com/Awes2000"], worksFor "H2B IT Solutions",
     alumniOf "Hogeschool Utrecht", image /headshot.jpg.
   - WebSite (@id #website) inLanguage [en,nl], publisher → #gabriel.
   - ProfilePage mainEntity → #gabriel, hasPart: map lib/cases.ts CASES to CreativeWork
     (name, description=desc, url=live??github, dateCreated=meta.year, keywords=tech.join,
      author → #gabriel, codeRepository=github when present).
   Render <JsonLd/> inside <head> in app/layout.tsx.
4. In app/layout.tsx metadata: add `alternates: { canonical: "/" }` and change the title to
   "Gabriël Awes Zoretić · Full-stack developer, Amsterdam".
5. Confirm NEXT_PUBLIC_SITE_URL is documented in .env.example and must be set in Vercel prod.

Validate the JSON-LD mentally against schema.org and Google Rich Results. Don't alter styling.
```

*(Heads-up: I already scaffolded `app/robots.ts`, `app/sitemap.ts`, and `components/JsonLd.tsx` in your folder as a reference — `JsonLd` is not yet imported into `layout.tsx`. Your agent can wire it in or regenerate from this prompt.)*

---

## PROMPT 2 — Make Dutch content indexable (SEO · i18n)

```
i18n is currently client-only (LangProvider), so search engines only see English and the
Dutch half of the site is invisible. Without breaking the current UX toggle, make NL crawlable:
either (a) add locale-segmented routes /en and /nl (or a ?lang param that SSR-renders the chosen
locale), OR (b) at minimum output hreflang alternates and server-render NL copy for a /nl path.
Set metadata.alternates.languages accordingly. Keep the client toggle as a fast in-page switch,
but ensure each language has a server-rendered, canonical, hreflang-linked URL.
```

---

## PROMPT 3 — Deep-linkable case-study routes (`/work/[slug]`)

```
Add real, deep-linkable case-study pages so each project is its own SEO'd URL.

- Add a `slug` to each CaseFile in lib/cases.ts (flurter, property-pulse, prostore, colorpicker).
- Create app/work/[slug]/page.tsx as a Server Component with generateStaticParams() over CASES
  and generateMetadata() per project (title, description=desc, canonical, OG image).
- Layout: capture/hero, then the existing dossier metadata rail (role/year/stack/status),
  then sections — Problem / Approach / Key decisions / Result — sourced from `detail` split into
  MDX or structured fields, then gallery, then a "next case →" link.
- Keep the "Case files" grid on the homepage, but make each card link to /work/[slug]
  (keep the quick-view morph as an optional enhancement, not the only path).
- Add per-project CreativeWork JSON-LD on each page and add these URLs to app/sitemap.ts.
Match the existing Secure-System visual language exactly (tokens, mono labels, scan lines).
```

---

## PROMPT 4 — Show the real work (hover-play media)

```
Three of four projects show placeholder previews. Replace them with real proof.

- For Property Pulse, ProStore, Colorpicker: add real screenshots to /public and short (8–15s),
  silent, muted, looped screen-capture videos (h264 .mp4 + poster .jpg).
- In components/CaseCard.tsx, render a <video muted loop playsInline preload="none" poster=...>
  that plays on pointer-enter / focus and pauses on leave; static poster for touch + reduced-motion.
- Lazy-load below the fold; keep locked aspect ratios (zero CLS). Kill every "decrypting…" placeholder.
Keep the declassify-on-hover reveal, just put real footage underneath it.
```

---

## PROMPT 5 — Signature hero payoff + one scroll scene

```
Elevate the hero from "ambient shader + typewriter" to a memorable moment, staying in-concept.

- On gate unlock (ACCESS_EVENT), have the WebGL field *resolve*: e.g. particles/scanlines converge
  into a monogram/constellation or a "lock-on" that snaps as access is granted. Reduced-motion →
  static poster frame, no animation.
- Add ONE scroll-driven beat only (Motion useScroll or Lenis): pin the hero for ~1 viewport and
  scrub the shader intensity + telemetry boot-in as the user scrolls, then release. Do not scroll-jack
  the rest of the page. Cap parallax on mobile; honor prefers-reduced-motion.
Keep 60fps; pause the canvas when offscreen (IntersectionObserver).
```

---

## PROMPT 6 — Cinematic route transitions + proof layer

```
1. Add in-concept route transitions using Motion (AnimatePresence / template.tsx): a brief
   "re-authenticating / decrypting next file" curtain in the brand language, content settling
   blur→sharp. Must be reduced-motion safe (opacity-only fallback) and not delay LCP on first load.
2. Add a slim proof strip near the top: "commissioned graduation project, now pitched for funding ·
   live on Vercel · installable PWA" — pull the strongest Flurter trust signal out of body text.
   Leave a slot for one client quote (AIxWings teacher) when available.
```

---

## PROMPT 7 — Accessibility pass (WCAG 2.1 AA)

```
Run an a11y pass on the rebuilt portfolio and fix issues without changing the design:
- Verify AA contrast for mint #64FFDA and slate #A8B2D1 on navy #0A192F in EVERY state
  (including muted/meta text and mono labels on photo overlays); darken tokens if any fail.
- Ensure the terminal gate is fully keyboard-operable and focus-trapped while open, with an
  obvious skip path; the hidden shell and command palette need visible focus + ESC to close.
- Confirm all <video>/canvas decorative layers are aria-hidden; project media has captions/labels.
- Every interactive element: visible focus-visible ring, real aria-labels on icon-only buttons,
  and the custom cursor never removes the native focus outline.
- Re-verify prefers-reduced-motion kills parallax, scramble, typewriter, curtain, and shader motion.
Report anything that can't be fixed purely in CSS/markup.
```

---

## PROMPT 8 — Design polish pass (visual craft)

```
Do a senior design-critique pass on the rebuilt portfolio focused on the $10k bar:
- Typographic rhythm: consistent modular scale, tighter hero tracking, and one distinctive variable
  display face for the hero name (keep Roboto Mono as the data voice). Animate the display axis once.
- Spacing system: audit section padding + vertical rhythm for a consistent scale; kill one-off values.
- Hierarchy: make the primary CTA (establish_connection / email) unmistakably the loudest action
  on every viewport; ensure work + contact are reachable within 5 seconds.
- Restraint check: the mint accent should signal, not decorate — pull it back anywhere it's ambient.
Deliver concrete before/after changes, not general advice.
```

---

### Suggested order
1 (SEO infra) → 2 (NL indexable) → 3 (case routes) → 4 (real media) → 7 (a11y) → 5 (hero/scroll) → 6 (transitions/proof) → 8 (polish).

The first four are where the ranking + credibility gains live; 5–6 are the "experience" flex; 7–8 are the finish that reads as $10k.
```
