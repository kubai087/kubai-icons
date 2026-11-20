---
name: kubai-icons
description: 生成一套风格统一的功能图标，有两种风格可选。分层动态（默认）：沿用 Lumno 书签文件夹图标的构造，后片、内容、前片分层，外描边，所有颜色从一个主色推导，悬停时形变，也可以导出静态 SVG。双色面性：16 网格的实心双色静态 SVG，浅色主体加主色点缀，适合界面里的小尺寸图标。用户要做图标、功能图标、动态图标、静态 SVG 图标、面性或双色图标、duotone 图标、icon set、带 hover 动效的图标，或要往这套图标里加新图标时使用。
license: Kubai Icons License (source-available). Complete terms in LICENSE.
metadata:
  version: "1.3.0"
  display_name: "Kubai 动态图标"
  display_name_en: "Kubai Icons"
  description_zh: "按同一种风格稳定地画出功能图标。两种风格可选：文件夹式的前后分层、外描边、悬停时做物体本身会做的动作的动态图标；或者 16 网格、浅色主体加主色点缀的双色面性图标。"
  description_en: "Draws functional icons in one consistent style, in either of two looks: layered animated icons with outside outlines and hover motion the object itself would make, or two-tone solid icons on a 16 grid with light bodies and accents in the brand colour."
---

# Kubai Icons

这个 skill 自带两种风格的完整实现：每种都有规则、范例图标、自检脚本和导出脚本。你的工作是按规则写新图标，不是重写引擎。

## 两种风格

| 风格 | 样子 | 交付 | 规则 | 适合 |
| --- | --- | --- | --- | --- |
| 分层动态（默认） | 文件夹式的后片、内容、前片分层，外描边，投影和内发光，悬停时形变 | 动态 SVG + JS，或静态 SVG | `PROMPT.md` | 网页、营销页、需要动效和质感的地方，常用 24–96px |
| 双色面性 | 16 网格的实心图标，浅色主体加主色点缀，两色直接相接 | 静态 SVG，或 SVG + JS 的悬停动效 | `styles/duotone/SKILL.md`（单独的 skill `kubai-duotone`） | 界面里的导航、按钮、列表、标签页，常用 16–48px |

用户说"面性""实心""填充""双色""duotone""bulk""两种颜色"，或要的是界面里 16–24px 的小图标，就是双色面性。用户说"动态""悬停""hover""动效""分层"，或没有提到风格但要放在网页里，就是分层动态。两种都说不清时，先问一句，并用上表说明区别。

## 包里有什么

- `PROMPT.md`：全部设计规则，每一条都是硬性要求。动手前完整读一遍。
- `src/engine.js`：引擎。颜色推导、外描边遮罩、厚度带渐变、投影和内发光滤镜、插值动画、色板都在这里。直接复用，不要改。
- `src/icons.js`：范例图标。新图标按同样的格式追加。
- `src/app.js`、`index.html`：展示页。`ORDER` 决定展示哪些图标、按什么顺序排。
- `scripts/check.mjs`：自检脚本。在无头 Chrome 里截出静止、悬停、悬停过程的中间帧、24px、28px 和所有色板，读出每一页的脚本报错，并用 `scripts/measure.js` 对照 `PROMPT.md` 里能量化的规则逐个测量，结果写进 `findings.md`。临时文件都放在输出目录里，跑完自动清理。
- `scripts/measure.js`：测量规则的代码，由自检脚本加载。量的是动作有没有跳帧、结束时是否平稳停下，尺寸和居中，分层，线宽，过小的细节，细缝，被盖住的描边露头，尖角接缝处的毛刺，以及落在背景上却没有描边的边。
- `scripts/export.mjs`：静态导出。把图标渲染成不依赖脚本和样式表的独立 SVG 文件，可以指定色板、主色和静止或悬停状态。

以上为分层动态风格的文件。双色面性风格是独立的 skill（`kubai-duotone`），文件位于 `styles/duotone/`，规则、文件说明和流程见其中的 `SKILL.md`。

## 流程

