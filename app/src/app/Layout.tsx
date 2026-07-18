import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/sonner";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

export function Layout() {
  const { t } = useTranslation();
  return <div className="flex min-h-screen flex-col"><header className="border-b"><nav className="mx-auto flex max-w-5xl items-center justify-between p-4"><Link className="font-bold" to="/">{t("common.serviceName")}</Link><div className="flex items-center gap-4 text-sm"><Link to="/history">{t("common.headerHistory")}</Link><Link to="/about">{t("common.headerAbout")}</Link><LanguageSwitcher /></div></nav></header><main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6"><Outlet /></main><footer className="border-t p-4 text-center text-xs text-muted-foreground">{t("common.footerPrivacy")} <Link className="underline" to="/about">{t("common.footerAbout")}</Link></footer><Toaster /></div>;
}
