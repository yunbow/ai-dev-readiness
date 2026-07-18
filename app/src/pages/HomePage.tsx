import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/ai-readiness-hero.png";

export function HomePage() {
  const { t } = useTranslation();
  const outcomes = [t("home.outcome1"), t("home.outcome2"), t("home.outcome3")];
  const steps = [
    { icon: Clock3, title: t("home.step1Title"), body: t("home.step1Body") },
    { icon: BarChart3, title: t("home.step2Title"), body: t("home.step2Body") },
    { icon: Sparkles, title: t("home.step3Title"), body: t("home.step3Body") },
  ];
  return (
    <div className="space-y-20 py-5 sm:py-8">
      <section className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white shadow-2xl shadow-slate-950/15 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <img
          src={heroImage}
          alt={t("home.heroImageAlt")}
          className="absolute inset-0 -z-20 size-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950 via-slate-950/95 to-slate-950/30" />
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium tracking-wide text-blue-100 backdrop-blur-sm">
            <Sparkles className="size-3.5 text-cyan-300" />
            {t("home.heroBadge")}
          </div>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-200 sm:text-lg">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 bg-white px-5 text-slate-950 hover:bg-blue-50">
              <Link to="/assessments">
                {t("home.heroCtaPrimary")}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 border-white/25 bg-white/5 px-5 text-white hover:bg-white/15 hover:text-white">
              <Link to="/about">{t("home.heroCtaSecondary")}</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-200">
            <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4 text-cyan-300" />{t("home.heroBadgeTime")}</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4 text-cyan-300" />{t("home.heroBadgeNoSignup")}</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="outcome-title" className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-primary">{t("home.outcomesEyebrow")}</p>
          <h2 id="outcome-title" className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{t("home.outcomesTitle")}</h2>
          <p className="mt-4 max-w-md leading-7 text-muted-foreground">{t("home.outcomesSubtitle")}</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {outcomes.map((outcome, index) => (
            <li key={outcome} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="text-sm font-semibold text-primary">0{index + 1}</span>
              <p className="mt-7 font-medium leading-6 text-foreground">{outcome}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="flow-title" className="rounded-3xl bg-muted px-6 py-10 sm:px-10 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-primary">{t("home.flowEyebrow")}</p>
            <h2 id="flow-title" className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{t("home.flowTitle")}</h2>
          </div>
          <Button asChild variant="link" className="px-0 text-primary"><Link to="/assessments">{t("home.flowLinkText")} <ArrowRight /></Link></Button>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className="relative rounded-2xl bg-card p-6 shadow-sm">
              <span className="absolute right-6 top-5 text-sm font-semibold text-muted-foreground/40">0{index + 1}</span>
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
              <h3 className="mt-5 font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{t("home.ctaTitle")}</h2>
            <p className="mt-2 text-primary-foreground/80">{t("home.ctaSubtitle")}</p>
          </div>
          <Button asChild size="lg" className="h-11 shrink-0 bg-background px-5 text-primary hover:bg-accent"><Link to="/assessments">{t("home.ctaButton")} <ArrowRight /></Link></Button>
        </div>
      </section>
    </div>
  );
}
