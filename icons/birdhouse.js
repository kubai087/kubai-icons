import { defineIcon, KR, f, rp, rr, circ, rattle, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A box with a pitched roof in front of its top, a round entrance 2 clear of the roof and
// the box's sides, and a short post one unit below.
const ROOF = rp([[5.6, 10.6], [15.5, 2.2], [25.4, 10.6]], [1.2, 1.4, 1.2]);
const BOX = rr(8.4, 8.6, 14.2, 11.6, KR), HOLE = circ(15.5, 15, 2.4), POST = rr(14.2, 21.2, 2.6, 2.8, 1.2);

export default defineIcon({
  name: 'birdhouse',
  zh: '鸟屋',
  category: 'nature',
  tags: ['bird house', 'nest box', 'garden', 'birds', 'backyard', 'nature', '鸟窝', '鸟巢', '院子'],
  // A birdhouse on its post; on hover it sways on the post and settles.
  svg: (u) => `${layer(u, 'po', POST, u.loS)}
    ${layer(u, 'b', BOX, u.loS, { extra: `<path d="${HOLE}" fill="#fff"/>` })}${layer(u, 'r', ROOF, u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const a = rattle(clamp01(p.o), 6, 3);
    moveAll(E, ['b', 'r'], Math.abs(a) < 1e-4 ? '' : `rotate(${f(a)} 15.5 21.2)`);
  }
});
