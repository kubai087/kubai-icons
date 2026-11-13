import { defineIcon, f, OL, DEEPS, rr, at, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';
import { steam, reveal } from './_home-food.js';

// A kettle barbecue: a dome lid with its handle one unit above it, the bowl one unit below
// the lid, and two straight legs behind the bowl.
const CX = 15.5, LY = 11.6, BY = 12.6, RD = 8.4;
const LID = `M${CX - RD} ${LY}A${RD} ${RD} 0 0 1 ${CX + RD} ${LY}Z`;
const BOWL = `M${CX - RD} ${BY}A${RD} ${RD} 0 0 0 ${CX + RD} ${BY}Z`;
const HANDLE = rr(13.4, -0.2, 4.2, 2.4, 1.2);
const LEGS = rr(10.2, 17, 2.4, 7, 1.2) + rr(18.4, 17, 2.4, 7, 1.2);
// The lid turns up about its right-hand rim.
const PIVOT = [CX + RD, LY], OPEN = 26;

export default defineIcon({
  name: 'grill',
  zh: '烧烤炉',
  category: 'food',
  tags: ['barbecue', 'bbq', 'kettle grill', 'cookout', 'backyard', 'grilling', 'summer', '烧烤', '户外', '烤肉'],
  // A kettle barbecue; on hover its lid is lifted and smoke rises from the bowl.
  svg: (u) => {
    const wisp = (n, x) => `<path data-n="${n}" d="${steam(x, 11.4, 1)}" pathLength="1" fill="none" stroke-width="1.6" stroke-linecap="round" ${DEEPS}/>`;
    return `${wisp('s1', 12.4)}${wisp('s2', 16.4)}${layer(u, 'lg', LEGS, u.loS)}${layer(u, 'b', BOWL, u.loS)}
      ${layer(u, 'hn', HANDLE, u.upS, { sh: false })}${layer(u, 'l', LID, u.upS)}`;
  },
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    moveAll(E, ['l', 'hn'], p.o ? `rotate(${f(OPEN * p.o)} ${PIVOT[0]} ${PIVOT[1]})` : '');
    at(E.s1, reveal(clamp01((o - 0.2) / 0.8)));
    at(E.s2, reveal(clamp01((o - 0.35) / 0.65)));
  }
});
