// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// layout: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: app-window kanban layout-dashboard columns rows grid sidebar panel-bottom list-view gallery-view
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// One window frame for the whole family: the landscape key shape with the corner of image, mail
// and inbox (4). Dividers sit on whole pixels at the same places in every icon:
//   thirds   x 9 and 15 (three cells 4 wide inside), y 9 and 15 (a bar 2 high top or bottom)
//   halves   x 12, y 12
// A divider runs from the inside of the frame on one side to the other, so it joins the frame.
const frame = (g) => shell(g.box(2, 4, 20, 16, 4), { n: 'frame', role: P });
const hz = (g, y, n0, x0 = 2 + g.s, x1 = 22 - g.s) => line(g.seg(x0, y, x1, y), { n: n0, role: D, on: 'frame' });
const vt = (g, x, n0, y0 = 4 + g.s, y1 = 20 - g.s) => line(g.seg(x, y0, x, y1), { n: n0, role: D, on: 'frame' });

// A small chevron in a pane (open or close a panel): legs a along and 3 across, its vertex at
// (cx, cy) shifted half its depth forward, pointing along u. In the short panes of the top and
// bottom panels the depth gives way at heavy weights, so it keeps 1.5 clear of the lines.
const paneChev = (g, cx, cy, u, a = 3) => {
  const v = [-u[1], u[0]], V = [cx + (u[0] * a) / 2, cy + (u[1] * a) / 2], B = [V[0] - u[0] * a, V[1] - u[1] * a];
  return line(`M${n(B[0] + v[0] * 3)} ${n(B[1] + v[1] * 3)}L${n(V[0])} ${n(V[1])}L${n(B[0] - v[0] * 3)} ${n(B[1] - v[1] * 3)}`, { n: 'chev', role: D, on: 'frame' });
};
// (outline: 1.5 clear of the lines; fill: a stroke of ink between the holes and the edge)
const shortDepth = (g) => Math.min(3, 11 - 2.5 * g.s - 2 * g.clear, 11 - 3.5 * g.s);
// A side panel (divider at x) with a chevron in the main pane pointing along dx: the panel opens
// (the chevron points away from it) or closes (toward it).
function sidePanel(x, dx, label, open) {
  const cx = x < 12 ? 15 : 9;
  return {
    label, key: 'landscape', ends: 'in',
    plan: `主体：窗口外框；细节：${x < 12 ? '左' : '右'}侧边栏的竖线（x ${x}），以及主区域中间的小折角（指向${dx > 0 ? '右' : '左'}，表示${open ? '展开' : '收起'}侧边栏）`,
    weights: { [P]: 0.76, [D]: 0.24 },
    draw(g) { return [frame(g), vt(g, x, 'v'), paneChev(g, cx, 12, [dx, 0])]; },
    // the panel slides out to its place (open) or folds away and back (close); the chevron points
    fx: [open ? { t: 'from', on: ['v'], x: x < 12 ? -4 : 4 } : { t: 'keys', on: ['v'], x: [x < 12 ? -3.5 : 3.5, 0.3] }, { t: 'keys', on: ['chev'], x: [dx * 1.2, -dx * 0.2] }]
  };
}
// A top or bottom panel (divider at y) with a chevron in the other pane pointing along dy.
function endPanel(y, dy, label, open) {
  return {
    label, key: 'landscape', ends: 'in',
    plan: `主体：窗口外框；细节：${y < 12 ? '顶部' : '底部'}面板的横线（y ${y}），以及另一块区域中间的小折角（指向${dy > 0 ? '下' : '上'}，表示${open ? '展开' : '收起'}面板）；区域矮，粗字重下折角变浅，与横线和外框仍留 1.5`,
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g, ctx) {
      // the chevron sits in the middle of the free pane: between the divider and the frame's
      // inner edge, or in the fill between the divider's hole and the outer edge
      const { h } = g, e = ctx?.variant === 'fill' ? 0 : g.s, cy = y < 12 ? (y + h + 20 - e) / 2 : (4 + e + y - h) / 2;
      return [frame(g), hz(g, y, 'h'), paneChev(g, 12, cy, [0, dy], shortDepth(g))];
    },
    fx: [open ? { t: 'from', on: ['h'], y: y < 12 ? -4 : 4 } : { t: 'keys', on: ['h'], y: [y < 12 ? -3 : 3, 0.3] }, { t: 'keys', on: ['chev'], y: [dy * 0.8, -dy * 0.15] }]
  };
}

