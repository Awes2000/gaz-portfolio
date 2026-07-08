# AWES — Portfolio Redesign · Master Build Prompt (Claude Design / Fable 5)

You are redesigning and rebuilding the **personal portfolio of Gabriël Awes Zoretić** — a full-stack developer in Amsterdam with a strong front-end and design edge, now moving into cybersecurity & cloud. This is not a template exercise. It should feel like a bespoke, award-tier developer portfolio — the kind that makes a visitor think *"I want this person on my project"* within the first 3 seconds, and that doubles as a flex of raw front-end craft.

**The one job of this site:** turn an impressed visitor into an inquiry — freelance front-end work, collaborations, or a good conversation. The secondary job: showcase creative/technical range so the site itself is the strongest project in the portfolio.

**Work from the existing build, then elevate it hard.** A complete "Secure System" terminal-concept site already exists (single `Portfolio.html` + modular vanilla JS). Keep the concept, the copy, the real project data, and the identity below — but re-execute at **far higher craft**. Don't throw the concept away; push it further than I would have.

---

## 1. WHO THIS IS FOR

**Name:** Gabriël Awes Zoretić — handle **"awes"**. Full-stack developer (Next.js-focused) based in **Amsterdam**. Coding since **2021**, largely self-taught by hand (early Python color picker + text minigame from scratch → later an AI-orchestrating architect who understands the system underneath).

**Current status:** Employed at **H2B IT Solutions** (operations side). From **September 2026** starts the 4-year HBO-ICT **Cyber Security & Cloud** duaal at **Hogeschool Utrecht**. Trajectory: the developer who ships *and* understands what happens after deploy — Linux, Cloud Security, DevSecOps, GRC.

**Character:** Perfectionist. Plans and orchestrates: clean design, fluid interfaces, software that does what the client actually asked for. Uses AI as an architect, not a crutch.

**Languages:** Dutch (native), English (fluent), Serbo-Croatian (conversational). **Site ships bilingual EN + NL** (i18n already exists — preserve and extend it; do not drop NL).

**Audience:** Potential freelance clients, collaborators, and hiring devs evaluating taste + competence in seconds. They contact via email.

---

## 2. CREATIVE DIRECTION — "Secure System" (evolve, don't replace)

A hacker-terminal / secure-system world: you arrive at a booting CRT terminal, "unlock" access, and drop into a HUD-framed portfolio. Confident, technical, cinematic — but **legible and fast**, never cosplay. The concept must read as *craft*, not gimmick.

**Locked brand tokens (keep these — they are the identity):**
- Navy base `#0A192F`, deeper panels `#112240` / `#0e1d36`
- Mint accent `#64FFDA` (+ glow `#00FFBF`); use with discipline — it's the single chromatic signal
- Slate text: headings `#CCD6F6`, body `#A8B2D1`; periwinkle `#97AFFE` as a secondary cool accent
- Fonts: **Roboto Slab** (display), **Roboto Mono** (terminal/labels/data), **Inter** (body/UI)
- Easing `cubic-bezier(.22,1,.36,1)`; max width ~1120px

**Keep these signature mechanics — but make each one more refined:**
- **Boot gate / CRT intro:** power-on sequence → `sudo access-portfolio` (or ENTER) to unlock. Keep the `skip intro`, sound toggle, and reduced-motion bypass. Make the boot feel like a real system coming up, not a loader.
- **Scanner cursor** (dot + reticle ring, blend-difference; brackets over "case files", magnetic pull on links) — desktop/hover only.
- **HUD header** nav: `01. About · 02. Projects · 03. Contact · 04. Resume`, ambient-audio + menu controls.
- **Hero:** name reveal + typed intro line + a live `guest@gabriel-os:~$` terminal card.
- **About & status:** skills as **file-permission directories** (`drwxr-xr-x building/`, `working/`, `ai-native/`, `securing/` with status tags) rendered via `ls -la`; plus the **`system_status.live` telemetry panel** (STATUS, EMPLOYED, ENROLLED, STACK, FOCUS, OPEN_TO, LOCAL_TIME, CODING_SINCE, LATENCY — live clock + ping spark).
- **Projects = "Case files"** (classified-dossier styling, `CF-01…`, real metadata rows).
- **Contact = "What's next?"** — `./open-to-work`, `> establish_connection` CTA, copy-email button.
- **Hidden shell / easter egg:** `type help` in the gate; keep a real interactive terminal. Reward the curious.
- **Atmosphere layer:** ripple/gradient canvas background, film grain, light sweep, optional CRT mode, screensaver, power-down. Keep it **soft** — never muddy, never seizure-inducing.

