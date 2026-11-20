"use client";
// Every two-tone icon, live: hover one to play its motion. Loads the style's one chunk.
import { useEffect, useState } from "react";
import { KubaiIcon } from "kubai-icons-react";
import type { KubaiIconData } from "kubai-icons";
import { loadIcon, loadIndex, peekIcon, type IconMeta } from "@/lib/icons";
import { tile } from "@/components/kit/styles";
import { cn } from "@/lib/utils";

export function DuotoneWall({ color = "#5A76F2", onlyBases = true }: { color?: string; onlyBases?: boolean }) {
  const [icons, setIcons] = useState<{ meta: IconMeta; icon: KubaiIconData }[] | null>(null);
  useEffect(() => {
    let live = true;
    loadIndex().then(async (index) => {
      const list = index.duotone.filter((m) => !onlyBases || !m.base);
      if (list[0]) await loadIcon(list[0]);
      if (live) setIcons(list.flatMap((meta) => { const icon = peekIcon(meta.name, "duotone"); return icon ? [{ meta, icon }] : []; }));
    }).catch(() => { /* the page reads without it */ });
    return () => { live = false; };
  }, [onlyBases]);
  return (
    <div className="not-prose my-6 grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-2">
      {(icons ?? []).map(({ meta, icon }) => (
        <div key={meta.name} title={meta.name} className={cn(tile({ interactive: false }), "aspect-square")}>
          <KubaiIcon icon={icon} size={28} color={color} />
        </div>
      ))}
      {!icons && Array.from({ length: 24 }, (_, i) => <div key={i} className={cn(tile({ interactive: false }), "aspect-square")} />)}
    </div>
  );
}
