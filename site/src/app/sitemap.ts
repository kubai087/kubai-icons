import type { MetadataRoute } from "next";
import { allCategories, baseIcons } from "@/lib/catalog";
import { absolute } from "@/lib/seo";
import { hasIconPages, LANGUAGES, localize } from "@/lib/i18n";
import { setPath, setsPath, SET_STYLES } from "@/learn/set-paths";
import { setsOf } from "@/learn/style-sets";
import { COMPARISONS, GUIDES } from "@/learn/pages";

export const dynamic = "force-static";

/** Icon sets are written in English and Simplified Chinese only. */
const EN_ZH_PAGES = SET_STYLES.flatMap((style) => [setsPath(style), ...setsOf(style).map((c) => setPath(style, c.id))]);

const PAGES = ["/", "/icons/", "/icons/submit/", "/docs/", "/docs/react/", "/docs/vue/", "/docs/javascript/", "/docs/static/", "/docs/customize/", "/docs/design/", "/docs/accessibility/", "/docs/performance/", "/docs/analytics/", "/docs/contributing/", "/skill/", "/links/", "/license/", ...GUIDES.map((p) => p.href), ...COMPARISONS.map((p) => p.href)];

export default function sitemap(): MetadataRoute.Sitemap {
  return LANGUAGES.map((l) => l.code).flatMap((locale) => [
    ...PAGES.map((p) => ({ url: absolute(localize(p, locale)) })),
    ...(hasIconPages(locale) ? EN_ZH_PAGES : []).map((p) => ({ url: absolute(localize(p, locale)) })),
    ...allCategories().map((c) => ({ url: absolute(localize(`/icons/category/${c.id}/`, locale)) })),
    ...(hasIconPages(locale) ? baseIcons() : []).map((i) => ({ url: absolute(localize(`/icons/${i.name}/`, locale)), images: [absolute(`/icons/${i.name}/preview.svg`)] })),
  ]);
}
