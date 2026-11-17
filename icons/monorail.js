import { defineIcon, CR, f, DEEP, R, rp, rr, at, scaleAt } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';

// A monorail seen head-on, as the train and tram are: a car with a rounded roof, a windscreen
// and two lamps, riding a single beam. The beam's end shows under the car and stands on a
// column that flares into a footing on the ground; one beam instead of two rails is what makes
// it a monorail.
const BODY = rp(R(6.6, 1.2, 17.8, 14.4), [5, 5, 2.2, 2.2]);
const PANEL = rp(R(6.6, 9.8, 17.8, 5.8), [1.6, 1.6, 2.2, 2.2]);
const BEAM = rr(12.4, 13, 6.2, 5.6, 1.2);
const COLUMN = rp([[13.9, 18], [17.1, 18], [17.1, 22], [21, 24], [10, 24], [13.9, 22]], [0, 0, 1, 0, 0, 1]);
const LAMPS = [10.4, 20.6];

export default defineIcon({
  name: 'monorail',
  zh: '单轨列车',
  category: 'transport',
  tags: ['monorail', 'train', 'elevated', 'rail', 'transit', 'retro-futurism', 'space age', 'future', '单轨', '轻轨', '复古未来'],
  variants: ['clock', 'check'],
  // A monorail on its beam; on hover its lamps light and it draws nearer.
  svg: (u) => `${layer(u, 'cl', COLUMN, u.loS)}
      ${layer(u, 'bm', BEAM, u.upS)}
      <g data-n="tr">${layer(u, 'car', BODY, u.loS, { extra: `<path d="${rr(9.2, 3.6, 12.6, 4.4, 1.6)}" fill="#fff"/>` })}
      ${layer(u, 'pn', PANEL, u.upS)}
      ${LAMPS.map((x) => `<circle cx="${x}" cy="12.7" r="1.4" ${DEEP}/>`).join('')}
      <g data-n="lit" opacity="0">${LAMPS.map((x) => `<circle cx="${x}" cy="12.7" r="1.4" fill="#fff"/>`).join('')}</g></g>`,
  target: (h) => ({ s: h ? 1.06 : 1, lit: h ? 1 : 0 }),
  draw(p, E) {
    at(E.tr, { transform: scaleAt(p.s, 15.5, 16) });
    at(E.lit, { opacity: f(p.lit) });
  }
});
