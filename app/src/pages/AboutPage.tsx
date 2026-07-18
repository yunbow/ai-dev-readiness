import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, LockKeyhole, Scale, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { AXIS_POINTS } from "@/domain/assessment/questions";

export function AboutPage() {
  const { t } = useTranslation();
  const axes = [
    ["about.axis1Title", AXIS_POINTS.document, "about.axis1Description"],
    ["about.axis2Title", AXIS_POINTS.process, "about.axis2Description"],
    ["about.axis3Title", AXIS_POINTS.qa, "about.axis3Description"],
    ["about.axis4Title", AXIS_POINTS.ai, "about.axis4Description"],
    ["about.axis5Title", AXIS_POINTS.project, "about.axis5Description"],
  ] as const;
  return <div className="mx-auto max-w-4xl space-y-16 py-5 sm:py-8">
    <section className="max-w-2xl"><p className="text-sm font-semibold tracking-[0.16em] text-blue-700">{t("about.eyebrow")}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t("about.title")}</h1><p className="mt-5 leading-7 text-muted-foreground">{t("about.intro")}</p></section>
    <section><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold tracking-[0.16em] text-blue-700">{t("about.axesEyebrow")}</p><h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{t("about.axesTitle")}</h2></div><span className="text-sm text-muted-foreground">{t("about.axesTotalPoints")}</span></div><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{axes.map(([titleKey, points, descriptionKey], index) => <article key={titleKey} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-blue-700">0{index + 1}</span><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{t("about.axisPoints", { points })}</span></div><h3 className="mt-5 font-semibold text-slate-950">{t(titleKey)}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{t(descriptionKey)}</p></article>)}</div></section>
    <section className="grid gap-4 md:grid-cols-3"><Info icon={BarChart3} title={t("about.infoScoreTitle")}>{t("about.infoScoreBody")}</Info><Info icon={Scale} title={t("about.infoLimitTitle")}>{t("about.infoLimitBody")}</Info><Info icon={LockKeyhole} title={t("about.infoDataTitle")}>{t("about.infoDataBody")}</Info></section>
    <section className="rounded-3xl bg-slate-950 px-6 py-9 text-white sm:px-10"><Sparkles className="size-5 text-cyan-300" /><h2 className="mt-4 text-2xl font-semibold tracking-tight">{t("about.ctaTitle")}</h2><p className="mt-2 max-w-xl leading-7 text-slate-300">{t("about.ctaBody")}</p><Button asChild size="lg" className="mt-6 h-11 bg-white text-slate-950 hover:bg-blue-50"><Link to="/assessments">{t("about.ctaButton")} <ArrowRight /></Link></Button></section>
  </div>;
}

function Info({ icon: Icon, title, children }: { icon: typeof BarChart3; title: string; children: string }) { return <article className="rounded-2xl bg-slate-50 p-5"><Icon className="size-5 text-blue-700" /><h2 className="mt-4 font-semibold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{children}</p></article>; }
