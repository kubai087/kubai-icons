// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// security: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: shield shield-check key key-round password lock-keyhole fingerprint scan-face cctv radar siren badge-verified detective
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid, geo } from '../parts.mjs';
import { slash, enclose } from '../kit.mjs';
import { off, offFill } from '../variants.mjs';
import { corner, notch, MARK_FX, xform } from './communication.mjs';
import INTERFACE from './interface.mjs';

const R2 = Math.SQRT1_2;
const pt = (q) => `${n(q[0])} ${n(q[1])}`;

// Shield (shield, shield-check): a flat top with round corners, straight sides down to ys, then
// two arcs, each tangent to its side, meeting at the tip.
export function shieldPath(g) {
  const { h } = g, x0 = 4 + h, x1 = 20 - h, y0 = 2 + h, c = 4 - h, ys = 11.5, yt = 22 - h;
  const dx = 12 - x0, dy = yt - ys, R = n((dx * dx + dy * dy) / (2 * dx));
  return `M${n(x0)} ${n(y0 + c)}A${n(c)} ${n(c)} 0 0 1 ${n(x0 + c)} ${n(y0)}H${n(x1 - c)}A${n(c)} ${n(c)} 0 0 1 ${n(x1)} ${n(y0 + c)}V${ys}A${R} ${R} 0 0 1 12 ${n(yt)}A${R} ${R} 0 0 1 ${n(x0)} ${ys}Z`;
}

// A key laid at 45°: a round bow, a shaft and two teeth at right angles to it, a little back from
// its tip (key, key-round). o is the bow centre, R its outer radius, dir the shaft direction,
// side the side the teeth stand on, len the shaft length from the bow centre, teeth their places.
function keyParts(g, { o, R, dir, side, len, teeth, t = 2.25 }) {
  const r = R - g.h, a = [dir[0] * R2, dir[1] * R2], b = [side[0] * R2, side[1] * R2];
  const at = (u, v = 0) => [o[0] + a[0] * u + b[0] * v, o[1] + a[1] * u + b[1] * v];
  return { bow: g.ring(o[0], o[1], R), shaft: g.pl([at(r), at(len)]) + teeth.map((u) => g.pl([at(u), at(u, t)])).join('') };
}

// Corner brackets of a scan frame on the square key shape, arms reaching to `arm`.
function brackets(g, arm = 8) {
  const { h } = g, c = 4.5 - h, e = 3 + h, f = 21 - h;
  return [
    `M${e} ${arm}V${n(e + c)}A${n(c)} ${n(c)} 0 0 1 ${n(e + c)} ${e}H${arm}`,
    `M${24 - arm} ${e}H${n(f - c)}A${n(c)} ${n(c)} 0 0 1 ${f} ${n(e + c)}V${arm}`,
    `M${f} ${24 - arm}V${n(f - c)}A${n(c)} ${n(c)} 0 0 1 ${n(f - c)} ${f}H${24 - arm}`,
    `M${arm} ${f}H${n(e + c)}A${n(c)} ${n(c)} 0 0 1 ${e} ${n(f - c)}V${24 - arm}`
  ].join('');
}

// A shield with a sign inside (shield-check's layout): the shield is secondary, the sign primary
// and sits on it. The sign shrinks a little with the weight about (12, 11.5), as shield-check's.
const signK = (g) => 1 - 0.4 * (g.s - 2);
const shieldWith = (label, plan, weights, sign, fx, o = {}) => ({
  label, key: 'portrait', plan: `主体：${plan}；辅助：盾牌（与防护同一外形）`, weights,
  draw: (g, ctx) => [shell(shieldPath(g), { n: 'shield', role: S }), ...sign(g, signK(g), ctx).map((l) => ({ ...l, role: P, on: 'shield' }))],
  fx, ...o
});
const SHIELD = { label: '防护', key: 'portrait', draw: (g) => [shell(shieldPath(g), { n: 'shield', role: P })] };

// A copy of icons.mjs's lock, the base of its variants here.
const lockHole = (g) => line(g.seg(12, 14.6 + (g.s - 1.75) * 1.2, 12, 17.4 - (g.s - 1.75) * 0.9), { n: 'hole', role: D, on: 'body' });
const LOCK = {
  label: '锁定', key: 'portrait', anchor: 'base',
  draw: (g) => [line(arch(7 + g.h, 17 - g.h, 2 + g.h, 10 + g.h), { n: 'shackle', role: S }), shell(g.box(4, 10, 16, 12, 4), { n: 'body', role: P }), lockHole(g)]
};
// The lock without its keyhole: drawn small (enclose) or crossed by a slash, it has no room for one.
const LOCK_PLAIN = { ...LOCK, draw: (g) => LOCK.draw(g).slice(0, 2) };
// A small person (icons.mjs's user) for passkey.
const USER = {
  label: '用户', key: 'square', allow: { keyline: '人的肩宽 16，比方框窄；放宽会显得胖' },
  draw: (g) => [shell(g.ring(12, 7.5, 4.875), { n: 'head', role: P }), shell(g.box(4, 14, 16, 7, [6.25, 6.25, 2.5, 2.5]), { n: 'body', role: S })]
};
// A key drawn small about (x, y): the key icon at k, at the same stroke.
const keyMark = (k) => ({ draw: (g, x, y) => SET.key.draw(geo(g.s / k)).map((l) => line(xform(l.d, k, x, y))), reach: () => 5 });

