import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, BarChart3, CircleAlert, ClipboardCheck, Lightbulb, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBars } from "@/components/charts/ScoreCharts";
import { Issues, StandardSections } from "@/components/result/ResultSections";
import { ShareActions } from "@/components/share/ShareActions";
import { diagnose } from "@/domain/assessment/diagnose";
import { QUESTIONS } from "@/domain/assessment/questions";
import type { HistoryRecord } from "@/domain/history/types";
import { getResult, saveResult } from "@/infrastructure/indexedDb";
import { loadLatestResultId, saveLatestResultId } from "@/infrastructure/localStorage";
import { QUESTION_VERSION, SCHEMA_VERSION, SCORING_VERSION } from "@/constants/versions";
import { dateLocaleFor } from "@/i18n/dateLocale";

export function ResultPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams(); const location = useLocation(); const navigate = useNavigate();
  const [record, setRecord] = useState<HistoryRecord | null>((location.state as { transient?: HistoryRecord } | null)?.transient ?? null);
  const [loaded, setLoaded] = useState(false);
  const scoreRef = useRef<HTMLDivElement>(null);
  const target = useMemo(() => id ?? loadLatestResultId(), [id]);
  useEffect(() => {
    if (!target) return;
    void getResult(target).then((value) => { setRecord((current) => current ?? value); setLoaded(true); });
  }, [target]);
  const ready = loaded || !target;
  if (!ready && !record) return <div className="py-16 text-center text-sm text-muted-foreground">{t("result.loading")}</div>;
  if (!record) return <EmptyResult />;
  const { result } = record; const unknowns = QUESTIONS.filter((question) => result.unknownQuestionIds.includes(question.id));
  const outdated = record.questionVersion !== QUESTION_VERSION || record.scoringVersion !== SCORING_VERSION;
  const band = (score: number) => score < 30 ? t("scoreBand.band1") : score < 50 ? t("scoreBand.band2") : score < 70 ? t("scoreBand.band3") : score < 85 ? t("scoreBand.band4") : t("scoreBand.band5");
  const reductionText = (reduction: { min: number; max: number }) => reduction.min === reduction.max ? t("common.percentSingle", { value: reduction.min }) : t("common.percentRange", { min: reduction.min, max: reduction.max });
  const repeat = async () => { const next: HistoryRecord = { ...record, id: crypto.randomUUID(), createdAt: new Date().toISOString(), result: diagnose({ tier: record.tier, answers: record.answers, profile: record.profile }), schemaVersion: SCHEMA_VERSION, questionVersion: QUESTION_VERSION, scoringVersion: SCORING_VERSION }; if (await saveResult(next)) { saveLatestResultId(next.id); navigate(`/result/${next.id}`); } };
  return <div className="mx-auto max-w-4xl space-y-12 py-5 sm:py-8">
    <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-950/10"><div className="grid lg:grid-cols-[1fr_0.85fr]"><div className="p-7 sm:p-10"><p className="text-xs font-semibold tracking-[0.18em] text-cyan-300">{t("result.eyebrow")}</p><h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{t("result.title")}</h1><p className="mt-3 max-w-lg leading-7 text-slate-300">{t("result.subtitle")}</p><div className="mt-7 flex flex-wrap items-center gap-3"><Badge className="border border-cyan-200/20 bg-cyan-300/15 px-3 py-1 text-cyan-100 hover:bg-cyan-300/15">{band(result.totalScore)}</Badge>{outdated && <Badge variant="secondary">{t("result.outdatedBadge")}</Badge>}</div><p className="mt-8 text-sm text-slate-400">{new Date(record.createdAt).toLocaleString(dateLocaleFor(i18n.language))} ・ {record.tier === "quick" ? t("common.tierQuick") : t("common.tierStandard")}</p></div><div ref={scoreRef} className="relative flex flex-col justify-center bg-linear-to-br from-blue-700 to-indigo-950 p-7 sm:p-10"><div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_70%_20%,white_0,transparent_35%)]" /><div className="relative"><p className="text-sm font-medium text-blue-100">{t("result.totalScoreLabel")}</p><p className="mt-2 text-7xl font-semibold tracking-[-0.06em]">{result.totalScore}<span className="ml-2 text-2xl tracking-normal text-blue-200">/ 100</span></p><div className="mt-6 border-t border-white/15 pt-5"><p className="text-lg font-semibold">{t("result.levelLabel", { level: result.level })}</p><p className="mt-1 text-sm text-blue-100">{t("result.reductionLabel")} <strong className="text-white">{reductionText(result.reduction)}</strong></p></div></div></div></div></section>
    <Alert className="border-blue-200 bg-blue-50 px-5 py-4"><Lightbulb className="size-4 text-blue-700" /><AlertDescription className="text-blue-950">{t("result.guidanceAlert")}</AlertDescription></Alert>
    {result.planningPhaseWarning && <Alert className="border-amber-200 bg-amber-50"><CircleAlert className="size-4 text-amber-700" /><AlertDescription className="text-amber-900">{t("result.planningPhaseWarning")}</AlertDescription></Alert>}
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><BarChart3 className="size-5" /></span><div><p className="text-xs font-semibold tracking-[0.16em] text-blue-700">{t("result.scoreBreakdownEyebrow")}</p><h2 className="mt-1 text-xl font-semibold text-slate-950">{t("result.scoreBreakdownTitle")}</h2></div></div><div className="mt-7"><ScoreBars scores={result.axisScores} /></div></section>
    {unknowns.length > 0 && <Alert className="border-slate-200 bg-slate-50"><ClipboardCheck className="size-4 text-slate-700" /><AlertDescription className="text-slate-700">{t("result.unknownAlert")}</AlertDescription></Alert>}
    <Issues result={result} count={record.tier === "quick" ? 3 : 5} />
    {record.tier === "standard" && <StandardSections result={result} />}
    <section className="rounded-3xl bg-slate-50 p-6 sm:p-8"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Share2 className="size-5" /></span><div><p className="text-xs font-semibold tracking-[0.16em] text-blue-700">{t("result.nextActionEyebrow")}</p><h2 className="mt-1 text-xl font-semibold text-slate-950">{t("result.nextActionTitle")}</h2></div></div><p className="mt-2 text-sm text-muted-foreground">{t("result.nextActionSubtitle")}</p><div className="mt-6 flex flex-wrap gap-2"><Button onClick={() => void repeat()}><RotateCcw />{t("result.repeatButton")}</Button><Button variant="outline" asChild><Link to="/assessments">{t("result.newButton")} <ArrowRight /></Link></Button><Button variant="outline" asChild><Link to="/history">{t("result.historyButton")}</Link></Button><Button variant="outline" asChild><Link to={`/result/${record.id}/answers`} state={{ transient: record }}>{t("result.answersButton")}</Link></Button></div><div className="mt-4"><ShareActions record={record} scoreRef={scoreRef} /></div></section>
  </div>;
}

function EmptyResult() { const { t } = useTranslation(); return <section className="mx-auto max-w-lg py-16 text-center"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700"><Sparkles className="size-7" /></span><h1 className="mt-6 text-2xl font-semibold text-slate-950">{t("result.emptyTitle")}</h1><p className="mt-3 leading-7 text-muted-foreground">{t("result.emptyBody")}</p><Button asChild size="lg" className="mt-6"><Link to="/assessments">{t("result.emptyButton")} <ArrowRight /></Link></Button></section>; }
