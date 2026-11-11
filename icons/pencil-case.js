import { defineIcon, f, OL, DEEP, WHITES, R, rp, rr, at, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A soft pouch zipped along its top, with a lighter panel across its lower half.
const BODY = rr(4.4, 6.4, 22.2, 15.2, 4.6), PANEL = rp(R(4.4, 15, 22.2, 6.6), [1.8, 1.8, 4.6, 4.6]);
// The zip runs from x0 to x1, 2 below the top edge and 2 above the panel once its pull
// hangs from it; the pull starts at the right-hand end.
const ZY = 9.6, X0 = 8.6, X1 = 22, SHUT = 21, OPEN = 8.6;
// A pencil standing on its butt at the origin, its sharpened cone dark.
const LEN = 13;
// Where each pencil comes out of the zip, and how far it leans.
const PENS = [['a', 11.6, -8], ['c', 15.5, 0], ['b', 19.4, 8]];
const PENCIL = rp([[-1.6, 0], [-1.6, -LEN + 3.4], [0, -LEN], [1.6, -LEN + 3.4], [1.6, 0]], [0, 0.3, 0.4, 0.3, 0]);
const TIP = rp([[-1.6, -LEN + 3.4], [0, -LEN], [1.6, -LEN + 3.4]], [0.2, 0.4, 0.2]);
const pen = (u, name) => layer(u, name, PENCIL, u.upS, { sh: false, extra: `<path d="${TIP}" ${DEEP}/>` });

export default defineIcon({
  name: 'pencil-case',
  zh: '笔袋',
  category: 'education',
  tags: ['pencil case', 'pouch', 'stationery', 'school supplies', 'zipper', 'pens', '铅笔盒', '文具袋'],
  variants: ['plus', 'check'],
  // A zipped pencil case; on hover the zip is pulled open along the top and three pencils
  // rise out of the opening.
  svg: (u) => `<g filter="${u.sh}"><g filter="${u.hi}"><path d="${BODY}" fill="${u.loS}"/></g></g><path d="${BODY}" ${OL}/>
    <g filter="${u.hi}"><path d="${PANEL}" fill="${u.upS}"/></g><path d="${PANEL}" ${OL}/>
    <path data-n="zip" fill="none" stroke-width="1.6" stroke-linecap="round" ${WHITES}/>
    <path data-n="gap" ${DEEP}/>
    <path data-n="pull" ${DEEP}/>
    <clipPath id="${u.id('out')}"><rect x="0" y="-2" width="31" height="${ZY + 2}"/></clipPath>
    <g clip-path="url(#${u.id('out')})">${PENS.map(([n]) => pen(u, n)).join('')}</g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    // The zip opens first; the pencils follow once the gap is wide enough.
    const z = clamp01(o / 0.5), px = SHUT + (OPEN - SHUT) * z, rise = 10 * clamp01((o - 0.4) / 0.6);
    at(E.zip, { d: `M${X0} ${ZY}H${f(px)}` });
    // The opened stretch of the zip shows as a dark slot.
    const w = X1 - px;
    at(E.gap, { d: w > 0.6 ? rr(px, ZY - 1.2, w, 2.4, 1.2) : '' });
    at(E.pull, { d: rr(px - 1.2, ZY - 1.2, 2.4, 4.4, 1.2) });
    // Three pencils fanning slightly from the opening, the middle one a little higher. Each
    // turns about the point where it leaves the zip, and only what is above the zip shows.
    for (const [n, x, a] of PENS) moveAll(E, [n], `translate(${x} ${ZY}) rotate(${a}) translate(0 ${f(LEN + 1.2 - rise * (a ? 1 : 1.08))})`);
  }
});
