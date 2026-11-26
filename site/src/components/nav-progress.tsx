"use client";
// A thin bar along the top of the window while the app moves to another page. On a slow
// connection the next page's data and code can take a few seconds to arrive, and without it a
// click on a link seems to do nothing. Fast moves (a prefetched page) never show it.
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** How long a move may take before the bar shows, in milliseconds. */
const SHOW_AFTER = 120;
/** A move that never lands (a link handled by the page itself) stops showing after this long. */
const GIVE_UP = 15000;

const starters = new Set<() => void>();
/** Shows the bar for a move started in code (router.push), as a link click does. */
export function startNavigation() {
  starters.forEach((start) => start());
}

type Phase = "idle" | "waiting" | "loading" | "done";

function Bar() {
  const path = usePathname();
  const search = useSearchParams()?.toString() ?? "";
  const [phase, setPhaseState] = useState<Phase>("idle");
  const phaseNow = useRef<Phase>("idle");
  const setPhase = (next: Phase) => { phaseNow.current = next; setPhaseState(next); };
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  useEffect(() => {
    const start = () => {
      clear();
      setPhase("waiting");
      later(() => setPhase("loading"), SHOW_AFTER);
      later(() => setPhase("idle"), GIVE_UP);
    };
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      // [data-in-page] marks links the page handles itself (the icon browser's filters).
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== "_self") || a.hasAttribute("download") || a.hasAttribute("data-in-page")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      // The app moves only when a handler (Next's Link, the language switch) has taken the click
      // from the browser, which then shows nothing. A plain link loads the page the usual way.
      window.setTimeout(() => { if (e.defaultPrevented) start(); }, 0);
    };
    starters.add(start);
    document.addEventListener("click", onClick);
    return () => {
      starters.delete(start);
      document.removeEventListener("click", onClick);
      clear();
    };
  }, []);

  // The new page is in place: finish the bar if it showed, otherwise never show it.
  useEffect(() => {
    const shown = phaseNow.current === "loading";
    clear();
    setPhase(shown ? "done" : "idle");
    if (shown) later(() => setPhase("idle"), 300);
  }, [path, search]);

  if (phase === "idle" || phase === "waiting") return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5">
      <div className={phase === "done" ? "nav-progress nav-progress-done" : "nav-progress"} />
    </div>
  );
}

/** The bar for the whole site; it lives in the root layout. */
export function NavProgress() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
