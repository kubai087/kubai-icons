// Which new icons the visitor has already opened, and which set of them the New category last
// showed, so the "New" marks go once they have been seen. Kept in this browser only.
import { useSyncExternalStore } from "react";

const KEY = "kubai-seen-new";
type Seen = { category: string; icons: string[] };
const EMPTY: Seen = { category: "", icons: [] };

let cache: Seen | null = null;
const listeners = new Set<() => void>();

function read(): Seen {
  if (cache) return cache;
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null");
    cache = value && typeof value.category === "string" && Array.isArray(value.icons) ? value : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

function write(next: Seen) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* the marks still go for this visit */ }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab may mark something seen.
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; listener(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}

/** True once the visitor has opened this icon. */
export const useIconSeen = (name: string) => useSyncExternalStore(subscribe, () => read().icons.includes(name), () => false);

export function markIconSeen(name: string) {
  const seen = read();
  if (!seen.icons.includes(name)) write({ ...seen, icons: [...seen.icons, name] });
}

/**
 * True once the visitor has opened the New category while it held this set of icons, given
 * as their names joined. A later release brings a new set, and the mark back with it.
 */
export const useNewSetSeen = (set: string) => useSyncExternalStore(subscribe, () => read().category === set, () => false);

export function markNewSetSeen(set: string) {
  const seen = read();
  if (seen.category !== set) write({ ...seen, category: set });
}
