import { defineIcon, KR, f, WHITE, WHITES, rp, circ, at, clamp01, wave } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';

// A plasma ball: a deep glass globe on a tapered base, a glint on the glass at top left, and a
// bright core from which four tendrils of light run out to the glass.
const CX = 15.5, CY = 10.2, RB = 9, RC = 2.4;
const BASE = rp([[11, 17.4], [20, 17.4], [22.4, 24], [8.6, 24]], [0, 0, KR, KR]);
// A point d out from the centre along angle a (degrees clockwise from north), s to its side.
const pt = (a, d, s) => {
  const r = a * Math.PI / 180, ux = Math.sin(r), uy = -Math.cos(r);
  return [CX + ux * d - uy * s, CY + uy * d + ux * s];
};
const P = (a, d, s) => pt(a, d, s).map(f).join(' ');
// The glint hugs the inside of the glass, in the gap the tendrils leave at top left.
const GLINT = `M${P(324, RB - 0.8, 0)}A${RB - 0.8} ${RB - 0.8} 0 0 1 ${P(344, RB - 0.8, 0)}`;
// A tendril from the core to the glass at angle a: an S-curve that bends k to one side, then the other.
const bolt = (a, k) => `M${P(a, RC, 0)}C${P(a, 4.2, k)} ${P(a, 6, -k)} ${P(a, RB, 0)}`;
// Uneven angles, bending alternately, so the tendrils don't read as the blades of a fan.
const REST = [30, 100, 170, 245];
const AMP = [10, -12, 10, -12], FR = [2, 3, 2.5, 3];

export default defineIcon({
  name: 'plasma-ball',
  zh: '等离子球',
  category: 'science',
  tags: ['plasma ball', 'plasma globe', 'plasma lamp', 'electricity', 'lightning', 'novelty lamp', 'retro', 'sci-fi', '静电球', '辉光球', '魔幻球'],
  variants: ['bolt'],
  // A plasma ball; on hover its tendrils flicker and wander, each at its own pace, and the core
  // swells.
  svg: (u) => `${layer(u, 'bs', BASE, u.upS)}
      ${layer(u, 'gl', circ(CX, CY, RB), u.pure('#5393FF'))}
      <path d="${GLINT}" fill="none" stroke-width="1.6" stroke-linecap="round" ${WHITES}/>
      <path data-n="bt" fill="none" stroke-width="1.6" stroke-linecap="round" ${WHITES}/>
      <path data-n="cr" ${WHITE}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    const ang = REST.map((a, i) => a + wave(o, (t) => AMP[i] * (1 - t) * Math.sin(FR[i] * Math.PI * t)));
    const k = 1 + wave(o, (t) => 1.2 * (1 - t) * Math.sin(4 * Math.PI * t));
    at(E.bt, { d: ang.map((a, i) => bolt(a, k * (i % 2 ? -1 : 1))).join('') });
    at(E.cr, { d: circ(CX, CY, RC + wave(o, (t) => 0.8 * Math.sin(Math.PI * t))) });
  }
});
