import { defineIcon, KR, f, OL, DEEPS, WHITES, rr, bump, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// Two blocks side by side and one stacked on them, each 9.3 square. Touching blocks sit one
// unit apart, so their outlines meet as a single line.
const LEFT = rr(5.7, 13.3, 9.3, 9.3, KR), RIGHT = rr(16, 13.3, 9.3, 9.3, KR);
const TOP = rr(10.85, 3, 9.3, 9.3, KR);
const GLYPH = 'fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"';
const A = 'M8.3 20.4L10.35 15.5L12.4 20.4M9.1 18.6H11.6';
const B = 'M19.1 15.5V20.4H21A1.25 1.25 0 0 0 21 17.9H19.1M19.1 15.5H20.7A1.2 1.2 0 0 1 20.7 17.9';
const C = 'M17.3 5.95A2.4 2.4 0 1 0 17.3 9.35';

export default defineIcon({
  name: 'alphabet-blocks',
  zh: '字母积木',
  category: 'education',
  tags: ['abc', 'letters', 'toy blocks', 'kindergarten', 'alphabet', 'learn', '识字', '早教', '幼儿园'],
  // Three letter blocks stacked in a pyramid; on hover the top block is lifted and set
  // back down with a little tilt, as a child stacks it.
  svg: (u) => `<g filter="${u.sh}"><g filter="${u.hi}"><path d="${LEFT}" fill="${u.loS}"/></g></g><path d="${LEFT}" ${OL}/>
    <path d="${A}" ${GLYPH} ${WHITES}/>
    <g filter="${u.sh}"><g filter="${u.hi}"><path d="${RIGHT}" fill="${u.loS}"/></g></g><path d="${RIGHT}" ${OL}/>
    <path d="${B}" ${GLYPH} ${WHITES}/>
    ${layer(u, 't', TOP, u.upS, { extra: `<path d="${C}" ${GLYPH} ${DEEPS}/>` })}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const k = bump(clamp01(p.o));
    moveAll(E, ['t'], k ? `translate(0 ${f(-4 * k)}) rotate(${f(-9 * k)} 15.5 12.3)` : '');
  }
});
