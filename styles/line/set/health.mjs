// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// health: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: first-aid hospital-cross pill pills heart-pulse stethoscope syringe bandage virus brain tooth ambulance
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
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

export default {
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
