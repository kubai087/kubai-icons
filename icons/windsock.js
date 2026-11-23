import { defineIcon, f, OL, DEEPS, rp, rattle, clamp01, at } from '../packages/core/src/kit.js';

// A striped windsock on a pole. The sock hangs from the pole at P; its mouth is 9.6 tall and
// it tapers over 18.4 to a tail end h tall. Two of its five bands are white cloth.
const P = [5.8, 7.2], X0 = 7.4, LEN = 18.4, Y0 = 2.4, H0 = 9.6;
const edge = (t, h) => {
  const x = X0 + t * LEN, dy = t * (H0 - h) / 2;
  return [[x, Y0 + dy], [x, Y0 + H0 - dy]];
};
const sock = (h) => {
  const [a, b] = edge(0, h), [c, d] = edge(1, h);
  return rp([a, c, d, b], [1, 1.4, 1.4, 1]);
};
const band = (t0, t1, h) => {
  const [a, b] = edge(t0, h), [c, d] = edge(t1, h);
  return `M${f(a[0])} ${f(a[1])}L${f(c[0])} ${f(c[1])}L${f(d[0])} ${f(d[1])}L${f(b[0])} ${f(b[1])}Z`;
};

export default defineIcon({
  name: 'windsock',
  zh: '风向袋',
  category: 'weather',
  tags: ['wind', 'wind direction', 'wind speed', 'airfield', 'breeze', 'weather', '风', '风向', '风速'],
  // A striped windsock drooping from its pole; on hover the wind fills it, lifting it level
  // with a flutter.
  svg: (u) => `<path d="M${P[0]} 1.6V24" fill="none" stroke-width="2.2" stroke-linecap="round" ${DEEPS}/>
    <g filter="${u.sh}"><g filter="${u.hi}"><g data-n="s"><path data-n="sF" fill="${u.loS}"/></g></g></g>
    <g data-n="b"><path data-n="bF" fill="#fff"/></g>
    <g data-n="o"><path data-n="sO" ${OL}/></g>`,
  target: (h) => ({ o: h ? 1 : 0, a: h ? 0 : 14, h: h ? 6.6 : 5 }),
  draw(p, E) {
    const t = `rotate(${f(p.a + rattle(clamp01(p.o), 5, 3))} ${P[0]} ${P[1]})`, d = sock(p.h);
    at(E.sF, { d }); at(E.sO, { d }); at(E.bF, { d: band(0.2, 0.4, p.h) + band(0.6, 0.8, p.h) });
    ['s', 'b', 'o'].forEach((n) => at(E[n], { transform: t }));
  }
});
