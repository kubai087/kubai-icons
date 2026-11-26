// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// devices: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: tablet laptop desktop monitor tv watch keyboard mouse printer scanner server hard-drive cpu usb router bluetooth signal antenna nfc battery-medium battery-low battery-empty battery-charging plug save webcam game-console gamepad earbuds cast scan-qr
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { slash, badge } from '../kit.mjs';
import { off, notched } from '../variants.mjs';

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

// The bluetooth rune by its centre line, moved dx across.
const rune = (dx = 0) => [[7.5, 7.5], [16.5, 16.5], [12, 21], [12, 3], [16.5, 7.5], [7.5, 16.5]].map(([x, y]) => [x + dx, y]);
// The wifi of icons.mjs with only its first k arcs, each where it is in the full sign.
const wifi = (g, k) => [
  solid(g.dot(12, 19.85, 1.1), { n: 'dot', role: D, vc: 0 }),
  ...[5.1, 10, 14.9].slice(0, k).map((r, i) => line(g.arc(12, 19.85, r, 232, 308), { n: `a${i + 1}`, role: P, vc: i + 1 }))
];
// The bars of signal: the first `lit` at full height, the rest a square stub on the base line
// (the primary part when none is lit).
function bars(g, lit) {
  const w = 3 + (g.s - 2) * 0.6;
  return [15, 11, 7, 3].map((top, i) => {
    const x = 2 + i * 5 - (w - 3) / 2;
    return i < lit ? solid(g.area(x, top, w, 21 - top, 1), { n: `b${i}`, role: P, vc: i }) : solid(g.area(x, 21 - w, w, w, 1), { n: `b${i}`, role: lit ? S : P });
  });
}
// The body and earpiece of smartphone (icons.mjs).
const phone = (g) => { const y = 2 + g.s + 2 + g.h; return [shell(g.box(5, 2, 14, 20, 4), { n: 'phone', role: P }), line(g.seg(10.2, y, 13.8, y), { n: 'island', role: D, on: 'phone' })]; };
// A memory card by its outer edge: x 4..20, the top-right corner cut at 45° (as save's disk).
const card = (g) => { const { h } = g; return g.polygon([[4 + h, 2 + h], [15, 2 + h], [20 - h, 7], [20 - h, 22 - h], [4 + h, 22 - h]], [3 - h, 1, 1, 3 - h, 3 - h]); };
// The bolt of battery-charging, scaled by k about (cx, cy); a solid shape.
const bolt = (g, cx, cy, k) => g.polygon([[13, 4], [7, 13], [10.5, 13], [9, 20], [15, 11], [11.5, 11]].map(([x, y]) => [cx + (x - 11) * k, cy + (y - 12) * k]), [0.8 * k, 0.8 * k, 0, 0.8 * k, 0.8 * k, 0]);
// A hard drive laid low (y 12..22), with the light and the read bar of hard-drive.
const drive = (g) => [
  shell(g.box(2, 12, 20, 10, 3), { n: 'case', role: P }),
  solid(g.circ(7, 17, Math.min(g.dr * 0.7, 1.15)), { n: 'led', role: D, on: 'case' }),
  line(g.seg(11, 17, 17, 17), { n: 'bar', role: D, on: 'case' })
];
// The four corners of scan-qr's viewfinder (centre line).
function viewfinder(g) {
  const { h } = g, c = 4.5 - h, a = 3 + h, b = 21 - h, e = 9, f = 15;
  return `M${n(a)} ${e}V${n(a + c)}A${n(c)} ${n(c)} 0 0 1 ${n(a + c)} ${n(a)}H${e}` +
    `M${f} ${n(a)}H${n(b - c)}A${n(c)} ${n(c)} 0 0 1 ${n(b)} ${n(a + c)}V${e}` +
    `M${n(b)} ${f}V${n(b - c)}A${n(c)} ${n(c)} 0 0 1 ${n(b - c)} ${n(b)}H${f}` +
    `M${e} ${n(b)}H${n(a + c)}A${n(c)} ${n(c)} 0 0 1 ${n(a)} ${n(b - c)}V${f}`;
}
// The screen and stand of monitor.
const monitorParts = (g) => [
  shell(g.box(2, 3, 20, 13, SCR), { n: 'screen', role: P }),
  line(g.seg(12, 16 - g.h, 12, 20) + g.span(7, 20, 17, 20), { n: 'stand', role: S })
];

