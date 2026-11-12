import list from "./friends.json";
import { msg } from "./i18n";

/**
 * Partners' sites, exchanged or bought, listed on the links page, in friends.json. Each has a
 * 1200×630 preview at public/friends/<slug>.webp. Add one with `node tools/friend-preview.mjs
 * <slug> <url>`; every deploy refreshes them all (`--all`), and a check every six hours
 * redeploys when a friend's share image changes. `preview` is the page to read when the
 * site's address only redirects or carries tracking parameters. `sponsored` marks a paid place, so its link carries
 * rel="sponsored" for search engines; it looks the same as the others.
 */
export const FRIENDS: { slug: string; name: string; site: string; preview?: string; sponsored?: boolean }[] = list;

export const LINKS_DESCRIPTION = msg("Sites and products that partner with Kubai Icons, in no particular order.");
export const LINKS_DESCRIPTION_ZH = "与 Kubai Icons 合作的网站和产品，排名不分先后。";

/** The address to show under a friend's name, without the scheme or www. */
export const friendHost = (site: string) => new URL(site).hostname.replace(/^www\./, "");
