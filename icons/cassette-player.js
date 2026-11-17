import { defineIcon, KR, CR, f, R, rp, rr, at, clamp01 } from '../packages/core/src/kit.js';
import { solid } from './_devices.js';

// A portable cassette player from the front: three keys stand up behind its top edge, and a
// window shows the two tape reels of the cassette inside.
const KEYS = [11.8, 16.6, 21.4];
const key = (x, dy = 0) => rp(R(x, 3.4 + dy, 3.6, 3.6), [1, 1, 0, 0]);
const BODY = rr(4, 5.8, 23, 15.4, KR);
const L = 11.4, RR = 19.6, CY = 13.8;

export default defineIcon({
  name: 'cassette-player',
  zh: '卡带随身听',
  category: 'media',
  tags: ['cassette player', 'tape player', 'personal stereo', 'portable', 'music', 'retro', '80s', '90s', '随身听', '磁带机', '卡带机'],
  variants: ['heart'],
  // A portable cassette player; on hover its play key goes down and the tape winds from the
  // left reel onto the right one.
  svg: (u) => `${solid(u, key(KEYS[0]), u.upS, { sh: false })}<g data-n="k">${solid(u, key(KEYS[1]), u.upS, { sh: false })}</g>${solid(u, key(KEYS[2]), u.upS, { sh: false })}
      ${solid(u, BODY, u.loS)}
      <path d="${rr(6, 8.4, 19, 10.8, CR)}" fill="#fff"/>
      <circle data-n="l" cx="${L}" cy="${CY}" fill="${u.pure('#5393FF')}"/><circle data-n="r" cx="${RR}" cy="${CY}" fill="${u.pure('#5393FF')}"/>
      <circle cx="${L}" cy="${CY}" r="1.2" fill="#fff"/><circle cx="${RR}" cy="${CY}" r="1.2" fill="#fff"/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), k = Math.min(1, o / 0.3);
    at(E.k, { transform: `translate(0 ${f(1.6 * k)})` });
    at(E.l, { r: f(3.4 - 0.8 * o) }); at(E.r, { r: f(2.6 + 0.8 * o) });
  }
});
