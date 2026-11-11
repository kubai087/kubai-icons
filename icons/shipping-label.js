import { defineIcon, KR, OL, WHITE, WHITES, R, rp, lines, at } from '../packages/core/src/kit.js';

// A portrait parcel label: a tall barcode across the top, one address line below it on the
// left and the lower right corner peeling up. Upright with a barcode, it reads as a waybill
// rather than a sticker or a page.
const X0 = 6.7, X1 = 24.3, Y0 = 1.6, Y1 = 23.4;
const BARS = [1.6, 2.8, 1.6, 2.8];
const BAR_W = BARS.reduce((s, w) => s + w, 0) + 1.5 * (BARS.length - 1);
const BX = 15.5 - BAR_W / 2;
let bx = BX, bars = '';
for (const w of BARS) { bars += rp(R(bx, Y0 + 2.6, w, 8.8), 0.4); bx += w + 1.5; }
// Round caps add 0.8 at each end, so the line starts 0.8 in from the barcode's edge, and
// ends 2 clear of where the peeled flap reaches on hover.
const ADDR = lines(BX + 0.8, Y0 + 14.6, [4.4]);

export default defineIcon({
  name: 'shipping-label',
  zh: '快递面单',
  category: 'commerce',
  tags: ['waybill', 'parcel', 'label', 'barcode', 'address', 'shipping', 'delivery', 'package', '运单', '快递单'],
  variants: ['check', 'x', 'alert', 'search'],
  // A parcel label with a barcode and an address line; on hover its peeled corner curls back
  // further.
  svg: (u) => `<g filter="${u.sh}"><g filter="${u.hi}"><path data-n="b" fill="${u.loS}"/></g></g><path data-n="bO" ${OL}/>
    <path d="${bars}" ${WHITE}/>
    <path d="${ADDR}" class="ln" ${WHITES}/>
    <g filter="${u.sh}"><g filter="${u.hi}"><path data-n="fl" fill="${u.upS}"/></g></g><path data-n="flO" stroke-linejoin="round" ${OL}/>`,
  target: (h) => ({ d: h ? 7.4 : 5.6 }),
  draw(p, E) {
    // As in the sticker: the corner folds over the line x + y = const, and the flap's tip
    // lands on the corner's mirror image.
    const d = p.d;
    const body = rp([[X0, Y0], [X1, Y0], [X1, Y1 - d], [X1 - d, Y1], [X0, Y1]], [KR, KR, 0.4, 0.4, KR]);
    const flap = rp([[X1, Y1 - d], [X1 - d, Y1 - d], [X1 - d, Y1]], [0.4, 1.6, 0.4]);
    at(E.b, { d: body }); at(E.bO, { d: body }); at(E.fl, { d: flap }); at(E.flO, { d: flap });
  }
});
