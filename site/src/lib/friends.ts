import { msg } from "./i18n";

/**
 * Sites we exchange links with, listed on the links page. Each has a 1200×630 preview at
 * public/friends/<slug>.webp, made with `node tools/friend-preview.mjs <slug> <url>`.
 */
export const FRIENDS = [
  { slug: "karl-coding", name: "Karl Coding", site: "https://www.leekarl.com/" },
  { slug: "kubai-icons-for-mygo", name: "Kubai Icons for MyGo", site: "https://kubai.yldm.ai/" },
  { slug: "coldstoneboy", name: "冷石Boy", site: "https://coldstoneboy.cn/" },
  { slug: "uiroot", name: "UI root", site: "https://uiroot.com/" },
  { slug: "happyhands", name: "HappyHands", site: "https://happyhands.cc/apps/portal/" },
  { slug: "uinice", name: "UINice", site: "https://uinice.com/" },
  { slug: "aprilnea", name: "AprilNEA", site: "https://aprilnea.me/" },
  { slug: "dmthefounder", name: "DMtheFounder", site: "https://dmthefounder.com/" },
  { slug: "astrafoundry", name: "AstraFoundry", site: "https://astrafoundry.si/" },
];

export const LINKS_DESCRIPTION = msg("Sites and projects by friends of Kubai Icons, in no particular order.");
export const LINKS_DESCRIPTION_ZH = "Kubai Icons 朋友们的网站和作品，排名不分先后。";

/** The address to show under a friend's name, without the scheme or www. */
export const friendHost = (site: string) => new URL(site).hostname.replace(/^www\./, "");
