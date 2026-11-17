import { defineIcon, CR, f, ACC, SOFTS, R, rp, rr, at, clamp01, rattle } from '../packages/core/src/kit.js';
import { back, front } from './_w2-devices.js';
import { span } from './_devices.js';

// An open flip phone from the front: a lid holding the screen, a hinge barrel a little wider
// than the phone, and a base with a white keypad split into keys by lines of the body colour.
// Both halves run under the hinge, so it covers their square ends.
const X = 8.7, W = 13.6;
const LID = rp(R(X, 0.8, W, 12.4), [3.2, 3.2, 0, 0]);
const BASE = rp(R(X, 14, W, 10.2), [0, 0, 3.2, 3.2]);
const HINGE = rr(7.9, 12.4, 15.2, 2.6, 1.3);
const SCREEN = rr(10.7, 2.8, 9.6, 7.6, CR);
const KEYS = rr(10.7, 17, 9.6, 5.2, CR);
const GRID = 'M13.9 17V22.2M17.1 17V22.2M10.7 19.6H20.3';

export default defineIcon({
  name: 'flip-phone',
  zh: '翻盖手机',
  category: 'devices',
  tags: ['flip phone', 'clamshell', 'feature phone', 'mobile', 'cellphone', 'y2k', 'retro', '2000s', '老手机', '功能机', '千禧年'],
  variants: ['check', 'x', 'heart'],
  off: true,
  // An open flip phone; on hover a call comes in: it buzzes and the caller's name and number
  // appear on the screen.
  svg: (u) => `<g data-n="g">${back(u, LID)}${back(u, BASE)}
      <path d="${SCREEN}" fill="#fff"/>
      <path data-n="ln" ${ACC}/>
      <path d="${KEYS}" fill="#fff"/>
      <path d="${GRID}" fill="none" stroke-width="1.6" ${SOFTS}/>
      ${front(u, HINGE)}</g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    at(E.g, { transform: `rotate(${f(rattle(o, 9, 3))} 15.5 12.5)` });
    const l1 = 3.4 + 1.6 * span(o, 0.2, 0.6), l2 = 3.6 * span(o, 0.45, 0.9);
    at(E.ln, { d: `M13 5.1H${f(13 + l1)}` + (l2 > 0.05 ? `M13 8.1H${f(13 + l2)}` : '') });
  }
});
