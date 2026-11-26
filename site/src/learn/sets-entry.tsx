"use client";
import { ChevronRightIcon } from "@/components/kit/ui-icons";
import { navItem } from "@/components/kit/styles";
import { ClipTip } from "@/components/kit/clip-tip";
import { hasIconPages } from "@/lib/i18n";
import { asset } from "@/lib/site";
import { useLocale, useLocalize } from "@/lib/use-locale";
import { cn } from "@/lib/utils";
import { setPath, setsPath, type BrowserSet, type SetStyle } from "./set-paths";

type Props = {
  style: SetStyle;
  sets: BrowserSet[];
  /** The id of the set on show, or "". */
  current: string;
  open: boolean;
  onToggle: () => void;
  /** Opens a set in place; links opened in a new tab still go to the set's page. */
  onPick: (e: React.MouseEvent, id: string) => void;
  /** Extra classes for every row, such as the taller rows of the phone's bottom sheet. */
  rowClassName?: string;
};

/**
 * The icon browser's icon sets for the style on show, English and Chinese only: an entry that
 * opens a list of the sets, in the sidebar and in the phone's category sheet. Picking a set shows it in the grid,
 * the way a category does; each is a link to the set's own page as well.
 */
export function SetsEntry({ style, sets, current, open, onToggle, onPick, rowClassName }: Props) {
  const locale = useLocale();
  const loc = useLocalize();
  if (!hasIconPages(locale) || !sets.length) return null;
  const zh = locale === "zh";
  const label = zh ? "图标合集" : "Icon sets";
  const chevron = <ChevronRightIcon aria-hidden className={cn("size-4 shrink-0 transition-transform rtl:rotate-180", open && "rotate-90 rtl:rotate-90")} />;
  return (
    <>
      <button type="button" aria-expanded={open} onClick={onToggle} className={cn(navItem({ active: false }), "justify-between", current && !open && "text-foreground", rowClassName)}>
        <span className="truncate">{label}</span>
        {chevron}
      </button>
      {/* The list slides open and closed. While closed it stays in the page but out of reach,
          and no row in it is marked current, so the sidebar's highlight does not land on it. */}
      <div
        inert={!open}
        aria-hidden={!open}
        className={cn("grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 space-y-0.5 overflow-hidden">
          {sets.map((s) => (
            <ClipTip
              key={s.id}
              label={s.name}
              row={<a href={asset(loc(setPath(style, s.id)))} aria-current={open && current === s.id} onClick={(e) => onPick(e, s.id)} className={cn(navItem({ active: current === s.id }), "ps-6", rowClassName)} />}
            />
          ))}
          <a href={asset(loc(setsPath(style)))} className={cn(navItem({ active: false }), "ps-6", rowClassName, "text-caption")}>
            <span className="truncate">{zh ? "全部合集" : "All icon sets"}</span>
          </a>
        </div>
      </div>
      <div aria-hidden className="mx-2.5 my-2 border-t" />
    </>
  );
}
