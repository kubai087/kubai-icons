// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// weather: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: clouds cloud-sun cloud-moon cloud-rain cloud-drizzle cloud-snow cloud-lightning cloud-fog cloud-hail droplet thermometer zap snowflake umbrella wind rainbow sunrise sunset tornado
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// The cloud of the cloud icon (icons.mjs) by its outer circles: x 2..22, top 3.75, base 20.
const CL = [[7.1, 14.9, 5.1], [12.6, 10.65, 6.9], [17.6, 15.6, 4.4]];
const CL_H = 20 - 3.75;
/** The same cloud scaled by k, centred on cx, its top at top (outer edges; the stroke stays). */
const cloudAt = (g, k, cx, top) => cloud(g, CL.map(([x, y, R]) => [cx + (x - 12) * k, top + (y - 3.75) * k, R * k]), top + CL_H * k);
// The cloud over rain, snow, hail and fog: 0.74 of the cloud, x 4.6..19.4, y 2..14, so the marks
// below get 15.5..22 and keep 1.5 from its base at every weight.
const K = 12 / CL_H, TOP = 2, BASE = TOP + 12;
const smallCloud = (g, dy = 0) => cloudAt(g, K, 12, TOP + dy);
// The same cloud in front of a sun or a moon: 0.8, lower right.
const FRONT = { k: 0.75, cx: 14.5, top: 21 - CL_H * 0.75 };
const frontCloud = (g) => cloudAt(g, FRONT.k, FRONT.cx, FRONT.top);

// The sun's rays (icons.mjs sun): short strokes from 7.3 to 10 round a core of 4.75, at every 45°.
const rays = (g, cx, cy, r0, r1, angles) => angles.map((a) => { const c = Math.cos((a * Math.PI) / 180), s0 = Math.sin((a * Math.PI) / 180); return g.span(cx + r0 * c, cy + r0 * s0, cx + r1 * c, cy + r1 * s0); }).join('');

// The moon of the moon icon (icons.mjs), scaled by k about (12, 12) and moved by (dx, dy).
function crescent(g, k = 1, dx = 0, dy = 0) {
  const { h } = g, R = 10.05 * k - h, T = ([x, y]) => [12 + (x - 12) * k + dx, 12 + (y - 12) * k + dy];
  const c = T([12.7, 11.25]), b = T([19.15, 4.8]), rb = 8 * k;
  const ddx = b[0] - c[0], ddy = b[1] - c[1], Dd = Math.hypot(ddx, ddy), a = (R * R - rb * rb + Dd * Dd) / (2 * Dd), hh = Math.sqrt(R * R - a * a);
  const mx = c[0] + (a * ddx) / Dd, my = c[1] + (a * ddy) / Dd, p1 = [mx + (hh * ddy) / Dd, my - (hh * ddx) / Dd], p2 = [mx - (hh * ddy) / Dd, my + (hh * ddx) / Dd];
  const p = (q) => `${n(q[0])} ${n(q[1])}`;
  return `M${p(p1)}A${n(R)} ${n(R)} 0 1 0 ${p(p2)}A${n(rb)} ${n(rb)} 0 0 1 ${p(p1)}Z`;
}

// A lightning bolt by its centre-line corners: top tip, left tip, inner, bottom tip, right tip,
// inner. The two cross edges are level, on whole pixels.
const bolt = (g, pts) => g.polygon(pts, [1, 1, 0, 1, 1, 0]);
// The tips are drawn out past the key shape by what their rounding takes back.
const ZAP = [[13.74, 0.85], [3.6, 14], [11, 14], [10.26, 23.15], [20.4, 10], [13, 10]];

// Marks under the small cloud, in 15.5..22.
const rainLine = (g, x, y0, y1, lean = 1) => g.span(x + lean, y0, x - lean, y1);
// Rain falls: each mark slips down and fades, then comes back in from above.
const fall = (names, d = 1.5) => ({ t: 'keys', on: names.map((k) => [k]), by: true, stagger: 90, y: [d, -d * 0.7, 0], a: [0, 0, 1] });

