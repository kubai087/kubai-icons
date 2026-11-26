"use client";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronUpIcon } from "@/components/kit/ui-icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * The phone layout's way between pages or categories: a pill at the bottom of the screen
 * that names where the reader is and opens the full list from below. `progress` (0 to 1)
 * draws a ring of how far the reader is through the page. `trailing` sits beside the pill's
 * button, such as the icon library's Select. `raised` lifts it above the collection bar.
 * The caller hides it where the wide layout shows the list itself (`className`).
 */
export function BottomNav({ label, title, progress, trailing, raised = false, className, children }: {
  label: ReactNode;
  title: string;
  progress?: number;
  trailing?: ReactNode;
  raised?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const footer = useFooterInView();
  return (
    <div className={cn("pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-gutter", className)}>
      <div
        inert={footer}
        className={cn(
          "pointer-events-auto flex max-w-full items-center gap-1 rounded-pill border bg-popover/90 p-1 shadow-lg backdrop-blur-xl transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none",
          raised && "-translate-y-14",
          footer && "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="tap focus-inset flex h-9 min-w-0 items-center gap-2 rounded-pill ps-3 pe-2.5 text-control font-medium transition-colors hover:bg-muted aria-expanded:bg-muted">
            {progress !== undefined && <ProgressRing value={progress} />}
            <span className="min-w-0 truncate">{label}</span>
            <ChevronUpIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80dvh] gap-0 rounded-t-panel pb-[env(safe-area-inset-bottom)]">
            <SheetHeader className="px-panel pt-5 pb-3">
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
            {/* Choosing a link or a row closes the sheet; a row that opens a list in place (aria-expanded) keeps it open. The current item opens in view. */}
            <div
              ref={(box) => {
                const item = box?.querySelector<HTMLElement>("[aria-current=page], [aria-current=true]");
                if (box && item) box.scrollTop = item.offsetTop - (box.clientHeight - item.offsetHeight) / 2;
              }}
              onClick={(e) => { if ((e.target as Element).closest("a, button:not([aria-expanded])")) setOpen(false); }}
              className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-[calc(var(--panel)-0.625rem)] pb-5"
            >
              {children}
            </div>
          </SheetContent>
        </Sheet>
        {trailing}
      </div>
    </div>
  );
}

/** A small ring that fills as the reader moves through the page. */
function ProgressRing({ value }: { value: number }) {
  const r = 7;
  const length = 2 * Math.PI * r;
  return (
    <svg aria-hidden viewBox="0 0 18 18" className="size-[18px] shrink-0 -rotate-90 rtl:scale-x-[-1]">
      <circle cx="9" cy="9" r={r} fill="none" strokeWidth="2" className="stroke-muted" />
      <circle cx="9" cy="9" r={r} fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-brand" strokeDasharray={length} strokeDashoffset={length * (1 - Math.min(1, Math.max(0, value)))} opacity={value > 0.005 ? 1 : 0} />
    </svg>
  );
}

/** Whether the site footer is on screen, where the pill steps aside so it never covers the footer's links. */
function useFooterInView() {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("body footer");
    if (!footer) return;
    const watch = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    watch.observe(footer);
    return () => watch.disconnect();
  }, []);
  return inView;
}

/** How far the reader is through `selector` (0 to 1), measured from its top to its end reaching the bottom of the screen. */
export function useReadingProgress(selector: string, key?: unknown) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      setProgress(travel <= 0 ? 1 : Math.min(1, Math.max(0, -box.top / travel)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const onResize = new ResizeObserver(onScroll);
    onResize.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      onResize.disconnect();
    };
  }, [selector, key]);
  return progress;
}
