"use client";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { previewPath } from "@/learn/set-paths";
import { localName, onKeywords, peekKeywords, type Category, type IconMeta } from "@/lib/icons";
import { iconLabel } from "@/lib/seo";
import { asset } from "@/lib/site";
import { useLocale, useLocalize } from "@/lib/use-locale";
import { IndexCard, IndexNames, IndexSection, sample } from "./index-parts";
import { LinePreview } from "./line-look";

const noKeywords = () => null;

/**
 * "All icons by category" for the two-tone or the line style, drawn from the icons the browser
 * has loaded, so a new build's icons show here with nothing else to change. Two-tone and line
 * icons have no pages of their own: a card shows its category in the browser above, and a name
 * opens its icon there.
 */
export function StyleIndex({ style, icons, categories, onCategory, onIcon }: {
  style: "duotone" | "line";
  /** The style's icons, as the browser lists them. */
  icons: IconMeta[];
  categories: Category[];
  onCategory: (e: React.MouseEvent, id: string) => void;
  onIcon: (e: React.MouseEvent, meta: IconMeta) => void;
}) {
  const locale = useLocale();
  const loc = useLocalize();
  const zh = locale === "zh";
  const keywords = useSyncExternalStore(onKeywords, () => peekKeywords(locale), noKeywords);
  const groups = useMemo(() => {
    const bases = icons.filter((i) => !i.base);
    return categories
      .map((c) => ({ ...c, name: zh ? (c.zh ?? c.en) : c.en, icons: bases.filter((i) => i.category === c.id) }))
      .filter((c) => c.icons.length);
  }, [icons, categories, zh]);
  const total = groups.reduce((n, c) => n + c.icons.length, 0);
  const nameOf = (i: IconMeta) => (locale === "en" ? undefined : keywords && localName(i, keywords, locale)) || iconLabel(i.name);
  return (
    <IndexSection
      zh={zh}
      total={total}
      count={groups.length}
      cards={groups.map((c) => (
        <IndexCard
          key={c.id}
          href={loc(`/icons/?style=${style}&category=${c.id}`)}
          name={c.name}
          count={c.icons.length}
          zh={zh}
          onClick={(e) => onCategory(e, c.id)}
          icons={sample(c.icons).map((i) =>
            style === "line" ? (
              <LinePreview key={i.name} name={i.name} size={24} src={previewPath(style, i.name)} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i.name} src={asset(previewPath(style, i.name))} alt="" width={24} height={24} loading="lazy" decoding="async" className="size-6" />
            ),
          )}
        />
      ))}
      names={groups.map((c) => (
        <IndexNames key={c.id} title={<Link href={loc(`/icons/?style=${style}&category=${c.id}`)} prefetch={false} onClick={(e) => onCategory(e, c.id)} className="hover:underline">{c.name}</Link>}>
          {c.icons.map((i) => (
            <li key={i.name}>
              <Link href={loc(`/icons/?style=${style}&icon=${i.name}`)} prefetch={false} onClick={(e) => onIcon(e, i)}>{nameOf(i)}</Link>
            </li>
          ))}
        </IndexNames>
      ))}
    />
  );
}
