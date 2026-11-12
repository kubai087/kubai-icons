"use client";
import { RiTwitterXLine } from "@remixicon/react";
import { quietLink } from "@/components/kit/styles";
import { AUTHOR, SPONSOR } from "@/lib/site";
import { useTr } from "@/lib/use-locale";
import { cn } from "@/lib/utils";

/** The paid sponsor as icon, name and one line, or a link to message the author while the slot is open. */
export function SponsorSlot({ className }: { className?: string }) {
  const tr = useTr();
  const row = cn("flex w-fit items-center gap-2 py-1 pointer-coarse:py-2", quietLink, className);
  if (SPONSOR) {
    return (
      <a href={SPONSOR.site} target="_blank" rel="sponsored noopener" className={row}>
        <img src={SPONSOR.icon} alt="" width={16} height={16} className="size-4 shrink-0 rounded-sm" />
        <span className="font-medium text-foreground">{SPONSOR.name}</span>
        <span>{SPONSOR.line}</span>
      </a>
    );
  }
  return (
    <a href={AUTHOR.x} target="_blank" rel="noreferrer" className={row}>
      <span aria-hidden className="size-4 shrink-0 rounded-sm border border-dashed border-current opacity-60" />
      {tr("Your product here", "虚位以待")}
      <span className="flex items-center gap-1 font-medium text-[#5393FF]">
        <RiTwitterXLine aria-hidden className="size-3 shrink-0" />
        {tr("Message on X", "在 X 上联系")}
      </span>
    </a>
  );
}
