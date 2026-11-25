// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// text: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: pen eraser highlighter table languages align-left align-center align-right align-justify bold italic underline strikethrough heading type text-size list-ordered list-checks indent outdent quote text-cursor clipboard-paste
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// Text-formatting icons (align, indent, ordered and checked lists) share one grid: four rows on
// whole pixels, 5 apart; a long line fills the square (3..21) and a short one is 10 long. Lists
// and indents keep a marker column at 3..9 and their lines at 11..21. Four rows cannot fill the
// 18 square on whole pixels (centre lines 4..20 would need a spacing of 5⅓), so the rows stand
// 4..21: with the long line on top, half a pixel low keeps the optical centre in the middle.
const ROWS = [5, 10, 15, 20];
// Lists carry even rows and their markers; with no long top line pulling the weight up, they
// stand a pixel higher (4..19) to keep the optical centre in the middle.
const LIST = ROWS.map((y) => y - 1);
const LONG = [3, 21], SHORT = 10, TX = 11;
const row = (g, y, x0, x1) => g.span(x0, y, x1, y);
// Letterforms (bold, italic, heading, type, strikethrough) stand on one cap height: centre lines
// 4..20, outer 3..21; bowls and turns are arcs of radius 4.
const CAP = [4, 20];
// A point on an axis turned by deg about o (tilted tools: pen, eraser, highlighter).
const tilt = (o, deg) => { const a = (deg * Math.PI) / 180, c = Math.cos(a), s0 = Math.sin(a); return ([u, v]) => [o[0] + u * c - v * s0, o[1] + u * s0 + v * c]; };

const reason = { keyline: '四行字线行距 5 落在整像素上，高 17，比方框矮 1；首行是长线，整体下移半格让重心居中' };
const listReason = { keyline: '四行字线行距 5 落在整像素上，高 17，比方框矮 1；各行等长，整体上移半格让重心居中' };

