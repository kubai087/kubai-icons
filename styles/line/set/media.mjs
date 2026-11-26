// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// media: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: images video film music headphones stop record fast-forward rewind skip-forward skip-back repeat shuffle eject playlist album radio equalizer audio-lines subtitles picture-in-picture aperture focus clapperboard live
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { slash, badge, enclose, circ, gapOf } from '../kit.mjs';
import { off, notched } from '../variants.mjs';

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
// Fast-forward: two triangles; the second, in front, overlaps the tip of the first.
const ffTris = (g) => { const W = 12.27, A = 7.32; return [triRight(g, 3, W, A), triRight(g, 11, W, A)]; };
// Skip: a triangle as large as play's beside a bar at the far edge, 2 clear of the tip.
const skipTri = (g) => { const W = 16.27, A = 9.78; return triRight(g, 3, W, A); };
// Arrowhead of the small loop and crossing arrows (repeat, shuffle): legs 3 along each axis.
const HEAD = 3;
const headRight = (g, x, y) => g.pl([[x - HEAD, y - HEAD], [x, y], [x - HEAD, y + HEAD]]);
const headLeft = (g, x, y) => g.pl([[x + HEAD, y - HEAD], [x, y], [x + HEAD, y + HEAD]]);
// The sound waves of volume (icons.mjs): the first k of its three arcs, each where it is there.
const waves = (g, k) => [3, 6.75, 10.5].slice(0, k).map((r, i) => line(g.arc(10.5, 12, r, -45, 45), { n: `w${i + 1}`, role: S, vc: i }));
// Screens share monitor's outer corner radius.
const SCR = 3;
// The screen of monitor open at its top-right corner (screen-share), with monitor's stand.
const openScreen = (g) => {
  const { h } = g, c = SCR - h, t = 3 + h, b = 16 - h, r = 22 - h, l = 2 + h;
  return [
    line(`M12.5 ${n(t)}H${n(l + c)}A${n(c)} ${n(c)} 0 0 0 ${n(l)} ${n(t + c)}V${n(b - c)}A${n(c)} ${n(c)} 0 0 0 ${n(l + c)} ${n(b)}H${n(r - c)}A${n(c)} ${n(c)} 0 0 0 ${n(r)} ${n(b - c)}V12`, { n: 'screen', role: P }),
    line(g.seg(12, 16 - h, 12, 20) + g.span(7, 20, 17, 20), { n: 'stand', role: P })
  ];
};
// A badge of an arrow up or down (as kit.mjs badge, in its 8 box at the bottom-right corner of
// the key shape, in a round notch).
function arrowBadge(icon, up, label) {
  return {
    ...icon, label, base: icon.name, kind: 'badge', weights: null,
    draw(g, ctx) {
      const x = 18, y = 16, a = 4 - g.h, t = up ? -1 : 1, e = y + t * a;
      const d = g.seg(x, y - t * a, x, e) + g.pl([[x - 2.5, e - t * 2.5], [x, e], [x + 2.5, e - t * 2.5]]);
      return [...icon.draw(g, ctx), line(d, { n: 'badge', role: P, part: 'badge', cutD: circ(x, y, 4.4 + gapOf(g.s)), at: [x, y] })];
    }
  };
}
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

