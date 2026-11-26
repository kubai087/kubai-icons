// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// nature: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: leaf sprout tree tree-pine flower mountain flame waves planet paw cat dog bird fish butterfly
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

const p2 = (q) => `${n(q[0])} ${n(q[1])}`;
const deg = (a) => (a * Math.PI) / 180;

/** A drop: a circle (outer radius R round c) and the two lines tangent to it from the tip t (centre line). */
function drop(g, c, R, t) {
  const r = R - g.h, dx = c[0] - t[0], dy = c[1] - t[1], Dd = Math.hypot(dx, dy), phi = Math.atan2(-dy, -dx), b = Math.acos(r / Dd);
  const at = (a) => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  return `M${p2(t)}L${p2(at(phi + b))}A${n(r)} ${n(r)} 0 1 1 ${p2(at(phi - b))}Z`;
}
/**
 * A flame: the round bottom of a circle (outer radius R round cx, cy) and two arcs rising from
 * its sides to the tip, each tangent to the circle where it leaves it (centre lines).
 */
function flameShape(g, cx, cy, R, tip) {
  const r = R - g.h, L = [cx - r, cy], Rt = [cx + r, cy], dy = cy - tip;
  // the side arc is tangent to the upright at the circle's side, so its centre is level with it
  const q = ((r * r) + (dy * dy)) / (2 * r);
  return `M${p2(L)}A${n(r)} ${n(r)} 0 0 0 ${p2(Rt)}A${n(q)} ${n(q)} 0 0 0 ${n(cx)} ${n(tip)}A${n(q)} ${n(q)} 0 0 0 ${p2(L)}Z`;
}
/** Petals: n circles (outer radius R) round (cx, cy) at distance d, as one scalloped outline. */
function petals(g, cx, cy, count, d, R, a0 = -90) {
  const r = R - g.h, half = Math.PI / count, rho = d * Math.cos(half) + Math.sqrt(r * r - (d * Math.sin(half)) ** 2);
  const valley = (i) => { const a = deg(a0) + (2 * i - 1) * half; return [cx + rho * Math.cos(a), cy + rho * Math.sin(a)]; };
  let path = `M${p2(valley(0))}`;
  for (let i = 0; i < count; i++) path += `A${n(r)} ${n(r)} 0 1 1 ${p2(valley(i + 1))}`;
  return path + 'Z';
}
/** Half an ellipse by its centre line, rotated by rot degrees: t from t0 to t0 + 180. */
function halfEllipse(cx, cy, rx, ry, rot, t0) {
  const a = deg(rot), at = (t) => [cx + rx * Math.cos(t) * Math.cos(a) - ry * Math.sin(t) * Math.sin(a), cy + rx * Math.cos(t) * Math.sin(a) + ry * Math.sin(t) * Math.cos(a)];
  // two quarter arcs: a single 180° arc between opposite points is ambiguous in SVG
  const q = `A${n(rx)} ${n(ry)} ${n(rot)} 0 1 `;
  return `M${p2(at(deg(t0)))}${q}${p2(at(deg(t0 + 90)))}${q}${p2(at(deg(t0 + 180)))}`;
}

/** The parts of a whole ellipse (as in halfEllipse) that lie farther than R from (cx, cy), as polylines. */
function ellipseOutside(cx, cy, rx, ry, rot, R) {
  const a = deg(rot), at = (t) => [cx + rx * Math.cos(t) * Math.cos(a) - ry * Math.sin(t) * Math.sin(a), cy + rx * Math.cos(t) * Math.sin(a) + ry * Math.sin(t) * Math.cos(a)];
  const runs = []; let run = null;
  for (let k = 0; k <= 360; k += 2) {
    const p = at(deg(k)), out = Math.hypot(p[0] - cx, p[1] - cy) > R;
    if (out) (run ??= []).push(p); else if (run) { runs.push(run); run = null; }
  }
  if (run) { if (runs.length && Math.hypot(runs[0][0][0] - run[run.length - 1][0], runs[0][0][1] - run[run.length - 1][1]) < 0.5) runs[0] = [...run, ...runs[0]]; else runs.push(run); }
  return runs.filter((r) => r.length > 1).map((r) => 'M' + r.map(p2).join('L'));
}

