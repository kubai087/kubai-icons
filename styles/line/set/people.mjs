// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// people: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: user-round users-round user-group id-badge hand thumbs-up thumbs-down smile frown meh accessibility baby person-standing person-walking crown
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid, geo } from '../parts.mjs';
import { corner, notch, MARKS, MARK_FX, xform } from './communication.mjs';
import { shieldPath } from './security.mjs';

// The two points where circle (ax, ay, ar) meets circle (bx, by, br), left one first.
function meet([ax, ay, ar], [bx, by, br]) {
  const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy), a = (ar * ar - br * br + d * d) / (2 * d), hh = Math.sqrt(Math.max(ar * ar - a * a, 0));
  const mx = ax + (a * dx) / d, my = ay + (a * dy) / d;
  return [[mx + (hh * dy) / d, my - (hh * dx) / d], [mx - (hh * dy) / d, my + (hh * dx) / d]].sort((p, q) => p[0] - q[0]);
}
const deg = (c, p) => (Math.atan2(p[1] - c[1], p[0] - c[0]) * 180) / Math.PI;
// Shoulders cropped by a round frame: the upper arc of the circle (cx, cy, r), between the two
// points where it meets the frame's centre line (radius fr about 12, 12), so its ends join it.
function shoulders(g, cx, cy, r, fr) {
  const [L, R] = meet([cx, cy, r], [12, 12, fr]);
  let a0 = deg([cx, cy], L), a1 = deg([cx, cy], R);
  if (a1 < a0) a1 += 360;
  return g.arc(cx, cy, r, a0, a1);
}

// Faces (smile, frown, meh, baby): the circle key shape, two dot eyes and a mouth.
const FACE = { ex: 9, ey: 9, mw: 4 };
const faceRing = (g) => shell(g.ring(12, 12, 10), { n: 'face', role: P });
const eyes = (g, { x = FACE.ex, y = FACE.ey } = {}) => {
  const k = 1 - (g.s - 2) * 0.2;
  return solid(g.dot(x, y, k) + g.dot(24 - x, y, k), { n: 'eyes', role: D, on: 'face' });
};
// A frown: an arc whose ends sit at y, half-width w, sagging up by `up`; it shrinks a little with
// the weight about its middle, so its ends keep clear of the face.
function frownArc(g, y, w, up) {
  const k = 1 - (g.s - 2) * 0.5, r = (w * w + up * up) / (2 * up), a = (Math.asin(w / r) * 180) / Math.PI, cy = y - up / 2;
  const P = (x, yy) => [12 + (x - 12) * k, cy + (yy - cy) * k];
  const c = P(12, y - up + r);
  return g.arc(c[0], c[1], r * k, 270 - a, 270 + a);
}

