// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// shapes: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: circle square triangle hexagon pentagon octagon diamond infinity
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { slash } from '../kit.mjs';
import { off } from '../variants.mjs';

/**
 * Regular polygon placed by its OUTER edge, so it keeps its size at every weight: k sides,
 * circumradius Ro (outer), centre (cx, cy), first vertex at angle a0 (degrees), outer corner
 * radius co. The centre line is the outer polygon inset by half the stroke.
 */
export function ngon(g, k, Ro, cx, cy, a0, co) {
  const { h } = g, Rc = Ro - h / Math.cos(Math.PI / k), pts = [];
  for (let i = 0; i < k; i++) { const a = ((a0 + (i * 360) / k) * Math.PI) / 180; pts.push([cx + Rc * Math.cos(a), cy + Rc * Math.sin(a)]); }
  return g.polygon(pts, Math.max(co - h, 0.25));
}

/**
 * A convex polygon given by its OUTER corners, inset by half the stroke: the centre line, so each
 * straight edge keeps its outer position at every weight.
 */
function inset(g, pts) {
  const N = pts.length, cx = pts.reduce((a, p) => a + p[0], 0) / N, cy = pts.reduce((a, p) => a + p[1], 0) / N;
  const lines = pts.map((p, i) => {
    const q = pts[(i + 1) % N], dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
    let nx = -dy / L, ny = dx / L;
    if (nx * (cx - p[0]) + ny * (cy - p[1]) < 0) { nx = -nx; ny = -ny; }
    return { p: [p[0] + nx * g.h, p[1] + ny * g.h], d: [dx, dy] };
  });
  return lines.map((b, i) => {
    const a = lines[(i + N - 1) % N], den = a.d[0] * b.d[1] - a.d[1] * b.d[0];
    const t = ((b.p[0] - a.p[0]) * b.d[1] - (b.p[1] - a.p[1]) * b.d[0]) / den;
    return [a.p[0] + a.d[0] * t, a.p[1] + a.d[1] * t];
  });
}
// A clockwise arc round centre c (radius r) from the current point a to b, large when it turns past 180°.
function arcTo(c, r, a, b) {
  const ang = (q) => Math.atan2(q[1] - c[1], q[0] - c[0]), turn = (((ang(b) - ang(a)) * 180) / Math.PI + 360) % 360;
  return `A${n(r)} ${n(r)} 0 ${turn > 180 ? 1 : 0} 1 ${n(b[0])} ${n(b[1])}`;
}
// The meeting point of two circles on the given side (+1: the one with the larger y).
function meet([x1, y1, r1], [x2, y2, r2], side) {
  const dx = x2 - x1, dy = y2 - y1, D = Math.hypot(dx, dy), a = (r1 * r1 - r2 * r2 + D * D) / (2 * D), hh = Math.sqrt(Math.max(r1 * r1 - a * a, 0));
  const mx = x1 + (a * dx) / D, my = y1 + (a * dy) / D, p = [mx + (hh * dy) / D, my - (hh * dx) / D], q = [mx - (hh * dy) / D, my + (hh * dx) / D];
  return (p[1] - q[1]) * side > 0 ? p : q;
}

