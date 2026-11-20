// @vitest-environment jsdom
// The reduced-motion setting is followed as it changes, without a reload: a stand-in for
// matchMedia is installed before the runtime loads, and flipped while the page is open.
import { beforeAll, describe, expect, it } from 'vitest';

const query = { matches: false, media: '(prefers-reduced-motion: reduce)', addEventListener() {}, removeEventListener() {} };
// Frames never run here, so an animated change leaves the markup as it was.
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

let core, duo;
beforeAll(async () => {
  window.matchMedia = globalThis.matchMedia = () => query;
  core = await import('kubai-icons');
  duo = await import('kubai-icons/duotone');
});

const mount = (lib, icon) => {
  const host = document.body.appendChild(document.createElement('div'));
  host.innerHTML = lib.toSvg(icon);
  const svg = host.querySelector('svg');
  return { svg, ctl: core.animate(svg, icon) };
};

describe('reduced motion', () => {
  for (const [style, lib] of [['layered', () => core], ['two-tone', () => duo]]) {
    it(`switches ${style} icons to instant poses when the setting turns on, and back when it turns off`, () => {
      query.matches = false;
      const { svg, ctl } = mount(lib(), lib().Folder);
      const rest = svg.innerHTML;
      ctl.hover(true);
      expect(svg.innerHTML).toBe(rest);

      query.matches = true;
      ctl.hover(false);
      ctl.hover(true);
      const held = svg.innerHTML;
      expect(held).not.toBe(rest);
      ctl.hover(false);
      expect(svg.innerHTML).not.toBe(held);

      query.matches = false;
      const before = svg.innerHTML;
      ctl.hover(true);
      expect(svg.innerHTML).toBe(before);
      ctl.destroy();
    });
  }
});
