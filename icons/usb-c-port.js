import { defineIcon, DEEP, rp, rr, at, wave } from '../packages/core/src/kit.js';
import { back } from './_w2-devices.js';

const SHELL = rr(3.8, 5.4, 23.4, 14.2, 7.1);
const HOLE = rr(6.4, 8, 18.2, 9, 4.5);
const TONGUE = rr(9.6, 11.3, 11.8, 2.4, 1.2);

export default defineIcon({
  name: 'usb-c-port',
  zh: 'USB-C 接口',
  category: 'devices',
  tags: ['usb-c', 'type-c', 'thunderbolt', 'port', 'connector', 'charging port', '充电口', 'Type-C'],
  variants: ['check', 'x', 'alert'],
  // A USB-C socket, a rounded slot with its contact tongue inside; on hover the signal runs
  // along the contacts.
  svg: (u) => `${back(u, SHELL)}
      <path d="${HOLE}" fill="#fff"/>
      <path d="${TONGUE}" ${DEEP}/>
      <clipPath id="${u.id('tg')}"><path d="${TONGUE}"/></clipPath>
      <g clip-path="url(#${u.id('tg')})"><path data-n="gl" fill="#fff" opacity=".85"/></g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const x = wave(p.o, (t) => 5 + 19 * t);
    at(E.gl, { d: rp([[x, 11], [x + 4, 11], [x + 3, 14], [x - 1, 14]], 0) });
  }
});
