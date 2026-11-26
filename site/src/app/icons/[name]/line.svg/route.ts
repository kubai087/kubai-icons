import * as line from "kubai-icons/line";
import type { KubaiIconData } from "kubai-icons";
import { styleIcons } from "@/lib/catalog";
import { pascal } from "@/lib/icons";
import { LINE_SITE_STROKE } from "@/lib/line";

export const dynamic = "force-static";
export const dynamicParams = false;
const icons = line as unknown as Record<string, KubaiIconData>;
export const generateStaticParams = () => styleIcons("line").filter((i) => icons[pascal(i.name)]).map((i) => ({ name: i.name }));

// Browsers keep it a day and refresh it in the background for a week after, like the layered preview.
const PREVIEW_CACHE = "public, max-age=86400, stale-while-revalidate=604800";
/** The slate ink the icon browser gives line icons until a visitor picks a colour. */
const INK = "#64748B";

// A standalone image of the line icon at rest: the outline variant at the site's stroke width.
export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const svg = line.toSvg(icons[pascal(name)], { color: INK, size: 24, strokeWidth: LINE_SITE_STROKE, id: "k" });
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": PREVIEW_CACHE } });
}
