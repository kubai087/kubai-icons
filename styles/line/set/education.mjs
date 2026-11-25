// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// education: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: book book-open book-marked graduation-cap award backpack whiteboard library
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// A point on an axis turned by deg about o (a leaning book).
const tilt = (o, deg) => { const a = (deg * Math.PI) / 180, c = Math.cos(a), s0 = Math.sin(a); return ([u, v]) => [o[0] + u * c - v * s0, o[1] + u * s0 + v * c]; };

// The closed book (book, book-marked): a cover with the page block rolled round its bottom-left
// corner. The corner and the roll share one centre (7, 19) at every weight.
const cover = (g) => shell(g.box(4, 2, 16, 20, [3.5, 2.5, 2.5, 3]), { n: 'cover', role: P });
// In the fill variant the roll would run along the inside of the cover's edge, so there the
// line goes straight across and cuts the page block off the cover (out through both sides).
const pages = (g, ctx) => {
  const { h } = g, r = 3 - h;
  if (ctx?.variant === 'fill') return line(g.seg(4 - h, 16 + h, 20 + h, 16 + h), { n: 'pages', role: D, on: 'cover' });
  return line(`M${n(20 - h)} ${n(16 + h)}H7A${n(r)} ${n(r)} 0 0 0 ${n(4 + h)} 19`, { n: 'pages', role: D, on: 'cover' });
};

// The open book: two pages meeting at the spine, which dips 3 at the top and the bottom. Its
// bottom is narrow (only the spine reaches down), so it stands 1 low to sit in the middle (nudge).
const openBook = (g) => {
  const { h } = g, xl = 2 + h, xr = 22 - h, yt = 5 + h, dip = 21 - h, pb = dip - 3, c = 2.5 - h;
  const right = `A3 3 0 0 1 15 ${n(yt)}H${n(xr - c)}A${n(c)} ${n(c)} 0 0 1 ${n(xr)} ${n(yt + c)}V${n(pb - c)}A${n(c)} ${n(c)} 0 0 1 ${n(xr - c)} ${n(pb)}H15A3 3 0 0 0 12 ${n(dip)}`;
  const left = `A3 3 0 0 0 9 ${n(pb)}H${n(xl + c)}A${n(c)} ${n(c)} 0 0 1 ${n(xl)} ${n(pb - c)}V${n(yt + c)}A${n(c)} ${n(c)} 0 0 1 ${n(xl + c)} ${n(yt)}H9A3 3 0 0 1 12 ${n(yt + 3)}Z`;
  return { book: `M12 ${n(yt + 3)}` + right + left, page: `M12 ${n(yt + 3)}` + right, spine: g.seg(12, yt + 3, 12, dip) };
};

