import { defineIcon, f, OL, ACC, WHITES, rr, circ, at, rattle, clamp01 } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';

// A scratching post wrapped in rope, with a perch on top, a step on its right and a broad
// base; a ball toy hangs on a cord from the left end of the perch.
const POST = rr(13.6, 5, 4.2, 17, 0);
const TOP = rr(7, 3.4, 17, 3.2, 1.6), STEP = rr(16.6, 13, 8, 2.8, 1.4), BASE = rr(5.8, 21, 19.4, 3, 1.5);
// Rope turns slant across the post, clipped to it so their ends stay inside the outline.
const ROPE = 'M13.6 10.6L17.8 8.6M13.6 19.2L17.8 17.2';
const PIN = [9.4, 6.6], BALL = circ(9.4, 14.2, 2);

export default defineIcon({
  name: 'cat-tree',
  zh: '猫爬架',
  category: 'home',
  tags: ['cat tower', 'scratching post', 'cat condo', 'cat furniture', 'cat toy', 'pet', '猫抓柱', '猫抓板', '猫树', '宠物'],
  variants: ['heart'],
  // A cat tree with a ball hanging from its perch; on hover the ball swings on its cord and settles.
  svg: (u) => `${layer(u, 'p', POST, u.loS, { extra: `<clipPath id="${u.id('p')}"><path d="${POST}"/></clipPath>
      <path d="${ROPE}" clip-path="url(#${u.id('p')})" class="ln" ${WHITES}/>` })}
    <g data-n="toy"><path d="M9.4 6.6V12.2" fill="none" stroke-width="1.6" ${ACC}/>${layer(u, 'ball', BALL, u.loS)}</g>
    ${layer(u, 's', STEP, u.upS)}${layer(u, 't', TOP, u.upS)}${layer(u, 'bs', BASE, u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const a = rattle(clamp01(p.o), 22, 3);
    at(E.toy, { transform: Math.abs(a) < 1e-4 ? '' : `rotate(${f(a)} ${PIN[0]} ${PIN[1]})` });
  }
});
