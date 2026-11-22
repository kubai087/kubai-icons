import { defineIcon, KR, CR, f, OL, DEEP, R, rp, rr, circ, at, bump } from '../packages/core/src/kit.js';
import { back } from './_w2-devices.js';

const W = 9.3, T = 3.2, B = 21.8, X0 = 15.5 - W, X1 = 15.5 + W;
const LEFT = rp(R(X0, T, W, B - T), [KR, 0, 0, KR]);
const RIGHT = rp(R(15.5, T, W, B - T), [0, KR, KR, 0]);
// The right half is outlined on its three outer sides only, so the open phone reads as one
// body; the left half's outline along the hinge shows once the right half turns away.
const RIGHT_EDGE = `M15.5 ${T}H${f(X1 - KR)}Q${X1} ${T} ${X1} ${f(T + KR)}V${f(B - KR)}Q${X1} ${B} ${f(X1 - KR)} ${B}H15.5`;

export default defineIcon({
  name: 'foldable-phone',
  zh: '折叠屏手机',
  category: 'devices',
  tags: ['folding phone', 'fold', 'dual screen', 'smartphone', 'mobile', '折叠屏', '手机'],
  variants: ['check', 'x', 'sync', 'lock'],
  allow: { joint: "the left half's square hinge corners sit under the right half, and their outlines join it in one straight edge" },
  // An unfolded phone whose screen has a faint crease down the middle; on hover the right half
  // folds shut over the left, showing its cover screen, and opens again.
  svg: (u) => `${back(u, LEFT)}<path d="${rp(R(X0 + 2, T + 2, W - 2, B - T - 4), [CR, 0, 0, CR])}" fill="#fff"/>
      <g filter="${u.hi}"><g data-n="rb"><path d="${RIGHT}" fill="${u.loS}"/></g></g>
      <g data-n="ro"><path d="${RIGHT_EDGE}" fill="none" ${OL}/>
        <g data-n="face"><path d="${rp(R(15.5, T + 2, W - 2, B - T - 4), [0, CR, CR, 0])}" fill="#fff"/>
          <path d="M15.5 ${T + 2}V${B - 2}" fill="none" stroke-width="1.2" data-t="stroke:#D3E2FC"/>
          <path d="${circ(15.5 + W / 2 - 1, T + 5.2, 1.2)}" ${DEEP}/></g>
        <path data-n="cover" d="${rr(17.5, T + 2, W - 4, B - T - 4, CR)}" fill="#fff" opacity="0"/></g>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    // The half turns about the hinge: edge-on halfway, mirrored over the left half when shut.
    const s = Math.cos(Math.PI * bump(p.o)), t = `translate(15.5 0) scale(${f(Math.abs(s) < 0.001 ? 0.001 : s)} 1) translate(-15.5 0)`;
    at(E.rb, { transform: t }); at(E.ro, { transform: t });
    at(E.face, { opacity: s >= 0 ? 1 : 0 }); at(E.cover, { opacity: s < 0 ? 1 : 0 });
  }
});
