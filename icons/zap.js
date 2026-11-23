import { defineIcon, f, OL, rp, wave, settle, clamp01, at } from '../packages/core/src/kit.js';

// A bolt that is the same when turned half round the canvas centre: two slanted strokes
// joined by a short step in the middle.
const T = [19.4, 0.8], D = [19.2, 9.8], C = [25.8, 9.8], Bt = [11.6, 24.2], B = [11.8, 15.2], A = [5.2, 15.2];
const BOLT = rp([T, D, C, Bt, B, A], [0.7, 0.5, 0.9, 0.7, 0.5, 0.9]);
// The lighter upper half, cut level across the step; its lower corners are rounded off so
// the darker bolt shows at both ends of the cut.
const CUT = 12.8;
const xL = A[0] + (T[0] - A[0]) * (A[1] - CUT) / (A[1] - T[1]);
const xR = C[0] + (Bt[0] - C[0]) * (CUT - C[1]) / (Bt[1] - C[1]);
const TOP = rp([T, D, C, [xR, CUT], [xL, CUT]], [0.7, 0.5, 0.9, 1.4, 1.4]);

// The strike's timing in real time: the old bolt is gone by SWAP, the new one is fully
// drawn by LAND, and the landing squash runs to the end.
const SWAP = 0.2, LAND = 0.62;
const phase = (t, a, b) => clamp01((t - a) / (b - a));
const easeIn = (x) => x * x, easeOut = (x) => 1 - (1 - x) * (1 - x);
const clip = (y0, y1) => `M-4 ${f(y0)}H35V${f(Math.max(y0, y1))}H-4Z`;

export default defineIcon({
  name: 'zap',
  zh: '闪电',
  category: 'weather',
  tags: ['lightning', 'bolt', 'flash', 'power', 'energy', 'electric', 'fast', 'charge', '电', '快速'],
  off: true,
  // A lightning bolt with a lighter upper half; on hover it strikes again: the bolt runs
  // out downwards, a new one is drawn from the top tip down to the bottom tip as it drops
  // into place, and it lands with a short squash.
  svg: (u) => {
    const cp = u.id('cut');
    return `<defs><clipPath id="${cp}"><path data-n="cut" d="${clip(-4, 30)}"/></clipPath></defs><g clip-path="url(#${cp})"><g data-n="g">
    <g filter="${u.sh}"><g filter="${u.hi}"><path d="${BOLT}" fill="${u.loS}"/></g></g><path d="${BOLT}" stroke-linejoin="round" ${OL}/>
    <g filter="${u.hi}"><path d="${TOP}" fill="${u.upS}"/></g><path d="${TOP}" stroke-linejoin="round" ${OL}/></g></g>`;
  },
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    // The visible band [y0, y1]: the old bolt is wiped from the top, then the new one is
    // drawn in from the top. Both phases meet at an empty band, so nothing jumps.
    const y0 = wave(o, (t) => (t < SWAP ? -4 + 30 * easeIn(t / SWAP) : -4));
    const y1 = wave(o, (t) => (t < SWAP ? 30 : -4 + 30 * easeOut(phase(t, SWAP, LAND))));
    const drop = wave(o, (t) => (t < SWAP ? 0 : -3 * (1 - easeOut(phase(t, SWAP, LAND)))));
    const squash = wave(o, (t) => Math.sin(Math.PI * settle(phase(t, LAND, 1))));
    at(E.cut, { d: clip(y0, y1) });
    at(E.g, { transform: `translate(15.5 24.2) scale(${f(1 + 0.05 * squash)} ${f(1 - 0.1 * squash)}) translate(-15.5 ${f(-24.2 + drop)})` });
  }
});
