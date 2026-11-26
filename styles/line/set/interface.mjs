// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// interface: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: check x plus minus filter sort star-half sparkles pin link-2 unlink paperclip circle-alert circle-help circle-minus triangle-alert ban checkbox toggle menu more-horizontal more-vertical maximize minimize zoom-in zoom-out loader command option cursor pointer mouse-pointer-click hand-grab
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { slash, badge, enclose } from '../kit.mjs';
import { off, offFill, notched } from '../variants.mjs';
import SHAPES, { ngon } from './shapes.mjs';

// The marks of the circled icons in icons.mjs (circle-check, circle-plus, circle-x), so the
// standalone marks and the ones in boxes and lenses have the same shape.
const CHECK = [[7.3, 12.4], [10.6, 15.7], [16.7, 9]];
// circle-check: the check is shrunk about (12, 12.2) as the stroke grows
const checkIn = (g) => { const k = 1 - 0.3 * (g.s - 1.75); return CHECK.map(([x, y]) => [12 + (x - 12) * k, 12.2 + (y - 12.2) * k]); };
// circle-plus: the arm half-length (centre line)
const plusK = (g) => 5.1 - 0.5 * (g.s - 1.75);
// the search lens (icons.mjs search)
const LENS = { R: 7, c: 10 };
const lens = (g) => {
  const { R, c } = LENS, k = (R - g.h) / Math.SQRT2;
  return [shell(g.ring(c, c, R), { n: 'lens', role: S }), line(g.seg(c + k, c + k, 21 - g.h, 21 - g.h), { n: 'handle', role: S })];
};
// a mark inside the lens: 1.5 clear of the lens at regular, 1.25 at the heavier weights
const lensMark = (g) => LENS.R - g.s - g.clear - g.h;

// link-2: the link's halves on the diagonal, long enough that their round ends reach the live area
const LINK2 = { len: 23.9, ht: 10.5, ex: -2.25 };
// A rounded polygon whose rounded corners reach the given outer points: the vertices are pushed
// out along the corner bisectors by what the rounding takes back (as parts.mjs star does).
function pointy(g, pts, radii) {
  const N = pts.length, out = [];
  for (let i = 0; i < N; i++) {
    const p = pts[i], a = pts[(i + N - 1) % N], b = pts[(i + 1) % N];
    const u = [a[0] - p[0], a[1] - p[1]], v = [b[0] - p[0], b[1] - p[1]], lu = Math.hypot(...u), lv = Math.hypot(...v);
    const bis = [u[0] / lu + v[0] / lv, u[1] / lu + v[1] / lv], lb = Math.hypot(...bis);
    const half = Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (lu * lv)))) / 2;
    // only convex corners are pushed out; the point is placed by its outer edge
    const push = radii[i] ? radii[i] * (1 / Math.sin(half) - 1) - g.h : 0;
    out.push(lb < 1e-6 ? p : [p[0] - (bis[0] / lb) * push, p[1] - (bis[1] / lb) * push]);
  }
  return out;
}
// Four-point sparkle about (cx, cy): its points reach R (outer edge; for a solid, its own edge),
// k is the waist. The rounding of a sharp point takes some length back, so the points are
// drawn out until the rounded outline reaches R.
function sparkle(g, cx, cy, R, { k = 0.36, tip = 0.9, waist = 0.5, solidForm = false } = {}) {
  const h = solidForm ? 0 : g.h, radii = Array.from({ length: 8 }, (_, i) => (i % 2 ? waist : tip));
  const path = (Rv) => g.polygon(Array.from({ length: 8 }, (_, i) => {
    const a = ((-90 + i * 45) * Math.PI) / 180, r = i % 2 ? R * k : Rv;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }), radii);
  // the top of the outline: the path is lines and cubic curves, sampled
  const top = (d) => {
    const t = d.match(/[MLCZ]|-?[\d.]+/g); let i = 0, x = 0, y = 0, c = '', m = Infinity;
    while (i < t.length) {
      if (/[MLCZ]/.test(t[i])) c = t[i++];
      if (c === 'Z') continue;
      if (c === 'C') {
        const q = [x, y, +t[i], +t[i + 1], +t[i + 2], +t[i + 3], +t[i + 4], +t[i + 5]]; i += 6;
        for (let k = 0; k <= 20; k++) { const u = k / 20, v = 1 - u; m = Math.min(m, v ** 3 * q[1] + 3 * v * v * u * q[3] + 3 * v * u * u * q[5] + u ** 3 * q[7]); }
        x = q[6]; y = q[7];
      } else { x = +t[i]; y = +t[i + 1]; i += 2; m = Math.min(m, y); }
    }
    return m;
  };
  let Rv = R;
  for (let j = 0; j < 8; j++) Rv += R - (cy - top(path(Rv)) + h);
  return path(Rv);
}
// The kite of a pointer: tip at T, length L along the diagonal, notch and wings by ratio.
function kite(g, T, L) {
  const u = Math.SQRT1_2, q = (a, b) => [T[0] + (a * u - b * u) * L, T[1] + (a * u + b * u) * L];
  // along the axis a, across b (positive b to the lower left)
  const pts = [[0, 0], [0.98, -0.42], [0.72, 0], [0.98, 0.42]].map(([a, b]) => q(a, b));
  return g.polygon(pts, [1.1, 1.1, 0.4, 1.1]);
}
// A hand seen from the back, as one closed outline: fingers side by side (x edges xs, each
// topped by a half circle, its top at the outer y of tops), the thumb at 45° to the upper left,
// the palm with a round heel. Between two fingers the outline has no gap: a short slit line
// (a detail) runs down from the lower finger top.
// fill: the ink between the two slits (a finger) stays one stroke wide. At heavy strokes the slits
// get narrower than a stroke (round-ended slots, same length), as gaps between fingers.
function hand(g, xs, tops, slit, fill = false) {
  const { h } = g, rt = 1.75, T = [2 + h + rt, 11.25], b = 22 - h, xr = xs[xs.length - 1];
  const tan = (Q, side) => {
    const dx = Q[0] - T[0], dy = Q[1] - T[1], L = Math.hypot(dx, dy), phi = Math.atan2(dy, dx), al = Math.acos(rt / L);
    return [T[0] + rt * Math.cos(phi + side * al), T[1] + rt * Math.sin(phi + side * al)];
  };
  const p = (q) => `${n(q[0])} ${n(q[1])}`, J = [xs[0], 12], H = [xs[0], 18];
  const ys = tops.map((t, i) => t + h + (xs[i + 1] - xs[i]) / 2);
  let d = `M${p(J)}`;
  ys.forEach((y, i) => { const r = n((xs[i + 1] - xs[i]) / 2); d += `V${n(y)}A${r} ${r} 0 0 1 ${n(xs[i + 1])} ${n(y)}`; });
  d += `V14A7 7 0 0 1 ${n(xr - 7)} ${n(b)}H12A4 4 0 0 1 ${p(H)}L${p(tan(H, 1))}A${rt} ${rt} 0 0 1 ${p(tan(J, -1))}Z`;
  const w = fill ? Math.min(g.s, xs[2] - xs[1] - g.s) : g.s;
  const slits = ys.slice(1).map((y, i) => (w < g.s
    ? g.area(xs[i + 1] - w / 2, Math.max(y, ys[i]) - h, w, slit - Math.max(y, ys[i]) + g.s, w / 2)
    : g.seg(xs[i + 1], Math.max(y, ys[i]), xs[i + 1], slit)));
  return { d, slits: slits.join(''), solid: w < g.s };
}
// The two halves of the link (icons.mjs link) in local coordinates, mapped by f.
function linkHalves(g, f, { len = 20, ht = 10, ex = null } = {}) {
  const { h } = g, y0 = -ht / 2 + h, y1 = ht / 2 - h, r = (y1 - y0) / 2, lx = -len / 2 + h + r, e = ex ?? 10.25 - 12 - (g.s - 2) * 0.5;
  const p = (x, y) => { const [X, Y] = f(x, y); return `${n(X)} ${n(Y)}`; };
  return {
    left: `M${p(e, y0)}L${p(lx, y0)}A${n(r)} ${n(r)} 0 0 0 ${p(lx, y1)}L${p(e, y1)}`,
    right: `M${p(-e, y0)}L${p(-lx, y0)}A${n(r)} ${n(r)} 0 0 1 ${p(-lx, y1)}L${p(-e, y1)}`,
    r, y0, y1, lx, e
  };
}

