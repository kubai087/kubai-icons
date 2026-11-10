"use client";
import { useState } from "react";
import { toast } from "sonner";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { browserLocale, pick } from "@/lib/i18n";
import { useTr } from "@/lib/use-locale";
import { cn } from "@/lib/utils";


/**
 * Copies through a hidden text field. Pages served over plain http from a LAN address, and some
 * embedded browsers, have no clipboard API or refuse it, but still allow this older way.
 */
function copyBySelection(text: string) {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  Object.assign(field.style, { position: "fixed", top: "0", left: "0", opacity: "0", pointerEvents: "none" });
  const focused = document.activeElement as HTMLElement | null;
  document.body.append(field);
  field.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; }
  field.remove();
  focused?.focus({ preventScroll: true });
  return ok;
}

/** Copies text and confirms it in a toast; `quiet` leaves the confirming to the caller. */
export async function copyText(text: string, { quiet = false }: { quiet?: boolean } = {}) {
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch {
    ok = copyBySelection(text);
  }
  if (ok && !quiet) toast.success(pick(browserLocale(), "Copied", "已复制"));
  if (!ok) toast.error(pick(browserLocale(), "Copy failed", "复制失败"));
  return ok;
}

export function CopyButton({ text, className, onCopy }: { text: string; className?: string; onCopy?: () => void }) {
  const [done, setDone] = useState(false);
  const tr = useTr();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn("text-muted-foreground", className)}
      aria-label={tr("Copy", "复制")}
      data-kubai-trigger
      onClick={async () => {
        if (await copyText(text)) {
          onCopy?.();
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        }
      }}
    >
      <span className="grid *:[grid-area:1/1] *:transition-[opacity,scale] *:duration-200 *:ease-out motion-reduce:*:transition-none">
        <RiFileCopyLine className={cn("size-4", done && "scale-50 opacity-0")} />
        <RiCheckLine className={cn("size-4 text-positive", !done && "scale-50 opacity-0")} />
      </span>
    </Button>
  );
}
