// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// home: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: building building-office factory hospital school door bed sofa lamp lightbulb fan thermostat socket plant bath shower window-frame candle warehouse
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { clearOf } from '../kit.mjs';

// Buildings stand on one ground line, x 3..21 at the bottom of the square (as home's walls end
// there). Their walls rise from it with the same top corners as home's body (outer 3.5).
const ground = (g) => line(g.span(3, 21 - g.h, 21, 21 - g.h), { n: 'ground', role: S });
const CORNER = 3.5;
// A block by its outer edge x0..x1 from top down to the ground: open at the bottom (outline).
const block = (g, x0, x1, top) => {
  const { h } = g, a = x0 + h, b = x1 - h, t = top + h, c = CORNER - h, yb = 21 - h;
  return `M${n(a)} ${n(yb)}V${n(t + c)}A${n(c)} ${n(c)} 0 0 1 ${n(a + c)} ${n(t)}H${n(b - c)}A${n(c)} ${n(c)} 0 0 1 ${n(b)} ${n(t + c)}V${n(yb)}`;
};
// The same block closed, for the fill variant.
const blockFill = (g, x0, x1, top) => { const { h } = g, c = CORNER - h; return g.rr(x0 + h, top + h, x1 - x0 - g.s, 21 - h - top - h, [c, c, 0, 0]); };
// A small arched door standing on the ground, x 10..14, top at 15 (outline) / its hole (fill).
const door = (g, host) => [
  line(`M10 ${n(21 - g.h)}V18A2 2 0 0 1 14 18V${n(21 - g.h)}`, { n: 'door', role: D, on: host, only: 'outline' }),
  solid(`M9 21V18A3 3 0 0 1 15 18V21Z`, { n: 'door', role: D, on: host, only: 'fill' })
];
// Window dots: the size of calendar's dates.
const winR = (g) => Math.min(g.dr * 0.7, 1.15);
// A leaf or blade: two arcs of radius rho between A and B (centre line).
const lens = (A, B, rho) => `M${n(A[0])} ${n(A[1])}A${n(rho)} ${n(rho)} 0 0 1 ${n(B[0])} ${n(B[1])}A${n(rho)} ${n(rho)} 0 0 1 ${n(A[0])} ${n(A[1])}Z`;
const lensBy = (A, B, sag) => { const L = Math.hypot(B[0] - A[0], B[1] - A[1]); return lens(A, B, (L * L / 4 + sag * sag) / (2 * sag)); };

