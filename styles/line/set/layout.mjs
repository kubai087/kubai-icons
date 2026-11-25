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
  }
};