const SET = {
  circle: {
    label: '圆形', key: 'circle',
    plan: '主体：圆，直径 20',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.ring(12, 12, 10), { n: 'shape', role: P })]; },
    fx: { t: 'keys', on: 'all', o: [12, 12], s: [0.86, 1.04] }
  },
  square: {
    label: '正方形', key: 'square',
    plan: '主体：方块，18，外圆角 4.5（与日历相同）',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.box(3, 3, 18, 18, 4.5), { n: 'shape', role: P })]; },
    // 转四分之一圈，正好转回原样
    fx: { t: 'rotate', on: 'all', deg: 90, dip: 0.08 }
  },
  triangle: {
    label: '三角形', key: 'square', nudge: [0, 0.75],
    plan: '主体：正三角形，尖角圆角与播放相同；尖角会显得小，三个角伸出参考线，按光学中心上下摆放',
    weights: { [P]: 1 },
    draw(g) { return [shell(ngon(g, 3, 14.5, 12, 12.75, -90, 3.5), { n: 'shape', role: P })]; },
    fx: { t: 'rotate', on: 'all', deg: 120, o: [12, 12.75], dip: 0.06 },
    allow: { keyline: '三角形的三个角伸出参考线，底边在 20，按光学中心摆放' }
  },
  hexagon: {
    label: '六边形', key: 'square',
    plan: '主体：正六边形（上下是尖角，左右是竖边，竖边落在 3 和 21 上），尖角伸出一点',
    weights: { [P]: 1 },
    draw(g) { return [shell(ngon(g, 6, 9 / Math.cos(Math.PI / 6), 12, 12, -90, 3), { n: 'shape', role: P })]; },
    fx: { t: 'rotate', on: 'all', deg: 60, dip: 0.06 },
    allow: { keyline: '上下两个尖角伸出方框参考线约 1' }
  },
  pentagon: {
    label: '五边形', key: 'square',
    plan: '主体：正五边形，尖角朝上，底边在 21；五边形比方块显得小，尖角伸出参考线',
    weights: { [P]: 1 },
    draw(g) { const Ro = 11; return [shell(ngon(g, 5, Ro, 12, 21 - Ro * Math.cos(Math.PI / 5), -90, 3), { n: 'shape', role: P })]; },
    fx: { t: 'rotate', on: 'all', deg: 72, o: [12, 21 - 11 * Math.cos(Math.PI / 5)], dip: 0.06 },
    allow: { keyline: '五边形的尖角伸出方框参考线，宽约 19.6' }
  },
  octagon: {
    label: '八边形', key: 'circle',
    plan: '主体：正八边形，上下左右四条边落在 2 和 22 上（和圆一样大，比方块大，才显得一样大）',
    weights: { [P]: 1 },
    draw(g) { return [shell(ngon(g, 8, 10 / Math.cos(Math.PI / 8), 12, 12, -90 + 22.5, 2.5), { n: 'shape', role: P })]; },
    fx: { t: 'rotate', on: 'all', deg: 45, dip: 0.06 }
  },
  diamond: {
    label: '菱形', key: 'live',
    plan: '主体：菱形（方块转 45°）；尖角会显得小，四个角伸到可用区域外一点',
    weights: { [P]: 1 },
    draw(g) { return [shell(ngon(g, 4, 11.95, 12, 12, -90, 3.5), { n: 'shape', role: P })]; },
    fx: { t: 'rotate', on: 'all', deg: 90, dip: 0.08 },
    allow: { keyline: '菱形的四个尖角各伸出可用区域约 0.5' }
  },
  infinity: {
    label: '无限', key: 'landscape', fit: 'x',
    plan: '主体：无限符号：两个圆环，用过中心交叉的两条切线连成一笔',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, ro = 5, r = ro - h, d = 12 - 2 - ro, c1 = 12 - d, c2 = 12 + d, al = Math.acos(r / d);
      const p = (x, y) => `${n(x)} ${n(y)}`, ca = r * Math.cos(al), sa = r * Math.sin(al);
      return [line(`M${p(c1 + ca, 12 - sa)}A${n(r)} ${n(r)} 0 1 0 ${p(c1 + ca, 12 + sa)}L${p(c2 - ca, 12 - sa)}A${n(r)} ${n(r)} 0 1 1 ${p(c2 - ca, 12 + sa)}Z`, { n: 'loop', role: P })];
    },
    area: (g) => { const r = 5 - g.h; return [{ n: 'loop', d: g.circ(7, 12, r) + g.circ(17, 12, r) }]; },
    fx: { t: 'draw', on: ['loop'] }
  },
  'rectangle-horizontal': {
    label: '横向矩形', key: 'landscape', fit: 'x',
    plan: '主体：横向矩形，20×14，外圆角 3.5（比方块扁，才不会读成方块）',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.box(2, 5, 20, 14, 3.5), { n: 'shape', role: P })]; },
    // 转半圈，正好转回原样
    fx: { t: 'rotate', on: 'all', deg: 180, dip: 0.08 }
  },
  'rectangle-vertical': {
    label: '竖向矩形', key: 'portrait', fit: 'y',
    plan: '主体：竖向矩形，14×20，外圆角 3.5（横向矩形转 90°）',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.box(5, 2, 14, 20, 3.5), { n: 'shape', role: P })]; },
    fx: { t: 'rotate', on: 'all', deg: 180, dip: 0.08 }
  },
  squircle: {
    label: '超椭圆', key: 'square',
    plan: '主体：超椭圆（介于方块和圆之间，四边连续弯曲），18×18',
    weights: { [P]: 1 },
    draw(g) {
      // each quarter is one cubic from the middle of a side to the middle of the next
      const a = 9 - g.h, k = 0.8 * a, m = 0.2 * a, p = (x, y) => `${n(12 + x)} ${n(12 + y)}`;
      return [shell(`M${p(0, -a)}C${p(k, -a)} ${p(a, -k)} ${p(a, 0)}C${p(a, k)} ${p(k, a)} ${p(0, a)}C${p(-k, a)} ${p(-a, k)} ${p(-a, 0)}C${p(-a, -k)} ${p(-k, -a)} ${p(0, -a)}Z`, { n: 'shape', role: P })];
    },
    fx: { t: 'rotate', on: 'all', deg: 90, dip: 0.06 }
  },
  oval: {
    label: '椭圆', key: 'landscape', fit: 'x',
    plan: '主体：横放的椭圆，20×14',
    weights: { [P]: 1 },
    draw(g) { const rx = n(10 - g.h), ry = n(7 - g.h); return [shell(`M${n(2 + g.h)} 12A${rx} ${ry} 0 0 1 ${n(22 - g.h)} 12A${rx} ${ry} 0 0 1 ${n(2 + g.h)} 12Z`, { n: 'shape', role: P })]; },
    fx: { t: 'keys', on: 'all', o: [12, 12], sx: [0.8, 1.04], sy: [1.2, 0.98], ms: 300 }
  },
  semicircle: {
    label: '半圆', key: 'landscape', fit: 'x',
    plan: '主体：半圆（直径 20 的上半），底边两角倒小圆角',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.box(2, 6, 20, 11, [10, 10, 1, 1]), { n: 'shape', role: P })]; },
    fx: { t: 'keys', on: 'all', o: [12, 17], sy: [0.8, 1.05], ms: 280 }
  },
  cross: {
    label: '十字', key: 'square',
    plan: '主体：十字形（两条宽 6 的臂，一个闭合形），凸角倒圆，凹角为直角',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, a = 3 + h, b = 9 + h, c = 15 - h, d = 21 - h, r = 1.5 - h * 0.5;
      return [shell(g.polygon([[b, a], [c, a], [c, b], [d, b], [d, c], [c, c], [c, d], [b, d], [b, c], [a, c], [a, b], [b, b]], [r, r, 0, r, r, 0, r, r, 0, r, r, 0]), { n: 'shape', role: P })];
    },
    // 转四分之一圈，正好转回原样
    fx: { t: 'rotate', on: 'all', deg: 90, dip: 0.06 }
  },
  'circle-dashed': {
    label: '虚线圆', key: 'circle',
    plan: '主体：虚线圆（八段弧，与圆形同大），段间空隙为一个线宽加 1.5',
    weights: { [P]: 1 },
    draw(g) {
      const r = 10 - g.h, gap = ((g.s + g.clear) / r) * (180 / Math.PI);
      return [line(Array.from({ length: 8 }, (_, i) => g.arc(12, 12, r, i * 45 - 22.5 + gap / 2, i * 45 + 22.5 - gap / 2)).join(''), { n: 'dash', role: P })];
    },
    area: (g) => [{ n: 'dash', d: g.circ(12, 12, 10 - g.h) }],
    // 转八分之一圈，正好转回原样
    fx: { t: 'rotate', on: 'all', deg: 45 }
  },
  'square-dashed': {
    label: '虚线方框', key: 'square',
    plan: '主体：虚线方框（四个圆角和四段短边，与方块同大）。圆角段保留整段圆弧，边上的短段居中',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, a = 3 + h, b = 21 - h, c = 4.5 - h, m = Math.max(0.5, 12 - (a + c) - g.s - g.clear), R = n(c);
      const corner = (x0, y0, x1, y1) => `M${n(x0)} ${n(y0)}A${R} ${R} 0 0 1 ${n(x1)} ${n(y1)}`;
      return [line(
        corner(a, a + c, a + c, a) + corner(b - c, a, b, a + c) + corner(b, b - c, b - c, b) + corner(a + c, b, a, b - c) +
        g.seg(12 - m, a, 12 + m, a) + g.seg(b, 12 - m, b, 12 + m) + g.seg(12 - m, b, 12 + m, b) + g.seg(a, 12 - m, a, 12 + m), { n: 'dash', role: P })];
    },
    area: (g) => [{ n: 'dash', d: g.rr(3 + g.h, 3 + g.h, 18 - g.s, 18 - g.s, 4.5 - g.h) }],
    fx: { t: 'rotate', on: 'all', deg: 90, dip: 0.08 }
  },
  'triangle-right': {
    label: '直角三角形', key: 'square', nudge: [1, -1],
    plan: '主体：直角三角形（直角在左下），两个尖角圆角 1。分量在直角一侧，两条直角边各向内收 2，两个尖角按圆角收回的长度向外伸，按光学中心摆放',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.polygon(inset(g, [[5, -0.6], [24.6, 19], [5, 19]]), [1, 1, 3 - g.h]), { n: 'shape', role: P })]; },
    fx: { t: 'keys', on: 'all', o: [5, 19], s: [0.86, 1.04], ms: 280 },
    allow: { keyline: '直角三角形的分量在直角一侧：直角边落在 5 和 19，两个尖角伸到 2.25 和 21.75，按光学中心摆放' }
  },
  parallelogram: {
    label: '平行四边形', key: 'landscape', fit: 'x',
    plan: '主体：向右倾斜的平行四边形，上下边水平，高 14',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.polygon(inset(g, [[7, 5], [23.1, 5], [17, 19], [0.9, 19]]), [2, 1.2, 2, 1.2]), { n: 'shape', role: P })]; },
    fx: { t: 'keys', on: 'all', o: [12, 12], sx: [0.88, 1.03], ms: 280 }
  },
  trapezoid: {
    label: '梯形', key: 'landscape', fit: 'x',
    plan: '主体：上窄下宽的梯形，上下边水平，高 14',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.polygon(inset(g, [[7.5, 5], [16.5, 5], [23.2, 19], [0.8, 19]]), [2, 2, 1.2, 1.2]), { n: 'shape', role: P })]; },
    fx: { t: 'keys', on: 'all', o: [12, 19], sy: [0.84, 1.04], ms: 280 }
  },
  pyramid: {
    label: '棱锥', key: 'live',
    anchor: 'base',
    plan: '主体：棱锥的外形（尖顶、两侧和前下角）；细节：从尖顶到前下角的棱。面性中棱的两端离尖顶和下角各留出一段，只开一道缝',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g, ctx) {
      const P0 = inset(g, [[12, 0.6], [22.6, 16], [12, 22], [1.4, 16]]), fill = ctx?.variant === 'fill';
      const edge = fill ? g.seg(12, 2 + g.h + 2.5 * g.s, 12, 22 - g.h - 2.5 * g.s) : g.seg(12, 2 + g.h, 12, 22 - g.h);
      return [shell(g.polygon(P0, [1.2, 1.4, 2, 1.4]), { n: 'shape', role: P }), line(edge, { n: 'edge', role: D, on: 'shape', ends: 'keep' })];
    },
    fx: { t: 'bounce', on: 'all', o: [12, 22], amp: 0.6 },
    allow: { keyline: '尖顶和两侧的角伸出可用区域约 0.5' }
  },
  cylinder: {
    label: '圆柱', key: 'portrait',
    anchor: 'base',
    plan: '主体：圆柱的外形（两侧竖线、下沿半个椭圆、顶面后沿）；细节：顶面前沿的半个椭圆',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g, ctx) {
      const { h } = g, a = n(8 - h), b = n(3 - h), x0 = n(4 + h), x1 = n(20 - h);
      return [
        shell(`M${x0} 5V19A${a} ${b} 0 0 0 ${x1} 19V5A${a} ${b} 0 0 0 ${x0} 5Z`, { n: 'body', role: P }),
        // fill: the rim stops short of the sides, where the top would leave a thin wedge
        line(ctx?.variant === 'fill' ? `M${n(12 - a * 0.7)} ${n(5 + b * 0.71)}A${a} ${b} 0 0 0 ${n(12 + a * 0.7)} ${n(5 + b * 0.71)}` : `M${x0} 5A${a} ${b} 0 0 0 ${x1} 5`, { n: 'rim', role: D, on: 'body' })
      ];
    },
    fx: { t: 'bounce', on: 'all', o: [12, 22], amp: 0.6 }
  },
  cone: {
    label: '圆锥', key: 'portrait',
    anchor: 'base',
    plan: '主体：圆锥的外形（尖顶、两条切线、底面前沿）；细节：底面后沿（只在线性中画出）',
    weights: { [P]: 0.73, [D]: 0.27 },
    draw(g) {
      const { h } = g, a = 8 - h, b = 3 - h, cy = 19, V = [12, 1.2 + h], r = 1;
      // tangent points from the apex to the base ellipse
      const yt = cy + (b * b) / (V[1] - cy), xt = a * Math.sqrt(1 - ((yt - cy) / b) ** 2), TL = [12 - xt, yt], TR = [12 + xt, yt];
      const al = Math.atan2(xt, yt - V[1]), t = r / Math.tan(al), u = Math.hypot(xt, yt - V[1]);
      const pL = [V[0] - (xt / u) * t, V[1] + ((yt - V[1]) / u) * t], pR = [V[0] + (xt / u) * t, pL[1]], p = (q) => `${n(q[0])} ${n(q[1])}`;
      return [
        shell(`M${p(TL)}L${p(pL)}A${r} ${r} 0 0 1 ${p(pR)}L${p(TR)}A${n(a)} ${n(b)} 0 1 1 ${p(TL)}Z`, { n: 'body', role: P }),
        line(`M${p(TL)}A${n(a)} ${n(b)} 0 0 1 ${p(TR)}`, { n: 'rim', role: D, on: 'body', only: 'outline' })
      ];
    },
    fx: { t: 'bounce', on: 'all', o: [12, 22], amp: 0.6 },
    allow: { keyline: '尖顶伸出参考线约 0.8，尖角会显得小' }
  },
  club: {
    label: '梅花', key: 'live',
    plan: '主体：三个圆合成的梅花（一个闭合形）；辅助：从下方交点垂下的花柄（一条线）',
    weights: { [P]: 0.88, [S]: 0.12 },
    draw(g) {
      const R = 5.75 - g.h, T = [12, 7.75, R], L = [7.75, 13.25, R], Rt = [16.25, 13.25, R];
      const B = meet(L, Rt, 1), TL = meet(T, L, -1), TR = meet(T, Rt, -1);
      return [
        shell(`M${n(B[0])} ${n(B[1])}` + arcTo(L, R, B, TL) + arcTo(T, R, TL, TR) + arcTo(Rt, R, TR, B) + 'Z', { n: 'club', role: P }),
        line(g.seg(12, B[1], 12, 22 - g.h), { n: 'stem', role: S })
      ];
    },
    fx: { t: 'wiggle', on: 'all', o: [12, 22], deg: 8 }
  },
  spade: {
    label: '黑桃', key: 'live',
    plan: '主体：倒过来的心形（与喜欢的心形同法画成）；辅助：从下方凹口垂下的花柄（一条线）',
    weights: { [P]: 0.82, [S]: 0.18 },
    draw(g) {
      // the heart drawn upside down: its point at the top, the two lobes below
      const top = 6.5, R = 6.2, d = 10 - R, r = R - g.h, my = top + R - Math.sqrt(Math.max(r * r - d * d, 0));
      return [
        shell(heart(g, { w: 20, top, tip: 22.2, R }), { n: 'spade', role: P, tf: 'matrix(1 0 0 -1 0 24)' }),
        line(g.seg(12, 24 - my, 12, 22 - g.h), { n: 'stem', role: S })
      ];
    },
    fx: { t: 'wiggle', on: 'all', o: [12, 22], deg: 8 }
  },
  shapes: {
    label: '形状', key: 'square',
    light: [],
    plan: '主体：三个基本形状：上方的三角形（最大）、左下的方块、右下的圆，彼此隔开 2 以上。下方两个小一些，分量才不偏下',
    weights: { [P]: 1 },
    draw(g) {
      return [
        shell(ngon(g, 3, 7.5, 12, 8.25, -90, 2.2), { n: 'tri', role: P }),
        shell(g.box(3, 14, 7, 7, 1.75), { n: 'sq', role: P }),
        shell(g.ring(17.5, 17.5, 3.5), { n: 'circ', role: P })
      ];
    },
    allow: { optical: '下方并排两个形状，分量偏下约 0.8；三角形再放大就伸出画布' },
    fx: [{ t: 'rotate', on: ['tri'], deg: 120, o: [12, 8.25] }, { t: 'rotate', on: ['sq'], deg: 90, o: [6.5, 17.5], delay: 80 }, { t: 'keys', on: ['circ'], o: [17.5, 17.5], s: [0.8, 1.05], delay: 160 }]
  }
};

// Variants made by rule (GUIDE.md §4.4).
SET['circle-off'] = off({ ...slash(SET.circle, { label: '圆形（关闭）' }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'circle', { t: 'keys', on: ['shape'], o: [12, 12], s: [0.88], ms: 240 });

export default SET;
