import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { AnswerList } from "@/components/result/AnswerList";
import type { HistoryRecord } from "@/domain/history/types";
import { getResult } from "@/infrastructure/indexedDb";

export function AnswersPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const [record, setRecord] = useState<HistoryRecord | null>((location.state as { transient?: HistoryRecord } | null)?.transient ?? null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!id) return;
    void getResult(id).then((value) => { setRecord((current) => current ?? value); setLoaded(true); });
  }, [id]);
  const ready = loaded || !id;
  if (!ready && !record) return <div className="py-16 text-center text-sm text-muted-foreground">{t("answers.loading")}</div>;
  if (!record) return <section className="mx-auto max-w-lg py-16 text-center"><h1 className="text-2xl font-semibold text-slate-950">{t("answers.emptyTitle")}</h1><p className="mt-3 leading-7 text-muted-foreground">{t("answers.emptyBody")}</p><Button asChild className="mt-6"><Link to="/history">{t("result.historyButton")}</Link></Button></section>;
  return <div className="mx-auto max-w-3xl space-y-6 py-5 sm:py-8">
    <div><Button variant="outline" asChild><Link to={`/result/${record.id}`}><ArrowLeft />{t("answers.backButton")}</Link></Button></div>
    <div><h1 className="text-2xl font-semibold tracking-tight text-slate-950">{t("answers.title")}</h1><p className="mt-2 text-sm text-muted-foreground">{t("answers.subtitle")}</p></div>
    <AnswerList record={record} />
  </div>;
}