// The seal of badge-verified (security.mjs): sixteen corners, the eight points and the inner
// corners rounded.
function seal(g) {
  const { h } = g, Ro = 10.8 - h, Ri = 8.4 - h, pts = [];
  for (let i = 0; i < 16; i++) { const a = ((i * 22.5 - 90) * Math.PI) / 180, r = i % 2 ? Ri : Ro; pts.push([12 + r * Math.cos(a), 12 + r * Math.sin(a)]); }
  return g.polygon(pts, pts.map((_, i) => (i % 2 ? 1.6 : 1.8)));
}
// The octagon of shapes.mjs: flat sides on 2 and 22.
const octagon = (g) => ngon(g, 8, 10 / Math.cos(Math.PI / 8), 12, 12, -67.5, 2.5);
// The diamond of shapes.mjs.
const DIAMOND = (g) => ngon(g, 4, 11.95, 12, 12, -90, 3.5);
// The marks of circle-plus and circle-x (icons.mjs), for the same marks in other outlines.
const plusMark = (g, k = plusK(g)) => g.seg(12, 12 - k, 12, 12 + k) + g.seg(12 - k, 12, 12 + k, 12);
const xMark = (g) => { const k = 3.75 - 0.6 * (g.s - 1.75); return g.seg(12 - k, 12 - k, 12 + k, 12 + k) + g.seg(12 + k, 12 - k, 12 - k, 12 + k); };
// In a seal (inside its eight points) i sits shorter: the dot lower, the stem shorter.
function infoMark(g, ctx, on) {
  const d = g.s - 2, k = 1 - d * 0.27, r = g.dr * k, y0 = 12.25 + d * 1.5, top = y0 - g.h;
  const cy0 = 8.1 + d * 1.2, cy = ctx?.variant === 'fill' ? Math.min(cy0, top - g.s - r) : cy0;
  return [solid(g.dot(12, cy, k), { n: 'dot', role: P, on }), line(g.seg(12, y0, 12, 16.75 - d * 1.4), { n: 'stem', role: P, on })];
}
// A seal's marks stay clear of its inner corners: shorter arms than in a circle.
const sealK = (g) => plusK(g) - 0.35 - Math.max(0, g.s - 2);
// A circled icon's layers with its ring swapped for another outline d, named nm.
const reshell = (L, d, nm) => L.map((l) => (l.n === 'ring' ? { ...l, d, n: nm } : l.on === 'ring' ? { ...l, on: nm } : l));
// In a square (checkbox's box) the marks keep 1.5 clear of the sides: shorter than in a circle.
const BOX = (g) => g.box(3, 3, 18, 18, 4.5);
const plusSq = (g) => 8.95 - g.s - g.clear - g.h;
// The selected dot of a radio button: solid, its meaning is a filled choice (as star-half's half).
// In the fill the dot is the disc's own ink, set off by a ring cut round it.
const radioDot = (g) => 3 + (g.s - 2) * 0.5;
function radio(g, ctx, on) {
  const r = radioDot(g);
  return ctx?.variant === 'fill'
    ? [line(g.circ(12, 12, n(r + g.h)), { n: 'hole', role: P, on })]
    : [solid(g.circ(12, 12, n(r)), { n: 'dot', role: P, on })];
}

