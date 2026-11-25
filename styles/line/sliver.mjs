// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Slivers in the fill variant (GUIDE.md §4.1). A detail knocked out of a filled shape must keep
// clear of the shape's edge: the ink left between the hole and the outside is at least one stroke
// wide, or the hole runs out through the edge. A rim thinner than that, or a scrap of ink left
// between two holes (between the wheels of an ambulance), reads as a smudge at small sizes.
//
// slivers(names, strokes) renders the fill variant of each icon at each stroke in headless
// Chrome and finds the ink thinner than THIN × stroke: the ink a disc of that width cannot reach
// when rolled around inside the ink (a morphological opening, done with two distance
// transforms). Round line ends and dots keep their full width, so only rims and scraps remain.
// Each finding is the largest such patch: its area in grid units² and its centre.
import { render } from './kit.mjs';
import { ALL } from './icons.mjs';
import { evaluate, screenshot } from './chrome.mjs';

/** A rim or scrap narrower than this many strokes is a sliver. */
export const THIN = 0.75;
/** Patches smaller than this many stroke² are edge noise (anti-aliasing, a cut corner). */
export const MIN_AREA = 0.06;
const PX = 240;

/** With sheet set to a PNG path, also draws each icon with its thin ink in red, for review. */
export function slivers(names, strokes, { sheet } = {}) {
  const jobs = [];
  for (const n of names) for (const s of strokes) jobs.push({ n, s,
    svg: render(ALL[n], { s, variant: 'fill', size: PX, color: '#000', id: `v${jobs.length}` }),
    // the same without holes: ink thin here (a star's point, a beak) is the shape, not a sliver
    whole: render(ALL[n], { s, variant: 'fill', size: PX, color: '#000', id: `w${jobs.length}`, cuts: false }) });
  const html = `<!doctype html><body style="margin:0"><div id="sheet" style="display:flex;flex-wrap:wrap;width:1024px"></div><style>#out{display:none}</style><pre id="out"></pre><script>
const jobs = ${JSON.stringify(jobs.map((j) => ({ n: j.n, s: j.s })))}, svgs = ${JSON.stringify(jobs.map((j) => j.svg))}, wholes = ${JSON.stringify(jobs.map((j) => j.whole))};
const PX = ${PX}, U = PX / 24, THIN = ${THIN}, MIN_AREA = ${MIN_AREA}, SHEET = ${sheet ? 'true' : 'false'};
// Squared Euclidean distance transform (Felzenszwalb and Huttenlocher), in place on f.
function dt1(f, n) {
  const d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1); let k = 0; v[0] = 0; z[0] = -Infinity; z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s; do { const r = v[k]; s = ((f[q] + q * q) - (f[r] + r * r)) / (2 * q - 2 * r); } while (s <= z[k] && --k >= 0);
    k++; v[k] = q; z[k] = s; z[k + 1] = Infinity;
  }
  k = 0; for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; const r = v[k]; d[q] = (q - r) * (q - r) + f[r]; }
  return d;
}
function edt(src) {
  const g = Float64Array.from(src), col = new Float64Array(PX);
  for (let x = 0; x < PX; x++) { for (let y = 0; y < PX; y++) col[y] = g[y * PX + x]; const d = dt1(col, PX); for (let y = 0; y < PX; y++) g[y * PX + x] = d[y]; }
  for (let y = 0; y < PX; y++) { const d = dt1(g.subarray(y * PX, y * PX + PX), PX); g.set(d, y * PX); }
  return g;
}
const res = jobs.map(() => null); let left = jobs.length;
const load = (svg) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg))); });
// ink thinner than the disc: what a disc of radius r rolled inside the ink cannot cover
function thinOf(ink, r) {
  const BIG = 1e12, toBlank = edt(Array.from(ink, (v) => (v ? BIG : 0)));
  const toCentre = edt(Array.from(toBlank, (v) => (v >= r * r ? 0 : BIG)));
  return Uint8Array.from(ink, (v, k) => (v && toCentre[k] > (r + 0.5) * (r + 0.5) ? 1 : 0));
}
const inkOf = (img) => {
  const c = document.createElement('canvas'); c.width = c.height = PX;
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
  const a = x.getImageData(0, 0, PX, PX).data;
  return Uint8Array.from({ length: PX * PX }, (_, k) => (a[k * 4 + 3] > 127 ? 1 : 0));
};
svgs.forEach((svg, i) => {
  Promise.all([load(svg), load(wholes[i])]).then(([img, wimg]) => {
    const r = (THIN * jobs[i].s * U) / 2, ink = inkOf(img), own = thinOf(inkOf(wimg), r);
    // thin only where the holes made it thin
    const thin = thinOf(ink, r).map((v, k) => (v && !own[k] ? 1 : 0));
    if (SHEET) {
      const v = document.createElement('canvas'); v.width = v.height = PX; v.style.cssText = 'width:120px;height:120px;margin:2px';
      const vx = v.getContext('2d'), out = vx.createImageData(PX, PX);
      for (let k = 0; k < ink.length; k++) { const red = thin[k], on = ink[k]; out.data.set(red ? [230, 30, 30, 255] : on ? [40, 44, 54, 255] : [246, 246, 248, 255], k * 4); }
      vx.putImageData(out, 0, 0); vx.fillStyle = '#888'; vx.font = '18px sans-serif'; vx.fillText(jobs[i].n + ' ' + jobs[i].s, 6, 20);
      document.getElementById('sheet').append(v);
    }
    // the largest connected patch of thin ink
    let best = null; const seen = new Uint8Array(PX * PX), stack = [];
    for (let k0 = 0; k0 < thin.length; k0++) {
      if (!thin[k0] || seen[k0]) continue;
      let A = 0, sx = 0, sy = 0; seen[k0] = 1; stack.push(k0);
      while (stack.length) {
        const q = stack.pop(), qx = q % PX, qy = (q - qx) / PX; A++; sx += qx; sy += qy;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const xx = qx + dx, yy = qy + dy, kk = yy * PX + xx;
          if (xx < 0 || yy < 0 || xx >= PX || yy >= PX || !thin[kk] || seen[kk]) continue;
          seen[kk] = 1; stack.push(kk);
        }
      }
      const area = A / (U * U);
      if (!best || area > best.area) best = { area: +area.toFixed(2), at: [+(sx / A / U).toFixed(1), +(sy / A / U).toFixed(1)] };
    }
    res[i] = best && best.area >= MIN_AREA * jobs[i].s * jobs[i].s ? { n: jobs[i].n, s: jobs[i].s, ...best } : null;
    if (--left === 0) document.getElementById('out').textContent = JSON.stringify(res.filter(Boolean));
  });
});
</script>`;
  if (sheet) screenshot(html, sheet, { width: 1024, height: Math.ceil(jobs.length / 8) * 124 + 8 });
  return evaluate(html);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const names = process.argv[2] ? process.argv[2].split(',') : Object.keys(ALL);
  const strokes = process.argv[3] ? process.argv[3].split(',').map(Number) : [2];
  const at = process.argv.indexOf('--sheet');
  for (const f of slivers(names, strokes, { sheet: at > 0 ? process.argv[at + 1] : undefined })) console.log(`${f.n} s${f.s}: ${f.area} at ${f.at.join(', ')}`);
}
