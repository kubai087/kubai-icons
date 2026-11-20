// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Example icons in the two-tone solid style (双色面性). Each icon is { label, key, layers }:
//   label   the Chinese name
//   key     the key shape it fills (KEYLINES in kit.mjs): circle, square, landscape, wide,
//           portrait, tall, flat or live
//   layers  drawn in order; the light body first (tone b), then the blue accents and details
// Read the one closest to a new object before drawing it, and append new icons the same way.
import { R3, R, M, r, S, q, t, D, K, W, rr, pill, circ, body, poly, polygon, rot, L, C, Bt, badge } from './kit.mjs';

// A pen laid at 45° (the allowed slope for 编辑), nib at the bottom left. The nib's two edges run
// along the grid, so it fills the box corner exactly. from and to are distances along the pen
// from the line where the nib meets the barrel; w is its width.
const pen = (from, to, w = 3.5) => {
  const a = w * Math.SQRT1_2, u = (d) => d * Math.SQRT1_2;
  return [[2 + u(from), 14 - a - u(from)], [2 + u(to), 14 - a - u(to)], [2 + a + u(to), 14 - u(to)], [2 + a + u(from), 14 - u(from)]];
};

const f3 = (v) => +v.toFixed(3);

// An eye: two circular arcs (top and bottom) whose tips are rounded off by circles of radius rf,
// the way the heart rounds its tip, so there is no point. w x h centred on (cx, cy).
const eyeOutline = (cx, cy, w, h, rf) => {
  const a = w / 2, b = h / 2, e = ((a - rf) ** 2 - (b - rf) ** 2) / (2 * (b - rf)), R0 = b + e;
  const k = rf / (R0 - rf), fx = a - rf;
  const P = (sx, sy) => `${f3(cx + sx * fx * (1 + k))} ${f3(cy + sy * e * k)}`; // tangent points
  return `M${P(-1, -1)}A${f3(R0)} ${f3(R0)} 0 0 1 ${P(1, -1)}A${rf} ${rf} 0 0 1 ${P(1, 1)}A${f3(R0)} ${f3(R0)} 0 0 1 ${P(-1, 1)}A${rf} ${rf} 0 0 1 ${P(-1, -1)}Z`;
};

// A shield on x 2..14 from y 1 to its tip at y 15: straight top (corners M) and sides, then two
// arcs of radius R0 meeting at the bottom centre, the tip rounded off at rf (as the heart's).
const shieldPath = (R0, rf) => {
  const Fy = 15 - rf, y0 = Fy - Math.sqrt((R0 - rf) ** 2 - (6 - R0) ** 2), k = rf / (R0 - rf);
  const tx = (6 - R0) * k, ty = (Fy - y0) * k; // from the fillet centre to the tangent point (left side)
  // One outline: the top corners from poly (smoothed like rr), then the two arcs and the tip.
  return poly([{ x: 2, y: y0, c: 0 }, { x: 2, y: 1, c: M }, { x: 14, y: 1, c: M }, { x: 14, y: y0, c: 0 }]).slice(0, -1) +
    `A${R0} ${R0} 0 0 1 ${f3(8 - tx)} ${f3(Fy + ty)}A${rf} ${rf} 0 0 1 ${f3(8 + tx)} ${f3(Fy + ty)}A${R0} ${R0} 0 0 1 2 ${f3(y0)}Z`;
};

// A flag whose top and bottom edges carry one gentle wave: each bend is rounded with exactly
// the radius that uses up the short step between the bends, so the step disappears and the edge
// is two tangent arcs (no slope, no point). The corners keep their radii (S at the pole, M out).
const flagWave = (x0, y0, x1, d, H, xa, xb) => {
  const ls = Math.hypot(xb - xa, d), cb = ls / 2 / Math.tan(Math.atan2(d, xb - xa) / 2);
  return polygon([[x0, y0], [xa, y0], [xb, y0 + d], [x1, y0 + d], [x1, y0 + d + H], [xb, y0 + d + H], [xa, y0 + H], [x0, y0 + H]], [S, cb, cb, M, M, cb, cb, S]);
};

// A camcorder lens that widens away from the body with arcs instead of slopes: the part of a
// circle (centre (cx, 8), radius rad) left of x = 15, its leftmost point at x = 15 - w (one gap
// from the body), and the two corners on the flat outer side rounded at f.
const camLens = (w, rad, f = 1) => {
  const cx = 15 - w + rad, dx = 15 - f - cx, h = Math.sqrt((rad - f) ** 2 - dx ** 2);
  const tx = +(cx + (rad * dx) / (rad - f)).toFixed(3), ty = +((rad * h) / (rad - f)).toFixed(3), hh = +h.toFixed(3);
  return `M15 ${8 + hh}V${8 - hh}A${f} ${f} 0 0 0 ${tx} ${8 - ty}A${rad} ${rad} 0 0 0 ${tx} ${8 + ty}A${f} ${f} 0 0 0 15 ${8 + hh}Z`;
};

// The history arrow: a light ring (stroke 2, centre line radius 6, outer edge on the keyline)
// running clockwise from the upper left (225°) round to just below the left (170°), open at the
// upper left. Its blue head sits on the open end and points back, down and to the left
// (counterclockwise): a right-angled head whose edges lie at 45°, tip 0.41 out so the rounded
// tip lands where it is drawn.
const HIST = (() => {
  const c = 8, rc = 6, hw = 3.5, s = Math.SQRT1_2, P = c - rc * s, end = (170 * Math.PI) / 180;
  const pt = (u, v) => [+(P + u * s).toFixed(3), +(P + v * s).toFixed(3)];
  return {
    arc: `M${P.toFixed(3)} ${P.toFixed(3)}A${rc} ${rc} 0 1 1 ${(c + rc * Math.cos(end)).toFixed(3)} ${(c + rc * Math.sin(end)).toFixed(3)}`,
    head: polygon([pt(-hw, -hw), pt(hw, hw), pt(-hw - 0.41, hw + 0.41)], 1)
  };
})();

// The iOS-style wifi fan: a wedge and bands around (8, cy), between the radii at ±deg from
// straight up. Bands are 1.75 thick with a gap of 1; band ends are cut along the radii and every
// corner is rounded (c on the bands' corners, tip on the wedge's point), with the fillet circles
// fitted to each arc and radius so the edges stay tangent.
const FAN = (() => {
  const cx = 8, deg = 39, th = 1.75, gap = 1, R = 11.556, c = 0.75, tip = 1;
  const a = (deg * Math.PI) / 180, cy = 13.5 + tip / Math.sin(a) - tip, f = (v) => +v.toFixed(3);
  const P = (r, t) => `${f(cx + r * Math.sin(t))} ${f(cy - r * Math.cos(t))}`;
  const r0 = R - 3 * (th + gap);
  // Corner where the radius at angle side*a meets an arc of radius r (outer: convex arc).
  const corner = (r, side, outer) => {
    const d = outer ? r - c : r + c, phi = Math.asin(c / d), along = Math.sqrt(d * d - c * c);
    return { arc: P(r, side * (a - phi)), line: P(along, side * a) };
  };
  const band = (k) => {
    const ro = r0 + gap + k * (th + gap) - gap, ri = ro - th;
    const oL = corner(ro, -1, true), oR = corner(ro, 1, true), iR = corner(ri, 1, false), iL = corner(ri, -1, false);
    return `M${oL.arc}A${f(ro)} ${f(ro)} 0 0 1 ${oR.arc}A${c} ${c} 0 0 1 ${oR.line}L${iR.line}A${c} ${c} 0 0 1 ${iR.arc}` +
      `A${f(ri)} ${f(ri)} 0 0 0 ${iL.arc}A${c} ${c} 0 0 1 ${iL.line}L${oL.line}A${c} ${c} 0 0 1 ${oL.arc}Z`;
  };
  const oL = corner(r0, -1, true), oR = corner(r0, 1, true), t = tip / Math.tan(a);
  const wedge = `M${oL.arc}A${f(r0)} ${f(r0)} 0 0 1 ${oR.arc}A${c} ${c} 0 0 1 ${oR.line}L${P(t, a)}A${tip} ${tip} 0 0 1 ${P(t, -a)}L${oL.line}A${c} ${c} 0 0 1 ${oL.arc}Z`;
  return { band, wedge };
})();

// --- Objects that need slopes or points (GUIDE.md §1, second exception) ---------------------

// A five-pointed star centred on (cx, cy): outer radius ro, inner ri, drawn sy times as tall so
// it fills the circle keyline both ways. Ten points, clockwise from the top tip.
const starPts = (cx, cy, ro, ri, sy = 1) => Array.from({ length: 10 }, (_, i) => {
  const a = ((-90 + 36 * i) * Math.PI) / 180, d = i % 2 ? ri : ro;
  return [f3(cx + d * Math.cos(a)), f3(cy + d * Math.sin(a) * sy)];
});

// Arc helpers for outlines made of circles: the end points of an arc of radius rad round c
// from p to q, going the way that passes direction via (or the short way when via is null).
const arcTo = (c, rad, p, q, via = null) => {
  const ang = ([x, y]) => Math.atan2(y - c[1], x - c[0]), T = 2 * Math.PI, mod = (v) => ((v % T) + T) % T;
  const a0 = ang(p), da = mod(ang(q) - a0);
  const sweep = via == null ? (da < Math.PI ? 1 : 0) : (mod(via - a0) < da ? 1 : 0);
  const span = sweep ? da : T - da;
  return `A${f3(rad)} ${f3(rad)} 0 ${span > Math.PI ? 1 : 0} ${sweep} ${f3(q[0])} ${f3(q[1])}`;
};

// A crescent: the disc (8, 8, R1) less the disc (cx, cy, R2). Each tip is rounded at f by a
// circle touching both edges (the same way the heart rounds its tip).
const crescent = (R1, cx, cy, R2, f = 0.5) => {
  const d1 = R1 - f, d2 = R2 + f, dx = cx - 8, dy = cy - 8, Dd = Math.hypot(dx, dy);
  const a = (d1 * d1 - d2 * d2 + Dd * Dd) / (2 * Dd), h = Math.sqrt(d1 * d1 - a * a);
  const mx = 8 + (a * dx) / Dd, my = 8 + (a * dy) / Dd;
  const F = [[mx + (h * dy) / Dd, my - (h * dx) / Dd], [mx - (h * dy) / Dd, my + (h * dx) / Dd]];
  const on1 = ([x, y]) => [8 + ((x - 8) * R1) / d1, 8 + ((y - 8) * R1) / d1];
  const on2 = ([x, y]) => [cx + ((x - cx) * R2) / d2, cy + ((y - cy) * R2) / d2];
  const away = Math.atan2(-dy, -dx), toward = Math.atan2(8 - cy, 8 - cx);
  const p = (pt) => `${f3(pt[0])} ${f3(pt[1])}`;
  return `M${p(on1(F[0]))}${arcTo([8, 8], R1, on1(F[0]), on1(F[1]), away)}${arcTo(F[1], f, on1(F[1]), on2(F[1]))}` +
    `${arcTo([cx, cy], R2, on2(F[1]), on2(F[0]), toward)}${arcTo(F[0], f, on2(F[0]), on1(F[0]))}Z`;
};

// A drop: a circle (8, cy, rad) with two straight sides running up to a tip at (8, tip), the tip
// rounded at f.
const dropPath = (cy, rad, tip, f) => {
  const d = cy - tip, al = Math.asin(rad / d), b = Math.acos(rad / d), k = f / Math.tan(al);
  const P = (s) => [8 + s * rad * Math.sin(b), cy - rad * Math.cos(b)];
  const Q = (s) => { const [px, py] = P(s), l = Math.hypot(px - 8, py - tip); return [8 + ((px - 8) * k) / l, tip + ((py - tip) * k) / l]; };
  const p = (pt) => `${f3(pt[0])} ${f3(pt[1])}`;
  return `M${p(Q(-1))}A${f} ${f} 0 0 1 ${p(Q(1))}L${p(P(1))}A${rad} ${rad} 0 1 1 ${p(P(-1))}Z`;
};

// The badge's sparkle at any size: four tips (half-size T) rounded at f, joined by concave arcs
// of radius rho tangent to the tip circles.
const sparkleAt = (cx, cy, T, f = 0.5, rho = (1.75 * T) / 3) => {
  const a = T - f, c = (a + Math.sqrt(2 * (rho + f) ** 2 - a * a)) / 2;
  const tips = [[0, -a], [a, 0], [0, a], [-a, 0]], arcs = [[c, -c], [c, c], [-c, c], [-c, -c]];
  const touch = ([tx, ty], [ax, ay]) => { const l = Math.hypot(ax - tx, ay - ty); return [tx + (f * (ax - tx)) / l, ty + (f * (ay - ty)) / l]; };
  const p = (pt) => `${f3(cx + pt[0])} ${f3(cy + pt[1])}`;
  let d = `M${p(touch(tips[0], arcs[3]))}`;
  tips.forEach((tp, i) => { d += `A${f} ${f} 0 0 1 ${p(touch(tp, arcs[i]))}A${f3(rho)} ${f3(rho)} 0 0 0 ${p(touch(tips[(i + 1) % 4], arcs[i]))}`; });
  return d + 'Z';
};

// A folded map: three panels whose top and bottom edges zigzag at each fold.
const MAP = polygon([[1, 3.5], [5.667, 2], [10.333, 3.5], [15, 2], [15, 12.5], [10.333, 14], [5.667, 12.5], [1, 14]], [r, 1, 1, r, r, 1, 1, r]);

// A cut gem: a flat table, a girdle at its widest, and a point at the bottom.
const GEM = polygon([[4.5, 2], [11.5, 2], [15.3, 5.75], [8, 14.6], [0.7, 5.75]], [1, 1, 0.75, 1, 0.75]);

// A bar laid along a line through (cx, cy) at deg (0 is to the right, -45 up and to the right):
// from distance t0 to t1 along it, w wide. With point, the far end narrows to a point instead.
const AXIS = (cx, cy, deg, t0, t1, w, _ = null, point = false) => {
  const a = (deg * Math.PI) / 180, u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]];
  const P = (t, s) => [f3(cx + t * u[0] + s * v[0]), f3(cy + t * u[1] + s * v[1])];
  return point ? [P(t0, -w / 2), P(t1, 0), P(t0, w / 2)] : [P(t0, -w / 2), P(t1, -w / 2), P(t1, w / 2), P(t0, w / 2)];
};

// A sticky note with its lower right corner folded along a 45° line.
const NOTE = polygon([[2, 2], [14, 2], [14, 10], [10, 14], [2, 14]], [R, R, 1, 1, R]);

// A funnel chart's outline: wide at the top, narrowing to the bottom.
const FUNNEL = polygon([[1.4, 2], [14.6, 2], [10.5, 14], [5.5, 14]], [r, r, 1, 1]);

// A radar chart: points along five spokes from (8, cy), the first straight up, at fractions f of
// radius rad, drawn 5% taller.
const RADAR = (f, rad, cy = 8.6, sy = 1.05) => f.map((k, i) => {
  const a = ((-90 + 72 * i) * Math.PI) / 180;
  return [f3(8 + k * rad * Math.cos(a)), f3(cy + k * rad * Math.sin(a) * sy)];
});

// A plane seen from above in one light outline: a fuselage, swept wings and a swept tail.
const PLANE = pill(6.75, 2, 2.5, 12) + polygon([[2, 8.25], [8, 4.5], [14, 8.25], [14, 11.25], [8, 9], [2, 11.25]], [0.75, 0, 0.75, 0.75, 0, 0.75]) +
  polygon([[4.5, 12.25], [8, 10.5], [11.5, 12.25], [11.5, 14], [8, 12.5], [4.5, 14]], [0.5, 0, 0.5, 0.5, 0, 0.5]);

// A traffic cone: a narrow flat top widening to the base.
const CONE = polygon([[6.75, 1], [9.25, 1], [12.75, 12], [3.25, 12]], [1, 1, S, S]);

// An hourglass's glass: two bulbs that taper to a waist.
const GLASS = polygon([[3.5, 3.5], [12.5, 3.5], [9.25, 8], [12.5, 12.5], [3.5, 12.5], [6.75, 8]], [1, 1, 1.5, 1, 1, 1.5]);

