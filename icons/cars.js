import { defineIcon, f, clamp01, rattle, at } from '../packages/core/src/kit.js';
import { carAt } from './_travel-transport.js';

// Two cars in side view, the one behind set up and to the left, so that its roof, its tail
// and a rear wheel show past the car in front. Both span 23 together.
// The back car's roof must end inside the span of the front car's roof, clear of its rounded
// corner, so DX >= 2.7 + 0.59 * DY.
const S = 0.82, DX = 4.9, DY = 3.4;
const BX = 4, BY = 12.5 - (17.3 * S + DY) / 2;

export default defineIcon({
  name: 'cars',
  zh: '多辆汽车',
  category: 'transport',
  tags: ['vehicles', 'fleet', 'traffic', 'convoy', 'automobiles', 'parking', '车队', '车辆'],
  variants: ['plus', 'check', 'x', 'search'],
  // Two cars, one behind the other; on hover both roll forward, rock on their springs and
  // settle, the one behind a beat later.
  svg: (u) => `<g data-n="b">${carAt(u, BX, BY, S, { front: false })}</g>
    <g data-n="fr">${carAt(u, BX + DX, BY + DY, S)}</g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    const roll = (el, t, x0, y0) => at(el, {
      transform: `translate(${f(-0.6 + 1.2 * t + rattle(t, 0.7, 1))} 0) rotate(${f(rattle(t, -2, 2))} ${f(x0 + 6 * S)} ${f(y0 + 17.3 * S)})`
    });
    roll(E.fr, clamp01(o / 0.8), BX + DX, BY + DY);
    roll(E.b, clamp01((o - 0.2) / 0.8), BX, BY);
  }
});
