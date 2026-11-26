// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Helpers for the variants made by rule (kit.mjs: slash, badge, enclose), shared by icons.mjs and
// the category files under set/: a slash that turns the object off (off, offFill) and a badge whose
// notch leaves no thin wedges in the fill variant (notched, lessDisc).
import { n } from './parts.mjs';

// A slash variant: hover draws the slash while the object reacts; switching back on waits for
// the slash to be erased, then plays the object's own motion.
export const off = (v, back, react) => ({ ...v, fx: [{ t: 'draw', on: ['slash'] }, react], enter: react, swap: { icon: back, play: 700 } });
// Fill-only trims of a slash variant (GUIDE.md §4.1): fillCut shortens the clear band at its
// [top, bottom] end so it does not graze the object's edge into a sliver; trim shortens named
// straight parts at their [start, end] (in units along the line, times the stroke when given
// as { k }) so no stub of them is left beyond the band.
export const trimSeg = (d, a, b) => {
  const m = d.match(/^M(-?[\d.]+) (-?[\d.]+)L(-?[\d.]+) (-?[\d.]+)$/);
  if (!m) return d;
  const [x1, y1, x2, y2] = m.slice(1).map(Number), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, r = (v) => +v.toFixed(3);
  return `M${r(x1 + ux * a)} ${r(y1 + uy * a)}L${r(x2 - ux * b)} ${r(y2 - uy * b)}`;
};
export const offFill = (v, { fillCut, trim = {} } = {}) => ({
  ...v, ...(fillCut ? { fillCut } : {}),
  draw(g, ctx) {
    const L = v.draw(g, ctx);
    if (ctx?.variant !== 'fill') return L;
    const amt = (t) => (typeof t === 'object' ? t.k * g.s + (t.c ?? 0) : t);
    return L.map((l) => (trim[l.n] ? { ...l, d: trimSeg(l.d, amt(trim[l.n][0]), amt(trim[l.n][1])) } : l));
  }
});

