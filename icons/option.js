import { defineIcon, KR, f, DEEPS, rr, at } from '../packages/core/src/kit.js';
import { front } from './_interface.js';

// The option sign: a top-left bar that drops diagonally to a bottom-right bar, and a short bar
// on the top right.
const glyph = (cx, cy) => `M${f(cx - 4.8)} ${f(cy - 2.6)}H${f(cx - 2)}L${f(cx + 2)} ${f(cy + 2.6)}H${f(cx + 4.8)}M${f(cx + 1.6)} ${f(cy - 2.6)}H${f(cx + 4.8)}`;

export default defineIcon({
  name: 'option',
  zh: 'Option 键',
  category: 'interface',
  tags: ['option', 'alt', 'opt', 'key', 'modifier', 'shortcut', 'keyboard', 'mac', '快捷键'],
  // An option key; on hover the cap presses down into its base.
  svg: (u) => `<path data-n="base" fill="${u.loS}" filter="${u.sh}"/><path data-n="baseO" class="ol" data-t="stroke:#5393FF"/>
    <g data-n="cap">${front(u, rr(5.2, 2.2, 20.6, 16.2, KR))}
      <path d="${glyph(15.5, 10.3)}" class="ln" stroke-linejoin="round" ${DEEPS}/></g>`,
  target: (h) => ({ d: h ? 1.4 : 0 }),
  draw(p, E) {
    const base = rr(5.2, 2.2 + p.d, 20.6, 20.6 - p.d, KR);
    at(E.base, { d: base }); at(E.baseO, { d: base });
    at(E.cap, { transform: `translate(0 ${f(p.d)})` });
  }
});