export const ICONS = {
  folder: {
    label: '文件夹',
    key: 'landscape',
    layers: [
      // One light folder; a short blue dash on the front marks it.
      // A sheet kept inside, wholly hidden behind the folder; the hover motion draws it up out of
      // the opening (motion.mjs). The folder's knockout outline keeps it one gap clear.
      L(rr(6.5, 5.5, 6.5, 6.5, r)),
      L(body(1, 4, 14, 10, R, [{ x: 1, w: 6, h: 2, c: r }]), { ...Bt, gap: W }),
      L(pill(9, 10.75, 4, D))
    ]
  },
  'file-text': {
    label: '文档',
    key: 'portrait',
    layers: [
      L(rr(2, 1, 12, 14, M), Bt),
      // One layer per line, so the motion can write them on one after another.
      L(pill(5, 5.25, 6, D)),
      L(pill(5, 7.875, 6, D)),
      L(pill(5, 10.5, 3.5, D))
    ]
  },
  calendar: {
    label: '日历',
    key: 'square',
    layers: [
      L(rr(2, 3.5, 12, 10.5, R), Bt),
      L([5.25, 8, 10.75].map((x) => circ(x, 8.5, 0.625) + circ(x, 11.25, 0.625)).join('')),
      L(pill(4.875, 2, D, 3) + pill(9.875, 2, D, 3), { gap: W })
    ]
  },
  camera: {
    label: '相机',
    key: 'square',
    layers: [
      L(body(2, 4, 12, 10, R, [{ x: 5, w: 6, h: 2, c: r }]), Bt),
      L(circ(8, 9, 2.75), { cut: [C(circ(8, 9, 1.5))] })
    ]
  },
  lock: {
    label: '锁',
    key: 'portrait',
    layers: [
      // The body sits in front of the shackle and cuts a gap of W round itself.
      L('M4.75 7V5a3.25 3.25 0 0 1 6.5 0V7', { sw: K }),
      L(rr(2, 6.5, 12, 8.5, M), { ...Bt, gap: W }),
      L(pill(7.25, 9.25, 1.5, 3))
    ]
  },
  user: {
    label: '用户',
    key: 'square',
    layers: [
      L(circ(8, 5, 3)),
      L(rr(2, 9, 12, 5, [5, 5, r, r]), Bt)
    ]
  },
  'id-card': {
    label: '证件',
    key: 'landscape',
    layers: [
      L(rr(1, 2, 14, 12, R3), Bt),
      L(circ(5.5, 6.75, 1.5) + rr(3.25, 9.25, 4.5, 2.5, [2.25, 2.25, 0.75, 0.75])),
      L(pill(9.5, 6.25, 3.5, D) + pill(9.5, 9, 3, D))
    ]
  },
  building: {
    label: '建筑',
    key: 'square',
    layers: [
      // One tower: two columns of window bars and a door.
      L(rr(2, 2, 12, 12, R), Bt),
      // One layer per row of windows, so the motion can light them floor by floor.
      L(pill(4.5, 9.0, 2.25, D) + pill(9.25, 9.0, 2.25, D)),
      L(pill(4.5, 6.5, 2.25, D) + pill(9.25, 6.5, 2.25, D)),
      L(pill(4.5, 4.0, 2.25, D) + pill(9.25, 4.0, 2.25, D)),
      L(rr(7, 11, 2, 3, [1, 1, 0, 0]))
    ]
  },
  'book-open': {
    label: '书',
    key: 'landscape',
    layers: [
      L(rr(1, 2, 6.5, 12, [R3, 0, 0, R3]), Bt),
      L(rr(8.5, 2, 6.5, 12, [0, R3, R3, 0]), Bt),
      L(pill(3, 6, 2.5, D) + pill(3, 8.75, 2.5, D)),
      L(pill(10.5, 6, 2.5, D) + pill(10.5, 8.75, 2.5, D))
    ]
  },
  bell: {
    label: '铃铛',
    key: 'square',
    layers: [
      // Dome and brim are one light body; the knob and clapper are blue accents, sized as lone marks (GUIDE.md 5.1).
      L('M3 10.5V8a5 5 0 0 1 10 0V10.5Z' + pill(2, 9.75, 12, 1.5), Bt),
      L(circ(8, 3.25, 1.25) + rr(6.25, 12.25, 3.5, 1.75, [0.5, 0.5, 1.75, 1.75]), { gap: W })
    ]
  },
  trash: {
    label: '垃圾桶',
    key: 'portrait',
    layers: [
      L(body(2, 2.5, 12, 1.5, 0.6, [{ x: 6.5, w: 3, h: 1.5, c: 0.6 }])),
      L(rr(3, 5, 10, 10, [S, S, R, R]), Bt),
      L(pill(6.25, 7.5, D, 5) + pill(8.75, 7.5, D, 5))
    ]
  },
  gift: {
    label: '礼物',
    key: 'square',
    layers: [
      // The bow (two loops and a knot) stands one gap above the lid; the ribbon is printed on
      // the lid and the box.
      L(circ(5.75, 3.75, 1.125) + circ(10.25, 3.75, 1.125), { sw: D }),
      L(rr(7.25, 3.25, 1.5, 2.25, 0.75)),
      L(rr(2, 6.5, 12, 2.5, q), Bt),
      L(rr(3, 10, 10, 4, [S, S, r, r]), Bt),
      L(rr(7.25, 6.5, 1.5, 2.5)),
      L(rr(7.25, 10, 1.5, 4))
    ]
  },
  smile: {
    label: '笑脸',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      L(pill(5.375, 5.25, D, 2) + pill(9.375, 5.25, D, 2)),
      L('M5.5 9.25a2.5 2.5 0 0 0 5 0', { sw: D })
    ]
  },
  'message-square': {
    label: '对话',
    key: 'landscape',
    layers: [
      // One light bubble; the square corner says speech. Two blue lines.
      L(rr(1, 2, 14, 12, [R3, R3, R3, 0]), Bt),
      L(pill(4, 6, 8, D)),
      L(pill(4, 9, 5, D))
    ]
  },
  clock: {
    label: '时钟',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      // Minute hand, then hour hand: they meet at the centre with round caps.
      L('M8 4.75V8', { sw: K }),
      L('M8 8H10.5', { sw: K })
    ]
  },
  image: {
    label: '图片',
    key: 'landscape',
    layers: [
      L(rr(1, 2, 14, 12, R3), Bt),
      // The hill rises from the frame's bottom edge (clipped to it), so it has no margins to even
      // out; the sun sits the same 2.25 in from the top and right edges.
      L(circ(6.5, 16, 6), { clip: rr(1, 2, 14, 12, R3) }),
      L(circ(11.5, 5.5, 1.25))
    ]
  },
  ticket: {
    label: '票',
    key: 'wide',
    layers: [
      // The ticket and its stub, torn apart along the perforation: the tear cuts straight through one outline.
      L(rr(1, 2.5, 10, 11, [R, 0, 0, R]), { ...Bt, cut: [C(circ(1, 8, 1.25))] }),
      L(rr(12, 2.5, 3, 11, [0, r, r, 0]), { cut: [C(circ(15, 8, 1.25))] })
    ]
  },
  wallet: {
    label: '钱包',
    key: 'landscape',
    layers: [
      // The body's knockout outline only shows when the hover motion lifts a card out (motions.mjs).
      L(rr(1, 2, 14, 12, R3), { ...Bt, gap: W }),
      L(pill(9.5, 6.25, 4.5, 3.5), { cut: [C(circ(11.25, 8, 0.75))] })
    ]
  },
  headphones: {
    label: '耳机',
    key: 'live',
    layers: [
      L('M1.625 10V8a6.375 6.375 0 0 1 12.75 0V10', { sw: 1.25, ...Bt }),
      L(rr(1, 9, 3.5, 6, r), { gap: W }),
      L(rr(11.5, 9, 3.5, 6, r), { gap: W })
    ]
  },
  mic: {
    label: '话筒',
    key: 'portrait',
    allow: { spacing: '立柱顶端藏在支架后面，它和话筒头之间的距离看不见，不算间距' },
    layers: [
      // Capsule 4.5..11.5 with its bottom centre at (8, 6); the stand is concentric with it, a
      // 1.125 gap out (inner radius 4.625). The capsule is the light body; stand and base are blue.
      L(rr(4.5, 1, 7, 8.5, 3.5), Bt),
      L('M2.75 4.75V6a5.25 5.25 0 0 0 10.5 0V4.75', { sw: 1.25 }),
      L(body(5, 13.5, 6, 1.5, 0.75, [{ x: 7.375, w: D, h: 2.5, c: 0 }]))
    ]
  },
  cloud: {
    label: '云',
    key: 'wide',
    layers: [
      // The sun sits behind the cloud: the cloud covers its lower-left quarter, so the overlap is
      // plain to see, not a touch at the edges.
      L(circ(11.25, 6, 3.5)),
      L(pill(1, 8.5, 11.5, 5) + circ(6.25, 8.5, 3.5), { ...Bt, gap: W })
    ]
  },
  'shopping-bag': {
    label: '购物袋',
    key: 'portrait',
    layers: [
      L('M5 6.5V4.75a3 3 0 0 1 6 0V6.5', { sw: K }),
      L(rr(2, 6, 12, 9, [S, S, R, R]), { ...Bt, gap: W })
    ]
  },
  'battery-full': {
    label: '电池',
    key: 'wide',
    layers: [
      L(rr(1, 2.5, 12.5, 11, R) + rr(13.5, 6, 1.5, 4, [0, 0.75, 0.75, 0]), Bt),
      L(pill(3.75, 5, D, 6)),
      L(pill(6.25, 5, D, 6)),
      L(pill(8.75, 5, D, 6))
    ]
  },
  archive: {
    label: '归档',
    key: 'square',
    layers: [
      L(rr(2, 2, 12, 3.5, r), Bt),
      L(rr(3, 6.5, 10, 7.5, [S, S, R, R]), Bt),
      L(pill(6.25, 8.75, 3.5, D))
    ]
  },
  mail: {
    label: '邮件',
    key: 'wide',
    layers: [
      // The flap is the top of the body itself, clipped by a circle: a round-bottomed flap
      // instead of a V, and the body's own corners, exactly.
      // The body's knockout outline only shows when the hover motion lifts a letter out from
      // behind it (motions.mjs).
      L(rr(1, 2.5, 14, 11, R), { ...Bt, gap: W }),
      L(rr(1, 2.5, 14, 11, R), { clip: circ(8, -0.75, 8.75) })
    ]
  },
  printer: {
    label: '打印机',
    key: 'square',
    layers: [
      // Paper waiting on top, one gap above the body; the printed sheet comes out in blue, square
      // on the side cut off by the slot.
      L(rr(4.5, 2, 7, 2.5, q), Bt),
      L(rr(2, 5.5, 12, 6.5, M), Bt),
      L(rr(4.5, 9.5, 7, 4.5, [0, 0, r, r]), { gap: W })
    ]
  },
  home: {
    label: '首页',
    key: 'square',
    layers: [
      // A house in one light outline: a 45° roof (the allowed slope), rounded at the ridge and
      // the eaves. The blue door stands on the bottom edge.
      // The ridge sits 0.62 above the keyline so the rounded tip still reaches it.
      L(polygon([[8, 1.38], [14, 7.38], [14, 14], [2, 14], [2, 7.38]], [1.5, 1, M, M, 1]), Bt),
      L(rr(6.5, 9.5, 3, 4.5, [1.5, 1.5, 0, 0]))
    ]
  },
  search: {
    label: '搜索',
    key: 'live',
    layers: [
      // Light glass, a blue handle at 45° tucked into it, and a short blue glint.
      L(rot(12.5, 12.5, 6, 2.5, 45, 1.25)),
      L(circ(6.75, 6.75, 5.75), { ...Bt, gap: W }),
      L('M4 7A3 3 0 0 1 7 4', { sw: D })
    ]
  },
  settings: {
    label: '设置',
    key: 'circle',
    layers: [
      // A light gear: a disc with eight teeth turned in 45° steps, and a blue hub.
      L(circ(8, 8, 5.25) + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => rot(8 + 5.6 * Math.cos((a * Math.PI) / 180), 8 + 5.6 * Math.sin((a * Math.PI) / 180), 2.8, 2.6, a, 0.75)).join(''), Bt),
      L(circ(8, 8, 2.25))
    ]
  },
  tv: {
    label: '电视',
    key: 'landscape',
    layers: [
      // Light case, blue screen, and a wide base bar a gap of 1 below.
      L(rr(1, 2, 14, 9.5, R), Bt),
      L(rr(3, 4, 10, 5.5, r)),
      L(pill(4, 12.5, 8, 1.5))
    ]
  },
  bookmark: {
    label: '书签',
    key: 'portrait',
    layers: [
      // A closed book with a blue ribbon hanging from its top edge; the notch is a round cut.
      L(rr(2, 1, 12, 14, M), Bt),
      L(rr(6.75, 1, 3.5, 7.5, 0), { cut: [C(circ(8.5, 8.5, 1))] })
    ]
  },
  download: {
    label: '下载',
    key: 'square',
    layers: [
      // A light box and a blue arrow coming down into it. The arrow's head is the allowed 45°
      // slope; the tip sits 0.41 low so its rounded end lands where the drawn tip would be.
      L(rr(2, 6.5, 12, 7.5, M), Bt),
      L(polygon([[7.25, 2], [8.75, 2], [8.75, 7.5], [11.5, 7.5], [8, 11.41], [4.5, 7.5], [7.25, 7.5]], [0.75, 0.75, 0, 1, 1, 1, 0]), { gap: W })
    ]
  },
  upload: {
    label: '上传',
    key: 'square',
    layers: [
      L(rr(2, 6.5, 12, 7.5, M), Bt),
      L(polygon([[8, 1.59], [11.5, 5.5], [8.75, 5.5], [8.75, 11.5], [7.25, 11.5], [7.25, 5.5], [4.5, 5.5]], [1, 1, 0, 0.75, 0.75, 0, 1]), { gap: W })
    ]
  },
  share: {
    label: '分享',
    key: 'square',
    layers: [
      // A light box and a blue arrow rising out of it and turning right. The box is as tall as
      // upload's and the arrow spans the same height (its foot level with upload's shaft, its head
      // as high as upload's tip). The shaft stands on the box's centre line (x 7); the arrow cuts
      // a gap of W out of the box where it crosses it. The shaft is drawn from the foot up, so the
      // hover motion can grow it.
      L(rr(2, 6.5, 10, 7.5, M), Bt),
      L('M7 10.75V7.65A3.5 3.5 0 0 1 10.5 4.15H11.5', { sw: K, gap: W, part: 'arrow' }),
      L(polygon([[11, 0.65], [14.5, 4.15], [11, 7.65]], 1), { gap: W, part: 'arrow' })
    ]
  },
  'pencil': {
    label: '编辑',
    key: 'square',
    layers: [
      // Light barrel, blue nib and blue cap. The cap is cut off the barrel by a gap of 1. The far
      // corners sit 0.41 out so their rounded ends reach the box.
      L(polygon([[2, 14], ...pen(0, 10.304, 4)], [1, 0, 0, 0, 0]), Bt),
      L(polygon([[2, 14], ...pen(0, 10.304, 4)], [1, 0, 0, 0, 0]), { clip: polygon([[-6, 2.828], [12, 20.828], [-6, 20.828]]) }),
      L(polygon(pen(11.304, 13.554, 4), [0, 1, 1, 0]))
    ]
  },
  heart: {
    label: '喜欢',
    // Two round lobes and two large arcs tangent to them, meeting in a tip rounded at 1.25: arcs
    // instead of the slanted sides a heart is usually drawn with. A short blue glint sits 2 in.
    key: 'landscape',
    layers: [
      L('M8 3.354A4 4 0 0 1 14.695 7.531A12 12 0 0 1 8.511 13.891A1.25 1.25 0 0 1 7.489 13.891A12 12 0 0 1 1.305 7.531A4 4 0 0 1 8 3.354Z', Bt),
      L('M3.625 6A1.375 1.375 0 0 1 5 4.625', { sw: D })
    ]
  },
  play: {
    label: '播放',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      // The play triangle keeps its familiar proportions (not the 45° slope), centred by its
      // centroid; every corner is rounded.
      L(polygon([[5.75, 4], [12, 8], [5.75, 12]], 1))
    ]
  },
  phone: {
    label: '手机',
    key: 'tall',
    layers: [
      L(rr(3, 1, 10, 14, R), Bt),
      L(pill(6.5, 3, 3, D) + pill(6, 11.75, 4, D))
    ]
  },
  laptop: {
    label: '电脑',
    key: 'wide',
    layers: [
      // The light lid stands one gap above the blue base, which is wider: the lid shows its own
      // corners across the gap (seam radius 1).
      L(rr(2, 2.5, 12, 8, [M, M, S, S]), Bt),
      L(rr(1, 11.5, 14, 2, t))
    ]
  },
  'map-pin': {
    label: '定位',
    key: 'circle',
    layers: [
      // The locate-me crosshair (a map pin needs slopes outside the allowed list): a light disc,
      // four blue ticks laid over its rim out to the keyline, and a blue centre.
      L(circ(8, 8, 5.25), Bt),
      L(pill(7.25, 1, K, 3) + pill(7.25, 12, K, 3) + pill(1, 7.25, 3, K) + pill(12, 7.25, 3, K), { gap: W }),
      L(circ(8, 8, 2))
    ]
  },
  music: {
    label: '音乐',
    key: 'square',
    layers: [
      // Two beamed notes with a level beam: the blue beam and stems first, the light heads over
      // the stem ends so the stems disappear into them.
      L(polygon([[5.5, 2], [14, 2], [14, 11], [12.5, 11], [12.5, 4.5], [7, 4.5], [7, 11], [5.5, 11]], [q, q, 0, 0, 0, 0, 0, 0])),
      L(circ(4.5, 11.5, 2.5) + circ(11.5, 11.5, 2.5), { ...Bt, gap: W })
    ]
  },
  link: {
    label: '链接',
    key: 'flat',
    layers: [
      // Two light half-links face each other; the blue bar joins them, exactly 1 from every edge.
      L('M5.75 5H5a3 3 0 0 0 0 6H5.75M10.25 5H11a3 3 0 0 1 0 6H10.25', { sw: 2, ...Bt }),
      L(pill(4, 7, 8, 2))
    ]
  },
  'shopping-cart': {
    label: '购物车',
    key: 'square',
    layers: [
      // A light basket kept one gap inside the blue handle-and-frame stroke; the wheels hang from
      // the frame. The frame bends round the basket's corner on an arc about the same centre
      // (8, 7.5), so the gap stays 1 all the way round; the handle turns down with a thin-stroke
      // corner of 1.
      L(rr(6, 3.5, 8, 6, M), Bt),
      L('M2.75 2.75H3.25A1 1 0 0 1 4.25 3.75V7.5A3.75 3.75 0 0 0 8 11.25H13', { sw: K }),
      // The wheels sit symmetrically under the basket (centre x 10).
      L(circ(7.25, 12.75, 1.25) + circ(12.75, 12.75, 1.25))
    ]
  },
  'circle-check': {
    label: '完成',
    key: 'circle',
    layers: [
      // The status-mark family: one light disc and a blue mark drawn with the K stroke, kept
      // inside the central circle of 8. The check is the allowed 45° slope, centred on its box.
      L(circ(8, 8, 7), Bt),
      L('M5.25 7.75L7.25 9.75L10.75 6.25', { sw: K })
    ]
  },
  'circle-plus': {
    label: '添加',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      L('M8 5V11', { sw: K }),
      L('M5 8H11', { sw: K })
    ]
  },
  'circle-x': {
    label: '关闭',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      L('M5.75 5.75L10.25 10.25', { sw: K }),
      L('M10.25 5.75L5.75 10.25', { sw: K })
    ]
  },
  info: {
    label: '信息',
    key: 'circle',
    layers: [
      // A dot over a stem, one stroke apart, the pair centred on the disc.
      L(circ(8, 8, 7), Bt),
      L('M8 7.625V11.625', { sw: K }),
      L(circ(8, 4.75, 1.125))
    ]
  },
  'circle-alert': {
    label: '警告',
    key: 'circle',
    layers: [
      // info turned upside down: a stem over a dot.
      L(circ(8, 8, 7), Bt),
      L('M8 4.375V8.375', { sw: K }),
      L(circ(8, 11.25, 1.125))
    ]
  },
  'circle-help': {
    label: '帮助',
    key: 'circle',
    layers: [
      // A question mark from arcs only: a half circle over the top, then two quarter arcs of
      // radius 1 turning it back to the centre line; the dot sits one gap below, as in circle-alert.
      L(circ(8, 8, 7), Bt),
      L('M6 6.375A2 2 0 0 1 10 6.375A1 1 0 0 1 9 7.375A1 1 0 0 0 8 8.375', { sw: K }),
      L(circ(8, 11.25, 1.125))
    ]
  },
  eye: {
    label: '眼睛',
    key: 'wide',
    layers: [
      // A light eye made of two arcs with rounded tips; a blue iris in the middle.
      L(eyeOutline(8, 8, 14, 11, 1.25), Bt),
      L(circ(8, 8, 3))
    ]
  },
  flag: {
    label: '旗帜',
    key: 'portrait',
    layers: [
      // A blue pole running the full height, and a light cloth hung high on it, one gap away,
      // wider than tall, with a gentle wave along its top and bottom edges.
      L(pill(2, 1, K, 14)),
      L(flagWave(4.5, 1, 14, 1.25, 6.5, 7.25, 9.75), Bt)
    ]
  },
  key: {
    label: '钥匙',
    key: 'flat',
    layers: [
      // A light ring for the bow (a light stroke, as the link's half-rings) filling the height,
      // in front of a blue shaft 2.5 thick with two square teeth of equal width; the ring cuts a
      // gap of W round itself, so the shaft starts 1 out.
      L(polygon([[7.5, 6.75], [15, 6.75], [15, 12], [13.5, 12], [13.5, 9.25], [12.5, 9.25], [12.5, 12], [11, 12], [11, 9.25], [7.5, 9.25]], [0, 1, 0.5, 0.5, 0, 0, 0.5, 0.5, 0, 0])),
      L(circ(5, 8, 2.75), { sw: 2.5, ...Bt, gap: W })
    ]
  },
  'credit-card': {
    label: '银行卡',
    key: 'wide',
    layers: [
      // A light card; the magnetic stripe is a band of the body itself in blue, and one blue line.
      L(rr(1, 2.5, 14, 11, R), Bt),
      L(rr(1, 2.5, 14, 11, R), { clip: rr(0, 5.25, 16, 2.5) }),
      L(pill(3.25, 10, 3.5, D))
    ]
  },
  shield: {
    label: '安全',
    key: 'portrait',
    layers: [
      // A light shield whose sides curve into a rounded tip; a blue check (the allowed 45°).
      L(shieldPath(10, 1.25), Bt),
      L('M5.5 7.75L7.25 9.5L10.5 6.25', { sw: K })
    ]
  },
  lightbulb: {
    label: '灯泡',
    key: 'tall',
    layers: [
      // A light glass (a circle running into a straight neck) and a blue screw base one gap
      // below, cut straight across so glass and base share one outline: a collar and a narrower
      // contact. A short blue glint in the glass.
      L('M5.5 11V10.33A5 5 0 1 1 10.5 10.33V11Z', Bt),
      L(rr(5.5, 12, 5, 1.5, [0, 0, 0.5, 0.5]) + rr(6.25, 13, 3.5, 2, [0, 0, 0.75, 0.75])),
      L('M5.25 6A2.75 2.75 0 0 1 8 3.25', { sw: D })
    ]
  },
  video: {
    label: '视频',
    key: 'wide',
    layers: [
      // A light camcorder body and a blue lens one gap to its right that widens away from it,
      // drawn with an arc instead of the usual slanted sides.
      L(rr(1, 2.5, 10, 11, R), Bt),
      L(camLens(3, 6.5))
    ]
  },
  users: {
    label: '群组',
    key: 'square',
    layers: [
      // A light person behind, up and to the right; the front person (blue head, light shoulders,
      // as in user) sits lower and covers about a third of it with a knockout outline. The two
      // heads are exactly one gap apart.
      L(circ(10.25, 4.25, 2.25) + rr(6.5, 7.5, 7.5, 6.5, [3, 3, r, r]), Bt),
      L(circ(5.8125, 7.5, 2.25), { gap: W, part: 'front' }),
      L(rr(2, 10.75, 7.625, 3.25, [3, 3, r, r]), { ...Bt, gap: W, part: 'front' })
    ]
  },
  globe: {
    label: '地球',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      L('M8 1.625A3 6.375 0 0 1 8 14.375A3 6.375 0 0 1 8 1.625Z', { sw: D, clip: circ(8, 8, 7) }),
      L('M1.625 8H14.375', { sw: D, clip: circ(8, 8, 7) })
    ]
  },
  calculator: {
    label: '计算器',
    key: 'portrait',
    layers: [
      L(rr(2, 1, 12, 14, M), Bt),
      // The display sits 2 in from the top and sides; the keys are a square grid of 2.25, the
      // bottom row 2.25 up from the bottom edge.
      L(rr(4, 3, 8, 2.5, 1)),
      L([5.75, 8, 10.25].map((x) => circ(x, 7.625, 0.625) + circ(x, 9.875, 0.625) + circ(x, 12.125, 0.625)).join(''))
    ]
  },
  history: {
    label: '历史记录',
    key: 'circle',
    layers: [
      // The circular arrow is the light body; its blue head meets it directly (one element, one
      // part). The blue hands stand exactly one gap inside the ring.
      L(HIST.arc, { ...Bt, sw: 2, part: 'arrow' }),
      L(HIST.head, { part: 'arrow' }),
      // The hour hand is the shorter one, 2 clear of the ring.
      L('M8 4.75V8', { sw: K }),
      L('M8 8H10.25', { sw: K })
    ]
  },
  'log-out': {
    label: '退出登录',
    key: 'square',
    layers: [
      L(rr(2, 2, 7.5, 12, M), Bt),
      L(polygon([[5, 7.25], [10.5, 7.25], [10.5, 4.5], [14.41, 8], [10.5, 11.5], [10.5, 8.75], [5, 8.75]], [0.75, 0, 1, 1, 1, 0, 0.75]), { gap: W })
    ]
  },
  database: {
    label: '数据库',
    key: 'portrait',
    layers: [
      // A cylinder split into three tiers by two curved seams, like stacked disks; the top tier
      // is blue. The seams bow down as the rim of a cylinder seen a little from above.
      L(rr(2, 1, 12, 14, M), { ...Bt, cut: [C('M1 4.625A18.5 18.5 0 0 0 15 4.625', W), C('M1 9.625A18.5 18.5 0 0 0 15 9.625', W)] }),
      L(rr(2, 1, 12, 14, M), { clip: circ(8, -12.500, 18.0) })
    ]
  },
  server: {
    label: '服务器',
    key: 'landscape',
    layers: [
      // Two rack units: one rounded outline cut straight across by a gap of 1, so the cut corners
      // are square. Each unit has a blue drive slot 3 in from the left and a status light the same
      // 2.125 in from the right as from its unit's top and bottom.
      L(rr(1, 2, 14, 5.5, [R3, R3, 0, 0]), Bt),
      L(rr(1, 8.5, 14, 5.5, [0, 0, R3, R3]), Bt),
      L(pill(4, 4.125, 4, D) + pill(4, 10.625, 4, D)),
      L(circ(12.25, 4.75, 0.625) + circ(12.25, 11.25, 0.625))
    ]
  },
  wifi: {
    label: '无线网络',
    key: 'wide',
    layers: [
      // As on iOS: a fan of one rounded wedge and three bands around a common centre, each a gap
      // of 1 from the next, all cut along the same two radii. Outer two bands light, inner band
      // and wedge blue (signal strength). Outer band first, wedge last.
      L(FAN.band(3), Bt),
      L(FAN.band(2), Bt),
      L(FAN.band(1)),
      L(FAN.wedge)
    ]
  },
  power: {
    label: '电源',
    key: 'circle',
    layers: [
      // A light round button with the blue power mark centred on it (no rim, like the dials). The
      // ring opens 50° either side of the top so its ends sit 1 from the stem.
      L(circ(8, 8, 7), Bt),
      L('M5.51 6.161A3.25 3.25 0 1 0 10.49 6.161M8 4.5V8', { sw: K })
    ]
  },
  sliders: {
    label: '调节',
    key: 'landscape',
    layers: [
      // Two blue tracks with light knobs in front, cutting a gap of W out of the tracks. The knobs
      // sit point-symmetric about the centre, each leaving a short stub of track on one side.
      L(pill(1, 3.75, 14, K) + pill(1, 10.75, 14, K)),
      L(circ(9.5, 4.5, 2.5), { ...Bt, gap: W }),
      L(circ(6.5, 11.5, 2.5), { ...Bt, gap: W })
    ]
  },
  copy: {
    label: '复制',
    key: 'portrait',
    layers: [
      // Two sheets: the copy behind in blue, the light sheet in front cutting a gap of W out of it
      // and covering about a third of it.
      L(rr(5.5, 1, 8.5, 10, M)),
      L(rr(2, 5, 8.5, 10, M), { ...Bt, gap: W })
    ]
  },
  clipboard: {
    label: '剪贴板',
    key: 'portrait',
    layers: [
      // A light board and a blue clip laid over its top edge, cutting a gap of W round itself.
      L(rr(2, 2.5, 12, 12.5, M), Bt),
      L(rr(5, 1, 6, 3, 1), { gap: W }),
      L(pill(5, 7.25, 6, D)),
      L(pill(5, 9.875, 3.5, D))
    ]
  },
  inbox: {
    label: '收件箱',
    key: 'landscape',
    layers: [
      // A light tray; its lower part is blue, clipped from the body so it keeps the body's
      // corners, with the dip of the tray in the middle.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(rr(1, 2, 14, 12, R3), { clip: polygon([[-1, 8.5], [5, 8.5], [5, 10.5], [11, 10.5], [11, 8.5], [17, 8.5], [17, 17], [-1, 17]], [0, 1, 1, 1, 1, 0, 0, 0]) })
    ]
  },
  receipt: {
    label: '账单',
    key: 'portrait',
    layers: [
      // A slip of paper the size of file-text whose bottom edge is three even half-circle
      // scallops (r 2): the outer ones run straight on from the sides, so there are no points.
      L(rr(2, 1, 12, 12, [M, M, 0, 0]) + [4, 8, 12].map((x) => circ(x, 13, 2)).join(''), Bt),
      L(pill(5, 4.25, 6, D) + pill(5, 6.875, 6, D)),
      L(pill(5, 9.5, 3.5, D))
    ]
  },
  package: {
    label: '包裹',
    key: 'square',
    layers: [
      // A light carton whose top flap is cut off by a straight seam, so both sides of the cut
      // keep square corners; a blue strip of tape runs over the seam, clipped to the carton so
      // it shares its top edge.
      L(rr(2, 2, 12, 3.5, [R, R, 0, 0]), Bt),
      L(rr(2, 6.5, 12, 7.5, [0, 0, R, R]), Bt),
      // The tape in two pieces, one on the lid and one on the box, so the lid can lift with its own.
      L(rr(6.5, 2, 3, 3.5, 0), { clip: rr(2, 2, 12, 3.5, [R, R, 0, 0]) }),
      L(rr(6.5, 6.5, 3, 3, [0, 0, 1, 1]), { clip: rr(2, 6.5, 12, 7.5, [0, 0, R, R]) })
    ]
  },
  store: {
    label: '商店',
    key: 'square',
    layers: [
      // A blue awning with a scalloped edge, one gap above the light shop. The door stands on
      // the bottom edge, clipped to the shop so it follows the body's own outline there.
      L(rr(2, 2, 12, 3.5, [r, r, 0, 0]) + [3.5, 6.5, 9.5, 12.5].map((x) => circ(x, 5, 1.5)).join('')),
      L(rr(3, 7.5, 10, 6.5, [S, S, R, R]), Bt),
      L(rr(6.5, 10, 3, 4, [1.5, 1.5, 0, 0]), { clip: rr(3, 7.5, 10, 6.5, [S, S, R, R]) })
    ]
  },
  'lock-open': {
    label: '解锁',
    key: 'portrait',
    layers: [
      // The lock with its shackle swung open: the left leg still runs into the body, the right
      // end stops short on the arc.
      L('M4.75 7V5a3.25 3.25 0 0 1 6.065 -1.625', { sw: K }),
      L(rr(2, 6.5, 12, 8.5, M), { ...Bt, gap: W }),
      L(pill(7.25, 9.25, 1.5, 3))
    ]
  },
  menu: {
    label: '菜单',
    key: 'wide',
    layers: [
      // Three bars of equal length, 2 thick and 2.5 apart; the middle one is blue. Drawn as
      // strokes, so the motion can draw them on without running past their ends.
      L('M2 3.5H14', { sw: 2, ...Bt }),
      L('M2 8H14', { sw: 2 }),
      L('M2 12.5H14', { sw: 2, ...Bt })
    ]
  },
  grid: {
    label: '网格',
    key: 'square',
    layers: [
      // Nine light tiles, three by three, a gap of 1 apart; the centre tile is blue.
      L([0, 1, 2].flatMap((i) => [0, 1, 2].filter((j) => i !== 1 || j !== 1).map((j) => rr(2 + (i * 13) / 3, 2 + (j * 13) / 3, 10 / 3, 10 / 3, 1))).join(''), Bt),
      L(rr(2 + 13 / 3, 2 + 13 / 3, 10 / 3, 10 / 3, 1))
    ]
  },
  list: {
    label: '列表',
    key: 'landscape',
    layers: [
      // Three rows: a blue dot and a light bar one gap to its right. One layer per row's bar, so
      // the motion can lay them out one after another.
      L([3.25, 8, 12.75].map((y) => circ(2.25, y, 1.25)).join('')),
      L(pill(4.5, 2, 10.5, 2.5), Bt),
      L(pill(4.5, 6.75, 10.5, 2.5), Bt),
      L(pill(4.5, 11.5, 10.5, 2.5), Bt)
    ]
  },
  sun: {
    label: '太阳',
    key: 'circle',
    layers: [
      // A light disc ringed by eight blue dots, one gap out (dots instead of rays, which would
      // need slopes). The straight and the diagonal dots are separate layers.
      L(circ(8, 8, 4.25), Bt),
      L([0, 90, 180, 270].map((a) => circ(8 + 6.125 * Math.cos((a * Math.PI) / 180), 8 + 6.125 * Math.sin((a * Math.PI) / 180), 0.875)).join('')),
      L([45, 135, 225, 315].map((a) => circ(8 + 6.125 * Math.cos((a * Math.PI) / 180), 8 + 6.125 * Math.sin((a * Math.PI) / 180), 0.875)).join(''))
    ]
  },
  'rotate-cw': {
    label: '顺时针旋转',
    key: 'circle',
    layers: [
      // history's arrow turned the other way, without the hands: a light ring open at the upper
      // right, drawn clockwise from just below the right up to the opening, where the blue head
      // points on round, down and to the right.
      L('M13.909 9.042A6 6 0 1 1 12.243 3.757', { ...Bt, sw: 2, part: 'arrow' }),
      L(polygon([[15.008, 6.522], [9.768, 6.232], [14.718, 1.282]], 1), { part: 'arrow' })
    ]
  },
  'chart-bar': {
    label: '图表',
    key: 'square',
    layers: [
      // Three bars a gap of 1 apart on one baseline; the tallest, in the middle, is blue. One
      // layer per bar, so the motion can raise them one after another.
      L(rr(2, 7.5, 10 / 3, 6.5, 1), Bt),
      L(rr(2 + 13 / 3, 2, 10 / 3, 12, 1)),
      L(rr(2 + 26 / 3, 5, 10 / 3, 9, 1), Bt)
    ]
  },
  'chart-pie': {
    label: '饼图',
    key: 'circle',
    layers: [
      // A light disc with its upper right quarter cut away along two straight seams 1 wide; the
      // quarter is blue, clipped from the same disc so it keeps its outline exactly.
      L(circ(8, 8, 7), { ...Bt, cut: [C(rr(7.5, -1, 10, 9.5))] }),
      L(circ(8, 8, 7), { clip: rr(8.5, 0, 8, 7.5) })
    ]
  },
  filter: {
    label: '筛选',
    key: 'circle',
    layers: [
      // A funnel needs slopes, so filter uses the other common sign: three lines that get shorter
      // (8, 5.5 and 3 long), centred on a light disc as in the status marks.
      L(circ(8, 8, 7), Bt),
      L('M4.75 5.5H11.25', { sw: K }),
      L('M6 8H10', { sw: K }),
      L('M7.25 10.5H8.75', { sw: K })
    ]
  },
  briefcase: {
    label: '公文包',
    key: 'landscape',
    layers: [
      // A blue handle behind a light case, which cuts a gap of W round itself; a blue clasp
      // centred on the case, 3 in from its top and bottom.
      L('M5.75 6V3.75A1 1 0 0 1 6.75 2.75H9.25A1 1 0 0 1 10.25 3.75V6', { sw: K }),
      L(rr(1, 5.5, 14, 8.5, M), { ...Bt, gap: W }),
      L(rr(6.5, 8.5, 3, 2.5, 1))
    ]
  },
  keyboard: {
    label: '键盘',
    key: 'wide',
    layers: [
      // A light keyboard with two rows of four blue keys and a space bar under them; the corner
      // keys sit 2.25 in from both nearby edges. One layer per row, so the motion can press them
      // one after another.
      L(rr(1, 2.5, 14, 11, R), Bt),
      L([0, 1, 2, 3].map((k) => circ(4 + (k * 8) / 3, 5.5, 0.75)).join('')),
      L([0, 1, 2, 3].map((k) => circ(4 + (k * 8) / 3, 8, 0.75)).join('')),
      L(pill(5.5, 9.875, 5, D))
    ]
  },
  toggle: {
    label: '切换开关',
    key: 'flat',
    layers: [
      // A light track and a blue knob at its left end, 1 in from the track's top, bottom and end.
      L(pill(1, 4, 14, 8), Bt),
      L(circ(5, 8, 3))
    ]
  },
  'circle-minus': {
    label: '移除',
    key: 'circle',
    layers: [
      // circle-plus without its upright stroke.
      L(circ(8, 8, 7), Bt),
      L('M5 8H11', { sw: K })
    ]
  },
  'circle-dot': {
    label: '单选',
    key: 'circle',
    layers: [
      // A selected radio button: a light disc and a blue dot at its centre, 4 in from the rim.
      L(circ(8, 8, 7), Bt),
      L(circ(8, 8, 3))
    ]
  },
  checkbox: {
    label: '复选框',
    key: 'square',
    layers: [
      // A light box with circle-check's check, centred.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M5.25 7.75L7.25 9.75L10.75 6.25', { sw: K })
    ]
  },
  'plus-square': {
    label: '新增',
    key: 'square',
    layers: [
      L(rr(2, 2, 12, 12, R), Bt),
      L('M8 5V11', { sw: K }),
      L('M5 8H11', { sw: K })
    ]
  },
  'more-horizontal': {
    label: '更多',
    key: 'flat',
    layers: [
      // A light capsule (toggle's track) with three blue dots a gap of 1 apart; the outer dots
      // are concentric with the capsule's round ends. One layer per dot, so the motion can put
      // them down one after another.
      L(pill(1, 4, 14, 8), Bt),
      L(circ(5, 8, 1)),
      L(circ(8, 8, 1)),
      L(circ(11, 8, 1))
    ]
  },
  loader: {
    label: '加载',
    key: 'circle',
    layers: [
      // A light ring (history's: stroke 2, outer edge on the keyline) with a blue quarter printed
      // on it from the top round to the right; its round ends stay inside the ring.
      L(circ(8, 8, 6), { ...Bt, sw: 2 }),
      L('M8 2A6 6 0 0 1 14 8', { sw: 2 })
    ]
  },
  appearance: {
    label: '外观',
    key: 'circle',
    layers: [
      // One disc, half light and half blue: the blue half is clipped from the same disc, so it
      // keeps the outline exactly and meets the light half with no seam.
      L(circ(8, 8, 7), Bt),
      L(circ(8, 8, 7), { clip: rr(8, 0, 9, 16, 0) })
    ]
  },
  'rotate-ccw': {
    label: '逆时针旋转',
    key: 'circle',
    layers: [
      // rotate-cw mirrored: the ring opens at the upper left and the head points on round
      // counterclockwise, down and to the left.
      L('M2.091 9.042A6 6 0 1 0 3.757 3.757', { ...Bt, sw: 2, part: 'arrow' }),
      L(polygon([[1.282, 1.282], [6.232, 6.232], [0.992, 6.522]], 1), { part: 'arrow' })
    ]
  },
  'log-in': {
    label: '登录',
    key: 'square',
    layers: [
      // log-out turned round: the light door on the right and the blue arrow coming in from the
      // left, its head on the door, cutting a gap of W round itself.
      L(rr(6.5, 2, 7.5, 12, M), Bt),
      L(polygon([[2, 7.25], [7.5, 7.25], [7.5, 4.5], [11.41, 8], [7.5, 11.5], [7.5, 8.75], [2, 8.75]], [0.75, 0, 1, 1, 1, 0, 0.75]), { gap: W })
    ]
  },
  sidebar: {
    label: '侧边栏',
    key: 'landscape',
    layers: [
      // One window split by a straight seam 1 wide (as chart-pie): a blue side panel 4 wide on
      // the left, the light content area on the right. Both are taken from the same outline, so
      // they keep its corners and the seam's ends stay square.
      L(rr(1, 2, 14, 12, R3), { ...Bt, cut: [C(rr(-1, -1, 7, 18))] }),
      L(rr(1, 2, 14, 12, R3), { clip: rr(-1, -1, 6, 18) })
    ]
  },
  undo: {
    label: '撤销',
    key: 'square',
    layers: [
      // rotate-ccw's ring and head as a U-turn: a light band (stroke 2) runs from the tail at the
      // bottom round the right and back along the top, where the blue head points left. Drawn
      // from the tail, so the motion can draw it on toward the head. The head's base corners
      // sit 1.25 out, so its rounded top still reaches the keyline.
      L('M5 13H8.625A4.375 4.375 0 0 0 8.625 4.25H5.5', { ...Bt, sw: 2, part: 'arrow' }),
      L(polygon([[5.5, 0.75], [5.5, 7.75], [1.59, 4.25]], 1), { part: 'arrow' })
    ]
  },
  redo: {
    label: '重做',
    key: 'square',
    layers: [
      // undo mirrored.
      L('M11 13H7.375A4.375 4.375 0 0 1 7.375 4.25H10.5', { ...Bt, sw: 2, part: 'arrow' }),
      L(polygon([[10.5, 0.75], [14.41, 4.25], [10.5, 7.75]], 1), { part: 'arrow' })
    ]
  },
  'arrow-left-right': {
    label: '左右互换',
    key: 'circle',
    layers: [
      // The status-mark family: a light disc and two blue arrows drawn with the K stroke, right
      // above and left below, their heads the allowed 45° and a gap of 1 apart.
      L(circ(8, 8, 7), Bt),
      L('M5 6H11M9.5 4.5L11 6L9.5 7.5', { sw: K }),
      L('M11 10H5M6.5 8.5L5 10L6.5 11.5', { sw: K })
    ]
  },
  'arrow-up-down': {
    label: '上下排序',
    key: 'circle',
    layers: [
      // arrow-left-right turned a quarter: up on the left, down on the right.
      L(circ(8, 8, 7), Bt),
      L('M6 11V5M4.5 6.5L6 5L7.5 6.5', { sw: K }),
      L('M10 5V11M8.5 9.5L10 11L11.5 9.5', { sw: K })
    ]
  },
  'align-left': {
    label: '左对齐',
    key: 'wide',
    layers: [
      // menu's three bars with a short blue one in the middle, flush left. Drawn from the side
      // they are aligned to, so the motion writes them on from there.
      L('M2 3.5H14', { sw: 2, ...Bt }),
      L('M2 8H9', { sw: 2 }),
      L('M2 12.5H14', { sw: 2, ...Bt })
    ]
  },
  'align-center': {
    label: '居中对齐',
    key: 'wide',
    layers: [
      L('M2 3.5H14', { sw: 2, ...Bt }),
      L('M4.5 8H11.5', { sw: 2 }),
      L('M2 12.5H14', { sw: 2, ...Bt })
    ]
  },
  'align-right': {
    label: '右对齐',
    key: 'wide',
    layers: [
      L('M14 3.5H2', { sw: 2, ...Bt }),
      L('M14 8H7', { sw: 2 }),
      L('M14 12.5H2', { sw: 2, ...Bt })
    ]
  },
  table: {
    label: '表格',
    key: 'landscape',
    layers: [
      // One sheet cut by straight seams 1 wide: a blue header row on top, then two light rows of
      // two cells. Every piece is taken from the same outline, so it keeps the sheet's corners.
      L(rr(1, 2, 14, 12, R3), { clip: rr(-1, -1, 18, 6) }),
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, 6, 18, 3.5), cut: [C(rr(7.5, -1, 1, 18))] }),
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, 10.5, 18, 7), cut: [C(rr(7.5, -1, 1, 18))] })
    ]
  },
  'message-circle': {
    label: '消息',
    key: 'circle',
    layers: [
      // A round bubble whose lower left quarter is square, the corner that says speech (as
      // message-square's), with three blue dots a gap of 1 apart. One layer per dot, so the
      // motion can make them hop one after another.
      L('M1 8A7 7 0 1 1 8 15H1Z', Bt),
      L(circ(5, 8, 1)),
      L(circ(8, 8, 1)),
      L(circ(11, 8, 1))
    ]
  },
  'messages-square': {
    label: '对话',
    key: 'landscape',
    layers: [
      // Two bubbles facing each other, drawn like copy: the blue one behind at the top right,
      // its square corner at the bottom right; the light one in front at the bottom left, its
      // square corner at the bottom left, cutting a gap of W out of the other and covering about
      // a third of it. Two blue lines on the front bubble, one layer each.
      L(rr(5, 2, 10, 8, [M, M, 0, M])),
      L(rr(1, 6, 10, 8, [M, M, M, 0]), { ...Bt, gap: W }),
      L(pill(3.25, 8.25, 5, D)),
      L(pill(3.25, 10.5, 3, D))
    ]
  },
  'app-window': {
    label: '应用窗口',
    key: 'landscape',
    layers: [
      // A light window whose title bar is blue, clipped from the window so it keeps its top
      // corners and meets the page with no seam; two blue lines of content on the page.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(rr(1, 2, 14, 12, R3), { clip: rr(-1, -1, 18, 6.5) }),
      L(pill(3.25, 8, 7, D)),
      L(pill(3.25, 10.5, 4.5, D))
    ]
  },
  columns: {
    label: '分栏',
    key: 'landscape',
    layers: [
      // One page cut into three columns 4 wide by two straight seams 1 wide (as sidebar); the
      // middle column is blue.
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, -1, 6, 18) }),
      L(rr(1, 2, 14, 12, R3), { clip: rr(6, -1, 4, 18) }),
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(11, -1, 6, 18) })
    ]
  },
  indent: {
    label: '增加缩进',
    key: 'wide',
    layers: [
      // menu's light bars at the top and bottom; the middle line is blue and set in, with a
      // small blue chevron (the allowed 45°) pointing at it, a gap of 1 from it and the bars.
      L('M2 3.5H14', { sw: 2, ...Bt }),
      L('M2 12.5H14', { sw: 2, ...Bt }),
      L('M2.5 6.25L4.25 8L2.5 9.75M7 8H14', { sw: K })
    ]
  },
  outdent: {
    label: '减少缩进',
    key: 'wide',
    layers: [
      // indent with the chevron pointing back to the left.
      L('M2 3.5H14', { sw: 2, ...Bt }),
      L('M2 12.5H14', { sw: 2, ...Bt }),
      L('M4.25 6.25L2.5 8L4.25 9.75M7 8H14', { sw: K })
    ]
  },
  type: {
    label: '字体',
    key: 'square',
    layers: [
      // The text-format family: a light tile with a blue letter drawn with the K stroke, kept
      // inside the central 8. One layer per stroke, so the motion can write them in order.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M5 5H11', { sw: K }),
      L('M8 5V11', { sw: K })
    ]
  },
  heading: {
    label: '标题',
    key: 'square',
    layers: [
      L(rr(2, 2, 12, 12, R), Bt),
      L('M5.25 4.5V11.5', { sw: K }),
      L('M10.75 4.5V11.5', { sw: K }),
      L('M5.25 8H10.75', { sw: K })
    ]
  },
  bold: {
    label: '加粗',
    key: 'square',
    layers: [
      // A B of straight strokes and two half-round bowls, the lower one a little wider; drawn
      // in one stroke from the waist, round the lower bowl, up the stem and round the upper one.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M5.5 8H8.75A1.75 1.75 0 0 1 8.75 11.5H5.5V4.5H8.25A1.75 1.75 0 0 1 8.25 8', { sw: K })
    ]
  },
  underline: {
    label: '下划线',
    key: 'square',
    layers: [
      // A U and, a gap of 1 below it, the line.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M6 4.75V6.75A2 2 0 0 0 10 6.75V4.75', { sw: K }),
      L('M4.75 11.25H11.25', { sw: K })
    ]
  },
  maximize: {
    label: '全屏',
    key: 'square',
    layers: [
      // A light screen with four blue corner marks pointing out, 2 in from its edges. One layer
      // per corner, so the motion can push them out to the edges.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M4.75 6.75V4.75H6.75', { sw: K }),
      L('M9.25 4.75H11.25V6.75', { sw: K }),
      L('M11.25 9.25V11.25H9.25', { sw: K }),
      L('M6.75 11.25H4.75V9.25', { sw: K })
    ]
  },
  minimize: {
    label: '退出全屏',
    key: 'square',
    layers: [
      // maximize's corner marks turned to point in. Their corners stay 1.5 apart (not 1), so at
      // 16px the four marks don't close up into a plus.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M4.75 6.5H6.5V4.75', { sw: K }),
      L('M9.5 4.75V6.5H11.25', { sw: K }),
      L('M11.25 9.5H9.5V11.25', { sw: K }),
      L('M6.5 11.25V9.5H4.75', { sw: K })
    ]
  },
  hash: {
    label: '话题',
    key: 'circle',
    layers: [
      // An upright hash on a light disc, as the status marks: two uprights, then two cross bars.
      L(circ(8, 8, 7), Bt),
      L('M6.5 4.5V11.5M9.5 4.5V11.5', { sw: K }),
      L('M4.5 6.5H11.5M4.5 9.5H11.5', { sw: K })
    ]
  },
  notebook: {
    label: '笔记本',
    key: 'portrait',
    layers: [
      // A light notebook with three blue rings crossing its left edge, cutting a gap of W round
      // themselves (as calendar's posts), and a blue label line on the cover.
      L(rr(3.5, 1, 10.5, 14, M), Bt),
      L(pill(7.25, 5, 4, D)),
      L(pill(2, 3.375, 3, D) + pill(2, 7.375, 3, D) + pill(2, 11.375, 3, D), { gap: W })
    ]
  },
  'cloud-upload': {
    label: '上传到云端',
    key: 'wide',
    layers: [
      // A light cloud of a long pill and one round top, with a smaller upload arrow standing on
      // it, cutting a gap of W round itself.
      L(pill(1, 7, 14, 6.5) + circ(8.5, 7, 4.5), Bt),
      L(polygon([[8, 4.59], [10.5, 7.5], [8.75, 7.5], [8.75, 11.5], [7.25, 11.5], [7.25, 7.5], [5.5, 7.5]], [1, 0.5, 0, 0.75, 0.75, 0, 0.5]), { gap: W })
    ]
  },
  'text-cursor': {
    label: '文本光标',
    key: 'wide',
    layers: [
      // A light text field with a line of typed text and an I-beam cursor after it, both blue
      // and both 2.25 in from the field's edges.
      L(rr(1, 2.5, 14, 11, R), Bt),
      L(pill(3.25, 7.375, 3.5, D)),
      L('M9 5.25V10.75M7.5 5.25H10.5M7.5 10.75H10.5', { sw: K })
    ]
  },
  'text-size': {
    label: '字号',
    key: 'square',
    layers: [
      // type's tile with a large T and, standing on the same baseline, a small one.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M4.75 4.75H9.25M7 4.75V11.25', { sw: K }),
      L('M9.75 8.25H11.25M10.5 8.25V11.25', { sw: K })
    ]
  },
  'panel-bottom': {
    label: '底部面板',
    key: 'landscape',
    layers: [
      // sidebar turned on its side: one window cut by a straight seam 1 wide into a light page
      // above and a blue panel 3.5 high below.
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, -1, 18, 10.5) }),
      L(rr(1, 2, 14, 12, R3), { clip: rr(-1, 10.5, 18, 7) })
    ]
  },
  rows: {
    label: '分行',
    key: 'landscape',
    layers: [
      // columns turned on its side: three rows a third high, the middle one blue.
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, -1, 18, 3 + 10 / 3) }),
      L(rr(1, 2, 14, 12, R3), { clip: rr(-1, 3 + 10 / 3, 18, 10 / 3) }),
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, 4 + 20 / 3, 18, 8) })
    ]
  },
  'layout-dashboard': {
    label: '数据看板',
    key: 'square',
    layers: [
      // Four cards in two columns a gap of 1 apart: tall over short on the left, short over
      // tall on the right; the tall left card is blue. The outer corners are rounded at M, the
      // inner ones at 1, so the four together keep one rounded outline.
      L(rr(2, 2, 5.5, 7, [M, 1, 1, 1])),
      L(rr(2, 10, 5.5, 4, [1, 1, 1, M]), Bt),
      L(rr(8.5, 2, 5.5, 4, [1, M, 1, 1]), Bt),
      L(rr(8.5, 7, 5.5, 7, [1, 1, M, 1]), Bt)
    ]
  },
  kanban: {
    label: '看板',
    key: 'landscape',
    layers: [
      // A light board with three blue lanes of cards hanging from the same top line, a gap of
      // 1 apart and 2.25 in from the board's edges. One layer per lane, so a card can move.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(rr(3.25, 4.25, 2.5, 7.5, 1)),
      L(rr(6.75, 4.25, 2.5, 4, 1)),
      L(rr(10.25, 4.25, 2.5, 5.5, 1))
    ]
  },
  folders: {
    label: '多个文件夹',
    key: 'landscape',
    layers: [
      // Two folders drawn like copy: the blue one behind at the top right, the light one in
      // front at the bottom left, cutting a gap of W out of it and covering about a third of it.
      L(body(5, 3.5, 10, 7, M, [{ x: 5, w: 4.5, h: 1.5, c: 0.75 }])),
      L(body(1, 8, 9.5, 6, M, [{ x: 1, w: 4, h: 1.5, c: 0.75 }]), { ...Bt, gap: W })
    ]
  },
  notepad: {
    label: '记事本',
    key: 'portrait',
    layers: [
      // A pad of paper: a blue gummed band on top cut off by a straight seam (as package's lid),
      // and two blue lines on the light sheet.
      L(rr(2, 1, 12, 14, M), { clip: rr(-1, -1, 18, 4) }),
      L(rr(2, 1, 12, 14, M), { ...Bt, clip: rr(-1, 4, 18, 13) }),
      L(pill(5, 7.75, 6, D) + pill(5, 10.375, 6, D))
    ]
  },
  headset: {
    label: '客服耳麦',
    key: 'live',
    layers: [
      // headphones with a boom: a light arm (a thin support, as the headband) runs from under
      // the left cup to a blue mic one gap clear of the right cup; the cups cut a gap of W round
      // themselves.
      L('M1.625 10V8a6.375 6.375 0 0 1 12.75 0V10', { sw: 1.25, ...Bt }),
      L('M3 13.25H8.5', { sw: D, ...Bt, part: 'boom' }),
      L(pill(7.75, 12.375, 2.75, 1.75), { part: 'boom' }),
      L(rr(1, 9, 3.5, 6, r), { gap: W }),
      L(rr(11.5, 9, 3.5, 6, r), { gap: W })
    ]
  },
  'chart-donut': {
    label: '环形图',
    key: 'circle',
    layers: [
      // chart-pie with a hole of radius 3.5: a light ring whose upper right quarter is cut away
      // along two straight seams 1 wide, and that quarter in blue, clipped from the same ring.
      L(circ(8, 8, 7), { ...Bt, cut: [C(circ(8, 8, 3.5)), C(rr(7.5, -1, 10, 9.5))] }),
      L(circ(8, 8, 7), { clip: rr(8.5, 0, 8, 7.5), cut: [C(circ(8, 8, 3.5))] })
    ]
  },
  'chart-column-stacked': {
    label: '堆叠柱状图',
    key: 'square',
    layers: [
      // chart-bar's three bars, each cut by a straight seam 1 wide: a blue lower part and a
      // light upper part, both clipped from the bar so they keep its corners.
      ...[[2, 7.5, 10.5], [2 + 13 / 3, 2, 8], [2 + 26 / 3, 5, 9.5]].flatMap(([x, y, s]) => [
        L(rr(x, y, 10 / 3, 14 - y, 1), { clip: rr(x - 1, s, 6, 6) }),
        L(rr(x, y, 10 / 3, 14 - y, 1), { ...Bt, clip: rr(x - 1, 0, 6, s - 1) })
      ])
    ]
  },
  'chart-gantt': {
    label: '甘特图',
    key: 'landscape',
    layers: [
      // A light board with three blue task bars, staggered to the right, a gap of 1 apart and
      // 2.25 in from the board's edges. One layer per bar.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(pill(3.25, 4.25, 5, 11 / 6)),
      L(pill(6, 4.25 + 17 / 6, 5, 11 / 6)),
      L(pill(9, 4.25 + 34 / 6, 3.75, 11 / 6))
    ]
  },
  'chart-candlestick': {
    label: 'K 线图',
    key: 'square',
    layers: [
      // Three candles on chart-bar's columns: a body and a wick through it, one element each;
      // the middle one is blue. One layer per candle.
      L(pill(2 + 5 / 3 - D / 2, 4, D, 8) + rr(2, 6, 10 / 3, 4.5, 1), Bt),
      L(pill(8 - D / 2, 2, D, 9) + rr(2 + 13 / 3, 4, 10 / 3, 4.5, 1)),
      L(pill(2 + 26 / 3 + 5 / 3 - D / 2, 4.5, D, 9.5) + rr(2 + 26 / 3, 6.5, 10 / 3, 4.5, 1), Bt)
    ]
  },
  presentation: {
    label: '演示',
    key: 'square',
    layers: [
      // A light board with a small blue bar chart, and one gap below it a blue leg on the
      // board's centre line. One layer per bar.
      L(rr(2, 2, 12, 8.5, M), Bt),
      L(pill(5.125, 5.5, D, 3)),
      L(pill(7.375, 4, D, 4.5)),
      L(pill(9.625, 5, D, 3.5)),
      L(rr(7, 11.5, 2, 2.5, [0, 0, 1, 1]))
    ]
  },
  'alarm-clock': {
    label: '闹钟',
    key: 'square',
    layers: [
      // clock's face, a little smaller, with two blue bells behind its upper corners; the face
      // cuts a gap of W round itself. The hands are kept 2 clear of the rim.
      L(circ(3.75, 3.75, 1.75) + circ(12.25, 3.75, 1.75)),
      L(circ(8, 8.75, 5.25), { ...Bt, gap: W }),
      L('M8 6.25V8.75', { sw: K }),
      L('M8 8.75H10', { sw: K })
    ]
  },
  password: {
    label: '密码',
    key: 'wide',
    layers: [
      // text-cursor's field with three masked characters (blue dots a gap of 1 apart) and the
      // cursor after them, 2 clear of the field's edges. One layer per dot.
      L(rr(1, 2.5, 14, 11, R), Bt),
      L(circ(4.125, 8, 0.875)),
      L(circ(6.875, 8, 0.875)),
      L(circ(9.625, 8, 0.875)),
      L('M12.25 5.25V10.75', { sw: K })
    ]
  },
  'lock-keyhole': {
    label: '锁孔',
    key: 'portrait',
    layers: [
      // lock with a keyhole (a round hole and a slot below it, one shape) in place of the slot.
      L('M4.75 7V5a3.25 3.25 0 0 1 6.5 0V7', { sw: K }),
      L(rr(2, 6.5, 12, 8.5, M), { ...Bt, gap: W }),
      L(circ(8, 10, 1.5) + rr(7.25, 10, 1.5, 3, [0, 0, 0.75, 0.75]))
    ]
  },
  pause: {
    label: '暂停',
    key: 'circle',
    layers: [
      // play's disc with two blue bars 2 wide and 1.5 apart, centred. One layer per bar.
      L(circ(8, 8, 7), Bt),
      L(rr(5.25, 5, 2, 6, 1)),
      L(rr(8.75, 5, 2, 6, 1))
    ]
  },
  stop: {
    label: '停止',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      L(rr(5.25, 5.25, 5.5, 5.5, r))
    ]
  },
  'skip-forward': {
    label: '下一首',
    key: 'circle',
    layers: [
      // play's triangle, smaller (same proportions), and a blue bar one gap past its tip; the
      // two together are centred on the disc.
      L(circ(8, 8, 7), Bt),
      L(polygon([[4.5, 5], [9.18, 8], [4.5, 11]], 1)),
      L(rr(10, 5, 1.5, 6, 0.75))
    ]
  },
  'skip-back': {
    label: '上一首',
    key: 'circle',
    layers: [
      // skip-forward mirrored.
      L(circ(8, 8, 7), Bt),
      L(polygon([[11.5, 5], [11.5, 11], [6.82, 8]], 1)),
      L(rr(4.5, 5, 1.5, 6, 0.75))
    ]
  },
  'audio-lines': {
    label: '音频波形',
    key: 'live',
    layers: [
      // Five bars 2 thick and a gap of 1 apart, centred on one line and tallest in the middle,
      // which is blue. One layer per bar, so the motion can make them bounce in turn.
      L('M2 7V9', { sw: 2, ...Bt }),
      L('M5 4.5V11.5', { sw: 2, ...Bt }),
      L('M8 2V14', { sw: 2 }),
      L('M11 4.5V11.5', { sw: 2, ...Bt }),
      L('M14 7V9', { sw: 2, ...Bt })
    ]
  },
  'picture-in-picture': {
    label: '画中画',
    key: 'landscape',
    layers: [
      // A light window with a small blue window in its lower right corner, 2.25 from both
      // nearby edges.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(rr(8.25, 8.5, 4.5, 3.25, 1))
    ]
  },
  subtitles: {
    label: '字幕',
    key: 'landscape',
    layers: [
      // A light screen with two rows of caption text near its bottom, each row two blue lines a
      // gap of 1 apart, 2.25 in from the sides and the bottom. One layer per row.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(pill(3.25, 8, 3, D) + pill(7.25, 8, 5.5, D)),
      L(pill(3.25, 10.5, 5.5, D) + pill(9.75, 10.5, 3, D))
    ]
  },
  save: {
    label: '保存',
    key: 'square',
    layers: [
      // A diskette: a light case with a blue shutter hanging from its top edge and a blue label
      // standing on its bottom edge, both clipped to the case so they follow its outline there.
      L(rr(2, 2, 12, 12, M), Bt),
      L(rr(5, 2, 5, 3.5, [0, 0, 1, 1]), { clip: rr(2, 2, 12, 12, M) }),
      L(rr(4, 8.5, 8, 5.5, [r, r, 0, 0]), { clip: rr(2, 2, 12, 12, M) })
    ]
  },
  'battery-medium': {
    label: '电量中',
    key: 'wide',
    layers: [
      // battery-full with two cells.
      L(rr(1, 2.5, 12.5, 11, R) + rr(13.5, 6, 1.5, 4, [0, 0.75, 0.75, 0]), Bt),
      L(pill(3.75, 5, D, 6)),
      L(pill(6.25, 5, D, 6))
    ]
  },
  'battery-low': {
    label: '电量低',
    key: 'wide',
    layers: [
      // battery-full with one cell.
      L(rr(1, 2.5, 12.5, 11, R) + rr(13.5, 6, 1.5, 4, [0, 0.75, 0.75, 0]), Bt),
      L(pill(3.75, 5, D, 6))
    ]
  },
  mouse: {
    label: '鼠标',
    key: 'tall',
    layers: [
      // A light mouse (a capsule 10 wide) split between its two buttons by a straight seam 1
      // wide from the top, and a blue wheel one gap below the seam's end.
      L(pill(3, 1, 10, 14), { ...Bt, cut: [C(rr(7.5, -1, 1, 4.5))] }),
      L(pill(7.25, 4.5, 1.5, 3))
    ]
  },
  tablet: {
    label: '平板',
    key: 'portrait',
    layers: [
      // phone at the wider portrait size, with the same two blue lines.
      L(rr(2, 1, 12, 14, R), Bt),
      L(pill(6.5, 3, 3, D) + pill(6, 11.75, 4, D))
    ]
  },
  usb: {
    label: 'U 盘',
    key: 'tall',
    layers: [
      // A light stick and, one gap above it, a blue connector with two square holes in it.
      L(rr(5, 1, 6, 3.5, [1, 1, 0, 0]), { cut: [C(rr(6.375, 2, 1.25, 1.25) + rr(8.375, 2, 1.25, 1.25))] }),
      L(rr(3, 5.5, 10, 9.5, M), Bt)
    ]
  },
  plug: {
    label: '插头',
    key: 'square',
    layers: [
      // Two blue prongs, one gap above a light body whose bottom corners are rounded right down,
      // and one gap below it a short blue cable on the centre line.
      L(pill(5.25, 2, 1.5, 3.5) + pill(9.25, 2, 1.5, 3.5)),
      L(rr(2, 6.5, 12, 4, [1, 1, 2, 2]), Bt),
      L(rr(7, 11.5, 2, 2.5, [0, 0, 1, 1]))
    ]
  },
  disc: {
    label: '光盘',
    key: 'circle',
    layers: [
      // A light disc with a blue hub ring (its hole white) and a short blue glint, 2 in from
      // the rim, that shows it turning.
      L(circ(8, 8, 7), Bt),
      L(circ(8, 8, 2.5), { cut: [C(circ(8, 8, 1))] }),
      L('M3.75 8A4.25 4.25 0 0 1 8 3.75', { sw: D })
    ]
  },
  speaker: {
    label: '音箱',
    key: 'portrait',
    layers: [
      // A light cabinet with a small blue tweeter and a large blue woofer on its centre line,
      // 2.25 in from the top and the bottom.
      L(rr(2, 1, 12, 14, M), Bt),
      L(circ(8, 4.5, 1.25)),
      L(circ(8, 10, 2.75))
    ]
  },
  router: {
    label: '路由器',
    key: 'landscape',
    layers: [
      // Two blue antennas one gap above a light box with three blue lights, 2.25 in from its
      // left and bottom edges. One layer per light.
      L(pill(3.5, 2, 1.5, 4.5) + pill(11, 2, 1.5, 4.5)),
      L(rr(1, 7.5, 14, 6.5, M), Bt),
      L(circ(4, 11, 0.75)),
      L(circ(6.5, 11, 0.75)),
      L(circ(9, 11, 0.75))
    ]
  },
  banknote: {
    label: '纸币',
    key: 'wide',
    layers: [
      // A light note with a blue round mark in the middle and a blue dot towards each end.
      L(rr(1, 2.5, 14, 11, R), Bt),
      L(circ(8, 8, 2.5)),
      L(circ(4, 8, 0.75) + circ(12, 8, 0.75))
    ]
  },
  meh: {
    label: '一般',
    key: 'circle',
    layers: [
      // smile with a straight mouth.
      L(circ(8, 8, 7), Bt),
      L(pill(5.375, 5.25, D, 2) + pill(9.375, 5.25, D, 2)),
      L('M5.75 10.5H10.25', { sw: D })
    ]
  },
  frown: {
    label: '难过',
    key: 'circle',
    layers: [
      // smile with the mouth turned over.
      L(circ(8, 8, 7), Bt),
      L(pill(5.375, 5.25, D, 2) + pill(9.375, 5.25, D, 2)),
      L('M5.5 11.5a2.5 2.5 0 0 1 5 0', { sw: D })
    ]
  },
  laugh: {
    label: '大笑',
    key: 'circle',
    layers: [
      // smile with the mouth wide open: a blue half disc.
      L(circ(8, 8, 7), Bt),
      L(pill(5.375, 5.25, D, 2) + pill(9.375, 5.25, D, 2)),
      L('M5.25 9H10.75A2.75 2.75 0 0 1 5.25 9Z', { sw: D })
    ]
  },
  terminal: {
    label: '终端',
    key: 'landscape',
    layers: [
      // A light window with a blue prompt (a chevron, the allowed 45°) and a cursor line on its
      // baseline; the prompt sits 2.25 in from the left.
      L(rr(1, 2, 14, 12, R3), Bt),
      L('M4 6L6 8L4 10', { sw: K }),
      L(pill(7.5, 9.375, 4, D))
    ]
  },
  code: {
    label: '代码',
    key: 'square',
    layers: [
      // type's tile with a pair of blue angle brackets (45°), a gap of 1 apart. One layer each.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M6.75 6L4.75 8L6.75 10', { sw: K }),
      L('M9.25 6L11.25 8L9.25 10', { sw: K })
    ]
  },
  brackets: {
    label: '方括号',
    key: 'square',
    layers: [
      // type's tile with a pair of blue square brackets, 2.25 in from its edges. One layer each.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M6.5 5H5V11H6.5', { sw: K }),
      L('M9.5 5H11V11H9.5', { sw: K })
    ]
  },
  umbrella: {
    label: '雨伞',
    key: 'square',
    layers: [
      // A light canopy (a half disc whose two corners are rounded at 0.75) and, one gap below it,
      // a blue handle on its centre line ending in a hook.
      L('M2.804 8A0.75 0.75 0 0 1 2.062 7.143A6 6 0 0 1 13.938 7.143A0.75 0.75 0 0 1 13.196 8Z', Bt),
      L('M8 9.75V12A1.25 1.25 0 0 1 5.5 12', { sw: K })
    ]
  },
  'cloud-rain': {
    label: '下雨',
    key: 'wide',
    layers: [
      // cloud-upload's cloud, lower and smaller, with three blue drops one gap below it. One
      // layer per drop.
      L(pill(1, 4.5, 14, 5) + circ(8.5, 5.5, 3), Bt),
      L(pill(3.875, 10.5, D, 3)),
      L(pill(7.375, 10.5, D, 3)),
      L(pill(10.875, 10.5, D, 3))
    ]
  },
  'cloud-snow': {
    label: '下雪',
    key: 'wide',
    layers: [
      // cloud-rain's cloud with blue flakes (dots) instead of drops. One layer per flake.
      L(pill(1, 4.5, 14, 5) + circ(8.5, 5.5, 3), Bt),
      L(circ(4.5, 11.375, 0.875)),
      L(circ(8, 12.625, 0.875)),
      L(circ(11.5, 11.375, 0.875))
    ]
  },
  backpack: {
    label: '书包',
    key: 'portrait',
    layers: [
      // A blue carry loop behind a light bag with a round top, which cuts a gap of W round itself;
      // a blue front pocket 2.25 in from the bag's sides and bottom.
      L('M6 4.5V3.25A1.5 1.5 0 0 1 7.5 1.75H8.5A1.5 1.5 0 0 1 10 3.25V4.5', { sw: K }),
      L(rr(2, 3.5, 12, 11.5, [5, 5, M, M]), { ...Bt, gap: W }),
      L(rr(4.25, 9.5, 7.5, 3.25, r))
    ]
  },
  'user-round': {
    label: '头像',
    key: 'circle',
    layers: [
      // An avatar: a light disc with a blue head and, one gap below it, blue shoulders clipped to
      // the disc so they follow its rim.
      L(circ(8, 8, 7), Bt),
      L(circ(8, 6.25, 2.5)),
      L(rr(3, 9.75, 10, 8, [5, 5, 0, 0]), { clip: circ(8, 8, 7) })
    ]
  },
  images: {
    label: '照片',
    key: 'landscape',
    layers: [
      // Two photos drawn like copy: a blue one behind at the top right, and in front a light one
      // with image's hill and sun, cutting a gap of W round itself and covering a third of it.
      L(rr(5.5, 2, 9.5, 8, M)),
      L(rr(1, 5.5, 10, 8.5, M), { ...Bt, gap: W }),
      L(circ(4.5, 17.5, 5.5), { clip: rr(1, 5.5, 10, 8.5, M) }),
      L(circ(7.625, 8.875, 1.125))
    ]
  },
  playlist: {
    label: '播放列表',
    key: 'wide',
    layers: [
      // menu's light bars, the lower two shortened to make room for play's blue triangle at the
      // bottom right (its tip drawn past the keyline so the rounded tip lands on it).
      L('M2 3.5H14', { sw: 2, ...Bt }),
      L('M2 8H9', { sw: 2, ...Bt }),
      L('M2 12.5H8.875', { sw: 2, ...Bt }),
      L(polygon([[10.75, 7.1], [15.6, 10.5], [10.75, 13.9]], 1))
    ]
  },
  'id-badge': {
    label: '工牌',
    key: 'portrait',
    layers: [
      // A light card hanging from a blue clip that crosses its top edge (as clipboard's), with
      // a small blue person on it: a head and, one gap below, shoulders.
      L(rr(2, 3, 12, 12, M), Bt),
      L(rr(5.5, 1, 5, 3.5, 1), { gap: W }),
      L(circ(8, 7.75, 1.5)),
      L(rr(5.25, 10.25, 5.5, 2.5, [2.75, 2.75, 0.75, 0.75]))
    ]
  },
  radio: {
    label: '收音机',
    key: 'landscape',
    layers: [
      // A blue antenna one gap above a light set with a blue speaker on the left and two blue
      // tuning lines on the right, each 2 to 2.25 in from the nearby edges.
      L(pill(11.5, 2, 1.5, 3)),
      L(rr(1, 6, 14, 8, M), Bt),
      L(circ(5, 10, 2)),
      L(pill(9, 8.25, 3.75, D) + pill(9, 10.5, 3.75, D))
    ]
  },
  star: {
    label: '星标',
    key: 'circle',
    layers: [
      // The five points are the star (GUIDE §1, slopes and points): every corner rounded at 0.5.
      // A true star is wider than tall, so it is drawn 6% taller to fill the circle; the tips
      // sit past the keyline so the rounded tips land on it. A small blue star on its face.
      L(polygon(starPts(8, 8.69, 7.88, 4.07, 1.058), 0.5), Bt),
      L(polygon(starPts(8, 8.69, 3.5, 1.8, 1.058), 0.5))
    ]
  },
  send: {
    label: '发送',
    key: 'square',
    layers: [
      // A paper plane: two triangular wings folded along a 45° line, mirror images of each other.
      // The lower wing is the body clipped in blue. The tips sit past the box so the rounded tips
      // (0.75) land on it.
      L(polygon([[0.45, 6], [14.45, 1.55], [10, 15.55], [7.4, 8.6]], [0.75, 0.75, 0.75, 0.5]), Bt),
      L(polygon([[0.45, 6], [14.45, 1.55], [10, 15.55], [7.4, 8.6]], [0.75, 0.75, 0.75, 0.5]), { clip: polygon([[21, -5], [21, 21], [-5, 21]]) })
    ]
  },
  moon: {
    label: '月亮',
    key: 'circle',
    layers: [
      // A crescent: the disc less a disc to the upper right, the two tips rounded at 0.5 by circles
      // touching both edges (only circles and arcs). A short blue glint, as heart's.
      L(crescent(7, 10.72, 5.28, 4.75), Bt),
      L('M3.75 9.5A4.5 4.5 0 0 0 6.5 12.25', { sw: D })
    ]
  },
  map: {
    label: '地图',
    key: 'landscape',
    layers: [
      // A folded map: three panels whose top and bottom edges zigzag at the folds (the slopes),
      // the middle panel in blue. One layer per panel so the motion can unfold the outer two.
      L(MAP, { ...Bt, clip: rr(0, 0, 5.667, 16) }),
      L(MAP, { clip: rr(5.667, 0, 4.667, 16) }),
      L(MAP, { ...Bt, clip: rr(10.333, 0, 5.667, 16) })
    ]
  },
  trophy: {
    label: '奖杯',
    key: 'square',
    layers: [
      // A cup that tapers down to its stem with two slopes (a round-bottomed cup with handles read
      // as headphones), blue handles behind it cut by its gap, and a blue stem and foot one gap below.
      L('M5.5 3H4.5A1.75 1.75 0 0 0 4.5 6.5H5.5M10.5 3H11.5A1.75 1.75 0 0 1 11.5 6.5H10.5', { sw: K }),
      L(polygon([[4.5, 2], [11.5, 2], [11.5, 5.5], [9, 9.75], [7, 9.75], [4.5, 5.5]], [1, 1, 2, 1, 1, 2]), { ...Bt, gap: W }),
      L(body(4.5, 12.25, 7, 1.75, t, [{ x: 7.25, w: 1.5, h: 1.5, c: 0.5 }]))
    ]
  },
  'cloud-lightning': {
    label: '雷电',
    key: 'wide',
    layers: [
      // cloud-rain's cloud and a blue bolt over its lower edge, cutting a gap of W round itself. The
      // bolt's zigzag and point need slopes; its tip sits past the keyline.
      L(pill(1, 4.5, 14, 5) + circ(8.5, 5.5, 3), Bt),
      L(polygon([[8.5, 7], [11.25, 7], [9.75, 9.75], [11.5, 9.75], [7.25, 15.3], [8.25, 11.25], [6.25, 11.25]], [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]), { gap: W })
    ]
  },
  'triangle-alert': {
    label: '警告',
    key: 'landscape',
    layers: [
      // A warning sign: a triangle (the slopes) with corners rounded at 2, drawn past the keyline so
      // the rounded corners land on it, and circle-alert's exclamation mark.
      L(polygon([[8, 0], [16.4, 14], [-0.4, 14]], 2), Bt),
      L('M8 6V8.5', { sw: K }),
      L(circ(8, 11.375, 1.125))
    ]
  },
  navigation: {
    label: '导航',
    key: 'tall',
    layers: [
      // The navigation arrow: two slopes meet in a point, with a notch at the foot; the right half
      // in blue. Tip and feet sit past the keyline.
      L(polygon([[8, -0.5], [13.8, 16.2], [8, 12.25], [2.2, 16.2]], [0.75, 0.75, 0.5, 0.75]), Bt),
      L(polygon([[8, -0.5], [13.8, 16.2], [8, 12.25], [2.2, 16.2]], [0.75, 0.75, 0.5, 0.75]), { clip: rr(8, 0, 8, 16) })
    ]
  },
  compass: {
    label: '指南针',
    key: 'circle',
    layers: [
      // A light dial and a blue needle pointing north: a diamond whose two points need slopes,
      // with a white pivot hole.
      L(circ(8, 8, 7), Bt),
      L(polygon([[8, 2.4], [10.25, 8], [8, 13.6], [5.75, 8]], [0.5, 0.75, 0.5, 0.75]), { cut: [C(circ(8, 8, 0.75))] })
    ]
  },
  sparkles: {
    label: '智能生成',
    key: 'square',
    layers: [
      // The badge's sparkle at two sizes: a large light one and, one gap away, a small blue one.
      L(sparkleAt(6.78, 9.22, 5, 0.75), Bt),
      L(sparkleAt(11.75, 4.25, 2.25))
    ]
  },
  droplet: {
    label: '水滴',
    key: 'tall',
    layers: [
      // A circle with two straight sides running up to a point rounded at 0.75, and a short blue
      // glint as lightbulb's.
      L(dropPath(10, 5, 0.2, 0.75), Bt),
      L('M5.25 10A2.75 2.75 0 0 0 8 12.75', { sw: D })
    ]
  },
  hourglass: {
    label: '沙漏',
    key: 'portrait',
    layers: [
      // Blue end plates one gap from a light glass whose bulbs taper to a waist 2.5 wide (the
      // slopes); the sand at the bottom is the glass clipped in blue.
      L(rr(2, 1, 12, 1.5, 0.5) + rr(2, 13.5, 12, 1.5, 0.5)),
      L(GLASS, Bt),
      L(GLASS, { clip: rr(0, 10.5, 16, 3) })
    ]
  },
  'battery-charging': {
    label: '充电中',
    key: 'wide',
    layers: [
      // battery-full's light body with a blue bolt printed on it: the bolt's zigzag and point
      // need slopes. Its points are rounded at 0.5 and it keeps 2 in from the edges.
      L(rr(1, 2.5, 12.5, 11, R) + rr(13.5, 6, 1.5, 4, [0, 0.75, 0.75, 0]), Bt),
      L(polygon([[9.25, 3.6], [8.5, 7], [10.5, 7], [5.25, 12.4], [6, 9], [4, 9]], 0.5))
    ]
  },
  'moon-star': {
    label: '星月',
    key: 'circle',
    layers: [
      // moon's crescent with the badge's sparkle in its bite, one gap from the inner edge.
      L(crescent(7, 10.72, 5.28, 4.75), Bt),
      L(sparkleAt(10.75, 5.25, 3.9))
    ]
  },
  tag: {
    label: '标签',
    key: 'wide',
    layers: [
      // A price tag: a light card whose left end comes to a point (two slopes), rounded at 1.5, and
      // a blue eyelet on the centre line. The point sits past the keyline.
      L(polygon([[0.5, 8], [5, 2.5], [15, 2.5], [15, 13.5], [5, 13.5]], [1.5, 1.5, R, R, 1.5]), Bt),
      L(circ(5.5, 8, 1.25))
    ]
  },
  megaphone: {
    label: '喇叭',
    key: 'landscape',
    layers: [
      // A light horn widening to the right (two slopes), a blue mouthpiece and a blue rim, each one
      // gap from the horn.
      L(rr(1, 5.25, 2, 5.5, [r, 0.5, 0.5, r])),
      L(polygon([[4, 5.25], [12, 2], [12, 14], [4, 10.75]], [0.5, 1, 1, 0.5]), Bt),
      L(pill(13, 2, 2, 12))
    ]
  },
  crown: {
    label: '皇冠',
    key: 'landscape',
    layers: [
      // A light crown whose top rises to three points (slopes) and a blue band one gap below. The
      // points sit past the keyline so the rounded tips land on it.
      L(polygon([[0.3, 3.6], [5, 7], [8, 1.2], [11, 7], [15.7, 3.6], [13.25, 11.25], [2.75, 11.25]], [0.75, 0.5, 0.75, 0.5, 0.75, 1, 1]), Bt),
      L(rr(2.75, 12.25, 10.5, 1.75, 0.75))
    ]
  },
  gem: {
    label: '宝石',
    key: 'landscape',
    layers: [
      // A cut gem: a flat table, the widest point at the girdle, and sides running down to a point
      // (the slopes). The crown above the girdle is the gem clipped in blue.
      L(GEM, Bt),
      L(GEM, { clip: rr(0, 0, 16, 5.75) })
    ]
  },
  plane: {
    label: '飞机',
    key: 'square',
    layers: [
      // A plane seen from above in one outline: a light fuselage and swept wings and tail (the
      // slopes) in blue, clipped from the same outline as map's panels. With a blue fuselage and
      // light wings, the thin wings dropped out at 16px.
      L(PLANE, Bt),
      L(PLANE, { clip: rr(0, 0, 6.75, 16) + rr(9.25, 0, 6.75, 16) })
    ]
  },
  'flag-triangle': {
    label: '三角旗',
    key: 'portrait',
    layers: [
      // flag's blue pole and, one gap away, a light pennant that narrows to a point (the slopes).
      L(pill(2, 1, K, 14)),
      L(polygon([[4.5, 1], [15.43, 5.25], [4.5, 9.5]], [S, 0.75, S]), Bt)
    ]
  },
  'traffic-cone': {
    label: '路障',
    key: 'portrait',
    layers: [
      // A light cone that widens to the base (the slopes) with a blue stripe printed across it, and
      // a blue base one gap below.
      L(CONE, Bt),
      L(CONE, { clip: rr(0, 6, 16, 2.5) }),
      L(rr(2, 13, 12, 2, t))
    ]
  },
  award: {
    label: '奖章',
    key: 'tall',
    layers: [
      // A light rosette in front of two blue ribbon tails, cutting a gap of W round itself; each
      // tail ends in a V notch (the slopes). A blue centre on the rosette.
      L(polygon([[4.25, 8], [7.25, 8], [7.25, 15.8], [5.75, 14.2], [4.25, 15.8]], [0, 0, 0.5, 0.5, 0.5]) +
        polygon([[8.75, 8], [11.75, 8], [11.75, 15.8], [10.25, 14.2], [8.75, 15.8]], [0, 0, 0.5, 0.5, 0.5])),
      L(circ(8, 6, 5), { ...Bt, gap: W }),
      L(circ(8, 6, 2.25))
    ]
  },
  'mouse-pointer-click': {
    label: '点击',
    key: 'square',
    layers: [
      // A light pointer (two slopes meeting in a point, notched at the back) and a blue click ripple:
      // a quarter arc round its tip. Separate click lines read as an arrow aimed at the pointer.
      L(polygon([[5.4, 5.4], [15.35, 9.5], [11.1, 11.1], [9.5, 15.35]], [1, 0.75, 0.5, 0.75]), Bt),
      L('M2.6 5.8A3.2 3.2 0 0 1 5.8 2.6', { sw: D })
    ]
  },
  'star-half': {
    label: '半星评分',
    key: 'circle',
    layers: [
      // star's outline, its left half in blue (clipped from the same outline): half a rating.
      L(polygon(starPts(8, 8.69, 7.88, 4.07, 1.058), 0.5), Bt),
      L(polygon(starPts(8, 8.69, 7.88, 4.07, 1.058), 0.5), { clip: rr(0, 0, 8, 16) })
    ]
  },
  'trending-up': {
    label: '上涨',
    key: 'square',
    layers: [
      // bold's light tile with a blue line that zigzags up at 45° and ends in an arrowhead
      // corner. The line and its head are separate layers so the head can follow the line.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M4.25 10L7.25 7L9 8.75L11.75 6', { sw: K }),
      L('M9.25 6H11.75V8.5', { sw: K })
    ]
  },
  'trending-down': {
    label: '下跌',
    key: 'square',
    layers: [
      // trending-up turned upside down: the line zigzags down to the arrowhead.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M4.25 6L7.25 9L9 7.25L11.75 10', { sw: K }),
      L('M9.25 10H11.75V7.5', { sw: K })
    ]
  },
  'chart-line': {
    label: '折线图',
    key: 'square',
    layers: [
      // A light tile and a blue line through four points at different slopes (a line chart
      // needs them; a 45° zigzag would read as trending-up).
      L(rr(2, 2, 12, 12, R), Bt),
      L('M4.5 10.75L6.75 7.25L9.25 9.25L11.5 5.25', { sw: K })
    ]
  },
  'chart-area': {
    label: '面积图',
    key: 'square',
    layers: [
      // Two stacked areas on one baseline, their tops running up and down (slopes): the back one
      // blue, the front one light, cutting a gap of W along its top.
      L(polygon([[2, 7.25], [6, 3.75], [9.5, 6.25], [14, 0.15], [14, 14], [2, 14]], [r, 1, 1, 1, r, r])),
      L(polygon([[2, 10.25], [6, 7.25], [9.5, 9.5], [14, 6], [14, 14], [2, 14]], [r, 1, 1, r, r, r]), { ...Bt, gap: W })
    ]
  },
  activity: {
    label: '动态',
    key: 'square',
    layers: [
      // A light tile with a blue pulse line: flat, a sharp rise and fall, flat again. The peaks
      // need slopes; the line keeps 2 in from the tile's edges.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M4.75 8H6L7 5.25L9 10.75L10 8H11.25', { sw: K })
    ]
  },
  'fast-forward': {
    label: '快进',
    key: 'circle',
    layers: [
      // Two of play's triangles in a row, one gap apart, centred on the disc.
      L(circ(8, 8, 7), Bt),
      L(polygon([[4, 5.25], [7.5, 8], [4, 10.75]], 0.75)),
      L(polygon([[8.5, 5.25], [12, 8], [8.5, 10.75]], 0.75))
    ]
  },
  rewind: {
    label: '快退',
    key: 'circle',
    layers: [
      // fast-forward turned round.
      L(circ(8, 8, 7), Bt),
      L(polygon([[12, 5.25], [12, 10.75], [8.5, 8]], 0.75)),
      L(polygon([[7.5, 5.25], [7.5, 10.75], [4, 8]], 0.75))
    ]
  },
  eject: {
    label: '弹出',
    key: 'circle',
    layers: [
      // A blue triangle pointing up and, one gap below, a blue bar of the same width, centred on
      // the disc.
      L(circ(8, 8, 7), Bt),
      L(polygon([[8, 4.1], [11.25, 8.25], [4.75, 8.25]], 1)),
      L(rr(4.75, 9.25, 6.5, 1.5, 0.75))
    ]
  },
  italic: {
    label: '斜体',
    key: 'square',
    layers: [
      // bold's tile with a slanted I: two serifs and a stem leaning right (the slope is what
      // makes it italic), in one stroke.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M7.25 4.5H10.5M5.5 11.5H8.75M8.875 4.5L7.125 11.5', { sw: K })
    ]
  },
  'chart-funnel': {
    label: '漏斗图',
    key: 'square',
    layers: [
      // A funnel narrowing downward (the slopes), cut straight into three bands a gap of 1
      // apart; the middle band is blue. One layer per band, so the motion can fill them in turn.
      L(FUNNEL, { ...Bt, clip: rr(0, 0, 16, 5.33) }),
      L(FUNNEL, { clip: rr(0, 6.33, 16, 3.34) }),
      L(FUNNEL, { ...Bt, clip: rr(0, 10.67, 16, 6) })
    ]
  },
  'chart-radar': {
    label: '雷达图',
    key: 'circle',
    layers: [
      // A light pentagon (the slopes) and a blue data shape inside it, its corners at different
      // distances along the pentagon's spokes. Drawn 5% taller to fill the circle, as star.
      L(polygon(RADAR([1, 1, 1, 1, 1], 7.36), 1), Bt),
      L(polygon(RADAR([0.62, 0.66, 0.42, 0.56, 0.38], 7.36), 0.5))
    ]
  },
  'sticky-note': {
    label: '便签',
    key: 'square',
    layers: [
      // A light note with its lower right corner folded over: the fold is a 45° cut, and the flap
      // is the note clipped in blue below and right of the fold. Two blue lines, one layer each.
      L(NOTE, Bt),
      L(NOTE, { clip: rr(10, 10, 6, 6, [1, 0, 0, 0]) }),
      L('M5 5.5H11', { sw: D }),
      L('M5 8.25H8.5', { sw: D })
    ]
  },
  gauge: {
    label: '仪表',
    key: 'circle',
    layers: [
      // A light dial, three blue tick dots along its upper arc, and a blue needle that tapers to
      // a point (slopes) from a round hub below the centre.
      L(circ(8, 8, 7), Bt),
      L([-150, -90, -30].map((a) => circ(f3(8 + 4.75 * Math.cos((a * Math.PI) / 180)), f3(9 + 4.75 * Math.sin((a * Math.PI) / 180)), 0.75)).join('')),
      L(circ(8, 9, 1.75) + polygon(AXIS(8, 9, -60, -0.5, 4.25, 2.5, [0, 0.5, 0], true), 0))
    ]
  },
  eraser: {
    label: '橡皮擦',
    key: 'square',
    layers: [
      // An eraser laid at 45°, as pencil: a blue rubber end and a light sleeve, cut straight
      // across by a gap of 1.
      L(polygon(AXIS(8, 8, -45, -6.9, -2.25, 5), [r, 0, 0, r])),
      L(polygon(AXIS(8, 8, -45, -1.25, 6.9, 5), [0, r, r, 0]), Bt)
    ]
  },
  wand: {
    label: '魔法棒',
    key: 'square',
    layers: [
      // A light stick laid at 45° with a blue tip printed on it, and the badge's sparkle one gap
      // past the tip.
      L(polygon(AXIS(8, 8, -45, -8.1, 1.66, 2.75), 1.375), Bt),
      L(polygon(AXIS(8, 8, -45, -8.1, 1.66, 2.75), 1.375), { clip: polygon(AXIS(8, 8, -45, -1.5, 4, 6)) }),
      L(sparkleAt(11, 5, 3))
    ]
  },
  shapes: {
    label: '形状',
    key: 'square',
    layers: [
      // A blue triangle (the slopes) over a light circle and a light square, each one gap from
      // the others.
      L(polygon([[8, 1.42], [13.25, 7.5], [2.75, 7.5]], 1)),
      L(circ(4.75, 11.25, 2.75), Bt),
      L(rr(8.5, 8.5, 5.5, 5.5, r), Bt)
    ]
  }
};

