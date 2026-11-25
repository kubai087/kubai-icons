"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Glide } from "@/components/kit/glide";
import { cn } from "@/lib/utils";

/**
 * A value set by a common preset, by dragging, or by typing a number: the icon size in pixels,
 * and the line style's stroke width. The slider, the arrow keys and typed values all snap to
 * `step`; `decimals` allows typing a decimal point (stroke widths such as 2.25).
 */
export function SizeControl({ value, onChange, min, max, step = 1, decimals = false, stretch = false, presets, label, commonLabel, pixelsLabel, className }: {
  value: number;
  onChange: (size: number) => void;
  min: number;
  max: number;
  step?: number;
  decimals?: boolean;
  /** The slider takes all the room left at every width (two controls side by side). */
  stretch?: boolean;
  presets: number[];
  label: string;
  commonLabel: string;
  pixelsLabel: string;
  className?: string;
}) {
  // What is being typed, which may be unfinished or out of range. Null when not typing.
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const snap = (n: number) => clamp(+(Math.round((n - min) / step) * step + min).toFixed(3));

  const type = (raw: string) => {
    const text = (decimals ? raw.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1") : raw.replace(/\D/g, "")).slice(0, 4);
    setDraft(text);
    const n = Number(text);
    if (text && !text.endsWith(".") && n >= min && n <= max && snap(n) === n) onChange(n);
  };
  const finish = () => {
    if (draft && !Number.isNaN(Number(draft))) onChange(snap(Number(draft)));
    setDraft(null);
  };
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      setDraft(null);
      onChange(snap(value + (e.key === "ArrowUp" ? 1 : -1) * step * (e.shiftKey ? 4 : 1)));
    }
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div role="group" aria-label={commonLabel} className="relative isolate flex w-32 shrink-0 justify-between pointer-coarse:w-auto">
        <Glide selector="[aria-pressed=true]" className="rounded-control bg-muted" />
        {presets.map((size) => {
          const on = size === value;
          return (
            <button
              key={size}
              type="button"
              aria-pressed={on}
              onClick={() => { setDraft(null); onChange(size); }}
              className={cn(
                "h-7 min-w-7 rounded-control px-1 text-caption tabular-nums transition-colors pointer-coarse:h-9 pointer-coarse:min-w-9",
                on ? "bg-muted text-foreground in-[[data-glide]]:bg-transparent" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
      <div className={cn("min-w-16 flex-1", !stretch && "lg:w-28 lg:flex-none")}>
        <Slider aria-label={label} value={[value]} min={min} max={max} step={step} onValueChange={(v) => { setDraft(null); onChange(Array.isArray(v) ? v[0] : (v as number)); }} />
      </div>
      <Input
        value={draft ?? String(value)}
        onChange={(e) => type(e.target.value)}
        onBlur={finish}
        onKeyDown={onKey}
        onFocus={(e) => e.target.select()}
        inputMode={decimals ? "decimal" : "numeric"}
        aria-label={pixelsLabel}
        className="h-7 w-11 shrink-0 px-1 text-center text-caption tabular-nums pointer-coarse:h-9 pointer-coarse:w-12 pointer-coarse:text-field"
      />
    </div>
  );
}
