import { defineIcon, f, OL, R, rp, rr, at, clamp01, wave } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A jetpack from the back: two tanks with domed tops, joined by a plate in front of them, a
// nozzle under each tank and a jet flame burning from each nozzle.
const TANKS = rp(R(7.4, 1.6, 6.2, 14), [3.1, 3.1, 1.2, 1.2]) + rp(R(17.4, 1.6, 6.2, 14), [3.1, 3.1, 1.2, 1.2]);
const nozzle = (cx) => rp([[cx - 1.9, 14.8], [cx + 1.9, 14.8], [cx + 3.4, 18], [cx - 3.4, 18]], [0, 0, 0.8, 0.8]);
const NOZZLES = nozzle(10.5) + nozzle(20.5);
const PLATE = rr(11.2, 4.4, 8.6, 9, 1.6);
const NY = 18, FW = 2;
// A jet flame hanging from a nozzle mouth at (cx, y): flat on top, where the nozzle hides it,
// and drawn down to a point L below, which sways sideways by s.
const flame = (cx, y, L, s) => `M${f(cx - FW)} ${f(y - 1)}H${f(cx + FW)}`
  + `C${f(cx + FW)} ${f(y + L * 0.45)} ${f(cx + 0.8 + s)} ${f(y + L * 0.75)} ${f(cx + s)} ${f(y + L)}`
  + `C${f(cx - 0.8 + s)} ${f(y + L * 0.75)} ${f(cx - FW)} ${f(y + L * 0.45)} ${f(cx - FW)} ${f(y - 1)}Z`;

export default defineIcon({
  name: 'jetpack',
  zh: '喷气背包',
  category: 'transport',
  tags: ['jetpack', 'rocket pack', 'jet', 'fly', 'launch', 'boost', 'retro-futurism', 'space age', 'future', '火箭背包', '飞行背包', '复古未来'],
  variants: ['bolt'],
  // A jetpack with its flames low; on hover the flames roar up and the pack lifts off.
  svg: (u) => `<g data-n="fl"><g filter="${u.hi}"><path data-n="f1" fill="${u.loS}"/><path data-n="f2" fill="${u.loS}"/></g>
      <path data-n="f1O" stroke-linejoin="round" ${OL}/><path data-n="f2O" stroke-linejoin="round" ${OL}/></g>
      ${layer(u, 'nz', NOZZLES, u.upS, { sh: false })}
      ${layer(u, 'tk', TANKS, u.loS)}
      ${layer(u, 'pt', PLATE, u.upS)}`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), lift = 1.6 * o;
    const L = 4.4 + 2.6 * o, s = wave(o, (t) => 0.9 * (1 - t) * Math.sin(3 * Math.PI * t));
    [['f1', 10.5, s], ['f2', 20.5, -s]].forEach(([n, cx, sw]) => {
      const d = flame(cx, NY - lift, L, sw);
      at(E[n], { d }); at(E[n + 'O'], { d });
    });
    moveAll(E, ['nz', 'tk', 'pt'], lift < 1e-3 ? '' : `translate(0 ${f(-lift)})`);
  }
});
