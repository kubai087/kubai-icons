// @vitest-environment jsdom
// The looping walls run only while on screen, stop when the visitor pauses them, and follow
// the reduced-motion setting as it changes, without a reload.
import { beforeAll, describe, expect, it } from 'vitest';
import { act, createElement, useRef } from 'react';
import { createRoot } from 'react-dom/client';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// A stand-in for the reduced-motion query that can change while the page is open.
const changes = new Set<() => void>();
const query = {
  matches: false,
  addEventListener: (_: string, fn: () => void) => changes.add(fn),
  removeEventListener: (_: string, fn: () => void) => changes.delete(fn),
};
const setReduced = (on: boolean) => { query.matches = on; changes.forEach((fn) => fn()); };

// A stand-in for IntersectionObserver that reports what the test says is on screen.
let report: (on: boolean) => void = () => {};
class Observer {
  constructor(private fn: (entries: { isIntersecting: boolean }[]) => void) { report = (on) => this.fn([{ isIntersecting: on }]); }
  observe() {}
  disconnect() {}
}

let wall: typeof import('../site/src/lib/wall-motion');
beforeAll(async () => {
  window.matchMedia = (() => query) as unknown as typeof window.matchMedia;
  window.IntersectionObserver = Observer as unknown as typeof IntersectionObserver;
  wall = await import('../site/src/lib/wall-motion');
});

function mount() {
  const seen: boolean[] = [];
  function Wall() {
    const ref = useRef<HTMLDivElement>(null);
    seen.push(wall.useWallLoop(ref));
    return createElement('div', { ref });
  }
  const host = document.body.appendChild(document.createElement('div'));
  act(() => createRoot(host).render(createElement(Wall)));
  return () => seen[seen.length - 1];
}

describe('wall motion', () => {
  it('runs on screen, stops when paused or with reduced motion, and starts again without a reload', () => {
    const running = mount();
    expect(running()).toBe(false);
    act(() => report(true));
    expect(running()).toBe(true);

    act(() => wall.setWallsPaused(true));
    expect(running()).toBe(false);
    expect(sessionStorage.getItem('kubai-walls-paused')).toBe('1');
    act(() => wall.setWallsPaused(false));
    expect(running()).toBe(true);
    expect(sessionStorage.getItem('kubai-walls-paused')).toBe(null);

    act(() => setReduced(true));
    expect(running()).toBe(false);
    act(() => setReduced(false));
    expect(running()).toBe(true);

    act(() => report(false));
    expect(running()).toBe(false);
  });

  it('keeps the pause when storage is blocked', () => {
    const running = mount();
    act(() => report(true));
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
    try {
      act(() => wall.setWallsPaused(true));
      expect(running()).toBe(false);
    } finally {
      Storage.prototype.setItem = setItem;
      act(() => wall.setWallsPaused(false));
    }
  });
});
