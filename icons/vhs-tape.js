import { defineIcon, KR, CR, f, rr, at } from '../packages/core/src/kit.js';
import { back } from './_w2-devices.js';

const BODY = rr(2.8, 4.6, 25.4, 15.8, KR);
const LABEL = rr(5.2, 7, 20.6, 3.6, CR);
const WINDOW = rr(8, 12.6, 15, 5.6, CR);

export default defineIcon({
  name: 'vhs-tape',
  zh: '录像带',
  category: 'media',
  tags: ['vhs', 'videotape', 'video cassette', 'vcr', 'movie', 'retro', '80s', '90s', '录影带', '磁带'],
  variants: ['plus', 'check', 'x', 'heart'],
  // A video cassette with a label along the top and a window onto its two tape packs; on hover
  // the tape winds from the left pack onto the right one.
  svg: (u) => `${back(u, BODY)}
      <path d="${LABEL}" fill="#fff"/>
      <clipPath id="${u.id('w')}"><path d="${WINDOW}"/></clipPath>
      <path d="${WINDOW}" fill="#fff"/>
      <g clip-path="url(#${u.id('w')})">
        <circle data-n="l" cx="11.6" cy="15.4" fill="${u.pure('#5393FF')}"/><circle data-n="r" cx="19.4" cy="15.4" fill="${u.pure('#5393FF')}"/>
        <circle cx="11.6" cy="15.4" r="0.8" fill="#fff"/><circle cx="19.4" cy="15.4" r="0.8" fill="#fff"/>
      </g>`,
  target: (h) => ({ l: h ? 2.8 : 3.8, r: h ? 3.8 : 2.8 }),
  draw(p, E) { at(E.l, { r: f(p.l) }); at(E.r, { r: f(p.r) }); }
});