export default {
  clouds: {
    label: '阴天', key: 'landscape', fit: 'x',
    plan: '主体：前面的云（同云图标，缩小到 0.72）；辅助：后面的云（缩小到 0.62，右上，被前面的云挡住）',
    weights: { [P]: 0.68, [S]: 0.32 },
    draw(g) {
      return [
        shell(cloudAt(g, 0.62, 15.8, 13 - CL_H * 0.62), { n: 'back', role: S }),
        shell(cloudAt(g, 0.72, 9.2, 20 - CL_H * 0.72), { n: 'front', role: P, occ: true })
      ];
    },
    // 阴天: the two clouds drift past each other
    fx: [{ t: 'keys', on: ['back'], x: [-0.9, 0.3] }, { t: 'keys', on: ['front'], x: [0.9, -0.3] }]
  },
  'cloud-sun': {
    nudge: [0, -1],
    label: '天气', key: 'live',
    plan: '主体：云（同云图标，缩小到 0.75，在右下，挡住太阳）；辅助：太阳（左上，日轮和露出来的光芒）。云在下方分量重，整体上移 1（保持整像素）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g, ctx) {
      // filled, the cloud sits 0.25 further right and 0.5 lower: its clear band then meets the
      // sun's disc less sharply, so the disc keeps no thin tip of ink (the sun stays, for its turn)
      const cloudShape = ctx?.variant === 'fill' ? cloudAt(g, FRONT.k, FRONT.cx + 0.25, FRONT.top + 0.5) : frontCloud(g);
      return [
        shell(g.ring(10, 9, 3.5), { n: 'core', role: S }),
        line(rays(g, 10, 9, 5.5, 8, [135, 180, 225, 270, 315]), { n: 'rays', role: S }),
        shell(cloudShape, { n: 'cloud', role: P, occ: true })
      ];
    },
    light: ['core', 'rays'],
    fx: [{ t: 'rotate', on: ['rays'], deg: 45, o: [10, 9] }, { t: 'keys', on: ['cloud'], x: [0.9, -0.5] }]
  },
  'cloud-moon': {
    nudge: [0, -1],
    label: '夜间多云', key: 'live',
    plan: '主体：云（同云图标，缩小到 0.75，在右下）；辅助：新月（同月亮图标，缩小，在左上，被云挡住一部分）。整体上移 1，同天气',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g, ctx) {
      // filled, the moon sits 0.75 lower: its upper tip then clears the cloud's clear band
      // instead of being cut by it to a sliver
      const dy = ctx?.variant === 'fill' ? 0.75 : 0;
      return [
        shell(crescent(g, 0.68, -10 + 9.35 * 0.68, -11 + 10.8 * 0.68 + dy), { n: 'moon', role: S }),
        shell(frontCloud(g), { n: 'cloud', role: P, occ: true })
      ];
    },
    light: ['moon'],
    fx: [{ t: 'wiggle', on: ['moon'], o: [9, 8], deg: 12, hz: 2.2 }, { t: 'keys', on: ['cloud'], x: [0.9, -0.5] }]
  },
  'cloud-rain': {
    label: '下雨', key: 'portrait', fit: 'y',
    plan: '主体：云（同云图标，缩小到 0.74，在上方）；辅助：三道斜的雨线',
    weights: { [P]: 0.68, [S]: 0.32 },
    draw(g) {
      return [
        shell(smallCloud(g), { n: 'cloud', role: P }),
        ...[8, 12, 16].map((x, i) => line(rainLine(g, x, 15.5, 22), { n: `r${i}`, role: S }))
      ];
    },
    fx: fall(['r0', 'r1', 'r2'])
  },
  'cloud-drizzle': {
    allow: { optical: '云是主体，下方的雨点很轻，按云的位置定位' },
    label: '小雨', key: 'portrait', fit: 'y',
    plan: '主体：云（同下雨）；辅助：三道短雨线，高低错开',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      return [
        shell(smallCloud(g), { n: 'cloud', role: P }),
        line(rainLine(g, 8, 15.5, 19.25, 0.6), { n: 'r0', role: S }),
        line(rainLine(g, 12, 18.25, 22, 0.6), { n: 'r1', role: S }),
        line(rainLine(g, 16, 15.5, 19.25, 0.6), { n: 'r2', role: S })
      ];
    },
    fx: fall(['r0', 'r1', 'r2'], 1.2)
  },
  'cloud-snow': {
    allow: { optical: '云是主体，下方的雪点很轻，按云的位置定位' },
    label: '下雪', key: 'portrait', fit: 'y',
    plan: '主体：云（同下雨）；辅助：三片雪（实心圆点，太小画不出线框，随字重略缩以保持间距）',
    weights: { [P]: 0.76, [S]: 0.24 },
    draw(g) {
      const k = 1 - (g.s - 2) * 0.3;
      return [
        shell(smallCloud(g), { n: 'cloud', role: P }),
        ...[[8, 17.35], [16, 17.35], [12, 20.35]].map(([x, y], i) => solid(g.dot(x, y, k), { n: `f${i}`, role: S }))
      ];
    },
    // 下雪: the flakes drift down and sideways, one after another
    fx: { t: 'keys', on: [['f0'], ['f2'], ['f1']], by: true, stagger: 110, x: [0.8, -0.6], y: [0.7, 0.3] }
  },
  'cloud-lightning': {
    nudge: [0, 1],
    label: '雷电', key: 'portrait', fit: 'y',
    plan: '主体：云（同下雨）；辅助：闪电（折线，从云里穿出，切开云的底边；缩小后的闪电轮廓内部会合上，所以画成线）。闪电是一条线，云显得偏上，整体下移 1（保持整像素），闪电伸到 23',
    weights: { [P]: 0.58, [S]: 0.42 },
    draw(g, ctx) {
      // a zigzag line: an outlined bolt this small closes up. Filled, the bolt starts at the
      // cloud's base (its first stroke shortened along the same slope): a clear band ending
      // inside the cloud leaves a thin rim at every weight, so it bites a round notch out of the
      // base instead
      const top = ctx?.variant === 'fill' ? [12, 14.5] : [15, 11];
      return [shell(smallCloud(g, 1), { n: 'cloud', role: P }), line(g.pl([top, [9, 18], [15, 18], [10.5, 23 - g.h]]), { n: 'bolt', role: S, gap: true })];
    },
    light: ['bolt'],
    fx: { t: 'keys', on: ['bolt'], a: [0.15, 1, 0.15, 1], s: [1.06], o: [12, 16], ms: 520 }
  },
  'cloud-fog': {
    label: '雾', key: 'portrait', fit: 'y',
    plan: '主体：云（同下雨）；辅助：两道雾线（水平，错开）',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      return [
        shell(smallCloud(g), { n: 'cloud', role: P }),
        line(g.span(4, 17, 17, 17), { n: 'f0', role: S }),
        line(g.span(8, 21, 21, 21), { n: 'f1', role: S })
      ];
    },
    fx: [{ t: 'keys', on: ['f0'], x: [1.2, -0.4] }, { t: 'keys', on: ['f1'], x: [-1.2, 0.4] }]
  },
  'cloud-hail': {
    label: '冰雹', key: 'portrait', fit: 'y',
    plan: '主体：云（同下雨）；辅助：两颗冰雹（圆环，和雪的实心点区分）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      return [
        shell(smallCloud(g), { n: 'cloud', role: P }),
        shell(g.ring(8.5, 19.25, 2.75), { n: 'h0', role: S }),
        shell(g.ring(15.5, 19.25, 2.75), { n: 'h1', role: S })
      ];
    },
    // 冰雹: the stones hit the ground and bounce
    fx: { t: 'keys', on: [['h0'], ['h1']], by: true, stagger: 120, y: [0.8, -1.4, 0.3] }
  },
  droplet: {
    nudge: [0, -0.6],
    label: '水滴', key: 'portrait', fit: 'y',
    plan: '主体：水滴（底部一个圆和两条到顶尖的切线）。分量在圆上，整体上移 0.6',
    weights: { [P]: 1 },
    draw(g) {
      // the pin turned upside down: a circle and the lines tangent to it from the tip at the top
      const { h } = g, cx = 12, cy = 13.9, r = 7.5 - h, ty = 1.4 + h * 1.3, b = Math.acos(r / (cy - ty));
      const Pt = (a) => `${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
      return [shell(`M${cx} ${n(ty)}L${Pt(-Math.PI / 2 + b)}A${n(r)} ${n(r)} 0 1 1 ${Pt(-Math.PI / 2 - b)}Z`, { n: 'drop', role: P })];
    },
    // 水滴: the drop lands, squashes and springs back
    fx: { t: 'keys', on: 'all', o: [12, 21.4], sy: [0.84, 1.06], sx: [1.1, 0.97], ms: 360 }
  },
  thermometer: {
    label: '温度计', key: 'portrait', fit: 'y',
    plan: '主体：温度计（细管和底部的圆泡连成一个轮廓）；细节：圆泡里的水银（实心点，随字重缩小以保持间距）。细管内宽只有 2，画不下水银柱',
    weights: { [P]: 0.9, [D]: 0.1 },
    draw(g) {
      // tube x 9..15 (centre lines 10 and 14), bulb of 5 round (12, 17)
      const { h, s } = g, x0 = 10, x1 = 14, cx = 12, cy = 17, R = 5 - h, top = 2 + h, rt = (x1 - x0) / 2;
      const yj = cy - Math.sqrt(R * R - (cx - x0) ** 2);
      const body = `M${x0} ${n(yj)}V${n(top + rt)}A${n(rt)} ${n(rt)} 0 0 1 ${x1} ${n(top + rt)}V${n(yj)}A${n(R)} ${n(R)} 0 1 1 ${x0} ${n(yj)}Z`;
      return [
        shell(body, { n: 'tube', role: P }),
        solid(g.dot(cx, cy, 0.9 - (s - 2) * 0.6), { n: 'mercury', role: D, on: 'tube' })
      ];
    },
    // 升温: the mercury swells and settles
    fx: { t: 'keys', on: ['mercury'], o: [12, 17], s: [1.45, 1.3], ms: 420 }
  },
  zap: {
    label: '闪电', key: 'portrait', fit: 'y',
    plan: '主体：闪电（一个折线闭合形，两个尖角圆角 1，内角为直角）',
    weights: { [P]: 1 },
    draw(g) { return [shell(bolt(g, ZAP), { n: 'bolt', role: P })]; },
    // 闪电: the bolt flashes twice
    fx: { t: 'keys', on: 'all', a: [0.15, 1, 0.15, 1], s: [1.05], o: [12, 12], ms: 520 }
  },
  snowflake: {
    label: '雪花', key: 'circle',
    plan: '主体：三条交叉的直线（六个枝）；辅助：枝头的六个小 V 形分叉',
    weights: { [P]: 0.54, [S]: 0.46 },
    draw(g) {
      const { h } = g, arms = [], tips = [], R = 10, at = 5.7, L = 2.3;
      for (let i = 0; i < 3; i++) {
        const a = ((90 + i * 60) * Math.PI) / 180, c = Math.cos(a), s0 = Math.sin(a);
        arms.push(g.span(12 - R * c, 12 - R * s0, 12 + R * c, 12 + R * s0));
      }
      for (let i = 0; i < 6; i++) {
        const a = ((90 + i * 60) * Math.PI) / 180, u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]], m = [12 + at * u[0], 12 + at * u[1]];
        tips.push(g.pl([[m[0] + L * (u[0] + v[0]) * Math.SQRT1_2, m[1] + L * (u[1] + v[1]) * Math.SQRT1_2], m, [m[0] + L * (u[0] - v[0]) * Math.SQRT1_2, m[1] + L * (u[1] - v[1]) * Math.SQRT1_2]]));
      }
      return [line(arms.join(''), { n: 'arms', role: P }), line(tips.join(''), { n: 'tips', role: S })];
    },
    light: [],
    // 雪花: a sixth of a turn, landing on itself
    fx: { t: 'rotate', on: 'all', deg: 60 },
    allow: { keyline: '六个枝的雪花，竖直方向撑满直径 20，斜枝的左右只到 18' }
  },
  umbrella: {
    nudge: [0, 1],
    label: '雨伞', key: 'square',
    light: [],
    plan: '主体：伞面（半圆，底边平直）；辅助：伞柄（竖线和弯钩）。伞面重，整体下移 1（保持整像素）',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      const { h } = g, y = 13, R = 9 - h;
      return [
        shell(`M${n(12 - R)} ${y}A${n(R)} ${n(R)} 0 0 1 ${n(12 + R)} ${y}Z`, { n: 'canopy', role: P }),
        line(`M12 ${y}V${n(22 - h - 2)}A2 2 0 0 1 8 ${n(22 - h - 2)}`, { n: 'handle', role: S })
      ];
    },
    // 撑伞: the canopy folds in and opens again
    fx: { t: 'keys', on: ['canopy'], o: [12, 4], sx: [0.45, 1.05], sy: [1.1, 0.97], ms: 420 }
  },
  wind: {
    label: '风', key: 'square',
    plan: '主体：三道风线（直线，末端卷成圆弧：上两道向上卷，下一道向下卷）',
    weights: { [P]: 1 },
    draw(g) {
      // the top curl stays short of the middle one's end, which turns back toward it
      const curl = (y, x1, r, up) => `M4 ${y}H${x1}` + (up ? g.arc(x1, y - r, r, 90, -180) : g.arc(x1, y + r, r, -90, 180)).replace(/^M[^A]+/, '');
      return [
        line(curl(8, 10.25 - (g.s - 2) * 0.5, 2, true), { n: 'w0', role: P }),
        line(curl(12, 17.5, 2.5, true), { n: 'w1', role: P }),
        line(curl(16, 14, 2, false), { n: 'w2', role: P })
      ];
    },
    fx: { t: 'keys', on: [['w0'], ['w1'], ['w2']], by: true, stagger: 80, x: [1.3, -0.4] }
  },
  rainbow: {
    label: '彩虹', key: 'landscape', fit: 'x',
    light: [],
    plan: '主体：三道同心半圆弧（间距随线宽变，粗字重下仍留 1.25）',
    weights: { [P]: 1 },
    draw(g) {
      const { h, s } = g, cy = 16, sp = s + (s <= 2 ? 1.5 : 1.25), r0 = 10 - h;
      return [r0, r0 - sp, r0 - 2 * sp].map((r, i) => line(g.arc(12, cy, r, 180, 360), { n: `a${i}`, role: P }));
    },
    fx: { t: 'draw', on: ['a0', 'a1', 'a2'], stagger: 110 }
  },
  sunrise: {
    anchor: 'base',
    label: '日出', key: 'live',
    plan: '主体：半个太阳（同太阳图标的日轮）和向上的箭头；辅助：四道光芒和地平线',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g, cy = 17, L = 3.5, top = 2 + h, end = 9.2;
      return [
        line(g.span(2, 21, 22, 21), { n: 'horizon', role: S }),
        line(g.arc(12, cy, 4.75 - h, 180, 360), { n: 'sun', role: P }),
        line(rays(g, 12, cy, 7.3, 10, [180, 225, 315, 360]), { n: 'rays', role: S }),
        line(g.seg(12, top, 12, end) + g.pl([[12 - L, top + L], [12, top], [12 + L, top + L]]), { n: 'arrow', role: P })
      ];
    },
    area: (g) => [{ n: 'sun', d: `M${n(12 - 4.75 + g.h)} 17A${n(4.75 - g.h)} ${n(4.75 - g.h)} 0 0 1 ${n(12 + 4.75 - g.h)} 17Z` }],
    light: ['rays'],
    fx: [{ t: 'keys', on: ['sun', 'rays'], y: [-1.2, 0.2], ms: 300 }, { t: 'keys', on: ['arrow'], y: [-1.2, 0.3], ms: 300 }]
  },
  sunset: {
    anchor: 'base',
    label: '日落', key: 'live',
    plan: '主体：半个太阳（同日出）和向下的箭头；辅助：四道光芒和地平线',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g, cy = 17, L = 3.5, top = 2 + h, end = 9.2;
      return [
        line(g.span(2, 21, 22, 21), { n: 'horizon', role: S }),
        line(g.arc(12, cy, 4.75 - h, 180, 360), { n: 'sun', role: P }),
        line(rays(g, 12, cy, 7.3, 10, [180, 225, 315, 360]), { n: 'rays', role: S }),
        line(g.seg(12, top, 12, end) + g.pl([[12 - L, end - L], [12, end], [12 + L, end - L]]), { n: 'arrow', role: P })
      ];
    },
    area: (g) => [{ n: 'sun', d: `M${n(12 - 4.75 + g.h)} 17A${n(4.75 - g.h)} ${n(4.75 - g.h)} 0 0 1 ${n(12 + 4.75 - g.h)} 17Z` }],
    light: ['rays'],
    fx: [{ t: 'keys', on: ['sun', 'rays'], y: [1.1], ms: 300 }, { t: 'keys', on: ['arrow'], y: [1.2], ms: 300 }]
  },
  tornado: {
    nudge: [0, 1],
    label: '龙卷风', key: 'square',
    plan: '主体：五道横线，从上到下变短并左右错开，组成漏斗。上宽下窄，整体下移 1（保持整像素）',
    weights: { [P]: 1 },
    draw(g) {
      return [[3, 21], [5, 18], [8, 19], [8, 16], [10, 14]].map(([a, b], i) => line(g.span(a, 5 + i * 4, b, 5 + i * 4), { n: `l${i}`, role: P }));
    },
    // 龙卷风: the funnel sways, each layer a little after the one above
    fx: { t: 'keys', on: [['l0'], ['l1'], ['l2'], ['l3'], ['l4']], by: true, stagger: 50, x: [1.1, -1, 0.3] }
  }
};
