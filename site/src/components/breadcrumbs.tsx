import Link from "next/link";
import { ChevronRightIcon } from "@/components/kit/ui-icons";
import { JsonLd } from "@/components/json-ld";
import { absolute } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

/** The trail to the current page, for readers and as structured data for search engines.
 * It stays on one line: when it runs out of room the current page's name is cut short,
 * rather than wrapping and starting the next line with an arrow. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absolute(c.path) })),
        }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-control text-muted-foreground">
          {trail.map((c, i) => (
            <li key={c.path} className={cn("flex items-center gap-1", i < trail.length - 1 ? "shrink-0" : "min-w-0")}>
              {i > 0 && <ChevronRightIcon aria-hidden className="size-4 shrink-0 rtl:rotate-180" />}
              {i < trail.length - 1 ? <Link href={c.path} className="tap relative transition-colors hover:text-foreground">{c.name}</Link> : <span aria-current="page" title={c.name} className="truncate text-foreground">{c.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
