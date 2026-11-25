// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// files: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: file folder-open folders files archive clipboard clipboard-check file-image file-audio file-video file-code file-spreadsheet file-archive file-chart notebook newspaper sticky-note cloud-upload certificate scroll
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// The page every file-* icon starts from: the outline of file-text (icons.mjs), 4..20 x 2..22.
const page = (g) => shell(g.box(4, 2, 16, 20, 4), { n: 'page', role: P });
// A folder with its tab, as folder in icons.mjs, in the box x0..x1, y0..y1 (outer edges). max
// caps the outer radius of the top-left, top-right and bottom-right corners (backCorner).
function folderShape(g, x0, y0, x1, y1, max = Infinity) {
  const { h } = g, t = y0 + h, b = y0 + 3 + h, w = x1 - x0, k = w / 20, cap = (r) => Math.min(r, max - h);
  return g.polygon([[x0 + h, t], [x0 + 7.2 * k, t], [x0 + 9.4 * k, b], [x1 - h, b], [x1 - h, y1 - h], [x0 + h, y1 - h]],
    [cap(2 - h * 0.5), 1.4, 0.9, cap(3.25 - h), cap(3.5 - h), 3.5 - h]);
}

// Circle-circle meeting point above the centres (the notch between two puffs of a cloud).
function meet([x1, y1, r1], [x2, y2, r2]) {
  const dx = x2 - x1, dy = y2 - y1, Dd = Math.hypot(dx, dy), a = (r1 * r1 - r2 * r2 + Dd * Dd) / (2 * Dd), hh = Math.sqrt(Math.max(r1 * r1 - a * a, 0));
  const mx = x1 + (a * dx) / Dd, my = y1 + (a * dy) / Dd;
  const p1 = [mx + (hh * dy) / Dd, my - (hh * dx) / Dd], p2 = [mx - (hh * dy) / Dd, my + (hh * dx) / Dd];
  return p1[1] < p2[1] ? p1 : p2;
}
// A cloud open at the bottom (centre line): from angle a0 on the first puff, clockwise over the
// top, to angle a1 on the last one.
function cloudTop(g, circles, a0, a1) {
  const C = circles.map(([x, y, R]) => [x, y, R - g.h]);
  const at = ([cx, cy, r], a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const p = (q) => `${n(q[0])} ${n(q[1])}`;
  const arc = ([cx, cy, r], from, to) => {
    const a = (q) => Math.atan2(q[1] - cy, q[0] - cx), turn = (((a(to) - a(from)) * 180) / Math.PI + 360) % 360;
    return `A${n(r)} ${n(r)} 0 ${turn > 180 ? 1 : 0} 1 ${p(to)}`;
  };
  const stops = [at(C[0], a0), ...C.slice(0, -1).map((c, i) => meet(c, C[i + 1])), at(C[C.length - 1], a1)];
  return `M${p(stops[0])}` + C.map((c, i) => arc(c, stops[i], stops[i + 1])).join('');
}

// In the fill variant of a stack (files, folders), the back shape shows only as a strip beside
// the front one's clear band. Where a round corner of the back runs into the band, the strip
// would end in a thin point; with the corner's radius at 0.7 of the strip (the smoothed corner
// runs past its radius) it ends round and meets the band square. off: how far the front is set
// from the back.
const backCorner = (g, off, c = 3.25) => Math.min(c, 0.7 * (off - g.g));
export default {
  file: {
    label: '文档', key: 'portrait',
    plan: '主体：纸页（与文本文档同一个外框），一个闭合形',
    weights: { [P]: 1 },
    draw(g) { return [page(g)]; },
    // 文档: the sheet is picked up and laid back down
    fx: { t: 'bounce', on: 'all', o: [12, 22], amp: 0.9 }
  },
  'folder-open': {
    label: '打开的文件夹', key: 'landscape',
    ends: 'in',
    light: [], // one object (GUIDE.md §4.2): the front flap is part of the folder
    plan: '主体：文件夹外形（后片带标签，前片向右伸出）；辅助：前片的上沿和左侧斜边。前片斜放是打开的样子，左下与后片相接',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const { h } = g, t = 4 + h, b = 7 + h, fy = 11 + h, xb = 20 - h, yb = 20 - h, sl = 1.5, xl = 2 + h + (4 - h) + sl;
      return [
        shell(g.polygon([[2 + h, t], [9.2, t], [11.4, b], [xb, b], [xb, fy], [22 - h, fy], [22 - h - sl, yb], [2 + h, yb]],
          [2 - h * 0.5, 1.4, 0.9, 2.5 - h * 0.5, 0, 0.8, 2.25 - h * 0.5, 4 - h]), { n: 'folder', role: P }),
        line(`M${n(xb)} ${n(fy)}H${n(xl)}L${n(xl - sl)} ${n(yb)}`, { n: 'front', role: S, on: 'folder' })
      ];
    },
    fx: { t: 'bounce', on: 'all', o: [12, 20] },
    swap: 'folder'
  },
  folders: {
    label: '多个文件夹', key: 'landscape',
    plan: '主体：前面的文件夹；辅助：后面的文件夹（被挡住，只露出标签和右侧）。与复制同一种叠放',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g, ctx) {
      return [
        // fill: the back's corners beside the front's clear band are tighter (backCorner)
        shell(folderShape(g, 6, 4, 22, 16, ctx?.variant === 'fill' ? backCorner(g, 4) : Infinity), { n: 'back', role: S }),
        shell(folderShape(g, 2, 8, 18, 20), { n: 'front', role: P, occ: true })
      ];
    },
    fx: [{ t: 'keys', on: ['front'], x: [-0.9], y: [0.9] }, { t: 'keys', on: ['back'], x: [0.9], y: [-0.9] }]
  },
  files: {
    label: '多个文件', key: 'portrait',
    plan: '主体：前面一页；辅助：后面一页（被挡住）；细节：前页两行字。与复制同一种叠放',
    weights: { [P]: 0.56, [S]: 0.3, [D]: 0.14 },
    draw(g, ctx) {
      const { s, h } = g, a = 7 + s + 1.5 + h, b = 20 - s - 1.5 - h, fill = ctx?.variant === 'fill';
      // fill: the back page's two corners that run into the front's clear band are tighter
      // (backCorner), and the lines keep one stroke of page between them
      const k = fill ? backCorner(g, 4) : 3.25, dy = fill ? Math.max(4, 2 * s) : 4, y1 = 14 - dy / 2;
      return [
        shell(g.box(4, 2, 12, 16, [3.25, k, 3.25, k]), { n: 'back', role: S }),
        shell(g.box(8, 6, 12, 16, 3.25), { n: 'front', role: P, occ: true }),
        line(g.seg(a + 1, y1, b, y1), { n: 'l1', role: D, on: 'front' }),
        line(g.seg(a + 1, y1 + dy, a + 1 + (b - a - 1) * 0.6, y1 + dy), { n: 'l2', role: D, on: 'front' })
      ];
    },
    fx: [{ t: 'keys', on: ['front', 'l1', 'l2'], x: [0.9], y: [0.9] }, { t: 'keys', on: ['back'], x: [-0.9], y: [-0.9] }]
  },
  archive: {
    label: '归档', key: 'square',
    plan: '主体：箱身（开口的 U 形，接在箱盖下沿）；辅助：箱盖（比箱身宽）；细节：把手槽。箱盖是闭合的长条，粗字重下内部还要留得住，墨量接近一半；把手槽只是一短线',
    weights: { [P]: 0.44, [S]: 0.49, [D]: 0.07 },
    draw(g, ctx) {
      const { h } = g, lidH = 6 + (g.s - 2) * 1.2, by = 3 + lidH;
      // fill: the box starts 2 lower, so the slot drops to keep one stroke of box above it
      const sy = ctx?.variant === 'fill' ? Math.max(by + 4, by + 2 + 1.5 * g.s) : by + 4;
      return [
        line(cup(4 + h, by - h, 20 - h, 21 - h, 3.5 - h), { n: 'box', role: P, only: 'outline' }),
        shell(g.box(4, by + 2, 16, 21 - by - 2, [1, 1, 3.5, 3.5]), { n: 'box', role: P, only: 'fill' }),
        line(g.seg(10, sy, 14, sy), { n: 'slot', role: D, on: 'box' }),
        shell(g.box(3, 3, 18, lidH, 2.25), { n: 'lid', role: S })
      ];
    },
    // 归档: the lid lifts and comes back down on the box
    fx: { t: 'keys', on: ['lid'], y: [-1.6, 0.3], ms: 300 }
  },
  clipboard: {
    label: '剪贴板列表', key: 'portrait',
    plan: '主体：夹板；辅助：顶部的夹子（夹板上沿在夹子两侧断开）；细节：两行字（末行短）',
    weights: { [P]: 0.62, [S]: 0.2, [D]: 0.18 },
    draw(g, ctx) {
      // fill: the lines keep one stroke of board below the clip's clear band and between them
      const fill = ctx?.variant === 'fill', y1 = fill ? Math.max(12, clipBottom(g) + g.g + 1.5 * g.s) : 12, dy = fill ? Math.max(4, 2 * g.s) : 4;
      return [...board(g, ctx), ...['l1', 'l2'].map((nm, i) => line(g.seg(9, y1 + dy * i, i ? 12.3 : 15, y1 + dy * i), { n: nm, role: D, on: 'board' }))];
    },
    fx: { t: 'draw', on: ['l1', 'l2'] }
  },
  'clipboard-check': {
    label: '剪贴板', key: 'portrait',
    plan: '主体：夹板；辅助：顶部的夹子；细节：对勾（在夹子下方的空间居中）',
    weights: { [P]: 0.64, [S]: 0.2, [D]: 0.16 },
    draw(g, ctx) {
      // fill: the check keeps one stroke of board below the clip's clear band
      const k = 0.94 - 0.3 * (g.s - 2), cy = ctx?.variant === 'fill' ? Math.max(14.5, clipBottom(g) + g.g + 1.5 * g.s + 2.4 * k) : 14.5;
      const Pt = ([x, y]) => [12 + (x - 12) * k, cy + (y - 14.5) * k];
      return [...board(g, ctx), line(g.pl([[8.4, 14.6], [10.9, 17.1], [15.6, 12.1]].map(Pt)), { n: 'check', role: D, on: 'board' })];
    },
    fx: { t: 'draw', on: ['check'] }
  },
  'file-image': {
    label: '图片文件', key: 'portrait',
    ends: 'in',
    plan: '主体：纸页；细节：山（一段圆弧，从底边接到右边）和太阳（实心点），与图片的画法相同',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) {
      const k = 1.05 - (g.s - 2) * 0.3;
      return [
        page(g),
        line(hill(g, { cx: 20, cy: 26.07, r: 12.11, bottom: 22, right: 20 }), { n: 'hill', role: D, on: 'page' }),
        solid(g.dot(9.6, 9, k), { n: 'sun', role: D, on: 'page' })
      ];
    },
    fx: { t: 'keys', on: ['sun'], y: [3, 3, 0], a: [0, 0, 1] }
  },
  'file-audio': {
    label: '音频文件', key: 'portrait',
    plan: '主体：纸页；细节：八分音符（符头实心，太小画不出圆环；符干和符尾一条线）',
    weights: { [P]: 0.76, [D]: 0.24 },
    draw(g, ctx) {
      const r = 1 + 0.5 * g.s, cx = 10, cy = 16, x = cx + r - g.h;
      // fill: a flatter flag, so the page left in the corner under it is not a sliver
      const fy = ctx?.variant === 'fill' ? 8.5 : 9.5;
      return [
        page(g),
        solid(g.circ(cx, cy, r), { n: 'head', role: D, on: 'page', part: 'note' }),
        line(g.pl([[x, cy], [x, 7.5], [15, fy]]), { n: 'stem', role: D, on: 'page', part: 'note' })
      ];
    },
    // 播放: the note bobs to the beat
    fx: { t: 'keys', on: ['head', 'stem'], y: [-1.2, 0, -0.8], r: [-6, 0, -4], o: [10, 16] }
  },
  'file-video': {
    label: '视频文件', key: 'portrait',
    plan: '主体：纸页；细节：播放三角（按重心居中在字线的位置）',
    weights: { [P]: 0.77, [D]: 0.23 },
    draw(g) {
      return [page(g), shell(g.polygon([[10, 8], [16, 12], [10, 16]], [1.2, 1.2, 1.2]), { n: 'tri', role: D, on: 'page' })];
    },
    fx: { t: 'keys', on: ['tri'], x: [1], ms: 420 }
  },
  'file-code': {
    label: '代码文件', key: 'portrait',
    plan: '主体：纸页；细节：一对尖括号（离纸边 1.5，中间留 1.5，所以比通常的尖括号陡）',
    weights: { [P]: 0.78, [D]: 0.22 },
    draw(g, ctx) {
      const { s, h } = g, m = s <= 2 ? 1.5 : 1.25, x0 = 4 + s + m + h, d = (20 - s - m - h - x0 - s - m) / 2, v = 3;
      // fill: the two brackets move apart to keep one stroke of page between their ends
      const xl = ctx?.variant === 'fill' ? Math.min(x0, 12 - d - s) : x0, xr = 24 - xl;
      return [
        page(g),
        line(g.pl([[xl + d, 12 - v], [xl, 12], [xl + d, 12 + v]]), { n: 'lt', role: D, on: 'page' }),
        line(g.pl([[xr - d, 12 - v], [xr, 12], [xr - d, 12 + v]]), { n: 'gt', role: D, on: 'page' })
      ];
    },
    fx: [{ t: 'keys', on: ['lt'], x: [-0.8, 0.2] }, { t: 'keys', on: ['gt'], x: [0.8, -0.2] }]
  },
  'file-spreadsheet': {
    label: '表格文件', key: 'portrait',
    plan: '主体：纸页；细节：表格线（两条横线和一条竖线，接到纸边，分出表头和单元格）。表格线贯穿纸面，比字线长，占四成多；面性里表格线切开纸面，分成表头和四个单元格',
    weights: { [P]: 0.56, [D]: 0.44 },
    draw(g, ctx) {
      const e = ctx?.variant === 'fill' ? -g.h : g.h;
      return [
        page(g),
        line(g.seg(4 + e, 10, 20 - e, 10) + g.seg(4 + e, 15, 20 - e, 15), { n: 'rows', role: D, on: 'page' }),
        line(g.seg(12, 10, 12, 22 - e), { n: 'col', role: D, on: 'page' })
      ];
    },
    fx: { t: 'draw', on: ['rows', 'col'] }
  },
  'file-archive': {
    label: '压缩文件', key: 'portrait',
    plan: '主体：纸页；细节：拉链（从上边下来、左右交错的四个齿）和拉头。齿和拉头只有 2 到 4 宽，画成线框会闭合，用实心',
    weights: { [P]: 0.78, [D]: 0.22 },
    draw(g, ctx) {
      // the first tooth starts in the top edge, so the zip hangs from it
      const t = 2 + g.s, teeth = [0, 1, 2, 3].map((i) => (i ? g.area(i % 2 ? 10 : 12, t + 2 * i, 2, 2, 0.3) : g.area(12, 2 + g.h, 2, t + 2 - 2 - g.h, 0.3))).join('');
      if (ctx?.variant === 'fill') {
        // fill: the zip is one hole that runs out through the top edge (it opens the page there);
        // each tooth reaches o past the middle with square corners where it meets the next, so
        // no ink is pinched between two teeth, and the pull keeps one stroke of page below them
        const o = 0.35, r = 0.3, zip = [0, 1, 2, 3].map((i) => {
          const y = i ? t + 2 * i : 1, hh = i ? 2 : t + 1, last = i === 3;
          return i % 2 ? g.area(10, y, 2 + o, hh, [r, 0, last ? r : 0, r]) : g.area(12 - o, y, 2 + o, hh, [0, r, r, 0]);
        }).join('') + [1, 2, 3].map((i) => g.area(12 - o, t + 2 * i - 0.2, 2 * o, 0.4)).join(''); // seal the seams
        const py = Math.max(14, t + 8 + g.s);
        return [page(g), solid(zip, { n: 'teeth', role: D, on: 'page' }), solid(g.area(10, py, 4, 4, 1.1), { n: 'pull', role: D, on: 'page' })];
      }
      return [
        page(g),
        solid(teeth, { n: 'teeth', role: D, on: 'page' }),
        solid(g.area(10, 14, 4, 4, 1.1), { n: 'pull', role: D, on: 'page' })
      ];
    },
    // 解压: the pull slides down the zip and back
    fx: { t: 'keys', on: ['pull'], y: [1.2, 0], ms: 320 }
  },
  'file-chart': {
    allow: { sliver: '折线的内角是锐角，只在 1.75 时略超阈值，不是碎块' },
    label: '报表文件', key: 'portrait',
    plan: '主体：纸页；细节：一条上升的折线（柱子放不下：三根柱的间距只有 1）。折线是一笔，比三行字轻，占两成',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g) {
      // the line keeps 1.5 from the page edge: it draws in toward the middle as the stroke grows
      const k = 1 - 0.3 * Math.max(g.s - 2, 0), Pt = ([x, y]) => [12 + (x - 12) * k, 12.5 + (y - 12.5) * k];
      return [page(g), line(g.pl([[8.5, 16], [11, 12.5], [13.25, 14.5], [15.5, 9]].map(Pt)), { n: 'trend', role: D, on: 'page' })];
    },
    fx: { t: 'draw', on: ['trend'] }
  },
  notebook: {
    label: '笔记本', key: 'portrait',
    plan: '主体：封面；辅助：左侧三个装订环（横穿封面左边，只露出一小段）；细节：封面上两行字',
    weights: { [P]: 0.72, [S]: 0.15, [D]: 0.13 },
    draw(g, ctx) {
      // fill: the two lines keep one stroke of cover between them
      const y2 = 8 + (ctx?.variant === 'fill' ? Math.max(4, 2 * g.s) : 4);
      return [
        shell(g.box(6, 2, 14, 20, 3.5), { n: 'cover', role: P }),
        line([7, 12, 17].map((y) => g.span(4, y, 8, y)).join(''), { n: 'rings', role: S }),
        line(g.seg(11, 8, 15, 8), { n: 'l1', role: D, on: 'cover' }),
        line(g.seg(11, y2, 13.2, y2), { n: 'l2', role: D, on: 'cover' })
      ];
    },
    fx: { t: 'draw', on: ['l1', 'l2'] }
  },
  newspaper: {
    label: '报纸', key: 'landscape',
    plan: '主体：报纸（右边一大版，左边折过来的一窄条，一个闭合形）；辅助：大版的左边（向下弯进底边，表示折页）；细节：两行字',
    weights: { [P]: 0.66, [S]: 0.14, [D]: 0.2 },
    light: ['t1', 't2'], // the fold is part of the paper
    draw(g, ctx) {
      const { h, s } = g, x = 6 + h, yb = 20 - h, fill = ctx?.variant === 'fill', b = 22 - s - 2 - h;
      // fill: the fold is a straight cut that starts a stroke below the step (the flap stays
      // joined there) and runs out through the bottom edge; its curl would run along the bottom
      // edge and leave a hairline. The lines keep one stroke of paper from the fold and between
      // them.
      const fold = fill ? g.seg(x, 9 - h + Math.SQRT2 * s, x, 20 + s) : `M${n(x)} 9V${n(yb - 2)}A2 2 0 0 1 ${n(x - 2)} ${n(yb)}`;
      const a = 6 + s + (fill ? Math.max(2, s) : 2) + h, dy = fill ? Math.max(4, 2 * s) : 4, y1 = 12 - dy / 2;
      return [
        shell(g.polygon([[x, 4 + h], [22 - h, 4 + h], [22 - h, yb], [2 + h, yb], [2 + h, 9], [x, 9]], [3.5 - h, 3.5 - h, 3.5 - h, 2.5 - h, 1.5 - h * 0.5, 0]), { n: 'sheet', role: P }),
        line(fold, { n: 'fold', role: S, on: 'sheet' }),
        line(g.seg(a, y1, b, y1), { n: 't1', role: D, on: 'sheet' }),
        line(g.seg(a, y1 + dy, a + (b - a) * 0.6, y1 + dy), { n: 't2', role: D, on: 'sheet' })
      ];
    },
    fx: { t: 'draw', on: ['t1', 't2'] }
  },
  'sticky-note': {
    label: '便签', key: 'square',
    plan: '主体：便签纸（右下角斜切）；辅助：折起的角；细节：两行字（末行短）',
    weights: { [P]: 0.64, [S]: 0.16, [D]: 0.2 },
    draw(g, ctx) {
      const { h, s } = g, c = 6, a = 3 + s + 2 + h, b = 21 - s - 2 - h, e = 21 - c;
      const note = shell(g.polygon([[3 + h, 3 + h], [21 - h, 3 + h], [21 - h, e], [e, 21 - h], [3 + h, 21 - h]], [4 - h, 4 - h, 0.9, 0.9, 4 - h]), { n: 'note', role: P });
      if (ctx?.variant === 'fill') {
        // fill: the fold cuts the corner off as its own piece. Cut along the fold line, the
        // piece would end in two sharp points at the slanted edge, so the whole corner is cut
        // out (to the fold's outer edge) and the piece is drawn again inside the fold, with its
        // points rounded. The lines keep one stroke of paper between them, and the short one a
        // stroke from the cut (its round corner read as a circle about e + 2).
        const t = 36 + (Math.SQRT2 - 1) * h; // the slanted edge, outside: x + y = t
        const dy = Math.max(4, 2 * s), lim = e + 2 - Math.sqrt(Math.max(0, (2 + 2 * s) ** 2 - (e + 2 - 12) ** 2)) - 0.2;
        return [
          note,
          solid(g.area(e - h, e - h, 24 - e + h, 24 - e + h, [2 + h, 0, 0, 0]), { n: 'fold', role: S, on: 'note' }),
          solid(g.polygon([[e + h, e + h], [e + h, t - e - h], [t - e - h, e + h]], [2 - h, 0.4 * s, 0.4 * s]), { n: 'flap', role: S }),
          line(g.seg(a, 12 - dy, b, 12 - dy), { n: 'l1', role: D, on: 'note' }),
          line(g.seg(a, 12, Math.min(a + (b - a) * 0.55, lim), 12), { n: 'l2', role: D, on: 'note' })
        ];
      }
      return [
        note,
        line(`M${n(e)} ${n(21 - h)}V${n(e + 2)}A2 2 0 0 1 ${n(e + 2)} ${n(e)}H${n(21 - h)}`, { n: 'fold', role: S, on: 'note' }),
        line(g.seg(a, 8, b, 8), { n: 'l1', role: D, on: 'note' }),
        line(g.seg(a, 12, a + (b - a) * 0.55, 12), { n: 'l2', role: D, on: 'note' })
      ];
    },
    // 便签: it sways from the sticky top edge
    fx: { t: 'wiggle', on: 'all', o: [12, 3], deg: 6, hz: 2.4 }
  },
  'cloud-upload': {
    label: '上传', key: 'landscape', fit: 'x',
    plan: '主体：向上的箭头（说明动作，杆伸出云的下方）；辅助：云（底部开口，与云的圆相同，整体上移 1）',
    weights: { [P]: 0.35, [S]: 0.65 },
    draw(g, ctx) {
      // fill: a smaller head, a little higher, so the clear band round it keeps one stroke of
      // cloud below it and in the notches between the puffs, and leaves no thin point of cloud
      // in the corner between an arm and the stem (the stem still runs out through the bottom)
      const { h } = g, C = [[7.1, 13.9, 5.1], [12.6, 9.65, 6.9], [17.6, 14.6, 4.4]], fill = ctx?.variant === 'fill';
      const L = fill ? 3 : 4, tip = fill ? 11 : 12;
      return [
        line(cloudTop(g, C, 150, 30), { n: 'cloud', role: S, only: 'outline' }),
        shell(cloud(g, C, 19), { n: 'cloud', role: S, only: 'fill' }),
        line(g.seg(12, 22 - h, 12, tip) + g.pl([[12 - L, tip + L], [12, tip], [12 + L, tip + L]]), { n: 'arrow', role: P, gap: true })
      ];
    },
    light: ['arrow'],
    fx: { t: 'keys', on: ['arrow'], y: [-1.4, 0.3] }
  },
  certificate: {
    label: '证书', key: 'landscape', fit: 'x',
    plan: '主体：证书纸面；辅助：印章（圆环，压在右下角，下面两条飘带）；细节：两行字',
    weights: { [P]: 0.56, [S]: 0.28, [D]: 0.16 },
    draw(g, ctx) {
      const { s, h } = g, fill = ctx?.variant === 'fill', cx = 15, cy = 15;
      // fill: the seal is a disc, a little smaller from regular up so a stroke of paper stays to
      // its right; the lines sit higher and a stroke apart, start a stroke in from the left edge,
      // and stop a stroke short of the seal's clear band (the second is short at bold). The band
      // is notched where it crosses the paper's bottom edge, so it meets the edge square.
      const R = fill ? 3.25 - 1.5 * Math.max(0, s - 2) : 3.25, r = R - h, Rb = R + g.g;
      const a = fill ? 4 + 1.5 * s - 2 * Math.max(0, s - 1.5) : 2 + s + 2 + h;
      const y1 = fill ? Math.max(3 + 1.5 * s, 8 - 4 * (s - 1.5)) : 8, y2 = y1 + (fill ? Math.max(4, 2 * s) : 4);
      const clear = (y) => (fill ? cx - Math.sqrt(Math.max(0, (Rb + h + s) ** 2 - (cy - y) ** 2)) : Infinity);
      const seal = { n: 'seal', role: S, part: 'seal', ...(fill ? { cutD: sealCut(g, cx, cy, Rb) } : { occ: true }) };
      return [
        shell(g.box(2, 3, 20, 14, fill ? [3.5, 3.5, CORNER, 3.5] : 3.5), { n: 'paper', role: P }),
        line(g.seg(a, y1, Math.min(22 - (2 + s + 2 + h), clear(y1)), y1), { n: 'l1', role: D, on: 'paper' }),
        line(g.seg(a, y2, Math.min(9, clear(y2)), y2), { n: 'l2', role: D, on: 'paper' }),
        line(g.seg(cx - r * 0.5, cy + r * 0.87, 13, 22 - h) + g.seg(cx + r * 0.5, cy + r * 0.87, 17, 22 - h), { n: 'ribbon', role: S, part: 'seal', gap: true }),
        shell(g.ring(cx, cy, R), seal)
      ];
    },
    // 盖章: the seal is pressed down and springs back
    fx: { t: 'keys', on: ['seal', 'ribbon'], o: [15, 15], s: [0.78, 1.08], ms: 380 }
  },
  scroll: {
    label: '卷轴', key: 'square',
    plan: '主体：上下两个卷轴（胶囊形）；辅助：纸面的两条侧边；细节：一行字。卷轴是两个闭合的长条，墨量近八成；纸面只露出中间一段',
    weights: { [P]: 0.8, [S]: 0.13, [D]: 0.07 },
    draw(g) {
      const { h } = g;
      return [
        line(g.seg(6, 9 - h, 6, 15 + h) + g.seg(18, 9 - h, 18, 15 + h), { n: 'sides', role: S }),
        line(g.seg(6 + g.s + g.clear, 12, 18 - g.s - g.clear, 12), { n: 'text', role: D }),
        shell(g.box(3, 3, 18, 6, 3), { n: 'top', role: P }),
        shell(g.box(3, 15, 18, 6, 3), { n: 'bottom', role: P })
      ];
    },
    // 展开: the bottom roll rolls up and unrolls again
    fx: [{ t: 'keys', on: ['bottom'], y: [-2.6, 0], ms: 360 }, { t: 'keys', on: ['sides', 'text'], o: [12, 9], sy: [0.55, 1], ms: 360 }]
  }
};

