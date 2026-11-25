// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// commerce: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: basket store package wallet credit-card banknote coins coin piggy-bank receipt invoice tag tags badge-percent barcode currency-dollar currency-euro currency-yuan calculator briefcase landmark
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { clearOf, gapOf } from '../kit.mjs';

// A price tag whose outer square is x0..x0+S, y0..y0+S: square corner with the hole at the top
// left, the body running down to the right (centre line of the outline).
function tagShape(g, x0, y0, S) {
  const { h } = g, q = h * Math.SQRT2, k1 = x0 + S / 2 - y0, K2 = x0 + y0 + 1.5 * S, k3 = y0 - x0 + S / 2;
  const pts = [
    [x0 + h, y0 + h],
    [k1 - q + y0 + h, y0 + h],
    [(k1 + K2) / 2 - q, (K2 - k1) / 2],
    [(K2 - k3) / 2, (k3 + K2) / 2 - q],
    [x0 + h, k3 - q + x0 + h]
  ];
  return g.polygon(pts, [3 - h, 1.2, 3.5 - h, 3.5 - h, 1.2]);
}
// The tag's outer square: its two far corners are rounded, so it is drawn out by what they take.
const TAG = 21.45;
// The hole of a tag: a dot kept clear of the square corner at every weight.
const tagHole = (g, x0, y0) => { const o = g.s + clearOf(g.s) + g.dr + 0.4; return g.dot(x0 + o, y0 + o); };
// Fill variant of two stacked tags: where the clear band round the front tag crosses the back
// tag's edge at a shallow angle, the back would end in a sharp scrap. roundTip() gives that end a
// round cap instead: a circle of radius r touching both edges, and everything past it is cut.
// The outlines are polylines of the paths moved out by w (the outer edge, or the band's edge).
function outlineOf(d, w) {
  const t = d.match(/[MLCZ]|-?\d*\.?\d+/g), pts = [];
  let i = 0, x = 0, y = 0;
  const to = (px, py) => { const [ax, ay] = pts.length ? pts[pts.length - 1] : [x, y], k = Math.max(1, Math.ceil(Math.hypot(px - ax, py - ay) / 0.05)); for (let j = 1; j <= k; j++) pts.push([ax + ((px - ax) * j) / k, ay + ((py - ay) * j) / k]); };
  while (i < t.length) {
    const c = t[i++];
    if (c === 'M') { x = +t[i++]; y = +t[i++]; pts.push([x, y]); }
    else if (c === 'L') { x = +t[i++]; y = +t[i++]; to(x, y); }
    else if (c === 'C') {
      const a = t.slice(i, i + 6).map(Number); i += 6;
      for (let k = 1; k <= 24; k++) { const u = k / 24, v = 1 - u; to(v * v * v * x + 3 * v * v * u * a[0] + 3 * v * u * u * a[2] + u * u * u * a[4], v * v * v * y + 3 * v * v * u * a[1] + 3 * v * u * u * a[3] + u * u * u * a[5]); }
      x = a[4]; y = a[5];
    }
  }
  const N = pts.length;
  // clockwise path: the outward normal of a step (dx, dy) is (dy, -dx)
  return pts.map((p, k) => {
    const [ax, ay] = pts[(k - 1 + N) % N], [bx, by] = pts[(k + 1) % N], l = Math.hypot(bx - ax, by - ay) || 1;
    return [p[0] + ((by - ay) / l) * w, p[1] - ((bx - ax) / l) * w];
  });
}
const insideOf = ([px, py], P) => {
  let w = false;
  for (let k = 0, j = P.length - 1; k < P.length; j = k++) {
    const [ax, ay] = P[j], [bx, by] = P[k];
    if ((ay > py) !== (by > py) && px < ax + ((py - ay) * (bx - ax)) / (by - ay)) w = !w;
  }
  return w;
};
const nearestOf = (p, P) => P.reduce((b, q) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); return d < b.d ? { d, q } : b; }, { d: Infinity, q: null });
/** The cut that rounds the end of `body` (outer edge polyline) against `band` near the point `at`. */
function roundTip(body, band, at, r, s) {
  // the end: the edge point outside the band nearest to the band, around `at`
  const N = body.length, out = body.map((p) => !insideOf(p, band));
  let tip = -1, best = Infinity;
  body.forEach((p, k) => { if (!out[k]) return; const d = Math.hypot(p[0] - at[0], p[1] - at[1]); if (d < 4 && nearestOf(p, band).d < best) { best = nearestOf(p, band).d; tip = k; } });
  if (tip < 0) return '';
  // walk back from the end along the edge, staying outside the band, until a circle of radius r
  // touching the edge there clears the band
  let dir = 0;
  for (let j = 1; !dir && j < N; j++) dir = !out[(tip + j) % N] ? -1 : !out[(tip - j + N) % N] ? 1 : 0;
  for (let j = 1; j < N; j++) {
    const k = (tip + dir * j + N) % N, P = body[k], Q = body[(k + dir + N) % N], l = Math.hypot(Q[0] - P[0], Q[1] - P[1]) || 1;
    // inward normal (the body is clockwise, so inward is to the right of the walk when dir = 1)
    const nx = (-dir * (Q[1] - P[1])) / l, ny = (dir * (Q[0] - P[0])) / l, C = [P[0] + nx * r, P[1] + ny * r];
    if (insideOf(C, band)) continue;
    const m = nearestOf(C, band);
    if (m.d < r) continue;
    const T1 = P, T2 = m.q, E = body[tip], o = (T) => [T[0] + ((T[0] - C[0]) / r) * s, T[1] + ((T[1] - C[1]) / r) * s];
    const u = [E[0] - C[0], E[1] - C[1]], lu = Math.hypot(...u), far = [C[0] + (u[0] / lu) * (lu + 2 * s), C[1] + (u[1] / lu) * (lu + 2 * s)];
    // the arc from T2 to T1 round the side facing the end
    const ang = (q) => Math.atan2(q[1] - C[1], q[0] - C[0]), w = (a) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const e = w(ang(T1) - ang(T2)), em = w(Math.atan2(u[1], u[0]) - ang(T2)), sw = em < e ? 1 : 0;
    const pt = (q) => `${n(q[0])} ${n(q[1])}`;
    return `M${pt(T1)}L${pt(o(T1))}L${pt(far)}L${pt(o(T2))}L${pt(T2)}A${n(r)} ${n(r)} 0 0 ${sw} ${pt(T1)}Z`;
  }
  return '';
}
// One coin: a rim and an inner ring at half its size.
const coin = (g, cx, cy, R, n0, o = {}) => [
  shell(g.ring(cx, cy, R), { n: n0, role: o.role ?? P, ...o }),
  shell(g.ring(cx, cy, R / 2), { n: `${n0}-in`, role: D, on: n0, part: o.part })
];
// What shows of a disc (centre b, radius rb) behind another (centre f, radius rf): a crescent
// whose two tips are rounded with radius t, so no sharp scrap is left at the tips (fill variant).
function crescentOf(b, rb, f, rf, t) {
  const d = Math.hypot(f[0] - b[0], f[1] - b[1]), u = [(b[0] - f[0]) / d, (b[1] - f[1]) / d], v = [-u[1], u[0]];
  // centres of the tip circles: rb - t from b, rf + t from f
  const A = rf + t, B = rb - t, p = (A * A - B * B + d * d) / (2 * d), q = Math.sqrt(A * A - p * p);
  const C = [1, -1].map((k) => [f[0] + p * u[0] + k * q * v[0], f[1] + p * u[1] + k * q * v[1]]);
  const on = (o, c, r) => { const L = Math.hypot(c[0] - o[0], c[1] - o[1]); return [o[0] + ((c[0] - o[0]) * r) / L, o[1] + ((c[1] - o[1]) * r) / L]; };
  const [Tb1, Tb2] = C.map((c) => on(b, c, rb)), [Tf1, Tf2] = C.map((c) => on(f, c, rf));
  // arc flags for going round centre o from p0 to p1 through the point m
  const ang = (o, q0) => Math.atan2(q0[1] - o[1], q0[0] - o[0]), w = (a) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const flags = (o, p0, p1, m) => {
    const e = w(ang(o, p1) - ang(o, p0)), em = w(ang(o, m) - ang(o, p0));
    return em < e ? [e > Math.PI ? 1 : 0, 1] : [2 * Math.PI - e > Math.PI ? 1 : 0, 0];
  };
  const arc = (o, r, p0, p1, m) => { const [lg, sw] = flags(o, p0, p1, m); return `A${n(r)} ${n(r)} 0 ${lg} ${sw} ${n(p1[0])} ${n(p1[1])}`; };
  const far = [b[0] + rb * u[0], b[1] + rb * u[1]], near = [f[0] + rf * u[0], f[1] + rf * u[1]];
  const tip = (c, q0, q1) => { const a = [q0[0] + q1[0] - 2 * c[0], q0[1] + q1[1] - 2 * c[1]], L = Math.hypot(...a); return [c[0] + (a[0] * t) / L, c[1] + (a[1] * t) / L]; };
  return `M${n(Tb1[0])} ${n(Tb1[1])}` + arc(b, rb, Tb1, Tb2, far) + arc(C[1], t, Tb2, Tf2, tip(C[1], Tb2, Tf2)) +
    arc(f, rf, Tf2, Tf1, near) + arc(C[0], t, Tf1, Tb1, tip(C[0], Tf1, Tb1)) + 'Z';
}
// Seal with eight rounded points (a badge), outer edge about radius R.
function seal(g, R = 10) {
  const pts = [], ro = R - g.h + 0.55, ri = ro * 0.8;
  for (let i = 0; i < 16; i++) {
    const a = ((i * 22.5 - 90) * Math.PI) / 180, r = i % 2 ? ri : ro;
    pts.push([12 + r * Math.cos(a), 12 + r * Math.sin(a)]);
  }
  return g.polygon(pts, pts.map((_, i) => (i % 2 ? 1.6 : 2)));
}

