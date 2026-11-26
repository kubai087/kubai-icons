// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// communication: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: mail-open mails message-circle messages messages-square bell-ring phone phone-call video-call headset megaphone at-sign hash reply rss voicemail dial-pad contact-book podcast radio-tower
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { keyBox, gapOf, circ, slash } from '../kit.mjs';
import { off, offFill, notched } from '../variants.mjs';
import { fitEnds } from '../ends.mjs';
import INTERFACE from './interface.mjs';

// Corner marks, drawn about their centre (x, y): kit.mjs's badge marks (plus, minus, check, x in
// an 8 box) and a few more for objects that carry a small sign (a dot, a magnifier, an
// exclamation mark). REACH is how far the ink reaches from the centre; the round notch cut
// round a mark is that plus 0.4 and the clear band, as in kit.mjs's badge.
const M = 4;
export const MARKS = {
  plus: (g, x, y) => [line(`${g.seg(x, y - M + g.h, x, y + M - g.h)}${g.seg(x - M + g.h, y, x + M - g.h, y)}`)],
  minus: (g, x, y) => [line(g.seg(x - M + g.h, y, x + M - g.h, y))],
  check: (g, x, y) => [line(g.pl([[x - M + g.h, y + 0.15], [x - 1.05, y + 2.6 - g.h / 2], [x + M - g.h, y - 2.4 + g.h / 2]]))],
  x: (g, x, y) => { const k = M * 0.78 - g.h * 0.7; return [line(`${g.seg(x - k, y - k, x + k, y + k)}${g.seg(x + k, y - k, x - k, y + k)}`)]; },
  // a notification dot, a little larger than a text dot
  dot: (g, x, y) => [solid(g.circ(x, y, n(2.5 + (g.s - 2) * 0.4)))],
  // a magnifier: the lens up and left of the centre, the handle to the bottom right
  search: (g, x, y) => { const c = x - 0.75, e = 3.25 * Math.SQRT1_2; return [shell(g.ring(c, y - 0.75, 3.25)), line(g.seg(c + e - g.h * 0.3, y - 0.75 + e - g.h * 0.3, x + 2.5, y + 2.5))]; },
  // an exclamation mark: a bar and a dot below it
  alert: (g, x, y) => [line(g.span(x, y - M, x, y)), solid(g.dot(x, y + 3, 0.85))],
  // a padlock: the body below the centre, the shackle above
  lock: (g, x, y) => [shell(g.box(x - 3, y - 1, 6, 5, 1.25)), line(arch(x - 2, x + 2, y - 4 + g.h, y - 1 + g.h))]
};
const REACH = { plus: () => M, minus: () => M, check: () => M, x: () => M, alert: () => M, dot: (g) => 2.5 + (g.s - 2) * 0.4, search: (g) => 2.5 * Math.SQRT2 + g.h, lock: () => 5 };
/**
 * The icon with a mark in a round notch: kit.mjs's badge, with more marks and any place (at;
 * the bottom-right corner of the key shape by default). The first layer of the mark is named
 * badge and carries the notch, so notched() (variants.mjs) trims the fill round it.
 */
export function corner(icon, mark, { label, at, drop = [] } = {}) {
  // a mark is named (MARKS) or given as { draw(g, x, y), reach(g), at }
  const m = typeof mark === 'string' ? { draw: MARKS[mark], reach: REACH[mark] } : mark;
  return {
    ...icon, label: label ?? icon.label, kind: 'badge', weights: null,
    draw(g, ctx) {
      const [, , x1, y1] = keyBox(icon.key), [x, y] = at ?? m.at ?? [x1 - M, y1 - M];
      const own = icon.draw(g, ctx).filter((l) => !drop.includes(l.n));
      const [first, ...rest] = m.draw(g, x, y);
      return [
        ...own,
        { ...first, n: 'badge', role: P, part: 'badge', cutD: circ(x, y, n(m.reach(g) + 0.4 + gapOf(g.s))), at: [x, y] },
        ...rest.map((l, i) => ({ ...l, n: `badge${i + 1}`, role: P, part: 'badge' }))
      ];
    }
  };
}
/**
 * notched() (variants.mjs) for a corner mark, with the lines that sit on a clipped shell (a
 * flap, a text line) fitted to the whole shell before the clip (ends.mjs), so their ends do not
 * follow the notch's edge.
 */
