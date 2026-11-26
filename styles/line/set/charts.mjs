// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// charts: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: chart-line chart-pie chart-area chart-column-stacked chart-donut chart-scatter chart-candlestick chart-funnel chart-gantt activity gauge trending-up trending-down presentation
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { enclose } from '../kit.mjs';

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

// Bars standing on the axis, as in chart-bar: [x, top] each, flat ends, 2 clear above the axis.
const bars = (g, cols, o = {}) => {
  const foot = 21 - g.s - 2;
  return cols.map(([x, y], i) => line(g.seg(x, foot, x, y), { n: `b${i}`, role: P, cap: 'butt', part: 'bars', ...o }));
};
// A chart turned a quarter: the axis up the left and the bars running right, (x, y) to (24 - y, x).
const turned = (l) => ({ ...l, d: l.d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${n(24 - +y)} ${x}`) });
// Both axes, as in the xyaxis charts of SF Symbols: up the left side and along the bottom.
const axes = (g) => line(g.pl([[3 + g.h, 3 + g.h], [3 + g.h, 21 - g.h], [21 - g.h, 21 - g.h]]), { n: 'axis', role: S });
// A data line with an arrowhead at its last point: the last leg runs at 45°, the head's two legs
// (length k) run along the axes.
const arrowLine = (g, pts, k = 4) => {
  const [x, y] = pts[pts.length - 1], [px, py] = pts[pts.length - 2], sx = Math.sign(x - px), sy = Math.sign(y - py);
  return [
    line(g.pl(pts), { n: 'line', role: P, part: 'trend' }),
    line(g.pl([[x - sx * k, y], [x, y], [x, y - sy * k]]), { n: 'head', role: P, part: 'trend' })
  ];
};
// A convex polygon given by its outer edge, moved in by h to its centre line.
function inset(pts, h) {
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  const edges = pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length], L = Math.hypot(q[0] - p[0], q[1] - p[1]);
    let nx = (q[1] - p[1]) / L, ny = (p[0] - q[0]) / L;
    if ((cx - p[0]) * nx + (cy - p[1]) * ny < 0) { nx = -nx; ny = -ny; }
    return [p[0] + nx * h, p[1] + ny * h, q[0] - p[0], q[1] - p[1]];
  });
  return edges.map((e, i) => {
    const [x1, y1, dx1, dy1] = edges[(i - 1 + edges.length) % edges.length], [x2, y2, dx2, dy2] = e;
    const t = ((x2 - x1) * dy2 - (y2 - y1) * dx2) / (dx1 * dy2 - dy1 * dx2);
    return [x1 + dx1 * t, y1 + dy1 * t];
  });
}
// x on the segment a..b at height y.
const xAt = (a, b, y) => a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]);
const barsUp = { t: 'keys', on: ['b0', 'b1', 'b2'], by: true, o: [12, 18.5], sy: [0.15, 1.06], stagger: 70 };

const CHARTS = {
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
  },
  'chart-bar-horizontal': {
    allow: { optical: '竖轴是条形的基线，与统计图以横轴定位相同，按竖轴定位' },
    label: '条形图', key: 'square',
    plan: '主体：三根横条（直线端点，条尾表示数值）；辅助：左侧的竖轴。即统计图转过四分之一圈',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) { return [axis(g), ...bars(g, [[7, 11], [12, 3], [17, 8]])].map(turned); },
    light: ['b0', 'b1', 'b2'],
    fx: { t: 'keys', on: ['b0', 'b1', 'b2'], by: true, o: [5.5, 12], sx: [0.15, 1.06], stagger: 70 }
  },
  'chart-bar-stacked': {
    allow: { optical: '竖轴是条形的基线，与统计图以横轴定位相同，按竖轴定位' },
    label: '堆叠条形图', key: 'square',
    plan: '主体：三根横条，每根分前后两段，隔开 2（后段是叠上去的第二组数，线性双色里用浅色）；辅助：竖轴。即堆叠柱状图转过四分之一圈',
    weights: { [P]: 0.61, [S]: 0.39 },
    draw(g) {
      const foot = 21 - g.s - 2, cols = [[7, 11, 4], [12, 9, 3], [17, 13, 6]];
      return [
        axis(g),
        ...cols.map(([x, y], i) => line(g.seg(x, foot, x, y), { n: `l${i}`, role: P, cap: 'butt', part: 'bars' })),
        ...cols.map(([x, y, top], i) => line(g.seg(x, y - 2, x, top), { n: `u${i}`, role: P, cap: 'butt', part: 'bars' }))
      ].map(turned);
    },
    light: ['u0', 'u1', 'u2'],
    fx: { t: 'keys', on: [['l0', 'u0'], ['l1', 'u1'], ['l2', 'u2']], by: true, o: [5.5, 12], sx: [0.15, 1.06], stagger: 70 }
  },
  'chart-column-increasing': {
    anchor: 'base',
    label: '递增柱状图', key: 'square',
    plan: '主体：三根柱，从左到右升高（同统计，直线端点）；辅助：横轴',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) { return [axis(g), ...bars(g, [[7, 13], [12, 8], [17, 3]])]; },
    light: ['b0', 'b1', 'b2'],
    fx: barsUp
  },
  'chart-column-decreasing': {
    anchor: 'base',
    label: '递减柱状图', key: 'square',
    plan: '主体：三根柱，从左到右降低（同统计，直线端点）；辅助：横轴',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) { return [axis(g), ...bars(g, [[7, 3], [12, 8], [17, 13]])]; },
    light: ['b0', 'b1', 'b2'],
    fx: barsUp
  },
  'chart-histogram': {
    anchor: 'base',
    label: '直方图', key: 'square',
    plan: '主体：三个相连的直方块（外轮廓是阶梯形，底边落在横轴的位置）；细节：块之间的两条分隔线。面性中三块分开，隔 2',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g, ctx) {
      const { h } = g, xl = 3 + h, xr = 21 - h, yb = 21 - h;
      if (ctx?.variant === 'fill') {
        return [[3, 8, 11], [10, 14, 3], [16, 21, 8]].map(([x0, x1, y], i) => shell(g.box(x0, y, x1 - x0, 21 - y, [1.25, 1.25, 0, 0]), { n: `c${i}`, role: P, part: 'cols' }));
      }
      return [
        shell(g.polygon([[xl, yb], [xl, 11 + h], [9, 11 + h], [9, 3 + h], [15, 3 + h], [15, 8 + h], [xr, 8 + h], [xr, yb]], [0, 0.75, 0, 0.75, 0.75, 0, 0.75, 0]), { n: 'cols', role: P }),
        line(g.seg(9, 11 + h, 9, yb) + g.seg(15, 8 + h, 15, yb), { n: 'div', role: D, on: 'cols' })
      ];
    },
    fx: { t: 'keys', on: 'all', o: [12, 21], sy: [0.3, 1.05], ms: 420 }
  },
  'chart-average': {
    anchor: 'base',
    label: '平均线', key: 'square',
    plan: '主体：横贯的平均线（压在柱上，切开间隙）和三根柱（同统计）；辅助：横轴',
    weights: { [P]: 0.68, [S]: 0.32 },
    draw(g) {
      return [axis(g), ...bars(g, [[7, 14], [12, 3], [17, 5]]), line(g.span(3, 11, 21, 11), { n: 'avg', role: P, gap: true })];
    },
    light: ['avg'],
    // 平均线从左画到右
    fx: { t: 'draw', on: ['avg'] }
  },
  'chart-combined': {
    anchor: 'base',
    label: '组合图', key: 'square',
    plan: '主体：三根矮柱（同统计）和柱上方的折线；辅助：横轴',
    weights: { [P]: 0.64, [S]: 0.36 },
    draw(g) {
      return [axis(g), ...bars(g, [[7, 13], [12, 10], [17, 12]]), line(g.pl([[4, 10], [9, 5], [14, 7], [20, 4]]), { n: 'line', role: P })];
    },
    light: ['b0', 'b1', 'b2'],
    fx: [barsUp, { t: 'draw', on: ['line'] }]
  },
  'chart-line-dots': {
    anchor: 'base',
    label: '数据点折线图', key: 'square',
    plan: '主体：折线和四个数据点（实心圆点压在折线的拐点上）；辅助：横轴',
    weights: { [P]: 0.64, [S]: 0.36 },
    draw(g) {
      const pts = [[5, 14], [9.5, 9], [14, 13], [19, 5]], r = 1.25 * g.dr;
      return [axis(g), line(g.pl(pts), { n: 'line', role: P }), ...pts.map(([x, y], i) => solid(g.circ(x, y, r), { n: `p${i}`, role: P }))];
    },
    light: ['line'],
    fx: [{ t: 'draw', on: ['line'] }, ...[[5, 14], [9.5, 9], [14, 13], [19, 5]].map(([x, y], i) => ({ t: 'keys', on: [`p${i}`], o: [x, y], s: [1.35], ms: 220 }))]
  },
  'chart-line-up': {
    label: '增长趋势', key: 'square',
    plan: '主体：向右上的折线箭头（同上涨）；辅助：左侧和底部的坐标轴。坐标轴是两条整线，墨量比折线多',
    weights: { [P]: 0.44, [S]: 0.56 },
    draw(g) { return [axes(g), ...arrowLine(g, [[8, 13], [11, 10], [14, 13], [20, 7]])]; },
    light: ['line', 'head'],
    fx: { t: 'draw', on: ['line', 'head'] }
  },
  'chart-line-down': {
    label: '下降趋势', key: 'square',
    plan: '主体：向右下的折线箭头（同下跌）；辅助：左侧和底部的坐标轴。坐标轴是两条整线，墨量比折线多',
    weights: { [P]: 0.44, [S]: 0.56 },
    draw(g) { return [axes(g), ...arrowLine(g, [[8, 7], [11, 10], [14, 7], [20, 13]])]; },
    light: ['line', 'head'],
    fx: { t: 'draw', on: ['line', 'head'] }
  },
  'chart-spline': {
    anchor: 'base',
    label: '曲线图', key: 'square',
    plan: '主体：平滑的曲线（一笔，起伏后升高）；辅助：横轴（同折线图）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) { return [axis(g), line('M4 16C5 13.5 6.5 8 9.5 8C12.5 8 12.5 12 15 12C17.5 12 19.5 6.5 20 4', { n: 'line', role: P })]; },
    light: ['line'],
    fx: { t: 'draw', on: ['line'] }
  },
  'chart-step': {
    anchor: 'base',
    label: '阶梯图', key: 'square',
    plan: '主体：阶梯折线（一笔，只有横竖两个方向）；辅助：横轴',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) { return [axis(g), line(g.pl([[4, 16], [8, 16], [8, 11], [13, 11], [13, 14], [17, 14], [17, 4], [20, 4]]), { n: 'line', role: P })]; },
    light: ['line'],
    fx: { t: 'draw', on: ['line'] }
  },
  'chart-network': {
    nudge: [0, -1],
    label: '关系图', key: 'live',
    plan: '主体：三个节点（圆环，排成三角形）；辅助：节点之间的三条连线（两端接到圆环上）。两个节点在下，整体上移 1',
    weights: { [P]: 0.74, [S]: 0.26 },
    draw(g) {
      const R = 4, N = [[12, 5], [6, 17], [18, 17]], e = R - g.h;
      const link = ([ax, ay], [bx, by]) => { const L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L; return g.seg(ax + ux * e, ay + uy * e, bx - ux * e, by - uy * e); };
      return [
        line(link(N[0], N[1]) + link(N[1], N[2]) + link(N[2], N[0]), { n: 'links', role: S }),
        ...N.map(([x, y], i) => shell(g.ring(x, y, R), { n: `n${i}`, role: P }))
      ];
    },
    // 连线依次画出
    fx: { t: 'draw', on: ['links'] }
  },
  'chart-radar': {
    label: '雷达图', key: 'circle',
    plan: '主体：数据多边形（不规则五边形，在网格里面，各边离网格至少 1.5）；辅助：五边形网格',
    weights: { [P]: 0.36, [S]: 0.64 },
    draw(g) {
      const R = 11.2, cy = 22 - R * Math.cos(Math.PI / 5), at = (k, r) => { const a = ((-90 + 72 * k) * Math.PI) / 180; return [12 + r * Math.cos(a), cy + r * Math.sin(a)]; };
      const web = inset([0, 1, 2, 3, 4].map((k) => at(k, R)), g.h), f = [0.43, 0.3, 0.42, 0.24, 0.38];
      return [
        shell(g.polygon(web, 1.6), { n: 'web', role: S }),
        shell(g.polygon(f.map((v, k) => at(k, v * R)), 0.6), { n: 'data', role: P, on: 'web' })
      ];
    },
    fx: { t: 'keys', on: ['data'], o: [12, 12.94], s: [0.5, 1.12], ms: 420 }
  },
  'chart-waterfall': {
    anchor: 'base',
    label: '瀑布图', key: 'square',
    plan: '主体：四根柱（直线端点）：首尾两根从横轴立起，中间两根悬空，接着上一根的顶端升高再回落；辅助：横轴',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const foot = 21 - g.s - 2, col = (x, y0, y1, i) => line(g.seg(x, y0, x, y1), { n: `b${i}`, role: P, cap: 'butt', part: 'bars' });
      return [axis(g), col(6, foot, 11, 0), col(10, 11, 3, 1), col(14, 3, 9, 2), col(18, foot, 9, 3)];
    },
    light: ['b0', 'b1', 'b2', 'b3'],
    // 一根接一根落下
    fx: { t: 'keys', on: ['b0', 'b1', 'b2', 'b3'], by: true, y: [-1.5, 0.3], stagger: 80 }
  },
  heatmap: {
    label: '热力图', key: 'square',
    plan: '主体：方框和三个高亮的格子（实心，连成一块，说明热度）；细节：横竖各两条格线。面性中其余六格镂空，高亮的格子留着',
    weights: { [P]: 0.5, [D]: 0.5 },
    draw(g, ctx) {
      // fill: the cold cells are holes, a stroke in from the outer edge; outline: the hot cells run into the frame
      const { s, h } = g, fill = ctx?.variant === 'fill', o = fill ? s : h, e = [3 + o, 9 - h, 9 + h, 15 - h, 15 + h, 21 - o], hot = ['0,1', '1,1', '1,2'];
      const cell = (i, j) => [e[2 * j], e[2 * i], e[2 * j + 1] - e[2 * j], e[2 * i + 1] - e[2 * i]];
      // the outer corner of a corner cell follows the inside of the frame
      const round = (i, j) => { const c = Math.max(0, 4.5 - o); return [i === 0 && j === 0 ? c : 0, i === 0 && j === 2 ? c : 0, i === 2 && j === 2 ? c : 0, i === 2 && j === 0 ? c : 0]; };
      const cells = [];
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) cells.push([i, j]);
      const frame = shell(g.box(3, 3, 18, 18, 4.5), { n: 'frame', role: P });
      if (fill) return [frame, ...cells.filter(([i, j]) => !hot.includes(`${i},${j}`)).map(([i, j]) => solid(g.area(...cell(i, j), round(i, j)), { n: `c${i}${j}`, role: D, on: 'frame' }))];
      return [
        frame,
        line(g.seg(9, 3 + h, 9, 21 - h) + g.seg(15, 3 + h, 15, 21 - h) + g.seg(3 + h, 9, 21 - h, 9) + g.seg(3 + h, 15, 21 - h, 15), { n: 'grid', role: D, on: 'frame' }),
        ...hot.map((k, i) => { const [a, b] = k.split(',').map(Number); return solid(g.area(...cell(a, b), round(a, b)), { n: `h${i}`, role: P, on: 'frame', vc: i }); })
      ];
    },
    fx: { t: 'variable', on: ['h0', 'h1', 'h2'], mode: 'iterative', step: 140 }
  },
  treemap: {
    label: '矩形树图', key: 'square',
    plan: '主体：方框；细节：分割线（一竖贯通，右侧一横，右下再一竖），分出大小不同的四块。面性中分割线切出外缘，四块分开',
    weights: { [P]: 0.58, [D]: 0.42 },
    draw(g, ctx) {
      const { h } = g, fill = ctx?.variant === 'fill', lo = fill ? 0 : 3 + h, hi = fill ? 24 : 21 - h;
      return [
        shell(g.box(3, 3, 18, 18, 4.5), { n: 'frame', role: P }),
        line(g.seg(10, lo, 10, hi), { n: 'v1', role: D, on: 'frame', ends: 'keep', through: fill, part: 'div' }),
        line(g.seg(10, 11, hi, 11), { n: 'h1', role: D, on: 'frame', ends: 'keep', through: fill, part: 'div' }),
        line(g.seg(15, 11, 15, hi), { n: 'v2', role: D, on: 'frame', ends: 'keep', through: fill, part: 'div' })
      ];
    },
    fx: { t: 'draw', on: ['v1', 'h1', 'v2'] }
  },
  'chart-bubble': {
    anchor: 'base',
    label: '气泡图', key: 'square',
    plan: '主体：大小不同的三个气泡（大、中两个圆环，小的是实心点）；辅助：横轴',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      return [
        axis(g),
        shell(g.ring(8, 12, 5), { n: 'p0', role: P }),
        shell(g.ring(17.5, 6.5, 3.5), { n: 'p1', role: P }),
        solid(g.circ(16.5, 14.5, 1.25 * g.dr), { n: 'p2', role: P })
      ];
    },
    fx: [{ t: 'keys', on: ['p0'], o: [8, 12], s: [1.12], ms: 260 }, { t: 'keys', on: ['p1'], o: [17.5, 6.5], s: [1.2], ms: 320 }, { t: 'keys', on: ['p2'], o: [16.5, 14.5], s: [1.4], ms: 380 }]
  },
  'chart-pyramid': {
    anchor: 'base',
    label: '金字塔图', key: 'square',
    ends: 'in',
    plan: '主体：三角形外框（斜边是金字塔本身需要的，立在底边上）；细节：两条横线，分成三层（同漏斗图，上下翻转）',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g) {
      const T = inset([[12, 0.4], [22.7, 21], [1.3, 21]], g.h), side = (y) => xAt(T[2], T[0], y);
      return [
        shell(g.polygon(T, [1, 1.75, 1.75]), { n: 'pyramid', role: P }),
        line(g.seg(side(10), 10, 24 - side(10), 10), { n: 'd0', role: D, on: 'pyramid' }),
        line(g.seg(side(15), 15, 24 - side(15), 15), { n: 'd1', role: D, on: 'pyramid' })
      ];
    },
    fx: { t: 'draw', on: ['d0', 'd1'] }
  },
  'chart-boxplot': {
    label: '箱线图', key: 'square',
    ends: 'out',
    plan: '主体：两个箱体；辅助：上下的须线；细节：箱里的中位线（接到箱的两侧，面性中切出外缘）',
    weights: { [P]: 0.6, [S]: 0.2, [D]: 0.2 },
    draw(g) {
      const { h } = g, plot = (x, t, y0, y1, b, k) => [
        line(g.span(x, t, x, y0 + h) + g.span(x, y1 - h, x, b), { n: `w${k}`, role: S }),
        shell(g.box(x - 4, y0, 8, y1 - y0, 1.75), { n: `b${k}`, role: P }),
        line(g.seg(x - 4 + h, (y0 + y1) / 2, x + 4 - h, (y0 + y1) / 2), { n: `m${k}`, role: D, on: `b${k}` })
      ];
      return [...plot(7, 3, 6, 16, 20, 0), ...plot(17, 4, 8, 18, 21, 1)];
    },
    // 数据更新：两组箱线先后上下跳动
    fx: { t: 'keys', on: [['w0', 'b0', 'm0'], ['w1', 'b1', 'm1']], by: true, y: [-1.2, 0.4], stagger: 90 }
  },
  'trending-up-down': {
    nudge: [-1, 0],
    label: '涨跌', key: 'live',
    light: [],
    plan: '主体：折线在谷底分成两支，一支向右上、一支向右下，各带箭头（同上涨、下跌：45° 折线，箭头两条腿沿横竖方向）。向下的一支与谷底隔开。两个箭头都在右侧，整体左移 1（同上涨）',
    weights: { [P]: 1 },
    draw(g) {
      return [
        line(g.pl([[1 + g.h, 13], [6, 9], [10, 13], [20, 3]]), { n: 'up', role: P }),
        line(g.pl([[15, 3], [20, 3], [20, 8]]), { n: 'uphead', role: P }),
        line(g.seg(13, 16, 18, 21), { n: 'down', role: P }),
        line(g.pl([[13, 21], [18, 21], [18, 16]]), { n: 'downhead', role: P })
      ];
    },
    fx: { t: 'draw', on: ['up', 'uphead', 'down', 'downhead'] }
  },
  'target-arrow': {
    label: '目标达成', key: 'circle',
    plan: '主体：外圈（同靶心）；辅助：中圈和射中靶心的箭（箭杆从右上斜插到中心，尾部两片箭羽，挡住后面的圆环。面性中不画箭羽，免得切出碎块）',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g, ctx) {
      // fill: the shaft runs on until its clear band is past the disc, so the band's end leaves no scraps
      const t = ctx?.variant === 'fill' ? 9.4 : 8;
      return [
        shell(g.ring(12, 12, 10), { n: 'outer', role: P }),
        shell(g.ring(12, 12, 6), { n: 'mid', role: S, on: 'outer' }),
        line(g.seg(12, 12, 12 + t, 12 - t), { n: 'shaft', role: S, occ: true, part: 'arrow' }),
        line(g.pl([[17, 3.5], [17, 7], [20.5, 7]]), { n: 'tail', role: S, occ: true, part: 'arrow', only: 'outline' })
      ];
    },
    light: ['shaft', 'tail'],
    allow: { sliver: '箭杆的间隙斜着切过外圈，切口两侧是斜角，与斜线变体相同；不是夹出来的碎块' },
    // 箭射中靶心：箭从右上飞入，靶面一震
    fx: [{ t: 'from', on: ['shaft', 'tail'], x: 3, y: -3, a: 0 }, { t: 'keys', on: ['outer', 'mid'], o: [12, 12], s: [0.94], ms: 200 }]
  },
  'circle-gauge': {
    label: '圆形仪表', key: 'circle',
    plan: '主体：表盘（右上留口的圆弧）；辅助：从中心穿过缺口的指针和中心轴（实心点）',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      const { h } = g, a = (-45 * Math.PI) / 180, L = 9.9 - h;
      return [
        line(g.arc(12, 12, 10 - h, -20, 290), { n: 'dial', role: P }),
        line(g.seg(12, 12, 12 + L * Math.cos(a), 12 + L * Math.sin(a)), { n: 'needle', role: S, part: 'needle' }),
        solid(g.dot(12, 12, 1.25), { n: 'hub', role: S, part: 'needle' })
      ];
    },
    area: (g) => [{ n: 'dial', d: g.circ(12, 12, 10 - g.h) }],
    // 读数：指针摆向低处再回到满格
    fx: { t: 'keys', on: ['needle', 'hub'], o: [12, 12], r: [-80, 10], ms: 600 }
  }
};

export default {
  ...CHARTS,
  'square-activity': { ...enclose(CHARTS.activity, 'square', { label: '动态（方形）', k: 0.5 }), fx: { t: 'draw', on: ['pulse'] }, allow: { sliver: '心电折线尖角内侧的细处是折线本身的形状，不是镂空切出来的' } }
};
