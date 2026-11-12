import { defineIcon, f, OL, clamp01, at, wave } from '../packages/core/src/kit.js';
import { flameShape, flameTongues as outer } from './_weather-nature.js';

export default defineIcon({
  name: 'flame',
  zh: '火焰',
  category: 'nature',
  tags: ['fire', 'hot', 'trending', 'popular', 'burn', 'streak', '热门'],
  // A flame of two tongues round a lighter core; on hover it flickers, the tongues licking
  // side to side out of step, until it burns steady again.
  svg: (u) => `<g filter="${u.sh}"><g filter="${u.hi}"><path data-n="fl" fill="${u.loS}"/></g></g><path data-n="flO" stroke-linejoin="round" ${OL}/>
    <g filter="${u.hi}"><path data-n="co" fill="${u.upS}"/></g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), w = (ph) => wave(o, (t) => (1 - t) * Math.sin(3 * Math.PI * t - ph));
    const lift = 1.4 * wave(o, (t) => (1 - t) * Math.abs(Math.sin(3 * Math.PI * t)));
    const d = outer(16.6 + 2.8 * w(0), 1.2 - lift, 9 + 1.6 * w(1.2), 8.6 - lift * 0.6);
    at(E.fl, { d }); at(E.flO, { d });
    at(E.co, { d: flameShape(21.6, 4.4, 9.6 + lift * 0.6, 0.4 + 1.8 * w(0.8)) });
  }
});
