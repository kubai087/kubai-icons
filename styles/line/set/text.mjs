// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// text: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: pen eraser highlighter table languages align-left align-center align-right align-justify bold italic underline strikethrough heading type text-size list-ordered list-checks indent outdent quote text-cursor clipboard-paste
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { slash } from '../kit.mjs';
import { off, offFill } from '../variants.mjs';

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

const set = {
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
    label: '翻译', key: 'live',
    plan: '主体：右下的字母 A（译成的语言）；辅助：左上的汉字"文"（原来的语言：点立在横上，撇从横的右段落下、向左下弯出，捺从撇的左上方起笔、穿过撇落到右下）。两字大小相近，沿对角线排开，横画伸到 A 的尖顶上方',
    weights: { [P]: 0.42, [S]: 0.58 },
    draw(g) {
      const { s, h } = g, bar = 6;
      const wen = { role: S, part: 'wen' };
      // ㇏ keeps clear of the bar at every weight, and stops short of the A
      const na = [[5.75, bar + s + 1.5], [11, 14.75]];
      // A: feet on the bottom edge, the crossbar on a whole pixel
      const top = 11, base = 22 - h, xl = 12.5, xr = 21, cx = (xl + xr) / 2, cy = 17;
      const lx = (y) => cx - ((cx - xl) * (y - top)) / (base - top);
      return [
        line(g.seg(9, 2 + h, 9, bar), { n: 'dot', ...wen }),
        line(g.span(2, bar, 16, bar), { n: 'bar', ...wen }),
        line(`M12.5 ${bar}C11 9.5 8 13.6 3.25 16.5`, { n: 'pie', ...wen }),
        line(g.seg(...na[0], ...na[1]), { n: 'na', ...wen }),
        line(g.pl([[xl, base], [cx, top], [xr, base]]) + g.seg(lx(cy), cy, 2 * cx - lx(cy), cy), { n: 'A', role: P })
      ];
    },
    // 翻译: the character is written stroke by stroke, then the letter
    fx: { t: 'draw', on: ['dot', 'bar', 'pie', 'na', 'A'], stagger: 110 }
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

// Letters and digits beside a main letter (headings, super- and subscript, cases), by centre
// line. A heading's H stands on the cap height (CAP) with its stems at 4 and 11; its digit fills
// the box x 15..20, y 10..20, so it stands on the same base line.
const H = (g, dx = 0) => g.seg(4 + dx, CAP[0], 4 + dx, CAP[1]) + g.seg(11 + dx, CAP[0], 11 + dx, CAP[1]) + g.seg(4 + dx, 12, 11 + dx, 12);
const DIGIT = {
  1: (g, dx = 0) => `M${15.5 + dx} 12.5L${18 + dx} 10V20`,
  2: (g, y0 = 10, y1 = 20) => g.arc(17.5, y0 + 2.5, 2.5, 180, 360) + `L15 ${y1}H20`,
  3: () => `M15.15 11.64A2.5 2.5 0 1 1 17.5 15A2.5 2.5 0 1 1 15.15 18.36`,
  4: () => `M15 10V16H20M19 10V20`,
  5: () => `M20 10H15V14H17A3 3 0 0 1 17 20H15`,
  6: (g) => `M19.5 10A7.5 7.5 0 0 0 15 17.5` + g.circ(17.5, 17.5, 2.5)
};
const heading = (k, label, dx = 0) => ({
  label, key: 'square', fit: 'y',
  plan: `主体：字母 H（与标题同一字高，变窄）；辅助：右下的数字 ${k}（与 H 同一基线，高 10）`,
  weights: { [P]: 0.7, [S]: 0.3 },
  draw(g) { return [line(H(g, dx), { n: 'H', role: P }), line(k === 1 ? DIGIT[1](g, dx) : DIGIT[k](g), { n: 'num', role: S })]; },
  // the level number is written beside the letter
  fx: { t: 'draw', on: ['num'] }
});
// Upper-case A by centre line: feet at x0 and x1 on the base line, apex at top, bar at barY.
const letterA = (g, x0, x1, top, base, barY) => {
  const m = (x0 + x1) / 2, at = (y) => ((m - x0) * (base - y)) / (base - top);
  return g.pl([[x0, base], [m, top], [x1, base]]) + g.seg(m - at(barY), barY, m + at(barY), barY);
};
// Lower-case a: a ring of outer radius R and its stem down the right side.
const letterLowA = (g, cx, cy, R) => g.circ(cx, cy, R - g.h) + g.seg(cx + R - g.h, cy - R + g.h, cx + R - g.h, cy + R - g.h);
// Pilcrow by centre line: a bowl of radius r hangs left of the stem x0 from the top bar; a second
// stem at x1; both stems run from top down to bottom.
const pilcrowPath = (g, x0, x1, top, bottom, r) => `M${n(x1 + 1)} ${n(top)}H${n(x0 - r)}A${n(r)} ${n(r)} 0 0 0 ${n(x0 - r)} ${n(top + 2 * r)}H${n(x0)}` + g.seg(x0, top, x0, bottom) + g.seg(x1, top, x1, bottom);
const pilcrowArea = (x0, x1, top, r) => `M${n(x0)} ${n(top)}H${n(x0 - r)}A${n(r)} ${n(r)} 0 0 0 ${n(x0 - r)} ${n(top + 2 * r)}H${n(x0)}Z`;
// Pilcrow with an arrow under it for the writing direction (dir 1 right, -1 left).
// The fill variant fills the bowl, so no island of ink is left inside it.
const bowl = (g, ctx, d) => (ctx?.variant === 'fill' ? [solid(d, { n: 'bowl', role: P, part: 'mark' })] : []);
const pilcrowDir = (dir, label) => ({
  label, key: 'square',
  plan: `主体：段落标记（缩小，放在上方）；辅助：下方指向${dir > 0 ? '右' : '左'}的箭头，表示书写方向`,
  weights: { [P]: 0.58, [S]: 0.42 },
  draw(g, ctx) {
    const x0 = 12, x1 = 16, L = 2, y = 18, a = dir > 0 ? 20 : 4;
    return [
      line(pilcrowPath(g, x0, x1, 4, 13, 3), { n: 'mark', role: P, part: 'mark' }),
      ...bowl(g, ctx, pilcrowArea(x0, x1, 4, 3)),
      line(g.seg(4, y, 20, y) + g.pl([[a - dir * L, y - L], [a, y], [a - dir * L, y + L]]), { n: 'arrow', role: S })
    ];
  },
  area: () => [{ n: 'mark', d: pilcrowArea(12, 16, 4, 3) }],
  fx: { t: 'keys', on: ['arrow'], x: [dir * 1.5, 0], ms: 300 }
});
const more = {
  // the narrow 1 leaves the right side light: the whole letter group moves right by 1
  'heading-1': { ...heading(1, '一级标题', 1), allow: { keyline: '数字 1 本身窄，整体右移 1 后左侧比方框少 1' } },
  'heading-2': heading(2, '二级标题'),
  'heading-3': heading(3, '三级标题'),
  'heading-4': heading(4, '四级标题'),
  'heading-5': heading(5, '五级标题'),
  'heading-6': { ...heading(6, '六级标题'), allow: { optical: '数字 6 的圆在下方，与其他标题的数字同一基线' } },
  superscript: {
    label: '上标', key: 'square',
    plan: '主体：字母 x（两条斜线，占左下）；辅助：右上的小数字 2',
    weights: { [P]: 0.52, [S]: 0.48 },
    draw(g) {
      return [
        line(g.seg(4, 13, 11, 20) + g.seg(11, 13, 4, 20), { n: 'x', role: P }),
        line(DIGIT[2](g, 4, 11), { n: 'num', role: S })
      ];
    },
    // the small figure rises into place above the line
    fx: { t: 'from', on: ['num'], y: 5, a: 0 }
  },
  subscript: {
    label: '下标', key: 'square',
    plan: '主体：字母 x（两条斜线，占左上）；辅助：右下的小数字 2',
    weights: { [P]: 0.52, [S]: 0.48 },
    draw(g) {
      return [
        line(g.seg(4, 4, 11, 11) + g.seg(11, 4, 4, 11), { n: 'x', role: P }),
        line(DIGIT[2](g, 13, 20), { n: 'num', role: S })
      ];
    },
    // the small figure drops into place below the line
    fx: { t: 'from', on: ['num'], y: -5, a: 0 }
  },
  'case-sensitive': {
    label: '区分大小写', key: 'square', fit: 'x',
    plan: '主体：大写 A；辅助：小写 a（圆环和右侧竖线，与 A 同一基线）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      return [
        line(letterA(g, 4, 10, 5, 18, 14), { n: 'A', role: P }),
        line(letterLowA(g, 17.5, 15.5, 3.5), { n: 'a', role: S })
      ];
    },
    // the small letter grows to the size of the capital and back
    fx: { t: 'keys', on: ['a'], o: [17.5, 18.5], s: [1.3], ms: 300 }
  }
};

