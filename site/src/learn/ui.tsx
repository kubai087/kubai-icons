import { IntentLink } from "@/components/kit/intent-link";
import type { ReactNode } from "react";
import { localize, type Locale } from "@/lib/i18n";
import { asset } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Collection } from "./collections";
import { LinePreview } from "@/components/browser/line-look";
import { previewPath, setPath, type SetStyle } from "./set-paths";

/** A titled block of an icon or set page, so every block shares one heading and rhythm. */
export function PageSection({ title, action, className, children }: { title: string; action?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-heading font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Label and value rows, such as an icon's category, motion and versions. `stackAtXl` puts each label above its value from xl, where the block sits in a side column; `bare` leaves out the border, for rows inside a card. */
export function Facts({ rows, stackAtXl = false, bare = false }: { rows: { label: string; value: ReactNode }[]; stackAtXl?: boolean; bare?: boolean }) {
  return (
    <dl className={cn("divide-y text-body", !bare && "rounded-card border")}>
      {rows.map((r) => (
        <div key={r.label} className={cn("grid gap-1.5 px-4 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4", stackAtXl && "xl:grid-cols-1 xl:gap-1.5")}>
          <dt className={cn("text-control text-muted-foreground sm:pt-0.5", stackAtXl && "xl:pt-0")}>{r.label}</dt>
          <dd className="min-w-0 text-foreground/90">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Short labels that are not links, such as the badges an icon comes with. */
export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1">
      {items.map((t) => <li key={t} className="rounded-control bg-muted px-2 py-0.5 text-caption text-muted-foreground">{t}</li>)}
    </ul>
  );
}

const card = "tap relative grid h-full content-start gap-3 rounded-card border p-5 transition-colors hover:bg-muted/50";

/** Icon sets of one style as cards: a row of their icons, the title and the count. */
export function SetCards({ sets, locale, style = "layered", className }: { sets: Collection[]; locale: Locale; style?: SetStyle; className?: string }) {
  const zh = locale === "zh";
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {sets.map((c) => (
        <li key={c.id}>
          <IntentLink href={localize(setPath(style, c.id), locale)} className={card}>
            <span className="flex gap-2" aria-hidden>
              {c.icons.slice(0, 6).map((n) =>
                style === "line" ? (
                  <LinePreview key={n} name={n} size={32} src={previewPath(style, n)} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={n} src={asset(previewPath(style, n))} alt="" width={32} height={32} loading="lazy" decoding="async" />
                ),
              )}
            </span>
            <span className="grid gap-0.5">
              <span className="font-medium">{zh ? c.zhTitle : c.title}</span>
              <span className="text-control text-muted-foreground">{zh ? `${c.icons.length} 个图标` : `${c.icons.length} icons`}</span>
            </span>
          </IntentLink>
        </li>
      ))}
    </ul>
  );
}
