"use client";
import { useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { IconMeta, Category } from "@/lib/icons";
import type { Badge as BadgeMode } from "./prefs";
import { IconDetail } from "./icon-detail";

type Props = {
  meta: IconMeta | null;
  related: IconMeta[];
  categories: Category[];
  color: string;
  variant: "color" | "soft";
  badge: BadgeMode;
  onBadge: (b: BadgeMode) => void;
  onClose: () => void;
  onOpen: (m: IconMeta) => void;
  onCategory: (id: string) => void;
  onKeyword: (word: string) => void;
};

export function IconDialog({ meta: current, related: currentRelated, onClose, ...rest }: Props) {
  // The last icon stays in the panel while it animates out, so the panel keeps its size.
  const kept = useRef({ meta: current, related: currentRelated });
  if (current) kept.current = { meta: current, related: currentRelated };
  const { meta, related } = kept.current;
  // Focus starts on the panel rather than its first control, so opening from the address
  // shows no focus ring. The arrow keys scroll the panel from here.
  const content = useRef<HTMLDivElement>(null);
  const open = Boolean(current);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent initialFocus={content} className="max-h-[calc(100dvh-2rem)] gap-0 rounded-panel p-0 sm:max-w-3xl" closeClassName="top-3 end-3 size-8">
        {/* Only the content scrolls, so the close button stays in reach. */}
        <div ref={content} tabIndex={-1} className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[inherit] outline-none">
          {meta && <IconDetail meta={meta} related={related} title={DialogTitle} description={DialogDescription} {...rest} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
