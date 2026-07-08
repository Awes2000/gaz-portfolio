# AWES Portfolio → $10k Tier · Critical Review + Next.js Rebuild Prompt

*Reviewed from the actual code (Portfolio.html + js/*). This is a critique against the "$10k website" bar from the Nick Saraev video — where the leap is **static scroll page → experience** — packaged as a build spec for the Next.js rebuild.*

---

## VERDICT

The current site is already ~**$7–8k** work. The concept is coherent, the motion is tasteful, accessibility is genuinely handled, and there are premium touches most portfolios never reach (View Transitions morph, magnetic cursor, live telemetry, EN/NL i18n). It does **not** need a redesign.

What keeps it *under* the $10k line is four things: it's still fundamentally a **scroll-through page** rather than an **experience**; the **hero has no single unforgettable visual**; **three of four projects show "decrypting" placeholders instead of real work**; and there are **no deep case-study pages** to prove depth. The Next.js rebuild is the right moment to fix all four.

---

## WHAT'S ALREADY PREMIUM (keep, port 1:1)

Don't rebuild these from scratch — they're the identity and they're good:
- The **"Secure System" concept**: boot gate → `sudo access-portfolio` → HUD dossier world.
- Navy `#0A192F` + mint `#64FFDA` + slate tokens; Roboto Slab / Roboto Mono / Inter.
- **Skills as file-permissions** (`drwxr-xr-x building/`…) and the **`system_status.live` telemetry** panel (live clock, ping spark, coding-since counter).
- **Case files** dossier styling + **declassify-on-hover** + **View-Transition detail morph**.
- **Scanner cursor** + magnetic elements, HUD hide-on-scroll, hidden shell (`type help`), footer truths easter egg.
- **Accessibility discipline**: `prefers-reduced-motion` fallbacks everywhere, keyboard paths, ARIA. Carry this over unchanged — it's a mark of the tier, not an afterthought.

---

## THE CRITIQUE — what's holding it at ~$8k (ranked)

**1. It's a scroll page, not an experience.** The video's whole thesis: $10k sites *move from static scroll to experiences*. Right now motion is almost all "reveal on scroll" (IntersectionObserver `.in`). Nothing is **scroll-driven** or **scene-based**. There's no moment where the visitor feels they're *inside a system* rather than reading a page. → Add one scroll-scrubbed / pinned scene and real page-to-page transitions.

**2. The hero has no signature visual.** The background is a gradient + ripple canvas — pleasant, but it's wallpaper. The video's standout sites all had *one* screenshot-worthy hero moment (particle swarm, shader, reactive field). Your hero leans on the typewriter + terminal card, which every dev portfolio has. → Build one GPU-backed hero visual that is unmistakably *yours*.

**3. 75% of the work is hidden behind placeholders.** Only Flurter has real shots; Property Pulse, ProStore, and Colorpicker render `PREVIEW · decrypting…`. A $10k site *shows the work* — the "classified" gag is costing you the exact proof a client needs. → Real screenshots + short autoplay-on-hover screen-capture loops for all four.

**4. No case-study depth.** Everything lives in one modal. Serious clients want to see *how you think*: problem → approach → decisions → result. Single-page also means no deep-linkable URLs for sharing/SEO/ads. → Real `/work/[slug]` case-study routes (the Next.js rebuild makes this free).

**5. No proof / outcomes.** There are no metrics, no testimonial, no "commissioned by / now pitched for funding" pulled forward (that Flurter detail is buried in body text — it's your strongest trust signal). → Surface outcomes and one quote.

**6. Typography is safe.** Roboto Slab is solid but expected. The video praised *novel, interesting font styles*. A more distinctive variable display face (with subtle weight/optical-size motion on the hero) would push perceived craft. → Consider a characterful variable display font; animate its axes once, on the hero.

**7. Concept is decorative, not structural.** The "secure system" theme dresses standard sections (About/Projects/Contact). At $10k the concept *drives the IA*: recon → dossier → establish connection, with the terminal as a real navigation affordance, not just an easter egg. → Let the metaphor structure the journey.

---

## THE $10k UPGRADE MOVES (concrete, in priority order)

1. **Signature hero scene (WebGL).** A subtle GPU particle/shader field that reacts to cursor + scroll and *resolves into something* — e.g. a point-cloud that settles into a constellation/monogram, or a scanline field that "locks on" as the gate unlocks. React Three Fiber (`@react-three/fiber` + `drei`) or a raw shader plane. Keep it dark, low-chroma, 60fps, `prefers-reduced-motion` → static poster frame.
2. **Show real work.** Capture 8–15s silent screen recordings of Property Pulse, ProStore, Colorpicker (and Flurter). Autoplay-on-hover, muted, `playsInline`, poster image, lazy — via `next/image` posters + `<video>`. Kill every "decrypting" placeholder.
3. **Real case-study pages** `/work/[slug]`: hero capture, the dossier metadata rail you already have, then Problem / Approach / Key decisions / Result, gallery, "next case" link. SSG via `generateStaticParams`. Deep-linkable + SEO'd.
4. **One scroll-driven scene.** Pin the hero and scrub the WebGL/telemetry as the visitor scrolls the first viewport (Framer Motion `useScroll` or Lenis + GSAP ScrollTrigger). One is enough — don't scroll-jack the whole page.
5. **Cinematic page transitions.** Route-change curtain wipe in the brand language (a "re-auth / decrypting next file" beat), content settling with blur→sharp. Respect reduced-motion.
6. **Proof layer.** A slim trust strip (commissioned graduation project now pitched for funding · live on Vercel · installable PWA) + one pulled-forward quote if you can get one from the AIxWings teacher/client.
7. **Distinctive type moment.** Variable display font on the hero name with a one-time axis animation; keep Roboto Mono for the terminal/data voice.
8. **Sound design, tastefully.** You already scaffolded audio — wire *real* subtle UI ticks on unlock/hover/case-open (off by default, remembered). It's a disproportionate premium signal.

**You do NOT need Higgsfield or any paid image/video tool for any of this.** Everything above is CSS, Canvas/WebGL (R3F), SVG, `next/video`, and your own screen recordings.

---

## NEXT.JS REBUILD — ARCHITECTURE

- **Next.js (App Router) + TypeScript**, deploy on **Vercel**.
- **Tailwind** via config (tokens as CSS vars + theme extend) — not CDN. Port the exact brand tokens.
- **Fonts:** `next/font` self-hosted — Roboto Mono + Inter, plus the chosen variable display face. No FOUT.
- **Motion:** Framer Motion for UI/route transitions; **React Three Fiber** for the hero scene; optional **Lenis** for smooth scroll. All gated behind `prefers-reduced-motion` + `(hover:hover)`.
- **Content model:** typed `Project` objects (port the existing `CASES` array verbatim — it's already clean) in TS/MDX now, CMS-ready later. Case-study bodies as MDX.
- **Routes:** `/` · `/work` · `/work/[slug]` (SSG) · keep About/Contact as sections or split out.
- **i18n:** `next-intl` — port every EN/NL string from `js/i18n.js`. Do not drop NL.
- **Perf targets:** Lighthouse mobile 90+, LCP < 2.5s, ~0 CLS. WebGL lazy + paused offscreen; videos lazy with posters.
- **SEO:** `next/metadata` per route, OG/Twitter (assets exist), JSON-LD `Person` + per-project `CreativeWork`, sitemap, robots.

---

## MASTER BUILD PROMPT (paste into Claude/Fable inside the Next.js repo)

> You are rebuilding an already-strong developer portfolio in **Next.js (App Router) + TypeScript**, and taking it from ~$8k craft to a **$10k experience**. A complete prior build exists (single `Portfolio.html` + vanilla JS modules) — **port its identity, copy, real project data, and interactions faithfully**, then execute the upgrades below at far higher craft. The leap you are making is **static scroll page → experience**.
>
> **Keep 1:1:** the "Secure System" concept (boot gate → `sudo access-portfolio` → HUD dossier); brand tokens navy `#0A192F` / mint `#64FFDA` / slate `#CCD6F6`,`#A8B2D1`; Roboto Mono + Inter; skills-as-file-permissions; the `system_status.live` telemetry panel (live Amsterdam clock, ping spark, coding-since-2021 counter); case-file dossier styling with declassify-on-hover and the detail morph; scanner cursor + magnetic elements; hidden shell (`type help`); EN/NL i18n (port every string — never drop Dutch); and the full `prefers-reduced-motion` / keyboard / ARIA accessibility discipline.
>
> **Real content (do not invent):** Gabriël Awes Zoretić — full-stack dev (Next.js) in Amsterdam, coding since 2021, employed at H2B IT Solutions, starting HBO-ICT Cyber Security & Cloud duaal at Hogeschool Utrecht Sept 2026. Projects: **Flurter** (featured — Flutter/Dart/Riverpod AI study app, graduation project commissioned by a teacher now pitched for funding, live installable PWA), **Property Pulse** (Next.js/MongoDB/Mapbox, live on Vercel), **ProStore** (Next.js/TS/Prisma, live on Vercel), **Colorpicker** (ES6 OOP/SCSS, 2023). Use the real GitHub/live links from the existing `CASES` array.
>
> **Upgrades to build (this is where you raise the craft — use full creative freedom):**
> 1. A **signature WebGL hero scene** (React Three Fiber) — a subtle cursor+scroll-reactive particle/shader field that *resolves* as the gate unlocks (e.g. point-cloud settling into a monogram/constellation). Dark, low-chroma, 60fps; reduced-motion → static poster.
> 2. **Show the real work** — replace every "decrypting" placeholder with real screenshots + autoplay-on-hover muted screen-capture video (posters, lazy, `playsInline`).
> 3. **Deep-linkable case-study pages** `/work/[slug]` (SSG): capture hero → dossier metadata rail → Problem / Approach / Key decisions / Result → gallery → next-case link.
> 4. **One scroll-driven pinned hero scene** (Framer Motion `useScroll` or Lenis+GSAP) — scrub the WebGL/telemetry through the first viewport. Do not scroll-jack the rest.
> 5. **Cinematic route transitions** in-concept (a brief "re-auth / decrypting next file" curtain; content settles blur→sharp). Reduced-motion safe.
> 6. A slim **proof strip** (commissioned graduation project now pitched for funding · live on Vercel · installable PWA) and one pulled-forward client quote if provided.
> 7. A **distinctive variable display font** on the hero name with a one-time axis animation; keep Roboto Mono as the data/terminal voice.
> 8. Tasteful **UI sound** on unlock/hover/case-open — off by default, preference remembered.
>
> **Stack:** Next.js App Router + TS, Tailwind (config, not CDN), `next/font` self-hosted, Framer Motion, React Three Fiber, `next-intl`, deploy Vercel. Typed `Project` model (port the existing array), MDX case bodies.
>
> **Guardrails:** don't abandon the Secure-System identity or palette; don't fabricate projects/credentials; don't drop NL; keep reduced-motion/keyboard first-class; no CDN Tailwind; Lighthouse mobile 90+, LCP < 2.5s, ~0 CLS (WebGL + video lazy, paused offscreen); the concept must never cost usability — work and contact reachable in 5 seconds.
>
> **Workflow:** you have full creative freedom within this identity. Do **at least 3 iteration passes**, each raising the craft. **Verify your own work** — open it (Chrome DevTools MCP or preview), click every route, trigger the gate, test reduced-motion + mobile + EN↔NL + the hidden shell — and fix what you find before reporting done. Work autonomously; make the aesthetic calls yourself. Make the first three seconds unforgettable, then make the visitor hit `> establish_connection`.

---

### One honest caveat
I reviewed the **code**, not a live render, so the pixel-level polish (spacing rhythm, color balance in motion) I can't fully judge from here. If you want, connect me to the running site (or drop a few screenshots) and I'll do a second, visual pass — spacing, contrast-in-motion, and hero composition specifically.
