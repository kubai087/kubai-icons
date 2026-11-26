"use client";
import { cloneElement, useLayoutEffect, useRef, useState, type ReactElement } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * A row label that ends in an ellipsis when it is too long for its row (from `md` up, where
 * sidebars are narrow), and then shows in full in a tooltip. `row` is the link or button
 * without children; the label goes inside it.
 */
export function ClipTip({ label, row }: { label: string; row: ReactElement }) {
  const text = useRef<HTMLSpanElement>(null);
  const [cut, setCut] = useState(false);
  useLayoutEffect(() => {
    const el = text.current;
    if (!el) return;
    const read = () => setCut(el.scrollWidth > el.clientWidth + 1);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [label, cut]);
  const inner = <span ref={text} className="min-w-0 md:truncate">{label}</span>;
  if (!cut) return cloneElement(row, undefined, inner);
  return (
    <Tooltip>
      <TooltipTrigger delay={200} render={row}>{inner}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
