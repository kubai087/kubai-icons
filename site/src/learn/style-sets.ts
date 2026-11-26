// The icon sets of each style. The two-tone and line sets are the layered ones, keeping only the
// icons the style has; a set left with too few icons is not offered in that style. Their titles
// and texts name the style, so each style's pages read as their own.
import { iconByName, styleIcons } from "@/lib/catalog";
import type { IconMeta } from "@/lib/icons";
import { COLLECTIONS, type Collection } from "./collections";
import { SET_STYLES, type BrowserSet, type SetStyle } from "./set-paths";

/** Fewer icons than this and a set is left out of a style. */
const MIN_ICONS = 10;

type StyleWords = {
  /** The style's name as it starts a title, and in Chinese. */
  en: string;
  zh: string;
  /** Added after the set's own opening sentence. */
  intro: string;
  zhIntro: string;
};

const WORDS: Record<Exclude<SetStyle, "layered">, StyleWords> = {
  duotone: {
    en: "Two-tone",
    zh: "双色",
    intro: "Drawn in the two-tone style: solid shapes on a 16 grid, with a light body and accents in your brand color. Each icon plays a hover motion that acts out what it means, and has the same name and props as its layered version.",
    zhIntro: "采用双色风格：16 网格上的实心图形，浅色主体加品牌色点缀。每个图标悬停时播放表达其含义的动效，名称和参数与分层版本相同。",
  },
  line: {
    en: "Line",
    zh: "线性",
    intro: "Drawn in the line style: rounded strokes on a 24 grid, with a stroke width you choose and four variants. Each icon plays a hover motion that acts out what it means, and has the same name as its layered version.",
    zhIntro: "采用线性风格：24 网格上的圆角线条，粗细可调，提供四种变体。每个图标悬停时播放表达其含义的动效，名称与分层版本相同。",
  },
};

/** "Dashboard and …" becomes "dashboard and …"; a leading acronym such as "AI" stays. */
const lowerFirst = (s: string) => (/^[A-Z][A-Z]/.test(s) ? s : s[0].toLowerCase() + s.slice(1));
const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0];
const firstZhSentence = (s: string) => `${s.split("。")[0]}。`;

function restyle(c: Collection, style: Exclude<SetStyle, "layered">, has: Set<string>): Collection {
  const w = WORDS[style];
  return {
    ...c,
    title: `${w.en} ${lowerFirst(c.title)}`,
    zhTitle: `${w.zh}${/^[A-Za-z]/.test(c.zhTitle) ? " " : ""}${c.zhTitle}`,
    description: c.description.replace(/^Animated /, `Animated ${w.en.toLowerCase()} `),
    zhDescription: c.zhDescription.replace("动态", `${w.zh}动态`),
    intro: `${firstSentence(c.intro)} ${w.intro}`,
    zhIntro: `${firstZhSentence(c.zhIntro)}${w.zhIntro}`,
    icons: c.icons.filter((n) => has.has(n)),
  };
}

const cache = new Map<SetStyle, Collection[]>();
/** A style's icon sets. */
export function setsOf(style: SetStyle): Collection[] {
  if (style === "layered") return COLLECTIONS;
  let sets = cache.get(style);
  if (!sets) {
    const has = new Set(styleIcons(style).map((i) => i.name));
    sets = COLLECTIONS.map((c) => restyle(c, style, has)).filter((c) => c.icons.length >= MIN_ICONS);
    cache.set(style, sets);
  }
  return sets;
}

export const setOf = (style: SetStyle, id: string) => setsOf(style).find((c) => c.id === id);

/** The styles a set is offered in. */
export const stylesWith = (id: string): SetStyle[] => SET_STYLES.filter((s) => !!setOf(s, id));

/** A set's icons in its style, in the set's order. */
export function iconsOfSet(style: SetStyle, c: Collection): IconMeta[] {
  if (style === "layered") return c.icons.map(iconByName).filter((i): i is IconMeta => !!i);
  const byName = new Map(styleIcons(style).map((i) => [i.name, i]));
  return c.icons.map((n) => byName.get(n)).filter((i): i is IconMeta => !!i);
}

/** Other sets of the same style that share the most icons with one. */
export function relatedSets(style: SetStyle, c: Collection, limit = 4) {
  const own = new Set(c.icons);
  return setsOf(style)
    .filter((o) => o.id !== c.id)
    .map((o) => ({ o, shared: o.icons.filter((i) => own.has(i)).length }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ o }) => o);
}

/** Every style's sets for the icon browser, in English or Chinese. */
export function browserSets(locale: "en" | "zh"): Record<SetStyle, BrowserSet[]> {
  const zh = locale === "zh";
  const one = (style: SetStyle) =>
    setsOf(style).map((c) => {
      const plain = COLLECTIONS.find((p) => p.id === c.id)!;
      return {
        id: c.id,
        name: zh ? plain.zhTitle.replace(/图标$/, "") : plain.title.replace(/ icons$/, ""),
        title: zh ? c.zhTitle : c.title,
        icons: c.icons,
      };
    });
  return { layered: one("layered"), duotone: one("duotone"), line: one("line") };
}
