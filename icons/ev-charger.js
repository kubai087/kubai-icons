import { defineIcon, KR, CR, f, OL, DEEP, DEEPS, SOFT, R, rp, rr, at, scaleAt, clamp01 } from '../packages/core/src/kit.js';

const SCREEN = rr(7.8, 4, 8.8, 11.2, CR);
// The bolt keeps 2 clear of every edge of the screen.
const BOLT = rp([[14.1, 6], [10.3, 10.5], [12.6, 10.5], [11.4, 13.2], [15.1, 8.6], [12.9, 8.6]], 0.3);

export default defineIcon({
  name: 'ev-charger',
  zh: '充电桩',
  category: 'transport',
  tags: ['charging station', 'electric vehicle', 'ev', 'charge', 'plug', '新能源', '充电'],
  variants: ['check', 'clock', 'alert'],
  // A charging post with its plug on a cable; on hover the plug rises on its cable, the charge
  // rises on its screen and the bolt on it swells with a pulse.
  svg: (u) => {
    const body = rr(5.8, 2, 12.8, 21.6, KR), plug = rp(R(22.2, 5, 4, 5), [1, 1, 1.4, 1.4]);
    return `<path data-n="cab" d="M18 17.6H21.8Q24.2 17.6 24.2 15.2V9.6" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" ${DEEPS}/>
      <path data-n="pins" d="M23.2 5V2.8M25.2 5V2.8" fill="none" stroke-width="1.6" stroke-linecap="round" ${DEEPS}/>
      <g filter="${u.hi}"><path data-n="pl" d="${plug}" fill="${u.upS}"/></g><path data-n="plO" d="${plug}" ${OL}/>
      <g filter="${u.sh}"><g filter="${u.hi}"><path d="${body}" fill="${u.lo(21.6)}"/></g></g><path d="${body}" ${OL}/>
      <clipPath id="${u.id('sc')}"><path d="${SCREEN}"/></clipPath>
      <path d="${SCREEN}" fill="#fff"/>
      <g clip-path="url(#${u.id('sc')})"><path data-n="lv" ${SOFT}/></g>
      <path data-n="bolt" d="${BOLT}" ${DEEP}/>`;
  },
  target: (h) => ({ lv: h ? 11.2 : 3.4, py: h ? -2.8 : 0 }),
  draw(p, E) {
    const y = p.py, plug = rp(R(22.2, 5 + y, 4, 5), [1, 1, 1.4, 1.4]);
    at(E.pl, { d: plug }); at(E.plO, { d: plug });
    at(E.pins, { d: `M23.2 ${f(5 + y)}V${f(2.8 + y)}M25.2 ${f(5 + y)}V${f(2.8 + y)}` });
    at(E.cab, { d: `M18 17.6H21.8Q24.2 17.6 24.2 15.2V${f(9.6 + y)}` });
    at(E.lv, { d: rp(R(7.8, 15.2 - p.lv, 8.8, p.lv + 1), 0) });
    const k = 1 + 0.2 * Math.sin(Math.PI * clamp01((p.lv - 3.4) / 7.8));
    if (Math.abs(k - 1) < 1e-4) E.bolt.removeAttribute('transform'); else at(E.bolt, { transform: scaleAt(k, 12.7, 9.6) });
  }
});
