// Shared parts of the shower icons (cloud-sun-rain, cloud-moon-rain): a cloud low on the
// right with the sun or moon behind it on the upper left, and rain falling from the cloud.
import { f, OL, DEEPS, cloud, clamp01, at } from '../packages/core/src/kit.js';
import { fall } from './_weather-nature.js';

const CL = cloud([12.4, 12.2, 4], [18, 8.2, 5.4], [23.2, 12.4, 3.8]);
// Drops come back in at TOP, behind the cloud, and fade in over their first 3 units so the
// slant of their fall never shows them beside the cloud's right side.
const DROPS = [[11.2, 21.4], [16.4, 22.2], [21.6, 21.4]];
const TOP = 12.6;

/** The icon's markup around the body behind the cloud (`back`, a filled path). */
export const showers = (u, back, join = '') => `${DROPS.map(([x, y], i) => `<path data-n="d${i}" d="M${f(x + 1)} ${f(y - 2.1)}L${f(x - 1)} ${f(y + 2.1)}" fill="none" stroke-width="2.6" stroke-linecap="round" ${DEEPS}/>`).join('')}
  <g data-n="bk"><g filter="${u.sh}"><g filter="${u.hi}"><path d="${back}" fill="${u.loS}"/></g></g><path d="${back}" ${join} ${OL}/></g>
  <g filter="${u.sh}"><g filter="${u.hi}"><path d="${CL}" fill="${u.upS}"/></g></g><path d="${CL}" ${OL}/>`;

export const showersTarget = (h) => ({ o: h ? 1 : 0, bk: h ? [-1, -1.4] : [0, 0] });

/** The body behind the cloud comes out a little while the rain falls and starts again. */
export function showersDraw(p, E) {
  const o = clamp01(p.o);
  at(E.bk, { transform: `translate(${f(p.bk[0])} ${f(p.bk[1])})` });
  DROPS.forEach(([, y], i) => {
    const q = fall(o, y, TOP);
    const back = clamp01((q.dy + y - TOP) / 3);
    at(E[`d${i}`], { transform: `translate(${f(-0.47 * q.dy)} ${f(q.dy)})`, opacity: f(q.op * back) });
  });
}
