import { defineIcon, KR, f, OL, WHITES, R, rp, rr, at, wave, clamp01 } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';
import { flameTongues } from './_weather-nature.js';

// A gas canister with the burner screwed on top: canister, valve and burner each sit one
// unit apart, and the burner's two pot supports rise from its ends.
const CAN = rr(9.2, 14.4, 12.6, 9.6, KR), VALVE = rr(13, 10.8, 5, 2.6, 1.2);
const BURNER = rp([[6.4, 4.4], [8.8, 4.4], [8.8, 7.4], [22.2, 7.4], [22.2, 4.4], [24.6, 4.4], [24.6, 9.8], [6.4, 9.8]], [1.2, 1.2, 0.4, 0.4, 1.2, 1.2, 1.2, 1.2]);
// The flame of the flame icon, standing one unit above the burner.
const BASE = 6.4, SIZE = 0.3;

export default defineIcon({
  name: 'camp-stove',
  zh: '露营炉',
  category: 'travel',
  tags: ['camping stove', 'gas stove', 'burner', 'cooking', 'camping', 'outdoor', 'fire', '卡式炉', '炉头', '野炊'],
  // A camping stove, off; on hover it lights and the flame flickers up and burns steady.
  svg: (u) => `<g filter="${u.sh}"><g filter="${u.hi}"><path data-n="fl" fill="${u.loS}"/></g></g><path data-n="flO" stroke-linejoin="round" ${OL}/>
    ${layer(u, 'v', VALVE, u.upS, { sh: false })}
    ${layer(u, 'c', CAN, u.loS, { extra: `<path d="M12.4 18.2H18.6" fill="none" stroke-width="1.6" stroke-linecap="round" ${WHITES}/>` })}
    ${layer(u, 'b', BURNER, u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), w = (ph) => wave(o, (t) => (1 - t) * Math.sin(3 * Math.PI * t - ph));
    const k = SIZE * p.o;
    const t = k < 0.01 ? { d: '' } : { d: flameTongues(16.6 + 2.8 * w(0), 1.2, 9 + 1.6 * w(1.2), 8.6), transform: `translate(15.5 ${BASE}) scale(${f(k)}) translate(-15.5 -23.8)` };
    at(E.fl, t); at(E.flO, t);
  }
});
