// The line style (线性): line icons on a 24 grid after SF Symbols, drawn with the kubai-line
// skill and imported into icons-line/ as layer data (tools/line-import.mjs). A line icon's
// geometry depends on its stroke, so each icon keeps its layers at strokes 1.5, 2 and 2.5; this
// file draws any stroke from 0.5 to 3 with the nearest of them, in one of four variants:
//   outline     线性      lines in one colour
//   line-duo    线性双色  inner and key parts in a light tone, under the dark lines
//   fill        面性      closed shapes filled, details knocked out
//   solid-tint  面性填充  dark lines over areas filled in a light tone
// Colours follow CSS: the lines are currentColor (set `color`); the light tone and the fill are
// currentColor mixed toward --kl-bg (white unless set) at 42% and 20%, or --kl-light and
// --kl-fill when those are set. The motion is line-motion.js.

import { attach } from './line-motion.js';

export const LINE_VIEWBOX = '0 0 24 24';
export const LINE_VARIANTS = ['outline', 'line-duo', 'fill', 'solid-tint'];
/** The stroke widths a line icon may take, and the regular one. */
export const LINE_STROKE = { min: 0.5, max: 3, step: 0.25, regular: 2 };

const n = (v) => +(+v).toFixed(3);
const gapOf = (s) => n(0.5 * s + 0.75);
const BG = 'var(--kl-bg, #FFFFFF)';
const LIGHT = `var(--kl-light, color-mix(in srgb, currentColor 42%, ${BG}))`;
const FILL = `var(--kl-fill, color-mix(in srgb, currentColor 20%, ${BG}))`;

/** The stroke width to draw, snapped to the step and kept in range. */
export function lineStroke(s) {
  const v = Number(s);
  if (!Number.isFinite(v)) return LINE_STROKE.regular;
  const c = Math.min(LINE_STROKE.max, Math.max(LINE_STROKE.min, v));
  return n(Math.round(c / LINE_STROKE.step) * LINE_STROKE.step);
}
/** The variant to draw: one of LINE_VARIANTS, else outline. */
export const lineVariant = (v) => (LINE_VARIANTS.includes(v) ? v : 'outline');

/**
 * Inner markup of a line icon definition ({ w: { '1.5': snapshot, '2': ..., '2.5': ... } }) at
 * stroke s in a variant, with ids as the __K__ placeholder and every part tagged data-l for the
 * motion. With colors { dark, light, fill } the paint is fixed (static files); otherwise it
 * follows CSS as described above.
 */
export function lineMarkup(def, { s = LINE_STROKE.regular, variant = 'outline', colors } = {}) {
  s = lineStroke(s);
  variant = lineVariant(variant);
  const geos = Object.keys(def.w).map(Number);
  const geo = geos.reduce((a, b) => (Math.abs(b - s) < Math.abs(a - s) ? b : a));
  const snap = def.w[String(geo)];
  const fill = variant === 'fill', duo = variant === 'solid-tint', two = variant === 'line-duo';
  const L = fill ? snap.f : snap.o;
  const dark = colors?.dark ?? 'currentColor', light = colors?.light ?? LIGHT, area = colors?.fill ?? FILL;
  const ink = (l) => (two && l.lit ? light : dark);
  const byName = {};
  for (const l of L) if (!/^\d+$/.test(l.key)) byName[l.key] = l;
  const depth = (j, i) => {
    if (!fill) return null;
    let d = 0, cur = j;
    while (cur && cur.on && d < 8) { d++; cur = byName[cur.on]; if (cur === i) return d; }
    return null;
  };
  const solidForm = (l) => l.k === 'solid' || (l.k === 'shell' && fill);
  const shape = (l, c, extra = 0, filled = solidForm(l)) => {
    const t = l.tf ? ` transform="${l.tf}"` : '';
    const sw = n((s + extra) / (l.sc ?? 1)), cap = l.cap === 'butt' && !extra ? 'butt' : 'round';
    if (!filled) return `<path d="${l.d}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="${cap}" stroke-linejoin="round" pathLength="1"${t}/>`;
    if (l.k === 'solid' && !extra) return `<path d="${l.d}" fill="${c}"${t}/>`;
    const w = l.k === 'solid' ? n(extra / (l.sc ?? 1)) : sw;
    return `<path d="${l.d}" fill="${c}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" pathLength="1"${t}/>`;
  };
  const tagged = (l, svg) => `<g data-l="${l.key}"${l.ghost ? ' opacity="0"' : ''}>${svg}</g>`;
  const box = 'maskUnits="userSpaceOnUse" x="-6" y="-6" width="36" height="36"><rect x="-6" y="-6" width="36" height="36" fill="#fff"/>';
  const defs = [], out = [], under = [], back = [];
  L.forEach((l, i) => {
    const c = ink(l);
    // Hosted in the fill variant with the same paint: the hole alone draws it.
    const host = fill && l.on ? byName[l.on] : null;
    const skip = host && ink(host) === c;
    const cuts = [];
    L.forEach((m, j) => {
      if (j <= i) return;
      const d = depth(m, l);
      if (d) cuts.push(tagged(m, shape(m, d % 2 ? '#000' : '#fff')));
    });
    L.forEach((m, j) => {
      if (j <= i || m.part === l.part || depth(m, l)) return;
      if (m.cutD) cuts.push(tagged(m, `<path d="${m.cutD}" fill="#000"${m.tf ? ` transform="${m.tf}"` : ''}/>`));
      else if (m.cut) cuts.push(tagged(m, `<path d="${m.cut.d}" fill="none" stroke="#000" stroke-width="${n(m.cut.w)}" stroke-linecap="round" pathLength="1"/>`));
      else if (m.gap || m.occ) cuts.push(tagged(m, shape(m, '#000', 2 * gapOf(s), m.occ ? true : solidForm(m))));
    });
    if (skip) return;
    if (duo && l.tint) {
      const holes = L.filter((m, j) => j > i && m.on === l.key && m.k !== 'line').map((m) => tagged(m, shape(m, '#000', 0, true)));
      let tint = `<g data-l="${l.key}"${l.ghost ? ' opacity="0"' : ''}><path d="${l.d}" fill="${area}"${l.tf ? ` transform="${l.tf}"` : ''}/></g>`;
      if (cuts.length || holes.length) {
        defs.push(`<mask id="__K__-t${i}" ${box}${cuts.join('')}${holes.join('')}</mask>`);
        tint = `<g mask="url(#__K__-t${i})">${tint}</g>`;
      }
      under.push(tint);
    }
    let piece = `<g data-l="${l.key}"${l.ghost ? ' opacity="0"' : ''}${l.vc != null ? ` data-vc="${l.vc}"` : ''}>${shape(l, c)}</g>`;
    if (cuts.length) {
      defs.push(`<mask id="__K__-m${i}" ${box}${cuts.join('')}</mask>`);
      piece = `<g mask="url(#__K__-m${i})">${piece}</g>`;
    }
    (two && l.lit ? back : out).push(piece);
  });
  if (duo) for (const l of [...(snap.x || []), ...(snap.a || [])]) under.push(`<g data-l="${l.key}"><path d="${l.d}" fill="${area}"${l.tf ? ` transform="${l.tf}"` : ''}/></g>`);
  return (defs.length ? `<defs>${defs.join('')}</defs>` : '') + `<g data-l="all">${under.join('')}${back.join('')}${out.join('')}</g>`;
}

