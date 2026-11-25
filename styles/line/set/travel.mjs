// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// travel: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: map map-pinned navigation compass route signpost luggage ticket boarding-pass passport hotel tent anchor lighthouse traffic-light parking
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

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

export default {
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
