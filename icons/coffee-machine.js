import { defineIcon, KR, CR, f, DEEP, DEEPS, R, rp, rr, circ, at, clamp01 } from '../packages/core/src/kit.js';
import { back, flat } from './_b1-home.js';
import { front } from './_w2-devices.js';
import { reveal } from './_home-food.js';

const CUP = rp([[10.8, 17.4], [17.2, 17.4], [16.6, 21.4], [11.4, 21.4]], [0.6, 0.6, 1.6, 1.6]);

export default defineIcon({
  name: 'coffee-machine',
  zh: '咖啡机',
  category: 'home',
  tags: ['espresso machine', 'coffee maker', 'cafe', 'brew', 'kitchen', 'appliance', '咖啡', '意式咖啡', '厨房电器'],
  variants: ['clock', 'check'],
  // An espresso machine with a cup under its spout; on hover its brew button lights and coffee pours into the cup.
  svg: (u) => `${back(u, rr(6.7, 1.6, 17.6, 21.8, KR))}
      ${front(u, rp(R(6.7, 1.6, 17.6, 6), [KR, KR, 0, 0]))}
      <path d="${circ(10.9, 4.6, 1.2) + circ(15.4, 4.6, 1.2)}" ${DEEP}/><path data-n="on" d="${circ(10.9, 4.6, 1.2)}" fill="#fff" opacity="0"/>
      <path d="${rr(9.1, 9.6, 12.8, 11.8, CR)}" fill="#fff"/>
      <path data-n="st" d="M14 11.6V18" pathLength="1" fill="none" stroke-width="2.6" ${DEEPS}/>
      ${flat(u, circ(16.8, 19.2, 2))}${flat(u, CUP)}
      <path d="${rp(R(11.6, 9.6, 4.8, 2.4), [0, 0, 1, 1])}" ${DEEP}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    at(E.st, reveal(o));
    at(E.on, { opacity: f(clamp01(o / 0.4)) });
  }
});
