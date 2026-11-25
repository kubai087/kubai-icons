// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// sports: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: trophy medal target dumbbell dice soccer-ball basketball whistle
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

export default {
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
