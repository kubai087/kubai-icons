import { defineIcon, KR, CR, f, DEEP, DEEPS, R, rp, rr, circ, at, clamp01 } from '../packages/core/src/kit.js';
import { back } from './_b1-home.js';
import { front } from './_w2-devices.js';
import { reveal } from './_home-food.js';

// The cup sits inside the body, so it has no outline of its own: a solid fill sets it off
// from the white bay.
const CUP = rp([[11.7, 16.4], [17.7, 16.4], [17.1, 21.4], [12.3, 21.4]], [0.6, 0.6, 1.8, 1.8]);
const HANDLE = circ(17.3, 18.6, 2);
// The stream runs from the spout to the rim of the cup.
const SPOUT = 12.2, X = 14.7, CUP_TOP = 16.4;

export default defineIcon({
  name: 'coffee-machine',
  zh: '咖啡机',
  category: 'home',
  tags: ['espresso machine', 'coffee maker', 'cafe', 'brew', 'kitchen', 'appliance', '咖啡', '意式咖啡', '厨房电器'],
  variants: ['clock', 'check'],
  // An espresso machine with a cup under its spout; on hover its brew button lights and
  // coffee pours from the spout into the cup.
  svg: (u) => `${back(u, rr(6.7, 1.6, 17.6, 21.8, KR))}
      ${front(u, rp(R(6.7, 1.6, 17.6, 6), [KR, KR, 0, 0]))}
      <path d="${circ(10.9, 4.6, 1.2) + circ(15.4, 4.6, 1.2)}" ${DEEP}/><path data-n="on" d="${circ(10.9, 4.6, 1.2)}" fill="#fff" opacity="0"/>
      <path d="${rr(8.7, 9.6, 13.6, 11.8, CR)}" fill="#fff"/>
      <path d="${HANDLE}" fill="${u.pure('#5393FF')}"/><path d="${CUP}" fill="${u.pure('#5393FF')}"/>
      <path data-n="st" d="M${X} ${SPOUT - 0.4}V${CUP_TOP}" pathLength="1" fill="none" stroke-width="2.6" ${DEEPS}/>
      <path d="${rp(R(12.1, 9.6, 5.2, 2.6), [0, 0, 1, 1])}" ${DEEP}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    at(E.st, reveal(o));
    at(E.on, { opacity: f(clamp01(o / 0.4)) });
  }
});
