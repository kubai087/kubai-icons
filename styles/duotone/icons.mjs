// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Example icons in the two-tone solid style (双色面性). Each icon is { label, key, layers }:
//   label   the Chinese name
//   key     the key shape it fills (KEYLINES in kit.mjs): circle, square, landscape, wide,
//           portrait, tall, flat or live
//   layers  drawn in order; the light body first (tone b), then the blue accents and details
// Read the one closest to a new object before drawing it, and append new icons the same way.
import { R3, R, M, r, S, q, t, D, K, W, rr, pill, circ, body, polygon, rot, L, C, Bt } from './kit.mjs';

// A pen laid at 45° (the allowed slope for 编辑), nib at the bottom left. The nib's two edges run
// along the grid, so it fills the box corner exactly. from and to are distances along the pen
// from the line where the nib meets the barrel; w is its width.
const pen = (from, to, w = 3.5) => {
  const a = w * Math.SQRT1_2, u = (d) => d * Math.SQRT1_2;
  return [[2 + u(from), 14 - a - u(from)], [2 + u(to), 14 - a - u(to)], [2 + a + u(to), 14 - u(to)], [2 + a + u(from), 14 - u(from)]];
};

export const ICONS = {
  folder: {
    label: '文件夹',
    key: 'landscape',
    layers: [
      // One light folder; a short blue dash on the front marks it.
      L(body(1, 4, 14, 10, R, [{ x: 1, w: 6, h: 2, c: r }]), Bt),
      L(pill(10, 10.5, 2.5, D))
    ]
  },
  'file-text': {
    label: '文档',
    key: 'portrait',
    layers: [
      L(rr(2, 1, 12, 14, M), Bt),
      L(pill(5, 5.25, 6, D) + pill(5, 7.875, 6, D) + pill(5, 10.5, 3.5, D))
    ]
  },
  calendar: {
    label: '日历',
    key: 'square',
    layers: [
      L(rr(2, 3.5, 12, 10.5, R), Bt),
      L(pill(4.875, 2, D, 3) + pill(9.875, 2, D, 3), { gap: W }),
      L([5.25, 8, 10.75].map((x) => circ(x, 8.5, 0.5) + circ(x, 11.25, 0.5)).join(''))
    ]
  },
  camera: {
    label: '相机',
    key: 'square',
    layers: [
      L(body(2, 4, 12, 10, R, [{ x: 5, w: 6, h: 2, c: r }]), Bt),
      L(circ(8, 9, 2.75), { cut: [C(circ(8, 9, 1.5))] }),
      L(circ(11.75, 6.25, 0.6))
    ]
  },
  lock: {
    label: '锁',
    key: 'portrait',
    layers: [
      // The body sits in front of the shackle and cuts a gap of W round itself.
      L('M4.75 7V5a3.25 3.25 0 0 1 6.5 0V7', { sw: K }),
      L(rr(2, 6.5, 12, 8.5, M), { ...Bt, gap: W }),
      L(pill(7.375, 9.5, D, 2.5))
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
      L(circ(5.25, 6.75, 1.5) + rr(3, 9.25, 4.5, 2.5, [2.25, 2.25, 0.75, 0.75])),
      L(pill(9.5, 6.25, 3.5, D) + pill(9.5, 9, 2.5, D))
    ]
  },
  building: {
    label: '建筑',
    key: 'square',
    layers: [
      // One tower: two columns of window bars and a door.
      L(rr(2, 2, 12, 12, R), Bt),
      L([4.5, 7, 9.5].map((y) => pill(4.5, y - 0.5, 2.25, D) + pill(9.25, y - 0.5, 2.25, D)).join('') + rr(7, 11, 2, 3, [1, 1, 0, 0]))
    ]
  },
  'book-open': {
    label: '书',
    key: 'landscape',
    layers: [
      L(rr(1, 2, 6.5, 12, [R3, 0, 0, R3]), Bt),
      L(rr(8.5, 2, 6.5, 12, [0, R3, R3, 0]), Bt),
      L(pill(3.25, 6, 2.5, D) + pill(3.25, 8.75, 2.5, D) + pill(10.25, 6, 2.5, D) + pill(10.25, 8.75, 2.5, D))
    ]
  },
  bell: {
    label: '铃铛',
    key: 'square',
    layers: [
      // Dome and brim are one light body; the knob and clapper are small blue accents.
      L('M3 10.5V8a5 5 0 0 1 10 0V10.5Z' + pill(2, 9.75, 12, 1.75), Bt),
      L(rr(7.25, 2, 1.5, 1.25, [0.75, 0.75, 0, 0]) + rr(6.75, 12.5, 2.5, 1.5, [0, 0, 1.25, 1.25]), { gap: W })
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
      L(rr(7.25, 6.5, 1.5, 2.5) + rr(7.25, 10, 1.5, 4))
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
      L(pill(4, 6, 8, D) + pill(4, 9, 5, D))
    ]
  },
  clock: {
    label: '时钟',
    key: 'circle',
    layers: [
      L(circ(8, 8, 7), Bt),
      L('M8 4.75V8H10.5', { sw: K })
    ]
  },
  image: {
    label: '图片',
    key: 'landscape',
    layers: [
      L(rr(1, 2, 14, 12, R3), Bt),
      L(circ(11.25, 5.5, 1.25) + 'M3 12A4.5 4.5 0 0 1 12 12Z')
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
      L(rr(1, 2, 14, 12, R3), Bt),
      L(pill(9.5, 6.25, 4.5, 3.5), { cut: [C(circ(11.25, 8, 0.75))] })
    ]
  },
  headphones: {
    label: '耳机',
    key: 'live',
    layers: [
      L('M1.625 10V8a6.375 6.375 0 0 1 12.75 0V10', { sw: 1.25, ...Bt }),
      L(rr(1, 9, 3.5, 6, r) + rr(11.5, 9, 3.5, 6, r), { gap: W })
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
      L(pill(3.75, 5, D, 6) + pill(6.25, 5, D, 6) + pill(8.75, 5, D, 6))
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
      L(rr(1, 2.5, 14, 11, R), Bt),
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
      L(rr(4.5, 9.5, 7, 4.5, [0, 0, r, r]), { gap: W }),
      L(circ(11.25, 8, 0.5))
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
      // A light box and a blue arrow rising out of it and turning right. The shaft stands on the
      // box's centre line (x 7); the arrow cuts a gap of W out of the box where it crosses it.
      L(rr(2, 5, 10, 9, M), Bt),
      L('M7 11V7.5A3.5 3.5 0 0 1 10.5 4H11.5', { sw: K, gap: W, part: 'arrow' }),
      L(polygon([[11, 0.5], [14.5, 4], [11, 7.5]], 1), { gap: W, part: 'arrow' })
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
      L(pill(6.75, 3, 2.5, D) + pill(6, 11.75, 4, D))
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
      // the frame.
      L(rr(6, 3.5, 8, 6, M), Bt),
      L('M2.75 2.75H4.25V11.25H13', { sw: K }),
      // The wheels sit symmetrically under the basket (centre x 10).
      L(circ(7.25, 12.75, 1.25) + circ(12.75, 12.75, 1.25))
    ]
  }
};
