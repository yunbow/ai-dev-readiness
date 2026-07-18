import { useTranslation } from "react-i18next";
import type { AxisScore } from "@/domain/assessment/types";
import { AXIS_LABELS } from "@/domain/assessment/questions";

const displayScore = (value: number) => Math.round(value * 10) / 10;

export function ScoreBars({ scores }: { scores: AxisScore[] }) {
  const { t } = useTranslation();
  return <div className="space-y-4">{scores.map((score) => <div key={score.axis}><div className="mb-1.5 flex min-w-0 items-center justify-between gap-3 text-sm"><span className="min-w-0 truncate font-medium text-slate-700">{t(`axisLabels.${score.axis}`, AXIS_LABELS[score.axis])}</span><span className="shrink-0 tabular-nums text-muted-foreground">{displayScore(score.score)} / {score.maxScore}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-linear-to-r from-blue-600 to-cyan-400 transition-[width]" style={{ width: `${Math.round(score.ratio * 100)}%` }} /></div></div>)}</div>;
}
