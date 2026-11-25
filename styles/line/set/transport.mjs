// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// transport: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: car car-front bus truck taxi train subway tram bicycle motorcycle scooter plane plane-takeoff plane-landing ship rocket fuel ev-charger
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// --- Shared parts ----------------------------------------------------------------------------
// Road vehicles seen from the side (car, taxi, bus, truck): one wheel, ring R 3 centred on the
// body's bottom line, at x 7 and 17. In the outline the body's line stops at the wheel's centre
// line, so the wheel sits in it and the two join (cutD); in the fill variant a clear space
// (g.clear) is kept round the wheel (cutD), or the two would merge into one shape.
const WR = 3, WY = 17, WX = [7, 17];
// The fill variant (GUIDE.md §4.1): the body is one solid piece with its windows as holes, and it
// arches over each wheel, a clear space away. The wheels stand too near the ends for the body to
// come down beside them at full size, so in fill the wheels are a little smaller (FR; the knock-out
// ring keeps the ring itself, the closed form solid-tint fills, as it is) and the body comes down
// only as far as leaves a stroke of ink: at each end beside the arch (bottomFill end), and between
// the wheels a little more (sill), both heights the outer edge of the bottom.
const FR = 2.5;
const wheels = (g) => WX.flatMap((x, i) => [
  shell(g.ring(x, WY, WR), { n: `w${i}`, role: S, cutD: g.circ(x, WY, WR - g.h), part: `w${i}`, only: 'outline' }),
  shell(g.ring(x, WY, WR), { n: `w${i}`, role: S, cutD: g.circ(x, WY, FR + g.clear), only: 'fill' }),
  line(g.circ(x, WY, FR + g.h), { n: `wr${i}`, role: S, on: `w${i}`, only: 'fill' })
]);
function bottomFill(g) {
  const A = FR + g.clear, at = (w) => WY - Math.sqrt(Math.max(0, A * A - w * w));
  return { end: at(WX[0] - 2 - g.s), sill: at((WX[1] - WX[0]) / 2 - 0.7 * g.s) };
}
// The arch over wheel i, as polygon points [x, y, 0] on the body's centre line, from its right
// foot to its left: the outer feet at the ends' height, the inner ones at the sill's.
function archFill(g, i) {
  const { end, sill } = bottomFill(g), A = FR + g.clear + g.h;
  const ang = (yb) => (Math.asin(Math.min(1, (WY - yb + g.h) / A)) * 180) / Math.PI;
  const a0 = -ang(i ? end : sill), a1 = ang(i ? sill : end) - 180;
  return Array.from({ length: 13 }, (_, k) => {
    const a = ((a0 + ((a1 - a0) * k) / 12) * Math.PI) / 180;
    return [WX[i] + A * Math.cos(a), WY + A * Math.sin(a), 0];
  });
}
// A body's polygon in fill, from points [x, y, radius] on its centre line (arches included).
const bodyFill = (g, P) => g.polygon(P.map((p) => [p[0], p[1]]), P.map((p) => p[2]));
// The x of the line p-q at height y, moved off it square to the line by off (+ toward +x): the
// inner edge of a slanted side, where a window hole keeps a stroke of rim.
const edgeX = ([x1, y1], [x2, y2], y, off) => x1 + ((y - y1) * (x2 - x1)) / (y2 - y1) + (off * Math.hypot(x2 - x1, y2 - y1)) / Math.abs(y2 - y1);
// Windows: a belt line across the body at y, and pillars up from it (car, bus, truck, trains).
// Headlights: solid dots, smaller at the heavier weights so they keep clear of the edges.
const lamp = (g, x, y) => solid(g.dot(x, y, 0.875 - (g.s - 2) * 0.5), {});
// Two-wheelers (bicycle, motorcycle, scooter): one wheel, ring R 4 at x 6 and 18. Their weight
// is in the wheels, so they sit 1 high (nudge) and stand on 19.
const BR = 4, BY = 15, BX = [6, 18];
const bikeWheels = (g) => BX.map((x, i) => shell(g.ring(x, BY, BR), { n: `w${i}`, role: S }));
// The car (and taxi): a cabin on a body; a belt line and a pillar mark out two windows.
function carBody(g, ctx) {
  const { h, s } = g, top = 4 + h, belt = 10, yb = WY;
  if (ctx?.variant !== 'fill') return [
    shell(g.polygon([[2 + h, yb], [2 + h, belt], [6, belt], [8.5, top], [14.5, top], [18, belt], [22 - h, belt], [22 - h, yb]], [1.5, 2, 0, 1.5, 1.5, 0, 2, 1.5]), { n: 'body', role: P }),
    line(g.seg(6, belt, 18, belt) + g.seg(12, top, 12, belt), { n: 'window', role: D, on: 'body' }),
    ...wheels(g)
  ];
  // Fill: the windows are holes where the outline's panes are (a stroke in from the cabin's edge,
  // over the belt line, either side of the pillar).
  const { end } = bottomFill(g), yT = top + h, yB = belt - h, L = [6, belt], R = [18, belt], rc = Math.max(0.5, 1.5 - h);
  const body = bodyFill(g, [[2 + h, end - h, 0.5], [2 + h, belt, 2], [6, belt, 0], [8.5, top, 1.5], [14.5, top, 1.5], [18, belt, 0], [22 - h, belt, 2], [22 - h, end - h, 0.5], ...archFill(g, 1), ...archFill(g, 0)]);
  const panes = g.polygon([[edgeX(L, [8.5, top], yT, h), yT], [12 - h, yT], [12 - h, yB], [edgeX(L, [8.5, top], yB, h), yB]], [rc, 0.5, 0.5, 0.5])
    + g.polygon([[12 + h, yT], [edgeX(R, [14.5, top], yT, -h), yT], [edgeX(R, [14.5, top], yB, -h), yB], [12 + h, yB]], [0.5, rc, 0.5, 0.5]);
  return [
    shell(body, { n: 'body', role: P }),
    solid(panes, { n: 'window', role: D, on: 'body' }),
    ...wheels(g)
  ];
}

