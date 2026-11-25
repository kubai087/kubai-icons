import type { KubaiIconData, KubaiController, KubaiVariant, KubaiLineVariant } from './types.js';
export declare function animate(svg: SVGSVGElement | Element, icon: KubaiIconData, options?: { state?: Record<string, unknown>; variant?: string }): KubaiController;
/** Markup of a line icon at a stroke width and variant (what the components render). */
export declare function lineIconMarkup(icon: KubaiIconData, options?: { strokeWidth?: number; variant?: string }): string;
/** A standalone line SVG in fixed colours (light tones mixed over white from a hex color), without motion tags. */
export declare function lineStill(line: NonNullable<KubaiIconData['line']>, options?: { s?: number; variant?: string; color?: string; size?: number; id?: string }): string;
export declare const LINE_VARIANTS: KubaiLineVariant[];
export declare const LINE_STROKE: { min: number; max: number; step: number; regular: number };
export declare function bindTrigger(target: Element, controller: KubaiController, icon: Pick<KubaiIconData, 'tap'>, onToggle?: (active: boolean) => void): () => void;
export declare function badgeStyle(icon: Pick<KubaiIconData, 'tone'>, badgeColor?: string): Record<string, string>;
export declare function uid(): string;
export declare const VARIANTS: Record<KubaiVariant, Record<string, string>>;
/** Sets the variant for every icon inside `root` that does not choose its own. */
export declare function setVariant(root: HTMLElement | SVGElement, variant: KubaiVariant): void;
