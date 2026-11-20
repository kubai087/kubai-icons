// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Geometry and rendering for the two-tone solid style (双色面性). The rules are in GUIDE.md;
// this file implements them. Reuse it as is: new icons only call these helpers.
//
// The canvas is a 16 grid (viewBox 0 0 16 16): one unit is one pixel at 16px. Coordinates may
// fall on half or quarter units; the style doesn't snap to whole pixels.

const n = (v) => +v.toFixed(3);

// Corner radii by role (GUIDE.md section 4), sizes measured as drawn (square icons before scaling).
//   R3 3    outer corner of a landscape body 14 x 12
//   R  2.5  outer corner of any other body whose short side is 9.5 or more
//   M  2    outer corner of a portrait body 12 x 14, or a short side of 6 to under 9.5
//   r  1.5  outer corner, short side 3.5 to under 6; tabs, stubs, ear cups
//   S  1    seam: a narrower part beside a wider one across a gap (a box under its lid)
//   q  1    thin bar 2.5 thick; t 0.75 for 2 thick (0.4 x the thickness, to the nearest 0.25)
// A straight cut through one outline, and an inner joint where a tab meets its body, are 0.
export const R3 = 3, R = 2.5, M = 2, r = 1.5, S = 1, q = 1, t = 0.75;
// Detail weights (GUIDE.md section 5): lines and slots D, strokes K, the gap between parts W.
export const D = 1.25, K = 1.5, W = 1;

// Corner smoothing, the way Hugeicons draws it: two cubics per corner. The curve starts 1.8 x the
// tangent length before the corner and passes through the point a circle of that radius would
// pass at its middle, so it reads as that radius but meets the straight edges without a kink.
// Works for any corner angle (90° boxes, the 45° slopes of a roof or an arrow, a gear's teeth).
// If an edge is too short the run shortens and the radius stays; if even the radius doesn't fit
// (capsule ends), the corner becomes the largest circular arc that fits.
export const CORNER = { RUN: 1.8, C1: 1.057 };

/**
 * Closed outline through pts = [{ x, y, c }], clockwise, each corner rounded with radius c.
 * Each edge is shared between its two corners in proportion to their radii.
 */
export function poly(pts) {
  const N = pts.length;
  const len = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  const at = (P, u, k) => `${n(P.x + u.x * k)} ${n(P.y + u.y * k)}`;
  const geo = pts.map((P, i) => {
    const A = pts[(i - 1 + N) % N], B = pts[(i + 1) % N];
    const la = len(A, P), lb = len(P, B);
    const back = { x: (A.x - P.x) / la, y: (A.y - P.y) / la }, fwd = { x: (B.x - P.x) / lb, y: (B.y - P.y) / lb };
    const half = Math.acos(Math.max(-1, Math.min(1, back.x * fwd.x + back.y * fwd.y))) / 2; // half the corner angle
    return { back, fwd, half, tan: P.c > 0 ? P.c / Math.tan(half) : 0 }; // tan: tangent length of radius c
  });
  // Each edge is shared between its two corners in proportion to their tangent lengths.
  const share = (i, j) => { const t = geo[i].tan + geo[j].tan; return t ? (len(pts[i], pts[j]) * geo[i].tan) / t : 0; };
  let d = '';
  pts.forEach((P, i) => {
    const { back, fwd, half, tan } = geo[i];
    const max = tan ? Math.min(share(i, (i - 1 + N) % N), share(i, (i + 1) % N)) : 0;
    if (!tan) { d += `${i ? 'L' : 'M'}${at(P, back, 0)}`; return; }
    if (max <= tan) { // too tight: the largest circular arc that fits
      const radius = max * Math.tan(half), h = (4 / 3) * Math.tan((Math.PI - 2 * half) / 4) * radius;
      d += `${i ? 'L' : 'M'}${at(P, back, max)}C${at(P, back, max - h)} ${at(P, fwd, max - h)} ${at(P, fwd, max)}`;
      return;
    }
    const c = P.c, dm = c / Math.sin(half) - c; // corner to the arc's middle, along the bisector
    const c2 = dm / Math.cos(half), c1 = Math.max(Math.min(CORNER.C1 * tan, CORNER.RUN * tan, max), c2);
    const run = Math.min(CORNER.RUN * tan, max), k = dm / (2 * Math.cos(half));
    const mid = `${n(P.x + (back.x + fwd.x) * k)} ${n(P.y + (back.y + fwd.y) * k)}`;
    d += `${i ? 'L' : 'M'}${at(P, back, run)}C${at(P, back, Math.min(c1, run))} ${at(P, back, c2)} ${mid}C${at(P, fwd, c2)} ${at(P, fwd, Math.min(c1, run))} ${at(P, fwd, run)}`;
  });
  return d + 'Z';
}

