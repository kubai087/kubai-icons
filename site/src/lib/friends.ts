import list from "./friends.json";
import { msg } from "./i18n";

/**
 * Sites we exchange links with, listed on the links page, in friends.json. Each has a
 * 1200×630 preview at public/friends/<slug>.webp. Add one with `node tools/friend-preview.mjs
 * <slug> <url>`; every deploy refreshes them all (`--all`), and a check every six hours
 * redeploys when a friend's share image changes. `preview` is the page to read when the
 * site's address only redirects.
 */
export const FRIENDS: { slug: string; name: string; site: string; preview?: string }[] = list;

export const LINKS_DESCRIPTION = msg("Sites and projects by friends of Kubai Icons, in no particular order.");
export const LINKS_DESCRIPTION_ZH = "Kubai Icons 朋友们的网站和作品，排名不分先后。";

/** The address to show under a friend's name, without the scheme or www. */
export const friendHost = (site: string) => new URL(site).hostname.replace(/^www\./, "");
