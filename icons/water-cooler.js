import { defineIcon, KR, CR, f, OL, DEEP, WHITE, R, rp, rr, circ, at, clamp01 } from '../packages/core/src/kit.js';
import { front } from './_b1-home.js';

// The bottle stands upside down with its neck in the dispenser: air at the top, water below.
const JUG = rp([[9.4, 1], [21.6, 1], [21.6, 8.2], [17.6, 10.4], [17.6, 12.6], [13.4, 12.6], [13.4, 10.4], [9.4, 8.2]], [KR, KR, 2, 0.6, 0, 0, 0.6, 2]);
// Each bubble rises from the neck and is gone when it reaches the surface.
const BUBBLES = [{ n: 'a', r: 1.6, x: 13.8, from: 0 }, { n: 'b', r: 1.2, x: 17.6, from: 0.35 }];
const NECK = 14.4;

export default defineIcon({
  name: 'water-cooler',
  zh: '饮水机',
  category: 'home',
  tags: ['water dispenser', 'water bottle', 'drinking water', 'office', 'break room', 'hydrate', '饮用水', '桶装水', '办公'],
  variants: [],
  // A water cooler with a bottle on top; on hover bubbles glug up through the bottle and its water level drops.
  svg: (u) => `<g filter="${u.sh}"><path d="${JUG}" fill="${u.upS}"/></g>
      <clipPath id="${u.id('jug')}"><path d="${JUG}"/></clipPath>
      <g clip-path="url(#${u.id('jug')})"><g filter="${u.hi}"><path data-n="w" fill="${u.loS}"/></g>
        ${BUBBLES.map((b) => `<path data-n="${b.n}" d="${circ(0, 0, b.r)}" ${WHITE}/>`).join('')}</g>
      <path d="${JUG}" ${OL}/>
      ${front(u, rr(8.4, 11.6, 14.2, 12.4, KR))}
      <path d="${rr(11, 14, 9, 6.4, CR)}" fill="#fff"/>
      <path d="${rp(R(14.3, 14, 2.4, 3), [0, 0, 1, 1])}" ${DEEP}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), level = 3.6 + 3.4 * o;
    at(E.w, { d: `M0 ${f(level)}H31V14H0Z` });
    for (const b of BUBBLES) {
      const t = clamp01((o - b.from) / 0.65), top = level + b.r + 0.4;
      at(E[b.n], {
        transform: `translate(${f(15.5 + (b.x - 15.5) * t)} ${f(NECK + (top - NECK) * t)})`,
        opacity: f(clamp01((1 - t) / 0.3))
      });
    }
  }
});
