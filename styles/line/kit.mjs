// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Geometry and rendering for the line style that follows SF Symbols (线性·SF 风格). The rules
// are in GUIDE.md; this file implements them.
//
// Canvas (GUIDE.md §1): 24 x 24, padding 2, live area 2..22, as in Fluent, Material Rounded,
//   Tabler and Phosphor. Key shapes on whole pixels: circle Ø20, square 18, landscape 20 x 16,
//   portrait 16 x 20. With this style's rounder corners the square has about 3% less ink than
//   the circle; whole pixels come first (§1.4).
// Strokes (§2): one width per icon, set by the weight of the text beside it; round caps and
//   round joins. A butt cap or a solid fill only where §2 allows it.
// Parts (§3): every layer has a role, primary / secondary / detail, and each icon states the
//   share of ink it means each role to take before it is drawn (weights); check.mjs measures it.
//
// Corner smoothing is smooth.mjs, the same as the two-tone style's. Every icon is a function of the stroke
// width s, so every weight is drawn, not scaled: outlines are placed by their OUTER edge and keep
// their size, strokes grow inward.
import { rr, circ, polygon, rot } from './smooth.mjs';
import { fitEnds } from './ends.mjs';

export { rr, circ, polygon, rot };

const n = (v) => +(+v).toFixed(3);
export const SIZE = 24;
export const C = 12;

// Stroke widths on the 24 grid, matched to the CSS font weight of the text beside the icon.
// Regular is 2, as in Lucide, Tabler and Material 400: with centre lines on whole numbers both
// edges of every straight stroke land on whole pixels at 24 px (and at 2x, 3x). An odd width
// (1.5, 1.75) can never have both edges on pixels. Light 1.5 is the least: 1 px at 16 px.
// Bold 2.5 is the most: at 2.75 the insides of the trash can, the calendar and the info sign
// close up and their gaps fall under 1.25 (check.mjs). Bold serves font weights 600 and up.
export const WEIGHTS = { light: 1.5, regular: 2, medium: 2.25, bold: 2.5 };
export const FONT = { light: 300, regular: 400, medium: 500, bold: 600 };
// Any stroke from 0.5 to 3 in steps of 0.25 may be drawn (as Lucide allows); the four weights
// above are the common ones. check.mjs draws every step of the CHECKED range, where every icon is
// known to hold (GUIDE.md §1.3).
export const STROKE = { min: 0.5, max: 3, step: 0.25 };
export const CHECKED = { min: 1.5, max: 2.5 };
export const STROKES = Array.from({ length: Math.round((CHECKED.max - CHECKED.min) / STROKE.step) + 1 }, (_, i) => +(CHECKED.min + i * STROKE.step).toFixed(3));
// The clear band cut round a part that crosses another (a slash, a badge, a front object).
export const gapOf = (s) => n(0.5 * s + 0.75);
// A solid dot grows with the weight, the way a full stop does.
export const dotOf = (s) => n(0.8 * s);
// The least clear space between two separate parts (check.mjs, clear): Lucide and Tabler keep
// one stroke (2); here 1.5 up to regular and 1.25 for the heavier weights, where strokes take
// the room.
export const clearOf = (s) => (s <= 2 ? 1.5 : 1.25);
// Outer corner radius by the short side of a part: 0.24 of it, to the nearest quarter.
export const cornerOf = (side) => n(Math.round(side * 0.24 * 4) / 4);

// Key shapes (GUIDE.md §1). fit says which axes an icon must fill: both, or only the long one
// for objects that are long in life (a battery, an eye, a link).
export const KEYLINES = {
  live: [2, 2, 20, 20],
  circle: [12, 12, 10],
  square: [3, 3, 18, 18],
  portrait: [4, 2, 16, 20],
  landscape: [2, 4, 20, 16]
};
export function keyBox(key) {
  const k = KEYLINES[key];
  return k.length === 3 ? [k[0] - k[2], k[1] - k[2], k[0] + k[2], k[1] + k[2]] : [k[0], k[1], k[0] + k[2], k[1] + k[3]];
}

