// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Motion for the SF-style line set (线性·SF 风格). No imports, so a page can carry it as is.
//
// Effects follow the presets of SF Symbols, driven by damped springs instead of fixed curves,
// so every move settles with a small, natural overshoot. Each icon picks the effect that acts
// out what it means (icons.mjs, fx), and can aim it at some of its layers:
//
//   bounce    hops once from a base point and lands with a squash     (home, map pin, people)
//   beat      two quick beats about a point                           (heart)
//   wiggle    swings about a pivot and dies away                      (bell, bag, moon)
//   shake     quick side-to-side jitter                               (phone ringing)
//   rotate    turns by deg and settles                                (gear, refresh, clock hands)
//   flip      spins about the vertical axis                           (star, the globe's meridian)
//   orbit     travels round a small circle                            (search, pencil)
//   draw      strokes are drawn on in order                           (text lines, arrows, ticks)
//   variable  parts light up in turn, iterative or cumulative; loops  (wifi, volume, typing dots)
//   keys      keyframes for x, y, r, s, sx, sy, a; springs back home  (a lid, a knob, a shutter)
//   from      starts away from rest (x, y, r, s, sx, sy, a) and springs into place: the
//             moment a state is reached                               (a shackle locking, a
//                                                                     bookmark ribbon growing)
//
// One-shot effects play once per hover. variable loops while hovered and finishes its cycle when
// the pointer leaves. Every effect returns to rest: nothing is left moved.
//
// Render with render(icon, { motion: true }) so layers carry data-l, then:
//   const m = attach(svg, icon.fx);   m.play();   m.hover(true | false);   m.at(ms) (for tests)

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

const REST = { x: 0, y: 0, r: 0, s: 1, sx: 1, sy: 1, a: 1, w: 1 };
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
      for (const key of ['x', 'y', 'r', 's', 'sx', 'sy']) if (p[key] != null) out[key] = REST[key] + (p[key] - REST[key]) * k;
      if (p.a != null) out.a = p.a + (1 - p.a) * easeOut(u / 0.18);
      return out;
    }
  },
  keys: {
    len(p) {
      if (p.ms) return p.ms + HOME * 1000;
      const k = Math.max(1, ...['x', 'y', 'r', 's', 'sx', 'sy', 'a'].map((key) => (Array.isArray(p[key]) ? p[key].length : 0)));
      return 190 + (k - 1) * SEG + HOME * 1000 + (p.by ? 70 : 0);
    },
    pose(p, t, i) {
      const keys = ['x', 'y', 'r', 's', 'sx', 'sy', 'a'].filter((k) => p[k] != null);
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
  }
};

