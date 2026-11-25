// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// science: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: atom flask beaker dna microscope telescope test-tube satellite
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// A point on an axis turned by deg about o (telescope, satellite).
const tilt = (o, deg) => { const a = (deg * Math.PI) / 180, c = Math.cos(a), s0 = Math.sin(a); return ([u, v]) => [o[0] + u * c - v * s0, o[1] + u * s0 + v * c]; };
const pt = ([x, y]) => `${n(x)} ${n(y)}`;

// Glassware (flask, beaker, test tube) is one family: the stroke is the glass wall, a rim line at
// the mouth stands out 2 past the walls on each side, and the liquid is one level line at y 14
// that meets both walls.
const RIM = 2, LEVEL = 14;
const rim = (g, x0, x1) => line(g.span(x0 - RIM, 2 + g.h, x1 + RIM, 2 + g.h), { n: 'rim', role: P });

export default {
  atom: {
    label: '原子', key: 'circle',
    plan: '主体：三条椭圆轨道（相隔 60°）；细节：原子核（实心点，随字重缩小，与轨道保持间距）',
    weights: { [P]: 0.93, [D]: 0.07 },
    draw(g) {
      const { h, s } = g, rx = 10 - h, ry = 4;
      const orbit = (deg) => {
        const a = (deg * Math.PI) / 180, p1 = [12 + rx * Math.cos(a), 12 + rx * Math.sin(a)], p2 = [24 - p1[0], 24 - p1[1]];
        return `M${pt(p1)}A${n(rx)} ${ry} ${deg} 1 1 ${pt(p2)}A${n(rx)} ${ry} ${deg} 1 1 ${pt(p1)}Z`;
      };
      return [
        line(orbit(0) + orbit(60) + orbit(120), { n: 'orbits', role: P }),
        solid(g.dot(12, 12, 0.9 - (s - 2) * 0.5), { n: 'core', role: D })
      ];
    },
    fx: { t: 'rotate', on: ['orbits'], deg: 60, o: [12, 12] },
    allow: { keyline: '三条轨道斜放，上下只到 3..21' }
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
  }
};