export default {
  building: {
    anchor: 'base',
    label: '楼房', key: 'square',
    plan: '主体：楼身（立在地面上，顶角与首页的房身相同）；辅助：地面线；细节：两排窗（圆点）和门',
    weights: { [P]: 0.55, [S]: 0.2, [D]: 0.25 },
    draw(g) {
      const r = winR(g), dots = [];
      const x = 9.75 + (g.s - 2) * 0.4;
      [8, 11.75].forEach((y, j) => [x, 24 - x].forEach((x, i) => dots.push(solid(g.circ(x, y, r), { n: `w${j * 2 + i}`, role: D, on: 'body', vc: j * 2 + i }))));
      return [
        line(block(g, 5, 19, 3), { n: 'body', role: P, only: 'outline' }),
        shell(blockFill(g, 5, 19, 3), { n: 'body', role: P, only: 'fill' }),
        ground(g), ...door(g, 'body'), ...dots
      ];
    },
    // 入夜：窗一扇接一扇亮起
    fx: { t: 'variable', on: ['w0', 'w1', 'w2', 'w3'], mode: 'cumulative', step: 140 }
  },
  'building-office': {
    anchor: 'base',
    label: '办公楼', key: 'square',
    plan: '主体：高低两栋楼（共用中间一面墙）；辅助：地面线；细节：窗（圆点）',
    weights: { [P]: 0.66, [S]: 0.22, [D]: 0.12 },
    draw(g) {
      const { h } = g, r = winR(g), c = CORNER - h, yb = 21 - h, t2 = 8;
      const dots = [[8, 8], [8, 12], [8, 16], [16, 12], [16, 16]].map(([x, y], i) => solid(g.circ(x, y, r), { n: `w${i}`, role: D, on: x < 12 ? 'tall' : 'low', vc: i }));
      return [
        line(block(g, 3, 13, 3) + `M12 ${t2}H${n(21 - h - c)}A${n(c)} ${n(c)} 0 0 1 ${n(21 - h)} ${n(t2 + c)}V${n(yb)}`, { n: 'body', role: P, only: 'outline' }),
        shell(blockFill(g, 3, 13, 3), { n: 'tall', role: P, only: 'fill' }),
        shell(g.rr(12, t2, 9 - h, yb - t2, [0, c, 0, 0]), { n: 'low', role: P, only: 'fill' }),
        ground(g), ...dots
      ];
    },
    fx: { t: 'variable', on: ['w0', 'w1', 'w2', 'w3', 'w4'], mode: 'cumulative', step: 120 }
  },
  factory: {
    anchor: 'base',
    label: '工厂', key: 'square',
    plan: '主体：厂房和烟囱（一个闭合形，锯齿屋顶的斜边是厂房需要的）；细节：一排窗（圆点）',
    weights: { [P]: 0.92, [D]: 0.08 },
    draw(g) {
      const { h } = g, x0 = 3 + h, x1 = 21 - h, t = 3 + h, yb = 21 - h, c = 3.25 - h, r = winR(g);
      return [
        shell(g.polygon([[x0, yb], [x0, t], [8, t], [8, 12], [14, 8], [14, 12], [x1, 8], [x1, yb]], [c, 1.25, 1.25, 0, 0.8, 0, 0.8, c]), { n: 'plant', role: P }),
        ...[8, 12, 16].map((x, i) => solid(g.circ(x, 16, r), { n: `w${i}`, role: D, on: 'plant', vc: i }))
      ];
    },
    // 开工：窗依次亮起
    fx: { t: 'variable', on: ['w0', 'w1', 'w2'], mode: 'cumulative', step: 140 }
  },
  hospital: {
    anchor: 'base',
    label: '医院', key: 'square',
    plan: '主体：楼身（与楼房相同）；辅助：地面线；细节：十字（医院的标志，随字重收拢）和门',
    weights: { [P]: 0.52, [S]: 0.18, [D]: 0.3 },
    draw(g) {
      // the cross keeps clear of the walls, the top and the door at every weight
      const { s, h } = g, k = Math.min(3, 7 - h - s - clearOf(s), 6 - s - clearOf(s));
      return [
        line(block(g, 5, 19, 3), { n: 'body', role: P, only: 'outline' }),
        shell(blockFill(g, 5, 19, 3), { n: 'body', role: P, only: 'fill' }),
        ground(g), ...door(g, 'body'),
        line(g.seg(12, 10 - k, 12, 10 + k) + g.seg(12 - k, 10, 12 + k, 10), { n: 'cross', role: D, on: 'body' })
      ];
    },
    fx: { t: 'beat', on: ['cross'], o: [12, 10], amp: 0.18 }
  },
  school: {
    anchor: 'base',
    label: '学校', key: 'square',
    plan: '主体：校舍（中间高起的门楼带 45° 山墙，与首页屋顶同坡度；两侧是矮翼）；细节：山墙下的圆窗（实心点）和门',
    weights: { [P]: 0.79, [D]: 0.21 },
    draw(g) {
      const { h } = g, x0 = 3 + h, x1 = 21 - h, yb = 21 - h, c = 3.25 - h, wy = 12, ty = 7.4, top = ty - 4;
      return [
        shell(g.polygon([[x0, yb], [x0, wy], [8, wy], [8, ty], [12, top], [16, ty], [16, wy], [x1, wy], [x1, yb]], [c, 1.75, 0, 0.8, 1.4, 0.8, 0, 1.75, c]), { n: 'house', role: P }),
        solid(g.circ(12, 9.5, winR(g)), { n: 'window', role: D, on: 'house' }),
        ...door(g, 'house')
      ];
    },
    // 上学：校舍落地弹一下，门从地面画出
    fx: [{ t: 'bounce', on: 'all', o: [12, 21], amp: 0.6 }, { t: 'draw', on: ['door'] }]
  },
  door: {
    label: '门', key: 'portrait',
    plan: '主体：门扇；辅助：地面线；细节：门把手（实心点）',
    weights: { [P]: 0.72, [S]: 0.24, [D]: 0.04 },
    draw(g) {
      const { h } = g, a = 5 + h, b = 19 - h, t = 2 + h, c = 3 - h, yb = 22 - h;
      return [
        line(`M${n(a)} ${n(yb)}V${n(t + c)}A${n(c)} ${n(c)} 0 0 1 ${n(a + c)} ${n(t)}H${n(b - c)}A${n(c)} ${n(c)} 0 0 1 ${n(b)} ${n(t + c)}V${n(yb)}`, { n: 'leaf', role: P, only: 'outline' }),
        shell(g.rr(a, t, b - a, yb - t, [c, c, 0, 0]), { n: 'leaf', role: P, only: 'fill' }),
        line(g.span(4, yb, 20, yb), { n: 'ground', role: S }),
        solid(g.circ(14, 12.5, winR(g)), { n: 'knob', role: D, on: 'leaf' })
      ];
    },
    // 敲门：门扇左右轻震两下（不做门扇转开的三维压扁，GUIDE.md §5）
    fx: { t: 'shake', on: ['leaf', 'knob'], x: 0.5, ms: 380 }
  },
  bed: {
    anchor: 'base',
    label: '床', key: 'landscape',
    plan: '主体：床垫（右上圆角）；辅助：床头立柱和床尾的腿；细节：枕头',
    weights: { [P]: 0.62, [S]: 0.17, [D]: 0.21 },
    draw(g) {
      const { h } = g, c = 3.5 - h;
      return [
        line(g.span(3, 4, 3, 20) + g.seg(21, 16, 21, 20 - h), { n: 'frame', role: S }),
        shell(g.rr(3, 10, 18, 6, [0, c, 0, 0]), { n: 'mattress', role: P }),
        shell(g.box(6, 6, 7, 5, 2), { n: 'pillow', role: D })
      ];
    },
    // 躺下：枕头弹一下
    fx: { t: 'keys', on: ['pillow'], o: [9.5, 10], y: [-1.4, 0.3], sy: [1, 0.85] }
  },
  sofa: {
    anchor: 'base',
    label: '沙发', key: 'landscape',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：扶手和坐垫（一个闭合形）；辅助：靠背和两条腿',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      return [
        line('M5 9V7A2 2 0 0 1 7 5H17A2 2 0 0 1 19 7V9', { n: 'back', role: S, only: 'outline' }),
        shell(g.rr(5, 5, 14, 8, [2, 2, 0, 0]), { n: 'back', role: S, only: 'fill' }),
        line(g.span(5, 17, 5, 20) + g.span(19, 17, 19, 20), { n: 'legs', role: S }),
        shell('M3 16V11A2 2 0 0 1 7 11V13H17V11A2 2 0 0 1 21 11V16A1 1 0 0 1 20 17H4A1 1 0 0 1 3 16Z', { n: 'seat', role: P })
      ];
    },
    // 坐下：坐垫压低再弹回
    fx: { t: 'keys', on: 'all', o: [12, 20], sy: [0.9, 1.03] }
  },
  lamp: {
    anchor: 'base',
    label: '台灯', key: 'portrait',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：灯罩（梯形，斜边是灯罩需要的）；辅助：灯杆和底座',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      const { h } = g, t = 2 + h, b = 12 - h, yb = 22 - h;
      return [
        line(g.seg(12, b, 12, yb) + g.span(7, yb, 17, yb), { n: 'stand', role: S }),
        shell(g.polygon([[8.2, t], [15.8, t], [20.4 - h, b], [3.6 + h, b]], [1.2, 1.2, 1, 1]), { n: 'shade', role: P })
      ];
    },
    // 调灯：灯罩在灯杆上点一下头
    fx: { t: 'keys', on: ['shade'], o: [12, 11], r: [-9, 4] }
  },
  lightbulb: {
    label: '灯泡', key: 'portrait', fit: 'y',
    ends: 'out',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：灯泡（玻璃球和灯头连成一个闭合形，灯头下端是半圆）；细节：玻璃和灯头之间的分界线。灯头和玻璃连在一起，分量才不全压在上方',
    weights: { [P]: 0.88, [D]: 0.12 },
    draw(g) {
      const { h } = g, cy = 8.5, r = 6.5 - h, y0 = cy + Math.sqrt(r * r - 9), rb = 3, yb = 22 - h - rb;
      return [
        shell(`M9 ${n(yb)}V${n(y0)}A${n(r)} ${n(r)} 0 1 1 15 ${n(y0)}V${n(yb)}A${n(rb)} ${n(rb)} 0 0 1 9 ${n(yb)}Z`, { n: 'bulb', role: P }),
        line(g.seg(9, 16, 15, 16), { n: 'seam', role: D, on: 'bulb' })
      ];
    },
    // 开灯：灯泡亮起时轻轻胀一下
    fx: { t: 'keys', on: 'all', o: [12, 9], s: [1.08, 0.97], ms: 360 }
  },
  fan: {
    label: '风扇', key: 'circle',
    light: [], // one object (GUIDE.md §4.2): no part of it changes tone
    plan: '主体：四片扇叶（两段圆弧围成）；辅助：中间的轴（圆环，扇叶从它长出）',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      const { h } = g, at = (r, a) => [12 + r * Math.cos((a * Math.PI) / 180), 12 + r * Math.sin((a * Math.PI) / 180)];
      const blades = [0, 1, 2, 3].map((i) => lensBy(at(2.9, i * 90 - 128), at(10 - h - 0.2, i * 90 - 90), 1.85)).join('');
      return [shell(blades, { n: 'blades', role: P }), shell(g.ring(12, 12, 3.4), { n: 'hub', role: S })];
    },
    // 转起来：转过四分之一圈正好回到原样
    fx: { t: 'rotate', on: 'all', deg: 90, o: [12, 12] }
  },
  thermostat: {
    label: '温控器', key: 'circle',
    light: ['stem', 'bulb'],
    plan: '主体：温度计（立杆和底部圆泡，墨少但层级最高）；辅助：圆形外壳',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g) {
      const { s, h } = g, top = 2 + s + clearOf(s) + h, by = 14.5, R = 3.5;
      return [
        shell(g.ring(12, 12, 10), { n: 'case', role: S }),
        line(g.seg(12, top, 12, by - R + h), { n: 'stem', role: P, on: 'case' }),
        shell(g.ring(12, by, R), { n: 'bulb', role: P, on: 'case' })
      ];
    },
    // 调温：温度从圆泡往上升
    fx: { t: 'keys', on: ['stem'], o: [12, 11], sy: [0.35, 1.05] }
  },
  socket: {
    label: '插座', key: 'square',
    plan: '主体：面板；细节：两个竖插孔和下面的圆形接地孔',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g) {
      return [
        shell(g.box(3, 3, 18, 18, 4.5), { n: 'plate', role: P }),
        line(g.seg(9, 8.5, 9, 12.5) + g.seg(15, 8.5, 15, 12.5), { n: 'slots', role: D, on: 'plate' }),
        solid(g.circ(12, 15.75, Math.min(g.dr * 0.8, 1.3)), { n: 'earth', role: D, on: 'plate' })
      ];
    },
    // 插上插头：面板被按进去一下
    fx: { t: 'keys', on: 'all', o: [12, 12], s: [0.9, 1.03] }
  },
  plant: {
    anchor: 'base',
    label: '盆栽', key: 'portrait',
    plan: '主体：两片叶子和茎；辅助：花盆（上宽下窄，斜边是花盆需要的）',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g) {
      const { h } = g, yb = 22 - h;
      return [
        shell(g.polygon([[6, 14], [18, 14], [16.2, yb], [7.8, yb]], [0.8, 0.8, 1.5, 1.5]), { n: 'pot', role: S }),
        line(g.seg(12, 14, 12, 7.8), { n: 'stem', role: P }),
        shell(lensBy([12, 9.8], [4 + h, 4.3], 2), { n: 'leafL', role: P }),
        shell(lensBy([12, 7.8], [20 - h, 3], 2), { n: 'leafR', role: P })
      ];
    },
    // 叶子随风摆动
    fx: { t: 'wiggle', on: ['stem', 'leafL', 'leafR'], o: [12, 14], deg: 7, hz: 2.2 }
  },
  bath: {
    anchor: 'base',
    label: '浴缸', key: 'landscape',
    plan: '主体：浴缸（缸沿、缸身和两条腿）；辅助：水龙头',
    weights: { [P]: 0.82, [S]: 0.18 },
    draw(g) {
      const { h } = g, rim = 11, yb = 17, c = 3.25 - h, a = 3 + h;
      return [
        // the tap rises from the tub's own wall
        line(`M${n(a)} ${rim}V6.5A2 2 0 0 1 ${n(a + 2)} ${n(4 + h)}H${n(a + 3)}A2 2 0 0 1 ${n(a + 5)} 6.5V7.5`, { n: 'tap', role: S }),
        solid(g.dot(9, 9.6, 0.55), { n: 'drop', role: S, ghost: true }),
        line(cup(3 + h, rim, 21 - h, yb, c) + g.seg(7, yb, 7, 20 - h) + g.seg(17, yb, 17, 20 - h), { n: 'tub', role: P, only: 'outline' }),
        shell(g.rr(3 + h, rim, 18 - g.s, yb - rim, [0, 0, c, c]), { n: 'tub', role: P, only: 'fill' }),
        line(g.seg(7, yb, 7, 20 - h) + g.seg(17, yb, 17, 20 - h), { n: 'legs', role: P, only: 'fill' }),
        line(g.span(2, rim, 22, rim), { n: 'rim', role: P })
      ];
    },
    // 放水：一滴水从龙头落下
    fx: { t: 'keys', on: ['drop'], ghost: true, y: [0, 1.6, 1.6], a: [1, 1, 0], ms: 560 }
  },
  shower: {
    label: '淋浴', key: 'square',
    plan: '主体：花洒头（半圆）；辅助：水管（离左边 1，让重心居中）；细节：三滴水（实心点）',
    weights: { [P]: 0.38, [S]: 0.5, [D]: 0.12 },
    draw(g) {
      const { h } = g, r = winR(g);
      return [
        line(`M5 ${n(21 - h)}V7A3 3 0 0 1 8 ${n(3 + h)}H13A3 3 0 0 1 16 7V8`, { n: 'pipe', role: S }),
        shell(`M${n(11 + h)} 12A${n(5 - h)} ${n(5 - h)} 0 0 1 ${n(21 - h)} 12Z`, { n: 'head', role: P }),
        ...[[13.5, 15.75], [18.5, 15.75], [16, 19.5]].map(([x, y], i) => solid(g.circ(x, y, r), { n: `d${i}`, role: D, vc: i }))
      ];
    },
    // 出水：水滴一滴接一滴落下
    fx: { t: 'variable', on: ['d0', 'd1', 'd2'], mode: 'iterative', step: 140 },
    allow: { optical: '花洒头在右上，水管和水点较轻，按整体轮廓定位', keyline: '水管离左边 1：花洒头在右上，整体重心偏左' }
  },
  'window-frame': {
    anchor: 'base',
    label: '窗户', key: 'square',
    plan: '主体：窗框（顶角与楼房相同）；辅助：窗台（宽出窗框）；细节：十字窗棂',
    weights: { [P]: 0.44, [S]: 0.19, [D]: 0.37 },
    draw(g, ctx) {
      const { h } = g, yb = 21 - h;
      // In the fill variant the bars cut the frame through into four panes (GUIDE.md §4.1); the
      // lower two stand on the sill.
      const e = ctx?.variant === 'fill' ? -h : h;
      return [
        line(block(g, 4, 20, 3), { n: 'frame', role: P, only: 'outline' }),
        shell(blockFill(g, 4, 20, 3), { n: 'frame', role: P, only: 'fill' }),
        line(g.span(3, yb, 21, yb), { n: 'sill', role: S }),
        line(g.seg(12, 3 + e, 12, ctx?.variant === 'fill' ? 21 - e : yb) + g.seg(4 + e, 12, 20 - e, 12), { n: 'bars', role: D, on: 'frame' })
      ];
    },
    fx: { t: 'draw', on: ['bars'] }
  },
  candle: {
    anchor: 'base',
    label: '蜡烛', key: 'portrait', fit: 'y',
    light: ['flame'],
    plan: '主体：烛身；辅助：火焰（圆加尖顶，斜边是火焰需要的）；细节：烛芯（连起火焰和烛身）',
    weights: { [P]: 0.58, [S]: 0.36, [D]: 0.06 },
    draw(g) {
      const { h } = g, cy = 7.5, R = 3, r = R - h, ty = 2 + h * 1.3, b = Math.acos(r / (cy - ty)), top = 13;
      const Pt = (a) => `${n(12 + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
      return [
        line(g.seg(12, cy + r, 12, top + h), { n: 'wick', role: D }),
        shell(`M12 ${n(ty)}L${Pt(-Math.PI / 2 - b)}A${n(r)} ${n(r)} 0 1 0 ${Pt(-Math.PI / 2 + b)}Z`, { n: 'flame', role: S }),
        shell(g.box(8, top, 8, 22 - top, 2), { n: 'body', role: P })
      ];
    },
    // 火焰摇曳
    fx: { t: 'wiggle', on: ['flame'], o: [12, 10.5], deg: 10, hz: 3 },
    allow: { keyline: '蜡烛本身窄，宽 8' }
  },
  warehouse: {
    anchor: 'base',
    label: '仓库', key: 'square',
    plan: '主体：仓库外形（与首页同样带屋檐的坡屋顶，坡度更缓，墙占满方框，屋檐伸出 1）；辅助：宽的卷帘门；细节：门上的横条',
    weights: { [P]: 0.64, [S]: 0.26, [D]: 0.1 },
    draw(g) {
      const { h } = g, top = 3 + h * 1.15, ex = 22 - h, ey = 9, wl = 3 + h, wr = 21 - h, yb = 21 - h, c = 3.25 - h;
      return [
        shell(g.polygon([[12, top], [ex, ey], [wr, ey], [wr, yb], [wl, yb], [wl, ey], [24 - ex, ey]], [1.6, 0.8, 0, c, c, 0, 0.8]), { n: 'house', role: P }),
        line(`M8 ${n(yb)}V12A1 1 0 0 1 9 11H15A1 1 0 0 1 16 12V${n(yb)}`, { n: 'door', role: S, on: 'house', only: 'outline' }),
        solid(`M7 21V12A2 2 0 0 1 9 10H15A2 2 0 0 1 17 12V21Z`, { n: 'door', role: S, on: 'house', only: 'fill' }),
        line(g.seg(8, 15, 16, 15), { n: 'slat', role: D, on: 'door' })
      ];
    },
    // 卷帘门拉起再落下
    fx: { t: 'keys', on: ['door', 'slat'], o: [12, 11], sy: [0.55, 1.04] },
    allow: { keyline: '屋檐伸出墙外 1，与首页的屋檐同一做法' }
  }
};
