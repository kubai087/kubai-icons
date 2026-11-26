"use client";
import { useState, type ReactNode } from "react";
import { Bell, Download, Folder, FolderCheck, FolderLock, FolderPlus, FolderX, Gift, Heart, Lock, Mail, Star, Trash } from "kubai-icons-react";
import * as Duo from "kubai-icons-react/duotone";
import * as Line from "kubai-icons-react/line";
import type { IconStyle } from "@/lib/icons";
import { useBandStyle } from "@/lib/band-style";
import { useLineSettings } from "@/lib/line-settings";
import { Segmented } from "@/components/kit/segmented";
import { Swatches } from "@/components/kit/swatches";
import { tile } from "@/components/kit/styles";
import { SWATCHES } from "@/lib/palette";
import { MODULE_DEMO } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useTr } from "@/lib/use-locale";

// Each card's examples in the three styles; the cards follow the style band above them.
type Icons = Record<IconStyle, React.ComponentType<Record<string, unknown>>[]>;
const MOTION: Icons = { layered: [Mail, Trash, Gift, Download], duotone: [Duo.Mail, Duo.Trash, Duo.Gift, Duo.Download], line: [Line.Mail, Line.Trash, Line.Gift, Line.Download] } as unknown as Icons;
const COLOR: Icons = { layered: [Folder, Heart, Star, Bell], duotone: [Duo.Folder, Duo.Heart, Duo.Star, Duo.Bell], line: [Line.Folder, Line.Heart, Line.Star, Line.Bell] } as unknown as Icons;
// Two-tone has fewer badged folders, so it shows other badged states.
const BADGES: Icons = { layered: [FolderPlus, FolderCheck, FolderX, FolderLock], duotone: [Duo.FolderPlus, Duo.CalendarCheck, Duo.UserCheck, Duo.BellOff], line: [Line.FolderPlus, Line.FolderCheck, Line.FolderX, Line.FolderLock] } as unknown as Icons;
/** In the order of MODULE_DEMO. */
const MODULES: Icons = { layered: [Folder, Bell, Lock, Mail], duotone: [Duo.Folder, Duo.Bell, Duo.Lock, Duo.Mail], line: [Line.Folder, Line.Bell, Line.Lock, Line.Mail] } as unknown as Icons;

/** The style the cards draw in, and the props a line icon takes for the chosen variant and stroke. */
function useLook() {
  const style = useBandStyle();
  const line = useLineSettings();
  return { style, extra: style === "line" ? { strokeWidth: line.s, variant: line.variant } : {} };
}

const ICON = 36;

function Card({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 bg-background p-panel">
      <div className="flex min-h-22 flex-col justify-between gap-3">{children}</div>
      <div className="space-y-1.5">
        <h2 className="font-medium">{title}</h2>
        <p className="text-body text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

const Row = ({ children }: { children: ReactNode }) => <div className="flex items-center gap-3">{children}</div>;

const MOTION_COLORS = ["#5393FF", "#F43F5E", "#22C55E", "#F97316"];

function MotionCard() {
  const tr = useTr();
  const { style, extra } = useLook();
  return (
    <Card title={tr("Motion", "动效")} body={tr("Animates on interaction and respects reduced motion.", "随交互播放，并遵循系统的“减弱动态效果”设置")}>
      <Row>
        {MOTION[style].map((Icon, i) => <Icon key={`${style}${i}`} size={ICON} color={MOTION_COLORS[i]} {...extra} />)}
      </Row>
      <p className="flex h-8 items-center text-caption text-muted-foreground">{tr("Hover or tap to play", "悬停或点击播放")}</p>
    </Card>
  );
}

function ColorCard() {
  const tr = useTr();
  const [color, setColor] = useState(SWATCHES[0].value);
  const { style, extra } = useLook();
  return (
    <Card title={tr("Color", "配色")} body={tr("All tones are derived from a single accent color.", "所有色调均由同一主色派生")}>
      <Row>
        {COLOR[style].map((Icon, i) => <Icon key={`${style}${i}`} size={ICON} color={color} {...extra} />)}
      </Row>
      <Swatches className="min-h-8" value={color} options={SWATCHES.slice(0, 4)} onChange={setColor} label={tr("Accent color", "主色")} customLabel={tr("Custom color", "自定义颜色")} hexLabel={tr("Hex color", "十六进制颜色")} />
    </Card>
  );
}

function BadgesCard() {
  const tr = useTr();
  const [tone, setTone] = useState<"mono" | "semantic">("semantic");
  const badgeColor = tone === "semantic" ? "semantic" : undefined;
  const { style, extra } = useLook();
  return (
    <Card title={tr("Badges", "角标")} body={tr("Common states are provided as badged variants.", "常用状态均提供对应角标")}>
      <Row>
        {BADGES[style].map((Icon, i) => <Icon key={`${style}${i}`} size={ICON} color="#5393FF" badgeColor={style === "duotone" ? undefined : badgeColor} {...extra} />)}
      </Row>
      {/* Layered and line badges take their own colour; two-tone draws the mark in the icon's colours. */}
      {style !== "duotone" ? (
        <Segmented value={tone} onChange={setTone} label={tr("Badge color", "角标颜色")} options={[{ value: "mono", label: tr("Mono", "单色") }, { value: "semantic", label: tr("Color", "彩色") }]} />
      ) : (
        <p className="flex h-8 items-center text-caption text-muted-foreground">{tr("Drawn in the icon's own color", "角标与图标同色")}</p>
      )}
    </Card>
  );
}

function ModulesCard({ sizes }: { sizes: Record<IconStyle, number[]> }) {
  const tr = useTr();
  const { style, extra } = useLook();
  // Sizes per style; a missing entry shows the count without a size instead of failing.
  const bytes = (Array.isArray(sizes) ? sizes : sizes?.[style]) ?? [];
  const [picked, setPicked] = useState([0]);
  const toggle = (i: number) => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  const total = picked.reduce((sum, i) => sum + bytes[i], 0);
  const known = bytes.length > 0 && bytes.every(Boolean);
  const size = (total / 1000).toFixed(1);
  const summary = known ? tr("{count} imported, {size} KB gzipped", "已引入 {count} 个，gzip 后 {size} KB", { count: picked.length, size }) : tr("{count} imported", "已引入 {count} 个", { count: picked.length });
  return (
    <Card title={tr("Modules", "模块")} body={tr("Icons are separate ES modules, bundled on import.", "每个图标均为独立的 ES 模块，仅在导入时打包")}>
      <div className="flex items-center gap-1.5">
        {MODULES[style].map((Icon, i) => {
          const on = picked.includes(i);
          return (
            <button key={i} type="button" aria-pressed={on} aria-label={tr("Import {name}", "引入 {name}", { name: MODULE_DEMO[i] })} data-kubai-trigger onClick={() => toggle(i)} className={cn(tile({ active: on }), "size-11 rounded-card")}>
              <Icon key={style} size={26} color="#8B5CF6" trigger="parent" {...extra} />
            </button>
          );
        })}
      </div>
      <p key={summary} className="flex h-8 items-center text-caption text-muted-foreground tabular-nums">{summary}</p>
    </Card>
  );
}

/** What sets the library apart, each point with something to try. */
export function FeatureCards({ moduleBytes, className }: { moduleBytes: Record<IconStyle, number[]>; className?: string }) {
  return (
    <section className={cn("grid gap-px overflow-hidden rounded-panel border bg-border sm:grid-cols-2 xl:grid-cols-4", className)}>
      <MotionCard />
      <ColorCard />
      <BadgesCard />
      <ModulesCard sizes={moduleBytes} />
    </section>
  );
}
