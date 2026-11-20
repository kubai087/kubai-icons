// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// The hover motion of every example (GUIDE.md section 11). The runtime is motion.mjs.
//
// Each motion acts out what the icon means, the way the object would do it: a lid swings open
// on its hinge, a page is torn off, an arrow flies out and comes back in, lines are written one
// after another, the lights of a building come on floor by floor. Parts may leave and come back
// (a: opacity, w: a stroke drawn on), and a motion may bring in a part that isn't there at rest
// (add, with rest: { a: 0 }): the flash of a camera, the waves of a microphone, a letter
// dropping into an inbox. Moves are generous: 1.5–4 on the 16 grid, turns up to 30°.
//
// MOTION[name] = { say, moves, copy?, add?, ms? }; see motion.mjs for the keys.
import { K, D, W, Bt, rr, circ, pill, L } from './kit.mjs';
import { ICONS } from './icons.mjs';

const hidden = { rest: { a: 0 } };
const same = (keys, pose) => Object.fromEntries(keys.map((k) => [k, pose]));

export const MOTION = {
  folder: { say: '从文件夹里抽出一张纸', moves: { 0: { y: [-5.5, -4.5] } } },
  'file-text': {
    say: '三行字依次写出来',
    moves: { 1: { sx: [0, 1, 1, 1], o: [5, 5.875] }, 2: { sx: [0, 0, 1, 1], o: [5, 8.5] }, 3: { sx: [0, 0, 0, 1], o: [5, 11.125] } }
  },
  calendar: {
    say: '撕下一页，往下滑落淡出，下面是新的一页',
    copy: [{ of: [0, 1], at: 2 }],
    moves: same(['c0', 'c1'], { y: [0.5, 1.5], r: [3, 6], a: [0.7, 0], o: [14, 3.5] })
  },
  camera: {
    say: '按下快门：镜头一收一放，闪光灯闪一下',
    add: [{ layer: L('M12.5 2.75V1.5M13.5 3.25L14.5 2.25', { sw: D }) }],
    moves: { 1: { s: [0.82, 1.1, 1], o: [8, 9] }, a0: { ...hidden, a: [1, 1, 0] } }
  },
  lock: { say: '锁梁弹起，绕右脚转开', moves: { 0: { y: [-0.5, -0.5], r: [10, 10], o: [11.25, 6.5] } } },
  user: { say: '抬头', moves: { 0: { y: [-1.25, -1] }, 1: { y: [-0.5, -0.4] } } },
  'id-card': { say: '拿起来出示', moves: { all: { y: -1.25, r: -10 } } },
  building: {
    say: '天黑亮灯：窗户从下往上逐层亮起',
    moves: { 1: { a: [0.2, 1, 1, 1] }, 2: { a: [0.2, 0.2, 1, 1] }, 3: { a: [0.2, 0.2, 0.2, 1] } }
  },
  'book-open': { say: '翻过一页', copy: [{ of: [1, 3] }], moves: same(['c0', 'c1'], { sx: [-0.9, -1] }) },
  bell: { say: '绕顶钮摇响，摆几下停住', moves: { all: { r: [7, -6, 4, -2, 0], o: [8, 2] } } },
  trash: { say: '盖子绕左端掀开', moves: { 0: { y: [-0.25, -0.25], r: [-6, -6], o: [2, 4] } } },
  gift: { say: '盒盖连同蝴蝶结掀起', moves: same([0, 1, 2, 4], { y: [-1, -1], r: [-4, -4], o: [8, 7.75] }) },
  smile: { say: '笑得眯起眼', moves: { 1: { sy: 0.35, o: [8, 6.25] }, 2: { sx: 1.3, sy: 1.25, o: [8, 9.25] } } },
  'message-square': {
    say: '新消息弹出来，字一行行打出来',
    moves: { all: { s: [0.85, 1.08, 1], o: [1, 14] }, 1: { sx: [0, 1, 1], o: [4, 6.625] }, 2: { sx: [0, 0, 1], o: [4, 9.625] } }
  },
  clock: { say: '分针走一圈，时针走一格', moves: { 1: { r: 360 }, 2: { r: 30 } } },
  image: { say: '太阳从山后升起', moves: { 2: { y: [-2.5, -2] } } },
  ticket: { say: '票根撕开，往下垂落', moves: { 1: { y: [1.25, 1], r: [6, 4], o: [12, 2.5] } } },
  wallet: {
    say: '从钱包里抽出一张卡',
    add: [{ layer: L(rr(2.5, 4, 9, 6, 1)), at: 0 }],
    moves: { a0: { y: [-4, -4] } }
  },
  headphones: { say: '耳罩向里夹紧', moves: { 1: { x: 1 }, 2: { x: -1 } } },
  mic: {
    say: '开始收音，两侧画出声波',
    add: [{ layer: L('M1.75 0.75A4 4 0 0 0 1.75 3.5', { sw: D }) }, { layer: L('M14.25 0.75A4 4 0 0 1 14.25 3.5', { sw: D }) }],
    moves: { 0: { s: [1.06, 1], o: [8, 5] }, ...same(['a0', 'a1'], { rest: { a: 0, w: 0 }, a: 1, w: 1 }) }
  },
  cloud: { say: '风吹云散，太阳露出来', moves: { 0: { x: [0.75, 0.75], y: [-1, -1] }, 1: { x: [-0.75, -0.75] } } },
  'shopping-bag': { say: '提起来，绕提手晃一晃', moves: { all: { y: [-0.75, -0.75, -0.75, -0.75], r: [8, -6, 3, 0], o: [8, 2] } } },
  'battery-full': { say: '接上电，一格一格充满', moves: { 1: { a: [0.15, 1, 1, 1] }, 2: { a: [0.15, 0.15, 1, 1] }, 3: { a: [0.15, 0.15, 0.15, 1] } } },
  archive: { say: '盖子掀起', moves: { 0: { y: [-0.75, -0.75], r: [-4, -4], o: [8, 4] } } },
  mail: {
    // The closed envelope drops 1.5 to make room and a light sheet with a blue line (as in inbox
    // and file-text) rises out from behind it; the envelope's knockout keeps them a gap apart.
    say: '一封信从信封里抽出来',
    add: [{ layer: L(rr(3.5, 4, 9, 8, 1), Bt), at: 0 }, { layer: L(pill(5.5, 5.25, 5, D)), at: 1 }],
    moves: { ...same([0, 1], { y: [1.5, 1.5] }), ...same(['a0', 'a1'], { y: [-3.5, -3.5] }) }
  },
  printer: { say: '进纸，出纸', moves: { 0: { y: [0.75, 0] }, 2: { y: [1.2, 1.2] } } },
  home: { say: '门推开，又关上', moves: { 1: { sx: [-0.6, -0.6, 1], o: [6.5, 12] } } },
  search: { say: '放大镜四处移动查看', moves: { all: { x: [-0.75, 0.75, -0.4, 0], y: [0.75, -0.75, 0.4, 0] } } },
  settings: { say: '齿轮转半圈', moves: { 0: { r: 180 } } },
  tv: { say: '开机，画面从一条线展开', moves: { 1: { sy: [0.05, 1.08, 1], a: [0.3, 1, 1], o: [8, 6.75] } } },
  bookmark: { say: '丝带被往下拉', moves: { 1: { sy: [1.5, 1.35], o: [8.5, 1] } } },
  download: { say: '箭头从上往下长进盒子', moves: { 1: { sy: [0, 1], o: [8, 2] } } },
  upload: { say: '箭头从盒子里往上长出来', moves: { 1: { sy: [0, 1], o: [8, 11.5] } } },
  share: {
    say: '箭杆从盒子里画出来，画到头箭头弹出',
    moves: { 1: { w: [0, 1, 1] }, 2: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [11, 4.15] } }
  },
  'pencil': { say: '笔尖来回书写', moves: { all: { r: [-7, 5, -3, 1, 0], o: [2, 14] } } },
  heart: { say: '心跳', moves: { all: { s: [1.1, 0.94, 1.06, 1.06], o: [8, 8.5] } } },
  play: { say: '按下播放，三角向前一推', moves: { all: { s: [0.85, 1.05, 1] }, 1: { x: [1.5, 0] } } },
  phone: {
    say: '来电振动，两侧出现振动线',
    ms: 900,
    add: [{ layer: L('M1 5.5V10.5M15 5.5V10.5', { sw: K }) }],
    moves: { all: { r: [-12, 12, -10, 10, -6, 6, 0] }, a0: { ...hidden, a: [1, 1, 1, 1, 1, 1, 0] } }
  },
  laptop: { say: '屏幕合上一点再打开', moves: { 0: { sy: [0.25, 1.06, 1], o: [8, 10.5] } } },
  'map-pin': {
    say: '准星收紧锁定，波纹向外扩散',
    add: [{ layer: L(circ(8, 8, 2.75), { sw: D }), at: 2 }],
    moves: { 1: { s: 0.75 }, 2: { s: [1.5, 1.2] }, a0: { ...hidden, s: [1, 2.2], a: [1, 0] } }
  },
  music: { say: '音符随节拍跳起', moves: { all: { y: [-0.75, -0.6], r: [-6, -5] } } },
  link: { say: '链环拉开，连杆再接上', moves: { 0: { sx: [1.08, 1] }, 1: { sx: [0, 1] } } },
  'shopping-cart': { say: '向前推，车筐颠一下', moves: { all: { x: [0.75, -0.4, 0] }, 0: { y: [-0.75, 0] } } },
  'circle-check': { say: '对勾重新写一遍', moves: { 1: { w: [0, 1] } } },
  'circle-plus': { say: '先写竖，再写横', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  'circle-x': { say: '两笔划出叉号', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  info: { say: '上面的点落下，竖笔被压得一沉', moves: { 2: { y: [-2.5, 0.5, 0] }, 1: { sy: [1, 0.85, 1], o: [8, 12.375] } } },
  'circle-alert': { say: '感叹号左右摇晃示警', ms: 800, moves: same([1, 2], { r: [-18, 14, -9, 5, 0], o: [8, 12.375] }) },
  'circle-help': { say: '问号歪向一边再回正', moves: same([1, 2], { r: [-22, 8, 0], o: [8, 12.375] }) },
  eye: { say: '眨眼，再左右看看', moves: { all: { sy: [0.08, 1] }, 1: { x: [0, 1.75, -1.75, 0] } } },
  flag: { say: '旗面迎风飘动', moves: { 1: { sx: [0.8, 1.08, 0.92, 1], sy: [1, 0.94, 1.04, 1], o: [4.5, 4] } } },
  key: { say: '插进锁孔，转一下', moves: { all: { x: [0.75, 0.75, 0.75], sy: [1, 0.35, 1] } } },
  'credit-card': { say: '刷一下卡', moves: { all: { x: [0.9, -0.9, 0] } } },
  shield: { say: '挡下一击，对勾重新写上', moves: { all: { y: [1, -0.5, 0], s: [0.9, 1.04, 1], o: [8, 15] }, 1: { w: [0, 0, 1] } } },
  lightbulb: {
    // The glass lights up in the primary, with a light glint over it in place of the blue one.
    say: '通电，整个灯泡亮起来',
    add: [
      { layer: L('M5.5 11V10.33A5 5 0 1 1 10.5 10.33V11Z'), at: 1 },
      { layer: L('M5.25 6A2.75 2.75 0 0 1 8 3.25', { sw: D, ...Bt }) }
    ],
    moves: same(['a0', 'a1'], { ...hidden, a: [1, 0.5, 1] })
  },
  video: {
    say: '开始录制：镜头伸出，录制灯闪烁',
    add: [{ layer: L(circ(4, 5.5, 1.125)) }],
    moves: { 1: { x: [1, 0.75] }, a0: { ...hidden, a: [1, 0, 1] } }
  },
  users: { say: '后面的人探出身来', moves: { 0: { x: [1, 0.75], y: [-1.25, -1] } } },
  globe: { say: '地球自转一圈', moves: { 1: { sx: [-1, 1] } } },
  calculator: { say: '按下按键，屏幕刷新', moves: { 2: { y: [0.5, 0] }, 1: { a: [0.3, 1, 0.3, 1] } } },
  history: { say: '箭头往回一拨，分针倒退一圈，时针倒退一格', moves: { ...same([0, 1], { r: [-20, 0] }), 2: { r: -360 }, 3: { r: -30 } } },
  'log-out': { say: '箭头从门里往外长出来', moves: { 1: { sx: [0, 1], o: [5, 8] } } },
  database: { say: '顶层弹开，又合上', moves: { 1: { y: [-0.9, 0] } } },
  server: { say: '硬盘读写，指示灯闪烁', moves: { 2: { x: [1, 0] }, 3: { a: [0.1, 1, 0.1, 1] } } },
  wifi: {
    // Blue copies of the two light bands fade in, inner then outer, over the light ones.
    say: '信号一格一格变满',
    add: [{ layer: { ...ICONS.wifi.layers[1], tone: 'a' }, at: 2 }, { layer: { ...ICONS.wifi.layers[0], tone: 'a' }, at: 1 }],
    moves: { 3: { s: [1.2, 1], o: [8, 13] }, a0: { ...hidden, a: [0, 1, 1] }, a1: { ...hidden, a: [0, 0, 1] } }
  },
  power: { say: '按下电源键，开机标记重新画上', moves: { all: { s: [0.88, 1.04, 1] }, 1: { w: [0, 1] } } },
  sliders: { say: '两个滑块各自滑到另一头', moves: { 1: { x: -3 }, 2: { x: 3 } } },
  copy: { say: '复制出来，两张纸错开', moves: { 1: { x: [-1, -0.9], y: [0.75, 0.75] }, 0: { x: [0.75, 0.75], y: [-0.75, -0.75] } } },
  clipboard: {
    say: '夹子夹紧，字一行行写上',
    moves: { 1: { y: [-0.75, 0] }, 2: { sx: [0, 1, 1], o: [5, 7.875] }, 3: { sx: [0, 0, 1], o: [5, 10.5] } }
  },
  inbox: {
    // A light sheet with a line drops in between the tray's back and its blue front, which hides
    // its lower edge.
    say: '一封信落进托盘',
    add: [{ layer: L(rr(4.5, 4.5, 7, 6, 1), { ...Bt, gap: W }), at: 1 }, { layer: L(pill(6, 6.5, 4, D)), at: 2 }],
    moves: { ...same(['a0', 'a1'], { rest: { a: 0, y: -5 }, a: 1, y: 0 }), 1: { y: [0, 0, 0.75, 0] } }
  },
  receipt: { say: '账单送出来，最后一行打上', moves: { all: { y: [-0.75, 0] }, 2: { sx: [0, 1], o: [5, 10.125] } } },
  package: { say: '箱盖连同胶带弹起', moves: same([0, 2], { y: [-1, -1], r: [-3, -3], o: [8, 3.75] }) },
  store: { say: '遮阳篷被风吹得一鼓一收', moves: { 0: { sy: [1.35, 0.95, 1.05, 1], o: [8, 2] } } },
  'lock-open': { say: '像挂在钥匙圈上一样转一圈', moves: { all: { sx: [-1, 1] } } },
  menu: {
    say: '菜单展开：三条线从左往右依次伸出',
    moves: { 0: { w: [0, 1, 1, 1] }, 1: { w: [0, 0, 1, 1] }, 2: { w: [0, 0, 0, 1] } }
  },
  grid: {
    // Blue copies of the tiles, one diagonal at a time, light up and go out again from the top
    // left to the bottom right.
    say: '高亮从左上角斜着扫过整个网格',
    add: [0, 1, 2, 3, 4].map((k) => ({
      layer: L([0, 1, 2].flatMap((i) => [0, 1, 2].filter((j) => i + j === k).map((j) => rr(2 + (i * 13) / 3, 2 + (j * 13) / 3, 10 / 3, 10 / 3, 1))).join(''))
    })),
    moves: Object.fromEntries([0, 1, 2, 3, 4].map((k) => [`a${k}`, { ...hidden, a: [0, 1, 2, 3, 4, 5].map((f) => (f === k ? 1 : 0)) }]))
  },
  list: {
    say: '列表项一行行排出来',
    moves: { 1: { sx: [0, 1, 1, 1], o: [4.5, 3.25] }, 2: { sx: [0, 0, 1, 1], o: [4.5, 8] }, 3: { sx: [0, 0, 0, 1], o: [4.5, 12.75] } }
  },
  sun: { say: '光芒先收拢，再向外放出，转过一格', moves: same([1, 2], { s: [0.75, 1], r: [0, 45] }) },
  'rotate-cw': {
    say: '圆弧顺时针画一圈，画到头箭头弹出',
    moves: { 0: { w: [0, 1, 1] }, 1: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [12.243, 3.757] } }
  },
  'chart-bar': {
    say: '柱子从底部依次长起来',
    moves: { 0: { sy: [0, 1, 1, 1], o: [8, 14] }, 1: { sy: [0, 0, 1, 1], o: [8, 14] }, 2: { sy: [0, 0, 0, 1], o: [8, 14] } }
  },
  'chart-pie': { say: '蓝色的一块从饼图中拉出来', moves: { 1: { x: 0.75, y: -0.75 } } },
  filter: {
    say: '三条线由长到短依次展开',
    moves: { 1: { sx: [0, 1, 1, 1] }, 2: { sx: [0, 0, 1, 1] }, 3: { sx: [0, 0, 0, 1] } }
  },
  briefcase: { say: '提起来，绕提手晃一晃', moves: { all: { y: [-0.75, -0.75, -0.75, -0.75], r: [4, -3, 1.5, 0], o: [8, 2] } } },
  keyboard: {
    say: '按键一排排按下去',
    moves: { 1: { y: [0.5, 0, 0, 0] }, 2: { y: [0, 0.5, 0, 0] }, 3: { y: [0, 0, 0.5, 0] } }
  },
  toggle: {
    // The knob slides to the right end; the track fills with blue and the knob turns light, as a
    // switch turned on.
    say: '开关拨到右边，轨道亮起，打开',
    add: [{ layer: L(pill(1, 4, 14, 8)), at: 1 }, { layer: L(circ(5, 8, 3), Bt) }],
    moves: { 1: { x: 6 }, a0: { ...hidden, a: 1 }, a1: { ...hidden, a: 1, x: 6 } }
  },
  'circle-minus': { say: '一笔划出减号', moves: { 1: { w: [0, 1] } } },
  'circle-dot': { say: '圆点重新落进圆圈，选中', moves: { 1: { s: [0, 1], o: [8, 8] } } },
  checkbox: { say: '勾上复选框', moves: { 1: { w: [0, 1] } } },
  'plus-square': { say: '先写竖，再写横', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  'more-horizontal': {
    say: '三个点从左往右依次点出来',
    moves: { 1: { s: [0, 1, 1, 1], o: [5, 8] }, 2: { s: [0, 0, 1, 1], o: [8, 8] }, 3: { s: [0, 0, 0, 1], o: [11, 8] } }
  },
  loader: { say: '蓝色的一段沿圆环转一圈', moves: { 1: { r: 360, o: [8, 8] } } },
  appearance: { say: '深色的一半转到另一边，切换外观', moves: { 1: { r: 180, o: [8, 8] } } },
  'rotate-ccw': {
    say: '圆弧逆时针画一圈，画到头箭头弹出',
    moves: { 0: { w: [0, 1, 1] }, 1: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [3.757, 3.757] } }
  },
  'log-in': { say: '箭头从外面伸进门里', moves: { 1: { sx: [0, 1], o: [2, 8] } } },
  sidebar: { say: '侧栏收起后再展开', moves: { 1: { sx: [0.2, 1], o: [1, 8] } } },
  undo: {
    say: '箭杆从尾部画出，转回来后箭头弹出',
    moves: { 0: { w: [0, 1, 1] }, 1: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [5.5, 4.25] } }
  },
  redo: {
    say: '箭杆从尾部画出，转回来后箭头弹出',
    moves: { 0: { w: [0, 1, 1] }, 1: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [10.5, 4.25] } }
  },
  'arrow-left-right': { say: '上面的箭头向右、下面的向左各推一下', moves: { 1: { x: [0.75, 0] }, 2: { x: [-0.75, 0] } } },
  'arrow-up-down': { say: '左边的箭头向上、右边的向下各推一下', moves: { 1: { y: [-0.75, 0] }, 2: { y: [0.75, 0] } } },
  'align-left': {
    say: '三行从左边依次写出',
    moves: { 0: { w: [0, 1, 1, 1] }, 1: { w: [0, 0, 1, 1] }, 2: { w: [0, 0, 0, 1] } }
  },
  'align-center': {
    say: '三行从中间依次向两边展开',
    moves: { 0: { sx: [0, 1, 1, 1], o: [8, 3.5] }, 1: { sx: [0, 0, 1, 1], o: [8, 8] }, 2: { sx: [0, 0, 0, 1], o: [8, 12.5] } }
  },
  'align-right': {
    say: '三行从右边依次写出',
    moves: { 0: { w: [0, 1, 1, 1] }, 1: { w: [0, 0, 1, 1] }, 2: { w: [0, 0, 0, 1] } }
  },
  table: {
    say: '表头下面的两行依次铺开',
    moves: { 1: { sx: [0, 1, 1, 1], o: [1, 7.75] }, 2: { sx: [0, 0, 1, 1], o: [1, 12.25] } }
  },
  'message-circle': {
    say: '三个点依次跳起，有人正在输入',
    moves: { 1: { y: [-1, 0, 0, 0] }, 2: { y: [0, -1, 0, 0] }, 3: { y: [0, 0, -1, 0] } }
  },
  'messages-square': {
    say: '前面的回复逐行写出',
    moves: { 2: { sx: [0, 1, 1], o: [3.25, 8.875] }, 3: { sx: [0, 0, 1], o: [3.25, 11.125] } }
  },
  'app-window': {
    say: '页面内容逐行显示出来',
    moves: { 2: { sx: [0, 1, 1], o: [3.25, 8.625] }, 3: { sx: [0, 0, 1], o: [3.25, 11.125] } }
  },
  columns: {
    say: '中间一栏变宽，两侧让开',
    moves: { 0: { sx: 0.875, o: [1, 8] }, 1: { sx: 1.25, o: [8, 8] }, 2: { sx: 0.875, o: [15, 8] } }
  },
  indent: { say: '中间一行向右推进一格', moves: { 2: { x: [0.75, 0] } } },
  outdent: { say: '中间一行向左退回一格', moves: { 2: { x: [-0.75, 0] } } },
  type: { say: '先写横，再写竖', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  heading: { say: '两竖一横依次写出', moves: { 1: { w: [0, 1, 1, 1] }, 2: { w: [0, 0, 1, 1] }, 3: { w: [0, 0, 0, 1] } } },
  bold: { say: '字母一笔写出', moves: { 1: { w: [0, 1] } } },
  underline: { say: '先写字母，再在下面划线', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  maximize: {
    say: '四个角向外撑开，铺满屏幕',
    moves: { 1: { x: -0.75, y: -0.75 }, 2: { x: 0.75, y: -0.75 }, 3: { x: 0.75, y: 0.75 }, 4: { x: -0.75, y: 0.75 } }
  },
  minimize: {
    // Back to rest at the end: held pulled in, the four marks would close up into a plus.
    say: '四个角向里收拢一下',
    moves: { 1: { x: [0.5, 0], y: [0.5, 0] }, 2: { x: [-0.5, 0], y: [0.5, 0] }, 3: { x: [-0.5, 0], y: [-0.5, 0] }, 4: { x: [0.5, 0], y: [-0.5, 0] } }
  },
  hash: { say: '先写两竖，再写两横', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  notebook: { say: '在封面上写下名字', moves: { 1: { sx: [0, 1], o: [7.25, 5.625] } } },
  'cloud-upload': { say: '箭头从云里往上长出来', moves: { 1: { sy: [0, 1], o: [8, 11.5] } } },
  'text-cursor': { say: '输入文字，光标随之右移', moves: { 1: { sx: 10 / 7, o: [3.25, 8] }, 2: { x: 1.5 } } },
  'text-size': { say: '小的 T 在底线上放大一号，再回到原样', moves: { 2: { s: [1.25, 1], o: [10.5, 11.25] } } },
  'panel-bottom': { say: '底部面板升高，上面的页面让出位置', moves: { 0: { sy: 0.8, o: [8, 2] }, 1: { sy: 10 / 7, o: [8, 14] } } },
  rows: {
    say: '中间一行变高，上下两行让开',
    moves: { 0: { sy: 0.85, o: [8, 2] }, 1: { sy: 1.3, o: [8, 8] }, 2: { sy: 0.85, o: [8, 14] } }
  },
  'layout-dashboard': {
    say: '高低卡片互换位置',
    moves: { 0: { sy: 4 / 7, o: [8, 2] }, 1: { sy: 7 / 4, o: [8, 14] }, 2: { sy: 7 / 4, o: [8, 2] }, 3: { sy: 4 / 7, o: [8, 14] } }
  },
  kanban: {
    // Back to rest at the end: held, the three lanes end up nearly equal and say nothing.
    say: '一张卡片从第一列移到第二列，再移回来',
    moves: { 1: { sy: [5.5 / 7.5, 5.5 / 7.5, 1], o: [8, 4.25] }, 2: { sy: [6 / 4, 6 / 4, 1], o: [8, 4.25] } }
  },
  folders: { say: '两个文件夹错开', moves: { 0: { x: 0.5, y: -0.5 }, 1: { x: -0.5, y: 0.5 } } },
  notepad: {
    say: '撕下一页，往下滑落淡出，下面是新的一页',
    copy: [{ of: [1, 2] }],
    moves: same(['c0', 'c1'], { y: [0.5, 1.5], r: [3, 6], a: [0.7, 0], o: [14, 4.5] })
  },
  headset: { say: '话筒杆抬到嘴边', moves: same([1, 2], { r: -8, o: [3, 13.25] }) },
  'chart-donut': { say: '蓝色的一段从环形图中拉出来', moves: { 1: { x: 0.75, y: -0.75 } } },
  'chart-column-stacked': {
    say: '柱子从底部依次长起来',
    moves: { ...same([0, 1], { sy: [0, 1, 1, 1], o: [8, 14] }), ...same([2, 3], { sy: [0, 0, 1, 1], o: [8, 14] }), ...same([4, 5], { sy: [0, 0, 0, 1], o: [8, 14] }) }
  },
  'chart-gantt': {
    say: '任务条依次向右排开',
    moves: { 1: { sx: [0, 1, 1, 1], o: [3.25, 8] }, 2: { sx: [0, 0, 1, 1], o: [6, 8] }, 3: { sx: [0, 0, 0, 1], o: [9, 8] } }
  },
  'chart-candlestick': { say: '行情变动，蜡烛移到新的价位', moves: { 0: { y: -1 }, 1: { y: 1 }, 2: { y: -1 } } },
  presentation: {
    say: '图表的柱子依次长起来',
    moves: { 1: { sy: [0, 1, 1, 1], o: [8, 8.5] }, 2: { sy: [0, 0, 1, 1], o: [8, 8.5] }, 3: { sy: [0, 0, 0, 1], o: [8, 8.5] } }
  },
  'alarm-clock': { say: '闹钟响起，左右摇晃', moves: { all: { r: [-8, 8, -6, 6, 0], o: [8, 8.75] } } },
  password: {
    say: '逐个输入字符，光标闪烁',
    moves: { 1: { s: [0, 1, 1, 1], o: [4.125, 8] }, 2: { s: [0, 0, 1, 1], o: [6.875, 8] }, 3: { s: [0, 0, 0, 1], o: [9.625, 8] } }
  },
  'lock-keyhole': { say: '钥匙孔转过去，再转回来', moves: { 2: { r: [90, 0], o: [8, 10] } } },
  pause: { say: '两条竖杠依次落下，暂停', moves: { 1: { sy: [0, 1, 1], o: [8, 8] }, 2: { sy: [0, 0, 1], o: [8, 8] } } },
  stop: { say: '按下停止键', moves: { all: { s: [0.88, 1.04, 1] } } },
  'skip-forward': { say: '三角向前一推，跳到下一首', moves: { 1: { x: [0.75, 0] } } },
  'skip-back': { say: '三角向后一推，回到上一首', moves: { 1: { x: [-0.75, 0] } } },
  'audio-lines': {
    say: '声波从中间向两边依次跳动',
    moves: {
      2: { sy: [0.6, 1, 1, 1], o: [8, 8] },
      ...same([1, 3], { sy: [1, 0.5, 1, 1], o: [8, 8] }),
      ...same([0, 4], { sy: [1, 1, 2, 1], o: [8, 8] })
    }
  },
  'picture-in-picture': { say: '小窗移到左上角', moves: { 1: { x: -5, y: -4.25 } } },
  subtitles: { say: '字幕一行行出现', moves: { 1: { sx: [0, 1, 1], o: [3.25, 8.625] }, 2: { sx: [0, 0, 1], o: [3.25, 11.125] } } },
  save: { say: '滑盖拉开再合上，写入磁盘', moves: { 1: { x: [1, 1, 0] } } },
  'battery-medium': { say: '接上电，一格一格充上', moves: { 1: { a: [0.15, 1, 1] }, 2: { a: [0.15, 0.15, 1] } } },
  'battery-low': { say: '电量低，最后一格闪烁', moves: { 1: { a: [0.15, 1, 0.15, 1] } } },
  mouse: { say: '滚轮上下滚动', moves: { 1: { y: [0.75, -0.75, 0] } } },
  tablet: { say: '转成横屏，再转回竖屏', moves: { all: { r: [90, 90, 0, 0], o: [8, 8] } } },
  usb: { say: '向上插进接口', moves: { all: { y: [-0.75, 0] } } },
  plug: { say: '向上插进插座', moves: { all: { y: [-0.75, 0] } } },
  disc: { say: '光盘转一圈', moves: { 2: { r: 360, o: [8, 8] } } },
  speaker: { say: '低音喇叭随声音振动', moves: { 2: { s: [0.85, 1.1, 0.9, 1], o: [8, 10] } } },
  router: { say: '指示灯依次亮起', moves: { 2: { a: [0.2, 1, 1, 1] }, 3: { a: [0.2, 0.2, 1, 1] }, 4: { a: [0.2, 0.2, 0.2, 1] } } },
  banknote: { say: '翻过来查看', moves: { all: { sx: [-1, 1, 1] } } },
  meh: { say: '嘴角左右一撇', moves: { 2: { x: [-0.5, 0.5, 0] } } },
  frown: { say: '嘴角往下一沉', moves: { 2: { y: 0.4 }, 1: { sy: 0.8, o: [8, 6.25] } } },
  laugh: { say: '笑得眯起眼', moves: { 1: { sy: 0.35, o: [8, 6.25] }, 2: { sy: [1.2, 1], o: [8, 9] } } },
  terminal: { say: '光标闪烁，等待输入', moves: { 2: { a: [0, 1, 0, 1] } } },
  code: { say: '两个尖括号向两边张开再合上', moves: { 1: { x: [-0.5, 0] }, 2: { x: [0.5, 0] } } },
  brackets: { say: '两个方括号向两边张开再合上', moves: { 1: { x: [-0.5, 0] }, 2: { x: [0.5, 0] } } },
  umbrella: { say: '伞面撑开', moves: { 0: { sy: [0.3, 1], o: [8, 8] } } },
  'cloud-rain': {
    say: '雨滴依次落下',
    moves: { 1: { y: [-1.5, 0, 0, 0], a: [0, 1, 1, 1] }, 2: { y: [-1.5, -1.5, 0, 0], a: [0, 0, 1, 1] }, 3: { y: [-1.5, -1.5, -1.5, 0], a: [0, 0, 0, 1] } }
  },
  'cloud-snow': {
    say: '雪花左右飘着落下',
    moves: { 1: { x: [0.5, 0], y: [-1.5, 0], a: [0, 1] }, 2: { x: [-0.5, 0], y: [-1.5, 0], a: [0, 1] }, 3: { x: [0.5, 0], y: [-1.5, 0], a: [0, 1] } }
  },
  backpack: { say: '提起来，绕提手晃一晃', moves: { all: { y: [-0.5, -0.5, -0.5, -0.5], r: [4, -3, 1.5, 0], o: [8, 1.75] } } },
  'user-round': { say: '抬头', moves: { 1: { y: [-1, -0.75] }, 2: { y: [-0.4, -0.3] } } },
  images: { say: '两张照片错开', moves: { 0: { x: 0.5, y: -0.5 }, ...same([1, 2, 3], { x: -0.5, y: 0.5 }) } },
  playlist: { say: '列表逐行写出，播放键向前一推', moves: { 0: { w: [0, 1, 1, 1] }, 1: { w: [0, 0, 1, 1] }, 2: { w: [0, 0, 0, 1] }, 3: { x: [0, 0, 0.5, 0] } } },
  'id-badge': { say: '工牌挂在夹子上晃一晃', moves: { all: { r: [4, -3, 1.5, 0], o: [8, 1] } } },
  radio: { say: '喇叭随声音振动', moves: { 2: { s: [0.85, 1.1, 0.9, 1], o: [5, 10] } } },
  star: { say: '星星转个身，中间的星光一闪', moves: { all: { sx: [-1, 1, 1], o: [8, 8.69] }, 1: { s: [1, 0.3, 1.2, 1], o: [8, 8.69] } } },
  send: { say: '纸飞机向右上方飞走，再从左下方飞回原位', moves: { all: { x: [1, 1, -1, 0], y: [-1, -1, 1, 0], a: [1, 0, 0, 1] } } },
  moon: { say: '月亮沉下去，再升起来', moves: { all: { y: [0.75, -0.5, 0], a: [0.3, 1, 1] } } },
  map: { say: '地图向两边展开', moves: { 0: { sx: [0, 1], o: [5.667, 8] }, 2: { sx: [0, 1], o: [10.333, 8] } } },
  trophy: { say: '举起奖杯晃一晃', moves: { all: { y: [-1, -0.75, -0.75], r: [-5, 4, 0], o: [8, 14] } } },
  'cloud-lightning': { say: '闪电连闪两下', ms: 700, moves: { 1: { a: [0, 1, 0, 1] } } },
  'triangle-alert': { say: '感叹号左右摇晃示警', ms: 800, moves: same([1, 2], { r: [-18, 14, -9, 5, 0], o: [8, 12.5] }) },
  navigation: { say: '箭头向前走一步', moves: { all: { y: [-0.75, 0.25, 0] } } },
  compass: { say: '指针来回摆动，停在北方', ms: 900, moves: { 1: { r: [-40, 25, -12, 0], o: [8, 8] } } },
  sparkles: {
    say: '两颗星光先后一闪',
    moves: { 0: { s: [0.75, 1.06, 1], o: [6.78, 9.22] }, 1: { s: [1, 0.4, 1.15, 1], r: [0, 0, 90, 90], o: [11.75, 4.25] } }
  },
  droplet: { say: '水滴落下，触底时压扁一下', moves: { all: { y: [-0.75, 0, 0], sy: [1, 0.85, 1], o: [8, 15] } } },
  hourglass: { say: '沙子漏下来，在下半部堆起', moves: { 2: { sy: [0, 1], o: [8, 12.5] } } },
  'battery-charging': { say: '闪电亮两下，开始充电', ms: 700, moves: { 1: { a: [0.2, 1, 0.2, 1] } } },
  'moon-star': {
    say: '月亮沉下去再升起，星星一闪',
    moves: { 0: { y: [0.75, -0.5, 0], a: [0.3, 1, 1] }, 1: { s: [1, 0.5, 1.15, 1], r: [0, 0, 90, 90], o: [10.75, 5.25] } }
  },
  tag: { say: '吊牌绕着孔晃一晃', moves: { all: { r: [6, -4, 2, 0], o: [5.5, 8] } } },
  megaphone: { say: '喊话，喇叭口随声音振动', moves: { 1: { sy: [1.06, 1, 1.06, 1], o: [4, 8] }, 2: { x: [0.5, 0, 0.5, 0] } } },
  crown: { say: '戴上王冠', moves: { all: { y: [-1, 0.25, 0], r: [-6, 2, 0], o: [8, 14] } } },
  gem: { say: '宝石转一圈', moves: { all: { sx: [-1, 1, 1], o: [8, 8] } } },
  plane: { say: '飞机向前飞走，再从下方飞回原位', moves: { all: { y: [-1, -1, 1, 0], a: [1, 0, 0, 1] } } },
  'flag-triangle': { say: '旗面迎风飘动', moves: { 1: { sx: [0.8, 1.06, 0.92, 1], sy: [1, 0.94, 1.04, 1], o: [4.5, 5.25] } } },
  'traffic-cone': { say: '锥桶被碰了一下，左右晃动', ms: 800, moves: { all: { r: [-8, 6, -3, 0], o: [8, 15] } } },
  award: { say: '奖章翻过来，再翻回正面', moves: same([1, 2], { sx: [-1, 1, 1], o: [8, 6] }) },
  'mouse-pointer-click': { say: '按下鼠标，指针一沉，点击处的波纹向外扩开', moves: { 0: { s: [0.88, 1], o: [5.4, 5.4] }, 1: { s: [0.4, 1], a: [0, 1], o: [5.8, 5.8] } } },
  'star-half': {
    say: '评分涨满一颗星，再回到半颗',
    add: [{ layer: L(ICONS['star-half'].layers[0].d) }],
    moves: { a0: { ...hidden, a: [1, 1, 0] } }
  },
  'trending-up': { say: '折线向上画出，箭头随后画上', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  'trending-down': { say: '折线向下画出，箭头随后画上', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  'chart-line': { say: '折线从左到右画出', moves: { 1: { w: [0, 1] } } },
  'chart-area': { say: '两层面积从底部升起', moves: { 0: { sy: [0.5, 1], o: [8, 14] }, 1: { sy: [0.3, 1], o: [8, 14] } } },
  activity: { say: '脉搏线从左到右画出', moves: { 1: { w: [0, 1] } } },
  'fast-forward': { say: '两个三角依次向前一推', moves: { 1: { x: [0.75, 0, 0] }, 2: { x: [0, 0.75, 0] } } },
  rewind: { say: '两个三角依次向后一推', moves: { 1: { x: [-0.75, 0, 0] }, 2: { x: [0, -0.75, 0] } } },
  eject: { say: '三角向上弹出一下', moves: { 1: { y: [-1, 0] } } },
  italic: { say: '字母一笔写出', moves: { 1: { w: [0, 1] } } },
  'chart-funnel': { say: '数据从上往下逐层流入', moves: { 0: { a: [0.2, 1, 1, 1] }, 1: { a: [0.2, 0.2, 1, 1] }, 2: { a: [0.2, 0.2, 0.2, 1] } } },
  'chart-radar': { say: '数据从中心向外展开', moves: { 1: { s: [0.3, 1], o: [8, 8.6] } } },
  'sticky-note': { say: '便签上两行字依次写出', moves: { 2: { w: [0, 1, 1] }, 3: { w: [0, 0, 1] } } },
  gauge: { say: '指针从低处扫到高处，停在原位', moves: { 2: { r: [-110, 15, 0], o: [8, 9] } } },
  eraser: { say: '橡皮来回擦两下', ms: 800, moves: { all: { x: [-0.53, 0.53, -0.53, 0], y: [0.53, -0.53, 0.53, 0] } } },
  wand: {
    say: '挥一下魔法棒，星光一闪',
    moves: { ...same([0, 1], { r: [-8, 5, 0], o: [2.5, 13.5] }), 2: { s: [1, 0.5, 1.15, 1], r: [0, 0, 90, 90], o: [11, 5] } }
  },
  shapes: { say: '三个图形依次跳一下', moves: { 0: { y: [-0.75, 0, 0, 0] }, 1: { y: [0, -0.75, 0, 0] }, 2: { y: [0, 0, -0.75, 0] } } }
};

// Variants (GUIDE.md section 12): the badge does the motion, turning or scaling about its own
// centre; the object keeps still unless its own motion says the same thing.
const mark = (name) => { const ls = ICONS[name].layers; return { i: ls.length - 1, o: ls.at(-1).at }; };
const spin = (name) => { const { i, o } = mark(name); return { [i]: { r: 90, o } }; };
const draw = (name) => ({ [mark(name).i]: { w: [0, 1] } });
const twinkle = (name) => { const { i, o } = mark(name); return { [i]: { s: [0.5, 1.15, 1], r: [0, 90, 90], o } }; };
Object.assign(MOTION, {
  'folder-plus': { say: '加号转一圈，新建一个', moves: spin('folder-plus') },
  'calendar-check': { say: '对勾重新打上', moves: draw('calendar-check') },
  'clipboard-check': { say: '对勾重新打上', moves: draw('clipboard-check') },
  'user-check': { say: '抬头，对勾重新打上', moves: { ...MOTION.user.moves, ...draw('user-check') } },
  'search-sparkle': { say: '星光一闪', moves: twinkle('search-sparkle') },
  'image-sparkle': { say: '星光一闪', moves: twinkle('image-sparkle') },
  'bell-off': { say: '斜线重新划过', moves: draw('bell-off') },
  'eye-off': { say: '斜线重新划过', moves: draw('eye-off') },
  'zoom-in': { say: '加号转一圈，放大', moves: spin('zoom-in') },
  'zoom-out': { say: '减号重新划过，缩小', moves: draw('zoom-out') },
  unlink: { say: '斜线重新划过，断开链接', moves: draw('unlink') }
});

// Batch: home and tools
Object.assign(MOTION, {
  door: { say: '门推开，又关上', moves: { all: { sx: [0.5, 0.5, 1], o: [3, 8] } } },
  bed: { say: '枕头拍一拍，压扁又鼓起来', moves: { 1: { sy: [0.6, 1.1, 1], o: [6.75, 6.75] } } },
  sofa: { say: '坐下去，坐垫一沉', moves: { 1: { sy: [0.82, 1], o: [8, 13.5] } } },
  chair: { say: '椅子往后一翘，再落回地面', moves: { all: { r: [4, 0], o: [11.25, 15] } } },
  lamp: {
    say: '打开台灯，灯罩亮起来',
    add: [{ layer: L(ICONS.lamp.layers[0].d) }],
    moves: { a0: { ...hidden, a: [1, 0.5, 1] } }
  },
  fridge: { say: '冷藏室的门打开，又关上', moves: same([2, 3], { sx: [0.45, 0.45, 1], o: [13, 11] }) },
  'washing-machine': { say: '脱水时机身快速抖动', ms: 700, moves: { all: { x: [-0.4, 0.4, -0.4, 0.4, 0] } } },
  microwave: { say: '加热时炉内的灯一明一暗', ms: 900, moves: { 1: { a: [0.45, 1, 0.45, 1] } } },
  bath: {
    say: '放满热水，水面冒出气泡',
    add: [{ layer: L(circ(10, 4.25, 1)) }, { layer: L(circ(12.75, 3, 0.75)) }],
    moves: { a0: { ...hidden, a: [1, 1], y: [-0.5, -0.5] }, a1: { ...hidden, a: [0, 1], y: [0, -0.5] } }
  },
  'light-switch': { say: '拨动开关，打开', moves: { 2: { y: [-4, -4] } } },
  plant: { say: '盆栽的叶子随风摆动', moves: same([0, 1, 2], { r: [6, -4, 2, 0], o: [8, 11] }) },
  'cooking-pot': { say: '水开了，锅盖被蒸汽顶起几下', ms: 800, moves: { 1: { y: [-1, 0, -0.75, 0] } } },
  candle: { say: '烛火随风摇曳', ms: 800, moves: { 0: { sx: [0.85, 1.1, 0.9, 1], sy: [1.1, 0.9, 1.06, 1], o: [8, 5.75] } } },
  hanger: { say: '衣架挂在钩上晃动', moves: { all: { r: [4, -3, 1.5, 0], o: [8, 3.25] } } },
  toaster: { say: '面包烤好，弹了出来', moves: { 0: { y: [-1.25, -1] } } }
});

// Batch: home and tools (group 2)
Object.assign(MOTION, {
  hammer: { say: '锤子抬起，敲下去', moves: { all: { r: [-6, 3, 0], o: [9.5, 14] } } },
  wrench: { say: '扳手卡住螺母，拧一下', moves: { all: { r: [-8, 0], o: [12.6, 3.4] } } },
  screwdriver: { say: '螺丝刀一下下往里推', ms: 700, moves: { all: { x: [0.5, 0, 0.5, 0], y: [-0.5, 0, -0.5, 0] } } },
  ruler: {
    say: '刻度从左到右依次画出',
    moves: Object.fromEntries([1, 2, 3, 4].map((i) => [i, { sy: [0, 1, 1, 1].map((v, k) => (k < i - 1 ? 0 : 1)), o: [8, 4] }]))
  },
  toolbox: { say: '工具箱的盖子掀开', moves: same([0, 1], { y: [-0.75, -0.75], r: [-4, -4], o: [1, 8.5] }) },
  ladder: { say: '一级一级往上爬', moves: { 3: { a: [0.2, 1, 1, 1] }, 2: { a: [0.2, 0.2, 1, 1] }, 1: { a: [0.2, 0.2, 0.2, 1] } } },
  paintbrush: { say: '画笔来回刷两下', ms: 800, moves: { all: { x: [-0.5, 0.5, -0.5, 0], y: [-0.5, 0.5, -0.5, 0] } } },
  'paint-roller': { say: '滚刷上下刷一遍', moves: { all: { y: [-0.75, 0.75, 0] } } },
  nail: { say: '钉子被一下下敲进去', ms: 700, moves: { all: { y: [0.75, 0, 0.75, 0] } } },
  'hard-hat': { say: '戴上安全帽', moves: { all: { y: [-1, 0.25, 0], o: [8, 13.5] } } },
  'tape-measure': { say: '卷尺收回去，又拉出来', moves: { 2: { sx: [0.55, 1], o: [6, 13] } } },
  drill: { say: '开钻，机身微微抖动', ms: 700, moves: { all: { x: [-0.3, 0.3, -0.3, 0.3, 0] } } },
  'spirit-level': { say: '水平仪一晃，气泡跑开又回到中间', moves: { all: { r: [4, -3, 0] }, 2: { x: [1.75, -1.25, 0] } } }
});

// Batch: home and tools (group 3)
Object.assign(MOTION, {
  oven: { say: '炉门向下打开，又关上', moves: same([2, 3], { sy: [0.45, 0.45, 1], o: [8, 14] }) },
  wardrobe: { say: '两扇柜门打开，又关上', moves: { ...same([0, 1], { sx: [0.45, 0.45, 1], o: [2, 7] }), ...same([2, 3], { sx: [0.45, 0.45, 1], o: [14, 7] }) } },
  fireplace: { say: '炉火跳动', ms: 800, moves: { 3: { sx: [0.85, 1.1, 0.9, 1], sy: [1.12, 0.9, 1.06, 1], o: [8, 14] } } },
  hospital: { say: '十字灯闪亮', ms: 800, moves: { 1: { a: [0.3, 1, 0.3, 1] } } },
  factory: { say: '开工了，窗户从左到右依次亮起', moves: { 1: { a: [0.2, 1, 1, 1] }, 2: { a: [0.2, 0.2, 1, 1] }, 3: { a: [0.2, 0.2, 0.2, 1] } } },
  warehouse: { say: '卷帘门卷起，又放下', moves: same([1, 2], { sy: [0.4, 0.4, 1], o: [8, 8] }) },
  'floor-lamp': {
    say: '打开落地灯，灯罩亮起来',
    add: [{ layer: L(ICONS['floor-lamp'].layers[0].d) }],
    moves: { a0: { ...hidden, a: [1, 0.5, 1] } }
  },
  soap: { say: '泡泡往上飘', moves: { 1: { y: [-1, -1] }, 2: { y: [-0.75, -0.75] } } },
  doorbell: {
    say: '按下门铃，两侧响起声波',
    add: [{ layer: L('M1.75 6.5A6 6 0 0 0 1.75 12.5', { sw: D }) }, { layer: L('M14.25 6.5A6 6 0 0 1 14.25 12.5', { sw: D }) }],
    moves: { 2: { s: [0.82, 1], o: [8, 9.5] }, ...same(['a0', 'a1'], { rest: { a: 0, w: 0 }, a: 1, w: 1 }) }
  }
});

// Batch: home and tools (group 4)
Object.assign(MOTION, {
  'building-office': {
    say: '天黑亮灯：窗户从下往上逐层亮起',
    moves: { 1: { a: [0.2, 1, 1, 1] }, 2: { a: [0.2, 0.2, 1, 1] }, 3: { a: [0.2, 0.2, 0.2, 1] } }
  },
  toothbrush: { say: '牙刷来回刷两下', ms: 800, moves: { all: { x: [-0.75, 0.75, -0.75, 0] } } },
  iron: { say: '熨斗来回熨一下', moves: { all: { x: [-0.75, 0.75, 0] } } },
  'rolling-pin': { say: '擀面杖来回擀', ms: 800, moves: { all: { x: [0.5, -0.5, 0.5, 0], y: [0.5, -0.5, 0.5, 0] } } },
  spatula: { say: '锅铲翻一下', moves: { all: { r: [-8, 4, 0], o: [13, 3] } } },
  comb: { say: '梳子顺着梳过去', moves: { all: { x: [-0.75, 0.75, 0] } } },
  'nut-bolt': { say: '螺母拧一圈', moves: { 0: { r: 60, o: [8, 8] } } },
  bucket: { say: '提起水桶，绕提手晃一晃', moves: { all: { r: [8, -6, 3, 0], o: [8, 1.75] } } }
});

// Batch: home and tools (group 5)
Object.assign(MOTION, {
  barn: { say: '谷仓大门打开，又关上', moves: same([2, 3], { sx: [0.3, 0.3, 1], o: [8, 11] }) },
  kettle: { say: '水开了，壶盖被顶起几下', ms: 800, moves: { 2: { y: [-0.75, 0, -0.5, 0] } } },
  'office-chair': { say: '办公椅转一圈', moves: { all: { sx: [-1, 1, 1] } } },
  'standing-desk': { say: '桌面降下，又升回原位', moves: { 0: { y: [1.5, 1.5, 0] }, 1: { sy: [0.82, 0.82, 1], o: [8, 14] } } }
});

// Batch: home and tools (group 6)
Object.assign(MOTION, {
  'window-frame': { say: '窗户向两边推开，又关上', moves: { 0: { sx: [0.45, 0.45, 1], o: [2.5, 7] }, 1: { sx: [0.45, 0.45, 1], o: [13.5, 7] } } }
});

// Batch: devices and media
Object.assign(MOTION, {
  monitor: {
    say: '开机，屏幕从一条线展开亮起',
    add: [{ layer: L(rr(3, 4, 10, 4.5, 1)) }],
    moves: { a0: { ...hidden, a: 1, sy: [0.05, 1.08, 1], o: [8, 6.25] } }
  },
  desktop: {
    say: '开机，屏幕从一条线展开亮起',
    add: [{ layer: L(rr(3, 4, 5, 3.5, 1)) }],
    moves: { a0: { ...hidden, a: 1, sy: [0.05, 1.08, 1], o: [5.5, 5.75] } }
  },
  smartphone: { say: '一条新通知从顶部滑入', moves: { 1: { y: [-1.5, 0], a: [0, 1] } } },
  watch: {
    say: '活动圆环画满一圈',
    add: [{ layer: L('M6.25 8A1.75 1.75 0 0 1 8 6.25', { sw: D }) }],
    moves: { a0: { rest: { a: 0, w: 0 }, a: 1, w: [0, 1] } }
  },
  gamepad: {
    say: '按下按键，手柄振动',
    ms: 700,
    moves: { all: { x: [-0.4, 0.4, -0.3, 0.3, 0] }, 3: { s: [0.7, 0.7, 1, 1, 1], o: [11.875, 5.625] } }
  },
  bluetooth: {
    say: '配对中，两侧亮起信号点',
    add: [{ layer: L(circ(1.25, 8, 0.75)) }, { layer: L(circ(14.75, 8, 0.75)) }],
    moves: same(['a0', 'a1'], { ...hidden, a: [1, 0.3, 1] })
  },
  cpu: { say: '通电运算，核心闪烁', moves: { 2: { a: [0.2, 1, 0.2, 1] } } },
  'hard-drive': {
    say: '磁盘转起来，指示灯闪烁',
    ms: 800,
    moves: { all: { x: [-0.25, 0.25, -0.25, 0.25, 0] }, 2: { a: [0.2, 1, 0.2, 1, 1] }, 3: { a: [1, 0.2, 1, 0.2, 1] } }
  },
  'sd-card': { say: '向下插进卡槽', moves: { all: { y: [0.75, 0] } } },
  'sim-card': { say: '从卡托中弹出，抬起', moves: { all: { y: [-0.75, -0.75], r: [-6, -6], o: [8, 15] } } },
  webcam: { say: '镜头左右环视一圈', moves: { 1: { x: [-1, 1, 0] } } },
  signal: {
    // Blue copies of the two light bars fade in, lower one first.
    say: '信号一格一格变满',
    add: [{ layer: { ...L(rr(8.5, 5, 2.25, 9, 1)) } }, { layer: { ...L(rr(11.75, 2, 2.25, 12, 1)) } }],
    moves: { a0: { ...hidden, a: [0, 1, 1] }, a1: { ...hidden, a: [0, 0, 1] } }
  }
});

Object.assign(MOTION, {
  volume: { say: '音量调大，声波一圈圈向外传出', moves: { 1: { w: [0, 1, 1, 1] }, 2: { w: [0, 0, 1, 1] }, 3: { w: [0, 0, 0, 1] } } },
  repeat: { say: '循环转过半圈', moves: { all: { r: 180, o: [8, 8] } } },
  shuffle: { say: '两条路线上下交换', moves: { all: { sy: -1, o: [8, 8] } } },
  film: { say: '放映中，画面闪动', moves: { 1: { a: [0.3, 1, 0.3, 1] } } },
  clapperboard: { say: '打板：板条掀起再拍下', moves: { 1: { r: [-7, 0], o: [1, 5] } } },
  vinyl: { say: '唱片转一圈', moves: { 2: { r: 360, o: [8, 8] } } },
  equalizer: { say: '推子各自滑到新的位置', moves: { 1: { y: -3 }, 2: { y: 4 }, 3: { y: -2.5 } } },
  cast: { say: '投屏信号从角落向外亮起', moves: { 1: { a: [0.2, 1, 1] }, 2: { a: [0.2, 0.2, 1] } } },
  live: {
    // A blue copy of the light outer arcs fades in over them.
    say: '开始直播，信号向外发出，外圈亮起',
    add: [{ layer: { ...ICONS.live.layers[0], tone: 'a' } }],
    moves: { 1: { s: [1.15, 1], o: [8, 8] }, a0: { ...hidden, a: [0, 1] } }
  },
  focus: {
    say: '取景框向中间收紧，锁定对焦',
    moves: { 0: { x: 0.75, y: 0.75 }, 1: { x: -0.75, y: 0.75 }, 2: { x: -0.75, y: -0.75 }, 3: { x: 0.75, y: -0.75 } }
  }
});

const closeIn = { 0: { s: 0.88, o: [8, 8] } };
Object.assign(MOTION, {
  'scan-barcode': { say: '取景框向中间收紧，对准条码', moves: closeIn },
  'scan-qr': { say: '取景框向中间收紧，对准二维码', moves: closeIn },
  'scan-text': { say: '文字逐行识别出来', moves: { 1: { sx: [0, 1, 1, 1], o: [5, 5.625] }, 2: { sx: [0, 0, 1, 1], o: [5, 8] }, 3: { sx: [0, 0, 0, 1], o: [5, 10.375] } } },
  remote: { say: '按下中间的按键', moves: { 1: { s: [0.8, 1], o: [8, 6] }, 2: { a: [0.3, 1] } } },
  'power-bank': { say: '电量灯从下往上逐个亮起', moves: { 2: { a: [0.15, 1, 1, 1] }, 3: { a: [0.15, 0.15, 1, 1] }, 4: { a: [0.15, 0.15, 0.15, 1] } } },
  nfc: { say: '感应信号由内向外发出', moves: { 2: { a: [0.15, 1, 1] }, 3: { a: [0.15, 0.15, 1] } } },
  antenna: { say: '两根天线张开，搜索信号', moves: { 0: { r: -8, o: [7, 10] }, 1: { r: 8, o: [9, 10] } } },
  'walkie-talkie': { say: '对方讲话，喇叭逐条响起', moves: { 2: { a: [0.2, 1, 1, 1] }, 3: { a: [0.2, 0.2, 1, 1] }, 4: { a: [0.2, 0.2, 0.2, 1] } } },
  'game-console': { say: '按方向键，再按下按钮', moves: { 2: { x: [0.4, 0] }, 3: { s: [1, 0.7, 1], o: [9.25, 12.125] } } }
});

Object.assign(MOTION, {
  'phone-vibrate': { say: '振动：左右抖动后停住', ms: 800, moves: { all: { r: [-8, 8, -6, 6, -3, 0] }, ...same([2, 3], { a: [1, 0.3, 1, 0.3, 1, 1] }) } },
  'tablet-smartphone': { say: '两台设备向两边分开', moves: { 0: { x: -0.5, y: -0.5 }, 1: { x: 0.5, y: 0.5 } } },
  'e-reader': { say: '翻到下一页，文字逐行出现', moves: { 2: { sx: [0, 1, 1, 1], o: [5.5, 5.625] }, 3: { sx: [0, 0, 1, 1], o: [5.5, 8] }, 4: { sx: [0, 0, 0, 1], o: [5.5, 10.375] } } },
  'server-rack': { say: '中间一台沿导轨拉出，指示灯闪烁', moves: { 2: { x: [0.75, 0.75] }, 4: { a: [0.2, 1, 0.2, 1] } } },
  'memory-stick': { say: '芯片依次亮起，开始读写', moves: { 1: { a: [0.2, 1, 1, 1] }, 2: { a: [0.2, 0.2, 1, 1] }, 3: { a: [0.2, 0.2, 0.2, 1] } } },
  polaroid: { say: '照片从出片口继续送出', moves: { 2: { y: 0.75 } } },
  slideshow: { say: '下一张幻灯片从左向右展开', moves: { 1: { sx: [0, 1], o: [3, 6.75] } } },
  joystick: { say: '摇杆向一侧扳倒', moves: same([0, 1], { r: 15, o: [8, 11] }) }
});

Object.assign(MOTION, {
  'music-player': {
    say: '按下中间键，屏幕亮起',
    add: [{ layer: L(circ(8, 10, 1.125)) }],
    moves: { 1: { a: [0.3, 1] }, a0: { ...hidden, a: [1, 0] } }
  },
  piano: { say: '按下一个和弦', moves: { 0: { y: [0.4, 0.4] }, 2: { y: [0, 0.4] }, 4: { y: [0.4, 0.4] } } },
  turntable: { say: '唱臂转到唱片上', moves: { 2: { r: -20, o: [12.625, 5.25] } } },
  'film-reel': { say: '胶卷盘转一圈', moves: { 1: { r: 360, o: [8, 8] } } },
  'projector-screen': { say: '拉下幕布', moves: { 1: { sy: 1.13, o: [8, 5] }, 2: { y: 0.75 } } },
  'flip-phone': { say: '来电：手机振动，屏幕亮起', ms: 800, moves: { all: { r: [-6, 6, -4, 4, 0] }, 2: { a: [0.3, 1, 0.3, 1, 1] } } },
  'vr-headset': { say: '转头向两边看看', moves: { ...same([1, 2], { x: [0.75, -0.75, 0] }) } },
  bot: { say: '眨眼，天线晃一晃', moves: { 0: { r: [10, -8, 4, 0], o: [8, 6] }, ...same([2, 3], { sy: [0.1, 1], o: [8, 9.5] }) } },
  drone: { say: '螺旋桨转起来，机身升起', moves: { all: { y: -0.75 }, ...same([0, 1, 2, 3], { a: [0.4, 1, 0.4, 1] }) } }
});

Object.assign(MOTION, {
  'crt-monitor': { say: '开机，画面从一条线展开', moves: { 1: { sy: [0.05, 1.08, 1], a: [0.3, 1, 1], o: [6.75, 6.875] } } },
  'retro-computer': {
    say: '开机，屏幕上出现一行字',
    add: [{ layer: L(pill(5.5, 4.625, 3.5, D), Bt) }],
    moves: { a0: { ...hidden, a: 1, sx: [0, 1], o: [5.5, 5.25] } }
  },
  typewriter: { say: '打一个字，滚筒带着纸向左移一格', moves: { ...same([0, 1], { x: [-0.75, -0.75] }), 3: { y: [0.4, 0] } } },
  'music-library': { say: '从后面抽出一张专辑', moves: { 0: { y: [-1, -0.75] } } },
  'paper-shredder': { say: '纸被送入，碎条从下方出来', moves: { 0: { y: [0.75, 0.75] }, 2: { sy: [0.3, 1], o: [8, 11] } } },
  drum: { say: '两根鼓槌落下，敲击鼓面', moves: { 0: { r: [12, 0], o: [3.5, 1.75] }, 1: { r: [-12, 0], o: [12.5, 1.75] }, 2: { y: [0.3, 0] } } },
  jukebox: { say: '点唱机播放，喇叭随音乐亮起', moves: { 2: { a: [0.2, 1, 0.2, 1] }, 3: { a: [1, 0.2, 1, 1] } } }
});

Object.assign(MOTION, {
  aperture: { say: '叶片转动，光圈收小', moves: { 0: { r: 30, o: [8, 8] }, 1: { r: 30, s: 0.6, o: [8, 8] } } },
  'ethernet-port': { say: '接通网络，触点依次亮起', moves: { 1: { a: [0.2, 1, 1, 1, 1] }, 2: { a: [0.2, 0.2, 1, 1, 1] }, 3: { a: [0.2, 0.2, 0.2, 1, 1] }, 4: { a: [0.2, 0.2, 0.2, 0.2, 1] } } },
  'camera-retro': { say: '按下快门：镜头一收一放', moves: { 3: { s: [0.4, 1], o: [8, 9] } } }
});

// Batch: transport, travel and sports
const turnAbout = (r, o) => ({ r, o });
Object.assign(MOTION, {
  car: { say: '向前开动又刹住，车身前后晃一下', moves: { all: { x: [1, -0.25, 0] }, ...same([0, 1], turnAbout([-3, 1.5, 0], [8, 11.5])) } },
  'car-front': { say: '车灯闪两下', ms: 700, moves: { 2: { a: [0.2, 1, 0.2, 1] } } },
  bus: { say: '进站停稳，车身在弹簧上颠两下', moves: same([0, 1], { y: [-0.6, 0.3, -0.2, 0] }) },
  truck: { say: '起步时车厢颠一下', moves: { 0: { y: [-0.6, 0.25, 0] }, all: { x: [0.75, 0, 0] } } },
  ship: { say: '船在浪里左右摇晃', moves: { all: turnAbout([-5, 4, -2, 0], [8, 13.5]) } },
  train: { say: '列车在轨道上左右轻晃，车灯闪一下', moves: { ...same([0, 1, 2], turnAbout([-2, 2, 0], [8, 13.5])), 2: { r: [-2, 2, 0], o: [8, 13.5], a: [0.2, 1, 1] } } },
  luggage: { say: '拉杆拉出，箱子斜过来准备拖走', moves: { all: turnAbout([-6, -5], [5.25, 14.25]), 0: { y: [-0.5, -0.5] } } },
  passport: { say: '拿起来出示', moves: { all: { y: [-0.6, -0.5], r: [-6, -5] } } },
  parking: { say: 'P 字一笔写出', moves: { 1: { w: [0, 1] } } },
  tent: { say: '门帘向两边掀开', moves: { 1: { sx: [1.4, 1.3], o: [8, 14] } } },
  anchor: { say: '锚绕顶环摆动，停住', moves: { all: turnAbout([9, -6, 3, 0], [8, 3]) } },
  lifebuoy: { say: '救生圈抛出去，转着落回', moves: { all: { y: [-1, 0.25, 0], r: [-60, -90, -90] } } }
});

// Batch: transport, travel and sports (group 2)
Object.assign(MOTION, {
  basketball: { say: '拍两下球', moves: { all: { y: [1, -0.75, 0.5, 0] } } },
  'soccer-ball': { say: '足球滚动一下', moves: { all: { r: 72 } } },
  'tennis-ball': { say: '网球弹起，旋转着落下', moves: { all: { y: [-1, 0.5, 0], r: [90, 160, 180] } } },
  dumbbell: { say: '举起哑铃，停在高处', moves: { all: { y: [-1.25, -1] } } },
  medal: { say: '奖牌绕挂带摆动，停住', moves: { all: { r: [8, -6, 3, 0], o: [8, 1] } } },
  target: {
    say: '一支飞镖飞来，正中靶心',
    add: [{ layer: L('M8 8L12 4', { sw: K, gap: W }) }],
    moves: { a0: { rest: { a: 0 }, a: [0, 1], x: [3, 0], y: [-3, 0] } }
  },
  'golf-flag': { say: '旗面迎风飘动', moves: { 1: { sx: [0.8, 1.06, 0.92, 1], sy: [1, 0.94, 1.04, 1], o: [6.5, 4.75] } } },
  dice: { say: '掷出骰子，翻滚后落定', moves: { all: { y: [-1, 0.25, 0], r: [-8, 3, 0] } } },
  skateboard: { say: '滑板跳起再落地', moves: { all: { y: [-1, 0.25, 0], r: [-8, 2, 0], o: [8, 12] } } },
  'hiking-boot': { say: '迈步：脚跟抬起再落下', moves: { all: { r: [8, 0], o: [15, 13.5] } } }
});

// Batch: transport, travel and sports (group 3)
Object.assign(MOTION, {
  fuel: { say: '开始加油，屏幕上的数字跳动', ms: 700, moves: { 1: { a: [0.3, 1, 0.3, 1] } } },
  'ev-charger': { say: '接通电源，闪电亮两下', ms: 700, moves: { 1: { a: [0.2, 1, 0.2, 1] } } },
  'steering-wheel': { say: '方向盘向左打，再向右打，回正', moves: { all: { r: [-40, 30, 0] } } },
  'traffic-light': {
    say: '三盏灯依次亮起',
    moves: { 1: { a: [1, 0.25, 0.25, 1] }, 2: { a: [0.25, 1, 0.25, 1] }, 3: { a: [0.25, 0.25, 1, 1] } }
  },
  signpost: { say: '两块路牌依次指向各自的方向', moves: { 1: { x: [0.75, 0, 0] }, 2: { x: [0, -0.75, 0] } } },
  route: {
    say: '路线从起点画到终点',
    moves: { 0: { w: [0, 1, 1] }, 2: { s: [0, 0, 1], o: [12, 4] } }
  },
  road: { say: '车道线由远及近逐段亮起，像车在向前开', moves: { 1: { a: [1, 0.25, 0.25, 1] }, 2: { a: [0.25, 1, 0.25, 1] }, 3: { a: [0.25, 0.25, 1, 1] } } },
  lighthouse: {
    say: '灯塔亮灯，向两侧射出光束',
    add: [{ layer: L('M1.5 2.5H4.125', { sw: D }) }, { layer: L('M14.5 2.5H11.875', { sw: D }) }],
    moves: { 0: { a: [0.3, 1] }, ...same(['a0', 'a1'], { rest: { a: 0, w: 0 }, a: 1, w: [0, 1] }) }
  },
  binoculars: { say: '举起望远镜，左右看看', moves: { all: { x: [-0.75, 0.75, 0], y: [-0.5, -0.5, 0] } } }
});

// Batch: transport, travel and sports (group 4)
Object.assign(MOTION, {
  'police-car': { say: '警灯两边交替闪烁', ms: 800, moves: { 2: { a: [0.2, 1, 0.2, 1] }, 3: { a: [1, 0.3, 1, 0.3, 1] } } },
  taxi: { say: '顶灯亮起，向前开动又刹住', moves: { 2: { a: [0.2, 1, 1] }, all: { x: [0.75, -0.25, 0] } } },
  subway: { say: '列车进站，车灯闪一下', moves: { all: { y: [-0.5, 0.25, 0] }, 2: { a: [0.2, 1, 1] } } },
  tram: { say: '集电杆擦过电线闪一下，车身轻晃', moves: { 0: { a: [0.2, 1, 0.2, 1] }, ...same([1, 2, 3], turnAbout([-2, 2, -1, 0], [8, 15])) } },
  sailboat: { say: '帆船在浪里左右摇晃', moves: { all: turnAbout([-5, 4, -2, 0], [8, 14]) } },
  helicopter: { say: '旋翼转起来，直升机升起', ms: 800, moves: { 2: { sx: [-1, 1, -1, 1], o: [7, 3.25] }, all: { y: [-0.25, -0.5, -0.75, -0.75] } } },
  'hot-air-balloon': { say: '热气球升起，轻轻浮动', moves: { all: { y: [-0.75, 0, -0.5] } } },
  'cable-car': { say: '车厢挂在索道上轻轻摆动', moves: same([1, 2, 3], turnAbout([6, -4, 2, 0], [8, 3.5])) },
  castle: { say: '城门升起，再落下', moves: { 1: { sy: [0.25, 0.25, 1], o: [8, 9.5] } } },
  pyramid: { say: '日影移动：阴影面一暗一亮', moves: { 1: { a: [0.4, 1] } } },
  museum: {
    say: '四根柱子从左到右依次立起',
    moves: { 1: { sy: [0, 1, 1, 1, 1], o: [8, 11.5] }, 2: { sy: [0, 0, 1, 1, 1], o: [8, 11.5] }, 3: { sy: [0, 0, 0, 1, 1], o: [8, 11.5] }, 4: { sy: [0, 0, 0, 0, 1], o: [8, 11.5] } }
  },
  podium: { say: '冠军的台阶上写出 1', moves: { 1: { w: [0, 1] } } }
});

// Batch: transport, travel and sports (group 5)
Object.assign(MOTION, {
  igloo: { say: '屋里亮灯：门洞一暗一亮', moves: { 2: { a: [0.3, 1, 0.3, 1] } } },
  'street-lamp': {
    say: '路灯闪了一下，亮起来',
    add: [{ layer: L(rr(8.5, 1, 5.5, 4.5, [2, 2, 1, 1])) }],
    moves: { a0: { rest: { a: 0 }, a: [1, 0.4, 1] } }
  },
  lantern: { say: '火苗跳动', moves: { 3: { sy: [1.25, 0.9, 1.1, 1], o: [8, 10.75] } } },
  thermos: { say: '拧开杯盖', moves: { 0: { y: [-0.6, -0.5], r: [-6, -5], o: [13, 4] } } },
  'playing-cards': { say: '把牌摊开', moves: { 1: turnAbout([-8, -6], [4, 14]), 2: turnAbout([-8, -6], [4, 14]) } },
  badminton: { say: '羽毛球被击起，再落下', moves: { all: { y: [-1, 0.25, 0] } } },
  tractor: { say: '拖拉机颠簸着向前开', moves: { all: { x: [0.5, 0.75, 0], y: [-0.5, 0, 0] } } }
});

// Batch: transport, travel and sports (group 6)
Object.assign(MOTION, {
  submarine: { say: '潜水艇下潜，又浮上来', moves: { all: { y: [1, -0.5, 0] } } },
  'fire-hydrant': { say: '拧开顶部阀门', moves: { 0: { sx: [-1, 1], o: [8, 2.5] } } },
  'toy-robot': { say: '眨眨眼，天线晃一晃', moves: { 2: { sy: [0.15, 1], o: [8, 9.25] }, 0: { r: [-15, 10, 0], o: [8, 5] } } },
  'beach-umbrella': { say: '遮阳伞在风里轻轻晃动', moves: same([0, 1], turnAbout([-6, 4, -2, 0], [8, 8])) },
  'camper-van': { say: '向前开动又刹住，车身前后晃一下', moves: { all: { x: [1, -0.25, 0] }, ...same([0, 1, 2], turnAbout([-3, 1.5, 0], [8, 11.5])) } },
  'toll-booth': { say: '栏杆抬起，放行', moves: same([2, 3], turnAbout([-35, -30], [8.5, 7.5])) }
});

// Batch: transport, travel and sports (group 7)
Object.assign(MOTION, {
  'fire-truck': { say: '云梯升起', moves: { 3: turnAbout([-12, -10], [1.5, 4.25]) } },
  trailer: { say: '被拖着向前走，又停下', moves: { all: { x: [0.75, -0.25, 0] } } },
  'gas-can': { say: '油桶倾斜，往外倒油', moves: { all: turnAbout([6, 5], [2, 15]) } }
});

// Batch: food, nature, health and science
// polygon isn't in the import list at the top; a namespace import of our own keeps this batch
// apart from the other batches' edits.
import * as kitFood from './kit.mjs';
Object.assign(MOTION, {
  pill: { say: '胶囊两半拉开，再合上', moves: { 0: { x: [-0.5, 0], y: [0.5, 0] }, 1: { x: [0.5, 0], y: [-0.5, 0] } } },
  pills: { say: '拧开瓶盖，盖子转着抬起', moves: { 0: { y: [-0.5, -0.75, -0.75], sx: [-1, 1, 1], o: [8, 2.5] } } },
  'first-aid': { say: '提起急救箱，绕提手晃一晃', moves: { all: { y: [-0.75, -0.75, -0.75, -0.75], r: [4, -3, 1.5, 0], o: [8, 2] } } },
  'hospital-cross': { say: '中间的十字先写竖，再写横', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  bandage: { say: '创可贴落下，贴平', moves: { all: { y: [-0.75, 0.2, 0], r: [-10, 0, 0] } } },
  syringe: { say: '推动活塞，再松开', moves: { 0: { x: [-0.7, 0], y: [0.7, 0] } } },
  beaker: { say: '倒入液体，液面升起', moves: { 1: { sy: [0.4, 1], o: [8, 14] } } },
  flask: { say: '摇晃烧瓶，混合液体', ms: 800, moves: { all: { r: [-8, 6, -3, 0], o: [8, 14] } } },
  'test-tube': { say: '摇晃试管，混合液体', ms: 800, moves: { all: { r: [-10, 8, -4, 0], o: [8, 8] } } }
});

Object.assign(MOTION, {
  mug: { say: '端起杯子喝一口，再放下', moves: { all: { y: [-0.75, -0.75, 0], r: [-8, -8, 0], o: [6.25, 14] } } },
  coffee: { say: '热气一缕缕冒上来', moves: { 2: { y: [-0.75, 0, 0], a: [0, 1, 1] }, 3: { y: [0, -0.75, 0], a: [1, 0, 1] } } },
  'cup-soda': { say: '杯子摇一摇，吸管跟着晃', ms: 800, moves: { all: { r: [-6, 5, -2, 0], o: [8, 15] } } },
  wine: { say: '晃动酒杯，酒在杯中晃动', ms: 800, moves: { all: { r: [-7, 6, -3, 0], o: [8, 15] }, 1: { r: [6, -5, 2, 0], o: [8, 9] } } },
  beer: { say: '举杯碰一下', moves: { all: { y: [-0.75, -0.75, 0], r: [-8, 4, 0], o: [6.25, 14] } } },
  milk: { say: '倒牛奶：盒子向左倾斜，再立回来', moves: { all: { r: [-12, -12, 0], o: [8, 15] } } },
  bottle: { say: '拧开瓶盖，盖子转着抬起', moves: { 0: { y: [-0.5, -0.75, -0.75], sx: [-1, 1, 1], o: [8, 2.25] } } },
  pizza: { say: '拿起一块披萨', moves: { all: { y: [-1, -0.75] } } },
  cake: { say: '烛火摇曳', ms: 800, moves: { 3: { sx: [0.75, 1.1, 0.9, 1], sy: [1.15, 0.9, 1.05, 1], o: [8, 4] } } },
  'ice-pop': { say: '冰棍摇一摇', ms: 800, moves: { all: { r: [6, -5, 3, 0], o: [8, 15] } } },
  cookie: { say: '饼干翻个面，再翻回来', moves: { all: { sx: [-1, 1, 1], o: [8, 8] } } }
});

Object.assign(MOTION, {
  tree: { say: '树冠在风中摇摆', ms: 800, moves: { 1: { r: [5, -4, 2, 0], o: [8, 12] } } },
  'tree-pine': { say: '松树在风中摇摆', ms: 800, moves: { 0: { r: [4, -3, 1.5, 0], o: [8, 12] } } },
  leaf: { say: '叶子随风摆动', ms: 800, moves: { all: { r: [-8, 6, -3, 0], o: [3, 13] } } },
  sprout: { say: '新芽长出来，两片叶子张开', moves: { 0: { sy: [0.5, 1], o: [8, 14] }, 1: { s: [0.5, 1], o: [8, 8.5] } } },
  mountain: { say: '山顶落下积雪', moves: { 1: { sy: [0.3, 1], o: [8, 1.2] } } },
  planet: { say: '光环绕着行星转动', moves: { ...same([0, 2], { r: [-12, 0], o: [8, 8] }) } },
  waves: { say: '海浪一层层起伏', ms: 800, moves: { 0: { x: [0.5, -0.5, 0] }, 1: { x: [-0.5, 0.5, 0] }, 2: { x: [0.5, -0.5, 0] } } },
  flower: { say: '花瓣张开，花朵开放', moves: { 0: { s: [0.6, 1], o: [8, 8] } } },
  cactus: { say: '仙人掌长高', moves: same([0, 1, 2], { sy: [0.8, 1], o: [8, 11.5] }) },
  mushroom: { say: '蘑菇从地里冒出来', moves: { all: { sy: [0.7, 1], o: [8, 14] } } },
  paw: { say: '按下一个爪印', moves: { all: { y: [-1, 0.25, 0] } } }
});

Object.assign(MOTION, {
  'chocolate-bar': { say: '拆开包装，包装纸往下拉开', moves: { 1: { y: [0.75, 0.5] } } },
  cheese: { say: '按一下奶酪，压扁再弹回', moves: { all: { sy: [0.88, 1.05, 1], o: [8, 14] } } },
  burger: { say: '掀起顶上的面包', moves: same([0, 1], { y: [-1, -0.75] }) },
  fries: { say: '薯条一根根冒出来', moves: { 0: { y: [-0.75, 0, 0, 0] }, 1: { y: [0, -0.75, 0, 0] }, 2: { y: [0, 0, -0.75, 0] }, 3: { y: [0, 0, 0, -0.75, 0] } } },
  popcorn: { say: '爆米花跳起来', moves: { 0: { y: [-1, 0, -0.5, 0] } } },
  soup: { say: '热气一缕缕冒上来', moves: { 1: { y: [-0.75, 0, 0], a: [0, 1, 1] }, 2: { y: [0, -0.75, 0], a: [1, 0, 1] }, 3: { y: [0, 0, -0.75, 0], a: [1, 1, 0, 1] } } },
  noodles: { say: '用筷子把面条挑起来', moves: { 0: { y: [-1, -0.75] } } },
  'heart-pulse': { say: '心跳一下，脉搏线重新画出', moves: { 0: { s: [1.06, 0.97, 1], o: [8, 8.5] }, 1: { w: [0, 1] } } }
});

Object.assign(MOTION, {
  'salt-shaker': { say: '撒盐：盐瓶左右摇两下', ms: 800, moves: { all: { r: [-12, 10, -6, 0], o: [8, 8] } } },
  pancake: { say: '糖浆往下流，黄油滑一下', moves: { 2: { sy: [0.6, 1], o: [8, 4.5] }, 0: { x: [0.5, 0] } } },
  'ice-cream': { say: '冰淇淋球晃一晃', ms: 800, moves: { 0: { r: [5, -4, 2, 0], o: [8, 9] } } },
  candy: { say: '糖纸两端拧一下', moves: { 1: { sy: [0.6, 1], o: [2.5, 8] }, 2: { sy: [0.6, 1], o: [13.5, 8] } } },
  cherry: { say: '樱桃绕着果梗晃一晃', ms: 800, moves: { all: { r: [6, -5, 2, 0], o: [9.25, 2.75] } } },
  telescope: { say: '望远镜上下转动，对准天空', moves: same([1, 2], { r: [-6, 3, 0], o: [8, 7.5] }) },
  ufo: {
    say: '飞碟悬停，放出一道光束',
    add: [{ layer: L(kitFood.polygon([[6, 13], [10, 13], [11.5, 15.5], [4.5, 15.5]], 0.5)) }],
    moves: { all: { y: [-0.75, 0.25, 0] }, a0: { ...hidden, a: [0, 1, 1] } }
  },
  pi: { say: '先写横，再写两竖', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  sigma: { say: '求和符号一笔写出', moves: { 1: { w: [0, 1] } } }
});

Object.assign(MOTION, {
  'wind-turbine': { say: '风吹动叶片转一圈', moves: same([0, 1], { r: 120, o: [8, 8.75] }) },
  beehive: {
    say: '一只蜜蜂从门口飞出来',
    add: [{ layer: L(circ(8, 12.5, 1)) }],
    moves: { a0: { ...hidden, x: [2.5, 4], y: [-4, -7.5], a: [1, 1] } }
  },
  birdhouse: { say: '鸟屋挂在枝上晃一晃', ms: 800, moves: { all: { r: [4, -3, 1.5, 0], o: [8, 1.5] } } },
  volcano: { say: '火山涌出熔岩', moves: { 2: { y: [-1, 0], a: [0, 1] }, 1: { sy: [0.85, 1], o: [8, 5.5] } } },
  utensils: { say: '刀叉碰一下', moves: { 0: { r: [6, 0], o: [4.5, 15] }, 1: { r: [-6, 0], o: [12.75, 15] } } },
  cocktail: { say: '举杯碰一下', moves: { all: { r: [-7, 4, 0], o: [8, 14] } } },
  muffin: { say: '玛芬烤好，顶部鼓起来', moves: { 0: { sy: [0.8, 1.06, 1], o: [8, 7.5] } } },
  'chef-hat': { say: '摘下帽子致意', moves: { all: { y: [-1, -0.75], r: [-8, -6], o: [8, 14] } } },
  'baby-bottle': { say: '摇匀奶瓶', ms: 800, moves: { all: { r: [-10, 8, -4, 0], o: [8, 8] } } },
  'bunsen-burner': { say: '点燃，火焰跳动', ms: 800, moves: { 0: { sx: [0.75, 1.1, 0.9, 1], sy: [1.15, 0.9, 1.05, 1], o: [8, 7.25] } } },
  bread: { say: '把黄油抹开', moves: { 1: { sx: [1.5, 1.4], sy: [0.8, 0.85], o: [8, 9.25] } } }
});

// Batch: remaining functional categories
Object.assign(MOTION, {
  'external-link': {
    say: '箭杆从盒子里画出，画到头箭头弹出',
    moves: { 1: { w: [0, 1, 1] }, 2: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [12.75, 3.25] } }
  },
  ban: { say: '斜线重新划过', moves: { 1: { w: [0, 1] } } },
  sort: {
    say: '箭头向下一推，三行按长短依次排好',
    moves: { 0: { w: [0, 1, 1, 1] }, 1: { w: [0, 0, 1, 1] }, 2: { w: [0, 0, 0, 1] }, 3: { y: [0.75, 0] } }
  },
  'list-checks': { say: '两项依次打上对勾', moves: { 0: { w: [0, 1, 1] }, 1: { w: [0, 0, 1] } } },
  strikethrough: { say: '先写字母，再一笔划掉', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  quote: {
    say: '两个引号先后出现',
    moves: { ...same([1, 2], { s: [0, 1, 1], o: [5.75, 9.25] }), ...same([3, 4], { s: [0, 0, 1], o: [10.25, 9.25] }) }
  },
  'bell-ring': {
    say: '铃铛摇响，两侧的声波闪动',
    moves: { ...same([0, 1], { r: [7, -6, 4, -2, 0], o: [8, 2.5] }), 2: { a: [0.2, 1, 0.2, 1, 1] } }
  },
  'file-code': { say: '两个尖括号向两边张开再合上', moves: { 1: { x: [-0.5, 0] }, 2: { x: [0.5, 0] } } },
  'file-image': { say: '太阳升起', moves: { 2: { y: [-1.5, -1.25] } } },
  'file-chart': {
    say: '三根柱子依次从底部长出',
    moves: { 1: { sy: [0, 1, 1, 1], o: [5.5, 12] }, 2: { sy: [0, 0, 1, 1], o: [8, 12] }, 3: { sy: [0, 0, 0, 1], o: [10.5, 12] } }
  },
  'file-video': { say: '按下播放，三角向前一推', moves: { 1: { x: [1, 0] } } },
  'file-audio': { say: '音符随节拍跳动', moves: same([1, 2], { y: [-1, 0, -0.75, 0] }) }
});

// Group 2 of the same batch.
Object.assign(MOTION, {
  'file-spreadsheet': {
    say: '表格一行一行填满',
    moves: { 1: { sx: [0, 1, 1, 1], o: [4.5, 5.5] }, 2: { sx: [0, 0, 1, 1], o: [4.5, 8] }, 3: { sx: [0, 0, 0, 1], o: [4.5, 10.5] } }
  },
  'file-archive': { say: '拉链头拉下来，又拉回去', moves: { 2: { y: [1.5, 0] } } },
  newspaper: {
    say: '标题和正文一行行印出来',
    moves: { 1: { sx: [0, 1, 1, 1], o: [3.5, 5.125] }, 3: { sx: [0, 0, 1, 1], o: [8, 8.375] }, 4: { sx: [0, 0, 0, 1], o: [8, 10.875] } }
  },
  'filing-cabinet': { say: '上层抽屉拉出来，又推回去', moves: same([0, 2], { s: [1.08, 1], o: [8, 4.25] }) },
  'git-commit': { say: '线从左往右画出，节点随后落下', moves: { 0: { w: [0, 1, 1] }, ...same([1, 2], { s: [0, 0, 1], o: [8, 8] }) } },
  'git-branch': {
    say: '从主干上长出分支，末端的节点随后出现',
    moves: { 1: { w: [0, 1, 1] }, 3: { s: [0, 0, 1], o: [12.5, 3.5] } }
  },
  'git-merge': { say: '分支沿弧线并回主干', moves: { 1: { w: [0, 1] } } },
  bug: { say: '虫子爬动，两组腿交替迈步', moves: { 2: { y: [-0.5, 0.5, -0.5, 0] }, 3: { y: [0.5, -0.5, 0.5, 0] } } },
  rss: { say: '信号从圆点由内向外发出', moves: { 2: { a: [0.15, 1, 1] }, 3: { a: [0.15, 0.15, 1] } } },
  'wrap-text': { say: '一行写到头，折回到下一行', moves: { 2: { w: [0, 1, 1] }, 3: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [9, 11.5] } } }
});

// Group 3 of the same batch.
Object.assign(MOTION, {
  'square-arrow-up': { say: '箭头向上推一下', moves: { 1: { y: [-1, 0] } } },
  'square-arrow-right': { say: '箭头向右推一下', moves: { 1: { x: [1, 0] } } },
  'square-arrow-down': { say: '箭头向下推一下', moves: { 1: { y: [1, 0] } } },
  'square-arrow-left': { say: '箭头向左推一下', moves: { 1: { x: [-1, 0] } } },
  sync: {
    say: '两段圆弧同时画出，画到头箭头弹出',
    moves: {
      ...same([0, 2], { w: [0, 1, 1] }),
      1: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [12.243, 3.757] },
      3: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [3.757, 12.243] }
    }
  },
  'cloud-fog': { say: '两层雾气向两边飘开，又飘回来', moves: { 1: { x: [1, 0] }, 2: { x: [-1, 0] } } },
  sunrise: { say: '太阳从地平线后升起，箭头向上推', moves: { ...same([0, 1], { y: [2.5, 0] }), 3: { y: [0, -0.75, 0] } } },
  sunset: { say: '太阳沉到地平线后，再回到原处', moves: { ...same([0, 1], { y: [2.5, 2.5, 0] }), 3: { y: [0.5, 0.5, 0] } } },
  layers: { say: '上面两层抬起，再叠回去', moves: { 0: { y: [-1, 0] }, 1: { y: [-0.5, 0] } } },
  ghost: { say: '幽灵上下飘动，眼睛左右张望', moves: { all: { y: [-0.75, 0, -0.5, 0] }, 1: { x: [0.75, -0.75, 0.5, 0] } } }
});

// Group 4 of the same batch.
Object.assign(MOTION, {
  move: { say: '整体向几个方向各挪一下', moves: { all: { x: [0.75, -0.75, 0], y: [-0.75, 0.75, 0] } } },
  'contact-book': { say: '名片上的人抬头', moves: { 2: { y: [-1, -0.75] }, 3: { y: [-0.4, -0.3] } } },
  siren: { say: '警报响起，光线闪烁', ms: 800, moves: { 2: { a: [0.15, 1, 0.15, 1, 1] } } },
  braces: { say: '两个花括号向两边张开再合上', moves: { 1: { x: [-0.5, 0] }, 2: { x: [0.5, 0] } } },
  component: {
    say: '四个部件向外散开，再合拢',
    moves: { 0: { y: [-0.75, 0] }, 1: { x: [0.75, 0] }, 2: { y: [0.75, 0] }, 3: { x: [-0.75, 0] } }
  },
  sitemap: {
    say: '下面的三个页面依次展开',
    moves: { 2: { s: [0, 1, 1, 1], o: [3.667, 12.25] }, 3: { s: [0, 0, 1, 1], o: [8, 12.25] }, 4: { s: [0, 0, 0, 1], o: [12.333, 12.25] } }
  },
  'graduation-cap': { say: '学士帽抛起，又落回原处', moves: { all: { y: [-1, 0], r: [-8, 0], o: [8, 8] } } },
  'gallery-view': { say: '缩略图从左到右依次亮起', moves: { 1: { a: [0.3, 1, 1, 1] }, 2: { a: [0.3, 0.3, 1, 1] }, 3: { a: [0.3, 0.3, 0.3, 1] } } }
});

// Group 5 of the same batch.
Object.assign(MOTION, {
  heatmap: { say: '热点依次亮起', moves: { 1: { a: [0.2, 1, 1, 1, 1] }, 2: { a: [0.2, 0.2, 1, 1, 1] }, 3: { a: [0.2, 0.2, 0.2, 1, 1] }, 4: { a: [0.2, 0.2, 0.2, 0.2, 1] } } },
  pilcrow: { say: '先落下字腔，再写出两竖', moves: { 1: { a: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  cube: { say: '立方体绕竖轴转一圈', moves: { all: { sx: [-1, 1] } } },
  'git-fork': { say: '线从下面的节点长出，分成两路，末端的节点随后出现', moves: { 0: { w: [0, 1, 1] }, 2: { s: [0, 0, 1], o: [8, 3.5] } } },
  landmark: { say: '立柱从左到右依次亮起', moves: { 1: { a: [0.3, 1] } } },
  angry: { say: '气得直摇头', ms: 700, moves: { all: { x: [-0.6, 0.6, -0.6, 0.6, 0] } } }
});

// Group 6 of the same batch.
Object.assign(MOTION, {
  file: { say: '折角展开，又折回去', moves: { 1: { s: [0, 1], o: [14, 1] } } },
  'folder-open': {
    say: '从打开的文件夹里抽出一张纸',
    add: [{ layer: L(rr(4.5, 5, 6.5, 6.5, 1), { ...Bt, gap: W }), at: 1 }],
    moves: { a0: { rest: { a: 0 }, a: 1, y: [-2.25, -2] } }
  },
  reply: { say: '回复箭头向左推一下', moves: same([1, 2], { x: [-0.75, 0] }) },
  rainbow: { say: '彩虹从左到右一道道画出', moves: { 0: { w: [0, 1, 1] }, 1: { w: [0, 0, 1] } } },
  workflow: { say: '从第一步连到第二步，第二步随后出现', moves: { 1: { w: [0, 1, 1] }, 2: { s: [0, 0, 1], o: [11.5, 11.5] } } },
  'corner-down-right': { say: '箭头转弯后向右推一下', moves: { 1: { x: [0.75, 0] } } },
  'corner-up-left': { say: '箭头转弯后向左推一下', moves: { 1: { x: [-0.75, 0] } } },
  'badge-verified': { say: '徽章转过一格，对勾重新打上', moves: { 0: { r: 36, o: [8, 8] }, 1: { w: [0, 1] } } }
});

// Group 7 of the same batch.
Object.assign(MOTION, {
  'sticky-notes': { say: '最上面一张便签揭起，又贴回去', moves: same([1, 2], { y: [-0.75, 0], r: [-6, 0], o: [2, 5.5] }) },
  'cloud-moon': { say: '云飘开，月亮露出来', moves: { 0: { x: [0.5, 0.5], y: [-0.5, -0.5] }, 1: { x: [-0.75, -0.75] } } },
  'file-diff': { say: '先写加号，再写减号', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  'git-pull-request': { say: '右边的线向上画出，转向主干，箭头随后弹出', moves: { 1: { w: [0, 1, 1] }, 2: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [8.5, 4] } } }
});
