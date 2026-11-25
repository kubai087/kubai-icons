// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// arrows: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: arrow-up arrow-down arrow-left arrow-right arrow-up-right arrow-up-left arrow-down-right arrow-down-left arrow-up-down arrow-left-right chevron-up chevron-down chevron-left chevron-right chevrons-up chevrons-down corner-down-right corner-up-left expand shrink external-link log-in log-out redo undo rotate-ccw sync merge split move import export
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// --- Arrow family -------------------------------------------------------------------------------
// A straight arrowhead is two legs at 90°, each reaching L back along the shaft and L across it
// (download and upload in icons.mjs use L = 5). One arrow alone takes L1; two or more arrows
// sharing the box take a shorter head so they keep clear of each other (share's head is about 4).
const L1 = 5, L2 = 4, L4 = 3;
// The chevron: one shape for every chevron, legs 6 along and 6 across, 90° opening.
const CV = 6;
// The arrowhead on a curve (rotate-cw in icons.mjs): legs 3.5 long, turned back along the chord.
const LC = 3.5, R_ARC = 8.75;

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
/** Head legs at tip t for direction u (unit), reach L along and across. */
const headPts = ([x, y], [ux, uy], L) => { const vx = -uy, vy = ux; return [[x - L * (ux + vx), y - L * (uy + vy)], [x, y], [x - L * (ux - vx), y - L * (uy - vy)]]; };
/** A straight arrow: shaft from tail to tip, then the head; one path. */
const arrow = (g, tail, tip, L) => { const u = unit(tip[0] - tail[0], tip[1] - tail[1]); return g.seg(tail[0], tail[1], tip[0], tip[1]) + g.pl(headPts(tip, u, L)); };
/** The head at angle a (degrees) of an arc round (cx, cy), radius r, moving clockwise or not:
 *  as rotate-cw, it is turned back along the chord by half the angle its length covers. */
function curveHead(cx, cy, r, a, cw, L = LC) {
  const k = Math.SQRT1_2, rad = (a * Math.PI) / 180, E = [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  const turn = (L * k) / (2 * r), dir = cw ? rad + Math.PI / 2 - turn : rad - Math.PI / 2 + turn;
  const t = [Math.cos(dir), Math.sin(dir)], nr = [-t[1], t[0]];
  return [[E[0] - L * k * (t[0] + nr[0]), E[1] - L * k * (t[1] + nr[1])], E, [E[0] - L * k * (t[0] - nr[0]), E[1] - L * k * (t[1] - nr[1])]];
}
const mirror = (pts) => pts.map(([x, y]) => [24 - x, y]);

// One straight arrow along an axis: 18 long by its ink (3..21), pushed back along the shaft by
// d so the head, where the weight is, sits on the optical centre.
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPT = 0.7; // the straight arrow's optical shift toward its tail
function straight(dir, label) {
  const u = DIRS[dir];
  return {
    label, key: 'square', fit: u[0] ? 'x' : 'y', nudge: [-u[0] * OPT, -u[1] * OPT],
    plan: '主体：箭头（杆和头一笔画成），头部两条腿各沿杆和横向 5，与下载相同；整体向尾部挪 0.7，让头部的分量落在中心',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, k = 9 - h, at = (m) => [12 + u[0] * (m - OPT), 12 + u[1] * (m - OPT)];
      return [line(arrow(g, at(-k), at(k), L1), { n: 'arrow', role: P })];
    },
    // 指向: the arrow darts the way it points and springs back
    fx: { t: 'keys', on: 'all', x: [u[0] * 1.6, -u[0] * 0.3], y: [u[1] * 1.6, -u[1] * 0.3] }
  };
}