// The clipboard board and its clip. In the outline the board's top edge stops at the clip; in
// the fill variant the clip stands on the board with a clear band round it; from regular up it
// is shorter there, so two lines still fit under it a stroke apart.
const clipBottom = (g) => 8 - 2 * Math.max(0, g.s - 2);
function board(g, ctx) {
  const { h } = g, x0 = 4 + h, x1 = 20 - h, y0 = 4 + h, yb = 22 - h, c = 4 - h, cl = 8 + h, cr = 16 - h;
  const fill = ctx?.variant === 'fill';
  return [
    line(`M${n(cr)} ${n(y0)}H${n(x1 - c)}A${n(c)} ${n(c)} 0 0 1 ${n(x1)} ${n(y0 + c)}V${n(yb - c)}A${n(c)} ${n(c)} 0 0 1 ${n(x1 - c)} ${n(yb)}H${n(x0 + c)}A${n(c)} ${n(c)} 0 0 1 ${n(x0)} ${n(yb - c)}V${n(y0 + c)}A${n(c)} ${n(c)} 0 0 1 ${n(x0 + c)} ${n(y0)}H${n(cl)}`, { n: 'board', role: P, only: 'outline' }),
    shell(g.box(4, 4, 16, 18, 4), { n: 'board', role: P, only: 'fill' }),
    fill ? shell(g.box(8, 2, 8, clipBottom(g) - 2, 2), { n: 'clip', role: S, cutD: clipCut(g, 8, 16, clipBottom(g)) })
      : shell(g.box(8, 2, 8, 6, 2), { n: 'clip', role: S })
  ];
}
// The clear band under a clip (fill), with straight sides up through the top. Its sides cross
// the board's round top corners at a slant, which would leave a thin point of board beside it;
// a round notch where they cross (centred on the crossing, read on a circle of radius 4 about
// the corner) meets both edges square instead.
function clipCut(g, x0, x1, yb) {
  const w = g.g, xl = x0 - w, xr = x1 + w, yc = 8 - Math.sqrt(Math.max(0, 16 - (8 - xl) ** 2)), r = 0.5 * g.s;
  return g.area(xl, 0, xr - xl, yb + w, [0, 0, 2 + w, 2 + w]) + g.circ(xl, yc, r) + g.circ(xr, yc, r);
}

