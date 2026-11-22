import { defineIcon, KR, CR, f, DEEP, DEEPS, rp, rr, at, clamp01, bump } from '../packages/core/src/kit.js';
import { back } from './_w2-devices.js';
import { axis } from './_b7-devices.js';
import { span } from './_devices.js';

const BODY = rr(6.2, 1.4, 15.2, 22.6, KR);
const SCREEN = rr(8.4, 3.6, 10.8, 12.2, CR);
// The stylus leans on the screen from the upper right, its nib on the screen.
const TIP = [14.4, 10.4], on = axis(TIP[0], TIP[1], 45);
const BARREL = rp([on(1.8, -1.1), on(13, -1.1), on(13, 1.1), on(1.8, 1.1)], [0.2, 1.1, 1.1, 0.2]);
const NIB = rp([on(0, -0.5), on(2.2, -1.1), on(2.2, 1.1), on(0, 0.5)], [0.5, 0.1, 0.1, 0.5]);

export default defineIcon({
  name: 'pda',
  zh: '掌上电脑',
  category: 'devices',
  tags: ['palmtop', 'personal digital assistant', 'organizer', 'handheld computer', 'stylus', 'retro', '90s', 'PDA', '商务通'],
  variants: ['check', 'x', 'sync', 'lock'],
  // A handheld organizer with a tall screen and buttons below, its stylus resting on the
  // screen; on hover the stylus lifts, taps the screen and a ripple spreads from the nib.
  svg: (u) => `${back(u, BODY)}
      <path d="${SCREEN}" fill="#fff"/>
      <circle cx="9.8" cy="20" r="1.2" ${DEEP}/><circle cx="13.8" cy="20" r="1.2" ${DEEP}/><circle cx="17.8" cy="20" r="1.2" ${DEEP}/>
      <circle data-n="rip" cx="${TIP[0]}" cy="${TIP[1]}" fill="none" stroke-width="1.4" ${DEEPS}/>
      <g data-n="pen"><path d="${NIB}" ${DEEP}/>${back(u, BARREL)}</g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), [dx, dy] = on(1.8 * bump(Math.min(1, o * 2)), 0), r = span(o, 0.5, 1);
    at(E.pen, { transform: `translate(${f(dx - TIP[0])} ${f(dy - TIP[1])})` });
    at(E.rip, { r: f(1 + 2.6 * r), opacity: f(Math.sin(Math.PI * r)) });
  }
});
