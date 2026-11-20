// Guides and comparisons, written in English and Simplified Chinese only. They live in the
// docs and take their title, description and nav label from here.
import type { Locale } from "@/lib/i18n";
import { localize } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export type LearnPage = { href: string; label: string; zh: string; title: string; zhTitle: string; description: string; zhDescription: string };

export const GUIDES: LearnPage[] = [
  {
    href: "/docs/guides/nextjs/",
    label: "Next.js",
    zh: "Next.js",
    title: "Animated icons in Next.js",
    zhTitle: "在 Next.js 中使用动态图标",
    description: "Add animated SVG icons to a Next.js App Router project. Icons render on the server, animate after hydration and load one file per icon.",
    zhDescription: "在 Next.js App Router 项目中使用 SVG 动态图标：图标在服务端渲染，水合后添加动效，每个图标单独加载。",
  },
  {
    href: "/docs/guides/button-hover/",
    label: "Play from a button",
    zh: "由按钮触发动效",
    title: "Play an icon's animation when its button is hovered",
    zhTitle: "悬停按钮时播放图标动效",
    description: "Start an icon's hover animation from a whole button, link, card or menu item, in React, Vue or plain JavaScript, with keyboard focus included.",
    zhDescription: "在 React、Vue 或原生 JavaScript 中，让整个按钮、链接、卡片或菜单项触发图标的悬停动效，键盘焦点同样有效。",
  },
  {
    href: "/docs/guides/tailwind/",
    label: "Tailwind CSS",
    zh: "Tailwind CSS",
    title: "Animated icons with Tailwind CSS",
    zhTitle: "配合 Tailwind CSS 使用动态图标",
    description: "Color, size and theme animated icons with Tailwind CSS utility classes. Icons follow currentColor, so text color classes recolor them.",
    zhDescription: "用 Tailwind CSS 工具类设置动态图标的颜色、尺寸和主题。图标跟随 currentColor，文字颜色类可以直接改变图标颜色。",
  },
  {
    href: "/docs/guides/shadcn-ui/",
    label: "shadcn/ui",
    zh: "shadcn/ui",
    title: "Animated icons in shadcn/ui",
    zhTitle: "在 shadcn/ui 中使用动态图标",
    description: "Use animated icons in shadcn/ui buttons, sidebars and menus, and make the motion play when the whole control is hovered.",
    zhDescription: "在 shadcn/ui 的按钮、侧边栏和菜单中使用动态图标，并在悬停整个控件时播放动效。",
  },
  {
    href: "/docs/guides/nuxt/",
    label: "Nuxt",
    zh: "Nuxt",
    title: "Animated icons in Vue and Nuxt",
    zhTitle: "在 Vue 和 Nuxt 中使用动态图标",
    description: "Install animated icon components in a Vue 3 or Nuxt project, with props for color, size and hover control, and v-model for toggle icons.",
    zhDescription: "在 Vue 3 或 Nuxt 项目中安装动态图标组件，通过 props 控制颜色、尺寸和悬停行为，切换型图标支持 v-model。",
  },
  {
    href: "/docs/guides/no-build/",
    label: "No build step",
    zh: "无需构建工具",
    title: "Animated icons without a build step",
    zhTitle: "无需构建工具使用动态图标",
    description: "Add animated icons to plain HTML, WordPress, Svelte, Angular or Astro with one script tag and the <kubai-icon> web component.",
    zhDescription: "用一个 script 标签和 <kubai-icon> Web Component，在纯 HTML、WordPress、Svelte、Angular 或 Astro 中使用动态图标。",
  },
  {
    href: "/docs/guides/colors-dark-mode/",
    label: "Set colors and dark mode",
    zh: "设置颜色和深色模式",
    title: "Icon colors, themes and dark mode",
    zhTitle: "图标颜色、主题和深色模式",
    description: "Recolor animated icons from one accent color, switch to the soft variant for a page or theme, and adapt icons to dark mode.",
    zhDescription: "通过一个主色为动态图标换色，按页面或主题切换到 soft 样式，并让图标适配深色模式。",
  },
  {
    href: "/docs/guides/figma/",
    label: "Use in design tools",
    zh: "在设计工具中使用",
    title: "Use the icons in Figma and design tools",
    zhTitle: "在 Figma 和设计工具中使用图标",
    description: "Copy or download Kubai Icons as SVG or PNG for Figma, Sketch, Keynote and native apps, in any color, and keep a set in one ZIP.",
    zhDescription: "把 Kubai Icons 复制或下载为任意颜色的 SVG 或 PNG，用于 Figma、Sketch、Keynote 和原生应用，也可以把一组图标打包为 ZIP。",
  },
  {
    href: "/docs/guides/duotone/",
    label: "Switch style (layered / two-tone)",
    zh: "切换风格（分层/双色）",
    title: "Two-tone icons: the solid style",
    zhTitle: "双色面性图标",
    description: "Solid two-tone icons on a 16 grid, with a light body, accents in your brand color and a hover motion. Same names and props as the layered icons, so switching style is one import.",
    zhDescription: "16 网格的实心双色图标：浅色主体加品牌色点缀，悬停时播放动效。名称和参数与分层图标相同，切换风格只需修改一行 import。",
  },
];

