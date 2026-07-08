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

interface LangProviderProps {
  /** Route-level default: "/" renders en, "/nl" renders nl on the server. */
  initial?: Lang;
  children: React.ReactNode;
}

export function LangProvider({ initial = "en", children }: LangProviderProps) {
  /* the server snapshot is the route's language, so each URL is
     crawlable in its own language; a session toggle wins on the client */
  const getSnapshot = useCallback((): Lang => langStore.getStored() ?? initial, [initial]);
  const getServerSnapshot = useCallback((): Lang => initial, [initial]);
  const lang = useSyncExternalStore(langStore.subscribe, getSnapshot, getServerSnapshot);

  /* sync the document language + notify non-React listeners */
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang } }));
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    if (l === (langStore.getStored() ?? initial)) return;
    langStore.set(l);
    sfx.click();
  }, [initial]);

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t: (key) => translate(key, lang) }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
