import * as duotone from "kubai-icons/duotone";
import type { KubaiIconData } from "kubai-icons";
import { styleIcons } from "@/lib/catalog";
import { pascal } from "@/lib/icons";
import { mixedColor } from "@/lib/palette";

export const dynamic = "force-static";
export const dynamicParams = false;
const icons = duotone as unknown as Record<string, KubaiIconData>;
export const generateStaticParams = () => styleIcons("duotone").filter((i) => icons[pascal(i.name)]).map((i) => ({ name: i.name }));

// Browsers keep it a day and refresh it in the background for a week after, like the layered preview.
const PREVIEW_CACHE = "public, max-age=86400, stale-while-revalidate=604800";

// A standalone image of the two-tone icon at rest, in the colour the grid gives it.
export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const svg = duotone.toSvg(icons[pascal(name)], { color: mixedColor(name), size: 512, id: "k" });
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": PREVIEW_CACHE } });
}
