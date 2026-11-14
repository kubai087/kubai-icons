import { defineIcon, KR, f, DEEPS, R, rp, rr, at } from '../packages/core/src/kit.js';
import { back, flat } from './_b1-home.js';

// Three drawers one outline apart, so each seam is a single line.
const X = 9.2, W = 12.6, H = 17 / 3, TOP = 3;
const drawerY = (i) => TOP + i * (H + 1);
// A hanging folder with its tab on the left, drawn from its top edge at y.
const folder = (y) => rp([[10.6, y], [14.6, y], [15.8, y + 1.6], [20.4, y + 1.6], [20.4, y + 8], [10.6, y + 8]], [1, 0.8, 0.8, 1, 0, 0]);

export default defineIcon({
  name: 'filing-cabinet',
  zh: '文件柜',
  category: 'files',
  tags: ['file cabinet', 'drawers', 'records', 'office', 'storage', 'archive', '档案柜', '抽屉', '办公'],
  variants: ['plus', 'check', 'lock', 'search'],
  // A three-drawer filing cabinet; on hover a folder is lifted out of the top drawer.
  svg: (u) => {
    const drawers = [0, 1, 2].map((i) => flat(u, rr(X, drawerY(i), W, H, 1.2))).join('');
    const handles = [0, 1, 2].map((i) => `M12.9 ${f(drawerY(i) + H / 2)}H18.1`).join('');
    return `${back(u, rr(7, 1, 17, 23, KR))}
      <clipPath id="${u.id('in')}"><rect x="0" y="-4" width="31" height="${f(drawerY(0) + H + 3)}"/></clipPath>
      <g clip-path="url(#${u.id('in')})"><g data-n="fd">${flat(u, folder(0))}</g></g>
      ${drawers}
      <path d="${handles}" fill="none" stroke-width="1.6" stroke-linecap="round" ${DEEPS}/>`;
  },
  target: (h) => ({ y: h ? -2.4 : 3.4 }),
  draw(p, E) { at(E.fd, { transform: `translate(0 ${f(p.y)})` }); }
});
