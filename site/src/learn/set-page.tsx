import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BookmarkIcon, SearchIcon } from "@/components/kit/ui-icons";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CodeBlock } from "@/components/code-block";
import { JsonLd } from "@/components/json-ld";
import { IconLinks } from "@/components/browser/icon-links";
import { LineLookControls } from "@/components/browser/line-look";
import { Container, Heading } from "@/components/kit/layout";
import { chip } from "@/components/kit/styles";
import { buttonVariants } from "@/components/ui/button";
import { localize, type Locale } from "@/lib/i18n";
import { pascal } from "@/lib/icons";
import { mixedColor } from "@/lib/palette";
import { absolute, pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Collection } from "./collections";
import { Faq } from "./faq";
import { browserSetHref, iconHref, setPath, setsPath, SET_STYLES, type SetStyle } from "./set-paths";
import { iconsOfSet, relatedSets, setOf, setsOf, stylesWith } from "./style-sets";
import { PageSection, SetCards } from "./ui";

type IndexText = { title: string; zhTitle: string; description: string; zhDescription: string };

const INDEX: Record<SetStyle, IndexText> = {
  layered: {
    title: "Icon sets",
    zhTitle: "图标合集",
    description: "Animated icons picked for one kind of product, such as dashboards, online stores, chat apps and media players. Add a set to your collection to recolor it and download it as a ZIP.",
    zhDescription: "按产品类型挑选的动态图标合集，例如仪表盘、网店、聊天应用和播放器。把合集加入收藏夹后，可以统一换色并打包下载为 ZIP。",
  },
  duotone: {
    title: "Two-tone icon sets",
    zhTitle: "双色图标合集",
    description: "Animated two-tone icons picked for one kind of product, such as dashboards, online stores, chat apps and media players: solid shapes with a light body and accents in your brand color, for React, Vue and SVG.",
    zhDescription: "按产品类型挑选的双色动态图标合集，例如仪表盘、网店、聊天应用和播放器：实心图形，浅色主体加品牌色点缀，提供 React、Vue 组件和 SVG。",
  },
  line: {
    title: "Line icon sets",
    zhTitle: "线性图标合集",
    description: "Animated line icons picked for one kind of product, such as dashboards, online stores, chat apps and media players: rounded strokes in the width and variant you choose, for React, Vue and SVG.",
    zhDescription: "按产品类型挑选的线性动态图标合集，例如仪表盘、网店、聊天应用和播放器：圆角线条，粗细和变体可调，提供 React、Vue 组件和 SVG。",
  },
};

/** Each style's name on the style links, its import path and its folder of static SVG files. */
const STYLE: Record<SetStyle, { en: string; zh: string; path: string; svg: string }> = {
  layered: { en: "Layered", zh: "分层", path: "", svg: "svg" },
  duotone: { en: "Two-tone", zh: "双色", path: "/duotone", svg: "svg-duotone" },
  line: { en: "Line", zh: "线性", path: "/line", svg: "svg-line" },
};

/** The icon browser, opened in a style. */
const browserHref = (style: SetStyle) => (style === "layered" ? "/icons/" : `/icons/?style=${style}`);

const crumbs = (style: SetStyle, locale: Locale) => [
  { name: locale === "zh" ? "图标" : "Icons", path: localize("/icons/", locale) },
  { name: locale === "zh" ? INDEX[style].zhTitle : INDEX[style].title, path: localize(setsPath(style), locale) },
];

/** A link the page's collection panel reads: it adds every icon of the set to the visitor's collection. */
const saveHref = (c: Collection) => `#collection=${c.icons.map((n) => `${n}.${mixedColor(n).slice(1)}`).join(",")}`;

/** Links to the same page in each style it exists in. */
function StyleLinks({ current, hrefs, locale }: { current: SetStyle; hrefs: [SetStyle, string][]; locale: Locale }) {
  if (hrefs.length < 2) return null;
  return (
    <nav aria-label={locale === "zh" ? "风格" : "Style"} className="flex flex-wrap gap-1">
      {hrefs.map(([s, href]) => (
        <Link key={s} href={localize(href, locale)} prefetch={false} aria-current={s === current ? "page" : undefined} className={cn(chip({ active: s === current }), "border")}>
          {locale === "zh" ? STYLE[s].zh : STYLE[s].en}
        </Link>
      ))}
    </nav>
  );
}

