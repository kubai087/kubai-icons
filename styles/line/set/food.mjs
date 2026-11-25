// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// food: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: coffee mug utensils cake apple wine beer cup-soda pizza ice-cream
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// One cup language for coffee, mug and beer: a body with small top corners (1.5) and round
// bottom corners (4), and a handle on its right side that is the right half of a rounded box of
// radius 3, by centre lines; x is the body's right side, from y0 to y1.
const BODY_C = [1.5, 1.5, 4, 4];
const handle = (x, y0, y1, xr = x + 5) => `M${x} ${y0}H${xr - 3}A3 3 0 0 1 ${xr} ${y0 + 3}V${y1 - 3}A3 3 0 0 1 ${xr - 3} ${y1}H${x}`;

export default {
  coffee: {
    anchor: 'base',
    label: '咖啡', key: 'square',
    plan: '主体：杯身（同马克杯的杯形，矮一些）；辅助：把手和托盘（托盘比杯子宽，两者合起来和杯身差不多）；细节：两道热气',
    weights: { [P]: 0.46, [S]: 0.44, [D]: 0.1 },
    draw(g) {
      return [
        shell(g.box(4, 8, 12, 9, BODY_C), { n: 'cup', role: P }),
        line(handle(15, 10, 16, 19), { n: 'handle', role: S }),
        line(g.span(3, 20, 21, 20), { n: 'saucer', role: S }),
        line(g.span(8, 3, 8, 6.5), { n: 's1', role: D }),
        line(g.span(12, 3, 12, 6.5), { n: 's2', role: D })
      ];
    },
    light: ['s1', 's2'],
    // 热气: the steam rises and fades, then comes back
    fx: { t: 'keys', on: [['s1'], ['s2']], by: true, stagger: 120, y: [-1.2, 0.8, 0], a: [0, 0, 1] }
  },
  mug: {
    label: '马克杯', key: 'square',
    light: [], // one object: the handle keeps the body's tone
    plan: '主体：杯身（高）；辅助：把手（同咖啡杯的把手）',
    weights: { [P]: 0.76, [S]: 0.24 },
    draw(g) {
      return [shell(g.box(3, 3, 13, 18, BODY_C), { n: 'cup', role: P }), line(handle(15, 7, 15), { n: 'handle', role: S })];
    },
    // 举杯: the mug tips as if lifted to drink
    fx: { t: 'keys', on: 'all', o: [9, 21], r: [-9, 2], y: [-0.8, 0], ms: 380 }
  },
  utensils: {
    allow: { optical: '叉子和刀并排占满高度，叉齿集中在上方，按餐具全长定位' },
    label: '餐具', key: 'live',
    plan: '主体：叉子（U 形的两根外齿、中间一齿和柄）；辅助：刀（刀身和刀柄）',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g) {
      const { h } = g, top = 2 + h;
      return [
        line(`M3 ${n(top)}V8A4 4 0 0 0 11 8V${n(top)}` + g.seg(7, top, 7, 22 - h), { n: 'fork', role: P }),
        shell(`M21 14V${n(top)}A5 5 0 0 0 16 ${n(top + 5)}V12A2 2 0 0 0 18 14Z`, { n: 'blade', role: S }),
        line(g.seg(21, 14, 21, 22 - h), { n: 'knife', role: S })
      ];
    },
    light: [],
    // 开饭: the fork and the knife tap together
    fx: [{ t: 'keys', on: ['fork'], o: [7, 22], r: [7, -2], ms: 300 }, { t: 'keys', on: ['blade', 'knife'], o: [21, 22], r: [-7, 2], ms: 300 }]
  },
  cake: {
    anchor: 'base',
    label: '蛋糕', key: 'square',
    ends: 'in',
    plan: '主体：蛋糕（圆角矩形）；辅助：三根蜡烛和火苗（实心点，随字重缩小以保持间距）；细节：中间一道波浪奶油线（两端接到侧边）。蜡烛和奶油线把蛋糕的墨量分走不少，主体约占四成多',
    weights: { [P]: 0.44, [S]: 0.32, [D]: 0.24 },
    draw(g) {
      const { s } = g, k = 1 - (s - 2) * 0.4, y = 16, a = 0.8, w = 4, rr = (w * w / 4 + a * a) / (2 * a);
      let wave = `M4 ${y}`;
      for (let i = 0; i < 4; i++) wave += `A${n(rr)} ${n(rr)} 0 0 ${i % 2 ? 1 : 0} ${4 + (i + 1) * w} ${y}`;
      return [
        shell(g.box(3, 11, 18, 10, [2.5, 2.5, 3.5, 3.5]), { n: 'cake', role: P }),
        line(wave, { n: 'cream', role: D, on: 'cake' }),
        line([7, 12, 17].map((x) => g.seg(x, 8.6, x, 11)).join(''), { n: 'candles', role: S }),
        ...[7, 12, 17].map((x, i) => solid(g.dot(x, 4.4, k), { n: `f${i}`, role: S }))
      ];
    },
    light: ['candles', 'f0', 'f1', 'f2', 'cream'],
    // 生日: the flames flicker, each in its own time
    fx: [
      { t: 'keys', on: ['f0'], o: [7, 5.4], s: [1.3, 0.85, 1.1], ms: 520 },
      { t: 'keys', on: ['f1'], o: [12, 5.4], s: [0.8, 1.3, 0.95], ms: 520 },
      { t: 'keys', on: ['f2'], o: [17, 5.4], s: [1.2, 0.9, 1.25], ms: 520 }
    ]
  },
  apple: {
    label: '苹果', key: 'square',
    plan: '主体：苹果（两个左右相交的竖椭圆，上下各有一个浅凹）；辅助：果柄（斜线）和叶子（实心，太小画不出线框）',
    weights: { [P]: 0.86, [S]: 0.14 },
    draw(g) {
      const { h } = g, d = 2.4, rx = 6.6 - h, ry = 8 - h, cy = 13, dy = ry * Math.sqrt(1 - (d / rx) ** 2), top = cy - dy, bot = cy + dy;
      return [
        shell(`M12 ${n(top)}A${n(rx)} ${n(ry)} 0 1 0 12 ${n(bot)}A${n(rx)} ${n(ry)} 0 1 0 12 ${n(top)}Z`, { n: 'apple', role: P }),
        line(g.seg(12, top, 12.8, 3.4 + h), { n: 'stem', role: S }),
        solid(g.polygon([[14.8, 6.6], [16.6, 3.8], [19.6, 3], [18, 5.8]], [0.4, 1.2, 0.4, 1.2]), { n: 'leaf', role: S })
      ];
    },
    light: ['stem', 'leaf'],
    // 苹果: the apple drops and bounces
    fx: { t: 'bounce', on: 'all', o: [12, 21], amp: 1.2 }
  },
  wine: {
    anchor: 'base',
    label: '红酒', key: 'portrait', fit: 'y',
    ends: 'in',
    plan: '主体：杯肚（上沿平，下面是半圆）；辅助：杯脚（竖线和底座）；细节：酒面（横线，两端接到杯壁）',
    weights: { [P]: 0.5, [S]: 0.32, [D]: 0.18 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(6, 2, 12, 11, [1.5, 1.5, 6, 6]), { n: 'bowl', role: P }),
        line(g.seg(6 + h, 7, 18 - h, 7), { n: 'wine', role: D, on: 'bowl' }),
        line(g.seg(12, 13 - h, 12, 21) + g.span(7, 21, 17, 21), { n: 'stem', role: S })
      ];
    },
    light: ['wine'],
    // 摇杯: the glass swirls about its foot
    fx: [{ t: 'wiggle', on: ['bowl', 'wine', 'stem'], o: [12, 21], deg: 6, hz: 2.4 }, { t: 'keys', on: ['wine'], o: [12, 7], r: [-8, 6, -3], ms: 560 }]
  },
  beer: {
    anchor: 'base',
    label: '啤酒', key: 'square',
    light: [],
    plan: '主体：杯身（同马克杯）；辅助：把手（同马克杯）和杯口的泡沫（三个圆连成一个云形，立在杯口上，中间高）。泡沫和把手合起来比杯身墨多，但层级靠后',
    weights: { [P]: 0.42, [S]: 0.58 },
    draw(g) {
      // the foam stands on the glass's rim: its base line is the rim's centre line at every weight
      const base = 8 + g.s, dy = base - 10;
      return [
        shell(g.box(3, 8, 13, 13, BODY_C), { n: 'glass', role: P }),
        shell(cloud(g, [[6.8, 7.4 + dy, 2.6], [10.5, 6.5 + dy, 3.5], [13.9, 7.6 + dy, 2.4]], base), { n: 'foam', role: S }),
        line(handle(15, 13, 19), { n: 'handle', role: S })
      ];
    },
    // 干杯: the foam swells over the rim
    fx: { t: 'keys', on: ['foam'], o: [10.5, 10], s: [1.16, 0.96], ms: 420 }
  },
  'cup-soda': {
    allow: { keyline: '杯子本身窄，宽 16，左右各差 1' },
    label: '汽水', key: 'square',
    light: ['straw'],
    plan: '主体：杯身（上宽下窄）；辅助：拱起的杯盖（与杯口同宽，不出头，免得读成垃圾桶）和吸管（从杯盖顶上伸出，向右折）。杯身占六成',
    weights: { [P]: 0.61, [S]: 0.39 },
    draw(g) {
      const { h } = g, lid = 10, x0 = 4 + h, x1 = 20 - h, sag = 3, R = ((x1 - x0) ** 2 / 4 + sag * sag) / (2 * sag);
      return [
        shell(g.polygon([[x0, lid], [x1, lid], [17.5, 21 - h], [6.5, 21 - h]], [0.6, 0.6, 2.5, 2.5]), { n: 'cup', role: P }),
        line(`M${n(x0)} ${lid}A${n(R)} ${n(R)} 0 0 1 ${n(x1)} ${lid}`, { n: 'lid', role: S }),
        line(g.pl([[12.5, lid - sag], [13.5, 3 + h], [18, 3 + h]]), { n: 'straw', role: S })
      ];
    },
    // 吸一口: the straw bobs
    fx: { t: 'keys', on: ['straw'], y: [-1, 0.3], ms: 300 }
  },
  pizza: {
    nudge: [0, 0.8],
    label: '披萨', key: 'portrait',
    plan: '主体：一角披萨（扇形，尖朝下，饼边是圆弧）；细节：三片香肠（实心点，随字重缩小）。尖朝下的扇形上重下轻，整体下移 0.8',
    weights: { [P]: 0.86, [D]: 0.14 },
    draw(g) {
      const { h } = g, T = [12, 22.8 - h], R = T[1] - 2.8 - h, a = (27 * Math.PI) / 180;
      const L = [12 - R * Math.sin(a), T[1] - R * Math.cos(a)], Rt = [12 + R * Math.sin(a), T[1] - R * Math.cos(a)], p = (q) => `${n(q[0])} ${n(q[1])}`;
      return [
        shell(`M${p(T)}L${p(L)}A${n(R)} ${n(R)} 0 0 1 ${p(Rt)}Z`, { n: 'slice', role: P }),
        ...[[9.9, 8.2], [13.9, 9.4], [12, 13.2]].map(([x, y], i) => solid(g.dot(x, y, 0.8 - (g.s - 2) * 0.5), { n: `p${i}`, role: D, on: 'slice' }))
      ];
    },
    // 拿起一角: the slice lifts and settles
    fx: { t: 'keys', on: 'all', o: [12, 21], y: [-1.2, 0.2], r: [-5, 1], ms: 360 },
    allow: { keyline: '扇形的两个上角是饼边的两端，宽 18，比纵向方框宽' }
  },
  'ice-cream': {
    nudge: [0, 0.6],
    label: '冰淇淋', key: 'portrait',
    plan: '主体：冰淇淋球（上面是半圆，底边是三个向下的小圆弧，像化开的奶油）；辅助：蛋筒（倒三角，上沿藏在球后面）。球大筒尖，上重下轻，整体下移 0.6',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g, ctx) {
      const { h } = g, cy = 10.6, r = 8 - h, x0 = 12 - r, x1 = 12 + r, w = (x1 - x0) / 3, sag = 1.5, rb = (w * w / 4 + sag * sag) / (2 * sag);
      // filled, the cone's top is 0.5 narrower each side: the scoop's clear band then crosses
      // its sides where the scallop rises, so no sharp tip of ink is left there
      const d = ctx?.variant === 'fill' ? 0.5 : 0;
      let scoop = `M${n(x0)} ${cy}A${n(r)} ${n(r)} 0 0 1 ${n(x1)} ${cy}`;
      for (let i = 1; i <= 3; i++) scoop += `A${n(rb)} ${n(rb)} 0 0 1 ${n(x1 - i * w)} ${cy}`;
      return [
        shell(g.polygon([[7 + d, 12], [17 - d, 12], [12, 24.18 - h]], [0, 0, 1]), { n: 'cone', role: S }),
        shell(scoop + 'Z', { n: 'scoop', role: P, occ: true })
      ];
    },
    // 冰淇淋: the scoop wobbles on the cone
    fx: { t: 'wiggle', on: ['scoop'], o: [12, 11.6], deg: 8, hz: 2.6 }
  }
};
