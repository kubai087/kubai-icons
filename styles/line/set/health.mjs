// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// health: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: first-aid hospital-cross pill pills heart-pulse stethoscope syringe bandage virus brain tooth ambulance
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { enclose, slash } from '../kit.mjs';
import { off } from '../variants.mjs';
import { fitEnds } from '../ends.mjs';

const R2 = Math.SQRT1_2;
const pt = (q) => `${n(q[0])} ${n(q[1])}`;

// The medical cross. Its arms are a third of its span: the outlined cross (hospital-cross) is 6
// wide over 18, the stroked plus in the first-aid case 2 wide over 7.
const plus = (g, cx, cy, half) => g.seg(cx, cy - half, cx, cy + half) + g.seg(cx - half, cy, cx + half, cy);

// The capsule (pill, pills): a rounded bar at 45°, outer size L x w, centred on c, and the line
// across its middle that splits it in two halves.
function capsule(g, c, L, w) {
  const { s, h } = g, v = w / 2 - h;
  return {
    body: g.rot(c[0], c[1], L - s, w - s, -45, (w - s) / 2),
    split: g.seg(c[0] - v * R2, c[1] - v * R2, c[0] + v * R2, c[1] + v * R2)
  };
}

// Closed outline round a ring of overlapping circles, given clockwise as [x, y, R] (outer radius):
// each circle's arc runs clockwise from where it meets the one before to where it meets the next.
function lobes(g, C) {
  const cs = C.map(([x, y, R]) => [x, y, R - g.h]), N = cs.length;
  const mx = cs.reduce((a, c) => a + c[0], 0) / N, my = cs.reduce((a, c) => a + c[1], 0) / N;
  const meet = ([x1, y1, r1], [x2, y2, r2]) => {
    const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy), a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), hh = Math.sqrt(Math.max(r1 * r1 - a * a, 0));
    const px = x1 + (a * dx) / d, py = y1 + (a * dy) / d, p = [[px + (hh * dy) / d, py - (hh * dx) / d], [px - (hh * dy) / d, py + (hh * dx) / d]];
    return p.sort((u, w) => Math.hypot(w[0] - mx, w[1] - my) - Math.hypot(u[0] - mx, u[1] - my))[0];
  };
  const M = cs.map((c, i) => meet(c, cs[(i + 1) % N]));
  let d = `M${pt(M[N - 1])}`;
  cs.forEach(([x, y, r], i) => {
    const from = M[(i - 1 + N) % N], to = M[i], ang = (q) => Math.atan2(q[1] - y, q[0] - x);
    const turn = ((((ang(to) - ang(from)) * 180) / Math.PI) + 360) % 360;
    d += `A${n(r)} ${n(r)} 0 ${turn > 180 ? 1 : 0} 1 ${pt(to)}`;
  });
  return { d: d + 'Z', M };
}

// The ambulance in the fill variant (GUIDE.md §4.1), as the car family's (transport.mjs): one solid
// body arching over each wheel a clear space away, the wheels a little smaller (FR; a knock-out
// ring keeps the ring solid-tint fills as it is), and the body coming down only as far as leaves
// a stroke of ink at each end beside its arch and, a little more, between the wheels. The front
// window is a hole where the outline's pane is; the cross, a hole too, keeps a stroke clear of the
// roof and the arch, and moves up to do so. The roof sits on the keyline (4) like the rest of the
// family, so the shorter body's weight does not ride high; from 2 it rises toward the outline's
// 3 (2.5), where the cross needs the room.
const AMB = { WY: 17, FR: 2.5, WX: [7, 17] };
function ambulanceFill(g) {
  const { h, s } = g, d = s - 2, t = 4 - Math.min(1, Math.max(0, 2 * d)) + h, xr = 22 - h, x0 = 2 + h, { WY, FR, WX } = AMB, A = FR + g.clear;
  const at = (w) => WY - Math.sqrt(Math.max(0, A * A - w * w)), end = at(WX[0] - 2 - s), sill = at((WX[1] - WX[0]) / 2 - 0.7 * s);
  // the arch over the wheel at wx, from its right foot (bottom yr) to its left (yl), by centre line
  const arch = (wx, yr, yl) => {
    const R = A + h, ang = (yb) => (Math.asin(Math.min(1, (WY - yb + h) / R)) * 180) / Math.PI, a0 = -ang(yr), a1 = ang(yl) - 180;
    return Array.from({ length: 13 }, (_, k) => { const a = ((a0 + ((a1 - a0) * k) / 12) * Math.PI) / 180; return [wx + R * Math.cos(a), WY + R * Math.sin(a), 0]; });
  };
  const pts = [[x0, end - h, 0.5], [x0, t, 3 - h], [15, t, 1.5], [xr, t + 6, 1.2], [xr, end - h, 0.5], ...arch(WX[1], end, sill), ...arch(WX[0], sill, end)];
  const body = g.polygon(pts.map(([px, py]) => [px, py]), pts.map((p) => p[2]));
  // the front window: right of the pillar, under the slant's inner edge, over the belt (lowered
  // toward the arch while a stroke is left over it)
  const run = (xr - 15) / 6, off = (h * Math.hypot(xr - 15, 6)) / 6, yB = Math.min(11, WY - FR - g.clear - s);
  const yAt = (x) => t + (x - 15 + off) / run, y1 = yAt(15 + h), y2 = yAt(22 - s);
  const pane = y2 < yB
    ? g.polygon([[15 + h, y1], [22 - s, y2], [22 - s, yB], [15 + h, yB]], [0.5, Math.max(0.5, 1.2 - h), 0.5, 0.5])
    : g.polygon([[15 + h, y1], [15 + (yB - t) * run - off, yB], [15 + h, yB]], 0.5);
  // the cross at x 8: as large as fits (up to its outline size) a stroke clear of the roof and of
  // the arch, halfway between the two
  const far = (half, cy) => {
    const seg = (ax, ay, bx, by) => { const [px, py] = [WX[0], WY], L2 = (bx - ax) ** 2 + (by - ay) ** 2, u = Math.max(0, Math.min(1, ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / L2)); return Math.hypot(ax + u * (bx - ax) - px, ay + u * (by - ay) - py); };
    return Math.min(seg(8, cy - half, 8, cy + half), seg(8 - half, cy, 8 + half, cy)) - h >= A + s - 1e-9 && cy + half + h + s <= sill + 1e-9;
  };
  let half = 1.5 - d * 0.25, lo, hi;
  for (; half > 0.5; half -= 0.025) {
    lo = t + s + half; // a stroke under the roof's outer edge (t - h)
    for (hi = lo; far(half, hi + 0.01); hi += 0.01);
    if (far(half, lo)) break;
  }
  return [
    shell(body, { n: 'body', role: P }),
    line(plus(g, 8, Math.min(10, (lo + hi) / 2), half), { n: 'cross', role: D, on: 'body' }),
    solid(pane, { n: 'window', role: D, on: 'body' })
  ];
}

