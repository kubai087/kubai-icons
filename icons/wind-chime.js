import { defineIcon, f, OL, ACC, rr, rattle, wave, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A wind chime: a bar on a hanging cord, and four tubes of different lengths, 2.4 wide with
// 4 between them (their outlines 2 apart), each hung on its own short string below the bar.
const BAR = rr(4.2, 2.2, 22.6, 2.6, 1.3), TOP = 4.8, HANG = 9.2;
const TUBES = [[4.7, 10], [11.1, 14.6], [17.5, 12.2], [23.9, 8.4]];
const tube = ([x, len]) => rr(x, HANG, 2.4, len, 1.2);
const NAMES = TUBES.map((_, i) => 't' + i);

export default defineIcon({
  name: 'wind-chime',
  zh: '风铃',
  category: 'home',
  tags: ['wind chime', 'chimes', 'garden', 'porch', 'breeze', 'decor', 'sound', '风', '门廊', '院子'],
  // A wind chime; on hover a breeze sets its tubes swinging, out of step, until they hang
  // still again.
  svg: (u) => `<path d="M15.5 -0.6V2.2" fill="none" stroke-width="1.6" stroke-linecap="round" ${ACC}/>
    ${TUBES.map((t, i) => `<g data-n="w${i}"><path d="M${f(t[0] + 1.2)} ${TOP}V${HANG}" fill="none" stroke-width="1.6" ${ACC}/></g>${layer(u, NAMES[i], tube(t), i % 2 ? u.upS : u.loS)}`).join('')}
    ${layer(u, 'b', BAR, u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    TUBES.forEach(([x], i) => {
      const a = wave(o, (t) => (8 - i) * (1 - t) * Math.sin(3 * Math.PI * t + i * 0.9) * Math.min(1, t * 6));
      const tr = Math.abs(a) < 1e-4 ? '' : `rotate(${f(a)} ${f(x + 1.2)} ${TOP})`;
      moveAll(E, [NAMES[i], 'w' + i], tr);
    });
  }
});