// Variants (GUIDE.md section 12): the same object with one badge. A mark on the face replaces the
// object's own detail; a corner mark notches the object; 'off' crosses it out.
Object.assign(ICONS, {
  'folder-plus': badge(ICONS.folder, 'plus', { at: [8, 9], drop: [0, 2], label: '新建文件夹' }),
  'calendar-check': badge(ICONS.calendar, 'check', { at: [8, 9.75], drop: [1], label: '已排期' }),
  'clipboard-check': badge(ICONS.clipboard, 'check', { at: [8, 9.5], drop: [2, 3], label: '任务完成' }),
  'user-check': badge(ICONS.user, 'check', { label: '已认证用户' }),
  'search-sparkle': badge(ICONS.search, 'sparkle', { drop: [2], label: 'AI 搜索' }),
  'image-sparkle': badge(ICONS.image, 'sparkle', { drop: [2], label: 'AI 生成图片' }),
  'bell-off': badge(ICONS.bell, 'off', { label: '免打扰' }),
  'eye-off': badge(ICONS.eye, 'off', { label: '隐藏' }),
  'zoom-in': badge(ICONS.search, 'plus', { at: [6.75, 6.75], drop: [2], label: '放大' }),
  'zoom-out': badge(ICONS.search, 'minus', { at: [6.75, 6.75], drop: [2], label: '缩小' }),
  unlink: badge(ICONS.link, 'off', { label: '取消链接' })
});

