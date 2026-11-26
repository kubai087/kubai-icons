"use client";
import Link from "next/link";
import { startTransition, useCallback, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { preload, preloadModule } from "react-dom";
import { ArrowLeftIcon, CopyIcon, SearchIcon } from "@/components/kit/ui-icons";
import { Search } from "kubai-icons-react";
import { Search as SearchDuo } from "kubai-icons-react/duotone";
import { copyText } from "@/components/copy-button";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Segmented } from "@/components/kit/segmented";
import { SizeControl } from "@/components/kit/size-control";
import { LineIcon } from "@/components/kit/line-icon";
import { LineVariantSample } from "@/components/kit/line-variant-sample";
import { warmIcon } from "@/components/kit/icon-image";
import { Swatches } from "@/components/kit/swatches";
import { Glide } from "@/components/kit/glide";
import { chip, navItem, tile as tileStyle } from "@/components/kit/styles";
import { SetsEntry } from "@/learn/sets-entry";
import { setPath, type BrowserSet } from "@/learn/set-paths";
import { setLineSettings, useLineSettings } from "@/lib/line-settings";
import { LINE_STROKE, LINE_STROKES, LINE_VARIANTS } from "@/lib/line";
import { loadIcon, loadIndex, loadKeywords, loadKeywordsLater, matchedKeyword, onKeywords, peekIcon, peekKeywords, prepare, searchObjects, type Category, type IconIndex, type IconMeta, type IconStyle, type Searchable } from "@/lib/icons";
import { track } from "@/lib/analytics";
import { markIconSeen, markNewSetSeen, useNewSetSeen } from "@/lib/seen-new";
import { agentPrompt, asset, requestUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useLocale, useLocalize, useTr } from "@/lib/use-locale";
import { IconGrid } from "./icon-grid";
import { IconDialog } from "./icon-dialog";
import { StyleIndex } from "./style-index";
import { MIXED, MIXED_FILL, STYLE_OPTIONS, SWATCHES, colorFor, mixedColor, mixedColors, usePrefs } from "./prefs";

/** The prefix that marks an icon set among the sidebar entries; category ids never contain a colon. */
const SET = "set:";
const readUrl = () => {
  if (typeof window === "undefined") return { q: "", cat: "", icon: "", style: "" };
  const p = new URLSearchParams(window.location.search);
  const set = p.get("set");
  return { q: p.get("q") ?? "", cat: set ? `${SET}${set}` : (p.get("category") ?? ""), icon: p.get("icon") ?? "", style: p.get("style") ?? "" };
};
const writeUrl = (s: { q: string; cat: string; icon: string; style: IconStyle }) => {
  const p = new URLSearchParams();
  if (s.style !== "layered") p.set("style", s.style);
  if (s.q) p.set("q", s.q);
  if (s.cat.startsWith(SET)) p.set("set", s.cat.slice(SET.length));
  else if (s.cat) p.set("category", s.cat);
  if (s.icon) p.set("icon", s.icon);
  const qs = p.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
};

const noKeywords = () => null;
/** The category entry that lists the icons marked new. */
const NEW_CAT = "new";

/** The icons a sidebar entry shows: the new ones, an icon set's in the set's order, or a category's. */
function iconsFor(all: Searchable[], query: string, cat: string, sets: BrowserSet[]) {
  if (cat === NEW_CAT) return searchObjects(all.filter((i) => i.new), query);
  if (cat.startsWith(SET)) {
    const names = sets.find((x) => SET + x.id === cat)?.icons ?? [];
    const byName = new Map(all.map((i) => [i.name, i]));
    return searchObjects(names.flatMap((n) => byName.get(n) ?? []), query);
  }
  return searchObjects(all, query, cat);
}

/**
 * `sets`: each style's icon sets, on the English and Chinese pages, which open in place.
 * `footer`: the layered style's "All icons by category" section, shown under the browser while
 * the layered style is on show; the other styles show their own in its place.
 */
