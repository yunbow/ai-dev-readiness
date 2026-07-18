import { useTranslation } from "react-i18next";
import type { ProfileQuestion, Question } from "@/domain/assessment/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Item = ProfileQuestion | Question;

export function QuestionCard({ item, value, onChange }: { item: Item; value?: string; onChange: (value: string) => void }) {
  const { t } = useTranslation();
  const isScored = "axis" in item;
  const category = isScored ? t("questionCard.categoryScored") : t("questionCard.categoryProfile");
  const namespace = isScored ? "questions" : "profileQuestions";
  const text = t(`${namespace}.${item.id}.text`, item.text);
  const rawDescription = "description" in item ? item.description : undefined;
  const description = rawDescription ? t(`questions.${item.id}.description`, rawDescription) : undefined;
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <p className="text-xs font-semibold tracking-[0.16em] text-blue-700">{category}</p>
    <h1 className="mt-3 text-xl font-semibold leading-8 tracking-tight text-slate-950 sm:text-2xl">{text}</h1>
    {description && <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>}
    <RadioGroup key={item.id} value={value ?? ""} onValueChange={onChange} className="mt-7 gap-3">
      {item.options.map((option, index) => {
        const selected = value === option.value;
        const label = t(`${namespace}.${item.id}.options.${option.value}`, option.label);
        return <label key={option.value} htmlFor={`${item.id}-${option.value}`} className={`group flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${selected ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"}`}>
          <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${selected ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-500"}`}>{index + 1}</span>
          <RadioGroupItem id={`${item.id}-${option.value}`} value={option.value} className="sr-only" />
          <span className={`text-sm leading-6 sm:text-base ${selected ? "font-medium text-blue-950" : "text-slate-700"}`}>{label}</span>
        </label>;
      })}
    </RadioGroup>
    <p className="mt-5 text-xs text-muted-foreground">{t("assessment.keyboardHint")}</p>
  </section>;
}
