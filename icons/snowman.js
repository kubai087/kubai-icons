import { defineIcon, f, OL, DEEP, DEEPS, rp, circ, rattle, bump, clamp01, at } from '../packages/core/src/kit.js';

const BODY = circ(15.5, 18, 6.2), HEAD = circ(15.5, 8.4, 4);
// A top hat in one piece: the crown on a brim that covers the top of the head.
const HAT = rp([[10.4, 3.6], [12.4, 3.6], [12.4, 0.2], [18.6, 0.2], [18.6, 3.6], [20.6, 3.6], [20.6, 5.6], [10.4, 5.6]],
  [1, 0.4, 1.2, 1.2, 0.4, 1, 1, 1]);
const SH = [20.4, 15.4];

export default defineIcon({
  name: 'snowman',
  zh: '雪人',
  category: 'weather',
  tags: ['winter', 'snow', 'christmas', 'holiday', 'cold', 'season', '冬天', '下雪', '圣诞'],
  // A snowman in a top hat with twig arms; on hover it waves one arm and its hat hops.
  svg: (u) => `<path d="M10.6 15.4L5.4 11.4" fill="none" stroke-width="2.2" stroke-linecap="round" ${DEEPS}/>
    <path data-n="arm" d="M${SH[0]} ${SH[1]}L25.6 11.4" fill="none" stroke-width="2.2" stroke-linecap="round" ${DEEPS}/>
    <g filter="${u.sh}"><g filter="${u.hi}"><path d="${BODY}" fill="${u.loS}"/></g></g><path d="${BODY}" ${OL}/>
    <path d="${circ(15.5, 16.6, 1.2)}${circ(15.5, 21, 1.2)}" ${DEEP}/>
    <g filter="${u.hi}"><path d="${HEAD}" fill="${u.upS}"/></g><path d="${HEAD}" ${OL}/>
    <g data-n="hat"><g filter="${u.hi}"><path d="${HAT}" fill="${u.loS}"/></g><path d="${HAT}" ${OL}/></g>`,
  target: (h) => ({ o: h ? 1 : 0, a: h ? -20 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    at(E.arm, { transform: `rotate(${f(p.a + rattle(o, 16, 3))} ${SH[0]} ${SH[1]})` });
    at(E.hat, { transform: `translate(0 ${f(-1.2 * bump(o))})` });
  }
});
