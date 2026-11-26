// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// weather: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: clouds cloud-sun cloud-moon cloud-rain cloud-drizzle cloud-snow cloud-lightning cloud-fog cloud-hail droplet thermometer zap snowflake umbrella wind rainbow sunrise sunset tornado
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { slash } from '../kit.mjs';
import { off } from '../variants.mjs';

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

// A small solid four-point star (the small star of sparkles).
const twinkle = (g, cx, cy, R, k = 0.42) => g.polygon(Array.from({ length: 8 }, (_, i) => {
  const a = ((-90 + i * 45) * Math.PI) / 180, r = i % 2 ? R * k : R;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}), Array.from({ length: 8 }, (_, i) => (i % 2 ? 0.2 : 0.35)));
// The two points where circles (centre lines) c1 r1 and c2 r2 cross.
const meet = ([x1, y1], r1, [x2, y2], r2) => {
  const dx = x2 - x1, dy = y2 - y1, Dd = Math.hypot(dx, dy), a = (r1 * r1 - r2 * r2 + Dd * Dd) / (2 * Dd), hh = Math.sqrt(Math.max(r1 * r1 - a * a, 0));
  const mx = x1 + (a * dx) / Dd, my = y1 + (a * dy) / Dd;
  return [[mx + (hh * dy) / Dd, my - (hh * dx) / Dd], [mx - (hh * dy) / Dd, my + (hh * dx) / Dd]];
};
const angleOf = ([cx, cy], [x, y]) => (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
// The cloud of the showers (cloud-sun-rain, cloud-moon-rain): 0.62 of the cloud at the right,
// its base at 16, the rain below it and the sun or moon behind its top left.
const SHOWER = { k: 0.62, cx: 15.5, base: 16 };
const showerCloud = (g) => cloudAt(g, SHOWER.k, SHOWER.cx, SHOWER.base - CL_H * SHOWER.k);
const showerRain = (g) => [10.5, 14.5, 18.5].map((x, i) => line(rainLine(g, x, 17.5, 22, 0.7), { n: `r${i}`, role: S }));

// The thermometer of thermometer, its tube centred on x (tube 3 wide each side, bulb of 5).
function thermo(g, x) {
  const { h, s } = g, x0 = x - 2, x1 = x + 2, cy = 17, R = 5 - h, top = 2 + h, rt = 2;
  const yj = cy - Math.sqrt(R * R - 4);
  const body = `M${x0} ${n(yj)}V${n(top + rt)}A${rt} ${rt} 0 0 1 ${x1} ${n(top + rt)}V${n(yj)}A${n(R)} ${n(R)} 0 1 1 ${x0} ${n(yj)}Z`;
  return [shell(body, { n: 'tube', role: P }), solid(g.dot(x, cy, 0.9 - (s - 2) * 0.6), { n: 'mercury', role: D, on: 'tube' })];
}
// The drop of droplet: a circle (outer radius R round cx, cy) and the lines tangent to it from
// the tip at ty (outer).
function dropAt(g, cx, cy, R, ty) {
  const { h } = g, r = R - h, t = ty + h * 1.3, b = Math.acos(r / (cy - t));
  const Pt = (a) => `${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
  return `M${n(cx)} ${n(t)}L${Pt(-Math.PI / 2 + b)}A${n(r)} ${n(r)} 0 1 1 ${Pt(-Math.PI / 2 - b)}Z`;
}
const W = {
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
  },
  'sun-dim': {
    label: '低亮度', key: 'circle',
    plan: '主体：日轮（同晴）；辅助：八个圆点代替光芒（实心，太小画不出线框），落在圆的参考线上',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const r = g.dr * 0.85, R = 10 - r;
      return [
        shell(g.ring(12, 12, 4.75), { n: 'core', role: P }),
        ...Array.from({ length: 8 }, (_, i) => { const a = (i * 45 * Math.PI) / 180; return solid(g.circ(12 + R * Math.cos(a), 12 + R * Math.sin(a), r), { n: `d${i}`, role: S, vc: i }); })
      ];
    },
    // 调亮: the dots light up one after another round the sun
    fx: { t: 'variable', on: ['d6', 'd7', 'd0', 'd1', 'd2', 'd3', 'd4', 'd5'], mode: 'cumulative', step: 70 }
  },
  'sun-moon': {
    label: '日夜', key: 'circle',
    plan: '主体：中间的新月（同月亮图标，缩小到 0.5，外圆居中在日轮的位置）；辅助：八道光芒（同晴）',
    weights: { [P]: 0.58, [S]: 0.42 },
    draw(g) {
      const k = 0.5;
      return [
        shell(crescent(g, k, -0.7 * k, 0.75 * k), { n: 'moon', role: P }),
        line(rays(g, 12, 12, 7.3, 10, [0, 45, 90, 135, 180, 225, 270, 315]), { n: 'rays', role: S })
      ];
    },
    // 切换日夜: the rays turn while the moon rocks
    fx: [{ t: 'rotate', on: ['rays'], deg: 45 }, { t: 'wiggle', on: ['moon'], o: [12, 12], deg: 14, hz: 2.2 }]
  },
  'moon-star': {
    label: '星月', key: 'circle',
    plan: '主体：新月（同月亮图标，向左下移，让星星和月亮一起居中）；辅助：月亮缺口里的四角星（实心，同智能生成的小星）',
    weights: { [P]: 0.86, [S]: 0.14 },
    draw(g) {
      return [
        shell(crescent(g, 1, -0.65, 0.55), { n: 'moon', role: P }),
        solid(twinkle(g, 17.8, 6.2, 3.2), { n: 'star', role: S })
      ];
    },
    // 星月: the star twinkles
    fx: [{ t: 'keys', on: ['star'], o: [17.8, 6.2], s: [1.3, 0.6], ms: 380 }, { t: 'wiggle', on: ['moon'], o: [12, 12], deg: 6, hz: 2 }]
  },
  eclipse: {
    label: '日食', key: 'circle',
    ends: 'in',
    plan: '主体：日轮（圆环）；细节：挡住日轮的月亮边缘（圆弧，从右上切进日轮，两端与圆环垂直相交）',
    weights: { [P]: 0.78, [D]: 0.22 },
    draw(g) {
      const R = 10 - g.h, c = [20.3, 3.7], rho = 7.5, [p1, p2] = meet([12, 12], R, c, rho);
      const a = [angleOf(c, p1), angleOf(c, p2)].map((v) => (v < 0 ? v + 360 : v)).sort((u, v) => u - v);
      return [
        shell(g.ring(12, 12, 10), { n: 'sun', role: P }),
        line(g.arc(c[0], c[1], rho, a[0], a[1]), { n: 'moon', role: D, on: 'sun' })
      ];
    },
    // 日食: the moon's edge slides round the sun and back
    fx: { t: 'keys', on: ['moon'], o: [12, 12], r: [-30, 6], ms: 560 }
  },
  haze: {
    label: '霾', key: 'live', fit: 'x',
    plan: '主体：太阳（日轮和上半圈的五道光芒）；辅助：两道雾线（同雾，左右错开）',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      return [
        shell(g.ring(12, 9.5, 3.75), { n: 'core', role: P }),
        line(rays(g, 12, 9.5, 5.25, 7.5, [180, 225, 270, 315, 360]), { n: 'rays', role: P }),
        line(g.span(2, 16, 16, 16), { n: 'f0', role: S }),
        line(g.span(8, 20, 22, 20), { n: 'f1', role: S })
      ];
    },
    light: ['f0', 'f1'],
    // 霾: the haze drifts across the sun
    fx: [{ t: 'keys', on: ['f0'], x: [1.2, -0.4] }, { t: 'keys', on: ['f1'], x: [-1.2, 0.4] }]
  },
  'sun-horizon': {
    anchor: 'base',
    label: '地平线', key: 'live', fit: 'x',
    plan: '主体：半个太阳（同日出的日轮）；辅助：五道光芒和地平线（同日出，没有箭头）',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g) {
      const { h } = g, cy = 16;
      return [
        line(g.span(2, 20, 22, 20), { n: 'horizon', role: S }),
        line(g.arc(12, cy, 4.75 - h, 180, 360), { n: 'sun', role: P }),
        line(rays(g, 12, cy, 7.3, 10, [180, 225, 270, 315, 360]), { n: 'rays', role: S })
      ];
    },
    area: (g) => [{ n: 'sun', d: `M${n(12 - 4.75 + g.h)} 16A${n(4.75 - g.h)} ${n(4.75 - g.h)} 0 0 1 ${n(12 + 4.75 - g.h)} 16Z` }],
    light: ['rays'],
    // 地平线: the sun rises a little and the rays turn out
    fx: [{ t: 'keys', on: ['sun'], y: [-1, 0.2], ms: 320 }, { t: 'keys', on: ['rays'], o: [12, 16], y: [-1, 0.2], s: [1.06, 1], ms: 320 }]
  },
  'cloud-sun-rain': {
    label: '阵雨', key: 'live',
    plan: '主体：云（同云图标，缩小到 0.62，在右侧）；辅助：太阳（左上，被云挡住一部分，只画露出来的四道光芒）和三道雨线',
    weights: { [P]: 0.54, [S]: 0.46 },
    draw(g, ctx) {
      // filled, the sun is a little smaller and further from the cloud: its disc then stays out
      // of the notch between the cloud's two left circles, where the clear band would leave a
      // thin tip of it
      const [c, R, r0, r1] = ctx?.variant === 'fill' ? [8.75, 3.25 - Math.max(0, g.s - 2) * 0.75, 5, 7.5] : [9.75, 3.75, 5.5, 7.75];
      return [
        shell(g.ring(c, c, R), { n: 'core', role: S }),
        line(rays(g, c, c, r0, r1, [135, 180, 225, 270]), { n: 'rays', role: S }),
        shell(showerCloud(g), { n: 'cloud', role: P, occ: true }),
        ...showerRain(g)
      ];
    },
    light: ['core', 'rays'],
    fx: [{ t: 'rotate', on: ['rays'], deg: 45, o: [9.75, 9.75] }, fall(['r0', 'r1', 'r2'], 1.2)]
  },
  'cloud-moon-rain': {
    label: '夜间阵雨', key: 'live',
    plan: '主体：云（同阵雨）；辅助：新月（同月亮图标，缩小到 0.58，左上，被云挡住一部分）和三道雨线',
    weights: { [P]: 0.44, [S]: 0.56 },
    draw(g, ctx) {
      // filled, the moon sits 0.5 higher: its lower tip then clears the cloud's clear band
      const k = 0.58, dy = ctx?.variant === 'fill' ? -0.5 : 0;
      return [
        shell(crescent(g, k, 8 - 12 - 0.7 * k, 8 - 12 + 0.75 * k + dy), { n: 'moon', role: S }),
        shell(showerCloud(g), { n: 'cloud', role: P, occ: true }),
        ...showerRain(g)
      ];
    },
    light: ['moon'],
    fx: [{ t: 'wiggle', on: ['moon'], o: [8, 8], deg: 12, hz: 2.2 }, fall(['r0', 'r1', 'r2'], 1.2)]
  },
  'cloud-rain-wind': {
    label: '风雨', key: 'portrait', fit: 'y',
    plan: '主体：云（同下雨）；辅助：三道斜得更厉害的雨线（被风吹斜）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      return [
        shell(smallCloud(g), { n: 'cloud', role: P }),
        ...[7.5, 12, 16.5].map((x, i) => line(rainLine(g, x, 16, 22, 1.8), { n: `r${i}`, role: S }))
      ];
    },
    // 风雨: the rain is blown sideways as it falls
    fx: { t: 'keys', on: [['r0'], ['r1'], ['r2']], by: true, stagger: 80, x: [-1.2, 0.3], y: [1, 0], a: [0, 1] }
  },
  'cloud-rain-heavy': {
    label: '大雨', key: 'portrait', fit: 'y',
    plan: '主体：云（同下雨）；辅助：四道雨线（比下雨多一道，排得更密）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      return [
        shell(smallCloud(g), { n: 'cloud', role: P }),
        ...[6, 10, 14, 18].map((x, i) => line(rainLine(g, x, 15.5, 22), { n: `r${i}`, role: S }))
      ];
    },
    fx: fall(['r0', 'r1', 'r2', 'r3'])
  },
  'cloud-sleet': {
    label: '雨夹雪', key: 'portrait', fit: 'y',
    plan: '主体：云（同下雨）；辅助：两道短雨线（同小雨）和中间一片雪（实心点，同下雪）',
    weights: { [P]: 0.76, [S]: 0.24 },
    draw(g) {
      const k = 1 - (g.s - 2) * 0.3;
      return [
        shell(smallCloud(g), { n: 'cloud', role: P }),
        line(rainLine(g, 8, 15.5, 19.25, 0.6), { n: 'r0', role: S }),
        solid(g.dot(12, 20.35, k), { n: 'f0', role: S }),
        line(rainLine(g, 16, 15.5, 19.25, 0.6), { n: 'r1', role: S })
      ];
    },
    fx: { t: 'keys', on: [['r0'], ['f0'], ['r1']], by: true, stagger: 90, y: [1.2, -0.8, 0], a: [0, 0, 1] },
    allow: { optical: '云是主体，下方的雨点很轻，按云的位置定位' }
  },
  'cloud-lightning-rain': {
    nudge: [0, 1],
    label: '雷阵雨', key: 'portrait', fit: 'y',
    plan: '主体：云（同雷电）；辅助：闪电（同雷电）和两侧的两道短雨线。同雷电整体下移 1',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g, ctx) {
      const top = ctx?.variant === 'fill' ? [12, 14.5] : [15, 11];
      return [
        shell(smallCloud(g, 1), { n: 'cloud', role: P }),
        line(g.pl([top, [9, 18], [15, 18], [10.5, 23 - g.h]]), { n: 'bolt', role: S, gap: true }),
        line(rainLine(g, 5, 16.5, 21, 0.7), { n: 'r0', role: S }),
        line(rainLine(g, 19, 16.5, 21, 0.7), { n: 'r1', role: S })
      ];
    },
    light: ['bolt', 'r0', 'r1'],
    fx: [{ t: 'keys', on: ['bolt'], a: [0.15, 1, 0.15, 1], s: [1.06], o: [12, 16], ms: 520 }, fall(['r0', 'r1'], 1.2)]
  },
  'wind-snow': {
    label: '暴风雪', key: 'square',
    plan: '主体：两道风线（同风，末端卷成圆弧：上一道向上卷，下一道向下卷）；辅助：右下的三片雪（实心点，同下雪）',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      const k = 1 - (g.s - 2) * 0.3, r = g.dr * k;
      return [
        line(`M4 9H14` + g.arc(14, 6.5, 2.5, 90, -180).replace(/^M[^A]+/, ''), { n: 'w0', role: P }),
        line(`M4 15H9` + g.arc(9, 17, 2, -90, 180).replace(/^M[^A]+/, ''), { n: 'w1', role: P }),
        ...[[21 - r, 11.5], [21 - r, 16.5], [15, 21 - r]].map(([x, y], i) => solid(g.dot(x, y, k), { n: `f${i}`, role: S }))
      ];
    },
    // 暴风雪: the wind pushes and the snow is blown along
    fx: [{ t: 'keys', on: [['w0'], ['w1']], by: true, stagger: 80, x: [1.3, -0.4] }, { t: 'keys', on: [['f0'], ['f1'], ['f2']], by: true, stagger: 90, x: [1, -0.3], y: [0.6, 0] }]
  },
  hurricane: {
    label: '台风', key: 'square',
    plan: '主体：两条旋臂（圆弧，从风眼两侧伸出，绕成中心对称的漩涡）；辅助：风眼（圆环）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const R = 8, rc = 4.5 - g.h, a = 12 + rc - R, b = 12 - rc + R;
      return [
        shell(g.ring(12, 12, 4.5), { n: 'eye', role: S }),
        line(g.arc(a, 12, R, -116, 0), { n: 'arm0', role: P }),
        line(g.arc(b, 12, R, 64, 180), { n: 'arm1', role: P })
      ];
    },
    light: [],
    // 台风: the storm turns half a turn, landing on itself
    fx: { t: 'rotate', on: 'all', deg: -180, dip: 0.05 }
  },
  'thermometer-sun': {
    label: '高温', key: 'live',
    plan: '主体：温度计（同温度计，移到右侧）；辅助：太阳（左侧，被温度计挡住右半边，只画左半圆弧和四道光芒）；细节：水银（实心点）',
    weights: { [P]: 0.66, [S]: 0.28, [D]: 0.06 },
    draw(g) {
      return [
        line(g.arc(10, 11, 4 - g.h, 90, 270), { n: 'sun', role: S }),
        line(rays(g, 10, 11, 5.75, 8, [135, 180, 225, 270]), { n: 'rays', role: S }),
        ...thermo(g, 17)
      ];
    },
    area: (g) => [{ n: 'sun', d: `M10 ${n(11 + 4 - g.h)}A${n(4 - g.h)} ${n(4 - g.h)} 0 0 1 10 ${n(11 - 4 + g.h)}Z` }],
    light: ['sun', 'rays', 'mercury'],
    allow: { optical: '温度计是主体，放在右侧；左侧的太阳只露出半边，很轻，按温度计和太阳的整体轮廓定位' },
    // 高温: the mercury swells while the sun's rays turn
    fx: [{ t: 'keys', on: ['mercury'], o: [17, 17], s: [1.45, 1.3], ms: 420 }, { t: 'keys', on: ['rays'], o: [10, 11], s: [1.08, 1], ms: 420 }]
  },
  'thermometer-snowflake': {
    label: '低温', key: 'live',
    plan: '主体：温度计（同高温）；辅助：左侧的小雪花（三条交叉的直线和竖枝两端的小 V 形）；细节：水银（实心点）',
    weights: { [P]: 0.53, [S]: 0.41, [D]: 0.06 },
    draw(g) {
      const cx = 7, cy = 10, R = 5.5, arms = [];
      for (let i = 0; i < 3; i++) {
        const a = ((90 + i * 60) * Math.PI) / 180, c = Math.cos(a), s0 = Math.sin(a);
        arms.push(g.span(cx - R * c, cy - R * s0, cx + R * c, cy + R * s0));
      }
      const v = (y, d) => g.pl([[cx - 1.6, y + d * 1.6], [cx, y], [cx + 1.6, y + d * 1.6]]);
      return [
        line(arms.join(''), { n: 'flake', role: S }),
        line(v(cy - 2.9, -1) + v(cy + 2.9, 1), { n: 'tips', role: S }),
        ...thermo(g, 17)
      ];
    },
    light: ['flake', 'tips', 'mercury'],
    // 低温: the mercury shrinks back into the bulb
    fx: [{ t: 'keys', on: ['mercury'], o: [17, 17], s: [0.6, 0.75], ms: 420 }, { t: 'rotate', on: ['flake', 'tips'], deg: 60, o: [7, 10] }],
    allow: { optical: '温度计是主体，放在右侧；左侧的雪花是几条细线，很轻，按温度计和雪花的整体轮廓定位' }
  },
  droplets: {
    label: '湿度', key: 'live',
    plan: '主体：大水滴（同水滴，右下）；辅助：小水滴（左上，约一半大）',
    weights: { [P]: 0.74, [S]: 0.26 },
    draw(g) {
      return [
        shell(dropAt(g, 5.5, 8.5, 3.5, 2), { n: 'small', role: S }),
        shell(dropAt(g, 15.5, 15.5, 6.5, 4.2), { n: 'big', role: P })
      ];
    },
    light: [],
    // 湿度: the drops land one after the other
    fx: { t: 'keys', on: [['small'], ['big']], by: true, stagger: 120, y: [-1.2, 0.3], ms: 360 }
  },
  snowman: {
    anchor: 'base',
    label: '雪人', key: 'portrait', fit: 'y',
    plan: '主体：雪人（头和身体两个圆连成一个轮廓）；细节：身体上的两颗纽扣（实心点）',
    weights: { [P]: 0.92, [D]: 0.08 },
    draw(g) {
      const { h } = g, hc = [12, 6.75], hr = 4.75 - h, bc = [12, 15], br = 7 - h, [p1, p2] = meet(hc, hr, bc, br);
      const [L, R] = p1[0] < p2[0] ? [p1, p2] : [p2, p1], P2 = (q) => `${n(q[0])} ${n(q[1])}`;
      const k = 0.7 - (g.s - 2) * 0.4;
      return [
        shell(`M${P2(L)}A${n(hr)} ${n(hr)} 0 1 1 ${P2(R)}A${n(br)} ${n(br)} 0 1 1 ${P2(L)}Z`, { n: 'body', role: P }),
        solid(g.dot(12, 13.25, k), { n: 'b0', role: D, on: 'body' }),
        solid(g.dot(12, 17, k), { n: 'b1', role: D, on: 'body' })
      ];
    },
    // 雪人: the snowman wobbles on its base
    fx: { t: 'wiggle', on: 'all', o: [12, 22], deg: 6, hz: 2 },
    allow: { keyline: '雪人本身窄，宽 14' }
  }
};

// Variants made by rule (kit.mjs), of the icons above.
const base = (k) => ({ ...W[k], name: k });
const SLASH_SLIVER = { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' };
Object.assign(W, {
  'droplet-off': off({ ...slash(base('droplet'), { label: '无水' }), allow: SLASH_SLIVER }, 'droplet', { t: 'keys', on: ['drop'], o: [12, 21.4], s: [0.86], ms: 240 }),
  'umbrella-off': off({ ...slash(base('umbrella'), { label: '无需雨伞' }), allow: { ...SLASH_SLIVER, keyline: '斜线按方框画；伞面重，伞本身整体下移 1，同雨伞' } }, 'umbrella', { t: 'keys', on: ['canopy'], o: [12, 4], sx: [0.55], ms: 260 }),
  'zap-off': off({ ...slash(base('zap'), { label: '断电' }), allow: SLASH_SLIVER }, 'zap', { t: 'keys', on: ['bolt'], a: [0.3], ms: 240 })
});

export default W;