// A zigzag knocked out of a fill leaves a sharp point of ink inside each turn, thinner than a
// stroke near its tip (GUIDE.md §4.1). These fillets, knocked out with the line, round the hole's
// inner corners to half a stroke (as its round joins round the outer ones), or as near as the arms
// allow.
function fillets(g, pts) {
  const { h } = g;
  let d = '';
  for (let i = 1; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i - 1], [vx, vy] = pts[i], [bx, by] = pts[i + 1];
    const u = [(ax - vx) / Math.hypot(ax - vx, ay - vy), (ay - vy) / Math.hypot(ax - vx, ay - vy)];
    const w = [(bx - vx) / Math.hypot(bx - vx, by - vy), (by - vy) / Math.hypot(bx - vx, by - vy)];
    const th = Math.acos(u[0] * w[0] + u[1] * w[1]);
    if (th > (100 * Math.PI) / 180) continue;
    const b = [(u[0] + w[0]) / Math.hypot(u[0] + w[0], u[1] + w[1]), (u[1] + w[1]) / Math.hypot(u[0] + w[0], u[1] + w[1])];
    // the inner edges run from the corner's point (p) along the arms; on a short arm the fillet
    // takes what room there is, ending short of the arm's other end
    const p = [vx + (b[0] * h) / Math.sin(th / 2), vy + (b[1] * h) / Math.sin(th / 2)], back = h / Math.tan(th / 2);
    const room = Math.min(Math.hypot(ax - vx, ay - vy), Math.hypot(bx - vx, by - vy)) - back - 0.1;
    const t = Math.min(h / Math.tan(th / 2), room), r = t * Math.tan(th / 2);
    if (t <= 0) continue;
    const t1 = [p[0] + u[0] * t, p[1] + u[1] * t], t2 = [p[0] + w[0] * t, p[1] + w[1] * t];
    // from the vertex (inside the stroke, so the two knock-outs overlap) out to the inner edges,
    // and back round the arc that bulges toward the corner
    const sweep = u[0] * w[1] - u[1] * w[0] > 0 ? 0 : 1;
    d += `M${pt([vx, vy])}L${pt(t1)}A${n(r)} ${n(r)} 0 0 ${sweep} ${pt(t2)}Z`;
  }
  return d;
}

