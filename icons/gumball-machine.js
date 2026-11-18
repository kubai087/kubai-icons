import { defineIcon, KR, f, DEEP, WHITE, rp, rr, circ, at, rattle, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A gumball machine: a glass globe of gumballs on a tapered stand with a crank on its front.
// The gumballs pile up from the bottom of the globe, touching one another and cut off by
// the glass, and the stand covers the bottom of the pile.
const G = [15.5, 8.6, 7.6];
const STAND = rp([[10, 14.8], [21, 14.8], [22.6, 24], [8.4, 24]], [2, 2, KR, KR]);
const BALL = 1.9, DX = 2 * BALL, DY = DX * Math.sqrt(3) / 2, ROW = 14.3;
// Each row either runs into the glass or keeps well clear of it.
const BALLS = [[-1, 0, 1], [-1.5, -0.5, 0.5, 1.5], [0]]
  .flatMap((xs, r) => xs.map((x) => [15.5 + x * DX, ROW - r * DY]));
const KNOB = [15.5, 19.4], KR2 = 2.4;

export default defineIcon({
  name: 'gumball-machine',
  zh: '泡泡糖机',
  category: 'food',
  tags: ['gumball machine', 'gumball', 'bubble gum', 'candy machine', 'vending', 'candy', 'sweet', '扭蛋糖果机', '糖果机', '口香糖'],
  variants: ['heart', 'star'],
  // A gumball machine; on hover its crank turns half round and the gumballs jostle in the globe.
  svg: (u) => `<clipPath id="${u.id('g')}"><path d="${circ(...G)}"/></clipPath>
    <g filter="${u.sh}"><g filter="${u.hi}"><path d="${circ(...G)}" fill="${u.loS}"/></g></g><path d="${circ(...G)}" class="ol" data-t="stroke:#5393FF"/>
    <g clip-path="url(#${u.id('g')})"><g data-n="bl">${BALLS.map(([x, y]) => `<path d="${circ(x, y, BALL)}" ${WHITE}/>`).join('')}</g></g>
    ${layer(u, 'st', STAND, u.upS, { extra: `<path d="${circ(...KNOB, KR2)}" ${DEEP}/>` })}
    <path data-n="kb" d="${rr(KNOB[0] - 0.8, KNOB[1] - KR2, 1.6, 2 * KR2, 0.8)}" fill="#fff"/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    at(E.kb, { transform: `rotate(${f(180 * o)} ${KNOB[0]} ${KNOB[1]})` });
    at(E.bl, { transform: `translate(0 ${f(rattle(o, 1.4, 3))})` });
  }
});
