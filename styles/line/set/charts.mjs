// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// charts: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: chart-line chart-pie chart-area chart-column-stacked chart-donut chart-scatter chart-candlestick chart-funnel chart-gantt activity gauge trending-up trending-down presentation
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// The axis of the chart family, as in chart-bar: one line along the bottom, 3..21 at y 20.
const axis = (g) => line(g.span(3, 21 - g.h, 21, 21 - g.h), { n: 'axis', role: S });
// Data lines (chart-line, chart-area, trending, activity): one stroke through the data points,
// sharp points with round joins, no point markers.

// A sector of a disc (r = 0) or of a ring (hole r) about (cx, cy), from angle a0 to a1 in
// degrees (clockwise, 0 pointing right), by its outer edge R. The cut edges stand back gap / 2
// from the cut line, so neighbouring sectors keep gap clear. Outer corners are rounded with f
// (centre line); the corner at the middle of a disc sector with fc when it is convex.
function sector(g, { cx = 12, cy = 12, R = 10, r = 0, a0, a1, gap = 2, f = 1, fc = 0.75 }) {
  const { h } = g, o = gap / 2 + h, ro = R - h, ri = r > 0 ? r + h : 0;
  const rad = (a) => (a * Math.PI) / 180, A0 = rad(a0), A1 = rad(a1);
  const d0 = [Math.cos(A0), Math.sin(A0)], d1 = [Math.cos(A1), Math.sin(A1)];
  // inward normals: edge a0 leans toward larger angles, edge a1 toward smaller ones
  const n0 = [-Math.sin(A0), Math.cos(A0)], n1 = [Math.sin(A1), -Math.cos(A1)];
  const pt = ([x, y]) => `${n(cx + x)} ${n(cy + y)}`;
  const ang = ([x, y]) => Math.atan2(y, x);
  // fillet between an edge and a circle of radius rho; out: the circle is the outer arc
  const fillet = (d, nn, rho, out) => {
    const k = out ? rho - f : rho + f, t = Math.sqrt(k * k - (o + f) * (o + f));
    const F = [t * d[0] + (o + f) * nn[0], t * d[1] + (o + f) * nn[1]], m = Math.hypot(F[0], F[1]);
    return { L: [t * d[0] + o * nn[0], t * d[1] + o * nn[1]], C: [(F[0] * rho) / m, (F[1] * rho) / m] };
  };
  const O0 = fillet(d0, n0, ro, true), O1 = fillet(d1, n1, ro, true);
  const turn = (p, q) => ((((ang(q) - ang(p)) * 180) / Math.PI) + 360) % 360;
  const fa = `A${n(f)} ${n(f)} 0 0 1 `;
  const outer = `L${pt(O0.L)}${fa}${pt(O0.C)}A${n(ro)} ${n(ro)} 0 ${turn(O0.C, O1.C) > 180 ? 1 : 0} 1 ${pt(O1.C)}${fa}${pt(O1.L)}`;
  if (ri) {
    const I0 = fillet(d0, n0, ri, false), I1 = fillet(d1, n1, ri, false);
    return `M${pt(I0.L)}${outer}L${pt(I1.L)}${fa}${pt(I1.C)}A${n(ri)} ${n(ri)} 0 ${turn(I0.C, I1.C) > 180 ? 1 : 0} 0 ${pt(I0.C)}${fa}${pt(I0.L)}Z`;
  }
  // the corner where the two edges meet: t d0 + o n0 = u d1 + o n1
  const bx = o * (n1[0] - n0[0]), by = o * (n1[1] - n0[1]), det = d0[0] * -d1[1] - d0[1] * -d1[0];
  const t = (bx * -d1[1] - by * -d1[0]) / det, V = [t * d0[0] + o * n0[0], t * d0[1] + o * n0[1]];
  const span = ((a1 - a0) % 360 + 360) % 360;
  if (span >= 180 || !fc) return `M${pt(V)}${outer}Z`;
  const tl = fc / Math.tan(rad(span) / 2), Q0 = [V[0] + tl * d0[0], V[1] + tl * d0[1]], Q1 = [V[0] + tl * d1[0], V[1] + tl * d1[1]];
  return `M${pt(Q0)}${outer}L${pt(Q1)}A${n(fc)} ${n(fc)} 0 0 1 ${pt(Q0)}Z`;
}

