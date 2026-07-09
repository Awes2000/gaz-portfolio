import { RootShell } from "@/components/RootShell";
import { baseMetadata, baseViewport } from "@/lib/metadata";
import "../globals.css";

export const metadata = baseMetadata;
export const viewport = baseViewport;

/* Dutch root layout — serves <html lang="nl"> in the raw SSR HTML so
   the Dutch copy at /nl is correctly language-tagged for crawlers and
   assistive tech, not just after hydration. The page overrides the
   title/description/openGraph with Dutch copy. */
export default function NlRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="nl">{children}</RootShell>;
}
