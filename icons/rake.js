import { defineIcon, f, rr, rattle, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A garden rake upright: the handle, the head one unit below it, and four tines 2.4 wide
// with 4 between them (their outlines 2 apart), one unit below the head.
const HANDLE = rr(14.3, 0.6, 2.4, 14.8, 1.2), HEAD = rr(4.7, 16.4, 21.6, 2.6, 1.3);
const TINES = [0, 1, 2, 3].map((i) => rr(4.7 + i * 6.4, 20, 2.4, 4, 1.2)).join('');

export default defineIcon({
  name: 'rake',
  zh: '耙子',
  category: 'tools',
  tags: ['garden rake', 'leaves', 'gardening', 'yard work', 'autumn', 'tool', '钉耙', '园艺', '落叶'],
  // A rake; on hover it is drawn back and forth across the ground and comes to rest.
  svg: (u) => `${layer(u, 'h', HANDLE, u.loS)}${layer(u, 't', TINES, u.upS)}${layer(u, 'hd', HEAD, u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const x = rattle(clamp01(p.o), 3.2, 2);
    moveAll(E, ['h', 't', 'hd'], Math.abs(x) < 1e-4 ? '' : `translate(${f(x)} 0)`);
  }
});