/** Polygon through [[x, y], ...] (clockwise); c is one radius or one per point. */
export const polygon = (points, c = 0) => poly(points.map(([x, y], i) => ({ x, y, c: Array.isArray(c) ? c[i] : c })));

/** Rounded rectangle w x h centred on (cx, cy), turned by deg (a gear tooth, a magnifier handle). */
export function rot(cx, cy, w, h, deg, c = 0) {
  const a = (deg * Math.PI) / 180, cos = Math.cos(a), sin = Math.sin(a);
  return polygon([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]
    .map(([x, y]) => [cx + x * cos - y * sin, cy + x * sin + y * cos]), c);
}

/** Rounded rectangle; c is one radius or [top-left, top-right, bottom-right, bottom-left]. */
export function rr(x, y, w, h, c = 0) {
  const [a, b, e, f] = Array.isArray(c) ? c : [c, c, c, c];
  return poly([{ x, y, c: a }, { x: x + w, y, c: b }, { x: x + w, y: y + h, c: e }, { x, y: y + h, c: f }]);
}

/** Capsule: a rectangle whose short ends are half circles (lines, slots, bars, a brim). */
export const pill = (x, y, w, h) => rr(x, y, w, h, Math.min(w, h) / 2);

/** Circle. */
export const circ = (cx, cy, c) => `M${n(cx - c)} ${n(cy)}A${c} ${c} 0 1 1 ${n(cx + c)} ${n(cy)}A${c} ${c} 0 1 1 ${n(cx - c)} ${n(cy)}Z`;

/**
 * Rounded body with tabs standing on its top edge (a folder tab, a camera bump, a lid handle).
 * tabs: [{ x, w, h, c }], left to right; a tab at the body's left edge runs flush with it.
 * Tabs meet the body with square inner corners.
 */
export function body(x, y, w, h, rad, tabs = []) {
  const [a, b, e, f] = Array.isArray(rad) ? rad : [rad, rad, rad, rad];
  const pts = [];
  let rest = tabs;
  if (tabs[0] && tabs[0].x === x) {
    const tb = tabs[0];
    pts.push({ x, y: y - tb.h, c: tb.c }, { x: x + tb.w, y: y - tb.h, c: tb.c }, { x: x + tb.w, y, c: 0 });
    rest = tabs.slice(1);
  } else pts.push({ x, y, c: a });
  for (const tb of rest) pts.push({ x: tb.x, y, c: 0 }, { x: tb.x, y: y - tb.h, c: tb.c }, { x: tb.x + tb.w, y: y - tb.h, c: tb.c }, { x: tb.x + tb.w, y, c: 0 });
  pts.push({ x: x + w, y, c: b }, { x: x + w, y: y + h, c: e }, { x, y: y + h, c: f });
  return poly(pts);
}

// Layers, drawn in order (later layers on top).
//   L(d, opts)   a shape: filled, or stroked with round ends when opts.sw is set
//   opts.tone    'a' (primary, default) or 'b' (secondary)
//   opts.cut     [C(d, sw?)]: shapes knocked out of this layer only, in white
//   opts.gap     clear band of this width cut round the layer out of the layers below it: the
//                knockout outline a front element needs where it overlaps another (GUIDE.md §6)
//   opts.part    layers with the same part name belong to one element and never cut each other
//                with their gaps (an arrow's shaft and head)
//   opts.clip    draw only the part of this shape inside the clip shape: a piece of the body in
//                the primary (an envelope flap, a screen band) keeps the body's exact corners
export const L = (d, opts = {}) => ({ d, ...opts });
export const C = (d, sw) => ({ d, sw });
export const Bt = { tone: 'b' };

// Key shapes (GUIDE.md section 2), after Material's system icons scaled to 16. Each icon names
// one in `key`; its whole outline, tabs and handles included, fills that shape.
export const KEYLINES = {
  live: [1, 1, 14, 14],          // the live area: nothing goes outside
  circle: [8, 8, 7],             // diameter 14
  inner: [8, 8, 4],              // diameter 8: where inner details sit
  square: [1.5, 1.5, 13, 13],    // drawn on a 12 x 12 box at 2..14, then scaled up (FIT)
  landscape: [1, 2, 14, 12],     // most wide objects
  wide: [1, 2.5, 14, 11],        // objects that are long in life: a battery, a ticket, a cloud
  portrait: [2, 1, 12, 14],
  tall: [3, 1, 10, 14],          // objects that are slim in life: a phone, a bottle
  flat: [1, 4, 14, 8]            // symbols that read by a long, low shape: a link, a slider
};
// Square icons are drawn on 12 x 12 and scaled about the centre to 13 x 13, so their area
// matches the rectangles'. Strokes and gaps are divided back so line weights stay the same.
export const FIT = { square: 13 / 12 };

