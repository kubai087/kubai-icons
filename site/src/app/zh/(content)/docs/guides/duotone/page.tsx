import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { DuotoneWall } from "@/learn/duotone-wall";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/duotone/";
export const metadata = learnMeta(HREF, "zh");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="除分层图标外，图标库还提供一部分双色面性图标：16 网格的实心图形，浅色主体加品牌色点缀，悬停时播放表现图标含义的动效。适用于界面中 16–48 像素的功能图标，如导航、按钮、列表和标签页。">
        {page.zhTitle}
      </Title>
      <DuotoneWall />
      <p>图标会依次播放动效，鼠标悬停时停在悬停姿态。如需搜索、换色或复制代码，在<Link href="/zh/icons/?style=duotone">图标库</Link>中选择<strong>双色</strong>。</p>
      <h2>通过 import 路径切换风格</h2>
      <p>双色图标与分层图标的名称和参数相同，切换风格只需修改一行 import。每个软件包都提供 <code>duotone</code> 路径：</p>
      <Code lang="tsx" code={`// 分层
import { Folder, BellOff } from "kubai-icons-react";
// 双色
import { Folder, BellOff } from "kubai-icons-react/duotone";

<Folder size={24} color="#5A76F2" />`} />
      <table>
        <thead><tr><th>软件包</th><th>双色</th></tr></thead>
        <tbody>
          <tr><td>React</td><td><code>kubai-icons-react/duotone</code></td></tr>
          <tr><td>Vue</td><td><code>kubai-icons-vue/duotone</code></td></tr>
          <tr><td>JavaScript</td><td><code>kubai-icons/duotone</code></td></tr>
          <tr><td>Web Component</td><td><code>&lt;kubai-icon name=&quot;folder&quot; icon-style=&quot;duotone&quot;&gt;</code></td></tr>
          <tr><td>静态 SVG</td><td><code>kubai-icons-static/svg-duotone/folder.svg</code></td></tr>
        </tbody>
      </table>
      <p>双色图标的数量少于分层图标。大部分双色图标有同名的分层图标，少数只有双色版本。完整列表见 <code>kubai-icons/duotone/icons.json</code>，仅有双色版本的图标标有 <code>only: true</code>。</p>
      <h2>颜色</h2>
      <p>主色取 <code>color</code>，未设置时取 <code>currentColor</code>。浅色由主色以 40% 与白色混合得到。如需自行指定浅色（例如在深色背景上），设置 <code>--kd-b</code>：</p>
      <Code lang="css" code={`.sidebar .kubai-duotone { --kd-b: #2B3566; }`} />
      <p>分层图标的 <code>variant</code> 和 <code>badgeColor</code> 参数对双色图标无效。<code>svg-duotone/</code> 中的文件使用默认颜色 #5A76F2 和 #BDC8FA。</p>
      <h2>动效</h2>
      <p>每个图标在悬停时播放动效，<code>trigger</code>、<code>hover</code>、<code>title</code> 等参数与分层图标相同。例如盖子打开、日历撕下一页、信纸从信封中抽出。只在悬停时出现的部件在服务端渲染的标记中处于隐藏状态，脚本运行前不会闪现。开启"减少动态效果"时，图标直接显示动作结束时的姿态。</p>
      <h2>变体</h2>
      <p><code>folder-plus</code>、<code>calendar-check</code>、<code>search-sparkle</code>、<code>bell-off</code> 等变体在同一物体上加一个角标：加号、减号、对勾、叉号、星光或斜线，大小和位置固定。</p>
      <h2>绘制更多图标</h2>
      <p>双色图标由 <Link href="/zh/skill/">kubai-duotone Skill</Link> 绘制，遵循同一套规则，每个图标在加入图标库前都经过自检。用它为自己的产品绘制的图标归你所有。</p>
      <Faq
        heading="常见问题"
        items={[
          { q: "一个页面中能否混用两种风格？", a: "可以，但建议每个区域只用一种，例如侧边栏用双色，营销页用分层。两种风格的名称相同，将一个区域换成另一种风格只需修改一行 import。" },
          { q: "为什么我需要的图标没有双色版本？", a: "双色图标优先覆盖常用的界面功能。可暂时使用分层图标，或用 kubai-duotone Skill 自行绘制。" },
          { q: "不使用 JavaScript 能否使用双色图标？", a: "可以。标记在服务端渲染，`svg-duotone/` 中每个图标都有独立的文件。只有悬停动效需要脚本。" },
        ]}
      />
    </Prose>
  );
}