export function notch(v, fit) {
  const w = notched(v, fit);
  return {
    ...w,
    draw(g, ctx) {
      const L = w.draw(g, ctx);
      if (ctx?.variant !== 'fill') return L;
      const raw = Object.fromEntries(v.draw(g, ctx).filter((l) => l.n).map((l) => [l.n, l]));
      return L.map((l) => {
        const e = l.ends ?? (l.k === 'line' ? v.ends : null);
        if (!e || e === 'keep' || l.k !== 'line' || !raw[l.on]) return l;
        return { ...l, d: fitEnds(l.d, raw[l.on], g.s / (l.sc ?? 1), e), ends: 'keep', ...(e === 'out' ? { through: true } : {}) };
      });
    }
  };
}
// Motion of each mark: a plus or an x turns a quarter, a check is drawn, a minus is pulled in,
// a dot pops, a magnifier circles, an exclamation mark shakes, a padlock's shackle snaps shut.
export const MARK_FX = {
  plus: { t: 'rotate', on: ['badge'], deg: 90, oBadge: true },
  x: { t: 'rotate', on: ['badge'], deg: 90, oBadge: true },
  check: { t: 'draw', on: ['badge'] },
  minus: { t: 'keys', on: ['badge'], oBadge: true, sx: [0.2], ms: 260 },
  dot: { t: 'beat', on: ['badge'], oBadge: true, amp: 0.22 },
  search: { t: 'orbit', on: ['badge', 'badge1'], R: 0.9 },
  alert: { t: 'wiggle', on: ['badge', 'badge1'], oBadge: true, deg: 12, hz: 4 },
  lock: { t: 'keys', on: ['badge1'], y: [-1, 0.3], ms: 260 }
};

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