// Batch: remaining functional categories
// The sheet shared by the file types: file-text's light page, with the type printed in blue.
const SHEET = rr(2, 1, 12, 14, M);
// The sound waves either side of bell-ring's dome: arcs about the dome's centre (8, 8), one gap
// out, from 33° to 57° above the level, so they reach the keyline at the top and the side.
const ringArc = (side) => {
  const p = (deg) => { const a = (deg * Math.PI) / 180; return `${f3(8 + side * 6.25 * Math.cos(a))} ${f3(8 - 6.25 * Math.sin(a))}`; };
  return side < 0 ? `M${p(33)}A6.25 6.25 0 0 1 ${p(57)}` : `M${p(57)}A6.25 6.25 0 0 1 ${p(33)}`;
};
// A quotation mark centred at x: a disc and, rising from its left side, a tail that curves over
// to the right (a circular arc), so the two make a 6.
const quoteTail = (cx) => `M${cx - 0.75} 9.25A3.5 3.5 0 0 1 ${cx + 0.75} 5.25`;
Object.assign(ICONS, {
  'external-link': {
    label: '外部链接',
    key: 'square',
    layers: [
      // A light box and a blue arrow leaving it at 45° from its centre to the upper right. The
      // head is a right-angled corner whose legs run along the grid (the allowed 45° arrow head);
      // the arrow cuts a gap of W where it crosses the box, as share's does. The head's side
      // corners are the small arrow's 0.5, or the head rounds off into a pen. The box is sized so
      // its corner stays one gap from the head, and the shaft starts at its centre.
      L(rr(2, 4.48, 9.52, 9.52, R), Bt),
      L('M6.76 9.24L12 4', { sw: K, gap: W, part: 'arrow' }),
      L(polygon([[9, 2], [14, 2], [14, 7]], [0.5, 1, 0.5]), { gap: W, part: 'arrow' })
    ]
  },
  ban: {
    label: '禁止',
    key: 'circle',
    layers: [
      // A light disc struck through by one blue slash at 45° (the cross's slope), as circle-x's
      // strokes but only the one from the upper left.
      L(circ(8, 8, 7), Bt),
      L('M4.75 4.75L11.25 11.25', { sw: K })
    ]
  },
  sort: {
    label: '排序',
    key: 'wide',
    layers: [
      // menu's light bars getting shorter from top to bottom, and a blue arrow pointing down on
      // the right, one gap from the longest bar. One layer per bar, so the motion can lay them
      // out in order.
      L('M2 3.5H9.75', { sw: 2, ...Bt }),
      L('M2 8H7.25', { sw: 2, ...Bt }),
      L('M2 12.5H4.75', { sw: 2, ...Bt }),
      L('M12.5 3.25V12.75M10.75 11L12.5 12.75L14.25 11', { sw: K })
    ]
  },
  'list-checks': {
    label: '任务清单',
    key: 'landscape',
    layers: [
      // Two rows of list: a blue check (circle-check's, the allowed 45°) and a light bar one gap
      // to its right. One layer per check, so the motion can tick them off in turn.
      L('M1.75 4L3.75 6L7 2.75', { sw: K }),
      L('M1.75 11.25L3.75 13.25L7 10', { sw: K }),
      L(pill(8.28, 3.125, 6.72, 2.5) + pill(8.28, 10.375, 6.72, 2.5), Bt)
    ]
  },
  strikethrough: {
    label: '删除线',
    key: 'square',
    layers: [
      // underline's tile with a blue S built from two circular arcs (half-turns of radius 1.625),
      // and a line through its middle. Letter and line are one element, so they share a part.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M9.407 5.563A1.625 1.625 0 1 0 8 8A1.625 1.625 0 1 1 6.593 10.438', { sw: K, part: 'glyph' }),
      L('M4.75 8H11.25', { sw: K, part: 'glyph' })
    ]
  },
  quote: {
    label: '引用',
    key: 'square',
    layers: [
      // code's tile with a pair of blue quotation marks: each a disc with a tail curving up out
      // of its left side. Disc and tail are one element (one part); one part per mark.
      L(rr(2, 2, 12, 12, R), Bt),
      L(circ(5.75, 9.25, 1.5), { part: 'q0' }),
      L(quoteTail(5.75), { sw: K, part: 'q0' }),
      L(circ(10.25, 9.25, 1.5), { part: 'q1' }),
      L(quoteTail(10.25), { sw: K, part: 'q1' })
    ]
  },
  'bell-ring': {
    label: '响铃提醒',
    key: 'square',
    layers: [
      // bell with a smaller dome (radius 4.5), so two blue sound waves fit at its upper corners,
      // one gap out from the dome and concentric with it. Knob and clapper as bell's.
      L('M3.5 10.5V8a4.5 4.5 0 0 1 9 0V10.5Z' + pill(2.5, 9.75, 11, 1.5), Bt),
      L(circ(8, 3.75, 1.25) + rr(6.25, 12.25, 3.5, 1.75, [0.5, 0.5, 1.75, 1.75]), { gap: W }),
      L(ringArc(-1) + ringArc(1), { sw: K })
    ]
  },
  'file-code': {
    label: '代码文件',
    key: 'portrait',
    layers: [
      // file-text's sheet with code's pair of angle brackets centred on it.
      L(SHEET, Bt),
      L('M6.75 6L4.75 8L6.75 10', { sw: K }),
      L('M9.25 6L11.25 8L9.25 10', { sw: K })
    ]
  },
  'file-image': {
    label: '图片文件',
    key: 'portrait',
    layers: [
      // file-text's sheet holding image's picture: a blue hill rising from the bottom edge
      // (clipped to the sheet) and a sun 2.25 in from the right edge. The hill's top sits well
      // left of the sun; under it, a sun over a centred hill reads as a head and shoulders.
      L(SHEET, Bt),
      L(circ(4.5, 18, 8), { clip: SHEET }),
      L(circ(10.5, 5.5, 1.25))
    ]
  },
  'file-chart': {
    label: '报表文件',
    key: 'portrait',
    layers: [
      // file-text's sheet with three blue bars standing on one baseline, a gap of 1 apart; the
      // middle one is the tallest. One layer per bar, so they can grow in turn.
      L(SHEET, Bt),
      L(rr(4.75, 8, 1.5, 4, [0.75, 0.75, 0, 0])),
      L(rr(7.25, 5, 1.5, 7, [0.75, 0.75, 0, 0])),
      L(rr(9.75, 6.75, 1.5, 5.25, [0.75, 0.75, 0, 0]))
    ]
  },
  'file-video': {
    label: '视频文件',
    key: 'portrait',
    layers: [
      // file-text's sheet with play's triangle (width 0.78 of its height), centred by its centroid.
      L(SHEET, Bt),
      L(polygon([[6.7, 5.5], [10.6, 8], [6.7, 10.5]], 1))
    ]
  },
  'file-audio': {
    label: '音频文件',
    key: 'portrait',
    layers: [
      // file-text's sheet with a blue note: a round head, and a stem rising from its right side
      // that turns right into a short flag. Head and stem are one element.
      L(SHEET, Bt),
      L(circ(6.75, 10.25, 1.75), { part: 'note' }),
      L('M7.75 10.25V5H10.5', { sw: K, part: 'note' })
    ]
  }
});

