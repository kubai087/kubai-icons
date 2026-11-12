import { LinksPage } from "@/components/links-page";
import { LINKS_DESCRIPTION_ZH } from "@/lib/friends";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "友情链接", path: "/zh/links/", description: LINKS_DESCRIPTION_ZH });

export default function Page() {
  return <LinksPage locale="zh" />;
}
