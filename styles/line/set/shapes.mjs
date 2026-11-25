// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// shapes: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: circle square triangle hexagon pentagon octagon diamond infinity
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

/**
 * Regular polygon placed by its OUTER edge, so it keeps its size at every weight: k sides,
 * circumradius Ro (outer), centre (cx, cy), first vertex at angle a0 (degrees), outer corner
 * radius co. The centre line is the outer polygon inset by half the stroke.
 */
function ngon(g, k, Ro, cx, cy, a0, co) {
  const { h } = g, Rc = Ro - h / Math.cos(Math.PI / k), pts = [];
  for (let i = 0; i < k; i++) { const a = ((a0 + (i * 360) / k) * Math.PI) / 180; pts.push([cx + Rc * Math.cos(a), cy + Rc * Math.sin(a)]); }
  return g.polygon(pts, Math.max(co - h, 0.25));
}

export default {
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
  }
};