// Copies of icons.mjs's mail and message-square, the bases of their variants here.
// The flap: an arc from the middles of the two top corners, sagging by sag; also its centre and
// radius, so a fill variant can test how close it comes to a notch.
function mailFlap(g, sag = 6 - g.h * 0.6) {
  const { h } = g, c = 4 - h, k = 0.293 * c, x0 = 2 + h + k, x1 = 22 - h - k, y0 = 4 + h + k;
  const ch = x1 - x0, R = (ch * ch / 4 + sag * sag) / (2 * sag), cy = y0 + sag - R, a0 = (Math.asin((y0 - cy) / R) * 180) / Math.PI;
  return { d: g.arc(12, cy, R, a0, 180 - a0), cy, R, a0 };
}
const MAIL = {
  label: '邮件', key: 'landscape', ends: 'in',
  draw(g) { return [shell(g.box(2, 4, 20, 16, 4), { n: 'env', role: P }), line(mailFlap(g).d, { n: 'flap', role: D, on: 'env' })]; }
};
// Fill variant of a mail with a mark at the bottom right: the flap's hole would pass within a
// stroke of the notch (no flap shallow enough to clear it still reads as one), so it runs from
// the left shoulder and stops a stroke short of the notch.
function flapClear(L, g, { x, y, R }) {
  const need = R + g.s + g.h, f = mailFlap(g);
  const near = (a) => Math.hypot(12 + f.R * Math.cos((a * Math.PI) / 180) - x, f.cy + f.R * Math.sin((a * Math.PI) / 180) - y) < need;
  let a = 180 - f.a0;
  while (a > f.a0 && !near(a)) a -= 0.5;
  if (a <= f.a0) return L;
  const d = fitEnds(g.arc(12, f.cy, f.R, a + 0.5, 180 - f.a0), MAIL.draw(g)[0], g.s, 'in');
  return L.map((l) => (l.n === 'flap' ? { ...l, d, ends: 'keep' } : l));
}
const bubble = (g) => shell(g.box(2, 4, 20, 16, [4.5, 4.5, 4.5, 1]), { n: 'bubble', role: P });
const BUBBLE = { label: '消息', key: 'landscape', draw: (g) => [bubble(g)] };
const BUBBLE_ROUND = { label: '消息', key: 'circle', draw: (g) => [shell(roundBubble(g, 12, 12, 10), { n: 'bubble', role: P })] };
// A circle-key icon (circle-plus, circle-help) with its ring turned into the round bubble.
const inBubble = (icon) => (g, ctx) => icon.draw(g, ctx).map((l) => (l.n === 'ring' ? { ...l, d: roundBubble(g, 12, 12, 10) } : l));
const PHONE = { label: '电话', key: 'live', draw: (g) => [shell(handset(g), { n: 'handset', role: P })] };
// A short arrow in the free corner at the top right of the handset, tip at `tip`, coming from
// `from`; its head's two arms run along the grid, L long.
function cornerArrow(g, from, tip, L = 4.5) {
  const ux = Math.sign(tip[0] - from[0]), uy = Math.sign(tip[1] - from[1]);
  const head = ux && uy ? [[tip[0] - ux * L, tip[1]], tip, [tip[0], tip[1] - uy * L]] : ux ? [[tip[0] - ux * 3, tip[1] - 3], tip, [tip[0] - ux * 3, tip[1] + 3]] : [[tip[0] - 3, tip[1] - uy * 3], tip, [tip[0] + 3, tip[1] - uy * 3]];
  return g.seg(from[0], from[1], tip[0], tip[1]) + g.pl(head);
}
// A path with every point mapped by fx, fy and arc radii scaled by rk; flip turns arcs the
// other way (a mirror). Absolute M, L, H, V, C, A and Z only.
function mapPath(d, fx, fy, rk = 1, flip = false) {
  const t = d.match(/[MLHVCAZ]|-?\d*\.?\d+(?:e-?\d+)?/g), out = [];
  let c = '', i = 0;
  const x = () => n(fx(+t[i++])), y = () => n(fy(+t[i++])), v = () => +t[i++];
  while (i < t.length) {
    if (/[A-Z]/.test(t[i])) { c = t[i++]; out.push(c); if (c === 'Z') continue; }
    if (c === 'M' || c === 'L') out.push(`${x()} ${y()}`);
    else if (c === 'H') out.push(`${x()}`);
    else if (c === 'V') out.push(`${y()}`);
    else if (c === 'C') out.push(`${x()} ${y()} ${x()} ${y()} ${x()} ${y()}`);
    else if (c === 'A') { const [rx, ry, rot, large, sweep] = [v(), v(), v(), v(), v()]; out.push(`${n(rx * rk)} ${n(ry * rk)} ${rot} ${large} ${flip ? 1 - sweep : sweep} ${x()} ${y()}`); }
    if (c === 'M') c = 'L';
  }
  return out.join(' ').replace(/ ?([A-Z]) ?/g, '$1');
}
const mirrorPath = (d) => mapPath(d, (X) => 24 - X, (Y) => Y, 1, true);
/** A path drawn about (12, 12) scaled by k and moved to (x, y): a small copy of an icon's shape. */
export const xform = (d, k, x, y) => mapPath(d, (X) => x + (X - 12) * k, (Y) => y + (Y - 12) * k, k);
// An icon mirrored left to right, its cuts too: a slash variant drawn on the mirror of an object
// runs from top right to bottom left, across a handset that lies along the other diagonal.
const mirror = (icon) => ({
  ...icon,
  draw: (g, ctx) => icon.draw(g, ctx).map((l) => ({ ...l, d: mirrorPath(l.d), ...(l.cut ? { cut: { ...l.cut, d: mirrorPath(l.cut.d) } } : {}), ...(l.cutD ? { cutD: mirrorPath(l.cutD) } : {}) }))
});
const phoneWith = (label, plan, mark, fx) => ({
  label, key: 'live',
  plan: `主体：听筒（与电话相同）；辅助：右上角的${plan}（落在听筒弧线以内的空处）`,
  weights: { [P]: 0.8, [S]: 0.2 },
  draw: (g) => [shell(handset(g), { n: 'handset', role: P }), line(mark(g), { n: 'mark', role: S })],
  fx
});
// An open tray (inbox's tray without its top edge) from y0 down to the bottom, with inbox's slot.
function tray(g, y0 = 10, sy = 13) {
  const { h } = g, c = 3.75 - h;
  return [
    line(`M${n(2 + h)} ${y0}V${n(21 - h - c)}A${n(c)} ${n(c)} 0 0 0 ${n(2 + h + c)} ${n(21 - h)}H${n(22 - h - c)}A${n(c)} ${n(c)} 0 0 0 ${n(22 - h)} ${n(21 - h - c)}V${y0}`, { n: 'tray', role: S }),
    line(g.pl([[2 + h, sy], [7, sy], [9, sy + 3], [15, sy + 3], [17, sy], [22 - h, sy]]), { n: 'slot', role: S })
  ];
}
const trayArea = (g, y0 = 10) => [{ n: 'tray', d: g.rr(2 + g.h, y0, 20 - g.s, 21 - g.h - y0, [0, 0, 3.75 - g.h, 3.75 - g.h]) }];
const BELL = { label: '通知', key: 'square', draw: (g) => bellParts(g) };
// A mark at the bell's top right (where Lucide puts it), clear of the clapper.
const bellMark = (mark, label) => ({
  ...notch(corner(BELL, mark, { label, at: [18, 6] })),
  allow: { keyline: '角标在右上角伸出方框一点，铃身不缩小' },
  fx: [{ t: 'wiggle', on: ['body', 'rim', 'clapper'], o: [12, 3], deg: 6 }, MARK_FX[mark]]
});
const mailMark = (mark, label, o = {}) => ({ ...notch(corner(MAIL, mark, { label, ...o }), o.at ? undefined : flapClear), fx: MARK_FX[mark] });

