import { defineIcon, KR, CR, f, OL, DEEP, DEEPS, R, rp, rr, circ, lines, at, wave, settle, clamp01 } from '../packages/core/src/kit.js';
import { back } from './_b1-home.js';

// Five strips one outline apart across the width of the page; alternate strips hang longer.
const PX = 8.1, PW = 14.8, SW = (PW - 4) / 5, HEAD = 8.8, HH = 7.8, TOP = 13;
// A strip longer by d that bends at the head's lower edge and leans by a share k of the
// length below it; all strips lean at the same angle, so the seams stay one outline wide.
const strip = (i, d, k) => {
  const x = PX + i * (SW + 1), b = HEAD + HH, y = b + (i % 2 ? 4.8 : 3.6) + d, dx = k * (y - b);
  return rp([[x, TOP], [x + SW, TOP], [x + SW, b], [x + SW + dx, y], [x + dx, y], [x, b]], [0, 0, 0, 0.6, 0.6, 0]);
};
// The page sinks until it is wholly inside the head; the strips grow by less than that.
const SINK = HEAD + 1 - 2, GROW = 4.2, LIGHT = [23, HEAD + HH / 2];

export default defineIcon({
  name: 'paper-shredder',
  zh: '碎纸机',
  category: 'devices',
  tags: ['shredder', 'shred', 'destroy', 'delete', 'privacy', 'paper', 'office', '粉碎', '销毁'],
  variants: [],
  // A paper shredder with a page in its slot; on hover its light comes on, the page is drawn
  // all the way in and the strips below grow longer and flutter to a stop.
  svg: (u) => {
    const page = rr(PX, 0, PW, 12, CR);
    return `<g data-n="pg"><g filter="${u.hi}"><path d="${page}" fill="${u.upS}"/></g><path d="${page}" ${OL}/>
        <path d="${lines(10.4, 2.8, [8.6])}" class="ln" ${DEEPS} stroke-opacity=".55"/></g>
      ${[0, 1, 2, 3, 4].map((i) => `<g filter="${u.hi}"><path data-n="s${i}" fill="${u.upS}"/></g><path data-n="s${i}O" ${OL}/>`).join('')}
      ${back(u, rr(4, HEAD, 23, HH, KR))}
      <path d="${circ(...LIGHT, 1.3)}" ${DEEP}/><path data-n="on" d="${circ(...LIGHT, 1.3)}" fill="#fff" opacity="0"/>`;
  },
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    at(E.pg, { transform: `translate(0 ${f(2 + SINK * o)})` });
    at(E.on, { opacity: f(clamp01(o / 0.3)) });
    // A damped flutter that ends hanging straight.
    const lean = wave(o, (t) => 0.14 * (1 - t) * Math.sin(3 * Math.PI * settle(t)));
    for (let i = 0; i < 5; i++) {
      const d = strip(i, GROW * o, lean);
      at(E[`s${i}`], { d }); at(E[`s${i}O`], { d });
    }
  }
});
