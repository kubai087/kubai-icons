// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// time: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: calendar-days calendar-week alarm-clock wristwatch history hourglass stopwatch timer metronome
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { strap } from './devices.mjs';

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

export default {
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
};
