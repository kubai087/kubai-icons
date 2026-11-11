import { defineIcon, KR, CR, f, OL, R, rp, rr, at, rattle, clamp01 } from '../packages/core/src/kit.js';
import { wheel } from './_travel-transport.js';

// Side view facing right: the passenger box, and the long engine hood in front of it that
// sets a school bus apart from a city bus.
const BODY = rr(3.6, 3.2, 18.8, 15.4, KR);
const HOOD = rp(R(20.2, 11.4, 7.2, 7.2), [1.8, 3.2, KR, 0]);
const WINDOWS = [6, 10.6, 15.2].map((x) => rr(x, 6, 3.6, 4.4, CR)).join('');

export default defineIcon({
  name: 'school-bus',
  zh: '校车',
  category: 'education',
  tags: ['bus', 'school', 'students', 'commute', 'pickup', 'field trip', '接送', '上学'],
  // A school bus from the side, with its long hood; on hover it pulls up, rocking on its
  // springs.
  svg: (u) => `<g data-n="g">
      <g filter="${u.sh}"><g filter="${u.hi}"><path d="${BODY}" fill="${u.loS}"/></g></g><path d="${BODY}" ${OL}/>
      <path d="${WINDOWS}" fill="#fff"/>
      <g filter="${u.sh}"><g filter="${u.hi}"><path d="${HOOD}" fill="${u.upS}"/></g></g><path d="${HOOD}" ${OL}/>
    </g>
    ${wheel(u, 8.8, 18.6, 2.8)}${wheel(u, 22.4, 18.6, 2.8)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    // The body pitches about the axle line as it stops; the wheels stay on the road.
    const a = rattle(o, 3, 3);
    at(E.g, { transform: Math.abs(a) < 1e-4 ? '' : `rotate(${f(a)} 15.6 18.6)` });
  }
});