// Trains seen from the front (train, subway, tram): a body 16 wide, the same belt line and
// headlights, and two short legs onto the rails.
const legs = (g, yb) => g.seg(8, yb, 6.2, 21.6 - g.h * 0.4) + g.seg(16, yb, 17.8, 21.6 - g.h * 0.4);
// In the fill variant (GUIDE.md §4.1) a front's belt line runs out through both sides, splitting the
// windscreen off, and the headlights move down where they would come within a stroke of it.
const lampY = (g, ctx, y, belt) => (ctx?.variant === 'fill' ? Math.max(y, belt + 1.5 * g.s + g.dr * (0.875 - (g.s - 2) * 0.5)) : y);
const beltLine = (g, ctx, x0, x1, y) => (ctx?.variant === 'fill' ? g.seg(x0 - g.s, y, x1 + g.s, y) : g.seg(x0 + g.h, y, x1 - g.h, y));

// The plane, seen from above, pointing along +x, by centre line. It is turned and scaled to its
// place; every plane icon uses this one shape.
const PLANE = [[10.5, 0, 1.8], [7.2, 1.7, 2], [2.2, 1.7, 0], [-3.4, 9.2, 1], [-5.8, 9.2, 1], [-2.8, 1.7, 0], [-6.6, 1.7, 0], [-9.1, 4.8, 0.8], [-10.7, 4.8, 0.8], [-10.1, 1.5, 0.6]];
function plane(g, cx, cy, deg, k) {
  const half = PLANE.slice(1, -1), all = [PLANE[0], ...half, PLANE[PLANE.length - 1], ...[PLANE[PLANE.length - 1], ...half.slice().reverse()].map(([u, v, c]) => [u, -v, c])];
  const a = (deg * Math.PI) / 180, co = Math.cos(a), si = Math.sin(a);
  // the fuselage keeps its width at every scale, so its inside stays open
  const pts = all.map(([u, v0]) => { const v = Math.abs(v0) < 2 ? v0 : v0 * k, w = u * k; return [cx + w * co - v * si, cy + w * si + v * co]; });
  return g.polygon(pts, all.map((p) => p[2]));
}