more.pilcrow = {
  label: '段落标记', key: 'square', fit: 'y',
  plan: '主体：段落标记（左上的字碗、两条竖线，与其他字母同一字高）',
  weights: { [P]: 1 },
  draw(g, ctx) { return [line(pilcrowPath(g, 13, 17, CAP[0], CAP[1], 4.5), { n: 'mark', role: P, part: 'mark' }), ...bowl(g, ctx, pilcrowArea(13, 17, CAP[0], 4.5))]; },
  allow: { optical: '字碗在左上是段落标记的字形，与其他字母同一字高' },
  area: () => [{ n: 'mark', d: pilcrowArea(13, 17, CAP[0], 4.5) }],
  fx: { t: 'draw', on: ['mark'] }
};
more['pilcrow-left'] = pilcrowDir(-1, '从右到左');
more['pilcrow-right'] = pilcrowDir(1, '从左到右');
more['case-upper'] = {
  label: '大写', key: 'square', fit: 'x',
  plan: '主体：大写 A 和 B，同一字高和基线',
  weights: { [P]: 1 },
  draw(g) {
    return [
      line(letterA(g, 4, 10, 5, 18, 14), { n: 'A', role: P }),
      line(`M14 11H16.5A3 3 0 0 0 16.5 5H14V18H16.5A3.5 3.5 0 0 0 16.5 11H14`, { n: 'B', role: P })
    ];
  },
  fx: { t: 'bounce', on: [['A'], ['B']], by: true, o: [12, 19], amp: 1 }
};
more['case-lower'] = {
  label: '小写', key: 'square', fit: 'x',
  plan: '主体：小写 a 和 b（圆环加竖线；b 的竖线高出到字高）',
  weights: { [P]: 1 },
  draw(g) {
    const { h } = g, R = 4, cy = 14.5;
    return [
      line(letterLowA(g, 7, cy, R), { n: 'a', role: P }),
      line(g.circ(17, cy, R - h) + g.seg(17 - R + h, 3 + h, 17 - R + h, cy + R - h), { n: 'b', role: P })
    ];
  },
  fx: { t: 'bounce', on: [['a'], ['b']], by: true, o: [12, 19], amp: 1 }
};

