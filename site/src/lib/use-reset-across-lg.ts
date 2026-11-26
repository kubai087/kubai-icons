import { useEffect, useState } from "react";

/** Tailwind's `lg`, where the header swaps its narrow menu for the full bar. */
const LG = "(min-width: 64rem)";

/**
 * A key that changes each time the window crosses `lg`. A header menu keyed by it starts over,
 * closed, at once: the button that opened it is hidden on the other side, so a menu left open
 * there would float with nothing to close it from, and a closing animation would only linger.
 */
export function useResetAcrossLg() {
  const [key, setKey] = useState(0);
  useEffect(() => {
    const query = matchMedia(LG);
    const reset = () => setKey((k) => k + 1);
    query.addEventListener("change", reset);
    return () => query.removeEventListener("change", reset);
  }, []);
  return key;
}
