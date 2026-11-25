// Gallery page for the SF-style line set. Bundled into index.html by build.mjs.
import { render, WEIGHTS, FONT, PALETTES, keylineSvg, ROLE_NAME, mixTone, TONE } from './kit.mjs';
import { ICONS, VARIANTS, ALL } from './icons.mjs';
import { CATALOG, CATEGORY_ZH } from './catalog.mjs';

const CAT_OF = Object.fromEntries(CATALOG.map((e) => [e.name, e.category]));
const groupBy = (names) => { const g = {}; for (const n of names) (g[CAT_OF[n] ?? 'interface'] = g[CAT_OF[n] ?? 'interface'] || []).push(n); return g; };
import { attach, replace } from './motion.mjs';

const FX_NAME = { bounce: '弹跳', beat: '心跳', wiggle: '摇摆', shake: '震动', rotate: '旋转', flip: '翻转', orbit: '环绕', draw: '描绘', variable: '可变颜色', keys: '关键帧', from: '到位' };
const WEIGHT_NAME = { light: '细', regular: '常规', medium: '中等', bold: '粗' };
const state = { weight: 'regular', s: WEIGHTS.regular, variant: 'outline', mode: 'monochrome', palette: 'brand', size: 32, hue: 'ink', custom: '#5A76F2' };
// Colour (GUIDE.md §4.4). A hue sets every tone, dark, light and fill, by mixing toward the card
// colour, so it holds in dark mode too.
const HUES = { ink: null, brand: '#5A76F2', sky: '#1F95DB', green: '#1E9B6A', orange: '#E8673A', violet: '#8A5CF0' };
const BG = 'var(--icon-bg, #FFFFFF)';
function tonesOf() {
  const hue = state.hue === 'custom' ? state.custom : HUES[state.hue];
  if (!hue) return {};
  return { dark: hue, light: mixTone(hue, TONE.light, BG), fill: mixTone(hue, TONE.fill, BG) };
}
const colourOf = () => { const t = tonesOf(); return { color: t.dark ?? 'currentColor', tones: t, bg: BG }; };
let uid = 0;

const $ = (s, el = document) => el.querySelector(s);
export const ROLE_INK = { primary: 'currentColor', secondary: '#3D6BFF', detail: '#F2853A' };
const svgOf = (icon, o = {}) => render(icon, {
  s: state.s, variant: state.variant, mode: state.mode, colors: PALETTES[state.palette],
  roleColors: state.mode === 'roles' ? ROLE_INK : undefined, ...colourOf(),
  size: state.size, motion: true, id: `u${uid++}`, ...o
});
const fxLabel = (fx) => [...new Set([].concat(fx || []).map((e) => FX_NAME[e.t]))].join(' + ');

// --- tiles -------------------------------------------------------------------------------------
function tile(name, opts = {}) {
  const el = document.createElement('button');
  el.className = 'tile';
  el.type = 'button';
  el.dataset.name = name;
  el.dataset.variant = '';
  el.innerHTML = `<span class="glyph"></span><span class="nm">${name}</span><span class="lb">${ALL[name].label}</span>`;
  const glyph = $('.glyph', el);
  const show = () => {
    const icon = ALL[el.dataset.name];
    glyph.innerHTML = svgOf(icon, { ...opts, variant: el.dataset.variant || opts.variant || state.variant });
    el.m = attach(glyph.querySelector('svg'), icon.fx);
    el.title = `${icon.label} · ${fxLabel(icon.fx)}${icon.swap ? ' · 点按切换' : ''}`;
    $('.nm', el).textContent = el.dataset.name + (el.dataset.variant === 'fill' && state.variant !== 'fill' ? '.fill' : '');
    $('.lb', el).textContent = icon.label;
  };
  el.show = show;
  el.addEventListener('pointerenter', () => el.m?.hover(true));
  el.addEventListener('pointerleave', () => el.m?.hover(false));
  el.addEventListener('focus', () => el.m?.play());
  el.addEventListener('click', () => {
    const icon = ALL[el.dataset.name];
    if (!icon.swap) { el.m?.play(); return; }
    const sw = typeof icon.swap === 'string' ? { icon: icon.swap } : icon.swap;
    const cur = el.dataset.variant || opts.variant || state.variant;
    const nextName = sw.icon, nextVariant = sw.variant ? (cur === sw.variant ? (sw.variant === 'fill' ? opts.variant || 'outline' : 'fill') : sw.variant) : el.dataset.variant;
    el.dataset.name = nextName; el.dataset.variant = nextVariant;
    const icon2 = ALL[nextName];
    const markup = svgOf(icon2, { ...opts, variant: nextVariant || opts.variant || state.variant });
    // act: the state change is the new icon's own motion, so swap at once and play it
    let svg;
    if (sw.act) { glyph.innerHTML = markup; svg = glyph.querySelector('svg'); }
    else svg = replace(glyph, markup);
    el.m = attach(svg, icon2.fx);
    // the state reached acts out: its enter motion, or its own motion once the swap is done
    const act = sw.act ? icon2.enter ?? icon2.fx : icon2.enter ?? (sw.play ? icon2.fx : null);
    if (act) setTimeout(() => attach(svg, act).play(), sw.act ? 0 : sw.play ?? 0);
    $('.nm', el).textContent = nextName + (nextVariant === 'fill' && state.variant !== 'fill' ? '.fill' : '');
    $('.lb', el).textContent = icon2.label;
  });
  show();
  return el;
}