// A leaf or blade: two arcs between A and B bowing out by sag (centre line), as home's plant.
function lensBy(A, B, sag) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), rho = (L * L / 4 + sag * sag) / (2 * sag);
  return `M${p2(A)}A${n(rho)} ${n(rho)} 0 0 1 ${p2(B)}A${n(rho)} ${n(rho)} 0 0 1 ${p2(A)}Z`;
}
/** Petals as in petals, for any overlap: each arc is a large arc only when it turns past 180°. */
function scallop(g, cx, cy, count, d, R, a0 = -90) {
  const r = R - g.h, half = Math.PI / count, rho = d * Math.cos(half) + Math.sqrt(r * r - (d * Math.sin(half)) ** 2);
  const valley = (i) => { const a = deg(a0) + (2 * i - 1) * half; return [cx + rho * Math.cos(a), cy + rho * Math.sin(a)]; };
  // the valleys lie behind the petal's centre (seen from the flower's centre) when its arc passes 180°
  const large = rho * Math.cos(half) < d ? 1 : 0;
  let path = `M${p2(valley(0))}`;
  for (let i = 0; i < count; i++) path += `A${n(r)} ${n(r)} 0 ${large} 1 ${p2(valley(i + 1))}`;
  return path + 'Z';
}
// The two peaks of mountain, by their centre-line corners (the base follows the stroke).
const PEAKS = (yb) => [[2.6, yb], [8.8, 3.3], [13, 11.2], [16.2, 7.3], [21.4, yb]];
// x on the straight line from p to q at height y.
const xAt = (p, q, y) => p[0] + ((q[0] - p[0]) * (y - p[1])) / (q[1] - p[1]);
export default {
  leaf: {
    label: '叶子', key: 'square',
    ends: 'in',
    plan: '主体：叶片（方形的两个对角取大圆角，另两个角是叶尖和叶柄）；辅助：叶柄（斜线，伸出叶片）；细节：主脉（叶柄在叶片里的延长）',
    weights: { [P]: 0.72, [S]: 0.08, [D]: 0.2 },
    draw(g) {
      // the stem and the vein are one straight line, split at the leaf's corner so the fill
      // variant can knock the vein out of the blade
      const { h } = g, c = 6 + h * 0.7;
      return [
        shell(g.box(6, 3, 15, 15, [7, 1, 7, 1]), { n: 'blade', role: P }),
        line(g.seg(3 + h * 0.7, 21 - h * 0.7, c, 24 - c), { n: 'stem', role: S }),
        line(g.seg(c, 24 - c, 14.5, 9.5), { n: 'vein', role: D, on: 'blade' })
      ];
    },
    // 叶子: the leaf sways on its stem
    fx: { t: 'wiggle', on: 'all', o: [4, 20], deg: 7, hz: 2.4 }
  },
  sprout: {
    anchor: 'base',
    label: '嫩芽', key: 'square',
    light: [],
    plan: '主体：两片叶子（同叶子的画法，左大右小，叶柄一端落在茎顶）；辅助：茎（一条短线，约占一成）',
    weights: { [P]: 0.88, [S]: 0.12 },
    draw(g) {
      return [
        line(g.seg(12, 21 - g.h, 12, 12), { n: 'stem', role: S }),
        shell(g.box(3, 3, 10, 10, [1, 5, 1, 5]), { n: 'left', role: P }),
        shell(g.box(11, 6, 10, 9, [5, 1, 5, 1]), { n: 'right', role: P })
      ];
    },
    // 生长: the sprout grows up from the ground
    fx: { t: 'keys', on: 'all', o: [12, 21], sy: [0.55, 1.06], s: [0.9, 1], ms: 420 }
  },
  tree: {
    anchor: 'base',
    label: '树', key: 'portrait',
    plan: '主体：圆形树冠；辅助：树干（从地面伸到树冠下沿）；细节：树冠里的两根枝（接在树干上，分成 Y 形）',
    weights: { [P]: 0.7, [S]: 0.1, [D]: 0.2 },
    draw(g, ctx) {
      // filled, the middle branch ends 0.5 lower, so no thin wedge of ink is left between it
      // and the left branch
      const { h } = g, rim = 17 - h, top = ctx?.variant === 'fill' ? 12 : 11.5;
      return [
        shell(g.ring(12, 9.5, 7.5), { n: 'crown', role: P }),
        line(g.seg(12, 22 - h, 12, rim), { n: 'trunk', role: S }),
        line(g.seg(12, rim, 12, top) + g.seg(12, 14, 9.5, 11.5) + g.seg(12, 13, 14.5, 10.5), { n: 'branches', role: D, on: 'crown' })
      ];
    },
    fx: { t: 'wiggle', on: 'all', o: [12, 22], deg: 4, hz: 2 },
    allow: { keyline: '树冠直径 15，比纵向方框窄' }
  },
  'tree-pine': {
    anchor: 'base',
    label: '松树', key: 'portrait',
    light: [],
    plan: '主体：三层的树冠（一个闭合形，每层向外伸出）；辅助：树干',
    weights: { [P]: 0.86, [S]: 0.14 },
    draw(g) {
      const { h } = g, top = 1.2 + h, y1 = 8, y2 = 13, yb = 18, xl = 3.3 + h, xr = 20.7 - h;
      return [
        shell(g.polygon([[12, top], [16.7, y1], [14.7, y1], [18.6, y2], [16.4, y2], [xr, yb], [xl, yb], [7.6, y2], [5.4, y2], [9.3, y1], [7.3, y1]],
          [1.2, 0.7, 0, 0.8, 0, 1, 1, 0, 0.8, 0, 0.7]), { n: 'crown', role: P }),
        line(g.seg(12, yb, 12, 22 - h), { n: 'trunk', role: S })
      ];
    },
    fx: { t: 'wiggle', on: 'all', o: [12, 22], deg: 4, hz: 2 }
  },
  flower: {
    label: '花', key: 'circle',
    plan: '主体：五片花瓣（五个圆连成的波浪形外轮廓）；细节：花心（圆环，随字重缩小）',
    weights: { [P]: 0.82, [D]: 0.18 },
    draw(g) {
      // petals overlap at every weight: they move in toward the centre as the stroke grows
      const d = 5.4 - (g.s - 2) * 0.3;
      return [
        shell(petals(g, 12, 12, 5, d, 10 - d), { n: 'petals', role: P }),
        shell(g.ring(12, 12, 2.9 - (g.s - 2) * 0.3), { n: 'centre', role: D, on: 'petals' })
      ];
    },
    // 开花: the flower turns a fifth of a turn as it opens
    fx: [{ t: 'rotate', on: ['petals'], deg: 72 }, { t: 'keys', on: 'all', o: [12, 12], s: [0.86, 1.04] }],
    allow: { keyline: '五瓣朝上，底部是两瓣之间的凹处，比圆的下沿高 1' }
  },
  mountain: {
    anchor: 'base',
    label: '山', key: 'landscape',
    plan: '主体：两座山峰（左高右低，一个闭合形，中间的山谷是凹角）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, yb = 20 - h;
      return [shell(g.polygon([[2.6, yb], [8.8, 3.3], [13, 11.2], [16.2, 7.3], [21.4, yb]], [0.8, 1.2, 0.5, 1.2, 0.8]), { n: 'peaks', role: P })];
    },
    // 山: the range settles on the ground
    fx: { t: 'bounce', on: 'all', o: [12, 20], amp: 0.8 }
  },
  flame: {
    label: '火焰', key: 'portrait', fit: 'y',
    plan: '主体：外焰（圆底，两侧圆弧收成尖顶）；细节：内焰（同样的形状，缩小，放在底部）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) {
      return [
        shell(flameShape(g, 12, 15, 7, 2 + g.h * 1.2), { n: 'outer', role: P }),
        shell(flameShape(g, 12, 15.5 - (g.s - 2) * 0.6, 3 - (g.s - 2) * 0.4, 9 + g.h * 1.2), { n: 'inner', role: D, on: 'outer' })
      ];
    },
    // 燃烧: the flame flickers upward
    fx: [{ t: 'keys', on: ['outer', 'inner'], o: [12, 22], sy: [1.07, 0.96, 1.04], sx: [0.95, 1.03], ms: 520 }, { t: 'keys', on: ['inner'], o: [12, 18.5], sy: [1.2, 0.9, 1.1], ms: 520 }]
  },
  waves: {
    label: '海浪', key: 'square',
    plan: '主体：三道波浪线（每道四段圆弧，上下交替）',
    weights: { [P]: 1 },
    draw(g) {
      const a = 1.3, w = 4, rr = (w * w / 4 + a * a) / (2 * a), x0 = 4;
      const wave = (y) => { let d = `M${x0} ${n(y)}`; for (let i = 0; i < 4; i++) d += `A${n(rr)} ${n(rr)} 0 0 ${i % 2 ? 0 : 1} ${x0 + (i + 1) * w} ${n(y)}`; return d; };
      return [5.3, 12, 18.7].map((y, i) => line(wave(y), { n: `w${i}`, role: P }));
    },
    // 海浪: the waves roll sideways, one after another
    fx: { t: 'keys', on: [['w0'], ['w1'], ['w2']], by: true, stagger: 90, x: [1, -0.8, 0.2] }
  },
  planet: {
    label: '行星', key: 'landscape', fit: 'x',
    plan: '主体：星球（圆环）；辅助：倾斜的光环（椭圆，后半圈被星球挡住，前半圈压在星球上）。光环压扁后与星球墨量相近',
    weights: { [P]: 0.52, [S]: 0.48 },
    draw(g, ctx) {
      // a flat ring, so the planet shows above and below where it crosses
      const { h } = g, rx = 10.5 - h, ry = 3.5 - h * 0.5, rot = -18;
      if (ctx?.variant === 'fill') {
        // Fill (GUIDE.md §4.1): a dark ring with a clear band either side would take about six
        // units out of the planet and leave a sliver under it. Across the planet the front of the
        // ring is a single cut instead; outside the planet the ring is drawn and joins it.
        // Outside the planet the ring joins it with no clear band, so no stub of it is cut off; it
        // reaches half a stroke into the planet, over the corners where the cut leaves the edge.
        return [
          shell(g.ring(12, 12, 7.5), { n: 'planet', role: P }),
          ...ellipseOutside(12, 12, rx, ry, rot, 7.5 - h - 0.5 * g.s).map((d, i) => line(d, { n: i ? 'back' : 'ring-out', role: S, part: 'ring' })),
          line(halfEllipse(12, 12, rx, ry, rot, 0), { n: 'front', role: S, part: 'ring', on: 'planet' })
        ];
      }
      return [
        line(halfEllipse(12, 12, rx, ry, rot, 180), { n: 'back', role: S, part: 'ring' }),
        shell(g.ring(12, 12, 7.5), { n: 'planet', role: P, occ: true }),
        line(halfEllipse(12, 12, rx, ry, rot, 0), { n: 'front', role: S, part: 'ring', gap: true })
      ];
    },
    light: ['back', 'front'],
    fx: { t: 'wiggle', on: 'all', o: [12, 12], deg: 9, hz: 1.8 }
  },
  paw: {
    allow: { optical: '掌垫在下、四个趾印分开排在上方，按掌垫定位' },
    label: '爪印', key: 'live',
    plan: '主体：掌垫（圆角梯形的轮廓）；辅助：四个趾垫（实心，太小画不出线框，随字重略缩以保持间距）',
    weights: { [P]: 0.52, [S]: 0.48 },
    draw(g) {
      const { h } = g, k = 1.3 - (g.s - 2) * 0.2;
      return [
        shell(g.polygon([[12, 10.6 + h], [18.4 - h, 16.8], [18.4 - h, 22 - h], [5.6 + h, 22 - h], [5.6 + h, 16.8]], [4, 3.6, 3.2, 3.2, 3.6]), { n: 'pad', role: P }),
        ...[[4.1, 9.4], [8.8, 4.3], [15.2, 4.3], [19.9, 9.4]].map(([x, y], i) => solid(g.dot(x, y, k), { n: `t${i}`, role: S }))
      ];
    },
    light: ['t0', 't1', 't2', 't3'],
    // 爪印: the toes press down one after another
    fx: { t: 'keys', on: [['t0'], ['t1'], ['t2'], ['t3']], by: true, stagger: 70, y: [0.8, 0], s: [0.85, 1] }
  },
  cat: {
    label: '猫', key: 'square',
    plan: '主体：猫头（尖耳朵和脸连成一个轮廓）；细节：两只眼睛（实心点）',
    weights: { [P]: 0.9, [D]: 0.1 },
    draw(g) {
      const { h } = g, xl = 3 + h, xr = 21 - h, yb = 21 - h, top = 1.85, yt = 8 + h, k = 0.95 - (g.s - 2) * 0.3;
      return [
        shell(g.polygon([[xl, yb], [xl, top], [9.2, yt], [14.8, yt], [xr, top], [xr, yb]], [6 - h, 1.2, 1.2, 1.2, 1.2, 6 - h]), { n: 'head', role: P }),
        solid(g.dot(8.75, 14.5, k), { n: 'e1', role: D, on: 'head' }),
        solid(g.dot(15.25, 14.5, k), { n: 'e2', role: D, on: 'head' })
      ];
    },
    // 猫: the cat tilts its head
    fx: { t: 'wiggle', on: 'all', o: [12, 21], deg: 7, hz: 2.2 }
  },
  dog: {
    label: '狗', key: 'square',
    plan: '主体：狗头（圆角的竖长方形）和两只下垂的耳朵（水滴形，尖端连在头顶两角，压在头的两侧；耳朵是最好认的部分，和头同为主体）；细节：眼睛和鼻子（实心点）',
    weights: { [P]: 0.9, [D]: 0.1 },
    draw(g, ctx) {
      const k = 0.7 - (g.s - 2) * 0.2;
      // filled, the ears move apart by d at heavy weights, so a stroke of the head stays
      // between their clear bands, and they cut its lower corners less sharply
      const d = ctx?.variant === 'fill' ? Math.max(0, (3 * g.s - 6.5) / 2) : 0;
      return [
        shell(g.box(5, 3, 14, 18, [5.5, 5.5, 6, 6]), { n: 'head', role: P }),
        shell(drop(g, [5.3 - d, 12.6], 2.7, [8 - d, 4.4]), { n: 'ear1', role: P, occ: true }),
        shell(drop(g, [18.7 + d, 12.6], 2.7, [16 + d, 4.4]), { n: 'ear2', role: P, occ: true }),
        // Filled, the face between the ears' clear bands is about 4.5 wide at eye height: eye holes
        // would run into the bands. The fill keeps the ears and the nose, which carry the dog.
        ...(ctx?.variant === 'fill' ? [] : [
          solid(g.dot(10, 12, k), { n: 'e1', role: D, on: 'head' }),
          solid(g.dot(14, 12, k), { n: 'e2', role: D, on: 'head' })
        ]),
        solid(g.rr(10.5, 15, 3, 2, 1), { n: 'nose', role: D, on: 'head' })
      ];
    },
    // 狗: the ears flap
    fx: [{ t: 'wiggle', on: ['ear1'], o: [8, 4.4], deg: 12, hz: 3 }, { t: 'wiggle', on: ['ear2'], o: [16, 4.4], deg: -12, hz: 3 }]
  },
  bird: {
    label: '鸟', key: 'square',
    plan: '主体：鸟身（圆头、圆胸和斜背收成尾尖，一个闭合形）；辅助：喙（实心小三角，压在头的前沿）和两条腿；细节：眼睛（实心点，头里只放得下一个小点，约占 3%）',
    weights: { [P]: 0.76, [S]: 0.21, [D]: 0.03 },
    draw(g) {
      // front at x 17 (centre line): the belly is a quarter circle, the head a half circle on top
      const { h } = g, yb = 17, fx = 17, br = 6.5, hr = 4.5 - h, hx = fx - hr, hy = 7.5;
      const body = `M4 ${yb}H${n(fx - br)}A${br} ${br} 0 0 0 ${fx} ${n(yb - br)}V${hy}A${n(hr)} ${n(hr)} 0 0 0 ${n(hx - hr)} ${hy}Z`;
      return [
        shell(body, { n: 'body', role: P }),
        solid(g.polygon([[fx, 5.9], [22.2, 7.5], [fx, 9.1]], [0.3, 0.4, 0.3]), { n: 'beak', role: S }),
        line(g.seg(9, yb + h, 9, 21 - h) + g.seg(13, yb + h, 13, 21 - h), { n: 'legs', role: S }),
        solid(g.dot(hx, hy, 0.62 - (g.s - 2) * 0.5), { n: 'eye', role: D, on: 'body' })
      ];
    },
    light: ['eye'],
    // 鸟: the bird hops
    fx: { t: 'bounce', on: ['body', 'beak', 'eye'], o: [12, 17], amp: 1.2 }
  },
  fish: {
    label: '鱼', key: 'landscape', fit: 'x',
    plan: '主体：鱼身（水滴形：前面是圆，后面收成尖）；辅助：尾鳍（三角形，尖与鱼身相接）；细节：眼睛（实心点）',
    weights: { [P]: 0.66, [S]: 0.26, [D]: 0.08 },
    draw(g) {
      const { h } = g, J = [7.6, 12];
      return [
        shell(drop(g, [15, 12], 7, J), { n: 'body', role: P }),
        shell(g.polygon([J, [2 + h, 7.4], [2 + h, 16.6]], [0, 1, 1]), { n: 'tail', role: S }),
        solid(g.dot(16.6, 11, 0.85 - (g.s - 2) * 0.3), { n: 'eye', role: D, on: 'body' })
      ];
    },
    // 游: the tail beats and the fish darts forward
    fx: [{ t: 'wiggle', on: ['tail'], o: [7.6, 12], deg: 16, hz: 4 }, { t: 'keys', on: ['body', 'eye'], x: [0.8, -0.2], ms: 380 }]
  },
  butterfly: {
    label: '蝴蝶', key: 'live',
    plan: '主体：四片翅膀（水滴形，尖端都指向身体，上大下小）；辅助：身体（竖线）和两根触角',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const { h } = g, wing = (sx) => [
        shell(drop(g, [12 + sx * 5, 8.4], 5, [12 + sx * 0.8, 12]), { n: sx < 0 ? 'w1' : 'w2', role: P, part: 'wings' }),
        shell(drop(g, [12 + sx * 4.6, 19.1], 2.9, [12 + sx * 0.8, 15]), { n: sx < 0 ? 'w3' : 'w4', role: P, part: 'wings' })
      ];
      return [
        ...wing(-1), ...wing(1),
        line(g.seg(12, 7, 12, 18) + g.pl([[10.2, 2 + h], [12, 6.4], [13.8, 2 + h]]), { n: 'body', role: S, part: 'wings' })
      ];
    },
    light: [],
    // 振翅: the wings beat
    fx: { t: 'keys', on: ['w1', 'w2', 'w3', 'w4'], o: [12, 13], sx: [0.55, 1, 0.65, 1], ms: 560 }
  },
  'flower-tulip': {
    anchor: 'base',
    label: '郁金香', key: 'portrait', fit: 'y',
    plan: '主体：花苞（上沿三个尖瓣，下面是圆底）；辅助：茎和一片叶子',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const { h } = g, x0 = 6 + h, x1 = 18 - h, yb = 15 - h, c = 5.5 - h;
      return [
        line(g.seg(12, 15, 12, 22 - h), { n: 'stem', role: S }),
        shell(lensBy([12, 20.5], [17.75, 16.25], 1.4), { n: 'leaf', role: S }),
        shell(g.polygon([[x0, 3.5 + h], [9, 6.5], [12, 2 + h * 1.2], [15, 6.5], [x1, 3.5 + h], [x1, yb], [x0, yb]], [1, 0.4, 1, 0.4, 1, c, c]), { n: 'head', role: P })
      ];
    },
    light: ['stem', 'leaf'],
    // 郁金香: the flower sways on its stem
    fx: { t: 'wiggle', on: 'all', o: [12, 22], deg: 6, hz: 2.2 },
    allow: { keyline: '花本身窄，宽 12' }
  },
  sunflower: {
    label: '向日葵', key: 'circle',
    plan: '主体：十片花瓣（十个圆连成的波浪形外轮廓，比花的五瓣细密）；细节：大的花盘（圆环）',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g) {
      return [
        shell(scallop(g, 12, 12, 10, 6.5, 3.5), { n: 'petals', role: P }),
        shell(g.ring(12, 12, 4.25 - Math.max(0, g.s - 2) * 0.5), { n: 'disc', role: D, on: 'petals' })
      ];
    },
    // 向日葵: the head turns a tenth of a turn, landing on itself
    fx: { t: 'rotate', on: ['petals'], deg: 36 }
  },
  clover: {
    label: '四叶草', key: 'square',
    ends: 'in',
    plan: '主体：四片圆叶（上下左右四个圆连成一个轮廓）；辅助：茎（叶脉在右下的延长，伸出叶外）；细节：斜十字的叶脉（从中心伸向四个凹口）。叶脉有四条，约占三成',
    weights: { [P]: 0.6, [S]: 0.12, [D]: 0.28 },
    draw(g) {
      const c = 11.5, d = 4, R = 4.5, r = R - g.h, q = Math.SQRT1_2, rho = d * q + Math.sqrt(r * r - (d * q) ** 2), e = rho * q;
      return [
        shell(scallop(g, c, c, 4, d, R, -90), { n: 'leaves', role: P }),
        line(g.seg(c - e, c - e, c + e, c + e), { n: 'vein1', role: D, on: 'leaves' }),
        line(g.seg(c + e, c - e, c - e, c + e), { n: 'vein2', role: D, on: 'leaves' }),
        line(g.seg(c + e, c + e, 21 - g.h * q, 21 - g.h * q), { n: 'stem', role: S })
      ];
    },
    light: [],
    // 四叶草: the clover turns a quarter of a turn on its stem
    fx: { t: 'wiggle', on: 'all', o: [20, 20], deg: 8, hz: 2.2 }
  },
  cactus: {
    anchor: 'base',
    label: '仙人掌', key: 'portrait',
    plan: '主体：主干（圆顶，立在地面上）；辅助：左右两条弯起的枝（单线，左低右高）和地面线。两条枝和地面线合起来比主干长，主干约占四成半',
    weights: { [P]: 0.45, [S]: 0.55 },
    draw(g) {
      const { h } = g, yb = 22 - h;
      return [
        line(`M10 ${n(yb)}V5A2 2 0 0 1 14 5V${n(yb)}`, { n: 'trunk', role: P, only: 'outline' }),
        shell(g.rr(10, 3, 4, yb - 3, [2, 2, 0, 0]), { n: 'trunk', role: P, only: 'fill' }),
        line('M10 14H8A3 3 0 0 1 5 11V8', { n: 'armL', role: S }),
        line('M14 12H16A3 3 0 0 0 19 9V6', { n: 'armR', role: S }),
        line(g.span(4, yb, 20, yb), { n: 'ground', role: S })
      ];
    },
    light: [],
    // 仙人掌: the arms rise a little, as if stretching
    fx: [{ t: 'keys', on: ['armL'], o: [10, 14], r: [8, -2], ms: 360 }, { t: 'keys', on: ['armR'], o: [14, 12], r: [-8, 2], ms: 360 }]
  },
  mushroom: {
    anchor: 'base',
    label: '蘑菇', key: 'square',
    plan: '主体：菌盖（宽的圆顶，下沿平）；辅助：菌柄（从菌盖下伸出的短柱）',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) {
      const { h } = g, top = 13;
      return [
        line(cup(9, top - h, 15, 21 - h, 3 - h), { n: 'stem', role: S, only: 'outline' }),
        shell(g.rr(8 + h, top - h, 8 - g.s, 21 - top, [0, 0, 3 - h, 3 - h]), { n: 'stem', role: S, only: 'fill' }),
        shell(g.box(3, 3, 18, top - 3, [8.5, 8.5, 2, 2]), { n: 'cap', role: P })
      ];
    },
    light: [],
    // 蘑菇: the mushroom pops up from the ground
    fx: { t: 'keys', on: 'all', o: [12, 21], sy: [0.8, 1.06], ms: 380 }
  },
  'tree-palm': {
    anchor: 'base',
    label: '棕榈树', key: 'live',
    plan: '主体：四片下垂的叶（单线曲线，从树顶向两侧散开）；辅助：微弯的树干',
    weights: { [P]: 0.75, [S]: 0.25 },
    draw(g) {
      const { h } = g, T = [12, 7];
      const frond = (c, e) => `M${T[0]} ${T[1]}Q${c[0]} ${c[1]} ${e[0]} ${e[1]}`;
      return [
        line(`M12 7Q12 16 15 ${n(22 - h)}`, { n: 'trunk', role: S }),
        line(frond([7, -1], [2 + h, 8]) + frond([17, -1], [22 - h, 8]), { n: 'top', role: P }),
        line(frond([7, 7], [5, 12.5]) + frond([17, 7], [19, 12.5]), { n: 'low', role: P })
      ];
    },
    // 棕榈树: the fronds sway in the sea breeze
    fx: [{ t: 'wiggle', on: ['top', 'low'], o: [12, 7], deg: 7, hz: 2 }, { t: 'wiggle', on: ['trunk'], o: [15, 22], deg: 2, hz: 2 }]
  },
  trees: {
    anchor: 'base',
    label: '树林', key: 'live',
    plan: '主体：两棵树的树冠（左边圆形的树冠在后，右边两层的松树在前，挡住一部分）；辅助：两根树干',
    weights: { [P]: 0.84, [S]: 0.16 },
    draw(g) {
      const { h } = g, yb = 17;
      return [
        shell(g.ring(7, 7, 5), { n: 'round', role: P }),
        line(g.seg(7, 12 - h, 7, 22 - h), { n: 'trunkL', role: S }),
        shell(g.polygon([[16, 2 + h * 1.2], [19.6, 9], [18.2, 9], [22 - h, yb], [10 + h, yb], [13.8, 9], [12.4, 9]], [1, 0.6, 0, 0.8, 0.8, 0, 0.6]), { n: 'pine', role: P, occ: true }),
        line(g.seg(16, yb, 16, 22 - h), { n: 'trunkR', role: S })
      ];
    },
    light: [],
    // 树林: the two trees sway one after the other
    fx: { t: 'keys', on: [['round', 'trunkL'], ['pine', 'trunkR']], by: true, stagger: 120, o: [12, 22], r: [3, -1.5, 0], ms: 520 }
  },
  'mountain-snow': {
    anchor: 'base',
    label: '雪山', key: 'landscape',
    ends: 'out',
    plan: '主体：两座山峰（同山）；细节：高峰上的雪线（V 形折线，两端接到山坡，在面性中把雪顶分开）',
    weights: { [P]: 0.84, [D]: 0.16 },
    draw(g) {
      const { h } = g, pk = PEAKS(20 - h), y = 9;
      const L = [xAt(pk[0], pk[1], y), y], R = [xAt(pk[1], pk[2], y), y];
      return [
        shell(g.polygon(pk, [0.8, 1.2, 0.5, 1.2, 0.8]), { n: 'peaks', role: P }),
        line(g.pl([L, [8.8, 10.6], R]), { n: 'snow', role: D, on: 'peaks' })
      ];
    },
    // 雪山: the snow line is drawn across the peak
    fx: [{ t: 'bounce', on: ['peaks', 'snow'], o: [12, 20], amp: 0.6 }, { t: 'draw', on: ['snow'] }]
  },
  volcano: {
    anchor: 'base',
    label: '火山', key: 'landscape',
    plan: '主体：山体（上窄下宽的梯形，顶上是火山口）；辅助：从火山口喷出的三道短线',
    weights: { [P]: 0.74, [S]: 0.26 },
    draw(g) {
      const { h } = g, yb = 20 - h, top = 10.5;
      return [
        shell(g.polygon([[2.6, yb], [8.6, top], [10.6, top], [12, 11.8], [13.4, top], [15.4, top], [21.4, yb]], [0.8, 1, 0.5, 0.5, 0.5, 1, 0.8]), { n: 'mountain', role: P }),
        line(g.span(12, 4, 12, 8), { n: 'e0', role: S }),
        line(g.span(8.6, 8, 6.6, 5), { n: 'e1', role: S }),
        line(g.span(15.4, 8, 17.4, 5), { n: 'e2', role: S })
      ];
    },
    light: ['e0', 'e1', 'e2'],
    // 火山: the eruption shoots up and fades, again
    fx: { t: 'keys', on: [['e0'], ['e1'], ['e2']], by: true, stagger: 70, y: [-1.2, 0.6, 0], a: [0, 0, 1], ms: 520 }
  },
  feather: {
    label: '羽毛', key: 'live',
    ends: 'in',
    plan: '主体：羽片（方形，右上是大圆角，左上和右下斜切）；辅助：羽根（伸出羽片的斜线）；细节：羽轴（羽根在羽片里的延长）和一道与羽轴垂直的羽枝',
    weights: { [P]: 0.66, [S]: 0.08, [D]: 0.26 },
    draw(g) {
      const { h } = g, a = 5 + h, b = 20 - h, t = 2 + h, r = 22 - h, k = 5 + h * 0.7;
      return [
        shell(g.polygon([[a, b], [a, 11], [14, t], [r, t], [r, 11], [14, b]], [1.2, 1.4, 1.4, 7 - h, 1.4, 1.4]), { n: 'vane', role: P }),
        line(g.seg(2 + h * 0.7, 22 - h * 0.7, k, 22 - k), { n: 'quill', role: S }),
        line(g.seg(k, 22 - k, 16, 8), { n: 'rachis', role: D, on: 'vane' }),
        line(g.seg(11.4, 11.7, 13.9, 14.8), { n: 'barb', role: D, on: 'vane' })
      ];
    },
    // 羽毛: the feather drifts down, rocking
    fx: { t: 'keys', on: 'all', o: [12, 12], r: [-5, 4, -1.5], y: [0.5, 0.2, 0], ms: 640 }
  },
  snail: {
    anchor: 'base',
    label: '蜗牛', key: 'landscape', fit: 'x',
    plan: '主体：螺壳（圆环）；辅助：身体（底线向右弯起成头）和两根触角；细节：壳里的螺纹（四分之三圈的圆弧）',
    weights: { [P]: 0.46, [S]: 0.38, [D]: 0.16 },
    draw(g, ctx) {
      // the whorl: three quarters of a turn; filled, a round hole (a small arc would leave a
      // thin dot of ink inside it)
      const r = 2 - Math.max(0, g.s - 2) * 1.2, cy = 15 - g.h;
      return [
        line('M3 20H16A3 3 0 0 0 19 17V11', { n: 'body', role: S }),
        line(g.pl([[17, 6.5], [19, 11], [21, 6.5]]), { n: 'feelers', role: S }),
        shell(g.ring(10, 14 - g.h + 1, 6.5), { n: 'shell', role: P }),
        ctx?.variant === 'fill' ? solid(g.circ(10, cy, r + g.h), { n: 'whorl', role: D, on: 'shell' }) : line(g.arc(10, cy, r, 90, 360), { n: 'whorl', role: D, on: 'shell' })
      ];
    },
    light: ['whorl'],
    // 蜗牛: the snail creeps forward and its feelers wave
    fx: [{ t: 'keys', on: ['body', 'shell', 'whorl'], x: [0.7, 0], ms: 640 }, { t: 'keys', on: ['feelers'], x: [0.7, 0], r: [8, -4, 0], o: [19, 11], ms: 640 }]
  },
  turtle: {
    anchor: 'base',
    label: '乌龟', key: 'landscape', fit: 'x',
    plan: '主体：龟壳（半圆顶，底边平）；辅助：头（圆环，在右前方，挡住壳的一角）和两条腿',
    weights: { [P]: 0.54, [S]: 0.46 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(2, 5, 15, 11, [7, 7, 2, 2]), { n: 'shell', role: P }),
        line(g.seg(5, 16 - h, 5, 20 - h) + g.seg(14, 16 - h, 14, 20 - h), { n: 'legs', role: S }),
        shell(g.ring(19, 10, 3), { n: 'head', role: S, occ: true })
      ];
    },
    light: [],
    // 乌龟: the head pokes out and the turtle steps along
    fx: [{ t: 'keys', on: ['head'], x: [0.9, 0], ms: 420 }, { t: 'keys', on: ['legs'], o: [9.5, 16], r: [4, -4, 0], ms: 420 }]
  },
  rabbit: {
    label: '兔子', key: 'portrait', fit: 'y',
    plan: '主体：头（圆环）和两只长耳朵（水滴形，尖端藏在头后面；耳朵最好认，和头同为主体）；细节：两只眼睛（实心点）',
    weights: { [P]: 0.92, [D]: 0.08 },
    draw(g) {
      const k = 0.75 - (g.s - 2) * 0.3;
      return [
        shell(drop(g, [8, 5.25], 3, [10.5, 12]), { n: 'ear1', role: P }),
        shell(drop(g, [16, 5.25], 3, [13.5, 12]), { n: 'ear2', role: P }),
        shell(g.ring(12, 15.5, 6.5), { n: 'head', role: P, occ: true }),
        solid(g.dot(9.75, 15, k), { n: 'e1', role: D, on: 'head' }),
        solid(g.dot(14.25, 15, k), { n: 'e2', role: D, on: 'head' })
      ];
    },
    // 兔子: the ears twitch
    fx: [{ t: 'wiggle', on: ['ear1'], o: [10.5, 11], deg: -10, hz: 3 }, { t: 'wiggle', on: ['ear2'], o: [13.5, 11], deg: 10, hz: 3 }],
    allow: { keyline: '兔头本身窄，宽 13' }
  },
  bee: {
    label: '蜜蜂', key: 'live', fit: 'x',
    ends: 'out',
    plan: '主体：身体（横放的胶囊形）；辅助：两片翅膀（水滴形，尖端藏在身体后面）；细节：身体上的两道条纹（在面性中把身体分成三节）',
    weights: { [P]: 0.46, [S]: 0.32, [D]: 0.22 },
    draw(g) {
      const { h } = g;
      return [
        shell(drop(g, [8.5, 5.5], 3, [10, 11]), { n: 'wing1', role: S }),
        shell(drop(g, [15.5, 5.5], 3, [14, 11]), { n: 'wing2', role: S }),
        shell(g.box(2, 10, 20, 10, 5), { n: 'body', role: P, occ: true }),
        line(g.seg(9, 10 + h, 9, 20 - h), { n: 'band1', role: D, on: 'body' }),
        line(g.seg(15, 10 + h, 15, 20 - h), { n: 'band2', role: D, on: 'body' })
      ];
    },
    light: ['band1', 'band2'],
    // 蜜蜂: the wings buzz
    fx: [{ t: 'wiggle', on: ['wing1'], o: [10, 11], deg: -14, hz: 6 }, { t: 'wiggle', on: ['wing2'], o: [14, 11], deg: 14, hz: 6 }]
  },
  ladybug: {
    label: '瓢虫', key: 'square', fit: 'y',
    ends: 'out',
    plan: '主体：圆形的身体；辅助：头（实心半圆，压在身体上沿，太小画不出线框）；细节：中间的分界线（两片鞘翅之间，面性中把身体分成两半）和两个斑点（实心点）',
    weights: { [P]: 0.66, [S]: 0.1, [D]: 0.24 },
    draw(g, ctx) {
      const { h } = g, k = 0.75 - (g.s - 2) * 0.5;
      // filled, the heavier weights leave no stroke of ink between the spots and the split, so
      // the fill keeps the split only
      const spots = ctx?.variant === 'fill' && g.s > 2 ? [] : [[8.25, 13.5], [15.75, 13.5]];
      return [
        solid('M8.5 6A3.5 3.5 0 0 1 15.5 6Z', { n: 'head', role: S }),
        shell(g.ring(12, 13.5, 8.5), { n: 'body', role: P }),
        line(g.seg(12, 5 + h, 12, 22 - h), { n: 'split', role: D, on: 'body' }),
        ...spots.map(([x, y], i) => solid(g.dot(x, y, k), { n: `s${i}`, role: D, on: 'body' }))
      ];
    },
    // 瓢虫: the ladybug crawls, rocking side to side
    fx: { t: 'wiggle', on: 'all', o: [12, 13.5], deg: 9, hz: 2.4 },
    allow: { keyline: '瓢虫的身体是圆，宽 17' }
  },
  owl: {
    label: '猫头鹰', key: 'live', fit: 'x',
    plan: '主体：身体（两只耳羽和圆底连成一个轮廓）；细节：两只大眼睛（圆环）和喙（实心小三角）',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g) {
      const { h } = g, xl = 2 + h, xr = 22 - h, top = 2 + h, yb = 22 - h, R = 2.5 - Math.max(0, g.s - 2) * 0.5;
      return [
        shell(g.polygon([[xl, yb], [xl, top], [8.5, 7], [15.5, 7], [xr, top], [xr, yb]], [7 - h, 1.2, 2, 2, 1.2, 7 - h]), { n: 'body', role: P }),
        shell(g.ring(8.5, 12.5, R), { n: 'eye1', role: D, on: 'body' }),
        shell(g.ring(15.5, 12.5, R), { n: 'eye2', role: D, on: 'body' }),
        solid(g.polygon([[10.75, 16.5], [13.25, 16.5], [12, 18.5]], [0.3, 0.3, 0.4]), { n: 'beak', role: D, on: 'body' })
      ];
    },
    // 猫头鹰: the owl blinks
    fx: [{ t: 'keys', on: ['eye1'], o: [8.5, 12.5], sy: [0.15, 1], ms: 300 }, { t: 'keys', on: ['eye2'], o: [15.5, 12.5], sy: [0.15, 1], ms: 300 }]
  },
  'solar-panel': {
    anchor: 'base',
    label: '太阳能板', key: 'landscape', fit: 'x',
    ends: 'out',
    plan: '主体：面板（横放的圆角矩形）；辅助：支架和底座；细节：把面板分成六格的网格线（面性中切开成六块）',
    weights: { [P]: 0.44, [S]: 0.16, [D]: 0.4 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(2, 3, 20, 12, 2.5), { n: 'panel', role: P }),
        line(g.seg(2 + h, 9, 22 - h, 9), { n: 'row', role: D, on: 'panel' }),
        line(g.seg(9, 3 + h, 9, 15 - h), { n: 'col1', role: D, on: 'panel' }),
        line(g.seg(15, 3 + h, 15, 15 - h), { n: 'col2', role: D, on: 'panel' }),
        line(g.seg(12, 15, 12, 21 - h) + g.span(7, 21 - h, 17, 21 - h), { n: 'stand', role: S })
      ];
    },
    light: ['row', 'col1', 'col2'],
    // 太阳能板: light runs across the cells
    fx: { t: 'draw', on: ['row', 'col1', 'col2'], stagger: 90 }
  }
};
