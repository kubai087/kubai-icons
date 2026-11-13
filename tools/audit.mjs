#!/usr/bin/env node
// Measures every base icon against the rules in PROMPT.md that can be measured, and scores it.
// What it cannot judge (does the object read as itself, is the motion what the object does)
// stays with the visual checklist in docs/review.md.
//
//   node tools/audit.mjs [--only a,b] [--category files] [--out check-out/audit] [--min 90]
//
// Writes report.json (every measure and finding per icon) and report.md (icons sorted from
// the lowest score), and prints a summary. --min lists only icons scoring below it.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadIcons, root } from './registry.mjs';
import { renderSVG, renderInner } from '../packages/core/src/render.js';
import { EASE } from '../packages/core/src/motion.js';
import { findChrome } from './chrome.mjs';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const only = (opt('--only') || '').split(',').map((s) => s.trim()).filter(Boolean);
const category = opt('--category');
const out = path.resolve(opt('--out') || path.join(root, 'check-out', 'audit'));
const min = Number(opt('--min') || 100);

// ---------- The rubric ----------
// Each finding has a weight; an icon starts at 100 and loses the weight of every finding.
export const RULES = {
  error:        { w: 40, area: 'motion', text: 'draw() throws or writes NaN/undefined' },
  still:        { w: 25, area: 'motion', text: 'nothing moves on hover' },
  faint:        { w: 8,  area: 'motion', text: 'the hover barely changes the icon' },
  jump:         { w: 15, area: 'motion', text: 'a frame jumps: one step changes far more than the steps around it' },
  abrupt:       { w: 8,  area: 'motion', text: 'still moving fast when the hover ends, so it stops abruptly' },
  leaves:       { w: 10, area: 'motion', text: 'a frame reaches more than 2 units outside the 31×31 canvas' },
  endSize:      { w: 6,  area: 'motion', text: 'the hover end is much larger or smaller than the rest pose' },
  small:        { w: 12, area: 'shape',  text: 'the rest pose is smaller than its keyline' },
  large:        { w: 10, area: 'shape',  text: 'the rest pose is larger than the 23×23 keyline (plus outline)' },
  offCentre:    { w: 8,  area: 'shape',  text: 'the rest pose is off the centre (15.5, 12.5)' },
  light:        { w: 6,  area: 'shape',  text: 'covers much less area than the set at 24px (reads light)' },
  heavy:        { w: 6,  area: 'shape',  text: 'covers much more area than the set at 24px (reads heavy)' },
  oneLayer:     { w: 10, area: 'shape',  text: 'only one layer: no front piece and no large white content' },
  strokeWidth:  { w: 5,  area: 'shape',  text: 'a mark uses a line width outside 1.6 / 2.2 / 2.6 / 2.0 / 1.2' },
  tiny:         { w: 6,  area: 'shape',  text: 'a mark or detail is smaller than 2.4 units' },
  edgeGap:      { w: 6,  area: 'shape',  text: 'a mark or white content leaves a sliver (under ~1.4 units) to the edge of its shape' },
  markGap:      { w: 3,  area: 'shape',  text: 'two marks leave a sliver (under ~1.4 units) between them' },
  text:         { w: 3,  area: 'shape',  text: 'uses <text>; allowed only when the glyph is the semantic core' },
  peek:         { w: 12, area: 'shape',  text: 'the outline of a covered part shows past the edge of the part in front' },
  bare:         { w: 20, area: 'shape',  text: 'a filled part meets the background with no outline along that edge' },
  joint:        { w: 12, area: 'shape',  text: 'a sharp corner of an outlined part sits just off another part\'s edge, so the outlines meet in a notch or spike' }
};

const { bases, failures } = await loadIcons({ composites: false, strict: false });
let set = bases;
if (only.length) set = set.filter((b) => only.some((p) => (p.endsWith('*') ? b.name.startsWith(p.slice(0, -1)) : b.name === p)));
if (category) set = set.filter((b) => b.category === category);
if (!set.length) { console.error('Nothing to audit.'); process.exit(1); }

// Time samples of the hover: the runtime eases real time, so equal steps here are equal time.
const T = 24;
const times = Array.from({ length: T + 1 }, (_, i) => i / T);

