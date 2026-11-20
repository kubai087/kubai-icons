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
  'message-square': {
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
  'battery-full': {
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
  'pencil': {
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
  'map-pin': {
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
  'shopping-cart': {
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
  },
  menu: {
    label: '菜单',
    key: 'wide',
    layers: [
      // Three bars of equal length, 2 thick and 2.5 apart; the middle one is blue. Drawn as
      // strokes, so the motion can draw them on without running past their ends.
      L('M2 3.5H14', { sw: 2, ...Bt }),
      L('M2 8H14', { sw: 2 }),
      L('M2 12.5H14', { sw: 2, ...Bt })
    ]
  },
  grid: {
    label: '网格',
    key: 'square',
    layers: [
      // Nine light tiles, three by three, a gap of 1 apart; the centre tile is blue.
      L([0, 1, 2].flatMap((i) => [0, 1, 2].filter((j) => i !== 1 || j !== 1).map((j) => rr(2 + (i * 13) / 3, 2 + (j * 13) / 3, 10 / 3, 10 / 3, 1))).join(''), Bt),
      L(rr(2 + 13 / 3, 2 + 13 / 3, 10 / 3, 10 / 3, 1))
    ]
  },
  list: {
    label: '列表',
    key: 'landscape',
    layers: [
      // Three rows: a blue dot and a light bar one gap to its right. One layer per row's bar, so
      // the motion can lay them out one after another.
      L([3.25, 8, 12.75].map((y) => circ(2.25, y, 1.25)).join('')),
      L(pill(4.5, 2, 10.5, 2.5), Bt),
      L(pill(4.5, 6.75, 10.5, 2.5), Bt),
      L(pill(4.5, 11.5, 10.5, 2.5), Bt)
    ]
  },
  sun: {
    label: '太阳',
    key: 'circle',
    layers: [
      // A light disc ringed by eight blue dots, one gap out (dots instead of rays, which would
      // need slopes). The straight and the diagonal dots are separate layers.
      L(circ(8, 8, 4.25), Bt),
      L([0, 90, 180, 270].map((a) => circ(8 + 6.125 * Math.cos((a * Math.PI) / 180), 8 + 6.125 * Math.sin((a * Math.PI) / 180), 0.875)).join('')),
      L([45, 135, 225, 315].map((a) => circ(8 + 6.125 * Math.cos((a * Math.PI) / 180), 8 + 6.125 * Math.sin((a * Math.PI) / 180), 0.875)).join(''))
    ]
  },
  'rotate-cw': {
    label: '顺时针旋转',
    key: 'circle',
    layers: [
      // history's arrow turned the other way, without the hands: a light ring open at the upper
      // right, drawn clockwise from just below the right up to the opening, where the blue head
      // points on round, down and to the right.
      L('M13.909 9.042A6 6 0 1 1 12.243 3.757', { ...Bt, sw: 2, part: 'arrow' }),
      L(polygon([[15.008, 6.522], [9.768, 6.232], [14.718, 1.282]], 1), { part: 'arrow' })
    ]
  },
  'chart-bar': {
    label: '图表',
    key: 'square',
    layers: [
      // Three bars a gap of 1 apart on one baseline; the tallest, in the middle, is blue. One
      // layer per bar, so the motion can raise them one after another.
      L(rr(2, 7.5, 10 / 3, 6.5, 1), Bt),
      L(rr(2 + 13 / 3, 2, 10 / 3, 12, 1)),
      L(rr(2 + 26 / 3, 5, 10 / 3, 9, 1), Bt)
    ]
  },
  'chart-pie': {
    label: '饼图',
    key: 'circle',
    layers: [
      // A light disc with its upper right quarter cut away along two straight seams 1 wide; the
      // quarter is blue, clipped from the same disc so it keeps its outline exactly.
      L(circ(8, 8, 7), { ...Bt, cut: [C(rr(7.5, -1, 10, 9.5))] }),
      L(circ(8, 8, 7), { clip: rr(8.5, 0, 8, 7.5) })
    ]
  },
  filter: {
    label: '筛选',
    key: 'circle',
    layers: [
      // A funnel needs slopes, so filter uses the other common sign: three lines that get shorter
      // (8, 5.5 and 3 long), centred on a light disc as in the status marks.
      L(circ(8, 8, 7), Bt),
      L('M4.75 5.5H11.25', { sw: K }),
      L('M6 8H10', { sw: K }),
      L('M7.25 10.5H8.75', { sw: K })
    ]
  },
  briefcase: {
    label: '公文包',
    key: 'landscape',
    layers: [
      // A blue handle behind a light case, which cuts a gap of W round itself; a blue clasp
      // centred on the case, 3 in from its top and bottom.
      L('M5.75 6V3.75A1 1 0 0 1 6.75 2.75H9.25A1 1 0 0 1 10.25 3.75V6', { sw: K }),
      L(rr(1, 5.5, 14, 8.5, M), { ...Bt, gap: W }),
      L(rr(6.5, 8.5, 3, 2.5, 1))
    ]
  },
  keyboard: {
    label: '键盘',
    key: 'wide',
    layers: [
      // A light keyboard with two rows of four blue keys and a space bar under them; the corner
      // keys sit 2.25 in from both nearby edges. One layer per row, so the motion can press them
      // one after another.
      L(rr(1, 2.5, 14, 11, R), Bt),
      L([0, 1, 2, 3].map((k) => circ(4 + (k * 8) / 3, 5.5, 0.75)).join('')),
      L([0, 1, 2, 3].map((k) => circ(4 + (k * 8) / 3, 8, 0.75)).join('')),
      L(pill(5.5, 9.875, 5, D))
    ]
  },
  toggle: {
    label: '切换开关',
    key: 'flat',
    layers: [
      // A light track and a blue knob at its left end, 1 in from the track's top, bottom and end.
      L(pill(1, 4, 14, 8), Bt),
      L(circ(5, 8, 3))
    ]
  },
  'circle-minus': {
    label: '移除',
    key: 'circle',
    layers: [
      // circle-plus without its upright stroke.
      L(circ(8, 8, 7), Bt),
      L('M5 8H11', { sw: K })
    ]
  },
  'circle-dot': {
    label: '单选',
    key: 'circle',
    layers: [
      // A selected radio button: a light disc and a blue dot at its centre, 4 in from the rim.
      L(circ(8, 8, 7), Bt),
      L(circ(8, 8, 3))
    ]
  },
  checkbox: {
    label: '复选框',
    key: 'square',
    layers: [
      // A light box with circle-check's check, centred.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M5.25 7.75L7.25 9.75L10.75 6.25', { sw: K })
    ]
  },
  'plus-square': {
    label: '新增',
    key: 'square',
    layers: [
      L(rr(2, 2, 12, 12, R), Bt),
      L('M8 5V11', { sw: K }),
      L('M5 8H11', { sw: K })
    ]
  },
  'more-horizontal': {
    label: '更多',
    key: 'flat',
    layers: [
      // A light capsule (toggle's track) with three blue dots a gap of 1 apart; the outer dots
      // are concentric with the capsule's round ends. One layer per dot, so the motion can put
      // them down one after another.
      L(pill(1, 4, 14, 8), Bt),
      L(circ(5, 8, 1)),
      L(circ(8, 8, 1)),
      L(circ(11, 8, 1))
    ]
  },
  loader: {
    label: '加载',
    key: 'circle',
    layers: [
      // A light ring (history's: stroke 2, outer edge on the keyline) with a blue quarter printed
      // on it from the top round to the right; its round ends stay inside the ring.
      L(circ(8, 8, 6), { ...Bt, sw: 2 }),
      L('M8 2A6 6 0 0 1 14 8', { sw: 2 })
    ]
  },
  appearance: {
    label: '外观',
    key: 'circle',
    layers: [
      // One disc, half light and half blue: the blue half is clipped from the same disc, so it
      // keeps the outline exactly and meets the light half with no seam.
      L(circ(8, 8, 7), Bt),
      L(circ(8, 8, 7), { clip: rr(8, 0, 9, 16, 0) })
    ]
  },
  'rotate-ccw': {
    label: '逆时针旋转',
    key: 'circle',
    layers: [
      // rotate-cw mirrored: the ring opens at the upper left and the head points on round
      // counterclockwise, down and to the left.
      L('M2.091 9.042A6 6 0 1 0 3.757 3.757', { ...Bt, sw: 2, part: 'arrow' }),
      L(polygon([[1.282, 1.282], [6.232, 6.232], [0.992, 6.522]], 1), { part: 'arrow' })
    ]
  },
  'log-in': {
    label: '登录',
    key: 'square',
    layers: [
      // log-out turned round: the light door on the right and the blue arrow coming in from the
      // left, its head on the door, cutting a gap of W round itself.
      L(rr(6.5, 2, 7.5, 12, M), Bt),
      L(polygon([[2, 7.25], [7.5, 7.25], [7.5, 4.5], [11.41, 8], [7.5, 11.5], [7.5, 8.75], [2, 8.75]], [0.75, 0, 1, 1, 1, 0, 0.75]), { gap: W })
    ]
  },
  sidebar: {
    label: '侧边栏',
    key: 'landscape',
    layers: [
      // One window split by a straight seam 1 wide (as chart-pie): a blue side panel 4 wide on
      // the left, the light content area on the right. Both are taken from the same outline, so
      // they keep its corners and the seam's ends stay square.
      L(rr(1, 2, 14, 12, R3), { ...Bt, cut: [C(rr(-1, -1, 7, 18))] }),
      L(rr(1, 2, 14, 12, R3), { clip: rr(-1, -1, 6, 18) })
    ]
  },
  undo: {
    label: '撤销',
    key: 'square',
    layers: [
      // rotate-ccw's ring and head as a U-turn: a light band (stroke 2) runs from the tail at the
      // bottom round the right and back along the top, where the blue head points left. Drawn
      // from the tail, so the motion can draw it on toward the head. The head's base corners
      // sit 1.25 out, so its rounded top still reaches the keyline.
      L('M5 13H8.625A4.375 4.375 0 0 0 8.625 4.25H5.5', { ...Bt, sw: 2, part: 'arrow' }),
      L(polygon([[5.5, 0.75], [5.5, 7.75], [1.59, 4.25]], 1), { part: 'arrow' })
    ]
  },
  redo: {
    label: '重做',
    key: 'square',
    layers: [
      // undo mirrored.
      L('M11 13H7.375A4.375 4.375 0 0 1 7.375 4.25H10.5', { ...Bt, sw: 2, part: 'arrow' }),
      L(polygon([[10.5, 0.75], [14.41, 4.25], [10.5, 7.75]], 1), { part: 'arrow' })
    ]
  },
  'arrow-left-right': {
    label: '左右互换',
    key: 'circle',
    layers: [
      // The status-mark family: a light disc and two blue arrows drawn with the K stroke, right
      // above and left below, their heads the allowed 45° and a gap of 1 apart.
      L(circ(8, 8, 7), Bt),
      L('M5 6H11M9.5 4.5L11 6L9.5 7.5', { sw: K }),
      L('M11 10H5M6.5 8.5L5 10L6.5 11.5', { sw: K })
    ]
  },
  'arrow-up-down': {
    label: '上下排序',
    key: 'circle',
    layers: [
      // arrow-left-right turned a quarter: up on the left, down on the right.
      L(circ(8, 8, 7), Bt),
      L('M6 11V5M4.5 6.5L6 5L7.5 6.5', { sw: K }),
      L('M10 5V11M8.5 9.5L10 11L11.5 9.5', { sw: K })
    ]
  },
  'align-left': {
    label: '左对齐',
    key: 'wide',
    layers: [
      // menu's three bars with a short blue one in the middle, flush left. Drawn from the side
      // they are aligned to, so the motion writes them on from there.
      L('M2 3.5H14', { sw: 2, ...Bt }),
      L('M2 8H9', { sw: 2 }),
      L('M2 12.5H14', { sw: 2, ...Bt })
    ]
  },
  'align-center': {
    label: '居中对齐',
    key: 'wide',
    layers: [
      L('M2 3.5H14', { sw: 2, ...Bt }),
      L('M4.5 8H11.5', { sw: 2 }),
      L('M2 12.5H14', { sw: 2, ...Bt })
    ]
  },
  'align-right': {
    label: '右对齐',
    key: 'wide',
    layers: [
      L('M14 3.5H2', { sw: 2, ...Bt }),
      L('M14 8H7', { sw: 2 }),
      L('M14 12.5H2', { sw: 2, ...Bt })
    ]
  },
  table: {
    label: '表格',
    key: 'landscape',
    layers: [
      // One sheet cut by straight seams 1 wide: a blue header row on top, then two light rows of
      // two cells. Every piece is taken from the same outline, so it keeps the sheet's corners.
      L(rr(1, 2, 14, 12, R3), { clip: rr(-1, -1, 18, 6) }),
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, 6, 18, 3.5), cut: [C(rr(7.5, -1, 1, 18))] }),
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, 10.5, 18, 7), cut: [C(rr(7.5, -1, 1, 18))] })
    ]
  },
  'message-circle': {
    label: '消息',
    key: 'circle',
    layers: [
      // A round bubble whose lower left quarter is square, the corner that says speech (as
      // message-square's), with three blue dots a gap of 1 apart. One layer per dot, so the
      // motion can make them hop one after another.
      L('M1 8A7 7 0 1 1 8 15H1Z', Bt),
      L(circ(5, 8, 1)),
      L(circ(8, 8, 1)),
      L(circ(11, 8, 1))
    ]
  },
  'messages-square': {
    label: '对话',
    key: 'landscape',
    layers: [
      // Two bubbles facing each other, drawn like copy: the blue one behind at the top right,
      // its square corner at the bottom right; the light one in front at the bottom left, its
      // square corner at the bottom left, cutting a gap of W out of the other and covering about
      // a third of it. Two blue lines on the front bubble, one layer each.
      L(rr(5, 2, 10, 8, [M, M, 0, M])),
      L(rr(1, 6, 10, 8, [M, M, M, 0]), { ...Bt, gap: W }),
      L(pill(3.25, 8.25, 5, D)),
      L(pill(3.25, 10.5, 3, D))
    ]
  },
  'app-window': {
    label: '应用窗口',
    key: 'landscape',
    layers: [
      // A light window whose title bar is blue, clipped from the window so it keeps its top
      // corners and meets the page with no seam; two blue lines of content on the page.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(rr(1, 2, 14, 12, R3), { clip: rr(-1, -1, 18, 6.5) }),
      L(pill(3.25, 8, 7, D)),
      L(pill(3.25, 10.5, 4.5, D))
    ]
  },
  columns: {
    label: '分栏',
    key: 'landscape',
    layers: [
      // One page cut into three columns 4 wide by two straight seams 1 wide (as sidebar); the
      // middle column is blue.
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, -1, 6, 18) }),
      L(rr(1, 2, 14, 12, R3), { clip: rr(6, -1, 4, 18) }),
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(11, -1, 6, 18) })
    ]
  },
  indent: {
    label: '增加缩进',
    key: 'wide',
    layers: [
      // menu's light bars at the top and bottom; the middle line is blue and set in, with a
      // small blue chevron (the allowed 45°) pointing at it, a gap of 1 from it and the bars.
      L('M2 3.5H14', { sw: 2, ...Bt }),
      L('M2 12.5H14', { sw: 2, ...Bt }),
      L('M2.5 6.25L4.25 8L2.5 9.75M7 8H14', { sw: K })
    ]
  },
  outdent: {
    label: '减少缩进',
    key: 'wide',
    layers: [
      // indent with the chevron pointing back to the left.
      L('M2 3.5H14', { sw: 2, ...Bt }),
      L('M2 12.5H14', { sw: 2, ...Bt }),
      L('M4.25 6.25L2.5 8L4.25 9.75M7 8H14', { sw: K })
    ]
  },
  type: {
    label: '字体',
    key: 'square',
    layers: [
      // The text-format family: a light tile with a blue letter drawn with the K stroke, kept
      // inside the central 8. One layer per stroke, so the motion can write them in order.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M5 5H11', { sw: K }),
      L('M8 5V11', { sw: K })
    ]
  },
  heading: {
    label: '标题',
    key: 'square',
    layers: [
      L(rr(2, 2, 12, 12, R), Bt),
      L('M5.25 4.5V11.5', { sw: K }),
      L('M10.75 4.5V11.5', { sw: K }),
      L('M5.25 8H10.75', { sw: K })
    ]
  },
  bold: {
    label: '加粗',
    key: 'square',
    layers: [
      // A B of straight strokes and two half-round bowls, the lower one a little wider; drawn
      // in one stroke from the waist, round the lower bowl, up the stem and round the upper one.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M5.5 8H8.75A1.75 1.75 0 0 1 8.75 11.5H5.5V4.5H8.25A1.75 1.75 0 0 1 8.25 8', { sw: K })
    ]
  },
  underline: {
    label: '下划线',
    key: 'square',
    layers: [
      // A U and, a gap of 1 below it, the line.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M6 4.75V6.75A2 2 0 0 0 10 6.75V4.75', { sw: K }),
      L('M4.75 11.25H11.25', { sw: K })
    ]
  },
  maximize: {
    label: '全屏',
    key: 'square',
    layers: [
      // A light screen with four blue corner marks pointing out, 2 in from its edges. One layer
      // per corner, so the motion can push them out to the edges.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M4.75 6.75V4.75H6.75', { sw: K }),
      L('M9.25 4.75H11.25V6.75', { sw: K }),
      L('M11.25 9.25V11.25H9.25', { sw: K }),
      L('M6.75 11.25H4.75V9.25', { sw: K })
    ]
  },
  minimize: {
    label: '退出全屏',
    key: 'square',
    layers: [
      // maximize's corner marks turned to point in. Their corners stay 1.5 apart (not 1), so at
      // 16px the four marks don't close up into a plus.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M4.75 6.5H6.5V4.75', { sw: K }),
      L('M9.5 4.75V6.5H11.25', { sw: K }),
      L('M11.25 9.5H9.5V11.25', { sw: K }),
      L('M6.5 11.25V9.5H4.75', { sw: K })
    ]
  },
  hash: {
    label: '话题',
    key: 'circle',
    layers: [
      // An upright hash on a light disc, as the status marks: two uprights, then two cross bars.
      L(circ(8, 8, 7), Bt),
      L('M6.5 4.5V11.5M9.5 4.5V11.5', { sw: K }),
      L('M4.5 6.5H11.5M4.5 9.5H11.5', { sw: K })
    ]
  },
  notebook: {
    label: '笔记本',
    key: 'portrait',
    layers: [
      // A light notebook with three blue rings crossing its left edge, cutting a gap of W round
      // themselves (as calendar's posts), and a blue label line on the cover.
      L(rr(3.5, 1, 10.5, 14, M), Bt),
      L(pill(7.25, 5, 4, D)),
      L(pill(2, 3.375, 3, D) + pill(2, 7.375, 3, D) + pill(2, 11.375, 3, D), { gap: W })
    ]
  },
  'cloud-upload': {
    label: '上传到云端',
    key: 'wide',
    layers: [
      // A light cloud of a long pill and one round top, with a smaller upload arrow standing on
      // it, cutting a gap of W round itself.
      L(pill(1, 7, 14, 6.5) + circ(8.5, 7, 4.5), Bt),
      L(polygon([[8, 4.59], [10.5, 7.5], [8.75, 7.5], [8.75, 11.5], [7.25, 11.5], [7.25, 7.5], [5.5, 7.5]], [1, 0.5, 0, 0.75, 0.75, 0, 0.5]), { gap: W })
    ]
  },
  'text-cursor': {
    label: '文本光标',
    key: 'wide',
    layers: [
      // A light text field with a line of typed text and an I-beam cursor after it, both blue
      // and both 2.25 in from the field's edges.
      L(rr(1, 2.5, 14, 11, R), Bt),
      L(pill(3.25, 7.375, 3.5, D)),
      L('M9 5.25V10.75M7.5 5.25H10.5M7.5 10.75H10.5', { sw: K })
    ]
  },
  'text-size': {
    label: '字号',
    key: 'square',
    layers: [
      // type's tile with a large T and, standing on the same baseline, a small one.
      L(rr(2, 2, 12, 12, R), Bt),
      L('M4.75 4.75H9.25M7 4.75V11.25', { sw: K }),
      L('M9.75 8.25H11.25M10.5 8.25V11.25', { sw: K })
    ]
  },
  'panel-bottom': {
    label: '底部面板',
    key: 'landscape',
    layers: [
      // sidebar turned on its side: one window cut by a straight seam 1 wide into a light page
      // above and a blue panel 3.5 high below.
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, -1, 18, 10.5) }),
      L(rr(1, 2, 14, 12, R3), { clip: rr(-1, 10.5, 18, 7) })
    ]
  },
  rows: {
    label: '分行',
    key: 'landscape',
    layers: [
      // columns turned on its side: three rows a third high, the middle one blue.
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, -1, 18, 3 + 10 / 3) }),
      L(rr(1, 2, 14, 12, R3), { clip: rr(-1, 3 + 10 / 3, 18, 10 / 3) }),
      L(rr(1, 2, 14, 12, R3), { ...Bt, clip: rr(-1, 4 + 20 / 3, 18, 8) })
    ]
  },
  'layout-dashboard': {
    label: '数据看板',
    key: 'square',
    layers: [
      // Four cards in two columns a gap of 1 apart: tall over short on the left, short over
      // tall on the right; the tall left card is blue. The outer corners are rounded at M, the
      // inner ones at 1, so the four together keep one rounded outline.
      L(rr(2, 2, 5.5, 7, [M, 1, 1, 1])),
      L(rr(2, 10, 5.5, 4, [1, 1, 1, M]), Bt),
      L(rr(8.5, 2, 5.5, 4, [1, M, 1, 1]), Bt),
      L(rr(8.5, 7, 5.5, 7, [1, 1, M, 1]), Bt)
    ]
  },
  kanban: {
    label: '看板',
    key: 'landscape',
    layers: [
      // A light board with three blue lanes of cards hanging from the same top line, a gap of
      // 1 apart and 2.25 in from the board's edges. One layer per lane, so a card can move.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(rr(3.25, 4.25, 2.5, 7.5, 1)),
      L(rr(6.75, 4.25, 2.5, 4, 1)),
      L(rr(10.25, 4.25, 2.5, 5.5, 1))
    ]
  },
  folders: {
    label: '多个文件夹',
    key: 'landscape',
    layers: [
      // Two folders drawn like copy: the blue one behind at the top right, the light one in
      // front at the bottom left, cutting a gap of W out of it and covering about a third of it.
      L(body(5, 3.5, 10, 7, M, [{ x: 5, w: 4.5, h: 1.5, c: 0.75 }])),
      L(body(1, 8, 9.5, 6, M, [{ x: 1, w: 4, h: 1.5, c: 0.75 }]), { ...Bt, gap: W })
    ]
  },
  notepad: {
    label: '记事本',
    key: 'portrait',
    layers: [
      // A pad of paper: a blue gummed band on top cut off by a straight seam (as package's lid),
      // and two blue lines on the light sheet.
      L(rr(2, 1, 12, 14, M), { clip: rr(-1, -1, 18, 4) }),
      L(rr(2, 1, 12, 14, M), { ...Bt, clip: rr(-1, 4, 18, 13) }),
      L(pill(5, 7.75, 6, D) + pill(5, 10.375, 6, D))
    ]
  },
  headset: {
    label: '客服耳麦',
    key: 'live',
    layers: [
      // headphones with a boom: a light arm (a thin support, as the headband) runs from under
      // the left cup to a blue mic one gap clear of the right cup; the cups cut a gap of W round
      // themselves.
      L('M1.625 10V8a6.375 6.375 0 0 1 12.75 0V10', { sw: 1.25, ...Bt }),
      L('M3 13.25H8.5', { sw: D, ...Bt, part: 'boom' }),
      L(pill(7.75, 12.375, 2.75, 1.75), { part: 'boom' }),
      L(rr(1, 9, 3.5, 6, r), { gap: W }),
      L(rr(11.5, 9, 3.5, 6, r), { gap: W })
    ]
  },
  'chart-donut': {
    label: '环形图',
    key: 'circle',
    layers: [
      // chart-pie with a hole of radius 3.5: a light ring whose upper right quarter is cut away
      // along two straight seams 1 wide, and that quarter in blue, clipped from the same ring.
      L(circ(8, 8, 7), { ...Bt, cut: [C(circ(8, 8, 3.5)), C(rr(7.5, -1, 10, 9.5))] }),
      L(circ(8, 8, 7), { clip: rr(8.5, 0, 8, 7.5), cut: [C(circ(8, 8, 3.5))] })
    ]
  },
  'chart-column-stacked': {
    label: '堆叠柱状图',
    key: 'square',
    layers: [
      // chart-bar's three bars, each cut by a straight seam 1 wide: a blue lower part and a
      // light upper part, both clipped from the bar so they keep its corners.
      ...[[2, 7.5, 10.5], [2 + 13 / 3, 2, 8], [2 + 26 / 3, 5, 9.5]].flatMap(([x, y, s]) => [
        L(rr(x, y, 10 / 3, 14 - y, 1), { clip: rr(x - 1, s, 6, 6) }),
        L(rr(x, y, 10 / 3, 14 - y, 1), { ...Bt, clip: rr(x - 1, 0, 6, s - 1) })
      ])
    ]
  },
  'chart-gantt': {
    label: '甘特图',
    key: 'landscape',
    layers: [
      // A light board with three blue task bars, staggered to the right, a gap of 1 apart and
      // 2.25 in from the board's edges. One layer per bar.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(pill(3.25, 4.25, 5, 11 / 6)),
      L(pill(6, 4.25 + 17 / 6, 5, 11 / 6)),
      L(pill(9, 4.25 + 34 / 6, 3.75, 11 / 6))
    ]
  },
  'chart-candlestick': {
    label: 'K 线图',
    key: 'square',
    layers: [
      // Three candles on chart-bar's columns: a body and a wick through it, one element each;
      // the middle one is blue. One layer per candle.
      L(pill(2 + 5 / 3 - D / 2, 4, D, 8) + rr(2, 6, 10 / 3, 4.5, 1), Bt),
      L(pill(8 - D / 2, 2, D, 9) + rr(2 + 13 / 3, 4, 10 / 3, 4.5, 1)),
      L(pill(2 + 26 / 3 + 5 / 3 - D / 2, 4.5, D, 9.5) + rr(2 + 26 / 3, 6.5, 10 / 3, 4.5, 1), Bt)
    ]
  },
  presentation: {
    label: '演示',
    key: 'square',
    layers: [
      // A light board with a small blue bar chart, and one gap below it a blue leg on the
      // board's centre line. One layer per bar.
      L(rr(2, 2, 12, 8.5, M), Bt),
      L(pill(5.125, 5.5, D, 3)),
      L(pill(7.375, 4, D, 4.5)),
      L(pill(9.625, 5, D, 3.5)),
      L(rr(7, 11.5, 2, 2.5, [0, 0, 1, 1]))
    ]
  },
  'alarm-clock': {
    label: '闹钟',
    key: 'square',
    layers: [
      // clock's face, a little smaller, with two blue bells behind its upper corners; the face
      // cuts a gap of W round itself. The hands are kept 2 clear of the rim.
      L(circ(3.75, 3.75, 1.75) + circ(12.25, 3.75, 1.75)),
      L(circ(8, 8.75, 5.25), { ...Bt, gap: W }),
      L('M8 6.25V8.75', { sw: K }),
      L('M8 8.75H10', { sw: K })
    ]
  },
  password: {
    label: '密码',
    key: 'wide',
    layers: [
      // text-cursor's field with three masked characters (blue dots a gap of 1 apart) and the
      // cursor after them, 2 clear of the field's edges. One layer per dot.
      L(rr(1, 2.5, 14, 11, R), Bt),
      L(circ(4.125, 8, 0.875)),
      L(circ(6.875, 8, 0.875)),
      L(circ(9.625, 8, 0.875)),
      L('M12.25 5.25V10.75', { sw: K })
    ]
  },
  'lock-keyhole': {
    label: '锁孔',
    key: 'portrait',
    layers: [
      // lock with a keyhole (a round hole and a slot below it, one shape) in place of the slot.
      L('M4.75 7V5a3.25 3.25 0 0 1 6.5 0V7', { sw: K }),
      L(rr(2, 6.5, 12, 8.5, M), { ...Bt, gap: W }),
      L(circ(8, 10, 1.5) + rr(7.25, 10, 1.5, 3, [0, 0, 0.75, 0.75]))
    ]
  },
  pause: {
    label: '暂停',
    key: 'circle',
    layers: [
      // play's disc with two blue bars 2 wide and 1.5 apart, centred. One layer per bar.
      L(circ(8, 8, 7), Bt),
      L(rr(5.25, 5, 2, 6, 1)),
      L(rr(8.75, 5, 2, 6, 1))
    ]
  },
  stop: {
    label: '停止',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      L(rr(5.25, 5.25, 5.5, 5.5, r))
    ]
  },
  'skip-forward': {
    label: '下一首',
    key: 'circle',
    layers: [
      // play's triangle, smaller (same proportions), and a blue bar one gap past its tip; the
      // two together are centred on the disc.
      L(circ(8, 8, 7), Bt),
      L(polygon([[4.5, 5], [9.18, 8], [4.5, 11]], 1)),
      L(rr(10, 5, 1.5, 6, 0.75))
    ]
  },
  'skip-back': {
    label: '上一首',
    key: 'circle',
    layers: [
      // skip-forward mirrored.
      L(circ(8, 8, 7), Bt),
      L(polygon([[11.5, 5], [11.5, 11], [6.82, 8]], 1)),
      L(rr(4.5, 5, 1.5, 6, 0.75))
    ]
  },
  'audio-lines': {
    label: '音频波形',
    key: 'live',
    layers: [
      // Five bars 2 thick and a gap of 1 apart, centred on one line and tallest in the middle,
      // which is blue. One layer per bar, so the motion can make them bounce in turn.
      L('M2 7V9', { sw: 2, ...Bt }),
      L('M5 4.5V11.5', { sw: 2, ...Bt }),
      L('M8 2V14', { sw: 2 }),
      L('M11 4.5V11.5', { sw: 2, ...Bt }),
      L('M14 7V9', { sw: 2, ...Bt })
    ]
  },
  'picture-in-picture': {
    label: '画中画',
    key: 'landscape',
    layers: [
      // A light window with a small blue window in its lower right corner, 2.25 from both
      // nearby edges.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(rr(8.25, 8.5, 4.5, 3.25, 1))
    ]
  },
  subtitles: {
    label: '字幕',
    key: 'landscape',
    layers: [
      // A light screen with two rows of caption text near its bottom, each row two blue lines a
      // gap of 1 apart, 2.25 in from the sides and the bottom. One layer per row.
      L(rr(1, 2, 14, 12, R3), Bt),
      L(pill(3.25, 8, 3, D) + pill(7.25, 8, 5.5, D)),
      L(pill(3.25, 10.5, 5.5, D) + pill(9.75, 10.5, 3, D))
    ]
  },
  save: {
    label: '保存',
    key: 'square',
    layers: [
      // A diskette: a light case with a blue shutter hanging from its top edge and a blue label
      // standing on its bottom edge, both clipped to the case so they follow its outline there.
      L(rr(2, 2, 12, 12, M), Bt),
      L(rr(5, 2, 5, 3.5, [0, 0, 1, 1]), { clip: rr(2, 2, 12, 12, M) }),
      L(rr(4, 8.5, 8, 5.5, [r, r, 0, 0]), { clip: rr(2, 2, 12, 12, M) })
    ]
  },
  'battery-medium': {
    label: '电量中',
    key: 'wide',
    layers: [
      // battery-full with two cells.
      L(rr(1, 2.5, 12.5, 11, R) + rr(13.5, 6, 1.5, 4, [0, 0.75, 0.75, 0]), Bt),
      L(pill(3.75, 5, D, 6)),
      L(pill(6.25, 5, D, 6))
    ]
  },
  'battery-low': {
    label: '电量低',
    key: 'wide',
    layers: [
      // battery-full with one cell.
      L(rr(1, 2.5, 12.5, 11, R) + rr(13.5, 6, 1.5, 4, [0, 0.75, 0.75, 0]), Bt),
      L(pill(3.75, 5, D, 6))
    ]
  },
  mouse: {
    label: '鼠标',
    key: 'tall',
    layers: [
      // A light mouse (a capsule 10 wide) split between its two buttons by a straight seam 1
      // wide from the top, and a blue wheel one gap below the seam's end.
      L(pill(3, 1, 10, 14), { ...Bt, cut: [C(rr(7.5, -1, 1, 4.5))] }),
      L(pill(7.25, 4.5, 1.5, 3))
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
  'eye-off': badge(ICONS.eye, 'off', { label: '隐藏' }),
  'zoom-in': badge(ICONS.search, 'plus', { at: [6.75, 6.75], drop: [2], label: '放大' }),
  'zoom-out': badge(ICONS.search, 'minus', { at: [6.75, 6.75], drop: [2], label: '缩小' }),
  unlink: badge(ICONS.link, 'off', { label: '取消链接' })
});
