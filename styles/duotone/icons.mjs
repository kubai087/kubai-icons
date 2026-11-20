// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Example icons in the two-tone solid style (双色面性). Each icon is { label, key, layers }:
//   label   the Chinese name
//   key     the key shape it fills (KEYLINES in kit.mjs): circle, square, landscape, wide,
//           portrait, tall, flat or live
//   layers  drawn in order; the light body first (tone b), then the blue accents and details
// Read the one closest to a new object before drawing it, and append new icons the same way.
import { R3, R, M, r, S, q, t, D, K, W, rr, pill, circ, body, poly, polygon, rot, L, C, Bt, badge } from './kit.mjs';

// A pen laid at 45° (the allowed slope for 编辑), nib at the bottom left. The nib's two edges run
// along the grid, so it fills the box corner exactly. from and to are distances along the pen
// from the line where the nib meets the barrel; w is its width.
const pen = (from, to, w = 3.5) => {
  const a = w * Math.SQRT1_2, u = (d) => d * Math.SQRT1_2;
  return [[2 + u(from), 14 - a - u(from)], [2 + u(to), 14 - a - u(to)], [2 + a + u(to), 14 - u(to)], [2 + a + u(from), 14 - u(from)]];
};

const f3 = (v) => +v.toFixed(3);

// An eye: two circular arcs (top and bottom) whose tips are rounded off by circles of radius rf,
// the way the heart rounds its tip, so there is no point. w x h centred on (cx, cy).
const eyeOutline = (cx, cy, w, h, rf) => {
  const a = w / 2, b = h / 2, e = ((a - rf) ** 2 - (b - rf) ** 2) / (2 * (b - rf)), R0 = b + e;
  const k = rf / (R0 - rf), fx = a - rf;
  const P = (sx, sy) => `${f3(cx + sx * fx * (1 + k))} ${f3(cy + sy * e * k)}`; // tangent points
  return `M${P(-1, -1)}A${f3(R0)} ${f3(R0)} 0 0 1 ${P(1, -1)}A${rf} ${rf} 0 0 1 ${P(1, 1)}A${f3(R0)} ${f3(R0)} 0 0 1 ${P(-1, 1)}A${rf} ${rf} 0 0 1 ${P(-1, -1)}Z`;
};

// A shield on x 2..14 from y 1 to its tip at y 15: straight top (corners M) and sides, then two
// arcs of radius R0 meeting at the bottom centre, the tip rounded off at rf (as the heart's).
const shieldPath = (R0, rf) => {
  const Fy = 15 - rf, y0 = Fy - Math.sqrt((R0 - rf) ** 2 - (6 - R0) ** 2), k = rf / (R0 - rf);
  const tx = (6 - R0) * k, ty = (Fy - y0) * k; // from the fillet centre to the tangent point (left side)
  // One outline: the top corners from poly (smoothed like rr), then the two arcs and the tip.
  return poly([{ x: 2, y: y0, c: 0 }, { x: 2, y: 1, c: M }, { x: 14, y: 1, c: M }, { x: 14, y: y0, c: 0 }]).slice(0, -1) +
    `A${R0} ${R0} 0 0 1 ${f3(8 - tx)} ${f3(Fy + ty)}A${rf} ${rf} 0 0 1 ${f3(8 + tx)} ${f3(Fy + ty)}A${R0} ${R0} 0 0 1 2 ${f3(y0)}Z`;
};

// A flag whose top and bottom edges carry one gentle wave: each bend is rounded with exactly
// the radius that uses up the short step between the bends, so the step disappears and the edge
// is two tangent arcs (no slope, no point). The corners keep their radii (S at the pole, M out).
const flagWave = (x0, y0, x1, d, H, xa, xb) => {
  const ls = Math.hypot(xb - xa, d), cb = ls / 2 / Math.tan(Math.atan2(d, xb - xa) / 2);
  return polygon([[x0, y0], [xa, y0], [xb, y0 + d], [x1, y0 + d], [x1, y0 + d + H], [xb, y0 + d + H], [xa, y0 + H], [x0, y0 + H]], [S, cb, cb, M, M, cb, cb, S]);
};

// A camcorder lens that widens away from the body with arcs instead of slopes: the part of a
// circle (centre (cx, 8), radius rad) left of x = 15, its leftmost point at x = 15 - w (one gap
// from the body), and the two corners on the flat outer side rounded at f.
const camLens = (w, rad, f = 1) => {
  const cx = 15 - w + rad, dx = 15 - f - cx, h = Math.sqrt((rad - f) ** 2 - dx ** 2);
  const tx = +(cx + (rad * dx) / (rad - f)).toFixed(3), ty = +((rad * h) / (rad - f)).toFixed(3), hh = +h.toFixed(3);
  return `M15 ${8 + hh}V${8 - hh}A${f} ${f} 0 0 0 ${tx} ${8 - ty}A${rad} ${rad} 0 0 0 ${tx} ${8 + ty}A${f} ${f} 0 0 0 15 ${8 + hh}Z`;
};

