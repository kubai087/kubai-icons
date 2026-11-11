import { defineIcon, KR, f, DEEP, WHITE, rr, clamp01, rattle, bump, at } from '../packages/core/src/kit.js';
import { solid } from './_devices.js';
import { flange, burst } from './_auto-parts.js';

// A crash sensor: a housing with an impact burst on its face, a mounting ear with a screw
// hole on the left and its connector standing out on the right.
const EAR = flange(3.4, 10.6, 12.5, 2.6, 'left');
const BODY = rr(9.2, 3.8, 13.2, 17.4, KR);
const PLUG = rr(21.2, 7.6, 6.4, 9.8, 1.8);
const SOCKET = rr(23.2, 10.2, 2.4, 4.6, 0.8);
const BX = 14.7, BY = 12.5;
const BURST = burst(4.2);

export default defineIcon({
  name: 'crash-sensor',
  zh: '碰撞传感器',
  category: 'devices',
  tags: ['impact', 'sensor', 'accelerometer', 'shock', 'collision', 'airbag', 'automotive', '传感器', '冲击'],
  variants: ['check', 'x', 'alert'],
  // A sensor with an impact burst on its face; on hover it takes a jolt, shudders and
  // settles while the burst flares.
  svg: (u) => `<g data-n="g">${solid(u, EAR.plate, u.loS)}<path d="${EAR.holes}" ${DEEP}/>
    ${solid(u, BODY, u.loS)}
    ${solid(u, PLUG, u.upS)}<path d="${SOCKET}" ${DEEP}/>
    <path data-n="burst" d="${BURST}" ${WHITE}/></g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    at(E.g, { transform: `translate(${f(rattle(o, 1.4, 3))} 0)` });
    at(E.burst, { transform: `translate(${BX} ${BY}) rotate(${f(12 * bump(o))}) scale(${f(1 + 0.22 * bump(o))})` });
  }
});