// Tiles: rounded squares and bars laid out in the square 3..21 with 2 between them.
const tile = (g, x0, y0, x1, y1, nm, role = P) => shell(g.box(x0, y0, x1 - x0, y1 - y0, Math.min(2, Math.round(Math.min(x1 - x0, y1 - y0) * 0.24 * 4) / 4)), { n: nm, role });
function tiles(label, plan, boxes, weights = { [P]: 1 }) {
  return {
    label, key: 'square', plan, weights,
    draw(g) { return boxes.map(([a, b, c, d, r], i) => tile(g, a, b, c, d, `t${i}`, r)); },
    // the tiles fall into place one after another
    fx: { t: 'keys', on: boxes.map((_, i) => [`t${i}`]), by: true, stagger: 70, o: [12, 12], s: [0.86, 1.03] }
  };
}


// Align and distribute objects: rounded bars by an axis line, drawn with the axis upright (the
// bars lie across it, one longer than the other) and transposed for the horizontal axis.
const TR = { v: (p) => p, h: ([x, y]) => [y, x] };
const bar = (g, T, x0, y0, x1, y1, nm) => { const [a, b] = [T([x0, y0]), T([x1, y1])]; return shell(g.box(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), 1.75), { n: nm, role: P }); };
const axisLine = (g, T, x, y0, y1, nm) => { const [a, b] = [T([x, y0]), T([x, y1])]; return line(g.seg(a[0], a[1], b[0], b[1]), { n: nm, role: S }); };
// align: the bars (7 thick, 2 apart) laid against the axis at the start, across it at the centre,
// or against it at the end.
function alignTo(axis, at, label) {
  const T = TR[axis], d = axis === 'v' ? 'x' : 'y';
  const [top, bot, ax] = { start: [[6, 22], [6, 14], 3], center: [[2, 22], [6, 18], 12], end: [[2, 18], [10, 18], 21] }[at];
  const side = { start: axis === 'v' ? '左' : '上', center: '中', end: axis === 'v' ? '右' : '下' }[at];
  return {
    label, key: 'live',
    plan: `主体：一长一短两根圆角条（厚 7，相距 2）；辅助：${axis === 'v' ? '竖' : '横'}向的对齐线（${side}${at === 'center' ? '线穿过两根条' : '侧，两根条贴着它'}）`,
    weights: at === 'center' ? { [P]: 0.8, [S]: 0.2 } : { [P]: 0.76, [S]: 0.24 },
    draw(g) {
      const { h } = g;
      return [axisLine(g, T, ax, 2 + h, 22 - h, 'axis'), bar(g, T, top[0], 4, top[1], 11, 'b0'), bar(g, T, bot[0], 13, bot[1], 20, 'b1')];
    },
    // the shorter bar comes in from out of line and settles against the axis
    fx: { t: 'from', on: ['b1'], [d]: { start: 4, center: 3, end: -4 }[at] }
  };
}
// distribute: two bars (8 thick, 2 apart, one longer) standing across the axis, spread out
// (center: a line through the middle of each), pushed to the ends (between: a line at each end,
// on the bars' outer sides) or gathered about a centre line (justify).
function distribute(axis, how, label) {
  const T = TR[axis], d = axis === 'v' ? 'y' : 'x';
  // points are given as [along, across]: the bars stand upright side by side in the horizontal
  // family and lie one above the other in the vertical one
  const H = (p) => T(p);
  const plans = {
    center: '主体：一高一矮两根竖条（宽 8，相距 4）；辅助：每根条中线上下伸出的短线，表示按中心等距分布',
    between: '主体：一高一矮两根竖条，分别贴着两端；辅助：两端的竖线，与竖条外侧重合，表示两端分布',
    justify: '主体：一高一矮两根竖条，分在中线两侧；辅助：中间的竖线，表示向中间排列'
  };
  const across = axis === 'v' ? (s) => s.replace(/竖条/g, '横条').replace(/竖线/g, '横线').replace('上下伸出', '左右伸出') : (s) => s;
  return {
    label, key: 'live',
    plan: across(plans[how]),
    weights: { center: { [P]: 0.78, [S]: 0.22 }, between: { [P]: 0.78, [S]: 0.22 }, justify: { [P]: 0.8, [S]: 0.2 } }[how],
    draw(g) {
      const { h } = g;
      // bars by their outer edges: [x0, x1] across, [y0, y1] along
      const B = { center: [[2, 10, 5, 19], [14, 22, 7, 17]], between: [[2, 9, 5, 19], [15, 22, 7, 17]], justify: [[2, 9, 5, 19], [15, 22, 7, 17]] }[how];
      const bars = B.map(([x0, x1, y0, y1], i) => { const [a, b] = [H([y0, x0]), H([y1, x1])]; return shell(g.box(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), 1.75), { n: `b${i}`, role: P }); });
      const seg = (x, y0, y1, nm) => { const [a, b] = [H([y0, x]), H([y1, x])]; return line(g.seg(a[0], a[1], b[0], b[1]), { n: nm, role: S }); };
      const lines = how === 'center' ? B.map(([x0, x1, y0, y1], i) => { const c = (x0 + x1) / 2, a = H([2 + h, c]), b = H([y0 + h, c]), e = H([y1 - h, c]), f = H([22 - h, c]); return line(g.seg(a[0], a[1], b[0], b[1]) + g.seg(e[0], e[1], f[0], f[1]), { n: `l${i}`, role: S }); })
        : how === 'between' ? [seg(2 + h, 2 + h, 22 - h, 'l0'), seg(22 - h, 2 + h, 22 - h, 'l1')] : [seg(12, 2 + h, 22 - h, 'l0')];
      return [...lines, ...bars];
    },
    fx: how === 'center' ? [{ t: 'keys', on: ['b0', 'l0'], [d]: [-1.2, 0] }, { t: 'keys', on: ['b1', 'l1'], [d]: [1.2, 0] }]
      : how === 'between' ? [{ t: 'from', on: ['b0'], [d]: 4 }, { t: 'from', on: ['b1'], [d]: -4 }]
        : [{ t: 'from', on: ['b0'], [d]: -2 }, { t: 'from', on: ['b1'], [d]: 2 }]
  };
}