const grids = [];
function grid(sel, names, opts) {
  const host = $(sel);
  host.innerHTML = '';
  for (const n of names) host.appendChild(tile(n, opts));
  grids.push(host);
}
const redraw = () => document.querySelectorAll('.tile').forEach((t) => t.show());

// --- the four variants side by side ------------------------------------------------------------
const VARIANT_NAME = { outline: ['线性', '单色线条'], 'line-duo': ['线性双色', '内部和关键部件用浅色'], fill: ['面性', '闭合形状填实，细节镂空'], 'solid-tint': ['面性填充', '深色线条，围合的区域填浅色'] };
function four() {
  const names = ['home', 'lock', 'camera', 'mail', 'calendar', 'user', 'download', 'rotate-cw', 'message-square', 'smartphone', 'map-pin', 'image', 'trash', 'link', 'power', 'settings'];
  $('#four').innerHTML = Object.entries(VARIANT_NAME).map(([v, [t, d]]) => `<div class="four-row"><div class="four-k"><b>${t}</b><span>${d}</span></div>
    <div class="four-icons">${names.map((n) => render(ALL[n], { variant: v, s: state.s, size: 32, id: `q${uid++}`, ...colourOf() })).join('')}</div></div>`).join('');
}

// --- text pairing --------------------------------------------------------------------------------
function pairing() {
  const host = $('#pairing');
  const rows = [['inbox', '收件箱', '12'], ['calendar', '日程', '今天'], ['heart', '喜欢', '3'], ['settings', '设置', '']];
  host.innerHTML = Object.keys(WEIGHTS).map((w) => `<div class="pair" style="font-weight:${FONT[w]}">
    <span class="wname">${WEIGHT_NAME[w]} · ${FONT[w]}</span>
    ${rows.map(([n, t, c]) => `<span class="chip">${render(ALL[n], { weight: w, size: 20, id: `p${uid++}` })}${t}${c ? `<em>${c}</em>` : ''}</span>`).join('')}
  </div>`).join('') + `<div class="pair sizes">${[13, 17, 22, 28].map((px) => `<span class="chip" style="font-size:${px}px">${render(ALL.star, { size: Math.round(px * 1.2), id: `p${uid++}` })}收藏</span>`).join('')}</div>`;
}

// --- variable colour --------------------------------------------------------------------------
function variable() {
  const host = $('#vc-icons'), names = ['wifi', 'volume', 'battery', 'calendar', 'message-square'];
  const draw = () => {
    const v = +$('#vc').value / 100;
    $('#vc-out').textContent = `${Math.round(v * 100)}%`;
    host.innerHTML = names.map((n) => `<div class="vc-cell">${render(ALL[n], { vc: v, size: 48, s: state.s, variant: state.variant, mode: state.mode, colors: PALETTES[state.palette], id: `v${uid++}`, ...colourOf() })}<span>${ALL[n].label}</span></div>`).join('');
  };
  $('#vc').addEventListener('input', draw);
  draw();
  return draw;
}