// The history arrow: a light ring (stroke 2, centre line radius 6, outer edge on the keyline)
// running clockwise from the upper left (225°) round to just below the left (170°), open at the
// upper left. Its blue head sits on the open end and points back, down and to the left
// (counterclockwise): a right-angled head whose edges lie at 45°, tip 0.41 out so the rounded
// tip lands where it is drawn.
const HIST = (() => {
  const c = 8, rc = 6, hw = 3.5, s = Math.SQRT1_2, P = c - rc * s, end = (170 * Math.PI) / 180;
  const pt = (u, v) => [+(P + u * s).toFixed(3), +(P + v * s).toFixed(3)];
  return {
    arc: `M${P.toFixed(3)} ${P.toFixed(3)}A${rc} ${rc} 0 1 1 ${(c + rc * Math.cos(end)).toFixed(3)} ${(c + rc * Math.sin(end)).toFixed(3)}`,
    head: polygon([pt(-hw, -hw), pt(hw, hw), pt(-hw - 0.41, hw + 0.41)], 1)
  };
})();

// The iOS-style wifi fan: a wedge and bands around (8, cy), between the radii at ±deg from
// straight up. Bands are 1.75 thick with a gap of 1; band ends are cut along the radii and every
// corner is rounded (c on the bands' corners, tip on the wedge's point), with the fillet circles
// fitted to each arc and radius so the edges stay tangent.
const FAN = (() => {
  const cx = 8, deg = 39, th = 1.75, gap = 1, R = 11.556, c = 0.75, tip = 1;
  const a = (deg * Math.PI) / 180, cy = 13.5 + tip / Math.sin(a) - tip, f = (v) => +v.toFixed(3);
  const P = (r, t) => `${f(cx + r * Math.sin(t))} ${f(cy - r * Math.cos(t))}`;
  const r0 = R - 3 * (th + gap);
  // Corner where the radius at angle side*a meets an arc of radius r (outer: convex arc).
  const corner = (r, side, outer) => {
    const d = outer ? r - c : r + c, phi = Math.asin(c / d), along = Math.sqrt(d * d - c * c);
    return { arc: P(r, side * (a - phi)), line: P(along, side * a) };
  };
  const band = (k) => {
    const ro = r0 + gap + k * (th + gap) - gap, ri = ro - th;
    const oL = corner(ro, -1, true), oR = corner(ro, 1, true), iR = corner(ri, 1, false), iL = corner(ri, -1, false);
    return `M${oL.arc}A${f(ro)} ${f(ro)} 0 0 1 ${oR.arc}A${c} ${c} 0 0 1 ${oR.line}L${iR.line}A${c} ${c} 0 0 1 ${iR.arc}` +
      `A${f(ri)} ${f(ri)} 0 0 0 ${iL.arc}A${c} ${c} 0 0 1 ${iL.line}L${oL.line}A${c} ${c} 0 0 1 ${oL.arc}Z`;
  };
  const oL = corner(r0, -1, true), oR = corner(r0, 1, true), t = tip / Math.tan(a);
  const wedge = `M${oL.arc}A${f(r0)} ${f(r0)} 0 0 1 ${oR.arc}A${c} ${c} 0 0 1 ${oR.line}L${P(t, a)}A${tip} ${tip} 0 0 1 ${P(t, -a)}L${oL.line}A${c} ${c} 0 0 1 ${oL.arc}Z`;
  return { band, wedge };
})();

