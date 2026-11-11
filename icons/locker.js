import { defineIcon, KR, CR, f, OL, LINE, DEEP, DEEPS, R, rp, rr, at } from '../packages/core/src/kit.js';

// The door covers the opening exactly and hangs on its left edge.
const CASE = rr(7.2, 1, 16.6, 23, KR), X = 10.2, Y = 4, W = 10.6, H = 17;
const door = (w) => rp(R(X, Y, w, H), [CR, CR, CR, CR]);

export default defineIcon({
  name: 'locker',
  zh: '储物柜',
  category: 'education',
  tags: ['locker', 'storage', 'school', 'gym', 'cabinet', 'cubby', '更衣柜', '寄存柜'],
  variants: ['lock', 'check'],
  // A tall school locker with vents in its door; on hover the door swings open on its left
  // hinge to show the shelf inside.
  svg: (u) => `<g filter="${u.sh}"><g filter="${u.hi}"><path d="${CASE}" fill="${u.loS}"/></g></g><path d="${CASE}" ${OL}/>
    <path d="${rr(X, Y, W, H, CR)}" fill="#fff"/>
    <path d="M12.4 9.6H18.6" ${LINE}/>
    <g filter="${u.hi}"><path data-n="d" fill="${u.upS}"/></g><path data-n="dO" ${OL}/>
    <path data-n="v" fill="none" stroke-width="1.6" stroke-linecap="round" ${DEEPS}/>
    <path data-n="h" ${DEEP}/>`,
  target: (h) => ({ s: h ? 0.42 : 1 }),
  draw(p, E) {
    const s = p.s, d = door(W * s);
    at(E.d, { d }); at(E.dO, { d });
    // Vents across the top of the door, and the latch by its free edge.
    const x0 = f(X + 2.2 * s), x1 = f(X + 8.4 * s);
    at(E.v, { d: `M${x0} 7.2H${x1}M${x0} 10.2H${x1}` });
    at(E.h, { d: rr(X + W * s - 1.4 - 2.4 * s, 12.6, 2.4, 4.4, 1.2) });
  }
});
