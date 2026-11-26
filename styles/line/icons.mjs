// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// The icons of the SF-style line set, on the 24 grid (GUIDE.md §1). Each draw(g) returns layers
// back to front (kit.mjs); g.s is the stroke width, g.h half of it. Outlines are placed by their
// outer edge (g.box, g.ring), so the sizes below are what you see at every weight.
//
// Every icon states its parts before it is drawn (GUIDE.md §3):
//   plan     which part is the primary (主体), which are secondary (辅助) and which are details (细节)
//   weights  the share of ink each role is meant to take; check.mjs measures it
// fx is the motion it plays on hover (motion.mjs); swap is the icon it turns into on click.
import { geo, shell, line, solid, slash, badge, enclose } from './kit.mjs';
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker } from './parts.mjs';
import { CATALOG } from './catalog.mjs';
import { SETS } from './set/index.mjs';
import { off, offFill, notched } from './variants.mjs';

const DEG = Math.PI / 180;
// The globe's meridians face the viewer at this longitude east and west: the width 4.6 they
// have on a sphere of radius 9.
const GLOBE_LON = +(Math.asin(4.6 / 9) / DEG).toFixed(2);


// The person behind in users, fill variant. The front person's clear band would leave the back
// head a crescent and the back body a wedge, both ending in thin tips. Here each back shape ends
// where that band begins (its centre line s + gap from the front one's), with a sharp corner in
// the path that the round join turns into a round tip half a stroke across.
function backPerson(g) {
  const { h, s } = g, D = s + g.g;
  // head: head2's circle less a circle round head1 (radius grown by D)
  const [ax, ay, ar] = [16.75, 7.6, 3.6 - h], [bx, by, br] = [8.5, 8.25, 4.25 - h + D];
  const d = Math.hypot(ax - bx, ay - by), ux = (ax - bx) / d, uy = (ay - by) / d;
  const l = (d * d + br * br - ar * ar) / (2 * d), k = Math.sqrt(br * br - l * l);
  const p = (sg) => g.pt(bx + ux * l - sg * uy * k, by + uy * l + sg * ux * k);
  const head = `M${p(1)}A${n(ar)} ${n(ar)} 0 1 0 ${p(-1)}A${n(br)} ${n(br)} 0 0 1 ${p(1)}Z`;
  // body: the front body (2, 14, 13 x 6, corners 5 and 2 on the right) has a right side of two
  // circular arcs meeting at (15 - h, yc); the back body's left corners sit at D from them
  const r1 = ((6 - s) * (5 - h)) / (7 - s), r2 = ((6 - s) * (2 - h)) / (7 - s), yc = 14 + h + r1;
  const at = (r, y) => 15 - h - r + Math.sqrt((r + D) ** 2 - (y - yc) ** 2);
  const top = 14 + h, bot = 20 - h, right = 22 - h;
  const body = g.polygon([[at(r1, top), top], [right, top], [right, bot], [at(r2, bot), bot]], [0, 4 - h, 2 - h, 0]);
  return [head, body];
}