// A shell's path less a disc, for the fill variant. Where a round cut (a badge's notch) crosses
// a shell's edge at a shallow angle it leaves a thin wedge of ink (GUIDE.md §4.1). Clipping the
// path itself by the cut grown by half a stroke leaves a sharp corner there instead, which the
// fill's round join turns into a round tip half a stroke across; elsewhere the clipped edge
// meets the cut exactly. Paths of M, L, C, A (circular) and Z; a path the disc misses, or
// crosses more than once each way, is returned as it is.
export function lessDisc(d, cx, cy, r) {
  const t = d.match(/[MLCAZ]|-?\d*\.?\d+(?:e-?\d+)?/g), S = [];
  let i = 0, c = '', x = 0, y = 0, x0 = 0, y0 = 0;
  const num = () => +t[i++];
  while (i < t.length) {
    if (/[A-Z]/.test(t[i])) c = t[i++];
    if (c === 'M') { x = x0 = num(); y = y0 = num(); c = 'L'; }
    else if (c === 'L') { const b = [num(), num()]; S.push({ k: 'L', a: [x, y], b }); [x, y] = b; }
    else if (c === 'C') { const q = [num(), num(), num(), num(), num(), num()]; S.push({ k: 'C', a: [x, y], c1: q.slice(0, 2), c2: q.slice(2, 4), b: q.slice(4) }); [x, y] = q.slice(4); }
    else if (c === 'A') {
      const [rr, , , large, sweep, bx, by] = [num(), num(), num(), num(), num(), num(), num()];
      // the centre form, as in ends.mjs
      const mx = (x - bx) / 2, my = (y - by) / 2, d2 = mx * mx + my * my, ra = Math.max(rr, Math.sqrt(d2));
      const f = Math.sqrt(Math.max(0, (ra * ra) / d2 - 1)) * (large === sweep ? -1 : 1), ox = (x + bx) / 2 + f * my, oy = (y + by) / 2 - f * mx;
      const t1 = Math.atan2(y - oy, x - ox); let dt = Math.atan2(by - oy, bx - ox) - t1;
      if (sweep && dt <= 0) dt += 2 * Math.PI; if (!sweep && dt >= 0) dt -= 2 * Math.PI;
      S.push({ k: 'A', a: [x, y], b: [bx, by], o: [ox, oy], r: ra, t1, dt }); [x, y] = [bx, by];
    } else if (c === 'Z') { if (Math.hypot(x - x0, y - y0) > 1e-6) S.push({ k: 'L', a: [x, y], b: [x0, y0] }); [x, y] = [x0, y0]; }
  }
  const lerp = (p, q, u) => [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
  const P = (s, u) => {
    if (s.k === 'L') return lerp(s.a, s.b, u);
    if (s.k === 'A') return [s.o[0] + s.r * Math.cos(s.t1 + s.dt * u), s.o[1] + s.r * Math.sin(s.t1 + s.dt * u)];
    const p = lerp(s.a, s.c1, u), q = lerp(s.c1, s.c2, u), w = lerp(s.c2, s.b, u), pq = lerp(p, q, u), qw = lerp(q, w, u);
    return lerp(pq, qw, u);
  };
  const pt = (p) => `${n(p[0])} ${n(p[1])}`;
  // the piece of segment s from u to v, drawn from P(s, u)
  const piece = (s, u, v) => {
    if (s.k === 'L') return `L${pt(P(s, v))}`;
    if (s.k === 'A') return `A${n(s.r)} ${n(s.r)} 0 ${Math.abs(s.dt * (v - u)) > Math.PI ? 1 : 0} ${s.dt > 0 ? 1 : 0} ${pt(P(s, v))}`;
    // a cubic's control points over [u, v]: its blossom at (u, u, v) and (u, v, v)
    const at = (u1, u2, u3) => { const st = [s.a, s.c1, s.c2, s.b]; const r1 = [lerp(st[0], st[1], u1), lerp(st[1], st[2], u1), lerp(st[2], st[3], u1)]; const r2 = [lerp(r1[0], r1[1], u2), lerp(r1[1], r1[2], u2)]; return lerp(r2[0], r2[1], u3); };
    return `C${pt(at(u, u, v))} ${pt(at(u, v, v))} ${pt(P(s, v))}`;
  };
  const f = (p) => Math.hypot(p[0] - cx, p[1] - cy) - r, X = [];
  S.forEach((s, k) => {
    const N = 48;
    for (let j = 1; j <= N; j++) {
      let u0 = (j - 1) / N, u1 = j / N; const f0 = f(P(s, u0)), f1 = f(P(s, u1));
      if ((f0 > 0) === (f1 > 0)) continue;
      for (let m = 0; m < 40; m++) { const um = (u0 + u1) / 2; if ((f(P(s, um)) > 0) === (f0 > 0)) u0 = um; else u1 = um; }
      X.push({ k, u: (u0 + u1) / 2, out: f0 <= 0 });
    }
  });
  if (X.length !== 2 || X[0].out === X[1].out) return d;
  const E = X.find((q) => q.out), I = X.find((q) => !q.out), pe = P(S[E.k], E.u), pi = P(S[I.k], I.u);
  let path = `M${pt(pe)}`;
  if (E.k === I.k && I.u > E.u) path += piece(S[E.k], E.u, I.u);
  else {
    path += piece(S[E.k], E.u, 1);
    for (let k = (E.k + 1) % S.length; k !== I.k; k = (k + 1) % S.length) path += piece(S[k], 0, 1);
    path += piece(S[I.k], 0, I.u);
  }
  // back along the circle, the way that runs inside the shape
  const poly = S.flatMap((s) => Array.from({ length: 24 }, (_, j) => P(s, j / 24)));
  const inside = ([px, py]) => { let w = false; for (let k = 0, m = poly.length - 1; k < poly.length; m = k++) { const [ax, ay] = poly[k], [bx, by] = poly[m]; if ((ay > py) !== (by > py) && px < ax + ((py - ay) * (bx - ax)) / (by - ay)) w = !w; } return w; };
  const ai = Math.atan2(pi[1] - cy, pi[0] - cx), ae = Math.atan2(pe[1] - cy, pe[0] - cx), TAU = 2 * Math.PI;
  const span1 = (((ae - ai) % TAU) + TAU) % TAU, mid1 = ai + span1 / 2;
  const sweep = inside([cx + r * Math.cos(mid1), cy + r * Math.sin(mid1)]) ? 1 : 0, span = sweep ? span1 : TAU - span1;
  return `${path}A${n(r)} ${n(r)} 0 ${span > Math.PI ? 1 : 0} ${sweep} ${pt(pe)}Z`;
}

// A badge in the fill variant. Its round notch crosses the body's edges at a shallow angle and
// would leave thin wedges of ink there (GUIDE.md §4.1): the shells it cuts are clipped by it
// (lessDisc), so each cut edge ends in a round tip. fit(L, g, notch) then places the details
// that sit near the notch.
export function notched(v, fit = (L) => L) {
  return {
    ...v,
    draw(g, ctx) {
      const L = v.draw(g, ctx);
      if (ctx?.variant !== 'fill') return L;
      const b = L.find((l) => l.n === 'badge'), [x, y] = b.at, R = +b.cutD.match(/A([\d.]+)/)[1];
      return fit(L.map((l) => (l.k === 'shell' && !l.on && l !== b ? { ...l, d: lessDisc(l.d, x, y, R + g.h) } : l)), g, { x, y, R });
    }
  };
}
