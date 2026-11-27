// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createSSRApp, h } from 'vue';
import { renderToString as vueToString } from 'vue/server-renderer';
import { createIcon, toSvg, Lock as lock, Camera as camera, Eye as eye } from 'kubai-icons/line';
import { Lock as layeredLock } from 'kubai-icons';
import { loadIcon, names } from 'kubai-icons/line/dynamic';
import { lineMarkup, lineStroke, LINE_STROKE } from '../packages/core/src/line.js';
import * as pkgMotion from '../packages/core/src/line-motion.js';
import * as skillMotion from '../styles/line/motion.mjs';
import { render } from '../styles/line/kit.mjs';
import { ICONS } from '../styles/line/icons.mjs';
import { Lock as ReactLock } from 'kubai-icons-react/line';
import { Lock as VueLock } from 'kubai-icons-vue/line';

const root = path.resolve(__dirname, '..');
const meta = JSON.parse(fs.readFileSync(path.join(root, 'packages/core/dist/line/icons.json'), 'utf8'));
const sources = fs.readdirSync(path.join(root, 'icons-line')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));
const def = (name) => JSON.parse(fs.readFileSync(path.join(root, 'icons-line', `${name}.json`), 'utf8'));
const VARIANTS = ['outline', 'line-duo', 'fill', 'solid-tint'];
const GEO = [1.5, 2, 2.5];

