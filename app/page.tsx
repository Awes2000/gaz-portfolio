import { About } from "@/components/About";
import { CaseFiles } from "@/components/CaseFiles";
import { CommandPalette } from "@/components/CommandPalette";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Hud } from "@/components/Hud";
import { RippleCanvas } from "@/components/RippleCanvas";
import { ScannerCursor } from "@/components/ScannerCursor";
import { Shell } from "@/components/Shell";
import { TerminalGate } from "@/components/TerminalGate";

/* Server component. All real content below is server-rendered HTML;
   the terminal gate is a client overlay on top of it, not a content
   wall — SEO and screen readers see the full page without JS. */
export default function Page() {
  return (
    <>
      <RippleCanvas />
      <ScannerCursor />
      <TerminalGate />
      <Hud />
      <main id="app">
        <Hero />
        <About />
        <CaseFiles />
        <Contact />
        <Footer />
      </main>
      <Shell />
      <CommandPalette />
    </>
  );
}