// Group 2 of the same batch.
// file-spreadsheet's table: one blue block on the sheet cut by straight seams 1 wide into two
// columns and three rows (as table cuts the sheet), one layer per row.
const SHEET_TABLE = (y) => L(rr(4.5, 4.75, 7, 6.5, 1), { clip: rr(0, y, 16, 1.5), cut: [C(rr(7.5, 0, 1, 16))] });
Object.assign(ICONS, {
  'file-spreadsheet': {
    label: '表格文件',
    key: 'portrait',
    layers: [L(SHEET, Bt), SHEET_TABLE(4.75), SHEET_TABLE(7.25), SHEET_TABLE(9.75)]
  },
  'file-archive': {
    label: '压缩文件',
    key: 'portrait',
    layers: [
      // file-text's sheet with a zip: blue teeth hanging from the top edge, alternating either
      // side of the centre line, and one gap below them a pull with a hole.
      L(SHEET, Bt),
      L(rr(6.75, 1, 1.25, 1.25) + rr(8, 2.25, 1.25, 1.25) + rr(6.75, 3.5, 1.25, 1.25) + rr(8, 4.75, 1.25, 1.25)),
      L(rr(6.25, 7, 3.5, 4.5, 1), { cut: [C(pill(7.375, 8.75, 1.25, 1.5))] })
    ]
  },
  newspaper: {
    label: '报纸',
    key: 'landscape',
    layers: [
      // A light page: a blue headline across the top, and under it a picture block on the left
      // with two lines of text beside it. One layer per text line, so they can be printed in turn.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(pill(3.5, 4.5, 9, D)),
      L(rr(3.5, 7.25, 3.5, 4.25, 1)),
      L(pill(8, 7.75, 4.5, D)),
      L(pill(8, 10.25, 3, D))
    ]
  },
  'filing-cabinet': {
    label: '文件柜',
    key: 'portrait',
    layers: [
      // A light cabinet cut straight across into two drawers by a gap of 1 (as server's rack
      // units, standing up), each with a blue handle on its centre.
      L(rr(2, 1, 12, 6.5, [M, M, 0, 0]), Bt),
      L(rr(2, 8.5, 12, 6.5, [0, 0, M, M]), Bt),
      L(pill(6, 3.625, 4, D)),
      L(pill(6, 11.125, 4, D))
    ]
  },
  'git-commit': {
    label: '提交',
    key: 'flat',
    layers: [
      // A blue line through a light node (a disc filling the height) that cuts a gap of W out of
      // it; a blue dot is printed on the node's centre.
      L('M1.75 8H14.25', { sw: K }),
      L(circ(8, 8, 4), { ...Bt, gap: W }),
      L(circ(8, 8, 1.75))
    ]
  },
  'git-branch': {
    label: '分支',
    key: 'square',
    layers: [
      // Light lines and blue nodes that cut a gap of W out of them: a trunk between two nodes on
      // the left, and a branch that leaves it at the bottom node and bends up to a node on the
      // right. Trunk and branch are one element (one part); the branch is drawn from the trunk
      // outward. Small nodes keep the blue under 60%.
      L('M3.5 3.5V12.5', { sw: 2, ...Bt, part: 'lines' }),
      L('M3.5 12.5H6A6.5 6.5 0 0 0 12.5 6V3.5', { sw: 2, ...Bt, part: 'lines' }),
      L(circ(3.5, 3.5, 1.5) + circ(3.5, 12.5, 1.5), { gap: W }),
      L(circ(12.5, 3.5, 1.5), { gap: W })
    ]
  },
  'git-merge': {
    label: '合并分支',
    key: 'square',
    layers: [
      // git-branch the other way: one node at the top of the trunk, and a branch from a node at
      // the lower right that bends round into the trunk under it. Drawn from the branch's node.
      L('M3.5 3.5V13', { sw: 2, ...Bt, part: 'lines' }),
      L('M12.5 12.5H10A6.5 6.5 0 0 1 3.5 6V3.5', { sw: 2, ...Bt, part: 'lines' }),
      L(circ(3.5, 3.5, 1.5), { gap: W }),
      L(circ(12.5, 12.5, 1.5), { gap: W })
    ]
  },
  bug: {
    label: '缺陷',
    key: 'square',
    layers: [
      // A beetle seen from above: a light body split down the middle into two wing cases, a blue
      // head one gap above it, and three blue legs a side, one gap out. The legs are two layers
      // (each a left, right, left set), so they can step in turn.
      L(rr(5.25, 5, 5.5, 9, 2.75), { ...Bt, cut: [C(rr(7.5, 0, 1, 16))] }),
      L(rr(6, 2, 4, 2, [2, 2, 0.5, 0.5])),
      L(pill(2, 6.125, 2.25, D) + pill(11.75, 8.875, 2.25, D) + pill(2, 11.625, 2.25, D)),
      L(pill(11.75, 6.125, 2.25, D) + pill(2, 8.875, 2.25, D) + pill(11.75, 11.625, 2.25, D))
    ]
  },
  rss: {
    label: '订阅',
    key: 'square',
    layers: [
      // code's tile with the feed mark in blue: a dot in the lower left corner, the same 1.75
      // in from the left and bottom edges, and two quarter rings about it a gap of 1 apart.
      L(rr(2, 2, 12, 12, R), Bt),
      L(circ(5.25, 10.75, 1.5)),
      L('M5.25 7.5A3.25 3.25 0 0 1 8.5 10.75', { sw: K }),
      L('M5.25 5A5.75 5.75 0 0 1 11 10.75', { sw: K })
    ]
  },
  'wrap-text': {
    label: '自动换行',
    key: 'landscape',
    layers: [
      // menu's light bars at the top and a short one at the bottom; between them a blue line runs
      // to the end, turns down round a half circle and comes back as an arrow (the allowed 45°
      // head), pointing to where the next line starts.
      L('M2 3H14', { sw: 2, ...Bt }),
      L('M2 13H5', { sw: 2, ...Bt }),
      L('M2 7.5H12.25A2 2 0 0 1 12.25 11.5H9.25', { sw: K, part: 'arrow' }),
      L('M10.75 9.75L9 11.5L10.75 13.25', { sw: K, part: 'arrow' })
    ]
  }
});