// Roles (GUIDE.md §3) and the level each takes in the hierarchical and palette modes.
export const ROLES = { primary: 1, secondary: 2, detail: 2 };
export const ROLE_NAME = { primary: '主体', secondary: '辅助', detail: '细节' };

// Opacity of each level in the hierarchical mode; dimmed parts in variable colour.
export const LEVELS = [1, 0.5, 0.25];
export const DIM = 0.25;
// Palettes: the primary level follows the text colour, so a palette works on light and dark.
export const PALETTES = {
  brand: ['currentColor', '#5A76F2', '#BDC8FA'],
  ocean: ['currentColor', '#20A4F3', '#B6E3FC'],
  ember: ['currentColor', '#F2724B', '#F9C9B6']
};

/**
 * Geometry for one stroke width. Outlines are given by their OUTER edge (box, ring), so an icon
 * keeps its size at every weight; free lines by their centre line (seg, pl, arc), or by their
 * outer extents with span.
 */
export function geo(s) {
  const h = s / 2;
  const less = (c) => (Array.isArray(c) ? c.map((v) => Math.max(v - h, 0)) : Math.max(c - h, 0));
  const pt = (x, y) => `${n(x)} ${n(y)}`;
  const at = (cx, cy, r, a) => pt(cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180));
  return {
    s, h, g: gapOf(s), dr: dotOf(s), clear: clearOf(s),
    /** Rounded rectangle whose outer edge is x, y, w, hh with corner c (or [tl, tr, br, bl]). */
    box: (x, y, w, hh, c = 0) => rr(x + h, y + h, w - s, hh - s, less(c)),
    /** A filled rounded rectangle exactly as given (solid parts). */
    area: (x, y, w, hh, c = 0) => rr(x, y, w, hh, c),
    /** Circle whose outer edge has radius R. */
    ring: (cx, cy, R) => circ(cx, cy, R - h),
    circ,
    /** A straight line given by its outer extents, round caps included. */
    span(x1, y1, x2, y2) {
      const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
      return `M${pt(x1 + ux * h, y1 + uy * h)}L${pt(x2 - ux * h, y2 - uy * h)}`;
    },
    /** A straight line by its centre line. */
    seg: (x1, y1, x2, y2) => `M${pt(x1, y1)}L${pt(x2, y2)}`,
    /** A polyline by its centre line; round joins. */
    pl: (pts, close = false) => 'M' + pts.map(([x, y]) => pt(x, y)).join('L') + (close ? 'Z' : ''),
    /** Arc by its centre line, from angle a0 to a1 in degrees, clockwise (0 points right). */
    arc(cx, cy, r, a0, a1) {
      const large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 1 : 0;
      return `M${at(cx, cy, r, a0)}A${n(r)} ${n(r)} 0 ${large} ${sweep} ${at(cx, cy, r, a1)}`;
    },
    /** A solid dot whose size follows the weight; k scales it. */
    dot: (cx, cy, k = 1) => circ(cx, cy, n(dotOf(s) * k)),
    polygon, rr, rot, at, pt
  };
}

// Layers, back to front. Every layer is one of three kinds:
//   shell  a closed outline: stroked in the outline variant, filled in the fill variant
//   line   a stroke in every variant (a hand, a text line, a wave)
//   solid  a filled shape in every variant (a dot, a pupil, a pause bar): GUIDE.md §2.3
// Options:
//   n      name; motion and replace find layers by it
//   role   'primary', 'secondary' or 'detail' (GUIDE.md §3); sets the level unless lv is given
//   lv     level 1, 2 or 3 (hierarchical and palette modes)
//   cap    'butt' for a flat line end (GUIDE.md §2.2); round otherwise
//   on     the shell this part sits on: in the fill variant it is knocked out of that shell,
//          and drawn in the hole only when its paint differs from the shell's
//   gap    true: a clear band (gapOf) is cut round this part out of everything below it
//   occ    true: like gap, but the band goes round the part's filled area, so a front object
//          hides what is behind it
//   cutD   a custom shape to cut out of everything below instead (a badge's round notch)
//   cut    { d, w }: a stroked band to cut instead (a slash's one-sided gap)
//   part   layers of one part never cut each other
//   only   'outline' or 'fill': the layer exists in that variant only
//   vc     index in the variable-colour sequence (0 first)
//   ghost  hidden at rest; only a motion shows it
//   tf     an SVG transform for this layer (variants that place an icon inside another)
//   sc     the scale tf applies; strokes and cuts are widened by 1/sc to keep one stroke width
export const shell = (d, o = {}) => ({ d, k: 'shell', ...o });
export const line = (d, o = {}) => ({ d, k: 'line', ...o });
export const solid = (d, o = {}) => ({ d, k: 'solid', ...o });
const levelOf = (l) => l.lv ?? ROLES[l.role] ?? 1;

