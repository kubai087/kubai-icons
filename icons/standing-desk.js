import { defineIcon, CR, f, DEEP, rr, at } from '../packages/core/src/kit.js';
import { back, front } from './_b1-home.js';

// Each leg is a sleeve on a foot with an inner column that slides out of it as the top rises.
const LEGS = [9.2, 21.8], TOP = 13.2, SLEEVE = 16.6;

export default defineIcon({
  name: 'standing-desk',
  zh: '升降桌',
  category: 'home',
  tags: ['sit stand desk', 'adjustable desk', 'desk', 'workstation', 'office', 'ergonomics', '站立办公', '书桌', '办公桌'],
  variants: [],
  // A standing desk with a monitor on it; on hover the top rises on its telescoping legs.
  svg: (u) => `${LEGS.map((x, i) => `<path data-n="c${i}" ${DEEP}/>${back(u, rr(x - 2, SLEEVE, 4, 5.2, 0.8))}<path d="${rr(x - 4, 21.6, 8, 2.4, 1.2)}" ${DEEP}/>`).join('')}
      <g data-n="top">
        <path d="${rr(13.9, 9, 3.2, 4.4, 0)}" ${DEEP}/>
        ${back(u, rr(7.6, 1.4, 15.8, 8.2, 1.8))}
        <path d="${rr(9.6, 3.4, 11.8, 4.2, CR)}" fill="#fff"/>
        ${front(u, rr(4, TOP, 23, 3.4, 1.7))}
      </g>`,
  target: (h) => ({ d: h ? 4 : 0 }),
  draw(p, E) {
    at(E.top, { transform: `translate(0 ${f(-p.d)})` });
    LEGS.forEach((x, i) => at(E[`c${i}`], { d: rr(x - 1.4, f(SLEEVE - p.d), 2.8, f(p.d + 2), 0) }));
  }
});
