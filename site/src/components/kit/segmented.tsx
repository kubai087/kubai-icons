"use client";
import type { ReactNode } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Glide } from "@/components/kit/glide";
import { raised, well } from "@/components/kit/styles";
import { cn } from "@/lib/utils";

/** A one-of-several switch: Color/Soft, sizes, badge colours. */
export function Segmented<V extends string>({ value, options, onChange, label, dense = false, fill = false }: {
  value: V;
  options: { value: V; label: ReactNode; title?: string }[];
  onChange: (v: V) => void;
  label?: string;
  /** Narrower items, for icon labels. */
  dense?: boolean;
  /** On phones, the full width of the row, its items equally wide. */
  fill?: boolean;
}) {
  return (
    <div className={cn("relative isolate w-fit rounded-lg p-[3px]", fill && "max-sm:w-full", well)}>
      <ToggleGroup value={[value]} onValueChange={(v) => v[0] && onChange(v[0] as V)} spacing={0} aria-label={label} className={cn(fill && "max-sm:w-full")}>
        {options.map((o) => (
          <ToggleGroupItem
            key={o.value}
            value={o.value}
            title={o.title}
            className={cn("tap relative h-[26px] min-w-0 rounded-md! text-muted-foreground", fill && "max-sm:flex-1", dense ? "group-data-[spacing=0]/toggle-group:px-2" : "group-data-[spacing=0]/toggle-group:px-3", " hover:bg-transparent aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-xs aria-pressed:in-[[data-glide]]:bg-transparent! aria-pressed:in-[[data-glide]]:shadow-none!")}
          >
            {o.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Glide selector="[aria-pressed=true]" className={cn("rounded-md", raised)} />
    </div>
  );
}
