// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Ends of knock-outs in the fill variant (GUIDE.md §4.1). A line knocked out of a filled shape
// either stays inside it with a rim of at least one stroke between its round end and the outside
// (fill: 'in'), or runs out through the edge so the shape is cut cleanly in two (fill: 'out').
// Ending in between leaves a hairline or a crescent of ink. fitEnds() moves each end of such a
// line that comes near its host's edge, along the line, until it is in or out; the end keeps its
// round cap. Ends on a straight segment or a circular arc can move; other ends are left as they
// are (draw those with their own fill geometry).

const n = (v) => +(+v).toFixed(3);

/** Parses a path into absolute commands { c, a: [args] } (M L H V C Q A Z; relative ones made absolute). */
export function parse(d) {
  const t = d.match(/[MLHVCQAZmlhvcqaz]|-?\d*\.?\d+(?:e-?\d+)?/g), out = [];
  let i = 0, x = 0, y = 0, x0 = 0, y0 = 0, c = '';
  const num = () => +t[i++];
  const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, Q: 4, A: 7, Z: 0 };
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) c = t[i++];
    const C = c.toUpperCase(), rel = c !== C, a = [];
    for (let k = 0; k < ARGS[C]; k++) a.push(num());
    if (rel) {
      if (C === 'H') a[0] += x; else if (C === 'V') a[0] += y;
      else if (C === 'A') { a[5] += x; a[6] += y; }
      else for (let k = 0; k < a.length; k += 2) { a[k] += x; a[k + 1] += y; }
    }
    if (C === 'H') { out.push({ c: 'L', a: [a[0], y] }); x = a[0]; }
    else if (C === 'V') { out.push({ c: 'L', a: [x, a[0]] }); y = a[0]; }
    else if (C === 'Z') { out.push({ c: 'Z', a: [] }); x = x0; y = y0; }
    else { out.push({ c: C, a }); x = a[a.length - 2]; y = a[a.length - 1]; if (C === 'M') { x0 = x; y0 = y; c = rel ? 'l' : 'L'; } }
    if (C === 'Z' && i < t.length && !/[A-Za-z]/.test(t[i])) c = 'L';
  }
  return out;
}
const write = (cmds) => cmds.map(({ c, a }) => c + a.map(n).join(' ')).join('');

/** Centre form of a circular arc from (x1, y1): { cx, cy, r, t1, dt } (angles in radians). */
function arcCentre(x1, y1, [rx, ry, , large, sweep, x2, y2]) {
  if (Math.abs(rx - ry) > 1e-6) return null;
  const mx = (x1 - x2) / 2, my = (y1 - y2) / 2, d2 = mx * mx + my * my;
  let r = rx; if (d2 > r * r) r = Math.sqrt(d2);
  const f = Math.sqrt(Math.max(0, r * r / d2 - 1)) * (large === sweep ? -1 : 1);
  const cx = (x1 + x2) / 2 + f * my, cy = (y1 + y2) / 2 - f * mx;
  const t1 = Math.atan2(y1 - cy, x1 - cx); let dt = Math.atan2(y2 - cy, x2 - cx) - t1;
  if (sweep && dt < 0) dt += 2 * Math.PI; if (!sweep && dt > 0) dt -= 2 * Math.PI;
  return { cx, cy, r, t1, dt };
}

/** The path as a polyline (for the host's edge). */
export function flatten(d) {
  const pts = [], polys = []; let x = 0, y = 0, x0 = 0, y0 = 0;
  const push = () => { if (pts.length > 1) polys.push(pts.splice(0)); else pts.length = 0; };
  for (const { c, a } of parse(d)) {
    if (c === 'M') { push(); x = x0 = a[0]; y = y0 = a[1]; pts.push([x, y]); continue; }
    if (c === 'L') { x = a[0]; y = a[1]; pts.push([x, y]); continue; }
    if (c === 'Z') { pts.push([x0, y0]); x = x0; y = y0; continue; }
    const N = 24;
    if (c === 'C') { for (let k = 1; k <= N; k++) { const t = k / N, u = 1 - t; pts.push([u * u * u * x + 3 * u * u * t * a[0] + 3 * u * t * t * a[2] + t * t * t * a[4], u * u * u * y + 3 * u * u * t * a[1] + 3 * u * t * t * a[3] + t * t * t * a[5]]); } }
    else if (c === 'Q') { for (let k = 1; k <= N; k++) { const t = k / N, u = 1 - t; pts.push([u * u * x + 2 * u * t * a[0] + t * t * a[2], u * u * y + 2 * u * t * a[1] + t * t * a[3]]); } }
    else if (c === 'A') { const e = arcCentre(x, y, a); if (!e) pts.push([a[5], a[6]]); else for (let k = 1; k <= N; k++) { const t = e.t1 + e.dt * k / N; pts.push([e.cx + e.r * Math.cos(t), e.cy + e.r * Math.sin(t)]); } }
    x = a[a.length - 2]; y = a[a.length - 1];
  }
  push();
  return polys;
}
export function distance([px, py], polys) {
  let best = Infinity;
  for (const P of polys) for (let k = 1; k < P.length; k++) {
    const [ax, ay] = P[k - 1], [bx, by] = P[k], dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L));
    best = Math.min(best, Math.hypot(px - ax - t * dx, py - ay - t * dy));
  }
  return best;
}
export function inside([px, py], polys) {
  let w = false;
  for (const P of polys) for (let k = 1; k < P.length; k++) {
    const [ax, ay] = P[k - 1], [bx, by] = P[k];
    if ((ay > py) !== (by > py) && px < ax + ((py - ay) * (bx - ax)) / (by - ay)) w = !w;
  }
  return w;
}

