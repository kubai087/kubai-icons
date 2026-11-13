import { defineIcon, KR, CR, f, OL, DEEP, DEEPS, WHITES, rr, circ, at, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';
import { leafShape } from './_weather-nature.js';

// A tall packet with a white label 2.2 in from its sides; a sprout is printed on the label.
const PACK = rr(8.6, 2.4, 13.8, 21, KR), LABEL = rr(10.8, 9.2, 9.4, 11.6, CR);
const LEAF = leafShape(3.4, 2.8);
const SPROUT = `<path d="M15.5 18V14.6" fill="none" stroke-width="1.6" stroke-linecap="round" ${DEEPS}/>`
  + `<path d="${LEAF}" transform="translate(15.5 14.8) rotate(-55)" ${DEEP}/><path d="${LEAF}" transform="translate(15.5 14.8) rotate(55)" ${DEEP}/>`;
// The packet tips about its centre; seeds leave its top corner and fall in a line.
const TIP = 20, CORNER = [25.4, 5.4], SEEDS = [[26, 10.2], [26.8, 15.6], [27.4, 21]];

export default defineIcon({
  name: 'seed-packet',
  zh: '种子包',
  category: 'nature',
  tags: ['seeds', 'seed packet', 'sowing', 'gardening', 'plant', 'grow', 'spring', '种子', '播种', '园艺'],
  // A packet of seeds; on hover it tips and seeds fall from its corner.
  svg: (u) => `${SEEDS.map((_, i) => `<g filter="${u.sh}"><path data-n="s${i}" fill="${u.loS}"/></g><path data-n="s${i}O" ${OL}/>`).join('')}
    ${layer(u, 'p', PACK, u.loS, { extra: `<path d="M11.4 5.8H19.6" fill="none" stroke-width="1.6" stroke-linecap="round" ${WHITES}/><path d="${LABEL}" fill="#fff"/>${SPROUT}` })}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    moveAll(E, ['p'], p.o ? `rotate(${f(TIP * p.o)} 15.5 12.5)` : '');
    SEEDS.forEach(([x, y], i) => {
      const t = clamp01((o - 0.25 - 0.15 * i) / 0.45);
      const d = t < 0.02 ? '' : circ(CORNER[0] + (x - CORNER[0]) * t, CORNER[1] + (y - CORNER[1]) * t, 1.2 * Math.min(1, t * 3));
      at(E['s' + i], { d }); at(E['s' + i + 'O'], { d });
    });
  }
});
