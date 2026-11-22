import { defineIcon, f, DEEP, DEEPS, circ, at } from '../packages/core/src/kit.js';
import { back } from './_w2-devices.js';
import { arcPath } from './_devices.js';

// A round body cut flat along the bottom, its two bottom corners rounded off.
const BODY = (() => {
  const cx = 15.5, cy = 12.2, r = 11.4, y = 22.4, k = 1.2;
  const pt = (deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];
  const dx = Math.sqrt(r * r - (y - cy) ** 2);
  const ac = Math.atan2(y - cy, dx) * 180 / Math.PI;
  const [ax, ay] = pt(180 - ac + 8), [bx, by] = pt(ac - 8);
  return `M${f(ax)} ${f(ay)}A${r} ${r} 0 1 1 ${f(bx)} ${f(by)}Q${f(cx + dx)} ${y} ${f(cx + dx - k)} ${y}`
    + `H${f(cx - dx + k)}Q${f(cx - dx)} ${y} ${f(ax)} ${f(ay)}Z`;
})();
const C = [15.5, 9.8];

export default defineIcon({
  name: 'cd-player',
  zh: 'CD 随身听',
  category: 'devices',
  tags: ['discman', 'portable cd player', 'cd', 'compact disc', 'music', 'retro', '90s', 'CD 机', '随身听'],
  variants: ['check', 'x', 'heart'],
  // A round portable CD player with the disc showing through its lid and three buttons along its flat edge;
  // on hover the disc spins.
  svg: (u) => `${back(u, BODY)}
      <path d="${circ(...C, 6.2)}" fill="#fff"/>
      <g data-n="spin"><path d="${arcPath(...C, 4, 292, 336) + arcPath(...C, 4, 112, 156)}" fill="none" stroke-width="1.2" stroke-linecap="round" ${DEEPS}/></g>
      <circle cx="${C[0]}" cy="${C[1]}" r="1.4" ${DEEP}/>
      <circle cx="11.5" cy="19.2" r="1.2" ${DEEP}/><circle cx="15.5" cy="19.2" r="1.2" ${DEEP}/><circle cx="19.5" cy="19.2" r="1.2" ${DEEP}/>`,
  target: (h) => ({ a: h ? 180 : 0 }),
  draw(p, E) { at(E.spin, { transform: `rotate(${f(p.a)} ${C[0]} ${C[1]})` }); }
});