// Bases drawn in icons.mjs (bookmark, flag, star), repeated here with the same drawing for their
// variants made by rule; set files cannot import icons.mjs, which imports them.
const BOOKMARK = {
  name: 'bookmark', label: '书签', key: 'portrait', fit: 'y',
  plan: '主体：书签带，底部 V 形缺口，缺口顶点是尖的；两条尾巴的外角倒圆',
  weights: { [P]: 1 },
  draw(g) {
    const { h } = g, x0 = 5 + h, x1 = 19 - h, y0 = 2 + h, yb = 22 - h, c = 3.5 - h, w = 3.6, dep = 3.4 + h * 0.4;
    return [shell(g.polygon([[x0, y0], [x1, y0], [x1, yb], [12 + w, yb], [12, yb - dep], [12 - w, yb], [x0, yb]], [c, c, 1.4, 0.6, 0, 0.6, 1.4]), { n: 'bookmark', role: P })];
  },
  allow: { keyline: '书签本身窄，宽 14' }
};
const FLAG = {
  name: 'flag', anchor: 'base', label: '标记', key: 'square',
  plan: '主体：旗面（燕尾缺口）；辅助：旗杆（一条线，占一成）',
  weights: { [P]: 0.89, [S]: 0.11 },
  draw(g) { return [line(g.span(5, 3, 5, 21), { n: 'pole', role: S }), shell(flagCloth(g), { n: 'cloth', role: P })]; },
  allow: { keyline: '旗杆立在左侧 5 处，旗面向右展开' }
};
const STAR = {
  name: 'star', nudge: [0, -0.6], label: '收藏', key: 'circle',
  plan: '主体：五角星，一个闭合形',
  weights: { [P]: 1 },
  draw(g) { return [shell(star(g), { n: 'star', role: P })]; }
};
const SLASHED = { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' };
// Marks in the bookmark's ribbon: centred above the notch, 1.5 clear of the sides.
const RIB = 10;
const ribbonK = (g) => 7 - g.s - g.h - g.clear;

const SET = {
  check: {
    label: '对勾', key: 'square', fit: 'x',
    plan: '主体：对勾，与“完成”圆圈里的对勾同形，放大到方形参考线的宽度',
    weights: { [P]: 1 },
    draw(g) {
      const k = (18 - g.s) / 9.4;
      return [line(g.pl(CHECK.map(([x, y]) => [12 + (x - 12) * k, 11.7 + (y - 12.35) * k])), { n: 'check', role: P })];
    },
    fx: { t: 'draw', on: ['check'] }
  },
  x: {
    label: '叉号', key: 'square',
    plan: '主体：叉号，与“关闭”圆圈里的叉号同形。斜线比横竖线显长，外框取 16，比加号小一圈',
    weights: { [P]: 1 },
    draw(g) { const k = 7 - g.h; return [line(g.seg(12 - k, 12 - k, 12 + k, 12 + k) + g.seg(12 + k, 12 - k, 12 - k, 12 + k), { n: 'x', role: P })]; },
    fx: { t: 'rotate', on: ['x'], deg: 90, o: [12, 12] },
    allow: { keyline: '叉号是两条斜线，填满方框会比加号显得大，外框取 16' }
  },
  plus: {
    label: '加号', key: 'square',
    plan: '主体：加号，与“添加”圆圈里的加号同形，放大到方形参考线',
    weights: { [P]: 1 },
    draw(g) { return [line(g.span(12, 3, 12, 21) + g.span(3, 12, 21, 12), { n: 'plus', role: P })]; },
    fx: { t: 'rotate', on: ['plus'], deg: 90, o: [12, 12] }
  },
  minus: {
    label: '减号', key: 'square', fit: 'x',
    plan: '主体：减号，与加号的横线同长',
    weights: { [P]: 1 },
    draw(g) { return [line(g.span(3, 12, 21, 12), { n: 'minus', role: P })]; },
    fx: { t: 'keys', on: ['minus'], o: [12, 12], sx: [0.55], ms: 260 }
  },
  filter: {
    nudge: [0, 1],
    label: '筛选', key: 'square', fit: 'x',
    plan: '主体：三条逐行变短的横线，行距与列表相同（7）。上宽下窄，分量在上，整体下移 1',
    weights: { [P]: 1 },
    draw(g) { return [[6, 3, 21], [13, 6.5, 17.5], [20, 10, 14]].map(([y, a, b], i) => line(g.span(a, y, b, y), { n: `l${i}`, role: P })); },
    // 筛选: the lines draw in toward the middle, as a list is narrowed down
    fx: { t: 'keys', on: ['l0', 'l1', 'l2'], by: true, o: [12, 13], sx: [0.6], stagger: 80, ms: 240 }
  },
  sort: {
    label: '排序', key: 'square',
    light: [],
    plan: '主体：向上和向下两个箭头并排，箭头头部 45°，比下载的箭头小一号（两个头部要错开）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, L = 4, t = 3 + h, b = 21 - h;
      return [
        line(g.seg(8, t, 8, b) + g.pl([[8 - L, t + L], [8, t], [8 + L, t + L]]), { n: 'up', role: P }),
        line(g.seg(16, b, 16, t) + g.pl([[16 - L, b - L], [16, b], [16 + L, b - L]]), { n: 'down', role: P })
      ];
    },
    fx: [{ t: 'keys', on: ['up'], y: [-1.4, 0.3] }, { t: 'keys', on: ['down'], y: [1.4, -0.3] }]
  },
  'star-half': {
    nudge: [0, -0.6],
    label: '半星评分', key: 'circle',
    plan: '主体：五角星轮廓（与收藏同形），左半实心。实心是这个图标的含义（半颗星），不是细节',
    weights: { [P]: 1 },
    draw(g) {
      // the left half of the star's centre line, filled: the outline covers its edge
      const cy = 12.25, R = 9.4, k = 0.5, tip = 1.1, Rc = R - g.h + tip * (1 / Math.sin(Math.PI / 10) - 1), pts = [];
      for (const i of [5, 6, 7, 8, 9, 10]) {
        const a = ((-90 + i * 36) * Math.PI) / 180, rr = i % 2 ? Rc * k : Rc;
        pts.push([12 + rr * Math.cos(a), cy + rr * Math.sin(a)]);
      }
      // the top point is cut where its rounded tip crosses the middle
      pts[5] = [12, cy - Rc + tip * (1 / Math.sin(Math.PI / 10) - 1)];
      return [
        solid(g.polygon(pts, [0, tip, 0.9, tip, 0.9, 0]), { n: 'half', role: P, part: 'star' }),
        line(star(g), { n: 'star', role: P, part: 'star' })
      ];
    },
    fx: { t: 'keys', on: 'all', o: [12, 12.25], s: [0.84, 1.08] }
  },
  sparkles: {
    label: '智能生成', key: 'live',
    plan: '主体：大的四角星；辅助：右上的小四角星（实心：太小，画成线框内部会闭合）。小星是实心，墨量只占一成',
    weights: { [P]: 0.9, [S]: 0.1 },
    draw(g) {
      return [
        shell(sparkle(g, 11, 13, 9), { n: 'big', role: P }),
        solid(sparkle(g, 19, 5, 3, { k: 0.42, tip: 0.35, waist: 0.2, solidForm: true }), { n: 'small', role: S })
      ];
    },
    fx: [{ t: 'keys', on: ['big'], o: [11, 13], s: [0.82, 1.05] }, { t: 'keys', on: ['small'], o: [19, 5], s: [1.3, 0.6], ms: 380 }]
  },
  pin: {
    label: '固定', key: 'portrait',
    plan: '主体：图钉的帽、颈和底座（一个闭合形）；辅助：钉针。钉针只是一条短线，占不到一成；帽比底座窄，分量才不至于偏上',
    weights: { [P]: 0.93, [S]: 0.07 },
    draw(g) {
      const { h } = g, t = 2 + h, cl = 7 + h, cr = 17 - h, cb = 7, nl = 9, nr = 15, fy = 11, fl = 4 + h, fr = 20 - h, fb = 18 - h, fs = 15;
      return [
        line(g.seg(12, fb, 12, 22 - h), { n: 'needle', role: S }),
        shell(g.polygon([[cl, t], [cr, t], [cr, cb], [nr, cb], [nr, fy], [fr, fs], [fr, fb], [fl, fb], [fl, fs], [nl, fy], [nl, cb], [cl, cb]],
          [1.25, 1.25, 0.75, 0, 0, 1.2, 1, 1, 1.2, 0, 0, 0.75]), { n: 'head', role: P })
      ];
    },
    // 固定: the pin is lifted, then pressed in
    fx: { t: 'keys', on: 'all', y: [-1.2, 0.6] }
  },
  'link-2': {
    label: '链接 2', key: 'live',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：两个链环（与链接同形，转 45°）；辅助：连接杆',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      // the link of icons.mjs turned to the diagonal, sized so it spans the live area
      const u = Math.SQRT1_2, f = (x, y) => [12 + x * u + y * u, 12 - x * u + y * u];
      const L = linkHalves(g, f, LINK2);
      const [a, b] = [f(-4.5, 0), f(4.5, 0)];
      return [line(L.left, { n: 'left', role: P }), line(L.right, { n: 'right', role: P }), line(g.seg(a[0], a[1], b[0], b[1]), { n: 'bar', role: S })];
    },
    area: (g) => {
      const u = Math.SQRT1_2, f = (x, y) => [12 + x * u + y * u, 12 - x * u + y * u];
      const L = linkHalves(g, f, LINK2), x0 = L.lx - L.r;
      return [
        { n: 'left', d: g.polygon([[x0, L.y0], [L.e, L.y0], [L.e, L.y1], [x0, L.y1]].map(([x, y]) => f(x, y)), [L.r, 0, 0, L.r]) },
        { n: 'right', d: g.polygon([[-L.e, L.y0], [-x0, L.y0], [-x0, L.y1], [-L.e, L.y1]].map(([x, y]) => f(x, y)), [0, L.r, L.r, 0]) }
      ];
    },
    fx: [{ t: 'keys', on: ['left'], x: [-0.7, 0.15], y: [0.7, -0.15] }, { t: 'keys', on: ['right'], x: [0.7, -0.15], y: [-0.7, 0.15] }]
  },
  unlink: {
    label: '取消链接', key: 'landscape', fit: 'x',
    plan: '主体：链接的两个链环，拉开、去掉连接杆；辅助：上下两道断开的短线',
    weights: { [P]: 0.82, [S]: 0.18 },
    draw(g) {
      const L = linkHalves(g, (x, y) => [12 + x, 12 + y], { ex: -3.5 });
      return [
        line(L.left, { n: 'left', role: P }),
        line(L.right, { n: 'right', role: P }),
        line(g.span(12, 2.5, 12, 6) + g.span(12, 18, 12, 21.5), { n: 'break', role: S })
      ];
    },
    area: (g) => {
      const L = linkHalves(g, (x, y) => [12 + x, 12 + y], { ex: -3.5 }), x0 = 12 + L.lx - L.r, e = 12 + L.e;
      return [{ n: 'left', d: g.rr(x0, 12 + L.y0, e - x0, L.y1 - L.y0, [L.r, 0, 0, L.r]) }, { n: 'right', d: g.rr(24 - e, 12 + L.y0, e - x0, L.y1 - L.y0, [0, L.r, L.r, 0]) }];
    },
    fx: [{ t: 'keys', on: ['left'], x: [-0.9, 0.2] }, { t: 'keys', on: ['right'], x: [0.9, -0.2] }, { t: 'keys', on: ['break'], o: [12, 12], sy: [1.15, 1] }],
    swap: 'link'
  },
  paperclip: {
    label: '附件', key: 'portrait', fit: 'y',
    plan: '主体：回形针（四条竖线和三段半圆连成一笔，线距 4）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, by = 15, R = 6, top = 2 + h + 4, bot = 22 - h;
      // outer loop round the bottom (radius to the outer edge), top loop, inner loop
      const Rb = bot - by;
      return [line(`M14 8V${by}A2 2 0 0 1 10 ${by}V${n(top)}A4 4 0 0 1 18 ${n(top)}V${by}A${n(Rb)} ${n(Rb)} 0 0 1 ${n(18 - 2 * Rb)} ${by}V${n(top - 0.5)}`, { n: 'clip', role: P })];
    },
    fx: { t: 'keys', on: 'all', y: [1.2, -0.3] }
  },
  'circle-alert': {
    label: '提醒', key: 'circle',
    plan: '主体：感叹号（竖和点，与信息的 i 上下对调）；辅助：外圈',
    weights: { [P]: 0.18, [S]: 0.82 },
    draw(g, ctx) {
      const d = g.s - 2, k = 1 - d * 0.27, y0 = 6.5 + d, y1 = 12.5 - d * 1.5, yd = 16.75 - d * 1.5;
      // fill: the stem and the dot (two holes) keep one stroke apart; they move apart evenly
      const e = ctx?.variant === 'fill' ? Math.max(0, g.s - (yd - g.dr * k - y1 - g.h)) / 2 : 0;
      return [
        shell(g.ring(12, 12, 10), { n: 'ring', role: S }),
        line(g.seg(12, y0 - e, 12, y1 - e), { n: 'stem', role: P, on: 'ring' }),
        solid(g.dot(12, yd + e, k), { n: 'dot', role: P, on: 'ring' })
      ];
    },
    fx: { t: 'shake', on: ['stem', 'dot'], x: 0.8 }
  },
  'circle-help': {
    label: '帮助', key: 'circle',
    plan: '主体：问号（四分之三圆的钩、短竖和点）；辅助：外圈。问号上下各离外圈 1.5，与信息的 i 同高',
    weights: { [P]: 0.24, [S]: 0.76 },
    draw(g, ctx) {
      const { s, h } = g, d = s - 2, C = g.clear;
      let top = 2 + s + C + 0.1, bottom = 22 - s - C, rh = 2.5 - d * 0.4, a0 = 195, gap = C;
      const r = g.dr * (1 - d * 0.27);
      if (ctx?.variant === 'fill') {
        // Fill: the stem and the dot (two holes) keep one stroke apart, and the ink inside the
        // hook stays one stroke across with its neck (between the hook's end and the stem) at
        // least 0.85 of a stroke: at heavy strokes the hook keeps its size and ends a little
        // higher. The question mark stays centred where it was.
        const L = bottom - 2 * r - C - h - (top + h + 2 * rh), mid = (top + bottom) / 2;
        rh = Math.max(rh, s); gap = Math.max(C, s);
        a0 = Math.max(a0, 90 + (2 * Math.asin(Math.min(1, (1.85 * s) / (2 * rh))) * 180) / Math.PI);
        const T = h + 2 * rh + L + h + gap + 2 * r;
        top = mid - T / 2; bottom = mid + T / 2;
      }
      const cy = bottom - r, stemEnd = cy - r - gap - h, hy = top + h + rh;
      return [
        shell(g.ring(12, 12, 10), { n: 'ring', role: S }),
        line(g.arc(12, hy, rh, a0, 450) + `V${n(stemEnd)}`, { n: 'hook', role: P, on: 'ring' }),
        solid(g.circ(12, cy, n(r)), { n: 'dot', role: P, on: 'ring' })
      ];
    },
    fx: { t: 'wiggle', on: ['hook', 'dot'], o: [12, 17], deg: 12, hz: 2.4 }
  },
  'circle-minus': {
    label: '移除', key: 'circle',
    plan: '主体：减号（与添加的加号横线同长）；辅助：外圈',
    weights: { [P]: 0.17, [S]: 0.83 },
    draw(g) { const k = plusK(g); return [shell(g.ring(12, 12, 10), { n: 'ring', role: S }), line(g.seg(12 - k, 12, 12 + k, 12), { n: 'minus', role: P, on: 'ring' })]; },
    fx: { t: 'draw', on: ['minus'] },
  },
  'triangle-alert': {
    label: '警告', key: 'live', fit: 'x',
    plan: '主体：感叹号（竖和点）；辅助：圆角三角形。三角形按重心上移，底边在 20；感叹号放在三角形内部空间的中间',
    weights: { [P]: 0.14, [S]: 0.86 },
    allow: { primary: '三角形内部窄，感叹号只能这么大，约占一成半；层级仍是最高' },
    draw(g, ctx) {
      const { s, h } = g, d = s - 2, C = g.clear, base = 20 - h, rc = 2.5;
      // vertices placed so the rounded outline reaches x 2..22, top 2, base 20 (outer edges)
      let ya = 0, xr = 22;
      for (let k = 0; k < 20; k++) {
        const al = Math.atan2(base - ya, xr - 12);
        xr = 22 - h - rc + rc / Math.tan(al / 2);
        ya = 2 + h + rc - rc / Math.sin(Math.PI / 2 - al);
      }
      const tri = [[12, ya], [xr, base], [24 - xr, base]];
      const r = g.dr * (1 - d * 0.27);
      // fill: the stem and the dot (two holes) keep one stroke apart: the dot moves down, keeping
      // one stroke above the base outside; the stem's end moves up for whatever is left
      const need = ctx?.variant === 'fill' ? Math.max(0, s - C) : 0, e = Math.min(need, C), y0 = 20 - s - C - r;
      const cy = y0 + e, stemEnd = y0 - r - C - h - (need - e);
      return [
        shell(g.polygon(tri, [rc, rc, rc]), { n: 'tri', role: S }),
        line(g.seg(12, 7.5 + d * 1.8, 12, stemEnd), { n: 'stem', role: P, on: 'tri' }),
        solid(g.circ(12, cy, n(r)), { n: 'dot', role: P, on: 'tri' })
      ];
    },
    fx: { t: 'shake', on: ['stem', 'dot'], x: 0.8 }
  },
  ban: {
    label: '禁止', key: 'circle',
    ends: 'in',
    light: [], // one sign: no part of it changes tone
    plan: '主体：圆环和从左上到右下的斜杠（一个禁止标志，斜杠两端接到圆环）',
    weights: { [P]: 1 },
    draw(g) { const k = (10 - g.h) / Math.SQRT2; return [shell(g.ring(12, 12, 10), { n: 'ring', role: P }), line(g.seg(12 - k, 12 - k, 12 + k, 12 + k), { n: 'bar', role: P, on: 'ring' })]; },
    fx: { t: 'draw', on: ['bar'] }
  },
  checkbox: {
    label: '复选框', key: 'square',
    plan: '主体：对勾（与完成的对勾同形同大）；辅助：方框（与日历同框）',
    weights: { [P]: 0.22, [S]: 0.78 },
    draw(g) { return [shell(g.box(3, 3, 18, 18, 4.5), { n: 'box', role: S }), line(g.pl(checkIn(g)), { n: 'check', role: P, on: 'box' })]; },
    fx: { t: 'draw', on: ['check'] },
    swap: 'toggle'
  },
  toggle: {
    label: '切换开关', key: 'landscape', fit: 'x',
    plan: '主体：滑钮（圆环，位置表示开）；辅助：胶囊形外框。滑钮与外框右端同心，随字重缩小，留出间距',
    weights: { [P]: 0.25, [S]: 0.75 },
    draw(g) { return [shell(g.box(2, 5, 20, 14, 7), { n: 'track', role: S }), shell(g.ring(15, 12, 3.5 - (g.s - 2) * 0.5), { n: 'knob', role: P, on: 'track' })]; },
    // 切换: the knob slides to off and springs back on
    fx: { t: 'keys', on: ['knob'], x: [-6, -6, 0] },
    swap: 'checkbox'
  },
  menu: {
    label: '菜单', key: 'square', fit: 'x',
    plan: '主体：三条等长横线，行距与列表相同（7）',
    weights: { [P]: 1 },
    draw(g) { return [5, 12, 19].map((y, i) => line(g.span(3, y, 21, y), { n: `l${i}`, role: P })); },
    // 展开菜单: the outer lines part and come back
    fx: [{ t: 'keys', on: ['l0'], y: [-1.2, 0.2] }, { t: 'keys', on: ['l2'], y: [1.2, -0.2] }]
  },
  'more-horizontal': {
    label: '更多', key: 'square', fit: 'x',
    plan: '主体：三个实心圆点（圆点太小，画不出线框）',
    weights: { [P]: 1 },
    draw(g) { return [5, 12, 19].map((x, i) => solid(g.dot(x, 12, 1.25), { n: `d${i}`, role: P, vc: i })); },
    fx: { t: 'variable', on: ['d0', 'd1', 'd2'], mode: 'iterative' }
  },
  'more-vertical': {
    label: '更多操作', key: 'square', fit: 'y',
    plan: '主体：三个实心圆点，竖排',
    weights: { [P]: 1 },
    draw(g) { return [5, 12, 19].map((y, i) => solid(g.dot(12, y, 1.25), { n: `d${i}`, role: P, vc: i })); },
    fx: { t: 'variable', on: ['d0', 'd1', 'd2'], mode: 'iterative' }
  },
  maximize: {
    label: '全屏', key: 'square',
    light: [],
    plan: '主体：指向左上和右下的两个箭头（头部是贴着方框角的直角，45° 的箭头头部）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, a = 3 + h, b = 21 - h, L = 6;
      return [
        line(g.pl([[a + L, a], [a, a], [a, a + L]]) + g.seg(a, a, 10.25, 10.25), { n: 'tl', role: P }),
        line(g.pl([[b - L, b], [b, b], [b, b - L]]) + g.seg(b, b, 13.75, 13.75), { n: 'br', role: P })
      ];
    },
    fx: [{ t: 'keys', on: ['tl'], x: [-0.9, 0.2], y: [-0.9, 0.2] }, { t: 'keys', on: ['br'], x: [0.9, -0.2], y: [0.9, -0.2] }],
    swap: 'minimize'
  },
  minimize: {
    label: '退出全屏', key: 'square',
    light: [],
    plan: '主体：从两角指向中间的两个箭头（与全屏同样的头部）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, a = 3 + h, b = 21 - h, L = 6, p = 10, q = 14;
      return [
        line(g.pl([[p - L, p], [p, p], [p, p - L]]) + g.seg(p, p, a, a), { n: 'tl', role: P }),
        line(g.pl([[q + L, q], [q, q], [q, q + L]]) + g.seg(q, q, b, b), { n: 'br', role: P })
      ];
    },
    fx: [{ t: 'keys', on: ['tl'], x: [0.9, -0.2], y: [0.9, -0.2] }, { t: 'keys', on: ['br'], x: [-0.9, 0.2], y: [-0.9, 0.2] }],
    swap: 'maximize'
  },
  'zoom-in': {
    label: '放大', key: 'square',
    light: ['plus'],
    plan: '主体：镜片里的加号；辅助：放大镜（与搜索同形）。加号离镜片 1.5，居中在镜片圆心 (10, 10)，落在整像素上',
    weights: { [P]: 0.2, [S]: 0.8 },
    draw(g) { const { c } = LENS, k = lensMark(g); return [...lens(g), line(g.seg(c, c - k, c, c + k) + g.seg(c - k, c, c + k, c), { n: 'plus', role: P, on: 'lens' })]; },
    // 放大: the lens grows round its mark
    fx: { t: 'keys', on: ['lens', 'plus'], o: [10, 10], s: [1.12, 0.98] },
    swap: 'zoom-out'
  },
  'zoom-out': {
    label: '缩小', key: 'square',
    light: ['minus'],
    plan: '主体：镜片里的减号；辅助：放大镜（与搜索同形）',
    weights: { [P]: 0.12, [S]: 0.88 },
    draw(g) { const { c } = LENS, k = lensMark(g); return [...lens(g), line(g.seg(c - k, c, c + k, c), { n: 'minus', role: P, on: 'lens' })]; },
    fx: { t: 'keys', on: ['lens', 'minus'], o: [10, 10], s: [0.86, 1.02] },
    swap: 'zoom-in',
    allow: { primary: '镜片里只有一条短横线，墨量本来就少；层级仍是最高' }
  },
  loader: {
    label: '加载', key: 'circle',
    plan: '主体：八道放射短线（与晴的光芒同样的线头），依次点亮表示进行中',
    weights: { [P]: 1 },
    draw(g) {
      return Array.from({ length: 8 }, (_, i) => {
        const a = ((-90 + i * 45) * Math.PI) / 180, c = Math.cos(a), s0 = Math.sin(a);
        return line(g.span(12 + 4.5 * c, 12 + 4.5 * s0, 12 + 10 * c, 12 + 10 * s0), { n: `r${i}`, role: P, vc: i });
      });
    },
    fx: { t: 'variable', on: ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7'], mode: 'iterative', step: 90 }
  },
  command: {
    label: '命令键', key: 'square',
    plan: '主体：⌘ 符号（四条直线围成中间的方块，四角各一个四分之三圆的环），一笔画成',
    weights: { [P]: 1 },
    draw(g) {
      const a = 9, b = 15, r = (a - 3 - g.h) / 2, lo = a - r, hi = b + r, R = n(r);
      return [line(`M${b} ${n(lo)}V${n(hi)}A${R} ${R} 0 1 0 ${n(hi)} ${b}H${n(lo)}A${R} ${R} 0 1 0 ${a} ${n(hi)}V${n(lo)}A${R} ${R} 0 1 0 ${n(lo)} ${a}H${n(hi)}A${R} ${R} 0 1 0 ${b} ${n(lo)}`, { n: 'cmd', role: P })];
    },
    // 按下按键
    fx: { t: 'keys', on: 'all', o: [12, 12], s: [0.86], ms: 200 }
  },
  option: {
    nudge: [0, 1],
    label: 'Option 键', key: 'square',
    plan: '主体：⌥ 符号的折线（上横、斜线、下横）；辅助：右上的短横。上面两段横线，分量在上，整体下移 1',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const { h } = g, t = 4 + h, b = 22 - h;
      return [line(g.pl([[3 + h, t], [9, t], [15, b], [21 - h, b]]), { n: 'path', role: P }), line(g.span(14, t, 21, t), { n: 'bar', role: S })];
    },
    fx: { t: 'draw', on: ['path', 'bar'] }
  },
  cursor: {
    nudge: [0.6, 0.6],
    label: '指针', key: 'square',
    plan: '主体：箭头形指针（尖朝左上，尾部内凹）。分量在尖的一侧，整体向右下移 0.6',
    weights: { [P]: 1 },
    draw(g) { return [shell(kite(g, [2.65 + g.h, 2.65 + g.h], 21.6 - g.s), { n: 'arrow', role: P })]; },
    // 指向: the pointer moves toward its tip and back
    fx: { t: 'keys', on: 'all', x: [-1.1, 0.3], y: [-1.1, 0.3] }
  },
  pointer: {
    label: '手型', key: 'live', fit: 'y',
    plan: '主体：手（竖起的食指、两个弯着的手指、拇指和手掌，一个闭合形）；细节：手指之间的两道短线',
    weights: { [P]: 0.9, [D]: 0.1 },
    draw(g, ctx) {
      const H = hand(g, [8, 12, 16, 20], [2, 9, 10], 15.5, ctx?.variant === 'fill');
      return [shell(H.d, { n: 'hand', role: P }), (H.solid ? solid : line)(H.slits, { n: 'slits', role: D, on: 'hand' })];
    },
    // 点按: the finger taps down and comes back
    fx: { t: 'keys', on: 'all', o: [12, 22], s: [0.9], y: [0.4], ms: 200 },
  },
  'mouse-pointer-click': {
    label: '点击', key: 'live',
    plan: '主体：指针（与指针同形，缩小，尖在左上）；辅助：尖外三道短线表示点击',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      const T = 10, r0 = 5, r1 = 7.25;
      const ray = (deg) => { const a = (deg * Math.PI) / 180, c = Math.cos(a), s0 = Math.sin(a); return g.seg(T + r0 * c, T + r0 * s0, T + r1 * c, T + r1 * s0); };
      return [shell(kite(g, [T + 0.5, T + 0.5], 13.1), { n: 'arrow', role: P }), line(ray(-90) + ray(-135) + ray(180), { n: 'rays', role: S })];
    },
    // 点击: the pointer presses in and the rays flash out
    fx: [{ t: 'keys', on: ['arrow'], o: [11, 11], s: [0.88], ms: 180 }, { t: 'keys', on: ['rays'], o: [10, 10], s: [0.75, 1.08], ms: 260 }]
  },
  'hand-grab': {
    label: '抓取', key: 'live', fit: 'y',
    plan: '主体：张开的手（三个手指、拇指和手掌，一个闭合形）；细节：手指之间的两道短线（手指伸直，缝更长，占近两成）',
    weights: { [P]: 0.82, [D]: 0.18 },
    draw(g, ctx) {
      const H = hand(g, [8, 12, 16, 20], [4, 2, 4], 12.5, ctx?.variant === 'fill');
      return [shell(H.d, { n: 'hand', role: P }), (H.solid ? solid : line)(H.slits, { n: 'slits', role: D, on: 'hand' })];
    },
    // 抓取: the hand closes a little and lets go
    fx: { t: 'keys', on: 'all', o: [12, 22], sy: [0.86], sx: [0.95], ms: 220 }
  },
  'circle-dot': {
    label: '单选', key: 'circle',
    light: ['dot'],
    plan: '主体：选中点（实心，含义就是选中填满）；辅助：外圈。点随字重变大，离外圈至少 4',
    weights: { [P]: 0.2, [S]: 0.8 },
    draw(g, ctx) { return [shell(g.ring(12, 12, 10), { n: 'ring', role: S }), ...radio(g, ctx, 'ring')]; },
    // 选中: the dot shrinks and pops back in
    fx: { t: 'keys', on: ['dot', 'hole'], o: [12, 12], s: [0.35, 1.12], ms: 300 }
  },
  'circle-ellipsis': {
    label: '更多（圆形）', key: 'circle',
    plan: '主体：三个实心圆点（与更多同排）；辅助：外圈。圆点离外圈和彼此至少 1.5，粗字重下不再变大',
    weights: { [P]: 0.17, [S]: 0.83 },
    draw(g, ctx) {
      const r = Math.min(g.dr, 1.6), sp0 = 4.8 - Math.max(0, g.s - 2) * 0.6;
      // fill: the dots are holes; one stroke of ink stays between them
      const sp = ctx?.variant === 'fill' ? Math.max(sp0, g.s + 2 * r) : sp0;
      return [shell(g.ring(12, 12, 10), { n: 'ring', role: S }), ...[-1, 0, 1].map((k, i) => solid(g.circ(12 + k * sp, 12, n(r)), { n: `d${i}`, role: P, on: 'ring', vc: i }))];
    },
    fx: { t: 'variable', on: ['d0', 'd1', 'd2'], mode: 'iterative' }
  },
  'plus-square': {
    label: '新增', key: 'square',
    plan: '主体：加号；辅助：方框（与复选框同框）。加号离方框 1.5，比圆圈里的短一点',
    weights: { [P]: 0.21, [S]: 0.79 },
    draw(g) { return [shell(BOX(g), { n: 'box', role: S }), line(plusMark(g, plusSq(g)), { n: 'plus', role: P, on: 'box' })]; },
    fx: { t: 'rotate', on: ['plus'], deg: 90, o: [12, 12] }
  },
  'square-minus': {
    label: '移除（方形）', key: 'square',
    plan: '主体：减号（与新增的横线同长）；辅助：方框',
    weights: { [P]: 0.15, [S]: 0.85 },
    draw(g) { const k = plusSq(g); return [shell(BOX(g), { n: 'box', role: S }), line(g.seg(12 - k, 12, 12 + k, 12), { n: 'minus', role: P, on: 'box' })]; },
    fx: { t: 'draw', on: ['minus'] }
  },
  'square-x': {
    label: '关闭（方形）', key: 'square',
    plan: '主体：叉号（与关闭圆圈里的同大）；辅助：方框',
    weights: { [P]: 0.25, [S]: 0.75 },
    draw(g) { return [shell(BOX(g), { n: 'box', role: S }), line(xMark(g), { n: 'x', role: P, on: 'box' })]; },
    fx: { t: 'rotate', on: ['x'], deg: 90, o: [12, 12] }
  },
  'square-dot': {
    label: '选中（方形）', key: 'square',
    light: ['dot'],
    plan: '主体：选中点（与单选同大，实心）；辅助：方框',
    weights: { [P]: 0.2, [S]: 0.8 },
    draw(g, ctx) { return [shell(BOX(g), { n: 'box', role: S }), ...radio(g, ctx, 'box')]; },
    fx: { t: 'keys', on: ['dot', 'hole'], o: [12, 12], s: [0.35, 1.12], ms: 300 }
  },
  badge: {
    label: '认证', key: 'circle',
    plan: '主体：花边徽章（与认证徽章同形，八个圆角尖）',
    weights: { [P]: 1 },
    draw(g) { return [shell(seal(g), { n: 'seal', role: P })]; },
    // 徽章转过八分之一圈，正好转回原样
    fx: [{ t: 'rotate', on: 'all', deg: 45 }, { t: 'keys', on: 'all', o: [12, 12], s: [0.9, 1.04] }]
  },
  'badge-plus': {
    label: '添加徽章', key: 'circle',
    plan: '主体：加号（避开徽章的内角，比添加的加号短一点）；辅助：花边徽章',
    weights: { [P]: 0.25, [S]: 0.75 },
    draw(g) { return [shell(seal(g), { n: 'seal', role: S }), line(plusMark(g, sealK(g)), { n: 'plus', role: P, on: 'seal' })]; },
    fx: [{ t: 'rotate', on: ['seal'], deg: 45 }, { t: 'rotate', on: ['plus'], deg: 90, o: [12, 12] }]
  },
  'badge-minus': {
    label: '移除徽章', key: 'circle',
    plan: '主体：减号（与添加徽章的横线同长）；辅助：花边徽章',
    weights: { [P]: 0.16, [S]: 0.84 },
    draw(g) { const k = sealK(g); return [shell(seal(g), { n: 'seal', role: S }), line(g.seg(12 - k, 12, 12 + k, 12), { n: 'minus', role: P, on: 'seal' })]; },
    fx: [{ t: 'rotate', on: ['seal'], deg: 45 }, { t: 'draw', on: ['minus'] }]
  },
  'badge-info': {
    label: '徽章信息', key: 'circle',
    plan: '主体：字母 i（与信息同形，避开徽章的内角，比信息的矮一点）；辅助：花边徽章',
    weights: { [P]: 0.15, [S]: 0.85 },
    allow: { primary: '徽章的内角收进来，i 只能这么大，约占一成半；层级仍是最高' },
    draw(g, ctx) { return [shell(seal(g), { n: 'seal', role: S }), ...infoMark(g, ctx, 'seal')]; },
    fx: [{ t: 'rotate', on: ['seal'], deg: 45 }, { t: 'bounce', on: ['dot', 'stem'], by: true, amp: 1.1, o: [12, 17.5] }]
  },
  'octagon-alert': {
    label: '错误', key: 'circle',
    plan: '主体：感叹号（与提醒同形）；辅助：八边形（与八边形同形，像停止标志）',
    weights: { [P]: 0.17, [S]: 0.83 },
    draw(g, ctx) { return reshell(SET['circle-alert'].draw(g, ctx), octagon(g), 'oct'); },
    fx: { t: 'shake', on: ['stem', 'dot'], x: 0.8 }
  },
  'octagon-x': {
    label: '停止', key: 'circle',
    plan: '主体：叉号（与关闭的叉号同大）；辅助：八边形',
    weights: { [P]: 0.27, [S]: 0.73 },
    draw(g) { return [shell(octagon(g), { n: 'oct', role: S }), line(xMark(g), { n: 'x', role: P, on: 'oct' })]; },
    fx: { t: 'rotate', on: ['x'], deg: 90, o: [12, 12] }
  },
  'octagon-minus': {
    label: '禁止通行', key: 'circle',
    plan: '主体：减号（与移除的减号同长）；辅助：八边形',
    weights: { [P]: 0.16, [S]: 0.84 },
    draw(g) { const k = plusK(g); return [shell(octagon(g), { n: 'oct', role: S }), line(g.seg(12 - k, 12, 12 + k, 12), { n: 'minus', role: P, on: 'oct' })]; },
    fx: { t: 'draw', on: ['minus'] }
  },
  'toggle-left': {
    label: '开关（关）', key: 'landscape', fit: 'x',
    plan: '主体：滑钮（圆环，在左表示关）；辅助：胶囊形外框。与切换开关同形，滑钮在左端',
    weights: { [P]: 0.25, [S]: 0.75 },
    draw(g) { return [shell(g.box(2, 5, 20, 14, 7), { n: 'track', role: S }), shell(g.ring(9, 12, 3.5 - (g.s - 2) * 0.5), { n: 'knob', role: P, on: 'track' })]; },
    // 打开: the knob slides to on and springs back off
    fx: { t: 'keys', on: ['knob'], x: [6, 6, 0] },
    swap: 'toggle'
  },
  'loader-circle': {
    label: '加载中', key: 'circle',
    plan: '主体：缺一段的圆弧（与圆形同大，缺口 60° 在右上），转动表示进行中',
    weights: { [P]: 1 },
    draw(g) { return [line(g.arc(12, 12, 10 - g.h, -15, 285), { n: 'arc', role: P })]; },
    fx: { t: 'rotate', on: 'all', deg: 360, o: [12, 12] }
  },
  'check-check': {
    label: '已读', key: 'square', fit: 'x',
    light: [],
    plan: '主体：两个并排的对勾（与对勾同形）。后一个的短边收短，离前一个的长边留出间距',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, k = 1.05, B1 = [3 + h + 3.3 * k, 16], C1 = [B1[0] + 6.1 * k, B1[1] - 6.7 * k];
      const dx = 21 - h - C1[0], B2 = [B1[0] + dx, B1[1]];
      // the second check's short arm stops a stroke and a clear gap from the first one's long arm
      const nx = 6.7 / Math.hypot(6.1, 6.7), t = Math.max(0, (dx * nx - g.s - g.clear) / (nx + 6.1 / Math.hypot(6.1, 6.7)));
      return [
        line(g.pl([[B1[0] - 3.3 * k, B1[1] - 3.3 * k], B1, C1]), { n: 'c1', role: P }),
        line(g.pl([[B2[0] - t, B2[1] - t], B2, [C1[0] + dx, C1[1]]]), { n: 'c2', role: P })
      ];
    },
    fx: { t: 'draw', on: ['c1', 'c2'], stagger: 140 }
  },
  'search-check': {
    label: '搜索完成', key: 'square',
    light: ['check'],
    plan: '主体：镜片里的对勾（与完成的对勾同形，缩小）；辅助：放大镜（与搜索同形）',
    weights: { [P]: 0.13, [S]: 0.87 },
    allow: { primary: '镜片里放不下大的对勾，墨量本来就少；层级仍是最高' },
    draw(g) {
      const { c } = LENS, f = (LENS.R - g.s - g.clear - g.h - 0.1) / 5.26;
      return [...lens(g), line(g.pl(CHECK.map(([x, y]) => [c + (x - 12) * f, c + 0.3 + (y - 12.2) * f])), { n: 'check', role: P, on: 'lens' })];
    },
    fx: [{ t: 'orbit', on: ['lens', 'handle', 'check'], R: 0.9 }, { t: 'draw', on: ['check'] }]
  },
  'search-x': {
    label: '清除搜索', key: 'square',
    light: ['x'],
    plan: '主体：镜片里的叉号；辅助：放大镜（与搜索同形）',
    weights: { [P]: 0.15, [S]: 0.85 },
    draw(g) {
      const { c } = LENS, k = (LENS.R - g.s - g.clear - g.h) / Math.SQRT2;
      return [...lens(g), line(g.seg(c - k, c - k, c + k, c + k) + g.seg(c + k, c - k, c - k, c + k), { n: 'x', role: P, on: 'lens' })];
    },
    fx: { t: 'rotate', on: ['x'], deg: 90, o: [10, 10] }
  },
  'search-slash': {
    label: '无搜索结果', key: 'square',
    light: ['bar'],
    plan: '主体：镜片里的斜杠（与手柄垂直）；辅助：放大镜（与搜索同形）',
    weights: { [P]: 0.1, [S]: 0.9 },
    allow: { primary: '镜片里只有一条短斜线，墨量本来就少；层级仍是最高' },
    draw(g) {
      const { c } = LENS, k = lensMark(g) / Math.SQRT2;
      return [...lens(g), line(g.seg(c + k, c - k, c - k, c + k), { n: 'bar', role: P, on: 'lens' })];
    },
    fx: [{ t: 'orbit', on: ['lens', 'handle'], R: 0.9 }, { t: 'draw', on: ['bar'] }]
  },
  funnel: {
    nudge: [0, 1],
    label: '漏斗筛选', key: 'square',
    plan: '主体：漏斗（上宽下窄的斗和竖直的颈，一个闭合形）。斗口与方形参考线同宽，颈宽 6。斗口宽，分量在上，整体下移 1',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, t = 4 + h, b = 22 - h, neck = 11.5, xn = 15 - h, r = 1.5;
      // the mouth's sharp corners are drawn out sideways until their rounding reaches the keyline
      let x1 = 21 - h;
      for (let i = 0; i < 8; i++) x1 = 21 - h + r * (1 / Math.tan(Math.atan2(neck - t, x1 - xn) / 2) - 1);
      return [shell(g.polygon([[24 - x1, t], [x1, t], [xn, neck], [xn, b], [24 - xn, b], [24 - xn, neck]], [r, r, 0, 1, 1, 0]), { n: 'funnel', role: P })];
    },
    // 筛选: the funnel's mouth narrows and opens again
    fx: { t: 'keys', on: 'all', o: [12, 12], sx: [0.86, 1.03], ms: 260 }
  },
  'sliders-vertical': {
    label: '竖向调节', key: 'square',
    plan: '主体：两个滑钮；辅助：两条竖向滑轨（被滑钮切开）。调节转 90°',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) {
      return [
        line(g.span(7, 3, 7, 21), { n: 't1', role: S }),
        line(g.span(17, 3, 17, 21), { n: 't2', role: S }),
        shell(g.ring(7, 8, 3.75), { n: 'k1', role: P, occ: true }),
        shell(g.ring(17, 16, 3.75), { n: 'k2', role: P, occ: true })
      ];
    },
    fx: [{ t: 'keys', on: ['k1'], y: [7.7, 7.7, 0] }, { t: 'keys', on: ['k2'], y: [-7.7, -7.7, 0] }]
  },
  crosshair: {
    label: '十字准星', key: 'circle',
    plan: '主体：圆环（直径 20，线条，不是面）；辅助：从圆环向内的四道短线',
    weights: { [P]: 0.67, [S]: 0.33 },
    draw(g) {
      const { h } = g, a = 2 + h, b = 7.5;
      return [
        line(g.ring(12, 12, 10), { n: 'ring', role: P }),
        line(g.seg(12, a, 12, b) + g.seg(12, 24 - a, 12, 24 - b) + g.seg(a, 12, b, 12) + g.seg(24 - a, 12, 24 - b, 12), { n: 'ticks', role: S })
      ];
    },
    // 瞄准: the ring closes in, then turns a quarter (landing on itself)
    fx: [{ t: 'keys', on: 'all', o: [12, 12], s: [0.86, 1.03], ms: 360 }, { t: 'rotate', on: 'all', deg: 90 }]
  },
  'eye-closed': {
    label: '闭眼', key: 'landscape', fit: 'x',
    light: [], // one object (GUIDE.md §4.2): lid and lashes keep one tone
    plan: '主体：闭上的眼睑（与眼睛的眼眶同半径的一段弧）；辅助：向外的四根睫毛（与眼睑相连）。四根睫毛加起来和眼睑差不多长，各占约一半',
    weights: { [P]: 0.52, [S]: 0.48 },
    draw(g) {
      const { h } = g, ch = 20 - g.s, sag = 7 - h, R = (ch * ch / 4 + sag * sag) / (2 * sag), top = 8, cy = top + sag - R;
      const lash = (deg) => { const a = (deg * Math.PI) / 180; return g.seg(12 + R * Math.sin(a), cy + R * Math.cos(a), 12 + (R + 2.75) * Math.sin(a), cy + (R + 2.75) * Math.cos(a)); };
      return [
        line(`M${n(2 + h)} ${top}A${n(R)} ${n(R)} 0 0 0 ${n(22 - h)} ${top}`, { n: 'lid', role: P }),
        line(lash(-45) + lash(-15) + lash(15) + lash(45), { n: 'lashes', role: S })
      ];
    },
    // 闭眼: the lid squeezes shut a little tighter and relaxes
    fx: { t: 'keys', on: 'all', o: [12, 8], sy: [0.7, 1.04], ms: 260 },
    swap: 'eye'
  },
  'flag-triangle': {
    anchor: 'base',
    label: '三角旗', key: 'square',
    plan: '主体：三角形旗面（尖角朝右）；辅助：旗杆（一条线）。三角形的分量靠近旗杆，旗杆放在 7，尖角到 22，按光学中心左右摆放',
    weights: { [P]: 0.76, [S]: 0.24 },
    draw(g) {
      const { h } = g, top = 3 + h, bot = 15 - h, tip = 22 - h;
      return [line(g.span(7, 3, 7, 21), { n: 'pole', role: S }), shell(g.polygon([[7, top], [tip, (top + bot) / 2], [7, bot]], [0.75, 1.5, 0.75]), { n: 'cloth', role: P })];
    },
    fx: { t: 'keys', on: ['cloth'], o: [7, 9], sx: [0.84, 1.05, 0.96] },
    allow: { keyline: '旗杆立在左侧 7 处，三角旗面向右展开' }
  },
  sparkle: {
    label: '闪光', key: 'live',
    plan: '主体：四角星（与智能生成的大星同形，放大到可用区域）',
    weights: { [P]: 1 },
    draw(g) { return [shell(sparkle(g, 12, 12, 10), { n: 'spark', role: P })]; },
    // 闪光: the star turns a quarter (landing on itself) as it pops
    fx: [{ t: 'rotate', on: 'all', deg: 90 }, { t: 'keys', on: 'all', o: [12, 12], s: [0.82, 1.06] }]
  },
  'hand-tap': {
    label: '轻点', key: 'live', fit: 'y',
    plan: '主体：竖起食指的手（与手型同形，食指矮一点）；辅助：指尖上方的一道弧，表示点按；细节：手指之间的两道短线',
    weights: { [P]: 0.74, [S]: 0.14, [D]: 0.12 },
    draw(g, ctx) {
      const H = hand(g, [8, 12, 16, 20], [6, 9.5, 10.5], 15.5, ctx?.variant === 'fill'), r = 2.5 + g.s + g.clear;
      return [
        shell(H.d, { n: 'hand', role: P }), (H.solid ? solid : line)(H.slits, { n: 'slits', role: D, on: 'hand' }),
        line(g.arc(10, 8 + g.h, r, 215, 325), { n: 'ripple', role: S })
      ];
    },
    // 轻点: the finger taps down and the ripple spreads
    fx: [{ t: 'keys', on: ['hand', 'slits'], o: [12, 22], s: [0.92], y: [0.4], ms: 200 }, { t: 'keys', on: ['ripple'], o: [10, 9], s: [0.8, 1.12], a: [0.4, 1], ms: 320 }]
  },
  'bookmark-plus': {
    label: '添加书签', key: 'portrait', fit: 'y',
    plan: '主体：书签带里的加号；辅助：书签（与书签同形）。符号放在缺口以上的带子中间，离两边 1.5',
    weights: { [P]: 0.18, [S]: 0.82 },
    draw(g) { return [...BOOKMARK.draw(g).map((l) => ({ ...l, role: S })), line(g.seg(12, RIB - ribbonK(g), 12, RIB + ribbonK(g)) + g.seg(12 - ribbonK(g), RIB, 12 + ribbonK(g), RIB), { n: 'plus', role: P, on: 'bookmark' })]; },
    fx: { t: 'rotate', on: ['plus'], deg: 90, o: [12, RIB] },
    allow: BOOKMARK.allow
  },
  'bookmark-minus': {
    label: '移除书签', key: 'portrait', fit: 'y',
    plan: '主体：书签带里的减号（与添加书签的横线同长）；辅助：书签',
    weights: { [P]: 0.1, [S]: 0.9 },
    draw(g) { const k = ribbonK(g); return [...BOOKMARK.draw(g).map((l) => ({ ...l, role: S })), line(g.seg(12 - k, RIB, 12 + k, RIB), { n: 'minus', role: P, on: 'bookmark' })]; },
    fx: { t: 'draw', on: ['minus'] },
    allow: { ...BOOKMARK.allow, primary: '书签带窄，减号只能这么长，墨量本来就少；层级仍是最高' }
  },
  'bookmark-check': {
    label: '已加书签', key: 'portrait', fit: 'y',
    plan: '主体：书签带里的对勾（与完成的对勾同形，缩小）；辅助：书签',
    weights: { [P]: 0.14, [S]: 0.86 },
    draw(g) {
      const f = (2 * (7 - g.s - g.clear) - g.s) / 9.4;
      return [...BOOKMARK.draw(g).map((l) => ({ ...l, role: S })), line(g.pl(CHECK.map(([x, y]) => [12 + (x - 12) * f, RIB + 0.3 + (y - 12.35) * f])), { n: 'check', role: P, on: 'bookmark' })];
    },
    fx: { t: 'draw', on: ['check'] },
    allow: { ...BOOKMARK.allow, primary: '书签带窄，对勾只能这么大，墨量本来就少；层级仍是最高' }
  },
  'bookmark-x': {
    label: '删除书签', key: 'portrait', fit: 'y',
    plan: '主体：书签带里的叉号；辅助：书签',
    weights: { [P]: 0.15, [S]: 0.85 },
    draw(g) { const k = ribbonK(g) * 0.85; return [...BOOKMARK.draw(g).map((l) => ({ ...l, role: S })), line(g.seg(12 - k, RIB - k, 12 + k, RIB + k) + g.seg(12 + k, RIB - k, 12 - k, RIB + k), { n: 'x', role: P, on: 'bookmark' })]; },
    fx: { t: 'rotate', on: ['x'], deg: 90, o: [12, RIB] },
    allow: BOOKMARK.allow
  },
  'circle-slash': {
    label: '无', key: 'circle',
    plan: '主体：从左下到右上的短斜线（不碰外圈，与禁止的斜杠方向相反）；辅助：外圈',
    weights: { [P]: 0.17, [S]: 0.83 },
    draw(g) { const k = plusK(g) / Math.SQRT2; return [shell(g.ring(12, 12, 10), { n: 'ring', role: S }), line(g.seg(12 - k, 12 + k, 12 + k, 12 - k), { n: 'bar', role: P, on: 'ring' })]; },
    fx: { t: 'draw', on: ['bar'] }
  },
  appearance: {
    label: '外观', key: 'circle',
    light: [], // one sign: the dark half is the meaning, not an inner detail
    plan: '主体：中间的分界线和左半边的三道横线（深色模式和浅色模式各占一半，横线代表深色的一半，保持线性）；辅助：外圈。面性中左半边实心、右半边镂空',
    weights: { [P]: 0.48, [S]: 0.52 },
    draw(g, ctx) {
      const r = 10 - g.h, ri = 10 - g.s;
      if (ctx?.variant === 'fill') return [shell(g.ring(12, 12, 10), { n: 'ring', role: S }), solid(`M12 ${n(12 - ri)}A${n(ri)} ${n(ri)} 0 0 1 12 ${n(12 + ri)}Z`, { n: 'half', role: P, on: 'ring' })];
      // the dark half as hatching: the divider and three lines on whole pixels, each running from
      // the divider to the ring
      const edge = (y) => 12 - Math.sqrt(r * r - (y - 12) ** 2);
      const hatch = [8, 12, 16].map((y) => g.seg(edge(y), y, 12, y)).join('');
      return [shell(g.ring(12, 12, 10), { n: 'ring', role: S }), line(g.seg(12, 12 - r, 12, 12 + r) + hatch, { n: 'half', role: P })];
    },
    // 切换外观: the disc turns a full turn, dark and light trading sides on the way
    fx: { t: 'rotate', on: 'all', deg: 360 }
  },
  delete: {
    label: '删除键', key: 'landscape', fit: 'x',
    plan: '主体：键里的叉号；辅助：向左的键形（左端是尖角，与 ⌫ 相同）。叉号放在尖角以右的方形部分中间',
    weights: { [P]: 0.22, [S]: 0.78 },
    draw(g) {
      const { h } = g, t = 5 + h, b = 19 - h, xr = 22 - h, xs = 8.5, cx = 14.75, k = 7 - g.s - g.h - g.clear;
      // the sharp left point is drawn out until its rounding (1.2) reaches x 2
      const c = Math.cos(Math.atan2(12 - t, xs - 2)), tip = 2 + 2 * h - h / c - 1.2 * (1 / c - 1);
      return [
        shell(g.polygon([[tip, 12], [xs, t], [xr, t], [xr, b], [xs, b]], [1.2, 1, 3.5 - h, 3.5 - h, 1]), { n: 'key', role: S }),
        line(g.seg(cx - k, 12 - k, cx + k, 12 + k) + g.seg(cx + k, 12 - k, cx - k, 12 + k), { n: 'x', role: P, on: 'key' })
      ];
    },
    // 退格: the key pushes left and the x turns
    fx: [{ t: 'keys', on: 'all', x: [-1, 0.2], ms: 220 }, { t: 'rotate', on: ['x'], deg: 90, o: [14.75, 12] }]
  },
  'circle-dot-dashed': {
    label: '进行中', key: 'circle',
    light: ['dot'],
    plan: '主体：选中点（与单选同大）；辅助：虚线圆（与虚线圆同形），表示还没完成',
    weights: { [P]: 0.22, [S]: 0.78 },
    draw(g) { return [...SHAPES['circle-dashed'].draw(g).map((l) => ({ ...l, n: 'ring', role: S })), ...radio(g)]; },
    area: (g) => [{ n: 'ring', d: g.circ(12, 12, 10 - g.h) }],
    fx: [{ t: 'rotate', on: ['ring'], deg: 45 }, { t: 'keys', on: ['dot'], o: [12, 12], s: [0.35, 1.12], ms: 300 }]
  },
  'square-slash': {
    label: '无（方形）', key: 'square',
    plan: '主体：从左下到右上的短斜线（与无的斜线同长）；辅助：方框',
    weights: { [P]: 0.16, [S]: 0.84 },
    draw(g) { const k = plusK(g) / Math.SQRT2; return [shell(BOX(g), { n: 'box', role: S }), line(g.seg(12 - k, 12 + k, 12 + k, 12 - k), { n: 'bar', role: P, on: 'box' })]; },
    fx: { t: 'draw', on: ['bar'] }
  },
  'diamond-plus': {
    label: '添加（菱形）', key: 'live',
    plan: '主体：加号（与添加的加号同大，臂指向四个尖角）；辅助：菱形（与菱形同形）',
    weights: { [P]: 0.24, [S]: 0.76 },
    draw(g) { return [shell(DIAMOND(g), { n: 'dia', role: S }), line(plusMark(g), { n: 'plus', role: P, on: 'dia' })]; },
    fx: { t: 'rotate', on: ['plus'], deg: 90, o: [12, 12] },
    allow: { keyline: '菱形的四个尖角各伸出可用区域约 0.5' }
  },
  'diamond-minus': {
    label: '移除（菱形）', key: 'live',
    plan: '主体：减号（与移除的减号同长）；辅助：菱形',
    weights: { [P]: 0.15, [S]: 0.85 },
    draw(g) { const k = plusK(g); return [shell(DIAMOND(g), { n: 'dia', role: S }), line(g.seg(12 - k, 12, 12 + k, 12), { n: 'minus', role: P, on: 'dia' })]; },
    fx: { t: 'draw', on: ['minus'] },
    allow: { keyline: '菱形的四个尖角各伸出可用区域约 0.5' }
  },
  'diamond-alert': {
    label: '提醒（菱形）', key: 'live',
    plan: '主体：感叹号（与提醒同形）；辅助：菱形',
    weights: { [P]: 0.16, [S]: 0.84 },
    draw(g, ctx) {
      // the stem's top stays clear of the diamond's upper edges at heavy weights: it starts a little lower
      const dy = Math.max(0, g.s - 2) * 0.6, top = (d) => d.replace(/^M12 (-?[\d.]+)/, (_, y) => `M12 ${n(+y + dy)}`);
      return reshell(SET['circle-alert'].draw(g, ctx), DIAMOND(g), 'dia').map((l) => (l.n === 'stem' ? { ...l, d: top(l.d) } : l));
    },
    fx: { t: 'shake', on: ['stem', 'dot'], x: 0.8 },
    allow: { keyline: '菱形的四个尖角各伸出可用区域约 0.5' }
  }
};

