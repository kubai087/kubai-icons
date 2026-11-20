// The two-tone style (双色面性): solid icons on a 16 grid, a light body with accents in the
// primary colour, and a hover motion that acts out what the icon means. The icons are drawn
// with the kubai-duotone skill and imported into icons-duotone/ as plain layer data
// (tools/duotone-import.mjs); this file turns that data into markup and plays the motion.
//
// Colours follow CSS: the primary is currentColor (set `color`), the light tone is the
// primary at 40% over white unless --kd-b sets another.

export const DUO_VIEWBOX = '0 0 16 16';
/** Square icons are drawn on 12 x 12 and scaled up about the centre (the skill's FIT). */
const FIT = { square: 13 / 12 };
const n = (v) => +v.toFixed(3);
const LIGHT = 'var(--kd-b,color-mix(in srgb,currentColor 40%,#fff))';

/**
 * Inner markup of an icon definition { key, layers, moves }. Each layer is { d, tone?, sw?,
 * gap?, part?, clip?, cut?, n }; ids carry the __K__ placeholder. Parts that only show on
 * hover start in their rest pose, so markup rendered on a server never flashes them. With
 * colors: { a, b } the paint is fixed and the parts that exist only for the motion are left out
 * (static files); otherwise the paint follows CSS.
 */
export function duoMarkup(def, { colors } = {}) {
  const k = FIT[def.key] || 1, id = '__K__';
  const still = Boolean(colors);
  const layers = still ? def.layers.filter((l) => !/^[ca]\d+$/.test(String(l.n))) : def.layers;
  const paint = (l) => (colors ? (l.tone === 'b' ? colors.b : colors.a) : l.tone === 'b' ? null : 'currentColor');
  const defs = [];
  const shape = (s, ink, extra = 0, dash = false) => {
    // The light tone is set as a style, so --kd-b and color-mix() resolve per instance.
    const fill = ink === null ? ` style="${s.sw ? 'stroke' : 'fill'}:${LIGHT}"` : '';
    const c = ink ?? '#000';
    if (s.sw) return `<path d="${s.d}" fill="none" stroke="${c}"${fill} stroke-width="${n((s.sw + extra) / k)}" stroke-linecap="round" stroke-linejoin="round"${dash ? ' pathLength="1"' : ''}/>`;
    if (extra) return `<path d="${s.d}" fill="${c}" stroke="${c}" stroke-width="${n(extra / k)}" stroke-linejoin="round"/>`;
    return `<path d="${s.d}" fill="${c}"${fill}/>`;
  };
  const box = 'maskUnits="userSpaceOnUse" x="-2" y="-2" width="20" height="20"><rect x="-2" y="-2" width="20" height="20" fill="#fff"/>';
  const pieces = [];
  const rest = (key) => {
    const p = def.moves?.[key];
    if (still || !p?.rest) return '';
    const v = restOf(p);
    let a = ` transform="${transform(p, v)}"`;
    if (p.rest.a !== undefined) a += ` opacity="${unit(v.a)}"`;
    if (p.rest.w !== undefined) a += ` stroke-dasharray="${unit(v.w)} 2" stroke-opacity="${v.w < 0.01 ? 0 : 1}"`;
    return a;
  };
  const tag = (l, i, svg) => `<g data-l="${l.n ?? i}"${rest(l.n ?? i)}>${svg}</g>`;
  layers.forEach((l, i) => {
    const part = l.part ?? `#${i}`;
    if (l.gap) {
      defs.push(`<mask id="${id}-g${i}" ${box}${tag(l, i, shape(l, '#000', l.gap * 2, true))}</mask>`);
      for (const p of pieces) if (p.part !== part) p.svg = `<g mask="url(#${id}-g${i})">${p.svg}</g>`;
    }
    let piece = shape(l, paint(l), 0, true);
    if (l.clip) {
      defs.push(`<clipPath id="${id}-c${i}" clipPathUnits="userSpaceOnUse"><path d="${l.clip}"/></clipPath>`);
      piece = `<g clip-path="url(#${id}-c${i})">${piece}</g>`;
    }
    if (l.cut?.length) {
      defs.push(`<mask id="${id}-x${i}" ${box}${l.cut.map((c) => shape(c, '#000')).join('')}</mask>`);
      piece = `<g mask="url(#${id}-x${i})">${piece}</g>`;
    }
    pieces.push({ part, svg: tag(l, i, piece) });
  });
  let out = `<g data-l="all"${rest('all')}>${pieces.map((p) => p.svg).join('')}</g>`;
  if (k !== 1) out = `<g transform="translate(8 8) scale(${n(k)}) translate(-8 -8)">${out}</g>`;
  return (defs.length ? `<defs>${defs.join('')}</defs>` : '') + out;
}

/** A built two-tone icon: the same shape as a layered one, with its motion as moves. */
export const duo = (name, markup, moves, ms) => ({ name, markup, viewBox: DUO_VIEWBOX, style: 'duotone', moves, ...(ms ? { ms } : {}), tap: false });