// Mixes a #rgb / #rrggbb colour toward white, the light tones of a standalone file.
const hex = (c) => {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(c).trim());
  if (!m) return null;
  const h = m[1].length === 3 ? [...m[1]].map((x) => x + x).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const mix = (c, share) => {
  const rgb = hex(c);
  return rgb ? '#' + rgb.map((v) => Math.round(v * share + 255 * (1 - share)).toString(16).padStart(2, '0')).join('').toUpperCase() : null;
};

/**
 * A standalone line SVG: no motion tags, no parts that only show on hover. With a hex color the
 * light tone and fill are that colour over white; otherwise every part is in that colour (or
 * currentColor), as in the outline files of kubai-icons-static.
 */
export function lineStill(def, { s = LINE_STROKE.regular, variant = 'outline', color = 'currentColor', size = 24, id = def.name } = {}) {
  const colors = { dark: color, light: mix(color, 0.42) ?? color, fill: mix(color, 0.2) ?? 'none' };
  const m = lineMarkup(def, { s, variant, colors }).replace(/ pathLength="1"/g, '').replace(/__K__/g, id);
  const stack = [];
  let hide = 0;
  const body = m.replace(/<g( [^>]*)?>|<\/g>|<[^>]+>/g, (t, attrs) => {
    if (t === '</g>') { const top = stack.pop(); if (top === 'hide') hide--; return top === 'keep' && !hide ? t : ''; }
    if (t.startsWith('<g') && (t[2] === ' ' || t[2] === '>')) {
      if (/opacity="0"/.test(attrs || '')) { stack.push('hide'); hide++; return ''; }
      const keep = /mask=/.test(attrs || '');
      stack.push(keep ? 'keep' : 'drop');
      return keep && !hide ? t : '';
    }
    return hide ? '' : t;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LINE_VIEWBOX}" width="${size}" height="${size}" fill="none">${body}</svg>`;
}

/** A built line icon: the shape every icon module exports, with its layers kept for redrawing. */
export const line = (name, def) => ({ name, viewBox: LINE_VIEWBOX, style: 'line', line: def, markup: lineMarkup(def), tap: false });

/** The markup of a line icon for the given options (stroke width and variant). */
export const lineIconMarkup = (ic, { strokeWidth, variant } = {}) =>
  strokeWidth == null && (variant == null || lineVariant(variant) === 'outline') ? ic.markup : lineMarkup(ic.line, { s: strokeWidth ?? LINE_STROKE.regular, variant });

/** Attaches the hover motion to a rendered line <svg>; the same controller as animate(). */
export function animateLine(svg, ic, { variant } = {}) {
  // The draw effect fades parts instead of drawing them in the fill variant.
  svg.setAttribute('data-variant', lineVariant(variant));
  const m = attach(svg, ic.line.fx);
  let on = false;
  return {
    hover(next) { const v = Boolean(next); if (v === on) return; on = v; m.hover(v); },
    state() {},
    get hovered() { return on; },
    get active() { return false; },
    svg,
    destroy() { m.hover(false); m.at(1e9); }
  };
}
