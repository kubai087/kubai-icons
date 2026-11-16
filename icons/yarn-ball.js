import { defineIcon, f, OL, ACC, WHITES, circ, at, clamp01 } from '../packages/core/src/kit.js';

// A ball of yarn resting on the floor, its loose end running out to the right. The yarn is
// wound in three directions: a band of turns runs across the ball from top right to bottom
// left, and the turns on either side of it run up against the band from other directions.
const B = { x: 14.6, y: 12, r: 10 }, FLOOR = B.y + B.r, ROLL = 2.6;
const BAND = { x: 4.6, y: 2, rs: [11.2, 14.8, 18.4] };
const rings = (cx, cy, rs) => rs.map((r) => circ(cx, cy, r)).join('');
const BALL = circ(B.x, B.y, B.r);
const BAND_TURNS = rings(BAND.x, BAND.y, BAND.rs);
// Inside the band's first turn, and outside its last one.
const INNER = circ(BAND.x, BAND.y, BAND.rs[0]);
const OUTER = `M-10 -10H40V40H-10Z${circ(BAND.x, BAND.y, BAND.rs[2])}`;
const INNER_TURNS = rings(2, 24, [12.6, 16.2, 19.8, 23.4]);
const OUTER_TURNS = rings(30, 2, [14, 17.6]);
const strand = (x) => `M${f(x)} ${FLOOR}H24C25.6 ${FLOOR} 26.6 ${FLOOR - 0.8} 27 ${FLOOR - 2.2}`;

export default defineIcon({
  name: 'yarn-ball',
  allow: { oneLayer: 'a ball marked with white turns of yarn, drawn in one layer like tennis-ball and basketball' },
  zh: '毛线球',
  category: 'home',
  tags: ['ball of yarn', 'wool', 'cat toy', 'knitting', 'pet', 'play', '线团', '猫玩具', '宠物'],
  variants: ['heart'],
  // A ball of yarn with a loose end; on hover it rolls back and unwinds more of the strand.
  svg: (u) => `<path data-n="st" d="${strand(B.x)}" fill="none" stroke-width="1.6" ${ACC}/>
    <clipPath id="${u.id('b')}"><path d="${BALL}"/></clipPath>
    <clipPath id="${u.id('i')}"><path d="${INNER}"/></clipPath>
    <clipPath id="${u.id('o')}"><path d="${OUTER}" clip-rule="evenodd"/></clipPath>
    <g data-n="b">
      <g filter="${u.sh}"><g filter="${u.hi}"><path d="${BALL}" fill="${u.loS}"/></g></g>
      <g clip-path="url(#${u.id('b')})">
        <path d="${BAND_TURNS}" class="ln" ${WHITES}/>
        <g clip-path="url(#${u.id('i')})"><path d="${INNER_TURNS}" class="ln" ${WHITES}/></g>
        <g clip-path="url(#${u.id('o')})"><path d="${OUTER_TURNS}" class="ln" ${WHITES}/></g>
      </g>
      <path d="${BALL}" ${OL}/>
    </g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), dx = -ROLL * o;
    at(E.b, { transform: `translate(${f(dx)} 0) rotate(${f(dx / B.r * 180 / Math.PI)} ${B.x} ${B.y})` });
    at(E.st, { d: strand(B.x + dx) });
  }
});
