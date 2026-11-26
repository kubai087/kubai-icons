"use client";
import { useSyncExternalStore } from "react";
import { LINE_SITE_STROKE, type LineVariant } from "./line";

// The variant and stroke the line icons show, shared by the grid and the detail panel and
// remembered in this browser.
const KEY = "kubai-icons:line";
type Settings = { variant: LineVariant; s: number };
let settings: Settings | null = null;
const listeners = new Set<() => void>();
const SERVER: Settings = { variant: "outline", s: LINE_SITE_STROKE };
const read = (): Settings => {
  if (settings) return settings;
  try { settings = { ...SERVER, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { settings = SERVER; }
  return settings!;
};
export function setLineSettings(next: Partial<Settings>) {
  settings = { ...read(), ...next };
  try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* the page still follows it */ }
  listeners.forEach((l) => l());
}
export function useLineSettings(): Settings {
  return useSyncExternalStore((l) => { listeners.add(l); return () => { listeners.delete(l); }; }, read, () => SERVER);
}
