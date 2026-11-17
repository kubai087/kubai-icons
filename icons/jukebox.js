import { defineIcon, KR, CR, f, rr, circ, at } from '../packages/core/src/kit.js';
import { back, front } from './_w2-devices.js';

// A jukebox from the front: a cabinet with a round arched top, an arched window that shows
// the record playing, and a speaker panel below. The window's arch is concentric with the
// cabinet's, 3 inside it.
const B = 24, WB = 15.6;
const BODY = `M6.3 10.2A9.2 9.2 0 0 1 24.7 10.2V${B - KR}Q24.7 ${B} ${24.7 - KR} ${B}H${6.3 + KR}Q6.3 ${B} 6.3 ${B - KR}Z`;
const WINDOW = `M9.3 10.2A6.2 6.2 0 0 1 21.7 10.2V${f(WB - CR)}Q21.7 ${WB} ${f(21.7 - CR)} ${WB}H${f(9.3 + CR)}Q9.3 ${WB} 9.3 ${f(WB - CR)}Z`;
const RX = 15.5, RY = 9.8, RR = 3.4, RL = 1.1;
// A wedge of sheen from the label to the rim, centred on angle a (degrees), w wide.
const wedge = (a, w) => {
  const p = (r, d) => { const t = (a + d) * Math.PI / 180; return `${f(r * Math.sin(t))} ${f(-r * Math.cos(t))}`; };
  return `M${p(RL, -w / 2)}L${p(RR, -w / 2)}A${RR} ${RR} 0 0 1 ${p(RR, w / 2)}L${p(RL, w / 2)}A${RL} ${RL} 0 0 0 ${p(RL, -w / 2)}Z`;
};

export default defineIcon({
  name: 'jukebox',
  zh: '点唱机',
  category: 'media',
  tags: ['jukebox', 'music machine', 'record player', 'diner', 'retro', '50s', 'music', '自动点唱机', '唱机'],
  variants: ['heart', 'star'],
  // A jukebox with a record in its window; on hover the record spins and the speaker panel
  // lights up.
  svg: (u) => `${back(u, BODY)}
      <path d="${WINDOW}" fill="#fff"/>
      <path d="${circ(RX, RY, RR)}" fill="${u.pure('#5393FF')}"/>
      <g data-n="spin"><path d="${wedge(45, 40) + wedge(225, 40)}" fill="#fff" data-w="fill" opacity=".85"/></g>
      <circle cx="${RX}" cy="${RY}" r="${RL}" fill="#fff"/>
      ${front(u, rr(9.3, 17.6, 12.4, 4.4, 1.6), u.upS, 'sp')}
      <path data-n="glow" d="${rr(9.3, 17.6, 12.4, 4.4, 1.6)}" fill="#fff" opacity="0"/>`,
  target: (h) => ({ rot: h ? 300 : 0, g: h ? 0.55 : 0 }),
  draw(p, E) {
    at(E.spin, { transform: `translate(${RX} ${RY}) rotate(${f(p.rot)})` });
    at(E.glow, { opacity: f(p.g) });
  }
});