// --- effects table ------------------------------------------------------------------------------
function effects() {
  const rows = [
    ['bounce', '弹跳', '从底部跳起，落地时轻微压扁', ['home', 'map-pin', 'user', 'users']],
    ['beat', '心跳', '连续两下搏动', ['heart', 'heart-circle']],
    ['wiggle', '摇摆', '绕支点摆动，逐渐停下', ['bell', 'shopping-bag', 'moon']],
    ['shake', '震动', '快速左右震动，两侧出现振动线', ['smartphone']],
    ['rotate', '旋转', '转过一定角度后回弹停稳', ['settings', 'rotate-cw', 'clock', 'sun']],
    ['flip', '翻转', '绕竖直轴转一圈', ['star', 'globe']],
    ['orbit', '环绕', '沿小圆走一圈，像在寻找或书写', ['search', 'pencil']],
    ['draw', '描绘', '笔画按顺序重新画出', ['file-text', 'download', 'circle-check', 'power', 'list', 'mail']],
    ['variable', '可变颜色', '各层依次点亮；悬停期间循环', ['wifi', 'volume', 'battery', 'message-square', 'calendar']],
    ['keys', '关键帧', '部件按现实中的连接方式运动，再弹回原位', ['trash', 'gift', 'lock', 'sliders', 'camera', 'flag']]
  ];
  $('#effects').innerHTML = rows.map(([t, zh, say, names]) => `<div class="fx-row"><div class="fx-name"><b>${zh}</b><code>${t}</code><p>${say}</p></div><div class="fx-icons" data-fx="${t}"></div><button class="fx-play" type="button" data-fx="${t}">播放</button></div>`).join('');
  rows.forEach(([t, , , names]) => grid(`.fx-icons[data-fx="${t}"]`, names));
  document.querySelectorAll('.fx-play').forEach((b) => b.addEventListener('click', () => playAll(b.closest('.fx-row'))));
}
function playAll(scope = document) {
  [...scope.querySelectorAll('.tile')].forEach((t, i) => setTimeout(() => t.m?.play(), i * 70));
}

// --- toolbar ------------------------------------------------------------------------------------
function seg(sel, key, after) {
  const host = $(sel);
  host.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    state[key] = b.dataset.v;
    host.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    document.body.dataset[key] = state[key];
    after?.();
  });
}

// --- canvas ---------------------------------------------------------------------------------------
function canvas() {
  const demo = ['calendar', 'lock', 'mail', 'clock'];
  $('#canvas-key').innerHTML = keylineSvg({ size: 264 });
  $('#canvas-demo').innerHTML = demo.map((n) => `<figure><div class="kl">${keylineSvg({ size: 132, key: ALL[n].key })}${render(ALL[n], { size: 132, roleColors: ROLE_INK, id: `k${uid++}` })}</div>
    <figcaption><b>${ALL[n].label}</b>${Object.entries(ALL[n].weights).map(([r, w]) => `<span class="r-${r}">${ROLE_NAME[r]} ${Math.round(w * 100)}%</span>`).join('')}</figcaption></figure>`).join('');
}

let drawVC;
function init() {
  canvas();
  // the 500 icons, one block per catalogue category
  const host = $('#base');
  host.className = 'cats';
  for (const [c, names] of Object.entries(groupBy(Object.keys(ICONS)))) {
    const sec = document.createElement('div');
    sec.className = 'cat';
    sec.innerHTML = `<h3>${CATEGORY_ZH[c] ?? c}<span>${names.length}</span></h3><div class="grid" id="cat-${c}"></div>`;
    host.appendChild(sec);
    grid(`#cat-${c}`, names);
  }
  four();
  grid('#variants', Object.keys(VARIANTS));
  grid('#tiny16', Object.keys(ICONS), { size: 16 });
  effects();
  pairing();
  drawVC = variable();
  const all = () => { document.querySelectorAll('.tile').forEach((t) => { t.dataset.variant = ''; }); redraw(); drawVC(); four(); };
  // A preset sets the stroke; the slider moves it in steps, and lights the preset it lands on.
  const showStroke = () => {
    $('#stroke').value = state.s; $('#stroke-out').textContent = state.s;
    $('#weight').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', WEIGHTS[b.dataset.v] === state.s));
  };
  seg('#weight', 'weight', () => { state.s = WEIGHTS[state.weight]; showStroke(); all(); });
  $('#stroke').addEventListener('input', (e) => { state.s = +e.target.value; showStroke(); all(); });
  seg('#variant', 'variant', all);
  seg('#hue', 'hue', all);
  $('#custom').addEventListener('input', (e) => {
    state.custom = e.target.value; state.hue = 'custom';
    $('#hue').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === 'custom'));
    all();
  });
  $('#size').addEventListener('input', (e) => { state.size = +e.target.value; $('#size-out').textContent = `${state.size}px`; document.documentElement.style.setProperty('--tile', `${Math.max(76, state.size + 44)}px`); redraw(); });
  $('#play-all').addEventListener('click', () => playAll($('#base')));
  document.body.dataset.mode = state.mode;
}
init();
