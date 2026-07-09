/* ============================================================
   DOCKED TERMINAL command outputs, ported verbatim from
   js/shell.js. All strings are our own authored HTML.
   ============================================================ */

export const OUT: Record<string, () => string[]> = {
  help: () => [
    "COMMANDS",
    '  <span class="ok">whoami</span>          about me',
    '  <span class="ok">ls</span>              list sections',
    '  <span class="ok">top</span>             what i\'m focused on',
    '  <span class="ok">cv</span>              download my resume',
    '  <span class="ok">contact</span>         reach me',
    '  <span class="ok">now</span>             what i\'m on right now',
    '  <span class="ok">neofetch</span>        system summary',
    '  <span class="ok">sfx</span>             toggle UI sound',
    '  <span class="ok">logout</span>          end the session',
    '  <span class="ok">clear</span>           clear the screen',
    '  <span class="dim">some commands are hidden. go look.</span>',
  ],
  whoami: () => [
    "Gabriël Awes Zoretić. full-stack developer, front-end and design leaning.",
    'building toward <span class="ok">cybersecurity and cloud</span>. based in Amsterdam.',
    "<span class=\"dim\">Sep '26: Cyber Security &amp; Cloud duaal at HU + H2B IT Solutions.</span>",
  ],
  stack: () => [
    'build:   <span class="ok">Next.js · React · TypeScript · Node · Tailwind</span>',
    'data:    <span class="ok">Prisma · PostgreSQL · MongoDB · REST</span>',
    'ai:      <span class="warn">Claude Code · Claude Design · context engineering</span>',
    'secure:  <span class="dim">Linux · networking · cloud infra · hardening (learning)</span>',
  ],
  now: () => [
    '<span class="ok">// now</span> (updated May 2026)',
    "Prepping for the Cyber Security &amp; Cloud duaal at HU.",
    "Building Next.js side projects and learning Linux daily.",
    "Open to freelance front-end and good conversations.",
  ],
  contact: () => [
    'email     <span class="ok">aweszoretic@hotmail.nl</span>',
    'github    <span class="ok">github.com/Awes2000</span>',
    'linkedin  <span class="ok">/in/gabriël-awes-z</span>',
    '<span class="dim">&gt; say hello any time.</span>',
  ],
  neofetch: () => [
    '<span class="ok">guest</span>@<span class="ok">gabriel-os</span>',
    "-----------------",
    "OS        gabriel-os v4.0 (navy/steel)",
    "Host      Amsterdam, NL",
    "Shell     /bin/sh · ⌘K",
    "Uptime    coding since 2022",
    "Stack     Next.js · TypeScript · Node",
    "Focus     cybersecurity · cloud · Linux",
  ],
};

export function lsProjectsShell(): string[] {
  return [
    "total 4",
    'drwx <span class="dim">CF-00</span>  flurter            <span class="ok">★ featured</span>',
    'drwx <span class="dim">CF-01</span>  property-pulse',
    'drwx <span class="dim">CF-02</span>  prostore',
    'drwx <span class="dim">CF-03</span>  colorpicker',
    '<span class="dim">tip: scroll to ~/projects or run</span> <span class="ok">cd projects</span>',
  ];
}

export function topProcesses(): string[] {
  const procs: Array<[string, number]> = [
    ["cybersecurity_cloud", 38], ["linux_engineering", 22], ["nextjs_builds", 16],
    ["devsecops_grc", 9], ["ai_orchestration", 8], ["music_production", 4], ["kernel_sleep", 3],
  ];
  const out = [
    "  PID  PROCESS                CPU%  STATE",
    '<span class="dim">  ───────────────────────────────────────</span>',
  ];
  procs.forEach((p, i) => {
    const cpu = Math.max(1, p[1] + (Math.random() * 6 - 3)).toFixed(1);
    const state = i < 3 ? '<span class="ok">RUN</span>' : '<span class="dim">idle</span>';
    out.push("  " + String(1000 + i * 7).padStart(4) + "  " + p[0].padEnd(22) + String(cpu).padStart(5) + "  " + state);
  });
  return out;
}

export const ROOT_LINES = [
  '<span class="ok">&gt; root access granted.</span>',
  "&gt; off the clock: i make music, drum &amp; bass to hyperpop. i lift.",
  "&gt; and i lead prayer for me and mine. faith first, then everything else.",
  '<span class="dim">&gt; thanks for digging this deep.</span>',
];

export const SECTION_PATHS: Record<string, string> = {
  hero: "~",
  about: "~/about",
  projects: "~/projects",
  contact: "~/contact",
};