const set = {
  'first-aid': {
    label: '急救箱', key: 'landscape',
    plan: '主体：箱体；辅助：提手；细节：十字（线条加号，臂宽与跨度之比与医疗十字相同，约三分之一）',
    weights: { [P]: 0.7, [S]: 0.14, [D]: 0.16 },
    draw(g) {
      const { h } = g, d = g.s - 2, t = 2 + h, c = 1.5;
      return [
        line(`M9 ${n(6 + h)}V${n(t + c)}A${c} ${c} 0 0 1 ${9 + c} ${n(t)}H${15 - c}A${c} ${c} 0 0 1 15 ${n(t + c)}V${n(6 + h)}`, { n: 'handle', role: S }),
        shell(g.box(2, 6, 20, 14, 3.5), { n: 'case', role: P }),
        line(plus(g, 12, 13, 2.5 - d), { n: 'cross', role: D, on: 'case' })
      ];
    },
    light: ['cross'],
    // 急救箱: carried by the handle, it swings and settles
    fx: { t: 'wiggle', on: 'all', o: [12, 2], deg: 7, hz: 2.4 },
    allow: { keyline: '提手高出横向参考线 2，与相机的凸起同理' }
  },
  'hospital-cross': {
    label: '医疗', key: 'square',
    plan: '主体：十字（一个闭合形，臂宽 6，是跨度 18 的三分之一；凸角倒圆，凹角为直角）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, a = 9 + h, b = 15 - h, e = 3 + h, f = 21 - h, c = 2 - h;
      const pts = [[a, e], [b, e], [b, a], [f, a], [f, b], [b, b], [b, f], [a, f], [a, b], [e, b], [e, a], [a, a]];
      return [shell(g.polygon(pts, pts.map((_, i) => (i % 3 === 2 ? 0 : c))), { n: 'cross', role: P })];
    },
    // 医疗: the cross pulses twice, like a heartbeat
    fx: { t: 'beat', on: 'all', o: [12, 12], amp: 0.1 }
  },
  pill: {
    label: '胶囊', key: 'live',
    ends: 'out',
    plan: '主体：胶囊（45° 斜放的圆头长条）；细节：中间分成两半的线',
    weights: { [P]: 0.9, [D]: 0.1 },
    draw(g) {
      const c = capsule(g, [12, 12], 25, 8);
      return [shell(c.body, { n: 'body', role: P }), line(c.split, { n: 'split', role: D, on: 'body' })];
    },
    // 胶囊: turns half a turn, landing on itself
    fx: { t: 'rotate', on: 'all', deg: 180, dip: 0.1 }
  },
  pills: {
    label: '药片', key: 'live',
    ends: 'out',
    plan: '主体：胶囊（与胶囊图标同一形状，缩短）；辅助：圆形药片；细节：胶囊的分隔线和药片的刻痕（两条线都横贯整个形状，约占四分之一）',
    weights: { [P]: 0.4, [S]: 0.36, [D]: 0.24 },
    draw(g, ctx) {
      const { h, s } = g, c = capsule(g, [8.5, 8.5], 15, 7), t = [16.25, 16.25], r = 5.75 - h;
      // In the fill variant the tablet is drawn as its two halves: a cut across the disc would meet
      // its edge short of square and leave sharp tips (GUIDE.md §4.1).
      const half = (k) => {
        const q = Math.sqrt(r * r - s * s), a = (Math.atan2(k, k) * 180) / Math.PI, da = (Math.atan2(q, s) * 180) / Math.PI;
        const P = Array.from({ length: 17 }, (_, i) => { const b = ((a - da + (2 * da * i) / 16) * Math.PI) / 180; return [t[0] + r * Math.cos(b), t[1] + r * Math.sin(b)]; });
        return g.polygon(P, 0);
      };
      return [
        shell(c.body, { n: 'cap', role: P }),
        line(c.split, { n: 'split', role: D, on: 'cap' }),
        shell(ctx?.variant === 'fill' ? half(1) + half(-1) : g.ring(t[0], t[1], 5.75), { n: 'tab', role: S }),
        line(g.seg(t[0] - r * R2, t[1] + r * R2, t[0] + r * R2, t[1] - r * R2), { n: 'score', role: D, on: 'tab' })
      ];
    },
    fx: { t: 'bounce', on: [['cap', 'split'], ['tab', 'score']], by: true, o: [12, 22], amp: 1 }
  },
  'heart-pulse': {
    nudge: [0, 0.7],
    label: '心率', key: 'live', fit: 'x',
    plan: '主体：心形（与喜欢相同）；细节：心电线（两端接到心形两侧，起伏避开顶部凹口）',
    weights: { [P]: 0.67, [D]: 0.33 },
    draw(g, ctx) {
      const { h, s } = g, y = 13, cx = 12 - (10 - 5.6), cy = 4.1 + 5.6, r = 5.6 - h, dx = Math.sqrt(r * r - (y - cy) ** 2);
      const xl = cx - dx, xr = 24 - xl, zig = [[7.5, y], [9, 10.25], [12, 16.25], [14.5, 10.75], [16, y]];
      if (ctx?.variant === 'fill') {
        // The pulse stays inside with a stroke of rim (GUIDE.md §4.1): its ends come in to where
        // the rim allows, and at the heavier weights, where its turns would come too close to the
        // edge, the zigzag is centred and drawn a little smaller.
        const d = heart(g), end = +fitEnds(g.seg(12, y, xr, y), { k: 'shell', d }, s, 'in').split('L')[1].split(' ')[0];
        const k = Math.min(1, (end - 12) / 4.25), z = zig.map(([px, py]) => [12 + (px - 11.75) * k, y + (py - y) * k]);
        const pts = [...(24 - end < z[0][0] - 0.05 ? [[24 - end, y]] : []), ...z, ...(end > z[4][0] + 0.05 ? [[end, y]] : [])];
        return [
          shell(d, { n: 'heart', role: P }),
          line(g.pl(pts), { n: 'pulse', role: D, on: 'heart', ends: 'keep' }),
          solid(fillets(g, pts), { n: 'pulse', role: D, on: 'heart', only: 'fill' })
        ];
      }
      return [
        shell(heart(g), { n: 'heart', role: P }),
        line(g.pl([[xl, y], ...zig, [xr, y]]), { n: 'pulse', role: D, on: 'heart' })
      ];
    },
    fx: [{ t: 'beat', on: 'all', o: [12, 12.5] }, { t: 'draw', on: ['pulse'] }]
  },
  stethoscope: {
    label: '听诊器', key: 'square',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：耳管和导管（一笔线条：U 形耳管，向下再弯向右上）；辅助：听头（圆环）',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      return [
        line('M6 4H5A1 1 0 0 0 4 5V8A4 4 0 0 0 12 8V5A1 1 0 0 0 11 4H10M8 12V15A5 5 0 0 0 18 15V12.5', { n: 'tube', role: P }),
        shell(g.ring(18, 10.5, 3), { n: 'head', role: S })
      ];
    },
    // 听诊: the chest piece beats like the heart it listens to
    fx: { t: 'beat', on: ['head'], o: [18, 10.5], amp: 0.16 }
  },
  syringe: {
    label: '注射器', key: 'live',
    plan: '主体：针筒（45° 斜放）；辅助：针头、指托、推杆和推柄；细节：针筒上两道刻度。辅助部件多，墨量与针筒相当',
    weights: { [P]: 0.38, [S]: 0.5, [D]: 0.12 },
    draw(g, ctx) {
      const { h, s } = g, O = [3.1, 20.9], A = [R2, -R2], B = [R2, R2];
      const at = (u, v = 0) => [O[0] + A[0] * u + B[0] * v, O[1] + A[1] * u + B[1] * v];
      const bc = at(11.5), w = 7, e = w / 2 - h;
      // In the fill variant the ticks cut in from the barrel's edge (GUIDE.md §4.1) and spread so a
      // stroke stays between them and from the ends (the top end runs into the finger grip); at
      // the heaviest weights there is not quite room, and the three spaces are made equal.
      let t0 = 10, t1 = 13.25, e0 = e;
      if (ctx?.variant === 'fill') {
        e0 = w / 2 + h; t1 = Math.max(t1, t0 + 2 * s);
        if (t1 > 17 - s) { const gap = (11 + h - 2 * s) / 3; t0 = 6 + gap + h; t1 = t0 + s + gap; }
      }
      return [
        shell(g.rot(bc[0], bc[1], 11 - s, w - s, -45, 1.75 - h), { n: 'barrel', role: P }),
        line(g.pl([at(t0, -e0), at(t0, -e + 1.75)]) + g.pl([at(t1, -e0), at(t1, -e + 1.75)]), { n: 'ticks', role: D, on: 'barrel' }),
        line(g.pl([at(0), at(6)]) + g.pl([at(17, -5.5 + h), at(17, 5.5 - h)]), { n: 'needle', role: S }),
        line(g.pl([at(17), at(22.6)]) + g.pl([at(22.6, -e), at(22.6, e)]), { n: 'plunger', role: S })
      ];
    },
    // 注射: the plunger is pushed in and springs back
    fx: { t: 'keys', on: ['plunger'], x: [-1.5], y: [1.5], ms: 380 }
  },
  bandage: {
    label: '创可贴', key: 'live',
    plan: '主体：创可贴（45° 斜放的圆头长条）；细节：中间药垫的两条边线和两个透气孔（实心点）',
    weights: { [P]: 0.68, [D]: 0.32 },
    draw(g, ctx) {
      const { s, h } = g, w = 11, L = 11 + 9 * Math.SQRT2, A = [R2, R2], B = [-R2, R2];
      const at = (x, y) => [12 + A[0] * x + B[0] * y, 12 + A[1] * x + B[1] * y];
      const k = 0.44 - (s - 2) * 0.2, p = 1.1;
      // In the fill variant the pad's edges cut the band through (GUIDE.md §4.1), and move out
      // where they would come within a stroke of the holes.
      const fill = ctx?.variant === 'fill', v = fill ? w / 2 + h : w / 2 - h, u = fill ? Math.max(4.5, 1.5 * s + p + g.dr * k) : 4.5;
      return [
        shell(g.rot(12, 12, L - s, w - s, 45, (w - s) / 2), { n: 'band', role: P }),
        line(g.pl([at(-u, -v), at(-u, v)]) + g.pl([at(u, -v), at(u, v)]), { n: 'pad', role: D, on: 'band' }),
        solid(g.dot(...at(p, p), k) + g.dot(...at(-p, -p), k), { n: 'holes', role: D, on: 'band' })
      ];
    },
    // 贴上: pressed on with a small turn
    fx: { t: 'keys', on: 'all', o: [12, 12], r: [-10, 3], s: [0.94], ms: 360 }
  },
  virus: {
    label: '病毒', key: 'circle',
    plan: '主体：圆形病毒体；辅助：八根带圆头的刺突（圆头实心）；细节：体内两个小圆点。刺突有八根，墨量超过病毒体，但层级靠后',
    weights: { [P]: 0.28, [S]: 0.68, [D]: 0.04 },
    draw(g) {
      const { h, s } = g, d = s - 2, R = 6, r0 = R - h, r1 = 8.75, q = 1.2 - d * 0.1;
      let stalks = '', knobs = '';
      for (let i = 0; i < 8; i++) {
        const a = (i * 45 * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a);
        stalks += g.seg(12 + r0 * c, 12 + r0 * sn, 12 + r1 * c, 12 + r1 * sn);
        knobs += g.dot(12 + r1 * c, 12 + r1 * sn, 0.78 - d * 0.1);
      }
      return [
        shell(g.ring(12, 12, R), { n: 'body', role: P }),
        line(stalks, { n: 'stalks', role: S, part: 'spikes' }),
        solid(knobs, { n: 'knobs', role: S, part: 'spikes' }),
        solid(g.dot(12 - q, 12 - q, 0.5 - d * 0.4) + g.dot(12 + q, 12 + q, 0.5 - d * 0.4), { n: 'dots', role: D, on: 'body' })
      ];
    },
    // 病毒: the body and spikes turn an eighth of a turn, landing on themselves
    fx: { t: 'rotate', on: ['body', 'stalks', 'knobs'], deg: 45, o: [12, 12] }
  },
  brain: {
    label: '大脑', key: 'circle',
    plan: '主体：大脑轮廓（六个圆围成，上下各一个凹口）；细节：中间的分界线和两侧各一道沟回',
    weights: { [P]: 0.73, [D]: 0.27 },
    draw(g, ctx) {
      const { d, M } = lobes(g, [[8.25, 17, 4.75], [6.75, 11.75, 4.75], [8.75, 6.75, 4.75], [15.25, 6.75, 4.75], [17.25, 11.75, 4.75], [15.75, 17, 4.75]]);
      const top = M[2], bot = M[5];
      if (ctx?.variant === 'fill') {
        // The fissure splits the halves and the side folds run in from the notches (GUIDE.md §4.1),
        // the folds shortened to keep a stroke from the fissure at the heavier weights.
        const k = Math.min(1, (12 - 2 * g.s - M[0][0]) / 2.75), out = (q) => fitEnds(q, { k: 'shell', d }, g.s, 'out');
        return [
          shell(d, { n: 'brain', role: P }),
          line(out(g.seg(12, top[1], 12, bot[1])) + out(g.pl([M[0], [M[0][0] + 2.75 * k, M[0][1] - 0.75 * k]])) + out(g.pl([M[4], [M[4][0] - 2.75 * k, M[4][1] - 0.75 * k]])), { n: 'folds', role: D, on: 'brain', ends: 'keep' })
        ];
      }
      return [
        shell(d, { n: 'brain', role: P }),
        line(g.seg(12, top[1], 12, bot[1]) + g.pl([M[0], [M[0][0] + 2.75, M[0][1] - 0.75]]) + g.pl([M[4], [M[4][0] - 2.75, M[4][1] - 0.75]]), { n: 'folds', role: D, on: 'brain' })
      ];
    },
    // 思考: the brain pulses gently
    fx: { t: 'beat', on: 'all', o: [12, 12], amp: 0.07 }
  },
  tooth: {
    label: '牙齿', key: 'portrait',
    plan: '主体：臼齿（顶上两个圆鼓，下面两条牙根，一个闭合形）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, e = 4 + h, f = 20 - h, t = 2 + h, b = 22 - h;
      const pts = [[e, t], [10, t], [12, 4.6], [14, t], [f, t], [f, 12], [17.6, b], [14.4, b], [12, 15.5], [9.6, b], [6.4, b], [e, 12]];
      return [shell(g.polygon(pts, [3.4 - h, 2, 1, 2, 3.4 - h, 3, 1.6, 1.6, 1, 1.6, 1.6, 3]), { n: 'tooth', role: P })];
    },
    // 牙齿: a little wobble
    fx: { t: 'wiggle', on: 'all', o: [12, 21], deg: 6, hz: 3 }
  },
  ambulance: {
    label: '救护车', key: 'landscape',
    plan: '主体：车身（车厢加斜切的车头，同汽车一族的车身做法）；辅助：两个车轮（与汽车、货车相同：圆环 R3，圆心在车身底边）；细节：车厢上的十字和车头的车窗线（两条线，约占两成多）',
    weights: { [P]: 0.48, [S]: 0.29, [D]: 0.23 },
    draw(g, ctx) {
      const { h, s } = g, d = s - 2, t = 3 + h, xr = 22 - h, x0 = 2 + h, WY = 17, belt = 10;
      const wheels = [7, 17].flatMap((x, i) => [
        shell(g.ring(x, WY, 3), { n: `w${i}`, role: S, cutD: g.circ(x, WY, 3 - g.h), part: `w${i}`, only: 'outline' }),
        shell(g.ring(x, WY, 3), { n: `w${i}`, role: S, cutD: g.circ(x, WY, AMB.FR + g.clear), only: 'fill' }),
        line(g.circ(x, WY, AMB.FR + g.h), { n: `wr${i}`, role: S, on: `w${i}`, only: 'fill' })
      ]);
      if (ctx?.variant === 'fill') return [...ambulanceFill(g), ...wheels];
      return [
        shell(g.polygon([[x0, WY], [x0, t], [15, t], [xr, t + 6], [xr, WY]], [1.5, 3 - h, 1.5, 1.2, 1.5]), { n: 'body', role: P }),
        line(plus(g, 8, 10, 1.5 - d * 0.25), { n: 'cross', role: D, on: 'body' }),
        line(g.seg(15, t, 15, belt) + g.seg(15, belt, xr, belt), { n: 'window', role: D, on: 'body' }),
        ...wheels
      ];
    },
    light: ['cross'],
    allow: { keyline: '车顶高出横向参考线 1，给十字留出上下的间距' },
    // 救护车: drives forward and settles
    fx: { t: 'keys', on: 'all', x: [1.2, -0.4] }
  }
};

