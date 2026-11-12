"use client";
import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Astronaut, Ghost, Bot, Balloon, Crown, PartyPopper, Ufo, Rocket, Planet, Telescope, Boombox, Cassette, Turntable,
  Polaroid, CameraRetro, Guitar, Headphones, ArcadeMachine, GameConsole, Gamepad, RetroComputer, Typewriter, Dice,
  PlayingCards, Kite, Pinwheel, RollerSkate, Trophy, FerrisWheel, HotAirBalloon, Lighthouse, Windmill, Castle, Campfire,
  Magnet, Wand, Bomb, PiggyBank, Gift, Cake, Donut, IceCream, Popcorn, Sushi, Watermelon, Cat, Dog, Bee, Butterfly, Whale,
  Link,
} from "kubai-icons-react";
import { RiTwitterXLine } from "@remixicon/react";
import { tile } from "@/components/kit/styles";
import { cn } from "@/lib/utils";

export type WallFriend = { slug: string; name: string; site: string; host: string; image: string };

/**
 * Fifty different icons, chosen to be fun and to read at a glance: characters, space,
 * retro music and games, toys, landmarks, sweets and animals. Mixed so neighbours differ.
 */
const ICONS = [
  Rocket, Cat, Boombox, Donut, FerrisWheel, Ghost, Dice, Polaroid, Planet, Bee,
  ArcadeMachine, IceCream, Lighthouse, Crown, Kite, Cassette, Ufo, Dog, Trophy, Sushi,
  Castle, Balloon, Gamepad, Whale, Telescope, Popcorn, Windmill, Wand, Turntable, Astronaut,
  Pinwheel, Cake, HotAirBalloon, Butterfly, GameConsole, PartyPopper, Guitar, Magnet, Watermelon, Bot,
  RollerSkate, Campfire, Typewriter, PiggyBank, Headphones, Bomb, PlayingCards, CameraRetro, Gift, RetroComputer,
];
const COLORS = ["#5393FF", "#EC4899", "#06B6D4", "#6366F1", "#F97316", "#8B5CF6", "#F43F5E", "#22C55E", "#F59E0B", "#0284C7"];
const BRAND = "#5393FF";

/**
 * Columns and rows at each width. Friends take two cells each; icons fill the rest, so every
 * row is full: 4 × 10, 6 × 9, 8 × 8 and 10 × 7.
 */
const GRIDS = [
  { cols: 4, rows: 10 },
  { cols: 6, rows: 9 },
  { cols: 8, rows: 8 },
  { cols: 10, rows: 7 },
];
const SHOW = [["", "hidden"], ["sm:grid", "sm:hidden"], ["lg:grid", "lg:hidden"], ["xl:grid", "xl:hidden"]] as const;

/** Picks `count` of `total` slots spread evenly, so icons drop out evenly as the wall narrows. */
const spread = (k: number, count: number, total: number) => Math.floor(((k + 1) * count) / total) > Math.floor((k * count) / total);

/**
 * Time in the hover pose, and how much loop each tile adds, in milliseconds. The loop
 * grows with the wall, so only three or four icons move at once however many there are:
 * every moving icon repaints its shadow and highlight filters.
 */
const HOLD = 1400;
const PER_TILE = 450;

type TileProps = { Icon: (typeof ICONS)[number]; color: string; offset: number; period: number; running: boolean; className?: string; style?: CSSProperties };

/** An icon tile that plays its motion on its own beat while on screen, and holds it under the pointer. */
const LoopTile = memo(function LoopTile({ Icon, color, offset, period, running, className, style }: TileProps) {
  const [turn, setTurn] = useState(false);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!running || held) return;
    // Turns are read from the page clock, so throttled timers cannot bring tiles into step.
    const phase = () => (performance.now() + period - offset) % period;
    let timer = 0;
    const play = () => {
      setTurn(true);
      timer = window.setTimeout(rest, Math.max(0, HOLD - phase()));
    };
    const rest = () => {
      setTurn(false);
      timer = window.setTimeout(play, period - phase() + 1);
    };
    timer = window.setTimeout(play, period - phase() + 1);
    return () => {
      window.clearTimeout(timer);
      setTurn(false);
    };
  }, [running, held, offset, period]);
  return (
    <div
      aria-hidden
      // Its own layer, so its repaints while moving leave the frosted name labels alone.
      className={cn(tile(), "rise-in size-full will-change-transform", className)}
      style={style}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
    >
      <Icon size={36} color={color} trigger="none" hover={turn || held} />
    </div>
  );
});

