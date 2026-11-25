// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// communication: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: mail-open mails message-circle messages messages-square bell-ring phone phone-call video-call headset megaphone at-sign hash reply rss voicemail dial-pad contact-book podcast radio-tower
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// An envelope as mail in icons.mjs, in the box x, y, w, hh (outer edges): the outline and the
// flap, an arc from the middles of the two top corners.
function envelope(g, x, y, w, hh, corner, name) {
  const { h } = g, c = corner - h, k = 0.293 * c, x0 = x + h + k, x1 = x + w - h - k, y0 = y + h + k, sag = (6 - h * 0.6) * (w / 20);
  const ch = x1 - x0, R = (ch * ch / 4 + sag * sag) / (2 * sag), cy = y0 + sag - R, a0 = (Math.asin((y0 - cy) / R) * 180) / Math.PI, cx = x + w / 2;
  return [shell(g.box(x, y, w, hh, corner), { n: name }), line(g.arc(cx, cy, R, a0, 180 - a0), { n: `${name}-flap`, on: name })];
}
// A round speech bubble (message-circle's language): a circle whose bottom quarter on one side
// (side -1 left, +1 right) is squared off into the small tail corner of message-square.
function roundBubble(g, cx, cy, R, side = -1) {
  const r = R - g.h, sx = cx + side * r, by = cy + r;
  return `M${n(sx)} ${n(cy)}A${n(r)} ${n(r)} 0 1 ${side < 0 ? 1 : 0} ${n(cx)} ${n(by)}H${n(sx)}Z`;
}
// A phone handset: a thick arc about O with a pad at each end (earpiece, mouthpiece), as one
// outline. The arc is sampled into straight pieces so the corners can be rounded.
function handset(g, { O = [21, 3], Ro = 19, th = 4.5, tp = 7.5, da = 26, a0 = 90, a1 = 180 } = {}) {
  const { h } = g, ro = Ro - h, rh = Ro - th + h, rp = Ro - tp + h;
  const P0 = (r, a) => [O[0] + r * Math.cos((a * Math.PI) / 180), O[1] + r * Math.sin((a * Math.PI) / 180)];
  const run = (r, from, to) => { const k = Math.max(2, Math.ceil(Math.abs(to - from) / 4)); return Array.from({ length: k + 1 }, (_, i) => P0(r, from + ((to - from) * i) / k)); };
  const pts = [], rad = [];
  const push = (list, first, last, mid = 0) => list.forEach((p, i) => { pts.push(p); rad.push(i === 0 ? first : i === list.length - 1 ? last : mid); });
  push(run(ro, a0, a1), 2.2, 2.2);
  push([P0(rp, a1), P0(rp, a1 - da)], 2, 1.4);
  push(run(rh, a1 - da, a0 + da), 0.8, 0.8);
  push([P0(rp, a0 + da), P0(rp, a0)], 1.4, 2);
  // the outer run's ends are its first and last points
  return g.polygon(pts, rad);
}
// The bell of icons.mjs: body, rim and clapper.
function bellParts(g) {
  const rim = 15;
  return [
    shell(g.box(5, 3, 14, rim - 3 + g.h, [7, 7, 0, 0]), { n: 'body', role: P }),
    line(g.span(3, rim, 21, rim), { n: 'rim', role: P }),
    solid(g.rr(10, rim + g.h + 2, 4, 3, [0.5, 0.5, 2, 2]), { n: 'clapper', role: S })
  ];
}
// Ring tabs and cover of a bound book (notebook in files.mjs).
const cover = (g) => shell(g.box(6, 2, 14, 20, 3.5), { n: 'cover', role: P });
const rings = (g, ys = [7, 12, 17]) => line(ys.map((y) => g.span(4, y, 8, y)).join(''), { n: 'rings', role: S });

