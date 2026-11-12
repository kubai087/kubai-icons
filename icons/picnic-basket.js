import { defineIcon, KR, f, OL, WHITES, rr, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A basket with two lid flaps meeting at the middle, one unit apart so their outlines meet,
// and a handle 2 wide whose feet hide behind the flaps.
const BODY = rr(5.2, 11.6, 20.6, 11, KR);
const LEFT = rr(4.4, 8.2, 10.6, 2.4, 1.2), RIGHT = rr(16, 8.2, 10.6, 2.4, 1.2);
const HANDLE = 'M7.5 10.6A8 8 0 0 1 23.5 10.6H21.5A6 6 0 0 0 9.5 10.6Z';
const WEAVE = 'M8.2 15.6H22.8M8.2 18.6H22.8';

export default defineIcon({
  name: 'picnic-basket',
  zh: '野餐篮',
  category: 'travel',
  tags: ['picnic', 'basket', 'hamper', 'outdoor', 'lunch', 'park', 'camping', '野餐', '郊游'],
  // A picnic hamper with its lid shut; on hover both flaps open up from the middle.
  svg: (u) => `<g filter="${u.sh}"><path d="${HANDLE}" fill="${u.loS}"/></g><path d="${HANDLE}" ${OL}/>
    ${layer(u, 'b', BODY, u.loS, { extra: `<path d="${WEAVE}" fill="none" stroke-width="1.6" stroke-linecap="round" ${WHITES}/>` })}
    ${layer(u, 'l', LEFT, u.upS, { sh: false })}${layer(u, 'r', RIGHT, u.upS, { sh: false })}`,
  target: (h) => ({ a: h ? 24 : 0 }),
  draw(p, E) {
    // Each flap turns about its inner top corner, so its outer end lifts.
    moveAll(E, ['l'], p.a ? `rotate(${f(p.a)} 15 8.2)` : '');
    moveAll(E, ['r'], p.a ? `rotate(${f(-p.a)} 16 8.2)` : '');
  }
});
