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
      <Title lead="除了分层图标，图标库里还有一部分双色面性图标：16 网格的实心图形，浅色主体加品牌色点缀，悬停时做符合图标意思的动作。适合界面里 16–48 像素的功能图标，例如导航、按钮、列表和标签页。">
        {page.zhTitle}
      </Title>
      <DuotoneWall />
      <p>把鼠标移到图标上可以看到动效。在<Link href="/zh/icons/?style=duotone">图标库</Link>里选择<strong>双色</strong>，就可以搜索、换色和复制代码。</p>
      <h2>改 import 路径就能切换风格</h2>
      <p>双色图标和分层图标的名字、参数都相同，切换风格只需要改一行 import。每个软件包都有一个 <code>duotone</code> 路径：</p>
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
      <p>双色图标比分层图标少。大部分双色图标都有同名的分层图标，少数只有双色版本。完整列表在 <code>kubai-icons/duotone/icons.json</code> 里，只有双色版本的图标标有 <code>only: true</code>。</p>
      <h2>颜色</h2>
      <p>主色跟随 <code>color</code>，没有设置时跟随 <code>currentColor</code>。浅色是主色以 40% 和白色混合得到的。想自己指定浅色，例如在深色背景上，可以设置 <code>--kd-b</code>：</p>
      <Code lang="css" code={`.sidebar .kubai-duotone { --kd-b: #2B3566; }`} />
      <p>分层图标的 <code>variant</code> 和 <code>badgeColor</code> 参数对双色图标不起作用。<code>svg-duotone/</code> 里的文件使用默认颜色 #5A76F2 和 #BDC8FA。</p>
      <h2>动效</h2>
      <p>每个图标在悬停时播放动效，<code>trigger</code>、<code>hover</code>、<code>title</code> 等参数和分层图标一样。例如盖子打开，日历撕下一页，信纸从信封里抽出来。只在悬停时出现的部件，在服务端渲染的标记里是隐藏的，脚本运行前不会闪现。开启"减少动态效果"时，图标直接显示动作结束时的样子。</p>
      <h2>变体</h2>
      <p><code>folder-plus</code>、<code>calendar-check</code>、<code>search-sparkle</code>、<code>bell-off</code> 等变体是在同一个物体上加一个角标：加号、减号、对勾、叉号、星光或斜线，大小和位置都固定。</p>
      <h2>画更多图标</h2>
      <p>双色图标是用 <Link href="/zh/skill/">kubai-duotone Skill</Link> 画的，遵循同一套规则，每个图标在加入图标库之前都会经过自检。你用它为自己的产品画的图标归你所有。</p>
      <Faq
        heading="常见问题"
        items={[
          { q: "一个页面里能混用两种风格吗？", a: "可以，但建议每个区域只用一种，例如侧边栏用双色，营销页用分层。两种风格的名字相同，把一个区域换成另一种风格只需要改一行 import。" },
          { q: "为什么我要的图标没有双色版本？", a: "双色图标优先覆盖常用的界面功能。暂时可以先用分层图标，或者用 kubai-duotone Skill 自己画。" },
          { q: "双色图标不用 JavaScript 能用吗？", a: "可以。标记在服务端渲染，`svg-duotone/` 里每个图标都有独立的文件。只有悬停动效需要脚本。" },
        ]}
      />
    </Prose>
  );
}