**Where to raise the craft (use your judgment — go beyond this list):**
- Sharper motion choreography (per-line mask reveals, section wipes, staggered telemetry boot-in).
- A genuinely memorable hero moment — the "insane creative illustration" flex. WebGL/Canvas/SVG is fair game (particle field, shader panel, data-stream, reactive grid). Make one hero-defining visual that people screenshot.
- More tactile case-file interactions (hover depth, scanline reveal, live-preview affordance).
- Micro-details: focus states, hover physics, sound design, loading choreography — the 1% stuff a perfectionist would obsess over.

---

## 3. REAL CONTENT (use this — do not invent projects)

**Case files (real projects, keep metadata honest):**
- **Flurter** — *Featured.* Architecture · theming · 5 screens · Flutter · Dart · Riverpod · **Live, installable PWA**.
- **Property Pulse** (`CF-01`) — Full-stack · 2025 · Next.js · MongoDB · Mapbox · **Live on Vercel**.
- **ProStore** (`CF-02`) — Full-stack · 2025 · Next.js · TypeScript · Prisma · **Live on Vercel**.
- **Colorpicker** (`CF-03`) — Front-end · 2023 · JS (ES6 classes) · SCSS · **Live demo**.

Each case file keeps its GitHub / live / gallery links, role, year, stack, and status. Preserve the existing About/Contact copy (EN + NL) — refine wording only if it clearly improves clarity or punch; keep the voice (confident, technical, a little dry-witty).

---

## 4. TECHNICAL REQUIREMENTS
- **Single polished build.** Match the current architecture: a clean, self-contained site — vanilla HTML/CSS/JS is perfect (no framework required). Keep JS modular and readable (boot, shell, cursor, ripple, i18n, sound, app).
- **No CDN Tailwind.** Hand-authored CSS with design tokens as CSS variables (already the pattern — keep it).
- **Fonts:** Roboto Slab + Roboto Mono + Inter (preconnect + display swap).
- **Bilingual EN/NL** via the existing i18n layer — every new string gets both languages.
- **Accessibility is non-negotiable:** full `prefers-reduced-motion` fallback (static, no CRT flicker), keyboard nav, visible focus states, ARIA on the gate/shell/controls, WCAG AA contrast on the navy palette (re-verify mint/slate). The cursor and heavy motion are **off on touch + reduced-motion**.
- **Performance:** target Lighthouse mobile 90+, LCP < 2.5s, ~0 CLS. Lazy-load below the fold, keep the boot lightweight, canvas effects throttled and paused when offscreen.
- **SEO:** per-page title/description, OG + Twitter card (assets exist), favicon (SVG monogram), semantic headings, one `<h1>`.
- **Mobile:** the terminal concept must degrade gracefully to a fast, tap-friendly experience — HUD → hamburger overlay, simplified atmosphere, native cursor.

---

## 5. WORKFLOW — HOW TO BUILD (get out of your own way)
1. **You have full creative freedom** within the identity above. The goal is not to follow a checklist — it's to make something that makes people stop. Where you see a chance to make it more impressive, take it.
2. **Do at least 3 iteration passes** before you call it done. After each build pass, go through the whole site with a fine-tooth comb: design problems, motion timing, contrast, mobile, dead ends, and opportunities to complexify/refine. Raise the craft each pass.
3. **Verify your own work.** Open the site (Chrome DevTools MCP or the desktop preview), click every route, trigger the boot gate, test reduced-motion, test mobile width, confirm EN↔NL switching and the hidden shell. Fix what you find before reporting done.
4. Work **autonomously** — don't stop to ask permission on aesthetic calls. Make the call, then show the result.

---

## 6. DO NOT (hard guardrails)
- ❌ Don't abandon the "Secure System" terminal identity or the locked navy/mint palette.
- ❌ Don't fabricate projects, employers, or credentials — the four case files and the bio facts above are the truth.
- ❌ Don't drop the Dutch translations or break i18n.
- ❌ Don't ship inaccessible motion — reduced-motion and keyboard users get a first-class experience.
- ❌ No CDN Tailwind, no heavyweight framework for a single static site, no layout shift.
- ❌ Don't let the concept override usability — if a visitor can't find the work or the contact in 5 seconds, it failed.
- ❌ Don't make it seizure-y, muddy, or slow. Cinematic ≠ heavy.

---

**Deliver:** a single, polished, bilingual, accessible portfolio that keeps the Secure-System soul but executes at a level that makes the site itself the flex. Make the first three seconds unforgettable — then make the visitor want to hit `> establish_connection`.

---

### Note on external asset tools (Higgsfield / paid image/video)
**Not required.** This build needs zero paid image or video generation. Every visual can be done with CSS, Canvas/WebGL, and SVG plus the existing local assets (headshot, project shots, OG card) and free Google Fonts. Only consider connecting Higgsfield later if you specifically want AI-generated video/imagery — and only on a paid plan. Skip it for now.
