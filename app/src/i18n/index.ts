import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import ja from "./locales/ja.json";
import en from "./locales/en.json";
import zhCN from "./locales/zh-CN.json";
import ko from "./locales/ko.json";
import es from "./locales/es.json";

export const SUPPORTED_LANGUAGES = ["ja", "en", "zh-CN", "ko", "es"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
      "zh-CN": { translation: zhCN },
      ko: { translation: ko },
      es: { translation: es },
    },
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: STORAGE_KEYS.language,
      convertDetectedLanguage: (lng) => {
        const base = lng.split("-")[0].toLowerCase();
        if (base === "zh") return "zh-CN";
        return (SUPPORTED_LANGUAGES as readonly string[]).includes(base) ? base : lng;
      },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
