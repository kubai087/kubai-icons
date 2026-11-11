import { defineIcon, KR, CR, f, DEEP, rr, clamp01, at } from '../packages/core/src/kit.js';
import { solid } from './_devices.js';

// An electronic control unit seen from its connector side: a sealed housing with a white type
// label, and a wide connector that takes up most of the face, with four pin sockets.
const BODY = rr(4.8, 4.1, 21.4, 16.8, KR);
const LABEL = rr(7.6, 6.8, 9.2, 3, CR);
const PLUG = rr(7.6, 11.8, 15.8, 6.6, 1.8);
const SW = 1.6, SG = 2.4, N = 4;
const SX = 15.5 - (N * SW + (N - 1) * SG) / 2;
const socket = (i) => rr(SX + i * (SW + SG), 13.4, SW, 3.4, 0.6);
const SOCKETS = Array.from({ length: N }, (_, i) => socket(i)).join('');

export default defineIcon({
  name: 'control-unit',
  zh: '控制单元',
  category: 'devices',
  tags: ['ecu', 'controller', 'module', 'electronics', 'automotive', 'connector', 'airbag', '控制器', '电控单元'],
  variants: ['check', 'x', 'alert', 'cog'],
  // A control unit with a wide connector; on hover its pins light up one after another, left
  // to right.
  svg: (u) => `${solid(u, BODY, u.loS)}
    <path d="${LABEL}" fill="#fff"/>
    ${solid(u, PLUG, u.upS)}<path d="${SOCKETS}" ${DEEP}/>
    ${Array.from({ length: N }, (_, i) => `<path data-n="p${i}" d="${socket(i)}" fill="#fff" opacity="0"/>`).join('')}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    for (let i = 0; i < N; i++) at(E[`p${i}`], { opacity: f(clamp01((o - i * 0.15) / 0.4)) });
  }
});
