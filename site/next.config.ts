import type { NextConfig } from "next";
import { DOWNLOADS_FALLBACK, fetchDownloads, fetchStars } from "./src/lib/site";

// Static export. BASE_PATH is set only when the site is served from a sub-path.
const basePath = process.env.BASE_PATH ?? "";

export default async function config(): Promise<NextConfig> {
  const [stars, downloads] = await Promise.all([
    fetchStars({ signal: AbortSignal.timeout(5000) }),
    fetchDownloads({ signal: AbortSignal.timeout(5000) }),
  ]);
  if (!downloads) console.warn("npm downloads could not be read; using the saved counts.");
  const { total, week } = downloads ?? DOWNLOADS_FALLBACK;
  return {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
    env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_GITHUB_STARS: String(stars ?? ""), NEXT_PUBLIC_NPM_DOWNLOADS: `${total},${week}` },
    turbopack: {
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      },
    },
  };
}
