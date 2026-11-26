"use client";
import Link from "next/link";
import { useState, type ComponentProps } from "react";

/**
 * A link for long lists (every icon, every category), where prefetching each one on sight
 * would fetch hundreds of pages. It prefetches once the reader points at it, touches it or
 * tabs to it, so the page is usually on its way before the click.
 */
export function IntentLink({ onMouseEnter, onTouchStart, onFocus, ...props }: Omit<ComponentProps<typeof Link>, "prefetch">) {
  const [intent, setIntent] = useState(false);
  return (
    <Link
      {...props}
      prefetch={intent ? null : false}
      onMouseEnter={(e) => { setIntent(true); onMouseEnter?.(e); }}
      onTouchStart={(e) => { setIntent(true); onTouchStart?.(e); }}
      onFocus={(e) => { setIntent(true); onFocus?.(e); }}
    />
  );
}
