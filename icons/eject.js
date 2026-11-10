import { defineIcon, f, OL, WHITE, rp, rr, circ, at } from '../packages/core/src/kit.js';

const tri = (y) => rp([[15.5, 6.6 + y], [21.6, 13.2 + y], [9.4, 13.2 + y]], 0.8);

export default defineIcon({
  name: 'eject',
  zh: '弹出',
  category: 'media',
  tags: ['eject', 'unmount', 'remove disk', 'disc', 'media key', '推出', '移除'],
  // An eject button; on hover the triangle lifts off its bar as the disc comes out.
  svg: (u) => `<g filter="${u.sh}"><g filter="${u.hi}"><path d="${circ(15.5, 12.5, 11.5)}" fill="${u.loS}"/></g></g>
    <path d="${circ(15.5, 12.5, 11.5)}" ${OL}/>
    <path data-n="t" ${WHITE}/><path d="${rr(9.4, 15.6, 12.2, 2.6, 1)}" ${WHITE}/>`,
  target: (h) => ({ y: h ? -1.6 : 0 }),
  draw(p, E) { at(E.t, { d: tri(p.y) }); }
});
