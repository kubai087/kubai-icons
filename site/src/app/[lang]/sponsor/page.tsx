import type { Metadata } from "next";
import { MovedPage } from "@/components/moved-page";
import { LINKS_DESCRIPTION } from "@/lib/friends";
import { localize, translated } from "@/lib/i18n";
import { pageLanguage } from "@/lib/page-language";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

// Links to /sponsor/ still reach the partners page.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLanguage(params);
  return pageMeta({ title: translated(locale, "Partners"), path: localize("/links/", locale), description: translated(locale, LINKS_DESCRIPTION) });
}

export default async function Page({ params }: Props) {
  const locale = await pageLanguage(params);
  return <MovedPage to={localize("/links/", locale)} label={translated(locale, "Partners")} />;
}
