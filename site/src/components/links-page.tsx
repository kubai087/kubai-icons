import { Container, Heading } from "@/components/kit/layout";
import { FriendsRing } from "@/components/friends-ring";
import { FRIENDS, friendHost } from "@/lib/friends";
import { pick, type Locale } from "@/lib/i18n";
import { asset, AUTHOR } from "@/lib/site";

/**
 * Friends' sites on a turning ring of share images that runs the full width of the window,
 * with a list that turns it, in either language. The title and list keep the page column.
 */
export function LinksPage({ locale }: { locale: Locale }) {
  const friends = FRIENDS.map((f) => ({ ...f, host: friendHost(f.site), image: asset(`/friends/${f.slug}.webp`) }));
  return (
    <div className="min-h-[calc(100dvh-var(--header))] space-y-8 pt-10 pb-section">
      <Container>
        <Heading level={1} title={pick(locale, "Friends", "友情链接")} lead={pick(locale, "In no particular order", "排名不分先后")} />
      </Container>
      <FriendsRing friends={friends} />
      <Container>
        <p className="text-control text-muted-foreground">
          {pick(locale, "Want to exchange links?", "想交换友链？")}{" "}
          <a href={AUTHOR.x} target="_blank" rel="noreferrer" className="font-medium text-foreground underline underline-offset-4">{pick(locale, "Contact me on X", "在 X 上联系我")}</a>
        </p>
      </Container>
    </div>
  );
}
