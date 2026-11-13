import { defineIcon, f, OL, SOFT, rp, rr, at } from '../packages/core/src/kit.js';

export default defineIcon({
  name: 'highlighter',
  zh: '荧光笔',
  category: 'text',
  tags: ['highlight', 'marker', 'emphasis', 'annotate', 'mark', '高亮'],
  // A highlighter with a chisel tip that lays down a broad band of colour on hover.
  svg: (u) => {
    const cap = rr(2.8, 8.6, 5.6, 8.8, 2), body = rr(7.8, 8.6, 13.4, 8.8, 0.8);
    // The collar caps the whole end of the body, flush with its top and bottom, then tapers to
    // the tip; the tip starts well inside the collar, so neither shows a corner at a seam.
    const collar = rp([[20.4, 8.6], [21.6, 8.6], [23.4, 10.2], [23.4, 15.8], [21.6, 17.4], [20.4, 17.4]], [0, 0.5, 0.5, 0.5, 0.5, 0]);
    const tip = rp([[21.8, 11.4], [27.4, 11.8], [27.4, 15.2], [21.8, 14.6]], [0, 0.5, 0.5, 0]);
    // Back to front, each piece with its own outline, so every seam shows one outline. Shadow
    // and glow stay outside the turn, so the light still comes from above.
    const piece = (n, d, fill) => `<g filter="${u.sh}"><g filter="${u.hi}"><path data-n="${n}" d="${d}" fill="${fill}"/></g></g><path data-n="${n}O" d="${d}" ${OL}/>`;
    return `<path data-n="ink" ${SOFT}/>
      ${piece('t', tip, u.pure('#2F6FE0'))}${piece('b', body, u.loS)}${piece('k', collar, u.upS)}${piece('c', cap, u.upS)}`;
  },
  target: (h) => ({ push: h ? 1.4 : 0, ink: h ? 10.4 : 0 }),
  draw(p, E) {
    const t = `rotate(135 15.5 13) translate(${f(p.push)} 0)`;
    for (const n of ['t', 'b', 'k', 'c']) { at(E[n], { transform: t }); at(E[n + 'O'], { transform: t }); }
    at(E.ink, { d: rp([[6.6, 21.8], [f(6.6 + p.ink), 21.8], [f(6.6 + p.ink), 25], [6.6, 25]], 0.8), opacity: p.ink > 0.3 ? 1 : 0 });
  }
});
