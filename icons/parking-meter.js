import { defineIcon, WHITES, R, rp, rr, circ, clamp01, at, wave } from '../packages/core/src/kit.js';
import { back, front, setD } from './_b6-vehicles.js';

export default defineIcon({
  name: 'parking-meter',
  zh: '停车咪表',
  category: 'travel',
  tags: ['parking', 'meter', 'kerbside', 'pay', 'coin', 'street', '停车', '计时收费'],
  // A kerbside meter with a P on its head; on hover a coin slides in and the paid-time
  // bar runs up.
  svg: (u) => `${front(u, '', u.upS, 'c')}
    <path d="${rr(13.4, 15, 4.2, 7, 0)}" fill="${u.pure('#2F6FE0')}"/>
    ${back(u, rp(R(8.2, 1, 14.6, 16.6), [6.6, 6.6, 2.2, 2.2]), u.loS)}
    <path d="M14 9.4V4.2H16.4A1.75 1.75 0 0 1 16.4 7.7H14" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" ${WHITES}/>
    <path data-n="bar" fill="#fff" data-w="fill"/>
    ${front(u, rr(9.6, 21.4, 11.8, 2.8, 1.3), u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0, w: h ? 8 : 3 }),
  draw(p, E) {
    const o = clamp01(p.o), t = wave(o, (x) => x);
    setD(E, 'c', circ(27 - 8.6 * t, 7.4, 2.9 * Math.min(1, t * 6)));
    at(E.bar, { d: rr(11.5, 12.6, p.w, 2.4, 1.2) });
  }
});
