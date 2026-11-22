import { defineIcon, KR, CR, f, DEEP, R, rp, rr, circ, at, wave, settle } from '../packages/core/src/kit.js';
import { back, front } from './_w2-devices.js';

const BUTTON = rp(R(19.6, 2.6, 4.8, 3.4), [1, 1, 0, 0]);
const MOUNT = rp(R(13.2, 17, 4.6, 5.4), [0, 0, 1.2, 1.2]);
const BODY = rr(4, 5, 23, 14.4, KR);
const LENS = circ(10.8, 12.2, 4.6);

export default defineIcon({
  name: 'action-camera',
  zh: '运动相机',
  category: 'devices',
  tags: ['sports camera', 'helmet camera', 'body camera', 'vlog', 'record', '运动摄像机'],
  variants: ['check', 'x', 'bolt'],
  // A rugged camera box on its mount, with a wide lens and a small front screen; on hover the
  // shutter button is pressed and the record light blinks.
  svg: (u) => `<g data-n="btn">${back(u, BUTTON)}</g>${back(u, MOUNT)}${back(u, BODY)}
      ${front(u, LENS)}<path d="${circ(10.8, 12.2, 2.2)}" ${DEEP}/>
      <path d="${rr(19, 7.8, 5.6, 4.8, CR)}" fill="#fff"/>
      <circle data-n="rec" cx="21.8" cy="16.2" r="1.2" ${DEEP}/>`,
  target: (h) => ({ y: h ? 1 : 0, o: h ? 1 : 0 }),
  draw(p, E) {
    at(E.btn, { transform: `translate(0 ${f(p.y)})` });
    // Two blinks that grow the light, slowing to a stop at its resting size.
    const blink = wave(p.o, (t) => Math.sin(2 * Math.PI * settle(t)) ** 2);
    at(E.rec, { r: f(1.2 + 0.7 * blink) });
  }
});
