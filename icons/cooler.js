import { defineIcon, KR, CR, f, OL, rr, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A cool box: the lid sits one unit above the box, and the handle is a ring whose lower
// half hides behind the lid.
const BODY = rr(4.6, 11, 21.8, 11.6, KR), LID = rr(3.8, 6.4, 23.4, 3.6, 1.8);
const HANDLE = rr(10.5, 2, 10, 6.4, 2.6) + rr(12.5, 4, 6, 6, 1.2);
const LABEL = rr(9.6, 14.2, 11.8, 5.2, CR);

export default defineIcon({
  name: 'cooler',
  zh: '保温箱',
  category: 'travel',
  tags: ['cool box', 'ice chest', 'cooler box', 'picnic', 'camping', 'drinks', 'cold', '冰箱', '冰桶', '露营'],
  // A cool box with its carry handle; on hover the lid tips open from its back edge.
  svg: (u) => `<g data-n="h"><path d="${HANDLE}" fill-rule="evenodd" fill="${u.loS}"/></g><g data-n="hO"><path d="${HANDLE}" fill-rule="evenodd" ${OL}/></g>
    ${layer(u, 'b', BODY, u.loS, { extra: `<path d="${LABEL}" fill="#fff"/>` })}
    ${layer(u, 'l', LID, u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    moveAll(E, ['l', 'h'], o ? `rotate(${f(-14 * o)} 27.2 10)` : '');
  }
});