export default {
  pen: {
    label: '钢笔', key: 'portrait', fit: 'y',
    ends: 'in',
    plan: '主体：笔尖（上方平、两肩竖直、向下收成尖）；辅助：笔杆（立在笔尖上沿、上端圆角的短杆，比笔尖窄）；细节：笔尖中缝（从上沿往下，不伸进笔尖的窄角）。笔尖在下，重心偏上，笔杆顶部让出 1',
    weights: { [P]: 0.61, [S]: 0.27, [D]: 0.12 },
    draw(g) {
      const { h } = g, top = 10, sh = 13, x0 = 5 + h, x1 = 19 - h, tip = 22.9 - h * 1.5;
      return [
        line(`M8 ${top}V${n(3 + h + 2)}A2 2 0 0 1 10 ${n(3 + h)}H14A2 2 0 0 1 16 ${n(3 + h + 2)}V${top}`, { n: 'barrel', role: S }),
        shell(g.polygon([[x0, top], [x1, top], [x1, sh], [12, tip], [x0, sh]], [1.2, 1.2, 1.6, 1.2, 1.6]), { n: 'nib', role: P }),
        line(g.seg(12, top, 12, 15.5), { n: 'slit', role: D, on: 'nib' })
      ];
    },
    // 书写: the pen rocks about its tip as if writing
    fx: { t: 'keys', on: 'all', o: [12, 21], r: [-7, 5, -3] },
    allow: { keyline: '笔尖本身窄，宽 14；顶部让出 1，重心才不偏上' }
  },
  eraser: {
    anchor: 'base',
    label: '橡皮擦', key: 'square',
    ends: 'out',
    plan: '主体：斜放的橡皮（45°）；辅助：纸面（底线，从橡皮的下角向右）；细节：橡皮套的分界线',
    weights: { [P]: 0.66, [S]: 0.2, [D]: 0.14 },
    draw(g) {
      const { h, s } = g, L = 18.5, W = 8.5, o = [11.6, 11.6], Pt = tilt(o, -45), dv = W / 2 - h;
      const foot = Pt([-L / 2 + 0.66, W / 2 - 0.66]);
      return [
        line(g.seg(foot[0], 21 - h, 21 - h, 21 - h), { n: 'paper', role: S }),
        shell(g.rot(o[0], o[1], L - s, W - s, -45, 2.25 - h), { n: 'eraser', role: P }),
        line(g.pl([Pt([-2.5, -dv]), Pt([-2.5, dv])]), { n: 'band', role: D, on: 'eraser' })
      ];
    },
    // 擦: the eraser rubs back and forth along the paper
    fx: { t: 'keys', on: ['eraser', 'band'], x: [-1.2, 1, -0.8, 0.5] }
  },
  highlighter: {
    anchor: 'base',
    label: '荧光笔', key: 'square',
    ends: 'in',
    plan: '主体：斜放的笔身和平头笔尖；辅助：画出的一道荧光（底部横线，像纸面一样托在下面，以底边定位）；细节：笔身与笔尖之间的一道箍',
    weights: { [P]: 0.7, [S]: 0.18, [D]: 0.12 },
    draw(g) {
      const { h } = g, L = 14.5, W = 8.5, tw = 1.7, cone = 3.4, o = [8.6, 15.1], Pt = tilt(o, -45), dv = W / 2 - h;
      const body = [[0, -tw], [cone, -dv], [L - h, -dv], [L - h, dv], [cone, dv], [0, tw]].map(Pt);
      return [
        line(g.span(3, 20, 12, 20), { n: 'mark', role: S }),
        shell(g.polygon(body, [0.6, 0, 1.8, 1.8, 0, 0.6]), { n: 'pen', role: P }),
        line(g.pl([Pt([cone, -dv]), Pt([cone, dv])]), { n: 'band', role: D, on: 'pen' })
      ];
    },
    light: ['mark'],
    // 划重点: the mark is drawn along the line
    fx: { t: 'draw', on: ['mark'] }
  },
  table: {
    label: '表格', key: 'square',
    ends: 'in',
    plan: '主体：表格外框；细节：两条横线和一条竖线（与外框相连，贯通全表，墨量与外框相当）',
    weights: { [P]: 0.5, [D]: 0.5 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(3, 3, 18, 18, 4.5), { n: 'frame', role: P }),
        line(g.seg(3 + h, 9, 21 - h, 9), { n: 'r1', role: D, on: 'frame' }),
        line(g.seg(3 + h, 15, 21 - h, 15), { n: 'r2', role: D, on: 'frame' }),
        line(g.seg(12, 3 + h, 12, 21 - h), { n: 'c1', role: D, on: 'frame' })
      ];
    },
    fx: { t: 'draw', on: ['r1', 'r2', 'c1'] }
  },
  languages: {
    label: '翻译', key: 'landscape',
    plan: '主体：字母 A（说明是文字）；辅助：对话框（同消息的对话框）。A 离框内沿 1.5',
    weights: { [P]: 0.26, [S]: 0.74 },
    draw(g, ctx) {
      const { s, h } = g, d = s - 2, top = 8.5 + d, base = 15.5 - d, w = 3.9 - d * 0.6;
      const lx = (y) => 12 - (w * (y - top)) / (base - top), cy = 13;
      const A = line(g.pl([[12 - w, base], [12, top], [12 + w, base]]) + g.seg(lx(cy), cy, 24 - lx(cy), cy), { n: 'A', role: P, on: 'bubble' });
      // fill: the counter of the A would be a small triangle of ink with sharp points; it is
      // knocked out with the letter (a triangle on the centre lines, inside the strokes)
      const counter = solid(g.polygon([[12, top], [24 - lx(cy), cy], [lx(cy), cy]]), { n: 'counter', role: P, on: 'bubble', part: 'A' });
      return [shell(g.box(2, 4, 20, 16, [4.5, 4.5, 4.5, 1]), { n: 'bubble', role: S }), A, ...(ctx?.variant === 'fill' ? [counter] : [])];
    },
    // 翻译: the letter turns over into the other language and back
    fx: { t: 'keys', on: ['A', 'counter'], o: [12, 12], s: [0.5, 1.12], a: [0.2, 1] }
  },
  'align-left': {
    label: '左对齐', key: 'square',
    plan: '主体：四行字线，长短相间，左端对齐',
    weights: { [P]: 1 },
    draw(g) { return ROWS.map((y, i) => line(row(g, y, LONG[0], i % 2 ? LONG[0] + SHORT : LONG[1]), { n: `l${i}`, role: P })); },
    // the short lines slide in and settle against the left edge
    fx: { t: 'from', on: ['l1', 'l3'], x: 5 },
    allow: { ...reason, optical: '短线靠左是图标的含义，左端贴参考线，重心随之偏左' }
  },
  'align-center': {
    label: '居中对齐', key: 'square',
    plan: '主体：四行字线，长短相间，居中',
    weights: { [P]: 1 },
    draw(g) { return ROWS.map((y, i) => line(row(g, y, i % 2 ? 12 - SHORT / 2 : LONG[0], i % 2 ? 12 + SHORT / 2 : LONG[1]), { n: `l${i}`, role: P })); },
    fx: [{ t: 'from', on: ['l1'], x: -4 }, { t: 'from', on: ['l3'], x: 4 }],
    allow: reason
  },
  'align-right': {
    label: '右对齐', key: 'square',
    plan: '主体：四行字线，长短相间，右端对齐',
    weights: { [P]: 1 },
    draw(g) { return ROWS.map((y, i) => line(row(g, y, i % 2 ? LONG[1] - SHORT : LONG[0], LONG[1]), { n: `l${i}`, role: P })); },
    fx: { t: 'from', on: ['l1', 'l3'], x: -5 },
    allow: { ...reason, optical: '短线靠右是图标的含义，右端贴参考线，重心随之偏右' }
  },
  'align-justify': {
    label: '两端对齐', key: 'square',
    plan: '主体：四行等长的字线，两端都对齐（比菜单多一行）',
    weights: { [P]: 1 },
    draw(g) { return ROWS.map((y, i) => line(row(g, y, LONG[0], LONG[1]), { n: `l${i}`, role: P })); },
    // the lines stretch out to both edges
    fx: { t: 'from', on: ['l0', 'l1', 'l2', 'l3'], o: [12, 12.5], sx: 0.62 },
    allow: reason
  },
  bold: {
    label: '加粗', key: 'square', fit: 'y',
    plan: '主体：字母 B（竖线和上小下大两个半圆的字碗）',
    weights: { [P]: 1 },
    draw(g) {
      const [t, b] = CAP, m = 12, x = 7;
      return [line(`M${x} ${m}H12.5A4 4 0 0 0 12.5 ${t}H${x}V${b}H13.5A4 4 0 0 0 13.5 ${m}H${x}`, { n: 'B', role: P })];
    },
    area: (g) => [{ n: 'B', d: `M7 4H12.5A4 4 0 0 1 12.5 12H13.5A4 4 0 0 1 13.5 20H7Z` }],
    fx: { t: 'beat', on: 'all', o: [12, 12] }
  },
  italic: {
    label: '斜体', key: 'square', fit: 'y',
    plan: '主体：斜体的 I（一条斜线和上下两条横线）',
    weights: { [P]: 1 },
    draw(g) {
      const [t, b] = CAP;
      return [line(g.seg(10, t, 19 - g.h, t) + g.seg(14, t, 10, b) + g.seg(5 + g.h, b, 14, b), { n: 'I', role: P })];
    },
    // the letter leans a little further, then rights itself
    fx: { t: 'keys', on: 'all', o: [12, 20], r: [9], ms: 260 }
  },
  underline: {
    allow: { optical: '与粗体、斜体等字母同一基线和字高，下划线在字母下方，按字母定位' },
    label: '下划线', key: 'square', fit: 'y',
    plan: '主体：字母 U；辅助：下面的横线',
    weights: { [P]: 0.69, [S]: 0.31 },
    draw(g) {
      const { h } = g;
      return [
        line(`M7 4.3V10.8A5 5 0 0 0 17 10.8V4.3`, { n: 'U', role: P }),
        line(g.span(5, 21 - h, 19, 21 - h), { n: 'rule', role: S })
      ];
    },
    light: ['rule'],
    fx: { t: 'draw', on: ['rule'] }
  },
  strikethrough: {
    label: '删除线', key: 'square', fit: 'y',
    plan: '主体：字母 S（直线和两个半径 4 的半圆）；辅助：穿过中间的横线（与 S 的中横重合）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const [t, b] = CAP;
      return [
        line(`M17 ${t}H10A4 4 0 0 0 10 12H14A4 4 0 0 1 14 ${b}H7`, { n: 'S', role: P }),
        line(g.span(4, 12, 20, 12), { n: 'strike', role: S })
      ];
    },
    light: ['strike'],
    fx: { t: 'draw', on: ['strike'] }
  },
  heading: {
    label: '标题', key: 'square', fit: 'y',
    plan: '主体：字母 H（两条竖线和中横）',
    weights: { [P]: 1 },
    draw(g) {
      const [t, b] = CAP;
      return [line(g.seg(6, t, 6, b) + g.seg(18, t, 18, b) + g.seg(6, 12, 18, 12), { n: 'H', role: P })];
    },
    // a heading stands up taller
    fx: { t: 'keys', on: 'all', o: [12, 20], sy: [1.12], s: [1.04], ms: 260 }
  },
  type: {
    label: '字体', key: 'square', fit: 'y',
    plan: '主体：带衬线的 T（横线两端向下的短钩、竖线、底部短横）',
    weights: { [P]: 1 },
    draw(g) {
      const [t, b] = CAP, { h } = g;
      return [
        line(`M${4 + h} 7V${t}H${20 - h}V7`, { n: 'bar', role: P }),
        line(g.seg(12, t, 12, b), { n: 'stem', role: P }),
        line(g.seg(9, b, 15, b), { n: 'foot', role: P })
      ];
    },
    fx: { t: 'draw', on: ['bar', 'stem', 'foot'] },
    allow: { optical: '与其他字母同一字高和基线，横线在上，重心偏高' }
  },
  'text-size': {
    label: '字号', key: 'square',
    plan: '主体：大写的 T；辅助：左下的小 T（与大 T 底边对齐，表示大小）',
    weights: { [P]: 0.64, [S]: 0.36 },
    draw(g) {
      const [t, b] = CAP, st = 11;
      return [
        line(g.seg(4, st, 10, st) + g.seg(7, st, 7, b), { n: 'small', role: S }),
        line(g.seg(10, t, 20, t) + g.seg(15, t, 15, b), { n: 'big', role: P })
      ];
    },
    // the small letter grows toward the big one and settles back
    fx: { t: 'keys', on: ['small'], o: [7, 20], s: [1.35], ms: 300 }
  },
  'list-ordered': {
    label: '编号列表', key: 'square',
    plan: '主体：四行字线（两项，每项两行）；细节：左侧编号 1 和 2，各占一项的高度',
    weights: { [P]: 0.61, [D]: 0.39 },
    draw(g) {
      return [
        line(`M4.5 5.5L6 4V9`, { n: 'n1', role: D }),
        line(g.arc(6, 16, 2, 180, 360) + `L4 19H8`, { n: 'n2', role: D }),
        ...LIST.map((y, i) => line(row(g, y, TX, LONG[1]), { n: `l${i}`, role: P }))
      ];
    },
    fx: { t: 'draw', on: ['n1', 'l0', 'l1', 'n2', 'l2', 'l3'], stagger: 90 },
    allow: listReason
  },
  'list-checks': {
    label: '任务清单', key: 'square',
    plan: '主体：四行字线（两项，每项两行）；细节：左侧两个对勾，各占一项的高度',
    weights: { [P]: 0.69, [D]: 0.31 },
    draw(g) {
      const tick = (y) => g.pl([[4, y + 0.6], [5.7, y + 2.3], [8.4, y - 1.6]]);
      return [
        line(tick(6.4), { n: 'c1', role: D }),
        line(tick(16.4), { n: 'c2', role: D }),
        ...LIST.map((y, i) => line(row(g, y, TX, LONG[1]), { n: `l${i}`, role: P }))
      ];
    },
    fx: { t: 'draw', on: ['c1', 'c2'], stagger: 220 },
    allow: listReason
  },
  indent: {
    label: '增加缩进', key: 'square',
    plan: '主体：四行字线（中间两行缩进）；辅助：指向右的箭头（V 形）',
    weights: { [P]: 0.86, [S]: 0.14 },
    draw(g) {
      return [
        ...ROWS.map((y, i) => line(row(g, y, i === 1 || i === 2 ? TX : LONG[0], LONG[1]), { n: `l${i}`, role: P })),
        line(g.pl([[4.5, 10], [7, 12.5], [4.5, 15]]), { n: 'chev', role: S })
      ];
    },
    light: ['chev'],
    fx: { t: 'keys', on: ['chev', 'l1', 'l2'], x: [1.6], ms: 240 },
    allow: reason
  },
  outdent: {
    label: '减少缩进', key: 'square',
    plan: '主体：四行字线（中间两行缩进）；辅助：指向左的箭头（V 形）',
    weights: { [P]: 0.86, [S]: 0.14 },
    draw(g) {
      return [
        ...ROWS.map((y, i) => line(row(g, y, i === 1 || i === 2 ? TX : LONG[0], LONG[1]), { n: `l${i}`, role: P })),
        line(g.pl([[7, 10], [4.5, 12.5], [7, 15]]), { n: 'chev', role: S })
      ];
    },
    light: ['chev'],
    fx: { t: 'keys', on: ['chev', 'l1', 'l2'], x: [-1.6], ms: 240 },
    allow: reason
  },
  quote: {
    label: '引用', key: 'square', fit: 'x',
    plan: '主体：两个前引号（各是一个圆和从圆左侧向上弯的尾巴）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, R = 4, cy = 13.5, Rt = 7, end = 240;
      const mark = (cx, i) => [
        shell(g.ring(cx, cy, R), { n: `d${i}`, role: P, part: `q${i}` }),
        line(g.arc(cx - (R - h) + Rt, cy, Rt, 180, end), { n: `t${i}`, role: P, part: `q${i}` })
      ];
      return [...mark(7, 0), ...mark(17, 1)];
    },
    fx: { t: 'bounce', on: [['d0', 't0'], ['d1', 't1']], by: true, o: [12, 17.5], amp: 1.1 }
  },
  'text-cursor': {
    label: '文本光标', key: 'square', fit: 'y',
    plan: '主体：工字形光标（一条竖线，上下两端向两侧弯出）',
    weights: { [P]: 1 },
    draw(g) {
      const [t, b] = CAP, r = 3;
      return [line(`M${12 + r + 1} ${t}H${12 + r}A${r} ${r} 0 0 0 12 ${t + r}V${b - r}A${r} ${r} 0 0 0 ${12 + r} ${b}H${12 + r + 1}`
        + `M${12 - r - 1} ${t}H${12 - r}A${r} ${r} 0 0 1 12 ${t + r}V${b - r}A${r} ${r} 0 0 1 ${12 - r} ${b}H${12 - r - 1}`, { n: 'beam', role: P })];
    },
    // the cursor blinks
    fx: { t: 'keys', on: 'all', a: [0.15, 1, 0.15], ms: 720 }
  },
  'clipboard-paste': {
    anchor: 'base',
    label: '粘贴', key: 'portrait',
    plan: '主体：写字板；辅助：顶部的夹子（压在板的上沿）；细节：两行字（同文档的字线：离边 2、行距 4，末行短）',
    weights: { [P]: 0.6, [S]: 0.22, [D]: 0.18 },
    draw(g, ctx) {
      const { s, h } = g, a = 4 + s + 2 + h, b = 20 - s - 2 - h, fill = ctx?.variant === 'fill';
      // fill: the clip's band notched where it crosses the board's corners (as clipboard), and
      // the lines one stroke of board below the band and apart
      const y1 = fill ? Math.max(12, 7 + g.g + 1.5 * s) : 12, y2 = y1 + (fill ? Math.max(4, 2 * s) : 4);
      return [
        shell(g.box(4, 4, 16, 18, 4), { n: 'board', role: P }),
        shell(g.box(8, 2, 8, 5, 2), fill ? { n: 'clip', role: S, cutD: clipCut(g, 8, 16, 7) } : { n: 'clip', role: S, occ: true }),
        line(g.seg(a, y1, b, y1), { n: 'l1', role: D, on: 'board' }),
        line(g.seg(a, y2, a + (b - a) * 0.55, y2), { n: 'l2', role: D, on: 'board' })
      ];
    },
    // 粘贴: the lines are written onto the board
    fx: { t: 'draw', on: ['l1', 'l2'] }
  }
};

// The clear band under a clip in the fill (as clipboard in files.mjs): straight sides up through
// the top, with a round notch where they cross the board's round top corners (read on a circle
// of radius 4 about the corner), so no thin point of board is left beside the band.
function clipCut(g, x0, x1, yb) {
  const w = g.g, xl = x0 - w, xr = x1 + w, yc = 8 - Math.sqrt(Math.max(0, 16 - (8 - xl) ** 2)), r = 0.5 * g.s;
  return g.area(xl, 0, xr - xl, yb + w, [0, 0, 2 + w, 2 + w]) + g.circ(xl, yc, r) + g.circ(xr, yc, r);
}