// The four corners of a selection or a screen (group, fullscreen): an L in each corner of the
// square 3..21, legs 5 by the ink, rounded with the corner of the square.
const corners4 = (g) => {
  const { h } = g, r = 3.5 - h, K = 5 - 2 * h;
  return [[3 + h, 3 + h, 1, 1], [21 - h, 3 + h, -1, 1], [21 - h, 21 - h, -1, -1], [3 + h, 21 - h, 1, -1]].map(([x, y, sx, sy], i) =>
    line(`M${n(x)} ${n(y + sy * K)}V${n(y + sy * r)}A${n(r)} ${n(r)} 0 0 ${sx * sy > 0 ? 1 : 0} ${n(x + sx * r)} ${n(y)}H${n(x + sx * K)}`, { n: `c${i}`, role: S }));
};
// Dots of a drag handle, centres given; a little larger than list dots so the grid reads.
const dots = (g, xs, ys) => xs.flatMap((x) => ys.map((y) => [x, y])).map(([x, y], i) => solid(g.dot(x, y, 1.25), { n: `d${i}`, role: P }));
function gripOf(xs, ys, label, plan, fx, fit) {
  return { label, key: 'square', ...(fit ? { fit } : {}), plan, weights: { [P]: 1 }, draw(g) { return dots(g, xs, ys); }, fx };
}
// Half a square split in two: a bracket open toward the split, its ends 4 from the centre line.
const halfBox = (g, T, right) => {
  const { h } = g, c = 4.25 - h, x0 = right ? 21 - h : 3 + h, sx = right ? -1 : 1, xe = right ? 16 : 8, y0 = 3 + h, y1 = 21 - h;
  const P0 = [[xe, y0], [x0 + sx * c, y0], [x0, y0 + c], [x0, y1 - c], [x0 + sx * c, y1], [xe, y1]].map(T);
  const sw = right ? 1 : 0, t = (p) => `${n(p[0])} ${n(p[1])}`, flip = T([0, 1])[0] === 1;
  const w = flip ? 1 - sw : sw;
  return `M${t(P0[0])}L${t(P0[1])}A${n(c)} ${n(c)} 0 0 ${w} ${t(P0[2])}L${t(P0[3])}A${n(c)} ${n(c)} 0 0 ${w} ${t(P0[4])}L${t(P0[5])}`;
};
function splitSquare(vertical, label) {
  const T = vertical ? ([x, y]) => [y, x] : (p) => p;
  return {
    label, key: 'square',
    plan: `主体：方块分成${vertical ? '上下' : '左右'}两半（两个开口相对的半框，与方块同圆角）；辅助：中间的分隔线，与两半各相距 4`,
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      const { h } = g, a = T([12, 3 + h]), b = T([12, 21 - h]);
      return [line(halfBox(g, T, false), { n: 'p0', role: P }), line(halfBox(g, T, true), { n: 'p1', role: P }), line(g.seg(a[0], a[1], b[0], b[1]), { n: 'split', role: S })];
    },
    area: (g) => [{ n: 'p0', d: g.box(3, 3, 18, 18, 4.25) }],
    // the halves part from the split and come back
    fx: [{ t: 'keys', on: ['p0'], [vertical ? 'y' : 'x']: [-1.2, 0] }, { t: 'keys', on: ['p1'], [vertical ? 'y' : 'x']: [1.2, 0] }]
  };
}
// Three squares in a stack: two at opposite corners and one across the middle, either the middle
// one in front (bring to front) or behind both (send to back).
function stack3(front, label) {
  return {
    label, key: 'square',
    plan: front ? '主体：中间的方块（8），在最前面；辅助：左上和右下两个方块（8），被它挡住一角'
      : '主体：左上和右下两个方块（9，角对角），在前面；辅助：中间的方块（10），在最后面，只露出右上和左下两小角，墨量少',
    weights: front ? { [P]: 0.5, [S]: 0.5 } : { [P]: 0.86, [S]: 0.14 },
    draw(g) {
      // send to back: the two front squares are one layer, so they never cut each other
      const k = front ? 8 : 9, c = front ? 2 : 2.25, o = front ? {} : { occ: true, part: 'front' };
      const tl = shell(g.box(3, 3, k, k, c), { n: 'tl', role: front ? S : P, ...o }), br = shell(g.box(21 - k, 21 - k, k, k, c), { n: 'br', role: front ? S : P, ...o });
      const mid = front ? shell(g.box(8, 8, 8, 8, 2), { n: 'mid', role: P, occ: true }) : shell(g.box(7, 7, 10, 10, 2.5), { n: 'mid', role: S });
      return front ? [tl, br, mid] : [mid, tl, br];
    },
    fx: front ? { t: 'keys', on: ['mid'], o: [12, 12], s: [1.12, 0.98] } : { t: 'keys', on: ['mid'], o: [12, 12], s: [0.8, 1.02] }
  };
}


