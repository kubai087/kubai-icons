import { defineIcon, f, OL, rp, at } from '../packages/core/src/kit.js';

// A note head tilted 18° about its own centre, drawn clockwise like the stems so the two
// join into one shape.
const TILT = 18 * Math.PI / 180;
const head = (cx, cy) => {
  const dx = 3.6 * Math.cos(TILT), dy = 3.6 * Math.sin(TILT);
  return `M${f(cx - dx)} ${f(cy + dy)}A3.6 2.7 -18 1 1 ${f(cx + dx)} ${f(cy - dy)}A3.6 2.7 -18 1 1 ${f(cx - dx)} ${f(cy + dy)}Z`;
};
// Each stem runs up from the right half of its head and ends at the head's centre line.
const L = [10.9, 20.1], Rt = [21.5, 17.9];
const STEMS = rp([[L[0] + 0.2, 4.4], [Rt[0] + 2.4, 1.8], [Rt[0] + 2.4, Rt[1]], [Rt[0] + 0.2, Rt[1]], [Rt[0] + 0.2, 5.6], [L[0] + 2.4, 7.6], [L[0] + 2.4, L[1]], [L[0] + 0.2, L[1]]], [0.8, 0.8, 0.6, 0.6, 0.3, 0.3, 0.6, 0.6]);
const NOTE = STEMS + head(...L) + head(...Rt);

export default defineIcon({
  name: 'music',
  zh: '音乐',
  category: 'media',
  tags: ['note', 'song', 'audio', 'melody'],
  variants: ['plus', 'heart', 'star', 'sparkle'],
  off: true,
  // Two beamed notes that bounce on hover.
  svg: (u) => `<g data-n="g">
      <g filter="${u.sh}"><g filter="${u.hi}"><path d="${NOTE}" fill="${u.loS}"/></g></g><path d="${NOTE}" ${OL}/>
    </g>`,
  target: (h) => ({ y: h ? -1.4 : 0, a: h ? -6 : 0 }),
  draw(p, E) { at(E.g, { transform: `translate(0 ${f(p.y)}) rotate(${f(p.a)} 15.5 12.5)` }); }
});
