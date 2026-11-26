// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// science: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: atom flask beaker dna microscope telescope test-tube satellite
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { slash } from '../kit.mjs';
import { off, offFill } from '../variants.mjs';

// A point on an axis turned by deg about o (telescope, satellite).
const tilt = (o, deg) => { const a = (deg * Math.PI) / 180, c = Math.cos(a), s0 = Math.sin(a); return ([u, v]) => [o[0] + u * c - v * s0, o[1] + u * s0 + v * c]; };
const pt = ([x, y]) => `${n(x)} ${n(y)}`;

// Glassware (flask, beaker, test tube) is one family: the stroke is the glass wall, a rim line at
// the mouth stands out 2 past the walls on each side, and the liquid is one level line at y 14
// that meets both walls.
const RIM = 2, LEVEL = 14;
const rim = (g, x0, x1) => line(g.span(x0 - RIM, 2 + g.h, x1 + RIM, 2 + g.h), { n: 'rim', role: P });

// Points along an arc (clockwise from a0 to a1, degrees).
const arcPts = (cx, cy, r, a0, a1, steps = 16) => Array.from({ length: steps + 1 }, (_, i) => {
  const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});
// A flame, tip up: a circle and the two lines tangent to it from the tip (centre lines).
function flame(g, cx, cy, R, tip) {
  const r = R - g.h, ty = tip + g.h * 1.3, b = Math.acos(r / (cy - ty));
  const Pt = (a) => `${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
  return `M${n(cx)} ${n(ty)}L${Pt(-Math.PI / 2 - b)}A${n(r)} ${n(r)} 0 1 0 ${Pt(-Math.PI / 2 + b)}Z`;
}

const SET = {
  atom: {
    label: '原子', key: 'circle',
    plan: '主体：两条椭圆轨道（±45° 交叉）；细节：原子核（实心点，随字重缩小，与轨道保持间距）。三条轨道在中心交叉过密，24 px 下读成一团',
    weights: { [P]: 0.9, [D]: 0.1 },
    draw(g) {
      const { h, s } = g, rx = 10 - h, ry = 4;
      const orbit = (deg) => {
        const a = (deg * Math.PI) / 180, p1 = [12 + rx * Math.cos(a), 12 + rx * Math.sin(a)], p2 = [24 - p1[0], 24 - p1[1]];
        return `M${pt(p1)}A${n(rx)} ${ry} ${deg} 1 1 ${pt(p2)}A${n(rx)} ${ry} ${deg} 1 1 ${pt(p1)}Z`;
      };
      return [
        line(orbit(45) + orbit(135), { n: 'orbits', role: P }),
        solid(g.dot(12, 12, 0.9 - (s - 2) * 0.5), { n: 'core', role: D })
      ];
    },
    // a quarter turn brings the two orbits back onto each other
    fx: { t: 'rotate', on: ['orbits'], deg: 90, o: [12, 12] },
    allow: { keyline: '两条轨道斜放，四边只到 3.6..20.4' }
  },
  flask: {
    anchor: 'base',
    label: '烧瓶', key: 'portrait',
    ends: 'in',
    plan: '主体：瓶身（窄颈，斜壁，平底）和瓶口的沿；细节：液面线（与瓶壁相连）',
    weights: { [P]: 0.85, [D]: 0.15 },
    draw(g) {
      const { h } = g, top = 2 + h, nl = 10, nr = 14, sh = 9, xl = 3.2 + h, xr = 20.8 - h, yb = 22 - h;
      const at = (y) => nl - ((y - sh) * (nl - xl)) / (yb - sh);
      return [
        shell(g.polygon([[nl, top], [nr, top], [nr, sh], [xr, yb], [xl, yb], [nl, sh]], [0.5, 0.5, 1.2, 1.6, 1.6, 1.2]), { n: 'flask', role: P }),
        rim(g, nl - h, nr + h),
        line(g.seg(at(LEVEL), LEVEL, 24 - at(LEVEL), LEVEL), { n: 'liquid', role: D, on: 'flask' })
      ];
    },
    // swirled: the flask rocks on its base
    fx: { t: 'wiggle', on: 'all', o: [12, 22], deg: 9, hz: 2.4 }
  },
  beaker: {
    anchor: 'base',
    label: '烧杯', key: 'portrait',
    ends: 'out',
    plan: '主体：杯身（直壁，下方圆角）和杯口的沿；细节：液面线（与杯壁相连）',
    weights: { [P]: 0.84, [D]: 0.16 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(6, 2, 12, 20, [0.75, 0.75, 3.5, 3.5]), { n: 'beaker', role: P }),
        rim(g, 6, 18),
        line(g.seg(6 + h, LEVEL, 18 - h, LEVEL), { n: 'liquid', role: D, on: 'beaker' })
      ];
    },
    // filling: the level rises and settles back
    fx: { t: 'keys', on: ['liquid'], y: [-3], ms: 360 }
  },
  'test-tube': {
    label: '试管', key: 'portrait', fit: 'y',
    ends: 'out',
    plan: '主体：管身（直壁，底部半圆）和管口的沿；细节：液面线（与管壁相连）',
    weights: { [P]: 0.88, [D]: 0.12 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(8, 2, 8, 20, [0.75, 0.75, 4, 4]), { n: 'tube', role: P }),
        rim(g, 8, 16),
        line(g.seg(8 + h, LEVEL, 16 - h, LEVEL), { n: 'liquid', role: D, on: 'tube' })
      ];
    },
    // shaken: held at the mouth, the tube swings
    fx: { t: 'wiggle', on: 'all', o: [12, 3], deg: 10, hz: 3 }
  },
  dna: {
    label: 'DNA 双螺旋', key: 'live',
    plan: '主体：两条螺旋链（斜放，各是两段圆弧，在中间交叉成约 80°）；辅助：四条横档（垂直于链的走向，两端留出链头，不封口；四条加起来与链的墨量相当）',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      // Along an axis turned -45°: u along the helix, v across it. Each strand runs from one side
      // to the other through the centre; the arcs leave the ends square to the axis.
      const L = 9.5, A = 3.5, R = (A * A + L * L) / (2 * A), Pt = tilt([12, 12], -45);
      const v = (u) => (u <= 0 ? R - A - Math.sqrt(R * R - (u + L) ** 2) : A - R + Math.sqrt(R * R - (u - L) ** 2));
      const strand = (k) => `M${pt(Pt([-L, -k * A]))}A${n(R)} ${n(R)} 0 0 ${k > 0 ? 1 : 0} 12 12A${n(R)} ${n(R)} 0 0 ${k > 0 ? 0 : 1} ${pt(Pt([L, k * A]))}`;
      const rung = (u) => `M${pt(Pt([u, v(u)]))}L${pt(Pt([u, -v(u)]))}`;
      return [
        line(strand(1) + strand(-1), { n: 'strands', role: P }),
        line([-7, -3.5, 3.5, 7].map(rung).join(''), { n: 'rungs', role: S })
      ];
    },
    // the helix spins half a turn, landing on itself
    fx: { t: 'rotate', on: 'all', deg: 180, o: [12, 12] }
  },
  microscope: {
    anchor: 'base',
    label: '显微镜', key: 'square',
    plan: '主体：镜筒；辅助：弯臂（半圆，从镜筒侧面到底座）和底座；细节：载物台（镜筒下方一条短线）',
    weights: { [P]: 0.34, [S]: 0.54, [D]: 0.12 },
    draw(g) {
      const { h } = g;
      return [
        line(g.span(3, 21 - h, 21, 21 - h), { n: 'base', role: S }),
        line(g.arc(13, 14.5 - h / 2, 6.5 - h / 2, -90, 90), { n: 'arm', role: S }),
        line(g.span(5, 16, 14, 16), { n: 'stage', role: D }),
        shell(g.box(7, 3, 6, 10, 2), { n: 'tube', role: P })
      ];
    },
    // focusing: the tube comes down toward the stage and back
    fx: { t: 'keys', on: ['tube'], y: [1, -0.4], ms: 360 }
  },
  telescope: {
    anchor: 'base',
    label: '天文望远镜', key: 'square',
    plan: '主体：斜指天空的镜筒；辅助：后端的目镜和三脚架',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g) {
      const { h, s } = g, L = 16, W = 6, deg = -30, o = [12.9, 8.75], Pt = tilt(o, deg), ex = 3;
      const pv = Pt([0.5, W / 2 - h]);
      return [
        line(g.seg(pv[0], pv[1], 7.5, 21 - h) + g.seg(pv[0], pv[1], 16.5, 21 - h), { n: 'tripod', role: S }),
        shell(g.rot(...Pt([-L / 2 - ex / 2 + s / 2, 0]), ex + s - s, 3.6 - s, deg, 0.4), { n: 'eye', role: S }),
        shell(g.rot(o[0], o[1], L - s, W - s, deg, 1.5 - h), { n: 'tube', role: P })
      ];
    },
    light: ['tripod'], // the eyepiece belongs to the tube: one tone with it
    // aiming: the tube tips up on the tripod and settles
    fx: { t: 'keys', on: ['tube', 'eye'], o: [12.9, 8.75], r: [-8, 3] }
  },
  satellite: {
    nudge: [-0.3, -0.4],
    label: '卫星', key: 'live',
    ends: 'out',
    plan: '主体：两块太阳能板（宽板，沿 45° 排开）；辅助：机身和连杆；细节：板上的中线（接着连杆）、天线和一道信号弧（在空出的右下角）',
    weights: { [P]: 0.48, [S]: 0.22, [D]: 0.3 },
    draw(g) {
      const { h, s } = g, c = [11.7, 11.6], deg = -45, Pt = tilt(c, deg), bw = 5.5, p0 = 4.6, p1 = 9.9, pw = 9, ant = bw / 2 + 1.4;
      const panel = (k) => g.polygon([[k * (p0 + h), -pw / 2 + h], [k * (p1 - h), -pw / 2 + h], [k * (p1 - h), pw / 2 - h], [k * (p0 + h), pw / 2 - h]].map(Pt), 1.25 - h);
      return [
        shell(g.rot(c[0], c[1], bw - s, bw - s, deg, 1.5 - h), { n: 'body', role: S, part: 'sat' }),
        line(g.pl([Pt([bw / 2 - h, 0]), Pt([p0 + h, 0])]) + g.pl([Pt([-bw / 2 + h, 0]), Pt([-p0 - h, 0])]), { n: 'arms', role: S, part: 'sat' }),
        shell(panel(1), { n: 'p1', role: P }),
        shell(panel(-1), { n: 'p2', role: P }),
        line(g.pl([Pt([p0 + h, 0]), Pt([p1 - h, 0])]), { n: 'c1', role: D, on: 'p1' }),
        line(g.pl([Pt([-p0 - h, 0]), Pt([-p1 + h, 0])]), { n: 'c2', role: D, on: 'p2' }),
        line(g.pl([Pt([0, bw / 2 - h]), Pt([0, ant])]), { n: 'antenna', role: D, part: 'sat' }),
        line(g.arc(c[0], c[1], 8.25, 45 - 22, 45 + 22), { n: 'signal', role: D })
      ];
    },
    light: ['signal'],
    // in orbit: the satellite circles while its signal blinks
    fx: [{ t: 'orbit', on: ['body', 'arms', 'p1', 'p2', 'c1', 'c2', 'antenna'], R: 0.8 }, { t: 'keys', on: ['signal'], a: [0.2, 1, 0.2, 1], ms: 700 }]
  },
  molecule: {
    label: '分子', key: 'square',
    light: [],
    plan: '主体：中间的原子（圆环）；辅助：三个小原子（圆环，相隔 120°）和连向它们的键（短线）',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g) {
      const { h } = g, c = [12, 13.25], R = 3.5, r = 2.5, d = 8;
      const at = (deg, k) => [c[0] + k * Math.cos((deg * Math.PI) / 180), c[1] + k * Math.sin((deg * Math.PI) / 180)];
      const angles = [-90, 30, 150];
      return [
        line(angles.map((a) => { const p = at(a, R - h), q = at(a, d - r + h); return g.seg(p[0], p[1], q[0], q[1]); }).join(''), { n: 'bonds', role: S, part: 'm' }),
        shell(g.ring(c[0], c[1], R), { n: 'core', role: P, part: 'm' }),
        ...angles.map((a, i) => shell(g.ring(...at(a, d), r), { n: `a${i}`, role: S, part: 'm' }))
      ];
    },
    // 振动: the molecule turns a third of a turn, landing on itself
    fx: { t: 'rotate', on: 'all', deg: 120, o: [12, 13.25] },
    allow: { keyline: '三个原子按 120° 排开，左右和下方只到 2.6..21.4、19.75' }
  },
  orbit: {
    label: '轨道', key: 'circle',
    plan: '主体：中间的星体（圆环）；辅助：外圈的轨道（两段圆弧，在两颗行星处断开）和轨道上的两颗行星（小圆环）',
    weights: { [P]: 0.2, [S]: 0.8 },
    draw(g) {
      const { h } = g, R = 10 - h, r = 2.25, d = ((r + g.clear + h) / R) * (180 / Math.PI), p = (a) => [12 + R * Math.cos((a * Math.PI) / 180), 12 + R * Math.sin((a * Math.PI) / 180)];
      return [
        line(g.arc(12, 12, R, -45 + d, 135 - d) + g.arc(12, 12, R, 135 + d, 315 - d), { n: 'path', role: S, part: 'orbit' }),
        shell(g.ring(...p(-45), r), { n: 'p1', role: S, part: 'orbit' }),
        shell(g.ring(...p(135), r), { n: 'p2', role: S, part: 'orbit' }),
        shell(g.ring(12, 12, 3.5), { n: 'sun', role: P })
      ];
    },
    // 公转: the planets go half way round, landing on each other's places
    fx: { t: 'rotate', on: ['path', 'p1', 'p2'], deg: 180, o: [12, 12] }
  },
  'petri-dish': {
    label: '培养皿', key: 'circle',
    plan: '主体：圆形的皿（圆环）；细节：皿里三个菌落（大小不一的实心点）和左上一道反光（短弧）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) {
      const { s } = g, k = 1 - Math.max(0, s - 2) * 0.3;
      return [
        shell(g.ring(12, 12, 10), { n: 'dish', role: P }),
        line(g.arc(12, 12, 10 - s - g.h - g.clear, 200, 250), { n: 'shine', role: D, on: 'dish' }),
        solid(g.dot(14.5, 10, 1.1 * k), { n: 'c0', role: D, on: 'dish', vc: 0 }),
        solid(g.dot(9.5, 15, 0.9 * k), { n: 'c1', role: D, on: 'dish', vc: 1 }),
        solid(g.dot(15, 15.5, 0.7 * k), { n: 'c2', role: D, on: 'dish', vc: 2 })
      ];
    },
    // 培养: the colonies grow, one after another
    fx: { t: 'variable', on: ['c0', 'c1', 'c2'], mode: 'cumulative', step: 200 }
  },
  pi: {
    nudge: [0, 1],
    label: '圆周率', key: 'square',
    light: [],
    plan: '主体：字母 π（顶上的横、左边的直腿、右边下端弯出去的腿），一个字形。横在上偏重，整体下移 1',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g;
      return [
        line(`M${n(3 + h)} 8A3 3 0 0 1 ${n(6 + h)} 5H${n(21 - h)}`, { n: 'bar', role: P }),
        line(g.seg(9, 5, 9, 22 - h), { n: 'leg1', role: P }),
        line(`M15 5V18A3 3 0 0 0 18 21H${n(21 - h)}`, { n: 'leg2', role: P })
      ];
    },
    // 书写: the strokes are written in order
    fx: { t: 'draw', on: ['bar', 'leg1', 'leg2'], stagger: 120 }
  },
  sigma: {
    label: '求和', key: 'square', fit: 'y',
    light: [],
    plan: '主体：字母 Σ（一笔，上下两横的右端略向内折）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g;
      return [line(g.pl([[18, 6.5], [18, 4], [6, 4], [12.5, 12], [6, 20], [18, 20], [18, 17.5]]), { n: 'sigma', role: P })];
    },
    // 求和: the sign is written in one stroke
    fx: { t: 'draw', on: ['sigma'] }
  },
  'square-root': {
    label: '平方根', key: 'square',
    light: [],
    plan: '主体：根号（左边短横、下折的钩、长斜线和上面的横线，一笔）',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g;
      return [line(g.pl([[3 + h, 12], [6, 12], [9.5, 21 - h], [14, 4], [21 - h, 4]]), { n: 'root', role: P })];
    },
    // 开方: the sign is written in one stroke
    fx: { t: 'draw', on: ['root'] }
  },
  'bunsen-burner': {
    anchor: 'base',
    label: '本生灯', key: 'portrait', fit: 'y',
    plan: '主体：灯管上方的火焰（水滴形）；辅助：灯管（竖线）和底座（实心横条）',
    weights: { [P]: 0.4, [S]: 0.6 },
    draw(g) {
      return [
        line(g.seg(12, 12.5, 12, 19), { n: 'tube', role: S, part: 'burner' }),
        solid(g.area(5, 19, 14, 3, 1.5), { n: 'base', role: S, part: 'burner' }),
        shell(flame(g, 12, 6.5, 3.5, 2), { n: 'flame', role: P })
      ];
    },
    // 燃烧: the flame flickers
    fx: { t: 'keys', on: ['flame'], o: [12, 10], s: [0.86, 1.08, 0.94], ms: 520 }
  },
  'flask-round': {
    anchor: 'base',
    label: '圆底烧瓶', key: 'portrait', fit: 'y',
    ends: 'in',
    plan: '主体：瓶身（细颈和圆形的瓶底，一个闭合形）和瓶口的沿；细节：液面线（与瓶壁相连）。和烧瓶同一套：瓶口的沿、液面在 14',
    weights: { [P]: 0.85, [D]: 0.15 },
    draw(g) {
      const { h } = g, top = 2 + h, nl = 10, nr = 14, cy = 15, r = 7 - h, sh = cy - Math.sqrt(r * r - (12 - nl) ** 2), w = Math.sqrt(r * r - (LEVEL - cy) ** 2);
      return [
        shell(`M${nl} ${n(top)}V${n(sh)}A${n(r)} ${n(r)} 0 1 0 ${nr} ${n(sh)}V${n(top)}Z`, { n: 'flask', role: P }),
        rim(g, nl - h, nr + h),
        line(g.seg(12 - w, LEVEL, 12 + w, LEVEL), { n: 'liquid', role: D, on: 'flask' })
      ];
    },
    // swirled: the flask rocks on its base
    fx: { t: 'wiggle', on: 'all', o: [12, 22], deg: 9, hz: 2.4 }
  },
  'test-tubes': {
    label: '试管架', key: 'live',
    ends: 'out',
    plan: '主体：两支试管（直壁，底部半圆）和管口的沿；细节：两条液面线（与管壁相连）。和试管同一套，管口的沿各伸出 1',
    weights: { [P]: 0.86, [D]: 0.14 },
    draw(g) {
      const { h } = g, tube = (x, k) => shell(g.box(x, 2, 6, 20, [0.75, 0.75, 3, 3]), { n: `t${k}`, role: P });
      return [
        tube(3, 1), tube(15, 2),
        line(g.span(2, 2 + h, 10, 2 + h) + g.span(14, 2 + h, 22, 2 + h), { n: 'rims', role: P }),
        line(g.seg(3 + h, LEVEL, 9 - h, LEVEL), { n: 'l1', role: D, on: 't1' }),
        line(g.seg(15 + h, LEVEL + 2, 21 - h, LEVEL + 2), { n: 'l2', role: D, on: 't2' })
      ];
    },
    // shaken: the liquids rise and fall
    fx: [{ t: 'keys', on: ['l1'], y: [-2], ms: 360 }, { t: 'keys', on: ['l2'], y: [-2], ms: 360, delay: 120 }]
  },
  radiation: {
    label: '辐射', key: 'circle',
    plan: '主体：三片扇叶（圆环的三段，相隔 120°，各 60°）；辅助：中心的圆点（实心）',
    weights: { [P]: 0.9, [S]: 0.1 },
    draw(g) {
      const { h } = g, ro = 10 - h, ri = 4 + h;
      const blade = (a) => shell(g.polygon([...arcPts(12, 12, ro, a - 30, a + 30, 12), ...arcPts(12, 12, ri, a + 30, a - 30, 6)], [1.2, ...Array(11).fill(0), 1.2, 0.8, ...Array(5).fill(0), 0.8]), { n: `b${a}`, role: P });
      return [blade(-150), blade(-30), blade(90), solid(g.dot(12, 12, 1.1), { n: 'core', role: S })];
    },
    // 辐射: the blades turn a third of a turn, landing on themselves
    fx: { t: 'rotate', on: ['b-150', 'b-30', 'b90'], deg: 120, o: [12, 12] },
    allow: { keyline: '三片扇叶各占 60°，外圈只在上方和左右下方贴到圆' }
  },

  //NEW
};

// Variants made by rule (kit.mjs) of the icons above.
export default {
  ...SET,
  'test-tube-diagonal': {
    ...SET['test-tube'], key: 'live', fit: null, label: '试管（斜放）',
    plan: '主体：管身和管口的沿（和试管相同，转 45°，管口朝右上）；细节：液面线',
    draw(g, ctx) { return SET['test-tube'].draw(g, ctx).map((l) => ({ ...l, tf: 'translate(-1.3 1.3) rotate(45 12 12)' })); },
    // shaken: held at the mouth, the tube swings
    fx: { t: 'wiggle', on: 'all', o: [18, 6], deg: 10, hz: 3 },
    allow: { keyline: '试管沿对角线斜放，两端离参考线约 0.45，再加长会超出画布' }
  },
  'dna-off': off({ ...slash(SET.dna, { label: 'DNA 关闭' }), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'dna', { t: 'keys', on: ['rungs'], a: [0.15], ms: 260 }),
  'flask-off': off({ ...offFill(slash(SET.flask, { label: '烧瓶关闭' })), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'flask', { t: 'keys', on: ['liquid'], a: [0.15], ms: 260 }),
  //VAR
};
