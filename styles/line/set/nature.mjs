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
};
