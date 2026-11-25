// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Optical centre (GUIDE.md §1.5). An icon is placed by where its weight sits, not by its box:
// the centre of the filled silhouette (the fill variant, which is how the eye reads mass) is
// measured and compared with the centre of the canvas, (12, 12).
//
// measure(names) renders each icon's silhouette in headless Chrome and returns, per icon,
//   box   the ink's bounding box [x0, y0, x1, y1] on the 24 grid
//   mass  the centre of the silhouette's area [x, y]
// Silhouette = the fill variant at the regular weight, without its knock-outs (a hole is a detail
// on the face, not a change in where the object's weight sits), with every enclosed area filled in (a lens
// or a door changes what is inside, not where the object stands); open space between separate
// parts is not mass.
import { render } from './kit.mjs';
import { ALL } from './icons.mjs';
import { evaluate } from './chrome.mjs';

const PX = 240;

export function measure(names) {
  const svgs = names.map((n, i) => render(ALL[n], { variant: 'fill', size: PX, color: '#000', id: `o${i}`, cuts: false }));
  const html = `<!doctype html><body><pre id="out"></pre><script>
const svgs = ${JSON.stringify(svgs)}, names = ${JSON.stringify(names)}, PX = ${PX};
const res = {}; let left = svgs.length;
svgs.forEach((svg, i) => {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas'); c.width = c.height = PX;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, PX, PX).data;
    // The silhouette is the ink plus every area it encloses: flood the empty canvas from its edge;
    // what the flood cannot reach is mass. (Filling each row from its first to its last ink would
    // also count the open space between separate parts, such as the arms of a Y or the arcs on
    // either side of a bell, and make open shapes read top-heavy.)
    const ink = (k) => d[k * 4 + 3] > 127, out = new Uint8Array(PX * PX), stack = [];
    for (let k = 0; k < PX; k++) for (const q of [k, (PX - 1) * PX + k, k * PX, k * PX + PX - 1]) if (!ink(q) && !out[q]) { out[q] = 1; stack.push(q); }
    while (stack.length) {
      const q = stack.pop(), x0 = q % PX, y0 = (q - x0) / PX;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const xx = x0 + dx, yy = y0 + dy, k = yy * PX + xx;
        if (xx < 0 || yy < 0 || xx >= PX || yy >= PX || out[k] || ink(k)) continue;
        out[k] = 1; stack.push(k);
      }
    }
    let A = 0, sx = 0, sy = 0, b = [PX, PX, 0, 0];
    for (let y = 0; y < PX; y++) for (let k = 0; k < PX; k++) {
      if (out[y * PX + k]) continue;
      A++; sx += k + 0.5; sy += y + 0.5;
      if (ink(y * PX + k)) b = [Math.min(b[0], k), Math.min(b[1], y), Math.max(b[2], k + 1), Math.max(b[3], y + 1)];
    }
    const u = 24 / PX, r = (v) => +(v * u).toFixed(2);
    res[names[i]] = { box: b.map(r), mass: [r(sx / A), r(sy / A)] };
    if (--left === 0) document.getElementById('out').textContent = JSON.stringify(res);
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
});
</script>`;
  return evaluate(html);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const names = process.argv[2] ? process.argv[2].split(',') : Object.keys(ALL);
  const m = measure(names);
  for (const n of names) {
    const { box, mass } = m[n], bc = [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2];
    console.log(n.padEnd(15), 'mass', mass.map((v) => v.toFixed(2)).join(','), ' off', (mass[0] - 12).toFixed(2), (mass[1] - 12).toFixed(2), ' box ctr', bc.map((v) => v.toFixed(2)).join(','));
  }
}