// --- Medicines, instruments and care ----------------------------------------------------------

// A drop as a filled shape: a circle of radius R at (cx, cy) and the lines tangent to it from a
// tip above at tipY (solid parts: no stroke to allow for).
function drop(cx, cy, R, tipY) {
  const b = Math.acos(R / (cy - tipY)), Pt = (a) => `${n(cx + R * Math.cos(a))} ${n(cy + R * Math.sin(a))}`;
  return `M${n(cx)} ${n(tipY)}L${Pt(-Math.PI / 2 + b)}A${n(R)} ${n(R)} 0 1 1 ${Pt(-Math.PI / 2 - b)}Z`;
}

// The bone by centre line: a shaft 6 wide between two knobs of two circles each (outer radius
// 4.5), drawn clockwise from the top of the left knob's shaft joint.
function bone(g) {
  const { h } = g, r = 4.5 - h, yt = 9 + h, yb = 15 - h, cl = 6.5, cr = 17.5, d = Math.sqrt(r * r - h * h), m = Math.sqrt(r * r - 9);
  const A = (x, y) => `${n(x)} ${n(y)}`, arc = (to, large) => `A${n(r)} ${n(r)} 0 ${large} 1 ${to}`;
  return `M${A(cl + d, yt)}H${n(cr - d)}${arc(A(cr + m, 12), 1)}${arc(A(cr - d, yb), 1)}H${n(cl + d)}${arc(A(cl - m, 12), 1)}${arc(A(cl + d, yt), 1)}Z`;
}

