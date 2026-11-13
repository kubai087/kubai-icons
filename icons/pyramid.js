import { defineIcon, ACC, circ, rp } from '../packages/core/src/kit.js';
import { back, front, setD } from './_b6-vehicles.js';

// The whole silhouette is one shape; the lit face is clipped to it, so the faces share one
// rounded apex and the face's own outline shows only along the ridge.
const HILL = rp([[13, 2.2], [27.6, 22.6], [3.4, 22.6]], 1.6);
const LEFT = rp([[12.12, -1], [18.6, 22.6], [18.6, 25], [-1, 25], [-1, -1]], 0);

export default defineIcon({
  name: 'pyramid',
  zh: '金字塔',
  category: 'travel',
  tags: ['egypt', 'giza', 'desert', 'tomb', 'landmark', 'ancient', '埃及', '古迹'],
  // A stone pyramid seen at an angle; on hover the desert sun rises from behind it.
  svg: (u) => `${front(u, '', u.upS, 's')}
    ${back(u, HILL, u.loS)}
    <clipPath id="${u.id('h')}"><path d="${HILL}"/></clipPath>
    <clipPath id="${u.id('l')}"><path d="${LEFT}"/></clipPath>
    <g clip-path="url(#${u.id('h')})">${back(u, LEFT, u.upS)}
    <path d="M0 11.4H31M0 17H31" fill="none" clip-path="url(#${u.id('l')})" ${ACC}/></g>`,
  target: (h) => ({ s: h ? [25.4, 5.6, 3.4] : [17.6, 16, 3.4] }),
  draw(p, E) { setD(E, 's', circ(p.s[0], p.s[1], p.s[2])); }
});