const CORE = {
  home: {
    label: '首页', key: 'square',
    plan: '主体：带屋檐的房子轮廓（一个闭合形）；细节：门',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g) {
      const { h } = g, top = 2 + h, ex = 22 - h, ey = top + (ex - 12), wl = 5 + h, wr = 19 - h, yb = 21 - h, dw = 3 - h;
      return [
        shell(g.polygon([[12, top], [ex, ey], [wr, ey], [wr, yb], [wl, yb], [wl, ey], [24 - ex, ey]], [1.6, 0.8, 0, 3.25 - h, 3.25 - h, 0, 0.8]), { n: 'house', role: P }),
        line(`M${n(12 - dw)} ${n(yb)}V${n(15.25 + dw)}A${n(dw)} ${n(dw)} 0 0 1 ${n(12 + dw)} ${n(15.25 + dw)}V${n(yb)}`, { n: 'door', role: D, on: 'house', only: 'outline' }),
        solid(`M10 22V17A2 2 0 0 1 14 17V22Z`, { n: 'door', role: D, on: 'house', only: 'fill' })
      ];
    },
    // 回到首页: the house settles and its door is drawn up from the ground (no 3D turns for line
    // icons: a squashed door reads as a flat sheet turning)
    fx: [{ t: 'bounce', on: ['house', 'door'], o: [12, 21], amp: 0.6 }, { t: 'draw', on: ['door'] }]
  },
  search: {
    label: '搜索', key: 'square',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：镜片圆环；辅助：手柄（45°）',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      // lens centre on (10, 10), so marks drawn in it (zoom-in, zoom-out) sit on whole pixels
      const R = 7, c = 3 + R, k = (R - g.h) / Math.SQRT2;
      return [shell(g.ring(c, c, R), { n: 'lens', role: P }), line(g.seg(c + k, c + k, 21 - g.h, 21 - g.h), { n: 'handle', role: S })];
    },
    fx: { t: 'orbit', on: 'all', R: 0.9 }
  },
  settings: {
    label: '设置', key: 'circle',
    plan: '主体：八齿齿轮；细节：中心孔',
    weights: { [P]: 0.84, [D]: 0.16 },
    draw(g) { return [shell(gear(g), { n: 'gear', role: P }), shell(g.ring(12, 12, 3.75 - (g.s - 1.75) * 0.5), { n: 'hole', role: D, on: 'gear' })]; },
    fx: { t: 'rotate', on: 'all', deg: 90 }
  },
  bell: {
    label: '通知', key: 'square',
    plan: '主体：铃身和铃口（铃口宽出铃身）；辅助：铃锤（实心半圆，太小画不出线框）',
    weights: { [P]: 0.85, [S]: 0.15 },
    draw(g) {
      const rim = 15;
      return [
        shell(g.box(5, 3, 14, rim - 3 + g.h, [7, 7, 0, 0]), { n: 'body', role: P }),
        line(g.span(3, rim, 21, rim), { n: 'rim', role: P }),
        solid(g.rr(10, rim + g.h + 2, 4, 3, [0.5, 0.5, 2, 2]), { n: 'clapper', role: S })
      ];
    },
    fx: [{ t: 'wiggle', on: ['body', 'rim'], o: [12, 3], deg: 8 }, { t: 'wiggle', on: ['clapper'], o: [12, 3], deg: 11, delay: 50 }],
    swap: 'bell-off'
  },
  heart: {
    nudge: [0, 0.7],
    label: '喜欢', key: 'live', fit: 'x',
    plan: '主体：心形，一个闭合形',
    weights: { [P]: 1 },
    draw(g) { return [shell(heart(g), { n: 'heart', role: P })]; },
    fx: { t: 'beat', on: 'all', o: [12, 12.5] },
    swap: { icon: 'heart', variant: 'fill', act: true }
  },
  star: {
    nudge: [0, -0.6],
    label: '收藏', key: 'circle',
    plan: '主体：五角星，一个闭合形',
    weights: { [P]: 1 },
    draw(g) { return [shell(star(g), { n: 'star', role: P })]; },
    // 收藏: the star gathers, then turns a fifth of a turn (landing on itself) as it pops
    fx: [{ t: 'rotate', on: 'all', deg: 72, o: [12, 12.25] }, { t: 'keys', on: 'all', o: [12, 12.25], s: [0.84, 1.08] }],
    enter: { t: 'from', on: 'all', o: [12, 12.25], s: 0.55, r: -72, hz: 1.9, z: 0.5 },
    swap: { icon: 'star', variant: 'fill', act: true }
  },
  bookmark: {
    label: '书签', key: 'portrait', fit: 'y',
    plan: '主体：书签带，底部 V 形缺口，缺口顶点是尖的；两条尾巴的外角倒圆',
    weights: { [P]: 1 },
    draw(g) {
      // The V's apex is an inner corner, so it stays sharp (GUIDE 2.4); the tails are rounded.
      const { h } = g, x0 = 5 + h, x1 = 19 - h, y0 = 2 + h, yb = 22 - h, c = 3.5 - h, w = 3.6, dep = 3.4 + h * 0.4;
      return [shell(g.polygon([[x0, y0], [x1, y0], [x1, yb], [12 + w, yb], [12, yb - dep], [12 - w, yb], [x0, yb]], [c, c, 1.4, 0.6, 0, 0.6, 1.4]), { n: 'bookmark', role: P })];
    },
    // 收藏到书签: the ribbon draws back up, then grows down past its length and settles
    fx: { t: 'keys', on: 'all', o: [12, 2], sy: [0.62], ms: 200 },
    enter: { t: 'from', on: 'all', o: [12, 2], sy: 0.45, hz: 2, z: 0.5 },
    swap: { icon: 'bookmark', variant: 'fill', act: true },
    allow: { keyline: '书签本身窄，宽 14' }
  },
  folder: {
    label: '文件夹', key: 'landscape',
    plan: '主体：带标签的夹子轮廓；细节：标签线（两端离开侧边，不把夹子切成两块）',
    weights: { [P]: 0.85, [D]: 0.15 },
    draw(g) {
      const { h, s } = g, t = 4 + h, b = 7 + h;
      return [
        shell(g.polygon([[2 + h, t], [9.2, t], [11.4, b], [22 - h, b], [22 - h, 20 - h], [2 + h, 20 - h]], [2 - h * 0.5, 1.4, 0.9, 3.5 - h, 4 - h, 4 - h]), { n: 'folder', role: P }),
        line(g.seg(2 + s + 3.4, b + s + 2, 22 - s - 3.4, b + s + 2), { n: 'front', role: D, only: 'outline' })
      ];
    },
    fx: { t: 'bounce', on: 'all', o: [12, 20] },
    swap: 'folder-open'
  },
  'file-text': {
    label: '文档', key: 'portrait',
    plan: '主体：纸页；细节：三行字（末行短）。字线要离纸边 2，长度到此为止，占三成',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g, ctx) {
      // In the fill the lines are holes: at heavy strokes they spread so one stroke of ink stays
      // between them.
      const { s, h } = g, a = 4 + s + 2 + h, b = 20 - s - 2 - h, sp = ctx?.variant === 'fill' ? Math.max(4, 2 * s) : 4;
      return [
        shell(g.box(4, 2, 16, 20, 4), { n: 'page', role: P }),
        line(g.seg(a, 12 - sp, b, 12 - sp), { n: 'l1', role: D, on: 'page' }),
        line(g.seg(a, 12, b, 12), { n: 'l2', role: D, on: 'page' }),
        line(g.seg(a, 12 + sp, a + (b - a) * 0.55, 12 + sp), { n: 'l3', role: D, on: 'page' })
      ];
    },
    fx: { t: 'draw', on: ['l1', 'l2', 'l3'] }
  },
  trash: {
    label: '删除', key: 'portrait',
    plan: '主体：桶身（开口的 U 形）；辅助：桶盖和提手；细节：两条竖纹',
    weights: { [P]: 0.48, [S]: 0.34, [D]: 0.18 },
    draw(g, ctx) {
      // In the fill the two slats are holes: at least one stroke of ink between them.
      const { h, s } = g, L = 6, yt = L + s + 2, x0 = 5 + h, x1 = 19 - h, rx0 = 2 - (s - 2) * 0.15, rx = ctx?.variant === 'fill' ? Math.max(rx0, s) : rx0, yb = 22 - h, c = 3.25 - h, r0 = yt + s + 0.9, r1 = yb - s - 1.7;
      return [
        line(cup(x0, yt, x1, yb, c), { n: 'can', role: P, only: 'outline' }),
        shell(`M${n(x0)} ${n(yt)}H${n(x1)}V${n(yb - c)}A${n(c)} ${n(c)} 0 0 1 ${n(x1 - c)} ${n(yb)}H${n(x0 + c)}A${n(c)} ${n(c)} 0 0 1 ${n(x0)} ${n(yb - c)}Z`, { n: 'can', role: P, only: 'fill' }),
        line(g.seg(12 - rx, r0, 12 - rx, r1), { n: 'r1', role: D, on: 'can' }),
        line(g.seg(12 + rx, r0, 12 + rx, r1), { n: 'r2', role: D, on: 'can' }),
        line(`M9 ${n(L)}V${n(2 + h + 1)}A1 1 0 0 1 10 ${n(2 + h)}H14A1 1 0 0 1 15 ${n(2 + h + 1)}V${n(L)}` + g.span(4, L, 20, L), { n: 'lid', role: S })
      ];
    },
    fx: { t: 'keys', on: ['lid'], o: [19.5, 6.1], y: [-1.6, -1.3], r: [-12, -10] }
  },
  mail: {
    swap: 'mail-open',
    label: '邮件', key: 'landscape',
    ends: 'in',
    plan: '主体：信封；细节：封口（圆弧，从两个上角的圆角中点出发）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) {
      const { h } = g, c = 4 - h, k = 0.293 * c, x0 = 2 + h + k, x1 = 22 - h - k, y0 = 4 + h + k, sag = 6 - h * 0.6;
      const ch = x1 - x0, R = (ch * ch / 4 + sag * sag) / (2 * sag), cy = y0 + sag - R, a0 = (Math.asin((y0 - cy) / R) * 180) / Math.PI;
      return [shell(g.box(2, 4, 20, 16, 4), { n: 'env', role: P }), line(g.arc(12, cy, R, a0, 180 - a0), { n: 'flap', role: D, on: 'env' })];
    },
    fx: { t: 'draw', on: ['flap'] }
  },
  send: {
    nudge: [-0.7, 0.7],
    label: '发送', key: 'live',
    ends: 'in',
    plan: '主体：纸飞机（斜边是这个物体本身需要的）；细节：折线，只画到机身一半多一点，不伸进机头的窄角',
    weights: { [P]: 0.85, [D]: 0.15 },
    draw(g) {
      const { h } = g, T = [22.5 - h, 1.5 + h], A = [-1.1 + h, 11.1], B = [12.9, 25.1 - h], Cc = [9.9, 14.1], F = [Cc[0] + (T[0] - Cc[0]) * 0.55, Cc[1] + (T[1] - Cc[1]) * 0.55];
      return [
        shell(g.polygon([A, T, B, Cc], [1.2, 1.2, 1.2, 0.5]), { n: 'plane', role: P }),
        line(g.seg(Cc[0], Cc[1], F[0], F[1]), { n: 'fold', role: D, on: 'plane' })
      ];
    },
    // 发送: the plane flies off to the top right, fading, and glides back in from the bottom left
    fx: { t: 'keys', on: 'all', x: [3.5, -3.5], y: [-3.5, 3.5], a: [0, 0], s: [0.62, 0.62] }
  },
  user: {
    label: '用户', key: 'square',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：头（说明是人）；辅助：肩（比头宽，墨量更多但层级靠后）',
    weights: { [P]: 0.42, [S]: 0.58 },
    draw(g) {
      return [shell(g.ring(12, 7.5, 4.875), { n: 'head', role: P }), shell(g.box(4, 14, 16, 7, [6.25, 6.25, 2.5, 2.5]), { n: 'body', role: S })];
    },
    fx: { t: 'bounce', on: ['head', 'body'], by: true, o: [12, 21], amp: 1.3 },
    allow: { keyline: '人的肩宽 16，比方框窄；放宽会显得胖' }
  },
  users: {
    label: '多人', key: 'landscape',
    plan: '主体：前面的人；辅助：后面的人（被挡住约三分之一）',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g, ctx) {
      const back = ctx?.variant === 'fill' ? backPerson(g) : [g.ring(16.75, 7.6, 3.6), g.box(13, 14, 9, 6, [4, 4, 2, 2])];
      return [
        shell(back[0], { n: 'head2', role: S }),
        shell(back[1], { n: 'body2', role: S }),
        shell(g.ring(8.5, 8.25, 4.25), { n: 'head1', role: P, occ: true }),
        shell(g.box(2, 14, 13, 6, [5, 5, 2, 2]), { n: 'body1', role: P, occ: true })
      ];
    },
    fx: { t: 'bounce', on: [['head2', 'body2'], ['head1', 'body1']], by: true, o: [12, 20], amp: 1.2 }
  },
  lock: {
    anchor: 'base',
    label: '锁定', key: 'portrait',
    plan: '主体：锁体；辅助：锁梁（伸进锁体上沿）；细节：锁孔（短槽）',
    weights: { [P]: 0.65, [S]: 0.28, [D]: 0.07 },
    draw(g) {
      const { h } = g, by = 10;
      return [
        line(arch(7 + h, 17 - h, 2 + h, by + h), { n: 'shackle', role: S }),
        shell(g.box(4, by, 16, 12, 4), { n: 'body', role: P }),
        line(g.seg(12, 14.6 + (g.s - 1.75) * 1.2, 12, 17.4 - (g.s - 1.75) * 0.9), { n: 'hole', role: D, on: 'body' })
      ];
    },
    // 上锁: the shackle is lifted and snaps down into the body
    fx: { t: 'keys', on: ['shackle'], y: [-1.8, 0.45], ms: 260 },
    enter: { t: 'from', on: ['shackle'], y: -1.8, hz: 2.6, z: 0.5 },
    swap: { icon: 'lock-open', act: true }
  },
  'lock-open': {
    anchor: 'base',
    label: '解锁', key: 'portrait',
    plan: '同锁定，锁梁右脚抬起离开锁体',
    weights: { [P]: 0.66, [S]: 0.27, [D]: 0.07 },
    draw(g) {
      const { h } = g, by = 10, x0 = 7 + h, x1 = 17 - h, r = (x1 - x0) / 2, top = 2 + h;
      return [
        line(`M${n(x0)} ${n(by + h)}V${n(top + r)}A${n(r)} ${n(r)} 0 0 1 ${n(x1)} ${n(top + r)}V${n(top + r + 1.3)}`, { n: 'shackle-open', role: S }),
        shell(g.box(4, by, 16, 12, 4), { n: 'body', role: P }),
        line(g.seg(12, 14.6 + (g.s - 1.75) * 1.2, 12, 17.4 - (g.s - 1.75) * 0.9), { n: 'hole', role: D, on: 'body' })
      ];
    },
    // 开锁: the shackle is pressed in, then springs up and out of the body
    fx: { t: 'keys', on: ['shackle-open'], y: [0.9, -0.9], ms: 300 },
    enter: { t: 'from', on: ['shackle-open'], y: 1.6, hz: 2.2, z: 0.42 },
    swap: { icon: 'lock', act: true }
  },
  eye: {
    label: '查看', key: 'landscape', fit: 'x',
    plan: '主体：眼眶（两段圆弧）；辅助：瞳孔（圆环，不用实心；随字重缩小以保持与眼眶的间隙）。圆环比实心轻，约占四分之一',
    weights: { [P]: 0.75, [S]: 0.25 },
    draw(g, ctx) {
      // The pupil is a ring like every other part (no solid): 1.5 clear of the lids at regular.
      // In the fill the ring is a hole: it stays wide enough that the ink dot in it is one stroke across.
      const { h, s } = g, x0 = 2 + h, x1 = 22 - h, sag = 7 - h, ch = x1 - x0, R = (ch * ch / 4 + sag * sag) / (2 * sag), ir0 = 3.5 - (s - 2) * 0.5, ir = ctx?.variant === 'fill' ? Math.max(ir0, 1.5 * s) : ir0;
      return [
        shell(`M${n(x0)} 12A${n(R)} ${n(R)} 0 0 1 ${n(x1)} 12A${n(R)} ${n(R)} 0 0 1 ${n(x0)} 12Z`, { n: 'eye', role: P }),
        line(g.ring(12, 12, ir), { n: 'iris', role: S, on: 'eye' })
      ];
    },
    fx: { t: 'keys', on: 'all', o: [12, 12], sy: [0.12, 1], ms: 420 },
    swap: 'eye-off'
  },
  calendar: {
    label: '日历', key: 'square',
    plan: '主体：日历本（方形）；细节：表头线和两排日期点',
    weights: { [P]: 0.64, [D]: 0.36 },
    draw(g) {
      const { s, h } = g, d = s - 2, band = 8 - d * 0.3, r = Math.min(g.dr * 0.7, 1.15), T = band + h, B = 21 - s, gap = (B - T - 4 * r) / 3, y1 = T + gap + r, y2 = B - gap - r, dots = [];
      [y1, y2].forEach((y, j) => [8, 12, 16].forEach((x, i) => dots.push(solid(g.circ(x, y, r), { n: `d${j * 3 + i}`, role: D, on: 'box', vc: j * 3 + i }))));
      return [shell(g.box(3, 3, 18, 18, 4.5), { n: 'box', role: P }), line(g.seg(3 + s, band, 21 - s, band), { n: 'band', role: D, only: 'outline' }), ...dots];
    },
    fx: { t: 'variable', on: ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'], mode: 'cumulative', step: 110 }
  },
  clock: {
    label: '时间', key: 'circle',
    plan: '主体：表盘；细节：分针和时针',
    weights: { [P]: 0.82, [D]: 0.18 },
    draw(g) {
      return [
        shell(g.ring(12, 12, 10), { n: 'face', role: P }),
        line(g.seg(12, 12, 12, 2 + g.s + 2 + g.h), { n: 'min', role: D, on: 'face' }),
        line(g.seg(12, 12, 15.9, 14.25), { n: 'hour', role: D, on: 'face' })
      ];
    },
    fx: { t: 'rotate', on: ['min'], deg: 360, o: [12, 12] }
  },
  camera: {
    label: '相机', key: 'landscape',
    plan: '主体：机身（顶部凸起）；辅助：镜头（圆环，随字重缩小，居中在凸起以下的机身里）。机身占横向参考线，凸起高出 1；镜头居中并留 1.5 间距，约占两成多',
    weights: { [P]: 0.77, [S]: 0.23 },
    allow: { keyline: '顶部凸起高出横向参考线 1，给镜头留出位置' },
    draw(g, ctx) {
      // The body fills the landscape key shape; the bump rises 1 above it, so the lens has room.
      // In the fill the lens is a hole: it stays wide enough that the ink dot in it is one stroke across.
      const { h, s } = g, top = 3 + h, by = 6 + h, R0 = 3.5 - (s - 2) * 0.5, R = ctx?.variant === 'fill' ? Math.max(R0, 1.5 * s) : R0, cy = (6 + 20) / 2;
      return [
        shell(g.polygon([[2 + h, by], [6.6, by], [7.9, top], [16.1, top], [17.4, by], [22 - h, by], [22 - h, 20 - h], [2 + h, 20 - h]], [3.5 - h, 0.75, 1.3, 1.3, 0.75, 3.5 - h, 3.5 - h, 3.5 - h]), { n: 'body', role: P }),
        line(g.ring(12, cy, R), { n: 'lens', role: S, on: 'body' })
      ];
    },
    fx: { t: 'keys', on: ['lens'], o: [12, 13], s: [0.55, 1.08], ms: 520 }
  },
  image: {
    label: '图片', key: 'landscape',
    ends: 'in',
    plan: '主体：画框；辅助：山（一段圆弧，接到右边）；细节：太阳（实心点）',
    weights: { [P]: 0.7, [S]: 0.23, [D]: 0.07 },
    draw(g) {
      return [
        shell(g.box(2, 4, 20, 16, 4), { n: 'frame', role: P }),
        line(hill(g), { n: 'hill', role: S, on: 'frame' }),
        solid(g.dot(2 + g.s + 2.4 + g.dr * (1.05 - (g.s - 2) * 0.3), 4 + g.s + 2.4 + g.dr * (1.05 - (g.s - 2) * 0.3), 1.05 - (g.s - 2) * 0.3), { n: 'sun', role: D, on: 'frame' })
      ];
    },
    fx: { t: 'keys', on: ['sun'], y: [3.2, 3.2, 0], a: [0, 0, 1] }
  },
  mic: {
    label: '麦克风', key: 'portrait',
    plan: '主体：话筒头（胶囊）；辅助：支架、立杆和底座',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g, R = 7, cy = 10.6;
      return [
        shell(g.box(8, 2, 8, 13, 4), { n: 'head', role: P }),
        line(g.arc(12, cy, R, 0, 180), { n: 'stand', role: S }),
        line(g.seg(12, cy + R, 12, 22 - h) + g.span(8, 22 - h, 16, 22 - h), { n: 'foot', role: S }),
        line(g.seg(10.7, 6, 13.3, 6), { n: 'g1', role: D, on: 'head', ghost: true }),
        line(g.seg(10.7, 10, 13.3, 10), { n: 'g2', role: D, on: 'head', ghost: true })
      ];
    },
    fx: { t: 'keys', on: ['g1', 'g2'], by: true, stagger: 120, ghost: true, a: [1, 1, 1] },
    swap: 'mic-off',
    allow: { keyline: '支架宽 15.75，略窄于纵向方框' }
  },
  volume: {
    label: '音量', key: 'landscape', fit: 'x',
    plan: '主体：扬声器；辅助：三道声波（间距 4，粗字重下仍留 1.5）',
    weights: { [P]: 0.45, [S]: 0.55 },
    draw(g) {
      const sp = 3.75, wx = 10.5;
      return [
        shell(speaker(g), { n: 'speaker', role: P }),
        line(g.arc(wx, 12, 3, -45, 45), { n: 'w1', role: S, vc: 0 }),
        line(g.arc(wx, 12, 3 + sp, -45, 45), { n: 'w2', role: S, vc: 1 }),
        line(g.arc(wx, 12, 3 + 2 * sp, -45, 45), { n: 'w3', role: S, vc: 2, lv: 3 })
      ];
    },
    fx: { t: 'variable', on: ['w1', 'w2', 'w3'], mode: 'cumulative' },
    swap: 'speaker-off'
  },
  speaker: {
    label: '扬声器', key: 'landscape', fit: 'y',
    plan: '主体：扬声器',
    weights: { [P]: 1 },
    draw(g) { return [shell(speaker(g), { n: 'speaker', role: P, tf: 'translate(6 0)' })]; },
    // 发声: the speaker thumps twice
    fx: { t: 'beat', on: 'all', o: [12, 12], amp: 0.09 },
    allow: { keyline: '单独的扬声器本身就窄' }
  },
  wifi: {
    nudge: [0, 0.75],
    label: '无线网络', key: 'landscape', fit: 'x',
    plan: '主体：三道信号弧；细节：发射点（实心）',
    weights: { [P]: 0.9, [D]: 0.1 },
    draw(g) {
      const cy = 19.85;
      return [
        solid(g.dot(12, cy, 1.1), { n: 'dot', role: D, vc: 0 }),
        line(g.arc(12, cy, 5.1, 232, 308), { n: 'a1', role: P, vc: 1 }),
        line(g.arc(12, cy, 10, 232, 308), { n: 'a2', role: P, vc: 2 }),
        line(g.arc(12, cy, 14.9, 232, 308), { n: 'a3', role: P, vc: 3 })
      ];
    },
    fx: { t: 'variable', on: ['dot', 'a1', 'a2', 'a3'], mode: 'cumulative' },
    swap: 'wifi-off'
  },
  battery: {
    label: '电池', key: 'landscape', fit: 'x',
    plan: '主体：电池壳；辅助：正极凸头（实心，与壳相连）；细节：三格电量（实心）。为了落在整像素上，每格宽 2、间隔 2，电量格比原定的三成轻，约占两成',
    weights: { [P]: 0.72, [S]: 0.09, [D]: 0.19 },
    draw(g) {
      // cells keep 2 from the inside at regular, so their edges fall on whole pixels
      const { s } = g, m = 4 - s, x0 = 2 + s + m, y0 = 6 + s + m, y1 = 18 - s - m, x1 = 20 - s - m, gp = (x1 - x0) / 5, w = gp;
      return [
        shell(g.box(2, 6, 18, 12, 3.5), { n: 'body', role: P }),
        solid(g.rr(19, 10, 3, 4, [0, 1.25, 1.25, 0]), { n: 'nub', role: S }),
        ...[0, 1, 2].map((i) => solid(g.rr(x0 + i * (w + gp), y0, w, y1 - y0, 0.9), { n: `c${i}`, role: D, vc: i, on: 'body' }))
      ];
    },
    fx: { t: 'variable', on: ['c0', 'c1', 'c2'], mode: 'cumulative', step: 220 }
  },
  cloud: {
    label: '云', key: 'landscape', fit: 'x',
    plan: '主体：云（三个圆和一条底线围成一个闭合形）',
    weights: { [P]: 1 },
    draw(g) { return [shell(cloud(g, [[7.1, 14.9, 5.1], [12.6, 10.65, 6.9], [17.6, 15.6, 4.4]], 20), { n: 'cloud', role: P })]; },
    fx: { t: 'keys', on: 'all', x: [0.9, -0.6] }
  },
  sun: {
    label: '晴', key: 'circle',
    plan: '主体：日轮；辅助：八道光芒（短，离日轮 2.5）',
    weights: { [P]: 0.57, [S]: 0.43 },
    draw(g) {
      const rays = [];
      for (let i = 0; i < 8; i++) { const a = (i * 45 * Math.PI) / 180, c = Math.cos(a), s0 = Math.sin(a); rays.push(g.span(12 + 7.3 * c, 12 + 7.3 * s0, 12 + 10 * c, 12 + 10 * s0)); }
      return [shell(g.ring(12, 12, 4.75), { n: 'core', role: P }), line(rays.join(''), { n: 'rays', role: S })];
    },
    fx: [{ t: 'rotate', on: ['rays'], deg: 45 }, { t: 'keys', on: ['core'], o: [12, 12], s: [0.86, 1] }]
  },
  moon: {
    nudge: [0.45, -0.5],
    label: '夜间', key: 'circle',
    plan: '主体：新月（两段圆弧，两端倒圆）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, R = 10.05 - h, c = [12.7, 11.25], b = [19.15, 4.8], rb = 8;
      const dx = b[0] - c[0], dy = b[1] - c[1], Dd = Math.hypot(dx, dy), a = (R * R - rb * rb + Dd * Dd) / (2 * Dd), hh = Math.sqrt(R * R - a * a);
      const mx = c[0] + (a * dx) / Dd, my = c[1] + (a * dy) / Dd, p1 = [mx + (hh * dy) / Dd, my - (hh * dx) / Dd], p2 = [mx - (hh * dy) / Dd, my + (hh * dx) / Dd];
      const p = (q) => `${n(q[0])} ${n(q[1])}`;
      return [shell(`M${p(p1)}A${n(R)} ${n(R)} 0 1 0 ${p(p2)}A${rb} ${rb} 0 0 1 ${p(p1)}Z`, { n: 'moon', role: P })];
    },
    fx: { t: 'wiggle', on: 'all', o: [12, 12], deg: 12, hz: 2.2 }
  },
  play: {
    label: '播放', key: 'square',
    plan: '主体：三角，按重心居中',
    weights: { [P]: 1 },
    draw(g) { const { h } = g; return [shell(g.polygon([[5 + h, 1.4 + h], [22.6 - h, 12], [5 + h, 22.6 - h]], [2.5, 2.5, 2.5]), { n: 'tri', role: P })]; },
    fx: { t: 'keys', on: 'all', x: [1.2], ms: 420 },
    swap: 'pause',
    allow: { keyline: '播放三角按重心居中，宽约为高的 0.8' }
  },
  pause: {
    label: '暂停', key: 'square',
    plan: '主体：两根竖条，画成圆角线框（面性中为实心），与播放的三角同为线框。竖条宽 6，粗字重下内部仍留得住',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.box(4, 3, 6, 18, 2.5), { n: 'p1', role: P }), shell(g.box(14, 3, 6, 18, 2.5), { n: 'p2', role: P })]; },
    fx: { t: 'keys', on: ['p1', 'p2'], by: true, sy: [0.8], o: [12, 12], ms: 420 },
    swap: 'play',
    allow: { keyline: '与播放三角同宽' }
  },
  download: {
    anchor: 'base',
    label: '下载', key: 'square',
    plan: '主体：向下的箭头（说明动作）；辅助：托盘',
    weights: { [P]: 0.46, [S]: 0.54 },
    draw(g) {
      const { h } = g, tip = 15.6, L = 5;
      return [
        line(cup(3 + h, 14.25, 21 - h, 21 - h, 3.75 - h), { n: 'tray', role: S }),
        line(g.seg(12, 3 + h, 12, tip), { n: 'shaft', role: P }),
        line(g.pl([[12 - L, tip - L], [12, tip], [12 + L, tip - L]]), { n: 'head', role: P })
      ];
    },
    area: (g) => [{ n: 'tray', d: g.rr(3 + g.h, 14.25, 18 - g.s, 21 - g.h - 14.25, [0, 0, 3.75 - g.h, 3.75 - g.h]) }],
    light: ['shaft', 'head'],
    fx: { t: 'draw', on: ['shaft', 'head'] }
  },
  upload: {
    anchor: 'base',
    label: '上传', key: 'square',
    plan: '主体：向上的箭头；辅助：托盘',
    weights: { [P]: 0.46, [S]: 0.54 },
    draw(g) {
      const { h } = g, top = 3 + h, L = 5;
      return [
        line(cup(3 + h, 14.25, 21 - h, 21 - h, 3.75 - h), { n: 'tray', role: S }),
        line(g.seg(12, 15.6, 12, top), { n: 'shaft', role: P }),
        line(g.pl([[12 - L, top + L], [12, top], [12 + L, top + L]]), { n: 'head', role: P })
      ];
    },
    area: (g) => [{ n: 'tray', d: g.rr(3 + g.h, 14.25, 18 - g.s, 21 - g.h - 14.25, [0, 0, 3.75 - g.h, 3.75 - g.h]) }],
    light: ['shaft', 'head'],
    fx: { t: 'draw', on: ['shaft', 'head'] }
  },
  share: {
    anchor: 'base',
    label: '分享', key: 'square',
    plan: '主体：伸出盒子的箭头；辅助：上沿开口的盒子',
    weights: { [P]: 0.36, [S]: 0.64 },
    draw(g) {
      const { h, s } = g, x0 = 4 + h, x1 = 20 - h, y0 = 11 + h, yb = 21 - h, c = 3.75 - h, L = 4.3 - 0.8 * (s - 1.75);
      return [
        line(`M7.9 ${n(y0)}H${n(x0 + c)}A${n(c)} ${n(c)} 0 0 0 ${n(x0)} ${n(y0 + c)}V${n(yb - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x0 + c)} ${n(yb)}H${n(x1 - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x1)} ${n(yb - c)}V${n(y0 + c)}A${n(c)} ${n(c)} 0 0 0 ${n(x1 - c)} ${n(y0)}H16.1`, { n: 'box', role: S }),
        line(g.seg(12, 3 + h, 12, 15.4) + g.pl([[12 - L, 3 + h + L], [12, 3 + h], [12 + L, 3 + h + L]]), { n: 'arrow', role: P })
      ];
    },
    area: (g) => [{ n: 'box', d: g.rr(4 + g.h, 11 + g.h, 16 - g.s, 10 - g.s, [0, 0, 3.75 - g.h, 3.75 - g.h]) }],
    light: ['arrow'],
    fx: { t: 'keys', on: ['arrow'], y: [-1.3, 0.3] },
    allow: { keyline: '盒子宽 16，箭头才显得是从盒子里伸出' }
  },
  link: {
    label: '链接', key: 'landscape', fit: 'x',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：左右两个链环（各自一段直边加半圆，开口相对，中间留出间距）；辅助：穿过两个开口的连接杆',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      // Each half is a link with a long straight run, so it reads as a chain link, not a bracket.
      // Their ends pull back as the stroke grows, keeping the gap between them.
      const { h } = g, y0 = 7 + h, y1 = 17 - h, r = (y1 - y0) / 2, lx = 2 + h + r, rx = 22 - h - r, ex = n(10.25 - (g.s - 2) * 0.5);
      return [
        line(`M${ex} ${n(y0)}H${n(lx)}A${n(r)} ${n(r)} 0 0 0 ${n(lx)} ${n(y1)}H${ex}`, { n: 'left', role: P }),
        line(`M${24 - ex} ${n(y0)}H${n(rx)}A${n(r)} ${n(r)} 0 0 1 ${n(rx)} ${n(y1)}H${24 - ex}`, { n: 'right', role: P }),
        line(g.seg(8, 12, 16, 12), { n: 'bar', role: S })
      ];
    },
    area: (g) => { const { h } = g, y0 = 7 + h, y1 = 17 - h, r = (y1 - y0) / 2; const ex = 10.25 - (g.s - 2) * 0.5; return [{ n: 'left', d: g.rr(2 + h, y0, ex - 2 - h, y1 - y0, [r, 0, 0, r]) }, { n: 'right', d: g.rr(24 - ex, y0, 22 - h - (24 - ex), y1 - y0, [0, r, r, 0]) }]; },
    fx: [{ t: 'keys', on: ['left'], x: [-1, 0.2] }, { t: 'keys', on: ['right'], x: [1, -0.2] }]
  },
  pencil: {
    label: '编辑', key: 'live',
    ends: 'out',
    plan: '主体：斜放的笔杆和笔尖（45°，约定俗成的斜放）；细节：笔尾一道箍',
    weights: { [P]: 0.88, [D]: 0.12 },
    draw(g) {
      const { h } = g, L = 26.3, W = 6.4, tipL = 5.2, a = -Math.PI / 4, o = [1.7 + h * 0.8, 22.3 - h * 0.8];
      const Pt = ([u, v]) => [o[0] + u * Math.cos(a) - v * Math.sin(a), o[1] + u * Math.sin(a) + v * Math.cos(a)];
      const body = [[0, 0], [tipL, -W / 2 + h], [L - h * 1.4, -W / 2 + h], [L - h * 1.4, W / 2 - h], [tipL, W / 2 - h]].map(Pt);
      return [
        shell(g.polygon(body, [0.9, 0, 1.8, 1.8, 0]), { n: 'pencil', role: P }),
        line(g.pl([[L - 5.3, -W / 2 + h], [L - 5.3, W / 2 - h]].map(Pt)), { n: 'band', role: D, on: 'pencil' })
      ];
    },
    fx: { t: 'orbit', on: 'all', R: 0.8, turns: 2 }
  },
  'circle-check': {
    label: '完成', key: 'circle',
    plan: '主体：对勾（说明状态，墨少但层级最高）；辅助：外圈',
    weights: { [P]: 0.22, [S]: 0.78 },
    draw(g) {
      const k = 1 - 0.3 * (g.s - 1.75), Pt = ([x, y]) => [12 + (x - 12) * k, 12.2 + (y - 12.2) * k];
      return [shell(g.ring(12, 12, 10), { n: 'ring', role: S }), line(g.pl([[7.3, 12.4], [10.6, 15.7], [16.7, 9]].map(Pt)), { n: 'check', role: P, on: 'ring' })];
    },
    fx: { t: 'draw', on: ['check'] }
  },
  'circle-plus': {
    label: '添加', key: 'circle',
    plan: '主体：加号；辅助：外圈',
    weights: { [P]: 0.27, [S]: 0.73 },
    draw(g) { const k = 5.1 - 0.5 * (g.s - 1.75); return [shell(g.ring(12, 12, 10), { n: 'ring', role: S }), line(g.seg(12, 12 - k, 12, 12 + k) + g.seg(12 - k, 12, 12 + k, 12), { n: 'plus', role: P, on: 'ring' })]; },
    fx: { t: 'rotate', on: ['plus'], deg: 90, o: [12, 12] }
  },
  'circle-x': {
    label: '关闭', key: 'circle',
    plan: '主体：叉号；辅助：外圈',
    weights: { [P]: 0.28, [S]: 0.72 },
    draw(g) { const k = 3.75 - 0.6 * (g.s - 1.75); return [shell(g.ring(12, 12, 10), { n: 'ring', role: S }), line(g.seg(12 - k, 12 - k, 12 + k, 12 + k) + g.seg(12 + k, 12 - k, 12 - k, 12 + k), { n: 'x', role: P, on: 'ring' })]; },
    fx: { t: 'rotate', on: ['x'], deg: 90, o: [12, 12] }
  },
  info: {
    label: '信息', key: 'circle',
    plan: '主体：字母 i（点和竖，墨少但层级最高）；辅助：外圈',
    weights: { [P]: 0.18, [S]: 0.82 },
    draw(g, ctx) {
      // In the fill the dot and the stem are holes: the dot rises to keep one stroke of ink
      // between them.
      const d = g.s - 2, k = 1 - d * 0.27, r = g.dr * k, top = 11.5 + d * 1.5 - g.h;
      const cy = ctx?.variant === 'fill' ? Math.min(7.25 + d * 1.5, top - g.s - r) : 7.25 + d * 1.5;
      return [
        shell(g.ring(12, 12, 10), { n: 'ring', role: S }),
        solid(g.dot(12, cy, k), { n: 'dot', role: P, on: 'ring' }),
        line(g.seg(12, 11.5 + d * 1.5, 12, 17.5 - d), { n: 'stem', role: P, on: 'ring' })
      ];
    },
    fx: { t: 'bounce', on: ['dot', 'stem'], by: true, amp: 1.1, o: [12, 17.5] }
  },
  'rotate-cw': {
    label: '刷新', key: 'square',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：300° 的圆弧，缺口在右上；辅助：箭头头部（在圆弧顶端，指向缺口）',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      // The head sits on the arc's top end and points into the gap. On a curve a head aligned with
      // the end tangent looks bent outward; it is turned back along the chord, by half the angle its length covers.
      const { h } = g, a1 = -55, R = 8.75, cx = 11.75, cy = 12.375, r = R - h, L = 3.5, k = Math.SQRT1_2;
      const rad = (a1 * Math.PI) / 180, E = [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
      const turn = (L * k) / (2 * r), dir = rad + Math.PI / 2 - turn;
      const t = [Math.cos(dir), Math.sin(dir)], nrm = [-t[1], t[0]];
      const A1 = [E[0] - L * k * (t[0] + nrm[0]), E[1] - L * k * (t[1] + nrm[1])], A2 = [E[0] - L * k * (t[0] - nrm[0]), E[1] - L * k * (t[1] - nrm[1])];
      return [line(g.arc(cx, cy, r, a1 - 300, a1), { n: 'arc', role: P }), line(g.pl([A1, E, A2]), { n: 'head', role: S })];
    },
    area: (g) => [{ n: 'arc', d: g.circ(11.75, 12.375, 8.75 - g.h) }],
    fx: { t: 'rotate', on: 'all', deg: 360, dip: 0.07 },
    allow: { keyline: '箭头头部伸出圆弧；圆直径 17.5，下移留出头部的位置' }
  },
  'shopping-cart': {
    label: '购物车', key: 'square',
    plan: '主体：车筐（上沿和右沿，落在车架底杆上）；辅助：车架（把手、立杆、底杆）；细节：两个轮子（实心，太小画不出圆环）',
    weights: { [P]: 0.4, [S]: 0.42, [D]: 0.18 },
    draw(g) {
      const { h } = g, fx = 6, bot = 15 - (g.s - 2) * 0.3, top = 6 + h, xr = 21 - h, c = 2.75 - h;
      return [
        line(`M${n(3 + h)} ${n(3 + h)}H${n(fx - 1.5)}A1.5 1.5 0 0 1 ${n(fx)} ${n(4.5 + h)}V${n(bot - 1.9)}A1.9 1.9 0 0 0 ${n(fx + 1.9)} ${n(bot)}H${n(xr)}`, { n: 'frame', role: S }),
        line(`M${n(fx)} ${n(top)}H${n(xr - c)}A${n(c)} ${n(c)} 0 0 1 ${n(xr)} ${n(top + c)}V${n(bot)}`, { n: 'basket', role: P, only: 'outline' }),
        shell(g.rr(fx, top, xr - fx, bot - top, [0, c, 0, 0]), { n: 'basket', role: P, only: 'fill' }),
        solid(g.circ(8.4, 19.35, 1.8), { n: 'w1', role: D }),
        solid(g.circ(18, 19.35, 1.8), { n: 'w2', role: D })
      ];
    },
    fx: { t: 'keys', on: 'all', x: [1, -0.4] }
  },
  'shopping-bag': {
    anchor: 'base',
    label: '购物袋', key: 'portrait',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：袋身；辅助：提手',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      const { h } = g, by = 8;
      return [line(arch(8 + h, 16 - h, 2 + h, by + h), { n: 'handle', role: S }), shell(g.box(4, by, 16, 14, 4), { n: 'bag', role: P })];
    },
    fx: { t: 'wiggle', on: 'all', o: [12, 2], deg: 7, hz: 2.4 }
  },
  gift: {
    label: '礼物', key: 'square',
    ends: 'out',
    light: ['ribbon', 'bow'], // the bow is the ribbon tied: one tone with it
    plan: '主体：盒身和盒盖；辅助：蝴蝶结（立在盒盖上的两个半圆环）；细节：丝带（只在盒身上，盒盖保持完整，减少小格子）。蝴蝶结从两个圆环改为两个半圆后变轻，占两成',
    weights: { [P]: 0.69, [S]: 0.19, [D]: 0.12 },
    draw(g, ctx) {
      // The bow is two half circles standing on the lid's top edge, meeting at its centre, so the
      // loops touch only there. The lid grows with the stroke so its inside stays open at every weight.
      const { h } = g, r = 3, lidY = 6, lidH = 6 + (g.s - 2) * 1.4, by = lidY + lidH, L = lidY + h, fill = ctx?.variant === 'fill';
      return [
        line(cup(4 + h, by - h, 20 - h, 21 - h, 3.5 - h), { n: 'box', role: P, only: 'outline' }),
        shell(g.box(4, by + 2, 16, 21 - by - 2, [1, 1, 3.5, 3.5]), { n: 'box', role: P, only: 'fill' }),
        line(g.seg(12, fill ? by + 2 : by, 12, 21 - h), { n: 'ribbon', role: D, on: 'box' }),
        shell(g.box(3, lidY, 18, lidH, 2.25), { n: 'lid', role: P }),
        line(`M${n(12 - 2 * r)} ${n(L)}A${n(r)} ${n(r)} 0 0 1 12 ${n(L)}A${n(r)} ${n(r)} 0 0 1 ${n(12 + 2 * r)} ${n(L)}`, { n: 'bow', role: S })
      ];
    },
    fx: { t: 'keys', on: ['lid', 'bow'], o: [12, 9.75], y: [-1.3, -1], r: [-5, 3] }
  },
  'map-pin': {
    nudge: [0, 0.45],
    label: '位置', key: 'portrait',
    plan: '主体：定位针；细节：中心圆环',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g) { return [shell(pin(g), { n: 'pin', role: P }), shell(g.ring(12, 10.5, 3.3), { n: 'hole', role: D, on: 'pin' })]; },
    fx: { t: 'bounce', on: 'all', o: [12, 22], amp: 1 }
  },
  smartphone: {
    label: '手机', key: 'portrait', fit: 'y',
    plan: '主体：机身；细节：顶部听筒条',
    weights: { [P]: 0.9, [D]: 0.1 },
    draw(g) {
      const y = 2 + g.s + 2 + g.h;
      return [
        shell(g.box(5, 2, 14, 20, 4), { n: 'phone', role: P }),
        line(g.seg(10.2, y, 13.8, y), { n: 'island', role: D, on: 'phone' }),
        line(g.span(2, 8.25, 2, 15.75), { n: 'v1', role: S, ghost: true }),
        line(g.span(22, 8.25, 22, 15.75), { n: 'v2', role: S, ghost: true })
      ];
    },
    fx: [{ t: 'shake', on: ['phone', 'island'], x: 0.7, ms: 520 }, { t: 'keys', on: ['v1', 'v2'], ghost: true, a: [1, 1, 1], ms: 420 }]
  },
  'message-square': {
    label: '消息', key: 'landscape',
    plan: '主体：对话框（左下一个小圆角表示说话）；细节：三个点',
    weights: { [P]: 0.86, [D]: 0.14 },
    draw(g) {
      return [
        shell(g.box(2, 4, 20, 16, [4.5, 4.5, 4.5, 1]), { n: 'bubble', role: P }),
        ...[-1, 0, 1].map((k, i) => solid(g.dot(12 + k * (4.75 - (g.s - 1.75) * 0.2), 12, 1 - (g.s - 1.75) * 0.35), { n: `d${i}`, role: D, on: 'bubble', vc: i }))
      ];
    },
    fx: { t: 'variable', on: ['d0', 'd1', 'd2'], mode: 'iterative' }
  },
  flag: {
    anchor: 'base',
    label: '标记', key: 'square',
    plan: '主体：旗面（燕尾缺口）；辅助：旗杆（一条线，占一成）',
    weights: { [P]: 0.89, [S]: 0.11 },
    draw(g) { return [line(g.span(5, 3, 5, 21), { n: 'pole', role: S }), shell(flagCloth(g), { n: 'cloth', role: P })]; },
    fx: { t: 'keys', on: ['cloth'], o: [5, 9], sx: [0.84, 1.05, 0.96] },
    allow: { keyline: '旗杆立在左侧 5 处，旗面向右展开' }
  },
  globe: {
    label: '地球', key: 'circle',
    plan: '主体：球面圆；辅助：经线（东西两条半椭圆，说明是球）；细节：赤道',
    weights: { [P]: 0.44, [S]: 0.38, [D]: 0.18 },
    // in line-duo the meridian that comes round from behind is light like the other two
    light: ['west', 'east', 'equator', 'back'],
    draw(g, ctx) {
      // In the fill the meridians and the equator are holes drawn on the sphere: all stop one
      // stroke short of its edge (a meridian run out through the poles would cross the edge at a
      // shallow angle and leave thin wedges). The meridians narrow with it, a little less than in
      // proportion, so the ink inside them keeps round ends.
      // The two meridians are half ellipses at longitudes ∓GLOBE_LON, their width W; a third waits
      // behind the western rim (hidden at rest) and comes round when the globe turns (§5).
      const { h, s } = g, R = ctx?.variant === 'fill' ? 10 - 1.5 * s : 10 - h, W = 4.6 * Math.sqrt(R / (10 - h));
      const half = (lon) => {
        const w = n(Math.abs(W * Math.sin(lon * DEG) / Math.sin(GLOBE_LON * DEG)));
        return `M12 ${n(12 - R)}A${w} ${n(R)} 0 0 ${lon > 0 ? 1 : 0} 12 ${n(12 + R)}`;
      };
      return [
        shell(g.ring(12, 12, 10), { n: 'ring', role: P }),
        line(half(-GLOBE_LON), { n: 'west', role: S, on: 'ring', part: 'meridian' }),
        line(half(GLOBE_LON), { n: 'east', role: S, on: 'ring', part: 'meridian' }),
        line(g.seg(2 + h, 12, 22 - h, 12), { n: 'equator', role: D, on: 'ring', ends: 'in' }),
        line(half(-3 * GLOBE_LON), { n: 'back', role: S, on: 'ring', part: 'meridian', ghost: true })
      ];
    },
    // The globe turns by the gap between two meridians, so each cycle ends as it began. A meridian
    // fades as it reaches the rim; in the fill sooner, while its hole still keeps a rim.
    fx: { t: 'turn', on: ['west', 'east', 'back'], at: [-GLOBE_LON, GLOBE_LON, -3 * GLOBE_LON], step: 2 * GLOBE_LON, ms: 900, o: [12, 12], edge: [66, 90], fill: { edge: [38, 54] } }
  },
  'chart-bar': {
    anchor: 'base',
    label: '统计', key: 'square',
    plan: '主体：三根柱（直线端点：柱顶表示数值，要平）；辅助：横轴',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      const { h } = g, base = 21 - h, foot = base - h - 2;
      return [
        line(g.span(3, base, 21, base), { n: 'axis', role: S }),
        ...[[7, 11], [12, 3], [17, 8]].map(([x, y], i) => line(g.seg(x, foot, x, y), { n: `b${i}`, role: P, cap: 'butt', part: 'bars' }))
      ];
    },
    light: ['b0', 'b1', 'b2'],
    fx: { t: 'keys', on: ['b0', 'b1', 'b2'], by: true, o: [12, 18.5], sy: [0.15, 1.06], stagger: 70 }
  },
  list: {
    label: '列表', key: 'square',
    plan: '主体：三行线；细节：行首圆点（实心）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) {
      // the text family's columns: markers centred in 3..9, lines from 11 (list-ordered, list-checks)
      const ys = [5, 12, 19];
      return [...ys.map((y, i) => solid(g.dot(5, y, 1.1), { n: `p${i}`, role: D })), ...ys.map((y, i) => line(g.span(11, y, 21, y), { n: `l${i}`, role: P }))];
    },
    fx: { t: 'draw', on: ['l0', 'l1', 'l2'] }
  },
  sliders: {
    label: '调节', key: 'square',
    plan: '主体：两个滑钮；辅助：两条滑轨（被滑钮切开）',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) {
      return [
        line(g.span(3, 7, 21, 7), { n: 't1', role: S }),
        line(g.span(3, 17, 21, 17), { n: 't2', role: S }),
        shell(g.ring(16, 7, 3.75), { n: 'k1', role: P, occ: true }),
        shell(g.ring(8, 17, 3.75), { n: 'k2', role: P, occ: true })
      ];
    },
    fx: [{ t: 'keys', on: ['k1'], x: [-7.7, -7.7, 0] }, { t: 'keys', on: ['k2'], x: [7.7, 7.7, 0] }]
  },
  copy: {
    label: '复制', key: 'square',
    plan: '主体：前面一张；辅助：后面一张（被挡住）',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g, ctx) {
      // In the fill only an L of the back sheet shows past the front one's clear band; the two
      // corners where it ends are no rounder than the strip is wide, so no thin tip is left.
      const c = 3.25, e = ctx?.variant === 'fill' ? Math.min(c, 5 - g.g) : c;
      return [shell(g.box(3, 3, 13, 13, [c, e, c, e]), { n: 'back', role: S }), shell(g.box(8, 8, 13, 13, c), { n: 'front', role: P, occ: true })];
    },
    fx: [{ t: 'keys', on: ['front'], x: [1], y: [1] }, { t: 'keys', on: ['back'], x: [-0.9], y: [-0.9] }]
  },
  power: {
    label: '电源', key: 'circle',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：开口的圆环；辅助：竖线',
    weights: { [P]: 0.83, [S]: 0.17 },
    draw(g) { const { h } = g; return [line(g.arc(12, 12, 10 - h, -55, 235), { n: 'ring', role: P }), line(g.span(12, 2, 12, 11.4), { n: 'stem', role: S })]; },
    area: (g) => [{ n: 'ring', d: g.circ(12, 12, 10 - g.h) }],
    fx: { t: 'draw', on: ['ring', 'stem'] }
  },
  inbox: {
    label: '收件箱', key: 'landscape',
    ends: 'out', // the slot is the tray's front edge: in the fill it cuts the tray in two
    plan: '主体：托盘外框；细节：凹槽线',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(2, 4, 20, 16, 4), { n: 'tray', role: P }),
        line(g.pl([[2 + h, 12], [7, 12], [9, 15], [15, 15], [17, 12], [22 - h, 12]]), { n: 'slot', role: D, on: 'tray' })
      ];
    },
    fx: { t: 'keys', on: ['slot'], y: [1.3], ms: 460 }
  }
};

