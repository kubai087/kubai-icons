import { defineIcon, f, WHITES, rp, circ } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// Cotton candy on a paper cone: a puff made of a round middle ringed by five bumps, all the
// same winding and outlined only outside; the middle stays 1.3 inside the notches between bumps, so its outline never shows in them, over a cone that narrows to its tip. A white curl
// of sugar shows on the puff.
const C = [15.5, 9.4], CORE = 4.8, BUMP = 3.6, OFF = 4.8;
const PUFF = circ(C[0], C[1], CORE) + [0, 72, 144, 216, 288].map((a) => {
  const r = a * Math.PI / 180;
  return circ(C[0] + OFF * Math.sin(r), C[1] - OFF * Math.cos(r), BUMP);
}).join('');
const CONE = rp([[12.9, 15], [18.1, 15], [16.3, 24], [14.7, 24]], [0, 0, 0.7, 0.7]);
const CURL = `M12.3 10.6A3.4 3.4 0 0 1 15.5 6.6`;

export default defineIcon({
  name: 'cotton-candy',
  zh: '棉花糖',
  category: 'food',
  tags: ['cotton candy', 'candy floss', 'fairy floss', 'fair', 'carnival', 'sweet', 'candy', '棉花糖', '游乐园', '甜食'],
  variants: ['heart'],
  allow: { peek: 'a 0.5 stretch where two bumps of the puff meet in a notch; at 6x the outline reads as one clean line' },
  // Cotton candy on a cone; on hover the puff turns on its cone, as if twirled.
  svg: (u) => `${layer(u, 'cn', CONE, u.upS)}
    ${layer(u, 'pf', PUFF, u.loS, { extra: `<path d="${CURL}" fill="none" stroke-width="1.6" stroke-linecap="round" ${WHITES}/>` })}`,
  target: (h) => ({ a: h ? 36 : 0 }),
  draw(p, E) { moveAll(E, ['pf'], Math.abs(p.a) < 1e-3 ? '' : `rotate(${f(p.a)} ${C[0]} ${C[1]})`); }
});
