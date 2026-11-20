import { RiArrowRightSLine } from "@remixicon/react";
import Link from "next/link";
import { card, quietLink } from "@/components/kit/styles";
import { allCategories, baseIcons, iconsIn, localNameOf } from "@/lib/catalog";
import { hasIconPages, localize, pick, type Locale } from "@/lib/i18n";
import type { IconMeta } from "@/lib/icons";
import { iconLabel } from "@/lib/seo";
import { asset } from "@/lib/site";
import { cn } from "@/lib/utils";

const PREVIEWS = 6;

/** A few icons from across a category, so the sample is not six variants of one name. */
const sample = (icons: IconMeta[]) =>
  icons.length <= PREVIEWS ? icons : Array.from({ length: PREVIEWS }, (_, k) => icons[Math.floor((k * icons.length) / PREVIEWS)]);

/**
 * Every category as a card, then every icon as a plain link in a closed list. The browser
 * above loads its grid in the page, so this is what a crawler reaches each icon's page from:
 * links inside a closed <details> are still in the HTML. It sits below the grid, which is at
 * least a screen tall, so it never shows while the grid loads. Only English and Chinese have
 * icon pages, so only their icon libraries include it.
 */
export function IconIndex({ locale = "en" }: { locale?: Locale }) {
  if (!hasIconPages(locale)) return null;
  const zh = locale === "zh";
  const categories = allCategories().map((c) => ({ ...c, name: pick(locale, c.en, c.zh ?? c.en), icons: iconsIn(c.id) }));
  const total = baseIcons().length;
  return (
    <section aria-labelledby="icon-index" className="mt-section space-y-6 border-t pt-10 pb-section">
      <div className="space-y-1">
        <h2 id="icon-index" className="font-heading text-subheading font-semibold">{zh ? "按分类浏览全部图标" : "All icons by category"}</h2>
        <p className="text-sm text-muted-foreground">{zh ? `${categories.length} 个分类，共 ${total} 个图标` : `${total} icons in ${categories.length} categories`}</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={localize(`/icons/category/${c.id}/`, locale)}
              prefetch={false}
              // Hover keeps the card's fill and lifts it a little; its icons rise in turn, left to right.
              className={cn(card, "group flex h-full flex-col gap-4 p-4 transition-[border-color,box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md motion-reduce:hover:translate-y-0")}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 text-sm font-semibold">{c.name}</span>
                <span className="flex shrink-0 items-center text-caption text-muted-foreground tabular-nums transition-colors group-hover:text-foreground">
                  {zh ? `${c.icons.length} 个` : c.icons.length}
                  <RiArrowRightSLine aria-hidden className="-me-1 size-4 opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:rotate-180 motion-reduce:transition-none" />
                </span>
              </span>
              {/* Phones fit three, so the rest hide there. */}
              <span className="mt-auto grid grid-cols-3 gap-1.5 max-sm:[&>:nth-child(n+4)]:hidden sm:grid-cols-6" aria-hidden>
                {sample(c.icons).map((i, k) => (
                  <span key={i.name} style={{ transitionDelay: `${k * 35}ms` }} className="grid aspect-square place-items-center rounded-control bg-background transition-transform duration-200 ease-out group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(`/icons/${i.name}/preview.svg`)} alt="" width={24} height={24} loading="lazy" decoding="async" className="size-6" />
                  </span>
                ))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <details className="group/all">
        <summary className={cn(quietLink, "focus-inset inline-flex cursor-pointer list-none items-center gap-1.5 rounded-control text-sm [&::-webkit-details-marker]:hidden")}>
          <svg viewBox="0 0 16 16" className="size-3.5 transition-transform group-open/all:rotate-90" aria-hidden>
            <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {zh ? `查看全部 ${total} 个图标名称` : `View all ${total} icon names`}
        </summary>
        <div className="mt-6 columns-1 gap-8 sm:columns-2 lg:columns-3">
          {categories.map((c) => (
            <div key={c.id} className="mb-6 break-inside-avoid space-y-2">
              <h3 className="text-sm font-semibold">
                <Link href={localize(`/icons/category/${c.id}/`, locale)} prefetch={false} className="hover:underline">{c.name}</Link>
              </h3>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-caption text-muted-foreground [&_a:hover]:text-foreground [&_a:hover]:underline">
                {c.icons.map((i) => (
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
      </details>
    </section>
  );
}