/** The style links, and for the line style the variant and stroke width the icons are drawn at. */
function StyleBar({ style, children }: { style: SetStyle; children: ReactNode }) {
  if (style !== "line") return children;
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
      {children}
      <LineLookControls className="max-sm:w-full" />
    </div>
  );
}

export function setsIndexMeta(locale: Locale, style: SetStyle = "layered"): Metadata {
  const zh = locale === "zh";
  const t = INDEX[style];
  return pageMeta({ title: zh ? t.zhTitle : t.title, description: zh ? t.zhDescription : t.description, path: localize(setsPath(style), locale) });
}

export function setMeta(id: string, locale: Locale, style: SetStyle = "layered"): Metadata {
  const c = setOf(style, id);
  if (!c) return {};
  const zh = locale === "zh";
  return pageMeta({ title: zh ? c.zhTitle : c.title, description: zh ? c.zhDescription : c.description, path: localize(setPath(style, id), locale) });
}

/** The ids of a style's sets, for its static pages. */
export const setParams = (style: SetStyle) => setsOf(style).map((c) => ({ id: c.id }));

/** Every icon set of a style. */
export function SetsIndex({ locale, style = "layered" }: { locale: Locale; style?: SetStyle }) {
  const zh = locale === "zh";
  const t = INDEX[style];
  const sets = setsOf(style);
  return (
    <Container className="space-y-8 pt-8 pb-section">
      <Breadcrumbs trail={crumbs(style, locale)} />
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <Heading level={1} title={zh ? t.zhTitle : t.title} lead={zh ? t.zhDescription : t.description} />
        <div className="flex items-center gap-3">
          <span className="text-control text-muted-foreground">{zh ? `${sets.length} 个合集` : `${sets.length} sets`}</span>
          <Link href={localize(browserHref(style), locale)} prefetch={false} className={buttonVariants({ variant: "outline" })}>
            <SearchIcon data-icon="inline-start" />{zh ? "搜索全部图标" : "Search all icons"}
          </Link>
        </div>
      </div>
      <StyleBar style={style}>
        <StyleLinks current={style} hrefs={SET_STYLES.map((s) => [s, setsPath(s)])} locale={locale} />
      </StyleBar>
      <SetCards sets={sets} locale={locale} style={style} />
    </Container>
  );
}