const icons = {
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
    plan: '主体：两个向右的三角，后一个在前面，挡住前一个的尖（切出间隙）。圆角与播放相同',
    weights: { [P]: 1 },
    // the second triangle is in front: its clear band hides the tip of the first
    draw(g) { const [a, b] = ffTris(g); return [shell(tri(g, a, TRI_PAIR), { n: 't1', role: P }), shell(tri(g, b, TRI_PAIR), { n: 't2', role: P, occ: true })]; },
    fx: { t: 'keys', on: [['t2'], ['t1']], by: true, x: [1.1], stagger: 70, ms: 360 }
  },
  rewind: {
    allow: { keyline: '两个三角的圆角较小，尖端伸出参考线 1（尖角会显得小）' },
    label: '快退', key: 'square', fit: 'x',
    plan: '同快进，方向向左',
    weights: { [P]: 1 },
    draw(g) { const [a, b] = ffTris(g); return [shell(tri(g, mirror(a), TRI_PAIR), { n: 't1', role: P }), shell(tri(g, mirror(b), TRI_PAIR), { n: 't2', role: P, occ: true })]; },
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
  },
  'play-pause': {
    label: '播放/暂停', key: 'landscape', fit: 'x',
    plan: '主体：左边的播放三角（与快进的三角同圆角）和右边两根暂停竖线（细线，与三角留 2）',
    weights: { [P]: 1 },
    draw(g) {
      return [
        shell(tri(g, triRight(g, 2, 12, 7.38), TRI_PAIR), { n: 'tri', role: P }),
        line(g.seg(17, 5, 17, 19), { n: 'p1', role: P }),
        line(g.seg(21, 5, 21, 19), { n: 'p2', role: P })
      ];
    },
    fx: [{ t: 'keys', on: ['tri'], x: [0.8], ms: 320 }, { t: 'keys', on: ['p1', 'p2'], by: true, o: [19, 12], sy: [0.8], ms: 320 }]
  },
  'repeat-1': {
    label: '单曲循环', key: 'square',
    light: ['one'],
    plan: '主体：首尾相接的两支箭头（与循环播放同一做法，上下拉开到 6 和 18）；细节：圈里的数字 1（随字重缩短）',
    allow: { keyline: '两支箭头上下拉开，箭头头部伸出方形参考线 1，给数字 1 留出位置' },
    weights: { [P]: 0.88, [D]: 0.12 },
    draw(g) {
      const c = 3, y0 = 6 + g.s + g.clear, y1 = 18 - g.s - g.clear;
      return [
        line(`M4 11V${6 + c}A${c} ${c} 0 0 1 ${4 + c} 6H20` + headRight(g, 20, 6), { n: 'top', role: P }),
        line(`M20 13V${18 - c}A${c} ${c} 0 0 1 ${20 - c} 18H4` + headLeft(g, 4, 18), { n: 'bottom', role: P }),
        line(g.pl([[10.75, y0 + 1.25], [12, y0], [12, y1]]), { n: 'one', role: D })
      ];
    },
    area: (g) => [{ n: 'top', d: g.rr(4, 6, 16, 12, [3, 0, 3, 0]) }],
    // 单曲循环: the arrows turn half round, the 1 stays
    fx: { t: 'rotate', on: ['top', 'bottom'], deg: 180, o: [12, 12] }
  },
  'volume-1': {
    label: '音量低', key: 'landscape', fit: 'x',
    plan: '同音量，只有最里面一道声波（位置不变）',
    weights: { [P]: 0.82, [S]: 0.18 },
    allow: { keyline: '只画一道声波，位置与音量相同，不放大', optical: '扬声器位置与音量相同，调节音量时不跳动' },
    draw(g) { return [shell(speaker(g), { n: 'speaker', role: P }), ...waves(g, 1)]; },
    fx: { t: 'variable', on: ['w1'], mode: 'iterative' }
  },
  'volume-2': {
    label: '音量中', key: 'landscape', fit: 'x',
    plan: '同音量，只有里面两道声波（位置不变）',
    weights: { [P]: 0.62, [S]: 0.38 },
    allow: { keyline: '只画两道声波，位置与音量相同，不放大', optical: '扬声器位置与音量相同，调节音量时不跳动' },
    draw(g) { return [shell(speaker(g), { n: 'speaker', role: P }), ...waves(g, 2)]; },
    fx: { t: 'variable', on: ['w1', 'w2'], mode: 'cumulative' }
  },
  'volume-x': {
    allow: { optical: '扬声器位置与音量相同，切换时不跳动' },
    label: '静音', key: 'landscape', fit: 'x',
    plan: '主体：扬声器（与音量相同）；辅助：右侧的叉号（代替声波）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) { return [shell(speaker(g), { n: 'speaker', role: P }), line(g.seg(15, 9, 21, 15) + g.seg(21, 9, 15, 15), { n: 'mark', role: S })]; },
    fx: { t: 'rotate', on: ['mark'], deg: 90, o: [18, 12] }
  },
  'volume-plus': {
    allow: { optical: '扬声器位置与音量相同，切换时不跳动' },
    label: '音量加', key: 'landscape', fit: 'x',
    plan: '主体：扬声器（与音量相同）；辅助：右侧的加号',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) { return [shell(speaker(g), { n: 'speaker', role: P }), line(g.seg(18, 8, 18, 16) + g.seg(14, 12, 22 - g.h, 12), { n: 'mark', role: S })]; },
    fx: { t: 'keys', on: ['mark'], o: [18, 12], s: [1.25], ms: 300 }
  },
  'volume-minus': {
    allow: { optical: '扬声器位置与音量相同，切换时不跳动' },
    label: '音量减', key: 'landscape', fit: 'x',
    plan: '主体：扬声器（与音量相同）；辅助：右侧的减号',
    weights: { [P]: 0.75, [S]: 0.25 },
    draw(g) { return [shell(speaker(g), { n: 'speaker', role: P }), line(g.seg(14, 12, 22 - g.h, 12), { n: 'mark', role: S })]; },
    fx: { t: 'keys', on: ['mark'], o: [18, 12], sx: [0.6], ms: 300 }
  },
  'music-2': {
    label: '音符', key: 'portrait', fit: 'y',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：符头（圆环，与音乐同大）；辅助：符干和符尾（连成一笔）',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g, x = 13 - h;
      return [line(g.pl([[x, 18], [x, 2 + h], [18, 6.5]]), { n: 'stem', role: S }), shell(g.ring(9, 18, 4), { n: 'head', role: P })];
    },
    fx: { t: 'wiggle', on: 'all', o: [9, 22], deg: 8, hz: 2.4 }
  },
  'list-video': {
    label: '视频列表', key: 'square',
    light: ['tri'],
    plan: '主体：三行线（下两行短，让出右边的播放三角）；辅助：播放三角（实心，太小画不出线框）',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) {
      return [
        line(g.span(3, 4, 21, 4), { n: 'l0', role: P }),
        line(g.span(3, 12, 12, 12), { n: 'l1', role: P }),
        line(g.span(3, 20, 12, 20), { n: 'l2', role: P }),
        solid(g.polygon([[15, 12], [21, 16], [15, 20]], [0.9, 0.9, 0.9]), { n: 'tri', role: S })
      ];
    },
    fx: { t: 'keys', on: ['tri'], x: [0.8], ms: 320 }
  },
  'video-library': {
    label: '视频库', key: 'square',
    plan: '主体：前面的封套（与专辑相同）；辅助：后面一张（只露出上沿一条线）；细节：封套里的播放三角（实心，按重心居中，离封套内沿留 1.5，约占一成多）',
    weights: { [P]: 0.71, [S]: 0.16, [D]: 0.13 },
    draw(g) {
      const A = 7 - g.s - g.clear, W = A / 0.615, x0 = Math.round(12 - W / 3), cy = 14;
      return [
        line(g.span(6, 4, 18, 4), { n: 'back', role: S }),
        shell(g.box(3, 7, 18, 14, 4), { n: 'sleeve', role: P }),
        solid(g.polygon([[x0, cy - A], [x0 + W, cy], [x0, cy + A]], [0.9, 0.9, 0.9]), { n: 'tri', role: D, on: 'sleeve' })
      ];
    },
    fx: [{ t: 'keys', on: ['back'], y: [-1], ms: 260 }, { t: 'keys', on: ['tri'], x: [0.8], ms: 320 }]
  },
  'audio-waveform': {
    label: '声波', key: 'square',
    plan: '主体：一条上下起伏的声波线（转角圆角 2）',
    weights: { [P]: 1 },
    draw(g) { return [line(rpl([[4, 13], [4, 8], [8, 8], [8, 20], [12, 20], [12, 4], [16, 4], [16, 17], [20, 17], [20, 11]], 2), { n: 'wave', role: P })]; },
    fx: { t: 'keys', on: 'all', o: [12, 12], sy: [0.7, 1.06], ms: 420 }
  },
  'live-photo': {
    label: '实况照片', key: 'circle',
    plan: '主体：中间的圆环；辅助：外面一圈圆环；细节：最外一圈 12 个小点（实心）。外圈最长，占一半多',
    weights: { [P]: 0.22, [S]: 0.56, [D]: 0.22 },
    draw(g) {
      const dots = Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return g.dot(12 + 9.4 * Math.cos(a), 12 + 9.4 * Math.sin(a), 0.55); }).join('');
      return [line(g.ring(12, 12, 3 - (g.s - 2) * 0.5), { n: 'core', role: P }), line(g.ring(12, 12, 6.5), { n: 'ring', role: S }), solid(dots, { n: 'dots', role: D })];
    },
    // 实况: the ring of dots turns one step, landing on itself
    fx: { t: 'rotate', on: ['dots'], deg: 30, o: [12, 12] }
  },
  panorama: {
    label: '全景照片', key: 'landscape', fit: 'x',
    ends: 'in',
    plan: '主体：全景画框（上下两边向里弯）；细节：框里的山峦（一条折线）',
    weights: { [P]: 0.75, [D]: 0.25 },
    draw(g) {
      const { s, h } = g, w = 20 - s, R = ((w / 2) ** 2 + 1.5 ** 2) / 3, a = 2 + h, b = 22 - h;
      return [
        shell(`M${n(a)} ${n(4 + h)}A${n(R)} ${n(R)} 0 0 0 ${n(b)} ${n(4 + h)}V${n(20 - h)}A${n(R)} ${n(R)} 0 0 0 ${n(a)} ${n(20 - h)}Z`, { n: 'frame', role: P }),
        // the hills flatten a little at heavy strokes, keeping clear of the curved edges
        line(g.pl([[7, 14], [10, 10.5], [13, 13.5], [15, 11.5], [17, 14]].map(([x, y]) => [x, 12.25 + (y - 12.25) * (1 - Math.max(0, s - 2) * 0.5)])), { n: 'hills', role: D, on: 'frame' })
      ];
    },
    // 全景: the view pans across
    fx: { t: 'keys', on: ['hills'], x: [-1, 1, 0], ms: 700 }
  },
  slideshow: {
    label: '幻灯片', key: 'landscape',
    plan: '主体：画框；细节：框里的播放三角（实心，按重心居中）和下方三个页码点（实心）',
    weights: { [P]: 0.81, [D]: 0.19 },
    draw(g) {
      const A = (13 - 2 * g.s - 2 * g.clear) / 2, W = A / 0.615, x0 = Math.round(12 - W / 3), cy = 10.5;
      return [
        shell(g.box(2, 4, 20, 13, 3.5), { n: 'frame', role: P }),
        solid(g.polygon([[x0, cy - A], [x0 + W, cy], [x0, cy + A]], [0.9, 0.9, 0.9]), { n: 'tri', role: D, on: 'frame' }),
        ...[8, 12, 16].map((x, i) => solid(g.dot(x, 20.5, 0.7), { n: `d${i}`, role: D, vc: i }))
      ];
    },
    allow: { keyline: '页码点在画框下方，伸出横向参考线 1.5' },
    // 播放幻灯片: the page dots light in turn
    fx: { t: 'variable', on: ['d0', 'd1', 'd2'], mode: 'iterative' }
  },
  airplay: {
    label: '无线投放', key: 'landscape', fit: 'x',
    light: ['tri'],
    plan: '主体：屏幕（下沿中间断开）；辅助：下方的三角（关键部件，伸进屏幕的缺口）',
    weights: { [P]: 0.7, [S]: 0.3 },
    draw(g) {
      const { h } = g, c = 3 - h, b = 17 - h;
      return [
        line(`M5.5 ${n(b)}H${n(2 + h + c)}A${n(c)} ${n(c)} 0 0 1 ${n(2 + h)} ${n(b - c)}V${n(4 + h + c)}A${n(c)} ${n(c)} 0 0 1 ${n(2 + h + c)} ${n(4 + h)}H${n(22 - h - c)}A${n(c)} ${n(c)} 0 0 1 ${n(22 - h)} ${n(4 + h + c)}V${n(b - c)}A${n(c)} ${n(c)} 0 0 1 ${n(22 - h - c)} ${n(b)}H18.5`, { n: 'screen', role: P }),
        shell(g.polygon([[12, 14], [17, 21 - h], [7, 21 - h]], [1.2, 1.2, 1.2]), { n: 'tri', role: S })
      ];
    },
    area: (g) => [{ n: 'screen', d: g.rr(2 + g.h, 4 + g.h, 20 - g.s, 13 - g.s, 3 - g.h) }],
    fx: { t: 'keys', on: ['tri'], y: [-1], ms: 300 }
  },
  'airplay-audio': {
    label: '无线投放音频', key: 'live',
    light: ['tri'],
    plan: '主体：两道同心圆弧（下方断开，像向外传出的声波）；辅助：下方的三角（关键部件，伸进圆弧的缺口）',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const { h } = g;
      return [
        line(g.arc(12, 12, 4, 150, 390), { n: 'a1', role: P, vc: 0 }),
        line(g.arc(12, 12, 10 - h, 135, 405), { n: 'a2', role: P, vc: 1 }),
        shell(g.polygon([[12, 16], [15.5, 22 - h], [8.5, 22 - h]], [1.2, 1.2, 1.2]), { n: 'tri', role: S })
      ];
    },
    fx: { t: 'variable', on: ['a1', 'a2'], mode: 'cumulative' }
  },
  'screen-share': {
    anchor: 'base',
    label: '共享屏幕', key: 'landscape', fit: 'x',
    light: ['arrow'],
    plan: '主体：屏幕（右上角断开）和支架（与显示器相同）；辅助：从缺口指向右上的箭头（关键部件）',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      return [...openScreen(g), line(g.seg(15, 10, 21, 4) + g.pl([[17, 4], [21, 4], [21, 8]]), { n: 'arrow', role: S })];
    },
    area: (g) => [{ n: 'screen', d: g.rr(2 + g.h, 3 + g.h, 20 - g.s, 13 - g.s, SCR - g.h) }],
    fx: { t: 'keys', on: ['arrow'], x: [0.8], y: [-0.8], ms: 320 }
  },
  'screen-share-off': {
    anchor: 'base',
    label: '停止共享屏幕', key: 'landscape', fit: 'x',
    light: ['mark'],
    plan: '主体：屏幕（右上角断开）和支架（与共享屏幕相同）；辅助：缺口处的叉号（关键部件）',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) { return [...openScreen(g), line(g.seg(16.5, 3.5, 21, 8) + g.seg(21, 3.5, 16.5, 8), { n: 'mark', role: S })]; },
    area: (g) => [{ n: 'screen', d: g.rr(2 + g.h, 3 + g.h, 20 - g.s, 13 - g.s, SCR - g.h) }],
    fx: { t: 'rotate', on: ['mark'], deg: 90, o: [18.75, 5.75] }
  },
};