const SET = {
  shield: {
    label: '防护', key: 'portrait',
    plan: '主体：盾牌（平顶圆角，两侧竖直，下部两段圆弧收成圆钝的尖）',
    weights: { [P]: 1 },
    draw(g) { return [shell(shieldPath(g), { n: 'shield', role: P })]; },
    // 防护: the shield braces against a hit and springs back
    fx: { t: 'keys', on: 'all', o: [12, 12], s: [0.88, 1.05], ms: 300 }
  },
  'shield-check': {
    label: '盾牌', key: 'portrait',
    plan: '主体：对勾（说明状态，墨少但层级最高）；辅助：盾牌（与防护同一外形）',
    weights: { [P]: 0.2, [S]: 0.8 },
    draw(g) {
      const k = 1 - 0.4 * (g.s - 2), Pt = ([x, y]) => [12 + (x - 12) * k, 11.5 + (y - 11.5) * k];
      return [shell(shieldPath(g), { n: 'shield', role: S }), line(g.pl([[8.75, 11.5], [11, 13.75], [15.25, 9.5]].map(Pt)), { n: 'check', role: P, on: 'shield' })];
    },
    fx: { t: 'draw', on: ['check'] }
  },
  key: {
    nudge: [0.5, -0.5],
    label: '钥匙', key: 'live',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：圆形钥匙柄；辅助：45° 斜放的钥匙杆和两个齿（与杆垂直，离杆端留一段）。柄重杆轻，整体向右上移 0.5',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      const k = keyParts(g, { o: [8.5, 15.5], R: 6, dir: [1, -1], side: [1, 1], len: 18.4, teeth: [15, 12] });
      return [shell(k.bow, { n: 'bow', role: P }), line(k.shaft, { n: 'shaft', role: S })];
    },
    // 钥匙: pushed into the lock and pulled back
    fx: { t: 'keys', on: 'all', x: [1.1, 0], y: [-1.1, 0], ms: 360 }
  },
  'key-round': {
    nudge: [-0.5, 0.5],
    label: '密钥', key: 'live',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：较大的圆形钥匙柄（在右上）；辅助：伸向左下的钥匙杆和两个齿；细节：柄上的挂孔（实心点）。柄重杆轻，整体向左下移 0.5',
    weights: { [P]: 0.58, [S]: 0.32, [D]: 0.1 },
    draw(g) {
      const k = keyParts(g, { o: [15, 9], R: 6.5, dir: [-1, 1], side: [1, 1], len: 18, teeth: [14.5, 11.5] });
      const q = 1 - (g.s - 2) * 0.5;
      return [
        shell(k.bow, { n: 'bow', role: P }),
        solid(g.dot(15.75, 8.25, q), { n: 'hole', role: D, on: 'bow' }),
        line(k.shaft, { n: 'shaft', role: S })
      ];
    },
    fx: { t: 'keys', on: 'all', x: [-0.8, 0], y: [0.8, 0], ms: 360 }
  },
  password: {
    label: '密码', key: 'landscape', fit: 'x',
    plan: '主体：输入框；细节：三个圆点（代替字符）和光标竖线。圆点比消息的点小，给光标留出位置',
    weights: { [P]: 0.78, [D]: 0.22 },
    draw(g, ctx) {
      const { s, h } = g, d = s - 2;
      let k = 0.625 - d * 0.4, x0 = 6.5 + d * 0.5, sp = 3.5 - d * 0.4, xc = 17;
      const rd = g.dr * k;
      if (ctx?.variant === 'fill' && Math.min(sp - 2 * rd, xc - h - x0 - 2 * sp - rd) < s) {
        // Fill: the dots and the caret (holes) keep one stroke apart. The row is laid out again
        // round the same middle, the dots a little smaller if the field is too short for it.
        const r = Math.min(rd, (20 - 6 * s - 0.5) / 6), x = (x0 - rd + xc + h) / 2 - (6 * r + 4 * s) / 2;
        k *= r / rd; sp = 2 * r + s; x0 = x + r; xc = x + 6 * r + 3 * s + h;
      }
      return [
        shell(g.box(2, 5, 20, 14, 4), { n: 'field', role: P }),
        ...[0, 1, 2].map((i) => solid(g.dot(x0 + i * sp, 12, k), { n: `d${i}`, role: D, on: 'field', vc: i })),
        line(g.seg(xc, 9.5 + d, xc, 14.5 - d), { n: 'caret', role: D, on: 'field' })
      ];
    },
    // 输入密码: the dots appear one by one
    fx: { t: 'variable', on: ['d0', 'd1', 'd2'], mode: 'cumulative', step: 140 }
  },
  'lock-keyhole': {
    anchor: 'base',
    label: '锁孔', key: 'portrait',
    plan: '主体：锁体（与锁定相同）；辅助：锁梁；细节：锁孔（实心圆点加一段竖槽）',
    weights: { [P]: 0.63, [S]: 0.27, [D]: 0.1 },
    draw(g) {
      const { h } = g, d = g.s - 2, by = 10, cy = 15 + d * 0.5;
      return [
        line(arch(7 + h, 17 - h, 2 + h, by + h), { n: 'shackle', role: S }),
        shell(g.box(4, by, 16, 12, 4), { n: 'body', role: P }),
        solid(g.dot(12, cy, 0.94 - d * 0.4), { n: 'hole', role: D, on: 'body', part: 'hole' }),
        line(g.seg(12, cy, 12, 17.5 - d), { n: 'slot', role: D, on: 'body', part: 'hole' })
      ];
    },
    // 开锁: the key turns in the keyhole, then the shackle lifts and drops back
    fx: [{ t: 'rotate', on: ['hole', 'slot'], deg: 90, o: [12, 15] }, { t: 'keys', on: ['shackle'], y: [0, -1.5], ms: 560 }]
  },
  fingerprint: {
    label: '指纹', key: 'square',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：外圈纹线（拱形）；辅助：中间纹线；细节：中心短纹。三道纹线同心，两脚长短不一',
    weights: { [P]: 0.5, [S]: 0.33, [D]: 0.17 },
    draw(g) {
      return [
        line(`M4 15V12A8 8 0 0 1 ${pt([12 + 8 * Math.cos(-1.08), 12 + 8 * Math.sin(-1.08)])}M${pt([12 + 8 * Math.cos(-0.62), 12 + 8 * Math.sin(-0.62)])}A8 8 0 0 1 20 12V17`, { n: 'outer', role: P }),
        line('M8 20V12A4 4 0 0 1 16 12V18', { n: 'middle', role: S }),
        line(g.seg(12, 12, 12, 20), { n: 'core', role: D })
      ];
    },
    // 识别指纹: the ridges are traced from the centre out
    fx: { t: 'draw', on: ['core', 'middle', 'outer'], stagger: 110 }
  },
  'scan-face': {
    label: '人脸识别', key: 'square',
    plan: '主体：脸（两只眼睛和笑嘴，说明扫描的对象）；辅助：四角的取景框',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g) {
      const k = 0.9 - (g.s - 2) * 0.2;
      return [
        line(brackets(g), { n: 'frame', role: S }),
        solid(g.dot(9, 9.5, k) + g.dot(15, 9.5, k), { n: 'eyes', role: P }),
        line(g.arc(12, 11, 4.25, 45, 135), { n: 'mouth', role: P })
      ];
    },
    light: ['eyes', 'mouth'],
    // 识别: the frame closes in on the face and settles
    fx: { t: 'keys', on: ['frame'], o: [12, 12], s: [0.86, 1.04], ms: 300 }
  },
  cctv: {
    nudge: [1, 1],
    // the lens line marks off the front cap of the camera: in the fill variant it cuts the body
    ends: 'out',
    label: '监控摄像头', key: 'square',
    plan: '主体：机身（斜向下 20°）；辅助：墙上的底座和支臂；细节：镜头前沿一道线。机身在上、底座在左，重心偏左上，整体向右下移 1（保持整像素）',
    weights: { [P]: 0.5, [S]: 0.38, [D]: 0.12 },
    draw(g, ctx) {
      const { h, s } = g, c = [14, 9], W = 15.5, H = 7, t = (20 * Math.PI) / 180, v = H / 2 - h;
      // fill: at heavy strokes the lens line moves back, so the front cap it cuts off has
      // straight sides at the cut instead of starting on the round of its corners
      const uL = ctx?.variant === 'fill' ? 4 - Math.max(0, s - 2) * 1.5 : 4;
      const at = (u, w) => [c[0] + u * Math.cos(t) - w * Math.sin(t), c[1] + u * Math.sin(t) + w * Math.cos(t)];
      // the arm meets the underside of the body at x = 11, so its upright stays on a whole pixel
      const J = at((11 - c[0] + v * Math.sin(t)) / Math.cos(t), v);
      return [
        shell(g.rot(c[0], c[1], W - s, H - s, 20, 2.5 - h), { n: 'body', role: P }),
        line(g.pl([at(uL, -v), at(uL, v)]), { n: 'lens', role: D, on: 'body' }),
        line(g.seg(5, 14, 5, 21) + g.pl([[5, 18], [11, 18], J]), { n: 'mount', role: S })
      ];
    },
    // 监控: the camera pans and comes back
    fx: { t: 'wiggle', on: ['body', 'lens'], o: [11, 12.3], deg: 9, hz: 1.4 }
  },
  radar: {
    label: '雷达', key: 'circle',
    plan: '主体：外圈；辅助：内圈；细节：扫描线和中心点',
    weights: { [P]: 0.55, [S]: 0.3, [D]: 0.15 },
    draw(g, ctx) {
      const { h, s } = g, k = 1 - (g.s - 2) * 0.3, fill = ctx?.variant === 'fill';
      // Fill: the inner ring grows so the ink inside it stays one stroke wide round the centre
      // dot, and the sweep stops in the inner ring's groove (the outer band stays whole). Where
      // the sweep meets the groove the ink would end in a sharp wedge: an arc stroke round the
      // centre of a fillet (radius h, tangent to the sweep and the groove) clears the corner
      // outside the fillet, so the ink ends round.
      const ri = fill ? Math.max(6, g.dr * k + 2 * s) : 6, r = fill ? ri - h : 10 - h;
      const u = [R2, -R2], v = [R2, R2], at = ([a, b]) => [12 + a * u[0] + b * v[0], 12 + a * u[1] + b * v[1]];
      let sweep = g.seg(12, 12, 12 + r * R2, 12 - r * R2);
      if (fill) {
        const rin = ri - s, a = Math.sqrt((rin - h) ** 2 - s * s), q = (rin + h) / (rin - h);
        for (const side of [-1, 1]) sweep += `M${pt(at([a, 0]))}A${n(s)} ${n(s)} 0 0 ${side > 0 ? 1 : 0} ${pt(at([a * q, side * s * q]))}`;
      }
      return [
        shell(g.ring(12, 12, 10), { n: 'ring', role: P }),
        line(g.ring(12, 12, ri), { n: 'inner', role: S, on: 'ring' }),
        line(sweep, { n: 'sweep', role: D, on: 'ring' }),
        solid(g.dot(12, 12, k), { n: 'dot', role: D, on: 'ring' })
      ];
    },
    // 扫描: the sweep goes round once
    fx: { t: 'rotate', on: ['sweep'], deg: 360, o: [12, 12] }
  },
  siren: {
    anchor: 'base',
    label: '警报', key: 'square',
    plan: '主体：灯罩（拱形）；辅助：底座横线和三道光线；细节：灯罩里的竖线',
    weights: { [P]: 0.46, [S]: 0.46, [D]: 0.08 },
    draw(g) {
      const d = g.s - 2, ray = (a, r0, r1) => { const u = [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)]; return g.span(12 + r0 * u[0], 14 + r0 * u[1], 12 + r1 * u[0], 14 + r1 * u[1]); };
      return [
        shell('M7 20V14A5 5 0 0 1 17 14V20Z', { n: 'dome', role: P }),
        line(g.seg(12, 13.5, 12, 16.5 - d), { n: 'glint', role: D, on: 'dome' }),
        line(g.span(3, 20, 21, 20), { n: 'base', role: S }),
        line(ray(-135, 7.5, 10.75), { n: 'r0', role: S, vc: 0 }),
        line(g.span(12, 3, 12, 6.5), { n: 'r1', role: S, vc: 1 }),
        line(ray(-45, 7.5, 10.75), { n: 'r2', role: S, vc: 2 })
      ];
    },
    light: ['glint', 'r0', 'r1', 'r2'],
    // 警报: the light flashes while hovered
    fx: { t: 'variable', on: ['r0', 'r1', 'r2'], mode: 'iterative', step: 120 }
  },
  'badge-verified': {
    label: '认证徽章', key: 'circle',
    plan: '主体：对勾；辅助：花边徽章（八个圆角尖，内角也倒圆）',
    weights: { [P]: 0.2, [S]: 0.8 },
    draw(g) {
      const { h } = g, Ro = 10.8 - h, Ri = 8.4 - h, pts = [];
      for (let i = 0; i < 16; i++) { const a = ((i * 22.5 - 90) * Math.PI) / 180, r = i % 2 ? Ri : Ro; pts.push([12 + r * Math.cos(a), 12 + r * Math.sin(a)]); }
      const k = 0.86 - 0.3 * (g.s - 2), Pt = ([x, y]) => [12 + (x - 12) * k, 12.2 + (y - 12.2) * k];
      return [
        shell(g.polygon(pts, pts.map((_, i) => (i % 2 ? 1.6 : 1.8))), { n: 'seal', role: S }),
        line(g.pl([[8.2, 12.3], [10.9, 15], [15.8, 9.6]].map(Pt)), { n: 'check', role: P, on: 'seal' })
      ];
    },
    // 认证: the seal turns an eighth of a turn (landing on itself) and the check is drawn
    fx: [{ t: 'rotate', on: ['seal'], deg: 45 }, { t: 'draw', on: ['check'] }]
  },
  detective: {
    label: '隐身侦探', key: 'landscape', fit: 'x',
    plan: '主体：礼帽（帽身和帽檐）；辅助：墨镜（两片实心镜片和一条直的鼻梁）。镜片画成实心：这一套里车轮都是圆环，实心镜片不会读成车轮。礼帽占六成，墨镜虽是实心但面积小，约占四成',
    weights: { [P]: 0.58, [S]: 0.42 },
    draw(g) {
      const { h } = g, top = 4 + h, ly = 15, lr = 4, by = 11;
      // a lens: flat on top, round below (dark glasses)
      const lens = (x) => `M${n(x - lr)} ${ly}H${n(x + lr)}A${lr} ${lr} 0 0 1 ${n(x - lr)} ${ly}Z`;
      return [
        shell(g.polygon([[6, by], [7.6, top], [16.4, top], [18, by]], [0.5, 2 - h * 0.5, 2 - h * 0.5, 0.5]), { n: 'crown', role: P }),
        line(g.span(2, by, 22, by), { n: 'brim', role: P }),
        solid(lens(7) + lens(17), { n: 'lenses', role: S }),
        line(g.seg(11, ly + h, 13, ly + h), { n: 'bridge', role: S })
      ];
    },
    // 侦探: tips the hat and puts it back
    fx: { t: 'keys', on: ['crown', 'brim'], o: [12, 11], y: [-1.5, 0.2], r: [-7, 0] }
  },
  'shield-plus': shieldWith('添加防护', '加号', { [P]: 0.2, [S]: 0.8 }, (g, k) => [line(g.seg(12, 11 - 3.5 * k, 12, 11 + 3.5 * k) + g.seg(12 - 3.5 * k, 11, 12 + 3.5 * k, 11), { n: 'plus' })], { t: 'rotate', on: ['plus'], deg: 90, o: [12, 11] }),
  'shield-minus': shieldWith('减少防护', '减号', { [P]: 0.12, [S]: 0.88 }, (g, k) => [line(g.seg(12 - 3.5 * k, 11, 12 + 3.5 * k, 11), { n: 'minus' })], { t: 'draw', on: ['minus'] }, { allow: { primary: '盾牌里的减号只有一笔，约占一成；层级仍是最高' } }),
  'shield-x': shieldWith('防护失败', '叉号', { [P]: 0.2, [S]: 0.8 }, (g, k) => [line(g.seg(12 - 2.6 * k, 11.5 - 2.6 * k, 12 + 2.6 * k, 11.5 + 2.6 * k) + g.seg(12 + 2.6 * k, 11.5 - 2.6 * k, 12 - 2.6 * k, 11.5 + 2.6 * k), { n: 'x' })], { t: 'rotate', on: ['x'], deg: 90, o: [12, 11.5] }),
  'shield-alert': shieldWith('安全警告', '感叹号（竖和点）', { [P]: 0.14, [S]: 0.86 }, (g) => [line(g.span(12, 6.5, 12, 11.5), { n: 'bar' }), solid(g.dot(12, 14.75, 0.85 - (g.s - 2) * 0.3), { n: 'dot' })], { t: 'wiggle', on: ['bar', 'dot'], o: [12, 16], deg: 12, hz: 3 }, { allow: { primary: '盾牌里的感叹号只能这么大，约占一成半；层级仍是最高' } }),
  'shield-user': shieldWith('账户安全', '人像（头和肩，肩线两端接到盾牌两侧，像被盾牌裁切）', { [P]: 0.4, [S]: 0.6 }, (g, k, ctx) => {
    // the shoulders: an arc about (12, cy), from where it meets the shield's lower left arc (its
    // centre line, a circle about (x0 + R, 11.5)) over the top to the mirror point on the right
    const { h, s } = g, cy = 20, r = 5.5, x0 = 4 + h, dx = 12 - x0, dy = 22 - h - 11.5, R = (dx * dx + dy * dy) / (2 * dx);
    const f = (t) => Math.hypot(12 + r * Math.cos((t * Math.PI) / 180) - x0 - R, cy + r * Math.sin((t * Math.PI) / 180) - 11.5) - R;
    let lo = 180, hi = 270;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
    const HR = 2.75 * Math.min(k, 1) + 0.25, hy = ctx?.variant === 'fill' ? Math.min(9, cy - r - h - s - HR) : 9;
    return [shell(g.ring(12, hy, HR), { n: 'head' }), line(g.arc(12, cy, r, lo, 540 - lo), { n: 'body', ends: 'out' })];
  }, { t: 'bounce', on: ['head'], o: [12, 12], amp: 0.8 }, { allow: { sliver: '面性中肩膀切出盾牌的两侧，与外形相交处是切口的锐角，不是碎块（与头像相同）' } }),
  'shield-lock': shieldWith('安全锁', '锁（锁体和锁梁）', { [P]: 0.29, [S]: 0.71 }, (g, k, ctx) => {
    // fill: at heavy weights the shackle's legs and the body widen and the shackle rises, so the
    // ink inside the shackle stays a stroke wide
    const { h } = g, fill = ctx?.variant === 'fill', w = fill ? Math.max(2, g.s) : 2, top = 6 + h - (fill ? Math.max(0, g.s - 2) * 2 : 0);
    return [line(arch(12 - w, 12 + w, top, 10 + h), { n: 'shackle' }), shell(g.box(11 - w, 10, 2 + 2 * w, 5, 1.5), { n: 'body' })];
  }, { t: 'keys', on: ['shackle'], y: [-1.2, 0.3], ms: 260 }),
  'shield-search': shieldWith('安全扫描', '放大镜', { [P]: 0.3, [S]: 0.7 }, (g, k) => {
    const c = [11.5, 10], R = 3 * k + 0.25, e = R * Math.SQRT1_2, end = 11.5 + 3 * k;
    return [shell(g.ring(...c, R), { n: 'lens' }), line(g.seg(c[0] + e - g.h * 0.3, c[1] + e - g.h * 0.3, end, end - 1.5), { n: 'handle' })];
  }, { t: 'orbit', on: ['lens', 'handle'], R: 0.8 }),
  'lock-keyhole-open': {
    anchor: 'base',
    label: '锁孔已解锁', key: 'portrait',
    plan: '同锁孔，锁梁右脚抬起离开锁体（与解锁相同）',
    weights: { [P]: 0.64, [S]: 0.26, [D]: 0.1 },
    draw(g, ctx) {
      const { h } = g, x0 = 7 + h, x1 = 17 - h, r = (x1 - x0) / 2, top = 2 + h;
      return [
        line(`M${n(x0)} ${n(10 + h)}V${n(top + r)}A${n(r)} ${n(r)} 0 0 1 ${n(x1)} ${n(top + r)}V${n(top + r + 1.3)}`, { n: 'shackle-open', role: S }),
        ...SET['lock-keyhole'].draw(g, ctx).filter((l) => l.n !== 'shackle')
      ];
    },
    fx: { t: 'keys', on: ['shackle-open'], y: [0.9, -0.9], ms: 300 },
    enter: { t: 'from', on: ['shackle-open'], y: 1.6, hz: 2.2, z: 0.42 },
    swap: { icon: 'lock-keyhole', act: true }
  },
  vault: {
    label: '保险箱', key: 'square',
    plan: '主体：箱体（方形）；辅助：下面两只脚；细节：箱门上的转盘（圆环）',
    weights: { [P]: 0.7, [S]: 0.05, [D]: 0.25 },
    draw(g) {
      const { h } = g;
      return [
        line(g.seg(7, 18, 7, 21 - h) + g.seg(17, 18, 17, 21 - h), { n: 'feet', role: S }),
        shell(g.box(3, 3, 18, 16, 3.5), { n: 'box', role: P }),
        shell(g.ring(12, 11, 4.5 - Math.max(0, g.s - 2) * 0.5), { n: 'dial', role: D, on: 'box' })
      ];
    },
    // 开锁: the dial turns back and forth
    fx: { t: 'wiggle', on: ['dial'], o: [12, 11], deg: 25, hz: 2 }
  },
  'brick-wall': {
    label: '防火墙', key: 'square',
    ends: 'out', // the joints split the wall into bricks
    plan: '主体：墙（方形）；细节：两道横缝和错开的竖缝（把墙分成砖块）',
    weights: { [P]: 0.48, [D]: 0.52 },
    draw(g) {
      // one layer per joint, so the fill can run each one out through the edge
      const { h } = g, a = 3 + h, b = 21 - h, rows = [[a, 9, b, 9], [a, 15, b, 15]], joints = [[12, a, 12, 9], [8, 9, 8, 15], [16, 9, 16, 15], [12, 15, 12, b]];
      return [
        shell(g.box(3, 3, 18, 18, 3.5), { n: 'wall', role: P }),
        ...rows.map((q, i) => line(g.seg(...q), { n: `r${i}`, role: D, on: 'wall' })),
        ...joints.map((q, i) => line(g.seg(...q), { n: `j${i}`, role: D, on: 'wall' }))
      ];
    },
    fx: { t: 'draw', on: ['r0', 'r1', 'j0', 'j1', 'j2', 'j3'], stagger: 60 }
  },
  'scan-line': {
    label: '扫描', key: 'square',
    plan: '主体：中间的扫描线；辅助：四角的取景框（与人脸识别相同）',
    weights: { [P]: 0.2, [S]: 0.8 },
    draw(g) { return [line(brackets(g), { n: 'frame', role: S }), line(g.span(7, 12, 17, 12), { n: 'line', role: P })]; },
    light: ['line'],
    // 扫描: the line runs up and down the frame
    fx: { t: 'keys', on: ['line'], y: [-4, 4, 0], ms: 700 }
  },
  'scan-eye': {
    label: '虹膜识别', key: 'square',
    plan: '主体：眼睛（杏仁形眼眶和实心瞳孔）；辅助：四角的取景框（与人脸识别相同）',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g, w = 5.75, sag = 4, R = (w * w + sag * sag) / (2 * sag);
      return [
        line(brackets(g), { n: 'frame', role: S }),
        shell(`M${12 - w} 12A${R} ${R} 0 0 1 ${12 + w} 12A${R} ${R} 0 0 1 ${12 - w} 12Z`, { n: 'eye', role: P }),
        solid(g.dot(12, 12, 0.9 - (g.s - 2) * 0.4), { n: 'pupil', role: P, on: 'eye' })
      ];
    },
    light: ['eye', 'pupil'],
    fx: { t: 'keys', on: ['frame'], o: [12, 12], s: [0.86, 1.04], ms: 300 }
  },
  'two-factor': {
    label: '双重验证', key: 'portrait', fit: 'y',
    plan: '主体：手机（竖放的圆角矩形）；细节：屏幕中间的锁（锁体和锁梁）',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g, ctx) {
      // fill: at heavy weights the shackle widens and rises, as in shield-lock
      const { h } = g, fill = ctx?.variant === 'fill', w = fill ? Math.max(2, g.s) : 2, top = 7 + h - (fill ? Math.max(0, g.s - 2) * 2 : 0);
      return [
        shell(g.box(5, 2, 14, 20, 3.75), { n: 'phone', role: P }),
        line(arch(12 - w, 12 + w, top, 11 + h), { n: 'shackle', role: D, on: 'phone' }),
        shell(g.box(11 - w, 11, 2 + 2 * w, 5, 1.5), { n: 'lock', role: D, on: 'phone' })
      ];
    },
    fx: { t: 'keys', on: ['shackle'], y: [-1.2, 0.3], ms: 260 },
    allow: { keyline: '手机本身窄' }
  },
  'badge-alert': {
    label: '认证异常', key: 'circle',
    plan: '主体：感叹号（竖和点）；辅助：花边徽章（与认证徽章相同）',
    weights: { [P]: 0.14, [S]: 0.86 },
    draw(g) {
      return [SET['badge-verified'].draw(g)[0], line(g.span(12, 6.75, 12, 12.75), { n: 'bar', role: P, on: 'seal' }), solid(g.dot(12, 16, 0.85 - (g.s - 2) * 0.3), { n: 'dot', role: P, on: 'seal' })];
    },
    fx: [{ t: 'rotate', on: ['seal'], deg: 45 }, { t: 'wiggle', on: ['bar', 'dot'], o: [12, 17], deg: 12, hz: 3 }],
    allow: { primary: '徽章里的感叹号只能这么大，约占一成半；层级仍是最高' }
  },
  'badge-x': {
    label: '认证失败', key: 'circle',
    plan: '主体：叉号；辅助：花边徽章（与认证徽章相同）',
    weights: { [P]: 0.2, [S]: 0.8 },
    draw(g) {
      const k = 3 - 0.5 * (g.s - 2);
      return [SET['badge-verified'].draw(g)[0], line(g.seg(12 - k, 12 - k, 12 + k, 12 + k) + g.seg(12 + k, 12 - k, 12 - k, 12 + k), { n: 'x', role: P, on: 'seal' })];
    },
    fx: [{ t: 'rotate', on: ['seal'], deg: 45 }, { t: 'rotate', on: ['x'], deg: 90, o: [12, 12] }]
  },
  'scan-search': {
    label: '扫描查找', key: 'square',
    plan: '主体：放大镜（镜片和手柄）；辅助：四角的取景框（与人脸识别相同）',
    weights: { [P]: 0.4, [S]: 0.6 },
    draw(g) {
      const c = [11.25, 11.25], R = 3.75 - (g.s - 2) * 0.3, e = (R - g.h) * Math.SQRT1_2;
      return [line(brackets(g), { n: 'frame', role: S }), shell(g.ring(...c, R), { n: 'lens', role: P }), line(g.seg(c[0] + e, c[1] + e, 15.5, 15.5), { n: 'handle', role: P })];
    },
    light: ['lens', 'handle'],
    fx: { t: 'orbit', on: ['lens', 'handle'], R: 0.9 }
  },
  'scan-user': {
    label: '扫描人像', key: 'square',
    plan: '主体：人像（头和肩）；辅助：四角的取景框（与人脸识别相同）',
    weights: { [P]: 0.4, [S]: 0.6 },
    draw(g) {
      const k = 1 - (g.s - 2) * 0.3;
      return [line(brackets(g), { n: 'frame', role: S }), shell(g.ring(12, 8.5, 2.75 * Math.min(k, 1) + 0.25), { n: 'head', role: P }), line(g.arc(12, 19, 5, 215 + Math.max(0, g.s - 2) * 12, 325 - Math.max(0, g.s - 2) * 12), { n: 'body', role: P })];
    },
    light: ['head', 'body'],
    fx: { t: 'keys', on: ['frame'], o: [12, 12], s: [0.86, 1.04], ms: 300 }
  },
  'key-card': {
    label: '门禁卡', key: 'landscape', fit: 'x',
    plan: '主体：卡片；细节：上方的挂孔（短槽）和下方的一行字',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g) {
      return [
        shell(g.box(2, 4, 20, 16, 4), { n: 'card', role: P }),
        line(g.seg(10, 9, 14, 9), { n: 'slot', role: D, on: 'card' }),
        line(g.seg(7, 15, 13, 15), { n: 'text', role: D, on: 'card' })
      ];
    },
    // 刷卡: the card is swiped across
    fx: { t: 'keys', on: 'all', x: [1.5, -0.3], r: [-6, 0], ms: 320 }
  },
  'key-skeleton': {
    nudge: [0.5, 0],
    label: '老式钥匙', key: 'landscape', fit: 'x',
    light: [], // one object (GUIDE.md §4.2)
    plan: '主体：圆形钥匙柄；辅助：横放的钥匙杆和下面的两个齿。柄重杆轻，整体右移 0.5',
    weights: { [P]: 0.45, [S]: 0.55 },
    draw(g) {
      const { h } = g, R = 4.5;
      return [shell(g.ring(2.5 + R, 12, R), { n: 'bow', role: P }), line(g.seg(7 + R - h, 12, 22.5 - h, 12) + g.seg(18, 12, 18, 16) + g.seg(21.5 - h, 12, 21.5 - h, 15), { n: 'shaft', role: S })];
    },
    fx: { t: 'keys', on: 'all', x: [1.1, 0], ms: 360 },
    allow: { pixel: '钥匙整体右移 0.5，齿的竖线随之落在半像素上' }
  },
  'shield-heart': shieldWith('安心保障', '心形（喜欢的心形缩小到盾牌里）', { [P]: 0.3, [S]: 0.7 }, (g, k) => {
    const q = 0.45 * Math.min(k, 1);
    return [shell(xform(heart(geo(g.s / q)), q, 12, 10.5), { n: 'heart' })];
  }, { t: 'beat', on: ['heart'], o: [12, 11] }),
  'shield-keyhole': shieldWith('安全锁孔', '锁孔（实心圆点和竖槽，与锁孔相同）', { [P]: 0.15, [S]: 0.85 }, (g) => {
    const d = g.s - 2, cy = 9.5 + d * 0.5;
    return [solid(g.dot(12, cy, 1.1 - d * 0.4), { n: 'hole', part: 'hole' }), line(g.seg(12, cy, 12, 14 - d), { n: 'slot', part: 'hole' })];
  }, { t: 'rotate', on: ['hole', 'slot'], deg: 90, o: [12, 10] }, { allow: { primary: '盾牌里的锁孔墨少，约占一成半；层级仍是最高' } })
};

