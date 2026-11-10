import { defineIcon, CLOCK_MINUTES, f, R, rp, rr, circ, at } from '../packages/core/src/kit.js';
import { solid } from './_devices.js';

const C = [15.5, 12.5];

export default defineIcon({
  name: 'wristwatch',
  zh: '腕表',
  category: 'time',
  tags: ['watch', 'analog watch', 'wait', 'busy', 'time', 'classic', '手表', '等待'],
  variants: ['check', 'x', 'alert'],
  // An analog wristwatch on its strap; on hover the hands run forward, as a busy cursor's do.
  svg: (u) => `${solid(u, rp(R(11.2, 1.2, 8.6, 5.4), [1.6, 1.6, 0, 0]), u.upS)}
      ${solid(u, rp(R(11.2, 18.4, 8.6, 5.4), [0, 0, 1.6, 1.6]), u.upS)}
      ${solid(u, rr(22.4, 10.9, 2.6, 3.2, 0.8), u.loS, { sh: false })}
      ${solid(u, circ(C[0], C[1], 8), u.loS)}
      <path d="${circ(C[0], C[1], 5.8)}" fill="#fff"/>
      <path data-n="hh" d="M15.5 12.5V9.6" stroke-width="2.6" stroke-linecap="round" data-t="stroke:#89B5FF"/>
      <path data-n="mh" d="M15.5 12.5V8.3" stroke-width="2" stroke-linecap="round" data-t="stroke:#2F6FE0"/>
      <circle cx="15.5" cy="12.5" r="1.3" data-t="fill:#2F6FE0"/>`,
  target: (h) => {
    const m = CLOCK_MINUTES, run = h ? 300 : 0;
    return { mA: m * 6 + run, hA: m / 2 + run / 12 };
  },
  draw(p, E) {
    at(E.mh, { transform: `rotate(${f(p.mA)} 15.5 12.5)` });
    at(E.hh, { transform: `rotate(${f(p.hA)} 15.5 12.5)` });
  }
});
