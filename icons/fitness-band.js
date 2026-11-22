import { defineIcon, KR, f, DEEP, rr, at, scaleAt, wave, settle } from '../packages/core/src/kit.js';
import { back, front } from './_w2-devices.js';

const STRAP = rr(11, 1, 9, 23, KR);
const BODY = rr(9.8, 3.8, 11.4, 17.4, 5.7);
const HEART = 'M0 9.6C-5.5 5.6 -10.9 1.4 -10.9 -3.6C-10.9 -7 -8.3 -9.6 -5.1 -9.6C-2.9 -9.6 -1.1 -8.4 0 -6.6C1.1 -8.4 2.9 -9.6 5.1 -9.6C8.3 -9.6 10.9 -7 10.9 -3.6C10.9 1.4 5.5 5.6 0 9.6Z';

export default defineIcon({
  name: 'fitness-band',
  zh: '智能手环',
  category: 'devices',
  tags: ['fitness tracker', 'activity tracker', 'smart band', 'wearable', 'heart rate', 'steps', '手环'],
  variants: ['check', 'plus', 'sync', 'bolt'],
  // A slim tracker on its strap showing a heart; on hover the heart beats twice as the pulse is
  // read.
  svg: (u) => `${back(u, STRAP)}${front(u, BODY)}
      <path d="${rr(11.8, 5.8, 7.4, 13.4, 3.7)}" fill="#fff"/>
      <g data-n="beat"><path d="${HEART}" transform="translate(15.5 12.6) scale(0.155)" ${DEEP}/></g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const beat = wave(p.o, (t) => Math.sin(2 * Math.PI * settle(t)) ** 2);
    at(E.beat, { transform: scaleAt(1 + 0.75 * beat, 15.5, 12.6) });
  }
});
