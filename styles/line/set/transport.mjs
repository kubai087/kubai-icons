// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// transport: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: car car-front bus truck taxi train subway tram bicycle motorcycle scooter plane plane-takeoff plane-landing ship rocket fuel ev-charger
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { slash, badge } from '../kit.mjs';
import { off, notched } from '../variants.mjs';

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

const set = {
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
    plan: '主体：车架（后上叉、上管、立管、下管、前叉）、车座和车把；辅助：两个车轮（与摩托车、滑板车同一尺寸）。不画后下叉：它横在后轮里，24 px 下让后轮挤成一团。车架线条多，占六成',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const sx = 9.5, hx = 16, ty = 8, cx = 12, top = 4;
      return [
        ...bikeWheels(g),
        line(g.pl([[BX[0], BY], [sx, ty], [hx, ty], [BX[1], BY]]) + g.pl([[sx, ty], [cx, BY], [hx, ty]]) + g.seg(sx, ty, 8.8, top) + g.seg(7.3, top, 10.3, top) + g.seg(hx, ty, 15.3, top) + g.seg(15.3, top, 17.5, top), { n: 'frame', role: P })
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

// --- Fronts, dashboard and road ---------------------------------------------------------------

// A vehicle seen from the front on two solid wheel blocks (bus-front, truck-front), as the car's
// front: the blocks overlap the body's bottom edge.
const blocks = (g, y) => [
  solid(g.area(5, y, 4, 22 - y, [0, 0, 1.5, 1.5]), { n: 'wl', role: S }),
  solid(g.area(15, y, 4, 22 - y, [0, 0, 1.5, 1.5]), { n: 'wr', role: S })
];
// The van's body (van, camper-van): a box with the front cut back to the windscreen, by centre
// line; in the fill variant one piece arching over the wheels, as the car's (bottomFill).
function vanBody(g, ctx, t) {
  const { h, s } = g, x0 = 2 + h, xr = 22 - h, belt = 10;
  if (ctx?.variant !== 'fill') return {
    body: g.polygon([[x0, WY], [x0, t], [15, t], [xr, t + 6], [xr, WY]], [1.5, 3 - h, 1.5, 1.2, 1.5]),
    window: g.seg(15, t, 15, belt) + g.seg(15, belt, xr, belt)
  };
  const { end } = bottomFill(g);
  const body = bodyFill(g, [[x0, end - h, 0.5], [x0, t, 3 - h], [15, t, 1.5], [xr, t + 6, 1.2], [xr, end - h, 0.5], ...archFill(g, 1), ...archFill(g, 0)]);
  // the front window: a hole right of the pillar, under the slant's inner edge, over the belt
  const run = (xr - 15) / 6, off = (h * Math.hypot(xr - 15, 6)) / 6, yAt = (x) => t + (x - 15 + off) / run, yB = belt - h;
  const pane = yAt(22 - s) < yB
    ? g.polygon([[15 + h, yAt(15 + h)], [22 - s, yAt(22 - s)], [22 - s, yB], [15 + h, yB]], [0.5, Math.max(0.5, 1.2 - h), 0.5, 0.5])
    : g.polygon([[15 + h, yAt(15 + h)], [15 + (yB - t) * run - off, yB], [15 + h, yB]], 0.5);
  return { body, pane };
}

Object.assign(set, {
  'bus-front': {
    label: '公交车正面', key: 'live',
    plan: '主体：车身正面（方正，顶部圆角）；辅助：两个车轮（实心短块，同汽车正面）和两侧后视镜；细节：腰线（分出挡风玻璃）和两盏车灯',
    weights: { [P]: 0.56, [S]: 0.2, [D]: 0.24 },
    draw(g, ctx) {
      const { h } = g, belt = 10, ly = lampY(g, ctx, 14, belt);
      return [
        ...blocks(g, 18),
        line(g.seg(2 + h, 9, 4, 7) + g.seg(22 - h, 9, 20, 7), { n: 'mirrors', role: S }),
        shell(g.box(4, 2, 16, 17, 3.5), { n: 'body', role: P }),
        line(beltLine(g, ctx, 4, 20, belt), { n: 'belt', role: D, on: 'body' }),
        { ...lamp(g, 9, ly), n: 'l0', role: D, on: 'body' },
        { ...lamp(g, 15, ly), n: 'l1', role: D, on: 'body' }
      ];
    },
    // 公交进站: the bus dips as it stops, lights flashing
    fx: [{ t: 'keys', on: 'all', o: [12, 22], sy: [0.95, 1.01], ms: 300 }, { t: 'variable', on: ['l0', 'l1'], mode: 'iterative', step: 180 }]
  },
  'truck-front': {
    label: '货车正面', key: 'live', fit: 'y',
    plan: '主体：车身正面（上面是驾驶室，下面是更宽的保险杠，一个闭合形）；辅助：两个车轮（实心短块）；细节：腰线（分出挡风玻璃）',
    weights: { [P]: 0.76, [S]: 0.14, [D]: 0.1 },
    draw(g, ctx) {
      const { h, s } = g, belt = 9, step = 13, yb = 19 - h;
      const cab = [[5 + h, 2 + h], [19 - h, 2 + h], [19 - h, step], [21 - h, step], [21 - h, yb], [3 + h, yb], [3 + h, step], [5 + h, step]];
      return [
        ...blocks(g, 18),
        shell(g.polygon(cab, [2.5 - h, 2.5 - h, 0, 1, 1.5, 1.5, 1, 0]), { n: 'body', role: P }),
        line(ctx?.variant === 'fill' ? g.seg(5 - s, belt, 19 + s, belt) : g.seg(5 + h, belt, 19 - h, belt), { n: 'belt', role: D, on: 'body' })
      ];
    },
    // 货车: the cab rocks forward as it brakes
    fx: { t: 'keys', on: 'all', o: [12, 22], r: [-3, 1], y: [0.4, 0], ms: 320 }
  },
  'car-taxi-front': {
    label: '出租车正面', key: 'square',
    plan: '同汽车正面，车顶加一块顶灯（实心，太小画不出线框）',
    weights: { [P]: 0.54, [S]: 0.2, [D]: 0.26 },
    draw(g, ctx) {
      const L = set['car-front'].draw(g, ctx);
      return [solid(g.area(10, 1, 4, 3, [1, 1, 0, 0]), { n: 'sign', role: S }), ...L];
    },
    allow: { keyline: '顶灯高出方形参考线 2，同出租车' },
    // 叫车: the roof sign lights up as the car comes on
    fx: [{ t: 'keys', on: ['sign'], o: [12, 4], s: [1.25, 1], ms: 260 }, { t: 'variable', on: ['l0', 'l1'], mode: 'iterative', step: 180 }]
  },
  'police-car': {
    label: '警车', key: 'landscape',
    plan: '同汽车，车顶加一盏警灯（实心半圆）；悬停时警灯两侧出现闪光',
    weights: { [P]: 0.45, [S]: 0.34, [D]: 0.21 },
    draw(g, ctx) {
      const [body, ...rest] = carBody(g, ctx);
      return [
        body,
        solid('M9.5 5A2.5 2.5 0 0 1 14.5 5Z', { n: 'siren', role: S }),
        line(g.span(6, 2, 8, 3) + g.span(18, 2, 16, 3), { n: 'flash', role: D, ghost: true }),
        ...rest
      ];
    },
    light: ['window', 'flash'],
    allow: { keyline: '警灯高出横向参考线 2，同出租车的顶灯' },
    // 警笛: the siren flashes and the car pulls out
    fx: [{ t: 'keys', on: ['flash'], ghost: true, a: [1, 0, 1, 0, 1], ms: 600 }, { t: 'keys', on: 'all', x: [1.2, -0.3], ms: 300 }]
  },
  van: {
    label: '厢式车', key: 'landscape',
    plan: '主体：车身（厢体加斜切的车头，同救护车的车身）；辅助：两个车轮（同汽车）；细节：车头的车窗线',
    weights: { [P]: 0.56, [S]: 0.32, [D]: 0.12 },
    draw(g, ctx) {
      const v = vanBody(g, ctx, 4 + g.h);
      return [
        shell(v.body, { n: 'body', role: P }),
        ctx?.variant === 'fill' ? solid(v.pane, { n: 'window', role: D, on: 'body' }) : line(v.window, { n: 'window', role: D, on: 'body' }),
        ...wheels(g)
      ];
    },
    // 送货: the van pulls forward under its load
    fx: { t: 'keys', on: 'all', x: [1.1, -0.3], ms: 320 }
  },
  headlights: {
    nudge: [-1, 0],
    label: '车灯', key: 'landscape', fit: 'x',
    plan: '主体：车灯（左边平直、右边半圆）；辅助：向左照出的三道光线',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      return [
        line(g.span(1, 8, 7, 8) + g.span(1, 12, 7, 12) + g.span(1, 16, 7, 16), { n: 'beams', role: S }),
        shell(g.box(10, 5, 11, 14, [2.5, 7, 7, 2.5]), { n: 'lamp', role: P })
      ];
    },
    // 开灯: the beams come on one after another
    fx: { t: 'draw', on: ['beams'] }
  },
  'train-track': {
    label: '铁轨', key: 'square',
    plan: '主体：两条钢轨（竖直）；辅助：三根枕木（横穿钢轨）。枕木横贯，墨量比钢轨多',
    weights: { [P]: 0.45, [S]: 0.55 },
    draw(g) {
      const { h } = g;
      return [
        line(g.seg(3 + h, 6, 21 - h, 6), { n: 's0', role: S, vc: 0 }),
        line(g.seg(3 + h, 12, 21 - h, 12), { n: 's1', role: S, vc: 1 }),
        line(g.seg(3 + h, 18, 21 - h, 18), { n: 's2', role: S, vc: 2 }),
        line(g.seg(8, 3 + h, 8, 21 - h) + g.seg(16, 3 + h, 16, 21 - h), { n: 'rails', role: P })
      ];
    },
    // 列车经过: the sleepers light up one after another
    fx: { t: 'variable', on: ['s2', 's1', 's0'], mode: 'iterative', step: 160 }
  },
  'steering-wheel': {
    label: '方向盘', key: 'circle',
    plan: '主体：轮圈；辅助：中间的圆形轮毂和三根辐条（左、右、下）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g, ctx) {
      const { h } = g, a = 3 - h, b = 10 - h, spoke = (d) => { const c = Math.cos((d * Math.PI) / 180), sn = Math.sin((d * Math.PI) / 180); return g.seg(12 + a * c, 12 + a * sn, 12 + b * c, 12 + b * sn); };
      // the rim is a ring: the fill variant draws it as in the outline
      return [
        (ctx?.variant === 'fill' ? line : shell)(g.ring(12, 12, 10), { n: 'rim', role: P }),
        shell(g.ring(12, 12, 3), { n: 'hub', role: S }),
        line(spoke(90) + spoke(190) + spoke(350), { n: 'spokes', role: S })
      ];
    },
    light: ['hub', 'spokes'],
    // 转向: the wheel is turned one way and back
    fx: { t: 'wiggle', on: 'all', o: [12, 12], deg: 28, hz: 1.4 }
  },
  'ship-wheel': {
    label: '船舵', key: 'circle',
    plan: '主体：舵轮圈；辅助：八根手柄（伸出轮圈）、两条穿过中心的辐条和中心的实心轮毂。手柄和辐条有十段，墨量超过轮圈',
    weights: { [P]: 0.29, [S]: 0.71 },
    draw(g, ctx) {
      const { h } = g, R = 7, r = R - h, e = 10 - h, at = (d, q) => [12 + q * Math.cos((d * Math.PI) / 180), 12 + q * Math.sin((d * Math.PI) / 180)];
      const handles = [0, 45, 90, 135, 180, 225, 270, 315].map((d) => g.seg(...at(d, r), ...at(d, e))).join('');
      return [
        (ctx?.variant === 'fill' ? line : shell)(g.ring(12, 12, R), { n: 'rim', role: P }),
        line(handles + g.seg(12 - r, 12, 12 + r, 12) + g.seg(12, 12 - r, 12, 12 + r), { n: 'spokes', role: S }),
        solid(g.dot(12, 12, 1.25), { n: 'hub', role: S })
      ];
    },
    light: ['spokes', 'hub'],
    // 掌舵: the wheel turns an eighth of a turn, landing on itself
    fx: { t: 'rotate', on: 'all', o: [12, 12], deg: 45 }
  },
  'traffic-cone': {
    anchor: 'base',
    label: '路障', key: 'square',
    plan: '主体：锥身（梯形）；辅助：底座（一条横线，压在锥身底边下，露出两端）；细节：锥身上两道反光条（面性中锥身在反光条处分成三段）',
    weights: { [P]: 0.7, [S]: 0.08, [D]: 0.22 },
    draw(g, ctx) {
      const { h, s } = g, t = 3 + h, b = 20, L = [10.25, t], R = [13.75, t], BL = [6, b], BR = [18, b];
      const xl = (y) => L[0] + ((BL[0] - L[0]) * (y - t)) / (b - t), xr = (y) => 24 - xl(y);
      const base = line(g.span(3, 21 - h, 21, 21 - h), { n: 'base', role: S });
      // fill: the stripes are gaps between three pieces of the cone, so no thin wedge is left
      // where a knock-out would meet the slanted sides
      if (ctx?.variant === 'fill') {
        const piece = (y0, y1, c) => g.polygon([[xl(y0), y0], [xr(y0), y0], [xr(y1), y1], [xl(y1), y1]], c);
        return [base, shell(piece(t, 9 - s, [1, 1, 0.5, 0.5]) + piece(9 + s, 15 - s, 0.5) + piece(15 + s, b, 0.5), { n: 'cone', role: P })];
      }
      return [
        base,
        shell(g.polygon([L, R, BR, BL], [1, 1, 0.5, 0.5]), { n: 'cone', role: P }),
        line(g.seg(xl(9), 9, xr(9), 9) + g.seg(xl(15), 15, xr(15), 15), { n: 'stripes', role: D, on: 'cone' })
      ];
    },
    // 施工提醒: the cone is knocked and wobbles back
    fx: { t: 'wiggle', on: ['cone', 'stripes'], o: [12, 20], deg: 7, hz: 2.6 }
  },
  construction: {
    anchor: 'base',
    label: '施工路栏', key: 'square',
    plan: '主体：横板（圆角矩形）；辅助：两条腿；细节：横板上两道斜纹（面性中横板为实心：窄横板上的斜向镂空会切出过细的尖角）',
    weights: { [P]: 0.5, [S]: 0.26, [D]: 0.24 },
    draw(g) {
      const { h } = g, t = 6 + h, b = 13 - h;
      return [
        line(g.seg(7, 13, 7, 21 - h) + g.seg(17, 13, 17, 21 - h) + g.span(4, 21 - h, 10, 21 - h) + g.span(14, 21 - h, 20, 21 - h), { n: 'legs', role: S }),
        shell(g.box(3, 6, 18, 7, 2), { n: 'board', role: P }),
        line(g.seg(7.5, b, 7.5 + (b - t), t) + g.seg(13.5, b, 13.5 + (b - t), t), { n: 'stripes', role: D, on: 'board', only: 'outline' })
      ];
    },
    allow: { keyline: '路栏的横板在上方，两条腿立在底边，上沿不到参考线' },
    // 施工: the barrier is set down and settles
    fx: { t: 'keys', on: 'all', o: [12, 21], y: [-1.2, 0.2], ms: 300 }
  },
  'car-battery': {
    label: '汽车电瓶', key: 'landscape',
    plan: '主体：电瓶外壳；辅助：顶上两个接线柱（实心）；细节：正负极符号（随字重缩小）',
    weights: { [P]: 0.64, [S]: 0.14, [D]: 0.22 },
    draw(g) {
      const { s } = g, k = 1.5 - Math.max(0, s - 2), y = 13;
      return [
        solid(g.area(5, 4, 4, 4, [0.75, 0.75, 0, 0]) + g.area(15, 4, 4, 4, [0.75, 0.75, 0, 0]), { n: 'posts', role: S }),
        shell(g.box(2, 7, 20, 13, 3), { n: 'case', role: P }),
        line(g.seg(8 - k, y, 8 + k, y) + g.seg(8, y - k, 8, y + k) + g.seg(16 - k, y, 16 + k, y), { n: 'signs', role: D, on: 'case' })
      ];
    },
    // 电量: the signs flash in turn, like charge flowing
    fx: { t: 'keys', on: ['signs'], o: [12, 13], s: [1.2, 0.95], ms: 300 }
  }
});