export default {
  basket: {
    anchor: 'base',
    label: '购物篮', key: 'landscape',
    plan: '主体：篮身（上宽下窄，斜边是篮子需要的）和篮沿（宽出篮身）；辅助：两侧斜向上的提手（不相连，与购物袋、锁的拱形提手区分开）；细节：两条竖向篮条（上下接到篮沿和篮底）',
    weights: { [P]: 0.6, [S]: 0.16, [D]: 0.24 },
    draw(g, ctx) {
      const { s, h } = g, rim = 10, yb = 20 - h;
      // fill: the slats hang from the rim and stop one stroke above the bottom; at heavy strokes
      // they move apart so the ink between them stays one stroke wide
      const fill = ctx?.variant === 'fill', xs = fill ? Math.max(2, s) : 2, ys = fill ? 20 - 1.5 * s : yb;
      return [
        line(g.seg(5, rim, 8.5, 4 + h) + g.seg(19, rim, 15.5, 4 + h), { n: 'handle', role: S }),
        shell(g.polygon([[4, rim], [20, rim], [18, yb], [6, yb]], [0, 0, 2.25 - h * 0.5, 2.25 - h * 0.5]), { n: 'body', role: P }),
        line(g.seg(12 - xs, rim, 12 - xs, ys) + g.seg(12 + xs, rim, 12 + xs, ys), { n: 'slats', role: D, on: 'body' }),
        line(g.span(2, rim, 22, rim), { n: 'rim', role: P })
      ];
    },
    // 提起篮子：篮子晃一晃
    fx: { t: 'wiggle', on: 'all', o: [12, 4], deg: 6, hz: 2.4 }
  },
  store: {
    anchor: 'base',
    label: '商店', key: 'square',
    plan: '主体：遮阳篷（下沿是三个半圆）；辅助：店身（两侧墙和地面）；细节：门',
    weights: { [P]: 0.54, [S]: 0.28, [D]: 0.18 },
    draw(g, ctx) {
      const { h } = g, x0 = 3 + h, x1 = 21 - h, top = 3 + h, base = 8, w = (x1 - x0) / 3, r = w / 2, yb = 21 - h, c = 3.5 - h;
      let awn = `M${n(x0)} ${base}V${n(top + 2)}A2 2 0 0 1 ${n(x0 + 2)} ${n(top)}H${n(x1 - 2)}A2 2 0 0 1 ${n(x1)} ${n(top + 2)}V${base}`;
      for (let i = 0; i < 3; i++) awn += `A${n(r)} ${n(r)} 0 0 1 ${n(x1 - (i + 1) * w)} ${base}`;
      const wl = 6, wr = 18, wy = base + Math.sqrt(r * r - (x0 + r - wl) ** 2), dy = Math.max(16.5, base + r + h + gapOf(g.s) + g.s + 3);
      return [
        line(cup(wl, wy, wr, yb, c), { n: 'body', role: S, only: 'outline' }),
        shell(g.rr(wl, wy, wr - wl, yb - wy, [0, 0, c, c]), { n: 'body', role: S, only: 'fill' }),
        // in the fill variant a clear band keeps the scallops from running into the filled shop
        shell(awn + 'Z', { n: 'awning', role: P, occ: ctx?.variant === 'fill' }),
        line(`M10 ${n(yb)}V16.5A2 2 0 0 1 14 16.5V${n(yb)}`, { n: 'door', role: D, on: 'body', only: 'outline' }),
        // the doorway keeps one stroke below the clear band of the middle scallop and runs out
        // through the ground
        solid(`M9 ${n(yb + g.s)}V${n(dy)}A3 3 0 0 1 15 ${n(dy)}V${n(yb + g.s)}Z`, { n: 'door', role: D, on: 'body', only: 'fill' })
      ];
    },
    // 开门营业：遮阳篷向下展开再收回
    fx: { t: 'keys', on: ['awning'], o: [12, 3], sy: [0.78, 1.06] }
  },
  package: {
    label: '包裹', key: 'square',
    ends: 'in',
    plan: '主体：箱子的外轮廓（六边形，斜边是箱子透视需要的）；辅助：顶面和两个侧面的分界线（Y 形）',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g, ctx) {
      const { h } = g, xl = 3 + h, xr = 21 - h, yt = 3.7, yb = 20.3, d = (yb - yt) / 4, cy = yt + 2 * d;
      const box = shell(g.polygon([[12, yt], [xr, yt + d], [xr, yb - d], [12, yb], [xl, yb - d], [xl, yt + d]], [1.4, 1.2, 1.2, 1.4, 1.2, 1.2]), { n: 'box', role: P });
      if (ctx?.variant !== 'fill') return [box, line(g.pl([[xl, yt + d], [12, cy], [xr, yt + d]]) + g.seg(12, cy, 12, yb), { n: 'edges', role: S, on: 'box' })];
      // fill: the edges stop one stroke short of the corners (ends: 'in'; cut out through a
      // corner they would leave sharp slivers on both sides); the upright edge is a line of its
      // own so each of the three ends can move
      return [
        box,
        line(g.pl([[xl, yt + d], [12, cy], [xr, yt + d]]), { n: 'edges', role: S, on: 'box' }),
        line(g.seg(12, cy, 12, yb), { n: 'edges-v', role: S, on: 'box', part: 'edges' })
      ];
    },
    // 包裹送达：落地弹一下
    fx: { t: 'bounce', on: 'all', o: [12, 21], amp: 1.1 }
  },
  wallet: {
    label: '钱包', key: 'landscape',
    ends: 'out',
    plan: '主体：钱包；辅助：右上角的搭扣（从上沿垂下）；细节：扣子（实心点）',
    weights: { [P]: 0.74, [S]: 0.22, [D]: 0.04 },
    draw(g, ctx) {
      const { h } = g, top = 4 + h, xr = 22 - h, r = Math.min(1, 1 - (g.s - 2) * 0.25);
      // fill: the flap cuts its corner off the body; the dot sits in the middle of that piece,
      // one stroke from the flap and from the outer edge
      const dx = ctx?.variant === 'fill' ? (14 + h + 22) / 2 : (14 + h + 22 - g.s) / 2;
      return [
        shell(g.box(2, 4, 20, 16, 4), { n: 'body', role: P }),
        line(`M14 ${n(top)}V11A3 3 0 0 0 17 14H${n(xr)}`, { n: 'flap', role: S, on: 'body' }),
        // the dot keeps clear of the flap and the wall as the stroke grows
        solid(g.circ(dx, 9.5, r), { n: 'dot', role: D, on: 'body' })
      ];
    },
    // 按下扣子：扣子缩下去再弹起
    fx: { t: 'keys', on: ['dot'], o: [17.5, 9.5], s: [0.4, 1.25] }
  },
  'credit-card': {
    label: '银行卡', key: 'landscape', fit: 'x',
    plan: '主体：卡片；细节：磁条（横贯卡面）和卡号（短线）',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g, ctx) {
      const { s, h } = g;
      // fill: the stripe cuts the card across; the number keeps one stroke below it
      const y = ctx?.variant === 'fill' ? Math.max(14, 10 + 2 * s) : 14;
      return [
        shell(g.box(2, 5, 20, 14, 3.5), { n: 'card', role: P }),
        line(g.seg(2 + h, 10, 22 - h, 10), { n: 'stripe', role: D, on: 'card', ends: 'out' }),
        line(g.seg(7, y, 11, y), { n: 'number', role: D, on: 'card' })
      ];
    },
    // 刷卡：卡片向一侧划过再回来
    fx: { t: 'keys', on: 'all', x: [-1.4, 0.4] }
  },
  banknote: {
    label: '纸币', key: 'landscape', fit: 'x',
    plan: '主体：纸币；细节：中间的圆环和两侧的圆点',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g, ctx) {
      const { s } = g;
      // fill: the ring is a round hole (radius 3); each dot sits halfway between it and the edge,
      // one stroke from both up to the heaviest weight
      const dx = ctx?.variant === 'fill' ? 5.5 : (2 + s + 9) / 2;
      return [
        shell(g.box(2, 5, 20, 14, 2.75), { n: 'note', role: P }),
        shell(g.ring(12, 12, 3), { n: 'ring', role: D, on: 'note' }),
        solid(g.circ(dx, 12, 1) + g.circ(24 - dx, 12, 1), { n: 'dots', role: D, on: 'note' })
      ];
    },
    // 数钱：纸币抖动一下
    fx: { t: 'keys', on: 'all', y: [-1, 0.3], r: [-4, 2] }
  },
  coins: {
    label: '硬币堆', key: 'live',
    plan: '主体：前面的硬币（外圈）；辅助：后面的硬币（被挡住一部分）；细节：前面硬币的内圈。硬币和“硬币”图标相同：外圈加一半大小的内圈',
    weights: { [P]: 0.52, [S]: 0.26, [D]: 0.22 },
    draw(g, ctx) {
      // fill: what shows of the back coin past the front one and its clear band, with round tips
      const back = ctx?.variant === 'fill'
        ? solid(crescentOf([15, 9], 7, [9.5, 14.5], 7.5 + gapOf(g.s), g.h), { n: 'back', role: S })
        : shell(g.ring(15, 9, 7), { n: 'back', role: S });
      return [
        back,
        ...coin(g, 9.5, 14.5, 7.5, 'front', { occ: true, part: 'front' })
      ];
    },
    // 硬币一枚接一枚跳起
    fx: { t: 'bounce', on: [['back'], ['front', 'front-in']], by: true, o: [12, 22], amp: 1.1 }
  },
  coin: {
    label: '硬币', key: 'circle',
    plan: '主体：硬币外圈；细节：一半大小的内圈',
    weights: { [P]: 0.68, [D]: 0.32 },
    draw(g) { return coin(g, 12, 12, 10, 'coin'); },
    // 抛硬币：硬币跳起再落下（线性图标不做三维翻转，GUIDE.md §5）
    fx: { t: 'bounce', on: 'all', o: [12, 22], amp: 1.3 }
  },
  'piggy-bank': {
    anchor: 'base',
    label: '存钱罐', key: 'landscape',
    plan: '主体：猪身；辅助：鼻子、耳朵和两条腿；细节：投币口',
    weights: { [P]: 0.6, [S]: 0.3, [D]: 0.1 },
    draw(g) {
      const { h } = g;
      return [
        line(g.pl([[6.2, 7], [7.4, 3.6 + h], [10.6, 6.2]]), { n: 'ear', role: S }),
        line(`M17 10H${n(22 - h)}V14H17`, { n: 'snout', role: S }),
        line(g.seg(7, 16, 7, 20 - h) + g.seg(13, 16, 13, 20 - h), { n: 'legs', role: S }),
        shell(g.box(3, 5, 15, 13, 5), { n: 'body', role: P }),
        line(g.seg(9, 10, 12, 10), { n: 'slot', role: D, on: 'body' })
      ];
    },
    // 投币：存钱罐晃一晃
    fx: { t: 'wiggle', on: 'all', o: [12, 20], deg: 6, hz: 2.6 },
    allow: { keyline: '耳朵高出横向参考线一点；猪身偏左，左边留出 1 让重心居中' }
  },
  receipt: {
    label: '小票', key: 'portrait',
    plan: '主体：小票（下沿是锯齿，斜边是撕口需要的）；细节：三行字（末行短）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g, ctx) {
      const { s, h } = g, x0 = 4 + h, x1 = 20 - h, top = 2 + h, yb = 22 - h, yv = yb - 2.2, w = (x1 - x0) / 6;
      const pts = [[x0, top], [x1, top]];
      for (let i = 0; i <= 6; i++) pts.push([x1 - i * w, i % 2 ? yv : yb]);
      const a = 4 + s + 2 + h, b = 20 - s - 2 - h;
      // fill: at heavy strokes the lines move apart so the ink between them stays one stroke
      const d = ctx?.variant === 'fill' ? Math.max(4, 2 * s) : 4;
      return [
        shell(g.polygon(pts, [3.25 - h, 3.25 - h, ...pts.slice(2).map((_, i) => (i % 2 ? 0.5 : 0.8))]), { n: 'paper', role: P }),
        line(g.seg(a, 11 - d, b, 11 - d), { n: 'l1', role: D, on: 'paper' }),
        line(g.seg(a, 11, b, 11), { n: 'l2', role: D, on: 'paper' }),
        line(g.seg(a, 11 + d, a + (b - a) * 0.55, 11 + d), { n: 'l3', role: D, on: 'paper' })
      ];
    },
    // 打印小票：纸从上面长出来
    fx: { t: 'keys', on: 'all', o: [12, 2], sy: [0.7, 1.04] }
  },
  invoice: {
    label: '发票', key: 'portrait',
    plan: '主体：纸页；细节：抬头（短）、一行明细、右对齐的合计（短）',
    weights: { [P]: 0.76, [D]: 0.24 },
    draw(g, ctx) {
      const { s, h } = g, a = 4 + s + 2 + h, b = 20 - s - 2 - h;
      // fill: at heavy strokes the lines move apart so the ink between them stays one stroke
      const d = ctx?.variant === 'fill' ? Math.max(4, 2 * s) : 4;
      return [
        shell(g.box(4, 2, 16, 20, 4), { n: 'page', role: P }),
        line(g.seg(a, 12 - d, a + (b - a) * 0.5, 12 - d), { n: 'l1', role: D, on: 'page' }),
        line(g.seg(a, 12, b, 12), { n: 'l2', role: D, on: 'page' }),
        line(g.seg(b - (b - a) * 0.5, 12 + d, b, 12 + d), { n: 'l3', role: D, on: 'page' })
      ];
    },
    fx: { t: 'draw', on: ['l1', 'l2', 'l3'] }
  },
  tag: {
    label: '标签', key: 'live',
    plan: '主体：价签（左上是直角，右下斜着收拢）；细节：挂孔（实心点）',
    weights: { [P]: 0.92, [D]: 0.08 },
    draw(g) {
      return [shell(tagShape(g, 2, 2, TAG), { n: 'tag', role: P }), solid(tagHole(g, 2, 2), { n: 'hole', role: D, on: 'tag' })];
    },
    // 价签挂在挂孔上摆动
    fx: { t: 'wiggle', on: 'all', o: [7.5, 7.5], deg: 9, hz: 2.4 }
  },
  tags: {
    label: '多个标签', key: 'live',
    plan: '主体：前面的价签（与“标签”同形，缩小）；辅助：后面的价签（被挡住）；细节：挂孔',
    weights: { [P]: 0.6, [S]: 0.34, [D]: 0.06 },
    draw(g, ctx) {
      const { s, h } = g, fill = ctx?.variant === 'fill';
      // fill: what shows of the back above the front is at least a stroke tall (the front sits a
      // little lower and smaller at heavy strokes), and both ends of it are rounded (roundTip);
      // the hole carries that cut, so it moves with the front
      const dy = fill ? Math.max(0, 1.5 * s - 3.25) : 0, back = tagShape(g, 6, 2, TAG - 4), front = tagShape(g, 2, 6 + dy, TAG - 4 - dy);
      let tip = {};
      if (fill) {
        const body = outlineOf(back, h), band = outlineOf(front, h + gapOf(s)), r = 0.45 * s;
        tip = { cutD: roundTip(body, band, [19.5, 14], r, s) + roundTip(body, band, [6.5, 4], r, s) };
      }
      return [
        shell(back, { n: 'back', role: S }),
        shell(front, { n: 'front', role: P, occ: true, part: 'front' }),
        solid(tagHole(g, 2, 6 + dy), { n: 'hole', role: D, on: 'front', part: 'front', ...tip })
      ];
    },
    fx: [{ t: 'wiggle', on: ['front', 'hole'], o: [7, 11], deg: 8, hz: 2.4 }, { t: 'wiggle', on: ['back'], o: [11, 7], deg: 6, hz: 2.4, delay: 80 }]
  },
  'badge-percent': {
    label: '折扣', key: 'circle',
    light: ['pct', 'pdots'],
    plan: '主体：百分号（说明是折扣，墨少但层级最高）；辅助：八个圆角的徽章',
    weights: { [P]: 0.25, [S]: 0.75 },
    draw(g, ctx) {
      const { s } = g, k = 0.85 - (s - 2) * 0.3;
      // fill: the dots move out along the diagonal to keep one stroke from the slash
      const a = ctx?.variant === 'fill' ? Math.max(2.8, (1.5 * s + g.dr * k) / Math.SQRT2) : 2.8;
      return [
        shell(seal(g), { n: 'seal', role: S }),
        line(g.seg(8.6 + (s - 2), 15.4 - (s - 2), 15.4 - (s - 2), 8.6 + (s - 2)), { n: 'pct', role: P, on: 'seal' }),
        solid(g.dot(12 - a, 12 - a, k) + g.dot(12 + a, 12 + a, k), { n: 'pdots', role: P, on: 'seal' })
      ];
    },
    // 徽章转过八分之一圈，正好转回原样
    fx: { t: 'rotate', on: ['seal'], deg: 45, o: [12, 12] }
  },
  barcode: {
    label: '条形码', key: 'landscape', fit: 'x',
    plan: '主体：粗细不同的竖条。宽条用实心（宽 3，画成线框会合上）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, w = 3 + (g.s - 2) * 0.5;
      const bar = (x, i) => line(g.span(x, 5, x, 19), { n: `b${i}`, role: P, vc: i });
      const wide = (cx, i) => solid(g.area(cx - w / 2, 5, w, 14, h), { n: `b${i}`, role: P, vc: i });
      return [bar(3, 0), wide(7.5, 1), bar(12, 2), wide(16.5, 3), bar(21, 4)];
    },
    // 扫码：从左到右依次亮起
    fx: { t: 'variable', on: ['b0', 'b1', 'b2', 'b3', 'b4'], mode: 'iterative', step: 120 }
  },
  'currency-dollar': {
    label: '美元', key: 'portrait', fit: 'y',
    plan: '主体：字母 S（直线加两段半圆）和竖线。与欧元、人民币同一套字形：同样的字高和线宽',
    weights: { [P]: 1 },
    draw(g) {
      return [
        line('M17 5H9.5A3.5 3.5 0 0 0 9.5 12H14.5A3.5 3.5 0 0 1 14.5 19H7', { n: 's', role: P }),
        line(g.span(12, 2, 12, 22), { n: 'bar', role: P })
      ];
    },
    fx: { t: 'draw', on: ['s', 'bar'] },
    allow: { keyline: '字形本身窄，宽 12' }
  },
  'currency-euro': {
    nudge: [0.5, 0],
    label: '欧元', key: 'portrait', fit: 'y',
    plan: '主体：字母 C（一段圆弧）和两条横线。与美元、人民币同一套字形：字高 16（y 4..20）。横线伸在左侧，整体右移 0.5',
    weights: { [P]: 1 },
    draw(g) {
      return [
        line(g.arc(14, 12, 8 - g.h, 48, 312), { n: 'c', role: P }),
        line(g.seg(5, 10, 14.5, 10) + g.seg(5, 14, 13, 14), { n: 'bars', role: P })
      ];
    },
    fx: { t: 'draw', on: ['c', 'bars'] },
    allow: { keyline: '字高 16，与美元的 S 同高' }
  },
  'currency-yuan': {
    nudge: [0, 0.5],
    label: '人民币', key: 'portrait', fit: 'y',
    plan: '主体：两条斜线交于中线，下接竖线，两条横线。与美元、欧元同一套字形：字高 16。上方两条斜线张开，分量偏上，斜线和竖线下移 0.5',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g;
      return [
        line(g.pl([[6.5, 4.5 + h], [12, 12.5], [17.5, 4.5 + h]]) + g.seg(12, 12.5, 12, 20.5 - h), { n: 'y', role: P }),
        line(g.seg(8, 13, 16, 13) + g.seg(8, 17, 16, 17), { n: 'bars', role: P })
      ];
    },
    fx: { t: 'draw', on: ['y', 'bars'] },
    allow: { keyline: '字高 16，与美元的 S 同高；字形本身窄，宽 13' }
  },
  calculator: {
    label: '计算器', key: 'portrait',
    plan: '主体：机身；细节：显示屏（一条线）和两排按键（实心点）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g, ctx) {
      const { s, h } = g, e = 4 + s + clearOf(s) + h, r = Math.min(g.dr * 0.7, 1), keys = [];
      // fill: the keys are holes, kept one stroke apart (wider rows and columns at heavy strokes)
      const fill = ctx?.variant === 'fill', d = fill ? Math.max(3.5 - (s - 2) * 0.5, 2 * r + s) : 3.5 - (s - 2) * 0.5;
      const v = fill ? Math.max(2, r + s / 2) : 2;
      [14 - v, 14 + v].forEach((y, j) => [-1, 0, 1].forEach((k, i) => keys.push(solid(g.circ(12 + k * d, y, r), { n: `k${j * 3 + i}`, role: D, on: 'body' }))));
      return [shell(g.box(4, 2, 16, 20, 4), { n: 'body', role: P }), line(g.seg(e, 7, 24 - e, 7), { n: 'screen', role: D, on: 'body' }), ...keys];
    },
    // 按键依次按下
    fx: { t: 'variable', on: ['k0', 'k1', 'k2', 'k3', 'k4', 'k5'], mode: 'iterative', step: 110 }
  },
  briefcase: {
    anchor: 'base',
    label: '公文包', key: 'landscape',
    ends: 'out',
    plan: '主体：箱体；辅助：提手；细节：中间一道接缝',
    weights: { [P]: 0.64, [S]: 0.11, [D]: 0.25 },
    draw(g) {
      const { h } = g;
      return [
        line(`M9 8V6.5A1.5 1.5 0 0 1 10.5 ${n(4 + h)}H13.5A1.5 1.5 0 0 1 15 6.5V8`, { n: 'handle', role: S }),
        shell(g.box(2, 7, 20, 13, 3.5), { n: 'case', role: P }),
        line(g.seg(2 + h, 13, 22 - h, 13), { n: 'seam', role: D, on: 'case' })
      ];
    },
    fx: { t: 'wiggle', on: 'all', o: [12, 4], deg: 7, hz: 2.4 }
  },
  landmark: {
    anchor: 'base',
    label: '银行', key: 'square',
    plan: '主体：三角山花和底座；辅助：四根柱子。四根柱子墨量略多于山花和底座，但层级靠后',
    weights: { [P]: 0.47, [S]: 0.53 },
    draw(g) {
      const { h } = g, yr = 9, yb = 21 - h;
      return [
        shell(g.polygon([[3.6 + h, yr], [12, 3 + h * 0.6], [20.4 - h, yr]], [0.9, 1.6, 0.9]), { n: 'roof', role: P }),
        line([6, 10, 14, 18].map((x) => g.seg(x, yr, x, yb)).join(''), { n: 'cols', role: S }),
        line(g.span(3, yb, 21, yb), { n: 'base', role: P })
      ];
    },
    // 柱子从底座立起来
    fx: { t: 'keys', on: ['cols'], o: [12, 20], sy: [0.35, 1.04] }
  }
};
