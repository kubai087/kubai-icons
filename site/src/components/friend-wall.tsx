"use client";
import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Link, Globe, Bookmark, Users, Heart, Star, Mail, Send, Gift, Rocket,
  Compass, Share, MessageCircle, Coffee, Sparkles, Planet, Paperclip, PartyPopper, Puzzle, ThumbsUp, Smile,
} from "kubai-icons-react";
import { RiArrowRightUpLine } from "@remixicon/react";
import { tile } from "@/components/kit/styles";
import { cn } from "@/lib/utils";

export type WallFriend = { slug: string; name: string; site: string; host: string; image: string };

const ICONS = [Smile, Heart, Globe, Mail, Rocket, Bookmark, Coffee, Users, Star, Send, Gift, Compass, MessageCircle, Sparkles, Planet, Share, Paperclip, PartyPopper, Puzzle, ThumbsUp];
const COLORS = ["#5393FF", "#EC4899", "#06B6D4", "#6366F1", "#F97316", "#8B5CF6", "#F43F5E", "#22C55E", "#F59E0B", "#0284C7"];

/**
 * How many icon tiles show at each width, so friends (two tiles each) and icons fill whole
 * rows: 4 columns × 8 rows, 6 × 6, 8 × 5 and 10 × 4. Later tiles hide at narrower widths.
 */
const shownFrom = (i: number) => (i >= 16 ? "hidden lg:grid" : i >= 12 ? "hidden sm:grid" : "");

/** Length of one tile's loop, and the part of it spent in the hover pose, in milliseconds. */
const PERIOD = 7200;
const HOLD = 1400;

type TileProps = { Icon: (typeof ICONS)[number]; color: string; offset: number; running: boolean; className?: string; style?: CSSProperties };

/** An icon tile that plays its motion on its own beat while on screen, and holds it under the pointer. */
const LoopTile = memo(function LoopTile({ Icon, color, offset, running, className, style }: TileProps) {
  const [turn, setTurn] = useState(false);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!running || held) return;
    // Turns are read from the page clock, so throttled timers cannot bring tiles into step.
    const phase = () => (performance.now() + PERIOD - offset) % PERIOD;
    let timer = 0;
    const play = () => {
      setTurn(true);
      timer = window.setTimeout(rest, Math.max(0, HOLD - phase()));
    };
    const rest = () => {
      setTurn(false);
      timer = window.setTimeout(play, PERIOD - phase() + 1);
    };
    timer = window.setTimeout(play, PERIOD - phase() + 1);
    return () => {
      window.clearTimeout(timer);
      setTurn(false);
    };
  }, [running, held, offset]);
  return (
    <div
      aria-hidden
      className={cn(tile(), "rise-in size-full", className)}
      style={style}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
    >
      <Icon size={36} color={color} trigger="none" hover={turn || held} />
    </div>
  );
});

type Item = { kind: "icon"; i: number } | { kind: "friend"; f: WallFriend } | { kind: "invite" };

/**
 * Friends' sites set into a wall of moving icons, like the one on the home page: each
 * friend's share image takes two tiles, icons fill the rest and loop their motion on
 * staggered beats while the wall is on screen. The last card asks for a link exchange.
 */
export function FriendWall({ friends, invite }: { friends: WallFriend[]; invite: { title: string; action: string; href: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // One or two icons between friends, then the rest, so icons always remain to fill gaps.
  const items: Item[] = [];
  let next = 0;
  [...friends.map((f) => ({ kind: "friend", f }) as Item), { kind: "invite" } as Item].forEach((card, n) => {
    for (let k = 0; k < (n % 2 ? 2 : 1) && next < 12; k++) items.push({ kind: "icon", i: next++ });
    items.push(card);
  });
  while (next < ICONS.length) items.push({ kind: "icon", i: next++ });

  return (
    // Rows are sized so two tiles and a gap make exactly 1200 × 630, the usual share-image
    // shape, so friends' images show whole; a row of friends alone keeps its height too.
    <div className="@container">
    <div
      ref={ref}
      className="grid grid-flow-row-dense grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-tiles [--cols:4] sm:[--cols:6] lg:[--cols:8] xl:[--cols:10]"
      style={{ gridAutoRows: "calc((2 * (100cqw - (var(--cols) - 1) * var(--spacing-tiles)) / var(--cols) + var(--spacing-tiles)) * 630 / 1200)" }}
    >
      {items.map((item, n) => {
        const rise = { "--i": 1 + Math.floor(n / 4) } as CSSProperties;
        if (item.kind === "icon") {
          const Icon = ICONS[item.i];
          return (
            <LoopTile key={`icon-${item.i}`} Icon={Icon} color={COLORS[item.i % COLORS.length]} offset={(((item.i * 7) % ICONS.length) / ICONS.length) * PERIOD} running={running} className={shownFrom(item.i)} style={rise} />
          );
        }
        if (item.kind === "invite") {
          return (
            <a
              key="invite"
              href={invite.href}
              target="_blank"
              rel="noreferrer"
              className={cn(tile(), "group rise-in col-span-2 flex items-center justify-start gap-3 px-5 text-start")}
              style={rise}
            >
              <Link size={32} color="#5393FF" trigger="parent" className="shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-control font-medium">{invite.title}</span>
                <span className="flex items-center gap-0.5 text-caption text-muted-foreground transition-colors group-hover:text-foreground">
                  <span className="truncate">{invite.action}</span>
                  <RiArrowRightUpLine aria-hidden className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
                </span>
              </span>
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
              <img
                src={f.image}
                alt=""
                width={1200}
                height={630}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
              {/* Inset 6px with the card's radius less 6px, so the two corners share a centre. */}
              <span className="absolute bottom-1.5 left-1.5 flex max-w-[calc(100%-0.75rem)] items-center rounded-[calc(var(--radius-tile)-6px)] bg-background/60 px-2.5 py-1 text-caption shadow-sm ring-1 ring-foreground/10 backdrop-blur-md backdrop-saturate-150">
                <span className="shrink-0 font-medium">{f.name}</span>
                <span className="grid grid-cols-[0fr] opacity-0 transition-[grid-template-columns,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:grid-cols-[1fr] group-hover:opacity-100 group-focus-visible:grid-cols-[1fr] group-focus-visible:opacity-100 motion-reduce:transition-none">
                  <span className="min-w-0 truncate ps-1.5 text-muted-foreground">{f.host}</span>
                </span>
              </span>
            </a>
        );
      })}
    </div>
    </div>
  );
}
