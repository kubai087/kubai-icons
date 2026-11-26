// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// home: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: building building-office factory hospital school door bed sofa lamp lightbulb fan thermostat socket plant bath shower window-frame candle warehouse
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { clearOf, slash } from '../kit.mjs';
import { off } from '../variants.mjs';

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

const H = {
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
  },
  'door-open': {
    label: '开门', key: 'live',
    plan: '主体：打开的门扇（梯形，靠铰链一侧高，外侧矮，表示转向屋里）；辅助：门框（右侧和上沿）和地面线；细节：门把手（实心点）',
    weights: { [P]: 0.56, [S]: 0.4, [D]: 0.04 },
    draw(g) {
      const { h } = g, yb = 22 - h;
      return [
        line(`M12 ${n(2 + h)}H16A3 3 0 0 1 19 ${n(5 + h)}V${n(yb)}`, { n: 'frame', role: S }),
        line(g.span(2, yb, 22, yb), { n: 'ground', role: S }),
        shell(g.polygon([[12, 2 + h], [12, yb], [4 + h, 20 - h], [4 + h, 4.5]], [0.8, 0.5, 1, 1]), { n: 'leaf', role: P }),
        solid(g.circ(8.5, 12.5, 0.75 - Math.max(0, g.s - 2) * 0.3), { n: 'knob', role: D, on: 'leaf' })
      ];
    },
    // 开门: the leaf swings a little further open and back
    fx: { t: 'keys', on: ['leaf', 'knob'], x: [-0.8, 0.2], ms: 380 }
  },
  garage: {
    anchor: 'base',
    label: '车库', key: 'square',
    plan: '主体：车库外形（与首页同样带屋檐的坡屋顶，墙更宽）；辅助：宽的车库门（三条边，下面敞开）；细节：门上的两道横条',
    weights: { [P]: 0.56, [S]: 0.2, [D]: 0.24 },
    draw(g) {
      const { h } = g, top = 2 + h, ex = 22 - h, ey = top + (ex - 12) * 0.8, wl = 3 + h, wr = 21 - h, yb = 21 - h, c = 3.25 - h;
      // filled, at the heaviest weights the door's hole narrows so a stroke of wall stays by it
      const d = Math.max(0, g.s - 2.25) * 2;
      return [
        shell(g.polygon([[12, top], [ex, ey], [wr, ey], [wr, yb], [wl, yb], [wl, ey], [24 - ex, ey]], [1.6, 0.8, 0, c, c, 0, 0.8]), { n: 'house', role: P }),
        line(`M7 ${n(yb)}V12H17V${n(yb)}`, { n: 'door', role: S, on: 'house', only: 'outline' }),
        solid(`M${n(6 + d)} 21V11H${n(18 - d)}V21Z`, { n: 'door', role: S, on: 'house', only: 'fill' }),
        line(g.seg(7, 15, 17, 15) + g.seg(7, 18, 17, 18), { n: 'slats', role: D, on: 'door' })
      ];
    },
    // 开车库: the door rolls up and comes down again
    fx: { t: 'keys', on: ['door', 'slats'], o: [12, 12], sy: [0.5, 1.04] },
    allow: { keyline: '屋檐伸出墙外 1，与首页的屋檐同一做法' }
  },
  doorbell: {
    label: '门铃', key: 'portrait', fit: 'y',
    plan: '主体：竖长的面板；细节：圆形按钮（圆环）和上方的摄像头（实心点）',
    weights: { [P]: 0.75, [D]: 0.25 },
    draw(g) {
      return [
        shell(g.box(5, 2, 14, 20, 5.5), { n: 'plate', role: P }),
        solid(g.circ(12, 7.5, winR(g)), { n: 'lens', role: D, on: 'plate' }),
        shell(g.ring(12, 14.5, 3.5 - Math.max(0, g.s - 2) * 0.5), { n: 'button', role: D, on: 'plate' })
      ];
    },
    // 按门铃: the button is pressed in
    fx: { t: 'keys', on: ['button'], o: [12, 14.5], s: [0.75, 1.05], ms: 300 },
    allow: { keyline: '门铃面板本身窄，宽 14' }
  },
  'desk-lamp': {
    anchor: 'base',
    label: '摇臂台灯', key: 'square',
    light: [],
    plan: '主体：灯罩（斜向右下的梯形）；辅助：两节摇臂（折线）和底座',
    weights: { [P]: 0.53, [S]: 0.47 },
    draw(g) {
      const { h } = g, yb = 21 - h;
      return [
        line(g.span(3, yb, 13, yb), { n: 'base', role: S }),
        line(g.pl([[8, yb], [4.5, 13], [11, 7]]), { n: 'arm', role: S }),
        shell(g.polygon([[10, 6.5], [13.5, 3 + h], [21 - h, 10.5], [17, 14]], [0.8, 1, 1, 1]), { n: 'shade', role: P })
      ];
    },
    // 调灯: the shade nods on its joint
    fx: { t: 'keys', on: ['shade'], o: [11, 7], r: [-10, 4] }
  },
  'floor-lamp': {
    anchor: 'base',
    label: '落地灯', key: 'portrait', fit: 'y',
    light: [],
    plan: '主体：灯罩（梯形，比台灯的小）；辅助：长灯杆和三脚底座',
    weights: { [P]: 0.46, [S]: 0.54 },
    draw(g) {
      const { h } = g, t = 2 + h, b = 9 - h;
      return [
        line(g.seg(12, b, 12, 18) + g.pl([[8, 22 - h], [12, 18], [16, 22 - h]]), { n: 'stand', role: S }),
        shell(g.polygon([[9.4, t], [14.6, t], [17.5 - h, b], [6.5 + h, b]], [1, 1, 0.8, 0.8]), { n: 'shade', role: P })
      ];
    },
    // 开灯: the shade nods on the pole
    fx: { t: 'keys', on: ['shade'], o: [12, 8], r: [-8, 3] },
    allow: { keyline: '落地灯本身窄，宽 11' }
  },
  'lamp-ceiling': {
    label: '吊灯', key: 'square',
    plan: '主体：灯罩（半圆顶，底边平）；辅助：吊线和灯罩下露出的灯泡；细节：向下的三道光线。灯罩占满宽度，约占七成',
    weights: { [P]: 0.72, [S]: 0.14, [D]: 0.14 },
    draw(g) {
      const { h } = g, by = 13, r = 9 - h;
      return [
        line(g.seg(12, 3 + h, 12, by - r), { n: 'cord', role: S }),
        line(`M9.5 ${by}A2.5 2.5 0 0 0 14.5 ${by}`, { n: 'bulb', role: S }),
        shell(`M${n(12 - r)} ${by}A${n(r)} ${n(r)} 0 0 1 ${n(12 + r)} ${by}Z`, { n: 'shade', role: P }),
        line(g.span(12, 18.5, 12, 21), { n: 'r0', role: D, vc: 0 }),
        line(g.span(7.5, 17.5, 6, 20), { n: 'r1', role: D, vc: 0 }),
        line(g.span(16.5, 17.5, 18, 20), { n: 'r2', role: D, vc: 0 })
      ];
    },
    light: ['r0', 'r1', 'r2'],
    // 开灯: the lamp swings on its cord and the light flickers
    fx: [{ t: 'wiggle', on: ['bulb', 'shade'], o: [12, 2], deg: 5, hz: 2 }, { t: 'keys', on: ['r0', 'r1', 'r2'], a: [0.2, 1, 0.4, 1], ms: 520 }]
  },
  'light-switch': {
    label: '墙壁开关', key: 'square', fit: 'x',
    plan: '主体：面板（竖长的圆角矩形）；细节：翘板（小圆角矩形）和翘板上表示开的圆点',
    weights: { [P]: 0.6, [D]: 0.4 },
    draw(g) {
      return [
        shell(g.box(3, 2, 18, 20, 4.5), { n: 'plate', role: P }),
        shell(g.box(7, 6, 10, 12, 3), { n: 'rocker', role: D, on: 'plate' }),
        solid(g.circ(12, 10.75, winR(g) - Math.max(0, g.s - 2.25) * 0.6), { n: 'dot', role: D, on: 'rocker' })
      ];
    },
    light: ['rocker', 'dot'],
    // 开关: the rocker flips: its mark drops to the other end and comes back
    fx: { t: 'keys', on: ['dot'], y: [3.5, 0], ms: 420 }
  },
  'air-conditioner': {
    label: '空调', key: 'landscape', fit: 'x',
    plan: '主体：室内机（横放的圆角矩形）；辅助：出风口下吹出的三道风；细节：机身上的出风口（横线，两端接到侧边）',
    weights: { [P]: 0.6, [S]: 0.22, [D]: 0.18 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(2, 4, 20, 10, 3), { n: 'body', role: P }),
        line(g.seg(7, 9, 17, 9), { n: 'vent', role: D, on: 'body' }),
        line(g.span(8, 16, 6.75, 22), { n: 'a0', role: S }),
        line(g.span(12, 16, 12, 22), { n: 'a1', role: S }),
        line(g.span(16, 16, 17.25, 22), { n: 'a2', role: S })
      ];
    },
    light: ['vent', 'a0', 'a1', 'a2'],
    // 吹风: the air blows down, one stream after another
    fx: { t: 'keys', on: [['a0'], ['a1'], ['a2']], by: true, stagger: 90, y: [1.2, -0.6, 0], a: [0, 0, 1] }
  },
  heater: {
    anchor: 'base',
    label: '取暖器', key: 'square',
    ends: 'in',
    plan: '主体：暖气片（圆角矩形）；辅助：两条腿；细节：三道竖的散热片',
    weights: { [P]: 0.6, [S]: 0.1, [D]: 0.3 },
    draw(g, ctx) {
      const { h } = g;
      // filled, the heaviest weights leave no stroke of ink between three fins: the middle one goes
      const mid = ctx?.variant === 'fill' && g.s > 2.25 ? [] : [line(g.seg(12, 8, 12, 14), { n: 'f1', role: D, on: 'body', vc: 1 })];
      return [
        shell(g.box(3, 3, 18, 16, 3), { n: 'body', role: P }),
        line(g.seg(8, 8, 8, 14), { n: 'f0', role: D, on: 'body', vc: 0 }),
        ...mid,
        line(g.seg(16, 8, 16, 14), { n: 'f2', role: D, on: 'body', vc: 2 }),
        line(g.seg(6, 19 - h, 6, 21 - h) + g.seg(18, 19 - h, 18, 21 - h), { n: 'legs', role: S })
      ];
    },
    // 取暖: the fins warm up one after another
    fx: { t: 'variable', on: ['f0', 'f1', 'f2'], mode: 'cumulative', step: 140 }
  },
  fireplace: {
    anchor: 'base',
    label: '壁炉', key: 'square',
    plan: '主体：炉身（立在地面上）和顶上比炉身宽的炉台；细节：拱形的炉口',
    weights: { [P]: 0.7, [D]: 0.3 },
    draw(g) {
      const { h } = g, yb = 21 - h;
      return [
        line(block(g, 3, 21, 3), { n: 'body', role: P, only: 'outline' }),
        shell(blockFill(g, 3, 21, 3), { n: 'body', role: P, only: 'fill' }),
        line(g.span(2, 3 + h, 22, 3 + h), { n: 'shelf', role: P }),
        line(`M8 ${n(yb)}V13A4 4 0 0 1 16 13V${n(yb)}`, { n: 'mouth', role: D, on: 'body', only: 'outline' }),
        solid(`M7 21V13A5 5 0 0 1 17 13V21Z`, { n: 'mouth', role: D, on: 'body', only: 'fill' })
      ];
    },
    // 生火: the fireplace glows: its mouth is drawn up from the hearth
    fx: [{ t: 'bounce', on: 'all', o: [12, 21], amp: 0.5 }, { t: 'draw', on: ['mouth'] }],
    allow: { keyline: '炉台伸出炉身两侧 1' }
  },
  'smoke-detector': {
    label: '烟雾报警器', key: 'landscape', fit: 'x',
    plan: '主体：报警器（扁的圆顶，贴在天花板下）；辅助：天花板线；细节：向下发出的两道报警弧线',
    weights: { [P]: 0.6, [S]: 0.12, [D]: 0.28 },
    draw(g) {
      const { h } = g;
      return [
        line(g.span(2, 4 + h, 22, 4 + h), { n: 'ceiling', role: S }),
        shell(g.box(4, 4, 16, 8, [0, 0, 4, 4]), { n: 'body', role: P }),
        line(g.arc(12, 12, 4.5, 50, 130), { n: 'w0', role: D, vc: 0 }),
        line(g.arc(12, 12, 9, 60, 120), { n: 'w1', role: D, vc: 1 })
      ];
    },
    light: ['w0', 'w1'],
    // 报警: the alarm waves pulse out
    fx: { t: 'variable', on: ['w0', 'w1'], mode: 'iterative', step: 180 }
  },
  'washing-machine': {
    label: '洗衣机', key: 'square', fit: 'x',
    ends: 'out',
    plan: '主体：机身（竖长的圆角矩形）；细节：控制面板的分界线（面性中切开）和圆形的舱门（圆环）',
    weights: { [P]: 0.62, [D]: 0.38 },
    draw(g) {
      return [
        shell(g.box(3, 2, 18, 20, 4), { n: 'body', role: P }),
        line(g.seg(3 + g.h, 7, 21 - g.h, 7), { n: 'panel', role: D, on: 'body' }),
        shell(g.ring(12, 14, 4.5 - Math.max(0, g.s - 2) * 1.5), { n: 'door', role: D, on: 'body' })
      ];
    },
    light: ['panel', 'door'],
    // 洗衣: the drum turns
    fx: { t: 'keys', on: ['door'], o: [12, 14], r: [-20, 8, 0], s: [0.9, 1], ms: 560 }
  },
  dishwasher: {
    label: '洗碗机', key: 'square', fit: 'x',
    ends: 'out',
    plan: '主体：机身（竖长的圆角矩形）；细节：控制面板的分界线（面性中切开）和门上的横把手',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g) {
      return [
        shell(g.box(3, 2, 18, 20, 4), { n: 'body', role: P }),
        line(g.seg(3 + g.h, 7, 21 - g.h, 7), { n: 'panel', role: D, on: 'body' }),
        line(g.seg(9, 12, 15, 12), { n: 'handle', role: D, on: 'body', ends: 'keep' })
      ];
    },
    light: ['panel', 'handle'],
    // 洗碗: the door is pulled down a little and closes
    fx: { t: 'keys', on: ['handle'], y: [1.2, 0], ms: 360 }
  },
  fridge: {
    label: '冰箱', key: 'portrait',
    ends: 'out',
    plan: '主体：箱体（竖长的圆角矩形）；细节：冷冻室和冷藏室的分界线（面性中切开）和两个竖把手',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g, ctx) {
      // the handles keep clear of the top and the seam; filled, the heavier weights leave no room
      // for the upper one
      const { s, h } = g, c = clearOf(s), y = 11, fill = ctx?.variant === 'fill';
      const upper = fill && s > 2 ? '' : g.span(9, 2 + s + c, 9, y - h - c);
      return [
        shell(g.box(4, 2, 16, 20, 4), { n: 'body', role: P }),
        line(g.seg(4 + h, y, 20 - h, y), { n: 'seam', role: D, on: 'body' }),
        line(upper + g.span(9, y + h + (fill ? s : c), 9, 17), { n: 'handles', role: D, on: 'body', ends: 'keep' })
      ];
    },
    light: ['seam', 'handles'],
    // 开冰箱: the handles are pulled
    fx: { t: 'keys', on: ['handles'], x: [-0.8, 0], ms: 320 }
  },
  microwave: {
    label: '微波炉', key: 'landscape',
    plan: '主体：机身（横放的圆角矩形）；细节：左边的炉门窗口（圆角矩形）和右边的两个旋钮（实心点）',
    weights: { [P]: 0.69, [D]: 0.31 },
    draw(g) {
      const r = winR(g) - Math.max(0, g.s - 2.25) * 0.6;
      return [
        shell(g.box(2, 4, 20, 16, 3.5), { n: 'body', role: P }),
        shell(g.box(6, 8, 8, 8, 1.5), { n: 'window', role: D, on: 'body' }),
        solid(g.circ(17, 10, r), { n: 'k0', role: D, on: 'body' }),
        solid(g.circ(17, 14, r), { n: 'k1', role: D, on: 'body' })
      ];
    },
    light: ['window', 'k0', 'k1'],
    // 加热: the window glows on and off
    fx: { t: 'keys', on: ['window'], a: [0.3, 1, 0.3, 1], ms: 640 }
  },
  oven: {
    label: '烤箱', key: 'square',
    plan: '主体：箱体（圆角方形）；细节：门上的横把手和下面的窗口（圆角矩形）',
    weights: { [P]: 0.6, [D]: 0.4 },
    draw(g, ctx) {
      // filled, the heaviest weights leave no stroke of ink between the handle and the window:
      // the fill keeps the window
      const handle = ctx?.variant === 'fill' && g.s > 2.25 ? [] : [line(g.seg(8, 8, 16, 8), { n: 'handle', role: D, on: 'body' })];
      return [
        shell(g.box(3, 3, 18, 18, 4), { n: 'body', role: P }),
        ...handle,
        shell(g.box(7, 11, 10, 6, 1.5), { n: 'window', role: D, on: 'body' })
      ];
    },
    light: ['handle', 'window'],
    // 烤: the window glows
    fx: { t: 'keys', on: ['window'], a: [0.3, 1, 0.3, 1], ms: 640 }
  },
  toaster: {
    anchor: 'base',
    label: '烤面包机', key: 'square',
    plan: '主体：机身（上面圆、下面方的横放形）；辅助：从顶上露出的两片面包（方顶，小圆角）；细节：侧面的拨杆（实心点）',
    weights: { [P]: 0.6, [S]: 0.3, [D]: 0.1 },
    draw(g) {
      const { h } = g, t = 3 + h, slice = (a, b) => `M${a} 9V${n(t + 1.5)}A1.5 1.5 0 0 1 ${a + 1.5} ${n(t)}H${b - 1.5}A1.5 1.5 0 0 1 ${b} ${n(t + 1.5)}V9`;
      return [
        line(slice(5, 10) + slice(14, 19), { n: 'bread', role: S }),
        shell(g.box(3, 9, 18, 12, [5, 5, 2.5, 2.5]), { n: 'body', role: P }),
        solid(g.circ(16, 15, winR(g) - Math.max(0, g.s - 2.25) * 0.6), { n: 'lever', role: D, on: 'body' })
      ];
    },
    light: ['bread'],
    // 吐司: the toast pops up
    fx: [{ t: 'keys', on: ['bread'], y: [-2.2, 0.4, 0], ms: 460 }, { t: 'keys', on: ['lever'], y: [2, 0], ms: 460 }]
  },
  kettle: {
    anchor: 'base',
    label: '水壶', key: 'square',
    plan: '主体：壶身（上窄下宽）；辅助：顶上的提手和左边的壶嘴',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      const { h } = g, yb = 21 - h;
      return [
        line(`M8 8V6A2 2 0 0 1 10 4H14A2 2 0 0 1 16 6V8`, { n: 'handle', role: S }),
        line(g.seg(7 - ((13 - 8) * (7 - 4.5 - h)) / (yb - 8), 13, 4, 9.5), { n: 'spout', role: S }),
        shell(g.polygon([[7, 8], [17, 8], [21.9 - h, yb], [4.5 + h, yb]], [1.5, 1.5, 2.5, 2.5]), { n: 'body', role: P })
      ];
    },
    light: [],
    // 倒水: the kettle tips toward its spout
    fx: { t: 'keys', on: 'all', o: [12, 21], r: [-10, 2], ms: 420 }
  },
  'cooking-pot': {
    anchor: 'base',
    label: '汤锅', key: 'square',
    plan: '主体：锅身（下面圆角、上面敞开）；辅助：比锅身宽的锅沿（两端是把手）和圆顶的锅盖带盖钮',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g, yr = 10;
      const a = (Math.asin((yr - 5 - h - 12 + 7) / 7) * 180) / Math.PI;
      return [
        line(cup(5, yr, 19, 21 - h, 4 - h), { n: 'pot', role: P }),
        line(g.span(3, yr, 21, yr), { n: 'rim', role: S }),
        line(g.arc(12, 12.5, 7, 205, 335) + g.seg(12, 5.5, 12, 3 + h), { n: 'lid', role: S })
      ];
    },
    area: (g) => [{ n: 'pot', d: `M5 10V${n(21 - g.h - 4 + g.h)}A${n(4 - g.h)} ${n(4 - g.h)} 0 0 0 ${n(9 - g.h)} ${n(21 - g.h)}H${n(15 + g.h)}A${n(4 - g.h)} ${n(4 - g.h)} 0 0 0 19 ${n(17)}V10Z` }],
    light: [],
    // 煮汤: the lid lifts as it boils
    fx: { t: 'keys', on: ['lid'], o: [12, 10], y: [-1.4, 0, -0.8, 0], ms: 560 }
  },
  'frying-pan': {
    label: '平底锅', key: 'live', fit: 'x',
    plan: '主体：锅（圆环，从上方看）；辅助：斜向右上的长柄；细节：锅底的小圆（圆环）',
    weights: { [P]: 0.62, [S]: 0.12, [D]: 0.26 },
    draw(g) {
      const { h } = g, C = [10, 13], R = 8, a = -38 * Math.PI / 180, p = [C[0] + (R - h) * Math.cos(a), C[1] + (R - h) * Math.sin(a)];
      return [
        line(g.seg(p[0], p[1], 22 - h * 0.8, 5 + h * 0.6), { n: 'handle', role: S }),
        shell(g.ring(C[0], C[1], R), { n: 'pan', role: P }),
        shell(g.ring(C[0], C[1], 3.5 - Math.max(0, g.s - 2) * 0.5), { n: 'base', role: D, on: 'pan' })
      ];
    },
    light: ['base'],
    // 颠锅: the pan is tossed on its handle
    fx: { t: 'keys', on: 'all', o: [21, 6], r: [-8, 3, 0], ms: 460 }
  },
  'robot-vacuum': {
    label: '扫地机', key: 'circle',
    plan: '主体：圆形机身；细节：上方的激光雷达（小圆环）和下方的按钮（实心点）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) {
      return [
        shell(g.ring(12, 12, 10), { n: 'body', role: P }),
        shell(g.ring(12, 8.5, 3 - Math.max(0, g.s - 2) * 0.5), { n: 'lidar', role: D, on: 'body' }),
        solid(g.circ(12, 15, winR(g)), { n: 'button', role: D, on: 'body' })
      ];
    },
    light: ['lidar', 'button'],
    // 清扫: the robot turns to look round and turns back
    fx: [{ t: 'keys', on: 'all', o: [12, 12], r: [-25, 10, 0], ms: 640 }, { t: 'keys', on: ['lidar'], o: [12, 8.5], s: [0.8, 1.05], ms: 640 }]
  },
  iron: {
    anchor: 'base',
    label: '熨斗', key: 'landscape', fit: 'x',
    plan: '主体：熨斗底座（底边平，前端尖，后背竖直）；辅助：顶上的把手（与后背连成一体）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const { h } = g, yb = 19 - h, top = 12, xr = 22 - h;
      return [
        line(`M8 ${top}V8.5A2.5 2.5 0 0 1 10.5 6H${n(xr - 2.5)}A2.5 2.5 0 0 1 ${n(xr)} 8.5V${top}`, { n: 'handle', role: S }),
        shell(g.polygon([[0.3 + h, yb], [xr, yb], [xr, top], [8, top]], [1, 2, 1.5, 4]), { n: 'base', role: P })
      ];
    },
    light: [],
    // 熨衣: the iron glides forward and back
    fx: { t: 'keys', on: 'all', x: [-1.2, 0.4, 0], ms: 520 }
  },
  hanger: {
    label: '衣架', key: 'landscape', fit: 'x',
    plan: '主体：衣架的三角形；辅助：顶上的挂钩（竖线卷成大半个圆）',
    weights: { [P]: 0.76, [S]: 0.24 },
    draw(g) {
      const { h } = g;
      return [
        line(`M12 10V7.5` + g.arc(12, 5.25, 2.25, 90, 330).replace(/^M[^A]+/, ''), { n: 'hook', role: S }),
        shell(g.polygon([[12, 9.5], [23.7 - h, 19 - h], [0.3 + h, 19 - h]], [1, 1, 1]), { n: 'bar', role: P })
      ];
    },
    light: [],
    // 挂衣: the hanger swings on its hook
    fx: { t: 'wiggle', on: 'all', o: [12, 3], deg: 6, hz: 2 }
  },
  armchair: {
    anchor: 'base',
    label: '扶手椅', key: 'landscape',
    light: [],
    plan: '主体：扶手和坐垫（一个闭合形，同沙发）；辅助：比沙发高而窄的靠背和两条腿',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      return [
        line('M6 10V6A3 3 0 0 1 9 3H15A3 3 0 0 1 18 6V10', { n: 'back', role: S, only: 'outline' }),
        shell(g.rr(6, 3, 12, 10, [3, 3, 0, 0]), { n: 'back', role: S, only: 'fill' }),
        line(g.span(5, 17, 5, 20) + g.span(19, 17, 19, 20), { n: 'legs', role: S }),
        shell('M3 16V12A2 2 0 0 1 7 12V14H17V12A2 2 0 0 1 21 12V16A1 1 0 0 1 20 17H4A1 1 0 0 1 3 16Z', { n: 'seat', role: P })
      ];
    },
    // 坐下: the seat sinks and springs back
    fx: { t: 'keys', on: 'all', o: [12, 20], sy: [0.9, 1.03] },
    allow: { keyline: '靠背在坐垫之上，整体比横向方框高 1' }
  },
  chair: {
    anchor: 'base',
    label: '椅子', key: 'portrait',
    light: [],
    plan: '主体：靠背（圆角矩形）和座面（横线，比靠背宽）；辅助：两条腿（从靠背下沿穿过座面到地面）',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(6, 2, 12, 9, 3), { n: 'back', role: P }),
        line(g.seg(8, 11 - h, 8, 22 - h) + g.seg(16, 11 - h, 16, 22 - h), { n: 'legs', role: S }),
        line(g.span(4, 14, 20, 14), { n: 'seat', role: P })
      ];
    },
    // 坐下: the chair is pulled out and set down
    fx: { t: 'keys', on: 'all', x: [-0.8, 0.2, 0], ms: 420 }
  },
  'bed-double': {
    anchor: 'base',
    label: '双人床', key: 'landscape', fit: 'x',
    plan: '主体：床垫（横放的圆角矩形）；辅助：拱形的床头和两条腿；细节：两个枕头（实心，太小画不出线框）',
    weights: { [P]: 0.46, [S]: 0.38, [D]: 0.16 },
    draw(g) {
      return [
        line('M4 13V7A3 3 0 0 1 7 4H17A3 3 0 0 1 20 7V13', { n: 'head', role: S }),
        solid(g.rr(7.5, 8, 3.5, 3, 1) + g.rr(13, 8, 3.5, 3, 1), { n: 'pillows', role: D }),
        shell(g.box(2, 13, 20, 6, 2), { n: 'mattress', role: P }),
        line(g.seg(4, 19 - g.h, 4, 21 - g.h) + g.seg(20, 19 - g.h, 20, 21 - g.h), { n: 'legs', role: S })
      ];
    },
    // 躺下: the pillows are plumped
    fx: { t: 'keys', on: ['pillows'], o: [12, 11], y: [-1, 0.2], sy: [1, 0.85] }
  },
  'bed-single': {
    anchor: 'base',
    label: '单人床', key: 'landscape', fit: 'x',
    plan: '主体：床垫（同双人床，窄一些）；辅助：拱形的床头和两条腿；细节：一个枕头（实心）',
    weights: { [P]: 0.5, [S]: 0.42, [D]: 0.08 },
    draw(g) {
      return [
        line('M6 13V7A3 3 0 0 1 9 4H15A3 3 0 0 1 18 7V13', { n: 'head', role: S }),
        solid(g.rr(10, 8, 4, 3, 1), { n: 'pillow', role: D }),
        shell(g.box(4, 13, 16, 6, 2), { n: 'mattress', role: P }),
        line(g.seg(6, 19 - g.h, 6, 21 - g.h) + g.seg(18, 19 - g.h, 18, 21 - g.h), { n: 'legs', role: S })
      ];
    },
    fx: { t: 'keys', on: ['pillow'], o: [12, 11], y: [-1, 0.2], sy: [1, 0.85] },
    allow: { keyline: '单人床本身窄，宽 16' }
  },
  wardrobe: {
    anchor: 'base',
    label: '衣柜', key: 'square',
    ends: 'out',
    plan: '主体：柜体（竖长的圆角矩形）；辅助：两条矮腿；细节：两扇门的中缝（面性中切开）和两个把手（实心点）',
    weights: { [P]: 0.7, [S]: 0.08, [D]: 0.22 },
    draw(g) {
      const { h } = g, r = 0.85 - Math.max(0, g.s - 2) * 0.3;
      return [
        shell(g.box(3, 3, 18, 16, 3), { n: 'body', role: P }),
        line(g.seg(12, 3 + h, 12, 19 - h), { n: 'split', role: D, on: 'body' }),
        solid(g.circ(8, 10.5, r) + g.circ(16, 10.5, r), { n: 'knobs', role: D, on: 'body' }),
        line(g.seg(6, 19 - h, 6, 21 - h) + g.seg(18, 19 - h, 18, 21 - h), { n: 'legs', role: S })
      ];
    },
    light: ['split', 'knobs'],
    // 开柜门: the knobs are pulled outward
    fx: [{ t: 'keys', on: ['knobs'], s: [0.7, 1], o: [12, 10.5], ms: 300 }]
  },
  bookshelf: {
    label: '书柜', key: 'square', fit: 'x',
    ends: 'out',
    plan: '主体：柜框（竖长的圆角矩形）；细节：中间的隔板（面性中切开）和两层的书（竖线，下层右边一本矮）',
    weights: { [P]: 0.56, [D]: 0.44 },
    draw(g, ctx) {
      // filled, the books keep a stroke of ink from the frame and the shelf, and the heavier weights
      // keep the outer books only, so a stroke of ink stays between holes
      const { h, s } = g, fill = ctx?.variant === 'fill', c = fill ? Math.max(s, clearOf(s)) : clearOf(s), few = fill && s > 2;
      // a book too short to read as one (the heaviest fill) is left out
      const book = (x, a, b) => (b - a < s * 1.5 ? '' : g.span(x, a, x, b));
      return [
        shell(g.box(3, 2, 18, 20, 3), { n: 'frame', role: P }),
        line(g.seg(3 + h, 12, 21 - h, 12), { n: 'shelf', role: D, on: 'frame' }),
        line(book(8, 2 + s + c, 12 - h - c) + (few ? '' : book(12, 2 + s + c, 12 - h - c)) + book(16, 2 + s + c, 12 - h - c), { n: 'top', role: D, on: 'frame', ends: 'keep' }),
        line(book(8, 12 + h + c, 22 - s - c) + (few ? '' : book(12, 12 + h + c, 22 - s - c)) + book(16, 15.5, 22 - s - c), { n: 'low', role: D, on: 'frame', ends: 'keep' })
      ];
    },
    light: ['shelf', 'top', 'low'],
    // 取书: a book is pulled out and slid back
    fx: { t: 'keys', on: ['top'], y: [-1.2, 0], ms: 380 }
  },
  curtains: {
    label: '窗帘', key: 'square', fit: 'x',
    plan: '主体：两片拉开的窗帘（中间束起，下摆散开）；辅助：顶上的帘杆（比窗帘宽）',
    weights: { [P]: 0.92, [S]: 0.08 },
    draw(g) {
      const { h } = g, y = 4, yb = 22 - h;
      const side = (k) => g.polygon([[12 + k * (9 - h), y], [12 + k * 2, y], [12 + k * 5.5, 15], [12 + k * 1.5, yb], [12 + k * (9 - h), yb]], [0, 0.8, 2.5, 0.8, 1.5]);
      return [
        line(g.span(2, 4, 22, 4), { n: 'rod', role: S }),
        shell(side(-1), { n: 'left', role: P }),
        shell(side(1), { n: 'right', role: P })
      ];
    },
    light: [],
    // 拉窗帘: the curtains sway apart and back
    fx: [{ t: 'keys', on: ['left'], o: [3, 4], sx: [0.85, 1.03], ms: 460 }, { t: 'keys', on: ['right'], o: [21, 4], sx: [0.85, 1.03], ms: 460 }],
    allow: { keyline: '帘杆伸出窗帘两侧 1' }
  },
  mirror: {
    label: '镜子', key: 'portrait', fit: 'y',
    plan: '主体：竖长的椭圆镜面（两端半圆）；细节：右上的两道反光（短斜线）',
    weights: { [P]: 0.82, [D]: 0.18 },
    draw(g, ctx) {
      // filled, the heavier weights keep one glare line: two leave too little ink between them
      const two = ctx?.variant === 'fill' && g.s > 2.25 ? '' : g.seg(10, 12, 12, 14);
      return [
        shell(g.box(5, 2, 14, 20, 7), { n: 'glass', role: P }),
        line(g.seg(12, 8.5, 14, 10.5) + two, { n: 'glare', role: D, on: 'glass', ends: 'keep' })
      ];
    },
    // 照镜子: the glare slides across the glass
    fx: { t: 'keys', on: ['glare'], x: [-1.2, 0.8, 0], y: [1.2, -0.8, 0], a: [0, 0, 1], ms: 560 },
    allow: { keyline: '镜子本身窄，宽 14' }
  },
  toilet: {
    anchor: 'base',
    label: '马桶', key: 'square',
    light: [],
    plan: '主体：马桶座和底座（侧面，座面平，前面弯下来收成底座）；辅助：后面的水箱',
    weights: { [P]: 0.71, [S]: 0.29 },
    draw(g) {
      const { h } = g, yb = 21 - h;
      return [
        shell(g.box(3, 3, 6, 10, 2), { n: 'tank', role: S }),
        shell(g.polygon([[3 + h, 12], [22.5 - h, 12], [18, 17.5], [18, yb], [11, yb], [11, 16], [3 + h, 15]], [1, 1.5, 1, 1, 1, 1.5, 1]), { n: 'bowl', role: P })
      ];
    },
    // 冲水: the tank shakes as it flushes
    fx: { t: 'keys', on: ['tank'], y: [-0.8, 0.3, 0], ms: 380 }
  },
  faucet: {
    anchor: 'base',
    label: '水龙头', key: 'square',
    plan: '主体：龙头（竖的立管弯向右下的出水口）；辅助：左边的把手和底座；细节：一滴水（实心点）',
    weights: { [P]: 0.72, [S]: 0.2, [D]: 0.08 },
    draw(g) {
      const { h } = g, yb = 21 - h;
      return [
        line(g.span(4, yb, 14, yb), { n: 'base', role: S }),
        line(g.seg(4, 8, 9, 8), { n: 'lever', role: S }),
        line(`M9 ${n(yb)}V7A3 3 0 0 1 12 ${n(4)}H17A3 3 0 0 1 20 7V9`, { n: 'spout', role: P }),
        solid(g.circ(20, 13, winR(g)), { n: 'drop', role: D })
      ];
    },
    light: ['drop'],
    // 出水: the drop falls from the spout
    fx: { t: 'keys', on: ['drop'], y: [5, 5], a: [1, 0], ms: 560 }
  }
};

// Variants made by rule (kit.mjs), of the icons above.
const base = (k) => ({ ...H[k], name: k });
const SLASH_SLIVER = { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' };
Object.assign(H, {
  'lightbulb-off': off({ ...slash(base('lightbulb'), { label: '关灯' }), allow: SLASH_SLIVER }, 'lightbulb', { t: 'keys', on: ['bulb', 'seam'], o: [12, 9], s: [0.92], ms: 240 }),
  'fan-off': off({ ...slash(base('fan'), { label: '风扇关闭' }), allow: SLASH_SLIVER }, 'fan', { t: 'keys', on: ['blades'], o: [12, 12], r: [-25], ms: 420 })
});

export default H;
