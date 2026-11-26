"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, toSvg, type KubaiIconData } from "kubai-icons";
import { loadIcon, peekIcon } from "@/lib/icons";
import type { LineVariant } from "@/lib/line";
import { useLineSettings } from "@/lib/line-settings";

/** A line icon's data, loading the line chunk on first use. */
export function useLineIcon(name: string) {
  const [icon, setIcon] = useState<KubaiIconData | undefined>(() => peekIcon(name, "line"));
  useEffect(() => {
    const now = peekIcon(name, "line");
    if (now) { setIcon(now); return; }
    let live = true;
    loadIcon({ name, category: "", tags: [], style: "line" }).then(() => { if (live) setIcon(peekIcon(name, "line")); });
    return () => { live = false; };
  }, [name]);
  return icon;
}

/**
 * A line-style icon (kubai-icons/line), drawn live at the stroke width and variant chosen in the
 * browser unless given. It plays its motion when the pointer enters the nearest
 * [data-kubai-trigger] (the tile), like the other styles, or while `hover` is set.
 */
export function LineIcon({ name, size, color, variant, s, hover, badgeColor }: { name: string; size: number; color: string; variant?: LineVariant; s?: number; hover?: boolean; badgeColor?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const ctl = useRef<ReturnType<typeof animate> | null>(null);
  const settings = useLineSettings();
  const v = variant ?? settings.variant, sw = s ?? settings.s;
  const icon = useLineIcon(name);
  // Drawn before the browser paints, so a tile never shows a frame without its icon.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !icon) return;
    el.innerHTML = toSvg(icon, { size, color, strokeWidth: sw, variant: v, badgeColor });
    const svg = el.querySelector("svg");
    if (!svg) return;
    const c = animate(svg, icon, { variant: v });
    ctl.current = c;
    const trigger = (el.closest("[data-kubai-trigger]") as HTMLElement | null) ?? el;
    const enter = () => c.hover(true), leave = () => c.hover(false);
    trigger.addEventListener("pointerenter", enter);
    trigger.addEventListener("pointerleave", leave);
    return () => {
      trigger.removeEventListener("pointerenter", enter);
      trigger.removeEventListener("pointerleave", leave);
      c.destroy();
      ctl.current = null;
    };
  }, [icon, v, sw, size, color, badgeColor]);
  useEffect(() => {
    if (hover !== undefined) ctl.current?.hover(hover);
  }, [hover, icon, v, sw, size, color, badgeColor]);
  return (
    <span className="grid place-items-center" style={{ width: size, height: size }}>
      {!icon && <span className="block rounded-control bg-muted-foreground/10" style={{ width: size * 0.8, height: size * 0.8 }} />}
      {/* Filled by the effect, not by React. */}
      <span ref={ref} className="contents" />
    </span>
  );
}