// A double-headed or single arrow head by centre line: the tip at (x, y), legs of L, pointing dx, dy.
const head = (g, x, y, dx, dy, L) => g.pl([[x - dx * L - dy * L, y - dy * L - dx * L], [x, y], [x - dx * L + dy * L, y - dy * L + dx * L]]);
Object.assign(more, {
  'spell-check': {
    label: '拼写检查', key: 'square',
    plan: '主体：字母 A（占左上）；辅助：右下的对勾',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      return [line(letterA(g, 4, 12, 4, 14, 10), { n: 'A', role: P }), line(g.pl([[13.5, 17.5], [16, 20], [20, 15]]), { n: 'check', role: S })];
    },
    fx: { t: 'draw', on: ['check'] }
  },
  'wrap-text': {
    label: '自动换行', key: 'square',
    plan: '主体：折回的一行（到右边弯下来，箭头指回左边）；辅助：上面的长行和下面的短行',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g) {
      const { h } = g;
      return [
        line(g.span(3, 4, 21, 4) + g.span(3, 18, 10, 18), { n: 'rows', role: S }),
        line(`M${n(3 + h)} 11H16.5A3.5 3.5 0 0 1 16.5 18H14` + head(g, 14, 18, -1, 0, 2.25), { n: 'wrap', role: P })
      ];
    },
    light: ['rows'],
    fx: { t: 'draw', on: ['wrap'] }
  },
  'remove-formatting': {
    label: '清除格式', key: 'square',
    plan: '主体：带衬线的 T（与字体同形，缩到左上）；辅助：右下的叉号',
    weights: { [P]: 0.75, [S]: 0.25 },
    draw(g) {
      const k = 2.6 - g.h * 0.7;
      return [
        line(`M4 7V4H16V7` + g.seg(10, 4, 10, 20), { n: 'T', role: P }),
        line(g.seg(17.5 - k, 17.5 - k, 17.5 + k, 17.5 + k) + g.seg(17.5 + k, 17.5 - k, 17.5 - k, 17.5 + k), { n: 'x', role: S })
      ];
    },
    fx: { t: 'rotate', on: ['x'], deg: 90, o: [17.5, 17.5] },
    allow: { keyline: '叉号是两条斜线，与角标的叉号同大，右下角不顶到方框' }
  },
  'whole-word': {
    label: '全字匹配', key: 'square',
    plan: '主体：小写 a 和 b（与小写同形，缩小）；辅助：下面托住整个词的括号',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const { h } = g, R = 3.5, cy = 10.5;
      return [
        line(letterLowA(g, 7.5, cy, R), { n: 'a', role: P }),
        line(g.circ(16.5, cy, R - h) + g.seg(14, 3 + h, 14, cy + R - h), { n: 'b', role: P }),
        line(`M4 17V18A2 2 0 0 0 6 20H18A2 2 0 0 0 20 18V17`, { n: 'bracket', role: S })
      ];
    },
    fx: { t: 'draw', on: ['bracket'] }
  },
  baseline: {
    label: '文字颜色', key: 'square', fit: 'y',
    plan: '主体：字母 A；辅助：下面的色条（与下划线的横线同长同位置）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const { h } = g;
      return [line(letterA(g, 6, 18, 4, 16, 12), { n: 'A', role: P }), line(g.span(5, 21 - h, 19, 21 - h), { n: 'rule', role: S })];
    },
    light: ['rule'],
    fx: { t: 'draw', on: ['rule'] }
  },
  overline: {
    label: '上划线', key: 'square', fit: 'y',
    plan: '主体：字母 O（圆环）；辅助：上面的横线（与下划线的横线同长）',
    weights: { [P]: 0.68, [S]: 0.32 },
    draw(g) {
      const { h } = g;
      return [line(g.span(5, 3 + h, 19, 3 + h), { n: 'rule', role: S }), line(g.ring(12, 14.5, 6.5), { n: 'O', role: P })];
    },
    light: ['rule'],
    fx: { t: 'draw', on: ['rule'] }
  },
  'line-height': {
    label: '行高', key: 'square',
    plan: '主体：右侧三行字线；辅助：左侧上下双向箭头（表示行与行的距离）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const { h } = g, t = 3 + h, b = 21 - h;
      return [
        line(g.seg(6, t, 6, b) + head(g, 6, t, 0, -1, 2) + head(g, 6, b, 0, 1, 2), { n: 'arrow', role: S }),
        ...[5, 12, 19].map((y, i) => line(g.span(11, y, 21, y), { n: `l${i}`, role: P }))
      ];
    },
    light: ['arrow'],
    // the lines move apart and close up again
    fx: [{ t: 'keys', on: ['l0'], y: [-1], ms: 300 }, { t: 'keys', on: ['l2'], y: [1], ms: 300 }]
  },
  'letter-spacing': {
    label: '字间距', key: 'square',
    plan: '主体：字母 A（居中，与其他字母同高）；辅助：两侧向外的短箭头（表示字与字的距离）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const { h } = g, l = 3 + h, r = 21 - h, y = 12;
      return [
        line(letterA(g, 9, 15, CAP[0], CAP[1], 15), { n: 'A', role: P }),
        line(g.seg(l, y, 6, y) + head(g, l, y, -1, 0, 2), { n: 'left', role: S }),
        line(g.seg(18, y, r, y) + head(g, r, y, 1, 0, 2), { n: 'right', role: S })
      ];
    },
    light: ['left', 'right'],
    // the arrows push outward, opening the space round the letter
    fx: [{ t: 'keys', on: ['left'], x: [-0.8, 0], ms: 300 }, { t: 'keys', on: ['right'], x: [0.8, 0], ms: 300 }]
  },
  'a-arrow-up': {
    label: '增大字号', key: 'landscape',
    allow: { keyline: '字母按常规大写的比例画（宽 9、高 12），不为填满关键形状拉高；箭头与字母同高' },
    plan: '主体：字母 A（宽 9、高 12 的常规大写，不拉长）；辅助：右侧向上的箭头，与 A 同高',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const { h } = g;
      return [
        line(letterA(g, 3, 12, 6, 18, 14), { n: 'A', role: P }),
        line(g.seg(18, 18, 18, 6 + h) + head(g, 18, 6 + h, 0, -1, 3), { n: 'arrow', role: S })
      ];
    },
    light: ['arrow'],
    fx: { t: 'keys', on: ['arrow'], y: [-1.2, 0.3], ms: 300 }
  },
  'a-arrow-down': {
    label: '减小字号', key: 'landscape',
    allow: { keyline: '字母按常规大写的比例画（宽 9、高 12），不为填满关键形状拉高；箭头与字母同高' },
    plan: '主体：字母 A（宽 9、高 12 的常规大写，不拉长）；辅助：右侧向下的箭头，与 A 同高',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const { h } = g;
      return [
        line(letterA(g, 3, 12, 6, 18, 14), { n: 'A', role: P }),
        line(g.seg(18, 6, 18, 18 - h) + head(g, 18, 18 - h, 0, 1, 3), { n: 'arrow', role: S })
      ];
    },
    light: ['arrow'],
    fx: { t: 'keys', on: ['arrow'], y: [1.2, -0.3], ms: 300 }
  },
  signature: {
    anchor: 'base',
    label: '签名', key: 'square',
    plan: '主体：一笔连写的签名（带一个圈）；辅助：下面的签名横线',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const { h } = g;
      return [
        line(`M4 15C6.5 15 8.5 2.57 11.5 4.27C14 5.73 9.5 15.57 12.5 15C14.5 14.66 15 10.48 17 11.05C18.5 11.61 18 14.43 20 14.43`, { n: 'sign', role: P }),
        line(g.span(3, 21 - h, 21, 21 - h), { n: 'rule', role: S })
      ];
    },
    light: ['rule'],
    fx: { t: 'draw', on: ['sign'] }
  },
  'text-select': {
    label: '选择文本', key: 'square',
    plan: '主体：虚线选框（四个角和四边中段）；细节：框里的两行字（末行短）',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g) {
      const { h } = g, a = 3 + h, b = 21 - h, c = 3, r = 2.5 - h * 0.5, m = [11, 13];
      const corner = (x, y, sx, sy) => `M${n(x)} ${n(y + sy * c)}V${n(y + sy * r)}A${n(r)} ${n(r)} 0 0 ${sx * sy > 0 ? 1 : 0} ${n(x + sx * r)} ${n(y)}H${n(x + sx * c)}`;
      const dashes = [
        corner(a, a, 1, 1), g.seg(m[0], a, m[1], a), corner(b, a, -1, 1), g.seg(b, m[0], b, m[1]),
        corner(b, b, -1, -1), g.seg(m[1], b, m[0], b), corner(a, b, 1, -1), g.seg(a, m[1], a, m[0])
      ];
      return [
        ...dashes.map((d, i) => line(d, { n: `d${i}`, role: P, vc: i })),
        line(g.seg(8, 10, 16, 10), { n: 'l1', role: D }),
        line(g.seg(8, 14, 12.5, 14), { n: 'l2', role: D })
      ];
    },
    // the selection marches round the text
    fx: { t: 'variable', on: ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'], mode: 'iterative', step: 90 }
  },
  'text-search': {
    label: '查找文本', key: 'square',
    plan: '主体：放大镜（与搜索同形，缩到右下）；辅助：左侧三行字（首行长，后两行短，让出放大镜）',
    weights: { [P]: 0.52, [S]: 0.48 },
    draw(g) {
      const { h } = g, c = 15.5, R = 4.5, k = (R - h) / Math.SQRT2;
      return [
        line(g.span(3, 4, 21, 4) + g.span(3, 11, 9, 11) + g.span(3, 18, 9, 18), { n: 'rows', role: S }),
        shell(g.ring(c, c, R), { n: 'lens', role: P }),
        line(g.seg(c + k, c + k, 21 - h, 21 - h), { n: 'handle', role: P })
      ];
    },
    light: ['rows'],
    fx: { t: 'orbit', on: ['lens', 'handle'], R: 0.8 }
  },
  'text-quote': {
    label: '块引用', key: 'square',
    plan: '主体：三行字（首行长，后两行缩进）；辅助：缩进处的竖条（表示引用）',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      return [
        line(g.span(3, 4, 21, 4), { n: 'l0', role: P }),
        line(g.span(9, 12, 21, 12), { n: 'l1', role: P }),
        line(g.span(9, 20, 21, 20), { n: 'l2', role: P }),
        line(g.span(4, 11, 4, 21), { n: 'bar', role: S })
      ];
    },
    light: ['bar'],
    fx: { t: 'draw', on: ['bar'] }
  }
});

