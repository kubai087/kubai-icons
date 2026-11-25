// The line style (线性): kubai-icons/line. Its icons load as one chunk, like the two-tone ones,
// and are drawn by the package runtime at the stroke width and variant chosen in the browser.
export type LineVariant = "outline" | "line-duo" | "fill" | "solid-tint";

export const LINE_VARIANTS: { value: LineVariant; en: string; zh: string }[] = [
  { value: "outline", en: "Line", zh: "线性" },
  { value: "line-duo", en: "Line two-tone", zh: "线性双色" },
  { value: "fill", en: "Solid", zh: "面性" },
  { value: "solid-tint", en: "Solid tint", zh: "面性填充" },
];
/** The stroke range the browser offers, and the common widths marked on it. */
export const LINE_STROKE = { min: 0.5, max: 3, step: 0.25, regular: 2 };
export const LINE_STROKES = [1.5, 2, 2.25, 2.5];