const SET = {
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
  },
  'mail-plus': mailMark('plus', '写邮件'),
  'mail-minus': mailMark('minus', '移除邮件'),
  'mail-check': mailMark('check', '邮件已发送'),
  'mail-x': mailMark('x', '删除邮件'),
  'mail-search': mailMark('search', '搜索邮件'),
  'mail-warning': mailMark('alert', '邮件警告'),
  'mail-lock': mailMark('lock', '加密邮件'),
  'mail-unread': { ...mailMark('dot', '未读邮件', { at: [19.5, 5.5] }), allow: { keyline: '提示点压在右上角，伸出信封一点' } },
  'bell-plus': bellMark('plus', '添加提醒'),
  'bell-minus': bellMark('minus', '移除提醒'),
  'bell-check': bellMark('check', '已订阅通知'),
  'bell-dot': bellMark('dot', '新通知'),
  'message-square-lock': { ...notch(corner(BUBBLE, 'lock', { label: '加密消息' })), fx: MARK_FX.lock },
  'message-square-dot': { ...notch(corner(BUBBLE, 'dot', { label: '未读消息', at: [19.5, 5.5] })), fx: MARK_FX.dot, allow: { keyline: '提示点压在右上角，伸出对话框一点' } },
  'message-square-text': {
    label: '文字消息', key: 'landscape',
    ends: 'in',
    plan: '主体：对话框（与留言相同）；细节：两行字（上长下短）',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g, ctx) {
      // fill: the two lines spread so a stroke of ink stays between them
      const d = ctx?.variant === 'fill' ? Math.max(2, g.s) : 2;
      return [bubble(g), line(g.span(7, 12 - d, 17, 12 - d), { n: 'l1', role: D, on: 'bubble' }), line(g.span(7, 12 + d, 13, 12 + d), { n: 'l2', role: D, on: 'bubble' })];
    },
    fx: { t: 'draw', on: ['l1', 'l2'] }
  },
  'message-square-plus': {
    label: '新建消息', key: 'landscape',
    plan: '主体：加号（说明动作，墨少但层级最高）；辅助：对话框（与留言相同）',
    weights: { [P]: 0.2, [S]: 0.8 },
    draw(g) {
      return [{ ...bubble(g), role: S }, line(g.span(12, 8.5, 12, 15.5) + g.span(8.5, 12, 15.5, 12), { n: 'plus', role: P, on: 'bubble' })];
    },
    fx: { t: 'rotate', on: ['plus'], deg: 90, o: [12, 12] }
  },
  'message-square-x': {
    label: '删除消息', key: 'landscape',
    plan: '主体：叉号（说明动作）；辅助：对话框（与留言相同）',
    weights: { [P]: 0.2, [S]: 0.8 },
    draw(g) {
      const k = 2.6 - (g.s - 2) * 0.3;
      return [{ ...bubble(g), role: S }, line(g.seg(12 - k, 12 - k, 12 + k, 12 + k) + g.seg(12 + k, 12 - k, 12 - k, 12 + k), { n: 'x', role: P, on: 'bubble' })];
    },
    fx: { t: 'rotate', on: ['x'], deg: 90, o: [12, 12] }
  },
  'phone-incoming': phoneWith('呼入电话', '指向左下的箭头（朝向听筒）', (g) => cornerArrow(g, [20, 4], [14, 10]), [{ t: 'keys', on: ['mark'], x: [-1, 0.2], y: [1, -0.2] }, { t: 'wiggle', on: ['handset'], o: [12, 12], deg: 5, hz: 6, delay: 120 }]),
  'phone-outgoing': phoneWith('呼出电话', '指向右上的箭头（离开听筒）', (g) => cornerArrow(g, [14, 10], [20, 4]), { t: 'keys', on: ['mark'], x: [1, -0.2], y: [-1, 0.2] }),
  'phone-missed': phoneWith('未接来电', '叉号', (g) => g.seg(15, 4, 20, 9) + g.seg(20, 4, 15, 9), { t: 'rotate', on: ['mark'], deg: 90, o: [17.5, 6.5] }),
  'phone-forwarded': phoneWith('呼叫转移', '向右的箭头', (g) => cornerArrow(g, [13.5, 6], [20.5, 6]), { t: 'keys', on: ['mark'], x: [1.3, -0.2] }),
  'phone-off': off({ ...mirror(slash(mirror(PHONE), { label: '电话关闭' })), label: '电话关闭', allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'phone', { t: 'keys', on: ['handset'], o: [12, 12], r: [-10], ms: 260 }),
  'phone-hang-up': {
    label: '挂断', key: 'landscape', fit: 'x',
    plan: '主体：听筒（与电话相同的画法，转成横放、弧线朝上，两端的听筒和话筒朝下）',
    weights: { [P]: 1 },
    draw(g) { return [shell(handset(g, { O: [12, 18.5], Ro: 11.5, th: 4.5, tp: 7.5, da: 32, a0: 210, a1: 330 }), { n: 'handset', role: P })]; },
    // 挂断: the handset is put down and settles
    fx: { t: 'keys', on: 'all', y: [1.5, -0.2], ms: 300 }
  },
  'message-square-off': off({ ...slash(BUBBLE, { label: '关闭消息' }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'message-square', { t: 'keys', on: ['bubble'], o: [12, 12], s: [0.9], ms: 240 }),
  'message-circle-off': off({ ...slash(BUBBLE_ROUND, { label: '关闭聊天' }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'message-circle', { t: 'keys', on: ['bubble'], o: [12, 12], s: [0.9], ms: 240 }),
  'message-square-warning': {
    label: '消息警告', key: 'landscape',
    plan: '主体：感叹号（竖和点，说明状态）；辅助：对话框（与留言相同）',
    weights: { [P]: 0.11, [S]: 0.89 },
    allow: { primary: '对话框里的感叹号只能这么大，约占一成；层级仍是最高' },
    draw(g) {
      return [{ ...bubble(g), role: S }, line(g.span(12, 7.75, 12, 11.75), { n: 'bar', role: P, on: 'bubble' }), solid(g.dot(12, 14.75, 0.85 - (g.s - 2) * 0.3), { n: 'dot', role: P, on: 'bubble' })];
    },
    fx: { t: 'wiggle', on: ['bar', 'dot'], o: [12, 16], deg: 12, hz: 3 }
  },
  'message-circle-plus': {
    label: '发起聊天', key: 'circle',
    plan: '主体：加号（与添加相同）；辅助：圆形对话框（与消息相同）',
    weights: { [P]: 0.27, [S]: 0.73 },
    draw(g) { const k = 5.1 - 0.5 * (g.s - 1.75); return [shell(roundBubble(g, 12, 12, 10), { n: 'bubble', role: S }), line(g.seg(12, 12 - k, 12, 12 + k) + g.seg(12 - k, 12, 12 + k, 12), { n: 'plus', role: P, on: 'bubble' })]; },
    fx: { t: 'rotate', on: ['plus'], deg: 90, o: [12, 12] }
  },
  'message-circle-question': {
    ...INTERFACE['circle-help'],
    label: '咨询',
    plan: '主体：问号（与帮助相同）；辅助：圆形对话框（与消息相同）',
    draw: inBubble(INTERFACE['circle-help'])
  },
  'message-circle-heart': {
    label: '暖心消息', key: 'circle',
    plan: '主体：心形（说明是什么样的消息）；辅助：圆形对话框（与消息相同）',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g) { return [shell(roundBubble(g, 12, 12, 10), { n: 'bubble', role: S }), shell(heart(g, { w: 10, top: 7.5, tip: 17, R: 3 }), { n: 'heart', role: P, on: 'bubble' })]; },
    fx: { t: 'beat', on: ['heart'], o: [12, 12.4] }
  },
  'message-circle-reply': {
    label: '回复消息', key: 'circle',
    light: ['reply'],
    plan: '主体：回复箭头（与回复同一画法，缩小放进对话框）；辅助：圆形对话框（与消息相同）',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g, ctx) {
      // the arrow shrinks a little with the weight about its middle, so it keeps clear of the
      // bubble; in the fill the head is knocked out whole (as arrows.mjs's solidHead), so no thin
      // wedge of ink is left between its legs and the shaft
      const k = 1 - 0.3 * (g.s - 2), Pt = ([x, y]) => [11.5 + (x - 11.5) * k, 11.5 + (y - 11.5) * k], r = 2.5 * k;
      const t = Pt([7, 11]), a = Pt([10, 8]), b = Pt([10, 14]), e = Pt([13.5, 11]), f = Pt([16, 13.5]), z = Pt([16, 15]);
      const arrow = `M${g.pt(...t)}H${n(e[0])}A${n(r)} ${n(r)} 0 0 1 ${g.pt(...f)}V${n(z[1])}` + g.pl([a, t, b]);
      return [
        shell(roundBubble(g, 12, 12, 10), { n: 'bubble', role: S }),
        line(arrow, { n: 'reply', role: P, on: 'bubble' }),
        ...(ctx?.variant === 'fill' ? [solid(g.pl([t, a, [a[0] + g.h, a[1]], [b[0] + g.h, b[1]], b], true), { n: 'head', role: P, on: 'bubble' })] : [])
      ];
    },
    fx: { t: 'keys', on: ['reply', 'head'], x: [-1, 0.2] }
  },
  'send-horizontal': {
    label: '发送消息', key: 'landscape', fit: 'x',
    ends: 'in',
    nudge: [0.5, 0],
    plan: '主体：横放的纸飞机（与发送同一种外形，机头朝右）；细节：中间的折线，只画到机身一半多一点。机尾宽、机头尖，整体右移 0.5',
    weights: { [P]: 0.85, [D]: 0.15 },
    draw(g) {
      const { h } = g, T = [24.4 - h, 12], A = [2, 2.65 + h], B = [2, 21.35 - h], Cc = [7, 12];
      return [
        shell(g.polygon([A, T, B, Cc], [1.2, 1.2, 1.2, 0.5]), { n: 'plane', role: P }),
        line(g.seg(Cc[0], 12, Cc[0] + (T[0] - Cc[0]) * 0.55, 12), { n: 'fold', role: D, on: 'plane' })
      ];
    },
    // 发送: the plane flies off to the right, fading, and glides back in from the left
    fx: { t: 'keys', on: 'all', x: [4, -4], a: [0, 0], s: [0.7, 0.7] }
  },
  mailbox: {
    anchor: 'base',
    label: '信箱', key: 'landscape', fit: 'x',
    plan: '主体：箱身（左上是大圆角，像信箱的拱形门）；辅助：下面的立柱；细节：门的边线（竖线，把箱身分成门和箱体）和右侧的小旗（立杆从箱底伸起，旗向左）。立在立柱上，以底边定位',
    weights: { [P]: 0.62, [S]: 0.08, [D]: 0.3 },
    draw(g, ctx) {
      // fill: at heavy weights the door moves left, so a stroke of ink stays between it and the flag
      const { h } = g, dx = ctx?.variant === 'fill' ? Math.min(11, 15 - 2 * g.s) : 11;
      return [
        line(g.seg(7, 17, 7, 22 - h), { n: 'post', role: S }),
        shell(g.box(2, 5, 20, 12, [6, 3, 3, 3]), { n: 'box', role: P }),
        line(g.seg(dx, 5 + h, dx, 17 - h), { n: 'door', role: D, on: 'box', ends: 'out' }),
        line(g.pl([[17, 17 - h], [17, 10], [15, 10]]), { n: 'flag', role: D, on: 'box', ends: 'in' })
      ];
    },
    // 有信: the flag is raised
    fx: { t: 'keys', on: ['flag'], o: [17, 15], r: [35, 0], ms: 360 }
  },
  'inbox-arrow-down': {
    anchor: 'base',
    label: '收取', key: 'square',
    plan: '主体：向下的箭头（落进托盘）；辅助：开口的托盘和凹槽（与收件箱相同）',
    weights: { [P]: 0.26, [S]: 0.74 },
    light: ['arrow'],
    draw(g) { return [...tray(g), line(g.seg(12, 2 + g.h, 12, 10) + g.pl([[8, 6], [12, 10], [16, 6]]), { n: 'arrow', role: P })]; },
    area: (g) => trayArea(g),
    fx: { t: 'keys', on: ['arrow'], y: [1.3, -0.3] },
    allow: { keyline: '托盘宽 20，与收件箱相同' }
  },
  'inbox-arrow-up': {
    anchor: 'base',
    label: '发出', key: 'square',
    plan: '主体：向上的箭头（从托盘里出来）；辅助：开口的托盘和凹槽（与收件箱相同）',
    weights: { [P]: 0.26, [S]: 0.74 },
    light: ['arrow'],
    draw(g) { return [...tray(g), line(g.seg(12, 11, 12, 2 + g.h) + g.pl([[8, 2 + g.h + 4], [12, 2 + g.h], [16, 2 + g.h + 4]]), { n: 'arrow', role: P })]; },
    area: (g) => trayArea(g),
    fx: { t: 'keys', on: ['arrow'], y: [-1.3, 0.3] },
    allow: { keyline: '托盘宽 20，与收件箱相同' }
  },
  speech: {
    label: '说话', key: 'landscape', fit: 'x',
    plan: '主体：人（头和肩，与多人前面的人相同的比例）；辅助：右侧两道声波（以头为圆心）',
    weights: { [P]: 0.67, [S]: 0.33 },
    light: ['w1', 'w2'],
    draw(g) {
      const cy = 9;
      return [
        shell(g.ring(8.5, cy, 4.25), { n: 'head', role: P }),
        shell(g.box(2, 15, 13, 6, [5, 5, 2, 2]), { n: 'body', role: P }),
        line(g.arc(8.5, cy, 7.75, -45, 25), { n: 'w1', role: S, vc: 0 }),
        line(g.arc(8.5, cy, 12.5, -28, 18), { n: 'w2', role: S, vc: 1 })
      ];
    },
    fx: { t: 'variable', on: ['w1', 'w2'], mode: 'cumulative' }
  },
  sticker: {
    label: '贴纸', key: 'square',
    plan: '主体：方形贴纸（右上角揭起，切成斜角）；辅助：揭起的角（折线）；细节：笑脸（两点和一道弧）',
    weights: { [P]: 0.7, [S]: 0.12, [D]: 0.18 },
    draw(g, ctx) {
      // the fold is the outline's only: filled, the cut corner alone shows the sticker lifting
      // fill: the eyes rise so a stroke of ink stays between them and the mouth's ends
      const { h, s } = g, k = 0.9 - (s - 2) * 0.35, ey = ctx?.variant === 'fill' ? Math.min(11, 14.97 - 1.5 * s - g.dr * k) : 11;
      return [
        shell(g.polygon([[3 + h, 3 + h], [16, 3 + h], [21 - h, 8], [21 - h, 21 - h], [3 + h, 21 - h]], [4 - h, 0.6, 0.6, 4 - h, 4 - h]), { n: 'sheet', role: P }),
        line(`M16 ${n(3 + h)}V6A2 2 0 0 0 18 8H${n(21 - h)}`, { n: 'fold', role: S, only: 'outline' }),
        solid(g.dot(8.5, ey, k) + g.dot(13.5, ey, k), { n: 'eyes', role: D, on: 'sheet' }),
        line(g.arc(11, 12.5, 3.5, 45, 135), { n: 'mouth', role: D, on: 'sheet' })
      ];
    },
    // 揭起: the corner lifts and is pressed back
    fx: { t: 'keys', on: ['fold'], o: [21, 3], s: [1.35, 1], ms: 320 }
  },
  vote: {
    anchor: 'base',
    label: '投票', key: 'square',
    plan: '主体：对勾（说明投了票）；辅助：选票（上圆下方，立在底线上）和底线',
    weights: { [P]: 0.17, [S]: 0.83 },
    draw(g) {
      const k = 1 - 0.4 * (g.s - 2), Pt = ([x, y]) => [12 + (x - 12) * k, 12 + (y - 12) * k];
      return [
        shell(g.box(4, 3, 16, 18, [4, 4, 0, 0]), { n: 'card', role: S }),
        line(g.span(3, 20, 21, 20), { n: 'base', role: S }),
        line(g.pl([[8.75, 12], [11, 14.25], [15.25, 10]].map(Pt)), { n: 'check', role: P, on: 'card' })
      ];
    },
    light: ['check'],
    fx: { t: 'draw', on: ['check'] }
  },
  'satellite-dish': {
    label: '卫星天线', key: 'live',
    plan: '主体：碗形天线（半圆，朝右上）；辅助：馈源杆（从碗心伸出）和右上两道信号弧',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g, C = [9, 15], r = 7 - h, u = [Math.SQRT1_2, -Math.SQRT1_2], v = [Math.SQRT1_2, Math.SQRT1_2];
      const e1 = [C[0] - v[0] * r, C[1] - v[1] * r], e2 = [C[0] + v[0] * r, C[1] + v[1] * r];
      return [
        shell(`M${g.pt(...e1)}A${n(r)} ${n(r)} 0 0 0 ${g.pt(...e2)}Z`, { n: 'dish', role: P }),
        line(g.seg(C[0], C[1], C[0] + u[0] * 4.25, C[1] + u[1] * 4.25), { n: 'arm', role: S }),
        line(g.arc(12, 12, 5.5 - (g.s - 2), -90, 0), { n: 'w1', role: S, vc: 0 }),
        line(g.arc(12, 12, 10 - h, -90, 0), { n: 'w2', role: S, vc: 1 })
      ];
    },
    light: ['arm', 'w1', 'w2'],
    fx: { t: 'variable', on: ['w1', 'w2'], mode: 'cumulative' }
  },
  'reply-all': {
    label: '全部回复', key: 'square',
    allow: { optical: '两个箭头头部都在上方，杆与回复在同一位置，所以略偏上' },
    light: [], // one arrow with two heads
    plan: '主体：两个向左的箭头头部（前后相隔 6）和弯下的杆，与回复同一画法',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, y = 9, L = 5, x1 = 3 + h, x2 = x1 + 6;
      return [
        line(`M${n(x2)} ${y}H15A5 5 0 0 1 20 ${y + 5}V${n(21 - h)}` + g.pl([[x2 + L, y - L], [x2, y], [x2 + L, y + L]]), { n: 'shaft', role: P }),
        line(g.pl([[x1 + L, y - L], [x1, y], [x1 + L, y + L]]), { n: 'head', role: P })
      ];
    },
    fx: { t: 'keys', on: [['head'], ['shaft']], by: true, stagger: 60, x: [-1.3, 0.3] }
  },
  'share-2': {
    label: '分享 2', key: 'square',
    nudge: [-0.4, 0],
    plan: '主体：三个圆点（圆环）；辅助：连接左边圆点和右边两个圆点的两条线。右边两个圆点更重，整体左移 0.4',
    weights: { [P]: 0.77, [S]: 0.23 },
    draw(g) {
      const R = 3.25, A = [5.85, 12], B = [17.35, 6.25], Cc = [17.35, 17.75], link = (p, q) => {
        const d = Math.hypot(q[0] - p[0], q[1] - p[1]), ux = (q[0] - p[0]) / d, uy = (q[1] - p[1]) / d, k = R - g.h;
        return g.seg(p[0] + ux * k, p[1] + uy * k, q[0] - ux * k, q[1] - uy * k);
      };
      return [
        line(link(A, B), { n: 'l1', role: S }),
        line(link(A, Cc), { n: 'l2', role: S }),
        shell(g.ring(...A, R), { n: 'n0', role: P }),
        shell(g.ring(...B, R), { n: 'n1', role: P }),
        shell(g.ring(...Cc, R), { n: 'n2', role: P })
      ];
    },
    light: ['l1', 'l2'],
    fx: { t: 'draw', on: ['l1', 'l2'] }
  },
  'message-square-heart': {
    label: '暖心留言', key: 'landscape',
    plan: '主体：心形；辅助：对话框（与留言相同）',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g) { return [{ ...bubble(g), role: S }, shell(heart(g, { w: 9 - (g.s - 2), top: 7.5 + (g.s - 2) * 0.5, tip: 16.25 - (g.s - 2) * 0.5, R: 2.75 - (g.s - 2) * 0.3 }), { n: 'heart', role: P, on: 'bubble' })]; },
    fx: { t: 'beat', on: ['heart'], o: [12, 12] }
  },
  'message-circle-x': {
    label: '关闭聊天', key: 'circle',
    plan: '主体：叉号（与关闭相同）；辅助：圆形对话框（与消息相同）',
    weights: { [P]: 0.28, [S]: 0.72 },
    draw(g) { const k = 3.75 - 0.6 * (g.s - 1.75); return [shell(roundBubble(g, 12, 12, 10), { n: 'bubble', role: S }), line(g.seg(12 - k, 12 - k, 12 + k, 12 + k) + g.seg(12 + k, 12 - k, 12 - k, 12 + k), { n: 'x', role: P, on: 'bubble' })]; },
    fx: { t: 'rotate', on: ['x'], deg: 90, o: [12, 12] }
  }
};

export default {
  ...SET,
  'megaphone-off': off({ ...slash(SET.megaphone, { label: '关闭广播' }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'megaphone', { t: 'keys', on: ['horn', 'grip'], o: [12, 12], s: [0.88], ms: 240 }),
  forward: {
    ...mirror(SET.reply),
    label: '转发',
    plan: '主体：向右的箭头（回复左右翻转），杆向左后弯下',
    fx: { t: 'keys', on: 'all', x: [1.3, -0.3] }
  }
};
