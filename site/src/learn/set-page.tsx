import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RiBookmarkLine, RiSearchLine } from "@remixicon/react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CodeBlock } from "@/components/code-block";
import { JsonLd } from "@/components/json-ld";
import { IconLinks } from "@/components/browser/icon-links";
import { Container, Heading } from "@/components/kit/layout";
import { buttonVariants } from "@/components/ui/button";
import { iconByName } from "@/lib/catalog";
import { localize, type Locale } from "@/lib/i18n";
import { pascal, type IconMeta } from "@/lib/icons";
import { mixedColor } from "@/lib/palette";
import { absolute, pageMeta } from "@/lib/seo";
import { COLLECTIONS, collectionById, relatedCollections, type Collection } from "./collections";
import { Faq } from "./faq";
import { PageSection, SetCards } from "./ui";

const INDEX = {
  title: "Icon sets",
  zhTitle: "图标合集",
  description: "Animated icons picked for one kind of product, such as dashboards, online stores, chat apps and media players. Add a set to your collection to recolor it and download it as a ZIP.",
  zhDescription: "按产品类型挑选的动态图标合集，例如仪表盘、网店、聊天应用和播放器。把合集加入收藏夹后，可以统一换色并打包下载为 ZIP。",
};

const iconsOf = (c: Collection) => c.icons.map(iconByName).filter((i): i is IconMeta => !!i);
const crumbs = (locale: Locale) => [
  { name: locale === "zh" ? "图标" : "Icons", path: localize("/icons/", locale) },
  { name: locale === "zh" ? INDEX.zhTitle : INDEX.title, path: localize("/icons/sets/", locale) },
];

/** A link the page's collection panel reads: it adds every icon of the set to the visitor's collection. */
const saveHref = (c: Collection) => `#collection=${c.icons.map((n) => `${n}.${mixedColor(n).slice(1)}`).join(",")}`;

export function setsIndexMeta(locale: Locale): Metadata {
  const zh = locale === "zh";
  return pageMeta({ title: zh ? INDEX.zhTitle : INDEX.title, description: zh ? INDEX.zhDescription : INDEX.description, path: localize("/icons/sets/", locale) });
}

export function setMeta(id: string, locale: Locale): Metadata {
  const c = collectionById(id);
  if (!c) return {};
  const zh = locale === "zh";
  return pageMeta({ title: zh ? c.zhTitle : c.title, description: zh ? c.zhDescription : c.description, path: localize(`/icons/sets/${id}/`, locale) });
}

/** Every icon set. */
export function SetsIndex({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <Container className="space-y-8 pt-8 pb-section">
      <Breadcrumbs trail={crumbs(locale)} />
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <Heading level={1} title={zh ? INDEX.zhTitle : INDEX.title} lead={zh ? INDEX.zhDescription : INDEX.description} />
        <div className="flex items-center gap-3">
          <span className="text-control text-muted-foreground">{zh ? `${COLLECTIONS.length} 个合集` : `${COLLECTIONS.length} sets`}</span>
          <Link href={localize("/icons/", locale)} prefetch={false} className={buttonVariants({ variant: "outline" })}>
            <RiSearchLine data-icon="inline-start" />{zh ? "搜索全部图标" : "Search all icons"}
          </Link>
        </div>
      </div>
      <SetCards sets={COLLECTIONS} locale={locale} />
    </Container>
  );
}

/** One icon set: its icons, a way to save them all, and the code to import them. */
export function SetPageBody({ id, locale }: { id: string; locale: Locale }) {
  const c = collectionById(id);
  if (!c) notFound();
  const zh = locale === "zh";
  const title = zh ? c.zhTitle : c.title;
  const icons = iconsOf(c);
  const count = icons.length;
  const code = `import { ${c.icons.slice(0, 6).map(pascal).join(", ")} } from "kubai-icons-react";`;
  return (
    <Container className="space-y-12 pt-8 pb-section">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description: zh ? c.zhDescription : c.description,
          url: absolute(localize(`/icons/sets/${id}/`, locale)),
          mainEntity: { "@type": "ItemList", numberOfItems: count, itemListElement: icons.map((i, n) => ({ "@type": "ListItem", position: n + 1, url: absolute(localize(`/icons/${i.name}/`, locale)) })) },
        }}
      />
      <div className="space-y-8">
        <Breadcrumbs trail={[...crumbs(locale), { name: title, path: localize(`/icons/sets/${id}/`, locale) }]} />
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <Heading level={1} title={title} lead={zh ? c.zhIntro : c.intro} />
          <div className="flex items-center gap-3">
            <span className="text-control text-muted-foreground">{zh ? `${count} 个图标` : `${count} icons`}</span>
            <a href={saveHref(c)} className={buttonVariants({ variant: "outline" })}>
              <RiBookmarkLine data-icon="inline-start" />{zh ? "全部加入收藏夹" : "Add all to my collection"}
            </a>
          </div>
        </div>
        <IconLinks icons={icons} locale={locale} />
      </div>
      <PageSection title={zh ? "在代码中使用" : "Use them in code"}>
        <p className="max-w-3xl text-body text-foreground/90">
          {zh ? "每个图标都是独立的组件，按名称导入即可，未导入的图标不会进入打包结果。以 React 为例：" : "Each icon is its own component. Import the ones you need by name; icons you don't import stay out of the bundle. In React:"}
        </p>
        <CodeBlock code={code} lang="tsx" />
        <p className="max-w-3xl text-body text-muted-foreground">
          {zh ? "Vue 从 kubai-icons-vue 导入同名组件。其他框架的用法见" : "In Vue, import the same names from kubai-icons-vue. For other frameworks, see "}
          <Link href={localize("/docs/", locale)} className="text-foreground underline underline-offset-4">{zh ? "文档" : "the docs"}</Link>{zh ? "。" : "."}
        </p>
      </PageSection>
      <Faq
        grid
        heading={zh ? "常见问题" : "Questions"}
        items={zh ? [
          { q: `如何一次下载全部 ${count} 个图标？`, a: "点击上方的“全部加入收藏夹”，再打开页面底部的收藏夹面板，可以统一调整颜色和样式，然后打包下载为 SVG 或 PNG 格式的 ZIP 文件。" },
          { q: "这些图标可以商用吗？", a: "可以。图标以 MIT 许可证发布，允许个人和商业使用、修改和再分发。" },
          { q: "合集里没有我需要的图标怎么办？", a: "可以在图标库中搜索全部图标，或者使用 Kubai Icons Skill，让编程智能体按同一风格绘制新图标。" },
        ] : [
          { q: `How do I download all ${count} icons at once?`, a: "Select “Add all to my collection” above, then open the collection panel at the bottom of the page. There you can recolor the icons together and download them as a ZIP of SVG or PNG files." },
          { q: "Can I use these icons in commercial projects?", a: "Yes. The icons are released under the MIT License, which permits personal and commercial use, modification and redistribution." },
          { q: "What if an icon I need is missing?", a: "Search the full library in the icon browser, or use the Kubai Icons skill to have a coding agent draw new icons in the same style." },
        ]}
      />
      <PageSection
        title={zh ? "其他合集" : "More icon sets"}
        action={<Link href={localize("/icons/sets/", locale)} className="text-control text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">{zh ? "全部合集" : "All icon sets"}</Link>}
      >
        <SetCards sets={relatedCollections(c, 3)} locale={locale} />
      </PageSection>
    </Container>
  );
}
