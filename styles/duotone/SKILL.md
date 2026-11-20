---
name: kubai-duotone
description: 生成一套风格统一的双色面性功能图标：16 网格的实心图标，浅色主体加主色点缀，所有颜色从一个主色推导，悬停时做符合图标意思的动作，也可以导出静态 SVG。带加号、对勾、叉号、减号、星光角标和关闭斜杠的变体按同一套位置生成。用户要做面性、实心、填充、双色、duotone、bulk 图标，要界面里 16–48px 的功能图标，或要往这套双色图标里加新图标时使用。
license: Kubai Icons License (source-available). Complete terms in LICENSE.
metadata:
  version: "0.1.0"
  display_name: "Kubai 双色图标"
  display_name_en: "Kubai Duotone Icons"
  description_zh: "按同一种风格画出双色面性功能图标：16 网格，浅色主体加主色点缀，悬停时做符合图标意思的动作，可以导出静态 SVG。"
  description_en: "Draws two-tone solid functional icons in one consistent style: a 16 grid, light bodies with accents in the brand colour, hover motion that acts out each icon, and static SVG export."
---

# Kubai 双色图标

这个 skill 自带双色面性风格的完整实现：规则、几何工具、范例、悬停动效、自检和导出。你的工作是按规则写新图标，不是重写几何或渲染代码。

## 包里有什么

- `GUIDE.md`：全部规则，每一条都是硬性要求。动手前完整读一遍。
- `kit.mjs`：几何和渲染：平滑圆角、圆角矩形、胶囊、带凸起的主体、关键形状、角标、颜色推导。直接复用，不要改。
- `icons.mjs`：范例，多数是功能图标，也包括带角标和关闭斜杠的变体。新图标按同样的格式追加。
- `motions.mjs`：每个范例的悬停动效（`GUIDE.md` 第 11 节）。
- `motion.mjs`：动效的运行代码，没有依赖，可以直接放进页面。
- `check.mjs`：自检。截出各尺寸、参考线对位图和 1 倍屏 16px，测量关键形状、主色占比、两种颜色、间距、遮挡、小部件尺寸、内嵌部件的边距、动效是否超出画布，结果写进 `findings.md`。
- `export.mjs`：导出独立 SVG，可以换品牌色，辅色自动推导。
- `chrome.mjs`：两个脚本共用的无头 Chrome 工具。
- `CHANGELOG.md`：每次修改的问题和改法。遇到类似问题时先查这里。

## 流程

1. 完整读一遍 `GUIDE.md`。
2. 确定交付形式。用户没说清楚时先问一句：
   - 静态：独立的 `.svg` 文件，任何地方都能用。用户提到"切图""SVG 文件""放进 Figma""App 里用"等，就是要静态。
   - 带悬停动效：SVG 加 `motion.mjs`，在页面里运行。
3. 确定在哪里做：
   - 新做一套：把 `kit.mjs`、`icons.mjs`、`motion.mjs`、`motions.mjs`、`check.mjs`、`export.mjs`、`chrome.mjs` 复制到目标位置，在副本里工作，保留每个文件开头的版权声明。`GUIDE.md`、`SKILL.md` 和 `CHANGELOG.md` 只留在 skill 里，不要复制进去（见 `LICENSE` 第 3 条）。
   - 往已有的一套里加：直接在那份 `icons.mjs` 和 `motions.mjs` 里追加。
4. 按 `GUIDE.md` 的流程画：给每个功能定物体（第 1 节），选关键形状（第 2 节），先读结构最接近的范例（第 8 节）。同一个物体的加、减、完成、删除、AI、关闭等变体，用角标做（第 12 节），不要另画一个物体。
5. 运行自检（第 9 节），把 Findings 清空，再对照清单看截图。带动效的，在 22px 下确认停住的样子能看懂（第 11 节）。
6. 导出（第 10 节），告诉用户用的主色和辅色。

```bash
node check.mjs --only 新图标A,新图标B --with folder,lock,calendar
node export.mjs --only 新图标A,新图标B --size 24 --out 目标目录
node export.mjs --primary #0EA5E9 --out 目标目录
```

## 环境

- Node 18 以上，以及 Chrome。浏览器路径可以用环境变量 `CHROME` 覆盖。
- 所有检查都在无头模式下进行，不会打开任何可见窗口，也不会动用户正在用的浏览器。

---

Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
