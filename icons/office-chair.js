import { defineIcon, KR, f, DEEP, rp, rr, circ, at, wave, settle, clamp01 } from '../packages/core/src/kit.js';
import { back, front, liveBack, setPath } from './_b1-home.js';

const BACK_W = 12.2;
// The backrest at a share c of its full width; the chair turns about its column.
const backrest = (c) => {
  const w = Math.max(0.01, BACK_W * Math.abs(c));
  return rr(15.5 - w / 2, 1.2, w, 11, Math.min(3, w / 2));
};
// A five-star base seen from the front: three of its castors show.
const BASE = rp([[13.6, 18.6], [17.4, 18.6], [24.8, 20.8], [24.8, 22.4], [6.2, 22.4], [6.2, 20.8]], [0.6, 0.6, 0.8, 0.6, 0.6, 0.8]);

export default defineIcon({
  name: 'office-chair',
  zh: '办公椅',
  category: 'home',
  tags: ['desk chair', 'swivel chair', 'task chair', 'seat', 'office', 'workstation', 'furniture', '转椅', '电脑椅', '椅子'],
  variants: [],
  // A swivel office chair on a five-star base; on hover it turns round once on its column.
  svg: (u) => `<path d="${rr(14.3, 13, 2.4, 6, 0)}" ${DEEP}/>
      <path d="${BASE + circ(7.4, 23.2, 1.3) + circ(15.5, 23.2, 1.3) + circ(23.6, 23.2, 1.3)}" ${DEEP}/>
      ${liveBack(u, 'b')}
      ${front(u, rr(6.8, 11.2, 17.4, 3.6, 1.8))}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const c = wave(clamp01(p.o), (t) => Math.cos(2 * Math.PI * settle(t)));
    setPath(E, 'b', backrest(c));
  }
});
