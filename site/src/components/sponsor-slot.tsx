"use client";
import Link from "next/link";
import { quietLink } from "@/components/kit/styles";
import { SPONSOR } from "@/lib/site";
import { useLocalize, useTr } from "@/lib/use-locale";
import { cn } from "@/lib/utils";

/** The paid sponsor as icon, name and one line, or a link to the sponsor page while the slot is open. */
export function SponsorSlot({ className }: { className?: string }) {
  const tr = useTr();
  const loc = useLocalize();
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
    <Link href={`${loc("/sponsor/")}#slot`} className={row}>
      <span aria-hidden className="size-4 shrink-0 rounded-sm border border-dashed border-current opacity-60" />
      {tr("Your product here", "虚位以待")}
    </Link>
  );
}
