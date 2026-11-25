// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Shared parts for the SF-style line set: the role names, number rounding, and shapes that more
// than one icon is built from. Every icon file (icons.mjs and set/*.mjs) imports from here, so a
// shape is drawn the same way wherever it appears. Coordinates follow GUIDE.md §1: the 24 grid,
// outlines placed by their outer edge, centre lines on whole numbers at the regular stroke 2.
export { geo, shell, line, solid } from './kit.mjs';

export const n = (v) => +(+v).toFixed(3);
export const P = 'primary', S = 'secondary', D = 'detail';

// Open rounded "U" by centre line: down the left, along the bottom, up the right.
export const cup = (x0, y0, x1, y1, c) => `M${n(x0)} ${n(y0)}V${n(y1 - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x0 + c)} ${n(y1)}H${n(x1 - c)}A${n(c)} ${n(c)} 0 0 0 ${n(x1)} ${n(y1 - c)}V${n(y0)}`;
// Upside-down U by centre line: up the left, over the top, down the right (shackle, handle).
export const arch = (x0, x1, top, y) => { const r = (x1 - x0) / 2; return `M${n(x0)} ${n(y)}V${n(top + r)}A${n(r)} ${n(r)} 0 0 1 ${n(x1)} ${n(top + r)}V${n(y)}`; };

