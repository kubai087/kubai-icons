import type { Metadata } from "next";
import { LinksPage } from "@/components/links-page";
import { LINKS_DESCRIPTION } from "@/lib/friends";
import { localize, translated } from "@/lib/i18n";
import { pageLanguage } from "@/lib/page-language";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLanguage(params);
  return pageMeta({ title: translated(locale, "Partners"), path: localize("/links/", locale), description: translated(locale, LINKS_DESCRIPTION) });
}

export default async function Page({ params }: Props) {
  return <LinksPage locale={await pageLanguage(params)} />;
}
