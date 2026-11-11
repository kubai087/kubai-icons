import { defineIcon, f, ACC, rp, rr, clamp01, wave, at } from '../packages/core/src/kit.js';
import { carAt } from './_travel-transport.js';
import { solid } from './_devices.js';

// The car of the car icon, smaller, driven nose first into a brick wall. Its bonnet is
// buckled up and its front is jagged where it is crushed against the wall.
const GROUND = 21.2;
const WX = 22.6, WW = 4.8, WT = 3.6;                 // wall: left edge, width, top
const WALL = rr(WX, WT, WW, GROUND - WT, 1.2);
const ROW = (GROUND - WT) / 3;
// Three courses in running bond, one brick wide: the top and bottom courses are two half
// bricks, the middle course one whole brick.
const JOINTS = [1, 2].map((i) => `M${f(WX)} ${f(WT + i * ROW)}H${f(WX + WW)}`).join('')
  + [0, 2].map((i) => `M${f(WX + WW / 2)} ${f(WT + i * ROW)}V${f(WT + (i + 1) * ROW)}`).join('');
// The car's front (x = 27 in carSide's coordinates) sits just inside the wall's edge, as if
// driven into it.
const S = 0.84, OX = 3.4, OY = GROUND - 17.3 * S;
const NOSE = (P) => rp(P([[3.6, 10.2], [21.6, 10.2], [23.4, 8.8], [25.2, 10.8], [26.8, 11.6], [25.4, 14], [27, 16.2], [27, 18], [3.6, 18]]),
  [2.2, 0.4, 0.6, 0.4, 0.6, 0.5, 0.6, 2.2, 2.2]);
// The front wheel's contact with the ground: the car pitches round it on impact.
const PX = OX + 17.8 * S, PY = GROUND;

export default defineIcon({
  name: 'car-crash',
  zh: '汽车碰撞',
  category: 'transport',
  tags: ['crash', 'accident', 'collision', 'wreck', 'damage', 'insurance', 'car', 'wall', '车祸', '事故', '撞车'],
  variants: [],
  // A car crumpled nose first against a brick wall; on hover it rams the wall, springs back,
  // and the wall's courses shake and settle.
  svg: (u) => `<g data-n="car">${carAt(u, OX, OY, S, { nose: NOSE })}</g>
    <g data-n="wall">${solid(u, WALL, u.loS)}
      <clipPath id="${u.id('w')}"><path d="${WALL}"/></clipPath>
      <path d="${JOINTS}" ${ACC} stroke-linecap="butt" clip-path="url(#${u.id('w')})"/></g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    // A short lunge into the wall, then a spring back that overshoots once and settles.
    const dx = wave(o, (t) => {
      if (t < 0.18) return 0.9 * Math.sin((Math.PI / 2) * (t / 0.18));
      const v = (t - 0.18) / 0.82;
      return 0.9 * (1 - v) * (1 - v) * Math.cos(2.5 * Math.PI * v);
    });
    const pitch = wave(o, (t) => -2.2 * Math.sin(Math.PI * Math.min(1, t * 1.6)) * (1 - t));
    at(E.car, { transform: `translate(${f(dx)} 0) rotate(${f(pitch)} ${f(PX)} ${f(PY)})` });
    const shake = wave(o, (t) => 0.5 * Math.sin(3 * Math.PI * t) * (1 - t));
    at(E.wall, { transform: `translate(${f(shake)} 0)` });
  }
});