Object.assign(set, {
  'pill-bottle': {
    label: '药瓶', key: 'portrait',
    plan: '主体：瓶身；辅助：瓶盖（比瓶身宽，与瓶身隔开）；细节：瓶身上的十字（随字重缩小）',
    weights: { [P]: 0.51, [S]: 0.41, [D]: 0.08 },
    draw(g) {
      const k = 1.5 - Math.max(0, g.s - 2);
      return [
        shell(g.box(4, 2, 16, 5, 1.5), { n: 'cap', role: S }),
        shell(g.box(5, 9, 14, 13, 3.5), { n: 'bottle', role: P }),
        line(plus(g, 12, 16, k), { n: 'cross', role: D, on: 'bottle' })
      ];
    },
    light: ['cross'],
    // 服药: the cap twists open and back
    fx: { t: 'keys', on: ['cap'], o: [12, 4.5], r: [-8, 2], y: [-0.6, 0], ms: 360 }
  },
  ointment: {
    label: '药膏', key: 'landscape', fit: 'x',
    allow: { optical: '管身左宽右窄，分量在左，按整体外框定位' },
    ends: 'out',
    plan: '主体：药膏管（左端压平、向右收窄）；辅助：右端的管盖（与管身隔开）；细节：左端的封口线（在面性中切开管身）',
    weights: { [P]: 0.66, [S]: 0.22, [D]: 0.12 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.polygon([[2 + h, 6 + h], [15, 8.5], [15, 15.5], [2 + h, 18 - h]], [0.75, 1, 1, 0.75]), { n: 'tube', role: P }),
        line(g.seg(6, 7, 6, 17), { n: 'seam', role: D, on: 'tube' }),
        shell(g.box(18, 9, 4, 6, 1.5), { n: 'cap', role: S })
      ];
    },
    // 挤药膏: the tube is squeezed and springs back
    fx: { t: 'keys', on: ['tube', 'seam'], o: [16, 12], sy: [0.82, 1.04], ms: 320 }
  },
  'eye-drops': {
    anchor: 'base',
    label: '滴眼液', key: 'portrait', fit: 'y',
    plan: '主体：瓶身；辅助：收窄的瓶嘴（一笔线条，接在瓶身顶上）；细节：瓶身上的水滴（实心）',
    weights: { [P]: 0.6, [S]: 0.24, [D]: 0.16 },
    draw(g) {
      const { h, s } = g, k = 1 - Math.max(0, s - 2) * 0.4;
      return [
        line(g.pl([[9.5, 10 + h], [10.5, 3 + h], [13.5, 3 + h], [14.5, 10 + h]]), { n: 'nozzle', role: S }),
        shell(g.box(6, 10, 12, 12, 3.5), { n: 'bottle', role: P }),
        solid(drop(12, 17, 1.5 * k, 17 - 3.5 * k), { n: 'drop', role: D, on: 'bottle' })
      ];
    },
    allow: { keyline: '瓶嘴是一条线，顶端略低于纵向参考线' },
    // 滴药: the bottle tips and the drop is squeezed out
    fx: [{ t: 'keys', on: 'all', o: [12, 22], r: [-10, 2], ms: 380 }, { t: 'keys', on: ['drop'], o: [12, 18], s: [1.3, 0.95], ms: 300 }]
  },
  'thermometer-medical': {
    label: '体温计', key: 'live',
    allow: { optical: '探头只是一条线，分量在右上的机身，按整体外框定位' },
    plan: '主体：体温计机身（45° 斜放的圆头长条）；辅助：伸向左下的探头',
    weights: { [P]: 0.74, [S]: 0.26 },
    draw(g) {
      const { s, h } = g, c = [15, 9], L = 17, w = 7, a = Math.SQRT1_2, e = L / 2 - h;
      return [
        line(g.seg(c[0] - e * a, c[1] + e * a, 2 + h, 22 - h), { n: 'probe', role: S }),
        shell(g.rot(c[0], c[1], L - s, w - s, -45, (w - s) / 2), { n: 'body', role: P })
      ];
    },
    // 量体温: the reading rises: the thermometer is shaken and settles
    fx: { t: 'wiggle', on: 'all', o: [4, 20], deg: 6, hz: 2.6 }
  },
  'blood-bag': {
    label: '血袋', key: 'portrait', fit: 'y',
    plan: '主体：血袋（圆角矩形）；辅助：顶上的挂环和底部的输液管；细节：袋上的血滴（实心）',
    weights: { [P]: 0.71, [S]: 0.17, [D]: 0.12 },
    draw(g) {
      const { h, s } = g, k = 1 - Math.max(0, s - 2) * 0.4;
      return [
        line(arch(10, 14, 2 + h, 5 + h) + g.seg(12, 17 - h, 12, 22 - h), { n: 'tube', role: S }),
        shell(g.box(5, 5, 14, 12, 4), { n: 'bag', role: P }),
        solid(drop(12, 12, 1.5 * k, 12 - 3.5 * k), { n: 'drop', role: D, on: 'bag' })
      ];
    },
    light: ['drop'],
    // 输血: the drop swells as it flows
    fx: { t: 'keys', on: ['drop'], o: [12, 12], s: [1.3, 0.95], ms: 320 }
  },
  scalpel: {
    label: '手术刀', key: 'live',
    allow: { keyline: '斜放的细长器械，刀柄是一条线，不贴参考区域的四角', optical: '刀片在左下，刀柄只是一条线，按整体外框定位' },
    plan: '主体：刀片（刀背平直、刀腹弧形，尖朝左下）；辅助：细长的刀柄（一条线）',
    weights: { [P]: 0.56, [S]: 0.44 },
    draw(g) {
      const o = [9.5, 14.5], u = [-Math.SQRT1_2, Math.SQRT1_2], v = [Math.SQRT1_2, Math.SQRT1_2];
      const at = (p, q) => [o[0] + u[0] * p + v[0] * q, o[1] + u[1] * p + v[1] * q];
      return [
        line(g.seg(...at(-0.5, 0), ...at(-15.5, 0)), { n: 'handle', role: S }),
        shell(g.polygon([at(0, -1.75), at(10.5, -1.75), at(5, 2), at(0, 2)], [0.5, 1, 2, 0.5]), { n: 'blade', role: P })
      ];
    },
    // 切口: the blade makes a short cut and lifts away
    fx: { t: 'keys', on: 'all', x: [-0.8, 0.2], y: [0.8, -0.2], ms: 300 }
  },
  tweezers: {
    label: '镊子', key: 'portrait', fit: 'y',
    light: [],
    plan: '主体：镊子的两条臂（顶上相连，向下张开，到下端再收拢成尖端）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g;
      return [line(`M10 ${n(22 - h)}L6.5 16L10 ${n(4 + h)}A2 2 0 0 1 14 ${n(4 + h)}L17.5 16L14 ${n(22 - h)}`, { n: 'arms', role: P })];
    },
    // 夹取: the tips pinch together and open
    fx: { t: 'keys', on: 'all', o: [12, 2], sx: [0.8, 1.04], ms: 300 }
  },
  'x-ray': {
    label: 'X 光片', key: 'square',
    ends: 'in',
    plan: '主体：片框（方形）；细节：脊柱和两对肋骨（随字重收拢）',
    weights: { [P]: 0.6, [D]: 0.4 },
    draw(g) {
      const { s } = g, r = 1.5 - Math.max(0, s - 2);
      const rib = (y, sg) => `M12 ${y}H${n(12 + sg * (4 - r))}A${n(r)} ${n(r)} 0 0 ${sg > 0 ? 1 : 0} ${n(12 + sg * 4)} ${n(y + r)}`;
      return [
        shell(g.box(3, 3, 18, 18, 4.5), { n: 'film', role: P }),
        line(g.seg(12, 8, 12, 16), { n: 'spine', role: D, on: 'film' }),
        line(rib(8, -1) + rib(13, -1), { n: 'ribL', role: D, on: 'film' }),
        line(rib(8, 1) + rib(13, 1), { n: 'ribR', role: D, on: 'film' })
      ];
    },
    // 拍片: the bones light up from the spine out
    fx: { t: 'variable', on: ['spine', 'ribL', 'ribR'], mode: 'cumulative', step: 160 }
  },
  'face-mask': {
    label: '口罩', key: 'live', fit: 'x',
    plan: '主体：口罩面（圆角矩形）；辅助：两侧的耳绳（弧线）；细节：两道褶线',
    weights: { [P]: 0.41, [S]: 0.29, [D]: 0.3 },
    draw(g, ctx) {
      // fill: the pleats move apart at the heavier weights, so the ink between them stays a stroke wide
      // and stop a stroke inside the edges
      const fill = ctx?.variant === 'fill', d = fill ? Math.max(0, g.s - 2) : 0, x0 = fill ? 6 + 1.5 * g.s : 6 + g.h, x1 = 24 - x0;
      return [
        line('M7 9A4 3 0 0 0 7 15M17 9A4 3 0 0 1 17 15', { n: 'loops', role: S, part: 'mask' }),
        shell(g.box(6, 5, 12, 14, 4), { n: 'mask', role: P, part: 'mask' }),
        line(g.seg(x0, 10 - d, x1, 10 - d) + g.seg(x0, 14 + d, x1, 14 + d), { n: 'pleats', role: D, on: 'mask', ends: 'keep' })
      ];
    },
    // 戴口罩: the mask stretches over the face and settles
    fx: { t: 'keys', on: 'all', o: [12, 12], sx: [1.06, 0.98], ms: 320 }
  },
  bone: {
    label: '骨骼', key: 'landscape', fit: 'x',
    plan: '主体：骨头（两端各两个圆鼓，中间一段骨干，一个闭合形）',
    weights: { [P]: 1 },
    draw(g) { return [shell(bone(g), { n: 'bone', role: P })]; },
    // 骨骼: a little wobble
    fx: { t: 'wiggle', on: 'all', o: [12, 12], deg: 8, hz: 2.4 }
  },
  'weight-scale': {
    label: '体重秤', key: 'square',
    plan: '主体：秤面（方形）；细节：上方的弧形刻度和指针（面性中刻度窗是一个半圆的镂空，不画指针：弧线和指针一起镂空会夹出细小的墨块）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g, ctx) {
      const scale = shell(g.box(3, 3, 18, 18, 4.5), { n: 'scale', role: P });
      if (ctx?.variant === 'fill') return [scale, solid(`M7.5 11.5A4.5 4.5 0 0 1 16.5 11.5Z`, { n: 'dial', role: D, on: 'scale' })];
      return [
        scale,
        line(g.arc(12, 11.5, 3.5, 200, 340), { n: 'dial', role: D, on: 'scale' }),
        line(g.seg(12, 13.5, 13.75, 8.47), { n: 'needle', role: D, on: 'scale' })
      ];
    },
    // 称重: the needle swings to the reading and settles
    fx: { t: 'keys', on: ['needle'], o: [12, 13.5], r: [-45, 12, -4], ms: 520 }
  }
});

