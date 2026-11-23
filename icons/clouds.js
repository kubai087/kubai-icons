import { defineIcon, f, OL, cloud, at } from '../packages/core/src/kit.js';

// A small cloud behind on the upper right, its flat bottom hidden by a bigger cloud in front.
const BACK = cloud([16, 11, 3.4], [19.8, 7.6, 4.4], [23.2, 11.2, 3.2]);
const FRONT = cloud([9.4, 18, 4.2], [15, 14.4, 5.6], [21, 17.6, 4.6]);

export default defineIcon({
  name: 'clouds',
  zh: '阴天',
  category: 'weather',
  tags: ['cloudy', 'overcast', 'clouds', 'weather', 'grey sky', '多云'],
  // Two clouds, one behind the other; on hover they drift to the right, the nearer one further.
  svg: (u) => `<g data-n="bk"><g filter="${u.sh}"><g filter="${u.hi}"><path d="${BACK}" fill="${u.loS}"/></g></g><path d="${BACK}" ${OL}/></g>
    <g data-n="fr"><g filter="${u.sh}"><g filter="${u.hi}"><path d="${FRONT}" fill="${u.upS}"/></g></g><path d="${FRONT}" ${OL}/></g>`,
  target: (h) => ({ bk: h ? 0.4 : 0, fr: h ? 1.4 : 0 }),
  draw(p, E) {
    at(E.bk, { transform: `translate(${f(p.bk)} 0)` });
    at(E.fr, { transform: `translate(${f(p.fr)} 0)` });
  }
});
