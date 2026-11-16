import { defineIcon, KR, f, DEEPS, rr, at, clamp01, bump, rattle } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';
import { nudge } from './_place.js';

// A litter tray heaped with litter, highest at its left, and a slotted scoop held over it; the scoop's head dips
// behind the tray's front wall, in front of the litter.
const TRAY = rr(4.4, 15, 22.2, 7.6, KR);
const LITTER = 'M7 17C7.4 12.6 9.4 10.2 12.2 10.2C15.4 10.2 19.4 12.2 24 17Z';
// The scoop about the centre of its head: a slotted head and a handle running up from it.
const SCOOP = rr(-5.2, -4.4, 10.4, 8.8, 2.2) + rr(-1.4, -12.8, 2.8, 8.8, 1.4);
const SLOTS = 'M-1.8 -1.6V1.6M1.8 -1.6V1.6';
const AT = [18.4, 10.4], TILT = 30;

// Drawn high to leave the scoop's handle room; moved down to the canvas centre.
export default nudge(defineIcon({
  name: 'litter-box',
  zh: '猫砂盆',
  category: 'home',
  tags: ['litter tray', 'cat litter', 'litter scoop', 'cat toilet', 'pet', 'cleaning', '猫砂', '猫厕所', '铲屎', '宠物'],
  variants: ['check', 'clock'],
  // A litter tray with a scoop over it; on hover the scoop dips in and sifts.
  svg: (u) => `${layer(u, 'l', LITTER, u.loS)}
    <g data-n="sc">${layer(u, 'h', SCOOP, u.upS, { extra: `<path d="${SLOTS}" class="ln" ${DEEPS}/>` })}</g>
    ${layer(u, 't', TRAY, u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    at(E.sc, { transform: `translate(${AT[0]} ${f(AT[1] + 2.4 * bump(o))}) rotate(${f(TILT + rattle(o, 10, 3))})` });
  }
}), 0, 1.6);
