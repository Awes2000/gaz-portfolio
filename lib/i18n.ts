/* ============================================================
   I18N — EN / NL dictionary, ported 1:1 from js/i18n.js.
   Single source of truth for translatable copy. Strings are
   byte-identical to the static build; values may contain HTML.
   ============================================================ */

export type Lang = "en" | "nl";

export type I18nKey = keyof typeof DICT;

export const DICT = {
  /* nav */
  "nav.about": { en: "About", nl: "Over mij" },
  "nav.projects": { en: "Projects", nl: "Projecten" },
  "nav.contact": { en: "Contact", nl: "Contact" },
  "nav.resume": { en: "Resume", nl: "CV" },

  /* hero */
  "hero.kicker": { en: "Full-stack developer · Next.js · moving into cybersecurity &amp; cloud", nl: "Full-stack developer · Next.js · op weg naar cybersecurity &amp; cloud" },
  "hero.type": { en: "I build clean, fast web apps and I'm learning to secure them.",
    nl: "Ik bouw strakke, snelle webapps en ik leer ze te beveiligen." },
  "hero.featured": { en: "★ FEATURED", nl: "★ UITGELICHT" },
  "hero.flutter": { en: "Flurter · live app", nl: "Flurter · live app" },
  "hero.viewwork": { en: "View work", nl: "Bekijk werk" },
  "hero.viewgh": { en: "GitHub", nl: "GitHub" },

  /* hero card */
  "hc.role": { en: "full-stack dev", nl: "full-stack dev" },
  "hc.focus": { en: "cybersec · cloud · Linux", nl: "cybersec · cloud · Linux" },
  "hc.status": { en: "employed + enrolled", nl: "in dienst + ingeschreven" },

  /* about */
  "about.title": { en: "About &amp; status", nl: "Over mij &amp; status" },
  "about.p1": { en: "I'm a full-stack developer who plans and orchestrates: clean design, fluid interfaces, and software that does what the client actually asked for. I start by getting concrete with people about what they want, then I architect it and build toward that, not around it.",
    nl: "Ik ben een full-stack developer die plant en orkestreert: strak design, soepele interfaces en software die doet wat de klant echt heeft gevraagd. Ik begin door met mensen concreet te krijgen wat ze willen, daarna architectureer ik het en bouw ik daarnaartoe, niet eromheen." },
  "about.p2": { en: "I learned the craft by hand. My first years were straight programming, things like a color picker and a text-based minigame I wrote <b>from scratch in Python</b>. Projects I'm still fond of, because they're where the fundamentals stuck. Over my later years AI became a core part of how I work, and because I know what's underneath, I use it as an <b>architect rather than a crutch</b>: I understand the system first, then orchestrate the build.",
    nl: "Ik heb het vak met de hand geleerd. Mijn eerste jaren waren puur programmeren, dingen als een colorpicker en een tekstgebaseerde minigame die ik <b>vanaf nul in Python</b> schreef. Projecten waar ik nog steeds aan gehecht ben, omdat daar de fundamenten zijn blijven hangen. In de jaren daarna werd AI een kernonderdeel van hoe ik werk, en omdat ik weet wat eronder zit, gebruik ik het als <b>architect in plaats van als kruk</b>: ik begrijp eerst het systeem en orkestreer dan de bouw." },
  "about.p3": { en: "I'm a perfectionist by nature. That shows up most in the design and in the value I deliver: I don't ship something that feels half-considered.",
    nl: "Ik ben van nature een perfectionist. Dat zie je vooral terug in het design en in de waarde die ik lever: ik lever niets op dat half doordacht voelt." },
  "about.p4": { en: "From September 2026 I start the 4-year HBO-ICT <b>Cyber Security &amp; Cloud</b> duaal at Hogeschool Utrecht while working at <b>H2B IT Solutions</b>, on the operations side. The goal is to be the developer who ships and understands what happens after deploy. Growing toward Linux, Cloud Security, DevSecOps and GRC.",
    nl: "Vanaf september 2026 start ik de 4-jarige HBO-ICT <b>Cyber Security &amp; Cloud</b> duaal aan de Hogeschool Utrecht, terwijl ik werk bij <b>H2B IT Solutions</b>, aan de operationele kant. Het doel is de developer zijn die levert en begrijpt wat er na deploy gebeurt. Doorgroeien richting Linux, Cloud Security, DevSecOps en GRC." },
  "about.p5": { en: "Three languages: <b>Dutch</b> (native), <b>English</b> (fluent), <b>Serbo-Croatian</b> (conversational).",
    nl: "Drie talen: <b>Nederlands</b> (moedertaal), <b>Engels</b> (vloeiend), <b>Servo-Kroatisch</b> (conversatie)." },

  /* skills */
  "skills.cmd": { en: '<span class="sk-ps">guest@gabriel-os:~/skills$</span> ls -la',
    nl: '<span class="sk-ps">guest@gabriel-os:~/skills$</span> ls -la' },
  "skills.confident": { en: "confident", nl: "vertrouwd" },
  "skills.functional": { en: "functional", nl: "functioneel" },
  "skills.fluent": { en: "fluent", nl: "vloeiend" },
  "skills.learning": { en: "learning", nl: "aan het leren" },
  "interests.label": { en: "// interests", nl: "// interesses" },

  /* telemetry */
  "tele.head": { en: "system_status.live", nl: "systeem_status.live" },
  "tele.k.status": { en: "STATUS", nl: "STATUS" },
  "tele.v.status": { en: "employed + enrolled", nl: "in dienst + ingeschreven" },
  "tele.k.employed": { en: "EMPLOYED", nl: "WERK" },
  "tele.v.employed": { en: "H2B IT Solutions (operations)", nl: "H2B IT Solutions (operations)" },
  "tele.k.enrolled": { en: "ENROLLED", nl: "STUDIE" },
  "tele.v.enrolled": { en: "Cyber Security &amp; Cloud at HU (duaal '26→'30)", nl: "Cyber Security &amp; Cloud, HU (duaal sep '26 tot '30)" },
  "tele.k.stack": { en: "STACK", nl: "STACK" },
  "tele.v.stack": { en: "Next.js · TypeScript · Node · clean design", nl: "Next.js · TypeScript · Node · clean design" },
  "tele.k.focus": { en: "FOCUS", nl: "FOCUS" },
  "tele.v.focus": { en: "cybersecurity · cloud · Linux · DevSecOps · GRC", nl: "cybersecurity · cloud · Linux · DevSecOps · GRC" },
  "tele.k.open": { en: "OPEN_TO", nl: "OPEN_VOOR" },
  "tele.v.open": { en: "freelance front-end · collabs · good convos", nl: "freelance front-end · samenwerkingen · goede gesprekken" },
  "tele.k.time": { en: "LOCAL_TIME", nl: "LOKALE_TIJD" },
  "tele.k.since": { en: "CODING_SINCE", nl: "CODEERT_SINDS" },

  /* projects */
  "projects.title": { en: "Case files", nl: "Dossiers" },
  "case.cta": { en: "▸ open case file", nl: "▸ open dossier" },

  /* contact */
  "contact.secnum": { en: "03.", nl: "03." },
  "contact.sectitle": { en: "What's next?", nl: "Wat nu?" },
  "contact.kicker": { en: "guest@gabriel-os:~$ ./open-to-work", nl: "guest@gabriel-os:~$ ./open-voor-werk" },
  "contact.title": { en: "Let's build<br />something.", nl: "Laten we iets<br />bouwen." },
  "contact.copy": { en: "Open to freelance front-end, collaborations, and good conversations. Always up for talking shop about Next.js, security or cloud. If that's a fit, say hello.",
    nl: "Open voor freelance front-end, samenwerkingen en goede gesprekken. Altijd in voor praten over Next.js, security of cloud. Als dat past, zeg gerust hallo." },
  "contact.cta": { en: '<span class="cc-ps">&gt;</span> establish_connection<span class="cc-cursor">█</span>',
    nl: '<span class="cc-ps">&gt;</span> verbinding_maken<span class="cc-cursor">█</span>' },
  "contact.copybtn": { en: "copy aweszoretic@hotmail.nl", nl: "kopieer aweszoretic@hotmail.nl" },

  /* footer — the year is rendered by React (see Footer.tsx), so no
     empty #year span to fill; this is just the tail line */
  "footer.builtline": { en: "built and secured in Amsterdam", nl: "gebouwd en beveiligd in Amsterdam" },
  "footer.egg": { en: "psst, type <b>help</b> in the terminal gate ↻", nl: "psst, typ <b>help</b> in de terminal-gate ↻" },
  "footer.session": { en: '<span class="fs-ps">&gt;</span> session active &nbsp;<span class="fs-ps">&gt;</span> <span id="foot-session-txt">connection secure</span><span class="fs-cursor">█</span>',
    nl: '<span class="fs-ps">&gt;</span> sessie actief &nbsp;<span class="fs-ps">&gt;</span> <span id="foot-session-txt">verbinding beveiligd</span><span class="fs-cursor">█</span>' },
  "footer.replay": { en: "↻ replay intro", nl: "↻ intro opnieuw" },

  /* gate (static UI) */
  "gate.skip": { en: "skip intro →", nl: "intro overslaan →" },
  "gate.hint": { en: "press <b>ENTER</b> to unlock&nbsp; ·&nbsp; type <b>help</b>&nbsp; ·&nbsp; esc to skip",
    nl: "druk op <b>ENTER</b> om te ontgrendelen&nbsp; ·&nbsp; typ <b>help</b>&nbsp; ·&nbsp; esc om over te slaan" },
  "gate.unlock": { en: "▶ UNLOCK", nl: "▶ ONTGRENDEL" },
} as const satisfies Record<string, { en: string; nl: string }>;

/** Resolve a key for a language, falling back to English. */
export function translate(key: I18nKey, lang: Lang): string {
  const entry = DICT[key];
  return entry[lang] ?? entry.en;
}

export const SESSION_LANG_KEY = "aws_lang";
