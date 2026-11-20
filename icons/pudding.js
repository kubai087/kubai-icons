import { defineIcon, KR, f, rp, rr, at, rattle } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';
import { cwCirc } from './_security-time-health.js';

// A caramel pudding on a plate: a custard that narrows to its top, capped with caramel that
// follows its top corners and runs down in two round drips. The drips wind the same way as
// the cap, so they join it into one shape.
const T = 3.6, B = 19.6, TOP = 6, BASE = 8.6;
const half = (y) => TOP + (BASE - TOP) * (y - T) / (B - T);
const BODY = rp([[15.5 - TOP, T], [15.5 + TOP, T], [15.5 + BASE, B], [15.5 - BASE, B]], [KR, KR, 0, 0]);
const CY = 8.8;
const CAP = rp([[15.5 - TOP, T], [15.5 + TOP, T], [15.5 + half(CY), CY], [15.5 - half(CY), CY]], [KR, KR, 0, 0])
  + cwCirc(12, CY, 1.8) + cwCirc(18.6, CY, 1.8);
const PLATE = rr(4, 18.6, 23, 3.4, 1.7);
// The pudding wobbles from the middle of its base.
const FOOT = [15.5, B];

export default defineIcon({
  name: 'pudding',
  zh: '布丁',
  category: 'food',
  tags: ['pudding', 'flan', 'custard', 'caramel', 'creme caramel', 'jelly', 'dessert', 'sweet', '焦糖布丁', '甜点', '果冻'],
  variants: ['heart'],
  // A caramel pudding on a plate; on hover it wobbles and settles.
  svg: (u) => `${layer(u, 'pl', PLATE, u.loS)}${layer(u, 'bd', BODY, u.upS)}${layer(u, 'cp', CAP, u.pure('#5393FF'), { sh: false })}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const a = rattle(p.o, 16, 3);
    moveAll(E, ['bd', 'cp'], Math.abs(a) < 1e-3 ? '' : `translate(${FOOT[0]} ${FOOT[1]}) skewX(${f(a)}) translate(${-FOOT[0]} ${-FOOT[1]})`);
  }
});
