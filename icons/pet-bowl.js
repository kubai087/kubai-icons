import { defineIcon, KR, f, OL, WHITE, rp, circ, at, clamp01 } from '../packages/core/src/kit.js';

// A pet bowl seen from the side, wider at the foot than at the rim.
const TOP = 10.8, BOT = 20.4;
const BOWL = rp([[6.2, TOP], [24.8, TOP], [26.8, BOT], [4.2, BOT]], [1.2, 1.2, KR, KR]);
// The heap of kibble: same-winding circles plus a counter-clockwise block that reaches
// down behind the bowl, outlined only outside.
const HEAP = [[11.4, 11.2, 2.8], [14.4, 9, 3.2], [18, 9.2, 3], [20.6, 10.8, 2.6]].map(([x, y, r]) => circ(x, y, r)).join('') + 'M9.2 11V16H22.4V11Z';
// A bone on the bowl's side, 2 clear of the rim and the foot: a shaft and two pairs of
// knobs, with every inside corner filleted so the outline runs round without a notch.
const BONE = 'M-1.671 -0.8H1.671A0.6 0.6 0 0 0 2.247 -1.233A1.2 1.2 0 1 1 4.439 -0.3A0.6 0.6 0 0 0 4.439 0.3'
  + 'A1.2 1.2 0 1 1 2.247 1.233A0.6 0.6 0 0 0 1.671 0.8H-1.671A0.6 0.6 0 0 0 -2.247 1.233'
  + 'A1.2 1.2 0 1 1 -4.439 0.3A0.6 0.6 0 0 0 -4.439 -0.3A1.2 1.2 0 1 1 -2.247 -1.233A0.6 0.6 0 0 0 -1.671 -0.8Z';

export default defineIcon({
  name: 'pet-bowl',
  allow: { peek: 'the notches between the lumps of kibble join in one outline; the measure reads them as covered outline, as on rice-bowl' },
  zh: '宠物碗',
  category: 'home',
  tags: ['dog bowl', 'cat bowl', 'pet food', 'feeding', 'kibble', 'pet', '狗碗', '猫碗', '宠物粮', '喂食'],
  variants: ['plus', 'check', 'clock', 'heart'],
  // A pet bowl heaped with kibble; on hover the heap is filled up and rises over the rim.
  svg: (u) => `<g data-n="h"><g filter="${u.hi}"><path d="${HEAP}" fill="${u.upS}"/></g><path d="${HEAP}" ${OL}/></g>
    <g filter="${u.sh}"><g filter="${u.hi}"><path d="${BOWL}" fill="${u.loS}"/></g></g><path d="${BOWL}" ${OL}/>
    <path d="${BONE}" transform="translate(15.5 15.6)" ${WHITE}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    at(E.h, { transform: `translate(0 ${f(1.8 - 2.6 * clamp01(p.o))})` });
  }
});
