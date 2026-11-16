import { defineIcon, KR, f, OL, ACC, WHITES, rr, at, rattle, clamp01 } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';

// A cage hanging from a ring: the dome is a lighter band over the top of the cage, the bars
// stand 2 clear of the dome and the base so their round ends show, and the base stands in
// front of the cage's foot.
const RING = 'M15.5 -0.4A1.5 1.5 0 1 1 15.49 -0.4';
const DOME = 'M7.4 9.6V8.4C7.4 4.6 11 2.4 15.5 2.4C20 2.4 23.6 4.6 23.6 8.4V9.6Z';
const CAGE = rr(7.4, 7, 16.2, 14.4, KR), BASE = rr(6, 20.4, 19, 3.2, 1.6);

export default defineIcon({
  name: 'bird-cage',
  zh: '鸟笼',
  category: 'home',
  tags: ['birdcage', 'cage', 'pet bird', 'parrot', 'canary', 'pet', '笼子', '宠物鸟', '鹦鹉'],
  variants: ['heart'],
  // A bird cage hanging from its ring; on hover it swings on the ring and settles.
  svg: (u) => `<g data-n="g">
      <path d="${RING}" fill="none" stroke-width="1.6" ${ACC}/>
      ${layer(u, 'c', CAGE, u.loS, { extra: `<path d="M11.4 11.6V18.4M15.5 11.6V18.4M19.6 11.6V18.4" class="ln" ${WHITES}/>` })}
      ${layer(u, 'd', DOME, u.upS)}${layer(u, 'b', BASE, u.upS)}
    </g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const a = rattle(clamp01(p.o), 6, 2);
    at(E.g, { transform: Math.abs(a) < 1e-4 ? '' : `rotate(${f(a)} 15.5 -1.9)` });
  }
});
