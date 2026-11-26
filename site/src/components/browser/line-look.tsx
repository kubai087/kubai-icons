"use client";
// The line icons' variant and stroke width outside the icon browser, on the line icon set pages.
// They read and change the same shared settings as the browser, so a choice carries across pages.
import { LineIcon, useLineIcon } from "@/components/kit/line-icon";
import { Segmented } from "@/components/kit/segmented";
import { SizeControl } from "@/components/kit/size-control";
import { LINE_STROKE, LINE_STROKES, LINE_VARIANTS } from "@/lib/line";
import { setLineSettings, useLineSettings } from "@/lib/line-settings";
import { asset } from "@/lib/site";
import { useTr } from "@/lib/use-locale";
import { cn } from "@/lib/utils";
import { LINE_COLOR } from "./prefs";

/** The variant switch, with each variant drawn as a small camera, and the stroke width. */
export function LineLookControls({ className }: { className?: string }) {
  const tr = useTr();
  const { variant, s } = useLineSettings();
  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-3", className)}>
      <Segmented
        fill
        value={variant}
        onChange={(v) => setLineSettings({ variant: v })}
        label={tr("Variant", "变体")}
        dense
        options={LINE_VARIANTS.map((o) => ({ value: o.value, title: tr(o.en, o.zh), label: <span className="pointer-events-none"><LineIcon name="camera" size={18} color="currentColor" variant={o.value} s={2} /><span className="sr-only">{tr(o.en, o.zh)}</span></span> }))}
      />
      <SizeControl
        stretch
        className="min-w-64 grow basis-64 sm:max-w-sm"
        label={tr("Stroke width", "粗细")}
        commonLabel={tr("Common stroke widths", "常用粗细")}
        pixelsLabel={tr("Stroke width", "粗细")}
        value={s}
        min={LINE_STROKE.min}
        max={LINE_STROKE.max}
        step={LINE_STROKE.step}
        decimals
        presets={LINE_STROKES}
        onChange={(next) => setLineSettings({ s: next })}
      />
    </div>
  );
}

/**
 * A line icon drawn live at the shared variant and stroke width. Until the line icons have loaded
 * (and without scripts) it shows the still image at the site's defaults.
 */
export function LinePreview({ name, size, src, alt = "" }: { name: string; size: number; src: string; alt?: string }) {
  const icon = useLineIcon(name);
  // eslint-disable-next-line @next/next/no-img-element
  if (!icon) return <img src={asset(src)} alt={alt} width={size} height={size} loading="lazy" decoding="async" />;
  return (
    <>
      <LineIcon name={name} size={size} color={LINE_COLOR} />
      {alt && <span className="sr-only">{alt}</span>}
    </>
  );
}