export const COMPARISONS: LearnPage[] = [
  {
    href: "/docs/compare/lucide/",
    label: "Lucide",
    zh: "Lucide",
    title: "Kubai Icons vs Lucide",
    zhTitle: "Kubai Icons 与 Lucide 对比",
    description: "How Kubai Icons compares with Lucide: style, built-in animation, packages and license, with a name table for switching from lucide-react.",
    zhDescription: "Kubai Icons 与 Lucide 在风格、内置动效、软件包和许可证上的区别，并附从 lucide-react 迁移的名称对照表。",
  },
  {
    href: "/docs/compare/heroicons/",
    label: "Heroicons",
    zh: "Heroicons",
    title: "Kubai Icons vs Heroicons",
    zhTitle: "Kubai Icons 与 Heroicons 对比",
    description: "How Kubai Icons compares with Heroicons: set size, styles, animation and frameworks, with a name table for switching.",
    zhDescription: "Kubai Icons 与 Heroicons 在图标数量、风格、动效和框架支持上的区别，并附迁移用的名称对照表。",
  },
  {
    href: "/docs/compare/phosphor/",
    label: "Phosphor",
    zh: "Phosphor",
    title: "Kubai Icons vs Phosphor Icons",
    zhTitle: "Kubai Icons 与 Phosphor Icons 对比",
    description: "How Kubai Icons compares with Phosphor Icons: weights versus color variants, animation, packages and license, with a name table.",
    zhDescription: "Kubai Icons 与 Phosphor Icons 在字重与配色样式、动效、软件包和许可证上的区别，并附名称对照表。",
  },
];

type NavItem = { href: string; label: string; zh: string };
type NavGroup = { group: string; zh: string; items: NavItem[] };

const FRAMEWORKS = ["/docs/guides/nextjs/", "/docs/guides/nuxt/", "/docs/guides/tailwind/", "/docs/guides/shadcn-ui/", "/docs/guides/no-build/"];
const byHref = (hrefs: string[]) => hrefs.map((h) => GUIDES.find((g) => g.href === h)!);

/**
 * The docs nav with the guides and comparisons added, for English and Simplified Chinese.
 * Framework guides follow the packages, usage guides join the existing Guides group, and the
 * comparisons follow it.
 */
export function withLearnPages(docs: NavGroup[]): NavGroup[] {
  const usage = GUIDES.filter((g) => !FRAMEWORKS.includes(g.href));
  return docs.flatMap((g) => {
    if (g.group === "Packages") return [g, { group: "Frameworks", zh: "框架集成", items: byHref(FRAMEWORKS) }];
    if (g.group === "Guides") return [{ ...g, items: [...g.items, ...usage] }, { group: "Compare", zh: "对比与迁移", items: COMPARISONS }];
    return [g];
  });
}

/** A guide's or comparison's entry, by its English address. */
export const learnPage = (href: string) => [...GUIDES, ...COMPARISONS].find((p) => p.href === href)!;

/** Metadata for a guide or comparison in either language. */
export function learnMeta(href: string, locale: Locale) {
  const page = learnPage(href);
  const zh = locale === "zh";
  return pageMeta({ title: zh ? page.zhTitle : page.title, description: zh ? page.zhDescription : page.description, path: localize(href, locale) });
}