describe('kubai-icons/line', () => {
  it('ships every imported icon, by the same name as the layered one where it exists', () => {
    expect(names.sort()).toEqual(sources.sort());
    expect(meta.map((m) => m.name).sort()).toEqual(sources.sort());
    expect(sources.length).toBe(Object.keys(ICONS).length);
    const layered = new Set(JSON.parse(fs.readFileSync(path.join(root, 'packages/core/dist/icons.json'), 'utf8')).map((m) => m.name));
    for (const m of meta) expect(layered.has(m.name)).toBe(!m.only);
    expect(lock.name).toBe(layeredLock.name);
  });

  it('stays in step with the skill it was drawn with', () => {
    expect(() => execFileSync('node', ['tools/line-import.mjs', '--check'], { cwd: root, stdio: 'pipe' })).not.toThrow();
  });

  it('draws every icon exactly as the skill does, in every variant at every kept stroke', () => {
    // The package redraws icons from the imported layers; the skill is where they were checked.
    // Any drift between the two renderers shows up here as a changed icon.
    const colors = { dark: '#111111', light: '#888888', fill: '#DDDDDD' };
    const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    const differ = [];
    for (const name of sources) {
      const d = def(name);
      for (const s of GEO) for (const variant of VARIANTS) {
        const want = inner(render(ICONS[name], { s, variant, motion: true, id: '__K__', color: colors.dark, tones: colors }));
        if (lineMarkup(d, { s, variant, colors }) !== want) differ.push(`${name} ${variant} ${s}`);
      }
    }
    expect(differ).toEqual([]);
  });

  it('draws any stroke above 0 with the nearest kept geometry', () => {
    // no range or step is imposed: the site's slider keeps to LINE_STROKE, the code does not
    expect(lineStroke(0.1)).toBe(0.1);
    expect(lineStroke(9)).toBe(9);
    expect(lineStroke(1.8)).toBe(1.8);
    expect(lineStroke('x')).toBe(LINE_STROKE.regular);
    expect(lineStroke(0)).toBe(LINE_STROKE.regular);
    expect(lineStroke(-1)).toBe(LINE_STROKE.regular);
    const d = def('lock');
    const at = (s) => lineMarkup(d, { s });
    // 1.25 uses the 1.5 geometry at width 1.25; 2.75 the 2.5 geometry
    expect(at(1.25)).toBe(lineMarkup(d, { s: 1.5 }).replaceAll('stroke-width="1.5"', 'stroke-width="1.25"'));
    expect(at(2.75)).toBe(lineMarkup(d, { s: 2.5 }).replaceAll('stroke-width="2.5"', 'stroke-width="2.75"'));
  });

  it('renders on the 24 grid in lines that follow CSS', () => {
    const s = toSvg(lock, { color: '#0EA5E9' });
    expect(s).toContain('viewBox="0 0 24 24"');
    expect(s).toContain('kubai-line');
    expect(s).toContain('color:#0EA5E9');
    expect(s).toContain('stroke="currentColor"');
    expect(s).toContain('stroke-width="2"');
    expect(s).not.toContain('__K__');
    expect(s).not.toContain('--ki-');
    const bold = toSvg(lock, { strokeWidth: 2.5, variant: 'solid-tint' });
    expect(bold).toContain('stroke-width="2.5"');
    expect(bold).toContain('--kl-fill');
    expect(toSvg(lock, { variant: 'line-duo' })).toContain('--kl-light');
  });

  it('gives each instance its own mask ids', () => {
    const ids = (s) => [...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const withMasks = sources.map((n) => def(n)).find((d) => lineMarkup(d).includes('<mask'));
    const ic = { name: withMasks.name, viewBox: '0 0 24 24', style: 'line', line: withMasks, markup: lineMarkup(withMasks), tap: false };
    const a = ids(toSvg(ic)), b = ids(toSvg(ic));
    expect(a.length).toBeGreaterThan(0);
    expect(a.some((id) => b.includes(id))).toBe(false);
  });

  it('plays the same motion as the skill', () => {
    expect(Object.keys(pkgMotion.EFFECTS).sort()).toEqual(Object.keys(skillMotion.EFFECTS).sort());
    for (const name of sources) {
      for (const spec of [].concat(def(name).fx || [])) {
        const P = pkgMotion.EFFECTS[spec.t], S = skillMotion.EFFECTS[spec.t];
        expect(P.len(spec, 2)).toBe(S.len(spec, 2));
        for (const t of [0, 60, 180, 400, 900]) expect(P.pose(spec, t, 0, 2)).toEqual(S.pose(spec, t, 0, 2));
      }
    }
  });

  it('plays the hover motion without NaN and returns to rest', () => {
    const frames = [];
    vi.stubGlobal('requestAnimationFrame', (fn) => frames.push(fn));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const clock = vi.spyOn(performance, 'now').mockReturnValue(1000);
    const attrs = (svg) => [...svg.querySelectorAll('[data-l]')].flatMap((el) => ['transform', 'opacity', 'stroke-dasharray'].map((a) => el.getAttribute(a) || ''));
    try {
      for (const ic of [lock, camera, eye]) {
        const svg = createIcon(ic);
        frames.length = 0;
        svg.kubai.hover(true);
        frames.shift()(1120);
        expect(attrs(svg).some((v) => v.includes('translate'))).toBe(true);
        expect(attrs(svg).filter((v) => v.includes('NaN'))).toEqual([]);
        svg.kubai.hover(false);
        while (frames.length) frames.shift()(60000);
        expect(attrs(svg).filter((v) => v.includes('NaN'))).toEqual([]);
        expect(attrs(svg).filter((v) => v.includes('scale') && !v.includes('scale(1 1)'))).toEqual([]);
      }
    } finally {
      clock.mockRestore();
      vi.unstubAllGlobals();
    }
  });

  it('rotates masked fill marks about their actual centre across strokes', () => {
    const cases = [
      ['clipboard-plus', 'outline', 2, '12 14'],
      ['clipboard-plus', 'fill', 1.5, '12 15.238'],
      ['clipboard-plus', 'fill', 2, '12 15.758'],
      ['clipboard-plus', 'fill', 2.5, '12 15.278'],
      ['clipboard-x', 'outline', 2, '12 14.5'],
      ['clipboard-x', 'fill', 1.5, '12 14.584'],
      ['clipboard-x', 'fill', 2, '12 15.194'],
      ['clipboard-x', 'fill', 2.5, '12 14.804']
    ];
    for (const [name, variant, s, origin] of cases) {
      const d = def(name);
      for (const attach of [pkgMotion.attach, skillMotion.attach]) {
        const wrap = document.createElement('div');
        wrap.innerHTML = `<svg data-variant="${variant}">${lineMarkup(d, { s, variant })}</svg>`;
        const svg = wrap.firstElementChild;
        const m = attach(svg, d.fx);
        m.at(120);
        const tf = svg.querySelector('[data-l="mark"]').getAttribute('transform');
        expect(tf, `${name} ${variant} s=${s}`).toContain(`translate(${origin})`);
      }
    }
  });

  it('loads icons by name', async () => {
    expect((await loadIcon('lock')).name).toBe('lock');
    await expect(loadIcon('nope')).rejects.toThrow();
  });
});

describe('line components', () => {
  it('render in React on the server, with a stroke width and variant', () => {
    const html = renderToString(createElement(ReactLock, { size: 32, color: 'tomato', title: 'Locked', strokeWidth: 1.5, variant: 'fill' }));
    expect(html).toContain('viewBox="0 0 24 24"');
    expect(html).toContain('color:tomato');
    expect(html).toContain('<title>Locked</title>');
    expect(html).toContain('kubai-line');
    expect(html).not.toContain('stroke-width="2"');
  });

  it('render in Vue on the server', async () => {
    const html = await vueToString(createSSRApp({ render: () => h(VueLock, { size: 28, strokeWidth: 2.5 }) }));
    expect(html).toContain('viewBox="0 0 24 24"');
    expect(html).toContain('kubai-line');
    expect(html).toContain('stroke-width="2.5"');
  });
});

describe('kubai-icons-static svg-line', () => {
  it('has one standalone file per icon in currentColor, without motion-only parts', () => {
    const dir = path.join(root, 'packages/static/svg-line');
    expect(fs.readdirSync(dir).length).toBe(sources.length);
    for (const f of fs.readdirSync(dir)) {
      const svg = fs.readFileSync(path.join(dir, f), 'utf8');
      expect(svg).not.toMatch(/data-l|pathLength|__K__|opacity="0"/);
    }
    expect(fs.readFileSync(path.join(dir, 'lock.svg'), 'utf8')).toContain('stroke="currentColor"');
  });
});