const mergePose = (a, b) => ({
  x: (a.x ?? 0) + (b.x ?? 0), y: (a.y ?? 0) + (b.y ?? 0), r: (a.r ?? 0) + (b.r ?? 0),
  s: (a.s ?? 1) * (b.s ?? 1), sx: (a.sx ?? 1) * (b.sx ?? 1), sy: (a.sy ?? 1) * (b.sy ?? 1),
  a: a.a == null ? b.a : b.a == null ? a.a : a.a * b.a, w: a.w == null ? b.w : b.w == null ? a.w : Math.min(a.w, b.w),
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
  return spec.by || spec.t === 'draw' || spec.t === 'variable' ? list : [list.flat()];
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
  // The centre of a part, for effects that turn it about itself (a badge).
  const centre = (name) => {
    const el = find(name).find((e) => !e.closest('mask'));
    if (!el || !el.getBBox) return [12, 12];
    const b = el.getBBox(); return [b.x + b.width / 2, b.y + b.height / 2];
  };
  const parts = list.map((spec) => {
    const gs = groups(spec), E = EFFECTS[spec.t];
    if (!E) throw new Error(`Unknown effect ${spec.t}`);
    return { spec, gs, E, len: E.len(spec, gs.length), o: spec.oBadge ? centre(gs[0][0]) : spec.o };
  });
  const names = [...new Set(parts.flatMap((p) => p.gs.flat()))];
  const nodes = Object.fromEntries(names.map((n) => [n, find(n)]));
  const ghost = Object.fromEntries(names.map((n) => [n, nodes[n].some((e) => e.getAttribute('opacity') === '0')]));
  const loops = parts.some((p) => p.E.loop);
  const span = Math.max(...parts.map((p) => p.len));

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

/**
 * Magic replace: swaps the icon in `host` for the markup `next`, the way SF Symbols does.
 * Parts both icons share stay where they are; a slash is drawn on or off along its length (its
 * clear band grows with it); a badge pops in or out; other parts that differ scale down and out,
 * and the new ones scale up and in.
 */
export function replace(host, next, { ms = 420 } = {}) {
  const from = host.querySelector('svg');
  const wrap = document.createElement('div');
  wrap.innerHTML = next;
  const to = wrap.firstElementChild;
  if (!from) { host.appendChild(to); return to; }
  const top = (svg) => [...svg.querySelectorAll('[data-l]')].filter((e) => !e.closest('mask') && e.getAttribute('data-l') !== 'all');
  const sig = (svg) => {
    const m = {};
    for (const e of top(svg)) { const k = e.getAttribute('data-l'); m[k] = (m[k] || '') + e.innerHTML.replace(/ (id|mask)="[^"]*"/g, ''); }
    return m;
  };
  const A = sig(from), B = sig(to);
  const gone = Object.keys(A).filter((k) => A[k] !== B[k]), come = Object.keys(B).filter((k) => B[k] !== A[k]);
  const all = (svg, k) => [...svg.querySelectorAll(`[data-l="${k}"]`)];
  const box = (svg, k) => { const e = top(svg).find((x) => x.getAttribute('data-l') === k); const b = e.getBBox(); return [b.x + b.width / 2, b.y + b.height / 2]; };
  const drawn = (k) => k === 'slash';
  const removeOnly = come.length === 0 && gone.every(drawn);
  host.style.position = 'relative';
  to.style.position = 'absolute'; to.style.left = '0'; to.style.top = '0';
  host.appendChild(to);
  const t0 = performance.now();
  const setW = (svg, k, w) => all(svg, k).forEach((e) => { e.setAttribute('stroke-dasharray', `${f(w)} 2`); e.setAttribute('stroke-opacity', w < 0.01 ? 0 : 1); });
  const setS = (svg, k, s, a, o) => all(svg, k).forEach((e) => { e.setAttribute('transform', transform({ s, o })); e.setAttribute('opacity', f(clamp(a))); });
  const cg = Object.fromEntries(gone.map((k) => [k, box(from, k)])), cc = Object.fromEntries(come.map((k) => [k, box(to, k)]));
  // The new icon shows its shared parts at once; the old one keeps only what is leaving.
  if (removeOnly) to.style.visibility = 'hidden';
  else for (const e of top(from)) if (!gone.includes(e.getAttribute('data-l'))) e.style.visibility = 'hidden';
  const step = (now) => {
    const t = now - t0, u = t / ms;
    for (const k of gone) {
      if (drawn(k)) setW(from, k, 1 - easeOut(u * 1.15));
      else setS(from, k, 1 - 0.5 * easeOut(u * 1.6), 1 - easeOut(u * 1.8), cg[k]);
    }
    if (!removeOnly) for (const k of come) {
      if (drawn(k)) setW(to, k, easeOut((t - 60) / (ms - 60)));
      else { const v = (t - 90) / 1000; setS(to, k, v <= 0 ? 0.5 : 1 - 0.5 * settle(v, 2.4, 0.5), clamp(v * 6), cc[k]); }
    }
    if (t < ms + 280) requestAnimationFrame(step);
    else {
      from.remove(); to.style.position = ''; to.style.visibility = '';
      for (const k of come) all(to, k).forEach((e) => ['transform', 'opacity', 'stroke-dasharray', 'stroke-opacity'].forEach((a) => e.removeAttribute(a)));
    }
  };
  if (!removeOnly) for (const k of come) drawn(k) ? setW(to, k, 0) : setS(to, k, 0.5, 0, cc[k]);
  requestAnimationFrame(step);
  return to;
}
