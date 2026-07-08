import { Rise, ScrambleNum, ScrambleTitle, Wipe } from "@/components/motion/InView";
import { T } from "@/components/T";
import { Telemetry } from "@/components/Telemetry";

/* Server component: all copy is server-rendered. Interactive leaves
   (i18n text, telemetry, reveals) are small client children. */

const SKILLS = [
  {
    cls: "cap",
    perm: "drwxr-xr-x",
    name: "building/",
    stKey: "skills.confident" as const,
    items: ["Next.js", "React", "JavaScript ES6+", "HTML5", "SCSS / CSS3", "Tailwind", "UI/UX", "Git / GitHub", "Vercel"],
  },
  {
    cls: "cap",
    perm: "drwxr-xr-x",
    name: "working/",
    stKey: "skills.functional" as const,
    items: ["TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL", "MongoDB", "REST APIs", "PHP / Laravel", "Docker"],
  },
  {
    cls: "cap ai",
    perm: "drwx--x--x",
    name: "ai-native/",
    stKey: "skills.fluent" as const,
    items: ["Claude Code", "Claude Design", "context engineering", "GPT (imagery)", "Google AI Stitch", "architect-first orchestration"],
  },
  {
    cls: "cap learning",
    perm: "drw-------",
    name: "securing/",
    stKey: "skills.learning" as const,
    items: ["Linux", "Networking", "Cloud infra", "Hardening", "Scripting", "CompTIA / Google Cybersecurity"],
  },
];

const INTERESTS = [
  "Cybersecurity", "Cloud", "Linux", "DevSecOps", "GRC",
  "AI tooling & automation", "SaaS systems", "clean design", "entrepreneurship",
];

export function About() {
  return (
    <Wipe id="about">
      <div className="wrap">
        <Rise className="sec-label">
          <ScrambleNum value="01." />
          <ScrambleTitle k="about.title" />
          <span className="sec-rule" />
        </Rise>
        <div className="about-grid">
          <Rise className="about-copy" index={1}>
            <T k="about.p1" as="p" className="lead" />
            <T k="about.p2" as="p" />
            <T k="about.p3" as="p" />
            <T k="about.p4" as="p" />
            <T k="about.p5" as="p" />

            <div className="skills-cmd">
              <span className="sk-ps">guest@gabriel-os:~/skills$</span> ls -la
            </div>
            <div className="cap-grid">
              {SKILLS.map((cap) => (
                <div key={cap.name} className={cap.cls}>
                  <h4>
                    <span className="cap-perm">{cap.perm}</span> <span className="cap-name">{cap.name}</span>{" "}
                    <T k={cap.stKey} className="st" />
                  </h4>
                  <ul>
                    {cap.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Rise className="interests" index={2}>
              <T k="interests.label" className="interests-label" />
              <ul>
                {INTERESTS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Rise>
          </Rise>

          <Rise as="aside" index={3}>
            <div className="portrait">
              {/* eslint-disable-next-line @next/next/no-img-element -- ported 1:1; CSS sizes it */}
              <img src="/headshot.jpg" alt="Gabriël Awes Zoretić" />
              <span className="pframe" />
              <span className="scanline" />
              <span className="ptag">SUBJECT: G. AWES ZORETIĆ</span>
            </div>
            <Telemetry />
          </Rise>
        </div>
      </div>
    </Wipe>
  );
}
