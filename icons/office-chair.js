import { defineIcon, f, DEEP, rp, rr, circ, wave, settle, clamp01 } from '../packages/core/src/kit.js';
import { front, flat, liveBack, setPath } from './_b1-home.js';

const BACK_W = 12.2;
// The backrest at a share c of its full width; the chair turns about its column.
const backrest = (c) => {
  const w = Math.max(0.01, BACK_W * Math.abs(c));
  return rr(15.5 - w / 2, 0.6, w, 11, Math.min(3, w / 2));
};
// A five-star base seen from the front: its legs splay out over three castors, each
// castor half hidden behind the leg it hangs from.
const BASE = rp([[13.6, 17.8], [17.4, 17.8], [24.8, 20], [24.8, 21.4], [6.2, 21.4], [6.2, 20]], [0.6, 0.6, 0.6, 0.6, 0.6, 0.6]);
const CASTORS = [7.6, 15.5, 23.4];

export default defineIcon({
  name: 'office-chair',
  zh: '办公椅',
  category: 'home',
  tags: ['desk chair', 'swivel chair', 'task chair', 'seat', 'office', 'workstation', 'furniture', '转椅', '电脑椅', '椅子'],
  variants: [],
  // A swivel office chair on a five-star base; on hover it turns round once on its column.
  svg: (u) => `<path d="${rr(14.3, 12.6, 2.4, 5.6, 0)}" ${DEEP}/>
      ${CASTORS.map((x) => flat(u, circ(x, 21.8, 1.4))).join('')}
      <path d="${BASE}" ${DEEP}/>
      ${liveBack(u, 'b')}
      ${front(u, rr(6.8, 10.6, 17.4, 3.6, 1.8))}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const c = wave(clamp01(p.o), (t) => Math.cos(2 * Math.PI * settle(t)));
    setPath(E, 'b', backrest(c));
  }
});
