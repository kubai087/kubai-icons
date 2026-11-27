// The line style's motion engine (线性): damped springs after SF Symbols' presets. Each icon
// names one effect that acts out what it means (bounce, beat, wiggle, shake, rotate, flip,
// orbit, draw, variable, keys, from, and the depth effects turn, leaf and scan) and aims it at
// some of its layers by their data-l name. Every effect returns to rest. The same engine as the kubai-line skill's motion.mjs; a test
// keeps the two in step.

const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const f = (v) => +v.toFixed(3);

// Springs. impulse: a kick that peaks at 1 and dies away with one small swing back. settle: from
// 1 to 0 with a little overshoot. hz is the spring's own frequency, z its damping ratio.
export function impulse(t, hz = 1.8, z = 0.42) {
  if (t <= 0) return 0;
  const w = TAU * hz, wd = w * Math.sqrt(1 - z * z), tp = Math.atan(wd / (z * w)) / wd;
  const peak = Math.exp(-z * w * tp) * Math.sin(wd * tp);
  return (Math.exp(-z * w * t) * Math.sin(wd * t)) / peak;
}
export function settle(t, hz = 2.2, z = 0.55) {
  if (t <= 0) return 1;
  const w = TAU * hz, wd = w * Math.sqrt(1 - z * z);
  return Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
}
const easeOut = (u) => 1 - Math.pow(1 - clamp(u), 3);
const inOut = (u) => { u = clamp(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };

/**
 * Path data scaled by kx across and ky down about (ox, oy): the shape narrows, mirrors when a
 * factor is below 0, and its stroke keeps its width because only the coordinates change. Arcs
 * keep their tilt (0 in this set).
 */
export function scalePath(d, kx = 1, ky = 1, ox = 12, oy = 12) {
  const tok = d.match(/[a-z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) || [];
  const ARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
  const X = (v, rel) => f(rel ? v * kx : ox + (v - ox) * kx), Y = (v, rel) => f(rel ? v * ky : oy + (v - oy) * ky);
  let out = '', cmd = '', i = 0;
  while (i < tok.length) {
    if (/[a-z]/i.test(tok[i])) { cmd = tok[i++]; out += cmd; if (!ARGS[cmd.toLowerCase()]) continue; }
    const c = cmd.toLowerCase(), rel = cmd !== cmd.toUpperCase(), a = tok.slice(i, i + ARGS[c]).map(Number);
    i += ARGS[c];
    let v;
    if (c === 'h') v = [X(a[0], rel)];
    else if (c === 'v') v = [Y(a[0], rel)];
    else if (c === 'a') v = [f(Math.abs(a[0] * kx)), f(Math.abs(a[1] * ky)), a[2], a[3], kx * ky < 0 ? 1 - a[4] : a[4], X(a[5], rel), Y(a[6], rel)];
    else v = a.map((q, j) => (j % 2 ? Y(q, rel) : X(q, rel)));
    out += (/[a-z]$/i.test(out) ? '' : ' ') + v.join(' ');
  }
  return out;
}

const REST = { x: 0, y: 0, r: 0, s: 1, sx: 1, sy: 1, gx: 1, gy: 1, a: 1, w: 1 };
const SEG = 150; // ms per keyframe step
const HOME = 0.42; // s for the spring home

// Each effect: (spec, t in ms, i: index of the target group, n: number of groups) -> pose,
// and len(spec, n): how long it runs (ms); loop effects give a period instead.
export const EFFECTS = {
  bounce: {
    len: (p, n) => 720 + (p.by ? (n - 1) * (p.stagger ?? 90) : 0),
    pose(p, t, i) {
      const u = (t - (p.by ? i * (p.stagger ?? 90) : 0)) / 1000, amp = p.amp ?? 1.6;
      const lift = impulse(u - 0.07, 1.9, 0.45), pre = u > 0 && u < 0.07 ? Math.sin((Math.PI * u) / 0.07) : 0;
      const land = impulse(u - 0.07, 3.8, 0.5);
      return { y: p.dir === 'down' ? amp * lift : -amp * Math.max(lift, -0.35), sy: 1 - 0.07 * pre + 0.03 * Math.max(land, -0.6), sx: 1 + 0.04 * pre };
    }
  },
  beat: {
    len: () => 760,
    pose(p, t) {
      const b = (c) => { const u = (t - c) / 200; return u > 0 && u < 1 ? Math.sin(Math.PI * u) ** 2 : 0; };
      const tail = impulse((t - 420) / 1000, 3, 0.5);
      return { s: 1 + (p.amp ?? 0.12) * b(0) + (p.amp ?? 0.12) * 0.7 * b(240) + 0.015 * Math.max(0, tail) };
    }
  },
  wiggle: {
    len: (p) => 1000 + (p.delay ?? 0),
    pose(p, t) {
      const u = (t - (p.delay ?? 0)) / 1000;
      if (u <= 0) return {};
      const hz = p.hz ?? 3, env = Math.exp(-u * 3.6) * clamp(u / 0.05);
      return { r: (p.deg ?? 10) * env * Math.sin(TAU * hz * u) };
    }
  },
  shake: {
    len: (p) => p.ms ?? 520,
    pose(p, t) {
      const L = p.ms ?? 520, u = t / L;
      return { x: (p.x ?? 0.7) * Math.sin(TAU * 7 * u) * Math.sin(Math.PI * clamp(u)) };
    }
  },
  rotate: {
    len: (p) => (Math.abs(p.deg ?? 360) >= 180 ? 1050 : 820),
    pose(p, t) {
      const u = t / 1000, deg = p.deg ?? 360, big = Math.abs(deg) >= 180, L = big ? 1050 : 820;
      const out = { r: deg * (1 - settle(u, big ? 1.25 : 1.9, big ? 0.62 : 0.5)) };
      // dip: shrink a little while turning, for a part that reaches into a corner
      if (p.dip) out.s = 1 - p.dip * clamp(t / 50) * clamp((L - t) / 260);
      return out;
    }
  },
  flip: {
    len: (p) => 820 * (p.turns ?? 1),
    pose(p, t) { const L = 820 * (p.turns ?? 1); return { sx: Math.cos(TAU * (p.turns ?? 1) * inOut(t / L)) }; }
  },
  orbit: {
    len: (p) => 700 * (p.turns ?? 1),
    pose(p, t) {
      const L = 700 * (p.turns ?? 1), q = TAU * (p.turns ?? 1) * inOut(t / L), R = p.R ?? 0.9;
      return { x: R * Math.sin(q), y: R * (Math.cos(q) - 1) * 0.9 };
    }
  },
  draw: {
    len: (p, n) => 380 + (n - 1) * (p.stagger ?? 150) + 40,
    pose(p, t, i) {
      const u = (t - i * (p.stagger ?? 150)) / 380;
      return { w: easeOut(u) };
    }
  },
  variable: {
    loop: true,
    len: (p, n) => 120 + n * (p.step ?? 160) + 460,
    pose(p, t, i, n) {
      const step = p.step ?? 160, P = 120 + n * step + 460, q = t % P, DIM = 0.25, fade = (v) => clamp(v / 120);
      if (q < 120) return { a: 1 - (1 - DIM) * fade(q) };
      const on = q - 120 - i * step;
      if (p.mode !== 'iterative') return { a: on < 0 ? DIM : DIM + (1 - DIM) * fade(on) };
      // iterative: each part lights and dims in turn; at the end of the cycle all come back
      const lit = on < 0 ? 0 : on < step * 1.5 ? fade(on) : 1 - fade(on - step * 1.5), end = P - 140;
      return { a: DIM + (1 - DIM) * Math.max(lit, q > end ? fade(q - end) : 0) };
    }
  },
  from: {
    len: (p, n) => 760 + (p.delay ?? 0) + (p.by ? (n - 1) * (p.stagger ?? 80) : 0),
    pose(p, t, i) {
      const u = (t - (p.delay ?? 0) - (p.by ? i * (p.stagger ?? 80) : 0)) / 1000, k = settle(Math.max(u, 0), p.hz ?? 2.2, p.z ?? 0.55), out = {};
      for (const key of ['x', 'y', 'r', 's', 'sx', 'sy', 'gx', 'gy']) if (p[key] != null) out[key] = REST[key] + (p[key] - REST[key]) * k;
      if (p.a != null) out.a = p.a + (1 - p.a) * easeOut(u / 0.18);
      return out;
    }
  },
  keys: {
    len(p) {
      if (p.ms) return p.ms + HOME * 1000;
      const k = Math.max(1, ...['x', 'y', 'r', 's', 'sx', 'sy', 'gx', 'gy', 'a'].map((key) => (Array.isArray(p[key]) ? p[key].length : 0)));
      return 190 + (k - 1) * SEG + HOME * 1000 + (p.by ? 70 : 0);
    },
    pose(p, t, i) {
      const keys = ['x', 'y', 'r', 's', 'sx', 'sy', 'gx', 'gy', 'a'].filter((k) => p[k] != null);
      const k = Math.max(1, ...keys.map((key) => [].concat(p[key]).length));
      t -= p.by ? i * (p.stagger ?? 70) : 0;
      const out = {}, go = p.ms ? p.ms : 190 + (k - 1) * SEG;
      for (const key of keys) {
        const v = [].concat(p[key]), rest = REST[key];
        const home = key === 'a' && p.ghost ? 0 : rest, pts = [home, ...v], last = v[v.length - 1];
        if (t <= 0) { out[key] = home; continue; }
        if (t < go) {
          // out to the first key, then key to key
          const seg = go / v.length, j = Math.min(v.length - 1, Math.floor(t / seg)), u = (t - j * seg) / seg;
          out[key] = pts[j] + (pts[j + 1] - pts[j]) * (j === 0 ? easeOut(u) : inOut(u));
        } else out[key] = key === 'a' ? last + (home - last) * easeOut((t - go) / (HOME * 600)) : rest + (last - rest) * settle((t - go) / 1000);
      }
      return out;
    }
  },
  // Meridians round a sphere seen from the front. Each group is one meridian drawn as a half
  // ellipse at its longitude `at` (degrees, 0 facing the viewer); a cycle turns the sphere by
  // `step`, so with meridians `step` apart the last frame looks like the first. A meridian's
  // width follows sin(longitude); it fades out between edge[0] and edge[1] as it goes round the rim.
  turn: {
    loop: true,
    len: (p) => p.ms ?? 1100,
    pose(p, t, i) {
      const L = p.ms ?? 1100, rad = Math.PI / 180, at = p.at[i], q = at + p.step * ((t % L) / L);
      const [e0, e1] = p.edge ?? [70, 90], off = Math.abs(((q + 540) % 360) - 180);
      return { gx: Math.sin(q * rad) / Math.sin(at * rad), a: 1 - clamp((off - e0) / (e1 - e0)) };
    }
  },
  // Pages turning over the spine at o: each group is a page drawn lying on the right, hidden at
  // rest. Its width is the cosine of the angle it has turned, so it narrows to a line as it
  // stands up and opens out on the left; groups follow one another by stagger.
  leaf: {
    len: (p, n) => (p.ms ?? 560) + (n - 1) * (p.stagger ?? 200),
    pose(p, t, i) {
      const u = (t - i * (p.stagger ?? 200)) / (p.ms ?? 560);
      if (u <= 0 || u >= 1) return { a: 0 };
      return { [p.axis === 'y' ? 'gy' : 'gx']: Math.cos(Math.PI * inOut(u)), a: 1 };
    }
  },
  // A bar sweeps in front of a picture: the first group is the bar, drawn upright at x = 12 and
  // hidden at rest; the others are the picture. The bar comes in at x1 and runs to x0, wiping the
  // picture away behind it, and fades; the empty frame waits; the bar comes back at x0 and runs
  // to x1 drawing the picture again. The picture shows only left of the bar. With axis 'y' the
  // bar lies across at y = 12 and runs from y1 up to y0 and back down; the picture shows above it.
  scan: {
    len: (p) => 2 * (p.ms ?? 460) + (p.hold ?? 200) + 120,
    pose(p, t, i) {
      const S = p.ms ?? 460, H = p.hold ?? 200, F = 90, Y = p.axis === 'y';
      const p0 = (Y ? p.y0 : p.x0) ?? 3, p1 = (Y ? p.y1 : p.x1) ?? 21;
      const back = t >= S + H, u = back ? (t - S - H) / S : t / S;
      const pos = t < S ? p1 + (p0 - p1) * inOut(u) : back ? p0 + (p1 - p0) * inOut(u) : p0;
      if (i > 0) return Y ? { clipY: pos } : { clip: pos };
      const a = back ? clamp((t - S - H) / F) * (1 - clamp((t - 2 * S - H) / 120)) : clamp(t / 60) * (1 - clamp((t - S + F) / F));
      return { [Y ? 'y' : 'x']: pos - 12, a };
    }
  }
};

const mergePose = (a, b) => ({
  x: (a.x ?? 0) + (b.x ?? 0), y: (a.y ?? 0) + (b.y ?? 0), r: (a.r ?? 0) + (b.r ?? 0),
  s: (a.s ?? 1) * (b.s ?? 1), sx: (a.sx ?? 1) * (b.sx ?? 1), sy: (a.sy ?? 1) * (b.sy ?? 1),
  a: a.a == null ? b.a : b.a == null ? a.a : a.a * b.a, w: a.w == null ? b.w : b.w == null ? a.w : Math.min(a.w, b.w),
  gx: a.gx == null ? b.gx : b.gx == null ? a.gx : a.gx * b.gx, gy: a.gy == null ? b.gy : b.gy == null ? a.gy : a.gy * b.gy,
  clip: a.clip == null ? b.clip : b.clip == null ? a.clip : Math.min(a.clip, b.clip),
  clipY: a.clipY == null ? b.clipY : b.clipY == null ? a.clipY : Math.min(a.clipY, b.clipY),
  o: b.o ?? a.o
});

/** Transform for a pose about the point o. */
export function transform(p) {
  const [ox, oy] = p.o || [12, 12];
  const s = p.s ?? 1, sx = s * (p.sx ?? 1), sy = s * (p.sy ?? 1);
  return `translate(${f((p.x ?? 0) + ox)} ${f((p.y ?? 0) + oy)}) rotate(${f(p.r ?? 0)}) scale(${f(sx)} ${f(sy)}) translate(${-ox} ${-oy})`;
}

/** Targets of one effect as groups of layer names; 'all' is the whole drawing. */
function groups(spec) {
  if (spec.on === 'all' || !spec.on) return [['all']];
  const list = spec.on.map((g) => [].concat(g));
  return spec.by || ['draw', 'variable', 'turn', 'leaf', 'scan'].includes(spec.t) ? list : [list.flat()];
}

/** Hover motion for one <svg> rendered with motion: true. */
export function attach(svg, fx) {
  const list = [].concat(fx || []);
  const raf = globalThis.requestAnimationFrame || ((fn) => setTimeout(() => fn(performance.now()), 16));
  const caf = globalThis.cancelAnimationFrame || clearTimeout;
  const fill = svg.getAttribute('data-variant') === 'fill';
  let reduced = false;
  try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* not a browser */ }
  const find = (name) => [...svg.querySelectorAll(`[data-l="${name}"]`)];
  const pathsOf = (el) => (el.tagName === 'path' ? [el] : [...el.querySelectorAll('path')]);
  const pathCenter = (el) => {
    const ARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const add = (px, py) => {
      if (px < x0) x0 = px; if (px > x1) x1 = px;
      if (py < y0) y0 = py; if (py > y1) y1 = py;
    };
    for (const p of pathsOf(el)) {
      const tok = (p.getAttribute('d') || '').match(/[a-z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) || [];
      let cmd = '', i = 0, x = 0, y = 0, sx = 0, sy = 0;
      while (i < tok.length) {
        if (/[a-z]/i.test(tok[i])) { cmd = tok[i++]; if (cmd.toLowerCase() === 'z') { x = sx; y = sy; continue; } }
        const c = cmd.toLowerCase(), rel = cmd !== cmd.toUpperCase(), n = ARGS[c];
        if (!n) break;
        const a = tok.slice(i, i + n).map(Number);
        i += n;
        if (c === 'h') { x = rel ? x + a[0] : a[0]; add(x, y); }
        else if (c === 'v') { y = rel ? y + a[0] : a[0]; add(x, y); }
        else if (c === 'a') { x = rel ? x + a[5] : a[5]; y = rel ? y + a[6] : a[6]; add(x, y); }
        else {
          for (let j = 0; j < n; j += 2) {
            const px = rel ? x + a[j] : a[j], py = rel ? y + a[j + 1] : a[j + 1];
            add(px, py);
            if (j === n - 2) { x = px; y = py; }
          }
          if (c === 'm') { sx = x; sy = y; cmd = rel ? 'l' : 'L'; }
        }
      }
    }
    return x0 <= x1 ? [f((x0 + x1) / 2), f((y0 + y1) / 2)] : [12, 12];
  };
  // The centre of a part, for effects that turn it about itself (a badge or masked mark).
  const centre = (name) => {
    const all = find(name), el = all.find((e) => !e.closest('mask'));
    if (el && el.getBBox) {
      try {
        const b = el.getBBox();
        if (b.width || b.height) return [b.x + b.width / 2, b.y + b.height / 2];
      } catch { /* detached or hidden svg */ }
    }
    const maskEl = all.find((e) => e.closest('mask'));
    const target = el || maskEl;
    return target ? pathCenter(target) : [12, 12];
  };
  const parts = list.map((given) => {
    // spec.fill: settings that differ in the fill variant (a knock-out must keep its rim)
    const spec = fill && given.fill ? { ...given, ...given.fill } : given;
    const gs = groups(spec), E = EFFECTS[spec.t];
    if (!E) throw new Error(`Unknown effect ${spec.t}`);
    return { spec, gs, E, len: E.len(spec, gs.length), o: spec.oBadge ? centre(gs[0][0]) : spec.o };
  });
  const names = [...new Set(parts.flatMap((p) => p.gs.flat()))];
  const nodes = Object.fromEntries(names.map((n) => [n, find(n)]));
  const ghost = Object.fromEntries(names.map((n) => [n, nodes[n].some((e) => e.getAttribute('opacity') === '0')]));
  const loops = parts.some((p) => p.E.loop);
  const span = Math.max(...parts.map((p) => p.len));
  // Reshaped paths keep their rest data here; one clip, made on first use, serves every part.
  const rest = new Map();
  let clipRect = null;
  const clipTo = (x, y) => {
    if (!clipRect) {
      const NS = 'http://www.w3.org/2000/svg', doc = svg.ownerDocument, cp = doc.createElementNS(NS, 'clipPath');
      cp.setAttribute('id', `kl-clip-${Math.random().toString(36).slice(2, 10)}`);
      cp.setAttribute('clipPathUnits', 'userSpaceOnUse');
      clipRect = doc.createElementNS(NS, 'rect');
      for (const [k, v] of [['x', -6], ['y', -6]]) clipRect.setAttribute(k, v);
      cp.appendChild(clipRect);
      let defs = svg.querySelector('defs');
      if (!defs) { defs = doc.createElementNS(NS, 'defs'); svg.insertBefore(defs, svg.firstChild); }
      defs.appendChild(cp);
    }
    clipRect.setAttribute('width', x == null ? 36 : f(Math.max(0, x + 6)));
    clipRect.setAttribute('height', y == null ? 36 : f(Math.max(0, y + 6)));
    return clipRect.parentNode.getAttribute('id');
  };

  function paint(t, done) {
    const pose = {};
    for (const p of parts) {
      p.gs.forEach((grp, i) => {
        let q = done ? {} : p.E.pose(p.spec, t, i, p.gs.length) || {};
        if (q.w != null && fill) q = { a: q.w, s: 0.7 + 0.3 * q.w };
        for (const n of grp) pose[n] = mergePose(pose[n] || {}, { ...q, o: p.o });
      });
    }
    for (const n of names) {
      const q = pose[n] || {};
      for (const el of nodes[n]) {
        el.setAttribute('transform', transform(q));
        if (q.a != null || ghost[n]) el.setAttribute('opacity', f(clamp(q.a ?? 0)));
        else el.removeAttribute('opacity');
        if (q.w != null && !fill) {
          el.setAttribute('stroke-dasharray', `${f(clamp(q.w))} 2`);
          el.setAttribute('stroke-opacity', q.w < 0.01 ? 0 : 1);
        } else { el.removeAttribute('stroke-dasharray'); el.removeAttribute('stroke-opacity'); }
        const gx = q.gx ?? 1, gy = q.gy ?? 1, bent = Math.abs(gx - 1) > 1e-6 || Math.abs(gy - 1) > 1e-6;
        if (bent || rest.size) {
          for (const p of pathsOf(el)) {
            if (!bent && !rest.has(p)) continue;
            if (!rest.has(p)) rest.set(p, p.getAttribute('d'));
            const [ox, oy] = q.o || [12, 12];
            const d = bent ? scalePath(rest.get(p), gx, gy, ox, oy) : rest.get(p);
            if (p.getAttribute('d') !== d) p.setAttribute('d', d);
          }
        }
        if (q.clip != null || q.clipY != null) el.setAttribute('clip-path', `url(#${clipTo(q.clip, q.clipY)})`);
        else el.removeAttribute('clip-path');
      }
    }
  }

  let frame = 0, t0 = 0, running = false, hovered = false;
  const stop = () => { caf(frame); running = false; paint(0, true); };
  const tick = (now) => {
    const t = now - t0;
    if (loops) {
      const P = span;
      if (!hovered && t >= Math.ceil(Math.max(t, 1) / P) * P - 16) { stop(); return; }
      paint(t, false);
    } else {
      if (t >= span) { stop(); return; }
      paint(t, false);
    }
    frame = raf(tick);
  };
  return {
    play() {
      if (reduced || !parts.length) return;
      if (running && loops) return;
      caf(frame); running = true; t0 = performance.now(); frame = raf(tick);
    },
    hover(on) {
      hovered = Boolean(on);
      if (hovered) this.play();
    },
    /** Paint the pose at t ms (for checks and video frames). */
    at(t) { if (t >= span && !loops) paint(0, true); else paint(t, false); },
    get length() { return span; },
    get loops() { return loops; }
  };
}

