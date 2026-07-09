import { Suspense } from "react";
import { About } from "@/components/About";
import { CaseFiles } from "@/components/CaseFiles";
import { CommandPalette } from "@/components/CommandPalette";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Hud } from "@/components/Hud";
import { SonarCanvas } from "@/components/SonarCanvas";
import { ScannerCursor } from "@/components/ScannerCursor";
import { Shell } from "@/components/Shell";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TerminalGate } from "@/components/TerminalGate";

/* Server component shared by / (en) and /nl. All real content is
   server-rendered HTML in the route's language; the terminal gate
   is a client overlay on top of it, not a content wall — SEO and
   screen readers see the full page without JS.

   Suspense boundaries let React 19 hydrate below-the-fold sections
   selectively (smaller main-thread tasks, lower TBT) without
   changing the server-rendered output. */
export function Portfolio() {
  return (
    <>
      <SmoothScroll />
      <SonarCanvas />
      <ScannerCursor />
      <TerminalGate />
      <Hud />
      <main id="app">
        <Hero />
        <Suspense>
          <About />
        </Suspense>
        <Suspense>
          <CaseFiles />
        </Suspense>
        <Suspense>
          <Contact />
          <Footer />
        </Suspense>
      </main>
      <Suspense>
        <Shell />
        <CommandPalette />
      </Suspense>
    </>
  );
}
