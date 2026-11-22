import { defineIcon, KR, f, DEEP, DEEPS, R, rp, rr, circ, at } from '../packages/core/src/kit.js';
import { back } from './_w2-devices.js';

const BODY = rr(4, 4.8, 23, 13, KR);
const PINS = rp(R(9.6, 15.6, 11.8, 4.6), [0, 0, 0.8, 0.8]);
const FANS = [10.4, 20.6];
// Four curved blades sweeping out from the hub, cut off at the rim of the fan.
const blades = (cx) => [0, 90, 180, 270].map((deg) => {
  const a = deg * Math.PI / 180, b = a + 1.2;
  return `M${f(cx + 1.2 * Math.cos(a))} ${f(11.3 + 1.2 * Math.sin(a))}A3.4 3.4 0 0 1 ${f(cx + 4.8 * Math.cos(b))} ${f(11.3 + 4.8 * Math.sin(b))}`;
}).join('');

export default defineIcon({
  name: 'graphics-card',
  zh: '显卡',
  category: 'devices',
  tags: ['gpu', 'video card', 'graphics', 'gaming', 'rendering', 'hardware', '独立显卡'],
  variants: ['check', 'alert', 'bolt'],
  // A graphics card with two fans and its connector pins; on hover both fans spin up.
  svg: (u) => `${back(u, PINS)}${back(u, BODY)}
      ${FANS.map((cx, i) => {
        const id = u.id('fan' + i);
        return `<clipPath id="${id}"><path d="${circ(cx, 11.3, 4.1)}"/></clipPath>
      <path d="${circ(cx, 11.3, 4.1)}" fill="#fff"/>
      <g clip-path="url(#${id})"><g data-n="f${i}"><path d="${blades(cx)}" fill="none" stroke-width="1.6" stroke-linecap="round" ${DEEPS}/></g></g>
      <path d="${circ(cx, 11.3, 1.5)}" ${DEEP}/>`;
      }).join('')}`,
  target: (h) => ({ a: h ? 270 : 0 }),
  draw(p, E) {
    FANS.forEach((cx, i) => at(E['f' + i], { transform: `rotate(${f(p.a)} ${cx} 11.3)` }));
  }
});
