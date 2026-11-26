// The pieces of the "All icons by category" section under the icon browser, shared by the
// layered version, rendered on the server, and the two-tone and line versions, drawn in the page.
import { IntentLink } from "@/components/kit/intent-link";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "@/components/kit/ui-icons";
import { quietLink } from "@/components/kit/styles";
import { cn } from "@/lib/utils";

export const PREVIEWS = 6;

/** A few items from across a list, so the sample is not six variants of one name. */
export const sample = <T,>(items: T[]) =>
  items.length <= PREVIEWS ? items : Array.from({ length: PREVIEWS }, (_, k) => items[Math.floor((k * items.length) / PREVIEWS)]);

/** The section, its heading and count, the category cards and the closed list of every icon name. */
export function IndexSection({ zh, total, count, cards, names }: { zh: boolean; total: number; count: number; cards: ReactNode; names: ReactNode }) {
  return (
    <section aria-labelledby="icon-index" className="mt-section space-y-6 border-t pt-10 pb-section">
      <div className="space-y-1">
        <h2 id="icon-index" className="font-heading text-subheading font-semibold">{zh ? "按分类浏览全部图标" : "All icons by category"}</h2>
        <p className="text-sm text-muted-foreground">{zh ? `${count} 个分类，共 ${total} 个图标` : `${total} icons in ${count} categories`}</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">{cards}</ul>
      <details className="group/all">
        <summary className={cn(quietLink, "focus-inset inline-flex cursor-pointer list-none items-center gap-1.5 rounded-control text-sm [&::-webkit-details-marker]:hidden")}>
          <svg viewBox="0 0 16 16" className="size-3.5 transition-transform group-open/all:rotate-90" aria-hidden>
            <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {zh ? `查看全部 ${total} 个图标名称` : `View all ${total} icon names`}
        </summary>
        <div className="mt-6 columns-1 gap-8 sm:columns-2 lg:columns-3">{names}</div>
      </details>
    </section>
  );
}

/** One category as a card: its name, its count and a row of its icons. */
export function IndexCard({ href, name, count, zh, onClick, icons }: { href: string; name: string; count: number; zh: boolean; onClick?: (e: React.MouseEvent) => void; icons: ReactNode[] }) {
  return (
    <li>
      <IntentLink
        href={href}
        onClick={onClick}
        // With a click handler, the card filters the page it is on.
        data-in-page={onClick ? true : undefined}
        // A white card with a light border, so its grey icon tiles stand out. Hover lifts it with a
        // soft shadow, and its icons rise in turn, left to right.
        className="group flex h-full flex-col gap-4 rounded-card border border-border/60 bg-background p-4 transition-[border-color,box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-sm motion-reduce:hover:translate-y-0"
      >
        <span className="flex items-baseline justify-between gap-3">
          <span className="min-w-0 text-sm font-semibold">{name}</span>
          <span className="flex shrink-0 items-center text-caption text-muted-foreground tabular-nums transition-colors group-hover:text-foreground">
            {zh ? `${count} 个` : count}
            <ChevronRightIcon aria-hidden className="-me-1 size-4 opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:rotate-180 motion-reduce:transition-none" />
          </span>
        </span>
        {/* Phones fit three, so the rest hide there. */}
        <span className="mt-auto grid grid-cols-3 gap-1.5 max-sm:[&>:nth-child(n+4)]:hidden sm:grid-cols-6" aria-hidden>
          {icons.map((icon, k) => (
            <span key={k} style={{ transitionDelay: `${k * 35}ms` }} className="grid aspect-square place-items-center rounded-control bg-surface transition-transform duration-200 ease-out group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
              {icon}
            </span>
          ))}
        </span>
      </IntentLink>
    </li>
  );
}

/** One category's icon names in the closed list. */
export function IndexNames({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-6 break-inside-avoid space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-caption text-muted-foreground [&_a:hover]:text-foreground [&_a:hover]:underline">{children}</ul>
    </div>
  );
}