// Variants made by rule (GUIDE.md §4.4): slashes of the bases above and in this file.
Object.assign(SET, {
  'bookmark-off': off({ ...slash(BOOKMARK, { label: '书签关闭' }), allow: { ...BOOKMARK.allow, ...SLASHED } }, 'bookmark', { t: 'keys', on: ['bookmark'], o: [12, 2], sy: [0.82], ms: 260 }),
  'flag-off': off({ ...slash(FLAG, { label: '取消标记' }), allow: { ...FLAG.allow, ...SLASHED } }, 'flag', { t: 'keys', on: ['cloth'], o: [5, 9], sx: [0.72], ms: 260 }),
  'star-off': off({ ...slash(STAR, { label: '取消收藏' }), allow: SLASHED }, 'star', { t: 'keys', on: ['star'], o: [12, 12.25], s: [0.86], ms: 240 }),
  'star-circle': { ...enclose(STAR, 'circle', { label: '收藏（圆形）', k: 0.56 }), swap: undefined, enter: undefined, fx: [{ t: 'rotate', on: ['star'], deg: 72, o: [12, 12.14] }, { t: 'keys', on: ['star'], o: [12, 12.14], s: [0.84, 1.08] }] },
  'pin-off': off({ ...slash(SET.pin, { label: '取消固定' }), allow: SLASHED }, 'pin', { t: 'keys', on: ['head', 'needle'], y: [-1.2], ms: 260 }),
});

export default SET;
