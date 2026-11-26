// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// food: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: coffee mug utensils cake apple wine beer cup-soda pizza ice-cream
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { slash } from '../kit.mjs';
import { off } from '../variants.mjs';

// One cup language for coffee, mug and beer: a body with small top corners (1.5) and round
// bottom corners (4), and a handle on its right side that is the right half of a rounded box of
// radius 3, by centre lines; x is the body's right side, from y0 to y1.
const BODY_C = [1.5, 1.5, 4, 4];
const handle = (x, y0, y1, xr = x + 5) => `M${x} ${y0}H${xr - 3}A3 3 0 0 1 ${xr} ${y0 + 3}V${y1 - 3}A3 3 0 0 1 ${xr - 3} ${y1}H${x}`;

// A path of M, L, H, V, A and Z (absolute) turned by deg about (12, 12), then moved by dx, dy.
function turn(d, deg, dx = 0, dy = 0) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), t = d.match(/[MLHVAZ]|-?\d*\.?\d+/g), P2 = ([x, y]) => `${n(12 + dx + (x - 12) * c - (y - 12) * s)} ${n(12 + dy + (x - 12) * s + (y - 12) * c)}`;
  let out = '', i = 0, x = 0, y = 0, cmd = '';
  while (i < t.length) {
    if (/[A-Z]/.test(t[i])) cmd = t[i++];
    if (cmd === 'Z') { out += 'Z'; continue; }
    if (cmd === 'M' || cmd === 'L') { x = +t[i++]; y = +t[i++]; out += `${cmd}${P2([x, y])}`; }
    else if (cmd === 'H') { x = +t[i++]; out += `L${P2([x, y])}`; }
    else if (cmd === 'V') { y = +t[i++]; out += `L${P2([x, y])}`; }
    else if (cmd === 'A') { const [rx, ry, r0, l, sw] = t.slice(i, i + 5).map(Number); x = +t[i + 5]; y = +t[i + 6]; i += 7; out += `A${rx} ${ry} ${n(r0 + deg)} ${l} ${sw} ${P2([x, y])}`; }
  }
  return out;
}
// A wave of arcs from x0 to x1 at y, each w wide and rising a (centre line), first one up.
const waveLine = (x0, x1, y, count, a) => {
  const w = (x1 - x0) / count, r = (w * w / 4 + a * a) / (2 * a);
  let d = `M${n(x0)} ${n(y)}`;
  for (let i = 0; i < count; i++) d += `A${n(r)} ${n(r)} 0 0 ${i % 2 ? 0 : 1} ${n(x0 + (i + 1) * w)} ${n(y)}`;
  return d;
};
// The two points where circles (centre lines) c1 r1 and c2 r2 cross: the one left of the line
// from c1 to c2 first.
const meetCircles = ([x1, y1], r1, [x2, y2], r2) => {
  const dx = x2 - x1, dy = y2 - y1, Dd = Math.hypot(dx, dy), a = (r1 * r1 - r2 * r2 + Dd * Dd) / (2 * Dd), hh = Math.sqrt(Math.max(r1 * r1 - a * a, 0));
  const mx = x1 + (a * dx) / Dd, my = y1 + (a * dy) / Dd;
  return [[mx + (hh * dy) / Dd, my - (hh * dx) / Dd], [mx - (hh * dy) / Dd, my + (hh * dx) / Dd]];
};
// A leaf: two arcs between A and B bowing out by sag (centre line), as home's plant.
function leafBy(A, B, sag) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), rho = (L * L / 4 + sag * sag) / (2 * sag), p = (q) => `${n(q[0])} ${n(q[1])}`;
  return `M${p(A)}A${n(rho)} ${n(rho)} 0 0 1 ${p(B)}A${n(rho)} ${n(rho)} 0 0 1 ${p(A)}Z`;
}
// The bowl of soup, salad and ice-cream-bowl: a half ellipse under a flat rim at y 12, x 2..22.
const bowl = (g) => { const r = 10 - g.h, ry = 8.5 - g.h; return `M${n(12 - r)} 12H${n(12 + r)}A${n(r)} ${n(ry)} 0 0 1 ${n(12 - r)} 12Z`; };
// Points turned by deg about (12, 12).
const turnPts = (pts, deg) => { const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [12 + (x - 12) * c - (y - 12) * s, 12 + (x - 12) * s + (y - 12) * c]); };
const F = {
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
  },
  'utensils-crossed': {
    label: '餐厅', key: 'live',
    plan: '主体：叉子（U 形的两根外齿、中间一齿和柄，斜向右上）；辅助：刀（刀身和刀柄，斜向左上，在叉子前面）。刀身是闭合形，比叉子墨多',
    weights: { [P]: 0.4, [S]: 0.6 },
    draw(g) {
      const { h } = g, top = 2 + h, yb = 22 - h;
      return [
        line(turn(`M8.5 ${n(top)}V7A3.5 3.5 0 0 0 15.5 7V${n(top)}M12 ${n(top)}V${n(yb + 3.2)}`, 45, -0.7, 0), { n: 'fork', role: P }),
        shell(turn(`M14 13V${n(top)}A4.5 4.5 0 0 0 9.5 ${n(top + 4.5)}V11A2 2 0 0 0 11.5 13Z`, -45, -0.7, 0), { n: 'blade', role: S, occ: true, part: 'knife' }),
        line(turn(`M14 13V${n(yb + 3.2)}`, -45, -0.7, 0), { n: 'handle', role: S, gap: true, part: 'knife' })
      ];
    },
    light: [],
    // 开饭: the fork and the knife open apart a little and cross again
    fx: [{ t: 'keys', on: ['fork'], o: [12, 12], r: [8, -2], ms: 320 }, { t: 'keys', on: ['blade', 'handle'], o: [12, 12], r: [-8, 2], ms: 320 }]
  },
  'chef-hat': {
    anchor: 'base',
    label: '厨师帽', key: 'square',
    plan: '主体：蓬起的帽顶（三个圆连成，同云的画法）；辅助：下面的帽圈（三条边，与帽顶相连）',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) {
      const { h } = g;
      return [
        line(cup(7, 16 - h, 17, 21 - h, 2 - h), { n: 'band', role: S, only: 'outline' }),
        shell(g.rr(7 - h, 15, 10 + g.s, 6, [0, 0, 2, 2]), { n: 'band', role: S, only: 'fill' }),
        shell(cloud(g, [[7.5, 11.5, 4.5], [12, 8, 5], [16.5, 11.5, 4.5]], 16), { n: 'puff', role: P })
      ];
    },
    light: [],
    // 厨师帽: the hat puffs up
    fx: { t: 'keys', on: ['puff'], o: [12, 16], s: [1.08, 0.98], ms: 420 }
  },
  'glass-water': {
    label: '水杯', key: 'portrait',
    ends: 'in',
    plan: '主体：杯身（上宽下窄）；细节：水面（波浪线，两端接到杯壁）',
    weights: { [P]: 0.78, [D]: 0.22 },
    draw(g) {
      const { h } = g, x0 = 4 + h, x1 = 20 - h, t = 2 + h, b = 22 - h, y = 9, at = (x, xb) => x + ((xb - x) * (y - t)) / (b - t);
      return [
        shell(g.polygon([[x0, t], [x1, t], [17.5, b], [6.5, b]], [1, 1, 2.5, 2.5]), { n: 'glass', role: P }),
        line(waveLine(at(x0, 6.5), at(x1, 17.5), y, 4, 0.8), { n: 'water', role: D, on: 'glass' })
      ];
    },
    light: ['water'],
    // 水杯: the water sloshes
    fx: { t: 'keys', on: ['water'], o: [12, 9], r: [-6, 4, 0], ms: 520 }
  },
  cocktail: {
    anchor: 'base',
    label: '鸡尾酒', key: 'square',
    ends: 'in',
    plan: '主体：倒三角的杯肚；辅助：杯脚（竖线和底座）；细节：酒面（横线，两端接到杯壁）',
    weights: { [P]: 0.5, [S]: 0.3, [D]: 0.2 },
    draw(g) {
      const { h } = g, t = 3 + h, x0 = 1.75 + h, x1 = 22.25 - h, ap = 13, y = 7, k = (y - t) / (ap - t);
      return [
        shell(g.polygon([[x0, t], [x1, t], [12, ap]], [1, 1, 1.2]), { n: 'bowl', role: P }),
        line(g.seg(x0 + (12 - x0) * k, y, x1 - (x1 - 12) * k, y), { n: 'drink', role: D, on: 'bowl' }),
        line(g.seg(12, ap, 12, 21 - h) + g.span(8, 21 - h, 16, 21 - h), { n: 'stem', role: S })
      ];
    },
    light: ['drink'],
    // 干杯: the glass swirls
    fx: [{ t: 'wiggle', on: ['bowl', 'drink', 'stem'], o: [12, 21], deg: 6, hz: 2.4 }]
  },
  teapot: {
    anchor: 'base',
    label: '茶壶', key: 'square',
    plan: '主体：壶身（圆角矩形）；辅助：左边的壶嘴、右边的把手和顶上的壶盖（小拱和盖钮）',
    weights: { [P]: 0.65, [S]: 0.35 },
    draw(g) {
      const { h } = g;
      return [
        line(`M9.5 8V7.5A2.5 2.5 0 0 1 14.5 7.5V8` + g.seg(12, 5, 12, 3 + h), { n: 'lid', role: S }),
        line(g.seg(6, 13, 3.5 + h * 0.7, 9.5), { n: 'spout', role: S }),
        line(handle(18, 11, 17, 20), { n: 'handle', role: S }),
        shell(g.box(5, 8, 14, 13, [4, 4, 4.5, 4.5]), { n: 'body', role: P })
      ];
    },
    light: [],
    // 倒茶: the pot tips toward its spout
    fx: { t: 'keys', on: 'all', o: [12, 21], r: [-10, 2], ms: 420 }
  },
  milk: {
    label: '牛奶', key: 'portrait',
    ends: 'out',
    plan: '主体：奶盒（竖长，顶上是尖的屋脊）；细节：屋脊下沿的折线（面性中切开）和盒身上的圆形标签（圆环）',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g) {
      const { h } = g, x0 = 5 + h, x1 = 19 - h, t = 2 + h, yb = 22 - h, ys = 7;
      const yf = 9;
      return [
        shell(g.polygon([[x0, yb], [x0, ys], [9, t], [15, t], [x1, ys], [x1, yb]], [2, 1, 1, 1, 1, 2]), { n: 'carton', role: P }),
        line(g.seg(x0, yf, x1, yf), { n: 'fold', role: D, on: 'carton' }),
        shell(g.ring(12, 15.5, 3 - Math.max(0, g.s - 2) * 0.5), { n: 'label', role: D, on: 'carton' })
      ];
    },
    light: ['fold', 'label'],
    // 倒牛奶: the carton tips
    fx: { t: 'keys', on: 'all', o: [12, 22], r: [-8, 2], ms: 420 },
    allow: { keyline: '奶盒本身窄，宽 14' }
  },
  'cake-slice': {
    anchor: 'base',
    label: '蛋糕切块', key: 'landscape', fit: 'x',
    ends: 'out',
    plan: '主体：一块蛋糕（侧面：后面高，顶面斜向左边的尖）；细节：夹层的奶油线（两端接到边，面性中切开）',
    weights: { [P]: 0.71, [D]: 0.29 },
    draw(g) {
      const { h } = g, x0 = 2 + h, x1 = 22 - h, yb = 20 - h;
      return [
        shell(g.polygon([[x0, 11.5], [x1, 6 + h], [x1, yb], [x0, yb]], [1.2, 1.5, 2, 1.5]), { n: 'cake', role: P }),
        line(g.seg(x0, 14.5 + h * 0.5, x1, 14.5 + h * 0.5), { n: 'cream', role: D, on: 'cake' })
      ];
    },
    light: ['cream'],
    // 切蛋糕: the slice settles on the plate
    fx: { t: 'bounce', on: 'all', o: [12, 20], amp: 0.6 }
  },
  cookie: {
    label: '饼干', key: 'circle',
    plan: '主体：圆饼干（右上咬掉一口）；细节：四粒巧克力（实心点）',
    weights: { [P]: 0.84, [D]: 0.16 },
    draw(g) {
      const { h } = g, R = 10 - h, B = [20, 4], rb = 5 + h, [p1, p2] = meetCircles([12, 12], R, B, rb);
      const k = 0.85 - Math.max(0, g.s - 2) * 0.4;
      return [
        shell(`M${n(p1[0])} ${n(p1[1])}A${n(R)} ${n(R)} 0 1 0 ${n(p2[0])} ${n(p2[1])}A${n(rb)} ${n(rb)} 0 0 1 ${n(p1[0])} ${n(p1[1])}Z`, { n: 'cookie', role: P }),
        ...[[8.5, 8.5], [13, 11.5], [8, 14.5], [13.5, 16.5]].map(([x, y], i) => solid(g.dot(x, y, k), { n: `c${i}`, role: D, on: 'cookie' }))
      ];
    },
    // 咬一口: the cookie is bitten and settles
    fx: { t: 'keys', on: 'all', o: [12, 12], s: [0.92, 1.03], r: [-6, 2], ms: 420 }
  },
  donut: {
    label: '甜甜圈', key: 'circle',
    plan: '主体：甜甜圈外圈（圆环）；细节：中间的孔（小圆环）和三粒彩针（短线）',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g, ctx) {
      const { s } = g, hole = 2.9 - Math.max(0, s - 2), rm = (hole + 10 - s) / 2;
      const at = (a, r) => [12 + r * Math.cos((a * Math.PI) / 180), 12 + r * Math.sin((a * Math.PI) / 180)];
      const dash = (a) => { const p = at(a - 7, rm), q = at(a + 7, rm); return g.seg(p[0], p[1], q[0], q[1]); };
      return [
        shell(g.ring(12, 12, 10), { n: 'donut', role: P }),
        shell(g.ring(12, 12, hole), { n: 'hole', role: D, on: 'donut' }),
        // filled, the heavier weights leave no room for the sprinkles between the hole and the rim
        ...(ctx?.variant === 'fill' && s > 2 ? [] : [line(dash(-45) + dash(75) + dash(195), { n: 'sprinkles', role: D, on: 'donut' })])
      ];
    },
    light: ['hole', 'sprinkles'],
    // 甜甜圈: the donut spins a third of a turn, landing on itself
    fx: { t: 'rotate', on: ['sprinkles'], deg: 120 }
  },
  croissant: {
    label: '牛角包', key: 'landscape', fit: 'x',
    ends: 'in',
    plan: '主体：牛角包（月牙形，开口朝下）；细节：两道分节线',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g) {
      const { h } = g, C1 = [12, 15], R = 10 - h, C2 = [12, 21.5], r = 8.5, [a, b] = meetCircles(C1, R, C2, r);
      const [L, Rt] = a[0] < b[0] ? [a, b] : [b, a], p = (q) => `${n(q[0])} ${n(q[1])}`;
      // a cut runs along a ray from the bite's centre, square to the bite, out to the outer edge
      const cut = (deg0) => {
        const u = [Math.cos((deg0 * Math.PI) / 180), Math.sin((deg0 * Math.PI) / 180)], i = [C2[0] + r * u[0], C2[1] + r * u[1]];
        let lo = r, hi = 30;
        for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2, q = [C2[0] + m * u[0], C2[1] + m * u[1]]; if (Math.hypot(q[0] - C1[0], q[1] - C1[1]) < R) lo = m; else hi = m; }
        return g.seg(i[0], i[1], C2[0] + lo * u[0], C2[1] + lo * u[1]);
      };
      return [
        shell(`M${p(L)}A${n(R)} ${n(R)} 0 1 1 ${p(Rt)}A${r} ${r} 0 0 0 ${p(L)}Z`, { n: 'bun', role: P }),
        line(cut(-108), { n: 'cut0', role: D, on: 'bun' }),
        line(cut(-72), { n: 'cut1', role: D, on: 'bun' })
      ];
    },
    light: ['cut0', 'cut1'],
    // 牛角包: the croissant is set down and settles
    fx: { t: 'bounce', on: 'all', o: [12, 18], amp: 0.8 }
  },
  'ice-cream-bowl': {
    label: '冰淇淋杯', key: 'live', fit: 'x',
    plan: '主体：碗（半圆，碗口平）；辅助：碗上的冰淇淋球（圆，下半藏在碗后面）',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      return [
        shell(g.ring(12, 8.5, 6), { n: 'scoop', role: S }),
        shell(bowl(g), { n: 'bowl', role: P, occ: true })
      ];
    },
    light: ['scoop'],
    // 冰淇淋杯: the scoop wobbles in the bowl
    fx: { t: 'wiggle', on: ['scoop'], o: [12, 12], deg: 10, hz: 2.6 }
  },
  'ice-pop': {
    label: '冰棍', key: 'portrait', fit: 'y',
    plan: '主体：冰棍（上圆下方的竖条）；辅助：木棍；细节：中间一道竖纹',
    weights: { [P]: 0.76, [S]: 0.12, [D]: 0.12 },
    draw(g) {
      const { h } = g;
      return [
        line(g.seg(12, 17 - h, 12, 22 - h), { n: 'stick', role: S }),
        shell(g.box(6, 2, 12, 15, [6, 6, 2, 2]), { n: 'pop', role: P }),
        line(g.seg(12, 7, 12, 11.5), { n: 'groove', role: D, on: 'pop', ends: 'keep' })
      ];
    },
    light: ['groove'],
    // 冰棍: the pop is licked: it tips on its stick
    fx: { t: 'keys', on: 'all', o: [12, 22], r: [-8, 4, 0], ms: 460 },
    allow: { keyline: '冰棍本身窄，宽 12' }
  },
  cherry: {
    label: '樱桃', key: 'live',
    plan: '主体：两颗樱桃（圆环，左低右高）；辅助：两根果梗（曲线，在顶上汇合）和一片叶子（实心）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const { h } = g;
      return [
        line(`M6.5 ${n(13 + h)}Q8 7 13 3.5M17.5 ${n(11.5 + h)}Q15.5 7 13 3.5`, { n: 'stems', role: S }),
        solid(leafBy([13.5, 3.5], [20, 3], 1.6), { n: 'leaf', role: S }),
        shell(g.ring(6.5, 17.5, 4.5), { n: 'c0', role: P }),
        shell(g.ring(17.5, 16, 4.5), { n: 'c1', role: P })
      ];
    },
    light: ['stems', 'leaf'],
    // 樱桃: the cherries swing on their stems
    fx: { t: 'wiggle', on: 'all', o: [13, 3.5], deg: 6, hz: 2 }
  },
  carrot: {
    label: '胡萝卜', key: 'live',
    ends: 'out',
    plan: '主体：萝卜（斜放的长三角，尖朝左下）；辅助：右上的三片叶（短线）；细节：萝卜上的两道横纹（面性中切开）',
    weights: { [P]: 0.5, [S]: 0.27, [D]: 0.23 },
    draw(g, ctx) {
      const { h } = g, k = 1.156, T = (pts) => turnPts(pts, 45).map(([x, y]) => [12 + (x - 1 - 11.49) * k, 12 + (y + 1 - 12.54) * k]);
      const body = T([[12, 25.5 - h], [7.5, 8.5], [16.5, 8.5]]);
      // a ring across the root, from edge to edge
      const ridge = (y) => { const e = 4.5 - ((y - 8.5) * 4.5) / (25.5 - h - 8.5); const [p, q] = T([[12 - e, y], [12 + e, y]]); return g.seg(p[0], p[1], q[0], q[1]); };
      const [a, b, c, d] = T([[12, 8.5], [12, 2.5], [8.5, 4], [15.5, 4]]);
      return [
        line(g.seg(a[0], a[1], b[0], b[1]) + g.seg(a[0], a[1], c[0], c[1]) + g.seg(a[0], a[1], d[0], d[1]), { n: 'tops', role: S }),
        shell(g.polygon(body, [1, 3, 3]), { n: 'root', role: P }),
        line(ridge(13), { n: 'r0', role: D, on: 'root' }),
        // filled, the heaviest weights leave too little of the root between two rings
        ...(ctx?.variant === 'fill' && g.s > 2.25 ? [] : [line(ridge(16.5), { n: 'r1', role: D, on: 'root' })])
      ];
    },
    light: ['tops', 'r0', 'r1'],
    // 胡萝卜: the leaves rustle
    fx: { t: 'wiggle', on: ['tops'], o: [14, 10], deg: 10, hz: 3 }
  },
  egg: {
    label: '鸡蛋', key: 'portrait', fit: 'y',
    plan: '主体：蛋壳（下半是半圆，上半是更高的半椭圆）；细节：左上的一道高光（短圆弧）',
    weights: { [P]: 0.88, [D]: 0.12 },
    draw(g) {
      const { h } = g, cy = 14.5, r = 7.5 - h, ry = 12.5 - h;
      return [
        shell(`M${n(12 - r)} ${cy}A${n(r)} ${n(r)} 0 0 0 ${n(12 + r)} ${cy}A${n(r)} ${n(ry)} 0 0 0 ${n(12 - r)} ${cy}Z`, { n: 'shell', role: P }),
        line(g.arc(12.75, 13, 3.5 - Math.max(0, g.s - 2) * 1.2, 190, 245), { n: 'shine', role: D, on: 'shell' })
      ];
    },
    light: ['shine'],
    // 鸡蛋: the egg wobbles on its end
    fx: { t: 'wiggle', on: 'all', o: [12, 22], deg: 7, hz: 2.2 },
    allow: { keyline: '鸡蛋本身窄，宽 15' }
  },
  salad: {
    label: '沙拉', key: 'live', fit: 'x',
    plan: '主体：碗（同冰淇淋杯）；辅助：碗上向两边张开的两片叶子（叶形，与碗口隔开）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      // the leaves' ends keep clear of the bowl's rim
      const yl = 11 - g.s - (g.s <= 2 ? 1.5 : 1.25);
      return [
        shell(leafBy([10, yl], [5, 2.5], 1.6), { n: 'l0', role: S }),
        shell(leafBy([14, yl], [19, 2.5], 1.6), { n: 'l1', role: S }),
        shell(bowl(g), { n: 'bowl', role: P })
      ];
    },
    light: ['l0', 'l1'],
    // 拌沙拉: the leaves are tossed
    fx: { t: 'keys', on: [['l0'], ['l1']], by: true, stagger: 80, y: [-0.8, 0.3, 0], ms: 420 }
  },
  soup: {
    label: '汤', key: 'live', fit: 'x',
    plan: '主体：碗（同冰淇淋杯）；辅助：碗上的三道热气（竖的短线）',
    weights: { [P]: 0.76, [S]: 0.24 },
    draw(g) {
      return [
        shell(bowl(g), { n: 'bowl', role: P }),
        ...[8, 12, 16].map((x, i) => line(g.span(x, 2.5, x, 8.5), { n: `s${i}`, role: S }))
      ];
    },
    light: ['s0', 's1', 's2'],
    // 热汤: the steam rises and fades, then comes back
    fx: { t: 'keys', on: [['s0'], ['s1'], ['s2']], by: true, stagger: 110, y: [-1.2, 0.8, 0], a: [0, 0, 1] }
  },
  burger: {
    label: '汉堡', key: 'square',
    plan: '主体：上层面包（圆顶）；辅助：下层面包（扁的圆角矩形）；细节：中间的生菜（波浪线）',
    weights: { [P]: 0.4, [S]: 0.4, [D]: 0.2 },
    draw(g) {
      return [
        shell(g.box(3, 3, 18, 6, [6, 6, 1.5, 1.5]), { n: 'top', role: P }),
        line(waveLine(3 + g.h, 21 - g.h, 12, 6, 0.5), { n: 'lettuce', role: D }),
        shell(g.box(3, 15, 18, 6, [1.5, 1.5, 3, 3]), { n: 'bottom', role: S })
      ];
    },
    light: ['lettuce'],
    // 汉堡: the burger is squeezed
    fx: { t: 'keys', on: 'all', o: [12, 21], sy: [0.88, 1.04], ms: 380 }
  }
};

// Variants made by rule (kit.mjs), of the icons above.
const base = (k) => ({ ...F[k], name: k });
const SLASH_SLIVER = { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' };
Object.assign(F, {
  'wine-off': off({ ...slash(base('wine'), { label: '禁酒' }), allow: SLASH_SLIVER }, 'wine', { t: 'keys', on: ['bowl', 'wine', 'stem'], o: [12, 21], r: [-6], ms: 260 })
});

export default F;
