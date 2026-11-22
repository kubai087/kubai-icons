import { defineIcon, CR, f, DEEP, rr, circ, at, rattle, clamp01 } from '../packages/core/src/kit.js';
import { back } from './_w2-devices.js';
import { circCW } from './_devices.js';

// One outline round the wide body and the two grips that hang below it.
const BODY = rr(4, 5.6, 23, 11.4, 4) + circCW(8.2, 15.2, 4.2) + circCW(22.8, 15.2, 4.2);
const STICKS = [7.45, 23.55];

export default defineIcon({
  name: 'handheld-console',
  zh: '掌上游戏机',
  category: 'devices',
  tags: ['handheld gaming pc', 'portable console', 'game handheld', 'gaming', 'play', '掌机', '游戏'],
  variants: ['check', 'plus', 'bolt'],
  // A wide handheld console with a screen between two thumbsticks; on hover it rocks in the
  // hands as the sticks are pushed.
  svg: (u) => `<g data-n="g">${back(u, BODY)}
      <path d="${rr(10.9, 7.6, 9.2, 7.4, CR)}" fill="#fff"/>
      ${STICKS.map((x, i) => `<path data-n="s${i}" d="${circ(x, 10.2, 1.45)}" ${DEEP}/>`).join('')}</g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), a = rattle(o, 6, 3), x = rattle(o, 0.7, 3);
    at(E.g, { transform: `rotate(${f(a)} 15.5 12.5)` });
    STICKS.forEach((_, i) => at(E['s' + i], { transform: `translate(${f(i ? -x : x)} 0)` }));
  }
});
