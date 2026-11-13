import { defineIcon, f, OL, DEEP, rr, circ, at, wave, settle } from '../packages/core/src/kit.js';
import { back, front } from './_w2-devices.js';
import { span } from './_devices.js';
import { nudge } from './_place.js';

const PIV = [15.5, 17.6];
// Four keys, 2.6 square, 2.2 apart and 2.2 in from the sides of the body.
const KEYS = [[11.8, 3.2], [16.6, 3.2], [11.8, 8], [16.6, 8]];
const CODE = [0, 3, 1];
const LEVER = rr(4.6, PIV[1] - 1.6, 11.6, 3.2, 1.6);

// Centred on the canvas by its outer bounds.
export default nudge(defineIcon({
  name: 'smart-lock',
  zh: '智能门锁',
  category: 'home',
  tags: ['smart lock', 'door lock', 'keypad lock', 'keyless', 'smart home', '指纹锁', '电子锁'],
  variants: ['check', 'x', 'alert'],
  // A keypad door lock with its lever handle; on hover a code is keyed in and the handle
  // is pressed down.
  svg: (u) => `${back(u, rr(9.6, 1, 11.8, 23, 3))}
      <path d="${KEYS.map(([x, y]) => rr(x, y, 2.6, 2.6, 0.8)).join('')}" fill="#fff"/>
      ${KEYS.map(([x, y], i) => `<path data-n="k${i}" d="${rr(x, y, 2.6, 2.6, 0.8)}" opacity="0" ${DEEP}/>`).join('')}
      <g filter="${u.sh}"><g filter="${u.hi}"><g data-n="l1"><path d="${LEVER}" fill="${u.loS}"/></g></g></g><g data-n="l2"><path d="${LEVER}" ${OL}/></g>
      ${front(u, circ(PIV[0], PIV[1], 2.8))}`,
  target: (h) => ({ a: h ? -28 : 0, o: h ? 1 : 0 }),
  draw(p, E) {
    const t = `rotate(${f(p.a)} ${PIV[0]} ${PIV[1]})`;
    at(E.l1, { transform: t }); at(E.l2, { transform: t });
    // Three keys in turn, each pressed and let go.
    CODE.forEach((k, i) => at(E[`k${k}`], { opacity: f(wave(p.o, (x) => Math.sin(Math.PI * settle(span(x, 0.08 + 0.2 * i, 0.38 + 0.2 * i))))) }));
  }
}), 2.5, 0);
