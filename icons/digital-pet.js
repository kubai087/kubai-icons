import { defineIcon, f, DEEP, WHITE, rp, rr, circ, at, clamp01, wave, bump } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';

// A pocket virtual pet: an egg-shaped shell, rounder at the top, with a white screen and three
// buttons below it. The pet is a small eared creature standing on the floor of the screen.
const CX = 15.5, CY = 13.5, RX = 9.4, RT = 11.6, RB = 9.6;
const EGG = `M${f(CX - RX)} ${CY}A${RX} ${RT} 0 0 1 ${f(CX + RX)} ${CY}A${RX} ${RB} 0 0 1 ${f(CX - RX)} ${CY}Z`;
const SCREEN = rr(10.3, 6.4, 10.4, 8.8, 1.6);
const PET = rp([[12.5, 10.4], [14.5, 10.4], [14.5, 11.8], [16.5, 11.8], [16.5, 10.4], [18.5, 10.4], [18.5, 15.2], [12.5, 15.2]],
  [0.6, 0.6, 0, 0, 0.6, 0.6, 0, 0]);
const BY = 18.4;

export default defineIcon({
  name: 'digital-pet',
  zh: '电子宠物',
  category: 'sports',
  tags: ['virtual pet', 'digital pet', 'keychain game', 'handheld', 'toy', 'y2k', 'retro', '90s', '电子鸡', '宠物蛋', '千禧年'],
  variants: ['heart', 'plus'],
  // A virtual pet on its egg-shaped toy; on hover the middle button is pressed and the pet
  // hops twice on its screen.
  svg: (u) => `${layer(u, 'egg', EGG, u.loS, { extra: `<path d="${SCREEN}" fill="#fff"/>` })}
      <path data-n="pet" d="${PET}" ${DEEP}/>
      <path d="${circ(10.9, BY, 1.2) + circ(20.1, BY, 1.2)}" ${WHITE}/>
      <path data-n="b" d="${circ(15.5, BY, 1.2)}" ${WHITE}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    const y = wave(o, (t) => -1.8 * (1 - t) * Math.abs(Math.sin(2 * Math.PI * t)));
    at(E.pet, { transform: Math.abs(y) < 1e-4 ? '' : `translate(0 ${f(y)})` });
    const k = 1 - 0.3 * bump(o);
    at(E.b, { transform: `translate(15.5 ${BY}) scale(${f(k)}) translate(-15.5 ${-BY})` });
  }
});