/** One icon set: its icons, a way to save or browse them, and the code to import them. */
export function SetPageBody({ id, locale, style = "layered" }: { id: string; locale: Locale; style?: SetStyle }) {
  const c = setOf(style, id);
  if (!c) notFound();
  const zh = locale === "zh";
  const layered = style === "layered";
  const title = zh ? c.zhTitle : c.title;
  const icons = iconsOfSet(style, c);
  const count = icons.length;
  const pkg = STYLE[style];
  const code = `import { ${c.icons.slice(0, 6).map(pascal).join(", ")} } from "kubai-icons-react${pkg.path}";`;
  const styleName = zh ? pkg.zh : pkg.en.toLowerCase();
  return (
    <Container className="space-y-12 pt-8 pb-section">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description: zh ? c.zhDescription : c.description,
          url: absolute(localize(setPath(style, id), locale)),
          mainEntity: { "@type": "ItemList", numberOfItems: count, itemListElement: icons.map((i, n) => ({ "@type": "ListItem", position: n + 1, url: absolute(localize(iconHref(style, i.name), locale)) })) },
        }}
      />
      <div className="space-y-8">
        <Breadcrumbs trail={[...crumbs(style, locale), { name: title, path: localize(setPath(style, id), locale) }]} />
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <Heading level={1} title={title} lead={zh ? c.zhIntro : c.intro} />
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-control text-muted-foreground">{zh ? `${count} 个图标` : `${count} icons`}</span>
            {layered && (
              <a href={saveHref(c)} className={buttonVariants({ variant: "outline" })}>
                <BookmarkIcon data-icon="inline-start" />{zh ? "全部加入收藏夹" : "Add all to my collection"}
              </a>
            )}
            <Link href={localize(browserSetHref(style, id), locale)} prefetch={false} className={buttonVariants({ variant: layered ? "ghost" : "outline" })}>
              <SearchIcon data-icon="inline-start" />{zh ? "在图标库中打开" : "Open in the icon browser"}
            </Link>
          </div>
        </div>
        <StyleBar style={style}>
          <StyleLinks current={style} hrefs={stylesWith(id).map((s) => [s, setPath(s, id)])} locale={locale} />
        </StyleBar>
        <IconLinks icons={icons} locale={locale} style={style} />
      </div>
      <PageSection title={zh ? "在代码中使用" : "Use them in code"}>
        <p className="max-w-3xl text-body text-foreground/90">
          {zh ? "每个图标都是独立的组件，按名称导入即可，未导入的图标不会进入打包结果。以 React 为例：" : "Each icon is its own component. Import the ones you need by name; icons you don't import stay out of the bundle. In React:"}
        </p>
        <CodeBlock code={code} lang="tsx" />
        <p className="max-w-3xl text-body text-muted-foreground">
          {zh ? `Vue 从 kubai-icons-vue${pkg.path} 导入同名组件。其他框架的用法见` : `In Vue, import the same names from kubai-icons-vue${pkg.path}. For other frameworks, see `}
          <Link href={localize(layered ? "/docs/" : `/docs/guides/${style}/`, locale)} className="text-foreground underline underline-offset-4">{zh ? "文档" : "the docs"}</Link>{zh ? "。" : "."}
        </p>
      </PageSection>
      <Faq
        grid
        heading={zh ? "常见问题" : "Questions"}
        items={zh ? [
          layered
            ? { q: `如何一次下载全部 ${count} 个图标？`, a: "点击上方的“全部加入收藏夹”，再打开页面底部的收藏夹面板，可以统一调整颜色和样式，然后打包下载为 SVG 或 PNG 格式的 ZIP 文件。" }
            : { q: `如何获取这 ${count} 个图标的 SVG 文件？`, a: `kubai-icons-static 包的 ${pkg.svg} 文件夹里有每个${styleName}图标的静态 SVG 文件。也可以在图标库中打开单个图标，复制代码或下载 SVG。` },
          { q: "这些图标可以商用吗？", a: "可以。图标以 MIT 许可证发布，允许个人和商业使用、修改和再分发。" },
          { q: "合集里没有我需要的图标怎么办？", a: layered ? "可以在图标库中搜索全部图标，或者使用 Kubai Icons Skill，让编程智能体按同一风格绘制新图标。" : `可以在图标库中搜索全部${styleName}图标，或者使用 Kubai Icons Skill，让编程智能体按同一风格绘制新图标。` },
        ] : [
          layered
            ? { q: `How do I download all ${count} icons at once?`, a: "Select “Add all to my collection” above, then open the collection panel at the bottom of the page. There you can recolor the icons together and download them as a ZIP of SVG or PNG files." }
            : { q: `Where do I get these ${count} icons as SVG files?`, a: `The ${pkg.svg} folder of the kubai-icons-static package has every ${styleName} icon as a static SVG file. You can also open an icon in the icon browser to copy its code or download its SVG.` },
          { q: "Can I use these icons in commercial projects?", a: "Yes. The icons are released under the MIT License, which permits personal and commercial use, modification and redistribution." },
          { q: "What if an icon I need is missing?", a: layered ? "Search the full library in the icon browser, or use the Kubai Icons skill to have a coding agent draw new icons in the same style." : `Search every ${styleName} icon in the icon browser, or use the Kubai Icons skill to have a coding agent draw new icons in the same style.` },
        ]}
      />
      <PageSection
        title={zh ? "其他合集" : "More icon sets"}
        action={<Link href={localize(setsPath(style), locale)} className="text-control text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">{zh ? "全部合集" : "All icon sets"}</Link>}
      >
        <SetCards sets={relatedSets(style, c, 3)} locale={locale} style={style} />
      </PageSection>
    </Container>
  );
}
