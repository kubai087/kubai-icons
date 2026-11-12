import { defineIcon, KR, CR, f, OL, DEEP, DEEPS, WHITE, rr, circ, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';
import { flameTongues } from './_weather-nature.js';

// The drawer is drawn at x = 0 and slides out of the right-hand end of the sleeve. It is
// one unit shorter than the sleeve at top and bottom, so it hides inside it.
const SLEEVE = rr(4, 6.4, 15.4, 16, KR);
const DRAWER = rr(0, 7.4, 18, 14, KR), INSIDE = rr(2, 9.4, 14, 10, CR);
const MATCH = `<path d="M4.6 14.4H11.6" fill="none" stroke-width="1.6" stroke-linecap="round" ${DEEPS}/><path d="${circ(13, 14.4, 1.4)}" ${DEEP}/>`;
const SHUT = 5, OPEN = 9;
// A white flame printed on the sleeve, centred on it.
const MARK = `<path d="${flameTongues(16.6, 1.2, 9, 8.6)}" transform="translate(11.7 19) scale(0.42) translate(-15.5 -23.8)" ${WHITE}/>`;

export default defineIcon({
  name: 'matchbox',
  zh: '火柴盒',
  category: 'travel',
  tags: ['matches', 'match', 'fire', 'light', 'camping', 'strike', '火柴', '点火'],
  // A matchbox with its drawer slightly out; on hover the drawer slides open to show a match.
  svg: (u) => `${layer(u, 'd', DRAWER, u.upS, { extra: `<path d="${INSIDE}" fill="#fff"/>${MATCH}` })}
    ${layer(u, 's', SLEEVE, u.loS, { extra: MARK })}`,
  target: (h) => ({ x: h ? OPEN : SHUT }),
  draw(p, E) { moveAll(E, ['d'], `translate(${f(p.x)} 0)`); }
});
