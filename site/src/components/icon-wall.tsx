"use client";
import { Fragment, memo, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  Astronaut, Ghost, Bot, Balloon, Crown, PartyPopper, Ufo, Rocket, Planet, Telescope, Boombox, Cassette, Turntable,
  Polaroid, CameraRetro, Guitar, Headphones, ArcadeMachine, GameConsole, Gamepad, RetroComputer, Typewriter, Dice,
  PlayingCards, Kite, Pinwheel, RollerSkate, Trophy, FerrisWheel, HotAirBalloon, Lighthouse, Windmill, Castle, Campfire,
  Magnet, Wand, Bomb, PiggyBank, Gift, Cake, Donut, IceCream, Popcorn, Sushi, Watermelon, Cat, Dog, Bee, Butterfly, Whale,
} from "kubai-icons-react";
import { RiTwitterXLine } from "@remixicon/react";
import { tile } from "@/components/kit/styles";
import { cn } from "@/lib/utils";

export type WallFriend = { slug: string; name: string; site: string; host: string; image: string; sponsored?: boolean };

/**
 * A card set into the wall. A `tall` card spans the whole row and two rows on phones, for a
 * share image; the others span the whole row once. Wider, every card takes two tiles.
 */
export type WallCard = { key: string; tall?: boolean; render: (style: CSSProperties) => ReactNode };

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

/**
 * Columns at each width, the fewest icons to show there, and the cells a tall card and a
 * short card take: on phones a card spans the whole row, wider it takes two tiles. Icons
 * fill the rest, so every row is full.
 */
const GRIDS = [
  { cols: 4, icons: 16, tall: 8, short: 4 },
  { cols: 6, icons: 30, tall: 2, short: 2 },
  { cols: 8, icons: 40, tall: 2, short: 2 },
  { cols: 10, icons: 48, tall: 2, short: 2 },
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

type Item = { kind: "icon"; k: number } | { kind: "card"; card: WallCard };

/**
 * Cards set into a wall of moving icons, like the one on the home page: the cards are spread
 * loosely through the wall and icons fill the rest, looping their motion on staggered beats
 * while the wall is on screen. The wall grows by whole rows to fit its cards.
 */
export function IconWall({ cards }: { cards: WallCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const counts = GRIDS.map((g) => {
    const used = cards.reduce((sum, c) => sum + (c.tall ? g.tall : g.short), 0);
    return Math.ceil((used + g.icons) / g.cols) * g.cols - used;
  });
  const total = Math.max(...counts);
  // Cards go in evenly between the icons, starting a little way in.
  const items: Item[] = [];
  let next = 0;
  for (let k = 0; k < total; k++) {
    if (next < cards.length && k >= Math.round(((next + 0.4) * total) / cards.length)) items.push({ kind: "card", card: cards[next++] });
    items.push({ kind: "icon", k });
  }
  while (next < cards.length) items.push({ kind: "card", card: cards[next++] });

  return (
    <div className="@container">
      <div
        ref={ref}
        className="grid grid-flow-row-dense grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-tiles [--cols:4] sm:[--cols:6] lg:[--cols:8] xl:[--cols:10]"
        // Square tiles: each row is one column wide, so a row of cards alone keeps its height.
        style={{ gridAutoRows: "calc((100cqw - (var(--cols) - 1) * var(--spacing-tiles)) / var(--cols))" }}
      >
        {items.map((item, n) => {
          const rise = { "--i": 1 + Math.floor(n / 6) } as CSSProperties;
          if (item.kind === "card") return <Fragment key={item.card.key}>{item.card.render(rise)}</Fragment>;
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
        })}
      </div>
    </div>
  );
}

/** A card for a place on the wall that is still open, linking to a message on X. */
function OpenCard({ title, action, href, style }: { title: string; action: string; href: string; style: CSSProperties }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group rise-in col-span-4 flex flex-col justify-center rounded-tile border border-dashed border-[#5393FF]/50 bg-[#5393FF]/5 px-4 leading-snug transition-colors hover:bg-[#5393FF]/10 sm:col-span-2"
      style={style}
    >
      <span className="truncate text-control font-semibold">{title}</span>
      <span className="flex items-center gap-1 truncate text-caption font-medium text-[#5393FF]">
        <RiTwitterXLine aria-hidden className="size-3 shrink-0" />
        {action}
      </span>
    </a>
  );
}

type Open = { title: string; action: string; href: string };

/** Partners' sites, each share image taking two tiles, with the open place in the middle. */
export function FriendWall({ friends, open }: { friends: WallFriend[]; open: Open }) {
  const sites: WallCard[] = friends.map((f) => ({
    key: f.slug,
    tall: true,
    render: (style: CSSProperties) => (
      <a
        href={f.site}
        target="_blank"
        rel={f.sponsored ? "sponsored noopener" : "noopener"}
        aria-label={`${f.name} (${f.host})`}
        className="group rise-in relative col-span-4 row-span-2 overflow-hidden rounded-tile sm:col-span-2 sm:row-span-1 bg-surface ring-1 ring-border transition-shadow hover:ring-foreground/20"
        style={style}
      >
        <img src={f.image} alt="" width={1200} height={630} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
        <span className="absolute bottom-1.5 left-1.5 flex h-[22px] max-w-[calc(100%-0.75rem)] items-center rounded-full bg-background/85 px-2.5 text-caption leading-none font-medium text-foreground shadow-[0_1px_3px_rgb(0_0_0/0.12)] ring-1 ring-foreground/10 backdrop-blur-sm">
          <span className="truncate">{f.name}</span>
        </span>
      </a>
    ),
  }));
  const cards = [...sites];
  cards.splice(Math.round(sites.length / 2), 0, {
    key: "open",
    render: (style) => <OpenCard title={open.title} action={open.action} href={open.href} style={style} />,
  });
  return <IconWall cards={cards} />;
}
