import { defineIcon, KR, CR, f, ACC, DEEP, DEEPS, rr, at } from '../packages/core/src/kit.js';
import { solid, span } from './_devices.js';

const SCREEN = rr(8.8, 3.4, 13.4, 10.2, CR);

export default defineIcon({
  name: 'retro-computer',
  zh: '复古电脑',
  category: 'devices',
  tags: ['macintosh', 'compact computer', 'all-in-one', 'vintage', 'classic mac', '80s', '一体机', '老电脑'],
  variants: ['plus', 'check', 'x', 'alert', 'heart'],
  // A compact all-in-one computer with its screen and floppy slot; on hover it switches on: the
  // dark screen lights up and two lines type out.
  svg: (u) => `${solid(u, rr(8.2, 18.4, 14.6, 5.2, 1.2), u.upS)}
      ${solid(u, rr(6.3, 1, 18.4, 20, KR), u.loS)}
      <path d="${SCREEN}" fill="#fff"/>
      <path data-n="ln" ${ACC}/>
      <path data-n="off" d="${SCREEN}" ${DEEP}/>
      <path d="M16.4 17H21.4" class="ln" ${DEEPS}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    at(E.off, { opacity: f(1 - span(p.o, 0, 0.35)) });
    const l1 = span(p.o, 0.25, 0.65), l2 = span(p.o, 0.5, 0.95);
    at(E.ln, { d: (l1 > 0 ? `M11.2 6.8H${f(11.2 + 7.8 * l1)}` : '') + (l2 > 0 ? `M11.2 10H${f(11.2 + 5 * l2)}` : '') });
  }
});
