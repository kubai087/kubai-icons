"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { RiArrowRightUpLine } from "@remixicon/react";
import { Container } from "@/components/kit/layout";
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

/** Each edge lens covers this share of the stage's width. */
const LENS = 0.24;
/** How far, in pixels, the lens pulls the picture at its outer edge. */
const BEND = 70;

/**
 * A displacement map for one edge lens, at half size. Red moves pixels sideways and green
 * up and down; both grow toward the outer edge, so the picture bulges and stretches there
 * like the rim of a glass lens.
 */
function lensMap(width: number, height: number, side: "left" | "right") {
  const w = Math.max(2, Math.round(width / 2));
  const h = Math.max(2, Math.round(height / 2));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const v = (y / (h - 1)) * 2 - 1;
    for (let x = 0; x < w; x++) {
      const t = side === "left" ? 1 - x / (w - 1) : x / (w - 1);
      const k = t * t * (3 - 2 * t);
      const dx = (side === "left" ? 1 : -1) * k * 0.9;
      const dy = -v * k * k * 0.45;
      const i = (y * w + x) * 4;
      img.data[i] = 128 + dx * 127;
      img.data[i + 1] = 128 + dy * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

/** Keeps one colour channel of the bent picture, so each can bend by a slightly different amount. */
const CHANNELS = [
  ["R", "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
  ["G", "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"],
  ["B", "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"],
] as const;

/** Chromium can run an SVG filter on what sits behind an element; elsewhere the lenses just blur. */
const canRefract = () => typeof CSS !== "undefined" && CSS.supports("backdrop-filter", "url(#a)") && /Chrome\//.test(navigator.userAgent);

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

    const refract = canRefract();
    const lenses = (["left", "right"] as const).map((side) => ({
      side,
      el: el.querySelector<HTMLElement>(`[data-lens=${side}]`),
      map: document.getElementById(`friends-lens-map-${side}`),
      filter: document.getElementById(`friends-lens-${side}`),
    }));

    const layout = () => {
      const w = el.clientWidth;
      const width = w < 640 ? w * 0.62 : Math.min(440, Math.max(260, w * 0.26));
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
      if (!refract) return;
      const lw = Math.round(w * LENS);
      const lh = Math.round(height * 1.75);
      for (const lens of lenses) {
        if (!lens.el || !lens.map || !lens.filter) continue;
        for (const node of [lens.filter, lens.map]) {
          node.setAttribute("width", String(lw));
          node.setAttribute("height", String(lh));
        }
        lens.map.setAttribute("href", lensMap(lw, lh, lens.side));
        lens.el.style.backdropFilter = `url(#friends-lens-${lens.side}) blur(1.5px) saturate(1.35)`;
      }
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

  const lens = (side: "left" | "right") => (
    <div
      data-lens={side}
      className={cn("pointer-events-none absolute inset-y-0 z-10 backdrop-blur-[6px]", side === "left" ? "left-0" : "right-0")}
      style={{
        width: `${LENS * 100}%`,
        maskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, black 35%, transparent)`,
        backgroundImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, rgb(255 255 255 / 0.08), transparent 70%)`,
      }}
    />
  );

  /** Splits the bend across red, green and blue so the lens edges fringe like real glass. */
  const lensFilter = (side: "left" | "right") => (
    <filter key={side} id={`friends-lens-${side}`} x="0" y="0" width="1" height="1" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feImage id={`friends-lens-map-${side}`} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
      {CHANNELS.map(([channel, matrix], n) => (
        <Fragment key={channel}>
          <feDisplacementMap in="SourceGraphic" in2="map" scale={BEND * (1 + n * 0.06)} xChannelSelector="R" yChannelSelector="G" result={`bent${channel}`} />
          <feColorMatrix in={`bent${channel}`} type="matrix" values={matrix} result={`only${channel}`} />
        </Fragment>
      ))}
      <feBlend in="onlyR" in2="onlyG" mode="screen" result="rg" />
      <feBlend in="rg" in2="onlyB" mode="screen" />
    </filter>
  );

  return (
    <div className="space-y-8">
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>{lensFilter("left")}{lensFilter("right")}</defs>
      </svg>
      <div
        ref={stage}
        aria-hidden
        className="relative cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
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
        {lens("left")}
        {lens("right")}
      </div>
      <Container>
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
      </Container>
    </div>
  );
}