// The rising and falling arrows: a zigzag at 45° and a head of two legs, 6 along each axis.
// Drawn 1 to the left of the landscape key (nudge): the head is the heavy end.
const trend = (g, flip) => {
  const { h } = g, Y = (y) => (flip ? 24 - y : y);
  return [
    line(g.pl([[1 + h, 18 - h], [9, 10], [13, 14], [20, 7]].map(([x, y]) => [x, Y(y)])), { n: 'line', role: P }),
    line(g.pl([[14, 7], [20, 7], [20, 13]].map(([x, y]) => [x, Y(y)])), { n: 'head', role: P })
  ];
};

export default {
  'chart-line': {
    anchor: 'base',
    label: '折线图', key: 'square',
    plan: '主体：折线（一笔，经过四个数据点）；辅助：横轴（同统计）',
    weights: { [P]: 0.58, [S]: 0.42 },
    draw(g) { return [axis(g), line(g.pl([[4, 15], [9, 9], [13, 13], [20, 4]]), { n: 'line', role: P })]; },
    light: ['line'],
    fx: { t: 'draw', on: ['line'] }
  },
  'chart-pie': {
    label: '饼图', key: 'circle',
    plan: '主体：四分之三的扇形；辅助：右上角四分之一的扇形（与主体隔开 2）',
    weights: { [P]: 0.72, [S]: 0.28 },
    allow: { keyline: '两块之间留 2 的切口，切口两侧的圆弧低于圆形参考线约 0.6' },
    draw(g) {
      const f = 2 - g.h;
      return [
        shell(sector(g, { a0: 0, a1: 270, f }), { n: 'pie', role: P }),
        shell(sector(g, { a0: -90, a1: 0, f, fc: 1.25 - g.h * 0.5 }), { n: 'slice', role: S })
      ];
    },
    // 突出一块: the slice moves out along its middle and back
    fx: { t: 'keys', on: ['slice'], x: [0.9], y: [-0.9], ms: 300 }
  },
  'chart-area': {
    anchor: 'base',
    label: '面积图', key: 'square',
    plan: '主体：面积（上沿是折线，下沿离横轴 2）；辅助：横轴',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      return [axis(g), shell(g.polygon([[4, 16], [4, 12], [9, 7], [13, 10.5], [20, 3.5], [20, 16]], [1.5, 1, 1, 0, 0.5, 1.5]), { n: 'area', role: P })];
    },
    light: ['area'],
    fx: { t: 'keys', on: ['area'], o: [12, 17], sy: [0.25, 1.05], ms: 420 }
  },
  'chart-column-stacked': {
    anchor: 'base',
    label: '堆叠柱状图', key: 'square',
    plan: '主体：三根柱，每根分上下两段，隔开 2（上段是叠上去的第二组数，线性双色里用浅色）；辅助：横轴。柱和横轴同统计，直线端点',
    weights: { [P]: 0.61, [S]: 0.39 },
    draw(g) {
      const foot = 21 - g.s - 2;
      const cols = [[7, 13, 8], [12, 10, 3], [17, 14, 7]];
      return [
        axis(g),
        ...cols.map(([x, y], i) => line(g.seg(x, foot, x, y), { n: `l${i}`, role: P, cap: 'butt', part: 'bars' })),
        ...cols.map(([x, y, top], i) => line(g.seg(x, y - 2, x, top), { n: `u${i}`, role: P, cap: 'butt', part: 'bars' }))
      ];
    },
    light: ['u0', 'u1', 'u2'],
    fx: { t: 'keys', on: [['l0', 'u0'], ['l1', 'u1'], ['l2', 'u2']], by: true, o: [12, 18.5], sy: [0.15, 1.06], stagger: 70 }
  },
  'chart-donut': {
    label: '环形图', key: 'circle',
    plan: '主体：两段大的环；辅助：右上角四分之一的环。各段隔开 2，环宽 6',
    weights: { [P]: 0.75, [S]: 0.25 },
    draw(g) {
      const f = Math.max(0.25, 1.5 - g.h);
      return [
        shell(sector(g, { r: 4, a0: 0, a1: 135, f }), { n: 's1', role: P }),
        shell(sector(g, { r: 4, a0: 135, a1: 270, f }), { n: 's2', role: P }),
        shell(sector(g, { r: 4, a0: -90, a1: 0, f }), { n: 's0', role: S })
      ];
    },
    fx: { t: 'keys', on: ['s0'], x: [0.9], y: [-0.9], ms: 300 }
  },
  'chart-scatter': {
    anchor: 'base',
    label: '散点图', key: 'square',
    plan: '主体：五个数据点（实心圆点，大致向右上）；辅助：横轴',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g) {
      const pts = [[4.8, 15], [8.6, 9.6], [12.6, 13.8], [14, 4.8], [19.2, 9.6]];
      return [axis(g), ...pts.map(([x, y], i) => solid(g.dot(x, y, 1.1), { n: `p${i}`, role: P }))];
    },
    light: ['p0', 'p1', 'p2', 'p3', 'p4'],
    fx: { t: 'keys', on: ['p0', 'p1', 'p2', 'p3', 'p4'], by: true, y: [-1.6], stagger: 60, ms: 220 }
  },
  'chart-candlestick': {
    anchor: 'base',
    label: 'K 线图', key: 'square',
    plan: '主体：三根蜡烛（实体是实心竖条，宽同暂停竖条；影线一笔）；辅助：横轴',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const w = 4 + (g.s - 2) * 0.6;
      const c = [[6, 7, 17, 9, 14], [12, 3, 14, 5, 11], [18, 6, 16, 8, 13]];
      return [
        axis(g),
        ...c.map(([x, t, b, y0, y1], i) => line(g.span(x, t, x, b), { n: `w${i}`, role: P, part: `c${i}` })),
        ...c.map(([x, t, b, y0, y1], i) => solid(g.area(x - w / 2, y0, w, y1 - y0, 1), { n: `k${i}`, role: P, part: `c${i}` }))
      ];
    },
    light: ['w0', 'w1', 'w2', 'k0', 'k1', 'k2'],
    fx: { t: 'keys', on: [['w0', 'k0'], ['w1', 'k1'], ['w2', 'k2']], by: true, y: [-1.2, 0.4], stagger: 70 }
  },
  'chart-funnel': {
    nudge: [0, 1],
    label: '漏斗图', key: 'square',
    ends: 'in',
    plan: '主体：倒梯形外框（斜边是漏斗本身需要的）；细节：两条横线，分成三层。横线横贯整个漏斗，占三成多。上宽下窄，整体下移 1',
    weights: { [P]: 0.66, [D]: 0.34 },
    draw(g) {
      // outer sides from (2.4, 4) to (8.4, 22): drawn 1 low, the wide top is the heavy end
      const { h } = g, k = Math.hypot(1, 3) / 3, xl = (y) => 2.4 + (y - 4) / 3 + h * k;
      const t = 4 + h, b = 22 - h;
      return [
        shell(g.polygon([[xl(t), t], [24 - xl(t), t], [24 - xl(b), b], [xl(b), b]], [1, 1, 1.75, 1.75]), { n: 'funnel', role: P }),
        line(g.seg(xl(10), 10, 24 - xl(10), 10), { n: 'd0', role: D, on: 'funnel' }),
        line(g.seg(xl(15), 15, 24 - xl(15), 15), { n: 'd1', role: D, on: 'funnel' })
      ];
    },
    fx: { t: 'draw', on: ['d0', 'd1'] }
  },
  'chart-gantt': {
    anchor: 'base',
    label: '甘特图', key: 'square',
    plan: '主体：三条任务条（横向，直线端点：两端是开始和结束的时间，要平），依次错开；辅助：横轴',
    weights: { [P]: 0.58, [S]: 0.42 },
    draw(g) {
      const rows = [[4, 3, 11], [10, 8, 16], [16, 13, 21]];
      return [axis(g), ...rows.map(([y, x0, x1], i) => line(g.seg(x0, y, x1, y), { n: `b${i}`, role: P, cap: 'butt', part: 'bars' }))];
    },
    light: ['b0', 'b1', 'b2'],
    fx: [
      { t: 'keys', on: ['b0'], o: [3, 4], sx: [0.2, 1.04], ms: 380 },
      { t: 'keys', on: ['b1'], o: [8, 10], sx: [0.2, 1.04], ms: 460 },
      { t: 'keys', on: ['b2'], o: [13, 16], sx: [0.2, 1.04], ms: 540 }
    ]
  },
  activity: {
    label: '动态', key: 'landscape', fit: 'x',
    plan: '主体：心电折线（一笔，平线、一高一低两个尖、平线）',
    weights: { [P]: 1 },
    draw(g) { const { h } = g; return [line(g.pl([[2 + h, 12], [7, 12], [9.5, 4], [14.5, 20], [17, 12], [22 - h, 12]]), { n: 'pulse', role: P })]; },
    fx: { t: 'draw', on: ['pulse'] }
  },
  gauge: {
    label: '仪表', key: 'landscape',
    plan: '主体：表盘弧（250°，缺口在下）；辅助：指针和中心轴（实心点）',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      const { h, s } = g, cx = 12, cy = 14, L = 5.5 - (s - 2), a = (228 * Math.PI) / 180;
      return [
        line(g.arc(cx, cy, 10 - h, 145, 395), { n: 'dial', role: P }),
        line(g.seg(cx, cy, cx + L * Math.cos(a), cy + L * Math.sin(a)), { n: 'needle', role: S, part: 'needle' }),
        solid(g.dot(cx, cy, 1.25), { n: 'hub', role: S, part: 'needle' })
      ];
    },
    area: (g) => { const r = 10 - g.h, p = (d) => `${n(12 + r * Math.cos((d * Math.PI) / 180))} ${n(14 + r * Math.sin((d * Math.PI) / 180))}`; return [{ n: 'dial', d: `M${p(145)}A${n(r)} ${n(r)} 0 1 1 ${p(35)}Z` }]; },
    // 读数: the needle swings up the scale and settles back
    fx: { t: 'keys', on: ['needle'], o: [12, 14], r: [70, 55, 0], ms: 640 }
  },
  'trending-up': {
    nudge: [-1, 0],
    label: '上涨', key: 'landscape', fit: 'x',
    light: [],
    plan: '主体：向右上的折线箭头（45° 折线，箭头两条腿沿横竖方向，长 6）',
    weights: { [P]: 1 },
    draw(g) { return trend(g, false); },
    fx: { t: 'draw', on: ['line', 'head'] }
  },
  'trending-down': {
    nudge: [-1, 0],
    label: '下跌', key: 'landscape', fit: 'x',
    light: [],
    plan: '同上涨，上下翻转，箭头向右下',
    weights: { [P]: 1 },
    draw(g) { return trend(g, true); },
    fx: { t: 'draw', on: ['line', 'head'] }
  },
  presentation: {
    anchor: 'base',
    label: '演示', key: 'live',
    plan: '主体：白板（顶部横杆和开口向上的板面，连成一体）；辅助：支架（两条腿）；细节：板上的折线',
    weights: { [P]: 0.6, [S]: 0.2, [D]: 0.2 },
    draw(g) {
      const { h } = g, c = 3.5 - h;
      return [
        line(g.span(2, 3, 22, 3) + cup(4, 3, 20, 15, c), { n: 'board', role: P }),
        line(g.pl([[8, 22 - h], [12, 15], [16, 22 - h]]), { n: 'stand', role: S }),
        line(g.pl([[8, 11], [11, 8], [13, 10], [16, 7]]), { n: 'chart', role: D })
      ];
    },
    area: (g) => [{ n: 'board', d: g.rr(4, 3, 16, 12, [0, 0, 3.5 - g.h, 3.5 - g.h]) }],
    fx: { t: 'draw', on: ['chart'] }
  }
};
