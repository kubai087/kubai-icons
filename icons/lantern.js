import { defineIcon, KR, CR, f, OL, ACC, DEEP, rr, at, wave, rattle, clamp01 } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';
import { flameTongues } from './_weather-nature.js';

// A camping lantern hanging from its bail: the bail is a wire arc behind the cap, the
// glass is white inside a frame 2 wide, and the base stands one unit below the frame.
const BAIL = 'M11.4 4.6A4.1 4.1 0 0 1 19.6 4.6';
const CAP = rr(9.4, 3.2, 12.2, 3, 1.5), FRAME = rr(8.4, 7.2, 14.2, 13.4, KR);
const GLASS = rr(10.4, 9.2, 10.2, 9.4, CR), BASE = rr(7.6, 21.6, 15.8, 2.6, 1.3);
// The flame stands on the bottom of the glass, as on a wick, and stays 2 clear of its top
// and sides.
const FOOT = 18.6;

export default defineIcon({
  name: 'lantern',
  zh: '营地灯',
  category: 'travel',
  tags: ['camping lantern', 'lamp', 'light', 'camping', 'outdoor', 'night', '露营', '提灯', '马灯'],
  // A camping lantern with a small flame; on hover it sways on its bail and the flame
  // flares up, flickering, and burns tall.
  svg: (u) => `<g data-n="g">
      <path d="${BAIL}" fill="none" stroke-width="1.6" stroke-linecap="round" ${ACC}/>
      ${layer(u, 'c', CAP, u.upS)}
      ${layer(u, 'fr', FRAME, u.loS, { extra: `<path d="${GLASS}" fill="#fff"/><path data-n="fl" ${DEEP}/>` })}
      ${layer(u, 'b', BASE, u.upS)}
    </g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    const a = rattle(o, 4, 2);
    at(E.g, { transform: Math.abs(a) < 1e-4 ? '' : `rotate(${f(a)} 15.5 0.2)` });
    // The flame of the flame icon, scaled down.
    const w = (ph) => wave(o, (t) => (1 - t) * Math.sin(3 * Math.PI * t - ph));
    const k = 0.25 + 0.07 * p.o;
    at(E.fl, { d: flameTongues(16.6 + 2.8 * w(0), 1.2, 9 + 1.6 * w(1.2), 8.6), transform: `translate(15.5 ${FOOT}) scale(${f(k)}) translate(-15.5 -23.8)` });
  }
});
