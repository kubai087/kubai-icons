"use client";
// The home page's note on the styles: the same objects in the layered, two-tone and line styles,
// swapped in place by a switch, opening on the newest one. While on screen, the icons play their motion on staggered beats, as on the hero
// wall; an icon under the pointer holds its hover pose.
import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/kit/ui-icons";
import {
  Bell, Calendar, Camera, Folder, Gift, Home, Lightbulb, Lock, Mail, Mic, Music, Settings, ShoppingCart, Trash, Wifi,
} from "kubai-icons-react";
import {
  Bell as BellDuo, Calendar as CalendarDuo, Camera as CameraDuo, Folder as FolderDuo, Gift as GiftDuo, Home as HomeDuo,
  Lightbulb as LightbulbDuo, Lock as LockDuo, Mail as MailDuo, Mic as MicDuo, Music as MusicDuo, Settings as SettingsDuo,
  ShoppingCart as ShoppingCartDuo, Trash as TrashDuo, Wifi as WifiDuo,
} from "kubai-icons-react/duotone";
import {
  Bell as BellLine, Calendar as CalendarLine, Camera as CameraLine, Folder as FolderLine, Gift as GiftLine, Home as HomeLine,
  Lightbulb as LightbulbLine, Lock as LockLine, Mail as MailLine, Mic as MicLine, Music as MusicLine, Settings as SettingsLine,
  ShoppingCart as ShoppingCartLine, Trash as TrashLine, Wifi as WifiLine,
} from "kubai-icons-react/line";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/kit/segmented";
import { panel, tile } from "@/components/kit/styles";
import { WallPause } from "@/components/kit/wall-pause";
import { hasIconPages } from "@/lib/i18n";
import type { IconStyle } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { STYLE_OPTIONS } from "@/components/browser/prefs";
import { useOnScreen, useWallLoop } from "@/lib/wall-motion";
import { useLocale, useLocalize, useTr } from "@/lib/use-locale";
import { LINE_VARIANTS, type LineVariant } from "@/lib/line";
import { setLineSettings, useLineSettings } from "@/lib/line-settings";
import { setBandStyle, useBandStyle } from "@/lib/band-style";
import { LineIcon } from "@/components/kit/line-icon";

/** Fifteen objects every style draws, each as [layered, two-tone, line], mixed so neighbours differ. */
const SETS = [
  [Folder, FolderDuo, FolderLine], [Bell, BellDuo, BellLine], [Lock, LockDuo, LockLine], [Mail, MailDuo, MailLine], [Lightbulb, LightbulbDuo, LightbulbLine],
  [Camera, CameraDuo, CameraLine], [ShoppingCart, ShoppingCartDuo, ShoppingCartLine], [Gift, GiftDuo, GiftLine], [Settings, SettingsDuo, SettingsLine], [Music, MusicDuo, MusicLine],
  [Trash, TrashDuo, TrashLine], [Home, HomeDuo, HomeLine], [Mic, MicDuo, MicLine], [Calendar, CalendarDuo, CalendarLine], [Wifi, WifiDuo, WifiLine],
] as const;

type IconComponent = (typeof SETS)[number][number];
const SLOT: Record<IconStyle, number> = { layered: 0, duotone: 1, line: 2 };

/** The two-tone style's primary colour; every style uses it, so only the drawing differs. */
const COLOR = "#5A76F2";
/** Time in the hover pose, and how much loop each tile adds, in milliseconds (as the other walls). */
const HOLD = 1400;
const PER_TILE = 450;
const PERIOD = SETS.length * PER_TILE;
/** Steps through the slots by 7: on five columns, touching tiles play at least a third of a loop apart. */
const offsetOf = (i: number) => ((i * 7) % SETS.length) * PER_TILE;

