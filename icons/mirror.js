import { defineIcon, f, OL, ACC, LINE, DEEPS, ellipse, rr, at, scaleAt, clamp01 } from '../packages/core/src/kit.js';

export default defineIcon({
  name: 'mirror',
  zh: '镜子',
  category: 'home',
  tags: ['vanity', 'reflection', 'makeup', 'bathroom', 'dressing', 'beauty', '化妆镜'],
  variants: [],
  // A round vanity mirror on a stand; on hover it swivels on its stand and back while a glint
  // of light sweeps across the glass.
  svg: (u) => {
    const frame = ellipse(15.5, 9.8, 8.4, 9.4), glass = ellipse(15.5, 9.8, 6.2, 7.2), foot = rr(10, 20.6, 11, 3, 1.5);
    return `<path d="M15.5 18V21" fill="none" stroke-width="2.2" stroke-linecap="round" ${DEEPS}/>
      <g filter="${u.sh}"><g filter="${u.hi}"><path d="${foot}" fill="${u.upS}"/></g></g><path d="${foot}" ${OL}/>
      <g filter="${u.sh}"><g filter="${u.hi}"><path data-n="m0" d="${frame}" fill="${u.loS}"/></g></g><path data-n="m1" d="${frame}" ${OL}/>
      <path data-n="m2" d="${glass}" fill="#fff"/>
      <clipPath id="${u.id('g')}"><path d="${glass}"/></clipPath>
      <g data-n="m3" clip-path="url(#${u.id('g')})"><g data-n="glint"><path d="M2 17.6L19 0.6" ${ACC} fill="none"/><path d="M4 20.8L24.4 0.4" ${LINE} fill="none"/></g></g>`;
  },
  target: (h) => ({ x: h ? 5.4 : 0 }),
  draw(p, E) {
    // The glints run right across the glass and are clipped at its edge.
    // The swivel narrows the frame and glass about the stand's axis and widens them again.
    const k = 1 - 0.4 * Math.sin(Math.PI * clamp01(p.x / 5.4));
    const t = Math.abs(1 - k) < 1e-4 ? '' : scaleAt(k, 15.5, 9.8, 1);
    for (let i = 0; i < 4; i++) t ? E['m' + i].setAttribute('transform', t) : E['m' + i].removeAttribute('transform');
    at(E.glint, { transform: `translate(${f(p.x)} ${f(p.x * 0.8)})` });
  }
});