/** Box [x0, y0, x1, y1] of a key shape. */
export function keyBox(key) {
  const k = KEYLINES[key];
  return k.length === 3 ? [k[0] - k[2], k[1] - k[2], k[0] + k[2], k[1] + k[2]] : [k[0], k[1], k[0] + k[2], k[1] + k[3]];
}

// Colours (GUIDE.md section 3). The secondary is the primary at 40% over white.
export const TONES = { a: '#5A76F2', b: '#BDC8FA' };
export function secondary(primary, alpha = 0.4) {
  const h = primary.replace('#', '');
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return '#' + c.map((v) => Math.round(255 - (255 - v) * alpha).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** SVG markup for one icon definition { key, layers }. */
// motion: true tags each layer with data-l (its n, else its index), and the whole drawing with data-l="all",
// so motion.mjs can move them; a layer's knockout outline carries the same tag and moves with it.
export function render(icon, { size = 16, a = TONES.a, b = TONES.b, id = 'i', motion = false } = {}) {
  const k = FIT[icon.key] || 1;
  const ink = (l) => (l.tone === 'b' ? b : a);
  const defs = [];
  const shape = (s, paint, extra = 0) => s.sw
    ? `<path d="${s.d}" fill="none" stroke="${paint}" stroke-width="${n((s.sw + extra) / k)}" stroke-linecap="round" stroke-linejoin="round"${motion ? ' pathLength="1"' : ''}/>`
    : extra
      ? `<path d="${s.d}" fill="${paint}" stroke="${paint}" stroke-width="${n(extra / k)}" stroke-linejoin="round"/>`
      : `<path d="${s.d}" fill="${paint}"/>`;
  const box = 'maskUnits="userSpaceOnUse" x="-2" y="-2" width="20" height="20"><rect x="-2" y="-2" width="20" height="20" fill="#fff"/>';
  // Each drawn layer keeps its part, so a gap cuts the layers below it except its own part's.
  const pieces = [];
  const tag = (l, i, svg) => (motion ? `<g data-l="${l.n ?? i}">${svg}</g>` : svg);
  icon.layers.forEach((l, i) => {
    const part = l.part ?? `#${i}`;
    if (l.gap) {
      defs.push(`<mask id="${id}-gap${i}" ${box}${tag(l, i, shape(l, '#000', l.gap * 2))}</mask>`);
      for (const p of pieces) if (p.part !== part) p.svg = `<g mask="url(#${id}-gap${i})">${p.svg}</g>`;
    }
    let piece = shape(l, ink(l));
    if (l.clip) {
      defs.push(`<clipPath id="${id}-clip${i}" clipPathUnits="userSpaceOnUse"><path d="${l.clip}"/></clipPath>`);
      piece = `<g clip-path="url(#${id}-clip${i})">${piece}</g>`;
    }
    if (l.cut?.length) {
      defs.push(`<mask id="${id}-cut${i}" ${box}${l.cut.map((c) => shape(c, '#000')).join('')}</mask>`);
      piece = `<g mask="url(#${id}-cut${i})">${piece}</g>`;
    }
    pieces.push({ part, svg: tag(l, i, piece) });
  });
  let out = pieces.map((p) => p.svg).join('');
  if (motion) out = `<g data-l="all">${out}</g>`;
  if (k !== 1) out = `<g transform="translate(8 8) scale(${n(k)}) translate(-8 -8)">${out}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="${size}" height="${size}">${defs.length ? `<defs>${defs.join('')}</defs>` : ''}${out}</svg>`;
}

// Badges (GUIDE.md section 12): one object's variants (add, remove, done, delete, AI, off) keep
// the object and add one mark. Every mark fits a 4.5 box (the sparkle 6) and uses the K stroke,
// so a mark reads the same on every icon. Where it goes:
//   corner  in the bottom-right corner of the icon's key shape, 3 in from both edges (the mark's
//           reach), so it never sticks out of the key shape; top: the top-right corner, where
//           the sparkle (AI) goes by default. A corner mark clears a round notch of radius 4 out
//           of the object (its reach 3 plus the gap W), so no slivers are left between its arms.
//   [x, y]  centred on that point of the object's face, in the primary with no gap, in place of
//           the object's own detail (drop it)
// 'off' is a 45° slash from the top left to the bottom right across the key shape, with a W gap.
// Positions are given as seen; on a square icon (drawn small, then scaled by FIT) they are
// converted, so the mark lands in the same place and keeps its size.
const H = 2.25, NOTCH = 4;
const sparkle = (T = 3, f = 0.5, rho = 1.75) => {
  // Four tips rounded at f, joined by concave arcs of radius rho tangent to the tip circles.
  const a = T - f, c = (a + Math.sqrt(2 * (rho + f) ** 2 - a * a)) / 2;
  const tips = [[0, -a], [a, 0], [0, a], [-a, 0]], arcs = [[c, -c], [c, c], [-c, c], [-c, -c]];
  const touch = ([tx, ty], [ax, ay]) => { const l = Math.hypot(ax - tx, ay - ty); return [tx + (f * (ax - tx)) / l, ty + (f * (ay - ty)) / l]; };
  const p = (pt) => `${n(pt[0])} ${n(pt[1])}`;
  let d = `M${p(touch(tips[0], arcs[3]))}`;
  tips.forEach((tp, i) => { d += `A${f} ${f} 0 0 1 ${p(touch(tp, arcs[i]))}A${rho} ${rho} 0 0 0 ${p(touch(tips[(i + 1) % 4], arcs[i]))}`; });
  return { d: d + 'Z', fill: true, slot: 'top' };
};
export const MARKS = {
  plus: { d: `M0 ${-H}V${H}M${-H} 0H${H}` },
  minus: { d: `M${-H} 0H${H}` },
  check: { d: `M${-H} 0L-0.75 1.5L${H} -1.5` },
  x: { d: 'M-1.75 -1.75L1.75 1.75M1.75 -1.75L-1.75 1.75' },
  sparkle: sparkle()
};
// Moves and scales a path written about (0, 0); handles M, L, H, V, A and Z with absolute values.
function place(d, cx, cy, k) {
  const out = [];
  for (const [, cmd, args] of d.matchAll(/([MLHVAZ])([^MLHVAZ]*)/g)) {
    const v = args.trim() ? args.trim().split(/[\s,]+/).map(Number) : [];
    if (cmd === 'H') out.push(`H${n(cx + v[0] / k)}`);
    else if (cmd === 'V') out.push(`V${n(cy + v[0] / k)}`);
    else if (cmd === 'A') out.push(`A${n(v[0] / k)} ${n(v[1] / k)} ${v[2]} ${v[3]} ${v[4]} ${n(cx + v[5] / k)} ${n(cy + v[6] / k)}`);
    else if (cmd === 'Z') out.push('Z');
    else out.push(cmd + v.map((x, i) => n(i % 2 ? cy + x / k : cx + x / k)).join(' '));
  }
  return out.join('');
}
/**
 * A variant of an icon: the same object with one badge. mark is a MARKS name or 'off'.
 *   at     'corner', 'top' or [x, y] on the object's face; default 'corner' ('top' for sparkle)
 *   drop   indexes of the object's layers to leave out (the detail the mark replaces, or a part
 *          the notch would leave as a sliver)
 *   label  the variant's Chinese name
 */
export function badge(icon, mark, { at, drop = [], label } = {}) {
  const k = FIT[icon.key] || 1, inv = (v) => 8 + (v - 8) / k;
  let layers = icon.layers.filter((_, i) => !drop.includes(i));
  const [x0, y0, x1, y1] = keyBox(icon.key), reach = 3;
  if (mark === 'off') {
    const h = Math.min(x1 - x0, y1 - y0) / 2 - K / 2, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const [a, b, c, d] = [inv(cx - h), inv(cy - h), inv(cx + h), inv(cy + h)];
    layers.push({ d: `M${n(a)} ${n(b)}L${n(c)} ${n(d)}`, sw: K, gap: W, part: 'badge', badge: 'off', at: [n(inv(cx)), n(inv(cy))] });
  } else {
    const SLOTS = { corner: [x1 - reach, y1 - reach], top: [x1 - reach, y0 + reach] };
    const m = MARKS[mark], where = at ?? m.slot ?? 'corner', slot = SLOTS[where];
    const [cx, cy] = slot ?? where;
    if (slot) {
      const notch = C(circ(n(inv(cx)), n(inv(cy)), n(NOTCH / k)));
      layers = layers.map((l) => ({ ...l, cut: [...(l.cut || []), notch] }));
    }
    // at: the mark's centre as drawn, for motions that turn or scale it about itself.
    layers.push({ d: place(m.d, inv(cx), inv(cy), k), ...(m.fill ? {} : { sw: K }), part: 'badge', badge: mark, at: [n(inv(cx)), n(inv(cy))] });
  }
  return { ...icon, label: label ?? icon.label, layers };
}
