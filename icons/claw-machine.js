import { defineIcon, CR, KR, f, DEEP, DEEPS, rr, circ, at, clamp01 } from '../packages/core/src/kit.js';
import { back } from './_w2-devices.js';
import { layer, moveAll } from './_science-edu-sports.js';
import { span } from './_devices.js';

// A claw crane from the front: a cabinet with a tall glass window, a claw hanging on its cable
// from the top of it and two prize balls on its floor, the left one against the wall and the right one
// right under the claw. Below are the prize chute and a button.
const WX = 9.1, WY = 3, WW = 12.8, WH = 13.2, FLOOR = WY + WH;
const BR = 2.2, B1 = WX + BR, B2 = B1 + 2 * BR, BY = FLOOR - BR;
const claw = (y, s) => `M${f(15.5 - 1.6 - s)} ${f(y + 2)}C${f(13 - 1.4 * s)} ${f(y + 3)} ${f(13 - 1.4 * s)} ${f(y + 4.4)} ${f(14.2 - s)} ${f(y + 5.2)}`
  + `M${f(15.5 + 1.6 + s)} ${f(y + 2)}C${f(18 + 1.4 * s)} ${f(y + 3)} ${f(18 + 1.4 * s)} ${f(y + 4.4)} ${f(16.8 + s)} ${f(y + 5.2)}`;
const TOP = WY + 1.6, LOW = BY - 5.4;

export default defineIcon({
  name: 'claw-machine',
  zh: '抓娃娃机',
  category: 'sports',
  tags: ['claw machine', 'crane game', 'arcade', 'prize', 'toy', 'game', '娃娃机', '夹娃娃', '街机'],
  variants: ['star', 'heart'],
  allow: { markGap: 'the cable and the prongs both run into the claw head, which joins them into one claw' },
  // A claw machine; on hover the claw drops, closes on the prize under it and lifts it up.
  svg: (u) => `${back(u, rr(7.1, 1, 16.8, 23, KR))}
      <path d="${rr(WX, WY, WW, WH, CR)}" fill="#fff"/>
      ${layer(u, 'p1', circ(B1, BY, BR), u.loS, { sh: false })}${layer(u, 'p2', circ(B2, BY, BR), u.loS, { sh: false })}
      <path data-n="cb" fill="none" stroke-width="1.6" ${DEEPS}/>
      <path data-n="cl" fill="none" stroke-width="1.6" stroke-linecap="round" ${DEEPS}/>
      <path data-n="hd" ${DEEP}/>
      <path d="${rr(10.1, 18.4, 5, 3.2, CR)}" ${DEEP}/>
      <path d="${circ(19.3, 20, 1.4)}" ${DEEP}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    const down = span(o, 0, 0.4), grab = span(o, 0.4, 0.55), up = span(o, 0.55, 1);
    const y = TOP + (LOW - TOP) * (down - up);
    const s = 1.2 * Math.sin(Math.PI * Math.min(1, down * 1.2)) * (1 - grab);
    at(E.cl, { d: claw(y, s) });
    at(E.cb, { d: `M15.5 ${WY}V${f(y + 0.4)}` });
    at(E.hd, { d: rr(13.5, y, 4, 2.4, 0.6) });
    const lift = (LOW - TOP) * up;
    moveAll(E, ['p2'], lift < 1e-3 ? '' : `translate(0 ${f(-lift)})`);
  }
});
