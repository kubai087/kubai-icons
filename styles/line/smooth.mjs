// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Corner geometry shared with the two-tone style (styles/duotone/kit.mjs), copied here so this
// skill stands on its own: smoothed rounded corners, polygons, rounded rectangles, circles.

const n = (v) => +v.toFixed(3);

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
