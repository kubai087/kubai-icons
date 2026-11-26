// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// time: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: calendar-days calendar-week alarm-clock wristwatch history hourglass stopwatch timer metronome
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { strap } from './devices.mjs';
import { slash, badge } from '../kit.mjs';
import { off, offFill, notched, lessDisc } from '../variants.mjs';
import { gapOf } from '../kit.mjs';

// The hands of the clock (icons.mjs) on a face of outer radius R centred on (cx, cy): the minute
// hand straight up, the hour hand 0.9 as long at 30° below the right; both keep `gap` from the
// inside of the face. No ticks, as on the clock.
function hands(g, cx, cy, R, gap, on = 'face') {
  const L = R - 1.5 * g.s - gap, H = 0.9 * L;
  return [
    line(g.seg(cx, cy, cx, cy - L), { n: 'min', role: D, on }),
    line(g.seg(cx, cy, cx + H * 0.866, cy + H * 0.5), { n: 'hour', role: D, on })
  ];
}

// The calendar of icons.mjs: the book and its header line; T..B is the room left for the dates.
function calendar(g) {
  const { s, h } = g, band = 8 - (s - 2) * 0.3, T = band + h, B = 21 - s;
  return {
    T, B, mid: (T + B) / 2,
    parts: [shell(g.box(3, 3, 18, 18, 4.5), { n: 'box', role: P }), line(g.seg(3 + s, band, 21 - s, band), { n: 'band', role: D, only: 'outline' })]
  };
}

