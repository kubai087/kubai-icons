// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// travel: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: map map-pinned navigation compass route signpost luggage ticket boarding-pass passport hotel tent anchor lighthouse traffic-light parking
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { slash, badge } from '../kit.mjs';
import { off, notched } from '../variants.mjs';

// How far a rounded corner of radius c pulls the outline in from its corner point, along the
// bisector (the corner smoothing passes through the middle of that arc): for sharp tips.
const pull = (c, deg) => c / Math.sin((deg * Math.PI) / 360) - c;

// Ticket outline by centre line: a rounded box with a half-round notch in each short side.
function ticket(g, { x0 = 2, x1 = 22, y0 = 5, y1 = 19, c = 3.25, rn = 2.75 } = {}) {
  const { h } = g, a = x0 + h, b = x1 - h, t = y0 + h, u = y1 - h, r = c - h, m = (y0 + y1) / 2;
  return `M${n(a + r)} ${n(t)}H${n(b - r)}A${n(r)} ${n(r)} 0 0 1 ${n(b)} ${n(t + r)}V${n(m - rn)}A${n(rn)} ${n(rn)} 0 0 0 ${n(b)} ${n(m + rn)}V${n(u - r)}A${n(r)} ${n(r)} 0 0 1 ${n(b - r)} ${n(u)}H${n(a + r)}A${n(r)} ${n(r)} 0 0 1 ${n(a)} ${n(u - r)}V${n(m + rn)}A${n(rn)} ${n(rn)} 0 0 0 ${n(a)} ${n(m - rn)}V${n(t + r)}A${n(r)} ${n(r)} 0 0 1 ${n(a + r)} ${n(t)}Z`;
}
// A pass by centre line: a rounded box with a half-round bite in the top and bottom edges at px,
// where it tears.
function pass(g, { x0 = 2, x1 = 22, y0 = 5, y1 = 19, c = 3.25, px = 15, rn = 2.25 } = {}) {
  const { h } = g, a = x0 + h, b = x1 - h, t = y0 + h, u = y1 - h, r = c - h;
  return `M${n(a + r)} ${n(t)}H${n(px - rn)}A${n(rn)} ${n(rn)} 0 0 0 ${n(px + rn)} ${n(t)}H${n(b - r)}A${n(r)} ${n(r)} 0 0 1 ${n(b)} ${n(t + r)}V${n(u - r)}A${n(r)} ${n(r)} 0 0 1 ${n(b - r)} ${n(u)}H${n(px + rn)}A${n(rn)} ${n(rn)} 0 0 0 ${n(px - rn)} ${n(u)}H${n(a + r)}A${n(r)} ${n(r)} 0 0 1 ${n(a)} ${n(u - r)}V${n(t + r)}A${n(r)} ${n(r)} 0 0 1 ${n(a + r)} ${n(t)}Z`;
}
// Perforation of a ticket at x: a short dash from each long side and one in the middle.
const perforation = (g, x, y0, y1) => {
  const t = y0 + g.h, u = y1 - g.h, m = (y0 + y1) / 2;
  return g.seg(x, t, x, t + 2) + g.seg(x, m - 0.5, x, m + 0.5) + g.seg(x, u - 2, x, u);
};
// The same in the fill variant: the outer dashes cut out through the long sides and the three
// holes share the height equally, one stroke apart.
const perforationFill = (g, x, y0, y1) => {
  const { s, h } = g, p = (y1 - y0 - 2 * s) / 3, a = y0 + p, b = a + s, c = b + p, d = c + s;
  return g.seg(x, y0 - h, x, a - h) + g.seg(x, b + h, x, c - h) + g.seg(x, d + h, x, y1 + h);
};
// A small plane seen from above, pointing right, as a solid (too small for an outline):
// fuselage, swept wings and tail, about 8 long.
// The fuselage and the wing tips run straight across on whole pixels.
// t moves the tail back by t (the fill variant: the ink between wing and tail stays a stroke wide).
function planeGlyph(g, cx, cy, t = 0) {
  const p = [[3.6, 0], [2.2, 1], [0.8, 1], [-1.2, 4], [-2.3, 4], [-1.4, 1], [-2.5 - t, 1], [-3.3 - t, 2.6], [-3.5 - t, 0]];
  const pts = [...p, ...p.slice(1, -1).reverse().map(([x, y]) => [x, -y])].map(([x, y]) => [cx + x, cy + y]);
  return g.polygon(pts, pts.map((_, i) => (i === 0 ? 1 : 0.3)));
}

