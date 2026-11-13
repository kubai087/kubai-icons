import { defineIcon, KR, CR, R, rp, rr, at, clamp01 } from '../packages/core/src/kit.js';
import { back, front } from './_commerce-charts.js';

// Bars stand on the bottom of the screen, 2 apart, and stay 2 below its top.
const XS = [9.9, 14.3, 18.7], REST = [2.6, 3.8, 5], END = [4.2, 5.2, 5.6];

export default defineIcon({
  name: 'presentation',
  zh: '演示',
  category: 'charts',
  tags: ['slides', 'board', 'present', 'report', 'meeting', 'whiteboard', '汇报', '幻灯片'],
  variants: ['plus', 'check', 'search'],
  // A presentation board on a stand; on hover the bars of its chart drop and grow back
  // taller, one after another.
  svg: (u) => `<path d="M15.5 16V22.6M15.5 16L10.6 22.6M15.5 16L20.4 22.6" fill="none" stroke-width="2.2" stroke-linecap="round" data-t="stroke:#2F6FE0"/>
    ${back(u, rr(5.2, 3.2, 20.6, 14, KR), u.loS)}
    <path d="${rr(7.8, 7.4, 15.4, 7.6, CR)}" fill="#fff"/>
    ${XS.map((_, i) => `<path data-n="b${i}" data-t="fill:#2F6FE0"/>`).join('')}
    ${front(u, rr(3.8, 1.4, 23.4, 3.2, 1.6), u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o);
    XS.forEach((x, i) => {
      const s = clamp01(o * 1.16 - i * 0.08), hg = s ? (REST[i] + (END[i] - REST[i]) * s) * (1 - 0.95 * Math.sin(Math.PI * s)) : REST[i];
      at(E['b' + i], { d: rp(R(x, 15 - hg, 2.4, hg), [0.6, 0.6, 0, 0]) });
    });
  }
});
