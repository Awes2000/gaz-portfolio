"use client";

import type { JSX } from "react";
import { useLang } from "@/components/LangProvider";
import type { I18nKey } from "@/lib/i18n";

interface TProps {
  k: I18nKey;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

/**
 * Translated text leaf. Replaces the static build's data-i18n DOM
 * walker: the dictionary strings (which may contain markup, exactly
 * as authored) are injected as innerHTML, and the leaf re-renders
 * when the language changes. Server components stay server — only
 * these leaves are client. Dictionary values are our own trusted
 * strings, never user input.
 */
export function T({ k, as: Tag = "span", className }: TProps) {
  const { t } = useLang();
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: t(k) }} />;
}
