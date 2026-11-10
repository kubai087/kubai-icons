import { defineIcon, f, ACC, DEEP, DEEPS, circ, at, rattle, clamp01 } from '../packages/core/src/kit.js';
import { solid, span } from './_devices.js';

const C = [15.5, 15.4];

export default defineIcon({
  name: 'item-tracker',
  zh: '防丢器',
  category: 'devices',
  tags: ['airtag', 'tracker', 'tag', 'find', 'lost', 'keys', 'locate', '定位器', '寻物'],
  variants: ['plus', 'check', 'x', 'alert', 'search'],
  // A round item tracker hanging from a key ring; on hover it plays its sound: it swings on the
  // ring and a sound ring spreads across its face.
  svg: (u) => `<circle cx="15.5" cy="5" r="3.2" fill="none" stroke-width="2.2" ${DEEPS}/>
      <g data-n="g">${solid(u, circ(C[0], C[1], 8.4), u.loS)}
        <path d="${circ(C[0], C[1], 5.8)}" fill="#fff"/>
        <circle data-n="wv" cx="${C[0]}" cy="${C[1]}" r="1.3" fill="none" ${ACC} opacity="0"/>
        <circle cx="${C[0]}" cy="${C[1]}" r="1.3" ${DEEP}/></g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), t = span(o, 0.05, 0.85);
    at(E.g, { transform: `rotate(${f(rattle(o, 22, 3))} 15.5 8.2)` });
    at(E.wv, { r: f(1.3 + 3.5 * t), opacity: f(t > 0 && t < 1 ? 1 - t : 0) });
  }
});
