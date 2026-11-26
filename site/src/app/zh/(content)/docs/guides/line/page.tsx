import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { LineWall } from "@/learn/style-wall";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/line/";
export const metadata = learnMeta(HREF, "zh");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="除分层和双色图标外，图标库还提供线性图标：24 网格上的圆角描边，粗细可在 0.25 到 3 之间选择，有四种变体，悬停时播放表现图标含义的动效。适用于和文字并排的界面图标，常用尺寸为 16–32 像素。">
        {page.zhTitle}
      </Title>
      <LineWall />
      <p>图标会依次播放动效，鼠标悬停时停在悬停姿态。如需搜索、换色、切换变体或粗细并复制代码，在<Link href="/zh/icons/?style=line">图标库</Link>中选择<strong>线性</strong>。</p>
      <h2>通过 import 路径切换风格</h2>
      <p>同一物体在两种风格中都有时，线性图标与分层图标同名，切换风格只需修改一行 import。每个软件包都提供 <code>line</code> 路径：</p>
      <Code lang="tsx" code={`// 分层
import { Lock, Camera } from "kubai-icons-react";
// 线性
import { Lock, Camera } from "kubai-icons-react/line";

<Lock size={24} strokeWidth={2} variant="line-duo" />`} />
      <table>
        <thead><tr><th>软件包</th><th>线性</th></tr></thead>
        <tbody>
          <tr><td>React</td><td><code>kubai-icons-react/line</code></td></tr>
          <tr><td>Vue</td><td><code>kubai-icons-vue/line</code></td></tr>
          <tr><td>JavaScript</td><td><code>kubai-icons/line</code></td></tr>
          <tr><td>Web Component</td><td><code>&lt;kubai-icon name=&quot;lock&quot; icon-style=&quot;line&quot; stroke-width=&quot;2&quot;&gt;</code></td></tr>
          <tr><td>静态 SVG</td><td><code>kubai-icons-static/svg-line/lock.svg</code></td></tr>
        </tbody>
      </table>
      <p>大部分线性图标都有同名的分层图标，少数只在线性风格中提供。完整列表见 <code>kubai-icons/line/icons.json</code>，其中只有线性版的图标带有 <code>only: true</code>。</p>
      <h2>粗细</h2>
      <p><code>strokeWidth</code> 可取大于 0 的任意值，默认为 2；本站的图标浏览器提供 0.25 到 3，初始为 1.75。建议与旁边文字的字重对应：细体用 1.5，常规用 2，中等用 2.25，粗体用 2.5。在 Vue 中写作 <code>:stroke-width</code>，在 Web Component 上写作 <code>stroke-width</code>。</p>
      <p>在 24 像素、粗细为 2 时，所有边缘都落在整像素上。外轮廓按外边缘定位，所以图标在任何粗细下都保持同样的尺寸，内部细节会随粗细调整位置以保持间距。1.5 到 2.5 之间的粗细逐个图标检查过，其他粗细使用最接近的已检查几何绘制。</p>
      <h2>变体</h2>
      <table>
        <thead><tr><th><code>variant</code></th><th>效果</th></tr></thead>
        <tbody>
          <tr><td><code>outline</code>（默认）</td><td>线性：单色描边。</td></tr>
          <tr><td><code>line-duo</code></td><td>线性双色：内部和关键部件为浅色，深色描边压在浅色上方。</td></tr>
          <tr><td><code>fill</code></td><td>面性：封闭图形填实，细节镂空。</td></tr>
          <tr><td><code>solid-tint</code></td><td>面性填充：深色描边下方填浅色，视觉上构成封闭的区域也会填充，例如刷新箭头的内侧。</td></tr>
        </tbody>
      </table>
      <p>同一物体始终只用一种色调：<code>line-duo</code> 的浅色标记的是一个完整部件，例如相机的镜头，不会把一个图形拆成两半。</p>
      <h2>颜色</h2>
      <p>线性图标最多用三种颜色：线条、浅色和填充色。各变体用到哪几种：</p>
      <table>
        <thead><tr><th><code>variant</code></th><th>线条和形状</th><th>浅色</th><th>填充色</th></tr></thead>
        <tbody>
          <tr><td><code>outline</code></td><td>所有线条</td><td>–</td><td>–</td></tr>
          <tr><td><code>line-duo</code></td><td>外侧线条</td><td>内部和关键部件</td><td>–</td></tr>
          <tr><td><code>fill</code></td><td>所有形状，实心</td><td>–</td><td>–</td></tr>
          <tr><td><code>solid-tint</code></td><td>所有线条</td><td>–</td><td>围合的区域</td></tr>
        </tbody>
      </table>
      <p>设置颜色有四种方法，由简到繁：</p>
      <ol>
        <li><strong>只给一个颜色。</strong>设置 <code>color</code>；不设置时跟随文字颜色（<code>currentColor</code>）。线条用这个颜色，浅色是它向白色混合 42%，填充色是 20%，一个颜色就得到一整套配色。</li>
        <li><strong>向背景混合。</strong>在深色或彩色背景上，把 <code>--kl-bg</code> 设为背景色，浅色和填充色就向它混合，而不是向白色。</li>
        <li><strong>单独指定浅色和填充色。</strong><code>--kl-light</code> 设置 <code>line-duo</code> 的浅色，<code>--kl-fill</code> 设置 <code>solid-tint</code> 的填充色，例如线条用中性色、浅色和填充用品牌色。</li>
        <li><strong>写死在文件里。</strong><code>lineStill()</code> 输出一个独立的 SVG，三种颜色直接写在文件里，适合设计工具和不能用 CSS 的地方。</li>
      </ol>
      <Code lang="css" code={`.dark .kubai-line { --kl-bg: #0B0D14; }
.sidebar .kubai-line { --kl-light: #BDC8FA; --kl-fill: #E8ECFD; }`} />
      <p>分层图标的 <code>badgeColor</code> 参数在这里不生效。<code>svg-line/</code> 中的文件为线性变体、粗细 2、颜色为 <code>currentColor</code>。</p>
      <h2>动效</h2>
      <p>每个图标在悬停时播放动效，<code>trigger</code>、<code>hover</code> 和 <code>title</code> 参数与其他风格相同。动效尽量表现状态变化：锁的锁梁抬起打开，书签丝带向下长出，垃圾桶的盖子抬起，斜线沿着要关闭的图标画出。有些动效让部件在空间里运动，外轮廓保持不动：地球的经线绕球转动，打开的书一页页翻过，笔记本电脑的屏幕绕铰链合上；整个过程中线宽不变。开启减少动态效果后，图标保持静止。</p>
      <h2>绘制更多图标</h2>
      <p>线性图标使用 <Link href="/zh/skill/">kubai-line Skill</Link> 绘制，它遵循同样的网格、描边和布局规则，每个图标在加入图标库前都会在各个粗细下检查。用它为你自己的产品绘制的图标归你所有。</p>
      <Faq
        heading="常见问题"
        items={[
          { q: "线性风格可以和其他风格混用吗？", a: "可以，但建议每个区域只用一种风格，例如工具栏用线性图标、宣传页用分层图标。同一物体在两种风格中名称相同，把某个区域换成另一种风格只需修改一行 import。" },
          { q: "粗细应该选多少？", a: "24 像素时从 2 开始。旁边是细体文字或图标在 32 像素以上时用 1.5；旁边是粗体文字或图标只有 16 像素时用 2.5，避免细线显得太淡。" },
          { q: "为什么线性图标里没有我要的图标？", a: "线性图标优先覆盖常用的界面功能。暂时可以使用分层或双色图标，或用 kubai-line Skill 自己绘制。" },
          { q: "没有 JavaScript 时线性图标能用吗？", a: "可以。标记会按选定的粗细和变体在服务端渲染，`svg-line/` 中也有每个图标的独立文件。只有悬停动效需要脚本。" },
        ]}
      />
    </Prose>
  );
}
