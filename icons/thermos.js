import { defineIcon, KR, f, OL, WHITES, rr, rattle, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A vacuum flask: its cup-cap sits one unit above the body, and the stopper under the cap
// shows only once the cap is lifted.
const BODY = rr(9.4, 7.4, 12.2, 16.6, KR), CAP = rr(9.8, 2, 11.4, 4.4, 1.8);
const STOPPER = rr(12.4, 4, 6.2, 4.4, 1.2);

export default defineIcon({
  name: 'thermos',
  zh: '保温杯',
  category: 'travel',
  tags: ['vacuum flask', 'flask', 'hot drink', 'bottle', 'camping', 'tea', 'coffee', '保温壶', '水杯'],
  // A flask with its cup-cap on; on hover the cap is twisted loose and lifted off the stopper.
  svg: (u) => `${layer(u, 's', STOPPER, u.upS, { sh: false })}
    ${layer(u, 'b', BODY, u.loS, { extra: `<path d="M12.4 12.4V18.6" fill="none" stroke-width="1.6" stroke-linecap="round" ${WHITES}/>` })}
    ${layer(u, 'c', CAP, u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    moveAll(E, ['c'], `translate(0 ${f(-2.6 * p.o)}) rotate(${f(rattle(o, 6, 3))} 15.5 4.2)`);
  }
});
