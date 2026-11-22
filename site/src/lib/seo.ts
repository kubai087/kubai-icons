import type { Metadata } from "next";
import { hasIconPages, isEnZhOnly, languageOf, LANGUAGES, localeOf, localize, msg } from "./i18n";
import { SITE_URL } from "./site";

export const SITE_NAME = "Kubai Icons";
export const HOME_TITLE = msg("Kubai Icons: animated open-source icons for React, Vue and SVG");
export const HOME_TITLE_ZH = "Kubai Icons：开源的动态图标，提供 React、Vue 组件与静态 SVG";
export const HOME_DESCRIPTION_ZH = "带悬停动效的开源分层图标，支持 React、Vue、Web Component 和静态 SVG。";
export const HOME_DESCRIPTION = msg("Open-source layered icons with hover motion for React, Vue, web components and static SVG. Folders open, bells ring and locks unlock.");
/** The full address of a page, given its path with the trailing slash. */
export const absolute = (path: string) => `${SITE_URL}${path}`;

const IMAGE = { url: absolute("/assets/og.png"), width: 1200, height: 630, alt: "Kubai Icons: animated open-source icons for React, Vue and the web" };

/** Title, description, canonical address and social cards for one page. */
export function pageMeta({ title, description, path, fullTitle }: { title?: string; description: string; path: string; fullTitle?: string }): Metadata {
  const shown = fullTitle ?? `${title} – ${SITE_NAME}`;
  const url = absolute(path);
  return {
    title: fullTitle ? { absolute: fullTitle } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(LANGUAGES.filter((l) => hasIconPages(l.code) || !isEnZhOnly(localize(path, "en"))).map((l) => [l.tag, absolute(localize(path, l.code))])),
        "x-default": absolute(localize(path, "en")),
      },
    },
    openGraph: { type: "website", siteName: SITE_NAME, locale: languageOf(localeOf(path)).og, title: shown, description, url, images: [IMAGE] },
    twitter: { card: "summary_large_image", title: shown, description, images: [IMAGE.url] },
  };
}

/** Name parts written in capitals or with their own spelling. */
const SPELLED: Record<string, string> = {
  "3d": "3D", atm: "ATM", ccw: "CCW", cctv: "CCTV", cd: "CD", cpu: "CPU", crt: "CRT", cw: "CW", dna: "DNA",
  ev: "EV", hdmi: "HDMI", id: "ID", nfc: "NFC", pda: "PDA", pos: "POS", qr: "QR", rss: "RSS", sd: "SD",
  sim: "SIM", tv: "TV", ufo: "UFO", usb: "USB", "usb-c": "USB-C", vhs: "VHS", vr: "VR", wifi: "Wi-Fi",
};

/** Pairs that keep their hyphen, since that is how they are written. */
const HYPHENATED = new Set(["usb-c", "e-reader", "x-ray", "yo-yo"]);

/** "arrow-left-right" as readers would write it: "Arrow left right"; "usb-c-port" becomes "USB-C port". */
export const iconLabel = (name: string) => {
  const parts = name.split("-");
  const words: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const pair = `${parts[i]}-${parts[i + 1]}`;
    const word = HYPHENATED.has(pair) ? (i++, pair) : parts[i];
    words.push(SPELLED[word] ?? word);
  }
  const label = words.join(" ");
  return label[0].toUpperCase() + label.slice(1);
};