// Every drawn icon, in the order of the catalogue (catalog.mjs): the first 55 here, the rest in
// one file per category under set/. An icon in two places is an error.
const drawn = { ...CORE };
for (const set of SETS) for (const [k, v] of Object.entries(set)) {
  if (drawn[k]) throw new Error(`${k} is drawn twice`);
  drawn[k] = v;
}
export const ICONS = Object.fromEntries([
  ...CATALOG.filter((e) => drawn[e.name]).map((e) => [e.name, drawn[e.name]]),
  ...Object.entries(drawn).filter(([k]) => !CATALOG.some((e) => e.name === k))
]);
for (const [k, v] of Object.entries(ICONS)) v.name = k;
const named = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { ...v, name: k }]));

// Variants made by rule (kit.mjs): slashes, badges, enclosures. Their weights follow the base.

// calendar-plus, fill: the dot below the middle one lies in the notch and the middle one
// touches it, so the three that stay (an L) rise 2.5 into the room left by the header line,
// which the fill does not draw; the dots then clear the notch about as far as they clear each other.
const calendarDots = (L) => L.filter((l) => l.n !== 'd4').map((l) => (/^d[013]$/.test(l.n) ? { ...l, tf: 'translate(0 -2.5)' } : l));

// file-x, fill: the second line would come within a stroke of the notch (at heavy weights there
// is no room for it above the notch either), so the fill keeps the first line only.
const firstLine = (L) => L.filter((l) => l.n !== 'l2');