// ---------- Motion ----------
// Hover: 480ms on cubic-bezier(.34, 1.56, .64, 1), a small overshoot, to a pose held while
// hovered; leave: 360ms back without overshoot. Keyframed motions spread their keyframes
// evenly and add 110ms for each one after the first. A pose maps x, y (move), r (turn),
// s, sx, sy (scale), a (opacity), w (how much of a stroke is drawn) and o (the point turns and
// scales are about) to a held value or a list of keyframes; rest is the pose at rest.
export const DUO_DURATION = 480, DUO_STEP = 110, DUO_BACK = 360;

function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t, sy = (t) => ((ay * t + by) * t + cy) * t, dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) { const e = sx(t) - x; if (Math.abs(e) < 1e-5) break; const d = dx(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
    return sy(t);
  };
}
const EASE = bezier(0.34, 1.56, 0.64, 1), EASE_BACK = bezier(0.33, 1, 0.68, 1);
const REST = { x: 0, y: 0, r: 0, s: 1, sx: 1, sy: 1, a: 1, w: 1 };
const KEYS = Object.keys(REST);
const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const restOf = (p) => ({ ...REST, ...(p.rest || {}) });
function track(from, v, q, ease) {
  const pts = [from, ...(Array.isArray(v) ? v : [v])], m = pts.length - 1;
  if (m === 1) return from + (pts[1] - from) * ease(q);
  // q below 0 would index before the first keyframe and give NaN.
  const kq = Math.min(m - 1e-9, Math.max(0, q * m)), i = Math.floor(kq), t = kq - i;
  return pts[i] + (pts[i + 1] - pts[i]) * (i === m - 1 ? ease(t) : inOut(t));
}
const count = (p) => Math.max(1, ...KEYS.filter((k) => Array.isArray(p[k])).map((k) => p[k].length));
/** How long an icon's hover motion runs, in ms. */
export const duoDuration = (ic) => ic.ms ?? DUO_DURATION + DUO_STEP * (Math.max(1, ...Object.values(ic.moves || {}).map(count)) - 1);
function values(p, q, from, on) {
  const r = restOf(p), o = {};
  for (const k of KEYS) if (k in p || (p.rest && k in p.rest)) o[k] = track((from || r)[k] ?? r[k], on ? (k in p ? p[k] : r[k]) : r[k], q, on ? EASE : EASE_BACK);
  return o;
}
const unit = (v) => n(Math.min(1, Math.max(0, v)));
function transform(p, v) {
  const g = (k) => (k in v ? v[k] : REST[k]);
  const [ox, oy] = p.o || [8, 8];
  const s = g('s');
  return `translate(${n(g('x') + ox)} ${n(g('y') + oy)}) rotate(${n(g('r'))}) scale(${n(s * g('sx'))} ${n(s * g('sy'))}) translate(${-ox} ${-oy})`;
}

/**
 * The values of every moving layer t of the way into the hover motion (0 rest, 1 held), as
 * attributes: for rendering a pose without running the motion (previews, tests).
 */
export function duoPose(ic, t) {
  const out = {};
  for (const [k, p] of Object.entries(ic.moves || {})) {
    const v = values(p, t, null, true), a = { transform: transform(p, v) };
    if ('a' in v) a.opacity = unit(v.a);
    if ('w' in v) { a['stroke-dasharray'] = `${unit(v.w)} 2`; a['stroke-opacity'] = v.w < 0.01 ? 0 : 1; }
    out[k] = a;
  }
  return out;
}

let reduced = false;
try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* not a browser */ }
// Looked up on each call, so a page or test that replaces them later is followed.
const raf = (fn) => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(fn) : setTimeout(() => fn(Date.now()), 16));
const caf = (id) => (typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame(id) : clearTimeout(id));
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/** Attaches the hover motion to a rendered two-tone <svg>; the same controller as animate(). */
export function animateDuotone(svg, ic) {
  const els = Object.keys(ic.moves || {}).map((k) => ({ p: ic.moves[k], list: [...svg.querySelectorAll(`[data-l="${k}"]`)], cur: restOf(ic.moves[k]) }));
  const long = duoDuration(ic);
  let on = false, frame = 0, stopped = false;
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
  const go = (instant) => {
    caf(frame);
    const from = els.map((el) => ({ ...el.cur }));
    if (instant || reduced) { els.forEach((el, i) => { el.cur = { ...el.cur, ...values(el.p, 1, from[i], on) }; paint(el); }); return; }
    const run = on ? long : DUO_BACK, t0 = now();
    const tick = (t) => {
      if (stopped) return;
      // A frame's timestamp can be a little earlier than t0, which is read when hover changes.
      const q = Math.min(1, Math.max(0, ((typeof t === 'number' ? t : now()) - t0) / run));
      els.forEach((el, i) => { el.cur = { ...el.cur, ...values(el.p, q, from[i], on) }; paint(el); });
      if (q < 1) frame = raf(tick);
    };
    frame = raf(tick);
  };
  return {
    hover(next, instant) { if (Boolean(next) !== on && els.length) { on = Boolean(next); go(instant); } },
    state() {},
    get hovered() { return on; },
    get active() { return false; },
    svg,
    destroy() { stopped = true; caf(frame); }
  };
}
