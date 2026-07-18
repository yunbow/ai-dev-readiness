import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3, FileText, RotateCcw, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { clearDraft, loadDraft } from "@/infrastructure/localStorage";

export function AssessmentSelectPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(loadDraft());
  const courses = [
    { tier: "quick", eyebrow: "QUICK CHECK", title: t("assessmentSelect.quickTitle"), time: t("assessmentSelect.quickTime"), questions: t("assessmentSelect.quickQuestions"), description: t("assessmentSelect.quickDescription"), accent: "bg-blue-700", features: [t("assessmentSelect.quickFeature1"), t("assessmentSelect.quickFeature2"), t("assessmentSelect.quickFeature3")] },
    { tier: "standard", eyebrow: "DEEP DIVE", title: t("assessmentSelect.standardTitle"), time: t("assessmentSelect.standardTime"), questions: t("assessmentSelect.standardQuestions"), description: t("assessmentSelect.standardDescription"), accent: "bg-slate-950", features: [t("assessmentSelect.standardFeature1"), t("assessmentSelect.standardFeature2"), t("assessmentSelect.standardFeature3")] },
  ] as const;

  return <div className="space-y-10 py-5 sm:py-8">
    <section className="max-w-2xl">
      <p className="text-sm font-semibold tracking-[0.16em] text-blue-700">{t("assessmentSelect.eyebrow")}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t("assessmentSelect.title")}</h1>
      <p className="mt-4 leading-7 text-muted-foreground">{t("assessmentSelect.subtitle")}</p>
    </section>
    {draft && <Alert className="border-blue-200 bg-blue-50 px-5 py-4"><RotateCcw className="size-4 text-blue-700" /><AlertTitle className="text-blue-950">{t("assessmentSelect.resumeTitle")}</AlertTitle><AlertDescription className="mt-1 text-blue-900/75">{t("assessmentSelect.resumeBody")}<span className="mt-3 flex flex-wrap gap-2"><Button size="sm" onClick={() => navigate(`/assessment/${draft.tier}`)}>{t("assessmentSelect.resumeButton")} <ArrowRight /></Button><Button size="sm" variant="outline" onClick={() => { clearDraft(); setDraft(null); }}>{t("assessmentSelect.restartButton")}</Button></span></AlertDescription></Alert>}
    <section className="grid gap-5 lg:grid-cols-2">
      {courses.map((course) => <article key={course.tier} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg sm:p-8">
        <div className={`absolute inset-x-0 top-0 h-1.5 ${course.accent}`} />
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.15em] text-blue-700">{course.eyebrow}</p><h2 className="mt-3 text-2xl font-semibold text-slate-950">{course.title}</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{course.questions}</span></div>
        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-700"><Clock3 className="size-4 text-blue-700" />{course.time}</div>
        <p className="mt-4 min-h-14 leading-7 text-muted-foreground">{course.description}</p>
        <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">{course.features.map((feature) => <li key={feature} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-blue-600" />{feature}</li>)}</ul>
        <Button asChild size="lg" className="mt-8 h-11 w-full"><Link to={`/assessment/${course.tier}`}>{t("assessmentSelect.startCourseButton", { title: course.title })} <ArrowRight /></Link></Button>
      </article>)}
    </section>
    <section className="flex flex-wrap items-center gap-x-7 gap-y-3 rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-600"><span className="inline-flex items-center gap-2"><FileText className="size-4 text-blue-700" />{t("assessmentSelect.footerSaved")}</span><span className="inline-flex items-center gap-2"><Sparkles className="size-4 text-blue-700" />{t("assessmentSelect.footerConversation")}</span><Link to="/about" className="font-medium text-blue-700 hover:underline">{t("assessmentSelect.footerLink")}</Link></section>
  </div>;
}
