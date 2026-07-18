import type { SupportedLanguage } from "@/i18n";

const DATE_LOCALES: Record<SupportedLanguage, string> = {
  ja: "ja-JP",
  en: "en-US",
  "zh-CN": "zh-CN",
  ko: "ko-KR",
  es: "es-ES",
};

export const dateLocaleFor = (language: string): string => DATE_LOCALES[language as SupportedLanguage] ?? "ja-JP";