// Variants made by rule (kit.mjs) on the charger.
const base = (k) => ({ ...set[k], name: k });
Object.assign(set, {
  'ev-charger-off': { ...off(slash(base('ev-charger'), { label: '充电桩停用' }), 'ev-charger', { t: 'keys', on: ['bolt'], o: [9, 12], s: [0.6], ms: 240 }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } },
  // fill: the bolt moves up and left, keeping a stroke of ink between it and the badge's notch
  'ev-charger-check': { ...notched(badge(base('ev-charger'), 'check', { label: '充电完成', drop: ['cable', 'plug'] }), (L) => L.map((l) => (l.n === 'bolt' ? { ...l, tf: 'translate(-1 -1.5)' } : l))), fx: { t: 'draw', on: ['badge'] } }
});

// --- Work vehicles, cargo and car care --------------------------------------------------------
Object.assign(set, {
  'camper-van': {
    anchor: 'base',
    label: '房车', key: 'landscape',
    plan: '同厢式车，车顶加一个撑起的顶篷（梯形，一笔线条，接在车顶上）',
    weights: { [P]: 0.5, [S]: 0.38, [D]: 0.12 },
    draw(g, ctx) {
      const { h } = g, t = 4 + h, v = vanBody(g, ctx, t);
      return [
        line(g.pl([[3.5, t], [5.5, 1 + h], [11.5, 1 + h], [13.5, t]]), { n: 'roof', role: S }),
        shell(v.body, { n: 'body', role: P }),
        ctx?.variant === 'fill' ? solid(v.pane, { n: 'window', role: D, on: 'body' }) : line(v.window, { n: 'window', role: D, on: 'body' }),
        ...wheels(g)
      ];
    },
    allow: { keyline: '顶篷高出横向参考线 3，同出租车的顶灯' },
    // 露营: the roof pops up and settles
    fx: { t: 'keys', on: ['roof'], o: [8.5, 5], sy: [1.25, 0.95], ms: 320 }
  },
  'fire-truck': {
    anchor: 'base',
    label: '消防车', key: 'landscape',
    plan: '同货车，货箱上架一架云梯（一条横杆，三根短杆连到车顶）',
    weights: { [P]: 0.5, [S]: 0.4, [D]: 0.1 },
    draw(g, ctx) {
      const { h } = g, y = Math.max(2, 1 + h);
      return [line(g.span(2, y, 13, y) + [5, 8, 11].map((x) => g.seg(x, y, x, 4 + h)).join(''), { n: 'ladder', role: S }), ...set.truck.draw(g, ctx)];
    },
    allow: { keyline: '云梯高出横向参考线 3，同出租车的顶灯' },
    // 出警: the ladder lifts and the truck pulls out
    fx: [{ t: 'keys', on: ['ladder'], o: [2, 2], sx: [1.25, 0.97], ms: 360 }, { t: 'keys', on: 'all', x: [1, -0.25], ms: 340 }]
  },
  'shipping-container': {
    label: '集装箱', key: 'landscape',
    plan: '主体：箱体；细节：三道竖向的波纹（不碰上下边）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) {
      const { s, h } = g, y0 = 4 + s + 1.5 + h, y1 = 20 - s - 1.5 - h;
      return [
        shell(g.box(2, 4, 20, 16, 3), { n: 'box', role: P }),
        line([7, 12, 17].map((x) => g.seg(x, y0, x, y1)).join(''), { n: 'ribs', role: D, on: 'box' })
      ];
    },
    // 吊装: the container is lifted and set down
    fx: { t: 'keys', on: 'all', y: [-1.6, 0.3], ms: 340 }
  },
  'car-key': {
    label: '车钥匙', key: 'portrait', fit: 'y',
    allow: { optical: '钥匙杆只是一条线，分量集中在上方的遥控器，按整体外框定位' },
    plan: '主体：遥控钥匙（圆角矩形）；辅助：下面的钥匙杆和一个齿；细节：遥控按钮（实心圆点）',
    weights: { [P]: 0.66, [S]: 0.24, [D]: 0.1 },
    draw(g) {
      const { h } = g;
      return [
        line(g.seg(12, 14 - h, 12, 22 - h) + g.seg(12, 18, 15, 18), { n: 'blade', role: S }),
        shell(g.box(7, 2, 10, 12, 4), { n: 'fob', role: P }),
        solid(g.dot(12, 8, 0.9 - (g.s - 2) * 0.5), { n: 'button', role: D, on: 'fob' })
      ];
    },
    // 解锁: the button is pressed
    fx: [{ t: 'keys', on: ['button'], o: [12, 8], s: [0.6, 1.1], ms: 260 }, { t: 'keys', on: 'all', o: [12, 22], r: [-8, 2], ms: 340 }]
  },
  'gas-can': {
    label: '油桶', key: 'portrait',
    plan: '主体：桶身；辅助：左上的提手和右上的油嘴；细节：桶身上的交叉压纹',
    weights: { [P]: 0.58, [S]: 0.2, [D]: 0.22 },
    draw(g) {
      const { h } = g, t = 6;
      return [
        line(arch(6, 11, 2 + h, t + h) + g.seg(15, t + h, 18.5, 2 + h * 0.8), { n: 'handle', role: S }),
        shell(g.box(4, t, 16, 16, 3), { n: 'can', role: P }),
        line(g.seg(9, 11, 15, 17) + g.seg(15, 11, 9, 17), { n: 'x', role: D, on: 'can' })
      ];
    },
    // 加油: the can tips to pour and comes back
    fx: { t: 'keys', on: 'all', o: [20, 22], r: [10, -2], ms: 380 }
  },
  'oil-can': {
    anchor: 'base',
    label: '机油', key: 'landscape', fit: 'x',
    allow: { optical: '壶嘴只是一条斜线，分量在左下的壶身，按整体外框定位' },
    plan: '主体：油壶壶身；辅助：伸向右上的壶嘴和顶上的盖；细节：壶嘴下的一滴油（实心圆点）',
    weights: { [P]: 0.66, [S]: 0.24, [D]: 0.1 },
    draw(g) {
      const { h } = g, top = 10;
      return [
        line(g.seg(15 - h, 14, 20, 8) + g.seg(8, top, 8, 8 + h) + g.span(5, 8, 11, 8), { n: 'spout', role: S }),
        shell(g.box(2, top, 13, 10, 3), { n: 'can', role: P }),
        solid(g.dot(21, 15, 0.8), { n: 'drop', role: D })
      ];
    },
    light: ['drop'],
    // 滴油: the drop falls from the spout
    fx: { t: 'keys', on: ['drop'], y: [2, 0], ms: 420 }
  },
  'cable-car': {
    label: '缆车', key: 'live',
    plan: '主体：车厢；辅助：缆绳和吊杆；细节：腰线和中柱（分出两扇车窗）',
    weights: { [P]: 0.5, [S]: 0.28, [D]: 0.22 },
    draw(g, ctx) {
      const { h, s } = g, top = 8, belt = 14;
      const pillar = ctx?.variant === 'fill' ? g.seg(12, top + 1.5 * s, 12, belt) : g.seg(12, top + h, 12, belt);
      return [
        line(g.span(2, 3, 22, 3) + g.seg(12, 3, 12, top + h), { n: 'cable', role: S }),
        shell(g.box(5, top, 14, 14, 3), { n: 'cabin', role: P }),
        line(beltLine(g, ctx, 5, 19, belt) + pillar, { n: 'window', role: D, on: 'cabin' })
      ];
    },
    // 缆车: the cabin sways under the cable
    fx: { t: 'wiggle', on: ['cabin', 'window'], o: [12, 3], deg: 6, hz: 1.6 }
  }
});