export function IconBrowser({ categories: cats, firstChunk, sets, footer }: { categories: Category[]; firstChunk?: string; sets?: Record<IconStyle, BrowserSet[]>; footer?: React.ReactNode }) {
  // Both start downloading with the page instead of waiting for the app to start.
  preload(asset("/data/index.json"), { as: "fetch", crossOrigin: "anonymous" });
  if (firstChunk) preloadModule(asset(firstChunk), { as: "script" });
  const tr = useTr();
  const loc = useLocalize();
  const locale = useLocale();
  const [index, setIndex] = useState<IconIndex | null>(null);
  const keywords = useSyncExternalStore(onKeywords, () => peekKeywords(locale), noKeywords);
  const [styleKey, setStyleKey] = useState<IconStyle>("layered");
  const listOf = (ix: IconIndex, style: IconStyle) => (style === "duotone" ? ix.duotone : style === "line" ? ix.line : ix.icons);
  const list = useMemo(() => (index ? prepare(listOf(index, styleKey), keywords ?? {}, locale) : []), [index, keywords, locale, styleKey]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [open, setOpen] = useState<IconMeta | null>(null);
  // The colour of the tile that opened the dialog, so the preview matches it in mixed mode.
  const [openColor, setOpenColor] = useState<string | null>(null);
  // While on, clicking a tile adds it to the collection instead of opening it.
  const [selecting, setSelecting] = useState(false);
  // Only a slider drag lets the grid trail the size; a saved size applies at once.
  const [sizing, setSizing] = useState(false);
  const [prefs, setPrefs] = usePrefs();
  // The two-tone and line styles show their own, smaller lists, with their own icon sets and New
  // category; the visitor's collection and the layered variants stay with the layered icons. The
  // page follows the style on show (styleKey), which trails the one picked until its first
  // screen is ready.
  const duo = styleKey !== "layered";
  const color = colorFor(prefs, styleKey);
  const lineSettings = useLineSettings();
  const query = useDeferredValue(q);
  const input = useRef<HTMLInputElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  const [failed, setFailed] = useState(false);
  const load = useCallback(() => {
    setFailed(false);
    loadIndex().then((ix) => {
      setIndex(ix);
      const u = readUrl();
      if (u.q) loadKeywords(locale).catch(() => { /* names and tags still search */ });
      else loadKeywordsLater(locale);
      setQ(u.q);
      setCat(u.cat);
      // A style in the address shows from the first render, with nothing to wait for. Links to a
      // layered icon set name the layered style too, so a saved style doesn't hide the set.
      if (u.style === "layered" || u.style === "duotone" || u.style === "line") { setPrefs({ style: u.style }); setStyleKey(u.style); }
      if (u.icon) setOpen(listOf(ix, u.style === "duotone" || u.style === "line" ? u.style : "layered").find((i) => i.name === u.icon) ?? null);
    }, () => setFailed(true));
  }, []);
  useEffect(load, [load]);
  useEffect(() => { if (index) writeUrl({ q, cat, icon: open?.name ?? "", style: prefs.style }); }, [q, cat, open, index, prefs.style]);
  // A switch closes an open icon of the other style.
  useEffect(() => {
    setOpen((o) => (o && (o.style ?? "layered") !== prefs.style ? null : o));
  }, [prefs.style]);
  // The page shows a newly picked style only once the icons of its first screen are ready (data
  // loaded, bitmaps drawn), then the sidebar, the toolbar and the grid change in one go: nothing
  // shows empty tiles or a half-switched page in between. A slow network still switches in time.
  const gridBox = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = prefs.style;
    if (target === styleKey) return;
    if (!index) { setStyleKey(target); return; }
    let live = true;
    const show = () => { if (live) startTransition(() => setStyleKey(target)); };
    const timer = setTimeout(show, 800);
    // The icons the new list puts where tiles are on screen now.
    const box = gridBox.current, h = window.innerHeight;
    const shown = box ? [...box.querySelectorAll<HTMLElement>("[data-index]")].filter((el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < h; }).map((el) => Number(el.dataset.index)) : [];
    const from = shown.length ? Math.min(...shown) : 0, to = shown.length ? Math.max(...shown) + 1 : 48;
    const next = prepare(listOf(index, target), keywords ?? {}, locale);
    const all = iconsFor(next, query, cat, sets?.[target] ?? []);
    const metas = all.slice(from, to) as IconMeta[];
    const cols = box ? Math.max(4, Math.floor((box.clientWidth + 10) / (tile + 10))) : 8;
    const look = colorFor(prefs, target);
    const mixed = look === MIXED ? mixedColors(all.map((m) => m.name), cols) : null;
    Promise.all(metas.map((m) => loadIcon(m)))
      .then(() => target === "line" ? undefined : Promise.all(metas.map((m, k) => {
        const icon = peekIcon(m.name, m.style);
        return icon ? warmIcon(icon, { color: mixed ? mixed[from + k] : look, variant: prefs.variant }, prefs.size) : undefined;
      })))
      .then(show, show);
    return () => { live = false; clearTimeout(timer); };
    // Only a new pick starts this; the rest is read as it is at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.style, index]);
  const styleCats = useMemo(() => (duo && index ? cats.filter((c) => listOf(index, styleKey).some((i) => i.category === c.id)) : cats), [duo, index, cats, styleKey]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The style on show has a New category only while some of its icons are new.
  const newSet = useMemo(() => list.filter((i) => i.new).map((i) => i.name).join(","), [list]);
  const hasNew = newSet !== "";
  // The icon sets of the style on show, and the one open in the grid.
  const styleSets = useMemo(() => sets?.[styleKey] ?? [], [sets, styleKey]);
  const openSet = cat.startsWith(SET) ? styleSets.find((x) => SET + x.id === cat) : undefined;
  // The sets list in the sidebar stays open while one of them is on show, and opens and closes on its entry.
  const [setsOpen, setSetsOpen] = useState(false);
  useEffect(() => { if (openSet) setSetsOpen(true); }, [openSet]);
  // An address asking for New in a style without new icons, or for a set the style doesn't have,
  // shows all of them instead.
  useEffect(() => { if (index && ((cat === NEW_CAT && !hasNew) || (cat.startsWith(SET) && !openSet))) setCat(""); }, [index, cat, hasNew, openSet]);
  const newSeen = useNewSetSeen(newSet);
  // Opening the New category, or an icon in it, retires its mark.
  useEffect(() => { if (hasNew && cat === NEW_CAT) markNewSetSeen(newSet); }, [hasNew, cat, newSet]);
  useEffect(() => { if (open?.new) markIconSeen(open.name); }, [open]);
  const results = useMemo(() => iconsFor(list, query, cat, styleSets), [list, query, cat, styleSets]);
  const hits = useMemo(() => (query.trim() ? new Map(results.map((r) => [r.name, matchedKeyword(r, query)])) : undefined), [results, query]);

  // A new category or query starts from the top of the grid, not somewhere in the middle
  // of a list that has just changed under the page. The page stops exactly where the
  // toolbar sticks, so the toolbar and the sidebar stay where they were.
  const restScroll = useCallback(() => {
    const toolbar = bar.current, column = toolbar?.parentElement;
    if (!toolbar || !column) return Infinity;
    const stuckAt = parseFloat(getComputedStyle(toolbar).top) || (document.querySelector("header")?.offsetHeight ?? 0);
    const pulledUp = parseFloat(getComputedStyle(toolbar).marginTop) || 0;
    return Math.ceil(column.getBoundingClientRect().top + window.scrollY + pulledUp - stuckAt);
  }, []);
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    const top = restScroll();
    if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" });
  }, [cat, query, restScroll]);

  // Search analytics: one event per settled query.
  useEffect(() => {
    if (query.trim().length < 2) return;
    const id = setTimeout(() => track(results.length ? "search" : "search_empty", { q: query.trim().toLowerCase().slice(0, 40), results: results.length }), 1200);
    return () => clearTimeout(id);
  }, [query, results.length]);

  const openIcon = useCallback((m: IconMeta, color?: string) => {
    setOpen(m);
    if (color) setOpenColor(color);
    track("icon_open", { icon: m.name });
  }, []);
  // Category analytics: one event per category the visitor stays on, once per page load,
  // so clicking through the list does not send an event for every category passed.
  const catTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const trackedCats = useRef(new Set<string>());
  useEffect(() => () => clearTimeout(catTimer.current), []);
  const pickCat = (id: string) => {
    setCat(id);
    clearTimeout(catTimer.current);
    if (!id || trackedCats.current.has(id)) return;
    catTimer.current = setTimeout(() => {
      trackedCats.current.add(id);
      track("filter_category", { category: id });
    }, 1500);
  };
  // Category links filter in place; opening one in a new tab still goes to its page.
  const filterTo = (e: React.MouseEvent, id: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    pickCat(id);
  };
  const related = useMemo(() => {
    if (!open) return [];
    const root = open.base ?? open.name;
    return list.filter((i) => i.name === root || i.base === root);
  }, [open, list]);

  // The grid may trail the slider, which keeps the thumb under the pointer.
  const trailingSize = useDeferredValue(prefs.size);
  const gridSize = sizing ? trailingSize : prefs.size;
  const tile = 64 + gridSize * 1.5;
  // Rendered in the panel on wide screens and beside the category chips on narrow ones.
  const selectButton = (className: string) => (
    <Button className={className} variant={selecting ? "default" : "outline"} size="sm" aria-pressed={selecting} onClick={() => setSelecting((v) => !v)}>
      {selecting ? tr("Done", "完成") : tr("Select", "多选")}
    </Button>
  );
  return (
    <>
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block">
        <nav className="isolate sticky top-[calc(var(--header)+var(--stick))] -me-2 max-h-[calc(100dvh-var(--header)-2*var(--stick))] space-y-0.5 overflow-y-auto pe-2 pb-6 [mask-image:linear-gradient(to_bottom,black_calc(100%-1.5rem),transparent)]">
          <Glide still selector="[aria-current=true]" className="rounded-control bg-muted" />
          <button type="button" aria-current={!cat} onClick={() => pickCat("")} className={navItem({ active: !cat })}>
            <span className="truncate">{tr("All", "全部")}</span>
          </button>
          {hasNew && (
            <button type="button" aria-current={cat === NEW_CAT} onClick={() => pickCat(NEW_CAT)} className={navItem({ active: cat === NEW_CAT })}>
              <span className="truncate">{tr("New", "新增")}</span>
              {!newSeen && <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-brand" />}
            </button>
          )}
          <SetsEntry as="nav" style={styleKey} sets={styleSets} current={openSet?.id ?? ""} open={setsOpen} onToggle={() => setSetsOpen((v) => !v)} onPick={(e, id) => filterTo(e, SET + id)} />
          {styleCats.map((c) => (
            <a key={c.id} href={asset(loc(`/icons/category/${c.id}/`))} aria-current={cat === c.id} onClick={(e) => filterTo(e, c.id)} className={navItem({ active: cat === c.id })}>
              <span className="truncate">{tr(c.en, c.zh ?? c.en)}</span>
            </a>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 space-y-5 lg:space-y-3">
        {/* The opaque band reaches up to the header, so tiles scrolling past never show
            between the header and the panel or round the panel's corners. */}
        <div ref={bar} className="relative z-30 max-lg:contents lg:pointer-events-none lg:sticky lg:top-header lg:-mt-stick lg:-mb-1 lg:pt-stick lg:pb-6 lg:before:absolute lg:before:inset-0 lg:before:-z-10 lg:before:bg-background/65 lg:before:backdrop-blur-xl lg:before:[mask-image:linear-gradient(to_bottom,black_calc(100%-1.5rem),transparent)]">
          <div className="flex flex-col gap-3 max-lg:contents lg:pointer-events-auto lg:rounded-panel lg:border lg:p-4">
          {/* Below the desktop layout only the search box stays in view. */}
          <div className="max-lg:sticky max-lg:top-header max-lg:z-30 max-lg:-mx-gutter max-lg:bg-background/80 max-lg:px-gutter max-lg:py-2 max-lg:backdrop-blur-xl">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 start-3.5 size-[18px] -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={input}
              value={q}
              onChange={(e) => { setQ(e.target.value); }}
              onFocus={() => { loadKeywords(locale).catch(() => { /* names and tags still search */ }); }}
              placeholder={tr("Search by name, shape or meaning", "按名称、形状或含义搜索")}
              className="h-11 rounded-card pe-16 ps-10 text-field"
              aria-label={tr("Search icons", "搜索图标")}
            />
            <Kbd className="absolute top-1/2 end-3.5 -translate-y-1/2 pointer-coarse:hidden">/</Kbd>
          </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 max-lg:mt-2 max-lg:mb-3 max-lg:rounded-card max-lg:border max-lg:p-3">
            <Swatches
              className="w-full flex-nowrap justify-between overflow-x-auto sm:w-auto sm:flex-wrap sm:justify-start sm:overflow-visible"
              value={color}
              options={[
                { value: MIXED, name: tr("Mixed", "多色"), fill: MIXED_FILL },
                ...SWATCHES.map((s) => ({ value: s.value, name: s.name })),
              ]}
              onChange={(next) => setPrefs({ color: next, picked: true })}
              label={tr("Accent color", "主色")}
              customLabel={tr("Custom color", "自定义颜色")}
              hexLabel={tr("Hex color", "十六进制颜色")}
            />
            {/* The style and its variants (彩色/柔和, or the line variants) share a row; on phones
                each takes a full row, its items equally wide. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-3 max-sm:w-full max-sm:flex-col max-sm:items-stretch">
            <Segmented
              fill
              value={prefs.style}
              onChange={(style) => { setSelecting(false); if ((cat === NEW_CAT && !(index && listOf(index, style).some((i) => i.new))) || (cat.startsWith(SET) && !sets?.[style]?.some((x) => SET + x.id === cat))) setCat(""); setPrefs({ style }); track("switch_style", { style }); }}
              label={tr("Style", "风格")}
              options={STYLE_OPTIONS.map((o) => ({ value: o.value, label: tr(o.en, o.zh) }))}
            />
            {styleKey === "line" && (
              // The four variants as small samples of themselves; their names show on hover.
              <Segmented
                fill
                value={lineSettings.variant}
                onChange={(variant) => setLineSettings({ variant })}
                label={tr("Variant", "变体")}
                dense
                options={LINE_VARIANTS.map((o) => ({ value: o.value, title: tr(o.en, o.zh), label: <span className="pointer-events-none"><LineVariantSample variant={o.value} /><span className="sr-only">{tr(o.en, o.zh)}</span></span> }))}
              />
            )}
            {!duo && (
              <Segmented
                fill
                value={prefs.variant}
                onChange={(variant) => setPrefs({ variant })}
                label={tr("Variant", "样式")}
                options={[{ value: "color", label: tr("Color", "彩色") }, { value: "soft", label: tr("Soft", "柔和") }]}
              />
            )}
            </div>
            {!duo && selectButton("max-lg:hidden")}
            {/* Size ends the first row, except in the line style, where it moves down beside the
                stroke width so the two sit side by side (one per row only on narrow screens). */}
            {styleKey !== "line" && (
              // Grows into whatever the first row has left; when it wraps it takes the whole row,
              // never sitting alone at one end.
              <SizeControl
                stretch
                className="min-w-64 grow basis-64"
                label={tr("Icon size", "尺寸")}
                commonLabel={tr("Common icon sizes", "常用尺寸")}
                pixelsLabel={tr("Icon size in pixels", "尺寸（像素）")}
                value={prefs.size}
                min={16}
                max={64}
                step={4}
                presets={[16, 24, 32, 48]}
                onChange={(size) => { setSizing(true); setPrefs({ size }); }}
              />
            )}
            {/* The row opens and closes by its height, so the grid below slides instead of jumping. */}
            <div aria-hidden={styleKey !== "line"} inert={styleKey !== "line"} className={cn("grid w-full basis-full transition-[grid-template-rows,margin] duration-200 ease-out motion-reduce:transition-none", styleKey === "line" ? "grid-rows-[1fr]" : "-mt-3 grid-rows-[0fr]")}>
              <div className="min-h-0 overflow-hidden">
                <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  <SizeControl
                    stretch
                    label={tr("Icon size", "尺寸")}
                    commonLabel={tr("Common icon sizes", "常用尺寸")}
                    pixelsLabel={tr("Icon size in pixels", "尺寸（像素）")}
                    value={prefs.size}
                    min={16}
                    max={64}
                    step={4}
                    presets={[16, 24, 32, 48]}
                    onChange={(size) => { setSizing(true); setPrefs({ size }); }}
                  />
                  <SizeControl
                    stretch
                    label={tr("Stroke width", "粗细")}
                    commonLabel={tr("Common stroke widths", "常用粗细")}
                    pixelsLabel={tr("Stroke width", "粗细")}
                    value={lineSettings.s}
                    min={LINE_STROKE.min}
                    max={LINE_STROKE.max}
                    step={LINE_STROKE.step}
                    decimals
                    presets={LINE_STROKES}
                    onChange={(s) => setLineSettings({ s })}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* On narrow screens Select sits at the end of the category row, where it stays in place while the chips scroll. */}
          <div className="-mx-gutter mb-3 flex items-center lg:hidden">
            <div className={cn("relative isolate flex min-w-0 flex-1 gap-0.5 overflow-x-auto ps-gutter pb-0.5", duo ? "pe-gutter" : "pe-3 [mask-image:linear-gradient(to_left,transparent,black_1.25rem)] rtl:[mask-image:linear-gradient(to_right,transparent,black_1.25rem)]")}>
              <Glide still selector="[aria-current=true]" className="rounded-control bg-muted" />
              <button type="button" aria-current={!cat} className={chip({ active: !cat })} onClick={() => pickCat("")}>{tr("All", "全部")}</button>
              {hasNew && <button type="button" aria-current={cat === NEW_CAT} className={chip({ active: cat === NEW_CAT })} onClick={() => pickCat(NEW_CAT)}>{tr("New", "新增")}</button>}
              <SetsEntry as="chip" style={styleKey} sets={styleSets} current={openSet?.id ?? ""} open={setsOpen} onToggle={() => setSetsOpen((v) => !v)} onPick={(e, id) => filterTo(e, SET + id)} />
              {/* An open sets list takes the place of the categories, which come back when it closes. */}
              {!setsOpen && styleCats.map((c) => (
                <a key={c.id} href={asset(loc(`/icons/category/${c.id}/`))} aria-current={cat === c.id} className={chip({ active: cat === c.id })} onClick={(e) => filterTo(e, c.id)}>{tr(c.en, c.zh ?? c.en)}</a>
              ))}
            </div>
            {!duo && selectButton("ms-1 me-gutter shrink-0")}
          </div>
          </div>
        </div>
        <div className="min-h-dvh">
          {openSet && (
            // The set on show, with the way back to every icon and a link to the set's own page.
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <Button variant="outline" size="sm" onClick={() => pickCat("")}>
                <ArrowLeftIcon data-icon="inline-start" className="rtl:rotate-180" />{locale === "zh" ? "全部图标" : "All icons"}
              </Button>
              <h2 className="min-w-0 truncate font-heading text-subheading font-semibold">{openSet.title}</h2>
              <span className="text-control text-muted-foreground">{locale === "zh" ? `${openSet.icons.length} 个图标` : `${openSet.icons.length} icons`}</span>
              <a href={asset(loc(setPath(styleKey, openSet.id)))} className="text-control text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:ms-auto">
                {locale === "zh" ? "合集介绍和代码" : "About this set and its code"}
              </a>
            </div>
          )}
          {failed ? (
            <div className="grid place-items-center gap-3 rounded-panel border border-dashed py-20 text-center">
              <p className="text-muted-foreground">{tr("The icons could not be loaded.", "图标加载失败")}</p>
              <Button variant="outline" size="xl" onClick={load}>{tr("Try again", "重试")}</Button>
            </div>
          ) : index && results.length === 0 ? (
            <div className={"flex flex-col items-center px-4 py-20 text-center"} data-kubai-trigger>
              {/* drawn in the style being browsed, at its current line variant and stroke */}
              <div className={cn(tileStyle({ interactive: false }), "size-20")}>
                {styleKey === "line" ? (
                  <LineIcon name="search" size={40} color="#5393FF" variant={lineSettings.variant} s={lineSettings.s} />
                ) : styleKey === "duotone" ? (
                  <SearchDuo size={40} color="#5393FF" trigger="parent" />
                ) : (
                  <Search size={40} color="#5393FF" trigger="parent" />
                )}
              </div>
              <h2 className="mt-5 max-w-full truncate text-subheading font-semibold">
                {query.trim() ? tr("No icons for “{query}”", "未找到与“{query}”相关的图标", { query: query.trim() }) : tr("No icons here yet", "暂无图标")}
              </h2>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <a href={requestUrl(query)} target="_blank" rel="noreferrer" onClick={() => track("request_icon", { q: query })} className={buttonVariants()}>
                  {tr("Request this icon", "申请此图标")}
                </a>
                <Button variant="outline" onClick={() => { copyText(agentPrompt(query, locale)); track("request_icon", { q: query, via: "agent_prompt" }); }}>
                  <CopyIcon data-icon="inline-start" />
                  {tr("Copy agent prompt", "复制提示词")}
                </Button>
              </div>
            </div>
          ) : (
            <div ref={gridBox}>
              <IconGrid icons={results} tile={tile} size={gridSize} color={color} variant={prefs.variant} selecting={selecting && !duo} hits={hits} onOpen={openIcon} />
            </div>
          )}
        </div>
      </div>
      <IconDialog
        meta={open}
        related={related}
        categories={index?.categories ?? []}
        color={color === MIXED ? (openColor ?? mixedColor(open?.base ?? open?.name ?? "")) : color}
        variant={prefs.variant}
        badge={prefs.badge}
        onBadge={(badge) => setPrefs({ badge })}
        onClose={() => { setOpen(null); setOpenColor(null); }}
        onOpen={openIcon}
        onCategory={(id) => { pickCat(id); setOpen(null); setOpenColor(null); }}
        onKeyword={(word) => { setQ(word); setCat(""); setOpen(null); setOpenColor(null); }}
      />
    </div>
    {/* Follows the style on show, so it changes in the same render as the grid. */}
    {footer && (styleKey === "layered" ? footer : (
      <StyleIndex
        style={styleKey}
        icons={list}
        categories={cats}
        onCategory={filterTo}
        onIcon={(e, m) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); openIcon(m); }}
      />
    ))}
    </>
  );
}
