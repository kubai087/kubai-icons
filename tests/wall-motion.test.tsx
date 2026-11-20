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

// A stand-in for IntersectionObserver that reports what the test says is on screen: every
// watched element, or the ones given.
const watched = new Set<Element>();
let report: (on: boolean, only?: Element[]) => void = () => {};
class Observer {
  constructor(private fn: (entries: { target: Element; isIntersecting: boolean }[]) => void) {
    report = (on, only) => this.fn((only ?? [...watched]).map((target) => ({ target, isIntersecting: on })));
  }
  observe(el: Element) { watched.add(el); }
  unobserve(el: Element) { watched.delete(el); }
  disconnect() { watched.clear(); }
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
  const root = createRoot(host);
  act(() => root.render(createElement(Wall)));
  const running = () => seen[seen.length - 1];
  running.unmount = () => act(() => root.unmount());
  return running;
}

const setHidden = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
  document.dispatchEvent(new Event('visibilitychange'));
};

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

  it('rests while the tab is hidden and runs again when it shows', () => {
    const running = mount();
    act(() => report(true));
    expect(running()).toBe(true);
    act(() => setHidden(true));
    expect(running()).toBe(false);
    act(() => setHidden(false));
    expect(running()).toBe(true);
    running.unmount();
  });

  it('tells each tile whether it is on screen itself', () => {
    const seen = new Map<string, boolean>();
    function Tile({ id }: { id: string }) {
      const ref = useRef<HTMLDivElement>(null);
      seen.set(id, wall.useOnScreen(ref));
      return createElement('div', { ref, id });
    }
    const host = document.body.appendChild(document.createElement('div'));
    const root = createRoot(host);
    act(() => root.render(createElement('div', null, createElement(Tile, { id: 'a' }), createElement(Tile, { id: 'b' }))));
    expect([seen.get('a'), seen.get('b')]).toEqual([false, false]);
    const a = document.getElementById('a')!, b = document.getElementById('b')!;
    act(() => report(true, [a]));
    expect([seen.get('a'), seen.get('b')]).toEqual([true, false]);
    act(() => { report(false, [a]); report(true, [b]); });
    expect([seen.get('a'), seen.get('b')]).toEqual([false, true]);
    // A tile taken off the page stops being watched.
    act(() => root.unmount());
    expect(watched.has(a) || watched.has(b)).toBe(false);
  });
});
