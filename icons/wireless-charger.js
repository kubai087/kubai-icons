import { defineIcon, f, DEEPS, WHITE, WHITES, rr, circ, at, scaleAt } from '../packages/core/src/kit.js';
import { solid, span } from './_devices.js';
import { front, bolt } from './_w2-devices.js';

const C = [15.5, 10.4], RING = 6.2, LEN = 2 * Math.PI * RING;

export default defineIcon({
  name: 'wireless-charger',
  zh: '无线充电器',
  category: 'devices',
  tags: ['magsafe', 'charging pad', 'qi', 'magnetic charger', 'charge', '无线充电', '磁吸充电'],
  variants: ['check', 'x', 'alert'],
  // A round magnetic charging pad on its cable; on hover a light runs round its magnet ring and
  // the charge bolt pulses.
  svg: (u) => `<path d="M15.5 21V24" fill="none" stroke-width="2.2" stroke-linecap="round" ${DEEPS}/>
      ${front(u, rr(13.2, 16.8, 4.6, 4.8, 1.2))}
      ${solid(u, circ(C[0], C[1], 9), u.loS)}
      <circle cx="${C[0]}" cy="${C[1]}" r="${RING}" fill="none" stroke-width="1.6" ${WHITES} opacity=".4"/>
      <circle data-n="arc" cx="${C[0]}" cy="${C[1]}" r="${RING}" fill="none" stroke-width="1.6" stroke-linecap="round" ${WHITES} transform="rotate(-90 ${C[0]} ${C[1]})"/>
      <path data-n="b" d="${bolt(C[0] - 2.7, C[1] - 3.4)}" ${WHITE}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const k = span(p.o, 0, 0.75);
    at(E.arc, { 'stroke-dasharray': `${f(LEN * k)} ${f(LEN + 1)}`, opacity: f(span(p.o, 0, 0.08)) });
    at(E.b, { transform: scaleAt(1 + 0.24 * Math.sin(Math.PI * span(p.o, 0.55, 1)), C[0], C[1]) });
  }
});