const icons = {
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
    // 合上屏幕再打开：屏幕绕底边的铰链折下，高度按转角收窄，线宽不变（GUIDE.md §5.1）
    fx: { t: 'keys', on: ['screen'], o: [12, 16], gy: [0.12], ms: 340 }
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
        // the scan line: wider than the frame and parted from it by a clear band, so it reads as
        // passing in front of the code (GUIDE.md §5.1); hidden at rest
        line(g.span(2, 12, 22, 12), { n: 'beam', role: D, gap: true, ghost: true })
      ];
    },
    area: (g) => [{ n: 'frame', d: g.rr(3 + g.h, 3 + g.h, 18 - g.s, 18 - g.s, 4.5 - g.h) }],
    // 扫码: the scan line runs up the code, wiping it, and back down, reading it in again
    fx: { t: 'scan', axis: 'y', on: ['beam', ['code']], y0: 5, y1: 19 }
  },
  'battery-plus': {
    label: '电量增加', key: 'landscape', fit: 'x',
    plan: '同电池，没有电量格；细节：壳中间的加号（随字重缩小，离壳内沿至少 1.5）',
    weights: { [P]: 0.8, [S]: 0.08, [D]: 0.12 },
    draw(g) {
      const { s, h } = g, a = Math.min(2.25, 6 - s - g.clear - h);
      return [...battery(g, 0), line(g.seg(11 - a, 12, 11 + a, 12) + g.seg(11, 12 - a, 11, 12 + a), { n: 'plus', role: D, on: 'body' })];
    },
    // 充入电量: the plus turns a quarter and settles
    fx: { t: 'rotate', on: ['plus'], deg: 90, o: [11, 12] }
  },
  'bluetooth-connected': {
    label: '蓝牙已连接', key: 'portrait', fit: 'y',
    plan: '主体：蓝牙符号（与蓝牙相同）；辅助：左右各一个连接点（实心），表示两端已连上',
    weights: { [P]: 0.85, [S]: 0.15 },
    draw(g) {
      return [line(g.pl(rune()), { n: 'rune', role: P }), solid(g.dot(4, 12), { n: 'dl', role: S }), solid(g.dot(20, 12), { n: 'dr', role: S })];
    },
    // 连上: the two ends move in toward the symbol and back
    fx: [{ t: 'keys', on: ['dl'], x: [1.2], ms: 300 }, { t: 'keys', on: ['dr'], x: [-1.2], ms: 300 }]
  },
  'bluetooth-searching': {
    label: '蓝牙搜索中', key: 'portrait', fit: 'y',
    plan: '主体：蓝牙符号（与蓝牙相同，左移 4）；辅助：右侧两道信号弧（与音量的声波同一做法）',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      return [
        line(g.pl(rune(-4)), { n: 'rune', role: P }),
        line(g.arc(12, 12, 5.25, -38, 38), { n: 'w1', role: S, vc: 0 }),
        line(g.arc(12, 12, 9, -38, 38), { n: 'w2', role: S, vc: 1 })
      ];
    },
    fx: { t: 'variable', on: ['w1', 'w2'], mode: 'cumulative' }
  },
  'wifi-low': {
    anchor: 'base',
    label: '网络信号弱', key: 'landscape', fit: 'x',
    plan: '同无线网络，只有发射点和最里面一道弧（位置不变）',
    weights: { [P]: 0.63, [D]: 0.37 },
    allow: { keyline: '只画最里面一道弧，位置与无线网络相同，不放大' },
    draw(g) { return wifi(g, 1); },
    fx: { t: 'variable', on: ['dot', 'a1'], mode: 'cumulative' }
  },
  'wifi-high': {
    anchor: 'base',
    label: '网络信号中', key: 'landscape', fit: 'x',
    plan: '同无线网络，只有发射点和里面两道弧（位置不变）',
    weights: { [P]: 0.83, [D]: 0.17 },
    allow: { keyline: '只画里面两道弧，位置与无线网络相同，不放大' },
    draw(g) { return wifi(g, 2); },
    fx: { t: 'variable', on: ['dot', 'a1', 'a2'], mode: 'cumulative' }
  },
  'signal-low': {
    anchor: 'base', nudge: [-1, 0],
    allow: { keyline: '没亮的柱子只留底部方块，不到参考线顶部', optical: '柱子位置与信号相同，切换信号强弱时不跳动' },
    label: '信号弱', key: 'square',
    plan: '同信号，只有第一根柱子；其余三根只留底部的方块（空格位），保持整体的宽度和分量',
    weights: { [P]: 0.4, [S]: 0.6 },
    draw(g) { return bars(g, 1); },
    fx: { t: 'variable', on: ['b0'], mode: 'iterative' }
  },
  'signal-medium': {
    anchor: 'base', nudge: [-1, 0],
    allow: { keyline: '没亮的柱子只留底部方块，不到参考线顶部', optical: '柱子位置与信号相同，切换信号强弱时不跳动' },
    label: '信号中', key: 'square',
    plan: '同信号，亮起前两根柱子；其余两根只留底部的方块',
    weights: { [P]: 0.73, [S]: 0.27 },
    draw(g) { return bars(g, 2); },
    fx: { t: 'variable', on: ['b0', 'b1'], mode: 'cumulative' }
  },
  'signal-high': {
    anchor: 'base', nudge: [-1, 0],
    allow: { keyline: '没亮的柱子只留底部方块，不到参考线顶部', optical: '柱子位置与信号相同，切换信号强弱时不跳动' },
    label: '信号强', key: 'square',
    plan: '同信号，亮起前三根柱子；最后一根只留底部的方块',
    weights: { [P]: 0.91, [S]: 0.09 },
    draw(g) { return bars(g, 3); },
    fx: { t: 'variable', on: ['b0', 'b1', 'b2'], mode: 'cumulative' }
  },
  'monitor-check': {
    anchor: 'base',
    label: '显示器已连接', key: 'landscape', fit: 'x',
    plan: '同显示器；细节：屏幕中间的对勾（随字重缩小，离屏幕内沿至少 1.5）',
    weights: { [P]: 0.62, [S]: 0.2, [D]: 0.18 },
    draw(g) {
      const k = Math.min(4, 13 - 3 * g.s - 2 * g.clear) / 4, my = 9.5;
      return [...monitorParts(g), line(g.pl([[12 - 3 * k, my], [12 - k, my + 2 * k], [12 + 3 * k, my - 2 * k]]), { n: 'check', role: D, on: 'screen' })];
    },
    fx: { t: 'draw', on: ['check'] }
  },
  'monitor-play': {
    anchor: 'base',
    label: '屏幕播放', key: 'landscape', fit: 'x',
    plan: '同显示器；细节：屏幕中间的播放三角（实心，太小画不出线框；与播放同比例，按重心居中）。三角离屏幕内沿留 1.5，只能画得小，约占一成',
    weights: { [P]: 0.7, [S]: 0.21, [D]: 0.09 },
    draw(g) {
      const A = (13 - 2 * g.s - 2 * g.clear) / 2, W = A / 0.615, x0 = 12 - W / 3, cy = 9.5;
      return [...monitorParts(g), solid(g.polygon([[x0, cy - A], [x0 + W, cy], [x0, cy + A]], [0.9, 0.9, 0.9]), { n: 'tri', role: D, on: 'screen' })];
    },
    fx: { t: 'keys', on: ['tri'], x: [0.8], ms: 380 }
  },
  'smartphone-charging': {
    label: '手机充电', key: 'portrait', fit: 'y',
    plan: '同手机；细节：机身中间的闪电（实心，缩小到电池充电闪电的一半，离听筒条和下沿至少 1.5）',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g) {
      const { s } = g, k = 0.5, cy = 4 + 2 * s + g.clear + 4;
      const pts = [[13, 4], [7, 13], [10.5, 13], [9, 20], [15, 11], [11.5, 11]].map(([x, y]) => [12 + (x - 11) * k, cy + (y - 12) * k]);
      return [...phone(g), solid(g.polygon(pts, [0.4, 0.4, 0, 0.4, 0.4, 0]), { n: 'bolt', role: D, on: 'phone' })];
    },
    // 充电中: the bolt blinks
    fx: { t: 'keys', on: ['bolt'], a: [0.2, 1, 0.2, 1], ms: 760 }
  },
  'smartphone-nfc': {
    label: '手机感应', key: 'live', fit: 'y',
    plan: '主体：手机（比手机窄，靠左）；细节：听筒条（随字重缩短）；辅助：右侧两道感应弧（圆心在机身右沿，与音量的声波同一做法）',
    weights: { [P]: 0.6, [S]: 0.32, [D]: 0.08 },
    draw(g) {
      const { s, h } = g, y = 2 + s + 2 + h, a = 5.5 - s - g.clear - h;
      return [
        shell(g.box(3, 2, 11, 20, 3.5), { n: 'phone', role: P }),
        line(g.seg(8.5 - a, y, 8.5 + a, y), { n: 'island', role: D, on: 'phone' }),
        line(g.arc(14, 12, 4, -45, 45), { n: 'w1', role: S, vc: 0 }),
        line(g.arc(14, 12, 7.75, -45, 45), { n: 'w2', role: S, vc: 1 })
      ];
    },
    fx: { t: 'variable', on: ['w1', 'w2'], mode: 'cumulative' }
  },
  'phone-vibrate': {
    label: '振动', key: 'portrait', fit: 'y',
    plan: '主体：手机（比手机略窄）；细节：听筒条；辅助：两侧各一条振动线',
    weights: { [P]: 0.72, [S]: 0.2, [D]: 0.08 },
    draw(g) {
      const { s, h } = g, y = 2 + s + 2 + h, a = 6 - s - g.clear - h;
      return [
        shell(g.box(6, 2, 12, 20, 3.5), { n: 'phone', role: P }),
        line(g.seg(12 - a, y, 12 + a, y), { n: 'island', role: D, on: 'phone' }),
        line(g.span(3, 8, 3, 16), { n: 'v1', role: S }),
        line(g.span(21, 8, 21, 16), { n: 'v2', role: S })
      ];
    },
    fx: [{ t: 'shake', on: ['phone', 'island'], x: 0.7, ms: 520 }, { t: 'keys', on: ['v1', 'v2'], a: [0.2, 1, 0.2, 1], ms: 520 }]
  },
  'tablet-smartphone': {
    label: '多设备', key: 'live',
    plan: '主体：后面的平板（被挡住右下角）；辅助：前面的手机（右下，切开平板）；细节：手机的听筒条。平板的听筒条会被手机的间隙切到，不画',
    weights: { [P]: 0.55, [S]: 0.4, [D]: 0.05 },
    draw(g) {
      const { s, h } = g, y2 = 9 + s + 2 + h;
      return [
        shell(g.box(2, 2, 15, 18, 3.5), { n: 'tablet', role: P }),
        shell(g.box(13, 9, 9, 13, 2.5), { n: 'phone', role: S, occ: true }),
        line(g.seg(16.5, y2, 18.5, y2), { n: 'pi', role: D, on: 'phone' })
      ];
    },
    // 换设备: the phone slides out from the tablet and back
    fx: [{ t: 'keys', on: ['phone', 'pi'], x: [0.9], y: [0.6], ms: 340 }, { t: 'keys', on: ['tablet'], x: [-0.5], y: [-0.4], ms: 340 }]
  },
  projector: {
    label: '投影仪', key: 'landscape', fit: 'x',
    plan: '主体：机身；辅助：镜头（圆环，在机身前面，伸出机身上沿并切开它）和镜头上方三道光线',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g, ctx) {
      const ray = (a, n0) => line(g.seg(10 + 6.5 * Math.cos(a), 12 + 6.5 * Math.sin(a), 10 + 8.5 * Math.cos(a), 12 + 8.5 * Math.sin(a)), { n: n0, role: S });
      // fill: left of the lens's clear band the body is a narrow strip; a small top-left corner
      // keeps it square instead of ending in a wedge
      const c = ctx?.variant === 'fill' ? 1 : 3.5;
      return [
        ray(-Math.PI * 0.75, 'r0'), ray(-Math.PI / 2, 'r1'), ray(-Math.PI / 4, 'r2'),
        shell(g.box(2, 10, 20, 10, [c, 3.5, 3.5, 3.5]), { n: 'body', role: P }),
        shell(g.ring(10, 12, 4), { n: 'lens', role: S, occ: true })
      ];
    },
    // 投影: the light flickers on
    fx: { t: 'keys', on: ['r0', 'r1', 'r2'], by: true, stagger: 60, a: [0.2, 1], ms: 360 },
    allow: { keyline: '光线伸出横向参考线上沿' }
  },
  'projector-screen': {
    label: '投影幕布', key: 'landscape', fit: 'x',
    plan: '主体：幕布（上沿挂在卷轴上）；辅助：卷轴（比幕布宽，铺满横向）和下方的拉绳（T 形拉手）。卷轴和拉绳都是细线，约占两成',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const { h } = g;
      return [
        line(g.span(2, 5, 22, 5), { n: 'bar', role: S }),
        shell(g.box(4, 5 - h, 16, 13 + h, [0, 0, 2.5, 2.5]), { n: 'screen', role: P }),
        line(g.seg(12, 18 - h, 12, 21) + g.span(10, 21, 14, 21), { n: 'cord', role: S })
      ];
    },
    // 拉下幕布: the screen rolls up a little and drops back
    fx: { t: 'keys', on: ['screen', 'cord'], o: [12, 5], gy: [0.6], ms: 380 }
  },
  joystick: {
    anchor: 'base',
    label: '摇杆', key: 'square',
    plan: '主体：底座；辅助：摇杆和顶端的球（一笔连着）',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(3, 15, 18, 6, 2.5), { n: 'base', role: P }),
        line(g.seg(12, 11 - h, 12, 15 + h), { n: 'stick', role: S, part: 'knob' }),
        shell(g.ring(12, 7, 4), { n: 'ball', role: S, part: 'knob' })
      ];
    },
    light: ['stick', 'ball'],
    // 拨动摇杆: the stick tilts on the base and swings back
    fx: { t: 'wiggle', on: ['stick', 'ball'], o: [12, 15], deg: 14, hz: 2.2 }
  },
  remote: {
    label: '遥控器', key: 'portrait', fit: 'y',
    ends: 'out',
    plan: '主体：机身（窄长）；细节：分出上方触控区的横线（面性中把机身分成两块）和下方的按键（实心点）',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g) {
      return [
        shell(g.box(6, 2, 12, 20, 4), { n: 'body', role: P }),
        line(g.seg(6 + g.s, 10, 18 - g.s, 10), { n: 'pad', role: D, on: 'body' }),
        solid(g.dot(12, 15 + Math.max(0, g.s - 2), 1.1), { n: 'btn', role: D, on: 'body' })
      ];
    },
    // 按下按键
    fx: { t: 'keys', on: ['btn'], o: [12, 15], s: [0.55], ms: 260 }
  },
  'sd-card': {
    label: '存储卡', key: 'portrait',
    plan: '主体：卡身（右上角切角，与保存的软盘同一做法）；细节：上方两根触点',
    weights: { [P]: 0.86, [D]: 0.14 },
    draw(g, ctx) {
      // fill: at heavy strokes the two pins move apart, a stroke of ink between their holes
      const y0 = 2 + g.s + g.clear + g.h, d = ctx?.variant === 'fill' ? Math.max(0, (1.8 * g.s - 4) / 2) : 0;
      return [shell(card(g), { n: 'card', role: P }), line(g.seg(9 - d, y0, 9 - d, y0 + 3) + g.seg(13 + d, y0, 13 + d, y0 + 3), { n: 'pins', role: D, on: 'card' })];
    },
    // 插卡: pushed in, then back out
    fx: { t: 'keys', on: 'all', y: [-1.3, 0.3] }
  },
  'sim-card': {
    label: 'SIM 卡', key: 'portrait',
    plan: '主体：卡身（与存储卡相同）；细节：芯片（圆角方框，靠下）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) { return [shell(card(g), { n: 'card', role: P }), shell(g.box(8, 10, 8, 8, 2), { n: 'chip', role: D, on: 'card' })]; },
    fx: { t: 'keys', on: 'all', y: [-1.3, 0.3] }
  },
  'memory-stick': {
    label: '内存条', key: 'landscape', fit: 'x',
    plan: '主体：电路板；辅助：下沿四根金手指（与板相连）；细节：板上两颗芯片（实心方块，太小画不出线框）',
    weights: { [P]: 0.62, [S]: 0.2, [D]: 0.18 },
    draw(g) {
      const { h } = g;
      return [
        line([6, 10, 14, 18].map((x) => g.seg(x, 16 - h, x, 19)).join(''), { n: 'pins', role: S }),
        shell(g.box(2, 5, 20, 11, 2.5), { n: 'board', role: P }),
        ...[6, 14].map((x, i) => solid(g.area(x, 9, 4, 3, 0.75), { n: `c${i}`, role: D, on: 'board', vc: i }))
      ];
    },
    fx: { t: 'variable', on: ['c0', 'c1'], mode: 'cumulative' }
  },
  'usb-c-port': {
    label: 'USB-C 接口', key: 'landscape', fit: 'x',
    plan: '主体：胶囊形接口外框；细节：中间的触点条',
    weights: { [P]: 0.82, [D]: 0.18 },
    draw(g) { return [shell(g.box(2, 7, 20, 10, 5), { n: 'port', role: P }), line(g.seg(8, 12, 16, 12), { n: 'tongue', role: D, on: 'port' })]; },
    fx: { t: 'keys', on: ['tongue'], o: [12, 12], sx: [0.6], ms: 300 }
  },
  'ethernet-port': {
    label: '网口', key: 'landscape', fit: 'x',
    plan: '主体：接口外框（下沿中间凸出卡扣槽）；细节：上方三根触点',
    weights: { [P]: 0.85, [D]: 0.15 },
    draw(g, ctx) {
      // fill: at heavy strokes the pins move apart, a stroke of ink between their holes
      const { s, h } = g, c = 3 - h, y0 = 4 + s + g.clear + h, d = ctx?.variant === 'fill' ? Math.max(4, 1.8 * s) : 4;
      const pts = [[2 + h, 4 + h], [22 - h, 4 + h], [22 - h, 17 - h], [16 - h, 17 - h], [16 - h, 21 - h], [8 + h, 21 - h], [8 + h, 17 - h], [2 + h, 17 - h]];
      return [
        shell(g.polygon(pts, [c, c, c, 0, 1.5 - h / 2, 1.5 - h / 2, 0, c]), { n: 'port', role: P }),
        line([12 - d, 12, 12 + d].map((x) => g.seg(x, y0, x, y0 + 2)).join(''), { n: 'pins', role: D, on: 'port' })
      ];
    },
    fx: { t: 'keys', on: ['pins'], y: [1], ms: 300 }
  },
  'hdmi-port': {
    label: 'HDMI 接口', key: 'landscape', fit: 'x',
    plan: '主体：接口外框（下方两角斜切）；细节：中间的触点条',
    weights: { [P]: 0.82, [D]: 0.18 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.polygon([[2 + h, 7 + h], [22 - h, 7 + h], [22 - h, 12], [19, 17 - h], [5, 17 - h], [2 + h, 12]], [2.5 - h, 2.5 - h, 1, 1, 1, 1]), { n: 'port', role: P }),
        line(g.seg(8, 12, 16, 12), { n: 'tongue', role: D, on: 'port' })
      ];
    },
    fx: { t: 'keys', on: ['tongue'], o: [12, 12], sx: [0.6], ms: 300 }
  },
  charger: {
    label: '充电器', key: 'portrait', fit: 'y',
    plan: '主体：充电头（圆角方块）；辅助：上方两根插脚（与插头相同）；细节：中间的闪电（实心，随字重缩小，离机身内沿留 1.5，只能画得小）。插脚细、机身重，机身下沿收到 21',
    weights: { [P]: 0.76, [S]: 0.18, [D]: 0.06 },
    allow: { keyline: '插脚细、机身重，按光学中心机身下沿收到 21' },
    draw(g) {
      const { s, h } = g;
      return [
        line(g.seg(9, 2 + h, 9, 7 + h) + g.seg(15, 2 + h, 15, 7 + h), { n: 'prongs', role: S }),
        shell(g.box(5, 7, 14, 14, 3.5), { n: 'body', role: P }),
        solid(bolt(g, 12, 14, (14 - 2 * s - 2 * g.clear) / 16), { n: 'bolt', role: D, on: 'body' })
      ];
    },
    fx: { t: 'keys', on: ['bolt'], a: [0.2, 1, 0.2, 1], ms: 760 }
  },
  'wireless-charger': {
    anchor: 'base',
    label: '无线充电器', key: 'square',
    plan: '主体：扁平的充电板；辅助：上方的闪电（实心，表示隔空充电）',
    allow: { keyline: '闪电上端是倒圆的尖角，离方形参考线上沿约 2，不再放大以免贴近充电板' },
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) { return [shell(g.box(3, 16, 18, 5, 2.5), { n: 'pad', role: P }), solid(bolt(g, 12, 8.5, 0.75), { n: 'bolt', role: S })]; },
    fx: { t: 'keys', on: ['bolt'], y: [-0.8, 0], a: [0.3, 1], ms: 560 }
  },
  'smart-speaker': {
    label: '智能音箱', key: 'portrait', fit: 'y',
    plan: '主体：音箱机身；细节：下方的喇叭（圆环，随字重缩小）和上方的高音单元（实心点）',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g, ctx) {
      // fill: the woofer's hole keeps an ink dot a stroke across; at heavy strokes it moves down,
      // a stroke of ink from the tweeter
      const { s } = g, fill = ctx?.variant === 'fill', R0 = 3.5 - (s - 2) * 0.5, R = fill ? Math.max(R0, 1.5 * s) : R0, r = g.dr * 0.9, cy = fill ? 14.5 + Math.max(0, s - 2) * 2.5 : 14.5;
      return [
        shell(g.box(5, 2, 14, 20, 4), { n: 'body', role: P }),
        solid(g.dot(12, 2 + s + g.clear + r, 0.9), { n: 'tweeter', role: D, on: 'body' }),
        line(g.ring(12, cy, R), { n: 'woofer', role: D, on: 'body' })
      ];
    },
    fx: { t: 'keys', on: ['woofer'], o: [12, 14.5], s: [0.75, 1.08, 0.85], ms: 520 }
  },
  'fitness-band': {
    label: '智能手环', key: 'portrait', fit: 'y',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：窄长的表壳；辅助：上下两段表带（与智能手表相同）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const { h } = g;
      return [line(strap(g, 5 + h, true), { n: 'top', role: S }), line(strap(g, 19 - h, false), { n: 'bottom', role: S }), shell(g.box(7, 5, 10, 14, 3.5), { n: 'case', role: P })];
    },
    area: (g) => [{ n: 'top', d: g.rr(9, 2 + g.h, 6, 3, [1, 1, 0, 0]) }, { n: 'bottom', d: g.rr(9, 19, 6, 3 - g.h, [0, 0, 1, 1]) }],
    fx: { t: 'shake', on: 'all', x: 0.6, ms: 480 }
  },
  'hard-drive-download': {
    anchor: 'base',
    label: '下载到硬盘', key: 'live',
    light: ['arrow'],
    plan: '主体：硬盘（压扁，放在下方，同硬盘的指示灯和读写条）；辅助：上方向下的箭头（关键部件）',
    weights: { [P]: 0.67, [S]: 0.2, [D]: 0.13 },
    draw(g) { return [...drive(g), line(g.seg(12, 3, 12, 9) + g.pl([[9, 6], [12, 9], [15, 6]]), { n: 'arrow', role: S })]; },
    fx: { t: 'keys', on: ['arrow'], y: [1.2], ms: 320 }
  },
  'hard-drive-upload': {
    anchor: 'base',
    label: '从硬盘上传', key: 'live',
    light: ['arrow'],
    plan: '同下载到硬盘，箭头向上',
    weights: { [P]: 0.67, [S]: 0.2, [D]: 0.13 },
    draw(g) { return [...drive(g), line(g.seg(12, 3, 12, 9) + g.pl([[9, 6], [12, 3], [15, 6]]), { n: 'arrow', role: S })]; },
    fx: { t: 'keys', on: ['arrow'], y: [-1.2], ms: 320 }
  },
  disc: {
    label: '光盘', key: 'circle',
    plan: '主体：盘面（圆环）；细节：中心孔（小圆环）和一道反光弧。面性中反光弧没有位置留出一个线宽的边，只画中心孔',
    weights: { [P]: 0.78, [D]: 0.22 },
    draw(g, ctx) {
      const { s, h } = g, R0 = 2.5 - (s - 2) * 0.5, R = ctx?.variant === 'fill' ? Math.max(R0, 1.5 * s) : R0, r = (R0 + 10 - s) / 2;
      return [
        shell(g.ring(12, 12, 10), { n: 'disc', role: P }),
        line(g.ring(12, 12, R), { n: 'hole', role: D, on: 'disc' }),
        line(g.arc(12, 12, r, 200, 250), { n: 'shine', role: D, only: 'outline' })
      ];
    },
    // 转动: the light on the disc turns round
    fx: { t: 'rotate', on: ['shine'], deg: 180, o: [12, 12] }
  },
  scan: {
    label: '扫描文档', key: 'square',
    plan: '主体：四角取景框（与扫码相同）；细节：框里的一页纸（圆角方框）',
    weights: { [P]: 0.6, [D]: 0.4 },
    draw(g) {
      return [
        line(viewfinder(g), { n: 'frame', role: P }),
        shell(g.box(8, 7, 8, 10, 1.5), { n: 'page', role: D }),
        line(g.span(2, 12, 22, 12), { n: 'beam', role: D, gap: true, ghost: true })
      ];
    },
    area: (g) => [{ n: 'frame', d: g.rr(3 + g.h, 3 + g.h, 18 - g.s, 18 - g.s, 4.5 - g.h) }],
    fx: { t: 'scan', axis: 'y', on: ['beam', ['page']], y0: 5, y1: 19 }
  },
  'scan-barcode': {
    label: '扫描条码', key: 'square',
    plan: '主体：四角取景框（与扫码相同）；细节：框里的条码（三条竖线）',
    weights: { [P]: 0.66, [D]: 0.34 },
    draw(g) {
      return [
        line(viewfinder(g), { n: 'frame', role: P }),
        line(g.seg(8, 8, 8, 16) + g.seg(12, 8, 12, 16) + g.seg(16, 8, 16, 16), { n: 'code', role: D }),
        line(g.span(2, 12, 22, 12), { n: 'beam', role: D, gap: true, ghost: true })
      ];
    },
    area: (g) => [{ n: 'frame', d: g.rr(3 + g.h, 3 + g.h, 18 - g.s, 18 - g.s, 4.5 - g.h) }],
    fx: { t: 'scan', axis: 'y', on: ['beam', ['code']], y0: 5, y1: 19 }
  },
  'scan-text': {
    label: '识别文字', key: 'square',
    plan: '主体：四角取景框（与扫码相同）；细节：框里三行字（长短不一）',
    weights: { [P]: 0.68, [D]: 0.32 },
    draw(g) {
      return [
        line(viewfinder(g), { n: 'frame', role: P }),
        line(g.seg(8, 8, 14, 8), { n: 't1', role: D }),
        line(g.seg(8, 12, 16, 12), { n: 't2', role: D }),
        line(g.seg(8, 16, 12, 16), { n: 't3', role: D })
      ];
    },
    area: (g) => [{ n: 'frame', d: g.rr(3 + g.h, 3 + g.h, 18 - g.s, 18 - g.s, 4.5 - g.h) }],
    fx: { t: 'draw', on: ['t1', 't2', 't3'], stagger: 120 }
  },
  'signal-zero': {
    anchor: 'base', nudge: [-1, 0],
    allow: { keyline: '没有信号：四根柱子都只留底部方块', optical: '柱子位置与信号相同，切换信号强弱时不跳动' },
    label: '无信号', key: 'square',
    plan: '同信号，四根柱子都只留底部的方块（空格位）',
    weights: { [P]: 1 },
    draw(g) { return bars(g, 0); },
    // 搜索信号: the empty slots light in turn
    fx: { t: 'variable', on: ['b0', 'b1', 'b2', 'b3'], mode: 'iterative', step: 140 }
  },
  'monitor-x': {
    anchor: 'base',
    label: '显示器断开', key: 'landscape', fit: 'x',
    plan: '同显示器；细节：屏幕中间的叉号（随字重缩小，离屏幕内沿至少 1.5）',
    weights: { [P]: 0.64, [S]: 0.2, [D]: 0.16 },
    draw(g) {
      const a = Math.min(2.25, (13 - 3 * g.s - 2 * g.clear) / 2), my = 9.5;
      return [...monitorParts(g), line(g.seg(12 - a, my - a, 12 + a, my + a) + g.seg(12 + a, my - a, 12 - a, my + a), { n: 'x', role: D, on: 'screen' })];
    },
    fx: { t: 'rotate', on: ['x'], deg: 90, o: [12, 9.5] }
  },
  'monitor-smartphone': {
    label: '电脑和手机', key: 'live',
    plan: '主体：显示器（屏幕和支架，靠左）；辅助：右下方的手机（在前面，切开屏幕）',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(2, 2, 14, 13, 3), { n: 'screen', role: P }),
        line(g.seg(9, 15 - h, 9, 20) + g.span(5, 20, 13, 20), { n: 'stand', role: P }),
        shell(g.box(15, 8, 7, 14, 2.5), { n: 'phone', role: S, occ: true })
      ];
    },
    fx: [{ t: 'keys', on: ['phone'], x: [0.8], y: [0.5], ms: 340 }, { t: 'keys', on: ['screen', 'stand'], x: [-0.4], ms: 340 }]
  },
  'e-reader': {
    label: '电子书阅读器', key: 'portrait', fit: 'y',
    plan: '主体：机身；细节：屏幕框（下沿留出较宽的边框，与平板区分）',
    weights: { [P]: 0.65, [D]: 0.35 },
    draw(g) { return [shell(g.box(4, 2, 16, 20, 3.5), { n: 'body', role: P }), shell(g.box(8, 6, 8, 10, 1.5), { n: 'screen', role: D, on: 'body' })]; },
    // 翻页: the screen flashes as e-ink does
    fx: { t: 'keys', on: ['screen'], a: [0.2, 1], ms: 320 }
  },
  'music-player': {
    label: '音乐播放器', key: 'portrait', fit: 'y',
    plan: '主体：机身；细节：上方的屏幕（实心，窄条画不出线框）和下方的转盘（圆环，随字重缩小）',
    weights: { [P]: 0.62, [D]: 0.38 },
    draw(g, ctx) {
      // fill: the wheel's hole keeps an ink dot a stroke across and moves down from the screen
      const { s } = g, fill = ctx?.variant === 'fill', R0 = 3.25 - (s - 2) * 0.5, R = fill ? Math.max(R0, 1.5 * s) : R0, cy = fill ? 15 + Math.max(0, s - 2) * 1.5 : 15;
      return [
        shell(g.box(5, 2, 14, 20, 4), { n: 'body', role: P }),
        solid(g.area(9, 6, 6, 4, 1), { n: 'screen', role: D, on: 'body' }),
        line(g.ring(12, cy, R), { n: 'wheel', role: D, on: 'body' })
      ];
    },
    fx: { t: 'keys', on: ['wheel'], o: [12, 15], s: [0.8, 1.05], ms: 420 }
  },
  'pc-case': {
    label: '主机', key: 'portrait', fit: 'y',
    plan: '主体：机箱；细节：上方两条光驱槽和下方的电源键（实心点）',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g, ctx) {
      // fill: at heavy strokes the two slots move apart, a stroke of ink between their holes
      const { s, h } = g, fill = ctx?.variant === 'fill', a = 7 - s - g.clear - h, k = fill ? 1 : 1.1, r = k * g.dr;
      const y1 = fill ? 7 - Math.max(0, s - 2) : 7, y2 = y1 + (fill ? Math.max(4, 1.8 * s) : 4), cy = 22 - s - g.clear - r;
      return [
        shell(g.box(5, 2, 14, 20, 3.5), { n: 'case', role: P }),
        line(g.seg(12 - a, y1, 12 + a, y1) + g.seg(12 - a, y2, 12 + a, y2), { n: 'bays', role: D, on: 'case' }),
        solid(g.dot(12, cy, k), { n: 'power', role: D, on: 'case' })
      ];
    },
    fx: { t: 'keys', on: ['power'], o: [12, 16.7], s: [0.55], ms: 260 }
  },
  trackpad: {
    label: '触控板', key: 'landscape',
    ends: 'out',
    plan: '主体：触控板外框；细节：下方的按键分隔线（横线和中间的竖线，面性中把触控板分成三块）',
    weights: { [P]: 0.75, [D]: 0.25 },
    draw(g) {
      const { h } = g;
      return [shell(g.box(2, 4, 20, 16, 4), { n: 'pad', role: P }), line(g.seg(2 + h, 13, 22 - h, 13), { n: 'bar', role: D, on: 'pad' }), line(g.seg(12, 13, 12, 20 - h), { n: 'split', role: D, on: 'pad' })];
    },
    // 按下: the pad clicks in
    fx: { t: 'keys', on: 'all', o: [12, 12], s: [0.93], ms: 240 }
  },
  'usb-port': {
    label: 'USB 接口', key: 'landscape', fit: 'x',
    plan: '主体：接口外框；细节：靠上的舌片（一条横线）',
    weights: { [P]: 0.82, [D]: 0.18 },
    draw(g) { return [shell(g.box(2, 6, 20, 12, 2.5), { n: 'port', role: P }), line(g.seg(7, 11, 17, 11), { n: 'tongue', role: D, on: 'port' })]; },
    fx: { t: 'keys', on: ['tongue'], y: [1], ms: 300 }
  },
  'walkie-talkie': {
    label: '对讲机', key: 'portrait', fit: 'y',
    plan: '主体：机身；辅助：左上的天线；细节：两条喇叭网线。天线细、机身重，机身下沿收到 21',
    allow: { keyline: '天线细、机身重，按光学中心机身下沿收到 21' },
    weights: { [P]: 0.72, [S]: 0.1, [D]: 0.18 },
    draw(g, ctx) {
      const { s, h } = g, a = 6 - s - g.clear - h, e = ctx?.variant === 'fill' ? Math.max(2, 0.9 * s) : 2;
      return [
        line(g.seg(9, 2 + h, 9, 6 + h), { n: 'antenna', role: S }),
        shell(g.box(6, 6, 12, 15, 3.5), { n: 'body', role: P }),
        line(g.seg(12 - a, 13 - e, 12 + a, 13 - e), { n: 'g1', role: D, on: 'body' }),
        line(g.seg(12 - a, 13 + e, 12 + a, 13 + e), { n: 'g2', role: D, on: 'body' })
      ];
    },
    // 通话: the grille lights in turn
    fx: { t: 'variable', on: ['g1', 'g2'], mode: 'iterative', step: 140 }
  },
};

