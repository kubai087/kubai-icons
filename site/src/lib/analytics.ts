// Product analytics, off unless configured at build time. Supports Umami
// (NEXT_PUBLIC_UMAMI_WEBSITE_ID, NEXT_PUBLIC_UMAMI_SRC) and Plausible
// (NEXT_PUBLIC_PLAUSIBLE_DOMAIN, NEXT_PUBLIC_PLAUSIBLE_SRC). Both are cookieless. Events
// carry icon names, formats and search terms, never anything about the visitor. Browsers
// that send Do Not Track or Global Privacy Control are never tracked.

type Props = Record<string, string | number | boolean>;
type W = Window & {
  umami?: { track: (event: string, data?: Props) => void };
  plausible?: (event: string, options?: { props?: Props }) => void;
  doNotTrack?: string;
};

export const analytics = {
  umami: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
    ? { id: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID, src: process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js" }
    : null,
  plausible: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
    ? { domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN, src: process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js" }
    : null,
};

export function optedOut(): boolean {
  if (typeof window === "undefined") return true;
  const w = window as W;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  return nav.doNotTrack === "1" || w.doNotTrack === "1" || nav.msDoNotTrack === "1" || nav.globalPrivacyControl === true;
}

export type EventName =
  | "icon_open"
  | "icon_copy"
  | "icon_download"
  | "collection_download"
  | "search"
  | "search_empty"
  | "filter_category"
  | "install_copy"
  | "request_icon"
  | "icon_submit"
  | "feedback_open"
  | "author_x_open";

/** The global name of the Umami before-send hook (see sendableUrl). */
export const UMAMI_BEFORE_SEND = "kubaiUmamiBeforeSend";

/**
 * The address as analytics receives it: no fragment, and of the query only the campaign
 * (utm_*) parameters. The rest of the query holds the search term, category and open icon,
 * which the events already carry.
 */
export function sendableUrl(url: string): string {
  try {
    const u = new URL(url);
    const campaign = [...u.searchParams].filter(([key]) => key.startsWith("utm_"));
    u.search = new URLSearchParams(campaign).toString();
    u.hash = "";
    return u.toString();
  } catch {
    return url;
  }
}

/** Installs the before-send hook that passes page and referrer addresses through sendableUrl. */
export function installUmamiHook() {
  const w = window as unknown as Record<string, unknown>;
  w[UMAMI_BEFORE_SEND] = (_type: string, payload: { url?: string; referrer?: string }) => ({
    ...payload,
    ...(payload.url && { url: sendableUrl(payload.url) }),
    ...(payload.referrer && { referrer: sendableUrl(payload.referrer) }),
  });
}

/** Records a product event. Does nothing when analytics is off or the visitor opted out. */
export function track(event: EventName, props: Props = {}) {
  if (optedOut()) return;
  const w = window as W;
  try {
    if (w.umami) w.umami.track(event, props);
    else if (w.plausible) w.plausible(event, { props });
  } catch {
    // Analytics must never break the page.
  }
}
