import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/sonner";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { GithubIcon, XIcon } from "@/components/icons/BrandIcons";

export function Layout() {
  const { t } = useTranslation();
  return <div className="flex min-h-screen flex-col"><header className="border-b"><nav className="mx-auto flex max-w-5xl items-center justify-between p-4"><Link className="font-bold" to="/">{t("common.serviceName")}</Link><div className="flex items-center gap-4 text-sm"><Link to="/history">{t("common.headerHistory")}</Link><Link to="/about">{t("common.headerAbout")}</Link><LanguageSwitcher /></div></nav></header><main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6"><Outlet /></main><footer className="border-t p-4 text-center text-xs text-muted-foreground"><p>{t("common.footerPrivacy")} <Link className="underline" to="/about">{t("common.footerAbout")}</Link></p><div className="mt-3 flex items-center justify-center gap-4"><a href="https://x.com/yun_bow" target="_blank" rel="noopener noreferrer" aria-label="X" className="text-muted-foreground hover:text-slate-950"><XIcon className="size-4" /></a><a href="https://github.com/yunbow/ai-dev-readiness" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-slate-950"><GithubIcon className="size-4" /></a></div></footer><Toaster /></div>;
}
