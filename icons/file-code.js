import { defineIcon, f, at, bump } from '../packages/core/src/kit.js';
import { typedPage, FILE_BADGES } from './_files-text.js';

const MARK = 'fill="none" stroke="#fff" data-w="stroke" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';

export default defineIcon({
  name: 'file-code',
  zh: '代码文件',
  category: 'files',
  tags: ['code', 'source', 'script', 'html', 'developer', '代码'],
  variants: FILE_BADGES,
  // A page with a pair of angle brackets that open wider on hover.
  svg: (u) => typedPage(u, `<path data-n="lt" ${MARK}/><path data-n="gt" ${MARK}/>`),
  target: (h) => ({ o: h ? 1 : 0 }),
  draw(p, E) {
    const dx = 1.2 * p.o + 0.9 * bump(p.o), l = 13.4 - dx, r = 17.6 + dx;
    at(E.lt, { d: `M${f(l)} 11.4L${f(l - 3.4)} 15.2L${f(l)} 19` });
    at(E.gt, { d: `M${f(r)} 11.4L${f(r + 3.4)} 15.2L${f(r)} 19` });
  }
});
