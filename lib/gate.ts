/* ============================================================
   TERMINAL GATE content — greeting, fortunes, POST sequence and
   command outputs, ported verbatim from js/boot.js. All strings
   are our own authored HTML.
   ============================================================ */

import { amsHour } from "@/lib/hooks/useAmsterdamClock";

export function greeting(nl: boolean): string {
  const h = amsHour();
  if (h >= 5 && h < 12) return nl ? "goedemorgen. koffie staat klaar." : "good morning. coffee's on.";
  if (h >= 12 && h < 18) return nl ? "goedemiddag." : "good afternoon.";
  if (h >= 18 && h < 23) return nl ? "goedenavond." : "good evening.";
  return nl ? "laat nog op? respect." : "late night session? respect.";
}

const FORTUNES_EN = [
  "ship it, then secure it.",
  "read the system before you change it.",
  "built from scratch beats bought off the shelf.",
  "production is just staging with consequences.",
  "most days i learn more than i break. most.",
  "curiosity is the whole job.",
  "soli deo gloria.",
  "coffee compiling...",
];
const FORTUNES_NL = [
  "lever het op, beveilig het daarna.",
  "lees het systeem voordat je het verandert.",
  "zelf bouwen wint van kant-en-klaar.",
  "productie is gewoon staging met gevolgen.",
  "de meeste dagen leer ik meer dan ik stuk maak. meestal.",
  "nieuwsgierigheid is de hele baan.",
  "soli deo gloria.",
  "koffie aan het compilen...",
];

export function pickFortune(nl: boolean): string {
  const list = nl ? FORTUNES_NL : FORTUNES_EN;
  return list[(Math.random() * list.length) | 0];
}

export type PostLine = [html: string, cls: string, delay: number];

/* The greeting and fortune are intentionally NOT in the boot log:
   the greeting lands next to the prompt once boot completes, and the
   fortune sits below the prompt (see TerminalGate / GateScreen), so
   the POST reads as a clean tension build to AUTH REQUIRED. */
export function buildPost(nl: boolean): PostLine[] {
  return nl
    ? [
        ["> gabriel-os v4.0 opstarten...", "dim", 120],
        ['> mounten: full-stack <span class="ok">[ok]</span>', "", 360],
        ['> mounten: front-end + design <span class="ok">[ok]</span>', "", 540],
        ['> module: cybersecurity_cloud <span class="warn">[laden...]</span>', "", 740],
        ['> <span class="warn">WAARSCHUWING:</span> portfolio is <span class="crit">GEHEIM</span>', "", 960],
        ['> <span class="grant">AUTHENTICATIE VEREIST</span>', "", 1160],
      ]
    : [
        ["> gabriel-os v4.0 booting...", "dim", 120],
        ['> mounting: full-stack <span class="ok">[ok]</span>', "", 360],
        ['> mounting: front-end + design <span class="ok">[ok]</span>', "", 540],
        ['> module: cybersecurity_cloud <span class="warn">[loading...]</span>', "", 740],
        ['> <span class="warn">WARNING:</span> portfolio is <span class="crit">CLASSIFIED</span>', "", 960],
        ['> <span class="grant">AUTH REQUIRED</span>', "", 1160],
      ];
}

export const GATE_COMMANDS: Record<string, () => string[]> = {
  help() {
    return [
      "available commands:",
      '  <span class="ok">whoami</span>        about me',
      '  <span class="ok">ls</span>            list sections',
      '  <span class="ok">cv</span>            download my resume',
      '  <span class="ok">contact</span>       reach me',
      '  <span class="ok">sudo access-portfolio</span>  <span class="grant">decrypt &amp; enter</span>',
      '  <span class="dim">(or just press ENTER to unlock)</span>',
    ];
  },
  whoami() {
    return [
      "Gabriël Awes Zoretić. full-stack developer, front-end and design leaning.",
      'building toward <span class="ok">cybersecurity and cloud</span>. based in Amsterdam.',
      "<span class=\"dim\">Sep '26: Cyber Security &amp; Cloud duaal @ HU + H2B IT Solutions.</span>",
    ];
  },
  contact() {
    return [
      'email     <span class="ok">aweszoretic@hotmail.nl</span>',
      'github    <span class="ok">github.com/Awes2000</span>',
      'linkedin  <span class="ok">/in/gabriël-awes-z</span>',
      '<span class="dim">&gt; say hello any time.</span>',
    ];
  },
};

export function lsProjects(): string[] {
  return [
    'drwx <span class="dim">CF-00</span>  flurter            <span class="ok">★ featured</span>',
    'drwx <span class="dim">CF-01</span>  property-pulse',
    'drwx <span class="dim">CF-02</span>  prostore',
    'drwx <span class="dim">CF-03</span>  colorpicker',
  ];
}

export const RESUME_PATH = "/files/awes_resume_updated.pdf";
export const UNLOCK_KEY = "aws_unlocked";