// bell-circle, fill: the bell is knocked out of the disc, and drawn smaller its clapper comes
// within a stroke of the rim; in the fill the clapper drops so one stroke of ink stays between.
function clapperClear(v, k) {
  return {
    ...v,
    draw(g, ctx) {
      const L = v.draw(g, ctx);
      if (ctx?.variant !== 'fill') return L;
      const dy = g.s / k - 2; // in the bell's own units, where the gap is 2
      return L.map((l) => (l.n === 'clapper' ? { ...l, tf: `${l.tf} translate(0 ${n(dy)})` } : l));
    }
  };
}

export const VARIANTS = named({
  // Turning something off: the slash draws on and the object itself reacts (enter is the
  // object's part alone, played while a switch draws the slash). Switching back on plays the
  // object's own motion once the slash is gone.
  // The rim's right end beyond the slash would be a stub cut off by the band: in fill it stops inside the band.
  'bell-off': off({ ...offFill(slash(ICONS.bell, { label: '通知关闭' }), { trim: { rim: [0, { k: 1, c: 1 }] } }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'bell', { t: 'keys', on: ['body', 'rim', 'clapper'], o: [12, 3], r: [7, -3], ms: 300 }),
  'eye-off': off({ ...slash(ICONS.eye, { label: '隐藏' }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'eye', { t: 'keys', on: ['eye', 'iris'], o: [12, 12], sy: [0.2], ms: 260 }),
  'mic-off': off({ ...slash(ICONS.mic, { label: '静音' }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'mic', { t: 'keys', on: ['head', 'stand', 'foot'], o: [12, 22], s: [0.88], ms: 240 }),
  'wifi-off': off({ ...slash(ICONS.wifi, { label: '网络断开' }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'wifi', { t: 'keys', on: [['a3'], ['a2'], ['a1'], ['dot']], by: true, stagger: 70, a: [0.2], ms: 220 }),
  'speaker-off': off({ ...slash(ICONS.speaker, { label: '静音' }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'volume', { t: 'keys', on: ['speaker'], o: [12, 12], s: [0.86], ms: 240 }),
  'folder-plus': { ...notched(badge(ICONS.folder, 'plus', { label: '新建文件夹' })), swap: 'folder', fx: { t: 'rotate', on: ['badge'], deg: 90, oBadge: true } },
  'user-check': { ...notched(badge(ICONS.user, 'check', { label: '已认证' })), fx: { t: 'draw', on: ['badge'] } },
  'calendar-plus': { ...notched(badge(ICONS.calendar, 'plus', { label: '添加日程', drop: ['d2', 'd5'] }), calendarDots), fx: { t: 'rotate', on: ['badge'], deg: 90, oBadge: true } },
  'file-x': { ...notched(badge(ICONS['file-text'], 'x', { label: '删除文档', drop: ['l3'] }), firstLine), fx: { t: 'rotate', on: ['badge'], deg: 90, oBadge: true } },
  'heart-circle': { ...enclose(ICONS.heart, 'circle', { label: '喜欢（圆形）', k: 0.54 }), fx: { t: 'beat', on: ['heart'], o: [12, 12.4] } },
  'play-circle': { ...enclose(ICONS.play, 'circle', { label: '播放（圆形）', k: 0.5 }), fx: { t: 'keys', on: ['tri'], x: [0.9], ms: 420 } },
  'star-square': { ...enclose(ICONS.star, 'square', { label: '收藏（方形）', k: 0.56 }), swap: { icon: 'star-square', variant: 'fill', act: true }, fx: [{ t: 'rotate', on: ['star'], deg: 72, o: [12, 12.14] }, { t: 'keys', on: ['star'], o: [12, 12.14], s: [0.84, 1.08] }], enter: { t: 'from', on: ['star'], o: [12, 12.14], s: 0.55, r: -72, hz: 1.9, z: 0.5 }, allow: { clear: '框内图标整体缩小，粗字重下星角离框较近' } },
  'bell-circle': { ...clapperClear(enclose(ICONS.bell, 'circle', { label: '通知（圆形）', k: 0.54 }), 0.54), fx: { t: 'wiggle', on: ['body', 'rim', 'clapper'], o: [12, 6.9], deg: 10 }, allow: { clear: '框内图标整体缩小，铃锤的间隙随之变小' } }
});

// The variants ship with the library like every other icon.
Object.assign(ICONS, VARIANTS);
export const ALL = ICONS;
export { geo };
