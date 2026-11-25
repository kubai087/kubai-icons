// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// media: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: images video film music headphones stop record fast-forward rewind skip-forward skip-back repeat shuffle eject playlist album radio equalizer audio-lines subtitles picture-in-picture aperture focus clapperboard live
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// Transport triangles share play's rounding (2.5 at every corner) and its proportion: the half
// height is 0.615 of the length, as in play (9.6 / 15.6 on the centre line). A triangle is given
// by its outer box like play: base at x0, tip at x0 + W, half height A (outer, before rounding).
const TRI_R = 2.5;
const triRight = (g, x0, W, A, cy = 12) => { const { h } = g; return [[x0 + h, cy - A + h], [x0 + W - h, cy], [x0 + h, cy + A - h]]; };
const mirror = (pts) => pts.map(([x, y]) => [24 - x, y]).reverse();
// Paired triangles (fast-forward, rewind) take a smaller rounding, so at 16 px the pair keeps
// its points instead of blurring into a figure eight.
const TRI_PAIR = 1.4;
const tri = (g, pts, r = TRI_R) => g.polygon(pts, [r, r, r]);
// Fast-forward: two triangles, the tip of the first just reaching the base of the second.
const ffTris = (g) => { const W = 12.27, A = 7.32; return [triRight(g, 3, W, A), triRight(g, 11, W, A)]; };
// Skip: a triangle as large as play's beside a bar at the far edge, 2 clear of the tip.
const skipTri = (g) => { const W = 16.27, A = 9.78; return triRight(g, 3, W, A); };
// Arrowhead of the small loop and crossing arrows (repeat, shuffle): legs 3 along each axis.
const HEAD = 3;
const headRight = (g, x, y) => g.pl([[x - HEAD, y - HEAD], [x, y], [x - HEAD, y + HEAD]]);
const headLeft = (g, x, y) => g.pl([[x + HEAD, y - HEAD], [x, y], [x + HEAD, y + HEAD]]);
// A polyline whose inner corners are rounded with radius r (centre line).
function rpl(pts, r) {
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i - 1], [px, py] = pts[i], [bx, by] = pts[i + 1];
    const la = Math.hypot(ax - px, ay - py), lb = Math.hypot(bx - px, by - py);
    const u = [(ax - px) / la, (ay - py) / la], v = [(bx - px) / lb, (by - py) / lb];
    const half = Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1]))) / 2, t = r / Math.tan(half);
    const sweep = (px - ax) * (by - py) - (py - ay) * (bx - px) > 0 ? 1 : 0;
    d += `L${n(px + u[0] * t)} ${n(py + u[1] * t)}A${n(r)} ${n(r)} 0 0 ${sweep} ${n(px + v[0] * t)} ${n(py + v[1] * t)}`;
  }
  const e = pts[pts.length - 1];
  return d + `L${n(e[0])} ${n(e[1])}`;
}

