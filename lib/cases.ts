/* ============================================================
   CASE FILES — data ported 1:1 from the CASES array in js/app.js.
   Copy is byte-identical; asset paths point at public/.
   ============================================================ */

export interface CaseShot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Short, silent, looped screen capture (h264 .mp4 + poster). Plays
 *  on pointer-enter / focus; static poster on touch + reduced motion.
 *  Drop files in /public and fill these to replace placeholders. */
export interface CaseVideo {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
}

export interface CaseLinks {
  github?: string;
  live?: string;
  gallery?: string;
}

export interface CaseMeta {
  role: string;
  year: string;
  stack: string;
  status: string;
}

/** Optional structured case-study sections (Problem / Approach /
 *  Key decisions / Result). Only rendered when filled in — no
 *  generated filler copy. */
export interface CaseSections {
  problem?: string;
  approach?: string;
  decisions?: string;
  result?: string;
}

export interface CaseFile {
  feature?: boolean;
  id: string;
  slug: string;
  cls: string;
  title: string;
  tech: string[];
  desc: string;
  detail: string;
  meta: CaseMeta;
  links: CaseLinks;
  media?: string;
  mediaUrl?: string;
  shots?: CaseShot[];
  video?: CaseVideo;
  sections?: CaseSections;
}

export const CASES: CaseFile[] = [
  {
    feature: true,
    id: "CF-00 // PRIORITY",
    slug: "flurter",
    cls: "CLASSIFIED",
    title: "Flurter",
    tech: ["Flutter", "Dart", "Riverpod", "go_router", "ML Kit OCR"],
    desc: "AIxWings team graduation project: an AI-powered study app for students, shipped as an installable PWA. I owned the app architecture, theming and design system, and shipped 5 screens.",
    detail: "A team graduation project under the AIxWings org, commissioned by a teacher (the client) who is now pitching it for funding. An AI-powered study app: focus sessions, task planning with AI quiz generation, camera text scanning (ML Kit OCR) and a leaderboard. I owned the app architecture and MVC structure, routing and navigation, the theming and design system, and shipped 5 screens. Built in Flutter with Riverpod, go_router and Dio against our own backend.",
    meta: { role: "Architecture · theming · 5 screens", year: "2025–2026", stack: "Flutter · Dart · Riverpod", status: "Live · installable PWA" },
    links: { live: "https://app.aixwings.nl/" },
    media: "FLUTTER · PWA",
    mediaUrl: "app.aixwings.nl · graduation project",
    shots: [
      { src: "/flutter-focus.jpg", alt: "Focus timer screen with pomodoro sessions", width: 480, height: 870 },
      { src: "/flutter-home.jpg", alt: "Home screen with week planner and study plan", width: 480, height: 865 },
      { src: "/flutter-taken.jpg", alt: "Tasks screen with AI quiz generation", width: 480, height: 868 },
    ],
    sections: {
      problem:
        "Students needed one place to plan, focus and test themselves. The client, a teacher, commissioned an AI-powered study app his students would actually open every day, and it had to ship as a team graduation project on a fixed timeline.",
      approach:
        "Built as a team under the AIxWings org. I owned the app architecture and MVC structure, routing and navigation, and the theming and design system, and I shipped 5 of the screens against our own backend, wired up with Dio.",
      decisions:
        "Flutter with Riverpod for state and go_router for navigation kept the architecture predictable while the feature set grew: focus sessions, task planning with AI quiz generation, camera text scanning with ML Kit OCR and a leaderboard. Shipping as an installable PWA meant zero store friction.",
      result:
        "Live at app.aixwings.nl as an installable PWA, and the client is now pitching it for funding.",
    },
  },
  {
    id: "CF-01",
    slug: "property-pulse",
    cls: "CLASSIFIED",
    title: "Property Pulse",
    tech: ["Next.js 16", "MongoDB", "Mapbox", "Cloudinary", "OAuth"],
    desc: "A property rental listing platform: image uploads, interactive maps and Google sign-in.",
    detail: "A full-stack property rental platform built with Next.js 16 and MongoDB. Listings with Cloudinary image uploads, interactive Mapbox maps, a PhotoSwipe gallery, bookmarking and messaging, with Google OAuth via NextAuth. A real end-to-end product: data model, API routes and a polished front end.",
    meta: { role: "Full-stack developer", year: "2025", stack: "Next.js · MongoDB · Mapbox", status: "Live on Vercel" },
    links: { github: "https://github.com/Awes2000/property-pulse-nextjs", live: "https://property-pulse-nextjs-phi.vercel.app/" },
    shots: [
      { src: "/pp-home.jpg", alt: "Property Pulse home page with property search", width: 1440, height: 900 },
      { src: "/pp-listings.jpg", alt: "Property Pulse listings with rental properties", width: 1440, height: 900 },
    ],
    sections: {
      problem:
        "A rental platform lives or dies on how fast people can browse listings and how easily owners can publish them. The goal was a real end-to-end product, not a demo: data model, API routes and a polished front end.",
      approach:
        "Full-stack on Next.js 16 with MongoDB. Listings take Cloudinary image uploads, browsing gets interactive Mapbox maps and a PhotoSwipe gallery, and users get bookmarking and messaging behind Google OAuth via NextAuth.",
      decisions:
        "Keeping the whole product in one Next.js codebase, with the API routes living next to the UI, kept the data model honest and the iteration loop short.",
      result: "Live on Vercel as a working rental platform.",
    },
  },
  {
    id: "CF-02",
    slug: "prostore",
    cls: "CLASSIFIED",
    title: "ProStore",
    tech: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "NextAuth"],
    desc: "A full-stack e-commerce store with a typed data layer, auth and an admin dashboard.",
    detail: "A full-stack e-commerce store built with Next.js 16, TypeScript and Prisma against a Neon PostgreSQL database, with NextAuth v5 for auth. Product catalogue, cart and checkout flow, order history and a Recharts admin dashboard, with Radix UI and Tailwind on the front. The project where the back end and the front end finally met for me.",
    meta: { role: "Full-stack developer", year: "2025", stack: "Next.js · TypeScript · Prisma", status: "Live on Vercel" },
    links: { github: "https://github.com/Awes2000/prostore", live: "https://prostore-tau-eight.vercel.app/" },
    shots: [
      { src: "/prostore-home.jpg", alt: "ProStore storefront with featured products", width: 1440, height: 900 },
      { src: "/prostore-catalog.jpg", alt: "ProStore catalogue with search and filters", width: 1440, height: 900 },
    ],
    sections: {
      problem:
        "E-commerce is where typed data pays off: products, carts, orders and the admin view all have to agree with each other. The goal was a full store with an admin side, not just a storefront.",
      approach:
        "Next.js 16 with TypeScript and Prisma against a Neon PostgreSQL database, with NextAuth v5 for auth. Product catalogue, cart and checkout flow, order history and a Recharts admin dashboard, with Radix UI and Tailwind on the front.",
      decisions:
        "A typed data layer end to end: the Prisma models drive both the API and the UI, so a schema change breaks the build instead of breaking production.",
      result: "Live on Vercel. The project where the back end and the front end finally met for me.",
    },
  },
  {
    id: "CF-03",
    slug: "colorpicker",
    cls: "CLASSIFIED",
    title: "Colorpicker",
    tech: ["JavaScript", "OOP", "SCSS"],
    desc: "A browser-based HSL palette generator: 99 random swatches, click any one to copy its value.",
    detail: "Generates 99 random HSL swatches on load; click any one to copy its value to the clipboard and the page title updates to match. Built with three ES6 classes (HSLGenerator, ColorList, ColorCard) and styled in SCSS. This is where object-oriented JavaScript clicked for me: structure, encapsulation and code that scales past one file.",
    meta: { role: "Front-end developer", year: "2023", stack: "JS (ES6 classes) · SCSS", status: "Live demo" },
    links: { github: "https://github.com/Awes2000/colorpicker", live: "https://28003.hosts2.ma-cloud.nl/colorpicker/index.html" },
    shots: [{ src: "/colorpicker-grid.jpg", alt: "Colorpicker grid of 99 random HSL swatches", width: 1440, height: 900 }],
    sections: {
      problem:
        "A small tool with a sharp spec: generate 99 random HSL swatches on load, click any one to copy its value to the clipboard, and keep the code clean enough to grow.",
      approach:
        "Three ES6 classes split the responsibilities: HSLGenerator makes the colors, ColorList owns the collection, ColorCard renders each swatch and handles the copy click. Styled in SCSS, with the page title updating to the copied value.",
      decisions:
        "No framework on purpose. Handling state, rendering and events by hand is where object-oriented JavaScript clicked for me: structure, encapsulation and code that scales past one file.",
      result: "The live demo is still up, and the fundamentals from this build carry into everything after it.",
    },
  },
];
