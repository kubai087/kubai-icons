import { defineIcon, f, OL, ACC, rr, at, rattle, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A hammock stand and the hammock slung between its posts: the bed is gathered to a point at each end
// and 2.4 deep in the middle, between two arcs through the same ends.
// A stand: two posts on a base bar, one unit above it.
const LEFT = rr(4.4, 2.4, 2.6, 18, 1.3), RIGHT = rr(24, 2.4, 2.6, 18, 1.3), FOOT = rr(3.2, 21.4, 24.6, 2.6, 1.3);
const A = [9.4, 10.6], B = [21.6, 10.6], PIVOT = [15.5, 2];
// Arcs through A and B that sag 5.4 and 3 below them.
const radius = (sag) => ((B[0] - A[0]) ** 2 / 4 + sag ** 2) / (2 * sag);
const R1 = radius(5.4), R2 = radius(3);
const BED = `M${A[0]} ${A[1]}A${f(R1)} ${f(R1)} 0 0 0 ${B[0]} ${B[1]}A${f(R2)} ${f(R2)} 0 0 1 ${A[0]} ${A[1]}Z`;
const ENDS = [A, B], TOPS = [[7, 4.2], [24, 4.2]];

const turn = ([x, y], a) => {
  const r = a * Math.PI / 180, dx = x - PIVOT[0], dy = y - PIVOT[1];
  return [PIVOT[0] + dx * Math.cos(r) - dy * Math.sin(r), PIVOT[1] + dx * Math.sin(r) + dy * Math.cos(r)];
};

export default defineIcon({
  name: 'hammock',
  zh: '吊床',
  category: 'travel',
  tags: ['hammock', 'relax', 'rest', 'camping', 'garden', 'vacation', 'lazy', '休息', '度假'],
  // A hammock on its stand; on hover it swings to and fro and settles.
  svg: (u) => `<path data-n="r" fill="none" stroke-width="1.6" stroke-linecap="round" ${ACC}/>
    ${layer(u, 'ft', FOOT, u.upS)}${layer(u, 'pl', LEFT, u.loS)}${layer(u, 'pr', RIGHT, u.loS)}
    ${layer(u, 'bd', BED, u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const a = rattle(clamp01(p.o), 9, 3);
    moveAll(E, ['bd'], Math.abs(a) < 1e-4 ? '' : `rotate(${f(a)} ${PIVOT[0]} ${PIVOT[1]})`);
    const [l, r] = ENDS.map((e) => turn(e, a));
    at(E.r, { d: `M${TOPS[0][0]} ${TOPS[0][1]}L${f(l[0])} ${f(l[1])}M${TOPS[1][0]} ${TOPS[1][1]}L${f(r[0])} ${f(r[1])}` });
  }
});
