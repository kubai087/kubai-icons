import { defineIcon, f, OL, DEEPS, R, rp, rr, at } from '../packages/core/src/kit.js';

export default defineIcon({
  name: 'pencil',
  zh: '编辑',
  category: 'text',
  tags: ['edit', 'write', 'draw', 'pen'],
  variants: ['plus', 'check', 'x', 'sparkle', 'lock'],
  off: true,
  // A pencil that writes a line on hover.
  svg: (u) => {
    // Back to front, each piece with its own outline: the tip runs on under the body and the
    // body under the cap, so every seam shows one outline. Shadow and glow stay outside the
    // turn, so the light still comes from above.
    const tip = rp([[21.1, 9.6], [22.1, 9.6], [28.4, 13], [22.1, 16.4], [21.1, 16.4]], [0, 0, 0.9, 0, 0]);
    const body = rp(R(7.1, 9.6, 15, 6.8), [0.8, 0, 0, 0.8]), cap = rr(2.8, 9.6, 4.7, 6.8, 2);
    const piece = (n, d, fill) => `<g filter="${u.sh}"><g filter="${u.hi}"><path data-n="${n}" d="${d}" fill="${fill}"/></g></g><path data-n="${n}O" d="${d}" ${OL}/>`;
    return `<path data-n="ink" fill="none" stroke-width="2.2" stroke-linecap="round" ${DEEPS}/>
      ${piece('t', tip, u.upS)}${piece('b', body, u.loS)}${piece('c', cap, u.upS)}`;
  },
  target: (h) => ({ push: h ? 1.6 : 0, ink: h ? 9 : 0 }),
  draw(p, E) {
    const t = `rotate(135 15.5 13) translate(${f(p.push)} 0)`;
    for (const n of ['t', 'b', 'c']) { at(E[n], { transform: t }); at(E[n + 'O'], { transform: t }); }
    at(E.ink, { d: `M6.4 23.6H${f(6.4 + p.ink)}`, opacity: p.ink > 0.2 ? 1 : 0 });
  }
});