export default {
  'mail-open': {
    label: '已读邮件', key: 'landscape',
    ends: 'in',
    plan: '主体：打开的信封（封盖翻起成屋顶形）；细节：信封口（圆弧，与邮件的封口同一画法，从两肩出发）',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g) {
      const { h } = g, sh = 10.5, c = 2.25 - h * 0.5, k = 0.293 * c, x0 = 2 + h + k, x1 = 22 - h - k, y0 = sh + k, sag = 4.6 - h * 0.6;
      const ch = x1 - x0, R = (ch * ch / 4 + sag * sag) / (2 * sag), cy = y0 + sag - R, a0 = (Math.asin((y0 - cy) / R) * 180) / Math.PI;
      return [
        shell(g.polygon([[2 + h, sh], [12, 3.6 + h], [22 - h, sh], [22 - h, 20 - h], [2 + h, 20 - h]], [c, 1.6, c, 4 - h, 4 - h]), { n: 'env', role: P }),
        line(g.arc(12, cy, R, a0, 180 - a0), { n: 'flap', role: D, on: 'env' })
      ];
    },
    fx: { t: 'draw', on: ['flap'] },
    swap: 'mail'
  },
  mails: {
    label: '多封邮件', key: 'landscape',
    ends: 'in', // as mail: the flap stops a stroke inside the envelope's corners
    plan: '主体：前面的信封；辅助：后面的信封（被挡住，只露出上沿和右侧）；细节：前面信封的封口。与复制同一种叠放',
    weights: { [P]: 0.5, [S]: 0.29, [D]: 0.21 },
    draw(g, ctx) {
      const [b] = envelope(g, 6, 4, 16, 12, 3.25, 'back');
      const [f, fl] = envelope(g, 2, 8, 16, 12, 3.25, 'front');
      // fill: the back shows only as a strip beside the front's clear band; where its round
      // corners run into the band the strip would end in a thin point, so those two corners are
      // tighter (0.7 of the strip: the smoothed corner runs past its radius) and meet it square
      const k = Math.min(3.25, 0.7 * (4 - g.g));
      const back = ctx?.variant === 'fill' ? { ...b, d: g.box(6, 4, 16, 12, [k, 3.25, k, 3.25]) } : b;
      return [{ ...back, role: S }, { ...f, role: P, occ: true }, { ...fl, role: D }];
    },
    fx: [{ t: 'keys', on: ['front', 'front-flap'], x: [-0.9], y: [0.9] }, { t: 'keys', on: ['back'], x: [0.9], y: [-0.9] }]
  },
  'message-circle': {
    label: '消息', key: 'circle',
    plan: '主体：圆形对话框（左下角收成小圆角，与留言同一种尾巴）；细节：三个点',
    weights: { [P]: 0.86, [D]: 0.14 },
    draw(g) {
      return [
        shell(roundBubble(g, 12, 12, 10), { n: 'bubble', role: P }),
        ...[-1, 0, 1].map((k, i) => solid(g.dot(12 + k * (4.75 - (g.s - 1.75) * 0.2), 12, 1 - (g.s - 1.75) * 0.35), { n: `d${i}`, role: D, on: 'bubble', vc: i }))
      ];
    },
    fx: { t: 'variable', on: ['d0', 'd1', 'd2'], mode: 'iterative' }
  },
  messages: {
    label: '聊天', key: 'live',
    plan: '主体：前面的圆形对话框（尾巴在右下）；辅助：后面的对话框（尾巴在左下，被挡住）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      return [
        shell(roundBubble(g, 8.5, 8.5, 6.5, -1), { n: 'back', role: S }),
        shell(roundBubble(g, 15.5, 15.5, 6.5, 1), { n: 'front', role: P, occ: true })
      ];
    },
    // 一来一回: the back bubble pops, then the front one answers
    fx: { t: 'keys', on: [['back'], ['front']], by: true, stagger: 140, s: [1.08, 1], ms: 220 }
  },
  'messages-square': {
    label: '对话', key: 'live',
    plan: '主体：前面的方形对话框（尾巴在右下）；辅助：后面的对话框（尾巴在左下，被挡住）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      return [
        shell(g.box(2, 2, 14, 13, [3.25, 3.25, 3.25, 1]), { n: 'back', role: S }),
        shell(g.box(8, 9, 14, 13, [3.25, 3.25, 1, 3.25]), { n: 'front', role: P, occ: true })
      ];
    },
    fx: { t: 'keys', on: [['back'], ['front']], by: true, stagger: 140, s: [1.08, 1], ms: 220 }
  },
  'bell-ring': {
    label: '响铃提醒', key: 'square',
    plan: '主体：铃身和铃口（与通知相同）；辅助：铃锤；细节：两侧的响动弧线（以铃顶的圆心画，离铃身 1.5）',
    weights: { [P]: 0.72, [S]: 0.08, [D]: 0.2 },
    draw(g) {
      const R = 9.5;
      return [
        ...bellParts(g),
        line(g.arc(12, 10, R, 205, 232), { n: 'wl', role: D }),
        line(g.arc(12, 10, R, -52, -25), { n: 'wr', role: D })
      ];
    },
    fx: [{ t: 'wiggle', on: ['body', 'rim'], o: [12, 3], deg: 8 }, { t: 'wiggle', on: ['clapper'], o: [12, 3], deg: 11, delay: 50 }, { t: 'keys', on: ['wl', 'wr'], a: [0.2, 1, 0.2, 1], ms: 600 }],
    swap: 'bell',
    allow: { keyline: '响动弧线在铃顶两侧伸出方框，与通知的铃保持同样大小', optical: '铃与通知同一位置；光学测量按行填满，把铃顶两侧的弧线之间算成实心，偏上是测量造成的' }
  },
  phone: {
    label: '电话', key: 'live',
    plan: '主体：听筒（一段粗圆弧，两端是听筒和话筒，作为一个闭合形）',
    weights: { [P]: 1 },
    draw(g) { return [shell(handset(g), { n: 'handset', role: P })]; },
    // 来电: the handset rattles
    fx: { t: 'wiggle', on: 'all', o: [12, 12], deg: 9, hz: 6 }
  },
  'phone-call': {
    label: '来电', key: 'live',
    plan: '主体：听筒（与电话相同）；辅助：右上两道声波（以听筒弧线的圆心画）',
    weights: { [P]: 0.75, [S]: 0.25 },
    draw(g) {
      return [
        shell(handset(g), { n: 'handset', role: P }),
        line(g.arc(21, 3, 4, 90, 180), { n: 'w1', role: S, vc: 0 }),
        line(g.arc(21, 3, 8, 90, 180), { n: 'w2', role: S, vc: 1 })
      ];
    },
    fx: [{ t: 'wiggle', on: ['handset'], o: [12, 12], deg: 7, hz: 6 }, { t: 'variable', on: ['w1', 'w2'], mode: 'cumulative' }]
  },
  'video-call': {
    label: '视频通话', key: 'landscape', fit: 'x',
    plan: '主体：摄像机机身；辅助：右侧的镜头（梯形，接在机身右边，高度接近机身，占四成）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(2, 6, 14, 12, 3.5), { n: 'body', role: P }),
        shell(g.polygon([[16 - h, 10], [22 - h, 6 + h], [22 - h, 18 - h], [16 - h, 14]], [0.4, 1.2, 1.2, 0.4]), { n: 'lens', role: S }),
        solid(g.dot(6.5, 10, 0.9), { n: 'rec', role: D, ghost: true })
      ];
    },
    // 通话中: the recording light blinks
    fx: { t: 'keys', on: ['rec'], ghost: true, a: [1, 0, 1, 1], ms: 700 }
  },
  headset: {
    label: '客服耳麦', key: 'live',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：头梁和两个耳罩；辅助：话筒杆（从右耳罩下来，端头是实心点，太小画不出圆环）',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const { h } = g, R = 10 - h, cy = 12;
      return [
        line(`M${n(2 + h)} 14V${cy}A${n(R)} ${n(R)} 0 0 1 ${n(22 - h)} ${cy}V14`, { n: 'band', role: P }),
        shell(g.box(2, 12, 6, 6, 2), { n: 'cupL', role: P }),
        shell(g.box(16, 12, 6, 6, 2), { n: 'cupR', role: P }),
        line(`M19 18A2 2 0 0 1 17 20H13`, { n: 'boom', role: S, part: 'mic' }),
        solid(g.dot(12, 20, 1.15), { n: 'mic', role: S, part: 'mic' })
      ];
    },
    fx: { t: 'bounce', on: 'all', o: [12, 22], amp: 0.8 }
  },
  megaphone: {
    label: '喇叭', key: 'landscape', fit: 'x',
    plan: '主体：喇叭（后部方块加向右张开的喇叭口，一个闭合形）；辅助：下方的握把。整体上移 1，让握把不把重心拉低',
    weights: { [P]: 0.85, [S]: 0.15 },
    draw(g) {
      const { h } = g;
      return [
        line(cup(5, 14, 9, 19, 2), { n: 'grip', role: S }),
        shell(g.polygon([[2 + h, 8], [8, 8], [22 - h, 3 + h], [22 - h, 19 - h], [8, 14], [2 + h, 14]], [1.8, 0.6, 1.2, 1.2, 0.6, 1.8]), { n: 'horn', role: P })
      ];
    },
    // 广播: the horn sounds twice
    fx: { t: 'beat', on: 'all', o: [12, 12], amp: 0.09 }
  },
  'at-sign': {
    label: '提及', key: 'circle',
    light: [], // one glyph
    plan: '主体：@ 符号（中间的圆环和绕外圈的一笔，一个符号）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, ri = 5 - h, xs = 12 + ri, R = 10 - h, xr = 22 - h, rs = (xr - xs) / 2, a = (60 * Math.PI) / 180;
      return [
        line(g.ring(12, 12, 5), { n: 'ring', role: P }), // a glyph: no part of it fills
        line(`M${n(xs)} ${n(12 - ri)}V13A${n(rs)} ${n(rs)} 0 0 0 ${n(xr)} 13V12A${n(R)} ${n(R)} 0 1 0 ${n(12 + R * Math.cos(a))} ${n(12 + R * Math.sin(a))}`, { n: 'tail', role: P })
      ];
    },
    fx: { t: 'draw', on: ['ring', 'tail'] }
  },
  hash: {
    label: '话题', key: 'square',
    light: [], // one glyph
    plan: '主体：井号（两条横线和两条斜竖线，一个符号）',
    weights: { [P]: 1 },
    draw(g) {
      return [
        line(g.span(3, 9, 21, 9), { n: 'h1', role: P }),
        line(g.span(3, 15, 21, 15), { n: 'h2', role: P }),
        line(g.span(10, 3, 8, 21), { n: 'v1', role: P }),
        line(g.span(16, 3, 14, 21), { n: 'v2', role: P })
      ];
    },
    fx: { t: 'draw', on: ['v1', 'v2', 'h1', 'h2'] }
  },
  reply: {
    label: '回复', key: 'square',
    light: [], // one arrow
    plan: '主体：向左的箭头（头部与下载的箭头同大小、同角度），杆向右后弯下',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, x = 3 + h, y = 9, L = 5;
      return [
        line(`M${n(x)} ${y}H15A5 5 0 0 1 20 ${y + 5}V${n(21 - h)}`, { n: 'shaft', role: P }),
        line(g.pl([[x + L, y - L], [x, y], [x + L, y + L]]), { n: 'head', role: P })
      ];
    },
    fx: { t: 'keys', on: 'all', x: [-1.3, 0.3] }
  },
  rss: {
    nudge: [0, -0.9],
    label: '订阅', key: 'square',
    plan: '主体：两道四分之一圆弧（以左下角为圆心）；细节：左下的发射点（实心）。分量在左下，整体上移 0.9',
    weights: { [P]: 0.9, [D]: 0.1 },
    draw(g) {
      const { h } = g, up = 0.9, ox = 3 + h, oy = 21 - h - up, k = 1.1, r = g.dr * k;
      return [
        solid(g.dot(3 + r, 21 - r - up, k), { n: 'dot', role: D, vc: 0 }),
        line(g.arc(ox, oy, 9, -90, 0), { n: 'a1', role: P, vc: 1 }),
        line(g.arc(ox, oy, 18 - 2 * h, -90, 0), { n: 'a2', role: P, vc: 2 })
      ];
    },
    fx: { t: 'variable', on: ['dot', 'a1', 'a2'], mode: 'cumulative' }
  },
  voicemail: {
    label: '语音信箱', key: 'landscape', fit: 'x',
    light: [], // one glyph
    plan: '主体：两个磁带轮（圆环）；辅助：连接两轮底部的磁带（一条线）',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const R = 4.5, cy = 12.5, y = cy + R - g.h;
      return [
        shell(g.ring(6.5, cy, R), { n: 'r1', role: P }),
        line(g.seg(6.5, y, 17.5, y), { n: 'tape', role: S }),
        shell(g.ring(17.5, cy, R), { n: 'r2', role: P })
      ];
    },
    fx: { t: 'draw', on: ['r1', 'tape', 'r2'] }
  },
  'dial-pad': {
    nudge: [0, 0.5],
    label: '拨号键盘', key: 'portrait',
    plan: '主体：十个按键（实心点：三行三列加最下面的 0）。上面三行比最下一行重，整体下移 0.5',
    weights: { [P]: 1 },
    draw(g) {
      const r = 1.6 + (g.s - 2) * 0.3, xs = [5.75, 12, 18.25], ys = [4.25, 9.75, 15.25], keys = [];
      ys.forEach((y) => xs.forEach((x) => keys.push([x, y])));
      keys.push([12, 20.75]);
      return keys.map(([x, y], i) => solid(g.circ(x, y, r), { n: `k${i}`, role: P, part: 'keys' }));
    },
    // 拨号: keys light up one after another
    fx: { t: 'variable', on: ['k0', 'k4', 'k8', 'k1', 'k9'], mode: 'iterative', step: 120 }
  },
  'contact-book': {
    label: '通讯录', key: 'portrait',
    plan: '主体：封面（与笔记本相同）；辅助：左侧三个装订环（比笔记本上移 1，给肩留出间距）；细节：人像（头和肩，肩接到封面下边）',
    weights: { [P]: 0.55, [S]: 0.12, [D]: 0.33 },
    draw(g, ctx) {
      const { h } = g, cx = 13, r = 3, top = 18.5;
      const body = line(`M${n(cx - r)} ${n(22 - h)}V${top}A${r} ${r} 0 0 1 ${n(cx + r)} ${top}V${n(22 - h)}`, { n: 'body', role: D, on: 'cover', ends: 'out' });
      // fill: the shoulders run out through the cover's bottom edge, as they meet it in the
      // outline (ends: 'out'). They cross it where the cover's bottom corners begin to round,
      // so a round notch (half a stroke) where each crosses meets both edges square. The
      // corners are read as circles of radius 3.5.
      const xe = r + h, ye = 18.5 + Math.sqrt(3.5 ** 2 - (cx - xe - 9.5) ** 2);
      const notch = solid(g.circ(cx - xe, ye, g.h) + g.circ(cx + xe, ye, g.h), { n: 'notch', role: D, on: 'cover', part: 'body' });
      return [cover(g), rings(g, [6, 11, 16]), shell(g.ring(cx, 9.5, 2.75), { n: 'head', role: D, on: 'cover' }), body, ...(ctx?.variant === 'fill' ? [notch] : [])];
    },
    fx: { t: 'bounce', on: ['head', 'body', 'notch'], o: [13, 21], amp: 0.8 }
  },
  podcast: {
    anchor: 'base',
    label: '播客', key: 'circle', fit: 'y',
    plan: '主体：两道开口朝下的声波圆弧；辅助：话筒（实心点和下面的竖杆，立在底边）。话筒只有一点一线，占不到两成，所以声波作主体',
    weights: { [P]: 0.86, [S]: 0.14 },
    draw(g) {
      const k = 1.05 - (g.s - 2) * 0.4, cy = 11;
      return [
        solid(g.dot(12, cy, k), { n: 'dot', role: S, vc: 0 }),
        line(g.seg(12, 16.5, 12, 22 - g.h), { n: 'stem', role: S }),
        line(g.arc(12, cy, 4.25, 135, 405), { n: 'w1', role: P, vc: 1 }),
        line(g.arc(12, cy, 8.25, 130, 410), { n: 'w2', role: P, vc: 2 })
      ];
    },
    fx: { t: 'variable', on: ['dot', 'w1', 'w2'], mode: 'cumulative' }
  },
  'radio-tower': {
    anchor: 'base',
    label: '信号塔', key: 'live',
    plan: '主体：塔身（人字形的两条腿和横撑，顶上实心点，立在底边）；辅助：两侧各两道信号弧（内弧随字重变短，离塔腿 1.25 以上）',
    weights: { [P]: 0.52, [S]: 0.48 },
    draw(g) {
      const { h } = g, cy = 8, k = 1.1 - (g.s - 2) * 0.3, yb = 22 - h, w = (17 - cy) / (yb - cy) * 4;
      const both = (r, a) => g.arc(12, cy, r, 180 - a, 180 + a) + g.arc(12, cy, r, -a, a);
      return [
        line(g.pl([[8, yb], [12, cy], [16, yb]]) + g.seg(12 - w, 17, 12 + w, 17), { n: 'tower', role: P }),
        solid(g.dot(12, cy, k), { n: 'dot', role: P, vc: 0 }),
        line(both(4.5, 20 - Math.max(g.s - 2, 0) * 10), { n: 'w1', role: S, vc: 1 }),
        line(both(9, 35), { n: 'w2', role: S, vc: 2 })
      ];
    },
    fx: { t: 'variable', on: ['dot', 'w1', 'w2'], mode: 'cumulative' }
  }
};
