import { LinksPage } from "@/components/links-page";
import { LINKS_DESCRIPTION } from "@/lib/friends";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Friends", path: "/links/", description: LINKS_DESCRIPTION });

export default function Page() {
  return <LinksPage locale="en" />;
}
