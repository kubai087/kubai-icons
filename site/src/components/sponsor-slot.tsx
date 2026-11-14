"use client";
import { RiTwitterXLine } from "@remixicon/react";
import { quietLink } from "@/components/kit/styles";
import { asset, SPONSOR, SPONSOR_POST } from "@/lib/site";
import { useLocale, useTr } from "@/lib/use-locale";
import { cn } from "@/lib/utils";

/** Languages whose sponsor line reads better broken at spaces and punctuation. */
const KEEP_PHRASES = new Set(["zh", "zh-hant", "ko"]);

/** The paid sponsor as icon, name and one line, or a link to the post about it while the slot is open. */
export function SponsorSlot({ className }: { className?: string }) {
  const tr = useTr();
  const locale = useLocale();
  if (SPONSOR) {
    return (
      // The name and line run as one paragraph, so a second line wraps under the name and the
      // logo stays level with the first line. Chinese and Korean lines break at spaces and
      // punctuation first, and inside a phrase only when a part cannot fit.
      <a href={SPONSOR.site} target="_blank" rel="sponsored noopener" className={cn("flex w-fit max-w-full items-start gap-2 py-1 pointer-coarse:py-2", quietLink, className)}>
        <img src={asset(SPONSOR.icon)} alt="" width={14} height={14} className="mt-[3px] size-3.5 shrink-0" />
        <span className={cn("text-pretty", KEEP_PHRASES.has(locale) && "break-keep [overflow-wrap:anywhere]")}>
          <span className="me-1.5 font-medium text-foreground">{SPONSOR.name}</span>
          {tr(SPONSOR.line.en, SPONSOR.line.zh)}
        </span>
      </a>
    );
  }
  return (
    <a href={SPONSOR_POST} target="_blank" rel="noreferrer" className={cn("flex w-fit items-center gap-2 py-1 pointer-coarse:py-2", quietLink, className)}>
      <span aria-hidden className="size-4 shrink-0 rounded-sm border border-dashed border-current opacity-60" />
      {tr("Your product here", "虚位以待")}
      <span className="flex items-center gap-1 font-medium text-[#5393FF]">
        <RiTwitterXLine aria-hidden className="size-3 shrink-0" />
        {tr("Message on X", "在 X 上联系")}
      </span>
    </a>
  );
}
