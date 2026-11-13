import { defineIcon, f, OL, WHITE, WHITES, rr, circ, at } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';

// A barrel with its lid one unit above it, two white hoops 2.4 in from its ends, a white
// water drop between them, and a short tap on its right side.
const LID = rr(7.6, 2.4, 15.8, 3, 1.5), BARREL = rr(8.4, 6.4, 14.2, 17.2, 3.2);
const HOOPS = 'M11.2 9.6H19.8M11.2 20.4H19.8';
// The drop of the droplet icon, scaled to stand 2 clear of both hoops.
const MARK = `<path d="M15.5 1.2L22.152 11.156A8 8 0 1 1 8.848 11.156Z" transform="translate(15.5 12.4) scale(0.228) translate(-15.5 -1.2)" ${WHITE}/>`;
const TAP = rr(21.2, 15.2, 5.4, 2.4, 1.2);
// A drop gathers under the tap's mouth, touching it.
const DROP = [25.2, 17.6];

export default defineIcon({
  name: 'rain-barrel',
  zh: '集雨桶',
  category: 'nature',
  tags: ['rain barrel', 'water butt', 'rainwater', 'garden', 'water', 'collect', 'eco', '雨水', '储水', '环保'],
  // A rain barrel; on hover a drop gathers under its tap.
  svg: (u) => `<g filter="${u.sh}"><path data-n="dp" fill="${u.loS}"/></g><path data-n="dpO" ${OL}/>
    ${layer(u, 'l', LID, u.upS)}
    ${layer(u, 'b', BARREL, u.loS, { extra: `<path d="${HOOPS}" fill="none" stroke-width="1.6" stroke-linecap="round" ${WHITES}/>${MARK}` })}
    ${layer(u, 't', TAP, u.upS, { sh: false })}`,
  target: (h) => ({ r: h ? 1.4 : 0 }),
  draw(p, E) {
    const d = p.r < 0.1 ? '' : circ(DROP[0], DROP[1] + p.r, p.r);
    at(E.dp, { d }); at(E.dpO, { d });
  }
});
