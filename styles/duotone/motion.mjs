// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Hover motion for the two-tone solid style (双色面性), on the same rhythm as the kubai-icons
// cartoon set: one eased-out motion to a pose that holds while hovered, and the same curve back
// on leave. kubai-icons runs 460ms on cubic-bezier(.22, 1, .36, 1); here that looked rushed (the
// curve covers three quarters of the move in the first quarter of the time), so the motion runs
// 650ms on the gentler cubic-bezier(.33, 1, .68, 1). Amplitudes stay small: moves of 0.5–1.5 on the
// 16 grid, turns of 5–20°, scales of 0.8–1.2.
//
// Every motion is something the object really does: a lid lifts, a page is torn off or turned,
// the minute hand goes round once while the hour hand moves one step, a door opens. Parts move
// the way they are joined in life (a lid turns about its hinge, a bag swings from its handle).
// No motion is a bare zoom or pulse that the object could not do; pick another action instead.
//
// MOTION[name] = { say, moves, copy?, ms? }. say is one Chinese line on what happens. moves maps a
// layer index (or 'all' for the whole drawing) to a pose:
//   x, y     move           r   turn in degrees   s, sx, sy   scale (rest 1)   a   opacity
//   w        how much of a stroke is drawn (rest 1), for a mark written by hand
//   o        [x, y] the point turns and scales are about (default [8, 8])
// A value is either the pose held on hover, or a list of keyframes run across the motion and
// ending on the held pose, for a swing that settles or a beat. Keyframes are spaced evenly in
// time, each step eased in and out and the last one eased out; every step after the first adds
// STEP ms, so a bell that swings and settles takes longer than a lid that lifts once. A quick
// shake (a phone buzzing) sets its own total with ms.
// copy: [{ of: [layer indexes], at? }] draws copies of those layers, exactly on top of them, at
// position at in the layer list (default: on top of everything). They are named c0, c1, … in
// moves. At rest a copy hides behind nothing and changes nothing; it is there to be torn off or
// turned over while the original stays, the way the next page is under the one you turn.
//
// Render with render(withMotion(icon, MOTION[name]), { motion: true }) so the layers carry
// data-l; then animate(svg, MOTION[name]) returns { hover(on) }.

/** The icon with every layer named by its index, plus the copies the motion asks for. */
export function withMotion(icon, spec) {
  const layers = icon.layers.map((l, i) => ({ ...l, n: i, part: l.part ?? `#${i}` }));
  let k = 0;
  for (const c of spec?.copy || []) {
    const copies = c.of.map((i) => ({ ...layers[i], n: `c${k++}` }));
    layers.splice(c.at ?? layers.length, 0, ...copies);
  }
  return { ...icon, layers };
}

export const DURATION = 650;
export const STEP = 140;
export const BACK = 520;

export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-5) break;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(t);
  };
}
export const EASE = bezier(0.33, 1, 0.68, 1);

const REST = { x: 0, y: 0, r: 0, s: 1, sx: 1, sy: 1, a: 1, w: 1 };
const KEYS = Object.keys(REST);
const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// One key from `from` to v (a value or keyframes) at time share q.
function track(from, v, q) {
  const pts = [from, ...(Array.isArray(v) ? v : [v])], n = pts.length - 1;
  if (n === 1) return from + (pts[1] - from) * EASE(q);
  const k = Math.min(n - 1e-9, q * n), i = Math.floor(k), t = k - i;
  return pts[i] + (pts[i + 1] - pts[i]) * (i === n - 1 ? EASE(t) : inOut(t));
}
const steps = (p) => Math.max(1, ...KEYS.filter((k) => Array.isArray(p[k])).map((k) => p[k].length));
/** How long the hover motion of one icon runs, in ms. */
export const duration = (spec) => spec?.ms ?? DURATION + STEP * (Math.max(1, ...Object.values(spec?.moves || {}).map(steps)) - 1);
/** The values of one pose's keys at time share q, moving from `from` toward the hover pose (on) or rest. */
export function values(p, q, from = REST, on = true) {
  const o = {};
  for (const k of KEYS) if (k in p) o[k] = track(from[k] ?? REST[k], on ? p[k] : REST[k], q);
  return o;
}
const f = (v) => +v.toFixed(3);
/** The transform for a set of values. */
export function transform(p, v) {
  const g = (k) => (k in v ? v[k] : REST[k]);
  const [ox, oy] = p.o || [8, 8];
  const s = g('s'), sx = s * g('sx'), sy = s * g('sy');
  return `translate(${f(g('x') + ox)} ${f(g('y') + oy)}) rotate(${f(g('r'))}) scale(${f(sx)} ${f(sy)}) translate(${-ox} ${-oy})`;
}
/** The transform, opacity and stroke dash of one pose t of the way through its hover motion from rest. */
export function pose(p, t) {
  const v = values(p, t);
  return { transform: transform(p, v), opacity: 'a' in v ? f(v.a) : null, dash: 'w' in v ? `${f(v.w)} 2` : null };
}