const set = {
  map: {
    allow: { sliver: '折痕斜着切过起伏的上下边，切口是锐角；只在 1.75 时略超阈值，不是碎块' },
    label: '地图', key: 'landscape',
    ends: 'out',
    plan: '主体：折成三折的地图（上下边沿折线起伏的一个闭合形）；细节：两条折痕。折痕从上沿通到下沿，分出三折，占三成多',
    weights: { [P]: 0.66, [D]: 0.34 },
    draw(g) {
      // three panels; each fold rises 2 on one side, so the top and bottom edges zigzag
      const top = [[3, 7], [9, 5], [15, 7], [21, 5]], bot = [[21, 17], [15, 19], [9, 17], [3, 19]];
      return [
        shell(g.polygon([...top, ...bot], [1.75, 0.4, 0.4, 1.75, 1.75, 0.4, 0.4, 1.75]), { n: 'map', role: P }),
        line(g.seg(9, 5, 9, 17), { n: 'f1', role: D, on: 'map' }),
        line(g.seg(15, 7, 15, 19), { n: 'f2', role: D, on: 'map' })
      ];
    },
    // 打开地图: the folds gather, then the map opens out flat
    fx: { t: 'keys', on: 'all', o: [12, 12], sx: [0.8, 1.04], ms: 380 }
  },
  'map-pinned': {
    label: '地图标记', key: 'square',
    plan: '主体：定位针（与“定位”同形，缩小）；辅助：地面上的椭圆（被针挡住的后沿断开）；细节：针头中心的圆点（太小画不出圆环）',
    weights: { [P]: 0.5, [S]: 0.42, [D]: 0.08 },
    draw(g) {
      const { h } = g, rx = 9 - h, ry = 3.5 - h, cy = 17.5;
      return [
        shell(`M${n(12 - rx)} ${cy}A${n(rx)} ${n(ry)} 0 1 0 ${n(12 + rx)} ${cy}A${n(rx)} ${n(ry)} 0 1 0 ${n(12 - rx)} ${cy}Z`, { n: 'ground', role: S }),
        shell(pin(g, { cy: 9.25, R: 6.25, tip: 17.4 }), { n: 'pin', role: P, occ: true }),
        solid(g.dot(12, 9.25, 1.1), { n: 'hole', role: D, on: 'pin' })
      ];
    },
    // 标记位置: the pin drops onto the spot and the ground ring answers
    fx: [{ t: 'bounce', on: ['pin', 'hole'], o: [12, 17.5], amp: 1.3 }, { t: 'keys', on: ['ground'], o: [12, 17.5], s: [0.92, 1.03], ms: 300 }]
  },
  navigation: {
    nudge: [0, -0.5],
    label: '导航', key: 'portrait',
    plan: '主体：朝上的导航箭头（尾部内凹），一个闭合形。与“发送”的纸飞机同样的尖角圆角，但竖直朝前、没有折线，表示行进方向',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, tip = 1.2, wing = 1.2, top = 1.5 - pull(tip, 41) + h, by = 22.8 - h;
      return [shell(g.polygon([[12, top], [21.1 - h, by], [12, 16.9], [2.9 + h, by]], [tip, wing, 0.5, wing]), { n: 'arrow', role: P })];
    },
    // 导航: the arrow moves ahead, then settles back
    fx: { t: 'keys', on: 'all', y: [-1.2, 0.3], ms: 320 }
  },
  compass: {
    label: '指南针', key: 'circle',
    plan: '主体：表盘圆；辅助：菱形指针（斜放指向右上，离表盘内沿至少 1.5）',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) {
      const a = 6.3 / Math.SQRT2, b = 2.8 / Math.SQRT2;
      return [
        shell(g.ring(12, 12, 10), { n: 'face', role: P }),
        shell(g.polygon([[12 + a, 12 - a], [12 + b, 12 + b], [12 - a, 12 + a], [12 - b, 12 - b]], [0.9, 0.8, 0.9, 0.8]), { n: 'needle', role: S, on: 'face' })
      ];
    },
    // 找方向: the needle swings and settles
    fx: { t: 'wiggle', on: ['needle'], o: [12, 12], deg: 28, hz: 2 }
  },
  route: {
    label: '路线', key: 'square',
    plan: '主体：起点到终点之间折返的路径；辅助：起点和终点两个圆环',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const R = 3.25, r = R - g.h;
      return [
        shell(g.ring(6, 6, R), { n: 'start', role: S }),
        shell(g.ring(18, 18, R), { n: 'end', role: S }),
        line(`M${n(6 + r)} 6H15A3 3 0 0 1 15 12H9A3 3 0 0 0 9 18H${n(18 - r)}`, { n: 'path', role: P })
      ];
    },
    // 规划路线: the path is drawn from the start to the end
    fx: { t: 'draw', on: ['path'] }
  },
  signpost: {
    anchor: 'base',
    label: '路标', key: 'square',
    plan: '主体：指向右的路牌；辅助：立杆（路牌上方露出一小段）',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const { h } = g, t = 5 + h, b = 13 - h, x0 = 3 + h, tipX = 21 - h * 0.6;
      return [
        line(g.span(11, 3, 11, 5 + h) + g.seg(11, 13 - h, 11, 21 - h), { n: 'pole', role: S }),
        shell(g.polygon([[x0, t], [16.5, t], [tipX, 9], [16.5, b], [x0, b]], [1.5, 1, 1, 1, 1.5]), { n: 'board', role: P })
      ];
    },
    // 指路: the board points ahead to the right
    fx: { t: 'keys', on: ['board'], x: [1.1, -0.3], ms: 300 }
  },
  luggage: {
    anchor: 'base',
    label: '行李箱', key: 'portrait',
    plan: '主体：箱体；辅助：提手；细节：两条竖向箍条（不碰上下边）',
    weights: { [P]: 0.66, [S]: 0.12, [D]: 0.22 },
    draw(g) {
      const { h, s } = g, by = 6, y0 = by + s + 1.5 + h, y1 = 22 - s - 1.5 - h;
      return [
        line(arch(9 + h, 15 - h, 2 + h, by + h), { n: 'handle', role: S }),
        shell(g.box(4, by, 16, 16, 4), { n: 'case', role: P }),
        line(g.seg(9, y0, 9, y1), { n: 's1', role: D, on: 'case' }),
        line(g.seg(15, y0, 15, y1), { n: 's2', role: D, on: 'case' })
      ];
    },
    // 提起行李: the case is lifted by its handle and swings
    fx: { t: 'wiggle', on: 'all', o: [12, 2], deg: 6, hz: 2.4 }
  },
  ticket: {
    label: '票', key: 'landscape', fit: 'x',
    plan: '主体：票面（两侧半圆缺口）；细节：虚线撕口（三段短线）',
    weights: { [P]: 0.88, [D]: 0.12 },
    draw(g, ctx) {
      return [shell(ticket(g), { n: 'ticket', role: P }), line((ctx?.variant === 'fill' ? perforationFill : perforation)(g, 15, 5, 19), { n: 'perf', role: D, on: 'ticket' })];
    },
    // 检票: the ticket is held out and tilts
    fx: { t: 'wiggle', on: 'all', o: [12, 12], deg: 7, hz: 2.2 }
  },
  'boarding-pass': {
    label: '登机牌', key: 'landscape', fit: 'x',
    plan: '主体：票面（比“票”高一些，撕口处上下各一个半圆缺口）；辅助：飞机（实心，太小画不出线框）',
    weights: { [P]: 0.86, [S]: 0.14 },
    draw(g, ctx) {
      // fill: the plane is a hole; its tail moves back (and the plane forward by half) so the
      // ink between wing and tail is a stroke wide
      const t = ctx?.variant === 'fill' ? Math.max(0, g.s - 1.1) : 0;
      return [
        shell(pass(g, { y0: 4, y1: 20 }), { n: 'pass', role: P }),
        solid(planeGlyph(g, 9.5 + t / 2, 12, t), { n: 'plane', role: S, on: 'pass' })
      ];
    },
    light: ['plane'],
    // 登机: the plane on the pass sets off to the right and comes back
    fx: { t: 'keys', on: ['plane'], x: [1.4, -0.3], ms: 320 }
  },
  passport: {
    label: '护照', key: 'portrait', fit: 'y',
    plan: '主体：护照本；细节：封面的圆形徽记和下方一行字',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g) {
      const { s } = g, R = 3.5 - (s - 2) * 0.5;
      return [
        shell(g.box(5, 2, 14, 20, 3.5), { n: 'book', role: P }),
        shell(g.ring(12, 10, R), { n: 'emblem', role: D, on: 'book' }),
        line(g.seg(10, 17, 14, 17), { n: 'name', role: D, on: 'book' })
      ];
    },
    // 盖章: the emblem is pressed like a stamp
    fx: { t: 'keys', on: ['emblem'], o: [12, 10], s: [1.25, 0.92], ms: 300 }
  },
  hotel: {
    anchor: 'base',
    label: '酒店', key: 'landscape',
    plan: '主体：床垫；辅助：床头和床脚；细节：两个枕头（短线）',
    weights: { [P]: 0.46, [S]: 0.4, [D]: 0.14 },
    draw(g) {
      const { h } = g, top = 12;
      return [
        line(`M5 ${top + h}V7A2 2 0 0 1 7 5H17A2 2 0 0 1 19 7V${top + h}`, { n: 'head', role: S, part: 'frame' }),
        line(g.seg(6.5 + g.s, 9, 11.25 - h, 9) + g.seg(12.75 + h, 9, 17.5 - g.s, 9), { n: 'pillows', role: D }),
        shell(g.box(2, top, 20, 6, 2), { n: 'bed', role: P }),
        line(g.seg(4, 18 - h, 4, 20 - h) + g.seg(20, 18 - h, 20, 20 - h), { n: 'legs', role: S, part: 'frame' })
      ];
    },
    light: ['pillows'],
    // 入住: the mattress gives under you and springs back
    fx: { t: 'keys', on: ['bed', 'pillows'], o: [12, 18], sy: [0.86, 1.03], ms: 280 }
  },
  tent: {
    anchor: 'base',
    label: '帐篷', key: 'square',
    plan: '主体：三角形帐篷；细节：门帘（倒 V，从底边升起）',
    weights: { [P]: 0.76, [D]: 0.24 },
    draw(g, ctx) {
      const { h } = g, c = 1.3, yb = 21 - h, top = 3 - pull(c, 2 * Math.atan(9 / 18) * 180 / Math.PI) + h;
      const tent = shell(g.polygon([[12, top], [21.7 - h, yb], [2.3 + h, yb]], [c, 1.2, 1.2]), { n: 'tent', role: P });
      if (ctx?.variant !== 'fill') return [tent, line(g.pl([[8.6, yb], [12, 14], [15.4, yb]]), { n: 'door', role: D, on: 'tent' })];
      // fill: the doorway is one triangular hole on the door's centre line, cut out through the
      // ground line (inside an inverted V a sharp scrap of ink would be left)
      const k = 3.4 / (yb - 14), y2 = yb + g.s, w = 3.4 + (y2 - yb) * k;
      return [tent, solid(g.polygon([[12, 14], [12 + w, y2], [12 - w, y2]], [h, 0, 0]), { n: 'door', role: D, on: 'tent' })];
    },
    // 搭帐篷: the door flaps open wider and fall back
    fx: { t: 'keys', on: ['door'], o: [12, 20], sx: [1.4, 0.95], ms: 320 }
  },
  anchor: {
    nudge: [0, -0.5],
    label: '锚', key: 'live',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：锚杆、横杆和两侧带倒钩的锚臂；辅助：顶上的圆环',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      // The arms carry the weight low, so the anchor sits 0.5 high (nudge). The arms' centre is
      // at 11.5; they turn just past half a circle so the barbs run straight across at 11.
      const { h } = g, r = 10 - h, cy = 11.5, y = 11, dx = Math.sqrt(r * r - (cy - y) ** 2);
      return [
        shell(g.ring(12, 4.5, 3), { n: 'ring', role: S }),
        line(g.seg(12, 7.5 - h, 12, cy + r) + g.seg(9, 10, 15, 10) + `M5 ${y}H${n(12 - dx)}A${n(r)} ${n(r)} 0 1 0 ${n(12 + dx)} ${y}H19`, { n: 'body', role: P })
      ];
    },
    // 抛锚: the anchor swings from its ring and comes to rest
    fx: { t: 'wiggle', on: 'all', o: [12, 3], deg: 9, hz: 1.8 }
  },
  lighthouse: {
    anchor: 'base',
    label: '灯塔', key: 'live',
    ends: 'out',
    plan: '主体：塔身（上窄下宽）；辅助：顶上的灯室（圆顶，与塔顶同宽）和伸出两侧的平台；细节：塔身一道横纹和两侧的光线',
    weights: { [P]: 0.42, [S]: 0.36, [D]: 0.22 },
    draw(g) {
      // the lamp room's bottom edge is the tower's top edge: one line
      const { h } = g, hb = 10, x0 = 8 + h, x1 = 16 - h, b0 = 6 + h, b1 = 18 - h, yb = 22 - h, yt = hb - h, at = (y) => x0 + (b0 - x0) * (y - yt) / (yb - yt);
      return [
        shell(g.box(8, 2, 8, hb - 2, [4, 4, 0, 0]), { n: 'lamp', role: S }),
        shell(g.polygon([[x0, yt], [x1, yt], [b1, yb], [b0, yb]], [0, 0, 1.5, 1.5]), { n: 'tower', role: P }),
        line(g.span(6, yt, 18, yt), { n: 'gallery', role: S }),
        line(g.seg(at(16), 16, 24 - at(16), 16), { n: 'band', role: D, on: 'tower' }),
        line(g.span(2, 6, 5, 6), { n: 'rayL', role: D }),
        line(g.span(19, 6, 22, 6), { n: 'rayR', role: D })
      ];
    },
    light: ['rayL', 'rayR'],
    // 灯塔闪光: the light sweeps from one side to the other
    fx: { t: 'variable', on: ['rayL', 'rayR'], mode: 'iterative', step: 240 }
  },
  'traffic-light': {
    label: '红绿灯', key: 'portrait', fit: 'y',
    plan: '主体：灯箱；细节：三盏灯（实心圆点，太小画不出圆环；粗字重下略缩小）',
    weights: { [P]: 0.82, [D]: 0.18 },
    draw(g) {
      const k = 0.94 - (g.s - 2) * 0.63;
      return [
        shell(g.box(6, 2, 12, 20, 6), { n: 'box', role: P }),
        ...[7.25, 12, 16.75].map((y, i) => solid(g.dot(12, y, k), { n: `l${i}`, role: D, on: 'box', vc: i }))
      ];
    },
    // 红绿灯: the lights come on one after another
    fx: { t: 'variable', on: ['l0', 'l1', 'l2'], mode: 'iterative', step: 260 }
  },
  parking: {
    label: '停车场', key: 'square',
    plan: '主体：字母 P（墨少但层级最高）；辅助：方形标牌',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g) {
      return [
        shell(g.box(3, 3, 18, 18, 4.5), { n: 'sign', role: S }),
        line('M9 16V8H12.5A2.5 2.5 0 0 1 12.5 13H9', { n: 'p', role: P, on: 'sign' })
      ];
    },
    // 停车: the letter is drawn in
    fx: { t: 'draw', on: ['p'] }
  }
};