// Group 3 of the same batch.
// The square arrows: code's tile with arrow-up-down's blue arrow (a K shaft and a 45° head),
// turned to each side. ARROW_IN gives the stroke for a direction: up, right, down or left.
const ARROW_IN = {
  up: 'M8 11.25V4.75M5.25 7.5L8 4.75L10.75 7.5',
  right: 'M4.75 8H11.25M8.5 5.25L11.25 8L8.5 10.75',
  down: 'M8 4.75V11.25M5.25 8.5L8 11.25L10.75 8.5',
  left: 'M11.25 8H4.75M7.5 5.25L4.75 8L7.5 10.75'
};
const squareArrow = (dir, label) => ({ label, key: 'square', layers: [L(rr(2, 2, 12, 12, R), Bt), L(ARROW_IN[dir], { sw: K })] });
// sync's two arrows: rotate-cw's light ring split into two arcs about (8, 8), each with its
// blue head at the clockwise end; the second is the first turned half round.
const SYNC_HEAD = [[15.008, 6.522], [9.768, 6.232], [14.718, 1.282]];
const half = (pts) => pts.map(([x, y]) => [f3(16 - x), f3(16 - y)]);
// layers' outlines: a diamond whose sides rise 2.75 over 7 (the stack's slope), and V-shaped
// bands under it that run parallel to its lower sides, each a gap of 1 below the last.
const LAYER_RISE = 2.75, LAYER_GAP = f3(1 / Math.cos(Math.atan2(2.75, 7)));
const layerBand = (a, th) => polygon([[1, a], [8, a + LAYER_RISE], [15, a], [15, a + th], [8, a + LAYER_RISE + th], [1, a + th]], [0.75, 1, 0.75, 0.75, 1, 0.75]);
Object.assign(ICONS, {
  'square-arrow-up': squareArrow('up', '方形向上箭头'),
  'square-arrow-right': squareArrow('right', '方形向右箭头'),
  'square-arrow-down': squareArrow('down', '方形向下箭头'),
  'square-arrow-left': squareArrow('left', '方形向左箭头'),
  sync: {
    label: '同步',
    key: 'circle',
    layers: [
      // Two light arcs of rotate-cw's ring, each running 130° clockwise to its blue head (the
      // same head as rotate-cw's), one arrow over the top and one under the bottom. Each arc
      // starts one gap clear of the other arrow's head.
      L('M2.023 7.477A6 6 0 0 1 12.243 3.757', { ...Bt, sw: 2, part: 'a0' }),
      L(polygon(SYNC_HEAD, 1), { part: 'a0' }),
      L('M13.977 8.523A6 6 0 0 1 3.757 12.243', { ...Bt, sw: 2, part: 'a1' }),
      L(polygon(half(SYNC_HEAD), 1), { part: 'a1' })
    ]
  },
  'cloud-fog': {
    label: '雾',
    key: 'landscape',
    layers: [
      // cloud-rain's cloud, and one gap below it two blue bands of mist set off from each other,
      // reaching the left and the right edge in turn.
      L(pill(1, 4, 14, 5) + circ(8.5, 5, 3), Bt),
      L(pill(1, 10, 10.5, K)),
      L(pill(4.5, 12.5, 10.5, K))
    ]
  },
  sunrise: {
    label: '日出',
    key: 'square',
    layers: [
      // Half of sun on a light horizon (a bar 2 thick) a gap of 1 below it, with two of sun's
      // dots one gap out; above it a blue arrow (arrow-up-down's) points up. The horizon cuts a gap round itself
      // for the motion, where the sun comes up from behind it.
      L('M4.75 11A3.25 3.25 0 0 1 11.25 11Z', Bt),
      L(circ(4.376, 7.376, 0.875) + circ(11.624, 7.376, 0.875)),
      L(pill(2, 12, 12, 2), { ...Bt, gap: W }),
      L('M8 6V2.75M6 4.75L8 2.75L10 4.75', { sw: K })
    ]
  },
  sunset: {
    label: '日落',
    key: 'square',
    layers: [
      // sunrise with the arrow pointing down, towards the horizon.
      L('M4.75 11A3.25 3.25 0 0 1 11.25 11Z', Bt),
      L(circ(4.376, 7.376, 0.875) + circ(11.624, 7.376, 0.875)),
      L(pill(2, 12, 12, 2), { ...Bt, gap: W }),
      L('M8 2.75V6M6 4L8 6L10 4', { sw: K })
    ]
  },
  layers: {
    label: '图层',
    key: 'landscape',
    layers: [
      // A stack seen from above: a light diamond on top and two V-shaped bands under it, the
      // first blue, the second light, each one gap below the last. A layer has no shape without
      // its slanted sides, so they are the slopes this object needs (GUIDE.md §1).
      L(polygon([[8, 1.9], [15, 1.9 + LAYER_RISE], [8, 1.9 + 2 * LAYER_RISE], [1, 1.9 + LAYER_RISE]], [1.25, 1, 1.25, 1]), Bt),
      L(layerBand(f3(1.9 + LAYER_RISE + LAYER_GAP), 2.25)),
      L(layerBand(f3(1.9 + LAYER_RISE + 2 * LAYER_GAP + 2.25), 2.25), Bt)
    ]
  },
  ghost: {
    label: '幽灵',
    key: 'square',
    layers: [
      // A light dome whose hem is receipt's three scallops (half circles of radius 2), and two
      // blue eyes.
      L(rr(2, 2, 12, 10, [6, 6, 0, 0]) + [4, 8, 12].map((x) => circ(x, 12, 2)).join(''), Bt),
      L(pill(5.875, 5.5, D, 2.5) + pill(8.875, 5.5, D, 2.5))
    ]
  }
});

