import { Download } from "kubai-icons-react";
import { pick, type Locale } from "@/lib/i18n";
import { DOWNLOADS_FALLBACK } from "@/lib/site";

/** Read at build time by next.config.ts, as "total,week". */
const [total, week] = (process.env.NEXT_PUBLIC_NPM_DOWNLOADS ?? "").split(",").map(Number);
const COUNTS = total && week ? { total, week } : DOWNLOADS_FALLBACK;

/** A translated line with its {count} set in the foreground color, wherever the language puts it. */
function Count({ text, count }: { text: string; count: number }) {
  const [before, after = ""] = text.split("{count}");
  return <>{before}<span className="font-medium text-foreground">{count.toLocaleString("en")}</span>{after}</>;
}

/** The npm packages' combined downloads, for the home page hero. */
export function NpmDownloads({ locale }: { locale: Locale }) {
  return (
    <p data-kubai-trigger className="flex items-center gap-1.5 tabular-nums">
      <Download size={16} color="#10B981" trigger="parent" aria-hidden />
      <span>
        <Count text={pick(locale, "{count} npm downloads", "npm 累计下载 {count} 次")} count={COUNTS.total} />
        {/* Phones show the total alone, so the line stays beside the author. */}
        <span className="max-sm:hidden">
          <span aria-hidden className="mx-1.5">·</span>
          <Count text={pick(locale, "{count} in the last 7 days", "近 7 天 {count} 次")} count={COUNTS.week} />
        </span>
      </span>
    </p>
  );
}
