// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// sports: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: trophy medal target dumbbell dice soccer-ball basketball whistle
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

const set = {
  trophy: {
    anchor: 'base',
    label: '奖杯', key: 'square',
    plan: '主体：杯身（平口，底部半圆）；辅助：两侧把手、杯脚和底座',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g) {
      const { h } = g, cx = 12, cy = 7, rb = 6 - h, yh = 5, yl = 9;
      // a handle runs from the cup's straight side out and round to where the bowl curves in
      const xin = (y) => cx - Math.sqrt(rb * rb - Math.max(y - cy, 0) ** 2);
      const hr = (yl - yh) / 2, hx = 4 + hr;
      const handle = (sg) => {
        const X = (x) => n(sg < 0 ? x : 24 - x);
        return `M${X(xin(yh))} ${yh}H${X(hx)}A${n(hr)} ${n(hr)} 0 0 ${sg < 0 ? 0 : 1} ${X(hx)} ${yl}H${X(xin(yl))}`;
      };
      return [
        line(handle(-1) + handle(1), { n: 'handles', role: S }),
        line(g.seg(12, 13, 12, 21 - h) + g.span(7, 21 - h, 17, 21 - h), { n: 'stand', role: S }),
        shell(g.box(6, 3, 12, 10, [1.5, 1.5, 6, 6]), { n: 'cup', role: P })
      ];
    },
    // 夺冠: the trophy is lifted and tilted, then set back down
    fx: { t: 'keys', on: 'all', o: [12, 21], y: [-1.6, 0.2], r: [-6, 3] }
  },
  medal: {
    label: '奖牌', key: 'portrait', fit: 'y',
    plan: '主体：奖牌（圆环）；辅助：两条挂带；细节：中心小圆环（随字重缩小，粗字重下仍留间距）',
    weights: { [P]: 0.58, [S]: 0.2, [D]: 0.22 },
    draw(g) {
      const { h, s } = g, cy = 14.5, R = 7.5, rc = R - h, a = (-112 * Math.PI) / 180, ex = 12 + rc * Math.cos(a), ey = cy + rc * Math.sin(a);
      return [
        line(g.seg(6.5, 2 + h, ex, ey) + g.seg(17.5, 2 + h, 24 - ex, ey), { n: 'straps', role: S }),
        shell(g.ring(12, cy, R), { n: 'medal', role: P }),
        shell(g.ring(12, cy, 3.5 - (s - 2) * 0.5), { n: 'inner', role: D, on: 'medal' })
      ];
    },
    // 颁奖: the medal swings on its straps and settles
    fx: { t: 'wiggle', on: 'all', o: [12, 2], deg: 9, hz: 2 }
  },
  target: {
    label: '靶心', key: 'circle',
    plan: '主体：外圈；辅助：中圈；细节：靶心（实心圆点，随字重收拢）',
    weights: { [P]: 0.58, [S]: 0.32, [D]: 0.1 },
    draw(g) {
      const { s } = g;
      return [
        shell(g.ring(12, 12, 10), { n: 'outer', role: P }),
        shell(g.ring(12, 12, 6), { n: 'mid', role: S, on: 'outer' }),
        solid(g.dot(12, 12, 1.25 - (s - 2) * 0.5), { n: 'eye', role: D, on: 'mid' })
      ];
    },
    // 命中: the rings take the hit from the centre out
    fx: { t: 'keys', on: [['eye'], ['mid']], by: true, stagger: 60, o: [12, 12], s: [0.7, 1.08] }
  },
  dumbbell: {
    label: '哑铃', key: 'landscape', fit: 'x',
    plan: '主体：两片杠铃片（竖放的圆角矩形，随字重加宽，内部保持留空）；辅助：中间的握杆和两端的短杆。握杆只是一条线，占一成多',
    weights: { [P]: 0.85, [S]: 0.15 },
    draw(g) {
      const { s, h } = g, w = 1 + 2 * s, l = 7.5, r = 16.5, top = 5, ht = 14;
      return [
        line(g.seg(2 + h, 12, l - w / 2 + h, 12) + g.seg(l + w / 2 - h, 12, r - w / 2 + h, 12) + g.seg(r + w / 2 - h, 12, 22 - h, 12), { n: 'bar', role: S }),
        shell(g.box(l - w / 2, top, w, ht, 1.5 + h), { n: 'p1', role: P }),
        shell(g.box(r - w / 2, top, w, ht, 1.5 + h), { n: 'p2', role: P })
      ];
    },
    // 举起: lifted and set down
    fx: { t: 'keys', on: 'all', y: [-2, 0.3], ms: 320 }
  },
  dice: {
    label: '骰子', key: 'square',
    plan: '主体：骰子（方块，圆角与日历相同）；细节：五个点数（实心圆点，随字重缩小，离边保持间距）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) {
      const k = 1 - (g.s - 2) * 0.4, q = 8.5;
      const pips = [[q, q], [24 - q, q], [12, 12], [q, 24 - q], [24 - q, 24 - q]];
      return [shell(g.box(3, 3, 18, 18, 4.5), { n: 'die', role: P }), ...pips.map(([x, y], i) => solid(g.dot(x, y, k), { n: `p${i}`, role: D, on: 'die' }))];
    },
    // 掷骰子: it rolls a quarter turn and lands on a face again
    fx: [{ t: 'rotate', on: 'all', deg: 90, dip: 0.1 }, { t: 'keys', on: 'all', y: [-1.2, 0], ms: 300 }]
  },
  'soccer-ball': {
    label: '足球', key: 'circle',
    plan: '主体：球（圆）；辅助：中间的五边形和连到球边的五条缝线',
    weights: { [P]: 0.5, [S]: 0.5 },
    // the seams divide the ball: in the fill variant they cut through its edge
    ends: 'out',
    draw(g, ctx) {
      const { h } = g, rp = 4.5, cyp = 16 - rp * Math.cos(Math.PI / 5), rc = 10 - h, pts = [], seams = [];
      for (let i = 0; i < 5; i++) {
        const a = ((-90 + i * 72) * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a);
        pts.push([12 + rp * c, cyp + rp * sn]);
        seams.push(g.seg(12 + rp * c, cyp + rp * sn, 12 + rc * c, 12 + rc * sn));
      }
      return [
        shell(g.ring(12, 12, 10), { n: 'ball', role: P }),
        // filled, each seam is its own line, so its outer end can be carried out
        ...(ctx?.variant === 'fill' ? seams.map((d, i) => line(d, { n: i ? `seams${i}` : 'seams', role: S, on: 'ball' })) : [line(seams.join(''), { n: 'seams', role: S, on: 'ball' })]),
        shell(g.polygon(pts, 0.6), { n: 'patch', role: S, on: 'ball' })
      ];
    },
    // 滚动: the ball turns a fifth of a turn, landing on its own pattern
    fx: { t: 'rotate', on: 'all', deg: 72, o: [12, 12] }
  },
  basketball: {
    label: '篮球', key: 'circle',
    plan: '主体：球（圆）；辅助：横竖两条缝线和左右两条弧形缝线（弧顶离竖线 2）。缝线有四条，墨量比外圈多，层级仍在外圈之后',
    weights: { [P]: 0.4, [S]: 0.6 },
    // the seams divide the ball: in the fill variant they cut through its edge
    ends: 'out',
    draw(g, ctx) {
      const { h } = g, fill = ctx?.variant === 'fill', heavy = fill && g.s > 2, rc = 10 - h;
      // a side seam: an arc through (8, 12) meeting the ball's centre line at ±130°. Filled, it
      // meets the ball at ±135° (138° at heavy weights), so it cuts the edge near square and
      // the ink beside it keeps no thin tip. At heavy weights it moves out by d (its ends along
      // the ball with it), so a stroke of ink stays between it and the middle seam
      const t = ((heavy ? 138 : fill ? 135 : 130) * Math.PI) / 180, d = fill ? Math.max(0, 2 * g.s - 4) : 0;
      const ex = 12 + rc * Math.cos(t) - d, ey = Math.sqrt(rc * rc - (ex - 12) ** 2), ap = 8 - d;
      const c = (ap * ap - ex * ex - ey * ey) / (2 * (ap - ex)), rr = ap - c;
      const side = (sg) => {
        const X = (x) => n(sg < 0 ? x : 24 - x);
        return `M${X(ex)} ${n(12 - ey)}A${n(rr)} ${n(rr)} 0 0 ${sg < 0 ? 1 : 0} ${X(ex)} ${n(12 + ey)}`;
      };
      // at heavy weights the side pieces are too small to split: the middle seam stops at the
      // side seams
      const hx = heavy ? ap : 2 + h;
      const seams = [g.seg(12, 2 + h, 12, 22 - h), g.seg(hx, 12, 24 - hx, 12), side(-1), side(1)];
      const ball = shell(g.ring(12, 12, 10), { n: 'ball', role: P });
      if (!fill) return [ball, line(seams.join(''), { n: 'seams', role: S, on: 'ball' })];
      // filled, each seam is its own line, so both its ends can be carried out
      return [ball, ...seams.map((d, i) => line(d, { n: i ? `seams${i}` : 'seams', role: S, on: 'ball', ...(i === 1 && heavy ? { ends: 'keep' } : {}) }))];
    },
    // 运球: the ball is pushed down and springs back up
    fx: { t: 'bounce', on: 'all', o: [12, 22], amp: 1.2, dir: 'down' }
  },
  whistle: {
    label: '口哨', key: 'landscape', fit: 'x',
    plan: '主体：哨身（圆形的哨腔和向右伸出的吹口，一个闭合形）；细节：哨腔里的小圆环',
    weights: { [P]: 0.82, [D]: 0.18 },
    draw(g) {
      const { h } = g, R = 7, cx = 9, cy = 12, r = R - h, T = cy - r, B = 11 - h, X = 22 - h, c = Math.max(2 - h, 0.5);
      const xi = cx + Math.sqrt(r * r - (B - cy) ** 2);
      return [
        shell(`M${cx} ${n(T)}H${n(X - c)}A${n(c)} ${n(c)} 0 0 1 ${n(X)} ${n(T + c)}V${n(B - c)}A${n(c)} ${n(c)} 0 0 1 ${n(X - c)} ${n(B)}H${n(xi)}A${n(r)} ${n(r)} 0 1 1 ${cx} ${n(T)}Z`, { n: 'body', role: P }),
        shell(g.ring(cx, cy, 3), { n: 'pea', role: D, on: 'body' }),
        line(g.span(15, 1.25, 16, 3.25) + g.span(19, 1, 19, 3.25) + g.span(23, 1.25, 22, 3.25), { n: 'sound', role: S, ghost: true })
      ];
    },
    // 吹哨: it shakes as it is blown and sound lines come out of the mouth
    fx: [{ t: 'shake', on: ['body', 'pea'], x: 0.6, ms: 520 }, { t: 'keys', on: ['sound'], ghost: true, a: [1, 1, 1], ms: 420 }]
  }
};

