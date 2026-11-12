import { defineIcon, OL, R, rp, circ, at } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';

// A mummy sleeping bag seen from above, with someone in it. The shell's top is a half
// circle; the white lining follows it 2.2 in, and the sleeper's head sits 2 clear of the
// lining. The cover runs from its top edge to the foot of the bag.
const SHELL = rp(R(8.6, 1, 13.8, 23), [6.9, 6.9, 3.2, 3.2]);
const LINING = rp(R(10.8, 3.2, 9.4, 19.6), [4.7, 4.7, 1.2, 1.2]);
const HEAD = circ(15.5, 7.9, 2.7);
const FOOT = 24;
const cover = (top) => rp(R(8.6, top, 13.8, FOOT - top), [1.8, 1.8, 3.2, 3.2]);

export default defineIcon({
  name: 'sleeping-bag',
  zh: '睡袋',
  category: 'travel',
  tags: ['sleeping bag', 'camping', 'sleep', 'tent', 'outdoor', 'night', 'rest', '露营', '野营'],
  // Someone in a sleeping bag with the cover turned down; on hover the cover is pulled up
  // to the chin.
  svg: (u) => `${layer(u, 'sh', SHELL, u.loS, { extra: `<path d="${LINING}" fill="#fff"/>` })}
    ${layer(u, 'hd', HEAD, u.upS, { sh: false })}
    <g filter="${u.hi}"><path data-n="c" fill="${u.upS}"/></g><path data-n="cO" ${OL}/>`,
  // At rest the cover stays 2 below the head; pulled up, it tucks in under the chin.
  target: (h) => ({ t: h ? 9.6 : 12.6 }),
  draw(p, E) {
    const d = cover(p.t);
    at(E.c, { d }); at(E.cO, { d });
  }
});
