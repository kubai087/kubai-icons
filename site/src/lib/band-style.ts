"use client";
// The style the home page's style band shows, shared with the feature cards below it, which draw
// their examples in the same style. It opens on line, the newest style, and is not remembered.
import { useSyncExternalStore } from "react";
import type { IconStyle } from "./icons";

let current: IconStyle = "line";
const listeners = new Set<() => void>();

export function setBandStyle(next: IconStyle) {
  current = next;
  listeners.forEach((l) => l());
}

export function useBandStyle(): IconStyle {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => { listeners.delete(l); }; },
    () => current,
    () => "line" as IconStyle,
  );
}