// A pencil at 45°, tip at bottom left, as pencil in icons.mjs: o is the tip, L the length, W the
// width, tipL the length of the cone; the band sits back from the end.
function pencilAt(g, o, L, W, tipL, back) {
  const { h } = g, a = -Math.PI / 4, Pt = ([u, v]) => [o[0] + u * Math.cos(a) - v * Math.sin(a), o[1] + u * Math.sin(a) + v * Math.cos(a)];
  const body = [[0, 0], [tipL, -W / 2 + h], [L - h * 1.4, -W / 2 + h], [L - h * 1.4, W / 2 - h], [tipL, W / 2 - h]].map(Pt);
  return { body: g.polygon(body, [0.9, 0, 1.8, 1.8, 0]), band: g.pl([[L - back, -W / 2 + h], [L - back, W / 2 - h]].map(Pt)) };
}
// List rows with a mark at the right of the middle row (list-plus, list-minus, list-x,
// list-check): the outer rows stop at 15 and the middle one at 11, so the mark (8 across, centred
// on 17, 12) keeps 2 clear of them.
const listMark = (label, plan, mark, fx, w = 0.32, allow) => ({
  label, key: 'square',
  plan: `主体：左侧三行字线（中间一行短，让出标记）；辅助：右侧的${plan}`,
  weights: { [P]: 1 - w, [S]: w },
  ...(allow ? { allow } : {}),
  draw(g) {
    return [
      line(g.span(3, 4, 15, 4) + g.span(3, 12, 11, 12) + g.span(3, 20, 15, 20), { n: 'rows', role: P }),
      line(mark(g), { n: 'mark', role: S })
    ];
  },
  light: ['mark'],
  fx
});
Object.assign(more, {
  'text-cursor-input': {
    label: '输入框', key: 'landscape', fit: 'x',
    plan: '主体：输入框（横向圆角框，被光标切开）；辅助：工字形光标（与文本光标同形，缩小，穿过输入框）',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      const r = 2, x = 9, t = 3 + g.h, b = 21 - g.h;
      return [
        shell(g.box(2, 7, 20, 10, 2.5), { n: 'field', role: P }),
        line(`M${x + r + 0.5} ${n(t)}H${x + r}A${r} ${r} 0 0 0 ${x} ${n(t + r)}V${n(b - r)}A${r} ${r} 0 0 0 ${x + r} ${n(b)}H${x + r + 0.5}`
          + `M${x - r - 0.5} ${n(t)}H${x - r}A${r} ${r} 0 0 1 ${x} ${n(t + r)}V${n(b - r)}A${r} ${r} 0 0 1 ${x - r} ${n(b)}H${x - r - 0.5}`, { n: 'beam', role: S, gap: true })
      ];
    },
    light: ['beam'],
    // the cursor blinks in the field
    fx: { t: 'keys', on: ['beam'], a: [0.15, 1, 0.15], ms: 720 }
  },
  'text-initial': {
    label: '首字下沉', key: 'square',
    plan: '主体：左上的大写 T（占两行高）；辅助：右侧两行短字线和底部一整行',
    weights: { [P]: 0.36, [S]: 0.64 },
    draw(g) {
      return [
        line(g.span(3, 4, 11, 4) + g.seg(7, 4, 7, 12), { n: 'T', role: P }),
        line(g.span(14, 4, 21, 4) + g.span(14, 12, 21, 12) + g.span(3, 20, 21, 20), { n: 'rows', role: S })
      ];
    },
    light: ['rows'],
    // the initial grows into place over two lines
    fx: { t: 'from', on: ['T'], o: [7, 4], s: 0.6 }
  },
  'pencil-line': {
    label: '书写', key: 'live',
    ends: 'out',
    plan: '主体：斜放的铅笔（与编辑同形）；辅助：右下的一条横线（写出的字迹）；细节：笔尾的箍',
    weights: { [P]: 0.74, [S]: 0.16, [D]: 0.1 },
    draw(g) {
      const { h } = g, p = pencilAt(g, [1.7 + h * 0.8, 22.3 - h * 0.8], 26.3, 6.4, 5.2, 5.3);
      return [
        shell(p.body, { n: 'pencil', role: P }),
        line(p.band, { n: 'band', role: D, on: 'pencil' }),
        line(g.span(12, 21 - h, 21, 21 - h), { n: 'ink', role: S })
      ];
    },
    light: ['ink'],
    fx: [{ t: 'orbit', on: ['pencil', 'band'], R: 0.6, turns: 2 }, { t: 'draw', on: ['ink'] }]
  },
  'square-pen': {
    label: '编写', key: 'square',
    ends: 'out',
    plan: '主体：斜放的铅笔（与编辑同形，缩短，笔尖落在框里）；辅助：方框（右上角被铅笔挡住）；细节：笔尾的箍',
    weights: { [P]: 0.36, [S]: 0.56, [D]: 0.08 },
    draw(g) {
      const o = [10, 14], L = 14, W = 5.2, p = pencilAt(g, o, L, W, 4, 3.6);
      // the clear band round the pencil runs on past its end, so the box's corner is cut away
      // whole and no piece of it is left beyond the pencil
      const e = W / 2 + g.g, c = Math.SQRT1_2, Pt = ([u, v]) => [o[0] + (u + v) * c, o[1] + (v - u) * c];
      const cut = g.polygon([[-g.g, -e], [L + 10, -e], [L + 10, e], [-g.g, e]].map(Pt));
      return [
        shell(g.box(3, 3, 18, 18, 4.5), { n: 'box', role: S }),
        shell(p.body, { n: 'pencil', role: P, cutD: cut }),
        line(p.band, { n: 'band', role: D, on: 'pencil' })
      ];
    },
    fx: { t: 'orbit', on: ['pencil', 'band'], R: 0.8, turns: 2 },
    allow: { sliver: '铅笔的间隙以 45° 切过方框的两边，切口两侧是斜角；不是夹出来的碎块' }
  },
  'list-plus': listMark('添加到列表', '加号', (g) => g.span(13, 12, 21, 12) + g.span(17, 8, 17, 16), { t: 'rotate', on: ['mark'], deg: 90, o: [17, 12] }),
  'list-minus': listMark('从列表移除', '减号', (g) => g.span(13, 12, 21, 12), { t: 'keys', on: ['mark'], o: [17, 12], sx: [0.5], ms: 260 }, 0.2, { optical: '减号只有一横，字线在左侧占多数' }),
  'list-x': listMark('清空列表', '叉号', (g) => { const k = 3.4 - g.h; return g.seg(17 - k, 12 - k, 17 + k, 12 + k) + g.seg(17 + k, 12 - k, 17 - k, 12 + k); }, { t: 'rotate', on: ['mark'], deg: 90, o: [17, 12] }, 0.32, { keyline: '叉号是两条斜线，比加号小一圈，不顶到方框' }),
  'list-check': listMark('列表已完成', '对勾', (g) => g.pl([[13.5 + g.h, 12.3], [16, 14.8 - g.h / 2], [21 - g.h, 9.8 + g.h / 2]]), { t: 'draw', on: ['mark'] }, 0.24),
  'list-todo': {
    label: '待办清单', key: 'square',
    plan: '主体：四行字线（两项，每项两行，与任务清单同）；细节：第一项前的空方框，第二项前的对勾',
    weights: { [P]: 0.62, [D]: 0.38 },
    draw(g) {
      return [
        shell(g.box(3, 4, 6, 6, 1.5), { n: 'box', role: D }),
        line(g.pl([[4, 17], [5.7, 18.7], [8.4, 14.8]]), { n: 'c2', role: D }),
        ...LIST.map((y, i) => line(row(g, y, TX, LONG[1]), { n: `l${i}`, role: P }))
      ];
    },
    fx: { t: 'draw', on: ['c2'] },
    allow: listReason
  },
  'list-tree': {
    label: '层级列表', key: 'square',
    plan: '主体：三行字线（上面一行是父项，下面两行缩进）；辅助：从父项引出、接到两个子项的树枝线',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      return [
        line(g.span(3, 4, 21, 4) + g.span(12, 12, 21, 12) + g.span(12, 20, 21, 20), { n: 'rows', role: P }),
        line(`M5 4V10A2 2 0 0 0 7 12H9M5 10V18A2 2 0 0 0 7 20H9`, { n: 'tree', role: S })
      ];
    },
    light: ['tree'],
    fx: { t: 'draw', on: ['tree'] }
  }
});