export default {
  book: {
    label: '书本', key: 'portrait',
    plan: '主体：封面；细节：底部书页（一条线从右边进来，绕过左下角的圆角）',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g, ctx) { return [cover(g), pages(g, ctx)]; },
    fx: { t: 'bounce', on: 'all', o: [12, 22], amp: 1 },
    swap: 'book-open'
  },
  'book-open': {
    nudge: [0, 1],
    label: '打开的书', key: 'landscape',
    ends: 'in',
    plan: '主体：左右两页（一个闭合形，书脊处上下各凹 3）；细节：书脊线',
    weights: { [P]: 0.82, [D]: 0.18 },
    // in solid-tint a turning leaf is filled like the pages it lies on
    tint: ['book', 'leaf1', 'leaf2'],
    draw(g, ctx) {
      const b = openBook(g);
      // Two leaves lie on the right page, hidden at rest; turning, each hides what is behind it:
      // in lines just the area it covers, in the fill a clear band round it as well, so the solid
      // page stands apart from the solid book.
      const hide = ctx?.variant === 'fill' ? { occ: true } : { cutD: b.page + 'Z' };
      const leaf = (k) => shell(b.page + 'Z', { n: `leaf${k}`, role: D, ghost: true, ...hide });
      return [
        shell(b.book, { n: 'book', role: P }),
        line(b.spine, { n: 'spine', role: D, on: 'book' }),
        leaf(1), leaf(2)
      ];
    },
    // 翻页：书页绕书脊翻到左边，宽度随角度收窄再展开，线宽不变（GUIDE.md §5）
    fx: { t: 'leaf', on: ['leaf1', 'leaf2'], o: [12, 12], ms: 560, stagger: 220 },
    swap: 'book'
  },
  'book-marked': {
    label: '书签书本', key: 'portrait',
    plan: '主体：封面；辅助：书签带（从上沿垂下，末端 V 形缺口）；细节：底部书页',
    weights: { [P]: 0.58, [S]: 0.24, [D]: 0.18 },
    draw(g, ctx) {
      const { h } = g, t = 2 + h;
      if (ctx?.variant !== 'fill') return [cover(g), pages(g), line(`M10 ${n(t)}V11L12 9L14 11V${n(t)}`, { n: 'ribbon', role: S, on: 'cover' })];
      // Fill variant: the ribbon is cut out whole, its outline as drawn (round tails, the notch
      // a little rounded), from above the top edge. Cut as a line, the ink left between its two
      // sides would be thinner than a stroke at heavy weights.
      const yt = 11 + h * (1 + Math.SQRT2), ribbon = g.polygon([[10 - h, 0], [14 + h, 0], [14 + h, yt], [12, 9 + h * Math.SQRT2], [10 - h, yt]], [0, 0, h, 0.5, h]);
      return [cover(g), pages(g, ctx), solid(ribbon, { n: 'ribbon', role: S, on: 'cover' })];
    },
    // the ribbon draws back up and grows down again, like the bookmark
    fx: { t: 'keys', on: ['ribbon'], o: [12, 2], sy: [0.5], ms: 200 }
  },
  'graduation-cap': {
    label: '学士帽', key: 'landscape',
    plan: '主体：帽顶（扁的菱形）；辅助：帽身（菱形下方的碗形）和流苏（从右角垂下）。流苏在右，整体左移 0.4',
    weights: { [P]: 0.58, [S]: 0.42 },
    draw(g) {
      const { h } = g, xl = 1.6 + h, xr = 21.6 - h, my = 9, top = 4.8, bot = 14;
      const edge = (x) => my + ((x < 11.6 ? x - xl : xr - x) * (bot - my)) / (11.6 - xl);
      return [
        line(cup(7, edge(7), 16, 19, 3.5 - h), { n: 'band', role: S }),
        shell(g.polygon([[11.6, top], [xr, my], [11.6, bot], [xl, my]], [1.2, 0.5, 1.2, 0.5]), { n: 'board', role: P }),
        line(g.seg(21, my, 21, 15), { n: 'tassel', role: S })
      ];
    },
    light: ['tassel'],
    // thrown up at graduation: the cap flies up and turns, the tassel swings after it
    fx: [{ t: 'keys', on: ['band', 'board', 'tassel'], o: [12, 12], y: [-1.6, 0.3], r: [-7, 3] }, { t: 'wiggle', on: ['tassel'], o: [21, 9], deg: 14, delay: 120 }],
    area: (g) => [{ n: 'band', d: g.rr(7, 11, 9, 19 - 11, [0, 0, 3.5 - g.h, 3.5 - g.h]) }]
  },
  award: {
    label: '奖章', key: 'portrait', fit: 'y',
    plan: '主体：奖牌（圆环）；辅助：下方两条绶带（末端相连成 W，中间的尖离奖牌 1.5）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const { h } = g, cx = 12, cy = 9.5, R = 7.5, r = R - h, at = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
      return [
        line(g.pl([at(124), [7, 22 - h], [12, 19.5], [17, 22 - h], at(56)]), { n: 'ribbon', role: S }),
        shell(g.ring(cx, cy, R), { n: 'medal', role: P })
      ];
    },
    // 获奖: the medal swings on its ribbon and settles
    fx: { t: 'keys', on: 'all', o: [12, 9.5], s: [1.08], r: [-9, 6] }
  },
  backpack: {
    anchor: 'base',
    label: '书包', key: 'portrait',
    plan: '主体：包身；辅助：提手（上方圆角的小环）；细节：包身上部的横带和前袋（立在包底的拱形）',
    weights: { [P]: 0.6, [S]: 0.12, [D]: 0.28 },
    draw(g, ctx) {
      const { h, s } = g, top = 6, yb = 22 - h, ht = 2 + h;
      // fill variant: the pocket stands on the bottom and cuts out through it (ends); at heavy
      // weights the strap rises to keep a stroke of ink above the pocket
      const sy = ctx?.variant === 'fill' ? Math.min(12, 16 - 2 * s) : 12;
      return [
        line(`M9 ${n(top + h)}V${n(ht + 2)}A2 2 0 0 1 11 ${n(ht)}H13A2 2 0 0 1 15 ${n(ht + 2)}V${n(top + h)}`, { n: 'handle', role: S }),
        shell(g.box(4, top, 16, 22 - top, [5, 5, 3.5, 3.5]), { n: 'bag', role: P }),
        line(g.seg(9, sy, 15, sy), { n: 'strap', role: D, on: 'bag' }),
        line(`M9 ${n(yb)}V18A2 2 0 0 1 11 16H13A2 2 0 0 1 15 18V${n(yb)}`, { n: 'pocket', role: D, on: 'bag', ends: 'out' })
      ];
    },
    fx: { t: 'wiggle', on: 'all', o: [12, 2], deg: 7, hz: 2.4 }
  },
  whiteboard: {
    label: '白板', key: 'square',
    plan: '主体：板面；辅助：两条支脚（短线，只占一成多）；细节：板上两行字（同文档的字线：离边 2、行距 4，末行短）',
    weights: { [P]: 0.67, [S]: 0.12, [D]: 0.21 },
    draw(g, ctx) {
      const { s, h } = g, a = 3 + s + 2 + h, b = 21 - s - 2 - h, by = 17 - h;
      // fill variant: at heavy weights the two lines move apart, a stroke of ink between them
      const e = ctx?.variant === 'fill' ? Math.max(0, s - 2) : 0, y1 = 8 - e, y2 = 12 + e;
      return [
        line(g.seg(9, by, 6.5, 20) + g.seg(15, by, 17.5, 20), { n: 'legs', role: S }),
        shell(g.box(3, 3, 18, 14, 3.5), { n: 'board', role: P }),
        line(g.seg(a, y1, b, y1), { n: 'l1', role: D, on: 'board' }),
        line(g.seg(a, y2, a + (b - a) * 0.55, y2), { n: 'l2', role: D, on: 'board' })
      ];
    },
    fx: { t: 'draw', on: ['l1', 'l2'] }
  },
  library: {
    anchor: 'base',
    label: '书架', key: 'square',
    plan: '主体：两本立着的书（共用一条边，一高一矮）；辅助：斜靠在右边的第三本书（压在矮书的上角前面）',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      const { h } = g, W = 6, H = 15, Pt = tilt([15.1, 21], -9.5), c = 2 - h;
      return [
        shell(g.box(3, 3, 6, 18, 2), { n: 'b1', role: P, part: 'up' }),
        shell(g.box(7, 7, 6, 14, 2), { n: 'b2', role: P, part: 'up' }),
        shell(g.polygon([[h, -h], [W - h, -h], [W - h, -H + h], [h, -H + h]].map(Pt), c), { n: 'b3', role: S, occ: true })
      ];
    },
    // the leaning book tips upright and falls back against the others
    fx: { t: 'keys', on: ['b3'], o: [15.1, 21], r: [7, -1.5], ms: 360 }
  }
};
