import { RootShell } from "@/components/RootShell";
import { baseMetadata, baseViewport } from "@/lib/metadata";
import "../globals.css";

export const metadata = baseMetadata;
export const viewport = baseViewport;

/* English root layout — serves <html lang="en">. Covers the home
   page and the /work/[slug] case files. */
export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
