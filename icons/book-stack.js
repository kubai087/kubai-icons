import { defineIcon, f, OL, DEEPS, WHITES, rr, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// Three books lying flat, spines towards us. Touching books sit one unit apart, so their
// outlines meet as a single line.
const BOTTOM = rr(4.4, 16.6, 22.2, 5.4, 1.6), MIDDLE = rr(6.8, 10.2, 19.8, 5.4, 1.6), TOP = rr(5.2, 3.8, 19, 5.4, 1.6);
const label = (x, y, w, tone) => `<path d="M${x} ${y}H${f(x + w)}" fill="none" stroke-width="1.6" stroke-linecap="round" ${tone}/>`;

export default defineIcon({
  name: 'book-stack',
  zh: '书堆',
  category: 'education',
  tags: ['books', 'stack', 'reading', 'study', 'course', 'textbook', 'library', '书本', '课本', '阅读'],
  variants: ['plus', 'check', 'star'],
  // Three books stacked flat; on hover the top one is lifted off the pile by its far end.
  svg: (u) => `<g filter="${u.sh}"><g filter="${u.hi}"><path d="${BOTTOM}" fill="${u.loS}"/></g></g><path d="${BOTTOM}" ${OL}/>
    ${label(9.4, 19.3, 9.6, WHITES)}
    <g filter="${u.sh}"><g filter="${u.hi}"><path d="${MIDDLE}" fill="${u.upS}"/></g></g><path d="${MIDDLE}" ${OL}/>
    ${label(11.4, 12.9, 8.6, DEEPS)}
    ${layer(u, 't', TOP, u.loS, { extra: label(9.6, 6.5, 9, WHITES) })}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    // Lifted at the left and pivoting on the right-hand corner, which also rises clear.
    const o = clamp01(p.o);
    moveAll(E, ['t'], o ? `translate(0 ${f(-2.2 * o)}) rotate(${f(-8 * o)} 24.2 9.2)` : '');
  }
});
