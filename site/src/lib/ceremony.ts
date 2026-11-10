// The small moment after a copy or a download: the button that was pressed gives a little,
// and a spray of sparks in the icon's colour blooms out from it.

const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Blooms out from the middle of `button` and gives it a small press. Does nothing when the visitor prefers less motion. */
export function burst(button: Element, color: string) {
  if (reduced()) return;
  const b = button.getBoundingClientRect();
  bloom(b.left + b.width / 2, b.top + b.height / 2, color);
  button.animate(
    [
      { transform: "scale(1)" },
      { offset: 0.35, transform: "scale(0.94)" },
      { offset: 0.7, transform: "scale(1.035)" },
      { transform: "scale(1)" },
    ],
    { duration: 380, easing: "ease-out" },
  );
}

/** A four-point spark, drawn in a 10 × 10 box. */
const SPARK = '<svg viewBox="-5 -5 10 10" width="100%" height="100%"><path d="M0-5C.6-1.4 1.4-.6 5 0C1.4.6.6 1.4 0 5C-.6 1.4-1.4.6-5 0C-1.4-.6-.6-1.4 0-5Z" fill="currentColor"/></svg>';

const piece = (x: number, y: number, size: number, style: Partial<CSSStyleDeclaration>, html = "") => {
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = html;
  Object.assign(el.style, {
    position: "fixed",
    left: `${x - size / 2}px`,
    top: `${y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    pointerEvents: "none",
    zIndex: "1001",
    willChange: "transform, opacity",
    ...style,
  });
  document.body.append(el);
  return el;
};

/** Sparks and dots thrown out round (x, y) that drift down as they fade. */
export function bloom(x: number, y: number, color: string) {
  if (reduced()) return;
  const light = `color-mix(in oklab, ${color} 70%, white)`;
  const gone = (el: HTMLElement) => () => el.remove();

  const count = 16;
  for (let i = 0; i < count; i++) {
    // Spread evenly round the circle, leaning upward, with a little jitter so it never looks stamped.
    const angle = -Math.PI / 2 + (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const reach = 40 + Math.random() * 34;
    const dx = Math.cos(angle) * reach, dy = Math.sin(angle) * reach * 0.8 - 6;
    const spark = i % 3 === 0;
    const size = spark ? 13 + Math.random() * 5 : 6 + Math.random() * 3;
    const tint = i % 2 ? color : light;
    const el = spark
      ? piece(x, y, size, { color: tint }, SPARK)
      : piece(x, y, size, { borderRadius: "50%", background: tint });
    const turn = spark ? (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 90) : 0;
    el.animate(
      [
        { transform: "translate(0, 0) scale(0.4) rotate(0deg)", opacity: 1 },
        { offset: 0.55, transform: `translate(${dx}px, ${dy}px) scale(1) rotate(${turn * 0.7}deg)`, opacity: 1 },
        { transform: `translate(${dx * 1.12}px, ${dy * 1.12 + 14}px) scale(0.2) rotate(${turn}deg)`, opacity: 0 },
      ],
      { duration: 760 + Math.random() * 200, delay: Math.random() * 40, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    ).finished.then(gone(el), gone(el));
  }
}