const paintOf = (mode, colors, color, roleColors) => (l) => {
  if (roleColors) return { c: roleColors[l.role] ?? '#888', a: 1 };
  const lv = levelOf(l);
  if (mode === 'hierarchical') return { c: color, a: LEVELS[lv - 1] };
  if (mode === 'palette') return { c: colors[Math.min(lv, colors.length) - 1], a: 1 };
  return { c: color, a: 1 };
};
const same = (p, q) => p.c === q.c && p.a === q.a;

// The four variants (GUIDE.md §4):
//   outline     线性      lines in one colour
//   line-duo    线性双色  lines; inner and key parts in a light tone, under the dark lines
//   fill        面性      closed shapes filled, details knocked out
//   solid-tint  面性填充  lines in the dark tone over areas filled in a light tone
// (Not the two-tone solid style, kubai-duotone: these names belong to the line style.)
// Both tones are solid colours (overlaps stay even); `tones` sets them, so either variant can be
// coloured. By default they are the icon colour mixed toward the background by these shares.
export const TONE = { light: 0.42, fill: 0.2 };
/**
 * The shells to fill in solid-tint: icon.tint names them; or else every closed shape of a primary
 * or secondary part (a head and a body, two people, a ring round a check). Details are not
 * filled: they sit on the fill, and closed ones are holes in it (a lens, a keyhole). A part hidden
 * at rest (ghost) is filled only when icon.tint names it.
 */
export function tintOf(icon, L) {
  const shells = L.filter((l) => l.k === 'shell');
  if (icon.tint) return new Set(shells.filter((l) => icon.tint.includes(l.n)));
  return new Set(shells.filter((l) => !l.ghost && (l.role ?? 'primary') !== 'detail'));
}
/**
 * The parts drawn in the light tone in line-duo: icon.light names them; or else the inner parts
 * (details, and parts sitting on a closed shape: a lens, a keyhole, the check in a circle); or,
 * when there are none, the secondary parts (a handle, a clapper, the waves of a speaker). A part
 * hidden at rest (ghost) is light only when icon.light names it.
 */
export function lightOf(icon, L) {
  const live = L.filter((l) => !l.ghost), byName = Object.fromEntries(L.filter((l) => l.n).map((l) => [l.n, l]));
  if (icon.light) return new Set(L.filter((l) => icon.light.includes(l.n)));
  const inner = live.filter((l) => l.role === 'detail' || (l.on && byName[l.on]?.k === 'shell'));
  if (inner.length && inner.length < live.length) return new Set(inner);
  const sec = live.filter((l) => l.role === 'secondary');
  return new Set(sec.length < live.length ? sec : []);
}
/** A colour mixed toward the background: hex by arithmetic, anything else with color-mix(). */
export function mixTone(color, share, bg = '#FFFFFF') {
  const hex = (c) => /^#[0-9a-f]{6}$/i.test(c) && [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = hex(color), b = hex(bg);
  if (a && b) return '#' + a.map((v, i) => Math.round(v * share + b[i] * (1 - share)).toString(16).padStart(2, '0')).join('').toUpperCase();
  return `color-mix(in srgb, ${color} ${Math.round(share * 100)}%, ${bg})`;
}

