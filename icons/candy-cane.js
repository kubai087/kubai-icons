import { defineIcon, f, DEEPS, at, rattle } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A candy cane: a band 4.4 wide that runs up the shaft, over a half-circle hook and down a
// short end, both ends rounded. The stripes wind round it, so each one crosses the band at a
// slant, measured along the band's middle line.
const CX = 15.5, CY = 7.6, RC = 4, HW = 2.2, RO = RC + HW, RI = RC - HW;
const L = CX - RO, SR = CX - RI, HL = CX + RI, HR = CX + RO, BOT = 21.6, END = 10.4;
const CANE = `M${f(L)} ${BOT}V${CY}A${RO} ${RO} 0 0 1 ${f(HR)} ${CY}V${END}A${HW} ${HW} 0 0 1 ${f(HL)} ${END}`
  + `V${CY}A${f(RI)} ${f(RI)} 0 0 0 ${f(SR)} ${CY}V${BOT}A${HW} ${HW} 0 0 1 ${f(L)} ${BOT}Z`;
// The middle line: up the shaft, over the hook, down the end. s is the length along it,
// n the distance out from it towards the outside of the hook.
const S1 = BOT + HW - CY, S2 = S1 + Math.PI * RC, S3 = S2 + END + HW - CY;
const along = (s, n) => {
  if (s < S1) return [CX - RC - n, BOT + HW - s];
  if (s < S2) { const a = Math.PI + (s - S1) / RC; return [CX + (RC + n) * Math.cos(a), CY + (RC + n) * Math.sin(a)]; }
  return [CX + RC + n, CY + (s - S2)];
};
const N = 5, K = 0.8, GAP = S3 / N;
const STRIPES = Array.from({ length: N }, (_, i) => {
  const s0 = GAP * (i + 0.5);
  return 'M' + [-3, -2, -1, 0, 1, 2, 3].map((n) => along(s0 + K * n, n).map(f).join(' ')).join('L');
}).join('');
// It hangs from the inside of the hook.
const PIVOT = [CX, CY - RI];

export default defineIcon({
  name: 'candy-cane',
  zh: '拐杖糖',
  category: 'food',
  tags: ['candy cane', 'peppermint', 'christmas', 'xmas', 'holiday', 'sweet', 'candy', '圣诞', '糖果', '薄荷糖'],
  variants: ['heart', 'star'],
  // A striped candy cane; on hover it swings from its hook as if hung on a tree.
  svg: (u) => `<clipPath id="${u.id('c')}"><path d="${CANE}"/></clipPath>
    ${layer(u, 'cn', CANE, u.upS, { extra: `<g clip-path="url(#${u.id('c')})"><path d="${STRIPES}" fill="none" stroke-width="2.2" ${DEEPS}/></g>` })}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const a = rattle(p.o, 14, 3);
    moveAll(E, ['cn'], Math.abs(a) < 1e-3 ? '' : `rotate(${f(a)} ${PIVOT[0]} ${PIVOT[1]})`);
  }
});
