import { Container } from "@/components/kit/layout";
import { FriendWall } from "@/components/icon-wall";
import { FRIENDS, friendHost } from "@/lib/friends";
import { pick, type Locale } from "@/lib/i18n";
import { asset, AUTHOR } from "@/lib/site";

/** Partners' sites and an open place, set into a wall of moving icons, in either language. */
export function LinksPage({ locale }: { locale: Locale }) {
  const friends = FRIENDS.map((f) => ({ ...f, host: friendHost(f.site), image: asset(`/friends/${f.slug}.webp`) }));
  return (
    <Container className="min-h-[calc(100dvh-var(--header))] pt-10 pb-section">
      <h1 className="sr-only">{pick(locale, "Partners", "合作伙伴")}</h1>
      <FriendWall
        friends={friends}
        open={{ title: pick(locale, "Become a partner", "成为合作伙伴"), action: pick(locale, "Message on X", "在 X 上联系"), href: AUTHOR.x }}
      />
    </Container>
  );
}
