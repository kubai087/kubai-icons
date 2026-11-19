// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Hover motion runtime for the two-tone solid style (双色面性). The motions themselves are in
// motions.mjs; this file has no imports, so a page can carry it as is.
//
// Rhythm: on hover, 480ms on cubic-bezier(.34, 1.56, .64, 1), which overshoots a little and
// springs back, to a pose that holds while hovered; on leave, 360ms back to rest without
// overshoot. Keyframed motions (a swing, a shake, a part that leaves and comes back) spread
// their keyframes evenly in time and add STEP ms for each one after the first; a spec can set
// its own total with ms.
//
// A pose maps keys to values:
//   x, y     move           r   turn in degrees   s, sx, sy   scale (rest 1)
//   a        opacity        w   how much of a stroke is drawn (rest 1)
//   o        [x, y] the point turns and scales are about (default [8, 8])
//   rest     the pose at rest, when it isn't the default: { a: 0 } for a part that only shows
//            on hover
// A value is the pose held on hover, or a list of keyframes ending on the held pose.
//
// Render with render(withMotion(icon, spec), { motion: true }) so the layers carry data-l; then
// animate(svg, spec) returns { hover(on) }.

/**
 * The icon with every layer named by its index (data-l), plus the copies and the hover-only
 * parts the spec asks for:
 *   copy: [{ of: [indexes], at? }]  copies drawn exactly over those layers, named c0, c1, …
 *   add:  [{ layer, at? }]          parts that exist only for the motion, named a0, a1, …
 * at is the position in the layer list (default: on top of everything).
 */
export function withMotion(icon, spec) {
  const layers = icon.layers.map((l, i) => ({ ...l, n: i, part: l.part ?? `#${i}` }));
  let k = 0;
  for (const c of spec?.copy || []) layers.splice(c.at ?? layers.length, 0, ...c.of.map((i) => ({ ...layers.find((l) => l.n === i), n: `c${k++}` })));
  k = 0;
  for (const a of spec?.add || []) layers.splice(a.at ?? layers.length, 0, { ...a.layer, n: `a${k}`, part: a.layer.part ?? `+${k++}` });
  return { ...icon, layers };
}

export const DURATION = 480;
export const STEP = 110;
export const BACK = 360;

export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-5) break;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(t);
  };
}
/** Into the hover pose: a small overshoot that springs back. */
export const EASE = bezier(0.34, 1.56, 0.64, 1);
/** Back to rest: eased out, no overshoot. */
export const EASE_BACK = bezier(0.33, 1, 0.68, 1);

const REST = { x: 0, y: 0, r: 0, s: 1, sx: 1, sy: 1, a: 1, w: 1 };
const KEYS = Object.keys(REST);
const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const restOf = (p) => ({ ...REST, ...(p.rest || {}) });
// One key from `from` to v (a value or keyframes) at time share q.
function track(from, v, q, ease) {
  const pts = [from, ...(Array.isArray(v) ? v : [v])], n = pts.length - 1;
  if (n === 1) return from + (pts[1] - from) * ease(q);
  const k = Math.min(n - 1e-9, q * n), i = Math.floor(k), t = k - i;
  return pts[i] + (pts[i + 1] - pts[i]) * (i === n - 1 ? ease(t) : inOut(t));
}
const count = (p) => Math.max(1, ...KEYS.filter((k) => Array.isArray(p[k])).map((k) => p[k].length));
/** How long the hover motion of one icon runs, in ms. */
export const duration = (spec) => spec?.ms ?? DURATION + STEP * (Math.max(1, ...Object.values(spec?.moves || {}).map(count)) - 1);
/** The values of one pose's keys at time share q, from `from` toward the hover pose (on) or rest. */
export function values(p, q, from, on = true) {
  const r = restOf(p), o = {};
  for (const k of KEYS) if (k in p || (p.rest && k in p.rest)) o[k] = track((from || r)[k] ?? r[k], on ? (k in p ? p[k] : r[k]) : r[k], q, on ? EASE : EASE_BACK);
  return o;
}
const f = (v) => +v.toFixed(3);
const unit = (v) => f(Math.min(1, Math.max(0, v)));
/** The transform for a set of values. */
export function transform(p, v) {
  const g = (k) => (k in v ? v[k] : REST[k]);
  const [ox, oy] = p.o || [8, 8];
  const s = g('s'), sx = s * g('sx'), sy = s * g('sy');
  return `translate(${f(g('x') + ox)} ${f(g('y') + oy)}) rotate(${f(g('r'))}) scale(${f(sx)} ${f(sy)}) translate(${-ox} ${-oy})`;
}
/** Transform, opacity and stroke dash of one pose t of the way through its hover motion. */
export function pose(p, t) {
  const v = values(p, t);
  return { transform: transform(p, v), opacity: 'a' in v ? unit(v.a) : null, dash: 'w' in v ? `${unit(v.w)} 2` : null, hide: 'w' in v && v.w < 0.01 };
}

/** Attaches hover motion to an <svg> rendered with motion: true. */
export function animate(svg, spec) {
  const raf = globalThis.requestAnimationFrame || ((fn) => setTimeout(() => fn(Date.now()), 16));
  const caf = globalThis.cancelAnimationFrame || clearTimeout;
  let reduced = false;
  try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* not a browser */ }
  const els = Object.keys(spec?.moves || {}).map((k) => ({ p: spec.moves[k], list: [...svg.querySelectorAll(`[data-l="${k}"]`)], cur: restOf(spec.moves[k]) }));
  const long = duration(spec);
  let on = false, frame = 0;
  const paint = (el) => {
    const t = transform(el.p, el.cur);
    for (const node of el.list) {
      node.setAttribute('transform', t);
      if ('a' in el.p || el.p.rest?.a !== undefined) node.setAttribute('opacity', unit(el.cur.a));
      // A stroke not yet drawn hides entirely; its round caps would otherwise leave a dot.
      if ('w' in el.p) { node.setAttribute('stroke-dasharray', `${unit(el.cur.w)} 2`); node.setAttribute('stroke-opacity', el.cur.w < 0.01 ? 0 : 1); }
    }
  };
  // Parts that only show on hover start hidden.
  for (const el of els) if (el.p.rest) paint(el);
  return {
    hover(next) {
      if (Boolean(next) === on || !els.length) return;
      on = Boolean(next); caf(frame);
      // A motion cut short starts from where it is.
      const from = els.map((el) => ({ ...el.cur }));
      if (reduced) { els.forEach((el, i) => { el.cur = { ...el.cur, ...values(el.p, 1, from[i], on) }; paint(el); }); return; }
      const run = on ? long : BACK, t0 = performance.now();
      const tick = (t) => {
        const q = Math.min(1, (t - t0) / run);
        els.forEach((el, i) => { el.cur = { ...el.cur, ...values(el.p, q, from[i], on) }; paint(el); });
        if (q < 1) frame = raf(tick);
      };
      frame = raf(tick);
    },
    get hovered() { return on; }
  };
}
