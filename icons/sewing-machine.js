import { defineIcon, KR, f, rp, rr, circ, DEEPS, clamp01, at, wave, settle } from '../packages/core/src/kit.js';
import { solid } from './_w2-dev.js';

const ARM = rp([[5.4, 3.6], [25.2, 3.6], [25.2, 18.6], [19.4, 18.6], [19.4, 10], [11.2, 10], [11.2, 13], [5.4, 13]], [KR, KR, 0, 0, 1.4, 1, 1.4, 1.4]);
const BASE = rr(3.4, 18, 24.2, 5, 1.8), WX = 22.6, WY = 7.8;

export default defineIcon({
  name: 'sewing-machine',
  zh: '缝纫机',
  category: 'tools',
  tags: ['sewing machine', 'sewing', 'stitch', 'tailor', 'fabric', 'craft', '裁缝', '缝纫'],
  // A sewing machine; on hover the handwheel turns twice and the
  // needle rises and plunges once per turn.
  svg: (u) => `<path data-n="nd" fill="none" stroke-width="2.2" stroke-linecap="round" ${DEEPS}/>
    ${solid(u, ARM, u.loS)}${solid(u, BASE, u.upS)}
    <g data-n="w">${solid(u, circ(WX, WY, 3.2), u.upS, { sh: false })}<path d="M${WX} ${WY}L${f(WX + 1.9)} ${f(WY - 1.9)}" fill="none" stroke-width="1.6" stroke-linecap="round" ${DEEPS}/></g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), y = 15.6 - 2.8 * wave(o, (t) => Math.sin(4 * Math.PI * settle(t)));
    at(E.nd, { d: `M8.3 12V${f(y)}` });
    at(E.w, { transform: `rotate(${f(720 * o)} ${WX} ${WY})` });
  }
});