export const ICONS = {
  folder: {
    label: '文件夹',
    key: 'landscape',
    layers: [
      // One light folder; a short blue dash on the front marks it.
      // A sheet kept inside, wholly hidden behind the folder; the hover motion draws it up out of
      // the opening (motion.mjs). The folder's knockout outline keeps it one gap clear.
      L(rr(6.5, 5.5, 6.5, 6.5, r)),
      L(body(1, 4, 14, 10, R, [{ x: 1, w: 6, h: 2, c: r }]), { ...Bt, gap: W }),
      L(pill(9, 10.75, 4, D))
    ]
  },
  'file-text': {
    label: '文档',
    key: 'portrait',
    layers: [
      L(rr(2, 1, 12, 14, M), Bt),
      // One layer per line, so the motion can write them on one after another.
      L(pill(5, 5.25, 6, D)),
      L(pill(5, 7.875, 6, D)),
      L(pill(5, 10.5, 3.5, D))
    ]
  },
  calendar: {
    label: '日历',
    key: 'square',
    layers: [
      L(rr(2, 3.5, 12, 10.5, R), Bt),
      L([5.25, 8, 10.75].map((x) => circ(x, 8.5, 0.625) + circ(x, 11.25, 0.625)).join('')),
      L(pill(4.875, 2, D, 3) + pill(9.875, 2, D, 3), { gap: W })
    ]
  },
  camera: {
    label: '相机',
    key: 'square',
    layers: [
      L(body(2, 4, 12, 10, R, [{ x: 5, w: 6, h: 2, c: r }]), Bt),
      L(circ(8, 9, 2.75), { cut: [C(circ(8, 9, 1.5))] })
    ]
  },
  lock: {
    label: '锁',
    key: 'portrait',
    layers: [
      // The body sits in front of the shackle and cuts a gap of W round itself.
      L('M4.75 7V5a3.25 3.25 0 0 1 6.5 0V7', { sw: K }),
      L(rr(2, 6.5, 12, 8.5, M), { ...Bt, gap: W }),
      L(pill(7.25, 9.25, 1.5, 3))
    ]
  },
  user: {
    label: '用户',
    key: 'square',
    layers: [
      L(circ(8, 5, 3)),
      L(rr(2, 9, 12, 5, [5, 5, r, r]), Bt)
    ]
  },
  'id-card': {
    label: '证件',
    key: 'landscape',
    layers: [
      L(rr(1, 2, 14, 12, R3), Bt),
      L(circ(5.5, 6.75, 1.5) + rr(3.25, 9.25, 4.5, 2.5, [2.25, 2.25, 0.75, 0.75])),
      L(pill(9.5, 6.25, 3.5, D) + pill(9.5, 9, 3, D))
    ]
  },
  building: {
    label: '建筑',
    key: 'square',
    layers: [
      // One tower: two columns of window bars and a door.
      L(rr(2, 2, 12, 12, R), Bt),
      // One layer per row of windows, so the motion can light them floor by floor.
      L(pill(4.5, 9.0, 2.25, D) + pill(9.25, 9.0, 2.25, D)),
      L(pill(4.5, 6.5, 2.25, D) + pill(9.25, 6.5, 2.25, D)),
      L(pill(4.5, 4.0, 2.25, D) + pill(9.25, 4.0, 2.25, D)),
      L(rr(7, 11, 2, 3, [1, 1, 0, 0]))
    ]
  },
  'book-open': {
    label: '书',
    key: 'landscape',
    layers: [
      L(rr(1, 2, 6.5, 12, [R3, 0, 0, R3]), Bt),
      L(rr(8.5, 2, 6.5, 12, [0, R3, R3, 0]), Bt),
      L(pill(3, 6, 2.5, D) + pill(3, 8.75, 2.5, D)),
      L(pill(10.5, 6, 2.5, D) + pill(10.5, 8.75, 2.5, D))
    ]
  },
  bell: {
    label: '铃铛',
    key: 'square',
    layers: [
      // Dome and brim are one light body; the knob and clapper are blue accents, sized as lone marks (GUIDE.md 5.1).
      L('M3 10.5V8a5 5 0 0 1 10 0V10.5Z' + pill(2, 9.75, 12, 1.5), Bt),
      L(circ(8, 3.25, 1.25) + rr(6.25, 12.25, 3.5, 1.75, [0.5, 0.5, 1.75, 1.75]), { gap: W })
    ]
  },
  trash: {
    label: '垃圾桶',
    key: 'portrait',
    layers: [
      L(body(2, 2.5, 12, 1.5, 0.6, [{ x: 6.5, w: 3, h: 1.5, c: 0.6 }])),
      L(rr(3, 5, 10, 10, [S, S, R, R]), Bt),
      L(pill(6.25, 7.5, D, 5) + pill(8.75, 7.5, D, 5))
    ]
  },
  gift: {
    label: '礼物',
    key: 'square',
    layers: [
      // The bow (two loops and a knot) stands one gap above the lid; the ribbon is printed on
      // the lid and the box.
      L(circ(5.75, 3.75, 1.125) + circ(10.25, 3.75, 1.125), { sw: D }),
      L(rr(7.25, 3.25, 1.5, 2.25, 0.75)),
      L(rr(2, 6.5, 12, 2.5, q), Bt),
      L(rr(3, 10, 10, 4, [S, S, r, r]), Bt),
      L(rr(7.25, 6.5, 1.5, 2.5)),
      L(rr(7.25, 10, 1.5, 4))
    ]
  },
  smile: {
    label: '笑脸',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      L(pill(5.375, 5.25, D, 2) + pill(9.375, 5.25, D, 2)),
      L('M5.5 9.25a2.5 2.5 0 0 0 5 0', { sw: D })
    ]
  },
  chat: {
    label: '对话',
    key: 'landscape',
    layers: [
      // One light bubble; the square corner says speech. Two blue lines.
      L(rr(1, 2, 14, 12, [R3, R3, R3, 0]), Bt),
      L(pill(4, 6, 8, D)),
      L(pill(4, 9, 5, D))
    ]
  },
  clock: {
    label: '时钟',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      // Minute hand, then hour hand: they meet at the centre with round caps.
      L('M8 4.75V8', { sw: K }),
      L('M8 8H10.5', { sw: K })
    ]
  },
  image: {
    label: '图片',
    key: 'landscape',
    layers: [
      L(rr(1, 2, 14, 12, R3), Bt),
      // The hill rises from the frame's bottom edge (clipped to it), so it has no margins to even
      // out; the sun sits the same 2.25 in from the top and right edges.
      L(circ(6.5, 16, 6), { clip: rr(1, 2, 14, 12, R3) }),
      L(circ(11.5, 5.5, 1.25))
    ]
  },
  ticket: {
    label: '票',
    key: 'wide',
    layers: [
      // The ticket and its stub, torn apart along the perforation: the tear cuts straight through one outline.
      L(rr(1, 2.5, 10, 11, [R, 0, 0, R]), { ...Bt, cut: [C(circ(1, 8, 1.25))] }),
      L(rr(12, 2.5, 3, 11, [0, r, r, 0]), { cut: [C(circ(15, 8, 1.25))] })
    ]
  },
  wallet: {
    label: '钱包',
    key: 'landscape',
    layers: [
      // The body's knockout outline only shows when the hover motion lifts a card out (motions.mjs).
      L(rr(1, 2, 14, 12, R3), { ...Bt, gap: W }),
      L(pill(9.5, 6.25, 4.5, 3.5), { cut: [C(circ(11.25, 8, 0.75))] })
    ]
  },
  headphones: {
    label: '耳机',
    key: 'live',
    layers: [
      L('M1.625 10V8a6.375 6.375 0 0 1 12.75 0V10', { sw: 1.25, ...Bt }),
      L(rr(1, 9, 3.5, 6, r), { gap: W }),
      L(rr(11.5, 9, 3.5, 6, r), { gap: W })
    ]
  },
  mic: {
    label: '话筒',
    key: 'portrait',
    allow: { spacing: '立柱顶端藏在支架后面，它和话筒头之间的距离看不见，不算间距' },
    layers: [
      // Capsule 4.5..11.5 with its bottom centre at (8, 6); the stand is concentric with it, a
      // 1.125 gap out (inner radius 4.625). The capsule is the light body; stand and base are blue.
      L(rr(4.5, 1, 7, 8.5, 3.5), Bt),
      L('M2.75 4.75V6a5.25 5.25 0 0 0 10.5 0V4.75', { sw: 1.25 }),
      L(body(5, 13.5, 6, 1.5, 0.75, [{ x: 7.375, w: D, h: 2.5, c: 0 }]))
    ]
  },
  cloud: {
    label: '云',
    key: 'wide',
    layers: [
      // The sun sits behind the cloud: the cloud covers its lower-left quarter, so the overlap is
      // plain to see, not a touch at the edges.
      L(circ(11.25, 6, 3.5)),
      L(pill(1, 8.5, 11.5, 5) + circ(6.25, 8.5, 3.5), { ...Bt, gap: W })
    ]
  },
  'shopping-bag': {
    label: '购物袋',
    key: 'portrait',
    layers: [
      L('M5 6.5V4.75a3 3 0 0 1 6 0V6.5', { sw: K }),
      L(rr(2, 6, 12, 9, [S, S, R, R]), { ...Bt, gap: W })
    ]
  },
  battery: {
    label: '电池',
    key: 'wide',
    layers: [
      L(rr(1, 2.5, 12.5, 11, R) + rr(13.5, 6, 1.5, 4, [0, 0.75, 0.75, 0]), Bt),
      L(pill(3.75, 5, D, 6)),
      L(pill(6.25, 5, D, 6)),
      L(pill(8.75, 5, D, 6))
    ]
  },
  archive: {
    label: '归档',
    key: 'square',
    layers: [
      L(rr(2, 2, 12, 3.5, r), Bt),
      L(rr(3, 6.5, 10, 7.5, [S, S, R, R]), Bt),
      L(pill(6.25, 8.75, 3.5, D))
    ]
  },
  mail: {
    label: '邮件',
    key: 'wide',
    layers: [
      // The flap is the top of the body itself, clipped by a circle: a round-bottomed flap
      // instead of a V, and the body's own corners, exactly.
      // The body's knockout outline only shows when the hover motion lifts a letter out from
      // behind it (motions.mjs).
      L(rr(1, 2.5, 14, 11, R), { ...Bt, gap: W }),
      L(rr(1, 2.5, 14, 11, R), { clip: circ(8, -0.75, 8.75) })
    ]
  },
  printer: {
    label: '打印机',
    key: 'square',
    layers: [
      // Paper waiting on top, one gap above the body; the printed sheet comes out in blue, square
      // on the side cut off by the slot.
      L(rr(4.5, 2, 7, 2.5, q), Bt),
      L(rr(2, 5.5, 12, 6.5, M), Bt),
      L(rr(4.5, 9.5, 7, 4.5, [0, 0, r, r]), { gap: W })
    ]
  },
  home: {
    label: '首页',
    key: 'square',
    layers: [
      // A house in one light outline: a 45° roof (the allowed slope), rounded at the ridge and
      // the eaves. The blue door stands on the bottom edge.
      // The ridge sits 0.62 above the keyline so the rounded tip still reaches it.
      L(polygon([[8, 1.38], [14, 7.38], [14, 14], [2, 14], [2, 7.38]], [1.5, 1, M, M, 1]), Bt),
      L(rr(6.5, 9.5, 3, 4.5, [1.5, 1.5, 0, 0]))
    ]
  },
  search: {
    label: '搜索',
    key: 'live',
    layers: [
      // Light glass, a blue handle at 45° tucked into it, and a short blue glint.
      L(rot(12.5, 12.5, 6, 2.5, 45, 1.25)),
      L(circ(6.75, 6.75, 5.75), { ...Bt, gap: W }),
      L('M4 7A3 3 0 0 1 7 4', { sw: D })
    ]
  },
  settings: {
    label: '设置',
    key: 'circle',
    layers: [
      // A light gear: a disc with eight teeth turned in 45° steps, and a blue hub.
      L(circ(8, 8, 5.25) + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => rot(8 + 5.6 * Math.cos((a * Math.PI) / 180), 8 + 5.6 * Math.sin((a * Math.PI) / 180), 2.8, 2.6, a, 0.75)).join(''), Bt),
      L(circ(8, 8, 2.25))
    ]
  },
  tv: {
    label: '电视',
    key: 'landscape',
    layers: [
      // Light case, blue screen, and a wide base bar a gap of 1 below.
      L(rr(1, 2, 14, 9.5, R), Bt),
      L(rr(3, 4, 10, 5.5, r)),
      L(pill(4, 12.5, 8, 1.5))
    ]
  },
  bookmark: {
    label: '书签',
    key: 'portrait',
    layers: [
      // A closed book with a blue ribbon hanging from its top edge; the notch is a round cut.
      L(rr(2, 1, 12, 14, M), Bt),
      L(rr(6.75, 1, 3.5, 7.5, 0), { cut: [C(circ(8.5, 8.5, 1))] })
    ]
  },
  download: {
    label: '下载',
    key: 'square',
    layers: [
      // A light box and a blue arrow coming down into it. The arrow's head is the allowed 45°
      // slope; the tip sits 0.41 low so its rounded end lands where the drawn tip would be.
      L(rr(2, 6.5, 12, 7.5, M), Bt),
      L(polygon([[7.25, 2], [8.75, 2], [8.75, 7.5], [11.5, 7.5], [8, 11.41], [4.5, 7.5], [7.25, 7.5]], [0.75, 0.75, 0, 1, 1, 1, 0]), { gap: W })
    ]
  },
  upload: {
    label: '上传',
    key: 'square',
    layers: [
      L(rr(2, 6.5, 12, 7.5, M), Bt),
      L(polygon([[8, 1.59], [11.5, 5.5], [8.75, 5.5], [8.75, 11.5], [7.25, 11.5], [7.25, 5.5], [4.5, 5.5]], [1, 1, 0, 0.75, 0.75, 0, 1]), { gap: W })
    ]
  },
  share: {
    label: '分享',
    key: 'square',
    layers: [
      // A light box and a blue arrow rising out of it and turning right. The box is as tall as
      // upload's and the arrow spans the same height (its foot level with upload's shaft, its head
      // as high as upload's tip). The shaft stands on the box's centre line (x 7); the arrow cuts
      // a gap of W out of the box where it crosses it. The shaft is drawn from the foot up, so the
      // hover motion can grow it.
      L(rr(2, 6.5, 10, 7.5, M), Bt),
      L('M7 10.75V7.65A3.5 3.5 0 0 1 10.5 4.15H11.5', { sw: K, gap: W, part: 'arrow' }),
      L(polygon([[11, 0.65], [14.5, 4.15], [11, 7.65]], 1), { gap: W, part: 'arrow' })
    ]
  },
  edit: {
    label: '编辑',
    key: 'square',
    layers: [
      // Light barrel, blue nib and blue cap. The cap is cut off the barrel by a gap of 1. The far
      // corners sit 0.41 out so their rounded ends reach the box.
      L(polygon([[2, 14], ...pen(0, 10.304, 4)], [1, 0, 0, 0, 0]), Bt),
      L(polygon([[2, 14], ...pen(0, 10.304, 4)], [1, 0, 0, 0, 0]), { clip: polygon([[-6, 2.828], [12, 20.828], [-6, 20.828]]) }),
      L(polygon(pen(11.304, 13.554, 4), [0, 1, 1, 0]))
    ]
  },
  heart: {
    label: '喜欢',
    // Two round lobes and two large arcs tangent to them, meeting in a tip rounded at 1.25: arcs
    // instead of the slanted sides a heart is usually drawn with. A short blue glint sits 2 in.
    key: 'landscape',
    layers: [
      L('M8 3.354A4 4 0 0 1 14.695 7.531A12 12 0 0 1 8.511 13.891A1.25 1.25 0 0 1 7.489 13.891A12 12 0 0 1 1.305 7.531A4 4 0 0 1 8 3.354Z', Bt),
      L('M3.625 6A1.375 1.375 0 0 1 5 4.625', { sw: D })
    ]
  },
  play: {
    label: '播放',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      // The play triangle keeps its familiar proportions (not the 45° slope), centred by its
      // centroid; every corner is rounded.
      L(polygon([[5.75, 4], [12, 8], [5.75, 12]], 1))
    ]
  },
  phone: {
    label: '手机',
    key: 'tall',
    layers: [
      L(rr(3, 1, 10, 14, R), Bt),
      L(pill(6.5, 3, 3, D) + pill(6, 11.75, 4, D))
    ]
  },
  laptop: {
    label: '电脑',
    key: 'wide',
    layers: [
      // The light lid stands one gap above the blue base, which is wider: the lid shows its own
      // corners across the gap (seam radius 1).
      L(rr(2, 2.5, 12, 8, [M, M, S, S]), Bt),
      L(rr(1, 11.5, 14, 2, t))
    ]
  },
  location: {
    label: '定位',
    key: 'circle',
    layers: [
      // The locate-me crosshair (a map pin needs slopes outside the allowed list): a light disc,
      // four blue ticks laid over its rim out to the keyline, and a blue centre.
      L(circ(8, 8, 5.25), Bt),
      L(pill(7.25, 1, K, 3) + pill(7.25, 12, K, 3) + pill(1, 7.25, 3, K) + pill(12, 7.25, 3, K), { gap: W }),
      L(circ(8, 8, 2))
    ]
  },
  music: {
    label: '音乐',
    key: 'square',
    layers: [
      // Two beamed notes with a level beam: the blue beam and stems first, the light heads over
      // the stem ends so the stems disappear into them.
      L(polygon([[5.5, 2], [14, 2], [14, 11], [12.5, 11], [12.5, 4.5], [7, 4.5], [7, 11], [5.5, 11]], [q, q, 0, 0, 0, 0, 0, 0])),
      L(circ(4.5, 11.5, 2.5) + circ(11.5, 11.5, 2.5), { ...Bt, gap: W })
    ]
  },
  link: {
    label: '链接',
    key: 'flat',
    layers: [
      // Two light half-links face each other; the blue bar joins them, exactly 1 from every edge.
      L('M5.75 5H5a3 3 0 0 0 0 6H5.75M10.25 5H11a3 3 0 0 1 0 6H10.25', { sw: 2, ...Bt }),
      L(pill(4, 7, 8, 2))
    ]
  },
  cart: {
    label: '购物车',
    key: 'square',
    layers: [
      // A light basket kept one gap inside the blue handle-and-frame stroke; the wheels hang from
      // the frame. The frame bends round the basket's corner on an arc about the same centre
      // (8, 7.5), so the gap stays 1 all the way round; the handle turns down with a thin-stroke
      // corner of 1.
      L(rr(6, 3.5, 8, 6, M), Bt),
      L('M2.75 2.75H3.25A1 1 0 0 1 4.25 3.75V7.5A3.75 3.75 0 0 0 8 11.25H13', { sw: K }),
      // The wheels sit symmetrically under the basket (centre x 10).
      L(circ(7.25, 12.75, 1.25) + circ(12.75, 12.75, 1.25))
    ]
  },
  'circle-check': {
    label: '完成',
    key: 'circle',
    layers: [
      // The status-mark family: one light disc and a blue mark drawn with the K stroke, kept
      // inside the central circle of 8. The check is the allowed 45° slope, centred on its box.
      L(circ(8, 8, 7), Bt),
      L('M5.25 7.75L7.25 9.75L10.75 6.25', { sw: K })
    ]
  },
  'circle-plus': {
    label: '添加',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      L('M8 5V11', { sw: K }),
      L('M5 8H11', { sw: K })
    ]
  },
  'circle-x': {
    label: '关闭',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      L('M5.75 5.75L10.25 10.25', { sw: K }),
      L('M10.25 5.75L5.75 10.25', { sw: K })
    ]
  },
  info: {
    label: '信息',
    key: 'circle',
    layers: [
      // A dot over a stem, one stroke apart, the pair centred on the disc.
      L(circ(8, 8, 7), Bt),
      L('M8 7.625V11.625', { sw: K }),
      L(circ(8, 4.75, 1.125))
    ]
  },
  'circle-alert': {
    label: '警告',
    key: 'circle',
    layers: [
      // info turned upside down: a stem over a dot.
      L(circ(8, 8, 7), Bt),
      L('M8 4.375V8.375', { sw: K }),
      L(circ(8, 11.25, 1.125))
    ]
  },
  'circle-help': {
    label: '帮助',
    key: 'circle',
    layers: [
      // A question mark from arcs only: a half circle over the top, then two quarter arcs of
      // radius 1 turning it back to the centre line; the dot sits one gap below, as in circle-alert.
      L(circ(8, 8, 7), Bt),
      L('M6 6.375A2 2 0 0 1 10 6.375A1 1 0 0 1 9 7.375A1 1 0 0 0 8 8.375', { sw: K }),
      L(circ(8, 11.25, 1.125))
    ]
  },
  eye: {
    label: '眼睛',
    key: 'wide',
    layers: [
      // A light eye made of two arcs with rounded tips; a blue iris in the middle.
      L(eyeOutline(8, 8, 14, 11, 1.25), Bt),
      L(circ(8, 8, 3))
    ]
  },
  flag: {
    label: '旗帜',
    key: 'portrait',
    layers: [
      // A blue pole running the full height, and a light cloth hung high on it, one gap away,
      // wider than tall, with a gentle wave along its top and bottom edges.
      L(pill(2, 1, K, 14)),
      L(flagWave(4.5, 1, 14, 1.25, 6.5, 7.25, 9.75), Bt)
    ]
  },
  key: {
    label: '钥匙',
    key: 'flat',
    layers: [
      // A light ring for the bow (a light stroke, as the link's half-rings) filling the height,
      // in front of a blue shaft 2.5 thick with two square teeth of equal width; the ring cuts a
      // gap of W round itself, so the shaft starts 1 out.
      L(polygon([[7.5, 6.75], [15, 6.75], [15, 12], [13.5, 12], [13.5, 9.25], [12.5, 9.25], [12.5, 12], [11, 12], [11, 9.25], [7.5, 9.25]], [0, 1, 0.5, 0.5, 0, 0, 0.5, 0.5, 0, 0])),
      L(circ(5, 8, 2.75), { sw: 2.5, ...Bt, gap: W })
    ]
  },
  'credit-card': {
    label: '银行卡',
    key: 'wide',
    layers: [
      // A light card; the magnetic stripe is a band of the body itself in blue, and one blue line.
      L(rr(1, 2.5, 14, 11, R), Bt),
      L(rr(1, 2.5, 14, 11, R), { clip: rr(0, 5.25, 16, 2.5) }),
      L(pill(3.25, 10, 3.5, D))
    ]
  },
  shield: {
    label: '安全',
    key: 'portrait',
    layers: [
      // A light shield whose sides curve into a rounded tip; a blue check (the allowed 45°).
      L(shieldPath(10, 1.25), Bt),
      L('M5.5 7.75L7.25 9.5L10.5 6.25', { sw: K })
    ]
  },
  lightbulb: {
    label: '灯泡',
    key: 'tall',
    layers: [
      // A light glass (a circle running into a straight neck) and a blue screw base one gap
      // below, cut straight across so glass and base share one outline: a collar and a narrower
      // contact. A short blue glint in the glass.
      L('M5.5 11V10.33A5 5 0 1 1 10.5 10.33V11Z', Bt),
      L(rr(5.5, 12, 5, 1.5, [0, 0, 0.5, 0.5]) + rr(6.25, 13, 3.5, 2, [0, 0, 0.75, 0.75])),
      L('M5.25 6A2.75 2.75 0 0 1 8 3.25', { sw: D })
    ]
  },
  video: {
    label: '视频',
    key: 'wide',
    layers: [
      // A light camcorder body and a blue lens one gap to its right that widens away from it,
      // drawn with an arc instead of the usual slanted sides.
      L(rr(1, 2.5, 10, 11, R), Bt),
      L(camLens(3, 6.5))
    ]
  },
  users: {
    label: '群组',
    key: 'square',
    layers: [
      // A light person behind, up and to the right; the front person (blue head, light shoulders,
      // as in user) sits lower and covers about a third of it with a knockout outline. The two
      // heads are exactly one gap apart.
      L(circ(10.25, 4.25, 2.25) + rr(6.5, 7.5, 7.5, 6.5, [3, 3, r, r]), Bt),
      L(circ(5.8125, 7.5, 2.25), { gap: W, part: 'front' }),
      L(rr(2, 10.75, 7.625, 3.25, [3, 3, r, r]), { ...Bt, gap: W, part: 'front' })
    ]
  },
  globe: {
    label: '地球',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      L('M8 1.625A3 6.375 0 0 1 8 14.375A3 6.375 0 0 1 8 1.625Z', { sw: D, clip: circ(8, 8, 7) }),
      L('M1.625 8H14.375', { sw: D, clip: circ(8, 8, 7) })
    ]
  },
  calculator: {
    label: '计算器',
    key: 'portrait',
    layers: [
      L(rr(2, 1, 12, 14, M), Bt),
      // The display sits 2 in from the top and sides; the keys are a square grid of 2.25, the
      // bottom row 2.25 up from the bottom edge.
      L(rr(4, 3, 8, 2.5, 1)),
      L([5.75, 8, 10.25].map((x) => circ(x, 7.625, 0.625) + circ(x, 9.875, 0.625) + circ(x, 12.125, 0.625)).join(''))
    ]
  },
  history: {
    label: '历史记录',
    key: 'circle',
    layers: [
      // The circular arrow is the light body; its blue head meets it directly (one element, one
      // part). The blue hands stand exactly one gap inside the ring.
      L(HIST.arc, { ...Bt, sw: 2, part: 'arrow' }),
      L(HIST.head, { part: 'arrow' }),
      // The hour hand is the shorter one, 2 clear of the ring.
      L('M8 4.75V8', { sw: K }),
      L('M8 8H10.25', { sw: K })
    ]
  },
  'log-out': {
    label: '退出登录',
    key: 'square',
    layers: [
      L(rr(2, 2, 7.5, 12, M), Bt),
      L(polygon([[5, 7.25], [10.5, 7.25], [10.5, 4.5], [14.41, 8], [10.5, 11.5], [10.5, 8.75], [5, 8.75]], [0.75, 0, 1, 1, 1, 0, 0.75]), { gap: W })
    ]
  },
  database: {
    label: '数据库',
    key: 'portrait',
    layers: [
      // A cylinder split into three tiers by two curved seams, like stacked disks; the top tier
      // is blue. The seams bow down as the rim of a cylinder seen a little from above.
      L(rr(2, 1, 12, 14, M), { ...Bt, cut: [C('M1 4.625A18.5 18.5 0 0 0 15 4.625', W), C('M1 9.625A18.5 18.5 0 0 0 15 9.625', W)] }),
      L(rr(2, 1, 12, 14, M), { clip: circ(8, -12.500, 18.0) })
    ]
  },
  server: {
    label: '服务器',
    key: 'landscape',
    layers: [
      // Two rack units: one rounded outline cut straight across by a gap of 1, so the cut corners
      // are square. Each unit has a blue drive slot 3 in from the left and a status light the same
      // 2.125 in from the right as from its unit's top and bottom.
      L(rr(1, 2, 14, 5.5, [R3, R3, 0, 0]), Bt),
      L(rr(1, 8.5, 14, 5.5, [0, 0, R3, R3]), Bt),
      L(pill(4, 4.125, 4, D) + pill(4, 10.625, 4, D)),
      L(circ(12.25, 4.75, 0.625) + circ(12.25, 11.25, 0.625))
    ]
  },
  wifi: {
    label: '无线网络',
    key: 'wide',
    layers: [
      // As on iOS: a fan of one rounded wedge and three bands around a common centre, each a gap
      // of 1 from the next, all cut along the same two radii. Outer two bands light, inner band
      // and wedge blue (signal strength). Outer band first, wedge last.
      L(FAN.band(3), Bt),
      L(FAN.band(2), Bt),
      L(FAN.band(1)),
      L(FAN.wedge)
    ]
  },
  power: {
    label: '电源',
    key: 'circle',
    layers: [
      // A light round button with the blue power mark centred on it (no rim, like the dials). The
      // ring opens 50° either side of the top so its ends sit 1 from the stem.
      L(circ(8, 8, 7), Bt),
      L('M5.51 6.161A3.25 3.25 0 1 0 10.49 6.161M8 4.5V8', { sw: K })
    ]
  },
  sliders: {
    label: '调节',
    key: 'landscape',
    layers: [
      // Two blue tracks with light knobs in front, cutting a gap of W out of the tracks. The knobs
      // sit point-symmetric about the centre, each leaving a short stub of track on one side.
      L(pill(1, 3.75, 14, K) + pill(1, 10.75, 14, K)),
      L(circ(9.5, 4.5, 2.5), { ...Bt, gap: W }),
      L(circ(6.5, 11.5, 2.5), { ...Bt, gap: W })
    ]
  },
  copy: {
    label: '复制',
    key: 'portrait',
    layers: [
      // Two sheets: the copy behind in blue, the light sheet in front cutting a gap of W out of it
      // and covering about a third of it.
      L(rr(5.5, 1, 8.5, 10, M)),
      L(rr(2, 5, 8.5, 10, M), { ...Bt, gap: W })
    ]
  },
  clipboard: {
    label: '剪贴板',
    key: 'portrait',
    layers: [
      // A light board and a blue clip laid over its top edge, cutting a gap of W round itself.
      L(rr(2, 2.5, 12, 12.5, M), Bt),
      L(rr(5, 1, 6, 3, 1), { gap: W }),
      L(pill(5, 7.25, 6, D)),
      L(pill(5, 9.875, 3.5, D))
    ]
  },
  inbox: {
    label: '收件箱',
    key: 'landscape',
    layers: [
      // A light tray; its lower part is blue, clipped from the body so it keeps the body's
      // corners, with the dip of the tray in the middle.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(rr(1, 2, 14, 12, R3), { clip: polygon([[-1, 8.5], [5, 8.5], [5, 10.5], [11, 10.5], [11, 8.5], [17, 8.5], [17, 17], [-1, 17]], [0, 1, 1, 1, 1, 0, 0, 0]) })
    ]
  },
  receipt: {
    label: '账单',
    key: 'portrait',
    layers: [
      // A slip of paper the size of file-text whose bottom edge is three even half-circle
      // scallops (r 2): the outer ones run straight on from the sides, so there are no points.
      L(rr(2, 1, 12, 12, [M, M, 0, 0]) + [4, 8, 12].map((x) => circ(x, 13, 2)).join(''), Bt),
      L(pill(5, 4.25, 6, D) + pill(5, 6.875, 6, D)),
      L(pill(5, 9.5, 3.5, D))
    ]
  },
  package: {
    label: '包裹',
    key: 'square',
    layers: [
      // A light carton whose top flap is cut off by a straight seam, so both sides of the cut
      // keep square corners; a blue strip of tape runs over the seam, clipped to the carton so
      // it shares its top edge.
      L(rr(2, 2, 12, 3.5, [R, R, 0, 0]), Bt),
      L(rr(2, 6.5, 12, 7.5, [0, 0, R, R]), Bt),
      // The tape in two pieces, one on the lid and one on the box, so the lid can lift with its own.
      L(rr(6.5, 2, 3, 3.5, 0), { clip: rr(2, 2, 12, 3.5, [R, R, 0, 0]) }),
      L(rr(6.5, 6.5, 3, 3, [0, 0, 1, 1]), { clip: rr(2, 6.5, 12, 7.5, [0, 0, R, R]) })
    ]
  },
  store: {
    label: '商店',
    key: 'square',
    layers: [
      // A blue awning with a scalloped edge, one gap above the light shop. The door stands on
      // the bottom edge, clipped to the shop so it follows the body's own outline there.
      L(rr(2, 2, 12, 3.5, [r, r, 0, 0]) + [3.5, 6.5, 9.5, 12.5].map((x) => circ(x, 5, 1.5)).join('')),
      L(rr(3, 7.5, 10, 6.5, [S, S, R, R]), Bt),
      L(rr(6.5, 10, 3, 4, [1.5, 1.5, 0, 0]), { clip: rr(3, 7.5, 10, 6.5, [S, S, R, R]) })
    ]
  },
  'lock-open': {
    label: '解锁',
    key: 'portrait',
    layers: [
      // The lock with its shackle swung open: the left leg still runs into the body, the right
      // end stops short on the arc.
      L('M4.75 7V5a3.25 3.25 0 0 1 6.065 -1.625', { sw: K }),
      L(rr(2, 6.5, 12, 8.5, M), { ...Bt, gap: W }),
      L(pill(7.25, 9.25, 1.5, 3))
    ]
  }
};

// Variants (GUIDE.md section 12): the same object with one badge. A mark on the face replaces the
// object's own detail; a corner mark notches the object; 'off' crosses it out.
Object.assign(ICONS, {
  'folder-plus': badge(ICONS.folder, 'plus', { at: [8, 9], drop: [0, 2], label: '新建文件夹' }),
  'calendar-check': badge(ICONS.calendar, 'check', { at: [8, 9.75], drop: [1], label: '已排期' }),
  'clipboard-check': badge(ICONS.clipboard, 'check', { at: [8, 9.5], drop: [2, 3], label: '任务完成' }),
  'user-check': badge(ICONS.user, 'check', { label: '已认证用户' }),
  'search-sparkle': badge(ICONS.search, 'sparkle', { drop: [2], label: 'AI 搜索' }),
  'image-sparkle': badge(ICONS.image, 'sparkle', { drop: [2], label: 'AI 生成图片' }),
  'bell-off': badge(ICONS.bell, 'off', { label: '免打扰' }),
  'eye-off': badge(ICONS.eye, 'off', { label: '隐藏' })
});
