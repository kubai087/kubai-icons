import { MovedPage } from "@/components/moved-page";
import { LINKS_DESCRIPTION } from "@/lib/friends";
import { pageMeta } from "@/lib/seo";

// Links to /sponsor/ still reach the partners page.
export const metadata = pageMeta({ title: "Partners", path: "/links/", description: LINKS_DESCRIPTION });

export default function Page() {
  return <MovedPage to="/links/" label="Partners" />;
}