/** The layers of an icon at stroke width s in one variant. */
export function layersOf(icon, s, variant = 'outline') {
  const L = icon.draw(geo(s), { variant }).filter((l) => !l.only || l.only === variant);
  if (variant !== 'fill') return L;
  // Knock-outs that reach their host's edge go fully in or fully out (GUIDE.md §4.1).
  const byName = Object.fromEntries(L.filter((l) => l.n).map((l) => [l.n, l]));
  // icon.ends sets it for every line on a host; a layer's own ends wins, 'keep' leaves it.
  return L.map((l) => {
    const ends = l.ends ?? (l.k === 'line' ? icon.ends : null);
    // a line cut out through the edge is only a gap: it is not drawn in its own colour
    return ends && ends !== 'keep' && l.on && byName[l.on] ? { ...l, d: fitEnds(l.d, byName[l.on], s / (l.sc ?? 1), ends), ...(ends === 'out' ? { through: true } : {}) } : l;
  });
}

/**
 * SVG markup of one icon.
 *   weight     a WEIGHTS name, or s for a stroke width
 *   variant    'outline', 'line-duo', 'fill' or 'solid-tint' (GUIDE.md §4)
 *   tones      { dark, light, fill } for line-duo and solid-tint; light and fill default to the
 *              colour mixed toward bg (default white, or var(--icon-bg) for currentColor); a
 *              light tone given alone also sets the fill
 *   bg         the background the tones are mixed toward
 *   mode       'monochrome', 'hierarchical' or 'palette'
 *   color      the colour of monochrome and hierarchical (default currentColor)
 *   colors     the palette, primary first
 *   roleColors one colour per role (check.mjs measures the weights with it)
 *   vc         variable value 0..1: parts whose vc index is past it are dimmed
 *   motion     true: tag layers with data-l (name or index) for motion.mjs
 *   cuts       false: no knock-outs or clear bands at all (sliver.mjs compares against it)
 */