const VB = '0 -3 31 31';
// Every start tag gets its transform written as one matrix (identity when it has none), so
// an icon that drops its transform when a swing reaches exactly 0 reads as continuous.
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
function matrix(tr) {
  let m = [1, 0, 0, 1, 0, 0];
  for (const [, name, body] of (tr || '').matchAll(/(\w+)\(([^)]*)\)/g)) {
    const n = body.trim().split(/[\s,]+/).map(Number);
    if (name === 'translate') m = mul(m, [1, 0, 0, 1, n[0], n[1] || 0]);
    else if (name === 'scale') m = mul(m, [n[0], 0, 0, n[1] ?? n[0], 0, 0]);
    else if (name === 'matrix') m = mul(m, n);
    else if (name === 'skewX') m = mul(m, [1, 0, Math.tan(n[0] * Math.PI / 180), 1, 0, 0]);
    else if (name === 'skewY') m = mul(m, [1, Math.tan(n[0] * Math.PI / 180), 0, 1, 0, 0]);
    else if (name === 'rotate') {
      const r = n[0] * Math.PI / 180, c = Math.cos(r), si = Math.sin(r), x = n[1] || 0, y = n[2] || 0;
      m = mul(m, [c, si, -si, c, x - c * x + si * y, y - si * x - c * y]);
    }
  }
  return m.map((v) => +v.toFixed(4));
}
const canonical = (svg) => svg.replace(/<([a-zA-Z]+)((?:\s+[:\w-]+="[^"]*")*)\s*(\/?)>/g, (all, tag, attrs, end) => {
  const tr = /\stransform="([^"]*)"/.exec(attrs);
  return `<${tag}${attrs.replace(/\stransform="[^"]*"/, '')} m="${matrix(tr && tr[1]).join(' ')}"${end}>`;
});
function prepare(icon) {
  const item = { name: icon.name, cat: icon.category, errors: [], frames: [], geo: [], steps: [] };
  const bad = (s) => /NaN|undefined|Infinity/.test(s);
  const NUM = /-?\d*\.?\d+(?:e-?\d+)?/g;
  const marks = [];
  for (const t of times) {
    try {
      const svg = renderSVG(icon, { size: 94, pad: 8, progress: EASE(t), k: 'a' });
      if (bad(svg)) item.errors.push(`NaN/undefined at t=${t.toFixed(2)}`);
      item.frames.push('data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'));
      const body = canonical(svg);
      marks.push({ shape: body.replace(NUM, '#'), nums: (body.match(NUM) || []).map(Number) });
    } catch (e) { item.errors.push(`t=${t.toFixed(2)}: ${e.message}`); item.frames.push(null); marks.push(null); }
  }
  // Where the markup changes discontinuously between two samples: its structure changes
  // (an element is swapped or an attribute appears), or one number takes a step far larger
  // than the steps around it.
  // The largest change of any number in each step: how fast the markup itself moves.
  item.speed = marks.slice(1).map((b, k) => {
    const a = marks[k];
    if (!a || !b || a.shape !== b.shape) return null;
    return Math.round(Math.max(0, ...a.nums.map((n, i) => Math.abs(b.nums[i] - n))) * 1000) / 1000;
  });
  for (let k = 0; k + 1 < marks.length; k++) {
    const a = marks[k], b = marks[k + 1];
    if (!a || !b) continue;
    if (a.shape !== b.shape) { item.steps.push(k); continue; }
    const step = (j, i) => (marks[j] && marks[j + 1] && marks[j].shape === marks[j + 1].shape ? Math.abs(marks[j + 1].nums[i] - marks[j].nums[i]) : 0);
    for (let i = 0; i < a.nums.length; i++) {
      const s = Math.abs(b.nums[i] - a.nums[i]);
      if (s > 0.5 && s > 4 * Math.max(step(k - 1, i), step(k + 1, i), 0.05)) { item.steps.push(k); break; }
    }
  }
  for (const hover of [false, true]) {
    try {
      const inner = renderInner(icon, { k: `g${hover ? 1 : 0}`, hover, paint: 'template', names: false });
      item.geo.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" width="310" height="310">${inner}</svg>`);
    } catch (e) { item.errors.push(`${hover ? 'hover' : 'rest'}: ${e.message}`); item.geo.push(null); }
  }
  return item;
}