// Copies of icons.mjs bases (play, pause, camera, image) for the rule-made variants below: the
// category files are loaded before icons.mjs, so they cannot take its icons.
const BASE = {
  play: {
    label: '播放', key: 'square', weights: { [P]: 1 },
    draw(g) { const { h } = g; return [shell(g.polygon([[5 + h, 1.4 + h], [22.6 - h, 12], [5 + h, 22.6 - h]], [2.5, 2.5, 2.5]), { n: 'tri', role: P })]; }
  },
  pause: {
    label: '暂停', key: 'square', weights: { [P]: 1 },
    // inside a circle or square the bars are too small to stay open as outlines: solid, as in SF Symbols
    draw(g) { const w = 4 + (g.s - 2) * 0.6; return [solid(g.area(10 - w, 3, w, 18, w / 2), { n: 'p1', role: P }), solid(g.area(14, 3, w, 18, w / 2), { n: 'p2', role: P })]; }
  },
  camera: {
    label: '相机', key: 'landscape', weights: { [P]: 0.77, [S]: 0.23 },
    allow: { keyline: '顶部凸起高出横向参考线 1，给镜头留出位置' },
    draw(g, ctx) {
      const { h, s } = g, top = 3 + h, by = 6 + h, R0 = 3.5 - (s - 2) * 0.5, R = ctx?.variant === 'fill' ? Math.max(R0, 1.5 * s) : R0, cy = (6 + 20) / 2;
      return [
        shell(g.polygon([[2 + h, by], [6.6, by], [7.9, top], [16.1, top], [17.4, by], [22 - h, by], [22 - h, 20 - h], [2 + h, 20 - h]], [3.5 - h, 0.75, 1.3, 1.3, 0.75, 3.5 - h, 3.5 - h, 3.5 - h]), { n: 'body', role: P }),
        line(g.ring(12, cy, R), { n: 'lens', role: S, on: 'body' })
      ];
    }
  },
  image: {
    label: '图片', key: 'landscape', ends: 'in', weights: { [P]: 0.7, [S]: 0.23, [D]: 0.07 },
    draw(g) {
      const k = 1.05 - (g.s - 2) * 0.3, o = 2 + g.s + 2.4 + g.dr * k;
      return [shell(g.box(2, 4, 20, 16, 4), { n: 'frame', role: P }), line(hill(g), { n: 'hill', role: S, on: 'frame' }), solid(g.dot(o, 4 + g.s + 2.4 + g.dr * k, k), { n: 'sun', role: D, on: 'frame' })];
    }
  }
};