// The clear band round certificate's seal in the fill: a disc of radius Rb, with a round notch
// (half a stroke) where it crosses the paper's outer edge, so the paper meets it square instead
// of running out into a thin point. The paper's bottom-right corner (radius c, read as a circle)
// is tighter in the fill, so the strip of paper right of the seal ends wide enough for it.
const CORNER = 3;
function sealCut(g, cx, cy, Rb, c = CORNER) {
  const dy = 17 - cy, dx = Math.sqrt(Math.max(0, Rb * Rb - dy * dy)), r = 0.5 * g.s;
  let right = [cx + dx, 17];
  if (right[0] > 22 - c) {
    // circle-circle crossing with the corner, the lower one
    const [ox, oy, ro] = [22 - c, 17 - c, c], ux = ox - cx, uy = oy - cy, D = Math.hypot(ux, uy);
    const k = (Rb * Rb - ro * ro + D * D) / (2 * D), q = Math.sqrt(Math.max(0, Rb * Rb - k * k));
    const mx = cx + (k * ux) / D, my = cy + (k * uy) / D, p1 = [mx - (q * uy) / D, my + (q * ux) / D], p2 = [mx + (q * uy) / D, my - (q * ux) / D];
    right = p1[1] > p2[1] ? p1 : p2;
  }
  return g.circ(cx, cy, Rb) + g.circ(cx - dx, 17, r) + g.circ(right[0], right[1], r);
}
