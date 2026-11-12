import { MovedPage } from "@/components/moved-page";
import { LINKS_DESCRIPTION_ZH } from "@/lib/friends";
import { pageMeta } from "@/lib/seo";

// Links to /sponsor/ still reach the partners page.
export const metadata = pageMeta({ title: "合作伙伴", path: "/zh/links/", description: LINKS_DESCRIPTION_ZH });

export default function Page() {
  return <MovedPage to="/zh/links/" label="合作伙伴" />;
}
