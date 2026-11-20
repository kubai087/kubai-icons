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

const subscribeShown = (fn: () => void) => {
  document.addEventListener("visibilitychange", fn);
  return () => document.removeEventListener("visibilitychange", fn);
};

/** Whether the page's tab is showing. A hidden tab draws nothing, so the walls rest. */
export const usePageShown = () => useSyncExternalStore(subscribeShown, () => !document.hidden, () => true);

/** Whether a looping wall should run: on screen in a showing tab, not paused, and without reduced motion. */
export function useWallLoop(ref: RefObject<Element | null>) {
  const visible = useOnScreen(ref);
  const shown = usePageShown();
  const isPaused = useWallsPaused();
  const reduced = useReducedMotion();
  return visible && shown && !isPaused && !reduced;
}

// One observer for every wall and tile on the page, each element with its own callback.
let observer: IntersectionObserver | null = null;
const callbacks = new Map<Element, (on: boolean) => void>();
function watch(el: Element, fn: (on: boolean) => void) {
  observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) callbacks.get(entry.target)?.(entry.isIntersecting);
  });
  callbacks.set(el, fn);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

/**
 * Whether an element is on screen. A wall runs while any of it shows; each tile also checks
 * its own, so a wall taller than the screen, or one scrolled nearly out of view, moves only
 * the icons that can be seen.
 */
export function useOnScreen(ref: RefObject<Element | null>) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    return watch(ref.current, setOn);
  }, [ref]);
  return on;
}
