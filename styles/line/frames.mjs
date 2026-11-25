// Filmstrips of every hover and state-change motion, and a reach check: no frame may put ink
// outside 0..24.
// Bundled into frames.html by build.mjs; check.mjs screenshots it.
import { render } from './kit.mjs';
import { ALL } from './icons.mjs';
import { attach } from './motion.mjs';

const N = 10, SIZE = 48;
const only = globalThis.FRAMES_ONLY ?? new URLSearchParams(location.search).get('only');
const base = only ? only.split(',') : Object.keys(ALL).filter((n) => ALL[n].fx);
// hover motions, then the motions that play when a state is switched to (enter)
const jobs = [...base.map((n) => [n, ALL[n].fx, n]), ...base.filter((n) => ALL[n].enter).map((n) => [n, ALL[n].enter, `${n} · 切换到`])];
const variant = new URLSearchParams(location.search).get('variant') || 'outline';
const weight = new URLSearchParams(location.search).get('weight') || 'bold';
let uid = 0;
const report = [];
const host = document.getElementById('strips');
for (const [name, fx, title] of jobs) {
  const icon = ALL[name], row = document.createElement('div');
  row.className = 'row';
  row.innerHTML = `<b>${title}</b>`;
  host.appendChild(row);
  const probe = document.createElement('div');
  probe.innerHTML = render(icon, { motion: true, id: `p${uid++}`, size: SIZE, variant, weight });
  const len = attach(probe.firstChild, fx).length;
  let worst = 0;
  for (let k = 0; k < N; k++) {
    const t = (len * k) / (N - 1) * 0.98, cell = document.createElement('div');
    cell.className = 'cell';
    cell.innerHTML = render(icon, { motion: true, id: `f${uid++}`, size: SIZE, variant, weight, color: '#1E2235' });
    row.appendChild(cell);
    const svg = cell.firstChild, m = attach(svg, fx);
    m.at(t);
    // reach: ink outside the canvas, in 16-grid units
    const box = svg.getBoundingClientRect(), u = 24 / box.width;
    for (const p of svg.querySelectorAll('path')) {
      if (p.closest('mask') || p.closest('defs')) continue;
      // a part faded out (a plane that has flown off) is not ink
      let op = 1; for (let e = p; e && e !== svg; e = e.parentElement) op *= e.hasAttribute('opacity') ? +e.getAttribute('opacity') : 1;
      if (op < 0.05) continue;
      const M = p.getScreenCTM(), L = p.getTotalLength(), stroked = p.getAttribute('stroke') && p.getAttribute('stroke') !== 'none';
      const half = stroked ? ((+p.getAttribute('stroke-width') || 0) / 2) * Math.hypot(M.a, M.b) * u : 0;
      for (let i = 0; i <= 80; i++) {
        const q = p.getPointAtLength((L * i) / 80), x = (M.a * q.x + M.c * q.y + M.e - box.left) * u, y = (M.b * q.x + M.d * q.y + M.f - box.top) * u;
        worst = Math.max(worst, -x + half, x + half - 24, -y + half, y + half - 24);
      }
    }
  }
  const tag = document.createElement('span');
  tag.className = worst > 0.02 ? 'bad' : 'ok';
  tag.textContent = `${Math.round(len)}ms${worst > 0.02 ? ` · 超出 ${worst.toFixed(2)}` : ''}`;
  row.appendChild(tag);
  if (worst > 0.02) report.push({ name: title, out: +worst.toFixed(2) });
}
document.getElementById('out').textContent = JSON.stringify(report);
