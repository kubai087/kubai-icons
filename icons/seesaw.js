import { defineIcon, f, OL, DEEP, rp, rr } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// The plank turns about the top of the stand. Its underside sits one unit above the stand's
// peak, so the two outlines meet as a single line.
const PX = 15.5, PY = 12.4, TILT = 12;
const PLANK = rr(-11.7, -2, 23.4, 4, 2);
const HANDLES = rr(-10, -6.4, 3, 5, 1.5) + rr(7, -6.4, 3, 5, 1.5);
const STAND = rp([[PX, PY + 3], [PX + 6.6, 22.4], [PX - 6.6, 22.4]], [1.4, 1.6, 1.6]);

export default defineIcon({
  name: 'seesaw',
  zh: '跷跷板',
  category: 'education',
  tags: ['seesaw', 'teeter-totter', 'playground', 'kindergarten', 'balance', 'play', '游乐场', '平衡', '幼儿园'],
  // A seesaw resting with its left end down; on hover it tips over so the right end is down.
  svg: (u) => `<g filter="${u.sh}"><g filter="${u.hi}"><path d="${STAND}" fill="${u.loS}"/></g></g><path d="${STAND}" ${OL}/>
    ${layer(u, 'p', PLANK, u.upS, { extra: `<path d="${HANDLES}" ${DEEP}/>` })}`,
  target: (h) => ({ a: h ? TILT : -TILT }),
  draw(p, E) {
    moveAll(E, ['p'], `translate(${PX} ${PY}) rotate(${f(p.a)})`);
  }
});
