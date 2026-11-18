import { defineIcon, KR, f, OL, WHITES, rr } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A bar of chocolate standing in its wrapper. The bar is the wrapper's width and runs down
// inside it; its pieces are split by grooves 4.6 apart. The wrapper's top edge is torn in a
// zigzag, its corners rounded, so the bar shows round them.
const X = 7.8, W = 15.4, TOP = 1.6, H = 20, WRAP = 14;
const BAR = rr(X, TOP, W, H, KR);
const GROOVES = `M15.5 ${TOP}V${TOP + H}` + [4.6, 9.2, 13.8].map((d) => `M${X} ${f(TOP + d)}H${X + W}`).join('');
// Three teeth across the top, 2 deep, with rounded corners at either end.
const TEETH = 3, TW = (W - 2 * KR) / TEETH, TD = 2;
const WRAPPER = `M${X} ${f(WRAP + KR)}Q${X} ${WRAP} ${f(X + KR)} ${WRAP}`
  + Array.from({ length: TEETH }, (_, i) => `L${f(X + KR + TW * (i + 0.5))} ${f(WRAP + TD)}L${f(X + KR + TW * (i + 1))} ${WRAP}`).join('')
  + `Q${X + W} ${WRAP} ${X + W} ${f(WRAP + KR)}V${24 - KR}Q${X + W} 24 ${f(X + W - KR)} 24H${f(X + KR)}Q${X} 24 ${X} ${24 - KR}Z`;
const OUT = 3.6;

export default defineIcon({
  name: 'chocolate-bar',
  zh: '巧克力',
  category: 'food',
  tags: ['chocolate', 'chocolate bar', 'candy bar', 'cocoa', 'sweet', 'snack', 'treat', '巧克力棒', '零食', '甜食'],
  variants: ['heart', 'plus'],
  // A bar of chocolate in its torn wrapper; on hover the bar slides up out of the wrapper.
  svg: (u) => `${layer(u, 'b', BAR, u.loS, { extra: `<path d="${GROOVES}" fill="none" stroke-width="1.6" ${WHITES}/>` })}
    <g filter="${u.sh}"><g filter="${u.hi}"><path d="${WRAPPER}" fill="${u.upS}"/></g></g><path d="${WRAPPER}" stroke-linejoin="round" ${OL}/>`,
  target: (h) => ({ y: h ? -OUT : 0 }),
  draw(p, E) { moveAll(E, ['b'], `translate(0 ${f(p.y)})`); }
});
