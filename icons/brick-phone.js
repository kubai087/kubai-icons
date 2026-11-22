import { defineIcon, KR, CR, f, SOFTS, rr, at, clamp01, rattle, settle } from '../packages/core/src/kit.js';
import { back } from './_w2-devices.js';

const ANTENNA = rr(12.2, 0.4, 2.6, 9.2, 1.3);
const BODY = rr(9.2, 5.6, 12.6, 18.6, KR);
const SCREEN = rr(11.4, 7.8, 8.2, 4.4, CR);
const KEYS = rr(11.4, 14.4, 8.2, 7.6, CR);
// Lines of the body colour that split the keypad into a three by three grid of keys.
const GRID = 'M14.13 14.4V22M16.87 14.4V22M11.4 16.93H19.6M11.4 19.47H19.6';

export default defineIcon({
  name: 'brick-phone',
  zh: '大哥大',
  category: 'devices',
  tags: ['brick phone', 'mobile phone', 'cellphone', 'car phone', 'antenna', 'retro', '80s', '90s', '老式手机', '移动电话'],
  variants: ['check', 'x', 'sync'],
  // A tall mobile phone with a stubby antenna, a small screen and a keypad; on hover the antenna
  // is pulled up and the phone rings.
  svg: (u) => `<g data-n="g"><g data-n="ant">${back(u, ANTENNA)}</g>${back(u, BODY)}
      <path d="${SCREEN}" fill="#fff"/>
      <path d="${KEYS}" fill="#fff"/>
      <path d="${GRID}" fill="none" stroke-width="1.2" ${SOFTS}/></g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    at(E.ant, { transform: `translate(0 ${f(-2.4 * settle(Math.min(1, o * 2.5)))})` });
    at(E.g, { transform: `rotate(${f(rattle(o, 8, 3))} 15.5 24.2)` });
  }
});