export function render(icon, o = {}) {
  const { weight = 'regular', variant = 'outline', mode = 'monochrome', color = 'currentColor', colors = PALETTES.brand,
    size = 24, id = 'i', motion = false, vc = null, title, roleColors, tones = {}, cuts: cutting = true } = o;
  const s = o.s ?? WEIGHTS[weight];
  const fill = variant === 'fill', duo = variant === 'solid-tint', two = variant === 'line-duo';
  const L = layersOf(icon, s, duo || two ? 'outline' : variant).map((l, i) => ({ ...l, key: l.n ?? String(i), part: l.part ?? `#${i}` }));
  const bg = o.bg ?? (color === 'currentColor' ? 'var(--icon-bg, #FFFFFF)' : '#FFFFFF');
  const dark = tones.dark ?? color, light = tones.light ?? mixTone(dark, TONE.light, bg);
  // the fill follows the light tone when only that is given (an accent): about half as strong
  const area = tones.fill ?? (tones.light ? mixTone(tones.light, TONE.fill / TONE.light, bg) : mixTone(dark, TONE.fill, bg));
  const lit = two ? lightOf(icon, L) : new Set();
  // Parts drawn as open lines in the outline (a cart's basket, a can) have a closed form for the
  // fill variant; the tint takes that form.
  const extra = duo ? layersOf(icon, s, 'fill').filter((l) => l.only === 'fill' && l.k === 'shell').map((l) => ({ ...l, key: l.n ?? 'x' })) : [];
  const tinted = duo ? tintOf(icon, [...L, ...extra]) : new Set();
  const paint0 = paintOf(mode, colors, color, roleColors);
  // line-duo and solid-tint take their colours from the tones, in the monochrome mode
  const toned = (duo || two) && mode === 'monochrome' && !roleColors;
  const paint = (l) => (toned ? { c: lit.has(l) ? light : dark, a: 1 } : paint0(l));
  // The fill of solid-tint: the fill tone; in the palette mode the accent colour.
  const tintInk = (l) => (toned ? area : mode === 'palette' && !roleColors ? colors[Math.min(1, colors.length - 1)] : paint(l).c);
  const tintA = toned ? 1 : 0.3;
  const byName = Object.fromEntries(L.filter((l) => l.n).map((l) => [l.n, l]));
  const vcCount = Math.max(0, ...L.filter((l) => l.vc != null).map((l) => l.vc + 1));
  const pathLen = motion ? ' pathLength="1"' : '';
  // depth of j under i along the `on` chain (fill variant only); null if not under it
  const depth = (j, i) => {
    if (!fill) return null;
    let d = 0, cur = j;
    while (cur && cur.on && d < 8) { d++; cur = byName[cur.on]; if (cur === i) return d; }
    return null;
  };
  const solidForm = (l) => l.k === 'solid' || (l.k === 'shell' && fill);
  const shape = (l, ink, extra = 0, filled = solidForm(l)) => {
    const t = l.tf ? ` transform="${l.tf}"` : '';
    // a layer drawn scaled by sc (enclose) keeps the same on-screen stroke: widen it by 1/sc
    const sw = n((s + extra) / (l.sc ?? 1)), cap = l.cap === 'butt' && !extra ? 'butt' : 'round';
    if (!filled) return `<path d="${l.d}" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="${cap}" stroke-linejoin="round"${pathLen}${t}/>`;
    if (l.k === 'solid' && !extra) return `<path d="${l.d}" fill="${ink}"${t}/>`;
    const w = l.k === 'solid' ? n(extra / (l.sc ?? 1)) : sw;
    return `<path d="${l.d}" fill="${ink}" stroke="${ink}" stroke-width="${w}" stroke-linejoin="round"${pathLen}${t}/>`;
  };
  // A mask piece moves with the layer it comes from: wrap it in a group tagged like that layer.
  const tagged = (l, svg) => (motion ? `<g data-l="${l.key}"${l.ghost ? ' opacity="0"' : ''}>${svg}</g>` : svg);
  const defs = [];
  const box = 'maskUnits="userSpaceOnUse" x="-6" y="-6" width="36" height="36"><rect x="-6" y="-6" width="36" height="36" fill="#fff"/>';
  const out = [], under = [], back = [];
  L.forEach((l, i) => {
    const p = paint(l);
    let a = p.a;
    if (vc != null && l.vc != null && (l.vc + 1) / vcCount > vc + 1e-6) a *= DIM;
    // Hosted in the fill variant with the same paint: the hole alone draws it.
    const host = fill && l.on ? byName[l.on] : null;
    const skip = (host && same(paint(host), p) && !(vc != null && l.vc != null)) || (fill && l.through);
    const cuts = [];
    // Knock-outs from parts sitting on this one (fill variant); nested parts flip back.
    L.forEach((m, j) => {
      if (j <= i || (m.ghost && !motion)) return;
      const d = depth(m, l);
      if (d) cuts.push(tagged(m, shape(m, d % 2 ? '#000' : '#fff')));
    });
    // Clear bands cut by parts in front, from other parts.
    L.forEach((m, j) => {
      if (j <= i || m.part === l.part || depth(m, l) || (m.ghost && !motion)) return;
      if (m.cutD) cuts.push(tagged(m, `<path d="${m.cutD}" fill="#000"${m.tf ? ` transform="${m.tf}"` : ''}/>`));
      else if (m.cut) cuts.push(tagged(m, `<path d="${m.cut.d}" fill="none" stroke="#000" stroke-width="${n(m.cut.w)}" stroke-linecap="round"${pathLen}/>`));
      else if (m.gap || m.occ) cuts.push(tagged(m, shape(m, '#000', 2 * gapOf(s), m.occ ? true : solidForm(m))));
    });
    if (!cutting) cuts.length = 0;
    if (skip) return;
    // Solid-tint: the shell's area in a light tint of its own colour, under every stroke. Shells
    // and solids sitting on it (a lens, a keyhole) are holes in the tint.
    if (tinted.has(l) && !(l.ghost && !motion)) {
      const holes = L.filter((m, j) => j > i && m.on === l.n && m.k !== 'line').map((m) => tagged(m, shape(m, '#000', 0, true)));
      const t = l.tf ? ` transform="${l.tf}"` : '';
      let tint = `<path d="${l.d}" fill="${tintInk(l)}"${a * tintA !== 1 ? ` opacity="${n(a * tintA)}"` : ''}${t}/>`;
      if (motion) tint = `<g data-l="${l.key}"${l.ghost ? ' opacity="0"' : ''}>${tint}</g>`;
      if (cuts.length || holes.length) {
        defs.push(`<mask id="${id}-t${i}" ${box}${cuts.join('')}${holes.join('')}</mask>`);
        tint = `<g mask="url(#${id}-t${i})">${tint}</g>`;
      }
      under.push(tint);
    }
    let piece = shape(l, p.c);
    if (a !== 1) piece = `<g opacity="${n(a)}">${piece}</g>`;
    if (motion) piece = `<g data-l="${l.key}"${l.ghost ? ' opacity="0"' : ''}${l.vc != null ? ` data-vc="${l.vc}"` : ''}>${piece}</g>`;
    else if (l.ghost) return;
    if (cuts.length) {
      defs.push(`<mask id="${id}-m${i}" ${box}${cuts.join('')}</mask>`);
      piece = `<g mask="url(#${id}-m${i})">${piece}</g>`;
    }
    // line-duo: light parts go under the dark ones, so a dark line always crosses on top
    (lit.has(l) ? back : out).push(piece);
  });
  // Areas that read as enclosed though their lines are open (inside a refresh arc, a tray):
  // icon.area(g) gives them as { n, d }, n the part they move with.
  const areas = duo && icon.area ? icon.area(geo(s)).map((r) => ({ ...r, k: 'shell', key: r.n, tf: L.find((l) => l.n === r.n)?.tf })) : [];
  for (const l of [...extra.filter((x) => tinted.has(x)), ...areas]) {
    const t = l.tf ? ` transform="${l.tf}"` : '';
    let tint = `<path d="${l.d}" fill="${tintInk(l)}"${tintA !== 1 ? ` opacity="${n(tintA)}"` : ''}${t}/>`;
    if (motion) tint = `<g data-l="${l.key}">${tint}</g>`;
    under.push(tint);
  }
  let body = under.join('') + back.join('') + out.join('');
  if (motion) body = `<g data-l="all">${body}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}"${motion ? ` data-variant="${variant}" data-s="${s}"` : ''}>${title ? `<title>${title}</title>` : ''}${defs.length ? `<defs>${defs.join('')}</defs>` : ''}${body}</svg>`;
}