export default {
  car: {
    label: '汽车', key: 'landscape',
    plan: '主体：车身（车厢在上，车身下沿穿过两个车轮的圆心）；辅助：两个车轮（圆环，与客车、货车、出租车同一尺寸）；细节：腰线和中柱，分出两扇车窗。腰线横贯车厢，细节占两成多',
    weights: { [P]: 0.46, [S]: 0.32, [D]: 0.22 },
    draw(g, ctx) { return carBody(g, ctx); },
    // 行驶: the car pulls forward and rolls back to rest
    fx: { t: 'keys', on: 'all', x: [1.2, -0.3], ms: 300 },
    swap: 'taxi'
  },
  taxi: {
    label: '出租车', key: 'landscape',
    plan: '同汽车，车顶加一块顶灯（实心，太小画不出线框）',
    weights: { [P]: 0.43, [S]: 0.36, [D]: 0.21 },
    draw(g, ctx) {
      const [body, ...rest] = carBody(g, ctx);
      return [body, solid(g.area(10, 2, 4, 3, [1, 1, 0, 0]), { n: 'sign', role: S }), ...rest];
    },
    // 叫车: the roof sign lights up, and the car pulls in
    fx: [{ t: 'keys', on: 'all', x: [1.2, -0.3], ms: 300 }, { t: 'keys', on: ['sign'], o: [12, 5], s: [1.2, 1], ms: 260 }],
    swap: 'car',
    allow: { keyline: '顶灯高出横向参考线 2' }
  },
  'car-front': {
    label: '汽车正面', key: 'square',
    plan: '主体：车身正面（上窄下宽）；辅助：两个车轮（实心短块）；细节：腰线（分出挡风玻璃）和两盏车灯（实心圆点）。腰线横贯车身，细节占近三成',
    weights: { [P]: 0.58, [S]: 0.14, [D]: 0.28 },
    draw(g, ctx) {
      const { h } = g, top = 3 + h, belt = 9, yb = 18 - h, ly = lampY(g, ctx, 13, belt), k = (belt - g.s - top) / (belt - top);
      return [
        solid(g.area(5, 17, 4, 4, [0, 0, 1.5, 1.5]), { n: 'wl', role: S }),
        solid(g.area(15, 17, 4, 4, [0, 0, 1.5, 1.5]), { n: 'wr', role: S }),
        shell(ctx?.variant === 'fill'
          // the windscreen split off as its own piece: a cut across the slanted sides would leave sharp tips
          ? g.polygon([[8, top], [16, top], [16 + (5 - h) * k, belt - g.s], [8 - (5 - h) * k, belt - g.s]], [1.5, 1.5, 0.5, 0.5]) + g.polygon([[3 + h, belt + g.s], [21 - h, belt + g.s], [21 - h, yb], [3 + h, yb]], [0.5, 0.5, 2, 2])
          : g.polygon([[8, top], [16, top], [21 - h, belt], [21 - h, yb], [3 + h, yb], [3 + h, belt]], [1.5, 1.5, 1.2, 2, 2, 1.2]), { n: 'body', role: P }),
        line(beltLine(g, ctx, 3, 21, belt), { n: 'belt', role: D, on: 'body' }),
        { ...lamp(g, 8, ly), n: 'l0', role: D, on: 'body' },
        { ...lamp(g, 16, ly), n: 'l1', role: D, on: 'body' }
      ];
    },
    // 车灯闪烁: the headlights flash twice as the car comes on
    fx: [{ t: 'keys', on: 'all', o: [12, 21], s: [1.05, 0.99], ms: 300 }, { t: 'variable', on: ['l0', 'l1'], mode: 'iterative', step: 180 }]
  },
  bus: {
    label: '公交车', key: 'landscape',
    plan: '主体：车身（长方）；辅助：两个车轮（同汽车）；细节：腰线和两根窗柱，分出三扇车窗。腰线横贯车身，细节占三成',
    weights: { [P]: 0.42, [S]: 0.27, [D]: 0.31 },
    draw(g, ctx) {
      const { h, s } = g, belt = 11;
      if (ctx?.variant === 'fill') {
        // one body; three window holes where the outline's panes are (see wheels)
        const { end } = bottomFill(g), yT = 4 + s, yB = belt - h, rc = Math.max(0.5, 3.5 - s);
        const body = bodyFill(g, [[2 + h, end - h, 0.5], [2 + h, 4 + h, 3.5 - h], [22 - h, 4 + h, 3.5 - h], [22 - h, end - h, 0.5], ...archFill(g, 1), ...archFill(g, 0)]);
        const pane = (x0, x1, c) => g.polygon([[x0, yT], [x1, yT], [x1, yB], [x0, yB]], c);
        return [
          shell(body, { n: 'body', role: P }),
          solid(pane(2 + s, 9 - h, [rc, 0.5, 0.5, 0.5]) + pane(9 + h, 15 - h, 0.5) + pane(15 + h, 22 - s, [0.5, rc, 0.5, 0.5]), { n: 'window', role: D, on: 'body' }),
          ...wheels(g)
        ];
      }
      return [
        shell(g.box(2, 4, 20, WY + h - 4, [3.5, 3.5, 2, 2]), { n: 'body', role: P }),
        line(g.seg(2 + h, belt, 22 - h, belt) + g.seg(9, 4 + h, 9, belt) + g.seg(15, 4 + h, 15, belt), { n: 'window', role: D, on: 'body' }),
        ...wheels(g)
      ];
    },
    // 公交到站: the bus pulls in and settles
    fx: { t: 'keys', on: 'all', x: [-1.2, 0.3], ms: 320 }
  },
  truck: {
    label: '货车', key: 'landscape',
    plan: '主体：货箱和驾驶室（共用一条边）；辅助：两个车轮（同汽车）；细节：驾驶室的腰线，分出车窗',
    weights: { [P]: 0.58, [S]: 0.31, [D]: 0.11 },
    draw(g, ctx) {
      const { h, s } = g, top = 7, belt = 11, xc = 13;
      if (ctx?.variant === 'fill') {
        // Box and cab, one piece over the arches (see wheels); the cab's window a hole where the
        // outline's pane is, reaching down toward the arch while that leaves a stroke under it.
        const { end, sill } = bottomFill(g), F = [16.5, top], yT = top + h, yB = Math.min(belt, WY - FR - g.clear - s);
        const box = bodyFill(g, [[2 + h, end - h, 0.5], [2 + h, 4 + h, 3 - h], [xc, 4 + h, 0], [xc, sill - h, 0], ...archFill(g, 0)]);
        const cab = bodyFill(g, [[xc, top, 0], [16.5, top, 1.5], [22 - h, top + 5.5 - h, 1.2], [22 - h, end - h, 0.5], ...archFill(g, 1), [xc, sill - h, 0]]);
        const pane = g.polygon([[xc + h, yT], [edgeX(F, [22 - h, top + 5.5 - h], yT, -h), yT], [edgeX(F, [22 - h, top + 5.5 - h], yB, -h), yB], [xc + h, yB]], [0.5, Math.max(0.5, 1.5 - h), 0.5, 0.5]);
        return [
          shell(box, { n: 'box', role: P, part: 'truck' }),
          shell(cab, { n: 'cab', role: P, part: 'truck' }),
          solid(pane, { n: 'window', role: D, on: 'cab' }),
          ...wheels(g)
        ];
      }
      return [
        shell(g.box(2, 4, xc + h - 2, WY + h - 4, [3, 0, 0, 1.5]), { n: 'box', role: P, part: 'truck' }),
        shell(g.polygon([[xc, top], [16.5, top], [22 - h, top + 5.5 - h], [22 - h, WY], [xc, WY]], [0, 1.5, 1.2, 1.5, 0]), { n: 'cab', role: P, part: 'truck' }),
        line(g.seg(xc, belt, 16.5 + (belt - top) / (5.5 - h) * (5.5 - h), belt), { n: 'window', role: D, on: 'cab' }),
        ...wheels(g)
      ];
    },
    // 运货: the truck pulls forward under its load
    fx: { t: 'keys', on: 'all', x: [1, -0.25], ms: 340 }
  },
  train: {
    label: '火车', key: 'portrait',
    plan: '主体：车头（顶部圆角大）；辅助：两条斜向的车轮脚（落到铁轨上）；细节：腰线（分出前窗）和两盏车灯',
    weights: { [P]: 0.63, [S]: 0.1, [D]: 0.27 },
    draw(g, ctx) {
      const { h } = g, yb = 19 - h, belt = 10, ly = lampY(g, ctx, 14, belt);
      return [
        line(legs(g, yb), { n: 'legs', role: S }),
        shell(g.box(4, 2, 16, 17, [6, 6, 3, 3]), { n: 'body', role: P }),
        line(beltLine(g, ctx, 4, 20, belt), { n: 'belt', role: D, on: 'body' }),
        { ...lamp(g, 9, ly), n: 'l0', role: D, on: 'body' },
        { ...lamp(g, 15, ly), n: 'l1', role: D, on: 'body' }
      ];
    },
    // 列车驶来: the train rocks on the rails as it comes in
    fx: { t: 'keys', on: ['body', 'belt', 'l0', 'l1'], y: [-0.9, 0.3, -0.4], ms: 420 }
  },
  subway: {
    label: '地铁', key: 'portrait',
    plan: '主体：方正的车头；辅助：两条车轮脚；细节：腰线和中柱（分出两扇前窗）、两盏车灯',
    weights: { [P]: 0.57, [S]: 0.09, [D]: 0.34 },
    draw(g, ctx) {
      const { h, s } = g, yb = 19 - h, belt = 10, ly = lampY(g, ctx, 14, belt);
      // in the fill variant the pillar stops a stroke under the roof, so the two windows hold together
      const pillar = ctx?.variant === 'fill' ? g.seg(12, 2 + 1.5 * s, 12, belt) : g.seg(12, 2 + h, 12, belt);
      return [
        line(legs(g, yb), { n: 'legs', role: S }),
        shell(g.box(4, 2, 16, 17, 3.5), { n: 'body', role: P }),
        line(beltLine(g, ctx, 4, 20, belt) + pillar, { n: 'window', role: D, on: 'body' }),
        { ...lamp(g, 9, ly), n: 'l0', role: D, on: 'body' },
        { ...lamp(g, 15, ly), n: 'l1', role: D, on: 'body' }
      ];
    },
    // 进站: the lights come on one after the other as it pulls in
    fx: [{ t: 'keys', on: ['body', 'window', 'l0', 'l1'], y: [-0.7, 0.2], ms: 300 }, { t: 'variable', on: ['l0', 'l1'], mode: 'cumulative', step: 200 }]
  },
  tram: {
    label: '有轨电车', key: 'portrait',
    plan: '主体：车身；辅助：车顶的受电弓（T 形）和两条车轮脚；细节：腰线和两盏车灯',
    weights: { [P]: 0.54, [S]: 0.22, [D]: 0.24 },
    draw(g, ctx) {
      const { h } = g, yb = 19 - h, top = 5, belt = 10, ly = lampY(g, ctx, 14, belt);
      return [
        line(legs(g, yb), { n: 'legs', role: S }),
        line(g.span(8, 3, 16, 3) + g.seg(12, 3, 12, top + h), { n: 'pole', role: S }),
        shell(g.box(4, top, 16, 19 - top, 3.5), { n: 'body', role: P }),
        line(beltLine(g, ctx, 4, 20, belt), { n: 'belt', role: D, on: 'body' }),
        { ...lamp(g, 9, ly), n: 'l0', role: D, on: 'body' },
        { ...lamp(g, 15, ly), n: 'l1', role: D, on: 'body' }
      ];
    },
    // 电车: the car sways on its rails under the wire
    fx: { t: 'wiggle', on: ['body', 'belt', 'l0', 'l1', 'pole'], o: [12, 19], deg: 3.5, hz: 2 }
  },
  bicycle: {
    nudge: [0, -1],
    label: '自行车', key: 'landscape',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：车架（后三角、上管、下管、前叉）、车座和车把；辅助：两个车轮（与摩托车、滑板车同一尺寸）。车架线条多，占六成',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const sx = 9.5, hx = 16, ty = 8, cx = 12, top = 4;
      return [
        ...bikeWheels(g),
        line(g.pl([[BX[0], BY], [sx, ty], [hx, ty], [BX[1], BY]]) + g.pl([[BX[0], BY], [cx, BY], [sx, ty]]) + g.seg(cx, BY, hx, ty) + g.seg(sx, ty, 8.8, top) + g.seg(7.3, top, 10.3, top) + g.seg(hx, ty, 15.3, top) + g.seg(15.3, top, 17.5, top), { n: 'frame', role: P })
      ];
    },
    // 骑行: the bike rolls forward and back
    fx: { t: 'keys', on: 'all', x: [1.2, -0.3], ms: 320 }
  },
  motorcycle: {
    nudge: [0, -1],
    label: '摩托车', key: 'landscape',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：油箱（一个闭合形，在两个车轮之间）和坐垫（一条线，在后轮上方）；辅助：两个车轮（同自行车）、前叉和车把、后摇臂',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g) {
      return [
        ...bikeWheels(g),
        line(g.seg(BX[0], BY, 12, 10.6) + g.seg(BX[1], BY, 15.3, 4) + g.span(12.5, 4, 16.5, 4), { n: 'frame', role: S, part: 'bike' }),
        line(g.seg(3, 8, 10.3, 8), { n: 'seat', role: P, part: 'bike' }),
        shell(g.polygon([[9.5, 6], [15.5, 6], [12.8, 11], [11.5, 11]], [1.2, 1.2, 1, 1]), { n: 'tank', role: P, part: 'bike' })
      ];
    },
    // 发动: the bike revs, rocking back on its rear wheel
    fx: { t: 'keys', on: 'all', o: [6, 19], r: [-5, 1.5], ms: 340 }
  },
  scooter: {
    nudge: [0, -1],
    label: '滑板车', key: 'landscape',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：踏板、立杆和车把；辅助：两个车轮（同自行车）',
    weights: { [P]: 0.44, [S]: 0.56 },
    draw(g) {
      const { h } = g;
      return [
        ...bikeWheels(g),
        line(g.seg(BX[0] + BR - h, BY, BX[1] - BR + h, BY) + g.seg(BX[1], BY, 16, 4 + h) + g.span(13, 4, 19, 4), { n: 'deck', role: P })
      ];
    },
    // 滑行: the scooter glides forward and back
    fx: { t: 'keys', on: 'all', x: [1.4, -0.3], ms: 360 }
  },
  plane: {
    label: '飞机', key: 'live',
    plan: '主体：俯视的飞机（机身、后掠的机翼和尾翼，一个闭合形），斜放指向右上',
    weights: { [P]: 1 },
    draw(g) { return [shell(plane(g, 14.1, 9.9, -45, 1.05), { n: 'plane', role: P })]; },
    // 飞行: the plane flies on toward the top right and glides back
    fx: { t: 'keys', on: 'all', x: [1.2, -0.3], y: [-1.2, 0.3], ms: 340 }
  },
  'plane-takeoff': {
    anchor: 'base',
    label: '起飞', key: 'live',
    plan: '主体：飞机（同“飞机”，缩小，机头抬起向右上）；辅助：地面线。地面线横贯画布，占两成多',
    weights: { [P]: 0.76, [S]: 0.24 },
    draw(g) {
      return [line(g.span(2, 21, 22, 21), { n: 'ground', role: S }), shell(plane(g, 13.2, 8.85, -22, 0.81), { n: 'plane', role: P })];
    },
    // 起飞: the plane climbs away from the ground and comes back
    fx: { t: 'keys', on: ['plane'], o: [12, 10], x: [1.3, -0.2], y: [-1.6, 0.3], r: [-6, 1], ms: 380 }
  },
  'plane-landing': {
    anchor: 'base',
    label: '降落', key: 'live',
    plan: '主体：飞机（同“飞机”，缩小，机头朝右下）；辅助：地面线。地面线横贯画布，占两成多',
    weights: { [P]: 0.76, [S]: 0.24 },
    draw(g) {
      return [line(g.span(2, 21, 22, 21), { n: 'ground', role: S }), shell(plane(g, 13.2, 11.4, 22, 0.81), { n: 'plane', role: P })];
    },
    // 降落: the plane comes down toward the ground and settles level
    fx: { t: 'keys', on: ['plane'], o: [12, 10], x: [1, 0], y: [1.4, -0.2], r: [-8, 1], ms: 380 }
  },
  ship: {
    anchor: 'base',
    label: '轮船', key: 'landscape',
    plan: '主体：船身（上宽下窄，船头一侧斜得多）；辅助：偏向船尾的船舱（下沿就是甲板线）和烟囱（实心短块）',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) {
      const { h } = g, deck = 12, yb = 20 - h;
      return [
        solid(g.area(7, 4, 3, 4, [0.75, 0.75, 0, 0]), { n: 'funnel', role: S }),
        shell(g.box(5, 7, 10, deck + h - 7, [2.5, 2.5, 0, 0]), { n: 'cabin', role: S }),
        shell(g.polygon([[1.6 + h, deck], [22.4 - h, deck], [17.5, yb], [4.2, yb]], [1, 1, 1.5, 1.5]), { n: 'hull', role: P })
      ];
    },
    // 航行: the ship rocks on the water
    fx: { t: 'wiggle', on: 'all', o: [12, 20], deg: 6, hz: 1.6 }
  },
  rocket: {
    label: '火箭', key: 'live',
    plan: '主体：箭身（圆头，斜放指向右上）；辅助：两片尾翼（伸出箭身尾部）；细节：尾焰（一条短线）',
    weights: { [P]: 0.6, [S]: 0.34, [D]: 0.06 },
    draw(g) {
      const { s } = g, a = -Math.PI / 4, co = Math.cos(a), si = Math.sin(a), c = [14.53, 9.47], K = 1.2;
      const T = ([u, v]) => [c[0] + K * (u * co - v * si), c[1] + K * (u * si + v * co)];
      const w = 3.2, base = -5.5, fin = (k) => g.pl([[-1, k * w], [-7, k * (w + 3.4)], [-7, k * w], [base, k * w]].map(T));
      return [
        line(g.seg(...T([-(7.5 + s), 0]), ...T([-11.5, 0])), { n: 'flame', role: D }),
        line(fin(1) + fin(-1), { n: 'fins', role: S }),
        shell(g.polygon([[9.5, 0], [3, w], [base, w], [base, -w], [3, -w]].map(T), [2.4, 3, 1, 1, 3]), { n: 'body', role: P })
      ];
    },
    light: ['flame'],
    // 发射: the rocket lifts off toward the top right, its flame flaring
    fx: [{ t: 'keys', on: 'all', x: [1.2, -0.3], y: [-1.2, 0.3], ms: 340 }, { t: 'keys', on: ['flame'], o: [5, 19], s: [1.4, 0.9], ms: 300 }]
  },
  fuel: {
    allow: { optical: '机身是主体，油枪挂在右侧，按机身定位' },
    label: '加油机', key: 'square',
    ends: 'out',
    plan: '主体：油机机身；辅助：油管和油枪；细节：屏幕下沿（一条横线）',
    weights: { [P]: 0.62, [S]: 0.23, [D]: 0.15 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(3, 3, 12, 18, 3), { n: 'body', role: P }),
        line(g.seg(3 + h, 9, 15 - h, 9), { n: 'screen', role: D, on: 'body' }),
        line(`M${15 - h} 15H18A2 2 0 0 0 20 13V8L18 6`, { n: 'hose', role: S })
      ];
    },
    // 加油: the nozzle is lifted off and hung back
    fx: { t: 'keys', on: ['hose'], o: [14, 15], r: [-9, 2], ms: 320 }
  },
  'ev-charger': {
    allow: { optical: '机身是主体，充电线挂在右侧，按机身定位' },
    label: '充电桩', key: 'square',
    plan: '主体：充电桩机身（同加油机）；辅助：线缆和插头（实心）；细节：闪电',
    weights: { [P]: 0.6, [S]: 0.24, [D]: 0.16 },
    draw(g, ctx) {
      const { h, s } = g, k = Math.min(1, 1 - (s - 2) * 0.4), B = ([x, y]) => [9 + (x - 9) * k, 12 + (y - 12) * k];
      // In the fill variant the bolt's middle step slopes down a little: knocked out, a sharper turn
      // leaves a thin point of ink inside it (GUIDE.md §4.1).
      const m = ctx?.variant === 'fill' ? 0.5 : 0, bolt = [[9.75, 7.5], [7.75, 12 - m], [10.25, 12 + m], [8.25, 16.5]].map(B);
      return [
        shell(g.box(3, 3, 12, 18, 3), { n: 'body', role: P }),
        line(g.pl(bolt), { n: 'bolt', role: D, on: 'body' }),
        line(`M${15 - h} 15H17A2 2 0 0 0 19 13V9.5`, { n: 'cable', role: S }),
        solid(g.area(17, 5, 4, 5, [1, 1, 0.75, 0.75]), { n: 'plug', role: S })
      ];
    },
    // 充电: the bolt is drawn in as the charge flows
    fx: { t: 'draw', on: ['bolt'] }
  }
};
