"use client";
// Every two-tone icon, live. While the wall is on screen, the icons play their motion on
// staggered beats, three or four at a time, as on the home page wall; an icon under the
// pointer holds its hover pose. Loads the style's one chunk.
import { memo, useEffect, useRef, useState } from "react";
import { KubaiIcon } from "kubai-icons-react";
import type { KubaiIconData } from "kubai-icons";
import { loadIcon, loadIndex, peekIcon, type IconMeta } from "@/lib/icons";
import { tile } from "@/components/kit/styles";
import { cn } from "@/lib/utils";

/** Time in the hover pose, and how much loop each tile adds, in milliseconds (as the home page wall). */
const HOLD = 1400;
const PER_TILE = 450;
/** Steps through the tiles so neighbours don't play one after another: 7, or the next number with no factor in common with the count, so every tile gets its own beat. */
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const strideFor = (n: number) => { let s = 7; while (n > 1 && gcd(s, n) !== 1) s++; return s; };

const LoopTile = memo(function LoopTile({ name, icon, color, offset, period, running }: { name: string; icon: KubaiIconData; color: string; offset: number; period: number; running: boolean }) {
  const [turn, setTurn] = useState(false);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!running || held) return;
    // Turns are read from the page clock, so throttled timers cannot bring tiles into step.
    const phase = () => (performance.now() + period - offset) % period;
    let timer = 0;
    const play = () => { setTurn(true); timer = window.setTimeout(rest, Math.max(0, HOLD - phase())); };
    const rest = () => { setTurn(false); timer = window.setTimeout(play, period - phase() + 1); };
    timer = window.setTimeout(play, period - phase() + 1);
    return () => { window.clearTimeout(timer); setTurn(false); };
  }, [running, held, offset, period]);
  return (
    <div
      title={name}
      className={cn(tile({ interactive: false }), "aspect-square")}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
    >
      <KubaiIcon icon={icon} size={28} color={color} trigger="none" hover={turn || held} />
    </div>
  );
});

export function DuotoneWall({ color = "#5A76F2", onlyBases = true }: { color?: string; onlyBases?: boolean }) {
  const [icons, setIcons] = useState<{ meta: IconMeta; icon: KubaiIconData }[] | null>(null);
  const [running, setRunning] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let live = true;
    loadIndex().then(async (index) => {
      const list = index.duotone.filter((m) => !onlyBases || !m.base);
      if (list[0]) await loadIcon(list[0]);
      if (live) setIcons(list.flatMap((meta) => { const icon = peekIcon(meta.name, "duotone"); return icon ? [{ meta, icon }] : []; }));
    }).catch(() => { /* the page reads without it */ });
    return () => { live = false; };
  }, [onlyBases]);
  // The loop runs only while the wall is on screen, and not at all with reduced motion.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const n = icons?.length ?? 0, period = Math.max(1, n) * PER_TILE, stride = strideFor(n);
  return (
    <div ref={ref} className="not-prose my-6 grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-2">
      {(icons ?? []).map(({ meta, icon }, i) => (
        <LoopTile key={meta.name} name={meta.name} icon={icon} color={color} offset={((i * stride) % n) * PER_TILE} period={period} running={running} />
      ))}
      {!icons && Array.from({ length: 24 }, (_, i) => <div key={i} className={cn(tile({ interactive: false }), "aspect-square")} />)}
    </div>
  );
}