export default {
  images: {
    label: '照片', key: 'landscape',
    plan: '主体：前面一张图片的画框；辅助：后面一张（被挡住，只露出上沿和右沿）；细节：山和太阳（同图片，缩小到前面的画框里）',
    weights: { [P]: 0.56, [S]: 0.22, [D]: 0.22 },
    // fill variant: the hill stays inside the photo, as in file-image
    ends: 'in',
    draw(g, ctx) {
      // the sun grows less than in image and keeps clear of the hill at every weight
      const { s } = g, k = 1.05 - (s - 2) * 0.6, o = 2 - (s - 2) * 0.5 + g.dr * k;
      // Fill variant: of the photo behind only its top and right edges show, drawn as a line
      // with round ends (filled and cut by the clear band, the strip would end in points where
      // it rounds the corners). From the regular weight up the front photo gives up e at its
      // top and right so the band fits under that line; the sun sits a stroke inside the frame.
      const fill = ctx?.variant === 'fill', e = fill ? Math.max(0, s + g.g - 3) : 0, h = g.h, c = 3.25 - h;
      const sx = fill ? 2 + s + g.dr * k + 0.5 : 2 + s + o, sy = fill ? 7 + e + s + g.dr * k + 0.5 : 7 + s + o;
      return [
        fill ? line(`M8.25 ${n(4 + h)}H${n(22 - h - c)}A${n(c)} ${n(c)} 0 0 1 ${n(22 - h)} ${n(4 + h + c)}V13.75`, { n: 'back', role: S })
          : shell(g.box(5, 4, 17, 13, 3.25), { n: 'back', role: S }),
        shell(g.box(2, 7 + e, 17 - e, 13 - e, 3.25), { n: 'front', role: P, occ: true }),
        line(hill(g, { cx: 15.5, cy: 25, r: 10, bottom: 20, right: 19 - e }), { n: 'hill', role: D, on: 'front' }),
        solid(g.dot(sx, sy, k), { n: 'sun', role: D, on: 'front' })
      ];
    },
    // 翻看照片: the photo in front slides down and left, the one behind comes forward
    fx: [{ t: 'keys', on: ['front', 'hill', 'sun'], x: [-0.9], y: [0.9] }, { t: 'keys', on: ['back'], x: [0.6], y: [-0.6] }]
  },
  video: {
    label: '视频', key: 'landscape', fit: 'x',
    plan: '主体：机身；辅助：镜头（梯形，与机身隔开 2）；细节：录制灯（平时不显示，悬停时闪烁）',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(2, 6, 12, 12, 3.5), { n: 'body', role: P }),
        shell(g.polygon([[16 + h, 10 + h * 0.5], [22 - h, 6 + h], [22 - h, 18 - h], [16 + h, 14 - h * 0.5]], [0.75, 1.5, 1.5, 0.75]), { n: 'lens', role: S }),
        solid(g.dot(6.5, 10.5, 1), { n: 'rec', role: D, on: 'body', ghost: true })
      ];
    },
    // 录像: a recording light blinks on the body
    fx: { t: 'keys', on: ['rec'], ghost: true, a: [1, 0.15, 1, 1], ms: 900 }
  },
  film: {
    label: '胶片', key: 'square',
    plan: '主体：胶片外框；辅助：两条竖线（分出两侧的齿孔带）；细节：齿孔间的横线（一组，两侧各三条，连着外框和竖线）。齿孔是胶片的标志，横线短但数量多，约占三分之一',
    weights: { [P]: 0.42, [S]: 0.25, [D]: 0.33 },
    draw(g, ctx) {
      const { h, s } = g;
      let t = 3 + h, b = 21 - h, Y = [8, 12, 16], rt = t, rb = b;
      // Fill variant: the ticks cut out through the sides, so the perforations between them
      // stand as blocks, and the rails stop a stroke short of the top and bottom. Past the
      // regular weight three ticks no longer fit between the rounded corners with a stroke of
      // ink between them, and two are drawn.
      if (ctx?.variant === 'fill') {
        t = 3 - h; b = 21 + h; rt = 3 + 1.5 * s; rb = 21 - 1.5 * s; Y = s > 2 ? [9, 15] : Y;
      }
      const ticks = Y.map((y) => g.seg(t, y, 8, y) + g.seg(16, y, b, y)).join('');
      return [
        shell(g.box(3, 3, 18, 18, 4.5), { n: 'frame', role: P }),
        line(g.seg(8, rt, 8, rb) + g.seg(16, rt, 16, rb), { n: 'rails', role: S, on: 'frame' }),
        line(ticks, { n: 'holes', role: D, on: 'frame' })
      ];
    },
    // 走片: the strip advances a notch
    fx: { t: 'keys', on: ['holes'], y: [1.6], ms: 260 }
  },
  music: {
    nudge: [-1, 0],
    label: '音乐', key: 'square',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：两个符头（圆环）；辅助：符干和符杠（连成一笔）',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      // drawn 1 to the left: the stems on the right of the heads pull the weight right
      const { h } = g, R = 3.5, x1 = 5.5 + R - h, x2 = 16.5 + R - h;
      return [
        line(g.pl([[x1, 17.5], [x1, 6], [x2, 3 + h], [x2, 15.5]]), { n: 'stems', role: S }),
        shell(g.ring(5.5, 17.5, R), { n: 'h1', role: P }),
        shell(g.ring(16.5, 15.5, R), { n: 'h2', role: P })
      ];
    },
    // 随节奏摆动
    fx: { t: 'wiggle', on: 'all', o: [11, 21], deg: 7, hz: 2.4 }
  },
  headphones: {
    label: '耳机', key: 'circle',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：两个耳罩；辅助：头梁（半圆弧，两端接到耳罩外侧）',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g, r = 10 - h, cy = 12;
      return [
        line(`M${n(2 + h)} 16V${cy}A${n(r)} ${n(r)} 0 0 1 ${n(22 - h)} ${cy}V16`, { n: 'band', role: S }),
        shell(g.box(2, 14, 6, 8, 2), { n: 'c1', role: P }),
        shell(g.box(16, 14, 6, 8, 2), { n: 'c2', role: P })
      ];
    },
    // 播放音乐: the cups thump to the beat
    fx: { t: 'beat', on: 'all', o: [12, 14], amp: 0.07 }
  },
  stop: {
    label: '停止', key: 'square',
    plan: '主体：圆角方块，圆角与播放三角相同（中心线 2.5）',
    weights: { [P]: 1 },
    draw(g) { return [shell(g.box(4, 4, 16, 16, TRI_R + 1), { n: 'sq', role: P })]; },
    // 停下: pressed in, then back
    fx: { t: 'keys', on: 'all', o: [12, 12], s: [0.84], ms: 240 },
    swap: 'record',
    allow: { keyline: '方块 16，与播放三角、暂停竖条的分量相当，比方形参考线小一圈' }
  },
  record: {
    label: '录制', key: 'circle',
    plan: '主体：中间的圆（录制点，画成圆环）；辅助：外圈',
    weights: { [P]: 0.35, [S]: 0.65 },
    draw(g) {
      return [shell(g.ring(12, 12, 10), { n: 'ring', role: S }), line(g.ring(12, 12, 5.5), { n: 'dot', role: P, on: 'ring' })];
    },
    // 录制中: the dot blinks
    fx: { t: 'keys', on: ['dot'], a: [0.15, 1, 0.15], ms: 900 },
    swap: 'stop'
  },
  'fast-forward': {
    allow: { keyline: '两个三角的圆角较小，尖端伸出参考线 1（尖角会显得小）' },
    label: '快进', key: 'square', fit: 'x',
    plan: '主体：两个向右的三角，前一个的尖抵住后一个的底边。圆角与播放相同',
    weights: { [P]: 1 },
    draw(g) { const [a, b] = ffTris(g); return [shell(tri(g, a, TRI_PAIR), { n: 't1', role: P, part: 'tris' }), shell(tri(g, b, TRI_PAIR), { n: 't2', role: P, part: 'tris' })]; },
    fx: { t: 'keys', on: [['t2'], ['t1']], by: true, x: [1.1], stagger: 70, ms: 360 }
  },
  rewind: {
    allow: { keyline: '两个三角的圆角较小，尖端伸出参考线 1（尖角会显得小）' },
    label: '快退', key: 'square', fit: 'x',
    plan: '同快进，方向向左',
    weights: { [P]: 1 },
    draw(g) { const [a, b] = ffTris(g); return [shell(tri(g, mirror(a), TRI_PAIR), { n: 't1', role: P, part: 'tris' }), shell(tri(g, mirror(b), TRI_PAIR), { n: 't2', role: P, part: 'tris' })]; },
    fx: { t: 'keys', on: [['t2'], ['t1']], by: true, x: [-1.1], stagger: 70, ms: 360 }
  },
  'skip-forward': {
    label: '下一首', key: 'square',
    plan: '主体：向右的三角（与播放同大、同圆角）；辅助：右侧竖条（一笔，离三角尖 2）',
    weights: { [P]: 0.72, [S]: 0.28 },
    allow: { keyline: '三角与播放同比例，竖条与三角等高，上下不到方形参考线' },
    draw(g) { const { h } = g; return [shell(tri(g, skipTri(g)), { n: 'tri', role: P }), line(g.span(21 - h, 4, 21 - h, 20), { n: 'bar', role: S })]; },
    light: [],
    // 跳到下一首: the triangle runs up to the bar
    fx: { t: 'keys', on: ['tri'], x: [1.4], ms: 300 }
  },
  'skip-back': {
    label: '上一首', key: 'square',
    plan: '同下一首，方向向左',
    weights: { [P]: 0.72, [S]: 0.28 },
    allow: { keyline: '同下一首' },
    draw(g) { const { h } = g; return [shell(tri(g, mirror(skipTri(g))), { n: 'tri', role: P }), line(g.span(3 + h, 4, 3 + h, 20), { n: 'bar', role: S })]; },
    light: [],
    fx: { t: 'keys', on: ['tri'], x: [-1.4], ms: 300 }
  },
  repeat: {
    label: '循环播放', key: 'square',
    light: [],
    plan: '主体：上下两支箭头首尾相接围成一圈（上面向右，下面向左），转角圆角 3',
    weights: { [P]: 1 },
    draw(g) {
      const c = 3;
      return [
        line(`M4 11V${7 + c}A${c} ${c} 0 0 1 ${4 + c} 7H20` + headRight(g, 20, 7), { n: 'top', role: P }),
        line(`M20 13V${17 - c}A${c} ${c} 0 0 1 ${20 - c} 17H4` + headLeft(g, 4, 17), { n: 'bottom', role: P })
      ];
    },
    area: (g) => [{ n: 'top', d: g.rr(4, 7, 16, 10, [3, 0, 3, 0]) }],
    // 循环: half a turn lands on itself
    fx: { t: 'rotate', on: 'all', deg: 180 }
  },
  shuffle: {
    nudge: [-0.5, 0],
    label: '随机播放', key: 'square',
    light: [],
    plan: '主体：两支交叉的箭头，前面一支在交叉处切开后面一支',
    weights: { [P]: 1 },
    draw(g) {
      // drawn 0.5 to the left: the two heads pull the weight right
      return [
        line(rpl([[3.5, 7], [7, 7], [15, 17], [19.5, 17]], 1.6) + headRight(g, 19.5, 17), { n: 'back', role: P }),
        line(rpl([[3.5, 17], [7, 17], [15, 7], [19.5, 7]], 1.6) + headRight(g, 19.5, 7), { n: 'front', role: P, gap: true })
      ];
    },
    fx: { t: 'draw', on: ['back', 'front'], stagger: 120 }
  },
  eject: {
    label: '弹出', key: 'square',
    plan: '主体：向上的三角（与下一首的三角相同，转向上）；辅助：下方横条（一笔，离三角底边 2）',
    weights: { [P]: 0.72, [S]: 0.28 },
    allow: { keyline: '三角底角倒圆后宽 16，横条与之同宽，左右不到方形参考线' },
    light: [],
    draw(g) {
      const { h } = g, W = 16.27, a = 9.78 - h, yb = 17 - h;
      return [
        shell(g.polygon([[12 - a, yb], [12, 17 - W + h], [12 + a, yb]], [TRI_R, TRI_R, TRI_R]), { n: 'tri', role: P }),
        line(g.span(4, 21 - h, 20, 21 - h), { n: 'bar', role: S })
      ];
    },
    // 弹出: the triangle lifts off the bar
    fx: { t: 'keys', on: ['tri'], y: [-1.4], ms: 280 }
  },
  playlist: {
    label: '播放列表', key: 'square',
    plan: '主体：三行线（末行短，让出音符）；辅助：音符（圆环符头、符干和符尾）',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g, R = 3.5, cx = 14.5, cy = 17.5, x = cx + R - h;
      return [
        ...[[6, 14], [11, 14], [16, 9]].map(([y, e], i) => line(g.span(3, y, e, y), { n: `l${i}`, role: P })),
        line(g.pl([[x, cy], [x, 3 + h], [20, 6]]), { n: 'stem', role: S, part: 'note' }),
        shell(g.ring(cx, cy, R), { n: 'head', role: S, part: 'note' })
      ];
    },
    fx: { t: 'wiggle', on: ['stem', 'head'], o: [14.5, 21], deg: 10, hz: 2.4 }
  },
  album: {
    label: '专辑', key: 'square',
    plan: '主体：前面的封套；辅助：后面一张（只露出上沿一条线）；细节：唱片（圆环，随字重缩小）',
    weights: { [P]: 0.62, [S]: 0.16, [D]: 0.22 },
    draw(g, ctx) {
      // fill variant: the disc's hole stays at least a stroke across at heavy weights
      const R = 3.5 - (g.s - 2) * 0.5;
      return [
        line(g.span(6, 4, 18, 4), { n: 'back', role: S }),
        shell(g.box(3, 7, 18, 14, 4), { n: 'sleeve', role: P }),
        line(g.ring(12, 14, ctx?.variant === 'fill' ? Math.max(R, 1.5 * g.s) : R), { n: 'disc', role: D, on: 'sleeve' })
      ];
    },
    // 翻专辑: the one behind rises, the sleeve settles
    fx: [{ t: 'keys', on: ['back'], y: [-1], ms: 260 }, { t: 'keys', on: ['disc'], o: [12, 14], s: [0.7, 1.08], ms: 420 }]
  },
  radio: {
    label: '收音机', key: 'landscape',
    plan: '主体：机身；辅助：天线（斜线，接在机身上沿）；细节：喇叭（圆环）和两条调频刻度',
    weights: { [P]: 0.6, [S]: 0.12, [D]: 0.28 },
    draw(g, ctx) {
      const { s } = g;
      let R = 3.5 - (s - 2) * 0.5, x = 9, a = 14.5, b = 18.5 - (s - 2), y = 2;
      // Fill variant at heavy weights: the speaker's hole stays a stroke across, and the speaker
      // and the two dial lines keep a stroke of ink between them
      if (ctx?.variant === 'fill' && s > 2) {
        R = Math.max(R, 1.5 * s);
        x = 9 - (s - 2);
        a = Math.max(a, x + R + s);
        b = Math.max(b, a + 4);
        y = s;
      }
      return [
        line(g.seg(7, 7, 17, 3), { n: 'antenna', role: S }),
        shell(g.box(2, 6, 20, 14, 3.5), { n: 'body', role: P }),
        line(g.ring(x, 13, R), { n: 'grille', role: D, on: 'body' }),
        line(g.span(a, 13 - y, b, 13 - y) + g.span(a, 13 + y, b, 13 + y), { n: 'dial', role: D, on: 'body' })
      ];
    },
    // 播放: the speaker thumps
    fx: { t: 'keys', on: ['grille'], o: [9, 13], s: [0.75, 1.08, 0.85], ms: 520 },
    allow: { keyline: '天线伸出横向参考线' }
  },
  equalizer: {
    label: '均衡器', key: 'live',
    plan: '主体：三个滑钮（圆环，高低错开）；辅助：三条竖向滑轨（被滑钮切开）。同调节，竖放',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g) {
      const K = [[5, 14], [12, 10], [19, 13]];
      return [
        ...K.map(([x], i) => line(g.span(x, 2, x, 22), { n: `t${i}`, role: S })),
        ...K.map(([x, y], i) => shell(g.ring(x, y, 3), { n: `k${i}`, role: P, occ: true }))
      ];
    },
    // 调音: the knobs move up and down, out of step
    fx: [{ t: 'keys', on: ['k0'], y: [-4, 1, 0] }, { t: 'keys', on: ['k1'], y: [4, -2, 0] }, { t: 'keys', on: ['k2'], y: [-3, 2, 0] }]
  },
  'audio-lines': {
    label: '音频波形', key: 'square',
    plan: '主体：五条竖线，长短不一，以中线对称',
    weights: { [P]: 1 },
    draw(g) {
      return [[4, 8], [8, 5], [12, 3], [16, 7], [20, 9]].map(([x, y], i) => line(g.span(x, y, x, 24 - y), { n: `b${i}`, role: P }));
    },
    fx: { t: 'keys', on: ['b0', 'b1', 'b2', 'b3', 'b4'], by: true, o: [12, 12], sy: [0.45, 1.1], stagger: 60 }
  },
  subtitles: {
    label: '字幕', key: 'landscape',
    plan: '主体：画框；细节：两行字幕（靠下，上行两段、下行一段）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g, ctx) {
      // fill variant: at heavy weights the two rows move apart, a stroke of ink between them
      const e = ctx?.variant === 'fill' ? Math.max(2, g.s) : 2, y1 = 13 - e, y2 = 13 + e;
      return [
        shell(g.box(2, 4, 20, 16, 4), { n: 'frame', role: P }),
        line(g.span(6, y1, 11, y1) + g.span(14, y1, 18, y1), { n: 'r1', role: D, on: 'frame' }),
        line(g.span(6, y2, 16, y2), { n: 'r2', role: D, on: 'frame' })
      ];
    },
    fx: { t: 'draw', on: ['r1', 'r2'] }
  },
  'picture-in-picture': {
    label: '画中画', key: 'landscape',
    plan: '主体：大画框；辅助：右下角的小画框',
    weights: { [P]: 0.75, [S]: 0.25 },
    draw(g) {
      return [shell(g.box(2, 4, 20, 16, 4), { n: 'frame', role: P }), shell(g.box(10, 10, 8, 6, 1.5), { n: 'pip', role: S, on: 'frame' })];
    },
    // 小窗弹出: the small frame grows out of its corner
    fx: { t: 'keys', on: ['pip'], o: [18, 16], s: [0.6, 1.06], ms: 380 }
  },
  aperture: {
    label: '光圈', key: 'circle',
    plan: '主体：外圈；辅助：六片叶片（每条线沿中间六边形的一边伸到外圈）。六条线加起来比外圈长，占一半多',
    weights: { [P]: 0.43, [S]: 0.57 },
    draw(g, ctx) {
      const { h } = g, r = 10 - h, a = 4, v = a / Math.cos(Math.PI / 6), x1 = Math.sqrt(r * r - a * a), blades = [];
      const fill = ctx?.variant === 'fill';
      for (let k = 0; k < 6; k++) {
        const t = (k * 60 * Math.PI) / 180, c = Math.cos(t), si = Math.sin(t);
        const P0 = [-v / 2, -a], P1 = [x1, -a];
        const R = ([x, y]) => [12 + x * c - y * si, 12 + x * si + y * c];
        if (!fill) { blades.push(g.seg(...R(P0), ...R(P1))); continue; }
        // Fill variant: the blades divide the disc, so each line runs out through the edge. Past
        // the hexagon it turns 30° toward the radius and bends on an arc that meets the edge
        // square: a straight line would leave every blade a 60° point at the hexagon and a 66°
        // one at the edge, thinner than a stroke near the tip.
        const tu = -Math.PI / 6, V = [v / 2, -a], u = [Math.cos(tu), Math.sin(tu)], m = [u[1], -u[0]];
        // the arc's circle passes V along u and is square to the edge: |C|² = 10² + ρ²
        const rho = (100 - v * v) / (2 * (V[0] * m[0] + V[1] * m[1])), C = [V[0] + rho * m[0], V[1] + rho * m[1]];
        let f = Math.atan2(V[1] - C[1], V[0] - C[0]), E = V;
        const df = u[0] * -(V[1] - C[1]) + u[1] * (V[0] - C[0]) > 0 ? 0.002 : -0.002;
        while (Math.hypot(...E) < 10 + h) { f += df; E = [C[0] + rho * Math.cos(f), C[1] + rho * Math.sin(f)]; }
        blades.push(`M${g.pt(...R(P0))}L${g.pt(...R(V))}A${n(rho)} ${n(rho)} 0 0 ${df > 0 ? 1 : 0} ${g.pt(...R(E))}`);
      }
      return [shell(g.ring(12, 12, 10), { n: 'ring', role: P }), line(blades.join(''), { n: 'blades', role: S, on: 'ring' })];
    },
    // 调光圈: the blades turn a sixth of a turn, landing on themselves
    fx: { t: 'rotate', on: ['blades'], deg: 60 }
  },
  focus: {
    label: '对焦', key: 'square',
    plan: '主体：四角取景框（圆角同方形参考线）；细节：中心对焦圆环',
    weights: { [P]: 0.78, [D]: 0.22 },
    draw(g) {
      const { h } = g, c = 4.5 - h, a = 3 + h, b = 21 - h, e = 9, f = 15;
      const corners = `M${n(a)} ${e}V${n(a + c)}A${n(c)} ${n(c)} 0 0 1 ${n(a + c)} ${n(a)}H${e}` +
        `M${f} ${n(a)}H${n(b - c)}A${n(c)} ${n(c)} 0 0 1 ${n(b)} ${n(a + c)}V${e}` +
        `M${n(b)} ${f}V${n(b - c)}A${n(c)} ${n(c)} 0 0 1 ${n(b - c)} ${n(b)}H${f}` +
        `M${e} ${n(b)}H${n(a + c)}A${n(c)} ${n(c)} 0 0 1 ${n(a)} ${n(b - c)}V${f}`;
      return [line(corners, { n: 'frame', role: P }), shell(g.ring(12, 12, 3), { n: 'point', role: D })];
    },
    area: (g) => [{ n: 'frame', d: g.rr(3 + g.h, 3 + g.h, 18 - g.s, 18 - g.s, 4.5 - g.h) }],
    // 对焦: the frame closes in on the point and settles
    fx: [{ t: 'keys', on: ['frame'], o: [12, 12], s: [0.86, 1.02], ms: 420 }, { t: 'keys', on: ['point'], o: [12, 12], s: [1.25, 1], ms: 420 }]
  },
  clapperboard: {
    label: '场记板', key: 'square',
    plan: '主体：板身；辅助：拍板（与板身共用一条边，左端是转轴）；细节：拍板上的三条斜纹',
    weights: { [P]: 0.45, [S]: 0.33, [D]: 0.22 },
    draw(g, ctx) {
      const { h, s } = g, t = 3 + h, b = 9 - h, X = [6.5, 11.5, 16.5];
      const board = shell(g.box(3, 7, 18, 14, [1.5, 1.5, 3.5, 3.5]), { n: 'board', role: P });
      if (ctx?.variant !== 'fill') {
        return [
          board,
          shell(g.box(3, 3, 18, 6, 1.5), { n: 'clapper', role: S }),
          line(X.map((x) => g.seg(x, t, x + 2.5, b)).join(''), { n: 'stripes', role: D, on: 'clapper' })
        ];
      }
      // Fill variant: the stripes cut the clapper into slanted pieces (the stripes' outer slope,
      // 2.5 across 6), and the last stripe is its right end. Cut as holes, the stripes would
      // leave each piece a sharp point at the top edge, so the pieces are drawn as shapes of
      // their own and their corners come out round. Spread to the board's top corner, every
      // piece stays wider than a stroke.
      const k = 2.5 / 6, q = Math.hypot(1, k), dx = s * q;
      const x0 = Math.max(6.5, 3 + s + h * q), x2 = 19.5 - 1.25 - k + h * q, F = [x0, (x0 + x2) / 2, x2];
      const at = (i, y) => F[i] + 1.25 + (y - 6) * k, c = 1.5 - h;
      const L = (i, y) => (i < 0 ? t : at(i, y) + dx), R = (i, y) => at(i, y) - dx;
      const pieces = [0, 1, 2].map((i) => g.polygon([[L(i - 1, t), t], [R(i, t), t], [R(i, b), b], [L(i - 1, b), b]], [i ? 0 : c, 0, 0, 0]));
      return [board, shell(pieces.join(''), { n: 'clapper', role: S })];
    },
    // 打板: the clapper lifts on its hinge and snaps shut
    fx: { t: 'keys', on: ['clapper', 'stripes'], o: [4, 8], r: [-9, 0], ms: 340 }
  },
  live: {
    label: '直播', key: 'landscape', fit: 'x',
    plan: '主体：两侧各两道信号弧；细节：中心发射点（实心，同无线网络）',
    weights: { [P]: 0.88, [D]: 0.12 },
    draw(g) {
      const { h } = g, arcs = (r) => g.arc(12, 12, r, -45, 45) + g.arc(12, 12, r, 135, 225);
      return [
        solid(g.dot(12, 12, 1.1), { n: 'dot', role: D, vc: 0 }),
        line(arcs(5), { n: 'a1', role: P, vc: 1 }),
        line(arcs(10 - h), { n: 'a2', role: P, vc: 2 })
      ];
    },
    fx: { t: 'variable', on: ['dot', 'a1', 'a2'], mode: 'cumulative' }
  }
};
