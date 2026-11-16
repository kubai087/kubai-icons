import { defineIcon, f, WHITE, rr, circ, ellipse, at, clamp01, bump, rattle } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';

// A bag of pet food that fills out toward its foot, a sealed band across its top in front
// of it, and a paw print on its face.
const BAG = 'M9 5H22C23.4 9 24.6 14 24.6 19.6V20.8C24.6 22.4 23.4 23.6 21.8 23.6H9.2C7.6 23.6 6.4 22.4 6.4 20.8V19.6C6.4 14 7.6 9 9 5Z';
const SEAL = rr(8, 1.4, 15, 4.6, 1.6);
// The paw: a pad and three toes, each toe 2 clear of its neighbours and of the pad.
const PAW = ellipse(0, 1.6, 3.6, 2.8) + [[-4.4, -2.8], [0, -5], [4.4, -2.8]].map(([x, y]) => circ(x, y, 1.4)).join('');

export default defineIcon({
  name: 'pet-food-bag',
  zh: '宠物粮袋',
  category: 'home',
  tags: ['pet food', 'dog food', 'cat food', 'kibble', 'bag', 'pet', '狗粮', '猫粮', '宠物粮', '宠物'],
  variants: ['plus', 'check', 'heart'],
  // A bag of pet food with a paw print; on hover it hops and rocks to rest.
  svg: (u) => `<g data-n="g">${layer(u, 'b', BAG, u.loS, { extra: `<path d="${PAW}" transform="translate(15.5 15.6)" ${WHITE}/>` })}
    ${layer(u, 's', SEAL, u.upS)}</g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    at(E.g, { transform: `translate(0 ${f(-1.8 * bump(o))}) rotate(${f(rattle(o, 7, 3))} 15.5 23.8)` });
  }
});
