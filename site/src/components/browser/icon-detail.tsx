"use client";
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ElementType, type ReactNode } from "react";
import { RiArrowRightSLine, RiBookmarkFill, RiBookmarkLine, RiCheckLine, RiDownloadLine, RiFileCopyLine, RiGithubLine, RiPlayFill } from "@remixicon/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CodeBlock } from "@/components/code-block";
import { copyText } from "@/components/copy-button";
import { HoverIcon, IconImage, prefetchIcon } from "@/components/kit/icon-image";
import { Segmented } from "@/components/kit/segmented";
import { Glide } from "@/components/kit/glide";
import { quietLink, tile } from "@/components/kit/styles";
import { toggleSaved, useSaved } from "@/lib/collection";
import { FACETS, loadKeywords, localBadgeName, pascal, type IconMeta, type Category, type Keywords } from "@/lib/icons";
import { download, resolvedSvg, svgToPng } from "@/lib/export";
import { track } from "@/lib/analytics";
import { burst } from "@/lib/ceremony";
import { REPO, asset } from "@/lib/site";
import { languageOf } from "@/lib/i18n";
import { useLocale, useLocalize, useTr } from "@/lib/use-locale";
import { nudgeSponsor } from "@/lib/sponsor-nudge";
import { cn } from "@/lib/utils";
import { PREVIEW_SIZE, type Badge as BadgeMode } from "./prefs";
import { useIcon, useLocalName } from "./icon-tile";

type Props = {
  meta: IconMeta;
  related: IconMeta[];
  categories: Category[];
  color: string;
  variant: "color" | "soft";
  badge: BadgeMode;
  onBadge: (b: BadgeMode) => void;
  onOpen: (m: IconMeta) => void;
  /** Searches the browser for a keyword. Without it, keywords link to the browser. */
  onKeyword?: (word: string) => void;
  /** Filters the browser by category. When given, the line above the name becomes a trail. */
  onCategory?: (id: string) => void;
  /** The element or component that renders the icon's name, and the line under it. */
  title: ElementType;
  description: ElementType;
  /** The heading in place of the icon's code name, on the icon's own page. */
  heading?: string;
  /** Shown in the preview until the live icon has loaded. */
  placeholder?: ReactNode;
};

const LANG_KEY = "kubai-icons:code";
/** The package each code tab installs, for the update command shown on new icons. */
const UPDATE_PACKAGE = { react: "kubai-icons-react", vue: "kubai-icons-vue", html: "kubai-icons", js: "kubai-icons" };

/** How long a touch preview holds the hover pose, including the move there. */
const PLAY_MS = 1100;
/** Lets the panel finish appearing before a touch preview starts. */
const AUTOPLAY_DELAY = 320;

/** How long a button shows that its copy or download is done. */
const DONE_MS = 1600;

/** An icon that turns into a tick for a moment once its action is done. */
const DoneIcon = ({ done, icon: Icon }: { done: boolean; icon: ElementType }) => (
  <span data-icon="inline-start" className="grid *:[grid-area:1/1] *:transition-[opacity,scale] *:duration-200 *:ease-out motion-reduce:*:transition-none">
    <Icon className={cn("size-4", done && "scale-50 opacity-0")} />
    <RiCheckLine className={cn("size-4", !done && "scale-50 opacity-0")} />
  </span>
);

/** A small label above a group of controls. */
const Label = ({ children }: { children: React.ReactNode }) => <p className="text-caption font-medium text-muted-foreground">{children}</p>;

