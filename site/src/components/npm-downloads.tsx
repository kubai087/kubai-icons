import { pick, type Locale } from "@/lib/i18n";
import { DOWNLOADS_FALLBACK } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Read at build time by next.config.ts, as "total,week". */
const [total, week] = (process.env.NEXT_PUBLIC_NPM_DOWNLOADS ?? "").split(",").map(Number);
const COUNTS = total && week ? { total, week } : DOWNLOADS_FALLBACK;

/** A translated line with its {count} set in the foreground color, wherever the language puts it. */
function Count({ text, count }: { text: string; count: number }) {
  const [before, after = ""] = text.split("{count}");
  return <span className="whitespace-nowrap">{before}<span className="font-medium text-foreground">{count.toLocaleString("en")}</span>{after}</span>;
}

/** The npm packages' combined downloads, shown under the install command. */
export function NpmDownloads({ locale, className }: { locale: Locale; className?: string }) {
  return (
    // Each part keeps to one line, so a narrow screen wraps between them, never inside one.
    // Spacing alone separates them, so a wrapped line has nothing left hanging at its end.
    <p className={cn("flex flex-wrap gap-x-3 text-control text-muted-foreground tabular-nums", className)}>
      <Count text={pick(locale, "{count} npm downloads", "npm 累计下载 {count} 次")} count={COUNTS.total} />
      <Count text={pick(locale, "{count} in the last 7 days", "近 7 天 {count} 次")} count={COUNTS.week} />
    </p>
  );
}
