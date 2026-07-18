import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { useAssessment } from "@/hooks/useAssessment";
import { diagnose } from "@/domain/assessment/diagnose";
import { saveResult } from "@/infrastructure/indexedDb";
import { isLocalStorageAvailable, saveLatestResultId } from "@/infrastructure/localStorage";
import { QUESTION_VERSION, SCHEMA_VERSION, SCORING_VERSION } from "@/constants/versions";
import type { Answers, Tier } from "@/domain/assessment/types";

const AUTO_ADVANCE_DELAY_MS = 350;

export function AssessmentPage() {
  const { t } = useTranslation();
  const params = useParams();
  const tier: Tier = params.tier === "standard" ? "standard" : "quick";
  const flow = useAssessment(tier);
  const navigate = useNavigate();
  const total = flow.items.length;
  const progress = ((flow.index + 1) / total) * 100;
  const isFinal = flow.index + 1 === total;
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancelAutoAdvance = () => { if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = undefined; } };
  const complete = async (answers: Answers) => {
    const result = diagnose({ tier, answers, profile: flow.profile });
    const id = crypto.randomUUID();
    const payload = { id, createdAt: new Date().toISOString(), tier, answers, profile: flow.profile, result, schemaVersion: SCHEMA_VERSION, questionVersion: QUESTION_VERSION, scoringVersion: SCORING_VERSION };
    const saved = await saveResult(payload);
    flow.clearDraft();
    if (saved) { saveLatestResultId(id); navigate(`/result/${id}`); }
    else navigate("/result", { state: { transient: payload } });
  };
  // advance()/select() may run from a setTimeout scheduled before React applies the just-selected
  // answer, so `answers` must be passed explicitly rather than read from the (possibly stale) flow.answers closure.
  const advance = (answers: Answers = flow.answers) => { if (isFinal) void complete(answers); else flow.setIndex(flow.index + 1); };
  const select = (optionValue: string) => {
    const current = flow.current;
    flow.select(optionValue);
    const merged = current ? { ...flow.answers, [current.id]: optionValue } : flow.answers;
    cancelAutoAdvance(); advanceTimer.current = setTimeout(() => advance(merged), AUTO_ADVANCE_DELAY_MS);
  };
  useEffect(() => cancelAutoAdvance, []);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (/^[1-5]$/.test(event.key) && flow.current) { const option = flow.current.options[Number(event.key) - 1]; if (option) select(option.value); }
      if (event.key === "Enter" && flow.value) { cancelAutoAdvance(); advance(); }
    };
    window.addEventListener("keydown", listener); return () => window.removeEventListener("keydown", listener);
  });
  if (!flow.current) return null;
  return <div className="mx-auto max-w-2xl py-5 sm:py-8">
    <header className="rounded-2xl bg-slate-950 px-5 py-5 text-white sm:px-6">
      <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.16em] text-cyan-300">{tier === "quick" ? t("assessment.eyebrowQuick") : t("assessment.eyebrowStandard")}</p><p className="mt-1 text-sm text-slate-300">{t("assessment.questionCounter", { current: flow.index + 1, total })}</p></div><span className="text-2xl font-semibold tracking-tight">{Math.round(progress)}<span className="text-sm text-slate-400">%</span></span></div>
      <Progress className="mt-4 h-2 bg-white/15 [&_[data-slot=progress-indicator]]:bg-linear-to-r [&_[data-slot=progress-indicator]]:from-cyan-300 [&_[data-slot=progress-indicator]]:to-blue-500" value={progress} />
    </header>
    {!isLocalStorageAvailable() && <Alert className="mt-5 border-amber-200 bg-amber-50"><AlertDescription className="text-amber-900">{t("assessment.noStorageWarning")}</AlertDescription></Alert>}
    <div className="mt-6"><QuestionCard item={flow.current} value={flow.value} onChange={select} /></div>
    <div className="mt-6 border-t border-slate-200 pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><Button variant="outline" onClick={() => { cancelAutoAdvance(); flow.setIndex(Math.max(0, flow.index - 1)); }} disabled={flow.index === 0}><ArrowLeft />{t("assessment.prevButton")}</Button><Button size="lg" className="h-11 px-5" onClick={() => { cancelAutoAdvance(); advance(); }} disabled={!flow.value}>{isFinal ? t("assessment.finishButton") : <>{t("assessment.nextButton")} <ArrowRight /></>}</Button></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Save className="size-3.5" />{t("assessment.autoSaveNotice")}</span><Button variant="link" className="h-auto px-0 text-muted-foreground" onClick={() => navigate("/assessments")}>{t("assessment.cancelButton")}</Button></div></div>
  </div>;
}
