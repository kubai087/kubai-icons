"use client";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/kit/ui-icons";
import { quietLink } from "@/components/kit/styles";
import { hasIconPages, localize } from "@/lib/i18n";
import type { IconMeta } from "@/lib/icons";
import { useLocale } from "@/lib/use-locale";
import { cn } from "@/lib/utils";

/** From the icon browser's panel to the icon's own page; English and Chinese only. A badged icon opens its base icon's page. */
export function IconPageLink({ meta }: { meta: IconMeta }) {
  const locale = useLocale();
  if (!hasIconPages(locale)) return null;
  return (
    <Link href={localize(`/icons/${meta.base ?? meta.name}/`, locale)} className={cn("tap relative flex items-center gap-0.5 text-caption font-medium", quietLink)}>
      {locale === "zh" ? "图标详情页" : "Icon page"}
      <ChevronRightIcon aria-hidden className="size-4 rtl:rotate-180" />
    </Link>
  );
}