// Variants made by rule (kit.mjs) of the icons above.
// image with a badge, fill: the hill's clear band would cross the notch's at a shallow angle and
// leave a wedge, so the fill keeps the frame and the sun only.
const noHill = (L) => L.filter((l) => l.n !== 'hill');
const named = (k) => ({ ...(icons[k] ?? BASE[k]), name: k });
const SLASH_CUT = { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' };

export default {
  ...icons,
  'circle-pause': { ...enclose(named('pause'), 'circle', { label: '暂停（圆形）', k: 0.5 }), fx: { t: 'keys', on: ['p1', 'p2'], by: true, sy: [0.8], o: [12, 12], ms: 420 } },
  'circle-stop': { ...enclose(named('stop'), 'circle', { label: '停止（圆形）', k: 0.5 }), fx: { t: 'keys', on: ['sq'], o: [12, 12], s: [0.84], ms: 240 } },
  'circle-fast-forward': { ...enclose(named('fast-forward'), 'circle', { label: '快进（圆形）', k: 0.5 }), fx: { t: 'keys', on: [['t2'], ['t1']], by: true, x: [0.9], stagger: 70, ms: 360 } },
  'circle-rewind': { ...enclose(named('rewind'), 'circle', { label: '快退（圆形）', k: 0.5 }), fx: { t: 'keys', on: [['t2'], ['t1']], by: true, x: [-0.9], stagger: 70, ms: 360 } },
  'square-play': { ...enclose(named('play'), 'square', { label: '播放（方形）', k: 0.5 }), fx: { t: 'keys', on: ['tri'], x: [0.9], ms: 420 } },
  'music-off': off({ ...slash(named('music'), { label: '音乐关闭' }), allow: { ...SLASH_CUT, keyline: '音乐整体左移 1，斜线仍按方形参考线画' } }, 'music', { t: 'keys', on: ['stems', 'h1', 'h2'], o: [11, 21], s: [0.9], ms: 240 }),
  'headphones-off': off({ ...slash(named('headphones'), { label: '耳机关闭' }), allow: SLASH_CUT }, 'headphones', { t: 'keys', on: ['band', 'c1', 'c2'], o: [12, 14], s: [0.92], ms: 240 }),
  'video-off': off({ ...slash(named('video'), { label: '关闭摄像' }), allow: { ...SLASH_CUT, clear: '镜头在斜线左下一侧，这一侧斜线按规则与物体相连，细字重下贴近镜头的一角' } }, 'video', { t: 'keys', on: ['lens'], o: [19, 12], s: [0.8], ms: 240 }),
  'square-pause': { ...enclose(named('pause'), 'square', { label: '暂停（方形）', k: 0.5 }), fx: { t: 'keys', on: ['p1', 'p2'], by: true, sy: [0.8], o: [12, 12], ms: 420 } },
  'camera-off': off({ ...slash(named('camera'), { label: '关闭相机' }), allow: { ...SLASH_CUT, keyline: '顶部凸起高出横向参考线 1，给镜头留出位置' } }, 'camera', { t: 'keys', on: ['lens'], o: [12, 13], s: [0.55], ms: 260 }),
  'image-off': off({ ...slash(named('image'), { label: '无图片' }), allow: SLASH_CUT }, 'image', { t: 'keys', on: ['sun'], y: [3.2], a: [0], ms: 300 }),
  'image-plus': { ...notched(badge(named('image'), 'plus', { label: '添加图片' }), noHill), fx: { t: 'rotate', on: ['badge'], deg: 90, oBadge: true } },
  'image-minus': { ...notched(badge(named('image'), 'minus', { label: '移除图片' }), noHill), fx: { t: 'keys', on: ['badge'], o: [18, 16], sx: [0.6], ms: 300 } },
  'image-check': { ...notched(badge(named('image'), 'check', { label: '已选图片' }), noHill), fx: { t: 'draw', on: ['badge'] } },
  'image-up': { ...notched(arrowBadge(named('image'), true, '上传图片'), noHill), fx: { t: 'keys', on: ['badge'], y: [-1], ms: 300 } },
  'image-down': { ...notched(arrowBadge(named('image'), false, '下载图片'), noHill), fx: { t: 'keys', on: ['badge'], y: [1], ms: 300 } },
  'captions-off': off({ ...slash(named('subtitles'), { label: '关闭字幕' }), allow: SLASH_CUT }, 'subtitles', { t: 'keys', on: ['r1', 'r2'], a: [0.3], ms: 260 }),
};