// The calendar and the clock of icons.mjs, as bases for the variants drawn here (icons.mjs keeps
// the icons themselves). The clock's hour hand points to eight o'clock, clear of a corner badge.
const CALENDAR = {
  label: '日历', key: 'square',
  plan: '主体：日历本（方形）；细节：表头线和两排日期点',
  weights: { [P]: 0.64, [D]: 0.36 },
  draw(g) {
    const { s, h } = g, d = s - 2, band = 8 - d * 0.3, r = Math.min(g.dr * 0.7, 1.15), T = band + h, B = 21 - s, gap = (B - T - 4 * r) / 3, y1 = T + gap + r, y2 = B - gap - r, dots = [];
    [y1, y2].forEach((y, j) => [8, 12, 16].forEach((x, i) => dots.push(solid(g.circ(x, y, r), { n: `d${j * 3 + i}`, role: D, on: 'box', vc: j * 3 + i }))));
    return [shell(g.box(3, 3, 18, 18, 4.5), { n: 'box', role: P }), line(g.seg(3 + s, band, 21 - s, band), { n: 'band', role: D, only: 'outline' }), ...dots];
  },
  fx: { t: 'variable', on: ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'], mode: 'cumulative', step: 110 }
};
const CLOCK = {
  label: '时间', key: 'circle',
  plan: '主体：表盘；细节：分针和时针',
  weights: { [P]: 0.82, [D]: 0.18 },
  draw(g) {
    return [
      shell(g.ring(12, 12, 10), { n: 'face', role: P }),
      line(g.seg(12, 12, 12, 2 + g.s + 2 + g.h), { n: 'min', role: D, on: 'face' }),
      line(g.seg(12, 12, 8.1, 14.25), { n: 'hour', role: D, on: 'face' })
    ];
  },
  fx: { t: 'rotate', on: ['min'], deg: 360, o: [12, 12] }
};
// The calendar with a badge, fill: the dot below the middle one lies in the notch, so the three
// that stay rise into the room the header line leaves (as calendar-plus in icons.mjs).
const calendarDots = (L) => L.filter((l) => l.n !== 'd4').map((l) => (/^d[013]$/.test(l.n) ? { ...l, tf: 'translate(0 -2.5)' } : l));
const calendarBadge = (mark, label) => notched(badge(CALENDAR, mark, { label, drop: ['d2', 'd5'] }), calendarDots);
// The calendar's book and header line alone, for a calendar with a larger mark in its date area.
function calendarBook(g) {
  const { s, h } = g, band = 8 - (s - 2) * 0.3;
  return { T: band + h, B: 21 - s, parts: [shell(g.box(3, 3, 18, 18, 4.5), { n: 'box', role: P }), line(g.seg(3 + s, band, 21 - s, band), { n: 'band', role: D, only: 'outline' })] };
}
// The face of a clock whose bottom-right quarter is left open for an arrow, with its hands.
const openClock = (g) => [
  line(g.arc(12, 12, 10 - g.h, 95, 345), { n: 'face', role: P }),
  line(g.seg(12, 12, 12, 2 + g.s + 2 + g.h), { n: 'min', role: D }),
  line(g.seg(12, 12, 8.1, 14.25), { n: 'hour', role: D })
];
// The clock with a badge, fill: the hands move up and left, so the ink between their hub and the
// notch is a stroke wide or gone.
const clockHands = (L) => L.map((l) => (l.n === 'min' || l.n === 'hour' ? { ...l, tf: 'translate(-1 -1)' } : l));
const SLASHED = { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' };

const TIME = {
  'calendar-days': {
    label: '月历', key: 'square',
    plan: '主体：日历本（与日历相同）；细节：表头线和两排六个日期格（小方块，表示整月的格子）',
    weights: { [P]: 0.68, [D]: 0.32 },
    draw(g, ctx) {
      const { mid, parts } = calendar(g), q = 1 + (g.s - 2) * 0.2, cells = [];
      // fill: the cells are holes, kept one stroke apart (spread out at heavy strokes)
      const d = ctx?.variant === 'fill' ? Math.max(4, 2 * q + g.s) : 4;
      [mid - d / 2, mid + d / 2].forEach((y, j) => [12 - d, 12, 12 + d].forEach((x, i) => cells.push(solid(g.area(x - q, y - q, 2 * q, 2 * q, 0.5), { n: `d${j * 3 + i}`, role: D, on: 'box', vc: j * 3 + i }))));
      return [...parts, ...cells];
    },
    fx: { t: 'variable', on: ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'], mode: 'cumulative', step: 110 }
  },
  'calendar-week': {
    label: '周历', key: 'square',
    plan: '主体：日历本（与日历相同）；细节：表头线、表示本周的一条横线和下一排日期点',
    weights: { [P]: 0.64, [D]: 0.36 },
    draw(g, ctx) {
      const { mid, parts } = calendar(g), r = Math.min(g.dr * 0.7, 1.15), fill = ctx?.variant === 'fill';
      // fill: the line and the dots are holes, kept one stroke apart (spread out at heavy strokes)
      const dx = fill ? Math.max(4, 2 * r + g.s) : 4, dy = fill ? Math.max(2, (g.h + r + g.s) / 2) : 2;
      return [
        ...parts,
        line(g.seg(12 - dx, mid - dy, 12 + dx, mid - dy), { n: 'week', role: D, on: 'box' }),
        ...[12 - dx, 12, 12 + dx].map((x, i) => solid(g.circ(x, mid + dy, r), { n: `d${i}`, role: D, on: 'box' }))
      ];
    },
    // 本周这一行从头画到尾
    fx: { t: 'draw', on: ['week'] }
  },
  'alarm-clock': {
    label: '闹钟', key: 'circle',
    plan: '主体：表盘；辅助：两只铃（与表盘同心的短弧，隔开 1.5）和两只脚；细节：分针和时针（与时钟相同）',
    weights: { [P]: 0.55, [S]: 0.3, [D]: 0.15 },
    draw(g) {
      const { h } = g, cy = 13, R = 8, rb = R + g.clear + h;
      const foot = (deg) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s0 = Math.sin(t); return g.seg(12 + (R - h) * c, cy + (R - h) * s0, 12 + 10.2 * c, cy + 10.2 * s0); };
      return [
        line(g.arc(12, cy, rb, -150, -110) + g.arc(12, cy, rb, -70, -30), { n: 'bells', role: S }),
        line(foot(125) + foot(55), { n: 'feet', role: S }),
        shell(g.ring(12, cy, R), { n: 'face', role: P }),
        ...hands(g, 12, cy, R, g.clear)
      ];
    },
    // 闹铃响起：整只闹钟快速摇晃
    fx: { t: 'wiggle', on: 'all', o: [12, 13], deg: 7, hz: 5 }
  },
  wristwatch: {
    label: '腕表', key: 'portrait', fit: 'y',
    plan: '主体：圆形表盘；辅助：上下两段表带（与智能手表相同）；细节：分针和时针（与时钟相同）',
    weights: { [P]: 0.55, [S]: 0.37, [D]: 0.08 },
    draw(g) {
      const { h } = g, R = 6.5, dy = Math.sqrt((R - h) ** 2 - 9);
      return [
        line(strap(g, 12 - dy, true), { n: 'top', role: S }),
        line(strap(g, 12 + dy, false), { n: 'bottom', role: S }),
        shell(g.ring(12, 12, R), { n: 'face', role: P }),
        ...hands(g, 12, 12, R, g.clear)
      ];
    },
    fx: { t: 'rotate', on: ['min'], deg: 360, o: [12, 12] }
  },
  history: {
    label: '历史记录', key: 'square',
    plan: '主体：逆时针的 300° 圆弧（刷新的镜像，再逆时针转 40°，箭头落在左侧，避开分针）；辅助：箭头头部；细节：分针和时针（与时钟相同）',
    weights: { [P]: 0.64, [S]: 0.16, [D]: 0.2 },
    draw(g) {
      // rotate-cw (icons.mjs) mirrored left to right; the hands sit on x 12 so the minute hand is on whole pixels
      const { h } = g, a1 = -55, R = 8.75, cx = 11.75, cy = 12.375, r = R - h, L = 3.5, k = Math.SQRT1_2;
      const rad = (a1 * Math.PI) / 180, E = [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
      const turn = (L * k) / (2 * r), dir = rad + Math.PI / 2 - turn, t = [Math.cos(dir), Math.sin(dir)], nrm = [-t[1], t[0]];
      const A1 = [E[0] - L * k * (t[0] + nrm[0]), E[1] - L * k * (t[1] + nrm[1])], A2 = [E[0] - L * k * (t[0] - nrm[0]), E[1] - L * k * (t[1] - nrm[1])];
      // mirrored, then turned back 40° so the head sits at the left, clear of the minute hand
      const q = (-40 * Math.PI) / 180, m = ([x, y]) => { const dx = 24 - x - (24 - cx), dy = y - cy; return [24 - cx + dx * Math.cos(q) - dy * Math.sin(q), cy + dx * Math.sin(q) + dy * Math.cos(q)]; };
      return [
        line(g.arc(24 - cx, cy, r, 140 - a1, 440 - a1), { n: 'arc', role: P }),
        line(g.pl([m(A1), m(E), m(A2)]), { n: 'head', role: S }),
        ...hands(g, 12, cy, R, g.clear, undefined)
      ];
    },
    area: (g) => [{ n: 'arc', d: g.circ(12.25, 12.375, 8.75 - g.h) }],
    // 时间倒回：指针逆时针转一圈，箭头向回推一下
    fx: [{ t: 'rotate', on: ['min', 'hour'], deg: -360, o: [12, 12.375] }, { t: 'keys', on: ['arc', 'head'], o: [12.25, 12.375], r: [-25], s: [0.94] }],
    allow: { keyline: '与刷新相同：箭头头部伸出圆弧，圆直径 17.5' }
  },
  hourglass: {
    label: '沙漏', key: 'portrait', fit: 'y',
    plan: '主体：两个相对的三角形玻璃泡；辅助：上下两块底板（比玻璃宽）；细节：下方的沙堆（实心）。底板是两条整线，墨量约占四成',
    weights: { [P]: 0.52, [S]: 0.42, [D]: 0.06 },
    draw(g) {
      return [
        shell(g.polygon([[7.5, 3], [16.5, 3], [13.25, 12], [16.5, 21], [7.5, 21], [10.75, 12]], [0, 0, 1.5, 0, 0, 1.5]), { n: 'glass', role: P }),
        solid(g.polygon([[9, 21], [15, 21], [12, 16.5]], [0, 0, 0.8]), { n: 'sand', role: D, on: 'glass' }),
        line(g.span(5, 3, 19, 3) + g.span(5, 21, 19, 21), { n: 'bars', role: S })
      ];
    },
    // 翻过来：玻璃和底板转半圈，沙子落下重新堆起
    fx: [{ t: 'rotate', on: ['glass', 'bars'], deg: 180, o: [12, 12] }, { t: 'keys', on: ['sand'], o: [12, 20], sy: [0.05, 0.05], ms: 700 }]
  },
  stopwatch: {
    label: '秒表', key: 'portrait',
    plan: '主体：表盘；辅助：顶部按钮（横条和短杆）和右上的侧键；细节：一根秒针',
    weights: { [P]: 0.76, [S]: 0.15, [D]: 0.09 },
    draw(g) {
      const { s, h } = g, cy = 14, R = 8, t = (-45 * Math.PI) / 180, c = Math.cos(t), s0 = Math.sin(t), L = R - 1.5 * s - g.clear;
      return [
        line(g.span(9.5, 3, 14.5, 3) + g.seg(12, 3, 12, cy - R + h), { n: 'crown', role: S }),
        line(g.seg(12 + (R - h) * c, cy + (R - h) * s0, 12 + 9.5 * c, cy + 9.5 * s0), { n: 'button', role: S }),
        shell(g.ring(12, cy, R), { n: 'face', role: P }),
        line(g.seg(12, cy, 12, cy - L), { n: 'hand', role: D, on: 'face' })
      ];
    },
    // 按下按钮，秒针走一圈
    fx: [{ t: 'keys', on: ['crown'], y: [0.9], ms: 180 }, { t: 'rotate', on: ['hand'], deg: 360, o: [12, 14] }]
  },
  timer: {
    label: '计时器', key: 'circle',
    plan: '主体：表盘（顶部留口的圆弧）；辅助：缺口里的起点刻度；细节：从中心指向左上的指针',
    weights: { [P]: 0.82, [S]: 0.07, [D]: 0.11 },
    draw(g) {
      const { s, h } = g, L = 10 - 1.5 * s - 2, a = (-135 * Math.PI) / 180;
      return [
        line(g.arc(12, 12, 10 - h, -65, 245), { n: 'dial', role: P }),
        line(g.span(12, 2, 12, 6.5), { n: 'tick', role: S }),
        line(g.seg(12, 12, 12 + L * Math.cos(a), 12 + L * Math.sin(a)), { n: 'hand', role: D })
      ];
    },
    area: (g) => [{ n: 'dial', d: g.circ(12, 12, 10 - g.h) }],
    // 拨到一个时间，指针再走回起点
    fx: { t: 'keys', on: ['hand'], o: [12, 12], r: [100], ms: 320 }
  },
  metronome: {
    anchor: 'base',
    label: '节拍器', key: 'portrait',
    ends: 'out',
    plan: '主体：梯形机身；辅助：摆杆和摆锤（实心）；细节：前面板的横线',
    weights: { [P]: 0.62, [S]: 0.22, [D]: 0.16 },
    draw(g) {
      const { h } = g, xl = 9 - ((17 - 2 - h) / (20 - 2 * h)) * (5.7 - h);
      return [
        shell(g.polygon([[9, 2 + h], [15, 2 + h], [20.7 - h, 22 - h], [3.3 + h, 22 - h]], [1.5, 1.5, 2.5, 2.5]), { n: 'body', role: P }),
        line(g.seg(xl, 17, 24 - xl, 17), { n: 'panel', role: D, on: 'body' }),
        line(g.seg(12, 17, 12, 7), { n: 'arm', role: S, on: 'body' }),
        solid(g.area(10, 11, 4, 2, 0.75), { n: 'weight', role: S, on: 'body' })
      ];
    },
    // 摆杆左右摆动，慢慢停下
    fx: { t: 'wiggle', on: ['arm', 'weight'], o: [12, 17], deg: 18, hz: 2 }
  },
  'calendar-check': { ...calendarBadge('check', '已安排'), fx: { t: 'draw', on: ['badge'] } },
  'calendar-x': { ...calendarBadge('x', '取消日程'), fx: { t: 'rotate', on: ['badge'], deg: 90, oBadge: true } },
  'calendar-minus': { ...calendarBadge('minus', '移除日程'), fx: { t: 'draw', on: ['badge'] } },
  // the dates would sit on the slash: the slashed calendar is the book alone
  'calendar-off': off({ ...offFill(slash({ ...CALENDAR, draw: (g) => calendarBook(g).parts }, { label: '无日程' })), allow: SLASHED }, 'calendar', { t: 'keys', on: ['box', 'band'], o: [12, 12], s: [0.9], ms: 240 }),
  'calendar-clock': {
    label: '日程时间', key: 'square',
    plan: '主体：日历本（与日历相同，不画日期点）；辅助：右下角的时钟（挡住日历一角）；细节：表头线、时钟的指针',
    weights: { [P]: 0.46, [S]: 0.38, [D]: 0.16 },
    draw(g, ctx) {
      const { s, h } = g, L = 6 - 1.5 * s - g.clear, [box, band] = calendarBook(g).parts;
      // fill: the book is clipped where the clock's clear band runs out through its edge
      const cut = ctx?.variant === 'fill' ? { ...box, d: lessDisc(box.d, 15, 15, 6 + gapOf(s) + h) } : box;
      return [
        cut, band,
        shell(g.ring(15, 15, 6), { n: 'clock', role: S, occ: true, part: 'clock' }),
        line(g.seg(15, 15, 15, 15 - L) + g.seg(15, 15, 15 + L * 0.9, 15), { n: 'hands', role: D, on: 'clock', part: 'clock' })
      ];
    },
    fx: { t: 'rotate', on: ['hands'], deg: 360, o: [15, 15] }
  },
  'calendar-range': {
    label: '日期范围', key: 'square',
    plan: '主体：日历本（与日历相同）；细节：表头线、两排日期，选中的几天连成横线，跨过两行',
    weights: { [P]: 0.64, [D]: 0.36 },
    draw(g, ctx) {
      const { s } = g, r = Math.min(g.dr * 0.7, 1.15);
      // fill: the rows are holes, kept one stroke apart (spread out at heavy strokes)
      const dy = ctx?.variant === 'fill' ? Math.max(4, 2 * s) : 4, y1 = 14 - dy / 2, y2 = 14 + dy / 2;
      return [
        ...calendarBook(g).parts,
        solid(g.circ(8, y1, r), { n: 'd0', role: D, on: 'box' }),
        line(g.seg(12, y1, 16, y1), { n: 'r1', role: D, on: 'box' }),
        line(g.seg(8, y2, 12, y2), { n: 'r2', role: D, on: 'box' }),
        solid(g.circ(16, y2, r), { n: 'd1', role: D, on: 'box' })
      ];
    },
    fx: { t: 'draw', on: ['r1', 'r2'] }
  },
  'calendar-search': {
    label: '搜索日程', key: 'square',
    plan: '主体：日历本（与日历相同，不画日期点）；辅助：右下角的放大镜（挡住日历一角）；细节：表头线',
    weights: { [P]: 0.5, [S]: 0.38, [D]: 0.12 },
    draw(g, ctx) {
      const { h } = g, k = Math.SQRT1_2, c = 14.5, R = 5.25, e = R - h, [box, band] = calendarBook(g).parts;
      // fill: the book is clipped where the lens's clear band runs out through its edge
      const cut = ctx?.variant === 'fill' ? { ...box, d: lessDisc(box.d, c, c, R + gapOf(g.s) + h) } : box;
      return [
        cut, band,
        shell(g.ring(c, c, R), { n: 'lens', role: S, occ: true, part: 'glass' }),
        line(g.seg(c + e * k, c + e * k, 21 - h * k - h, 21 - h * k - h), { n: 'handle', role: S, occ: true, part: 'glass' })
      ];
    },
    fx: { t: 'orbit', on: ['lens', 'handle'], R: 0.9 }
  },
  'calendar-heart': {
    label: '纪念日', key: 'square',
    plan: '主体：日历本（与日历相同）；细节：表头线和日期区里的心形（实心，太小画不出线框）',
    weights: { [P]: 0.66, [D]: 0.34 },
    draw(g) {
      const { T, B, parts } = calendarBook(g), top = T + g.clear + g.h, tip = B - g.clear;
      return [...parts, solid(heart({ h: 0 }, { w: 2.1 * (tip - top) * 0.5 + 2.5, top, tip, R: (tip - top) * 0.3 }), { n: 'heart', role: D, on: 'box' })];
    },
    fx: { t: 'beat', on: ['heart'], o: [12, 14.5] }
  },
  'calendar-1': {
    label: '今天', key: 'square',
    plan: '主体：日历本（与日历相同）；细节：表头线和日期区里的数字 1',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g) {
      const { T, B, parts } = calendarBook(g), top = T + g.clear + g.h, bot = B - g.clear - g.h;
      return [...parts, line(g.pl([[9.75, top + 1.25], [12, top], [12, bot]]), { n: 'one', role: D, on: 'box' })];
    },
    allow: { sliver: '数字 1 的斜笔和竖笔相交，夹角内侧是字形本身的细处，不是镂空切出来的' },
    fx: { t: 'draw', on: ['one'] }
  },
  'clock-plus': { ...notched(badge(CLOCK, 'plus', { label: '添加时间' }), clockHands), fx: { t: 'rotate', on: ['badge'], deg: 90, oBadge: true } },
  'clock-check': { ...notched(badge(CLOCK, 'check', { label: '准时' }), clockHands), fx: { t: 'draw', on: ['badge'] } },
  'clock-alert': {
    label: '超时提醒', key: 'landscape',
    plan: '主体：表盘（左侧，直径 16）；辅助：右侧的感叹号（竖线和实心点）；细节：分针和时针（与时钟相同）',
    weights: { [P]: 0.6, [S]: 0.24, [D]: 0.16 },
    draw(g) {
      const { s } = g, L = 8 - 1.5 * s - g.clear;
      return [
        shell(g.ring(10, 12, 8), { n: 'face', role: P }),
        line(g.seg(10, 12, 10, 12 - L) + g.seg(10, 12, 10 + 0.9 * L * 0.866, 12 + 0.9 * L * 0.5), { n: 'hands', role: D, on: 'face' }),
        line(g.span(21, 4, 21, 14.5), { n: 'bar', role: S, part: 'mark' }),
        solid(g.dot(21, 18.5, 0.85), { n: 'dot', role: S, part: 'mark' })
      ];
    },
    // 提醒：感叹号跳一下，表盘晃动
    fx: [{ t: 'keys', on: ['bar', 'dot'], y: [-1.2, 0.3], ms: 260 }, { t: 'wiggle', on: ['face', 'hands'], o: [10, 12], deg: 6, hz: 4 }]
  },
  'clock-arrow-up': {
    label: '时间升序', key: 'circle',
    plan: '主体：表盘（右下留口的圆弧）；辅助：缺口里向上的箭头；细节：分针和时针（时针指向八点，避开箭头）',
    weights: { [P]: 0.6, [S]: 0.26, [D]: 0.14 },
    draw(g) {
      const { h } = g;
      return [...openClock(g), line(g.seg(18, 13, 18, 22 - h) + g.pl([[15, 16], [18, 13], [21, 16]]), { n: 'arrow', role: S })];
    },
    area: (g) => [{ n: 'face', d: g.circ(12, 12, 10 - g.h) }],
    fx: { t: 'keys', on: ['arrow'], y: [-1.4, 0.3], ms: 260 }
  },
  'clock-arrow-down': {
    label: '时间降序', key: 'circle',
    plan: '同时间升序，箭头向下',
    weights: { [P]: 0.6, [S]: 0.26, [D]: 0.14 },
    draw(g) {
      const { h } = g;
      return [...openClock(g), line(g.seg(18, 13, 18, 22 - h) + g.pl([[15, 22 - h - 3], [18, 22 - h], [21, 22 - h - 3]]), { n: 'arrow', role: S })];
    },
    area: (g) => [{ n: 'face', d: g.circ(12, 12, 10 - g.h) }],
    fx: { t: 'keys', on: ['arrow'], y: [1.2, -0.3], ms: 260 }
  },
};

// The alarm clock and the timer with their hands turned away from a corner badge or a slash.
const mirrorX = (d) => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${n(24 - +x)} ${y}`);
const turnHand = (icon, name) => ({ ...icon, draw: (g, ctx) => icon.draw(g, ctx).map((l) => (l.n === name ? { ...l, d: mirrorX(l.d) } : l)) });
const ALARM = turnHand(TIME['alarm-clock'], 'hour');
// fill: the hands move up and left, so the ink between their hub and the notch is a stroke wide
const alarm = (mark, label) => notched(badge(ALARM, mark, { label }), (L) => L.map((l) => (l.n === 'min' || l.n === 'hour' ? { ...l, tf: 'translate(-1.5 -1.25)' } : l)));

export default {
  ...TIME,
  'alarm-clock-plus': { ...alarm('plus', '添加闹钟'), fx: { t: 'rotate', on: ['badge'], deg: 90, oBadge: true } },
  'alarm-clock-check': { ...alarm('check', '闹钟已设定'), fx: { t: 'draw', on: ['badge'] } },
  'alarm-clock-minus': { ...alarm('minus', '删除闹钟'), fx: { t: 'draw', on: ['badge'] } },
  'alarm-clock-off': off({ ...offFill(slash(ALARM, { label: '闹钟关闭' })), allow: SLASHED }, 'alarm-clock', { t: 'keys', on: ['bells'], o: [12, 13], s: [0.9], ms: 240 }),
  timeline: {
    nudge: [1, 0],
    label: '时间线', key: 'square',
    plan: '主体：竖线和三个节点（实心圆点压在竖线上）；细节：节点右侧的三行字（中间一行短）。节点和竖线在左侧，整体右移 1',
    weights: { [P]: 0.5, [D]: 0.5 },
    draw(g) {
      const r = 1.25 * g.dr;
      return [
        line(g.span(6, 3, 6, 21), { n: 'axis', role: P, part: 'axis' }),
        ...[5, 12, 19].map((y, i) => solid(g.circ(6, y, r), { n: `p${i}`, role: P, part: 'axis', vc: i })),
        line(g.seg(11, 5, 22 - g.h, 5) + g.seg(11, 12, 18, 12) + g.seg(11, 19, 22 - g.h, 19), { n: 'text', role: D })
      ];
    },
    fx: { t: 'variable', on: ['p0', 'p1', 'p2'], mode: 'cumulative', step: 140 }
  },
  'timer-off': off({ ...offFill(slash(turnHand(TIME.timer, 'hand'), { label: '计时关闭' })), allow: SLASHED }, 'timer', { t: 'keys', on: ['hand'], o: [12, 12], r: [-40], ms: 300 })
};
