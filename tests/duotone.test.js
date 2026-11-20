// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createSSRApp, h } from 'vue';
import { renderToString as vueToString } from 'vue/server-renderer';
import { createIcon, toSvg, Folder as folder, Mail as mail, Lightbulb as bulb, BellOff as bellOff, Mic as mic, Trash as trash, Music as music, Bell as bell } from 'kubai-icons/duotone';
import { Folder as layeredFolder } from 'kubai-icons';
import { loadIcon, names } from 'kubai-icons/duotone/dynamic';
import { Folder as ReactFolder, SearchSparkle } from 'kubai-icons-react/duotone';
import { Folder as VueFolder } from 'kubai-icons-vue/duotone';

const root = path.resolve(__dirname, '..');
const meta = JSON.parse(fs.readFileSync(path.join(root, 'packages/core/dist/duotone/icons.json'), 'utf8'));
const sources = fs.readdirSync(path.join(root, 'icons-duotone')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));

describe('kubai-icons/duotone', () => {
  it('ships every imported icon, by the same name as the layered one where it exists', () => {
    expect(names.sort()).toEqual(sources.sort());
    expect(meta.map((m) => m.name).sort()).toEqual(sources.sort());
    const layered = new Set(JSON.parse(fs.readFileSync(path.join(root, 'packages/core/dist/icons.json'), 'utf8')).map((m) => m.name));
    for (const m of meta) expect(layered.has(m.name)).toBe(!m.only);
    expect(folder.name).toBe(layeredFolder.name);
  });

  it('stays in step with the skill it was drawn with', () => {
    expect(() => execFileSync('node', ['tools/duotone-import.mjs', '--check'], { cwd: root, stdio: 'pipe' })).not.toThrow();
  });

  it('renders on the 16 grid in two tones that follow CSS', () => {
    const s = toSvg(folder, { color: '#0EA5E9', variant: 'soft', badgeColor: 'semantic' });
    expect(s).toContain('viewBox="0 0 16 16"');
    expect(s).toContain('kubai-duotone');
    expect(s).toContain('color:#0EA5E9');
    expect(s).toContain('fill="currentColor"');
    expect(s).toContain('color-mix(in srgb,currentColor 40%,#fff)');
    // The layered variants and badge ink don't apply.
    expect(s).not.toContain('--ki-');
    expect(s).not.toContain('__K__');
  });

  it('gives each instance its own mask ids', () => {
    const ids = (s) => [...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const a = ids(toSvg(mail)), b = ids(toSvg(mail));
    expect(a.length).toBeGreaterThan(0);
    expect(a.some((id) => b.includes(id))).toBe(false);
  });

  it('starts parts that only show on hover hidden, before any script runs', () => {
    const s = toSvg(bulb);
    expect(s).toMatch(/data-l="a0"[^>]*opacity="0"/);
  });

  it('plays the hover motion and returns to rest', () => {
    const svg = createIcon(bellOff);
    document.body.append(svg);
    const slash = () => svg.querySelector('[data-l="2"]');
    svg.kubai.hover(true, true);
    expect(slash().getAttribute('stroke-dasharray')).toBe('1 2');
    svg.kubai.hover(false, true);
    expect(slash().getAttribute('stroke-dasharray')).toBe('1 2');
    const sheet = createIcon(folder);
    sheet.kubai.hover(true, true);
    expect(sheet.querySelector('[data-l="0"]').getAttribute('transform')).toContain('translate(8 3.5)');
    sheet.kubai.hover(false, true);
    expect(sheet.querySelector('[data-l="0"]').getAttribute('transform')).toContain('translate(8 8)');
  });

  it('never writes NaN when a frame is stamped before the motion starts', () => {
    // requestAnimationFrame can pass a timestamp a little earlier than the performance.now()
    // read when hover changed. That first frame must hold the start pose, not index before
    // the first keyframe.
    const frames = [];
    vi.stubGlobal('requestAnimationFrame', (fn) => frames.push(fn));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const clock = vi.spyOn(performance, 'now').mockReturnValue(1000);
    const attrs = (svg) => [...svg.querySelectorAll('[data-l]')].flatMap((el) => ['transform', 'opacity', 'stroke-dasharray'].map((a) => el.getAttribute(a) || ''));
    try {
      for (const ic of [folder, mic, trash, music, bell]) {
        const svg = createIcon(ic);
        for (const on of [true, false]) {
          frames.length = 0;
          svg.kubai.hover(on);
          frames.shift()(990);
          const written = attrs(svg);
          expect(written.some((v) => v.includes('translate'))).toBe(true);
          expect(written.filter((v) => v.includes('NaN'))).toEqual([]);
          frames.shift()(5000);
          expect(attrs(svg).filter((v) => v.includes('NaN'))).toEqual([]);
        }
      }
    } finally {
      clock.mockRestore();
      vi.unstubAllGlobals();
    }
  });

  it('loads icons by name', async () => {
    expect((await loadIcon('folder')).name).toBe('folder');
    await expect(loadIcon('nope')).rejects.toThrow();
  });
});

describe('two-tone components', () => {
  it('render in React on the server', () => {
    const html = renderToString(createElement(ReactFolder, { size: 32, color: 'tomato', title: 'Files' }));
    expect(html).toContain('viewBox="0 0 16 16"');
    expect(html).toContain('color:tomato');
    expect(html).toContain('<title>Files</title>');
    expect(renderToString(createElement(SearchSparkle))).toContain('kubai-icon-search-sparkle');
  });

  it('render in Vue on the server', async () => {
    const html = await vueToString(createSSRApp({ render: () => h(VueFolder, { size: 28 }) }));
    expect(html).toContain('viewBox="0 0 16 16"');
    expect(html).toContain('kubai-duotone');
  });
});

describe('kubai-icons-static svg-duotone', () => {
  it('has one standalone file per icon, in the default colours, without motion-only parts', () => {
    const dir = path.join(root, 'packages/static/svg-duotone');
    expect(fs.readdirSync(dir).length).toBe(sources.length);
    const bulbSvg = fs.readFileSync(path.join(dir, 'lightbulb.svg'), 'utf8');
    expect(bulbSvg).toContain('#5A76F2');
    expect(bulbSvg).toContain('#BDC8FA');
    expect(bulbSvg).not.toContain('data-l');
    expect(bulbSvg).not.toContain('currentColor');
  });
});