// A diagonal arrow is the straight one turned 45°: the same head (its legs now lie along the
// axes, 5√2 long) and the same shaft length; its tip sits on whole pixels, so the legs do.
const DIAG = { 'up-right': [1, -1], 'up-left': [-1, -1], 'down-right': [1, 1], 'down-left': [-1, 1] };
function diagonal(dir, label) {
  const [sx, sy] = DIAG[dir], u = unit(sx, sy);
  return {
    label, key: 'square', nudge: [-sx * 0.5, -sy * 0.5],
    plan: '主体：斜向箭头，即直箭头转 45°（头部相同，两条腿落在横竖方向，杆长相同）；尖端在整像素上，整体向尾部挪，让头部落在光学中心',
    weights: { [P]: 1 },
    draw(g) {
      const { s } = g, tip = [12 + sx * 5, 12 + sy * 5], len = 18 - s;
      return [line(arrow(g, [tip[0] - u[0] * len, tip[1] - u[1] * len], tip, L1), { n: 'arrow', role: P })];
    },
    fx: { t: 'keys', on: 'all', x: [sx * 1.2, -sx * 0.25], y: [sy * 1.2, -sy * 0.25] },
    allow: { keyline: '斜放的箭头按光学中心摆放，外框约 15，与直箭头的长度相同' }
  };
}

// Chevrons: the vertex on the optical centre of the open angle.
function chevron(dir, label) {
  const u = DIRS[dir], v = [-u[1], u[0]];
  return {
    label, key: 'square',
    plan: '主体：折角，两条腿各沿方向和横向 6，开口 90°（所有折角同一个形状）',
    weights: { [P]: 1 },
    draw() {
      const c = 3.5, V = [12 + u[0] * c, 12 + u[1] * c], B = [V[0] - u[0] * CV, V[1] - u[1] * CV];
      return [line(`M${n(B[0] + v[0] * CV)} ${n(B[1] + v[1] * CV)}L${n(V[0])} ${n(V[1])}L${n(B[0] - v[0] * CV)} ${n(B[1] - v[1] * CV)}`, { n: 'chev', role: P })];
    },
    fx: { t: 'keys', on: 'all', x: [u[0] * 1.6, -u[0] * 0.3], y: [u[1] * 1.6, -u[1] * 0.3] },
    allow: { keyline: '折角本身小，宽 14，所有折角同一个形状' }
  };
}
// Two chevrons 6 apart: their legs keep 1.5 clear at every weight.
function chevrons(dir, label) {
  const u = DIRS[dir], v = [-u[1], u[0]], gap = 6;
  const one = (m) => { const V = [12 + u[0] * m, 12 + u[1] * m], B = [V[0] - u[0] * CV, V[1] - u[1] * CV]; return `M${n(B[0] + v[0] * CV)} ${n(B[1] + v[1] * CV)}L${n(V[0])} ${n(V[1])}L${n(B[0] - v[0] * CV)} ${n(B[1] - v[1] * CV)}`; };
  return {
    label, key: 'square',
    plan: '主体：两个相同的折角（与单个折角同形），前后相距 6，粗字重下仍留 1.5',
    weights: { [P]: 1 },
    draw() { return [line(one(6.5 - gap), { n: 'c1', role: P }), line(one(6.5), { n: 'c2', role: P })]; },
    fx: { t: 'keys', on: [['c1'], ['c2']], by: true, stagger: 80, x: [u[0] * 1.5, -u[0] * 0.3], y: [u[1] * 1.5, -u[1] * 0.3] },
    allow: { keyline: '与单个折角同宽 14' }
  };
}

// A turn: down the left, round a corner, out to the right with the head (corner-down-right);
// corner-up-left is the same turned half round.
function corner(flip, label) {
  const T = (pts) => (flip ? pts.map(([x, y]) => [24 - x, 24 - y]) : pts);
  return {
    label, key: 'square',
    plan: '主体：转弯的箭头（竖段、圆角、横段和头部一笔画成），头部与直箭头相同',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, x0 = 4, y0 = 15, r = 5, tip = [21 - h, y0];
      const [a, b, c, d] = T([[x0, 3 + h], [x0, y0 - r], [x0 + r, y0], tip]);
      const hd = T(headPts(tip, [1, 0], L1));
      return [line(`M${n(a[0])} ${n(a[1])}L${n(b[0])} ${n(b[1])}A${r} ${r} 0 0 0 ${n(c[0])} ${n(c[1])}L${n(d[0])} ${n(d[1])}` + g.pl(hd), { n: 'arrow', role: P })];
    },
    fx: { t: 'keys', on: 'all', x: [flip ? -1.4 : 1.4, flip ? 0.25 : -0.25] }
  };
}

