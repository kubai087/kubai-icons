"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { analytics, installUmamiHook, optedOut, UMAMI_BEFORE_SEND } from "@/lib/analytics";
import { SITE_URL } from "@/lib/site";

// Page views count on the public address only, not on preview deployments.
const HOSTNAME = new URL(SITE_URL).hostname;

/** Loads the configured analytics script, for visitors who have not opted out. */
export function AnalyticsScript() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (optedOut()) return;
    if (analytics.umami) installUmamiHook();
    setAllowed(true);
  }, []);
  if (!allowed) return null;
  if (analytics.umami) {
    return <Script src={analytics.umami.src} data-website-id={analytics.umami.id} data-domains={HOSTNAME} data-before-send={UMAMI_BEFORE_SEND} data-do-not-track="true" data-exclude-hash="true" strategy="afterInteractive" />;
  }
  if (analytics.plausible) {
    return <Script src={analytics.plausible.src} data-domain={analytics.plausible.domain} strategy="afterInteractive" />;
  }
  return null;
}
