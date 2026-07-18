import { useTranslation } from "react-i18next";
import { ES, JP, KR, US, CN } from "country-flag-icons/react/3x2";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n";

const FLAGS: Record<SupportedLanguage, typeof JP> = {
  ja: JP,
  en: US,
  "zh-CN": CN,
  ko: KR,
  es: ES,
};

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = (SUPPORTED_LANGUAGES as readonly string[]).includes(i18n.language)
    ? (i18n.language as SupportedLanguage)
    : "ja";

  return (
    <Select value={current} onValueChange={(value) => void i18n.changeLanguage(value)}>
      <SelectTrigger
        aria-label={t("common.languageSwitcherLabel")}
        size="sm"
        className="gap-1.5 border-none bg-transparent px-2 shadow-none hover:bg-accent"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const Flag = FLAGS[lang];
          return (
            <SelectItem key={lang} value={lang}>
              <Flag className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover ring-1 ring-black/10" />
              {t(`languages.${lang}`)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
