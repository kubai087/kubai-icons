import { defineIcon, f, OL, DEEPS, WHITES, rp, circ, at, bump, clamp01 } from '../packages/core/src/kit.js';
import { solid } from './_devices.js';
import { sparkle } from './_w2-interface.js';

// The fuse runs from the cap along a quadratic curve; t is how much of it is left.
const P0 = [20.4, 7.8], P1 = [21.6, 3.4], P2 = [24.8, 3.6];
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const fuse = (t) => {
  const c = lerp(P0, P1, t), e = lerp(c, lerp(P1, P2, t), t);
  return { d: `M${P0[0]} ${P0[1]}Q${f(c[0])} ${f(c[1])} ${f(e[0])} ${f(e[1])}`, e };
};
// The cap: a short neck set on the body's rim at 45 degrees, up and to the right.
const rot = (cx, cy, a, pts) => pts.map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
const CAP = rp(rot(18.9, 9.3, -Math.PI / 4, [[-2.2, -2.6], [2.2, -2.6], [2.2, 2.6], [-2.2, 2.6]]), 1);
const SPARK = sparkle(2.8);

export default defineIcon({
  name: 'bomb',
  zh: '炸弹',
  category: 'interface',
  tags: ['crash', 'error', 'fatal', 'explode', 'boom', 'danger', 'cartoon bomb', '崩溃', '报错'],
  variants: ['x', 'alert'],
  // A round cartoon bomb with a lit fuse; on hover the fuse burns down and its spark flares.
  svg: (u) => `<path data-n="fz" fill="none" stroke-width="2.2" stroke-linecap="round" ${DEEPS}/>
      ${solid(u, circ(13, 15.2, 8.2), u.loS)}
      ${solid(u, CAP, u.upS, { sh: false })}
      <path d="M8.4 14.2C8.6 12.4 9.6 11.2 11.2 10.6" fill="none" stroke-width="1.6" stroke-linecap="round" ${WHITES} stroke-opacity=".8"/>
      <g data-n="sp"><g filter="${u.hi}"><path d="${SPARK}" fill="${u.upS}"/></g><path d="${SPARK}" ${OL}/></g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), { d, e } = fuse(1 - 0.45 * o);
    at(E.fz, { d });
    at(E.sp, { transform: `translate(${f(e[0])} ${f(e[1])}) rotate(${f(45 * o)}) scale(${f(1 + 0.45 * bump(o))})` });
  }
});