/** Attaches hover motion to an <svg> rendered with motion: true. */
export function animate(svg, spec) {
  const raf = globalThis.requestAnimationFrame || ((fn) => setTimeout(() => fn(Date.now()), 16));
  const caf = globalThis.cancelAnimationFrame || clearTimeout;
  let reduced = false;
  try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* not a browser */ }
  const els = Object.keys(spec?.moves || {}).map((k) => ({ p: spec.moves[k], list: [...svg.querySelectorAll(`[data-l="${k}"]`)], cur: { ...REST } }));
  const long = duration(spec);
  let on = false, frame = 0;
  const paint = (el) => {
    const t = transform(el.p, el.cur);
    for (const node of el.list) {
      node.setAttribute('transform', t);
      if ('a' in el.p) node.setAttribute('opacity', f(el.cur.a));
      if ('w' in el.p) node.setAttribute('stroke-dasharray', `${f(el.cur.w)} 2`);
    }
  };
  return {
    hover(next) {
      if (Boolean(next) === on || !els.length) return;
      on = Boolean(next); caf(frame);
      // A motion cut short starts from where it is.
      const from = els.map((el) => ({ ...el.cur }));
      if (reduced) { for (const el of els) { el.cur = { ...REST, ...values(el.p, 1, REST, on) }; paint(el); } return; }
      const run = on ? long : BACK, t0 = performance.now();
      const tick = (t) => {
        const q = Math.min(1, (t - t0) / run);
        els.forEach((el, i) => { el.cur = { ...el.cur, ...values(el.p, q, from[i], on) }; paint(el); });
        if (q < 1) frame = raf(tick);
      };
      frame = raf(tick);
    },
    get hovered() { return on; }
  };
}

