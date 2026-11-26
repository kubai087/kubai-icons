"use client";
// Every icon of the two-tone or the line style, live. While the wall is on screen, the icons play
// their motion in a diagonal wave from the top left, which repeats every few seconds; an icon
// under the pointer holds its hover pose. Loads the style's one chunk.
import { memo, useEffect, useRef, useState } from "react";
import { KubaiIcon } from "kubai-icons-react";
import type { KubaiIconData } from "kubai-icons";
import { loadIcon, loadIndex, peekIcon, type IconMeta } from "@/lib/icons";
import { LINE_STROKES, LINE_VARIANTS, type LineVariant } from "@/lib/line";
import { setLineSettings, useLineSettings } from "@/lib/line-settings";
import { LineVariantSample } from "@/components/kit/line-variant-sample";
import { Segmented } from "@/components/kit/segmented";
import { useTr } from "@/lib/use-locale";
import { tile } from "@/components/kit/styles";
import { WallPause } from "@/components/kit/wall-pause";
import { cn } from "@/lib/utils";
import { useOnScreen, useWallLoop } from "@/lib/wall-motion";

/** Time in the hover pose, the delay from one diagonal to the next, and the rest after a wave, in milliseconds. */
const HOLD = 1400;
const STEP = 220;
const REST = 2000;
/** Diagonals beyond the column count in one wave: rows further down start the next wave. */
const SPAN = 6;

type Look = { strokeWidth?: number; variant?: LineVariant };

const LoopTile = memo(function LoopTile({ name, icon, color, look, offset, period, running }: { name: string; icon: KubaiIconData; color: string; look: Look; offset: number; period: number; running: boolean }) {
  const [turn, setTurn] = useState(false);
  const [held, setHeld] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  useEffect(() => {
    if (!running || !onScreen || held) return;
    // Turns are read from the page clock, so throttled timers cannot bring tiles into step.
    const phase = () => (performance.now() + period - offset) % period;
    let timer = 0;
    const play = () => { setTurn(true); timer = window.setTimeout(rest, Math.max(0, HOLD - phase())); };
    const rest = () => { setTurn(false); timer = window.setTimeout(play, period - phase() + 1); };
    timer = window.setTimeout(play, period - phase() + 1);
    return () => { window.clearTimeout(timer); setTurn(false); };
  }, [running, onScreen, held, offset, period]);
  return (
    <div
      ref={ref}
      title={name}
      className={cn(tile({ interactive: false }), "aspect-square")}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
    >
      <KubaiIcon icon={icon} size={28} color={color} trigger="none" hover={turn || held} strokeWidth={look.strokeWidth} variant={look.variant} />
    </div>
  );
});

function StyleWall({ iconStyle, color = "#5A76F2", look = {}, controls }: { iconStyle: "duotone" | "line"; color?: string; look?: Look; controls?: React.ReactNode }) {
  const [icons, setIcons] = useState<{ meta: IconMeta; icon: KubaiIconData }[] | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  // The loop runs only while the wall is on screen, unless paused or with reduced motion.
  const running = useWallLoop(ref);
  // The column count, read from the grid, places each tile on its diagonal.
  const [cols, setCols] = useState(8);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setCols(Math.max(1, getComputedStyle(el).gridTemplateColumns.split(" ").length));
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [icons]);
  useEffect(() => {
    let live = true;
    loadIndex().then(async (index) => {
      const list = index[iconStyle].filter((m) => !m.base);
      if (list[0]) await loadIcon(list[0]);
      if (live) setIcons(list.flatMap((meta) => { const icon = peekIcon(meta.name, iconStyle); return icon ? [{ meta, icon }] : []; }));
    }).catch(() => { /* the page reads without it */ });
    return () => { live = false; };
  }, [iconStyle]);
  const D = cols + SPAN, period = D * STEP + REST;
  const offsetOf = (i: number) => ((Math.floor(i / cols) + (i % cols)) % D) * STEP;
  return (
    <div className="not-prose my-6">
      {/* Above the wall, so they are found before the motion. */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">{controls ?? <span />}<WallPause /></div>
      <div ref={ref} className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-2">
        {(icons ?? []).map(({ meta, icon }, i) => (
          <LoopTile key={meta.name} name={meta.name} icon={icon} color={color} look={look} offset={offsetOf(i)} period={period} running={running} />
        ))}
        {!icons && Array.from({ length: 24 }, (_, i) => <div key={i} className={cn(tile({ interactive: false }), "aspect-square")} />)}
      </div>
    </div>
  );
}

/** Every two-tone icon. */
export const DuotoneWall = ({ color }: { color?: string }) => <StyleWall iconStyle="duotone" color={color} />;
/** Every line icon, with switches for the variant and the stroke width; the choice is the icon browser's. */
export function LineWall({ color }: { color?: string }) {
  const tr = useTr();
  const settings = useLineSettings();
  const controls = (
    <div className="flex flex-wrap items-center gap-3">
      <Segmented
        value={settings.variant}
        onChange={(variant) => setLineSettings({ variant })}
        label={tr("Variant", "变体")}
        dense
        options={LINE_VARIANTS.map((o) => ({ value: o.value, title: tr(o.en, o.zh), label: <span className="pointer-events-none"><LineVariantSample variant={o.value} /><span className="sr-only">{tr(o.en, o.zh)}</span></span> }))}
      />
      <Segmented
        value={String(settings.s)}
        onChange={(v) => setLineSettings({ s: Number(v) })}
        label={tr("Stroke width", "粗细")}
        options={LINE_STROKES.map((w) => ({ value: String(w), label: String(w) }))}
      />
    </div>
  );
  return <StyleWall iconStyle="line" color={color} look={{ strokeWidth: settings.s, variant: settings.variant }} controls={controls} />;
}
