// Shared geometry for the automotive part icons.
import { rr, rp, circ } from '../packages/core/src/kit.js';

/**
 * An impact burst centred on the origin: spikes of uneven length, so it reads as a hit
 * rather than a gear or a star. `r` is the longest spike; the rest are fractions of it.
 */
export function burst(r) {
  const tips = [1, 0.78, 0.94, 0.72, 0.98, 0.8, 0.9, 0.74, 0.96];
  const pts = [];
  tips.forEach((k, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / tips.length, b = a + Math.PI / tips.length;
    pts.push([Math.cos(a) * r * k, Math.sin(a) * r * k], [Math.cos(b) * r * 0.5, Math.sin(b) * r * 0.5]);
  });
  return rp(pts, 0.25);
}

/** Radius of a screw hole in a mounting flange: 2.4 across, the smallest mark size. */
export const HOLE_R = 1.2;

/**
 * A mounting flange: a plate from x0 to x1 centred on y = cy, with round ends of radius r,
 * and a screw hole at the centre of each end that `ends` names ('left', 'right' or both).
 * The holes are deep marks rather than cut-outs: an outside outline would fill a cut-out
 * this small.
 */
export function flange(x0, x1, cy, r, ends = 'both') {
  let holes = '';
  if (ends !== 'right') holes += circ(x0 + r, cy, HOLE_R);
  if (ends !== 'left') holes += circ(x1 - r, cy, HOLE_R);
  return { plate: rr(x0, cy - r, x1 - x0, 2 * r, r), holes };
}
