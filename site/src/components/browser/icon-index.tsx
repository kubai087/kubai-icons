import Link from "next/link";
import { allCategories, baseIcons, iconsIn, localNameOf } from "@/lib/catalog";
import { hasIconPages, localize, pick, type Locale } from "@/lib/i18n";
import { iconLabel } from "@/lib/seo";
import { asset } from "@/lib/site";
import { IndexCard, IndexNames, IndexSection, sample } from "./index-parts";

/**
 * Every category as a card, then every icon as a plain link in a closed list. The browser
 * above loads its grid in the page, so this is what a crawler reaches each icon's page from:
 * links inside a closed <details> are still in the HTML. It sits below the grid, which is at
 * least a screen tall, so it never shows while the grid loads. Only English and Chinese have
 * icon pages, so only their icon libraries include it. This is the layered style's; the browser
 * shows the two-tone and line styles' own in its place while one of them is on show.
 */
export function IconIndex({ locale = "en" }: { locale?: Locale }) {
  if (!hasIconPages(locale)) return null;
  const zh = locale === "zh";
  const categories = allCategories().map((c) => ({ ...c, name: pick(locale, c.en, c.zh ?? c.en), icons: iconsIn(c.id) }));
  return (
    <IndexSection
      zh={zh}
      total={baseIcons().length}
      count={categories.length}
      cards={categories.map((c) => (
        <IndexCard
          key={c.id}
          href={localize(`/icons/category/${c.id}/`, locale)}
          name={c.name}
          count={c.icons.length}
          zh={zh}
          // eslint-disable-next-line @next/next/no-img-element
          icons={sample(c.icons).map((i) => <img key={i.name} src={asset(`/icons/${i.name}/preview.svg`)} alt="" width={24} height={24} loading="lazy" decoding="async" className="size-6" />)}
        />
      ))}
      names={categories.map((c) => (
        <IndexNames key={c.id} title={<Link href={localize(`/icons/category/${c.id}/`, locale)} prefetch={false} className="hover:underline">{c.name}</Link>}>
          {c.icons.map((i) => (
            <li key={i.name}>
              <Link href={localize(`/icons/${i.name}/`, locale)} prefetch={false}>
                {locale === "en" ? iconLabel(i.name) : localNameOf(i, locale)}
              </Link>
            </li>
          ))}
        </IndexNames>
      ))}
    />
  );
}
