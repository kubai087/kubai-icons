import { Heading, NarrowPage } from "@/components/kit/layout";
import { FRIENDS, friendHost, LINKS_DESCRIPTION, LINKS_DESCRIPTION_ZH } from "@/lib/friends";
import { pick, type Locale } from "@/lib/i18n";
import { asset, AUTHOR } from "@/lib/site";

/** Friends' sites as cards with their share images, in either language. */
export function LinksPage({ locale }: { locale: Locale }) {
  return (
    <NarrowPage>
      <Heading level={1} title={pick(locale, "Friends", "友情链接")} lead={pick(locale, LINKS_DESCRIPTION, LINKS_DESCRIPTION_ZH)} />
      <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {FRIENDS.map((f) => (
          <li key={f.slug}>
            <a href={f.site} target="_blank" rel="noopener" className="group block space-y-3">
              <div className="overflow-hidden rounded-card border bg-muted">
                <img
                  src={asset(`/friends/${f.slug}.webp`)}
                  alt=""
                  width={1200}
                  height={630}
                  loading="lazy"
                  className="block aspect-[1200/630] h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
                />
              </div>
              <div className="space-y-0.5">
                <p className="font-medium">{f.name}</p>
                <p className="text-control text-muted-foreground">{friendHost(f.site)}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground">
        {pick(locale, "Want to exchange links?", "想交换友链？")}{" "}
        <a href={AUTHOR.x} target="_blank" rel="noreferrer" className="font-medium text-foreground underline underline-offset-4">{pick(locale, "Contact me on X", "在 X 上联系我")}</a>
      </p>
    </NarrowPage>
  );
}