// --- Places and wayfinding ------------------------------------------------------------------

// The locator: a ring of outer radius 7 and four ticks out to the circle keyline.
const locator = (g) => {
  const { h } = g, r = 7 - h;
  return [
    shell(g.ring(12, 12, 7), { n: 'ring', role: P }),
    line(g.seg(12, 2 + h, 12, 12 - r) + g.seg(12, 12 + r, 12, 22 - h) + g.seg(2 + h, 12, 12 - r, 12) + g.seg(12 + r, 12, 22 - h, 12), { n: 'ticks', role: S })
  ];
};

Object.assign(set, {
  locate: {
    label: '定位', key: 'circle',
    plan: '主体：圆环（半径 7）；辅助：上下左右四条短线，从圆环伸到参考圆',
    weights: { [P]: 0.63, [S]: 0.37 },
    draw(g) { return locator(g); },
    // 定位: the ticks close in on the spot and spring back
    fx: { t: 'keys', on: ['ticks'], o: [12, 12], s: [0.84, 1.04], ms: 320 }
  },
  'locate-fixed': {
    label: '已定位', key: 'circle',
    plan: '同定位，圆环中心加一个实心圆点（已锁定的位置；随字重缩小）',
    weights: { [P]: 0.56, [S]: 0.34, [D]: 0.1 },
    draw(g) {
      return [...locator(g), solid(g.dot(12, 12, 1.3 - (g.s - 2) * 0.3), { n: 'dot', role: D, on: 'ring' })];
    },
    // 已定位: the ticks close in and the dot lands on the spot
    fx: [{ t: 'keys', on: ['ticks'], o: [12, 12], s: [0.84, 1.04], ms: 320 }, { t: 'keys', on: ['dot'], o: [12, 12], s: [1.5, 0.9], ms: 300 }]
  },
  'location-arrow': {
    nudge: [-0.5, 0.5],
    label: '当前位置', key: 'live',
    plan: '主体：定位箭头（与“导航”同一形状，转 45° 指向右上），一个闭合形',
    weights: { [P]: 1 },
    draw(g) {
      // the navigation arrow's points (centre lines), turned about the canvas centre and scaled by k
      const { h } = g, k = 1.04, top = 1.5 - pull(1.2, 41) + h, by = 22.8 - h, c = [12.9, 11.1];
      const pts = [[12, top], [21.1 - h, by], [12, 16.9], [2.9 + h, by]].map(([x, y]) => {
        const u = (x - 12) * k, v = (y - 12.4) * k;
        return [c[0] + (u - v) * Math.SQRT1_2, c[1] + (u + v) * Math.SQRT1_2];
      });
      return [shell(g.polygon(pts, [1.2, 1.2, 0.5, 1.2]), { n: 'arrow', role: P })];
    },
    // 当前位置: the arrow heads off to the top right and settles back
    fx: { t: 'keys', on: 'all', x: [1, -0.25], y: [-1, 0.25], ms: 320 }
  },
  waypoints: {
    label: '途经点', key: 'live',
    plan: '主体：四个途经点（圆环，在上下左右）；辅助：连接它们的折线（左上、横贯、右下三段）',
    weights: { [P]: 0.68, [S]: 0.32 },
    draw(g) {
      const { h } = g, R = 3, r = R - h, k = r * Math.SQRT1_2, pts = [[12, 5], [5, 12], [19, 12], [12, 19]];
      return [
        ...pts.map(([x, y], i) => shell(g.ring(x, y, R), { n: `p${i}`, role: P })),
        line(g.seg(12 - k, 5 + k, 5 + k, 12 - k) + g.seg(5 + r, 12, 19 - r, 12) + g.seg(19 - k, 12 + k, 12 + k, 19 - k), { n: 'path', role: S })
      ];
    },
    // 途经点: the path is drawn from stop to stop
    fx: { t: 'draw', on: ['path'] }
  },
  directions: {
    label: '路线指引', key: 'live',
    plan: '主体：右转箭头（符号，墨少但层级最高；粗字重下随菱形的内沿缩小）；辅助：菱形路牌（四个角贴参考区域的四边）',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g, ctx) {
      const { h } = g, c = 2.5, t = 2 + h - (c / Math.SQRT1_2 - c), b = 24 - t;
      // the arrow keeps a clear space from the diamond's inner edge (|x| + |y| from the centre)
      const inner = 12 - t - h * Math.SQRT2, k = Math.min(1, (inner - (h + g.clear) * Math.SQRT2) / 5);
      const A = (x, y) => [12 + (x - 12) * k, 12 + (y - 12) * k];
      const stem = `M${g.pt(...A(10, 15))}L${g.pt(...A(10, 12.5))}A${n(1.5 * k)} ${n(1.5 * k)} 0 0 1 ${g.pt(...A(11.5, 11))}`;
      // fill: the head is a solid triangle, so no thin wedge of ink is left inside its arms
      if (ctx?.variant === 'fill') return [
        shell(g.polygon([[12, t], [b, 12], [12, b], [t, 12]], c), { n: 'sign', role: S }),
        line(stem + `L${g.pt(...A(14.5, 11))}`, { n: 'arrow', role: P, on: 'sign' }),
        solid(g.polygon([A(13.4, 8.1), A(17, 11), A(13.4, 13.9)], 0.6), { n: 'arrow', role: P, on: 'sign' })
      ];
      return [
        shell(g.polygon([[12, t], [b, 12], [12, b], [t, 12]], c), { n: 'sign', role: S }),
        line(stem + `L${g.pt(...A(16, 11))}` + g.pl([A(14, 9), A(16, 11), A(14, 13)]), { n: 'arrow', role: P, on: 'sign' })
      ];
    },
    // 指路: the turn is drawn in
    fx: { t: 'draw', on: ['arrow'] }
  }
});

