"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type I18nKey, type Lang, SESSION_LANG_KEY, translate } from "@/lib/i18n";
import { readSessionValue, writeSessionValue } from "@/lib/hooks/useSessionFlag";
import { LANG_EVENT } from "@/lib/bus";
import { sfx } from "@/lib/sfx";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: I18nKey) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => translate(key, "en"),
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Always render EN on the server so SSR and hydration match;
  // the stored session language is adopted right after mount.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = readSessionValue(SESSION_LANG_KEY);
    if (stored === "nl" || stored === "en") {
      setLangState(stored);
      document.documentElement.setAttribute("lang", stored);
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    if (l !== "en" && l !== "nl") return;
    setLangState((prev) => {
      if (l === prev) return prev;
      writeSessionValue(SESSION_LANG_KEY, l);
      document.documentElement.setAttribute("lang", l);
      window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang: l } }));
      sfx.click();
      return l;
    });
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t: (key) => translate(key, lang) }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