// Runs in the page: raster measures of the motion, and geometry of the rest and end poses.
function pageScript() {
  const W = 94, U = 94 / 47, OX = -8, OY = -11;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = W;
  const g = cv.getContext('2d', { willReadFrequently: true });
  const small = document.createElement('canvas'); small.width = 24; small.height = 24;
  const gs = small.getContext('2d', { willReadFrequently: true });
  const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  const bbox = (a, thr = 160) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) if (a[(y * W + x) * 4 + 3] > thr) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return x1 < 0 ? null : [x0 / U + OX, y0 / U + OY, (x1 + 1) / U + OX, (y1 + 1) / U + OY].map((v) => Math.round(v * 10) / 10);
  };
  // Pixels (of the 94×94 frame) that visibly change: any channel moves by more than 48.
  // Anti-aliasing and filter noise move many pixels a little; real motion moves some a lot.
  const diff = (a, b) => { let s = 0; for (let i = 0; i < a.length; i += 4) if (Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]), Math.abs(a[i + 3] - b[i + 3])) > 48) s++; return s; };

  // ----- geometry -----
  const role = (el) => {
    if (el.closest('defs,mask,clipPath')) return null;
    const fill = el.getAttribute('fill') || '', stroke = el.getAttribute('stroke') || '';
    if ((el.getAttribute('mask') || '').startsWith('url(#ol-')) return 'outline';
    if (stroke.startsWith('url(') && fill === 'none') return null; // seam underlap
    if (/^url\(#(lo|loS|pure)-/.test(fill)) return 'back';
    if (/^url\(#(up|upS)-/.test(fill)) return 'front';
    if (/^url\(/.test(fill)) return 'back';
    if (fill.toLowerCase() === '#fff' || fill.toLowerCase() === '#ffffff') return 'content';
    if (/^\{/.test(fill) || (/^\{/.test(stroke) && fill === 'none') || (/^\{/.test(stroke) && !fill)) return 'mark';
    return null;
  };
  const visible = (el) => {
    for (let n = el; n && n.tagName !== 'svg'; n = n.parentNode) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) return false;
      if (n.getAttribute && Number(n.getAttribute('opacity') ?? 1) < 0.05) return false;
    }
    if (el.getAttribute('stroke-dasharray') === '1 1' && Number(el.getAttribute('stroke-dashoffset')) > 0.95) return false;
    return true;
  };
  // Clip paths on the element or its ancestors, as geometry elements to test points against.
  const clipsOf = (el, svg) => {
    const out = [];
    for (let n = el; n && n !== svg; n = n.parentNode) {
      const c = n.getAttribute && n.getAttribute('clip-path');
      const m = c && /url\(#([^)]+)\)/.exec(c);
      if (m) { const cp = svg.getElementById(m[1]); if (cp) out.push([...cp.querySelectorAll('path,rect,circle,ellipse,polygon')]); }
    }
    return out;
  };
  // Matrices relative to the icon's own user space (the viewBox), not to screen pixels.
  let base = new DOMMatrix();
  const ctm = (el) => base.multiply(el.getCTM());
  const toLocal = (el, x, y) => new DOMPoint(x, y).matrixTransform(ctm(el).inverse());
  const toRoot = (el, x, y) => new DOMPoint(x, y).matrixTransform(ctm(el));
  const inFill = (el, x, y) => el.isPointInFill(toLocal(el, x, y));
  const inClips = (clips, x, y) => clips.every((list) => list.some((c) => inFill(c, x, y)));
  // Boundary samples of a shape in canvas units, pushed out by half its stroke when stroked.
  function samples(el, n = 72) {
    const len = el.getTotalLength();
    if (!(len > 0)) return [];
    const pts = [];
    for (let i = 0; i < n; i++) { const p = el.getPointAtLength(len * i / n); const r = toRoot(el, p.x, p.y); pts.push([r.x, r.y]); }
    return pts;
  }
  const scaleOf = (el) => { const m = ctm(el); return Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)); };
  const DIRS = Array.from({ length: 16 }, (_, i) => [Math.cos(i * Math.PI / 8), Math.sin(i * Math.PI / 8)]);
  const RADII = [0.1, 0.2, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2, 1.35, 1.5, 1.7, 1.9, 2.1];

  function geometry(svgText) {
    const host = document.createElement('div');
    host.innerHTML = svgText;
    document.body.appendChild(host);
    const svg = host.firstElementChild;
    base = svg.getCTM().inverse();
    const els = [...svg.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon')];
    const shapes = [], outlines = [];
    for (const [order, el] of els.entries()) {
      const r = role(el);
      if (r === 'outline' && visible(el)) outlines.push({ el, order, clips: clipsOf(el, svg) });
      if (!r || r === 'outline' || !visible(el)) continue;
      const bb = el.getBBox();
      const corners = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]].map(([x, y]) => toRoot(el, x, y));
      const box = [Math.min(...corners.map((p) => p.x)), Math.min(...corners.map((p) => p.y)), Math.max(...corners.map((p) => p.x)), Math.max(...corners.map((p) => p.y))];
      const fill = el.getAttribute('fill') || '';
      const stroked = (fill === 'none' || !fill) && el.getAttribute('stroke');
      const sw = stroked ? Number(el.getAttribute('stroke-width') || 1) * scaleOf(el) : 0;
      if (sw) { box[0] -= sw / 2; box[1] -= sw / 2; box[2] += sw / 2; box[3] += sw / 2; }
      shapes.push({ el, role: r, box, stroked: Boolean(stroked), sw, clips: clipsOf(el, svg), i: shapes.length, order });
    }
    const res = { layers: {}, widths: [], tiny: [], edge: [], pair: [], peek: [], joint: [], bare: [], text: svg.querySelectorAll('text').length };
    for (const s of shapes) res.layers[s.role] = (res.layers[s.role] || 0) + 1;
    const area = (b) => (b[2] - b[0]) * (b[3] - b[1]);
    res.contentArea = Math.round(shapes.filter((s) => s.role === 'content').reduce((a, s) => a + area(s.box), 0) * 10) / 10;
    res.frontArea = Math.round(shapes.filter((s) => s.role === 'front').reduce((a, s) => a + area(s.box), 0) * 10) / 10;
    const label = (s) => `${s.role}#${s.i}[${s.box.map((v) => v.toFixed(1)).join(',')}]`;

    // A point sits on a shape when it is inside the fill (or the stroke band of a stroked mark).
    const on = (s, x, y) => {
      // A point exactly on the line through a path's own vertices can test as outside, so
      // every test point is nudged off the grid by a hair.
      x += 0.0013; y += 0.0007;
      if (!inClips(s.clips, x, y)) return false;
      if (s.stroked) { const p = toLocal(s.el, x, y); return s.el.isPointInStroke(p); }
      return inFill(s.el, x, y);
    };

    // Line widths of stroked marks, and sizes of each piece of a mark.
    for (const s of shapes) {
      if (s.role !== 'mark') continue;
      // A wide stroke in the outline colour under a narrower fill stroke draws an outlined
      // tube (a shackle, a strand): a body, not a line. A stroke that stands on its own,
      // not over a body, is the object itself (Wi-Fi arcs, fog) and may be up to 2.8 wide.
      if (s.stroked && s.sw < 3) {
        const mid = s.el.getTotalLength() > 0 ? s.el.getPointAtLength(s.el.getTotalLength() / 2) : null;
        const c = mid && toRoot(s.el, mid.x, mid.y);
        const over = c && shapes.some((o) => o.i < s.i && o.role !== 'mark' && on(o, c.x, c.y));
        if (over || s.sw > 2.85) res.widths.push(Math.round(s.sw * 100) / 100);
      }
      const d = s.el.tagName === 'path' ? s.el.getAttribute('d') || '' : null;
      const parts = d ? d.split(/(?=M)/).filter((p) => p.trim()) : [null];
      for (const part of parts) {
        let box = s.box;
        if (part && parts.length > 1) {
          const tmp = s.el.cloneNode(); tmp.setAttribute('d', part); s.el.parentNode.appendChild(tmp);
          const bb = tmp.getBBox(); const a = toRoot(tmp, bb.x, bb.y), b = toRoot(tmp, bb.x + bb.width, bb.y + bb.height);
          box = [Math.min(a.x, b.x) - s.sw / 2, Math.min(a.y, b.y) - s.sw / 2, Math.max(a.x, b.x) + s.sw / 2, Math.max(a.y, b.y) + s.sw / 2];
          tmp.remove();
        }
        const w = box[2] - box[0], h = box[3] - box[1];
        if (Math.max(w, h) < 2.35 && Math.max(w, h) > 0.05) res.tiny.push(`${label(s)} ${w.toFixed(2)}×${h.toFixed(2)}`);
      }
    }
    // Distance from the boundary of `a` to the outside of container `c` (edge) or to shape `b` (pair).
    const visibleSamples = (s) => {
      let pts = samples(s.el);
      if (s.stroked) {
        // Offset the centreline both ways by half the width.
        const out = [];
        for (let i = 0; i < pts.length; i++) {
          const [x0, y0] = pts[(i + pts.length - 1) % pts.length], [x1, y1] = pts[(i + 1) % pts.length];
          const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, nx = -dy / l * s.sw / 2, ny = dx / l * s.sw / 2;
          out.push([pts[i][0] + nx, pts[i][1] + ny], [pts[i][0] - nx, pts[i][1] - ny]);
        }
        // Round and square caps reach past the ends of an open line.
        const cap = s.el.getAttribute('stroke-linecap');
        const len = s.el.getTotalLength();
        const a = len > 0 && s.el.getPointAtLength(0), b = len > 0 && s.el.getPointAtLength(len);
        if (a && (cap === 'round' || cap === 'square') && Math.hypot(a.x - b.x, a.y - b.y) > 0.01) {
          for (const end of [a, b]) {
            const c0 = toRoot(s.el, end.x, end.y);
            for (let k = 0; k < 16; k++) out.push([c0.x + Math.cos(k * Math.PI / 8) * s.sw / 2, c0.y + Math.sin(k * Math.PI / 8) * s.sw / 2]);
          }
        }
        pts = out;
      }
      s.raw = pts;
      return pts.filter(([x, y]) => inClips(s.clips, x, y));
    };
    // Only the parts of a shape that nothing painted later covers count.
    const solid = shapes.filter((o) => o.role !== 'mark');
    for (const s of shapes) s.pts = visibleSamples(s).filter(([x, y]) => !solid.some((o) => o.i > s.i && on(o, x, y)));
    const containers = shapes.filter((s) => s.role === 'back' || s.role === 'front' || s.role === 'content');
    for (const s of shapes) {
      if (s.role !== 'mark' && s.role !== 'content') continue;
      if (!s.pts.length) continue;
      const cx = (s.box[0] + s.box[2]) / 2, cy = (s.box[1] + s.box[3]) / 2;
      // The container: the topmost larger body painted before it that holds its centre.
      const c = containers.filter((o) => o.i < s.i && o !== s && area(o.box) > area(s.box) * 1.3 && (s.role === 'mark' || o.role !== 'content') && on(o, cx, cy)).pop();
      if (!c) continue;
      // Points of s outside c: it overlaps the edge, which counts as touching. A mark clipped
      // at the edge counts too, so the test uses the shape before its clip.
      const outside = s.raw.filter(([x, y]) => !on(c, x, y)).length;
      if (outside > 0) continue;
      let best = 9, at = null;
      for (const [x, y] of s.pts) {
        for (const r of RADII) {
          if (r >= best) break;
          // Past the container's edge, unless a later shape covers that spot (then the
          // mark meets that shape instead, which it overlaps).
          if (DIRS.some(([dx, dy]) => { const px = x + dx * r, py = y + dy * r; return !on(c, px, py) && !solid.some((o) => o.i > s.i && on(o, px, py)); })) { best = r; at = [x, y]; break; }
        }
      }
      if (best > 0.1 && best <= 1.35) res.edge.push(`${label(s)} in ${label(c)} gap≈${best} near ${at.map((v) => v.toFixed(1)).join(',')}`);
    }
    const marks = shapes.filter((s) => s.role === 'mark' && s.pts.length);
    for (let i = 0; i < marks.length; i++) for (let j = i + 1; j < marks.length; j++) {
      const a = marks[i], b = marks[j];
      const bx = [Math.max(a.box[0], b.box[0]) - 2.2, Math.max(a.box[1], b.box[1]) - 2.2, Math.min(a.box[2], b.box[2]) + 2.2, Math.min(a.box[3], b.box[3]) + 2.2];
      if (bx[0] > bx[2] || bx[1] > bx[3]) continue;
      if (a.pts.some(([x, y]) => on(b, x, y)) || b.pts.some(([x, y]) => on(a, x, y))) continue; // they touch
      let best = 9;
      for (const [x, y] of a.pts) for (const r of RADII) { if (r >= best) break; if (DIRS.some(([dx, dy]) => on(b, x + dx * r, y + dy * r))) { best = r; break; } }
      if (best > 0.1 && best <= 1.35) res.pair.push(`${label(a)} ~ ${label(b)} gap≈${best}`);
    }
    // A covered part's outline must not show past the edge of the part in front of it. Walk
    // the middle of each outline band: a short visible stretch with covered stretches on
    // both sides is a bit of outline sticking out from behind something.
    const coveredAfter = (order, x, y) =>
      shapes.some((o) => o.order > order && o.role !== 'mark' && on(o, x, y))
      || outlines.some((o) => o.order > order && inClips(o.clips, x, y) && o.el.isPointInStroke(toLocal(o.el, x, y)));
    for (const o of outlines) {
      const len = o.el.getTotalLength();
      if (!(len > 0)) continue;
      const n = Math.min(600, Math.max(80, Math.round(len * 6))), step = len / n;
      const pts = [];
      for (let k = 0; k < n; k++) { const q = o.el.getPointAtLength(step * k); const r = toRoot(o.el, q.x, q.y); pts.push([r.x, r.y]); }
      const vis = pts.map(([x, y], k) => {
        const [ax, ay] = pts[(k + n - 1) % n], [bx, by] = pts[(k + 1) % n];
        const l = Math.hypot(bx - ax, by - ay);
        if (!(l > 1e-6) || l > step * 4) return null; // a jump between subpaths
        // The painted outline is the stroke outside the shape's own fill, mitred tips
        // included; test a fan of points across that band, since only its outer part, or
        // only a corner's tip, may stick out.
        return [0.5, 0.95].some((d) => DIRS.some(([dx, dy]) => {
          const px = x + dx * d, py = y + dy * d;
          if (inFill(o.el, px, py) || !o.el.isPointInStroke(toLocal(o.el, px, py))) return false;
          return inClips(o.clips, px, py) && !coveredAfter(o.order, px, py);
        }));
      });
      if (!vis.some((v) => v === false) || !vis.some((v) => v === true)) continue;
      const start = vis.findIndex((v) => v === false);
      let run = 0, from = -1;
      for (let j = 1; j <= n; j++) {
        const k = (start + j) % n, v = vis[k];
        if (v === true) { if (!run) from = k; run++; continue; }
        if (v === null) { run = 0; continue; }
        if (run && run * step < 2 && run * step > 0.15) {
          const mid = pts[(from + Math.floor(run / 2)) % n];
          res.peek.push(`${(run * step).toFixed(1)} long near ${mid.map((v) => v.toFixed(1)).join(',')}`);
        }
        run = 0;
      }
    }
    // Every edge of a coloured part that meets the background needs an outline. Step just
    // outside the part's boundary: if nothing is painted there, the edge must lie on an outline.
    const painted = (x, y) => shapes.some((q) => on(q, x, y)) || outlines.some((q) => inClips(q.clips, x, y) && q.el.isPointInStroke(toLocal(q.el, x, y)) && !inFill(q.el, x, y));
    for (const s of shapes) {
      // A solid deep fill (a tyre, a pipe) reads on its own and takes no outline.
      if ((s.role !== 'back' && s.role !== 'front') || /^url\(#pure-/.test(s.el.getAttribute('fill') || '')) continue;
      const len = s.el.getTotalLength();
      if (!(len > 0)) continue;
      const n = Math.min(400, Math.max(60, Math.round(len * 3))), step = len / n;
      let run = 0, worst = 0, at = null;
      for (let k = 0; k <= n; k++) {
        const q = s.el.getPointAtLength(step * (k % n)), q2 = s.el.getPointAtLength(step * ((k + 1) % n));
        const a = toRoot(s.el, q.x, q.y), b = toRoot(s.el, q2.x, q2.y);
        const l = Math.hypot(b.x - a.x, b.y - a.y);
        let bare = false;
        if (l > 1e-6 && l < step * 4) {
          const ux = -(b.y - a.y) / l * 0.5, uy = (b.x - a.x) / l * 0.5;
          const [px, py] = on(s, a.x + ux, a.y + uy) ? [a.x - ux, a.y - uy] : [a.x + ux, a.y + uy];
          bare = inClips(s.clips, a.x, a.y) && !painted(px, py) && !solid.some((o) => o.i > s.i && on(o, a.x, a.y));
        }
        if (bare) { run++; if (run > worst) { worst = run; at = [a.x, a.y]; } } else run = 0;
      }
      if (worst * step > 1) res.bare.push(`${(worst * step).toFixed(1)} long near ${at.map((v) => v.toFixed(1)).join(',')}`);
    }

    // Sharp corners of outlined parts must either sit on another part's edge (a hinge, where
    // the outlines run on as one) or keep clear of it. A corner just off an edge makes the two
    // outlines meet in a small step, and the corner's mitred tip sticks out as a spike.
    const fills = outlines.map((o) => o.el);
    for (const o of outlines) {
      const len = o.el.getTotalLength();
      if (!(len > 0)) continue;
      const n = Math.min(800, Math.max(100, Math.round(len * 8))), step = len / n;
      const pts = [];
      for (let k = 0; k < n; k++) { const q = o.el.getPointAtLength(step * k); const r = toRoot(o.el, q.x, q.y); pts.push([r.x, r.y]); }
      const dir = (k) => { const a = pts[(k + n - 1) % n], b = pts[(k + 1) % n]; return Math.atan2(b[1] - a[1], b[0] - a[0]); };
      const turn = (k) => { let d = Math.abs(dir((k + 2) % n) - dir((k + n - 2) % n)); if (d > Math.PI) d = 2 * Math.PI - d; return d; };
      for (let k = 0; k < n; k++) {
        const t = turn(k);
        if (t < 0.7 || t < turn((k + 1) % n) || t < turn((k + n - 1) % n)) continue;
        const [cx, cy] = pts[k];
        // Ignore a jump between subpaths, and corners hidden behind later parts.
        if (Math.hypot(pts[(k + 1) % n][0] - cx, pts[(k + 1) % n][1] - cy) > step * 4) continue;
        if (coveredAfter(o.order, cx, cy)) continue;
        // Only convex corners have a tip that points out; a corner of a hole points in.
        if (DIRS.filter(([dx, dy]) => inFill(o.el, cx + dx * 0.3, cy + dy * 0.3)).length > 7) continue;
        // The corner's mitred tip: the part of its painted outline 1–1.4 out from the corner.
        // It matters only where nothing else covers it.
        const bare = (x, y) => !outlines.some((q) => q !== o && (inFill(q.el, x, y) || q.el.isPointInStroke(toLocal(q.el, x, y))))
          && !shapes.some((q) => q.role !== 'mark' && q.el !== o.el && q.order !== o.order - 1 && on(q, x, y) && q.order > o.order);
        const tip = [1, 1.3].some((r) => DIRS.some(([dx, dy]) => {
          const x = cx + dx * r, y = cy + dy * r;
          return o.el.isPointInStroke(toLocal(o.el, x, y)) && !inFill(o.el, x, y) && bare(x, y);
        }));
        if (!tip) continue;
        for (const other of outlines) {
          if (other === o) continue;
          const inside = inFill(other.el, cx, cy);
          let d = 9;
          for (const r of [0.05, 0.15, 0.3, 0.45, 0.6, 0.8, 1]) {
            if (DIRS.some(([dx, dy]) => inFill(other.el, cx + dx * r, cy + dy * r) !== inside)) { d = r; break; }
          }
          if (d > 0.05 && d <= 1) { res.joint.push(`corner near ${cx.toFixed(1)},${cy.toFixed(1)} sits ${d} from another part's edge`); break; }
        }
      }
    }
    host.remove();
    return res;
  }

  return async (DATA) => {
    const res = [];
    for (const d of DATA) {
      const r = { name: d.name };
      const px = [];
      for (const src of d.frames) {
        if (!src) { px.push(null); continue; }
        const im = await load(src); g.clearRect(0, 0, W, W); if (im) g.drawImage(im, 0, 0, W, W);
        px.push(g.getImageData(0, 0, W, W).data.slice());
      }
      if (px.every(Boolean)) {
        r.boxes = px.map((p) => bbox(p));
        r.diffs = px.slice(1).map((p, i) => Math.round(diff(px[i], p)));
        r.restEnd = Math.round(diff(px[0], px[px.length - 1]));
        // How far the icon ever gets from its rest pose (a swing returns to it at the end).
        r.reach = Math.max(...px.map((p) => diff(px[0], p)));
        // Ink at 24px: the share of the 24×24 tile that is covered (alpha-weighted).
        const im = await load(d.frames[0]);
        gs.clearRect(0, 0, 24, 24);
        // The 94px frame spans 47 units; the 24px icon spans 31, so crop the middle.
        gs.drawImage(im, 8 * U, 8 * U, 31 * U, 31 * U, 0, 0, 24, 24);
        const a = gs.getImageData(0, 0, 24, 24).data; let s = 0; for (let i = 3; i < a.length; i += 4) s += a[i] / 255;
        r.ink = Math.round(s / 576 * 1000) / 1000;
      }
      r.geo = d.geo.map((t) => { try { return t ? geometry(t) : null; } catch (e) { return { failed: e.message }; } });
      res.push(r);
    }
    return res;
  };
}

function runChunk(items) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'kubai-audit-'));
  try {
    const data = items.map(({ name, frames, geo }) => ({ name, frames, geo }));
    const html = `<!doctype html><meta charset="utf-8"><body><script>
      const run = (${pageScript.toString()})();
      run(${JSON.stringify(data)}).then((r) => { const p = document.createElement('pre'); p.id = 'out'; p.textContent = JSON.stringify(r); document.body.appendChild(p); })
        .catch((e) => { const p = document.createElement('pre'); p.id = 'out'; p.textContent = JSON.stringify({ fatal: String(e && e.stack || e) }); document.body.appendChild(p); });
    </script>`;
    const page = path.join(work, 'p.html');
    fs.writeFileSync(page, html);
    const dom = execFileSync(findChrome(), ['--headless=new', '--disable-gpu', `--user-data-dir=${path.join(work, 'profile')}`,
      '--virtual-time-budget=900000', '--dump-dom', 'file://' + page], { maxBuffer: 1 << 30, timeout: 900000, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(dom);
    if (!m) throw new Error('the audit page returned nothing');
    const r = JSON.parse(m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
    if (r.fatal) throw new Error(r.fatal);
    return r;
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

// ---------- Measure ----------
const measured = [];
const CHUNK = 40;
for (let i = 0; i < set.length; i += CHUNK) {
  const items = set.slice(i, i + CHUNK).map(prepare);
  const r = runChunk(items);
  items.forEach((it, j) => measured.push({ name: it.name, cat: it.cat, errors: it.errors, steps: it.steps, speed: it.speed, ...r[j] }));
  process.stdout.write(`\r${Math.min(i + CHUNK, set.length)}/${set.length}`);
}
process.stdout.write('\n');

// ---------- Score ----------
const inks = measured.map((m) => m.ink).filter((v) => v > 0).sort((a, b) => a - b);
const q = (p) => inks[Math.floor(p * (inks.length - 1))];
const inkLo = q(0.05), inkHi = q(0.95);
const ALLOWED = [1.6, 2.2, 2.6, 2.0, 1.2];
const near = (a, b, t = 0.06) => Math.abs(a - b) <= t;

const report = measured.map((m) => {
  const found = [];
  const add = (id, detail) => found.push({ id, detail });
  if (m.errors.length) add('error', m.errors.slice(0, 3).join('; '));
  if (m.diffs) {
    const total = m.diffs.reduce((a, b) => a + b, 0);
    if (m.speed.every((v) => v === 0)) add('still');
    else if (m.reach < 60) add('faint', `at most ${m.reach} px differ from the rest pose`);
    if (total > 0) {
      const d = m.diffs;
      // The first step is the fastest by design (strong ease-out), so it is not compared.
      for (let i = 1; i < d.length; i++) {
        const around = [d[i - 2], d[i - 1], d[i + 1], d[i + 2]].filter((v) => v !== undefined).sort((a, b) => b - a);
        const ref = Math.max(around[1] ?? 0, 4);
        const real = m.steps.some((k) => Math.abs(k - i) <= 1);
        if (d[i] > 40 && d[i] > ref * 4 && real) { add('jump', `t=${(i / T).toFixed(2)}–${((i + 1) / T).toFixed(2)}: ${d[i]} vs ~${ref}`); break; }
      }
      // Raster noise can differ between the last two frames (a filter drawn under a tiny
      // rotation and then under none), so the markup has to agree that it is still moving.
      const peak = Math.max(...d), last = d[d.length - 1];
      const sp = m.speed.filter((v) => v !== null), spLast = m.speed[m.speed.length - 1] ?? 0;
      const spPeak = Math.max(0, ...sp);
      if (peak > 20 && last > 12 && last > peak * 0.35 && spLast > 0.15 && spLast > spPeak * 0.3) add('abrupt', `last step ${last} px, peak ${peak} px; markup ${spLast} of ${spPeak}`);
    }
    const far = m.boxes.map((b, i) => [b, i]).filter(([b]) => b && (b[0] < -2 || b[1] < -5 || b[2] > 33 || b[3] > 30));
    if (far.length) add('leaves', `t=${(far[0][1] / T).toFixed(2)} box ${far[0][0].join(',')}`);
    const r = m.boxes[0], e = m.boxes[m.boxes.length - 1];
    if (r) {
      const w = r[2] - r[0], h = r[3] - r[1], mx = Math.max(w, h);
      // Outer size including the outline: keylines are 23 (circle), 20.6 (square), 23×18.4.
      // Thin or diagonal objects may run long; what counts is the space they take up.
      if (mx < 21.6 && w * h < 400) add('small', `${w.toFixed(1)}×${h.toFixed(1)}`);
      if (mx > 28.5 || (mx > 27.2 && w * h > 560) || Math.min(w, h) > 26) add('large', `${w.toFixed(1)}×${h.toFixed(1)}`);
      const cx = (r[0] + r[2]) / 2, cy = (r[1] + r[3]) / 2;
      if (Math.abs(cx - 15.5) > 1.3 || Math.abs(cy - 12.5) > 1.6) add('offCentre', `centre ${cx.toFixed(1)},${cy.toFixed(1)}`);
      if (e) {
        const ar = w * h, ae = (e[2] - e[0]) * (e[3] - e[1]);
        if (ae > ar * 1.6 || ae < ar * 0.6) add('endSize', `rest ${w.toFixed(1)}×${h.toFixed(1)}, end ${(e[2] - e[0]).toFixed(1)}×${(e[3] - e[1]).toFixed(1)}`);
      }
    }
    if (m.ink < inkLo) add('light', `ink ${m.ink} (set 5%: ${inkLo})`);
    if (m.ink > inkHi) add('heavy', `ink ${m.ink} (set 95%: ${inkHi})`);
  }
  const [gr, ge] = m.geo || [];
  if (gr && !gr.failed) {
    const L = gr.layers;
    const hasFront = (L.front || 0) > 0 && gr.frontArea > 20;
    const hasContent = gr.contentArea > 40;
    if (!hasFront && !hasContent && (L.back || 0) <= 1) add('oneLayer', JSON.stringify(L));
    const odd = [...new Set(gr.widths)].filter((w) => !ALLOWED.some((a) => near(w, a)));
    if (odd.length) add('strokeWidth', odd.join(', '));
    if (gr.tiny.length) add('tiny', gr.tiny.slice(0, 3).join('; '));
    if (gr.text) add('text', `${gr.text} <text>`);
  }
  const gaps = [gr, ge].filter((g) => g && !g.failed);
  const edge = [...new Set(gaps.flatMap((g, i) => g.edge.map((s) => (i ? 'end: ' : 'rest: ') + s)))];
  const pair = [...new Set(gaps.flatMap((g, i) => g.pair.map((s) => (i ? 'end: ' : 'rest: ') + s)))];
  if (edge.length) add('edgeGap', edge.slice(0, 3).join('; '));
  const peek = [...new Set(gaps.flatMap((g, i) => g.peek.map((s) => (i ? 'end: ' : 'rest: ') + s)))];
  if (peek.length) add('peek', peek.slice(0, 4).join('; '));
  const bare = [...new Set(gaps.flatMap((g, i) => g.bare.map((s) => (i ? 'end: ' : 'rest: ') + s)))];
  if (bare.length) add('bare', bare.slice(0, 3).join('; '));
  const joint = [...new Set(gaps.flatMap((g, i) => g.joint.map((s) => (i ? 'end: ' : 'rest: ') + s)))];
  if (joint.length) add('joint', joint.slice(0, 4).join('; '));
  if (pair.length) add('markGap', pair.slice(0, 3).join('; '));
  if (m.geo?.some((g) => g?.failed)) found.push({ id: 'error', detail: 'geometry: ' + m.geo.find((g) => g?.failed).failed });
  const score = Math.max(0, 100 - found.reduce((a, x) => a + RULES[x.id].w, 0));
  return { name: m.name, category: m.cat, score, findings: found, measures: { ink: m.ink, reach: m.reach, rest: m.boxes?.[0], end: m.boxes?.at(-1), diffs: m.diffs, layers: gr?.layers, widths: gr ? [...new Set(gr.widths)] : [] } };
}).sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify({ rules: RULES, failures, icons: report }, null, 1));
const counts = Object.fromEntries(Object.keys(RULES).map((k) => [k, report.filter((r) => r.findings.some((x) => x.id === k)).length]));
const avg = report.reduce((a, r) => a + r.score, 0) / report.length;
const md = [`# Icon audit`, '', `${report.length} icons, average score ${avg.toFixed(1)}.`, '', '| Finding | Weight | Icons |', '| --- | --- | --- |',
  ...Object.entries(RULES).map(([k, r]) => `| ${k}: ${r.text} | ${r.w} | ${counts[k]} |`), '',
  ...report.filter((r) => r.score < min && r.findings.length).map((r) => `## ${r.name} (${r.category}) — ${r.score}\n\n${r.findings.map((x) => `- **${x.id}** ${x.detail || ''}`).join('\n')}\n`)].join('\n');
fs.writeFileSync(path.join(out, 'report.md'), md);
console.log(`Audited ${report.length} icons, average ${avg.toFixed(1)}.`);
for (const [k, n] of Object.entries(counts)) if (n) console.log(`  ${k.padEnd(12)} ${n}`);
console.log(`Report: ${path.relative(process.cwd(), path.join(out, 'report.md'))}`);
if (failures.length) { console.error(`Failed to load: ${failures.map((x) => x.name).join(', ')}`); process.exitCode = 1; }
