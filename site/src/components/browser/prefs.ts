"use client";
import { useLayoutEffect, useState, useSyncExternalStore } from "react";
import type { IconStyle } from "@/lib/icons";

export type Badge = "mono" | "semantic";
export type Prefs = { color: string; variant: "color" | "soft"; badge: Badge; size: number; style: IconStyle };
/** The `color` preference that gives each icon in the grid its own colour. */
export const MIXED = "mixed";
export const DEFAULT_PREFS: Prefs = { color: MIXED, variant: "color", badge: "mono", size: 32, style: "layered" };
export { SWATCHES, MIXED_FILL, mixedColor, mixedColors } from "@/lib/palette";

export const PREVIEW_SIZE = 128;
const KEY = "kubai-icons:preferences";

/** Viewer preferences, remembered in this browser when storage is available. */
export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  // Read before the first paint of the grid, so it never shows the defaults first.
  useLayoutEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) setPrefs((p) => ({ ...p, color: saved.color ?? p.color, variant: saved.variant ?? p.variant, badge: saved.badge ?? p.badge, size: saved.size ?? p.size, style: saved.style === "duotone" || saved.style === "line" ? saved.style : p.style }));
    } catch {
      // Storage may be blocked; defaults are fine.
    }
  }, []);
  const update = (next: Partial<Prefs>) =>
    setPrefs((p) => {
      const v = { ...p, ...next };
      try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ }
      return v;
    });
  return [prefs, update] as const;
}

/** The icon styles, in the order of every style switch. */
export const STYLE_OPTIONS = [
  { value: "layered", en: "Layered", zh: "分层" },
  { value: "duotone", en: "Two-tone", zh: "双色" },
  { value: "line", en: "Line", zh: "线性" },
] as const;

// The icon style, shared live by every part of a page that shows it (the home page wall, its
// headline) and remembered with the other preferences, so the icon browser opens in it too.
const styleListeners = new Set<() => void>();
let styleNow: IconStyle | null = null;
const readStyle = (): IconStyle => {
  if (styleNow) return styleNow;
  let next: IconStyle = "layered";
  try { const s = JSON.parse(localStorage.getItem(KEY) || "null")?.style; if (s === "duotone" || s === "line") next = s; } catch { /* storage may be blocked */ }
  styleNow = next;
  return next;
};
const onStyle = (listener: () => void) => { styleListeners.add(listener); return () => { styleListeners.delete(listener); }; };
/** The chosen icon style and a setter; on the server, and before hydration, the layered style. */
export function useIconStyle() {
  const style = useSyncExternalStore(onStyle, readStyle, () => "layered" as IconStyle);
  const set = (next: IconStyle) => {
    styleNow = next;
    try { localStorage.setItem(KEY, JSON.stringify({ ...JSON.parse(localStorage.getItem(KEY) || "{}"), style: next })); } catch { /* the page still follows it */ }
    styleListeners.forEach((l) => l());
  };
  return [style, set] as const;
}

