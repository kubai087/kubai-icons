---
name: kubai-line
description: 生成风格统一的线性功能图标：24 网格，参考 SF Symbols 的圆润线条，线宽随旁边文字的字重变化（0.5–3，常规 2），常规线宽下直线边缘落在整像素上，按光学中心摆放。一份绘制得到线性、线性双色、面性、面性填充四种变体，悬停时播放表现图标含义的动效，也可导出静态 SVG。用户要求线性、线条、描边、outline、line、SF Symbols 风格的图标，可调线宽的图标，或向这套线性图标添加新图标时使用。
license: Kubai Icons License (source-available). Complete terms in LICENSE.
metadata:
  version: "1.2.0"
  display_name: "Kubai 线性图标"
  display_name_en: "Kubai Line Icons"
  description_zh: "按统一风格绘制线性功能图标：24 网格、圆润线条、线宽随字重变化，一份绘制得到四种变体，悬停时播放表现图标含义的动效，可导出静态 SVG。"
  description_en: "Draws line icons in one consistent style: a 24 grid, rounded strokes whose width follows the text weight, four variants from one drawing, hover motion that acts out each icon, and static SVG export."
---

# Kubai 线性图标

本 skill 包含线性风格的完整实现：规则、几何工具、1285 个范例、四种变体、悬停动效、自检和导出。你的任务是按规则编写新图标，不要改写几何、渲染或动效代码。

## 文件

- `GUIDE.md`：全部规则，均为硬性要求。开始前通读。
- `kit.mjs`：画布数值、线宽、几何、渲染（四种变体和着色）、按规则生成的变体（斜线、角标、圆框、方框）。直接使用，不要修改。
- `smooth.mjs`：平滑圆角、多边形、圆角矩形、圆。
- `ends.mjs`：面性中镂空线的端点，按 `ends: 'in'` 或 `'out'` 收进外形或切出外缘。
- `parts.mjs`：多个图标共用的部件（杯形、拱形、心形、定位针、云、星形、齿轮、扬声器）。
- `variants.mjs`：规则生成的变体用的辅助函数：斜线关闭（`off`、`offFill`）和角标缺口（`notched`），分类文件和 `icons.mjs` 共用。
- `icons.mjs`、`set/`：范例。最早的 55 个在 `icons.mjs`，其余按分类放在 `set/<分类>.mjs`。每个图标写明各部分的角色和墨量（`plan`、`weights`）、悬停动效 `fx`，需要时写切换目标 `swap`。
- `catalog.mjs`、`CATALOG.md`：全部图标的清单，对照 Kubai Icons、Lucide、Hugeicons 和 SF Symbols 的语义。
- `motion.mjs`：动效运行代码，无依赖，可直接用于页面。
- `check.mjs`：自检。以 1.5 到 2.5 的每一档线宽和线性、面性两种变体渲染，测量关键形状、画布、间距、墨量、主体、线宽、整像素、光学中心、面性镂空留下的细边和残片，以及动效是否超出画布，结果写入 `findings.md`，并输出总览图、参考线叠图和逐帧图。
- `preview.mjs`：四种变体并排的预览图，用于检查线性双色和面性填充。
- `export.mjs`：导出独立 SVG，可选线宽、变体和颜色。
- `build.mjs`、`page.*`：预览页，构建为独立的 `index.html`。
- `chrome.mjs`：自检、预览和导出共用的无头 Chrome 工具。
- `CHANGELOG.md`：历次修改的问题和改法。遇到类似问题先查阅此文件。

## 流程

1. 通读 `GUIDE.md`。
2. 确定交付形式。用户未说明时先询问：
   - 静态：独立的 `.svg` 文件，选定线宽和变体。用户提到"切图""SVG 文件""放进 Figma""在 App 中使用"等，即为静态。
   - 带悬停动效：SVG 加 `motion.mjs`，在网页中运行。
3. 确定工作位置：
   - 新建一套：将 `kit.mjs`、`smooth.mjs`、`parts.mjs`、`variants.mjs`、`icons.mjs`、`set/`、`catalog.mjs`、`motion.mjs`、`check.mjs`、`sheet.mjs`、`frames.*`、`pixel.mjs`、`optical.mjs`、`sliver.mjs`、`ends.mjs`、`preview.mjs`、`export.mjs`、`chrome.mjs` 复制到目标位置，在副本中工作，保留各文件开头的版权声明。`GUIDE.md`、`SKILL.md` 和 `CHANGELOG.md` 只保留在 skill 中，不复制（见 `LICENSE` 第 3 条）。
   - 向已有的一套添加：在对应分类的 `set/<分类>.mjs` 中追加，新分类要在 `set/index.mjs` 登记。
4. 按 `GUIDE.md` 绘制：先写各部分的角色和墨量（第 3 节），选定关键形状（第 1 节），先阅读结构最接近的范例，能复用 `parts.mjs` 的部件就复用。动效表现物体在现实中的动作，有开关状态的写 `swap` 和 `enter`（第 5 节）；物体会转动、翻开或被扫描的，先按第 5.1 节判断是否用立体动作，参考地球、打开的书、笔记本电脑、扫码几个范例。同一物体的关闭、新建、完成等用规则生成的变体，不另画物体（第 4.4 节）。
5. 运行自检（第 6 节），清空 Findings，再按清单检查总览图、参考线叠图，以及 `preview.mjs` 输出的四种变体。
6. 导出（第 8 节），并告知用户所用的线宽、变体和颜色。

```bash
node check.mjs --only 新图标A,新图标B --out check-out/本次
node preview.mjs --only 新图标A,新图标B --out check-out/本次/preview.png
node export.mjs --only 新图标A,新图标B --stroke 2 --variant outline --out 目标目录
node export.mjs --variant line-duo --color #5A76F2 --out 目标目录
```

## 环境

- Node 18 及以上，以及 Chrome。可用环境变量 `CHROME` 指定浏览器路径。
- 自检和预览页用 esbuild 打包页面脚本，运行前先在工作目录安装：`npm install esbuild`。
- 所有检查在无头模式下运行，不打开可见窗口，也不影响用户正在使用的浏览器。

---

Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