// Heart from two circles and the lines tangent to them, meeting at a rounded point.
export function heart(g, { w = 20, top = 4.1, tip = 21.7, R = 5.6 } = {}) {
  const r = R - g.h, d = w / 2 - R, cy = top + R, ty = tip - g.h * 1.2;
  const tan = ([cx, cy0], side) => {
    const Dd = Math.hypot(12 - cx, ty - cy0), phi = Math.atan2(ty - cy0, 12 - cx), b = Math.acos(r / Dd);
    return [phi + b, phi - b].map((t) => [cx + r * Math.cos(t), cy0 + r * Math.sin(t)]).sort((p, q) => side * (p[0] - q[0]))[1];
  };
  const L = tan([12 - d, cy], -1), Rr = tan([12 + d, cy], 1), my = cy - Math.sqrt(Math.max(r * r - d * d, 0));
  const p = (q) => `${n(q[0])} ${n(q[1])}`;
  return `M12 ${n(ty)}L${p(L)}A${n(r)} ${n(r)} 0 1 1 12 ${n(my)}A${n(r)} ${n(r)} 0 1 1 ${p(Rr)}Z`;
}
// Pin: a circle and the two lines tangent to it from the tip.
export function pin(g, { cx = 12, cy = 10.5, R = 8.1, tip = 22.4 } = {}) {
  const r = R - g.h, ty = tip - g.h * 1.3, b = Math.acos(r / (ty - cy));
  const Pt = (a) => `${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
  return `M${n(cx)} ${n(ty)}L${Pt(Math.PI / 2 + b)}A${n(r)} ${n(r)} 0 1 1 ${Pt(Math.PI / 2 - b)}Z`;
}
// Cloud: circles left to right standing on one base line; each arc runs clockwise round its own
// circle and is a large arc when it turns past 180°.
export function cloud(g, circles, base) {
  const C = circles.map(([x, y, R]) => [x, y, R - g.h]), yb = base - g.h;
  const meet = ([x1, y1, r1], [x2, y2, r2]) => {
    const dx = x2 - x1, dy = y2 - y1, Dd = Math.hypot(dx, dy), a = (r1 * r1 - r2 * r2 + Dd * Dd) / (2 * Dd), hh = Math.sqrt(Math.max(r1 * r1 - a * a, 0));
    const mx = x1 + (a * dx) / Dd, my = y1 + (a * dy) / Dd;
    const p1 = [mx + (hh * dy) / Dd, my - (hh * dx) / Dd], p2 = [mx - (hh * dy) / Dd, my + (hh * dx) / Dd];
    return p1[1] < p2[1] ? p1 : p2;
  };
  const p = (q) => `${n(q[0])} ${n(q[1])}`;
  const arc = ([cx, cy, r], from, to) => {
    const a = (q) => Math.atan2(q[1] - cy, q[0] - cx), turn = (((a(to) - a(from)) * 180) / Math.PI + 360) % 360;
    return `A${n(r)} ${n(r)} 0 ${turn > 180 ? 1 : 0} 1 ${p(to)}`;
  };
  const stops = [[C[0][0], yb], ...C.slice(0, -1).map((c, i) => meet(c, C[i + 1])), [C[C.length - 1][0], yb]];
  return `M${p(stops[0])}` + C.map((c, i) => arc(c, stops[i], stops[i + 1])).join('') + 'Z';
}
// A hill in a frame: an arc from the bottom edge up into the right edge (centre lines).
export function hill(g, { cx = 17.5, cy = 24.5, r = 11.6, bottom = 20, right = 22 } = {}) {
  const yb = bottom - g.h, xr = right - g.h;
  const x0 = cx - Math.sqrt(r * r - (cy - yb) ** 2), y1 = cy - Math.sqrt(r * r - (xr - cx) ** 2);
  return `M${n(x0)} ${n(yb)}A${n(r)} ${n(r)} 0 0 1 ${n(xr)} ${n(y1)}`;
}
// Flag cloth: from the pole to a swallowtail notch cut by an arc (centre line).
export function flagCloth(g, { x0 = 5, x1 = 21, y0 = 3, y1 = 15, depth = 3.6 } = {}) {
  const { h } = g, top = y0 + h, bot = y1 - h, xr = x1 - h, c = bot - top, R = (c * c / 4 + depth * depth) / (2 * depth);
  return `M${n(x0)} ${n(top)}H${n(xr)}A${n(R)} ${n(R)} 0 0 0 ${n(xr)} ${n(bot)}H${n(x0)}Z`;
}
// Five-point star; the points are rounded, so they are drawn out by what the rounding takes back.
export function star(g, { cy = 12.25, R = 9.4, k = 0.5, tip = 1.1 } = {}) {
  const Rc = R - g.h + tip * (1 / Math.sin(Math.PI / 10) - 1), pts = [];
  for (let i = 0; i < 10; i++) {
    const a = ((-90 + i * 36) * Math.PI) / 180, rr = i % 2 ? Rc * k : Rc;
    pts.push([12 + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  return g.polygon(pts, pts.map((_, i) => (i % 2 ? 0.9 : tip)));
}
// Gear: eight teeth, as one rounded polygon.
export function gear(g, { R = 10, root = 7.6, top = 1.75, base = 3.0 } = {}) {
  const ro = R - g.h, ri = root - g.h, pts = [], rad = [];
  for (let i = 0; i < 8; i++) {
    const c = ((i * 45 - 90) * Math.PI) / 180, ab = base / ri;
    const u = [Math.cos(c), Math.sin(c)], v = [-u[1], u[0]];
    // tooth tops are flat at the outer radius, so the four upright teeth sit on whole pixels
    pts.push([12 + ri * Math.cos(c - ab), 12 + ri * Math.sin(c - ab)]); rad.push(0.75);
    for (const k of [-1, 1]) { pts.push([12 + ro * u[0] + k * top * v[0], 12 + ro * u[1] + k * top * v[1]]); rad.push(1.1); }
    pts.push([12 + ri * Math.cos(c + ab), 12 + ri * Math.sin(c + ab)]); rad.push(0.75);
  }
  return g.polygon(pts, rad);
}
// Speaker: a box and its cone, x 2..10.
export const speaker = (g) => { const { h } = g; return g.polygon([[2 + h, 8], [5.2, 8], [10 - h, 4 + h], [10 - h, 20 - h], [5.2, 16], [2 + h, 16]], [1.8, 0.6, 1.2, 1.2, 0.6, 1.8]); };
