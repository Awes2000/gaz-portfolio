import type { Metadata } from "next";
import { LangProvider } from "@/components/LangProvider";
import { Portfolio } from "@/components/Portfolio";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { en: "/", nl: "/nl", "x-default": "/" },
  },
};

export default function Page() {
  return (
    <LangProvider initial="en">
      <Portfolio />
    </LangProvider>
  );
}
