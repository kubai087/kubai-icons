"use client";
// The home page's note on the two-tone style: the same objects in both styles, swapped in place
// by a switch. While on screen, the icons play their motion on staggered beats, as on the hero
// wall; an icon under the pointer holds its hover pose.
import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RiArrowRightSLine } from "@remixicon/react";
import {
  Bell, Calendar, Camera, Folder, Gift, Home, Lightbulb, Lock, Mail, Mic, Music, Settings, ShoppingCart, Trash, Wifi,
} from "kubai-icons-react";
import {
  Bell as BellDuo, Calendar as CalendarDuo, Camera as CameraDuo, Folder as FolderDuo, Gift as GiftDuo, Home as HomeDuo,
  Lightbulb as LightbulbDuo, Lock as LockDuo, Mail as MailDuo, Mic as MicDuo, Music as MusicDuo, Settings as SettingsDuo,
  ShoppingCart as ShoppingCartDuo, Trash as TrashDuo, Wifi as WifiDuo,
} from "kubai-icons-react/duotone";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/kit/segmented";
import { panel, tile } from "@/components/kit/styles";
import { WallPause } from "@/components/kit/wall-pause";
import { hasIconPages } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useWallLoop } from "@/lib/wall-motion";
import { useLocale, useLocalize, useTr } from "@/lib/use-locale";

/** Fifteen objects both styles draw, each as [layered, two-tone], mixed so neighbours differ. */
const PAIRS = [
  [Folder, FolderDuo], [Bell, BellDuo], [Lock, LockDuo], [Mail, MailDuo], [Lightbulb, LightbulbDuo],
  [Camera, CameraDuo], [ShoppingCart, ShoppingCartDuo], [Gift, GiftDuo], [Settings, SettingsDuo], [Music, MusicDuo],
  [Trash, TrashDuo], [Home, HomeDuo], [Mic, MicDuo], [Calendar, CalendarDuo], [Wifi, WifiDuo],
] as const;

type Style = "layered" | "duotone";
type IconComponent = (typeof PAIRS)[number][number];

/** The two-tone style's primary colour; both styles use it, so only the drawing differs. */
const COLOR = "#5A76F2";
/** Time in the hover pose, and how much loop each tile adds, in milliseconds (as the other walls). */
const HOLD = 1400;
const PER_TILE = 450;
const PERIOD = PAIRS.length * PER_TILE;
/** Steps through the slots by 7: on five columns, touching tiles play at least a third of a loop apart. */
const offsetOf = (i: number) => ((i * 7) % PAIRS.length) * PER_TILE;

const BandTile = memo(function BandTile({ Icon, style, offset, running }: { Icon: IconComponent; style: Style; offset: number; running: boolean }) {
  const [turn, setTurn] = useState(false);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!running || held) return;
    // Turns are read from the page clock, so throttled timers cannot bring tiles into step.
    const phase = () => (performance.now() + PERIOD - offset) % PERIOD;
    let timer = 0;
    const play = () => { setTurn(true); timer = window.setTimeout(rest, Math.max(0, HOLD - phase())); };
    const rest = () => { setTurn(false); timer = window.setTimeout(play, PERIOD - phase() + 1); };
    timer = window.setTimeout(play, PERIOD - phase() + 1);
    return () => { window.clearTimeout(timer); setTurn(false); };
  }, [running, held, offset]);
  return (
    <div
      aria-hidden
      className={cn(tile(), "aspect-square")}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
    >
      {/* Keyed by style, so a switch fades the new drawing in. */}
      <span key={style} className="swap-in grid">
        <Icon size={36} color={COLOR} trigger="none" hover={turn || held} />
      </span>
    </div>
  );
});

/** The two-tone style on the home page: a few objects to switch between styles, and where to find the rest. */
export function DuotoneBand({ className }: { className?: string }) {
  const tr = useTr();
  const loc = useLocalize();
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<Style>("duotone");
  // The loop runs only while the icons are on screen, unless paused or with reduced motion.
  const running = useWallLoop(ref);

  return (
    <section aria-labelledby="duotone-band" className={cn(panel, "grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-14 lg:p-10", className)}>
      <div className="space-y-6">
        <div className="space-y-3">
          <span className="inline-flex h-6 items-center rounded-pill bg-[#5A76F2]/10 px-2.5 text-caption font-medium text-[#4B66E0] dark:bg-[#5A76F2]/20 dark:text-[#AEBCF8]">
            {tr("New", "新增")}
          </span>
          <h2 id="duotone-band" className="font-heading text-title font-semibold text-balance">{tr("Now in two-tone", "现已提供双色风格")}</h2>
          <p className="max-w-md text-body text-muted-foreground text-pretty">
            {tr(
              "The same icons, also drawn as solid shapes on a 16 grid: a light body with accents in your color. Each one still moves on hover.",
              "同一套图标新增面性画法：16 网格，浅色主体配主色点缀，悬停时同样播放动效。"
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Segmented
            value={style}
            onChange={setStyle}
            label={tr("Style", "风格")}
            options={[{ value: "layered", label: tr("Layered", "分层") }, { value: "duotone", label: tr("Two-tone", "双色") }]}
          />
          <WallPause />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" nativeButton={false} render={<Link href={loc("/icons/?style=duotone")} />}>
            {tr("Browse two-tone icons", "浏览双色图标")}
            <RiArrowRightSLine data-icon="inline-end" className="rtl:rotate-180 transition-[translate] duration-200 group-hover/button:translate-x-0.5 motion-reduce:transition-none" />
          </Button>
          {/* The guide is written in English and Simplified Chinese only. */}
          {hasIconPages(locale) && (
            <Button size="lg" variant="ghost" nativeButton={false} className="text-muted-foreground max-sm:px-0" render={<Link href={loc("/docs/guides/duotone/")} />}>
              {tr("Read the guide", "查看指南")}
            </Button>
          )}
        </div>
      </div>
      <div ref={ref} className="grid grid-cols-5 gap-tiles">
        {PAIRS.map(([layered, duo], i) => (
          <BandTile key={i} Icon={style === "duotone" ? duo : layered} style={style} offset={offsetOf(i)} running={running} />
        ))}
      </div>
    </section>
  );
}
