import { defineIcon, f, OL, rr } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A capsule-shaped clip 2.6 wide with a gap in its right-hand straight side. The gate fills
// the gap and is hinged at its top end.
const RING = 'M21.8 9V7.3A6.3 6.3 0 0 0 9.2 7.3V17.7A6.3 6.3 0 0 0 21.8 17.7V16H19.2V17.7A3.7 3.7 0 0 1 11.8 17.7V7.3A3.7 3.7 0 0 1 19.2 7.3V9Z';
const GATE = rr(19.2, 8.6, 2.6, 7.8, 1.3), HINGE = [20.5, 9.9];

export default defineIcon({
  name: 'carabiner',
  zh: '登山扣',
  category: 'travel',
  tags: ['carabiner', 'clip', 'climbing', 'hook', 'keyring', 'outdoor', 'gear', '挂扣', '攀岩'],
  // A carabiner with its gate shut; on hover the gate swings in on its hinge.
  svg: (u) => `${layer(u, 'ring', RING, u.loS)}${layer(u, 'g', GATE, u.upS, { sh: false })}`,
  target: (h) => ({ a: h ? 28 : 0 }),
  draw(p, E) { moveAll(E, ['g'], p.a ? `rotate(${f(p.a)} ${HINGE[0]} ${HINGE[1]})` : ''); }
});
