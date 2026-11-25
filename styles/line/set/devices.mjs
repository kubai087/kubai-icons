// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// devices: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: tablet laptop desktop monitor tv watch keyboard mouse printer scanner server hard-drive cpu usb router bluetooth signal antenna nfc battery-medium battery-low battery-empty battery-charging plug save webcam game-console gamepad earbuds cast scan-qr
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// Every screen (laptop, desktop, monitor, tv, cast) has the same outer corner radius.
const SCR = 3;

// A watch strap by its centre line: two legs at x 9 and 15 from the case (y0) to the edge of the
// live area, joined by a short bar with small corners. top: the strap above the case, or below it.
export function strap(g, y0, top = true) {
  const { h } = g, e = top ? 2 + h : 22 - h, k = top ? 1 : -1, sw = top ? 1 : 0;
  return `M9 ${n(y0)}V${n(e + k)}A1 1 0 0 ${sw} 10 ${n(e)}H14A1 1 0 0 ${sw} 15 ${n(e + k)}V${n(y0)}`;
}

// The battery of icons.mjs: case, positive terminal and up to three cells (2 wide, 2 apart).
function battery(g, cells) {
  const { s } = g, m = 4 - s, x0 = 2 + s + m, y0 = 6 + s + m, y1 = 18 - s - m, x1 = 20 - s - m, w = (x1 - x0) / 5;
  return [
    shell(g.box(2, 6, 18, 12, 3.5), { n: 'body', role: P }),
    solid(g.rr(19, 10, 3, 4, [0, 1.25, 1.25, 0]), { n: 'nub', role: S }),
    ...Array.from({ length: cells }, (_, i) => solid(g.rr(x0 + i * 2 * w, y0, w, y1 - y0, 0.9), { n: `c${i}`, role: D, vc: i, on: 'body' }))
  ];
}