// A copy of icons.mjs's user, the base of its variants here.
const USER = {
  label: '用户', key: 'square',
  allow: { keyline: '人的肩宽 16，比方框窄；放宽会显得胖' },
  draw: (g) => [shell(g.ring(12, 7.5, 4.875), { n: 'head', role: P }), shell(g.box(4, 14, 16, 7, [6.25, 6.25, 2.5, 2.5]), { n: 'body', role: S })]
};
// Small objects for the corner of a person (corner(), communication.mjs), about (x, y): a cog, a
// star and a shield are the set's own shapes drawn small at the same stroke; a pen.
const small = (k, reach, shape, at) => ({ draw: (g, x, y) => [shell(xform(shape(geo(g.s / k)), k, x, y))], reach: () => reach, at });
const COG = small(0.5, 5, (g) => gear(g));
const STAR = small(0.46, 4.3, (g) => star(g));
// three eighths of the shield, placed so its straight sides and top stay on whole pixels
const SHIELD = small(0.375, 4.4, (g) => shieldPath(g), [17, 16.75]);
// a pencil from its tip at the bottom left up to the top right, as one outline
const PEN = {
  draw(g, x, y) {
    const a = [Math.SQRT1_2, -Math.SQRT1_2], b = [Math.SQRT1_2, Math.SQRT1_2], o = [x - 3, y + 3], w = 1.5 - (g.s - 2) * 0.3;
    const P0 = (u, v) => [o[0] + a[0] * u + b[0] * v, o[1] + a[1] * u + b[1] * v];
    return [shell(g.polygon([P0(0.4, 0), P0(2.6, -w), P0(8.2, -w), P0(8.2, w), P0(2.6, w)], [0.6, 0.3, 0.8, 0.8, 0.3]))];
  },
  reach: () => 5
};
// Points along an arc by its centre line, from angle a0 to a1 (degrees, clockwise), for outlines
// built as one polygon.
const arcPts = (cx, cy, r, a0, a1, k = 8) => Array.from({ length: k + 1 }, (_, i) => { const a = ((a0 + ((a1 - a0) * i) / k) * Math.PI) / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
const userMark = (mark, label, fx) => ({ ...notch(corner(USER, mark, { label })), fx: fx ?? MARK_FX[mark] });

// Stick figures (accessibility, person-standing, person-walking): a solid head and one line.
const headDot = (g, x, y, r) => solid(g.circ(x, y, n(r)), { n: 'head', role: S });

// Thumbs: a solid cuff bar and the fist with its thumb, mirrored top to bottom for thumbs down.
// The fist is heavy and the thumb light, so the drawing sits one pixel toward the thumb (nudge).
function thumb(g, flip) {
  const { s } = g, Y = (y) => (flip ? 25 - y : y - 1), w = n(4 + (s - 2) * 0.6);
  const pts = [[11.5, 4], [15.5, 4], [15, 10], [20, 10], [20, 20], [10, 20], [10, 10]].map(([x, y]) => [x, Y(y)]);
  const fist = g.polygon(pts, [2, 2, 0, 2.5 - g.h, 3 - g.h, 2 - g.h, 0.75]);
  return [
    solid(g.area(3, flip ? 4 : 9, w, 11, w / 2), { n: 'cuff', role: S }),
    shell(fist, { n: 'hand', role: P }),
    line(g.seg(20, Y(15), 15.5, Y(15)), { n: 'finger', role: D, on: 'hand' })
  ];
}

const SET = {
  'user-round': {
    label: '头像', key: 'circle',
    allow: { sliver: '面性中肩膀切出圆的下沿，与圆边相交处是切口的锐角，不是碎块' },
    plan: '主体：人像（头和肩，肩线两端接到外圈，像被圆形裁切）；辅助：外圈。外圈周长大，墨量多但层级靠后',
    weights: { [P]: 0.37, [S]: 0.63 },
    draw(g, ctx) {
      // fill variant: the head keeps a stroke clear of the shoulders
      const { h, s } = g, d = s - 2, R = 3.5 - d * 0.5, cy0 = 9 + d * 0.25;
      const cy = ctx?.variant === 'fill' ? Math.min(cy0, 15 - h - s - R) : cy0;
      return [
        shell(g.ring(12, 12, 10), { n: 'ring', role: S }),
        shell(g.ring(12, cy, R), { n: 'head', role: P, on: 'ring' }),
        // Filled, the shoulders are cut out whole and run out through the disc's lower edge, as a
        // portrait cropped by a circle; an arc line inside the disc would read as a frown.
        ctx?.variant === 'fill'
          ? shell(g.ring(12, 21, 6), { n: 'body', role: P, on: 'ring' })
          : line(shoulders(g, 12, 21, 6, 10 - h), { n: 'body', role: P, on: 'ring' })
      ];
    },
    fx: { t: 'bounce', on: ['head'], o: [12, 12.5], amp: 1.1 }
  },
  'users-round': {
    label: '成员', key: 'landscape',
    plan: '主体：前面的人（圆头和拱形的肩）；辅助：后面的人（被前面的人挡住一部分）。不加外圈：两个头放进圆圈里会读成一张脸',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g, ctx) {
      const { h } = g, yb = 20 - h;
      // shoulders: the upper half of a circle standing on the bottom line
      const arch = (cx, r) => g.arc(cx, yb, r - h, 180, 360);
      // the back shoulders start where their round end just clears the band round the front
      // ones, so the band cuts no point (nor half a cap, left under the front arch) out of them
      const rc = 5.5 - h, dc = 7 + g.g + h, c = (dc * dc - 7.5 * 7.5 - rc * rc) / (15 * rc);
      const back = g.arc(16.5, yb, rc, 360 - (Math.acos(c) * 180) / Math.PI, 360);
      return [
        shell(g.ring(16.5, 7, 3), { n: 'head2', role: S }),
        line(back, { n: 'body2', role: S }),
        shell(g.ring(9, 7.5, 3.5), { n: 'head1', role: P, occ: true }),
        line(arch(9, 7), { n: 'body1', role: P, occ: true })
      ];
    },
    fx: { t: 'bounce', on: [['head2', 'body2'], ['head1', 'body1']], by: true, o: [12, 20], amp: 0.9 }
  },
  'user-group': {
    label: '群组', key: 'landscape',
    plan: '主体：中间前面的人；辅助：两侧后面的人（身体被挡住一部分）。头和肩的比例与多人一致；两侧两人合起来墨量多于中间一人',
    weights: { [P]: 0.37, [S]: 0.63 },
    draw(g, ctx) {
      // fill variant: the band round the front body runs straight down past the bottom, so the
      // bodies behind keep no thin tail under its rounded corners
      const e = g.g, band = ctx?.variant === 'fill' ? { cutD: g.rr(8 - e, 14 - e, 8 + 2 * e, 10 + e, [4 + e, 4 + e, 0, 0]) } : {};
      return [
        shell(g.ring(4.75, 6.5, 2.75), { n: 'headL', role: S }),
        shell(g.box(2, 11, 7, 9, [3.25, 3.25, 2, 2]), { n: 'bodyL', role: S }),
        shell(g.ring(19.25, 6.5, 2.75), { n: 'headR', role: S }),
        shell(g.box(15, 11, 7, 9, [3.25, 3.25, 2, 2]), { n: 'bodyR', role: S }),
        shell(g.ring(12, 9, 3), { n: 'head', role: P, occ: true }),
        shell(g.box(8, 14, 8, 6, [4, 4, 2, 2]), { n: 'body', role: P, occ: true, ...band })
      ];
    },
    fx: { t: 'bounce', on: [['headL', 'bodyL'], ['head', 'body'], ['headR', 'bodyR']], by: true, o: [12, 20], amp: 1.1 }
  },
  'id-badge': {
    label: '工牌', key: 'landscape',
    plan: '主体：卡片；辅助：人像（头和肩，肩线接到卡片底边）；细节：两行字',
    weights: { [P]: 0.63, [S]: 0.26, [D]: 0.11 },
    draw(g, ctx) {
      const { h, s } = g, d = s - 2, yb = 20 - h, r = 3;
      let cx = 9, R = 3 - d * 0.5, cy = 10.5 + d * 0.25, x0 = 14.5, y1 = 10, y2 = 14, x1 = 17.5 - d, x2 = 16.5 - d;
      // Fill variant: the shoulders cut out through the bottom edge (ends), clear of the rounded
      // corner; at heavy weights the head is a little smaller and higher and the lines move
      // right and apart, so a stroke of ink stays between every two holes.
      const fill = ctx?.variant === 'fill';
      if (fill) {
        // the shoulders meet the outer bottom edge (1 below their centre) where it is straight
        cx = Math.max(cx, 6 + Math.sqrt((r + h) ** 2 - 1));
        R -= Math.max(0, d);
        cy = Math.min(cy, 16 - h - s - R);
        x0 = Math.max(x0, cx + R + s + h);
        y1 = 12 - Math.max(2, s);
        y2 = 12 + Math.max(2, s);
        x1 = Math.min(x0 + 3 - d, 22 - 1.5 * s);
        x2 = Math.min(x0 + 2 - d, x1 - 1);
      }
      // shoulders: an arc standing on the card's bottom edge (centre line), ends joined to it
      const dy = yb - 19, half = Math.sqrt(r * r - dy * dy), a = (Math.asin(dy / r) * 180) / Math.PI;
      return [
        shell(g.box(2, 4, 20, 16, 4), { n: 'card', role: P }),
        shell(g.ring(cx, cy, R), { n: 'head', role: S, on: 'card' }),
        line(g.arc(cx, 19, r, 180 - a, 360 + a), { n: 'body', role: S, on: 'card', ends: 'out' }),
        line(g.seg(x0, y1, x1, y1), { n: 'l1', role: D, on: 'card' }),
        line(g.seg(x0, y2, x2, y2), { n: 'l2', role: D, on: 'card' })
      ];
    },
    fx: { t: 'draw', on: ['l1', 'l2'] }
  },
  hand: {
    label: '举手', key: 'square',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：手掌轮廓（四指是并排的拱形，拇指斜向左上）；细节：指缝线（从指根画到较短手指的指尖，三条较长，约占四分之一）',
    weights: { [P]: 0.75, [D]: 0.25 },
    draw(g, ctx) {
      // fingers 3 wide on whole pixels (x 8..20); the thumb is a capsule at 45° from the wrist
      const K = 12, t = [5, 4, 5, 7], b = 20, k = Math.SQRT1_2;
      const E1 = [11 - 9.28 * k, b - 9.28 * k], E2 = [E1[0] + 3 * k, E1[1] - 3 * k], J = E2[1] + (8 - E2[0]);
      const p = (q) => `${n(q[0])} ${n(q[1])}`;
      const hand = `M8 ${n(J)}V${t[0] + 1.5}A1.5 1.5 0 0 1 11 ${t[0] + 1.5}V${t[1] + 1.5}A1.5 1.5 0 0 1 14 ${t[1] + 1.5}V${t[2] + 1.5}A1.5 1.5 0 0 1 17 ${t[2] + 1.5}V${t[3] + 1.5}A1.5 1.5 0 0 1 20 ${t[3] + 1.5}V14A6 6 0 0 1 14 ${b}H11L${p(E1)}A1.5 1.5 0 0 1 ${p(E2)}Z`;
      return [
        shell(hand, { n: 'hand', role: P }),
        // Fill variant: a finger between two gaps keeps 3 - w of ink, so from the regular weight up
        // the gaps narrow to round-ended slots of width 3 - s (as in hand-grab), same length.
        ...(ctx?.variant === 'fill' && g.s > 1.5
          ? [solid([[11, 0, 1], [14, 2, 1], [17, 2, 3]].map(([x, a, c]) => { const w = 3 - g.s, top = Math.max(t[a], t[c] ?? t[a]) + 1.5 - g.h; return g.area(x - w / 2, top, w, K + g.h - top, w / 2); }).join(''), { n: 'gaps', role: D, on: 'hand' })]
          : [line(g.seg(11, t[0] + 1.5, 11, K) + g.seg(14, t[2] + 1.5, 14, K) + g.seg(17, t[3] + 1.5, 17, K), { n: 'gaps', role: D, on: 'hand' })])
      ];
    },
    fx: { t: 'wiggle', on: 'all', o: [12, 21], deg: 9, hz: 2.6 }
  },
  'thumbs-up': {
    label: '点赞', key: 'square',
    ends: 'out',
    nudge: [0, -1],
    plan: '主体：握拳的手和竖起的拇指；辅助：袖口（实心短条，宽不到三个线宽）；细节：一条指缝。拳头重、拇指轻，整体上移 1',
    weights: { [P]: 0.64, [S]: 0.28, [D]: 0.08 },
    draw(g) { return thumb(g, false); },
    // 点赞: the hand pushes up and settles
    fx: { t: 'keys', on: 'all', o: [12, 20], y: [-1.4, 0.3], r: [-6, 2] }
  },
  'thumbs-down': {
    label: '点踩', key: 'square',
    ends: 'out',
    nudge: [0, 1],
    plan: '同点赞，上下翻转，拇指朝下，整体下移 1',
    weights: { [P]: 0.64, [S]: 0.28, [D]: 0.08 },
    draw(g) { return thumb(g, true); },
    fx: { t: 'keys', on: 'all', o: [12, 4], y: [1.4, -0.3], r: [6, -2] }
  },
  smile: {
    label: '微笑', key: 'circle',
    plan: '主体：脸（圆）；细节：两只眼睛（实心点）和上扬的嘴',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) { return [faceRing(g), eyes(g), line(g.arc(12, 10.5, 5, 36.87, 143.13), { n: 'mouth', role: D, on: 'face' })]; },
    // 微笑: the smile widens and settles
    fx: { t: 'keys', on: ['mouth'], o: [12, 13.5], s: [1.18], ms: 320 }
  },
  frown: {
    label: '难过', key: 'circle',
    plan: '主体：脸（圆）；细节：两只眼睛（实心点）和下垂的嘴',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) { return [faceRing(g), eyes(g), line(frownArc(g, 16.25, 3.5, 1.75), { n: 'mouth', role: D, on: 'face' })]; },
    // 难过: the eyes and mouth sink, then come back
    fx: { t: 'keys', on: ['eyes', 'mouth'], y: [1], ms: 460 }
  },
  meh: {
    label: '一般', key: 'circle',
    plan: '主体：脸（圆）；细节：两只眼睛（实心点）和平直的嘴',
    weights: { [P]: 0.76, [D]: 0.24 },
    draw(g) { return [faceRing(g), eyes(g), line(g.seg(8.5, 15, 15.5, 15), { n: 'mouth', role: D, on: 'face' })]; },
    // 一般: the eyes glance left and right
    fx: { t: 'keys', on: ['eyes'], x: [-1, 1, 0] }
  },
  accessibility: {
    label: '无障碍', key: 'circle',
    plan: '主体：张开双臂的人（头为实心点，身体是线）；辅助：外圈。人随字重略微缩小，与外圈保持间距',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g, ctx) {
      const d = g.s - 2, k = 1 - d * 0.15, Pt = (x, y) => [12 + (x - 12) * k, 12 + (y - 12) * k];
      const ay = 12, hy = 7.75 - d * 0.1, hr = 1.6 - d * 0.4;
      // fill variant: the head keeps a stroke of ink between it and the arms; at heavy weights
      // the hips sit lower, so the ink between an arm and a leg stays wide
      const fill = ctx?.variant === 'fill', head = fill ? Math.min(Pt(12, hy)[1], ay - g.h - g.s - hr) : Pt(12, hy)[1];
      const dy = fill ? Math.max(0, d + 0.5) * 1.5 : 0, L = (x, y) => { const [px, py] = Pt(x, y); return [px, py + dy]; };
      return [
        shell(g.ring(12, 12, 10), { n: 'ring', role: S }),
        solid(g.circ(12, n(head), n(hr)), { n: 'head', role: P, on: 'ring' }),
        line(g.pl([Pt(7, ay), Pt(17, ay)]) + g.pl([Pt(12, ay), L(12, 14.5)]) + g.pl([L(9.75, 16.75), L(12, 14.5), L(14.25, 16.75)]), { n: 'body', role: P, on: 'ring' })
      ];
    },
    light: ['head', 'body'],
    fx: { t: 'bounce', on: ['head', 'body'], o: [12, 17], amp: 0.9 }
  },
  baby: {
    label: '婴儿', key: 'circle',
    plan: '主体：脸（圆）；辅助：头顶一绺卷发（从脸的顶点向里卷）；细节：两只眼睛和小一点的笑嘴。五官比微笑低，给卷发留出位置',
    weights: { [P]: 0.66, [S]: 0.12, [D]: 0.22 },
    draw(g, ctx) {
      const { h } = g, top = 2 + h;
      if (ctx?.variant !== 'fill') {
        const r = 2.25;
        return [
          faceRing(g),
          line(g.arc(12, top + r, r, -90, 135), { n: 'curl', role: S, on: 'face' }),
          eyes(g, { x: 8.5, y: 11 }),
          line(g.arc(12, 13, 3.5, 40, 140), { n: 'mouth', role: D, on: 'face' })
        ];
      }
      // Fill variant: from the top the curl would run along the inside of the edge, so here it
      // comes out of the edge on a short radial stem (ends) and curls from its right side. At
      // heavy weights the curl, eyes and mouth are a little smaller and spread apart, so a
      // stroke of ink stays between every two holes.
      const w = Math.max(0, g.s - 2), r = 2.25 - w * 0.5, cy = top + r, len = Math.hypot(r, 12 - cy);
      const stem = [12 + (r * (10 - h)) / len, 12 - ((12 - cy) * (10 - h)) / len];
      const ex = 8.5 - w, ey = 11 + w, k = 1 - (g.s - 2) * 0.2 - w * 0.2, my = 13 + w * 1.5, ma = 40 + w * 20;
      return [
        faceRing(g),
        line(`M${g.pt(...stem)}L${g.pt(12 + r, cy)}A${n(r)} ${n(r)} 0 0 1 ${g.at(12, cy, r, 135)}`, { n: 'curl', role: S, on: 'face', ends: 'out' }),
        solid(g.dot(ex, ey, k) + g.dot(24 - ex, ey, k), { n: 'eyes', role: D, on: 'face' }),
        line(g.arc(12, my, 3.5, ma, 180 - ma), { n: 'mouth', role: D, on: 'face' })
      ];
    },
    // 婴儿: the head tilts side to side, the way a baby giggles
    fx: { t: 'wiggle', on: 'all', o: [12, 21], deg: 8, hz: 2.4 }
  },
  'person-standing': {
    anchor: 'base',
    label: '站立的人', key: 'portrait', fit: 'y',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：身体（躯干、手臂、腿，一笔线条）；辅助：头（实心圆点）。人站在地上，以脚底定位',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      const r = 2.25 + (g.s - 2) * 0.3;
      return [
        headDot(g, 12, 2 + r, r),
        line(g.pl([[8, 14], [12, 10], [16, 14]]) + g.seg(12, 10, 12, 15) + g.pl([[8.5, 21], [12, 15], [15.5, 21]]), { n: 'body', role: P })
      ];
    },
    fx: { t: 'bounce', on: ['head', 'body'], by: true, stagger: 60, o: [12, 22], amp: 1.1 },
    allow: { keyline: '站立的人本身窄，宽约 10' }
  },
  'person-walking': {
    anchor: 'base',
    label: '步行', key: 'portrait', fit: 'y',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：身体（前倾的躯干、前后摆的手臂、迈开的腿）；辅助：头（实心圆点，在身体前方）。以脚底定位',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const r = 2.25 + (g.s - 2) * 0.3, N = [12.75, 9.25], H = [11.25, 14.5];
      return [
        headDot(g, 13.75, 2 + r, r),
        line(g.pl([[7.5, 13], [9.25, 10.25], N, [15.25, 11.75], [17, 14]]) + g.pl([N, H]) + g.pl([[7, 21], [9.25, 17.75], H, [14, 17.5], [15, 21]]), { n: 'body', role: P })
      ];
    },
    // 步行: steps forward and back
    fx: { t: 'keys', on: 'all', x: [1.2, -0.4], y: [-0.6, 0], ms: 420 },
    allow: { keyline: '步行的人本身窄' }
  },
  crown: {
    anchor: 'base',
    label: '皇冠', key: 'square',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：冠身（三个尖，尖角倒圆）；辅助：底下一条横线',
    weights: { [P]: 0.84, [S]: 0.16 },
    draw(g) {
      const { h } = g, top = 2.6, side = 4.4, yb = 17 - h;
      return [
        shell(g.polygon([[3 + h, side], [8.5, 10.5], [12, top], [15.5, 10.5], [21 - h, side], [21 - h, yb], [3 + h, yb]], [1.1, 0, 1.1, 0, 1.1, 1.5, 1.5]), { n: 'crown', role: P }),
        line(g.span(3, 20, 21, 20), { n: 'base', role: S })
      ];
    },
    // 皇冠: lifted and set back down on the base
    fx: { t: 'keys', on: ['crown'], y: [-1.6, 0.3], ms: 300 }
  },
  'user-square': {
    label: '方形头像', key: 'square',
    plan: '主体：人像（头和肩，肩线两端接到方框底边，像被方框裁切）；辅助：方框。与头像同一种裁切，换成方框',
    weights: { [P]: 0.37, [S]: 0.63 },
    allow: { sliver: '面性中肩膀切出方框的下沿，与下沿相交处是切口的锐角，不是碎块（与头像相同）' },
    draw(g, ctx) {
      // Filled, the shoulders are cut out whole through the frame's bottom edge (as user-round),
      // and the head keeps a stroke clear of them.
      const { h, s } = g, d = s - 2, R = 3.5 - d * 0.5, r = 6, cy = 22, yb = 21 - h, a = (Math.asin((yb - cy) / r) * 180) / Math.PI, fill = ctx?.variant === 'fill';
      const hy = fill ? Math.min(10 + d * 0.25, cy - r - h - s - R) : 10 + d * 0.25;
      return [
        shell(g.box(3, 3, 18, 18, 4.25), { n: 'frame', role: S }),
        shell(g.ring(12, hy, R), { n: 'head', role: P, on: 'frame' }),
        fill ? shell(g.ring(12, cy, r + h), { n: 'body', role: P, on: 'frame' }) : line(g.arc(12, cy, r, 180 - a, 360 + a), { n: 'body', role: P, on: 'frame' })
      ];
    },
    fx: { t: 'bounce', on: ['head'], o: [12, 13], amp: 1.1 }
  },
  contact: {
    label: '联系人', key: 'landscape',
    plan: '主体：卡片；辅助：人像（头和肩，居中，肩线接到卡片底边）。与工牌同一张卡片，不带字线',
    weights: { [P]: 0.66, [S]: 0.34 },
    allow: { sliver: '面性中肩膀切出卡片的下沿，与下沿相交处是切口的锐角，不是碎块（与头像相同）' },
    draw(g, ctx) {
      // filled, the shoulders are cut out whole through the bottom edge, as in user-square
      const { h, s } = g, d = s - 2, R = 2.75 - d * 0.5, r = 5, cy = 21, yb = 20 - h, a = (Math.asin((yb - cy) / r) * 180) / Math.PI, fill = ctx?.variant === 'fill';
      const hy = fill ? Math.min(10.5 + d * 0.25, cy - r - h - s - R) : 10.5 + d * 0.25;
      return [
        shell(g.box(2, 4, 20, 16, 4), { n: 'card', role: P }),
        shell(g.ring(12, hy, R), { n: 'head', role: S, on: 'card' }),
        fill ? shell(g.ring(12, cy, r + h), { n: 'body', role: S, on: 'card' }) : line(g.arc(12, cy, r, 180 - a, 360 + a), { n: 'body', role: S, on: 'card' })
      ];
    },
    fx: { t: 'bounce', on: ['head', 'body'], o: [12, 20], amp: 0.9 }
  },
  angry: {
    label: '生气', key: 'circle',
    plan: '主体：脸（圆）；细节：两只斜向中间压低的眼睛（短斜线）和下垂的嘴',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g, ctx) {
      // the eyes' inner ends keep a stroke of ink between them in the fill
      const k = 1 - (g.s - 2) * 0.3, Pt = ([x, y]) => [12 + (x - 12) * k, 12 + (y - 12) * k], o = Pt([8, 8.5]), i = Pt([10, 10]);
      const m = ctx?.variant === 'fill' ? Math.max(12 - i[0], g.s) : 12 - i[0];
      return [
        faceRing(g),
        line(g.pl([o, [12 - m, i[1]]]) + g.pl([[24 - o[0], o[1]], [12 + m, i[1]]]), { n: 'eyes', role: D, on: 'face' }),
        line(frownArc(g, 16.25, 3.5, 1.75), { n: 'mouth', role: D, on: 'face' })
      ];
    },
    // 生气: the face shakes
    fx: { t: 'shake', on: 'all', x: 0.8 }
  },
  laugh: {
    label: '大笑', key: 'circle',
    plan: '主体：脸（圆）；细节：两只眼睛和张开的嘴（半圆，闭合）',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g, ctx) {
      // fill: the eyes rise so a stroke of ink stays between them and the mouth
      const { h, s } = g, k = 1 - (s - 2) * 0.3, r = 5 * k - h, y = 13, ey = ctx?.variant === 'fill' ? Math.min(8.75, y - h - s - g.dr * (1 - (s - 2) * 0.2)) : 8.75;
      return [
        faceRing(g),
        eyes(g, { y: ey }),
        shell(`M${n(12 - r)} ${y}H${n(12 + r)}A${n(r)} ${n(r)} 0 0 1 ${n(12 - r)} ${y}Z`, { n: 'mouth', role: D, on: 'face' })
      ];
    },
    // 大笑: the face bobs with laughter
    fx: { t: 'keys', on: 'all', o: [12, 22], y: [-0.8, 0, -0.6, 0], ms: 520 }
  },
  wink: {
    label: '眨眼', key: 'circle',
    plan: '主体：脸（圆）；细节：左眼（实心点）、右眼（闭上的弧线）和上扬的嘴',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g, ctx) {
      // the closed eye moves in with the weight, and in the fill also apart from the open one
      const d = Math.max(0, g.s - 2), k = 1 - (g.s - 2) * 0.2, w = ctx?.variant === 'fill' ? d * 2.6 : 0;
      return [
        faceRing(g),
        solid(g.dot(FACE.ex - w, FACE.ey, k), { n: 'eye', role: D, on: 'face' }),
        line(g.arc(15 - 0.2 * d, 10 + 0.4 * d, 1.75 - 0.7 * d, 200, 340), { n: 'shut', role: D, on: 'face' }),
        line(g.arc(12, 10.5, 5, 36.87 + w * 14, 143.13 - w * 14), { n: 'mouth', role: D, on: 'face' })
      ];
    },
    // 眨眼: the open eye closes for a moment
    fx: { t: 'keys', on: ['eye'], o: [FACE.ex, FACE.ey], sy: [0.2, 1], ms: 260 }
  },
  annoyed: {
    label: '不满', key: 'circle',
    plan: '主体：脸（圆）；细节：两只眯成横线的眼睛和平直的嘴',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g, ctx) {
      const k = 1 - (g.s - 2) * 0.3, X = (x) => 12 + (x - 12) * k, m = ctx?.variant === 'fill' ? Math.max(2 * k, g.s) : 2 * k;
      return [faceRing(g), line(g.seg(X(7.5), 9, 12 - m, 9) + g.seg(12 + m, 9, X(16.5), 9), { n: 'eyes', role: D, on: 'face' }), line(g.seg(8.5, 15, 15.5, 15), { n: 'mouth', role: D, on: 'face' })];
    },
    fx: { t: 'keys', on: ['eyes'], x: [-0.8, 0.8, 0] }
  },
  mars: {
    label: '男性', key: 'square',
    light: [], // one glyph
    plan: '主体：圆环和指向右上的箭头（一个符号）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, c = [10, 14], R = 7, e = (R - h) * Math.SQRT1_2, tip = [21 - h, 3 + h];
      return [
        line(g.ring(...c, R), { n: 'ring', role: P }), // a glyph: no part of it fills
        line(g.seg(c[0] + e, c[1] - e, ...tip) + g.pl([[tip[0] - 5, tip[1]], tip, [tip[0], tip[1] + 5]]), { n: 'arrow', role: P })
      ];
    },
    fx: { t: 'keys', on: ['arrow'], x: [1, -0.2], y: [-1, 0.2] }
  },
  venus: {
    label: '女性', key: 'square', fit: 'y',
    light: [], // one glyph
    plan: '主体：圆环和下面的十字（一个符号）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, R = 6.5;
      return [line(g.ring(12, 9.5, R), { n: 'ring', role: P }), line(g.seg(12, 16 - h, 12, 21 - h) + g.span(8, 18, 16, 18), { n: 'cross', role: P })];
    },
    fx: { t: 'wiggle', on: 'all', o: [12, 9.5], deg: 10 },
    allow: { keyline: '符号本身窄' }
  },
  ghost: {
    label: '幽灵', key: 'portrait',
    plan: '主体：幽灵（圆顶，下沿是三个尖的波边，一个闭合形）；细节：两只眼睛',
    weights: { [P]: 0.88, [D]: 0.12 },
    draw(g, ctx) {
      const { h } = g, R = 8 - h, yb = 22 - h;
      const pts = [...arcPts(12, 10, R, 180, 360, 12), [20 - h, yb], [17.33, yb - 2.5], [14.67, yb], [12, yb - 2.5], [9.33, yb], [6.67, yb - 2.5], [4 + h, yb]];
      const rad = pts.map((_, i) => (i <= 12 ? 0 : i % 2 ? 1 : 0.8));
      // fill: the eyes keep a stroke of ink between them
      const k = 1 - (g.s - 2) * 0.2, dx = ctx?.variant === 'fill' ? Math.max(2.5, g.dr * k + g.h) : 2.5;
      return [shell(g.polygon(pts, rad), { n: 'ghost', role: P }), solid(g.dot(12 - dx, 10.5, k) + g.dot(12 + dx, 10.5, k), { n: 'eyes', role: D, on: 'ghost' })];
    },
    // 飘: the ghost floats up and down
    fx: { t: 'keys', on: 'all', y: [-1.2, 0.2, -0.8, 0], ms: 700 }
  },
  glasses: {
    label: '眼镜', key: 'landscape', fit: 'x',
    light: [], // one object
    plan: '主体：两片圆镜框；辅助：中间的鼻梁（拱形）',
    weights: { [P]: 0.73, [S]: 0.27 },
    draw(g) {
      const { h } = g, y = 13, R = 4.25;
      return [
        shell(g.ring(2 + R, y, R), { n: 'l', role: P }),
        shell(g.ring(22 - R, y, R), { n: 'r', role: P }),
        line(g.arc(12, y, 6.25 - R + h + 1.75 - h, 180, 360), { n: 'bridge', role: S })
      ];
    },
    fx: { t: 'keys', on: 'all', y: [-1, 0.2], ms: 300 }
  },
  'person-running': {
    anchor: 'base',
    label: '跑步', key: 'portrait', fit: 'y',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：身体（前倾的躯干、弯曲的手臂、大步迈开的腿）；辅助：头（实心圆点，在身体前上方）。以脚底定位',
    weights: { [P]: 0.82, [S]: 0.18 },
    draw(g) {
      const r = 2.25 + (g.s - 2) * 0.3, N = [13, 9], H = [10.5, 14.5];
      return [
        headDot(g, 15.5, 2 + r, r),
        line(g.pl([[6.5, 10.5], [9, 8.5], N, [15.5, 11.5], [18.5, 10]]) + g.pl([N, H]) + g.pl([[5.5, 17.5], [8.5, 18], H, [14.5, 17], [13.5, 21]]), { n: 'body', role: P })
      ];
    },
    fx: { t: 'keys', on: 'all', x: [1.5, -0.4], y: [-0.8, 0], ms: 380 },
    allow: { keyline: '跑步的人本身窄' }
  },
  'person-waving': {
    anchor: 'base',
    label: '挥手', key: 'portrait', fit: 'y',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：身体（与站立的人相同，右臂举起）；辅助：头（实心圆点）。以脚底定位',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      const r = 2.25 + (g.s - 2) * 0.3;
      return [
        headDot(g, 12, 2 + r, r),
        line(g.pl([[8, 14], [12, 10], [16.5, 7.5]]) + g.seg(16.5, 7.5, 17.5, 3.5), { n: 'arm', role: P }),
        line(g.seg(12, 10, 12, 15) + g.pl([[8.5, 21], [12, 15], [15.5, 21]]), { n: 'body', role: P })
      ];
    },
    // 挥手: the raised arm waves
    fx: { t: 'wiggle', on: ['arm'], o: [12, 10], deg: 10, hz: 3 },
    allow: { keyline: '人本身窄' }
  },
  balloon: {
    label: '气球', key: 'portrait', fit: 'y',
    plan: '主体：气球（圆）；辅助：下面的结和弯曲的绳子',
    weights: { [P]: 0.86, [S]: 0.14 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.ring(12, 10, 7), { n: 'balloon', role: P }),
        solid(g.polygon([[10.4, 18.6], [12, 16.4], [13.6, 18.6]], [0.4, 0.4, 0.4]), { n: 'knot', role: S, part: 'string' }),
        line(`M12 18.6C10.6 19.6 13.4 20.6 12 ${n(22 - h)}`, { n: 'string', role: S, part: 'string' })
      ];
    },
    // 飘: the balloon sways on its string
    fx: { t: 'wiggle', on: 'all', o: [12, 22], deg: 7, hz: 1.6 },
    allow: { keyline: '气球本身窄' }
  },
  shirt: {
    label: '衣服', key: 'square',
    plan: '主体：T 恤（领口、两只短袖和衣身，一个闭合形）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, t = 3 + h, sl = 10;
      const pts = [[3 + h, 6], [8.5, t], ...arcPts(12, t, 3.5, 180, 0, 6).slice(1, -1), [15.5, t], [21 - h, 6], [21 - h, sl], [17, sl], [17, 21 - h], [7, 21 - h], [7, sl], [3 + h, sl]];
      const rad = pts.map((p, i) => (i === 0 || i === pts.length - 1 ? 1 : i === 1 || i === pts.length - 13 ? 1.2 : 0.8));
      return [shell(g.polygon(pts, rad), { n: 'shirt', role: P })];
    },
    fx: { t: 'wiggle', on: 'all', o: [12, 3], deg: 6 }
  }
};