// --- Balls, gear and fitness ------------------------------------------------------------------

// A seam across a ball: an arc of radius R about (cx, 12) between the points where it meets the
// ball's centre line (radius 10 outer); sg -1 for the left one, +1 for its mirror.
function sideSeam(g, cx, R, sg) {
  const r = 10 - g.h, x = (R * R - r * r - cx * cx + 144) / (2 * (12 - cx)), dy = Math.sqrt(r * r - (x - 12) ** 2);
  const X = (v) => n(sg < 0 ? v : 24 - v);
  return `M${X(x)} ${n(12 - dy)}A${n(R)} ${n(R)} 0 0 ${sg < 0 ? 1 : 0} ${X(x)} ${n(12 + dy)}`;
}
// A ball with seams: one line per seam in the fill variant, so both ends can be carried out.
const ballSeams = (g, ctx, seams, role = S) => (ctx?.variant === 'fill'
  ? seams.map((d, i) => line(d, { n: i ? `seams${i}` : 'seams', role, on: 'ball' }))
  : [line(seams.join(''), { n: 'seams', role, on: 'ball' })]);

Object.assign(set, {
  'tennis-ball': {
    label: '网球', key: 'circle',
    ends: 'out',
    plan: '主体：球（圆）；辅助：左右两条弧形缝线（面性中切开球面）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g, ctx) {
      return [shell(g.ring(12, 12, 10), { n: 'ball', role: P }), ...ballSeams(g, ctx, [sideSeam(g, -1, 9.5, -1), sideSeam(g, -1, 9.5, 1)])];
    },
    // 击球: the ball is hit, squashes and springs back
    fx: { t: 'bounce', on: 'all', o: [12, 22], amp: 1.2 }
  },
  baseball: {
    label: '棒球', key: 'circle',
    ends: 'out',
    plan: '主体：球（圆）；辅助：左右两条弧形缝线；细节：缝线上的针脚（短线；面性中不画，镂空放不下）',
    weights: { [P]: 0.59, [S]: 0.21, [D]: 0.2 },
    draw(g, ctx) {
      const stitch = (sg) => [-4, 0, 4].map((dy) => { const y = 12 + dy, x = -1 + Math.sqrt(9.5 ** 2 - dy * dy), X = (v) => (sg < 0 ? v : 24 - v); return g.seg(X(x - 1.25), y, X(x + 1.25), y); }).join('');
      return [
        shell(g.ring(12, 12, 10), { n: 'ball', role: P }),
        ...ballSeams(g, ctx, [sideSeam(g, -1, 9.5, -1), sideSeam(g, -1, 9.5, 1)]),
        line(stitch(-1) + stitch(1), { n: 'stitches', role: D, on: 'ball', only: 'outline' })
      ];
    },
    // 投球: the ball spins as it is pitched
    fx: { t: 'rotate', on: 'all', o: [12, 12], deg: 180 }
  },
  volleyball: {
    label: '排球', key: 'circle',
    allow: { sliver: '缝线以斜角切过球的边缘，切口两侧是斜角；不是夹出来的碎块' },
    ends: 'out',
    plan: '主体：球（圆）；辅助：从中心旋出的三条弧形缝线（面性中把球面分成三块）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g, ctx) {
      const r = 10 - g.h, q = 12, seam = (d) => { const a = (d * Math.PI) / 180; return `M12 12A${q} ${q} 0 0 1 ${n(12 + r * Math.cos(a))} ${n(12 + r * Math.sin(a))}`; };
      return [shell(g.ring(12, 12, 10), { n: 'ball', role: P }), ...ballSeams(g, ctx, [seam(-90), seam(30), seam(150)])];
    },
    // 垫球: the ball turns a third of a turn, landing on its own pattern
    fx: { t: 'rotate', on: 'all', o: [12, 12], deg: 120 }
  },
  'american-football': {
    label: '橄榄球', key: 'live',
    plan: '主体：橄榄形的球（两段圆弧围成，斜放）；细节：中间的缝线和两道横向针脚',
    weights: { [P]: 0.78, [D]: 0.22 },
    draw(g) {
      const { h } = g, a = 2.5 + h * 0.7, b = 21.5 - h * 0.7, R = 14.5, k = Math.SQRT1_2 * 1.4;
      return [
        shell(`M${n(a)} ${n(b)}A${n(R)} ${n(R)} 0 0 1 ${n(b)} ${n(a)}A${n(R)} ${n(R)} 0 0 1 ${n(a)} ${n(b)}Z`, { n: 'ball', role: P }),
        line(g.seg(9, 15, 15, 9) + g.seg(10.5 - k, 13.5 - k, 10.5 + k, 13.5 + k) + g.seg(13.5 - k, 10.5 - k, 13.5 + k, 10.5 + k), { n: 'laces', role: D, on: 'ball' })
      ];
    },
    // 传球: the ball spirals as it is thrown
    fx: { t: 'keys', on: 'all', o: [12, 12], r: [-6, 2], x: [0.6, -0.15], y: [-0.6, 0.15], ms: 360 }
  },
  'ping-pong': {
    label: '乒乓球', key: 'live', fit: 'y',
    plan: '主体：球拍拍面（圆）；辅助：竖直的拍柄（实心，与拍面相连）；细节：右下的乒乓球（实心圆点）',
    weights: { [P]: 0.7, [S]: 0.18, [D]: 0.12 },
    draw(g) {
      return [
        solid(g.area(10, 16, 4, 6, [0, 0, 1.5, 1.5]), { n: 'handle', role: S, part: 'paddle' }),
        shell(g.ring(12, 10, 8), { n: 'paddle', role: P, part: 'paddle' }),
        solid(g.dot(20, 19.5, 1.1), { n: 'ball', role: D })
      ];
    },
    light: ['ball'],
    // 发球: the paddle swings and the ball flies off
    fx: [{ t: 'keys', on: ['paddle', 'handle'], o: [12, 22], r: [-12, 3], ms: 320 }, { t: 'keys', on: ['ball'], x: [0.8, 0], y: [-0.8, 0], ms: 320 }]
  },
  badminton: {
    label: '羽毛球', key: 'portrait', fit: 'y',
    ends: 'out',
    plan: '主体：羽毛裙（上宽下窄的梯形）；辅助：下面的半圆球托（与羽毛裙共用一条边）；细节：两道羽毛骨（面性中不画：窄的羽毛裙里放不下两道镂空）',
    weights: { [P]: 0.48, [S]: 0.16, [D]: 0.36 },
    draw(g) {
      const { h } = g, y = 15, t = 2 + h;
      return [
        shell(`M8 ${y}H16A4 4 0 0 1 8 ${y}Z`.replace('A4 4', `A${n(4)} ${n(4)}`), { n: 'cork', role: S, part: 'shuttle' }),
        shell(g.polygon([[8.5, y], [15.5, y], [19.5 - h, t], [4.5 + h, t]], [0.5, 0.5, 1, 1]), { n: 'skirt', role: P, part: 'shuttle' }),
        line(g.seg(10.5, y, 9.5, t) + g.seg(13.5, y, 14.5, t), { n: 'ribs', role: D, on: 'skirt', only: 'outline' })
      ];
    },
    allow: { keyline: '球托下沿在纵向参考线以内 1', optical: '羽毛裙上宽下窄，分量在上，按外框定位' },
    // 发球: the shuttle flips over and settles
    fx: { t: 'keys', on: 'all', o: [12, 17], r: [-14, 4], ms: 360 }
  },
  bowling: {
    label: '保龄球', key: 'circle',
    plan: '主体：球（圆）；细节：三个指孔（实心圆点，随字重缩小）',
    weights: { [P]: 0.84, [D]: 0.16 },
    draw(g) {
      const k = 0.7 - Math.max(0, g.s - 2) * 0.4;
      return [
        shell(g.ring(12, 12, 10), { n: 'ball', role: P }),
        solid(g.dot(11.5, 8, k) + g.dot(15.5, 9, k) + g.dot(13, 12, k), { n: 'holes', role: D, on: 'ball' })
      ];
    },
    // 出球: the ball rolls forward a quarter turn
    fx: [{ t: 'rotate', on: ['holes'], o: [12, 12], deg: 90 }, { t: 'keys', on: 'all', x: [1, -0.2], ms: 400 }]
  },
  'boxing-glove': {
    label: '拳击手套', key: 'portrait',
    plan: '主体：拳套（上圆下方）；辅助：左侧的拇指（弧线）和下面的护腕（与拳套隔开）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      return [
        line('M7 9A2 2 0 0 0 7 13', { n: 'thumb', role: S }),
        shell(g.box(6, 2, 14, 13, [6, 6, 4, 3]), { n: 'fist', role: P }),
        shell(g.box(8, 17, 10, 5, 1.5), { n: 'cuff', role: S })
      ];
    },
    // 出拳: a quick jab forward and back
    fx: { t: 'keys', on: 'all', y: [-1.5, 0.4], s: [1.05, 1], o: [12, 12], ms: 260 }
  },
  'golf-flag': {
    anchor: 'base',
    label: '高尔夫', key: 'square',
    plan: '主体：三角旗面；辅助：旗杆和地面上的球洞（椭圆）。球洞的椭圆横贯，墨量超过旗面',
    weights: { [P]: 0.32, [S]: 0.68 },
    draw(g) {
      const { h } = g, rx = 9 - h, ry = 2.5 - h, cy = 18.5;
      return [
        shell(`M${n(12 - rx)} ${cy}A${n(rx)} ${n(ry)} 0 1 0 ${n(12 + rx)} ${cy}A${n(rx)} ${n(ry)} 0 1 0 ${n(12 - rx)} ${cy}Z`, { n: 'hole', role: S }),
        line(g.seg(11, 3 + h, 11, 16 + h), { n: 'pole', role: S }),
        shell(g.polygon([[11, 3 + h], [20 - h, 6.5], [11, 10]], [0.5, 1.2, 0.5]), { n: 'flag', role: P })
      ];
    },
    // 进洞: the flag flutters
    fx: { t: 'keys', on: ['flag'], o: [11, 6.5], sx: [0.84, 1.05, 0.96] }
  },
  skateboard: {
    label: '滑板', key: 'landscape', fit: 'x',
    plan: '主体：板面（两头上翘，一笔线条）；辅助：两个轮子（圆环）',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g, y = 11;
      return [
        line(`M${n(2 + h)} 7.5Q3 ${y} 6 ${y}H18Q21 ${y} ${n(22 - h)} 7.5`, { n: 'deck', role: P }),
        shell(g.ring(7, 16, 2.5) + g.ring(17, 16, 2.5), { n: 'wheels', role: S })
      ];
    },
    // 滑行: the board rolls forward and pops its tail
    fx: { t: 'keys', on: 'all', o: [17, 19], x: [1, -0.2], r: [-6, 1], ms: 360 }
  },
  kettlebell: {
    anchor: 'base',
    label: '壶铃', key: 'portrait',
    plan: '主体：铃身（圆鼓，平底）；辅助：顶上的提手',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      const { h } = g, R = 7 - h, yl = 15 - Math.sqrt(R * R - 9);
      return [
        line(arch(8, 16, 2 + h, yl), { n: 'handle', role: S }),
        shell(g.box(4, 8, 16, 14, [7, 7, 4, 4]), { n: 'bell', role: P })
      ];
    },
    // 举起: the kettlebell is swung up and back
    fx: { t: 'keys', on: 'all', o: [12, 2], r: [-12, 3], ms: 380 }
  },
  podium: {
    anchor: 'base',
    label: '领奖台', key: 'landscape',
    plan: '主体：三级台阶的外形（中间最高、左边次之、右边最低，一个闭合形）；细节：两条分隔线（面性中三级台阶是隔开的三块）',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g, ctx) {
      const { h } = g, b = 20 - h, l = 2 + h, r = 22 - h;
      if (ctx?.variant === 'fill') {
        // three blocks a stroke apart: a cut down from a step's corner would leave a thin wedge
        const blk = (x0, x1, y0, c) => g.box(x0, y0, x1 - x0, 20 - y0, c);
        return [shell(blk(2, 8 - h, 10, [1.5, 0.5, 0.5, 1.5]) + blk(8 + h, 16 - h, 4, 1) + blk(16 + h, 22, 13, [0.5, 1.5, 1.5, 0.5]), { n: 'steps', role: P })];
      }
      const pts = [[l, 11], [8, 11], [8, 4 + h], [16, 4 + h], [16, 14], [r, 14], [r, b], [l, b]];
      return [
        shell(g.polygon(pts, [1, 0, 1, 1, 0, 1, 1.5, 1.5]), { n: 'steps', role: P }),
        line(g.seg(8, 11, 8, b) + g.seg(16, 14, 16, b), { n: 'dividers', role: D, on: 'steps' })
      ];
    },
    // 颁奖: the top step rises
    fx: { t: 'keys', on: 'all', o: [12, 20], sy: [1.06, 0.98], ms: 320 }
  },
  dartboard: {
    label: '飞镖靶', key: 'live',
    plan: '主体：靶面（圆环）；辅助：内圈和从右上插进靶心的飞镖（压在靶面前面，留出间隙）；细节：靶心（实心圆点，大半被飞镖挡住）',
    weights: { [P]: 0.58, [S]: 0.4, [D]: 0.02 },
    draw(g, ctx) {
      const { h } = g, c = [11, 13];
      return [
        (ctx?.variant === 'fill' ? line : shell)(g.ring(...c, 9), { n: 'board', role: P }),
        shell(g.ring(...c, 4.5), { n: 'inner', role: S }),
        solid(g.dot(...c, 0.9), { n: 'eye', role: D }),
        line(g.seg(12, 12, 20, 4) + g.seg(20, 4, 20, 2 + h) + g.seg(20, 4, 22 - h, 4), { n: 'dart', role: S, gap: true })
      ];
    },
    light: ['dart'],
    allow: { sliver: '飞镖从靶面前面经过，间隙切开靶圈，与线性变体相同；不是镂空留下的碎块' },
    // 命中: the dart flies in and sticks
    fx: { t: 'from', on: ['dart'], x: 1.2, y: -1.2, hz: 2 }
  },
  'jump-rope': {
    anchor: 'base',
    label: '跳绳', key: 'portrait', fit: 'y',
    plan: '主体：绳子（拱形，两端接到手柄顶上）；辅助：两个手柄（圆角竖条）',
    weights: { [P]: 0.56, [S]: 0.44 },
    draw(g) {
      const { h } = g;
      return [
        line(arch(5, 19, 2 + h, 14 + h), { n: 'rope', role: P }),
        shell(g.box(3, 14, 4, 8, 2) + g.box(17, 14, 4, 8, 2), { n: 'handles', role: S })
      ];
    },
    allow: { keyline: '两个手柄在两侧，比纵向参考线各宽出 1' },
    // 跳绳: the rope swings over
    fx: { t: 'keys', on: ['rope'], o: [12, 15], sy: [-0.6, 1], ms: 420 }
  },
  'running-shoe': {
    label: '跑鞋', key: 'landscape', fit: 'x',
    anchor: 'base',
    allow: { optical: '鞋跟高、鞋头低，分量在左边的鞋跟，按外框定位' },
    plan: '主体：鞋身（鞋跟高、鞋头低，一个闭合形）；细节：鞋底线（面性中从鞋跟切开，在鞋头前停住，粗字重下上移，留出鞋底的宽度）',
    weights: { [P]: 0.71, [D]: 0.29 },
    draw(g, ctx) {
      const { h } = g, t = 5 + h, b = 19 - h, l = 2 + h, r = 22 - h, fill = ctx?.variant === 'fill', y = fill ? 16 - Math.max(0, g.s - 2) : 16, c = fill ? 0.5 : 1.5;
      return [
        shell(g.polygon([[l, t], [8, t], [10, 10], [15, 11], [r, 14], [r, b], [l, b]], [1.5, 1, 1, 1, 3, c, c]), { n: 'shoe', role: P }),
        line(fill ? g.seg(l - g.s, y, 18, y) : g.seg(l, y, r, y), { n: 'sole', role: D, on: 'shoe', ends: 'keep' })
      ];
    },
    // 跑步: the shoe kicks off and lands
    fx: { t: 'keys', on: 'all', o: [20, 19], r: [-10, 2], ms: 340 }
  }
});

export default set;
