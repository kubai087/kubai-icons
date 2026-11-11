import { defineIcon, f, OL, rr, wave, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// Three rings, widest at the bottom, on a peg standing in a base. Touching parts sit one unit
// apart, so their outlines meet as a single line.
const BASE = rr(5.6, 20.2, 19.8, 3, 1.5), PEG = rr(14.1, 1.6, 2.8, 18.6, 1.4);
const RINGS = [[17.4, 15.2], [13.4, 10.2], [9.4, 5.2]].map(([w, y]) => rr(15.5 - w / 2, y, w, 4, 2));

export default defineIcon({
  name: 'stacking-rings',
  zh: '叠叠圈',
  category: 'education',
  tags: ['stacking rings', 'ring stacker', 'toy', 'baby', 'kindergarten', 'sorting', '叠叠乐', '套圈', '早教', '玩具'],
  // A ring-stacking toy; on hover the rings hop on the peg one after another, top first.
  svg: (u) => `<path d="${PEG}" fill="${u.upS}"/><path d="${PEG}" ${OL}/>
    <g filter="${u.sh}"><g filter="${u.hi}"><path d="${BASE}" fill="${u.loS}"/></g></g><path d="${BASE}" ${OL}/>
    ${RINGS.map((d, i) => layer(u, 'r' + i, d, i % 2 ? u.upS : u.loS)).join('')}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    RINGS.forEach((_, i) => {
      // The top ring goes first; each hop lasts 60% of the motion.
      const start = 0.2 * (2 - i);
      const k = wave(o, (t) => Math.sin(Math.PI * clamp01((t - start) / 0.6)));
      moveAll(E, ['r' + i], k > 1e-4 ? `translate(0 ${f(-2.6 * k)})` : '');
    });
  }
});
