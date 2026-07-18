import { useState } from "react";
import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { HistoryRecord } from "@/domain/history/types";
import { exportElementToPng } from "@/infrastructure/imageExport";

const DEMO_URL = "https://yunbow.github.io/ai-dev-readiness";

function XLogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ShareActions({ record, scoreRef }: { record: HistoryRecord; scoreRef: RefObject<HTMLElement | null> }) {
  const { t } = useTranslation();
  const [isSharing, setIsSharing] = useState(false);
  const [isSharingX, setIsSharingX] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const reductionTextFor = () => {
    const { reduction } = record.result;
    return reduction.min === reduction.max ? t("common.percentSingle", { value: reduction.min }) : t("common.percentRange", { min: reduction.min, max: reduction.max });
  };

  const buildShareText = () => t("share.shareText", { score: record.result.totalScore, reduction: reductionTextFor(), hashtags: t("share.hashtags") });
  const buildXShareText = () => t("share.shareXText", { score: record.result.totalScore, reduction: reductionTextFor(), hashtags: t("share.hashtags") });

  const shareImageAndText = async (text: string, onNoWebShare: () => void) => {
    const serviceName = t("common.serviceName");
    try {
      const blob = scoreRef.current ? await exportElementToPng(scoreRef.current) : null;
      const file = blob ? new File([blob], "ai-dev-readiness-score.png", { type: "image/png" }) : null;

      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: serviceName, url: DEMO_URL });
        return;
      }

      if (blob) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob, "text/plain": new Blob([text], { type: "text/plain" }) })]);
          toast.success(t("share.clipboardImageAndTextSuccess"));
        } catch {
          await navigator.clipboard.writeText(text);
          toast.error(t("share.clipboardImageFailure"));
        }
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      toast.error(t("share.clipboardTextFailure"));
      return;
    }
    onNoWebShare();
  };

  const shareGeneral = async () => {
    setIsSharing(true);
    try {
      await shareImageAndText(buildShareText(), () => {});
    } finally {
      setIsSharing(false);
    }
  };

  const shareToX = async () => {
    setIsSharingX(true);
    try {
      const blob = scoreRef.current ? await exportElementToPng(scoreRef.current) : null;
      if (blob) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          toast.success(t("share.shareXImageHint"));
        } catch {
          // Clipboard image copy isn't supported everywhere; still proceed to open the X post screen.
        }
      }
    } finally {
      setIsSharingX(false);
    }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(buildXShareText())}&url=${encodeURIComponent(DEMO_URL)}`, "_blank", "noopener,noreferrer");
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setUrlCopied(true);
      toast.success(t("share.copyUrlSuccess"));
      window.setTimeout(() => setUrlCopied(false), 2000);
    } catch {
      toast.error(t("share.copyUrlFailure"));
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Button type="button" variant="outline" disabled={isSharingX} onClick={() => void shareToX()}>
        <XLogoIcon />
        {isSharingX ? t("share.preparingButton") : t("share.shareXButton")}
      </Button>
      <Button type="button" disabled={isSharing} onClick={() => void shareGeneral()}>
        {isSharing ? t("share.preparingButton") : t("share.shareButton")}
      </Button>
      <Button type="button" variant="outline" onClick={() => void copyUrl()}>
        {urlCopied ? t("share.copiedButton") : t("share.copyUrlButton")}
      </Button>
    </div>
  );
}