// Two diagonal arrows, out to the corners (expand) or in from them (shrink).
function corners(out, label) {
  return {
    label, key: 'square',
    plan: out ? '主体：两支斜向箭头，从中间指向左上和右下两角；两支并用时箭头头部短一些（与上下排序相同）'
      : '主体：两支斜向箭头，从左上和右下两角指向中间；头部与展开相同',
    weights: { [P]: 1 },
    draw(g) {
      const one = (sg) => {
        const far = [12 + sg * 8, 12 + sg * 8], near = [12 + sg * (out ? 1.5 : 2), 12 + sg * (out ? 1.5 : 2)];
        return out ? arrow(g, near, far, L2) : arrow(g, far, near, L2);
      };
      return [line(one(-1), { n: 'a1', role: P }), line(one(1), { n: 'a2', role: P })];
    },
    fx: [{ t: 'keys', on: ['a1'], x: [out ? -1 : 1, 0], y: [out ? -1 : 1, 0] }, { t: 'keys', on: ['a2'], x: [out ? 1 : -1, 0], y: [out ? 1 : -1, 0] }]
  };
}

// Two straight arrows side by side, opposite ways.
function pair(vertical, label, plan) {
  const sw = (p) => (vertical ? p : [p[1], p[0]]);
  return {
    label, key: 'square', plan, weights: { [P]: 1 },
    draw(g) {
      const { h } = g, a = 3 + h, b = 21 - h;
      // vertical: up at x 8, down at x 16; across: left on top, right below
      const one = vertical ? [[8, b], [8, a]] : [[b, 8], [a, 8]], two = vertical ? [[16, a], [16, b]] : [[a, 16], [b, 16]];
      return [line(arrow(g, one[0], one[1], L2), { n: 'a1', role: P }), line(arrow(g, two[0], two[1], L2), { n: 'a2', role: P })];
    },
    fx: vertical ? [{ t: 'keys', on: ['a1'], y: [-1.4, 0.3] }, { t: 'keys', on: ['a2'], y: [1.4, -0.3] }]
      : [{ t: 'keys', on: ['a1'], x: [-1.4, 0.3] }, { t: 'keys', on: ['a2'], x: [1.4, -0.3] }]
  };
}

// The hump of undo and redo: an arc over the top and the curved head at one end.
function hump(back, label) {
  return {
    label, key: 'square', light: [],
    nudge: [back ? 0.5 : -0.5, 1.15],
    plan: '主体：约 200° 的圆弧（从一侧越过顶部到另一侧）；辅助：箭头头部，与刷新同一做法：在弧端，沿弦回转',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const { h } = g, cx = 12.5, cy = 15.15, r = R_ARC - h;
      // undo: from the right end, counter-clockwise over the top, head at the left end
      const a0 = 12, a1 = -192;
      let arc = g.arc(cx, cy, r, a0, a1), hd = curveHead(cx, cy, r, a1, false);
      if (!back) { arc = g.arc(24 - cx, cy, r, 180 - a0, 180 - a1); hd = mirror(hd); }
      return [line(arc, { n: 'arc', role: P }), line(g.pl(hd), { n: 'head', role: S })];
    },
    fx: { t: 'rotate', on: 'all', deg: back ? -30 : 30, o: [12, 15.15] },
    allow: { keyline: '圆弧与刷新同径 17.5，头部在弧端向下伸出' }
  };
}