// Variants made by rule (kit.mjs) of the icons above.
const named = (k) => ({ ...icons[k], name: k });
const SLASH_CUT = { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' };

export default {
  ...icons,
  'bluetooth-off': off({ ...slash(named('bluetooth'), { label: '蓝牙关闭' }), allow: SLASH_CUT }, 'bluetooth', { t: 'keys', on: ['rune'], o: [12, 12], s: [0.88], ms: 240 }),
  'monitor-off': off({ ...slash(named('monitor'), { label: '显示器关闭' }), allow: SLASH_CUT }, 'monitor', { t: 'keys', on: ['screen'], o: [12, 9.5], sy: [0.86], ms: 240 }),
  // the wheel lies on the slash's path: the mouse is drawn without it
  'mouse-off': off({ ...slash({ ...named('mouse'), draw: (g, ctx) => icons.mouse.draw(g, ctx).filter((l) => l.n !== 'wheel') }, { label: '鼠标关闭' }), allow: SLASH_CUT }, 'mouse', { t: 'keys', on: ['body'], o: [12, 12], s: [0.9], ms: 240 }),
  'printer-check': { ...notched(badge(named('printer'), 'check', { label: '打印完成' })), fx: { t: 'draw', on: ['badge'] } },
  'tv-off': off({ ...slash(named('tv'), { label: '电视关闭' }), allow: SLASH_CUT }, 'tv', { t: 'keys', on: ['screen'], o: [12, 13.5], sy: [0.86], ms: 240 }),
  'webcam-off': off({ ...slash(named('webcam'), { label: '摄像头关闭' }), allow: SLASH_CUT }, 'webcam', { t: 'keys', on: ['lens'], o: [12, 10], s: [0.55], ms: 260 }),
  'printer-x': { ...notched(badge(named('printer'), 'x', { label: '打印失败' })), fx: { t: 'rotate', on: ['badge'], deg: 90, oBadge: true } },
  unplug: off({ ...slash(named('plug'), { label: '断开电源' }), allow: SLASH_CUT }, 'plug', { t: 'keys', on: ['prongs'], y: [1.5], ms: 260 }),
};
