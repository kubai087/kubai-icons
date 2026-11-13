import { defineIcon, KR, CR, f, R, rp, at } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';

// A glasshouse: a pentagon frame with glass inset 2.2 from it, divided by a 2.2 mullion
// down the middle and a 2.2 bar at the eaves into roof panes and wall panes, and a door
// standing on the frame's bottom edge with its top against the bar.
const FRAME = rp([[4.4, 10.4], [15.5, 2.6], [26.6, 10.4], [26.6, 23], [4.4, 23]], [1.6, 1.8, 1.6, KR, KR]);
// The glass follows the roof 2.2 below it.
const roofY = (x) => 10.4 - (7.8 / 11.1) * (x - 4.4) + 2.2 * Math.hypot(1, 7.8 / 11.1);
const EAVE = roofY(6.6), BAR = EAVE + 2.2;
const mirror = (pts) => pts.map(([x, y]) => [31 - x, y]).reverse();
const ROOF_L = [[6.6, EAVE], [14.4, roofY(14.4)], [14.4, EAVE]], WALL_L = [[6.6, BAR], [14.4, BAR], [14.4, 20.8], [6.6, 20.8]];
const GLASS = [ROOF_L, mirror(ROOF_L), WALL_L, mirror(WALL_L)].map((pts) => rp(pts, pts.length === 3 ? [0.4, 0.6, 0.8] : [CR, CR, CR, CR])).join('');
const DX = 12.2, DY = BAR, DW = 6.6, FOOT = 23;
const door = (w) => rp(R(DX, DY, w, FOOT - DY), [Math.min(1.6, w / 2), Math.min(1.6, w / 2), 0, 0]);

export default defineIcon({
  name: 'greenhouse',
  zh: '温室',
  category: 'nature',
  tags: ['glasshouse', 'garden', 'plants', 'gardening', 'grow', 'nursery', 'backyard', '花房', '暖房', '大棚'],
  // A greenhouse with its door shut; on hover the door swings open.
  svg: (u) => `${layer(u, 'f', FRAME, u.loS, { extra: `<path d="${GLASS}" fill="#fff"/><path d="${door(DW)}" fill="#fff"/>` })}
    <g filter="${u.hi}"><path data-n="d" fill="${u.upS}"/></g>`,
  target: (h) => ({ s: h ? 0.32 : 1 }),
  draw(p, E) { at(E.d, { d: door(DW * p.s) }); }
});
