"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { type I18nKey, type Lang, translate } from "@/lib/i18n";
import { langStore } from "@/lib/langStore";
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
  /* server snapshot is always EN; the stored session language is
     adopted right after hydration via the external store */
  const lang = useSyncExternalStore(langStore.subscribe, langStore.getSnapshot, langStore.getServerSnapshot);

  /* sync the document language + notify non-React listeners */
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang } }));
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    if (l === langStore.getSnapshot()) return;
    langStore.set(l);
    sfx.click();
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