// Sort by letter: a down arrow on the left, two small letters stacked on the right (A over Z for
// ascending). The letters stand in 14..20 across, 4..10 and 14..20 down.
const smallA = (g, y) => letterA(g, 14, 20, y, y + 6, y + 4);
const smallZ = (g, y) => `M14 ${y}H20L14 ${y + 6}H20`;
const sortAZ = (asc, label) => ({
  label, key: 'square',
  plan: `主体：右侧上下两个小字母（${asc ? 'A 在上、Z 在下' : 'Z 在上、A 在下'}）；辅助：左侧向下的箭头`,
  weights: { [P]: 0.55, [S]: 0.45 },
  draw(g) {
    const { h } = g;
    return [
      line(g.seg(7, 3 + h, 7, 21 - h) + head(g, 7, 21 - h, 0, 1, 3), { n: 'arrow', role: S }),
      line(asc ? smallA(g, 4) : smallZ(g, 4), { n: 'top', role: P }),
      line(asc ? smallZ(g, 14) : smallA(g, 14), { n: 'bottom', role: P })
    ];
  },
  light: ['arrow'],
  fx: { t: 'keys', on: ['arrow'], y: [1.2, -0.3], ms: 300 }
});
Object.assign(more, {
  'table-of-contents': {
    label: '目录', key: 'square',
    plan: '主体：左侧三行标题（第一行是章，后两行缩进是节）；辅助：右侧对应的页码（短线）',
    weights: { [P]: 0.64, [S]: 0.36 },
    draw(g) {
      return [
        line(g.span(3, 4, 13, 4) + g.span(6, 12, 13, 12) + g.span(6, 20, 13, 20), { n: 'titles', role: P }),
        line([4, 12, 20].map((y) => g.span(16, y, 21, y)).join(''), { n: 'pages', role: S })
      ];
    },
    light: ['pages'],
    fx: { t: 'draw', on: ['titles', 'pages'] }
  },
  space: {
    label: '空格', key: 'square', fit: 'x',
    plan: '主体：空格符（两端向上的长托架）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, x0 = 3 + h, x1 = 21 - h, y0 = 9, yb = 15;
      return [line(`M${n(x0)} ${y0}V${yb - 2}A2 2 0 0 0 ${n(x0 + 2)} ${yb}H${n(x1 - 2)}A2 2 0 0 0 ${n(x1)} ${yb - 2}V${y0}`, { n: 'bar', role: P })];
    },
    // the space bar is pressed and springs back
    fx: { t: 'keys', on: 'all', y: [1.2, 0], ms: 240 }
  },
  'type-square': {
    label: '文本框', key: 'square',
    ends: 'in',
    plan: '主体：框里的字母 T（容器加符号，墨少但层级最高）；辅助：方框',
    weights: { [P]: 0.24, [S]: 0.76 },
    draw(g) {
      return [shell(g.box(3, 3, 18, 18, 4.5), { n: 'box', role: S }), line(g.seg(8, 8, 16, 8) + g.seg(12, 8, 12, 16), { n: 'T', role: P, on: 'box' })];
    },
    fx: { t: 'draw', on: ['T'] }
  },
  'arrow-down-a-z': sortAZ(true, '按字母升序'),
  'arrow-down-z-a': sortAZ(false, '按字母降序')
});

// Variants made by rule (GUIDE.md §4.4) of icons drawn in this file.
const named = (k) => ({ ...(set[k] ?? more[k]), name: k });
const SLASH_CUT = '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块';
const variants = {
  'pen-off': off({ ...offFill(slash(named('pen'), { label: '禁止编辑' })), allow: { ...set.pen.allow, sliver: SLASH_CUT } }, 'pen', { t: 'keys', on: ['barrel', 'nib', 'slit'], o: [12, 21], s: [0.88], ms: 240 }),
};

export default { ...set, ...more, ...variants };