/** The keylines of the canvas as SVG (GUIDE.md §1), for sheets and the gallery. */
export function keylineSvg({ size = 240, key, strong = '#2F5BFF', round = '#FF3B3B', faint = '#D7DCEB' } = {}) {
  const w = 24 / size; // one screen pixel in grid units
  const grid = Array.from({ length: 25 }, (_, i) => `<path d="M${i} 0V24M0 ${i}H24" stroke="${faint}" stroke-width="${n(w * 0.6)}"/>`).join('');
  const hl = (k) => (key === k ? 2.2 : 1);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">${grid}
<rect x="0" y="0" width="24" height="24" fill="none" stroke="${faint}" stroke-width="${n(w * 2)}"/>
<path d="M0 0L24 24M24 0L0 24M12 0V24M0 12H24" stroke="${round}" stroke-width="${n(w * 1.2)}" stroke-dasharray="${n(w * 5)} ${n(w * 4)}" opacity="0.7"/>
<rect x="2" y="2" width="20" height="20" fill="none" stroke="${strong}" stroke-width="${n(w * 2 * hl('live'))}"/>
<rect x="3" y="3" width="18" height="18" rx="4.25" fill="none" stroke="${strong}" stroke-width="${n(w * 2 * hl('square'))}"/>
<rect x="4" y="2" width="16" height="20" rx="4" fill="none" stroke="${strong}" stroke-width="${n(w * 1.2 * hl('portrait'))}" opacity="0.5"/>
<rect x="2" y="4" width="20" height="16" rx="4" fill="none" stroke="${strong}" stroke-width="${n(w * 1.2 * hl('landscape'))}" opacity="0.5"/>
<circle cx="12" cy="12" r="10" fill="none" stroke="${round}" stroke-width="${n(w * 2 * hl('circle'))}"/></svg>`;
}

// --- Variants made by rule ----------------------------------------------------------------------

/**
 * The icon with a slash from top left to bottom right. The clear gap is cut on one side only
 * (SLASH.side: -1 above right, the default; +1 below left); on the other side the slash joins
 * the object. The object loses half as much and stays in one piece.
 */
export const SLASH = { side: -1 };
export function slash(icon, { label } = {}) {
  return {
    ...icon, label: label ?? `${icon.label}（关闭）`, base: icon.name, kind: 'slash', weights: null,
    draw(g, ctx) {
      const [x0, y0, x1, y1] = keyBox(icon.key);
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const half = icon.key === 'circle' ? 8.4 : Math.min(x1 - x0, y1 - y0) / 2 - 0.5;
      const gp = gapOf(g.s), o = (SLASH.side * gp) / 2 / Math.SQRT2;
      // In fill the clear band may stop short of an end (fillCut: [from top, from bottom] along the
      // slash), so it never leaves a sliver where it grazes the object's edge (GUIDE.md §4.1).
      const [t0, t1] = ctx?.variant === 'fill' ? (icon.fillCut ?? [0, 0]).map((v) => v / Math.SQRT2) : [0, 0];
      const cut = { d: `M${n(cx - half - o + t0)} ${n(cy - half + o + t0)}L${n(cx + half - o - t1)} ${n(cy + half + o - t1)}`, w: g.s + gp };
      return [...icon.draw(g, ctx), line(g.span(cx - half, cy - half, cx + half, cy + half), { n: 'slash', role: 'primary', cut, part: 'slash' })];
    }
  };
}

// Badge marks, drawn about their centre in an 8 box (so a plus sits on whole pixels); they sit in the bottom-right corner of the
// key shape, in a round notch.
const MARK = 4;
const MARKS = {
  plus: (g, x, y) => line(`${g.seg(x, y - MARK + g.h, x, y + MARK - g.h)}${g.seg(x - MARK + g.h, y, x + MARK - g.h, y)}`),
  minus: (g, x, y) => line(g.seg(x - MARK + g.h, y, x + MARK - g.h, y)),
  check: (g, x, y) => line(g.pl([[x - MARK + g.h, y + 0.15], [x - 1.05, y + 2.6 - g.h / 2], [x + MARK - g.h, y - 2.4 + g.h / 2]])),
  x: (g, x, y) => { const k = MARK * 0.78 - g.h * 0.7; return line(`${g.seg(x - k, y - k, x + k, y + k)}${g.seg(x + k, y - k, x - k, y + k)}`); }
};
/** The icon with a mark (plus, minus, check, x) in the bottom-right corner, in a round notch. */
export function badge(icon, mark, { label, drop = [] } = {}) {
  return {
    ...icon, label: label ?? icon.label, base: icon.name, kind: 'badge', weights: null,
    draw(g, ctx) {
      const [, , x1, y1] = keyBox(icon.key);
      const x = x1 - MARK, y = y1 - MARK;
      const b = MARKS[mark](g, x, y);
      const own = icon.draw(g, ctx).filter((l) => !drop.includes(l.n));
      return [...own, { ...b, n: 'badge', role: 'primary', part: 'badge', cutD: circ(x, y, MARK + 0.4 + gapOf(g.s)), at: [x, y] }];
    }
  };
}

/** The icon inside a circle or a rounded square, drawn smaller with the same stroke. */
export function enclose(icon, shape = 'circle', { label, k = 0.56 } = {}) {
  return {
    ...icon, key: shape === 'circle' ? 'circle' : 'square', label: label ?? icon.label, base: icon.name, kind: shape, weights: null, fit: null, nudge: null,
    draw(g, ctx) {
      const tf = `translate(12 12) scale(${k}) translate(-12 -12)`;
      const outer = shape === 'circle' ? g.ring(12, 12, 10) : g.box(3, 3, 18, 18, 4.5);
      const inner = icon.draw(geo(g.s / k), ctx).map((l) => ({ ...l, tf: l.tf ? `${tf} ${l.tf}` : tf, sc: k * (l.sc ?? 1), on: l.on ?? 'encl', role: 'primary' }));
      return [shell(outer, { n: 'encl', role: 'secondary' }), ...inner];
    }
  };
}
