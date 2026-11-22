import { defineIcon, f, OL, DEEPS, R, rp, circ, at, clamp01 } from '../packages/core/src/kit.js';
import { back } from './_w2-devices.js';
import { circCW } from './_devices.js';

const CX = 15.5, CY = 9.4;
const RING = circ(CX, CY, 8.4) + circCW(CX, CY, 4.8);
const POLE = rp(R(14.4, 15, 2.2, 7.4), 0);
const BASE = rp(R(10.5, 21.6, 10, 2.4), 1);
const RAYS = [0, 45, 135, 180, 225, 315];

export default defineIcon({
  name: 'ring-light',
  zh: '补光灯',
  category: 'devices',
  tags: ['led ring', 'selfie light', 'fill light', 'streaming', 'vlog', 'video call', '环形灯', '直播'],
  variants: ['check', 'x', 'bolt'],
  off: true,
  // A ring light on its stand; on hover it switches on: the ring brightens and light shines out.
  svg: (u) => `${back(u, POLE)}${back(u, BASE)}
      <g filter="${u.hi}"><path d="${RING}" fill="${u.upS}"/></g>
      <path data-n="glow" d="${RING}" fill="#fff" opacity="0"/><path d="${RING}" ${OL}/>
      <path data-n="rays" fill="none" stroke-width="2.2" stroke-linecap="round" opacity="0" ${DEEPS}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), a = 10.6 + o, b = 10.6 + 2.4 * o;
    const ray = (deg) => {
      const c = Math.cos(deg * Math.PI / 180), s = Math.sin(deg * Math.PI / 180);
      return `M${f(CX + a * c)} ${f(CY + a * s)}L${f(CX + b * c)} ${f(CY + b * s)}`;
    };
    at(E.rays, { d: RAYS.map(ray).join(''), opacity: f(o) });
    at(E.glow, { opacity: f(0.6 * o) });
  }
});
