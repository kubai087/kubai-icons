"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { IconMeta } from "@/lib/icons";
import { languageOf } from "@/lib/i18n";
import { useLocale } from "@/lib/use-locale";
import { IconTile } from "./icon-tile";
import { MIXED, mixedColors } from "./prefs";

/** Gap between tiles; matches the --grid-gap token. */
const GAP = 10;

/** Rough height of what covers the top of the page, for choosing the icon to keep in view. */
const COVERED = 190;

/** How long the size has to hold still before icons are redrawn at it. */
const RASTER_DELAY = 200;

/** A distance in whole device pixels. An icon's bitmap blurs under a transform that lands between them. */
const snap = (px: number) => {
  const ratio = window.devicePixelRatio || 1;
  return Math.round(px * ratio) / ratio;
};

/** A windowed grid: only the rows near the viewport are in the DOM. */
export function IconGrid({ icons, tile, size, color, variant, selecting, hits, onOpen }: {
  icons: IconMeta[]; tile: number; size: number; color: string; variant: "color" | "soft"; selecting: boolean; hits?: Map<string, string | null>;
  onOpen: (m: IconMeta, color: string) => void;
}) {
  const rtl = languageOf(useLocale()).dir === "rtl";
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [offset, setOffset] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // The grid's page offset moves whenever anything above it changes height, not only when
  // the grid resizes, so it is read after every render.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
    if (top !== offset) setOffset(top);
  });
  const cols = Math.max(4, Math.floor((width + GAP) / (tile + GAP)));
  const rows = Math.ceil(icons.length / cols);
  // Colours are assigned once per list, so an icon keeps its colour while the grid reflows.
  const measured = width > 0;
  const mixed = useMemo(
    () => (color === MIXED ? mixedColors(icons.map((m) => m.name), cols) : null),
    // `cols` is left out on purpose; see above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color, icons, measured],
  );
  const cell = width ? (width - GAP * (cols - 1)) / cols : tile;
  const step = cell + GAP;
  const v = useWindowVirtualizer({ count: rows, estimateSize: () => step, overscan: 6, scrollMargin: offset });
  useEffect(() => { v.measure(); }, [cell, v]);
  // When the list changes, it shows at once: tiles never travel and never fade, so results
  // stay put while typing.
  // While the size is changing, the existing bitmaps are scaled; they are redrawn once it settles.
  const [raster, setRaster] = useState(size);
  useEffect(() => {
    const id = setTimeout(() => setRaster(size), RASTER_DELAY);
    return () => clearTimeout(id);
  }, [size]);
  // When the column count changes, the icons at the top of the view stay at the top.
  const last = useRef({ cols, cell });
  useLayoutEffect(() => {
    const was = last.current;
    last.current = { cols, cell };
    if (was.cols === cols || !width || !was.cell) return;
    const at = (window.scrollY + COVERED - offset) / (was.cell + GAP);
    if (at <= 0) return;
    const row = Math.floor(at);
    const next = Math.floor((row * was.cols) / cols) + (at - row);
    window.scrollTo({ top: offset + next * (cell + GAP) - COVERED, behavior: "instant" });
  }, [cols, cell, width, offset]);
  return (
    <div ref={ref} className="relative w-full" style={{ height: rows * step }}>
      {width > 0 &&
        v.getVirtualItems().flatMap((row) =>
          icons.slice(row.index * cols, row.index * cols + cols).map((m, i) => (
            <div
              key={m.name}
              data-name={m.name}
              data-index={row.index * cols + i}
              className="absolute top-0 left-0"
              style={{
                width: cell,
                height: cell,
                transform: `translate(${snap((rtl ? cols - 1 - i : i) * step)}px, ${snap(row.index * step)}px)`,
              }}
            >
              <IconTile meta={m} size={size} raster={raster} color={mixed ? mixed[row.index * cols + i] : color} variant={variant} selecting={selecting} hit={hits?.get(m.name)} onOpen={onOpen} />
            </div>
          )),
        )}
    </div>
  );
}