export const MOTION = {
  folder: { say: '从文件夹里抽出一张纸', moves: { 0: { y: -4.5 } } },
  'file-text': { say: '把最后一行写完', moves: { 2: { sx: 6 / 3.5, o: [5, 11.125] } } },
  calendar: {
    say: '撕下一页，下面是新的一页',
    copy: [{ of: [0, 1], at: 2 }],
    moves: { c0: { y: [0.5, 3], r: [6, 14], a: [1, 0], o: [14, 3.5] }, c1: { y: [0.5, 3], r: [6, 14], a: [1, 0], o: [14, 3.5] } }
  },
  camera: { say: '对焦时镜头伸出', moves: { 1: { s: 1.12, o: [8, 9] } } },
  lock: { say: '锁梁抬起，绕右脚转开', moves: { 0: { y: -1, r: 14, o: [11.25, 6.5] } } },
  user: { say: '抬头', moves: { 0: { y: -1 }, 1: { y: -0.4 } } },
  'id-card': { say: '拿起来出示', moves: { all: { y: -0.75, r: -6 } } },
  building: { say: '大门打开再关上', moves: { 2: { sx: [-0.5, 1], o: [7, 12.5] } } },
  'book-open': { say: '翻过一页', copy: [{ of: [1, 3] }], moves: { c0: { sx: -1 }, c1: { sx: -1 } } },
  bell: { say: '绕顶钮摆动后停住', moves: { all: { r: [14, -10, 6, -3, 0], o: [8, 2] } } },
  trash: { say: '盖子绕左端掀开', moves: { 0: { y: -0.75, r: -10, o: [2, 4] } } },
  gift: {
    say: '盒盖连同蝴蝶结掀起',
    moves: Object.fromEntries([0, 1, 2, 4].map((i) => [i, { y: -1.5, r: -6, o: [8, 7.75] }]))
  },
  smile: { say: '眼睛上扬，笑容变大', moves: { 1: { y: -0.5 }, 2: { sx: 1.2, sy: 1.1, o: [8, 9.25] } } },
  chat: { say: '继续输入第二行', moves: { 2: { sx: 1.6, o: [4, 9.625] } } },
  clock: { say: '分针走一圈，时针走一格', moves: { 1: { r: 360 }, 2: { r: 30 } } },
  image: { say: '太阳升起', moves: { 2: { y: -1.25 } } },
  ticket: { say: '票根撕开', moves: { 1: { x: 1, r: 8, o: [12, 13.5] } } },
  wallet: { say: '扣带拉开', moves: { 1: { x: 1 } } },
  headphones: { say: '耳罩向里夹紧', moves: { 1: { x: 0.6 }, 2: { x: -0.6 } } },
  mic: { say: '收音时振动', ms: 800, moves: { 0: { s: [1.04, 0.98, 1.02, 1], o: [8, 9.5] } } },
  cloud: { say: '云被风吹开，太阳露出来', moves: { 0: { x: 0.5, y: -1 }, 1: { x: -0.5 } } },
  'shopping-bag': { say: '提起来，绕提手晃一晃', moves: { all: { y: -0.75, r: [6, -4, 2, 0], o: [8, 2] } } },
  battery: { say: '接上电后电量充满', moves: { 1: { sx: [0.3, 1], o: [3.75, 8] } } },
  archive: { say: '盖子抬起', moves: { 0: { y: -1, r: -5, o: [8, 4] } } },
  mail: { say: '封口向上翻开', moves: { 1: { sy: -0.6, o: [8, 2.5] } } },
  printer: { say: '出纸', moves: { 2: { y: 1 } } },
  home: { say: '门向外打开再关上', moves: { 1: { sx: [-0.5, 1], o: [6.5, 12] } } },
  search: { say: '放大镜移来移去查看', moves: { all: { x: [-0.75, 0.75, 0], y: [0.5, -0.5, 0] } } },
  settings: { say: '齿轮转动', moves: { 0: { r: 90 } } },
  tv: { say: '开机，画面从一条线展开', moves: { 1: { sy: [0.15, 1], o: [8, 6.75] } } },
  bookmark: { say: '丝带被往下拉', moves: { 1: { sy: 1.25, o: [8.5, 1] } } },
  download: { say: '箭头落进盒子', moves: { 1: { y: [1.5, 0.75] } } },
  upload: { say: '箭头升起', moves: { 1: { y: [-1.5, -0.75] } } },
  share: { say: '箭头向右上推出', moves: { 1: { x: [1, 0.5], y: [-1, -0.5] }, 2: { x: [1, 0.5], y: [-1, -0.5] } } },
  edit: { say: '笔尖来回书写', moves: { all: { r: [-6, 4, -2, 0], o: [2, 14] } } },
  heart: { say: '跳动', moves: { all: { s: [1.14, 0.96, 1.06], o: [8, 8.5] } } },
  play: { say: '按钮按下再弹起', moves: { all: { s: [0.9, 1.02, 1] } } },
  phone: { say: '来电振动', ms: 900, moves: { all: { r: [-8, 8, -6, 6, -3, 3, 0], o: [8, 8] } } },
  laptop: { say: '屏幕合上一点再打开', moves: { 0: { sy: [0.7, 1.04, 1], o: [8, 10.5] } } },
  location: { say: '准星收紧，锁定位置', moves: { 1: { s: 0.85 }, 2: { s: [1.4, 1.15] } } },
  music: { say: '音符随节拍跳起', moves: { all: { y: -1, r: -6 } } },
  link: { say: '两节链环扣紧', moves: { 0: { sx: 0.9 } } },
  cart: { say: '向前推，车筐随之一颠', moves: { all: { x: [1, -0.4, 0] }, 0: { y: [-0.75, 0] } } },
  'circle-check': { say: '对勾重新写一遍', moves: { 1: { w: [0, 1] } } },
  'circle-plus': { say: '先写竖，再写横', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  'circle-x': { say: '两笔划出叉号', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  info: { say: '上面的点落下弹一下', moves: { 2: { y: [-1, 0.25, 0] } } },
  'circle-alert': { say: '感叹号左右摇晃示警', ms: 900, moves: { 1: { r: [-10, 8, -5, 3, 0], o: [8, 12.375] }, 2: { r: [-10, 8, -5, 3, 0], o: [8, 12.375] } } },
  'circle-help': { say: '问号歪向一边再回正', moves: { 1: { r: [-12, 0], o: [8, 12.375] }, 2: { r: [-12, 0], o: [8, 12.375] } } },
  eye: { say: '眨一下眼', moves: { all: { sy: [0.1, 1] } } },
  flag: { say: '旗面随风摆动', moves: { 1: { sx: [0.88, 1.04, 0.96, 1], o: [4.5, 4] } } },
  key: { say: '插进锁孔，转一下', moves: { all: { x: 0.75, sy: [1, 0.45, 1] } } },
  'credit-card': { say: '刷一下卡', moves: { all: { x: [1.5, -0.5, 0] } } },
  shield: { say: '挡下一击后弹回', moves: { all: { y: [0.5, -0.25, 0], s: [0.94, 1.02, 1], o: [8, 15] } } },
  lightbulb: { say: '通电后闪一下亮起来', moves: { 2: { a: [0.2, 1, 0.4, 1] } } },
  video: { say: '镜头向前伸出', moves: { 1: { x: 0.5 } } },
  users: { say: '后面的人探出身来', moves: { 0: { x: 0.5, y: -0.75 } } },
  globe: { say: '地球自转', moves: { 1: { sx: -1 } } },
  calculator: { say: '按下按键，屏幕闪一下', moves: { 2: { y: [0.3, 0] }, 1: { a: [0.4, 1] } } },
  history: { say: '箭头逆时针转一圈，分针倒退一圈，时针倒退一格', moves: { 0: { r: -360 }, 1: { r: -360 }, 2: { r: -360 }, 3: { r: -30 } } },
  'log-out': { say: '箭头从门里出去', moves: { 1: { x: [1, 0.5] } } },
  database: { say: '顶盖掀起再盖上', moves: { 1: { y: [-1, 0] } } },
  server: { say: '指示灯闪烁', moves: { 3: { a: [0.15, 1, 0.15, 1] } } },
  wifi: { say: '信号由内向外亮起', moves: { 2: { a: [0.3, 1, 1, 1] }, 1: { a: [0.3, 0.3, 1, 1] }, 0: { a: [0.3, 0.3, 0.3, 1] } } },
  power: { say: '按下电源键再弹起', moves: { all: { s: [0.9, 1.02, 1] } } },
  sliders: { say: '两个滑块各自滑到另一头', moves: { 1: { x: -3 }, 2: { x: 3 } } },
  copy: { say: '两张纸错开', moves: { 0: { x: 0.5, y: -0.5 }, 1: { x: -0.5, y: 0.5 } } },
  clipboard: { say: '夹子抬起再夹紧', moves: { 1: { y: [-0.75, 0] } } },
  inbox: { say: '托盘接住东西往下一沉', moves: { 1: { y: [0.5, 0] } } },
  receipt: { say: '把最后一行打完', moves: { 2: { sx: 6 / 3.5, o: [5, 10.125] } } },
  package: { say: '箱盖连同胶带掀开', moves: { 0: { y: -1, r: -8, o: [2, 5.5] }, 2: { y: -1, r: -8, o: [2, 5.5] } } },
  store: { say: '遮阳篷拉下再弹回', moves: { 0: { sy: [1.2, 1], o: [8, 2] } } },
  'lock-open': { say: '锁梁绕左脚晃开', moves: { 0: { r: [-12, 4, 0], o: [4.75, 7] } } }
};