const BandTile = memo(function BandTile({ Icon, style, variant, stroke, offset, running }: { Icon: IconComponent; style: IconStyle; variant: LineVariant; stroke: number; offset: number; running: boolean }) {
  const [turn, setTurn] = useState(false);
  const [held, setHeld] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  useEffect(() => {
    if (!running || !onScreen || held) return;
    // Turns are read from the page clock, so throttled timers cannot bring tiles into step.
    const phase = () => (performance.now() + PERIOD - offset) % PERIOD;
    let timer = 0;
    const play = () => { setTurn(true); timer = window.setTimeout(rest, Math.max(0, HOLD - phase())); };
    const rest = () => { setTurn(false); timer = window.setTimeout(play, PERIOD - phase() + 1); };
    timer = window.setTimeout(play, PERIOD - phase() + 1);
    return () => { window.clearTimeout(timer); setTurn(false); };
  }, [running, onScreen, held, offset]);
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(tile(), "aspect-square")}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
    >
      {/* Keyed by style and line variant, so a switch fades the new drawing in. */}
      <span key={style === "line" ? `line-${variant}` : style} className="swap-pop grid">
        <Icon size={36} color={COLOR} trigger="none" hover={turn || held} {...(style === "line" ? { strokeWidth: stroke, variant } : {})} />
      </span>
    </div>
  );
});

/** The styles on the home page: a few objects to switch between them, and where to find the newest one. */
export function StyleBand({ className }: { className?: string }) {
  const tr = useTr();
  const loc = useLocalize();
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  // Shared with the feature cards below, which follow it; line draws at the browser's variant and stroke.
  const style = useBandStyle();
  const line = useLineSettings();
  // The loop runs only while the icons are on screen, unless paused or with reduced motion.
  const running = useWallLoop(ref);

  return (
    <section aria-labelledby="style-band" className={cn(panel, "grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-14 lg:p-10", className)}>
      <div className="space-y-6">
        <div className="space-y-3">
          <span className="inline-flex h-6 items-center rounded-pill bg-[#5A76F2]/10 px-2.5 text-caption font-medium text-[#4B66E0] dark:bg-[#5A76F2]/20 dark:text-[#AEBCF8]">
            {tr("New", "新增")}
          </span>
          <h2 id="style-band" className="font-heading text-title font-semibold text-balance">{tr("Now in line style", "现已提供线性风格")}</h2>
          <p className="max-w-md text-body text-muted-foreground text-pretty">
            {tr(
              "The same icons, also drawn in rounded lines on a 24 grid: any stroke width from 0.25 to 3, in line, line two-tone, solid and solid tint. Each one still moves on hover.",
              "同一套图标新增线性画法：24 网格，粗细可在 0.25 到 3 之间调整，提供线性、线性双色、面性和面性填充四种变体，悬停时同样播放动效。"
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            value={style}
            onChange={setBandStyle}
            label={tr("Style", "风格")}
            options={STYLE_OPTIONS.map((o) => ({ value: o.value, label: tr(o.en, o.zh) }))}
          />
          {style === "line" && (
            // The four line variants as small samples of themselves; their names show on hover.
            <Segmented
              value={line.variant}
              onChange={(variant) => setLineSettings({ variant })}
              label={tr("Variant", "变体")}
              dense
              options={LINE_VARIANTS.map((o) => ({ value: o.value, title: tr(o.en, o.zh), label: <span className="pointer-events-none"><LineIcon name="camera" size={18} color="currentColor" variant={o.value} s={2} /><span className="sr-only">{tr(o.en, o.zh)}</span></span> }))}
            />
          )}
          <WallPause />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" nativeButton={false} render={<Link href={loc(`/icons/?style=${style === "layered" ? "line" : style}`)} />}>
            {style === "duotone" ? tr("Browse two-tone icons", "浏览双色图标") : tr("Browse line icons", "浏览线性图标")}
            <ChevronRightIcon data-icon="inline-end" className="rtl:rotate-180 transition-[translate] duration-200 group-hover/button:translate-x-0.5 motion-reduce:transition-none" />
          </Button>
          {/* The guide is written in English and Simplified Chinese only. */}
          {hasIconPages(locale) && (
            <Button size="lg" variant="ghost" nativeButton={false} className="text-muted-foreground max-sm:px-0" render={<Link href={loc(style === "duotone" ? "/docs/guides/duotone/" : "/docs/guides/line/")} />}>
              {tr("Read the guide", "查看指南")}
            </Button>
          )}
        </div>
      </div>
      <div ref={ref} className="grid grid-cols-5 gap-tiles">
        {SETS.map((set, i) => (
          <BandTile key={i} Icon={set[SLOT[style]]} style={style} variant={line.variant} stroke={line.s} offset={offsetOf(i)} running={running} />
        ))}
      </div>
    </section>
  );
}