export default {
  'arrow-up': straight('up', '向上箭头'),
  'arrow-down': straight('down', '向下箭头'),
  'arrow-left': straight('left', '向左箭头'),
  'arrow-right': straight('right', '向右箭头'),
  'arrow-up-right': diagonal('up-right', '向右上箭头'),
  'arrow-up-left': diagonal('up-left', '向左上箭头'),
  'arrow-down-right': diagonal('down-right', '向右下箭头'),
  'arrow-down-left': diagonal('down-left', '向左下箭头'),
  'arrow-up-down': pair(true, '上下排序', '主体：左边向上、右边向下的两支箭头，相距 8；两支并排时头部的腿各 4（比单支的 5 短，才能与另一支的杆隔开）'),
  'arrow-left-right': pair(false, '左右互换', '主体：上面向左、下面向右的两支箭头，相距 8；头部与上下排序相同'),
  'chevron-up': chevron('up', '向上折角'),
  'chevron-down': chevron('down', '向下折角'),
  'chevron-left': chevron('left', '向左折角'),
  'chevron-right': chevron('right', '向右折角'),
  'chevrons-up': chevrons('up', '双上折角'),
  'chevrons-down': chevrons('down', '双下折角'),
  'corner-down-right': corner(false, '向右下转弯'),
  'corner-up-left': corner(true, '向左上转弯'),
  expand: corners(true, '展开'),
  shrink: corners(false, '收起'),
  'external-link': {
    label: '外部链接', key: 'square', anchor: 'base',
    plan: '主体：斜向箭头（从盒子里向右上伸出）；辅助：右上角开口的盒子。两者并用，头部用短的一种',
    weights: { [P]: 0.4, [S]: 0.6 },
    draw(g) {
      const { h } = g, c = 3.5 - h, x0 = 3 + h, x1 = 18 - h, y0 = 6 + h, y1 = 21 - h;
      return [
        line(`M10 ${n(y0)}H${n(x0 + c)}A${n(c)} ${n(c)} 0 0 0 ${n(x0)} ${n(y0 + c)}V${n(y1 - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x0 + c)} ${n(y1)}H${n(x1 - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x1)} ${n(y1 - c)}V14`, { n: 'box', role: S }),
        line(arrow(g, [11, 13], [21 - h, 3 + h], L2), { n: 'arrow', role: P })
      ];
    },
    area: (g) => [{ n: 'box', d: g.rr(3 + g.h, 6 + g.h, 15 - g.s, 15 - g.s, 3.5 - g.h) }],
    light: ['arrow'],
    fx: { t: 'keys', on: ['arrow'], x: [1.2, -0.2], y: [-1.2, 0.2] }
  },
  'log-in': {
    label: '登录', key: 'square', nudge: [-1, 0],
    plan: '主体：向右的箭头（走进门里）；辅助：右侧的门框（开口朝左）。箭头头部与单支箭头相同',
    weights: { [P]: 0.45, [S]: 0.55 },
    draw(g) {
      const { h } = g, c = 4 - h, xr = 20 - h, y0 = 3 + h, y1 = 21 - h;
      return [
        line(`M13 ${n(y0)}H${n(xr - c)}A${n(c)} ${n(c)} 0 0 1 ${n(xr)} ${n(y0 + c)}V${n(y1 - c)}A${n(c)} ${n(c)} 0 0 1 ${n(xr - c)} ${n(y1)}H13`, { n: 'door', role: S }),
        line(arrow(g, [2 + h, 12], [14, 12], L1), { n: 'arrow', role: P })
      ];
    },
    area: (g) => [{ n: 'door', d: g.rr(13, 3 + g.h, 7 - g.h, 18 - g.s, [0, 4 - g.h, 4 - g.h, 0]) }],
    light: ['arrow'],
    fx: { t: 'keys', on: ['arrow'], x: [1.6, -0.2] }
  },
  'log-out': {
    label: '退出', key: 'square', nudge: [1, 0],
    plan: '主体：向右的箭头（走出门外）；辅助：左侧的门框（开口朝右）。箭头头部与单支箭头相同',
    weights: { [P]: 0.45, [S]: 0.55 },
    draw(g) {
      const { h } = g, c = 4 - h, xl = 4 + h, y0 = 3 + h, y1 = 21 - h;
      return [
        line(`M11 ${n(y0)}H${n(xl + c)}A${n(c)} ${n(c)} 0 0 0 ${n(xl)} ${n(y0 + c)}V${n(y1 - c)}A${n(c)} ${n(c)} 0 0 0 ${n(xl + c)} ${n(y1)}H11`, { n: 'door', role: S }),
        line(arrow(g, [10, 12], [22 - h, 12], L1), { n: 'arrow', role: P })
      ];
    },
    area: (g) => [{ n: 'door', d: g.rr(4 + g.h, 3 + g.h, 7 - g.h, 18 - g.s, [4 - g.h, 0, 0, 4 - g.h]) }],
    light: ['arrow'],
    fx: { t: 'keys', on: ['arrow'], x: [1.4, -0.2] }
  },
  redo: hump(false, '重做'),
  undo: hump(true, '撤销'),
  'rotate-ccw': {
    label: '逆时针旋转', key: 'square', light: [],
    plan: '刷新的镜像：主体：300° 的圆弧，缺口在左上；辅助：箭头头部（在弧端，沿弦回转）',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const { h } = g, a1 = 235, cx = 12.25, cy = 12.375, r = R_ARC - h;
      return [line(g.arc(cx, cy, r, a1 + 300, a1), { n: 'arc', role: P }), line(g.pl(curveHead(cx, cy, r, a1, false)), { n: 'head', role: S })];
    },
    area: (g) => [{ n: 'arc', d: g.circ(12.25, 12.375, R_ARC - g.h) }],
    fx: { t: 'rotate', on: 'all', deg: -360, dip: 0.07 },
    allow: { keyline: '与刷新相同：箭头头部伸出圆弧，圆直径 17.5' }
  },
  sync: {
    label: '同步', key: 'square', light: [],
    plan: '主体：两段 120° 的圆弧，首尾相随；辅助：两个箭头头部，与刷新同一做法（两个头，比刷新多占一些）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const { h } = g, r = R_ARC - h;
      return [
        line(g.arc(12, 12, r, -175, -55), { n: 'arc1', role: P }),
        line(g.pl(curveHead(12, 12, r, -55, true)), { n: 'head1', role: S }),
        line(g.arc(12, 12, r, 5, 125), { n: 'arc2', role: P }),
        line(g.pl(curveHead(12, 12, r, 125, true)), { n: 'head2', role: S })
      ];
    },
    area: (g) => [{ n: 'arc1', d: g.circ(12, 12, R_ARC - g.h) }],
    // 同步: the two arrows chase each other half a turn, landing on themselves
    fx: { t: 'rotate', on: 'all', deg: 180, dip: 0.07 },
    allow: { keyline: '与刷新同径 17.5，箭头头部伸出圆弧' }
  },
  merge: {
    label: '合并', key: 'square', light: [], nudge: [0, -0.5],
    plan: '主体：向上的箭头（合并后的去向），头部与单支箭头相同；辅助：从两个下角斜向汇入的两条支路。两条支路张开在下方，整体上移 0.5',
    weights: { [P]: 0.48, [S]: 0.52 },
    draw(g) {
      const { h } = g, up = 0.5, fy = 12.5 - up, by = 21 - h - up, dx = by - fy;
      return [
        line(g.seg(12 - dx, by, 12, fy), { n: 'left', role: S }),
        line(g.seg(12 + dx, by, 12, fy), { n: 'right', role: S }),
        line(arrow(g, [12, fy], [12, 3 + h - up], L1), { n: 'arrow', role: P })
      ];
    },
    fx: { t: 'draw', on: [['left', 'right'], 'arrow'] },
    allow: { keyline: '两条支路按 45° 汇入，宽约 16.5；按光学中心上移 0.5' }
  },
  split: {
    label: '拆分', key: 'square', light: [], nudge: [0, 1.25],
    plan: '主体：分向左上和右上的两支斜向箭头（两支并用，头部用短的一种）；辅助：下方的主干（只是一条短线，占一成多）。两支箭头张开在上方，分量偏上，整体下移到光学中心',
    weights: { [P]: 0.85, [S]: 0.15 },
    draw(g) {
      const { h } = g, dx = 8, ty = 6, fy = ty + dx, sb = 21.5;
      return [
        line(g.seg(12, sb - h, 12, fy), { n: 'stem', role: S }),
        line(arrow(g, [12, fy], [12 - dx, ty], L2), { n: 'left', role: P }),
        line(arrow(g, [12, fy], [12 + dx, ty], L2), { n: 'right', role: P })
      ];
    },
    fx: { t: 'draw', on: ['stem', ['left', 'right']] },
    allow: { keyline: '两支箭头按 45° 张开，宽 16；按光学中心下移' }
  },
  move: {
    label: '移动', key: 'live',
    plan: '主体：十字和四个方向的箭头头部；四个头在角上相邻，头部只能用最短的一种（腿各 3）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, a = 2 + h, b = 22 - h, hd = (t, u) => g.pl(headPts(t, u, L4));
      return [line(g.seg(12, a, 12, b) + g.seg(a, 12, b, 12) + hd([12, a], [0, -1]) + hd([12, b], [0, 1]) + hd([a, 12], [-1, 0]) + hd([b, 12], [1, 0]), { n: 'cross', role: P })];
    },
    fx: { t: 'orbit', on: 'all', R: 0.9 }
  },
  import: {
    anchor: 'base',
    label: '导入', key: 'square',
    plan: '主体：向下伸进盒子的箭头；辅助：上沿开口的盒子（与分享相同的做法）。箭头在盒子里，头部用短的一种，并像分享一样随字重略缩，粗字重下与盒沿仍留间距',
    weights: { [P]: 0.36, [S]: 0.64 },
    draw(g) {
      const { h, s } = g, x0 = 3 + h, x1 = 21 - h, y0 = 7 + h, yb = 21 - h, c = 3.75 - h, tip = 19.5 - 1.5 * s;
      return [
        line(`M7 ${n(y0)}H${n(x0 + c)}A${n(c)} ${n(c)} 0 0 0 ${n(x0)} ${n(y0 + c)}V${n(yb - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x0 + c)} ${n(yb)}H${n(x1 - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x1)} ${n(yb - c)}V${n(y0 + c)}A${n(c)} ${n(c)} 0 0 0 ${n(x1 - c)} ${n(y0)}H17`, { n: 'box', role: S }),
        line(arrow(g, [12, 3 + h], [12, tip], L2 - 0.6 * (s - 2)), { n: 'arrow', role: P })
      ];
    },
    area: (g) => [{ n: 'box', d: g.rr(3 + g.h, 7 + g.h, 18 - g.s, 14 - g.s, 3.75 - g.h) }],
    light: ['arrow'],
    fx: { t: 'keys', on: ['arrow'], y: [1.3, -0.2] }
  },
  export: {
    label: '导出', key: 'live', fit: 'y',
    plan: '主体：向右伸出的箭头（从页面里出发，头部用短的一种）；辅助：折角的文档页（右边中间开口，箭头从这里出去）。折角让它读作文档，与退出的门框区分',
    weights: { [P]: 0.4, [S]: 0.6 },
    draw(g) {
      // the page: 4..13 by centre line, its top-right corner folded off, its right edge open
      // from y 10 to 18 where the arrow leaves; the head keeps 2 clear of the page
      const { h } = g, x0 = 3 + h, x1 = 14 - h, y0 = 2 + h, y1 = 22 - h, c = 3 - h, f = 4, ay = 14;
      return [
        line(`M${n(x1)} 10V${n(y0 + f)}L${n(x1 - f)} ${n(y0)}H${n(x0 + c)}A${n(c)} ${n(c)} 0 0 0 ${n(x0)} ${n(y0 + c)}V${n(y1 - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x0 + c)} ${n(y1)}H${n(x1 - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x1)} ${n(y1 - c)}V18`, { n: 'page', role: S }),
        line(arrow(g, [8, ay], [22 - h, ay], L2), { n: 'arrow', role: P })
      ];
    },
    area: (g) => { const { h } = g, x0 = 3 + h, x1 = 14 - h, y0 = 2 + h, y1 = 22 - h, c = 3 - h; return [{ n: 'page', d: `M${n(x1)} ${n(y0 + 4)}L${n(x1 - 4)} ${n(y0)}H${n(x0 + c)}A${n(c)} ${n(c)} 0 0 0 ${n(x0)} ${n(y0 + c)}V${n(y1 - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x0 + c)} ${n(y1)}H${n(x1 - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x1)} ${n(y1 - c)}Z` }]; },
    light: ['arrow'],
    fx: { t: 'keys', on: ['arrow'], x: [1.2, -0.2] }
  }
};
