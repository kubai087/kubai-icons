"use client";
// When the looping icon walls run: while on screen, unless the visitor paused them or asks
// the system for reduced motion. The pause is one choice for every wall, kept for the visit;
// both it and the system setting take effect at once, without a reload.
import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const KEY = "kubai-walls-paused";
const listeners = new Set<() => void>();
let paused: boolean | null = null;

const readPaused = () => {
  if (paused === null) {
    try { paused = sessionStorage.getItem(KEY) === "1"; } catch { paused = false; }
  }
  return paused;
};
const subscribePaused = (fn: () => void) => {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
};

/** Pauses or resumes every wall on the page, and remembers the choice for the visit. */
export function setWallsPaused(next: boolean) {
  paused = next;
  try {
    if (next) sessionStorage.setItem(KEY, "1"); else sessionStorage.removeItem(KEY);
  } catch { /* storage may be blocked; the choice still holds on this page */ }
  listeners.forEach((fn) => fn());
}

/** Whether the visitor paused the walls. */
export const useWallsPaused = () => useSyncExternalStore(subscribePaused, readPaused, () => false);

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (fn: () => void) => {
  const query = matchMedia(REDUCE);
  query.addEventListener("change", fn);
  return () => query.removeEventListener("change", fn);
};

/** Whether the system asks for reduced motion, following the setting as it changes. */
export const useReducedMotion = () => useSyncExternalStore(subscribeReduced, () => matchMedia(REDUCE).matches, () => false);

/** Whether a looping wall should run: on screen, not paused, and without reduced motion. */
export function useWallLoop(ref: RefObject<Element | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  const isPaused = useWallsPaused();
  const reduced = useReducedMotion();
  return visible && !isPaused && !reduced;
}
