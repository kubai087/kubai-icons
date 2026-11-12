"use client";
import { useEffect, useRef, useState } from "react";
import { RiArrowRightUpLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

export type RingFriend = { slug: string; name: string; site: string; host: string; image: string };

/** Degrees per second while it turns on its own. */
const SPEED = 5;
/** At least this many cards go round the ring; the list repeats to fill it. */
const MIN_SLOTS = 16;
/** Space between cards, as a share of a card's width. */
const GAP = 0.08;
/** Cards further round than this are behind the viewer and stay hidden. */
const VISIBLE = 72;

const wrap = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

/**
 * Friends' cards on the inside of a turning ring, seen from near its centre: the card in
 * front sits furthest away and the ones at the sides come closer, so they grow and blur.
 * Each frame writes one transform on the ring; cards keep fixed places on it. A list
 * below names every friend and turns the ring to the one picked.
 */
export function FriendsRing({ friends }: { friends: RingFriend[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const goTo = useRef<(i: number) => void>(() => {});
  const [front, setFront] = useState(0);
  const count = friends.length;
  const slots = count * Math.ceil(MIN_SLOTS / count);
  const step = 360 / slots;

  useEffect(() => {
    const el = stage.current;
    const rg = ring.current;
    if (!el || !rg) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rot = 0;
    let vel = 0;
    let last = 0;
    let raf = 0;
    let hovering = false;
    let onScreen = true;
    let depth = 0;
    let pxToDeg = 0;
    let tween: { from: number; to: number; t0: number } | null = null;
    let drag: { x: number; t: number; moved: number; id: number } | null = null;
    let suppressClick = false;
    let frontNow = -1;
    const shown: boolean[] = [];

    const layout = () => {
      const w = el.clientWidth;
      const width = w < 640 ? w * 0.62 : Math.min(380, Math.max(260, w * 0.3));
      const height = (width * 630) / 1200;
      const radius = (slots * width * (1 + GAP)) / (2 * Math.PI);
      depth = radius * 0.86;
      pxToDeg = step / (width * (1 + GAP) * 0.85);
      el.style.setProperty("--card-w", `${width}px`);
      el.style.setProperty("--card-h", `${height}px`);
      el.style.perspective = `${radius * 1.05}px`;
      el.style.height = `${height * 1.75}px`;
      cards.current.forEach((c, i) => {
        if (c) c.style.transform = `rotateY(${-i * step}deg) translateZ(${-radius}px)`;
      });
    };

    const render = () => {
      rg.style.transform = `translateZ(${depth}px) rotateY(${rot}deg)`;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const on = Math.abs(wrap(rot - i * step)) < VISIBLE;
        if (shown[i] !== on) {
          shown[i] = on;
          c.style.visibility = on ? "" : "hidden";
        }
      });
      const f = ((Math.round(rot / step) % slots) + slots) % slots % count;
      if (f !== frontNow) {
        frontNow = f;
        setFront(f);
      }
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(0.064, (now - last) / 1000) : 0;
      last = now;
      let moving = true;
      if (tween) {
        const p = Math.min(1, (now - tween.t0) / 700);
        rot = tween.from + (tween.to - tween.from) * (1 - (1 - p) ** 3);
        if (p === 1) tween = null;
      } else if (drag) {
        moving = false;
      } else if (Math.abs(vel) > 0.5) {
        rot += vel * dt;
        vel *= 0.05 ** dt;
      } else if (!hovering && !reduce) {
        rot += SPEED * dt;
      } else {
        moving = false;
      }
      render();
      raf = moving && onScreen ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    };
    const kick = () => {
      if (!raf && onScreen) raf = requestAnimationFrame(tick);
    };

    goTo.current = (i: number) => {
      let best = Infinity;
      for (let k = i; k < slots; k += count) {
        const d = wrap(k * step - rot);
        if (Math.abs(d) < Math.abs(best)) best = d;
      }
      vel = 0;
      if (reduce) {
        rot += best;
        render();
        return;
      }
      tween = { from: rot, to: rot + best, t0: performance.now() };
      kick();
    };

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, t: e.timeStamp, moved: 0, id: e.pointerId };
      tween = null;
      vel = 0;
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      const dt = Math.max(1, e.timeStamp - drag.t) / 1000;
      drag.moved += Math.abs(dx);
      drag.x = e.clientX;
      drag.t = e.timeStamp;
      if (drag.moved > 6 && !el.hasPointerCapture(e.pointerId)) el.setPointerCapture(e.pointerId);
      rot -= dx * pxToDeg;
      vel = (-dx * pxToDeg) / dt;
      render();
    };
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      suppressClick = drag.moved > 6;
      drag = null;
      kick();
    };
    const click = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const leave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hovering = false;
      kick();
    };

    layout();
    render();
    const resize = new ResizeObserver(() => {
      layout();
      render();
    });
    resize.observe(el);
    const seen = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) kick();
    });
    seen.observe(el);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("click", click, true);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("click", click, true);
    };
  }, [count, slots, step]);

  const edge = (side: "left" | "right", width: string, blur: string) => (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-y-0 z-10", side === "left" ? "left-0" : "right-0", blur)}
      style={{ width, maskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, black, transparent)` }}
    />
  );

  return (
    <div className="space-y-8">
      <div
        ref={stage}
        aria-hidden
        className="relative -mx-gutter cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
        style={{ maskImage: "linear-gradient(to right, transparent, black 7%, black 93%, transparent)" }}
      >
        <div ref={ring} className="absolute top-1/2 left-1/2 transform-3d will-change-transform">
          {Array.from({ length: slots }, (_, i) => {
            const f = friends[i % count];
            return (
              <a
                key={i}
                ref={(node) => {
                  cards.current[i] = node;
                }}
                href={f.site}
                target="_blank"
                rel="noopener"
                tabIndex={-1}
                draggable={false}
                className="absolute overflow-hidden rounded-card border bg-muted backface-hidden"
                style={{ width: "var(--card-w)", height: "var(--card-h)", left: "calc(var(--card-w) / -2)", top: "calc(var(--card-h) / -2)" }}
              >
                <img src={f.image} alt="" width={1200} height={630} draggable={false} decoding="async" className="size-full object-cover" />
              </a>
            );
          })}
        </div>
        {edge("left", "26%", "backdrop-blur-[3px]")}
        {edge("left", "13%", "backdrop-blur-[8px]")}
        {edge("right", "26%", "backdrop-blur-[3px]")}
        {edge("right", "13%", "backdrop-blur-[8px]")}
      </div>
      <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {friends.map((f, i) => (
          <li key={f.slug} className="flex items-center gap-3 border-b py-1">
            <span className="w-5 text-caption text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <button
              type="button"
              aria-current={front === i ? "true" : undefined}
              onClick={() => goTo.current(i)}
              className={cn(
                "tap min-w-0 flex-1 truncate py-2 text-start text-control transition-colors",
                front === i ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.name}
            </button>
            <a href={f.site} target="_blank" rel="noopener" className="tap flex shrink-0 items-center gap-1 py-2 text-caption text-muted-foreground transition-colors hover:text-foreground">
              {f.host}
              <RiArrowRightUpLine aria-hidden className="size-3.5" />
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