export default {
  'app-window': {
    label: '应用窗口', key: 'landscape',
    ends: 'in',
    plan: '主体：窗口外框；细节：标题栏的分隔线（y 9）',
    weights: { [P]: 0.84, [D]: 0.16 },
    draw(g) { return [frame(g), hz(g, 9, 'bar')]; },
    // 打开窗口: the window grows open from its title bar
    fx: { t: 'keys', on: 'all', o: [12, 6], sy: [0.82], s: [0.96], ms: 220 }
  },
  kanban: {
    label: '看板', key: 'landscape',
    plan: '主体：窗口外框；细节：三列长短不一的卡片条（从同一条顶线往下）',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g) {
      return [frame(g), ...[[7, 16], [12, 12.5], [17, 14.5]].map(([x, y], i) => line(g.span(x, 8, x, y), { n: `c${i}`, role: D, on: 'frame' }))];
    },
    fx: { t: 'keys', on: ['c0', 'c1', 'c2'], by: true, o: [12, 8], sy: [0.35, 1.06], stagger: 80 }
  },
  'layout-dashboard': {
    label: '数据看板', key: 'landscape',
    ends: 'in',
    plan: '主体：窗口外框；细节：中间一条竖线（x 12），左栏在 y 15、右栏在 y 9 各分一格，四格错开',
    weights: { [P]: 0.66, [D]: 0.34 },
    draw(g) { return [frame(g), vt(g, 12, 'v'), hz(g, 15, 'hl', 2 + g.s, 12), hz(g, 9, 'hr', 12, 22 - g.s)]; },
    fx: [{ t: 'keys', on: ['hl'], y: [-2.5, 0.3] }, { t: 'keys', on: ['hr'], y: [2.5, -0.3] }]
  },
  columns: {
    label: '分栏', key: 'landscape',
    ends: 'in',
    plan: '主体：窗口外框；细节：两条竖线（x 9 和 15），分成三栏等宽',
    weights: { [P]: 0.67, [D]: 0.33 },
    draw(g) { return [frame(g), vt(g, 9, 'v1'), vt(g, 15, 'v2')]; },
    fx: { t: 'draw', on: ['v1', 'v2'] }
  },
  rows: {
    label: '分行', key: 'landscape',
    ends: 'in',
    plan: '主体：窗口外框；细节：中间一条横线（y 12），分成上下两行',
    weights: { [P]: 0.84, [D]: 0.16 },
    draw(g) { return [frame(g), hz(g, 12, 'h')]; },
    fx: { t: 'draw', on: ['h'] }
  },
  grid: {
    label: '网格', key: 'landscape',
    ends: 'in',
    plan: '主体：窗口外框；细节：中间的竖线和横线（x 12、y 12），分成四格',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g) { return [frame(g), vt(g, 12, 'v'), hz(g, 12, 'h')]; },
    fx: { t: 'draw', on: ['v', 'h'] }
  },
  sidebar: {
    label: '侧边栏', key: 'landscape',
    ends: 'in',
    plan: '主体：窗口外框；细节：左侧边栏的竖线（x 9，与分栏的第一条线同位）',
    weights: { [P]: 0.87, [D]: 0.13 },
    draw(g) { return [frame(g), vt(g, 9, 'v')]; },
    // 收起再展开侧边栏
    fx: { t: 'keys', on: ['v'], x: [-3.5, 0.3] }
  },
  'panel-bottom': {
    label: '底部面板', key: 'landscape',
    ends: 'in',
    plan: '主体：窗口外框；细节：底部面板的横线（y 15，与标题栏上下对称）',
    weights: { [P]: 0.84, [D]: 0.16 },
    draw(g) { return [frame(g), hz(g, 15, 'h')]; },
    // 收起再拉起底部面板
    fx: { t: 'keys', on: ['h'], y: [2, -0.3] }
  },
  'list-view': {
    label: '列表视图', key: 'landscape',
    plan: '主体：窗口外框；细节：两行，每行一个实心圆点和一条字线',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g, ctx) {
      const { s } = g, r = Math.min(g.dr * 0.7, 1.15), fill = ctx?.variant === 'fill';
      // fill: the holes keep one stroke apart: the rows move apart, and the dot and its line
      // move apart evenly
      const dy = fill ? Math.max(2, s) : 2, ys = [12 - dy, 12 + dy], e = fill ? Math.max(0, s + r - 3) / 2 : 0;
      return [frame(g), ...ys.map((y, i) => solid(g.circ(7 - e, y, r), { n: `p${i}`, role: D, on: 'frame' })), ...ys.map((y, i) => line(g.span(10 + e, y, 18, y), { n: `l${i}`, role: D, on: 'frame' }))];
    },
    fx: { t: 'draw', on: ['l0', 'l1'] }
  },
  'gallery-view': {
    label: '画廊视图', key: 'landscape',
    ends: 'in',
    plan: '主体：窗口外框；细节：两条竖线（x 9、15）和一条横线（y 12），分成三列两行六格',
    weights: { [P]: 0.57, [D]: 0.43 },
    draw(g) { return [frame(g), vt(g, 9, 'v1'), vt(g, 15, 'v2'), hz(g, 12, 'h')]; },
    fx: { t: 'draw', on: ['h', 'v1', 'v2'] }
  },
  'panel-left-open': sidePanel(9, 1, '展开左侧栏', true),
  'panel-left-close': sidePanel(9, -1, '收起左侧栏', false),
  'panel-right': {
    label: '右侧栏', key: 'landscape',
    ends: 'in',
    plan: '主体：窗口外框；细节：右侧边栏的竖线（x 15，与分栏的第二条线同位）',
    weights: { [P]: 0.87, [D]: 0.13 },
    draw(g) { return [frame(g), vt(g, 15, 'v')]; },
    // 收起再展开右侧栏
    fx: { t: 'keys', on: ['v'], x: [3.5, -0.3] }
  },
  'panel-right-open': sidePanel(15, -1, '展开右侧栏', true),
  'panel-right-close': sidePanel(15, 1, '收起右侧栏', false),
  'panel-top-open': endPanel(9, 1, '展开顶部面板', true),
  'panel-top-close': endPanel(9, -1, '收起顶部面板', false),
  'panel-bottom-open': endPanel(15, -1, '展开底部面板', true),
  'panel-bottom-close': endPanel(15, 1, '收起底部面板', false),
  'panels-left-bottom': {
    label: '左栏和底栏', key: 'landscape', ends: 'in',
    plan: '主体：窗口外框；细节：左侧边栏的竖线（x 9，通到底），右边区域的底部面板横线（y 15，从竖线到右边）',
    weights: { [P]: 0.76, [D]: 0.24 },
    draw(g) { return [frame(g), vt(g, 9, 'v'), hz(g, 15, 'h', 9)]; },
    fx: [{ t: 'keys', on: ['v'], x: [-3, 0.3] }, { t: 'keys', on: ['h'], y: [2, -0.3] }]
  },
  'panels-right-bottom': {
    label: '右栏和底栏', key: 'landscape', ends: 'in',
    plan: '主体：窗口外框；细节：右侧边栏的竖线（x 15，通到底），左边区域的底部面板横线（y 15，从左边到竖线）',
    weights: { [P]: 0.76, [D]: 0.24 },
    draw(g) { return [frame(g), vt(g, 15, 'v'), hz(g, 15, 'h', undefined, 15)]; },
    fx: [{ t: 'keys', on: ['v'], x: [3, -0.3] }, { t: 'keys', on: ['h'], y: [2, -0.3] }]
  },
  'panels-top-left': {
    label: '顶栏和左栏', key: 'landscape', ends: 'in',
    plan: '主体：窗口外框；细节：顶栏横线（y 9，通到两边），顶栏下方左侧边栏的竖线（x 9）',
    weights: { [P]: 0.76, [D]: 0.24 },
    draw(g) { return [frame(g), hz(g, 9, 'h'), vt(g, 9, 'v', 9)]; },
    fx: [{ t: 'keys', on: ['h'], y: [-2, 0.3] }, { t: 'keys', on: ['v'], x: [-3, 0.3] }]
  },
  'layout-grid': tiles('宫格布局', '主体：四个圆角方块（各 8，间距 2），排成两行两列', [[3, 3, 11, 11], [13, 3, 21, 11], [3, 13, 11, 21], [13, 13, 21, 21]]),
  'layout-list': {
    label: '列表布局', key: 'square', nudge: [1, 0],
    plan: '主体：左边上下两个圆角方块（各 8，间距 2）；辅助：每个方块右边两条字线，与方块上下居中。方块的分量在左，整体右移 1',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      return [tile(g, 4, 3, 12, 11, 't0'), tile(g, 4, 13, 12, 21, 't1'), ...[5, 9, 15, 19].map((y, i) => line(g.span(15, y, 22, y), { n: `l${i}`, role: S }))];
    },
    fx: { t: 'draw', on: [['t0', 'l0', 'l1'], ['t1', 'l2', 'l3']] }
  },
  'layout-template': tiles('版式模板', '主体：上面一整条（18×8），下面左宽右窄两块（10×8、6×8），间距 2', [[3, 3, 21, 11], [3, 13, 13, 21], [15, 13, 21, 21]]),
  'layout-panel-left': tiles('左大右小布局', '主体：左边一条竖长块（8×18），右边上下两块（各 8），间距 2', [[3, 3, 11, 21], [13, 3, 21, 11], [13, 13, 21, 21]]),
  'layout-panel-top': tiles('上大下小布局', '主体：上面一条横长块（18×8），下面左右两块（各 8），间距 2', [[3, 3, 21, 11], [3, 13, 11, 21], [13, 13, 21, 21]]),
  'columns-2': {
    label: '两栏', key: 'landscape',
    ends: 'in',
    plan: '主体：窗口外框；细节：中间一条竖线（x 12），分成左右两栏',
    weights: { [P]: 0.87, [D]: 0.13 },
    draw(g) { return [frame(g), vt(g, 12, 'v')]; },
    fx: { t: 'draw', on: ['v'] }
  },
  'align-start-vertical': alignTo('v', 'start', '左对齐对象'),
  'align-center-vertical': alignTo('v', 'center', '水平居中对象'),
  'align-end-vertical': alignTo('v', 'end', '右对齐对象'),
  'align-start-horizontal': alignTo('h', 'start', '顶对齐对象'),
  'align-center-horizontal': alignTo('h', 'center', '垂直居中对象'),
  'align-end-horizontal': alignTo('h', 'end', '底对齐对象'),
  'align-horizontal-distribute-center': distribute('h', 'center', '水平等距分布'),
  'align-vertical-distribute-center': distribute('v', 'center', '垂直等距分布'),
  'align-horizontal-space-between': distribute('h', 'between', '水平两端分布'),
  'align-vertical-space-between': distribute('v', 'between', '垂直两端分布'),
  'align-horizontal-justify-center': distribute('h', 'justify', '水平居中排列'),
  'align-vertical-justify-center': distribute('v', 'justify', '垂直居中排列'),
  'grid-3x3': {
    label: '九宫格', key: 'square', ends: 'in',
    plan: '主体：方形外框（18）；细节：两条竖线和两条横线（x、y 各在 9 和 15），分成九格',
    weights: { [P]: 0.55, [D]: 0.45 },
    draw(g) {
      const { s } = g, f = shell(g.box(3, 3, 18, 18, 4.25), { n: 'frame', role: P });
      const l = (d, nm) => line(d, { n: nm, role: D, on: 'frame' });
      return [f, l(g.seg(9, 3 + s, 9, 21 - s), 'v1'), l(g.seg(15, 3 + s, 15, 21 - s), 'v2'), l(g.seg(3 + s, 9, 21 - s, 9), 'h1'), l(g.seg(3 + s, 15, 21 - s, 15), 'h2')];
    },
    fx: { t: 'draw', on: [['v1', 'h1'], ['v2', 'h2']] }
  },
  'app-windows': {
    label: '多窗口', key: 'live',
    plan: '主体：前面的窗口（15×12），带标题栏横线（细节）；辅助：后面错开的窗口（被前面的挡住，只露出上边和右边）',
    weights: { [P]: 0.5, [S]: 0.36, [D]: 0.14 },
    draw(g) {
      return [
        shell(g.box(6, 2, 16, 12, 3), { n: 'back', role: S }),
        shell(g.box(2, 10, 15, 12, 3), { n: 'front', role: P, occ: true }),
        line(g.seg(2 + g.s, 14, 17 - g.s, 14), { n: 'bar', role: D, on: 'front' })
      ];
    },
    ends: 'in',
    fx: [{ t: 'keys', on: ['front', 'bar'], x: [-0.9], y: [0.9] }, { t: 'keys', on: ['back'], x: [0.9], y: [-0.9] }]
  },
  ratio: {
    label: '比例', key: 'live',
    plan: '主体：前面的竖向矩形（10×20）；辅助：后面的横向矩形（20×10），被前面的挡住，只露出两侧。两种画幅交叉，表示切换比例',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      return [shell(g.box(2, 7, 20, 10, 2.5), { n: 'wide', role: S }), shell(g.box(7, 2, 10, 20, 2.5), { n: 'tall', role: P, occ: true })];
    },
    // the tall frame steps back and the wide one comes forward, then they settle
    fx: [{ t: 'keys', on: ['tall'], o: [12, 12], s: [0.9, 1.02] }, { t: 'keys', on: ['wide'], o: [12, 12], s: [1.06, 0.99] }]
  },
  group: {
    label: '编组', key: 'square',
    plan: '主体：两个错开叠放的方块（7，错开 4，前面的挡住后面的一角）；辅助：四角的选框折角',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g, ctx) {
      // In the fill only an L of the back square shows past the front one's clear band; the two
      // corners where it ends are no rounder than half the strip is wide, so no thin tip is left.
      // The corners come last, so the front square's clear band does not cut them.
      const e = ctx?.variant === 'fill' ? Math.min(2, (4 - g.g) / 2) : 2;
      return [shell(g.box(6, 6, 8, 8, [2, e, 2, e]), { n: 'a', role: P }), shell(g.box(10, 10, 8, 8, 2), { n: 'b', role: P, occ: true }), ...corners4(g)];
    },
    // the selection closes round the two objects
    fx: [{ t: 'keys', on: ['c0'], x: [-0.8, 0], y: [-0.8, 0] }, { t: 'keys', on: ['c1'], x: [0.8, 0], y: [-0.8, 0] }, { t: 'keys', on: ['c2'], x: [0.8, 0], y: [0.8, 0] }, { t: 'keys', on: ['c3'], x: [-0.8, 0], y: [0.8, 0] }]
  },
  ungroup: {
    label: '取消编组', key: 'square', fit: 'x',
    plan: '主体：两个分开的横向方块（10×7），左上一个、右下一个，上下相距 2',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.box(3, 4, 10, 7, 1.75), { n: 'a', role: P }), shell(g.box(11, 13, 10, 7, 1.75), { n: 'b', role: P })]; },
    fx: [{ t: 'keys', on: ['a'], x: [-1], y: [-0.8] }, { t: 'keys', on: ['b'], x: [1], y: [0.8] }]
  },
  frame: {
    label: '画框', key: 'live',
    plan: '主体：两条横线和两条竖线（在 6 和 18）交叉成井字，各伸出 4，表示设计稿的画框',
    weights: { [P]: 1 },
    draw(g) { return [line(g.span(2, 6, 22, 6) + g.span(2, 18, 22, 18), { n: 'h', role: P }), line(g.span(6, 2, 6, 22) + g.span(18, 2, 18, 22), { n: 'v', role: P })]; },
    fx: { t: 'draw', on: ['h', 'v'] }
  },
  fullscreen: {
    label: '全屏显示', key: 'square',
    plan: '主体：中间的屏幕（10×8 圆角矩形）；辅助：四角的折角，表示铺满',
    weights: { [P]: 0.45, [S]: 0.55 },
    draw(g) { return [...corners4(g), shell(g.box(7, 8, 10, 8, 2), { n: 'screen', role: P })]; },
    // the corners push out to the edges and the screen grows to meet them
    fx: [{ t: 'keys', on: ['screen'], o: [12, 12], s: [1.12, 0.99] }, { t: 'keys', on: ['c0'], x: [-0.6, 0], y: [-0.6, 0] }, { t: 'keys', on: ['c1'], x: [0.6, 0], y: [-0.6, 0] }, { t: 'keys', on: ['c2'], x: [0.6, 0], y: [0.6, 0] }, { t: 'keys', on: ['c3'], x: [-0.6, 0], y: [0.6, 0] }]
  },
  'square-split-horizontal': splitSquare(false, '左右分屏'),
  'square-split-vertical': splitSquare(true, '上下分屏'),
  'app-window-mac': {
    label: '桌面窗口', key: 'landscape',
    plan: '主体：窗口外框；细节：左上角的三个圆点（窗口按钮），间距 1.5',
    weights: { [P]: 0.84, [D]: 0.16 },
    draw(g) { return [frame(g), ...[7, 11, 15].map((x, i) => solid(g.circ(x, 9, 1.25), { n: `b${i}`, role: D, on: 'frame' }))]; },
    fx: { t: 'keys', on: [['b0'], ['b1'], ['b2']], by: true, stagger: 70, y: [-0.8, 0] }
  },
  dock: {
    label: '程序坞', key: 'landscape', ends: 'in',
    plan: '主体：屏幕外框；细节：顶部的菜单栏横线（y 9）和底部居中的一段短横线（程序坞，不碰边）',
    weights: { [P]: 0.75, [D]: 0.25 },
    draw(g) { return [frame(g), hz(g, 9, 'bar'), line(g.span(7, 15, 17, 15), { n: 'dock', role: D, on: 'frame' })]; },
    // the dock rises into view
    fx: { t: 'keys', on: ['dock'], y: [-1.2, 0.2] }
  },
  grip: gripOf([5, 12, 19], [5, 12, 19], '拖动手柄', '主体：九个实心圆点排成三行三列（间距 7），比列表圆点大一些', { t: 'orbit', on: 'all', R: 0.9 }),
  'grip-vertical': gripOf([8, 16], [5, 12, 19], '竖向拖动手柄', '主体：六个实心圆点排成三行两列，竖向拖动的手柄', { t: 'keys', on: 'all', y: [-1.2, 1, 0] }, 'y'),
  'grip-horizontal': gripOf([5, 12, 19], [8, 16], '横向拖动手柄', '主体：六个实心圆点排成两行三列，横向拖动的手柄', { t: 'keys', on: 'all', x: [-1.2, 1, 0] }, 'x'),
  'gallery-horizontal': {
    label: '横向轮播', key: 'live', fit: 'x',
    plan: '主体：中间的卡片（12×18）；辅助：两侧的竖线（左右两张卡片的边，露出一点）',
    weights: { [P]: 0.58, [S]: 0.42 },
    draw(g) { return [line(g.span(3, 3, 3, 21), { n: 'l', role: S }), line(g.span(21, 3, 21, 21), { n: 'r', role: S }), shell(g.box(6, 3, 12, 18, 3), { n: 'card', role: P })]; },
    // the card swipes aside and springs back
    fx: { t: 'keys', on: ['card'], x: [-1.6, 0.3] }
  },
  'gallery-thumbnails': {
    label: '缩略图', key: 'square',
    plan: '主体：上面的大图框（18×14）；辅助：下面一排三段短线（缩略图）',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) { return [shell(g.box(3, 3, 18, 14, 3.25), { n: 'big', role: P }), ...[[3, 7], [10, 14], [17, 21]].map(([a, b], i) => line(g.span(a, 20, b, 20), { n: `t${i}`, role: S }))]; },
    fx: { t: 'keys', on: [['t0'], ['t1'], ['t2']], by: true, stagger: 80, y: [-1, 0] }
  },
  'stretch-horizontal': {
    label: '横向拉伸', key: 'landscape',
    plan: '主体：上下两根横条（20×6，相距 4），撑满宽度',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.box(2, 4, 20, 6, 1.5), { n: 'a', role: P }), shell(g.box(2, 14, 20, 6, 1.5), { n: 'b', role: P })]; },
    fx: { t: 'from', on: ['a', 'b'], o: [12, 12], sx: 0.7 }
  },
  'stretch-vertical': {
    label: '纵向拉伸', key: 'portrait',
    plan: '主体：左右两根竖条（6×20，相距 4），撑满高度',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.box(4, 2, 6, 20, 1.5), { n: 'a', role: P }), shell(g.box(14, 2, 6, 20, 1.5), { n: 'b', role: P })]; },
    fx: { t: 'from', on: ['a', 'b'], o: [12, 12], sy: 0.7 }
  },
  'bring-to-front': stack3(true, '移到最前'),
  'send-to-back': stack3(false, '移到最后')
};
