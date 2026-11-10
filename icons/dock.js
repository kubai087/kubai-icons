import { defineIcon, f, DEEP, rr, at, wave } from '../packages/core/src/kit.js';
import { WIN, back, front } from './_interface.js';

// Three app tiles sitting in the dock, 4.2 square.
const TILES = [8.2, 13.4, 18.6], TY = 13.2, S = 4.2;

export default defineIcon({
  name: 'dock',
  zh: '程序坞',
  category: 'layout',
  tags: ['app dock', 'taskbar', 'launcher', 'apps', 'desktop', 'mac', '任务栏', 'Dock'],
  // A desktop with a dock of app tiles; on hover the middle app bounces as it opens.
  svg: (u) => `${back(u, WIN)}
      ${front(u, rr(7, 12, 17, 6.6, 1.8))}
      <path d="${rr(TILES[0], TY, S, S, 1) + rr(TILES[2], TY, S, S, 1)}" ${DEEP}/>
      <path data-n="t" d="${rr(TILES[1], TY, S, S, 1)}" ${DEEP}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    // Two hops, the second lower, landing back in place.
    const y = wave(p.o, (t) => -6.2 * (1 - t) * Math.abs(Math.sin(2 * Math.PI * t)));
    at(E.t, { d: rr(TILES[1], TY + y, S, S, 1) });
  }
});