export default {
  tablet: {
    label: '平板', key: 'portrait',
    plan: '主体：机身（与手机同样的做法，加宽到纵向参考线）；细节：顶部听筒条（与手机相同）',
    weights: { [P]: 0.9, [D]: 0.1 },
    draw(g) {
      const y = 2 + g.s + 2 + g.h;
      return [shell(g.box(4, 2, 16, 20, 3.5), { n: 'tablet', role: P }), line(g.seg(10.2, y, 13.8, y), { n: 'island', role: D, on: 'tablet' })];
    },
    // 平板转成横屏，再转回来
    fx: { t: 'keys', on: 'all', o: [12, 12], r: [-90, -90], s: [0.9, 0.9], ms: 620 }
  },
  laptop: {
    label: '笔记本电脑', key: 'landscape',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：屏幕；辅助：底座（比屏幕宽，铺满横向参考线）',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) { return [shell(g.box(4, 4, 16, 12, SCR), { n: 'screen', role: P }), line(g.span(2, 19, 22, 19), { n: 'base', role: S })]; },
    // 合上屏幕再打开：屏幕绕底边的铰链折下
    fx: { t: 'keys', on: ['screen'], o: [12, 16], sy: [0.12], ms: 340 }
  },
  desktop: {
    anchor: 'base',
    label: '台式电脑', key: 'landscape', fit: 'x',
    ends: 'in',
    plan: '主体：屏幕；辅助：支架（立杆和底座，与显示器相同）；细节：屏幕下沿的下巴线',
    weights: { [P]: 0.6, [S]: 0.22, [D]: 0.18 },
    draw(g) {
      const { s, h } = g, y = 16 - s - 2 - h;
      return [
        shell(g.box(2, 3, 20, 13, SCR), { n: 'screen', role: P }),
        line(g.seg(2 + s, y, 22 - s, y), { n: 'chin', role: D, on: 'screen' }),
        line(g.seg(12, 16 - h, 12, 20) + g.span(7, 20, 17, 20), { n: 'stand', role: S })
      ];
    },
    fx: { t: 'bounce', on: 'all', o: [12, 21], amp: 0.7 }
  },
  monitor: {
    anchor: 'base',
    label: '显示器', key: 'landscape', fit: 'x',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：屏幕；辅助：支架（立杆和底座）',
    weights: { [P]: 0.75, [S]: 0.25 },
    draw(g) {
      const { h } = g;
      return [shell(g.box(2, 3, 20, 13, SCR), { n: 'screen', role: P }), line(g.seg(12, 16 - h, 12, 20) + g.span(7, 20, 17, 20), { n: 'stand', role: S })];
    },
    // 屏幕在支架上转动，再回正
    fx: { t: 'wiggle', on: ['screen'], o: [12, 16], deg: 6, hz: 2.2 }
  },
  tv: {
    label: '电视', key: 'landscape', fit: 'x',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：屏幕；辅助：V 形天线（从屏幕上沿中点伸出）',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const { h } = g;
      return [shell(g.box(2, 7, 20, 13, SCR), { n: 'screen', role: P }), line(g.pl([[8, 2 + h], [12, 7 + h], [16, 2 + h]]), { n: 'antenna', role: S })];
    },
    fx: { t: 'wiggle', on: ['antenna'], o: [12, 8], deg: 12, hz: 2.6 }
  },
  watch: {
    label: '智能手表', key: 'portrait', fit: 'y',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：表壳（圆角方形）；辅助：上下两段表带（与腕表相同）',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      const { h } = g;
      return [
        line(strap(g, 6 + h, true), { n: 'top', role: S }),
        line(strap(g, 18 - h, false), { n: 'bottom', role: S }),
        shell(g.box(5, 6, 14, 12, 3.5), { n: 'case', role: P })
      ];
    },
    area: (g) => [{ n: 'top', d: g.rr(9, 2 + g.h, 6, 4, [1, 1, 0, 0]) }, { n: 'bottom', d: g.rr(9, 18, 6, 4 - g.h, [0, 0, 1, 1]) }],
    // 来消息时轻轻振动
    fx: { t: 'shake', on: 'all', x: 0.6, ms: 480 }
  },
  keyboard: {
    label: '键盘', key: 'landscape', fit: 'x',
    plan: '主体：键盘外壳；细节：一排按键（实心点）和空格键',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g, ctx) {
      const { s } = g, fill = ctx?.variant === 'fill', e = Math.max(0, s - 2);
      // fill: the holes keep one stroke between them; at heavy strokes the keys get a little
      // smaller and the key row and the space bar move apart
      const r = fill ? 1 - e * 0.2 : 1, sp0 = 3.5 - (s - 2) * 0.5, sp = fill ? Math.max(sp0, s + 2 * r) : sp0;
      const yk = fill ? 10 - e * 0.6 : 10, ys = fill ? 14 + e * 0.7 : 14;
      return [
        shell(g.box(2, 5, 20, 14, 3.5), { n: 'case', role: P }),
        ...[0, 1, 2, 3].map((i) => solid(g.circ(12 + (i - 1.5) * sp, yk, r), { n: `k${i}`, role: D, on: 'case', vc: i })),
        line(g.seg(8, ys, 16, ys), { n: 'space', role: D, on: 'case', vc: 4 })
      ];
    },
    // 依次按下各个键
    fx: { t: 'variable', on: ['k0', 'k1', 'k2', 'k3', 'space'], mode: 'iterative', step: 120 }
  },
  mouse: {
    label: '鼠标', key: 'portrait', fit: 'y',
    plan: '主体：胶囊形外壳；细节：滚轮',
    weights: { [P]: 0.9, [D]: 0.1 },
    draw(g) {
      const { s, h } = g, y0 = 2 + s + 1.5 + h;
      return [shell(g.box(5, 2, 14, 20, 7), { n: 'body', role: P }), line(g.seg(12, y0, 12, y0 + 3), { n: 'wheel', role: D, on: 'body' })];
    },
    // 滚轮向下滚动两下
    fx: { t: 'keys', on: ['wheel'], y: [1.2, 0, 1.2], ms: 560 }
  },
  printer: {
    label: '打印', key: 'square',
    plan: '主体：机身；辅助：上方的进纸和下方送出的纸（送出的纸挡住机身下沿）。两张纸合起来比机身略多',
    weights: { [P]: 0.44, [S]: 0.56 },
    draw(g, ctx) {
      const { h } = g;
      // fill: the body beside the sheet's clear band is a narrow strip. At heavy strokes the sheet
      // gets a little narrower so the strip stays one stroke wide, and the body's bottom corners
      // get a smaller round (its curve ends before the band), so the strip ends square, not in a
      // wedge
      const fill = ctx?.variant === 'fill', e = fill ? Math.max(0, g.s + g.g - 4) : 0, w = 4 - g.g + e;
      const cb = fill ? Math.min(3, h + (w - h) / 1.8) : 3;
      return [
        line(`M${n(7 + h)} ${n(8 + h)}V${n(3 + h + 1)}A1 1 0 0 1 ${n(8 + h)} ${n(3 + h)}H${n(16 - h)}A1 1 0 0 1 ${n(17 - h)} ${n(3 + h + 1)}V${n(8 + h)}`, { n: 'paper', role: S }),
        shell(g.box(3, 8, 18, 10, [3, 3, cb, cb]), { n: 'body', role: P }),
        shell(g.box(7 + e, 13, 10 - 2 * e, 8, [0, 0, 1.5, 1.5]), { n: 'sheet', role: S, occ: true })
      ];
    },
    area: (g) => [{ n: 'paper', d: g.rr(7 + g.h, 3 + g.h, 10 - g.s, 5, [1, 1, 0, 0]) }],
    // 打印好的纸向下送出
    fx: { t: 'keys', on: ['sheet'], y: [1.5], ms: 380 }
  },
  scanner: {
    anchor: 'base',
    label: '扫描仪', key: 'landscape',
    plan: '主体：机身；辅助：掀开的盖板（从左上角的铰链斜向右上）；细节：扫描灯条',
    weights: { [P]: 0.6, [S]: 0.25, [D]: 0.15 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(2, 10, 20, 10, 3), { n: 'body', role: P }),
        line(g.seg(5, 10 + h, 21, 5), { n: 'lid', role: S }),
        line(g.seg(7, 15, 17, 15), { n: 'light', role: D, on: 'body' })
      ];
    },
    // 盖板再掀起一点，灯条亮起扫过
    fx: [{ t: 'keys', on: ['lid'], o: [5, 11], r: [-8] }, { t: 'draw', on: ['light'] }]
  },
  server: {
    label: '服务器', key: 'square',
    plan: '主体：机柜；细节：中间的分隔线，每层一个指示灯（实心点）和一条槽线',
    weights: { [P]: 0.62, [D]: 0.38 },
    draw(g, ctx) {
      const { s, h } = g, r = Math.min(g.dr * 0.7, 1.15);
      // fill: each row sits in the middle of its unit, and the light keeps one stroke from the
      // slot (it moves left, not past one stroke from the side)
      const fill = ctx?.variant === 'fill', dy = fill ? 0.5 + h / 2 : 0;
      const x = fill ? Math.max(Math.min(8, 12 - 1.5 * s - r), 3 + s + r) : 8, y0 = 8 - dy, y1 = 16 + dy;
      return [
        shell(g.box(3, 3, 18, 18, 4), { n: 'rack', role: P }),
        // two units stacked: in the fill variant the shelf line cuts the rack in two, and the
        // slots keep one stroke from the round corners
        line(g.seg(3 + s, 12, 21 - s, 12), { n: 'shelf', role: D, on: 'rack', ends: 'out' }),
        solid(g.circ(x, y0, r), { n: 'd0', role: D, on: 'rack', vc: 0 }),
        solid(g.circ(x, y1, r), { n: 'd1', role: D, on: 'rack', vc: 1 }),
        line(g.seg(12, y0, 16, y0) + g.seg(12, y1, 16, y1), { n: 'slots', role: D, on: 'rack', ends: 'in' })
      ];
    },
    // 两个指示灯轮流闪
    fx: { t: 'variable', on: ['d0', 'd1'], mode: 'iterative' }
  },
  'hard-drive': {
    label: '硬盘', key: 'landscape', fit: 'x',
    plan: '主体：外壳；细节：指示灯（实心点）和读写条',
    weights: { [P]: 0.82, [D]: 0.18 },
    draw(g) {
      const r = Math.min(g.dr * 0.7, 1.15);
      return [
        shell(g.box(2, 6, 20, 12, 3.5), { n: 'case', role: P }),
        solid(g.circ(7, 12, r), { n: 'led', role: D, on: 'case' }),
        line(g.seg(11, 12, 17, 12), { n: 'bar', role: D, on: 'case' })
      ];
    },
    // 读写：读写条画出，指示灯闪两下
    fx: [{ t: 'draw', on: ['bar'] }, { t: 'keys', on: ['led'], a: [0.2, 1, 0.2, 1] }]
  },
  cpu: {
    label: '处理器', key: 'square',
    plan: '主体：芯片外壳；辅助：四边各两根引脚；细节：中间的核心（小方框）',
    weights: { [P]: 0.6, [S]: 0.2, [D]: 0.2 },
    draw(g) {
      const { h } = g, pins = [9, 15].flatMap((v) => [g.seg(v, 3 + h, v, 5 + h), g.seg(v, 21 - h, v, 19 - h), g.seg(3 + h, v, 5 + h, v), g.seg(21 - h, v, 19 - h, v)]).join('');
      return [
        line(pins, { n: 'pins', role: S }),
        shell(g.box(5, 5, 14, 14, 3.5), { n: 'chip', role: P }),
        shell(g.box(9, 9, 6, 6, 1.5), { n: 'core', role: D, on: 'chip' })
      ];
    },
    // 核心跳动两下，表示正在运算
    fx: { t: 'beat', on: ['core'], o: [12, 12], amp: 0.16 }
  },
  usb: {
    label: 'U 盘', key: 'portrait', fit: 'y',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：盘身；辅助：上方的接口（比盘身窄）',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) {
      const { h } = g;
      return [
        line(`M9 ${n(9 + h)}V${n(3 + h)}A1 1 0 0 1 10 ${n(2 + h)}H14A1 1 0 0 1 15 ${n(3 + h)}V${n(9 + h)}`, { n: 'plug', role: S, only: 'outline' }),
        shell(g.box(8, 2, 8, 9, [2, 2, 0, 0]), { n: 'plug', role: S, only: 'fill' }),
        shell(g.box(6, 9, 12, 13, 3), { n: 'body', role: P })
      ];
    },
    // 向上插进接口，再回到原位
    fx: { t: 'keys', on: 'all', y: [-1.3, 0.3] }
  },
  router: {
    anchor: 'base',
    label: '路由器', key: 'landscape', fit: 'x',
    plan: '主体：机身；辅助：上方两道信号弧（与无线网络同一做法）；细节：三个指示灯（实心点）',
    weights: { [P]: 0.62, [S]: 0.3, [D]: 0.08 },
    draw(g) {
      const { s } = g, r = Math.min(1, 1 - (s - 2) * 0.5);
      return [
        shell(g.box(2, 12, 20, 9, 3), { n: 'box', role: P }),
        ...[8.5, 12, 15.5].map((x, i) => solid(g.circ(x, 16.5, r), { n: `l${i}`, role: D, on: 'box' })),
        line(g.arc(12, 12, 4.5, 232, 308), { n: 'w1', role: S, vc: 0 }),
        line(g.arc(12, 12, 9, 232, 308), { n: 'w2', role: S, vc: 1 })
      ];
    },
    fx: { t: 'variable', on: ['w1', 'w2'], mode: 'cumulative' }
  },
  bluetooth: {
    label: '蓝牙', key: 'portrait', fit: 'y',
    plan: '主体：蓝牙符号（一笔画成的竖线和两个折角）',
    weights: { [P]: 1 },
    draw(g) {
      return [
        line(g.pl([[7.5, 7.5], [16.5, 16.5], [12, 21], [12, 3], [16.5, 7.5], [7.5, 16.5]]), { n: 'rune', role: P }),
        line(g.arc(12, 12, 9, -25, 25), { n: 'wr', role: S, ghost: true }),
        line(g.arc(12, 12, 9, 155, 205), { n: 'wl', role: S, ghost: true })
      ];
    },
    // 连接：两侧出现信号弧
    fx: { t: 'keys', on: ['wl', 'wr'], ghost: true, a: [1, 1, 1], ms: 460 }
  },
  signal: {
    anchor: 'base', nudge: [-1, 0],
    label: '信号', key: 'square',
    plan: '主体：四根由低到高的信号柱（实心：柱宽 3，画成线框在粗字重下内部会闭合）。右边高、分量在右，整体左移 1',
    weights: { [P]: 1 },
    draw(g) {
      const w = 3 + (g.s - 2) * 0.6;
      return [15, 11, 7, 3].map((top, i) => solid(g.area(2 + i * 5 - (w - 3) / 2, top, w, 21 - top, 1), { n: `b${i}`, role: P, vc: i }));
    },
    fx: { t: 'variable', on: ['b0', 'b1', 'b2', 'b3'], mode: 'cumulative' }
  },
  antenna: {
    anchor: 'base',
    label: '天线', key: 'square',
    plan: '主体：天线杆和顶端的发射点；辅助：左右各两道信号弧（与无线网络同一做法）。内弧较短，给天线杆留出间距',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g) {
      const { s, h } = g, cy = 9, Ro = 9.25 - h, Ri = Ro - s - g.clear, ai = 28, ao = 40;
      const both = (R, a) => g.arc(12, cy, R, -a, a) + g.arc(12, cy, R, 180 - a, 180 + a);
      return [
        line(g.seg(12, cy, 12, 21 - h), { n: 'mast', role: P }),
        solid(g.dot(12, cy, 1.05 - (s - 2) * 0.4), { n: 'tip', role: P }),
        line(both(Ri, ai), { n: 'w1', role: S, vc: 0 }),
        line(both(Ro, ao), { n: 'w2', role: S, vc: 1 })
      ];
    },
    fx: { t: 'variable', on: ['w1', 'w2'], mode: 'cumulative' }
  },
  nfc: {
    label: 'NFC 感应', key: 'portrait', fit: 'y',
    plan: '主体：四道同心弧，向右展开（非接触感应的通用记号，与无线网络的弧同一做法）',
    weights: { [P]: 1 },
    draw(g) {
      const cx = 3.4;
      return [0, 1, 2, 3].map((i) => line(g.arc(cx, 12, 2.75 + i * 3.75, -38, 38), { n: `a${i}`, role: P, vc: i }));
    },
    fx: { t: 'variable', on: ['a0', 'a1', 'a2', 'a3'], mode: 'cumulative' }
  },
  'battery-medium': {
    label: '电量中', key: 'landscape', fit: 'x',
    plan: '同电池，电量格两格',
    weights: { [P]: 0.77, [S]: 0.1, [D]: 0.13 },
    draw(g) { return battery(g, 2); },
    fx: { t: 'variable', on: ['c0', 'c1'], mode: 'cumulative', step: 220 }
  },
  'battery-low': {
    label: '电量低', key: 'landscape', fit: 'x',
    plan: '同电池，电量格一格',
    weights: { [P]: 0.83, [S]: 0.1, [D]: 0.07 },
    draw(g) { return battery(g, 1); },
    // 电量低：仅剩的一格闪烁
    fx: { t: 'variable', on: ['c0'], mode: 'iterative', step: 220 }
  },
  'battery-empty': {
    label: '电量耗尽', key: 'landscape', fit: 'x',
    plan: '同电池，没有电量格',
    weights: { [P]: 0.9, [S]: 0.1 },
    draw(g) { return battery(g, 0); },
    // 电量耗尽：整个电池闪烁
    fx: { t: 'variable', on: [['body', 'nub']], mode: 'iterative', step: 260 }
  },
  'battery-charging': {
    label: '电池', key: 'landscape', fit: 'x',
    light: ['bolt'],
    plan: '主体：电池壳和闪电（闪电说明正在充电，伸出壳的上下沿，切开壳）；辅助：正极。闪电太窄，画成实心',
    weights: { [P]: 0.9, [S]: 0.1 },
    draw(g, ctx) {
      const pts = [[13, 4], [7, 13], [10.5, 13], [9, 20], [15, 11], [11.5, 11]];
      if (ctx?.variant !== 'fill') return [...battery(g, 0), solid(g.polygon(pts, [0.8, 0.8, 0, 0.8, 0.8, 0]), { n: 'bolt', role: P, occ: true })];
      // Fill: the solid bolt is too thin to stand alone in its clear band at heavy strokes. Here it
      // is a closed form (its outline grows by h, so no part is thinner than a stroke): the same
      // bolt at 3/4 size, its tips on the case's top and bottom edges, so the band cuts the case
      // square there. On the side where the band leaves the edge at a slant, an arc stroke round
      // a fillet (radius h) clears the ink's sharp corner.
      const { h } = g, c = [11, 12], q = pts.map(([x, y]) => [c[0] + (x - c[0]) * 0.75, c[1] + (y - c[1]) * 0.75]);
      const fillet = (A, B, y, e1) => {
        const L = Math.hypot(B[0] - A[0], B[1] - A[1]), e2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L];
        // the band's edge: the bolt's edge AB moved out by h + g, away from the bolt's middle
        const nx = e2[1], ny = -e2[0], sg = Math.sign((c[0] - A[0]) * nx + (c[1] - A[1]) * ny) || 1, o = h + g.g;
        const P0 = [A[0] - sg * nx * o, A[1] - sg * ny * o], P = [P0[0] + (e2[0] * (y - P0[1])) / e2[1], y];
        const th = Math.acos(e1[0] * e2[0] + e1[1] * e2[1]), bl = Math.hypot(e1[0] + e2[0], e1[1] + e2[1]);
        const b = [(e1[0] + e2[0]) / bl, (e1[1] + e2[1]) / bl], dO = h / Math.sin(th / 2), O = [P[0] + b[0] * dO, P[1] + b[1] * dO];
        const foot = (e) => { const t = (O[0] - P[0]) * e[0] + (O[1] - P[1]) * e[1], F = [P[0] + e[0] * t, P[1] + e[1] * t], m = Math.hypot(F[0] - O[0], F[1] - O[1]); return [(F[0] - O[0]) / m, (F[1] - O[1]) / m]; };
        const n1 = foot(e1), n2 = foot(e2), at = (u) => `${n(O[0] + 2 * h * u[0])} ${n(O[1] + 2 * h * u[1])}`;
        return `M${at(n1)}A${n(2 * h)} ${n(2 * h)} 0 0 ${n1[0] * n2[1] - n1[1] * n2[0] > 0 ? 1 : 0} ${at(n2)}`;
      };
      return [
        ...battery(g, 0),
        shell(g.polygon(q), { n: 'bolt', role: P, occ: true }),
        line(fillet(q[0], q[1], 6, [-1, 0]) + fillet(q[3], q[4], 18, [1, 0]), { n: 'fillets', role: P, on: 'body' })
      ];
    },
    fx: { t: 'variable', on: ['bolt'], mode: 'iterative', step: 260 }
  },
  plug: {
    label: '插头', key: 'portrait', fit: 'y',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：插头外壳（下方圆角大）；辅助：两根插脚和电线',
    weights: { [P]: 0.68, [S]: 0.32 },
    draw(g) {
      const { h } = g;
      return [
        line(g.seg(9, 2 + h, 9, 8 + h) + g.seg(15, 2 + h, 15, 8 + h), { n: 'prongs', role: S }),
        shell(g.box(5, 8, 14, 10, [1.5, 1.5, 5, 5]), { n: 'body', role: P }),
        line(g.seg(12, 18 - h, 12, 22 - h), { n: 'cable', role: S })
      ];
    },
    // 向上插进插座
    fx: { t: 'keys', on: 'all', y: [-1.3, 0.3] }
  },
  save: {
    label: '保存', key: 'square',
    // the shutter and the label are separate pieces on the disk: in the fill variant their
    // frames run out through its edges
    ends: 'out',
    plan: '主体：软盘（右上角切角）；细节：上方的金属滑盖和下方的标签。滑盖和标签都是开口的框，墨量约占四成',
    weights: { [P]: 0.6, [D]: 0.4 },
    draw(g, ctx) {
      const { h } = g;
      // fill: at heavy strokes the shutter's right side moves in, clear of the cut corner, so
      // the piece of disk beside it doesn't end in a wedge under the slope
      const xr = ctx?.variant === 'fill' ? 15 - Math.max(0, g.s - 2) * 1.6 : 15;
      return [
        shell(g.polygon([[3 + h, 3 + h], [16.5, 3 + h], [21 - h, 7.5], [21 - h, 21 - h], [3 + h, 21 - h]], [4 - h, 1.2, 1.2, 4 - h, 4 - h]), { n: 'disk', role: P }),
        line(`M8 ${n(3 + h)}V7A1 1 0 0 0 9 8H${n(xr - 1)}A1 1 0 0 0 ${n(xr)} 7V${n(3 + h)}`, { n: 'shutter', role: D, on: 'disk' }),
        line(`M8 ${n(21 - h)}V15A1 1 0 0 1 9 14H15A1 1 0 0 1 16 15V${n(21 - h)}`, { n: 'label', role: D, on: 'disk' })
      ];
    },
    // 滑盖向左滑开再合上
    fx: { t: 'keys', on: ['shutter'], x: [-2], ms: 300 }
  },
  webcam: {
    anchor: 'base',
    label: '摄像头', key: 'portrait',
    plan: '主体：圆形机头；辅助：镜头（圆环，与相机相同，随字重缩小）和支架（立杆和底座，与显示器相同）',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g, ctx) {
      const { s, h } = g, R = 3.5 - (s - 2) * 0.5;
      return [
        shell(g.ring(12, 10, 8), { n: 'head', role: P }),
        // fill: the ink dot in the middle of the lens stays one stroke across
        line(g.ring(12, 10, ctx?.variant === 'fill' ? Math.max(R, 1.5 * s) : R), { n: 'lens', role: S, on: 'head' }),
        line(g.seg(12, 18 - h, 12, 21) + g.span(7, 21, 17, 21), { n: 'stand', role: S })
      ];
    },
    fx: { t: 'keys', on: ['lens'], o: [12, 10], s: [0.55, 1.08], ms: 520 }
  },
  'game-console': {
    label: '游戏机', key: 'portrait',
    plan: '主体：掌机机身；细节：屏幕、方向键和一个按键（实心点）',
    weights: { [P]: 0.68, [D]: 0.32 },
    draw(g) {
      const { s } = g, a = 1 - (s - 2) * 0.5;
      return [
        shell(g.box(4, 2, 16, 20, 4), { n: 'body', role: P }),
        shell(g.box(8, 6, 8, 6, 2), { n: 'screen', role: D, on: 'body' }),
        line(g.seg(10 - a, 16, 10 + a, 16) + g.seg(10, 16 - a, 10, 16 + a), { n: 'pad', role: D, on: 'body' }),
        solid(g.circ(15, 16, 1.3 - (s - 2) * 0.4), { n: 'btn', role: D, on: 'body' })
      ];
    },
    // 按方向键，再按下按键
    fx: [{ t: 'keys', on: ['pad'], x: [0.6, -0.6], ms: 360 }, { t: 'keys', on: ['btn'], o: [15, 16], s: [0.55], ms: 260 }]
  },
  gamepad: {
    label: '游戏手柄', key: 'landscape',
    plan: '主体：手柄外形（下方两个握把，中间凹进）；细节：左边方向键，右边两个按键（实心点）',
    weights: { [P]: 0.85, [D]: 0.15 },
    draw(g) {
      const { s, h } = g, a = 1.5 - (s - 2);
      const pts = [[2 + h, 4 + h], [22 - h, 4 + h], [22 - h, 20 - h], [15.5, 20 - h], [14, 15], [10, 15], [8.5, 20 - h], [2 + h, 20 - h]];
      return [
        shell(g.polygon(pts, [4 - h, 4 - h, 3.5 - h, 1.2, 1.5, 1.5, 1.2, 3.5 - h]), { n: 'pad', role: P }),
        line(g.seg(8 - a, 10, 8 + a, 10) + g.seg(8, 10 - a, 8, 10 + a), { n: 'dpad', role: D, on: 'pad' }),
        solid(g.circ(14.5, 11.5, 1), { n: 'b0', role: D, on: 'pad' }),
        solid(g.circ(17.25, 8.75, 1), { n: 'b1', role: D, on: 'pad' })
      ];
    },
    // 振动一下，同时按下一个按键
    fx: [{ t: 'shake', on: 'all', x: 0.5, ms: 420 }, { t: 'keys', on: ['b1'], o: [17.25, 8.75], s: [0.5], ms: 240 }]
  },
  earbuds: {
    nudge: [0, 0.8],
    label: '无线耳机', key: 'square',
    light: [], // each bud is one object (GUIDE.md §4.2)
    plan: '主体：左右两个耳机头（圆环）；辅助：向下的耳机柄（在两只耳机靠里的一侧）',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g) {
      const { h } = g, R = 4, cy = 7.8, dy = Math.sqrt((R - h) ** 2 - 4);
      return [
        shell(g.ring(7, cy, R), { n: 'lh', role: P }),
        line(g.seg(9, cy + dy, 9, 21.8 - h), { n: 'ls', role: S }),
        shell(g.ring(17, cy, R), { n: 'rh', role: P }),
        line(g.seg(15, cy + dy, 15, 21.8 - h), { n: 'rs', role: S })
      ];
    },
    // 两只耳机从盒中取出时向两边分开
    fx: [{ t: 'keys', on: ['lh', 'ls'], o: [9, 21.8], r: [-8], y: [-0.8] }, { t: 'keys', on: ['rh', 'rs'], o: [15, 21.8], r: [8], y: [-0.8] }]
  },
  cast: {
    label: '投屏', key: 'landscape',
    plan: '主体：屏幕（左下角断开）；辅助：左下角的发射点和两道信号弧（与无线网络同一做法）',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      const { s, h } = g, ox = 2 + h, oy = 20 - h, r2 = 8, r1 = r2 - s - g.clear, cr = SCR - h;
      const ye = oy - r2 - h - g.clear - h, xe = ox + r2 + s + g.clear;
      return [
        line(`M${n(ox)} ${n(ye)}V${n(4 + h + cr)}A${n(cr)} ${n(cr)} 0 0 1 ${n(2 + h + cr)} ${n(4 + h)}H${n(22 - h - cr)}A${n(cr)} ${n(cr)} 0 0 1 ${n(22 - h)} ${n(4 + h + cr)}V${n(20 - h - cr)}A${n(cr)} ${n(cr)} 0 0 1 ${n(22 - h - cr)} ${n(20 - h)}H${n(xe)}`, { n: 'screen', role: P }),
        solid(g.dot(ox, oy, 0.75), { n: 'dot', role: S, vc: 0 }),
        line(g.arc(ox, oy, r1, -90, 0), { n: 'w1', role: S, vc: 1 }),
        line(g.arc(ox, oy, r2, -90, 0), { n: 'w2', role: S, vc: 2 })
      ];
    },
    area: (g) => [{ n: 'screen', d: g.rr(2 + g.h, 4 + g.h, 20 - g.s, 16 - g.s, SCR - g.h) }],
    fx: { t: 'variable', on: ['dot', 'w1', 'w2'], mode: 'cumulative' }
  },
  'scan-qr': {
    label: '扫码', key: 'square',
    plan: '主体：四角取景框（与对焦相同）；细节：框里的二维码（三个实心定位方块和一个小方块，太小画不出线框）',
    weights: { [P]: 0.55, [D]: 0.45 },
    draw(g) {
      const { h } = g, c = 4.5 - h, a = 3 + h, b = 21 - h, e = 9, f = 15;
      const corners = `M${n(a)} ${e}V${n(a + c)}A${n(c)} ${n(c)} 0 0 1 ${n(a + c)} ${n(a)}H${e}` +
        `M${f} ${n(a)}H${n(b - c)}A${n(c)} ${n(c)} 0 0 1 ${n(b)} ${n(a + c)}V${e}` +
        `M${n(b)} ${f}V${n(b - c)}A${n(c)} ${n(c)} 0 0 1 ${n(b - c)} ${n(b)}H${f}` +
        `M${e} ${n(b)}H${n(a + c)}A${n(c)} ${n(c)} 0 0 1 ${n(a)} ${n(b - c)}V${f}`;
      return [
        line(corners, { n: 'frame', role: P }),
        solid(g.area(7, 7, 4, 4, 1) + g.area(13, 7, 4, 4, 1) + g.area(7, 13, 4, 4, 1) + g.area(14, 14, 3, 3, 0.75), { n: 'code', role: D }),
        line(g.span(5, 12, 19, 12), { n: 'beam', role: D, ghost: true })
      ];
    },
    area: (g) => [{ n: 'frame', d: g.rr(3 + g.h, 3 + g.h, 18 - g.s, 18 - g.s, 4.5 - g.h) }],
    // 扫码: a scan line sweeps down the code and fades
    fx: { t: 'keys', on: ['beam'], ghost: true, y: [-6, 6], a: [1, 0], ms: 700 }
  }
};