/**
 * The line's path with its ends fitted to the host: mode 'in' leaves a rim of one stroke s
 * between each end's round cap and the host's outer edge; 'out' carries each end past the outer
 * edge by its cap, so the cut leaves no crescent. The host is a shell drawn with stroke s (its
 * outer edge s / 2 outside its path) or a solid (its edge is its path). Only ends within reach of
 * the edge move.
 */
export function fitEnds(d, host, s, mode) {
  const H = flatten(host.d), edge = host.k === 'solid' ? 0 : s / 2;
  // signed distance from a point to the host's outer edge, positive inside
  const depth = (p) => (inside(p, H) ? distance(p, H) + edge : edge - distance(p, H));
  // inside: the cap (s / 2) plus a rim (s) must fit; outside: the cap passes the edge
  const ok = (p) => (mode === 'in' ? depth(p) >= 1.5 * s - 1e-3 : depth(p) <= -s / 2 + 1e-3);
  const cmds = parse(d);
  if (!cmds.length || cmds[0].c !== 'M' || cmds.some((m) => m.c === 'Z')) return d;
  // an end that is already well inside (two strokes from the edge) stays
  const near = (p) => depth(p) < 2 * s;
  const STEP = 0.05, MAX = 4 * s;
  const moveStart = () => {
    const first = cmds[1]; if (!first) return;
    const p0 = cmds[0].a;
    if (!near(p0) || ok(p0)) return;
    if (first.c === 'L') {
      const [ex, ey] = first.a, L = Math.hypot(ex - p0[0], ey - p0[1]), ux = (ex - p0[0]) / L, uy = (ey - p0[1]) / L;
      // 'in' moves along the line toward its other end; 'out' moves back past the start
      const dir = mode === 'in' ? 1 : -1;
      for (let t = STEP; t <= MAX; t += STEP) { const q = [p0[0] + dir * ux * t, p0[1] + dir * uy * t]; if (mode === 'in' && t > L - 0.5) return; if (ok(q)) { cmds[0].a = q; return; } }
    } else if (first.c === 'A') {
      const e = arcCentre(p0[0], p0[1], first.a); if (!e) return;
      const sgn = Math.sign(e.dt), dir = mode === 'in' ? 1 : -1;
      for (let t = STEP; t <= MAX; t += STEP) {
        const th = e.t1 + sgn * dir * (t / e.r); if (mode === 'in' && t > Math.abs(e.dt) * e.r - 0.5) return;
        const q = [e.cx + e.r * Math.cos(th), e.cy + e.r * Math.sin(th)];
        if (ok(q)) { cmds[0].a = q; const nd = e.dt - sgn * dir * (t / e.r); first.a[3] = Math.abs(nd) > Math.PI ? 1 : 0; return; }
      }
    }
  };
  const moveEnd = () => {
    const last = cmds[cmds.length - 1], prev = cmds[cmds.length - 2]; if (!prev) return;
    const from = prev.a.slice(-2), p1 = last.a.slice(-2);
    if (!near(p1) || ok(p1)) return;
    if (last.c === 'L') {
      const L = Math.hypot(p1[0] - from[0], p1[1] - from[1]), ux = (p1[0] - from[0]) / L, uy = (p1[1] - from[1]) / L, dir = mode === 'in' ? -1 : 1;
      for (let t = STEP; t <= MAX; t += STEP) { const q = [p1[0] + dir * ux * t, p1[1] + dir * uy * t]; if (mode === 'in' && t > L - 0.5) return; if (ok(q)) { last.a = q; return; } }
    } else if (last.c === 'A') {
      const e = arcCentre(from[0], from[1], last.a); if (!e) return;
      const sgn = Math.sign(e.dt), dir = mode === 'in' ? -1 : 1, t2 = e.t1 + e.dt;
      for (let t = STEP; t <= MAX; t += STEP) {
        const th = t2 + sgn * dir * (t / e.r); if (mode === 'in' && t > Math.abs(e.dt) * e.r - 0.5) return;
        const q = [e.cx + e.r * Math.cos(th), e.cy + e.r * Math.sin(th)];
        if (ok(q)) { last.a[5] = q[0]; last.a[6] = q[1]; const nd = e.dt + sgn * dir * (t / e.r); last.a[3] = Math.abs(nd) > Math.PI ? 1 : 0; return; }
      }
    }
  };
  moveStart(); moveEnd();
  return write(cmds);
}