// Group 4 of the same batch.
// component's four diamonds: squares turned 45° about points d out from the centre, side s, so
// neighbours are one gap apart and the outer tips reach the 12 box once rounded.
const COMP_D = 3.509, COMP_S = 3.962;
const diamond = (cx, cy) => rot(cx, cy, COMP_S, COMP_S, 45, 0.75);
// graduation-cap's board: a diamond twice as wide as tall, the side corners just past the live
// area so their rounded ends land on it.
const BOARD = polygon([[8, 2.38], [15.618, 6.189], [8, 9.998], [0.382, 6.189]], [1, 0.5, 1, 0.5]);
Object.assign(ICONS, {
  move: {
    label: '移动',
    key: 'circle',
    layers: [
      // A light disc with a blue cross whose four ends carry small heads (the allowed 45°).
      L(circ(8, 8, 7), Bt),
      L('M8 3.75V12.25M3.75 8H12.25M6.5 5.25L8 3.75L9.5 5.25M10.75 6.5L12.25 8L10.75 9.5M9.5 10.75L8 12.25L6.5 10.75M5.25 9.5L3.75 8L5.25 6.5', { sw: K })
    ]
  },
  'contact-book': {
    label: '通讯录',
    key: 'portrait',
    layers: [
      // A light book whose spine is a blue band of the body itself (clipped, as credit-card's
      // stripe), and user's head and shoulders in blue on the face, evenly inset from the spine
      // and the right edge.
      L(rr(2, 1, 12, 14, M), Bt),
      L(rr(2, 1, 12, 14, M), { clip: rr(0, 0, 4.5, 16) }),
      L(circ(9.25, 6, 1.75)),
      L(rr(6.25, 8.75, 6, 3.25, [3, 3, 1, 1]))
    ]
  },
  siren: {
    label: '警报',
    key: 'square',
    layers: [
      // A light dome on a blue base a gap of 1 below it, and three short blue rays a gap out:
      // one above, one either side.
      L(rr(5.25, 5, 5.5, 6, [2.75, 2.75, 0, 0]), Bt),
      L(rr(2, 12, 12, 2, t)),
      L(pill(7.25, 2, K, 2) + pill(2, 7.25, 2.25, K) + pill(11.75, 7.25, 2.25, K))
    ]
  },
  braces: {
    label: '花括号',
    key: 'square',
    layers: [
      // code's tile with a pair of blue curly braces built from quarter arcs of radius 1, their
      // points facing out, 2 in from the tile's edges and a gap of 1 apart. One layer each.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M6.75 4.75A1 1 0 0 0 5.75 5.75V7A1 1 0 0 1 4.75 8A1 1 0 0 1 5.75 9V10.25A1 1 0 0 0 6.75 11.25', { sw: K }),
      L('M9.25 4.75A1 1 0 0 1 10.25 5.75V7A1 1 0 0 0 11.25 8A1 1 0 0 0 10.25 9V10.25A1 1 0 0 1 9.25 11.25', { sw: K })
    ]
  },
  component: {
    label: '组件',
    key: 'square',
    layers: [
      // Four diamonds round the centre, a gap of 1 apart: light above and below, blue left and
      // right. The component mark is made of turned squares, so it needs their 45° sides.
      L(diamond(8, 8 - COMP_D), Bt),
      L(diamond(8 + COMP_D, 8)),
      L(diamond(8, 8 + COMP_D), Bt),
      L(diamond(8 - COMP_D, 8))
    ]
  },
  sitemap: {
    label: '站点地图',
    key: 'square',
    layers: [
      // A blue page on top and three light pages in a row below, joined by blue lines that stop
      // a gap of 1 short of each page.
      L('M8 7.125V8M3.667 8.875V8H12.333V8.875M8 8V8.875', { sw: D }),
      L(rr(5.5, 2, 5, 3.5, 1)),
      L(rr(2, 10.5, 3.333, 3.5, 1), Bt),
      L(rr(6.333, 10.5, 3.333, 3.5, 1), Bt),
      L(rr(10.667, 10.5, 3.333, 3.5, 1), Bt)
    ]
  },
  'graduation-cap': {
    label: '学士帽',
    key: 'wide',
    layers: [
      // A light board (a diamond: the board seen at an angle is known by its slanted sides) in
      // front of a blue band, cutting a gap of W out of it, and a blue tassel hanging on the right
      // one gap from the band.
      L(rr(4.5, 8, 7, 5.5, [0, 0, r, r])),
      L('M13.25 6.5V10.75', { sw: K }),
      L(BOARD, { ...Bt, gap: W })
    ]
  },
  'gallery-view': {
    label: '画廊视图',
    key: 'landscape',
    layers: [
      // A large light picture over a row of three blue thumbnails, each part a gap of 1 from the
      // next; the outer corners round as one outline (seams 1 inside). One layer per thumbnail.
      L(rr(1, 2, 14, 7.5, [R3, R3, S, S]), Bt),
      L(rr(1, 10.5, 4, 3.5, [S, S, S, r])),
      L(rr(6, 10.5, 4, 3.5, S)),
      L(rr(11, 10.5, 4, 3.5, [S, S, r, S]))
    ]
  }
});