/** One icon's preview, code and downloads, in the dialog or on the icon's own page. */
export function IconDetail({ meta, related, categories, color, variant, badge, onBadge, onOpen, onCategory, onKeyword, title: Title, description: Description, heading, placeholder }: Props) {
  const bc = badge === "semantic" ? "semantic" : undefined;
  const mainBc = meta.badge ? bc : undefined;
  const icon = useIcon(meta);
  const saved = useSaved(meta.name);
  const tr = useTr();
  const locale = useLocale();
  const loc = useLocalize();
  const [keywords, setKeywords] = useState<Keywords | null>(null);
  const [showKeywords, setShowKeywords] = useState(false);
  const owner = meta.base ?? meta.name;
  useEffect(() => {
    let live = true;
    loadKeywords(locale).then((all) => { if (live) setKeywords(all[owner] ?? null); }).catch(() => { /* the panel works without them */ });
    return () => { live = false; };
  }, [owner, locale]);
  const [pinned, setPinned] = useState(false);
  const playing = useRef(0);
  const play = useCallback(() => {
    window.clearTimeout(playing.current);
    setPinned(true);
    playing.current = window.setTimeout(() => setPinned(false), PLAY_MS);
  }, []);
  // Touch screens have no hover, so each icon plays once when it is shown.
  const loaded = Boolean(icon);
  useEffect(() => {
    if (!loaded || !matchMedia("(hover: none)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = window.setTimeout(play, AUTOPLAY_DELAY);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(playing.current);
      setPinned(false);
    };
  }, [meta.name, loaded, play]);
  const [lang, setLang] = useState("react");
  // The last framework is restored before the panel paints.
  useLayoutEffect(() => {
    try { setLang(localStorage.getItem(LANG_KEY) || "react"); } catch { /* storage may be blocked */ }
  }, []);
  const pickLang = (next: string) => {
    setLang(next);
    try { localStorage.setItem(LANG_KEY, next); } catch { /* storage may be blocked */ }
  };
  const hex = color.toUpperCase();
  const P = pascal(meta.name);
  const cat = categories.find((c) => c.id === meta.category);
  const catName = cat ? tr(cat.en, cat.zh ?? cat.en) : undefined;
  const facets = locale === "en" ? FACETS : [{ key: "local" as const, label: languageOf(locale).name, zh: languageOf(locale).name }, ...FACETS];
  const snippets = useMemo(() => {
    const soft = (variant === "soft" ? ' variant="soft"' : "") + (mainBc ? ' badgeColor="semantic"' : "");
    return {
      react: `import { ${P} } from "kubai-icons-react";\n\n<${P} size={24} color="${color}"${soft} />`,
      vue: `<script setup>\nimport { ${P} } from "kubai-icons-vue";\n</script>\n\n<template>\n  <${P} :size="24" color="${color}"${soft} />\n</template>`,
      html: `<script type="module" src="https://cdn.jsdelivr.net/npm/kubai-icons@0/dist/cdn/element.js"></script>\n\n<kubai-icon name="${meta.name}" size="24" color="${color}"${variant === "soft" ? ' variant="soft"' : ""}${mainBc ? ' badge-color="semantic"' : ""}></kubai-icon>`,
      js: `import { createIcon, ${P} } from "kubai-icons";\n\ndocument.body.append(createIcon(${P}, { size: 24, color: "${color}"${variant === "soft" ? ', variant: "soft"' : ""}${mainBc ? ', badgeColor: "semantic"' : ""} }));`,
    };
  }, [meta, P, color, variant, mainBc]);
  const source = `${REPO}/blob/master/icons/${meta.base ?? meta.name}.js`;

  const svgText = () => (icon ? resolvedSvg(icon, { color, variant, badgeColor: mainBc, size: 96 }) : "");
  // The button shows a tick for a moment after a copy or a download. A copy also plays the
  // icon's motion and blooms sparks from the button.
  const [done, setDone] = useState<"copy" | "svg" | "png" | null>(null);
  const doneTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(doneTimer.current), []);
  useEffect(() => { setDone(null); }, [meta.name]);
  const celebrate = (kind: "copy" | "svg" | "png", button: HTMLElement) => {
    window.clearTimeout(doneTimer.current);
    setDone(kind);
    doneTimer.current = window.setTimeout(() => setDone(null), DONE_MS);
    if (kind !== "copy") return;
    play();
    burst(button, color);
  };
  const actions = {
    copyName: () => { copyText(meta.name); track("icon_copy", { icon: meta.name, format: "name" }); },
    copyColor: () => { copyText(hex); track("icon_copy", { icon: meta.name, format: "color" }); },
    copySvg: async (e: React.MouseEvent<HTMLElement>) => {
      const button = e.currentTarget, svg = svgText();
      if (!(await copyText(svg, { quiet: true }))) return;
      celebrate("copy", button);
      track("icon_copy", { icon: meta.name, format: "svg" }); nudgeSponsor();
    },
    svg: (e: React.MouseEvent<HTMLElement>) => {
      const svg = svgText();
      download(`${meta.name}.svg`, new Blob([svg], { type: "image/svg+xml" }));
      celebrate("svg", e.currentTarget);
      track("icon_download", { icon: meta.name, format: "svg" }); nudgeSponsor();
    },
    png: async (e: React.MouseEvent<HTMLElement>) => {
      const button = e.currentTarget, svg = svgText();
      download(`${meta.name}.png`, await svgToPng(svg, 512));
      celebrate("png", button);
      track("icon_download", { icon: meta.name, format: "png" }); nudgeSponsor();
    },
  };
  const variants = related.filter((r) => r.base);
  const root = related.find((r) => !r.base);
  const local = useLocalName(meta);
  const rootLocal = useLocalName(root);
  // Pages in other languages lead with the local name and keep the code name beside it.
  const readable = heading ?? local;
  const codeName = locale !== "en" && readable ? meta.name : null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] sm:grid-cols-[17rem_minmax(0,1fr)]">
      {/* The preview and its size samples are one block. Narrow screens place them side by
          side, so the actions stay in view. */}
      <div className="flex bg-surface sm:flex-col">
        <button
          type="button"
          data-kubai-trigger
          onClick={() => { if (matchMedia("(hover: none)").matches) play(); else setPinned((v) => !v); }}
          className="focus-area relative grid aspect-square w-32 shrink-0 place-items-center sm:aspect-auto sm:min-h-54 sm:w-full sm:flex-1 [&>span]:scale-[0.6] sm:[&>span]:scale-100"
          aria-label={tr("Play the hover motion", "播放悬停动效")}
        >
          {icon ? <HoverIcon icon={icon} size={PREVIEW_SIZE} color={color} variant={variant} badgeColor={mainBc} hover={pinned} /> : placeholder}
          <small aria-hidden className={cn("absolute inset-x-0 bottom-2 hidden items-center justify-center gap-0.5 text-caption text-muted-foreground transition-opacity pointer-coarse:flex", pinned && "opacity-0")}>
            <RiPlayFill className="size-3" />{tr("Tap to play", "点击播放")}
          </small>
        </button>
        <div className="flex flex-1 items-end justify-center gap-3 pe-12 pb-7 ps-3 max-[389px]:[&>:last-child]:hidden sm:flex-none sm:gap-4 sm:p-panel">
          {[16, 24, 32, 48].map((s) => (
            <div key={s} className="flex flex-col items-center gap-1.5">
              {icon ? <IconImage icon={icon} size={s} color={color} variant={variant} badgeColor={mainBc} /> : <span style={{ width: s, height: s }} />}
              <span className="text-caption text-muted-foreground tabular-nums">{s}</span>
            </div>
          ))}
        </div>
      </div>
    
      <div className="flex min-w-0 flex-col gap-6 p-panel">
        {/* Every line here keeps one line's height, so switching versions never moves
            the controls below. */}
        <header key={meta.name} className="swap-in relative">
          <Description className="flex h-5 items-center gap-0.5 pe-24 text-control whitespace-nowrap sm:pe-8 text-muted-foreground *:[a]:no-underline">
            {onCategory ? (
              <>
                <a href={asset(loc(`/icons/category/${meta.category}/`))} onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); onCategory(meta.category); } }} className={cn("tap relative", quietLink, root && meta.base && "max-sm:hidden")}>{catName}</a>
                {root && meta.base && (
                  <>
                    <RiArrowRightSLine aria-hidden className="size-4 shrink-0 max-sm:hidden rtl:rotate-180" />
                    <button type="button" onClick={() => onOpen(root)} className={cn("tap relative", quietLink)}>{rootLocal ?? root.name}</button>
                  </>
                )}
                <RiArrowRightSLine aria-hidden className="size-4 shrink-0 rtl:rotate-180" />
                <span className="min-w-0 truncate text-foreground">{local && meta.base ? localBadgeName(meta, locale) : local ?? meta.name}</span>
              </>
            ) : catName}
            {meta.by && <a href={`https://github.com/${meta.by}`} target="_blank" rel="noreferrer" className={cn("tap relative ms-2 shrink-0", quietLink)}>by @{meta.by}</a>}
          </Description>
          <div className="flex h-8 items-center gap-1">
            <Title className={cn("min-w-0 truncate text-heading font-semibold", !readable && "font-mono", codeName && "shrink-0")}>{readable ?? meta.name}</Title>
            {codeName && <span className="ms-1 min-w-0 truncate font-mono text-control text-muted-foreground">{codeName}</span>}
            <Button variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground" onClick={actions.copyName} aria-label={tr("Copy name", "复制英文名")} title={tr("Copy name", "复制英文名")}>
              <RiFileCopyLine />
            </Button>
            <button type="button" onClick={actions.copyColor} aria-label={tr("Copy color {hex}", "复制色值 {hex}", { hex })} title={tr("Copy color", "复制色值")} className={cn("tap absolute -top-1 end-0 flex h-7 shrink-0 items-center gap-1.5 rounded-control border px-2 font-mono text-caption sm:relative sm:top-0 sm:ms-auto", quietLink)}>
              <span aria-hidden className="size-3 rounded-pill" style={{ background: color }} />
              {hex}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 max-[359px]:grid-cols-2 max-[359px]:[&>*]:w-full sm:grid-cols-[1fr_auto_auto_auto_auto]">
          <Button size="xl" className="col-span-4 has-data-[icon=inline-start]:ps-5 max-[359px]:col-span-2 sm:col-span-1" onClick={actions.copySvg}>
            <DoneIcon done={done === "copy"} icon={RiFileCopyLine} />
            <span key={done === "copy" ? "done" : "idle"} className="swap-in">{done === "copy" ? tr("Copied", "已复制") : tr("Copy SVG", "复制 SVG")}</span>
          </Button>
          <Button size="xl" variant="outline" onClick={actions.svg}><DoneIcon done={done === "svg"} icon={RiDownloadLine} />SVG</Button>
          <Button size="xl" variant="outline" onClick={actions.png}><DoneIcon done={done === "png"} icon={RiDownloadLine} />PNG</Button>
          <span className="sr-only" aria-live="polite">{done === "copy" ? tr("Copied", "已复制") : done ? tr("Downloaded", "已下载") : ""}</span>
          <Button size="icon-xl" variant="outline" onClick={() => toggleSaved({ name: meta.name, color, variant, badge: mainBc })} aria-pressed={saved} aria-label={tr("Save to collection", "加入收藏夹")} title={saved ? tr("Remove from collection", "移出收藏夹") : tr("Save to collection", "加入收藏夹")}>
            {saved ? <RiBookmarkFill /> : <RiBookmarkLine />}
          </Button>
          <Button size="icon-xl" variant="outline" render={<a href={source} target="_blank" rel="noreferrer" />} aria-label={tr("View source on GitHub", "在 GitHub 上查看源码")} title={tr("View source on GitHub", "在 GitHub 上查看源码")}>
            <RiGithubLine />
          </Button>
        </div>
    
        {variants.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Label>{tr("Badges", "角标")}</Label>
              <Segmented
                value={badge}
                onChange={onBadge}
                label={tr("Badge color", "角标颜色")}
                options={[
                  { value: "mono", label: tr("Mono", "单色") },
                  { value: "semantic", label: tr("Color", "彩色") },
                ]}
              />
            </div>
            <div className="relative isolate flex flex-wrap gap-2">
              <Glide still selector="[aria-current=true]" className="rounded-card bg-surface-hover ring-1 ring-foreground/20" />
              {root && <VariantChip meta={root} active={root.name === meta.name} color={color} variant={variant} onOpen={onOpen} />}
              {variants.map((r) => (
                <VariantChip key={r.name} meta={r} active={r.name === meta.name} color={color} variant={variant} badge={bc} onOpen={onOpen} />
              ))}
            </div>
          </section>
        )}
    
        {snippets && (
          <Tabs value={lang} onValueChange={pickLang} className="min-w-0 gap-2">
            <TabsList>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="vue">Vue</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="js">JS</TabsTrigger>
            </TabsList>
            {/* Every snippet reserves its space, so the panel keeps its height across tabs. */}
            <div className="grid">
              {(Object.keys(snippets) as (keyof typeof snippets)[]).map((k) => (
                <CodeBlock key={k} code={snippets[k]} className="invisible [grid-area:1/1]" />
              ))}
              {(Object.keys(snippets) as (keyof typeof snippets)[]).map((k) => (
                <TabsContent key={k} value={k} className="swap-in [grid-area:1/1]">
                  <CodeBlock code={snippets[k]} className="h-full" onCopy={() => { track("icon_copy", { icon: meta.name, format: k }); nudgeSponsor(); }} />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        )}

        {meta.new && (
          <section className="space-y-2">
            <p className="flex items-start gap-2 text-caption text-muted-foreground">
              <span className="mt-px shrink-0 rounded-pill bg-brand px-1.5 text-[10px] leading-4 font-semibold text-white">{tr("New", "新")}</span>
              {meta.since
                ? tr("Added in v{version}. Projects on an earlier version need to update first.", "v{version} 新增，已安装旧版本的项目需要先更新。", { version: meta.since })
                : tr("Coming in the next release. It can’t be installed from npm yet.", "将在下个版本发布，暂时还不能从 npm 安装。")}
            </p>
            {meta.since && <CodeBlock code={`npm i ${UPDATE_PACKAGE[lang as keyof typeof UPDATE_PACKAGE] ?? "kubai-icons"}@latest`} onCopy={() => track("install_copy", { icon: meta.name, via: "update" })} />}
          </section>
        )}

        {keywords && (
          <section>
            <button type="button" aria-expanded={showKeywords} onClick={() => setShowKeywords((v) => !v)} className={cn("tap relative flex items-center gap-0.5 text-caption font-medium", quietLink)}>
              {tr("Keywords", "关键词")}
              <RiArrowRightSLine aria-hidden className={cn("size-4 transition-transform duration-200 motion-reduce:transition-none", showKeywords ? "rotate-90" : "rtl:rotate-180")} />
            </button>
            <div className={cn("grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none", showKeywords ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="min-h-0 overflow-hidden" inert={!showKeywords}>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-2 pt-3">
              {facets.map(({ key, label, zh }) => (
                <Fragment key={key}>
                  <dt className="flex h-6 items-center text-caption text-muted-foreground pointer-coarse:h-8">{tr(label, zh)}</dt>
                  <dd className="flex flex-wrap gap-1">
                    {keywords[key].map((word) => (
                      <Tooltip key={word}>
                        <TooltipTrigger
                          delay={200}
                          render={
                            <a
                              href={asset(loc(`/icons/?q=${encodeURIComponent(word)}`))}
                              onClick={(e) => { if (onKeyword && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); onKeyword(word); } }}
                              className="inline-flex h-6 items-center rounded-control bg-surface px-2 text-caption text-muted-foreground no-underline transition-colors hover:bg-surface-hover hover:text-foreground pointer-coarse:h-8"
                            />
                          }
                        >
                          {word}
                        </TooltipTrigger>
                        <TooltipContent>{tr("Search for “{word}”", "搜索“{word}”", { word })}</TooltipContent>
                      </Tooltip>
                    ))}
                  </dd>
                </Fragment>
              ))}
            </dl>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function VariantChip({ meta, active, color, variant, badge, onOpen }: { meta: IconMeta; active: boolean; color: string; variant: "color" | "soft"; badge?: string; onOpen: (m: IconMeta) => void }) {
  const icon = useIcon(meta);
  const local = useLocalName(meta);
  return (
    <button
      type="button"
      title={local ?? meta.name}
      aria-current={active}
      data-kubai-trigger
      onClick={() => onOpen(meta)}
      onPointerEnter={() => { if (icon) prefetchIcon(icon, { color, variant, badgeColor: badge }, PREVIEW_SIZE); }}
      className={cn(tile({ active }), "size-12 rounded-card")}
    >
      {icon ? <HoverIcon icon={icon} size={28} color={color} variant={variant} badgeColor={badge} /> : null}
    </button>
  );
}