1. 确定风格（见"两种风格"）。选择双色面性时：已安装 `kubai-duotone` skill 则使用该 skill，否则阅读 `styles/duotone/SKILL.md` 并按其流程执行，以下第 2–9 步不适用。选择分层动态时，阅读 `PROMPT.md`，继续以下步骤。
2. 确定交付形式。用户没说清楚时先问一句：
   - 动态（默认）：SVG + JS，悬停时形变，靠 `src/engine.js` 在页面里运行。适合网页和能跑 JS 的界面。
   - 静态：独立的 `.svg` 文件，没有动效，任何地方都能用：设计工具、原生 App、文档、`<img>`。用户提到"切图""SVG 文件""放进 Figma""App 里用"等，就是要静态。
   - 两者都要：按动态做，最后再导出一份静态。
3. 确定在哪里做：
   - 新做一套：把本 skill 的 `index.html`、`src/`、`scripts/` 复制到目标位置（一个新目录或新仓库），在那份副本里工作。保留每个文件开头的版权声明；`PROMPT.md` 和 `SKILL.md` 只留在 skill 里，不要复制进去（见 `LICENSE` 第 3 条）。
   - 往已有的一套里加：直接在那份 `src/icons.js` 里追加。
   - 往 kubai-icons 仓库的开源图标库里加：每个图标在 `icons/` 下单独一个文件，格式、命名、角标、关键词和各语言名字见 `docs/authoring.md`，自检用 `node tools/check.mjs --only 名字 --with folder,mail,download`。规则仍以 `PROMPT.md` 为准。
   - 只要静态：同样复制一份到工作目录里画，最后只把导出的 SVG 交给用户。
4. 读产品代码，列出功能。动态版每个功能写一句"物体 + 悬停动作"；静态版只需要确定物体（`PROMPT.md` 第 1 节）。
5. 每写一个图标之前，先在 `src/icons.js` 里找一两个结构最接近的范例读一遍（例如翻开的东西看信封和日历，切出前片的看下载和上传，会旋转的看齿轮和星标），照它们的写法来。
6. 把名字加进 `src/app.js` 的 `ORDER`。用不到的范例，不放进 `ORDER` 就不会显示。
7. 运行自检，把新图标和几个现有图标放在一起看：

   ```bash
   node scripts/check.mjs --only 新图标A,新图标B --with 文件夹,邮件,下载
   ```

   截图和 `findings.md` 在 `check-out/`。脚本报出错误时先修错误；再看 `findings.md`，每一条都指出一个很可能的问题，到截图上确认后修掉，确认是有意为之的可以保留（例如悬停时盖子抬出画布），在图标定义里写 `allow: { 规则名: '理由' }` 声明，它会单独列在 `findings.md` 的 Allowed 部分，不再计入问题；没确认过的不要声明。最后逐条对照 `PROMPT.md` 第 10 节的清单检查。往复类动作看 `frames.png`；查细缝时加 `--scale 3`；查浅主色上的标记时加 `--accent #F59E0B`，把所有图标换成同一个主色。不加 `--only` 就检查整套。静态版看 `rest.png`、`size-24.png`、`size-28.png` 和 `palettes.png` 就够了。
8. 改到全部通过后，更新 README 里提到的图标数量，以及展示页每个断点的列数（列数要能整除图标总数，断点可以增删）。
9. 要静态时，导出到用户指定的目录，并告诉用户用的是哪个色板：

   ```bash
   node scripts/export.mjs --only 新图标A,新图标B --palette 彩色 --out 目标目录
   ```

   `--palette` 按名字选色板（彩色、蓝灰、青瓷、薄荷、薰衣草、杏色、黑色），`--accent #hex` 把所有图标换成一个主色，`--state hover` 导出悬停结束时的样子，`--size` 设定像素尺寸，`--pad` 给投影留出边距。每个图标一个 `名字.svg`。

## 环境

- Node 18 以上，以及 Chrome。浏览器路径可以用环境变量 `CHROME` 覆盖。
- 所有检查都在无头模式下进行，不会打开任何可见窗口，也不会动用户正在用的浏览器。

---

Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
