import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { Answers, ProfileQuestion, Question } from "@/domain/assessment/types";
import type { HistoryRecord } from "@/domain/history/types";
import { AXIS_LABELS, PROFILE_QUESTIONS, applicableQuestions } from "@/domain/assessment/questions";
import { RECOMMENDATIONS } from "@/domain/assessment/recommendations";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AXES = ["document", "process", "qa", "ai", "project"] as const;
type Tone = "good" | "warn" | "unknown" | "neutral";

function rowProps(item: Question | ProfileQuestion, answers: Answers, t: TFunction): { text: string; label: string; tone: Tone; comment?: string } | null {
  if (!("axis" in item)) {
    const option = item.options.find((o) => o.value === answers[item.id]);
    if (!option) return null;
    return { text: t(`profileQuestions.${item.id}.text`, item.text), label: t(`profileQuestions.${item.id}.options.${option.value}`, option.label), tone: "neutral" };
  }
  const option = item.options.find((o) => o.value === answers[item.id]);
  if (!option) return null;
  const tone: Tone = option.isUnknown ? "unknown" : option.coefficient === 1 ? "good" : option.coefficient === 0 ? "warn" : "neutral";
  const recommendation = RECOMMENDATIONS.find((r) => r.relatedQuestionIds.includes(item.id));
  const comment = option.isUnknown
    ? t("answers.unknownComment")
    : option.coefficient === 1
      ? t(`questions.${item.id}.strengthText`, item.strengthText)
      : recommendation
        ? t(`recommendations.${recommendation.id}.description`, recommendation.description)
        : undefined;
  return { text: t(`questions.${item.id}.text`, item.text), label: t(`questions.${item.id}.options.${option.value}`, option.label), tone, comment };
}

function AnswerRow({ text, label, tone, comment }: { text: string; label: string; tone: Tone; comment?: string }) {
  const variant = tone === "good" ? "default" : tone === "warn" ? "destructive" : tone === "unknown" ? "outline" : "secondary";
  return <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="font-medium text-slate-900">{text}</p><Badge className="mt-2" variant={variant}>{label}</Badge>{comment && <p className="mt-2 text-sm leading-6 text-muted-foreground">{comment}</p>}</div>;
}

export function AnswerList({ record }: { record: HistoryRecord }) {
  const { t } = useTranslation();
  const shown = applicableQuestions(record.tier, record.answers);
  const groups: [string, string, (Question | ProfileQuestion)[]][] = [
    ["profile", t("answers.groupProfile"), PROFILE_QUESTIONS],
    ...AXES.map((axis): [string, string, (Question | ProfileQuestion)[]] => [axis, t(`axisLabels.${axis}`, AXIS_LABELS[axis]), shown.filter((q) => q.axis === axis)]),
  ];
  return <Accordion type="multiple" defaultValue={groups.map(([id]) => id)} className="space-y-3">
    {groups.filter(([, , items]) => items.length > 0).map(([id, title, items]) => <AccordionItem key={id} value={id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4">
      <AccordionTrigger className="gap-3 text-left"><span className="font-semibold text-slate-950">{title}</span><Badge variant="secondary">{t("common.questionCountUnit", { count: items.length })}</Badge></AccordionTrigger>
      <AccordionContent className="space-y-3">{items.map((item) => { const props = rowProps(item, record.answers, t); return props && <AnswerRow key={item.id} {...props} />; })}</AccordionContent>
    </AccordionItem>)}
  </Accordion>;
}
