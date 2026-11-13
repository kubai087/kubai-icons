import { defineIcon, f, OL, rp, rr, at } from '../packages/core/src/kit.js';
import { layer } from './_science-edu-sports.js';

// Two rails behind four pointed pickets. The pickets are 2.8 wide with 4 between them, so
// their outlines stand 2 apart; the middle two are a gate hinged on its left edge.
const RAILS = [rr(4.4, 9, 22.2, 2.6, 1.3), rr(4.4, 16.4, 22.2, 2.6, 1.3)];
const XS = [3.9, 10.7, 17.5, 24.3], W = 2.8, TOP = 3.4, FOOT = 23, HINGE = XS[1];
const picket = (x, w) => rp([[x, TOP + 2.2], [x + w / 2, TOP], [x + w, TOP + 2.2], [x + w, FOOT], [x, FOOT]], [0.5, Math.min(0.7, w / 3), 0.5, 1.2, 1.2].map((r) => Math.min(r, w / 2.4)));
const piece = (u, n) => `<g filter="${u.sh}"><g filter="${u.hi}"><path data-n="${n}" fill="${u.upS}"/></g></g><path data-n="${n}O" ${OL}/>`;

export default defineIcon({
  name: 'fence',
  zh: '栅栏',
  category: 'nature',
  tags: ['picket fence', 'garden', 'yard', 'gate', 'boundary', 'home', 'backyard', '篱笆', '院子'],
  // A picket fence with a gate in the middle; on hover the gate swings open on its hinge.
  svg: (u) => `${RAILS.map((d, i) => layer(u, 'r' + i, d, u.loS)).join('')}
    ${layer(u, 'p0', picket(XS[0], W), u.upS)}${layer(u, 'p3', picket(XS[3], W), u.upS)}
    ${piece(u, 'g1')}${piece(u, 'g2')}`,
  target: (h) => ({ s: h ? 0.3 : 1 }),
  draw(p, E) {
    // Seen edge-on as it opens, the gate narrows towards its hinge.
    [XS[1], XS[2]].forEach((x, i) => {
      const d = picket(HINGE + (x - HINGE) * p.s, W * p.s);
      at(E['g' + (i + 1)], { d }); at(E['g' + (i + 1) + 'O'], { d });
    });
  }
});
