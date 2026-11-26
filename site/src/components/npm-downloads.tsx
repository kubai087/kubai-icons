"use client";
import { DOWNLOADS_FALLBACK } from "@/lib/site";
import { useTr } from "@/lib/use-locale";
import { cn } from "@/lib/utils";

/** Read at build time by next.config.ts, as "total,week". */
const [total, week] = (process.env.NEXT_PUBLIC_NPM_DOWNLOADS ?? "").split(",").map(Number);
const COUNTS = total && week ? { total, week } : DOWNLOADS_FALLBACK;

/** A translated phrase with its {count} set in the foreground color, wherever the language puts it. */
function Count({ text, count }: { text: string; count: number }) {
  const [before, after = ""] = text.split("{count}");
  return <span className="whitespace-nowrap">{before}<span className="font-medium text-foreground">{count.toLocaleString("en")}</span>{after}</span>;
}

/** The npm packages' combined downloads, as the install box's last row. */
export function NpmDownloads({ className }: { className?: string }) {
  const tr = useTr();
  return (
    // Each phrase keeps to one line, so a narrow screen wraps between them, never inside one.
    <p className={cn("flex flex-wrap gap-x-3 text-caption text-muted-foreground tabular-nums", className)}>
      <Count text={tr("{count} downloads", "累计下载 {count} 次")} count={COUNTS.total} />
      <Count text={tr("{count} in the last 7 days", "近 7 天 {count} 次")} count={COUNTS.week} />
    </p>
  );
}