export default {
  ...SET,
  'shield-off': off({ ...slash(SHIELD, { label: '防护关闭' }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'shield', { t: 'keys', on: ['shield'], o: [12, 12], s: [0.88], ms: 240 }),
  'lock-off': off({ ...offFill(slash(LOCK_PLAIN, { label: '取消锁定' })), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'lock', { t: 'keys', on: ['shackle'], y: [-1.5], ms: 260 }),
  'password-check': { ...notch(corner(SET.password, 'check', { label: '密码已验证', drop: ['caret'] })), fx: MARK_FX.check },
  'cctv-off': off({ ...offFill(slash(SET.cctv, { label: '监控关闭' })), allow: { keyline: '斜线按方框画，摄像头本身向右下移 1', sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'cctv', { t: 'keys', on: ['body', 'lens'], o: [11, 12.3], r: [12], ms: 260 }),
  'key-square': { ...enclose(SET.key, 'square', { label: '密钥（方形）', k: 0.46 }), allow: { clear: '框内图标整体缩小，粗字重下钥匙杆离框较近（与收藏（方形）相同）' }, fx: { t: 'keys', on: ['bow', 'shaft'], x: [0.8, 0], y: [-0.8, 0], ms: 360 } },
  passkey: { ...notch(corner(USER, keyMark(0.45), { label: '通行密钥' })), fx: { t: 'keys', on: ['badge'], x: [0.8, 0], y: [-0.8, 0], ms: 360 } }
};
