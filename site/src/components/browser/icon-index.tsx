import Link from "next/link";
import { allCategories, iconsIn, localNameOf } from "@/lib/catalog";
import { hasIconPages, localize, pick, type Locale } from "@/lib/i18n";
import { iconLabel } from "@/lib/seo";

/**
 * Every icon as a plain link, grouped by category. The browser above loads its grid in the
 * page, so this is what a crawler reaches each icon's page from. It sits below the grid,
 * which is at least a screen tall, so it never shows while the grid loads. Only English and
 * Chinese have icon pages, so only their icon libraries include it.
 */
export function IconIndex({ locale = "en" }: { locale?: Locale }) {
  if (!hasIconPages(locale)) return null;
  return (
    <section aria-labelledby="icon-index" className="mt-section space-y-8 border-t pt-10 pb-section">
      <h2 id="icon-index" className="font-heading text-subheading font-semibold">{locale === "zh" ? "按分类浏览全部图标" : "All icons by category"}</h2>
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {allCategories().map((c) => (
          <div key={c.id} className="space-y-2">
            <h3 className="text-sm font-semibold">
              <Link href={localize(`/icons/category/${c.id}/`, locale)} prefetch={false} className="hover:underline">{pick(locale, c.en, c.zh ?? c.en)}</Link>
            </h3>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-caption text-muted-foreground [&_a:hover]:text-foreground [&_a:hover]:underline">
              {iconsIn(c.id).map((i) => (
                <li key={i.name}>
                  <Link href={localize(`/icons/${i.name}/`, locale)} prefetch={false}>
                    {locale === "en" ? iconLabel(i.name) : localNameOf(i, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
