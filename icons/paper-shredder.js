import { defineIcon, KR, CR, f, OL, DEEP, DEEPS, R, rp, rr, circ, lines, at } from '../packages/core/src/kit.js';
import { back, flat } from './_b1-home.js';

// Five strips one outline apart across the width of the page; alternate strips hang longer.
const PX = 8.1, PW = 14.8, SW = (PW - 4) / 5, HEAD = 8.8, HH = 7.8;
const strip = (i, d) => rp(R(PX + i * (SW + 1), 13, SW, HEAD + HH - 13 + (i % 2 ? 4.8 : 3.6) + d), [0, 0, 0.6, 0.6]);

export default defineIcon({
  name: 'paper-shredder',
  zh: '碎纸机',
  category: 'devices',
  tags: ['shredder', 'shred', 'destroy', 'delete', 'privacy', 'paper', 'office', '粉碎', '销毁'],
  variants: [],
  // A paper shredder with a page in its slot; on hover the page is drawn in and the strips below grow longer.
  svg: (u) => {
    const page = rr(PX, 0, PW, 12, CR);
    return `<g data-n="pg"><g filter="${u.hi}"><path d="${page}" fill="${u.upS}"/></g><path d="${page}" ${OL}/>
        <path d="${lines(10.4, 2.8, [8.6])}" class="ln" ${DEEPS} stroke-opacity=".55"/></g>
      ${[0, 1, 2, 3, 4].map((i) => `<g filter="${u.hi}"><path data-n="s${i}" fill="${u.upS}"/></g><path data-n="s${i}O" ${OL}/>`).join('')}
      ${back(u, rr(4, HEAD, 23, HH, KR))}
      <path d="${circ(23, HEAD + HH / 2, 1.3)}" ${DEEP}/>`;
  },
  target: (h) => ({ d: h ? 3.6 : 0 }),
  draw(p, E) {
    at(E.pg, { transform: `translate(0 ${f(2 + p.d)})` });
    for (let i = 0; i < 5; i++) { const d = strip(i, p.d); at(E[`s${i}`], { d }); at(E[`s${i}O`], { d }); }
  }
});