type Item = { kind: "icon"; k: number } | { kind: "friend"; f: WallFriend } | { kind: "invite" };

/**
 * Friends' sites set into a wall of moving icons, like the one on the home page: each
 * friend's share image takes two tiles, spread loosely through the wall, and icons fill the
 * rest, looping their motion on staggered beats while the wall is on screen. The last card
 * asks for a link exchange.
 */
export function FriendWall({ friends, invite }: { friends: WallFriend[]; invite: { label: string; href: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cards: Item[] = [...friends.map((f) => ({ kind: "friend", f }) as Item), { kind: "invite" }];
  // On phones the invite card spans the whole row (four tiles), so its button fits beside it.
  const counts = GRIDS.map((g, i) => g.cols * g.rows - cards.length * 2 - (i === 0 ? 2 : 0));
  const total = Math.max(...counts);
  // Cards go in evenly between the icons, starting a little way in.
  const items: Item[] = [];
  let next = 0;
  for (let k = 0; k < total; k++) {
    if (next < cards.length && k >= Math.round(((next + 0.4) * total) / cards.length)) items.push(cards[next++]);
    items.push({ kind: "icon", k });
  }
  while (next < cards.length) items.push(cards[next++]);

  return (
    <div className="@container">
      <div
        ref={ref}
        className="grid grid-flow-row-dense grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-tiles [--cols:4] sm:[--cols:6] lg:[--cols:8] xl:[--cols:10]"
        // Square tiles: each row is one column wide, so a row of friends alone keeps its height.
        style={{ gridAutoRows: "calc((100cqw - (var(--cols) - 1) * var(--spacing-tiles)) / var(--cols))" }}
      >
        {items.map((item, n) => {
          const rise = { "--i": 1 + Math.floor(n / 6) } as CSSProperties;
          if (item.kind === "icon") {
            const { k } = item;
            const shown = cn(GRIDS.map((_, g) => SHOW[g][spread(k, counts[g], total) ? 0 : 1]));
            return (
              <LoopTile
                key={`icon-${k}`}
                Icon={ICONS[k % ICONS.length]}
                color={COLORS[(k * 3) % COLORS.length]}
                offset={(((k * 7) % total) / total) * total * PER_TILE}
                period={total * PER_TILE}
                running={running}
                className={shown}
                style={rise}
              />
            );
          }
          if (item.kind === "invite") {
            return (
              <a
                key="invite"
                href={invite.href}
                target="_blank"
                rel="noreferrer"
                className="group rise-in col-span-4 flex items-center gap-3 rounded-tile bg-[#5393FF]/10 px-4 ring-1 ring-[#5393FF]/30 transition-colors hover:bg-[#5393FF]/15 sm:col-span-2"
                style={rise}
              >
                <Link size={32} color={BRAND} trigger="parent" className="shrink-0 sm:max-lg:hidden" />
                <span className="line-clamp-3 min-w-0 flex-1 text-control leading-snug font-medium text-pretty">{invite.label}</span>
                <RiTwitterXLine aria-hidden className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              </a>
            );
          }
          const { f } = item;
          return (
            <a
              key={f.slug}
              href={f.site}
              target="_blank"
              rel="noopener"
              aria-label={`${f.name} (${f.host})`}
              className="group rise-in relative col-span-2 overflow-hidden rounded-tile bg-surface ring-1 ring-border transition-shadow hover:ring-foreground/20"
              style={rise}
            >
              <img src={f.image} alt="" width={1200} height={630} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
              <span className="absolute bottom-1.5 left-1.5 flex h-[22px] max-w-[calc(100%-0.75rem)] items-center rounded-full bg-background/85 px-2.5 text-caption leading-none font-medium text-foreground shadow-[0_1px_3px_rgb(0_0_0/0.12)] ring-1 ring-foreground/10 backdrop-blur-sm">
                <span className="truncate">{f.name}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
