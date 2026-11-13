import { defineIcon, f, DEEP, R, rp, rr, rattle, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A straw skep: four coils one unit apart, widest below the middle like a bell, and a dark
// entrance standing on the bottom edge, 2 below the top of its coil.
const COILS = [rr(10.4, 3, 10.2, 4.2, 2.1), rr(7.4, 8.2, 16.2, 4.4, 2.2), rr(5.6, 13.6, 19.8, 4.4, 2.2), rr(6.6, 19, 17.8, 4.4, 2.2)];
const DOOR = rp(R(13.2, 21, 4.6, 2.4), [2.3, 2.3, 0, 0]);
const NAMES = COILS.map((_, i) => 'c' + i);

export default defineIcon({
  name: 'beehive',
  zh: '蜂箱',
  category: 'nature',
  tags: ['beehive', 'skep', 'bees', 'honey', 'garden', 'farm', 'beekeeping', '蜂巢', '养蜂', '蜂蜜'],
  // A beehive; on hover it hums, rocking on its base as the bees stir.
  svg: (u) => COILS.map((d, i) => layer(u, NAMES[i], d, i % 2 ? u.upS : u.loS, i === 3 ? { extra: `<path d="${DOOR}" ${DEEP}/>` } : {})).join(''),
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const a = rattle(clamp01(p.o), 5, 3);
    moveAll(E, NAMES, Math.abs(a) < 1e-4 ? '' : `rotate(${f(a)} 15.5 23.4)`);
  }
});
