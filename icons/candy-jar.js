import { defineIcon, f, WHITE, rp, rr, circ } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A jar of sweets: a wide body with a wrapped sweet printed on it, and a lid with a knob
// sitting on top of it.
const BODY = rr(7.2, 8, 16.6, 16, 3);
const LID = rr(9, 4, 13, 4, 1.6), KNOB = rr(13.5, 2, 4, 3, 1);
const SWEET = [15.5, 16];
const MARK = circ(SWEET[0], SWEET[1], 2.6)
  + rp([[SWEET[0] - 2, SWEET[1]], [SWEET[0] - 5.6, SWEET[1] - 2.4], [SWEET[0] - 5.6, SWEET[1] + 2.4]], [0.3, 0.8, 0.8])
  + rp([[SWEET[0] + 2, SWEET[1]], [SWEET[0] + 5.6, SWEET[1] + 2.4], [SWEET[0] + 5.6, SWEET[1] - 2.4]], [0.3, 0.8, 0.8]);
const LIFT = 2.6;

export default defineIcon({
  name: 'candy-jar',
  zh: '糖果罐',
  category: 'food',
  tags: ['candy jar', 'sweet jar', 'cookie jar', 'jar', 'sweets', 'candy', 'treat', 'container', '糖罐', '零食罐', '罐子'],
  variants: ['heart', 'plus'],
  // A jar of sweets; on hover its lid lifts off.
  svg: (u) => `${layer(u, 'k', KNOB, u.upS, { sh: false })}${layer(u, 'l', LID, u.upS)}
    ${layer(u, 'b', BODY, u.loS, { extra: `<path d="${MARK}" ${WHITE}/>` })}`,
  target: (h) => ({ y: h ? -LIFT : 0 }),
  draw(p, E) { moveAll(E, ['k', 'l'], `translate(0 ${f(p.y)})`); }
});
