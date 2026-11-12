import { Container, Heading } from "@/components/kit/layout";
import { FriendFolders } from "@/components/friend-folders";
import { FRIENDS, friendHost } from "@/lib/friends";
import { pick, type Locale } from "@/lib/i18n";
import { asset, AUTHOR } from "@/lib/site";

/** Friends' sites as folders holding their share images, in either language. */
export function LinksPage({ locale }: { locale: Locale }) {
  const friends = FRIENDS.map((f) => ({ ...f, host: friendHost(f.site), image: asset(`/friends/${f.slug}.webp`) }));
  return (
    <Container className="min-h-[calc(100dvh-var(--header))] space-y-8 pt-10 pb-section">
      <Heading level={1} title={pick(locale, "Friends", "友情链接")} lead={pick(locale, "In no particular order", "排名不分先后")} />
      <FriendFolders
        friends={friends}
        invite={{ title: pick(locale, "Want to exchange links?", "想交换友链？"), action: pick(locale, "Contact me on X", "在 X 上联系我"), href: AUTHOR.x }}
      />
    </Container>
  );
}