// Variants made by rule (kit.mjs): the medical cross in a circle and in a square.
const base = (k) => ({ ...set[k], name: k });
Object.assign(set, {
  'hospital-cross-circle': { ...enclose(base('hospital-cross'), 'circle', { label: '医疗（圆形）', k: 0.56 }), fx: { t: 'beat', on: ['cross'], o: [12, 12], amp: 0.1 } },
  'hospital-cross-square': { ...enclose(base('hospital-cross'), 'square', { label: '医疗（方形）', k: 0.56 }), fx: { t: 'beat', on: ['cross'], o: [12, 12], amp: 0.1 } }
});

// --- Body, mobility and rest ------------------------------------------------------------------
Object.assign(set, {
  inhaler: {
    label: '吸入器', key: 'square',
    allow: { optical: 'L 形外壳的分量在右侧的筒身，按外框定位' },
    plan: '主体：L 形的外壳（竖直的筒身加向左伸出的吸嘴）；辅助：插在顶上的药罐',
    weights: { [P]: 0.74, [S]: 0.26 },
    draw(g) {
      const { h } = g, t = 8 + h, b = 21 - h, l = 3 + h, r = 21 - h, m = 15 + h;
      return [
        shell(g.box(13, 3, 7, 6, 1.5), { n: 'can', role: S, part: 'inhaler' }),
        shell(g.polygon([[12, t], [r, t], [r, b], [l, b], [l, m], [12, m]], [1.5, 1.5, 2, 1.5, 1.5, 0]), { n: 'boot', role: P, part: 'inhaler' })
      ];
    },
    // 吸药: the canister is pressed down and springs back
    fx: { t: 'keys', on: ['can'], y: [1, -0.2], ms: 260 }
  },
  'mortar-pestle': {
    anchor: 'base',
    label: '药房', key: 'square',
    allow: { sliver: '研杵斜着切过钵口，切口两侧是斜角，与斜线变体的间隙同理；不是夹出来的碎块' },
    plan: '主体：研钵（半圆的钵身，上沿一条直线）；辅助：斜插进钵里的研杵（压在钵身前面，留出间隙）',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) {
      const { h } = g, y = 12;
      return [
        shell(`M${n(3 + h)} ${y}H${n(21 - h)}A${n(9 - h)} ${n(9 - h)} 0 0 1 ${n(3 + h)} ${y}Z`, { n: 'bowl', role: P }),
        line(g.seg(19.5, 4, 13, 15), { n: 'pestle', role: S, gap: true })
      ];
    },
    // 研药: the pestle grinds round in the bowl
    fx: { t: 'orbit', on: ['pestle'], r: 0.9 }
  },
  'blood-pressure': {
    label: '血压计', key: 'live',
    plan: '主体：表盘（圆环）；辅助：输气管和右下的气囊（小圆环）；细节：指针',
    weights: { [P]: 0.6, [S]: 0.28, [D]: 0.12 },
    draw(g) {
      const { h } = g, q = (3.2 - Math.max(0, g.s - 2) * 0.8) * Math.SQRT1_2;
      return [
        line(`M10 ${n(18 - h)}V18.5A1.5 1.5 0 0 0 11.5 20H${n(16 + h)}`, { n: 'tube', role: S }),
        shell(g.ring(10, 10, 8), { n: 'dial', role: P }),
        line(g.seg(10, 10, 10 + q, 10 - q), { n: 'needle', role: D, on: 'dial' }),
        shell(g.ring(19, 19, 3), { n: 'bulb', role: S })
      ];
    },
    // 量血压: the bulb is squeezed and the needle swings up
    fx: [{ t: 'keys', on: ['bulb'], o: [19, 19], s: [0.8, 1.05], ms: 300 }, { t: 'keys', on: ['needle'], o: [10, 10], r: [40, -8], ms: 480 }]
  },
  bacteria: {
    label: '细菌', key: 'live',
    plan: '主体：杆状菌体（45° 斜放的圆头长条）；辅助：两端的鞭毛（短线）；细节：体内两个圆点（随字重缩小）',
    weights: { [P]: 0.7, [S]: 0.2, [D]: 0.1 },
    draw(g) {
      const { s, h } = g, L = 17, w = 9, a = Math.SQRT1_2, e = L / 2 - h, f = 12.5, k = 0.6 - Math.max(0, s - 2) * 0.45;
      return [
        line(g.seg(12 - e * a, 12 + e * a, 12 - f * a, 12 + f * a) + g.seg(12 + e * a, 12 - e * a, 12 + f * a, 12 - f * a), { n: 'tails', role: S }),
        shell(g.rot(12, 12, L - s, w - s, -45, (w - s) / 2), { n: 'body', role: P }),
        solid(g.dot(12 - 2.75 * a, 12 + 2.75 * a, k) + g.dot(12 + 2.75 * a, 12 - 2.75 * a, k), { n: 'dots', role: D, on: 'body' })
      ];
    },
    // 细菌: it wriggles
    fx: { t: 'wiggle', on: 'all', o: [12, 12], deg: 10, hz: 3 }
  },
  lungs: {
    label: '肺', key: 'square',
    plan: '主体：左右两片肺叶（圆角形，外侧上角圆得多）；辅助：气管和两条支气管（一笔线条，伸进肺叶）',
    weights: { [P]: 0.74, [S]: 0.26 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(3, 6, 7, 15, [4.5, 1.5, 2, 3]), { n: 'left', role: P, part: 'lungs' }),
        shell(g.box(14, 6, 7, 15, [1.5, 4.5, 3, 2]), { n: 'right', role: P, part: 'lungs' }),
        line(g.seg(12, 3 + h, 12, 10) + g.pl([[7, 13], [9.5, 13], [12, 10], [14.5, 13], [17, 13]]), { n: 'airway', role: S, part: 'lungs' })
      ];
    },
    light: [],
    // 呼吸: the lungs fill and empty
    fx: { t: 'keys', on: ['left', 'right'], o: [12, 13], s: [1.06, 0.98], ms: 600 }
  },
  ear: {
    label: '耳朵', key: 'portrait', fit: 'y',
    light: ['fold'],
    plan: '主体：耳廓（一笔线条：顶上的弧向右下收成 S 形，下面是耳垂）；细节：耳内的一道折线',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g) {
      return [
        line('M6 9.5A6.5 6.5 0 1 1 19 9.5C19 14.5 13.5 14 13.5 17.5A3.5 3.5 0 0 1 6.5 17.5', { n: 'outer', role: P }),
        line('M15 9.5A2.5 2.5 0 0 0 10 9.5V11A1.5 1.5 0 0 1 10 14', { n: 'fold', role: D })
      ];
    },
    // 倾听: the ear tilts toward the sound
    fx: { t: 'keys', on: 'all', o: [12, 20], r: [-8, 2], ms: 360 }
  },
  wheelchair: {
    label: '轮椅', key: 'live',
    allow: { optical: '大轮在左下，靠背和脚踏只是线条，按外框定位', sliver: '车架从轮子前面经过，间隙切开轮圈，与线性变体相同；不是镂空留下的碎块' },
    plan: '主体：大轮（圆环；面性中仍是圆环）；辅助：靠背、座位和脚踏（一笔线条，压在轮子前面，留出间隙）。线条长，墨量超过轮子',
    weights: { [P]: 0.42, [S]: 0.58 },
    draw(g, ctx) {
      const { h } = g;
      return [
        (ctx?.variant === 'fill' ? line : shell)(g.ring(9, 15, 7), { n: 'wheel', role: P }),
        line(`M6 ${n(2 + h)}V12H16L19 19H${n(22 - h)}`, { n: 'frame', role: S, gap: true })
      ];
    },
    // 推行: the wheel turns and the chair rolls forward
    fx: { t: 'keys', on: 'all', x: [1.2, -0.3], ms: 360 }
  },
  crutch: {
    label: '拐杖', key: 'portrait', fit: 'y',
    allow: { optical: '腋托和两条侧杆在上，下面只是一根杆，按外框定位' },
    light: [],
    plan: '主体：两条侧杆收拢到下面一根杆；辅助：顶上的腋托（一条横线）；细节：中间的把手',
    weights: { [P]: 0.66, [S]: 0.18, [D]: 0.16 },
    draw(g) {
      const { h } = g, at = (x0, y) => x0 + ((x0 < 12 ? 11 : 13) - x0) * (y - 3) / 13;
      return [
        line(g.span(6.5, 3, 17.5, 3), { n: 'pad', role: S }),
        line(`M8.5 3L11 16H13L15.5 3` + g.seg(12, 16, 12, 22 - h), { n: 'rails', role: P }),
        line(g.seg(at(8.5, 10), 10, at(15.5, 10), 10), { n: 'grip', role: D })
      ];
    },
    // 拄拐: the crutch leans and steps
    fx: { t: 'keys', on: 'all', o: [12, 22], r: [-8, 2], ms: 360 }
  },
  'hospital-bed': {
    anchor: 'base',
    label: '病床', key: 'square',
    plan: '主体：床架（左边高的床头、右边矮的床尾，中间一条床面）；细节：床上方的十字',
    weights: { [P]: 0.76, [D]: 0.24 },
    draw(g) {
      const { h } = g;
      return [
        line(g.seg(4, 5, 4, 21 - h) + g.seg(20, 10, 20, 21 - h) + g.seg(4, 14, 20, 14), { n: 'frame', role: P }),
        line(plus(g, 12, 7, 3), { n: 'cross', role: D })
      ];
    },
    light: ['cross'],
    // 病床: the cross pulses like a heartbeat
    fx: { t: 'beat', on: ['cross'], o: [12, 7], amp: 0.14 }
  },
  sleep: {
    label: '睡眠', key: 'live',
    light: [],
    plan: '主体：左下的大 Z；辅助：右上的小 Z',
    weights: { [P]: 0.64, [S]: 0.36 },
    draw(g) {
      const { h } = g;
      return [
        line(g.pl([[2 + h, 11], [13 - h, 11], [2 + h, 22 - h], [13 - h, 22 - h]]), { n: 'z1', role: P }),
        line(g.pl([[15 + h, 2 + h], [22 - h, 2 + h], [15 + h, 9], [22 - h, 9]]), { n: 'z2', role: S })
      ];
    },
    // 入睡: the Zs float up one after the other
    fx: { t: 'keys', on: [['z1'], ['z2']], by: true, stagger: 160, y: [-1, 0.2], ms: 360 }
  },
  walker: {
    anchor: 'base',
    label: '助行器', key: 'square',
    plan: '主体：框架（两条腿和顶上的把手，一笔线条）；辅助：中间的横杆和前脚的两个轮子（实心）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const { h } = g;
      return [
        line(`M5 19V7A3 3 0 0 1 8 ${n(3 + h)}H16A3 3 0 0 1 19 7V19`, { n: 'frame', role: P }),
        line(g.seg(5, 12, 19, 12), { n: 'bar', role: S }),
        solid(g.dot(5, 19.5) + g.dot(19, 19.5), { n: 'wheels', role: S })
      ];
    },
    // 行走: the walker is lifted forward and set down
    fx: { t: 'keys', on: 'all', o: [12, 21], y: [-1, 0.2], r: [-3, 1], ms: 360 }
  }
});
Object.assign(set, {
  'ear-off': { ...off(slash(base('ear'), { label: '听力障碍' }), 'ear', { t: 'keys', on: ['outer', 'fold'], o: [12, 20], s: [0.9], ms: 240 }), allow: { sliver: '斜线的间隙以 45° 切过线条，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }
});

export default set;
