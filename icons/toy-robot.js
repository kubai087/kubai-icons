import { defineIcon, KR, f, DEEP, DEEPS, WHITE, R, rp, rr, circ, at, clamp01, bump } from '../packages/core/src/kit.js';
import { layer, moveAll } from './_science-edu-sports.js';

// A wind-up tin robot from the front: a square head with two round eyes and an antenna, a
// body with a chest panel, arms hung 1 clear of the body from their shoulders, and two legs
// that run up under the body.
const HEAD = rr(9.7, 3.4, 11.6, 7.2, 2);
const BODY = rr(8.3, 11.6, 14.4, 8.4, KR);
const PANEL = rr(11.3, 13.6, 8.4, 4.4, 1.2);
const ARM_L = rr(4.9, 12.4, 2.4, 6.6, 1.2), ARM_R = rr(23.7, 12.4, 2.4, 6.6, 1.2);
const LEGS = rp(R(10.7, 19, 3.4, 5), [0, 0, 1, 1]) + rp(R(16.9, 19, 3.4, 5), [0, 0, 1, 1]);
const SY = 13.6;

export default defineIcon({
  name: 'toy-robot',
  zh: '铁皮机器人',
  category: 'sports',
  tags: ['toy robot', 'tin robot', 'wind-up', 'robot', 'retro', 'retro-futurism', 'toy', 'space age', '机器人玩具', '发条机器人', '复古未来'],
  variants: ['heart', 'star'],
  // A tin toy robot; on hover it raises both arms and its eyes blink.
  svg: (u) => `${layer(u, 'lg', LEGS, u.loS, { sh: false })}
      ${layer(u, 'al', ARM_L, u.upS)}${layer(u, 'ar', ARM_R, u.upS)}
      ${layer(u, 'bd', BODY, u.loS)}${layer(u, 'pn', PANEL, u.upS, { sh: false })}
      <path d="M15.5 3.4V1.8" fill="none" stroke-width="2.2" stroke-linecap="round" ${DEEPS}/><path d="${circ(15.5, 1.2, 1.2)}" ${DEEP}/>
      ${layer(u, 'hd', HEAD, u.loS)}
      <path data-n="eyes" ${WHITE}/>`,
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const o = clamp01(p.o), a = 70 * bump(o);
    moveAll(E, ['al'], a < 0.01 ? '' : `rotate(${f(a)} 6.1 ${SY})`);
    moveAll(E, ['ar'], a < 0.01 ? '' : `rotate(${f(-a)} 24.9 ${SY})`);
    const b = Math.sin(Math.PI * Math.min(1, Math.max(0, (o - 0.2) / 0.3)));
    const r = 1.3, ry = r * (1 - 0.8 * b);
    const eye = (x) => `M${f(x - r)} 7A${r} ${f(ry)} 0 1 0 ${f(x + r)} 7A${r} ${f(ry)} 0 1 0 ${f(x - r)} 7Z`;
    at(E.eyes, { d: eye(13.1) + eye(17.9) });
  }
});
