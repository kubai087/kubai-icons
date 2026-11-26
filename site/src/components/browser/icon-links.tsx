import Link from "next/link";
import { tile } from "@/components/kit/styles";
import { localNameOf } from "@/lib/catalog";
import type { IconMeta } from "@/lib/icons";
import { iconLabel } from "@/lib/seo";
import { asset } from "@/lib/site";
import { cn } from "@/lib/utils";
import { localize, pick, type Locale } from "@/lib/i18n";
import { iconHref, previewPath, type SetStyle } from "@/learn/set-paths";
import { LinePreview } from "./line-look";

/** The words after an icon's name in the alt text of a two-tone or line icon, whose pages are in English and Chinese only. */
const STYLE_ALT = { duotone: [" two-tone icon", "双色图标"], line: [" line icon", "线性图标"] } as const;

/** A grid of plain links to icon pages, or for two-tone and line icons to the icon in the browser. Each icon is an image, so a long list stays light. */
export function IconLinks({ icons, locale = "en", style = "layered" }: { icons: IconMeta[]; locale?: Locale; style?: SetStyle }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-tiles">
      {icons.map((i) => {
        const name = locale === "en" ? undefined : localNameOf(i, locale);
        return (
          <li key={i.name}>
            <Link href={localize(iconHref(style, i.name), locale)} prefetch={false} title={name ? `${name} ${i.name}` : undefined} data-kubai-trigger={style === "line" || undefined} className={cn(tile(), "aspect-[4/3] w-full content-center sm:aspect-square gap-2 p-2 text-center")}>
              {style === "line" ? (
                // Live, at the line variant and stroke width chosen on the page or in the browser.
                <LinePreview name={i.name} size={40} src={previewPath(style, i.name)} alt={`${name ?? iconLabel(i.name)}${STYLE_ALT.line[locale === "zh" ? 1 : 0]}`} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset(previewPath(style, i.name))} alt={style === "layered" ? pick(locale, "{label} icon", "{label}图标", { label: name ?? iconLabel(i.name) }) : `${name ?? iconLabel(i.name)}${STYLE_ALT[style][locale === "zh" ? 1 : 0]}`} width={40} height={40} loading="lazy" decoding="async" />
              )}
              <span className={cn("w-full truncate text-caption text-muted-foreground", !name && "font-mono")}>{name ?? i.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
