import { defineIcon, KR, f, OL, DEEP, R, rp, rr, clamp01 } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A pencil standing on its butt at the origin, `len` long, its sharpened cone dark.
const pencil = (len) => ({
  body: rp([[-1.6, 0], [-1.6, -len + 3.4], [0, -len], [1.6, -len + 3.4], [1.6, 0]], [0, 0.3, 0.4, 0.3, 0]),
  tip: rp([[-1.6, -len + 3.4], [0, -len], [1.6, -len + 3.4]], [0.2, 0.4, 0.2]),
});
const SIDE = pencil(16), MID = pencil(18.4);
const CUP = rp(R(8.6, 15, 13.8, 8.6), [0, 0, KR, KR]), RIM = rr(7.8, 13.4, 15.4, 3.2, 1.6);

const pen = (u, name, p) => layer(u, name, p.body, u.upS, { sh: false, extra: `<path d="${p.tip}" ${DEEP}/>` });

export default defineIcon({
  name: 'pencil-cup',
  zh: '笔筒',
  category: 'education',
  tags: ['pencils', 'pen holder', 'stationery', 'desk', 'school supplies', 'art', '铅笔', '文具'],
  // A cup of pencils; on hover the middle pencil is drawn up out of it and the other two
  // lean out to make room.
  svg: (u) => `${pen(u, 'a', SIDE)}${pen(u, 'b', SIDE)}${pen(u, 'm', MID)}
    <g filter="${u.sh}"><g filter="${u.hi}"><path d="${CUP}" fill="${u.loS}"/></g></g><path d="${CUP}" ${OL}/>
    <g filter="${u.hi}"><path d="${RIM}" fill="${u.upS}"/></g><path d="${RIM}" ${OL}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    moveAll(E, ['a'], `translate(12.4 22) rotate(${f(-16 - 6 * o)})`);
    moveAll(E, ['b'], `translate(18.6 22) rotate(${f(16 + 6 * o)})`);
    moveAll(E, ['m'], `translate(15.5 ${f(22 - 3 * o)})`);
  }
});