// --- Air, water and the yard ------------------------------------------------------------------
Object.assign(set, {
  forklift: {
    label: '叉车', key: 'live', fit: 'x',
    allow: { optical: '门架和货叉只是线条，分量在左边的车身，按整体外框定位' },
    plan: '主体：车身；辅助：护顶架、门架和货叉（线条），两个车轮（实心）',
    weights: { [P]: 0.36, [S]: 0.64 },
    draw(g) {
      const { h } = g;
      return [
        line(`M4 10V5A1 1 0 0 1 5 4H10L12 ${n(10 + h)}` + g.seg(13 - h, 13, 17, 13) + g.seg(17, 3 + h, 17, 21) + g.seg(17, 21, 22 - h, 21), { n: 'mast', role: S }),
        shell(g.box(2, 10, 11, 7, 2), { n: 'body', role: P }),
        solid(g.circ(5.5, 19, 2.5) + g.circ(10.5, 19, 2.5), { n: 'wheels', role: S })
      ];
    },
    // 叉起: the forks lift and set down
    fx: { t: 'keys', on: ['mast'], y: [-1.5, 0.3], ms: 360 }
  },
  tractor: {
    anchor: 'base',
    label: '拖拉机', key: 'live',
    plan: '主体：驾驶室和车头（一笔线条，两端接到车轮上）和排气管；辅助：大后轮和小前轮（圆环）；细节：后轮的轮毂（实心圆点）',
    weights: { [P]: 0.53, [S]: 0.41, [D]: 0.06 },
    draw(g) {
      const { h } = g, R = 5.5, r = R - h, c = [7.5, 16.5], fy = 18, fR = 3.5;
      const xAt = (y) => c[0] + Math.sqrt(Math.max(0, r * r - (y - c[1]) ** 2));
      return [
        shell(g.ring(...c, R), { n: 'rear', role: S }),
        shell(g.ring(18.5, fy, fR), { n: 'front', role: S, part: 'tractor' }),
        solid(g.dot(...c, 0.8), { n: 'hub', role: D, on: 'rear' }),
        line(`M5 ${n(c[1] - Math.sqrt(r * r - 2.5 ** 2))}V4.5A1.5 1.5 0 0 1 6.5 3H11L13 10H20A1 1 0 0 1 21 11V14H${n(xAt(14))}` + g.seg(18, 10, 18, 6), { n: 'body', role: P, part: 'tractor' })
      ];
    },
    // 耕地: the tractor rocks forward over a furrow
    fx: { t: 'keys', on: 'all', o: [12, 22], x: [1, -0.25], r: [-3, 1], ms: 360 }
  },
  helicopter: {
    label: '直升机', key: 'live', fit: 'x',
    plan: '主体：机舱（圆角矩形）；辅助：顶上的旋翼和桅杆、向右的尾梁和尾桨、下面的起落架',
    weights: { [P]: 0.42, [S]: 0.58 },
    draw(g) {
      const { h } = g;
      return [
        line(g.span(2, 4, 18, 4) + g.seg(9, 4, 9, 8 + h), { n: 'rotor', role: S }),
        line(g.seg(15 - h, 12, 21, 12) + g.seg(21, 9, 21, 15) + g.seg(6, 16 - h, 6, 20) + g.seg(11, 16 - h, 11, 20) + g.span(3, 20, 15, 20), { n: 'frame', role: S }),
        shell(g.box(3, 8, 12, 9, 4), { n: 'cabin', role: P })
      ];
    },
    // 起飞: the rotor spins and the helicopter lifts
    fx: [{ t: 'keys', on: ['rotor'], o: [9, 4], sx: [0.2, 1, 0.2, 1], ms: 520 }, { t: 'keys', on: 'all', y: [-1.2, 0.2], ms: 420 }]
  },
  'hot-air-balloon': {
    label: '热气球', key: 'portrait', fit: 'y',
    ends: 'out',
    plan: '主体：气囊（圆顶收成平口）；辅助：吊篮（实心）和两根吊绳；细节：气囊中间一道竖缝（面性中把气囊分成两半）',
    weights: { [P]: 0.53, [S]: 0.25, [D]: 0.22 },
    draw(g) {
      const { h } = g, c = [12, 9.5], r = 7.5 - h, y = 16, a = (135 * Math.PI) / 180, b = Math.PI / 4;
      const L = [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)], Rt = [c[0] + r * Math.cos(b), c[1] + r * Math.sin(b)];
      return [
        shell(`M9.5 ${y}L${g.pt(...L)}A${n(r)} ${n(r)} 0 1 1 ${g.pt(...Rt)}L14.5 ${y}Z`, { n: 'envelope', role: P }),
        line(g.seg(12, c[1] - r, 12, y), { n: 'seam', role: D, on: 'envelope' }),
        line(g.seg(10, y, 10, 19.5) + g.seg(14, y, 14, 19.5), { n: 'ropes', role: S }),
        solid(g.area(9, 19, 6, 3, [0.5, 0.5, 1.25, 1.25]), { n: 'basket', role: S })
      ];
    },
    // 升空: the balloon rises and drifts back down
    fx: { t: 'keys', on: 'all', y: [-1.5, 0.3], x: [0.4, 0], ms: 520 }
  },
  parachute: {
    label: '降落伞', key: 'live',
    plan: '主体：伞面（半圆，下沿三段向上的弧）；辅助：三根伞绳和下面的货包（实心）',
    weights: { [P]: 0.54, [S]: 0.46 },
    draw(g) {
      const { h } = g, r = 10 - h, y = 12, w = (2 * r) / 3, q = 3.75, sag = q - Math.sqrt(q * q - (w / 2) ** 2);
      const hem = [1, 2, 3].map((i) => `A${q} ${q} 0 0 0 ${n(12 + r - i * w)} ${y}`).join('');
      return [
        line(g.seg(12 - r, y, 10.5, 19) + g.seg(12, y - sag, 12, 19) + g.seg(12 + r, y, 13.5, 19), { n: 'lines', role: S }),
        shell(`M${n(12 - r)} ${y}A${n(r)} ${n(r)} 0 0 1 ${n(12 + r)} ${y}${hem}Z`, { n: 'canopy', role: P }),
        solid(g.area(9.5, 19, 5, 3, 1), { n: 'load', role: S })
      ];
    },
    // 降落: the parachute sways as it comes down
    fx: [{ t: 'wiggle', on: 'all', o: [12, 3], deg: 6, hz: 1.6 }, { t: 'keys', on: 'all', y: [1, 0], ms: 520 }]
  },
  sailboat: {
    anchor: 'base',
    label: '帆船', key: 'square',
    plan: '主体：主帆和前帆（两块三角形，靠在桅杆两侧）；辅助：船身和桅杆',
    weights: { [P]: 0.52, [S]: 0.48 },
    draw(g) {
      const { h } = g, top = 3 + h, foot = 13 - h, deck = 16;
      return [
        line(g.seg(12, top, 12, deck), { n: 'mast', role: S }),
        shell(g.polygon([[12, top], [20 - h, foot], [12, foot]], [0.5, 1.2, 0]), { n: 'main', role: P }),
        shell(g.polygon([[12, 6], [12, foot], [5 + h, foot]], [0.5, 0, 1.2]), { n: 'jib', role: P }),
        shell(g.polygon([[2.17 + h, deck], [21.83 - h, deck], [17.5, 21 - h], [6.5, 21 - h]], [1, 1, 1.5, 1.5]), { n: 'hull', role: S })
      ];
    },
    // 扬帆: the boat heels in the wind and rights itself
    fx: { t: 'wiggle', on: 'all', o: [12, 21], deg: 6, hz: 1.5 }
  },
  canoe: {
    label: '独木舟', key: 'live', fit: 'x',
    plan: '主体：船身（月牙形，两头尖）；辅助：船身上方斜放的船桨（桨杆和实心桨叶）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const { h } = g;
      return [
        shell(`M${n(2 + h)} 12Q12 14 ${n(22 - h)} 12Q12 26 ${n(2 + h)} 12Z`, { n: 'hull', role: P }),
        line(g.seg(6, 8.5, 15, 4.5), { n: 'oar', role: S, part: 'oar' }),
        solid(g.rot(17.4, 3.45, 5.5, 2.6, -24, 1.3), { n: 'blade', role: S, part: 'oar' })
      ];
    },
    // 划桨: the oar dips and comes back
    fx: { t: 'keys', on: ['oar', 'blade'], o: [10, 7], r: [12, -3], ms: 420 }
  },
  submarine: {
    label: '潜水艇', key: 'landscape', fit: 'x',
    plan: '主体：艇身（圆头长条）；辅助：指挥塔、潜望镜和尾部的螺旋桨；细节：两个舷窗（实心圆点）',
    weights: { [P]: 0.63, [S]: 0.32, [D]: 0.05 },
    draw(g) {
      const { h } = g, top = 10;
      return [
        line(`M8 ${n(top + h)}V8.5A1.5 1.5 0 0 1 9.5 7H12.5A1.5 1.5 0 0 1 14 8.5V${n(top + h)}` + g.seg(11, 7, 11, 4) + g.seg(11, 4, 13, 4) + g.seg(20 - h, 15, 22 - h, 15) + g.seg(22 - h, 12.5, 22 - h, 17.5), { n: 'tower', role: S }),
        shell(g.box(2, top, 18, 9, 4.5), { n: 'hull', role: P }),
        solid(g.dot(8, 14.5, 0.6 - (g.s - 2) * 0.45) + g.dot(13, 14.5, 0.6 - (g.s - 2) * 0.45), { n: 'ports', role: D, on: 'hull' })
      ];
    },
    // 下潜: the submarine dips and rises
    fx: { t: 'keys', on: 'all', o: [12, 15], y: [1.2, -0.3], r: [4, -1], ms: 460 }
  }
});

Object.assign(set, {
  trailer: {
    label: '挂车', key: 'landscape', fit: 'x',
    allow: { optical: '牵引杆只是一条线，分量在左边的车厢，按整体外框定位' },
    plan: '主体：车厢（圆角矩形）；辅助：右侧的牵引杆和下面的车轮（圆环，与车厢隔开）；细节：车门（一条竖线，面性中切开车厢底边）',
    weights: { [P]: 0.64, [S]: 0.26, [D]: 0.1 },
    draw(g, ctx) {
      const { h } = g, fill = ctx?.variant === 'fill';
      return [
        shell(g.box(2, 4, 16, 11, 4), { n: 'body', role: P }),
        line(g.seg(13, 8.5, 13, fill ? 15 + g.s : 15 - h), { n: 'door', role: D, on: 'body', ends: 'keep' }),
        line(g.seg(18 - h, 12, 22 - h, 12), { n: 'hitch', role: S }),
        shell(g.ring(9, 19, 2.5), { n: 'wheel', role: S })
      ];
    },
    // 拖行: the trailer is pulled along
    fx: { t: 'keys', on: 'all', x: [1.2, -0.3], ms: 340 }
  }
});

export default set;