// A signboard by centre line between x0 and x1 (outer), pointing right (dir 1) or left (-1),
// its point as deep as the board is high.
function board(g, x0, x1, y0, y1, dir) {
  const { h } = g, m = (y0 + y1) / 2, d = (y1 - y0) / 2 + 0.5, X = (x) => (dir > 0 ? x : 24 - x);
  const a = dir > 0 ? x0 : 24 - x1, b = dir > 0 ? x1 : 24 - x0;
  return g.polygon([[X(a + h), y0 + h], [X(b - d), y0 + h], [X(b - h * 0.6), m], [X(b - d), y1 - h], [X(a + h), y1 - h]], [1.5, 1, 1, 1, 1.5]);
}
// A flame by centre line: a circle (outer radius R) and the two lines tangent to it from a tip
// above, at tip (outer).
function flame(g, cx, cy, R, tip) {
  const r = R - g.h, ty = tip + g.h * 1.3, b = Math.acos(r / (cy - ty));
  const Pt = (a) => `${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
  return `M${n(cx)} ${n(ty)}L${Pt(-Math.PI / 2 + b)}A${n(r)} ${n(r)} 0 1 1 ${Pt(-Math.PI / 2 - b)}Z`;
}

Object.assign(set, {
  'signpost-big': {
    anchor: 'base',
    label: '岔路路标', key: 'square',
    plan: '主体：两块指向相反的路牌（上指右、下指左）；辅助：立杆（两块路牌之间和下方露出）。立杆只露出两小段',
    weights: { [P]: 0.88, [S]: 0.12 },
    draw(g) {
      const { h } = g;
      return [
        line(g.seg(12, 9 - h, 12, 11 + h) + g.seg(12, 17 - h, 12, 21 - h), { n: 'pole', role: S }),
        shell(board(g, 6, 21, 3, 9, 1), { n: 'b1', role: P }),
        shell(board(g, 3, 18, 11, 17, -1), { n: 'b2', role: P })
      ];
    },
    // 岔路: each board points its own way
    fx: [{ t: 'keys', on: ['b1'], x: [0.9, -0.25], ms: 300 }, { t: 'keys', on: ['b2'], x: [-0.9, 0.25], ms: 300 }]
  },
  road: {
    label: '道路', key: 'square',
    plan: '主体：向远处收窄的两条路边；辅助：中间的三段标线（近处长、远处短）',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      const { h } = g, t = 3 + h, b = 21 - h;
      return [
        line(g.seg(8, t, 4, b) + g.seg(16, t, 20, b), { n: 'edges', role: P }),
        line(g.seg(12, t, 12, 5.5), { n: 'd0', role: S, vc: 0 }),
        line(g.seg(12, 9.5, 12, 12.5), { n: 'd1', role: S, vc: 1 }),
        line(g.seg(12, 16.5, 12, b), { n: 'd2', role: S, vc: 2 })
      ];
    },
    // 行驶: the lane marks light up one after another, coming toward you
    fx: { t: 'variable', on: ['d0', 'd1', 'd2'], mode: 'iterative', step: 200 }
  },
  bridge: {
    anchor: 'base',
    label: '桥', key: 'landscape',
    plan: '主体：桥身（下方一个半圆拱洞，一个闭合形）；辅助：桥面上的栏杆（一条横线和三根立柱）',
    weights: { [P]: 0.68, [S]: 0.32 },
    draw(g) {
      const { h } = g, t = 9 + h, b = 20 - h, l = 2 + h, r = 22 - h, c = 2.5 - h, R = 5, f = Math.max(1.5 - h, 0.25);
      return [
        line(g.span(2, 5, 22, 5) + [7, 12, 17].map((x) => g.seg(x, 6, x, t)).join(''), { n: 'rail', role: S }),
        shell(`M${n(l + c)} ${n(t)}H${n(r - c)}A${n(c)} ${n(c)} 0 0 1 ${n(r)} ${n(t + c)}V${n(b - f)}A${n(f)} ${n(f)} 0 0 1 ${n(r - f)} ${n(b)}H${12 + R}A${R} ${R} 0 0 0 ${12 - R} ${n(b)}H${n(l + f)}A${n(f)} ${n(f)} 0 0 1 ${n(l)} ${n(b - f)}V${n(t + c)}A${n(c)} ${n(c)} 0 0 1 ${n(l + c)} ${n(t)}Z`, { n: 'span', role: P })
      ];
    },
    // 过桥: the railing is drawn along the deck
    fx: { t: 'draw', on: ['rail'] }
  },
  castle: {
    anchor: 'base',
    label: '城堡', key: 'square',
    ends: 'out',
    plan: '主体：城墙（顶上三个垛口，一个闭合形）；细节：拱形城门（在面性中从底边切开）',
    weights: { [P]: 0.78, [D]: 0.22 },
    draw(g) {
      const { h } = g, t = 3 + h, y = 7, b = 21 - h, l = 3 + h, r = 21 - h, c = 1.25;
      const pts = [[l, b], [l, t], [7, t], [7, y], [11, y], [11, t], [13, t], [13, y], [17, y], [17, t], [r, t], [r, b]];
      return [
        shell(g.polygon(pts, [1.5, c, c, 0, 0, c, c, 0, 0, c, c, 1.5]), { n: 'wall', role: P }),
        line(`M9 ${n(b)}V16A3 3 0 0 1 15 16V${n(b)}`, { n: 'gate', role: D, on: 'wall' })
      ];
    },
    // 城门: the gate lowers and rises again
    fx: { t: 'keys', on: ['gate'], o: [12, 21], sy: [0.75, 1.05], ms: 320 }
  },
  'suitcase-rolling': {
    anchor: 'base',
    label: '拉杆箱', key: 'portrait',
    plan: '主体：箱体；辅助：拉杆（伸出箱顶）和两个轮子（实心，太小画不出线框）',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) {
      const { h } = g, top = 5, bot = 17;
      return [
        line(`M9 ${n(top + h)}V${n(2 + h + 1.5)}A1.5 1.5 0 0 1 10.5 ${n(2 + h)}H13.5A1.5 1.5 0 0 1 15 ${n(3.5 + h)}V${n(top + h)}`, { n: 'handle', role: S }),
        shell(g.box(5, top, 14, bot - top, 3.5), { n: 'case', role: P }),
        solid(g.dot(8, 20.5) + g.dot(16, 20.5), { n: 'wheels', role: S })
      ];
    },
    allow: { keyline: '轮子在箱底以下，最下沿随字重变大，超出纵向参考线不到 0.5' },
    // 拖着走: the case tips onto its wheels and rolls along
    fx: { t: 'keys', on: 'all', o: [12, 22], x: [1.2, -0.3], r: [5, -1], ms: 340 }
  },

  tickets: {
    label: '多张票', key: 'live',
    plan: '主体：前面一张票（同“票”，两侧半圆缺口）；辅助：后面一张票（向右上错开，只露出上边和右边，一笔线条）',
    weights: { [P]: 0.61, [S]: 0.39 },
    draw(g) {
      const { h } = g, c = 3 - h, t = 2 + h, r = 22 - h;
      return [
        line(`M${6 + h} ${n(10 - g.clear - h)}V${n(t + c)}A${n(c)} ${n(c)} 0 0 1 ${n(6 + h + c)} ${n(t)}H${n(r - c)}A${n(c)} ${n(c)} 0 0 1 ${n(r)} ${n(t + c)}V16`, { n: 'back', role: S }),
        shell(ticket(g, { x0: 2, x1: 18, y0: 10, y1: 22, c: 3, rn: 2.25 }), { n: 'front', role: P })
      ];
    },
    // 出票: the ticket behind slides out and back
    fx: { t: 'keys', on: ['back'], x: [0.8, -0.2], y: [-0.8, 0.2], ms: 300 }
  },

  binoculars: {
    label: '双筒望远镜', key: 'live', fit: 'x',
    plan: '主体：两个镜筒（圆角矩形）；辅助：顶上的两个目镜（与镜筒相连）和中间的转轴',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const { h } = g, top = 9, eye = (x0, x1) => `M${x0} ${n(top + h)}V${n(4.5 + h)}A1.5 1.5 0 0 1 ${x0 + 1.5} ${n(3 + h)}H${x1 - 1.5}A1.5 1.5 0 0 1 ${x1} ${n(4.5 + h)}V${n(top + h)}`;
      return [
        line(eye(4, 9) + eye(15, 20) + g.seg(11 - h, 14, 13 + h, 14), { n: 'eyes', role: S }),
        shell(g.box(2, top, 9, 12, 4), { n: 'l', role: P }),
        shell(g.box(13, top, 9, 12, 4), { n: 'r', role: P })
      ];
    },
    // 眺望: the binoculars look one way, then the other
    fx: { t: 'keys', on: 'all', o: [12, 12], r: [-6, 6, 0], ms: 520 }
  },
  lifebuoy: {
    label: '救生圈', key: 'circle',
    ends: 'out',
    plan: '主体：外圈；辅助：内圈和四道斜向的色带（连接内外圈；面性中切开外圈，分成四块）',
    weights: { [P]: 0.56, [S]: 0.44 },
    draw(g) {
      const { h } = g, a = 5 - h, b = 10 - h;
      const band = [45, 135, 225, 315].map((d) => { const c = Math.cos((d * Math.PI) / 180), sn = Math.sin((d * Math.PI) / 180); return g.seg(12 + a * c, 12 + a * sn, 12 + b * c, 12 + b * sn); });
      return [
        shell(g.ring(12, 12, 10), { n: 'outer', role: P }),
        shell(g.ring(12, 12, 5), { n: 'inner', role: S, on: 'outer' }),
        ...band.map((d, i) => line(d, { n: i ? `band${i}` : 'band', role: S, on: 'outer' }))
      ];
    },
    light: [],
    // 抛出: the ring spins a quarter turn, landing on itself
    fx: { t: 'rotate', on: 'all', deg: 90, o: [12, 12] }
  },
  'street-lamp': {
    anchor: 'base',
    label: '路灯', key: 'portrait', fit: 'x',
    plan: '主体：灯杆和灯臂（一笔线条，底下一条底座）；辅助：灯罩（梯形）；悬停时灯罩下出现光线',
    weights: { [P]: 0.54, [S]: 0.46 },
    draw(g) {
      const { h } = g, t = 2 + h, b = 22 - h, y = 9;
      return [
        line(`M8 ${n(b)}V${n(t + 3)}A3 3 0 0 1 11 ${n(t)}H14` + g.span(4, b, 12, b), { n: 'post', role: P }),
        shell(g.polygon([[13, t], [17, t], [20.4 - h, y], [9.6 + h, y]], [0.75, 0.75, 1, 1]), { n: 'shade', role: S }),
        line(g.span(12.5, 11.5, 12, 13.5) + g.span(15, 11.5, 15, 14) + g.span(17.5, 11.5, 18, 13.5), { n: 'rays', role: D, ghost: true })
      ];
    },
    light: ['rays'],
    // 亮灯: the light shines down from the shade
    fx: [{ t: 'keys', on: ['rays'], ghost: true, a: [1, 1, 1], ms: 420 }, { t: 'keys', on: ['shade'], o: [15, 3], s: [1.08, 1], ms: 300 }]
  },
  'concierge-bell': {
    anchor: 'base',
    label: '前台服务铃', key: 'landscape',
    plan: '主体：半圆铃罩；辅助：底座（一条横线）和顶上的按钮（短杆加横帽）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const { h } = g, y = 15, r = 8 - h;
      return [
        line(g.span(2, 19, 22, 19), { n: 'base', role: S }),
        shell(`M${n(12 - r)} ${y}A${n(r)} ${n(r)} 0 0 1 ${n(12 + r)} ${y}Z`, { n: 'dome', role: P }),
        line(g.seg(12, y - r, 12, 5) + g.span(10, 5, 14, 5), { n: 'knob', role: S })
      ];
    },
    // 叮: the button is pressed and the dome rings
    fx: [{ t: 'keys', on: ['knob'], y: [1.2, -0.2], ms: 220 }, { t: 'shake', on: ['dome', 'knob'], x: 0.5, ms: 420 }]
  },

  campfire: {
    anchor: 'base',
    label: '篝火', key: 'square',
    plan: '主体：火焰（尖顶朝上）；辅助：下面交叉的两根木柴',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g;
      return [
        line(g.seg(4, 16 + h, 20, 20) + g.seg(4, 20, 20, 16 + h), { n: 'logs', role: S }),
        shell(flame(g, 12, 9.25, 4.25, 3), { n: 'flame', role: P })
      ];
    },
    // 生火: the flame flickers
    fx: { t: 'wiggle', on: ['flame'], o: [12, 13.5], deg: 7, hz: 3 }
  },
  'flag-triangle-right': {
    anchor: 'base',
    label: '三角旗', key: 'square',
    plan: '主体：三角旗面（尖角向右）；辅助：旗杆（一条线，占一成多）',
    weights: { [P]: 0.84, [S]: 0.16 },
    draw(g) {
      const { h } = g, c = 1.2;
      return [
        line(g.span(6, 3, 6, 21), { n: 'pole', role: S }),
        shell(g.polygon([[6, 3 + h], [22 - h + pull(c, 50) * 0.5, 9], [6, 15 - h]], [0.5, c, 0.5]), { n: 'cloth', role: P })
      ];
    },
    allow: { keyline: '同“标记”，旗杆立在左侧 6 处，旗面向右展开', optical: '旗面向右收成尖角，分量偏在旗杆一侧，按旗杆和旗面的外框定位' },
    // 集合: the pennant flutters
    fx: { t: 'keys', on: ['cloth'], o: [5, 9], sx: [0.84, 1.05, 0.96] }
  },

  'beach-umbrella': {
    anchor: 'base',
    label: '遮阳伞', key: 'square',
    plan: '主体：伞面（半圆，下沿三段向上的弧）；辅助：伞杆和沙地（一条横线）',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      const { h } = g, r = 9 - h, y = 12, w = (2 * r) / 3, q = 3, sag = q - Math.sqrt(q * q - (w / 2) ** 2);
      const hem = [1, 2, 3].map((i) => `A${q} ${q} 0 0 0 ${n(12 + r - i * w)} ${y}`).join('');
      return [
        line(g.seg(12, y - sag, 12, 21 - h) + g.span(4, 21 - h, 20, 21 - h), { n: 'pole', role: S }),
        shell(`M${n(12 - r)} ${y}A${n(r)} ${n(r)} 0 0 1 ${n(12 + r)} ${y}${hem}Z`, { n: 'canopy', role: P })
      ];
    },
    // 海风: the umbrella sways in the breeze
    fx: { t: 'wiggle', on: ['canopy', 'pole'], o: [12, 21], deg: 4, hz: 1.8 }
  },
  'ferris-wheel': {
    anchor: 'base',
    label: '摩天轮', key: 'square',
    plan: '主体：轮圈；辅助：两条交叉的辐条、从轮圈下伸出的两条支架和地面线',
    weights: { [P]: 0.4, [S]: 0.6 },
    draw(g, ctx) {
      const { h } = g, c = [12, 9.5], R = 6.5, r = R - h, k = r * Math.SQRT1_2;
      // the wheel is an open frame: the fill variant draws it as in the outline
      const leg = (x) => { const L = Math.hypot(x - c[0], 21 - h - c[1]), u = [(x - c[0]) / L, (21 - h - c[1]) / L]; return g.seg(c[0] + u[0] * r, c[1] + u[1] * r, x, 21 - h); };
      return [
        line(leg(6) + leg(18) + g.span(3, 21 - h, 21, 21 - h), { n: 'stand', role: S }),
        (ctx?.variant === 'fill' ? line : shell)(g.ring(...c, R), { n: 'wheel', role: P }),
        line(g.seg(c[0] - k, c[1] - k, c[0] + k, c[1] + k) + g.seg(c[0] + k, c[1] - k, c[0] - k, c[1] + k), { n: 'spokes', role: S, ...(ctx?.variant === 'fill' ? {} : { on: 'wheel' }) })
      ];
    },
    light: ['spokes'],
    // 转动: the spokes turn a quarter turn, landing on themselves
    fx: { t: 'rotate', on: ['spokes'], o: [12, 9.5], deg: 90 }
  },
  footprints: {
    label: '足迹', key: 'live', fit: 'y',
    plan: '主体：两个脚掌（左下、右上，各一个圆角矩形）；辅助：两个脚跟（小圆角矩形，与脚掌隔开）',
    weights: { [P]: 0.73, [S]: 0.27 },
    draw(g) {
      return [
        shell(g.box(3, 8, 6, 8, 3), { n: 'sl', role: P }),
        shell(g.box(4, 18, 4, 4, 2), { n: 'hl', role: S }),
        shell(g.box(15, 2, 6, 8, 3), { n: 'sr', role: P }),
        shell(g.box(16, 12, 4, 4, 2), { n: 'hr', role: S })
      ];
    },
    // 走: one foot steps, then the other
    fx: { t: 'keys', on: [['sl', 'hl'], ['sr', 'hr']], by: true, stagger: 160, y: [-1.2, 0.2], ms: 260 }
  }
});

// Variants made by rule (kit.mjs): badges and slashes on the pin, the map, the parking sign, the
// navigation arrow and the locator.
const base = (k) => ({ ...set[k], name: k });
// The map pin as icons.mjs draws it (map-pin). Badged, it is drawn smaller and up-left like
// Lucide's, in the live box, so the badge stands clear of it.
const mapPin = {
  name: 'map-pin', label: '位置', key: 'portrait', nudge: [0, 0.45],
  weights: { [P]: 0.8, [D]: 0.2 },
  draw(g) { return [shell(pin(g), { n: 'pin', role: P }), shell(g.ring(12, 10.5, 3.3), { n: 'hole', role: D, on: 'pin' })]; }
};
const PB = [10, 10];
const mapPinSmall = {
  ...mapPin, key: 'live', fit: 'y',
  draw(g) { return [shell(pin(g, { cx: PB[0], cy: PB[1], R: 7.5, tip: 21 }), { n: 'pin', role: P }), shell(g.ring(PB[0], PB[1], 3), { n: 'hole', role: D, on: 'pin' })]; }
};
// Fill: the hole shrinks to keep a stroke of ink between it and the badge's notch.
const pinHole = (L, g, { x, y, R }) => L.map((l) => (l.n === 'hole' ? { ...l, d: g.ring(PB[0], PB[1], Math.min(3, Math.hypot(x - PB[0], y - PB[1]) - R - g.s)) } : l));
const PIN_KEY = { keyline: '与 Lucide 的做法相同，定位针缩小并移到左上给角标让位，不贴横向参考线' };
const pinBadge = (mark, label) => ({ ...notched(badge(mapPinSmall, mark, { label }), pinHole), allow: PIN_KEY });
const spinIn = { t: 'rotate', on: ['badge'], deg: 90, oBadge: true }, drawIn = { t: 'draw', on: ['badge'] };
const SLASH_OK = { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' };

Object.assign(set, {
  'map-pin-plus': { ...pinBadge('plus', '添加位置'), swap: 'map-pin', fx: spinIn },
  'map-pin-minus': { ...pinBadge('minus', '移除位置'), swap: 'map-pin', fx: drawIn },
  'map-pin-check': { ...pinBadge('check', '已到达'), fx: drawIn },
  'map-pin-x': { ...pinBadge('x', '删除位置'), fx: spinIn },
  'map-pin-off': { ...off(slash(mapPin, { label: '位置关闭' }), 'map-pin', { t: 'keys', on: ['pin', 'hole'], o: [12, 22], s: [0.86], ms: 240 }), allow: SLASH_OK },
  'map-plus': { ...notched(badge(base('map'), 'plus', { label: '添加地图' })), swap: 'map', fx: spinIn },
  'map-minus': { ...notched(badge(base('map'), 'minus', { label: '移除地图' })), swap: 'map', fx: drawIn },
  'parking-off': { ...off(slash(base('parking'), { label: '停车场关闭' }), 'parking', { t: 'keys', on: ['p'], o: [12, 12], s: [0.85], ms: 240 }), allow: SLASH_OK },
  'navigation-off': { ...off(slash(base('navigation'), { label: '导航关闭' }), 'navigation', { t: 'keys', on: ['arrow'], y: [1], ms: 240 }), allow: SLASH_OK },
  'locate-off': { ...off(slash(base('locate'), { label: '定位关闭' }), 'locate', { t: 'keys', on: ['ticks'], o: [12, 12], s: [0.84], ms: 240 }), allow: SLASH_OK }
});

export default set;