const ROUND = { label: '头像', key: 'circle', draw: (...a) => SET['user-round'].draw(...a), allow: SET['user-round'].allow };
export default {
  ...SET,
  'user-plus': userMark('plus', '添加用户'),
  'user-minus': userMark('minus', '移除用户'),
  'user-x': userMark('x', '删除用户'),
  'user-search': userMark('search', '查找用户'),
  'user-cog': userMark(COG, '用户设置', { t: 'rotate', on: ['badge'], deg: 45, oBadge: true }),
  'user-lock': userMark('lock', '用户锁定', { t: 'keys', on: ['badge1'], y: [-1, 0.3], ms: 260 }),
  'user-pen': userMark(PEN, '编辑用户', { t: 'orbit', on: ['badge'], R: 0.7 }),
  'user-shield': userMark(SHIELD, '管理员', { t: 'keys', on: ['badge'], oBadge: true, s: [0.85, 1.06], ms: 300 }),
  'user-star': userMark(STAR, '关注的人', { t: 'rotate', on: ['badge'], deg: 72, oBadge: true }),
  'user-round-plus': { ...notch(corner(ROUND, 'plus', { label: '添加头像' })), fx: MARK_FX.plus },
  'user-round-check': { ...notch(corner(ROUND, 'check', { label: '头像已认证' })), fx: MARK_FX.check },
  'user-round-x': { ...notch(corner(ROUND, 'x', { label: '移除头像' })), fx: MARK_FX.x },
  'user-round-minus': { ...notch(corner(ROUND, 'minus', { label: '移除头像' })), fx: MARK_FX.minus },
  'user-round-search': { ...notch(corner(ROUND, 'search', { label: '查找成员' })), fx: MARK_FX.search },
  'user-round-pen': { ...notch(corner(ROUND, PEN, { label: '编辑资料' })), allow: { ...SET['user-round'].allow, keyline: '笔斜放在右下角，笔尾伸出圆一点' }, fx: { t: 'orbit', on: ['badge'], R: 0.7 } },
  'user-round-lock': { ...notch(corner(ROUND, 'lock', { label: '账户锁定' })), fx: MARK_FX.lock },
  'user-round-cog': { ...notch(corner(ROUND, COG, { label: '账户设置' })), allow: { ...SET['user-round'].allow, keyline: '齿轮比加号大，伸出圆一点' }, fx: { t: 'rotate', on: ['badge'], deg: 45, oBadge: true } }
};
