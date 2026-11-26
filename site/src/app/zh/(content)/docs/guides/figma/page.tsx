import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/figma/";
export const metadata = learnMeta(HREF, "zh");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="设计工具无法播放悬停动效，所以使用图标静止状态的静态文件。图标库导出的 SVG 和 PNG 文件使用普通的十六进制颜色，Figma、Sketch 等设计工具都能正确读取。">
        {page.zhTitle}
      </Title>
      <h2>先选好颜色</h2>
      <p>打开<Link href="/zh/icons/">图标库</Link>，在工具栏中选择主色（预设色块或自定义十六进制颜色）和样式（<strong>彩色</strong>或<strong>柔和</strong>）。所有复制和下载都使用这些设置，所以请在导出前设置好。选择<strong>多色</strong>时，每个图标会使用调色板中各自的颜色。</p>
      <h2>复制到 Figma</h2>
      <p>点击图标打开它的面板，再点击<strong>复制 SVG</strong>。在 Figma 中按 <kbd>⌘V</kbd> 或 <kbd>Ctrl+V</kbd> 粘贴：Figma 会把粘贴的 SVG 代码转换为可以缩放和编辑的矢量图层。带角标的图标会使用面板中选择的角标颜色。</p>
      <h2>下载 SVG 或 PNG</h2>
      <p>同一个面板中有两个下载按钮：</p>
      <ul>
        <li><strong>SVG</strong> 下载以图标名称命名的矢量文件，例如 <code>folder.svg</code>，可用于 Figma、Sketch、Illustrator 等支持导入 SVG 的工具。</li>
        <li><strong>PNG</strong> 下载 512×512 的图片，适合幻灯片、文档和不支持 SVG 的工具。</li>
      </ul>
      <p>导出的文件在图标周围为投影留出了少量边距。</p>
      <h2>把一组图标保存为 ZIP</h2>
      <p>需要一次导出多个图标时，在每个图标的面板中点击收藏按钮，把它加入收藏夹。收藏夹保存在当前浏览器中。收藏图标后，页面底部会出现一个操作栏，点击已收藏数量即可打开收藏夹，在其中可以：</p>
      <ul>
        <li>为所有收藏的图标统一设置一种颜色（或多色）和一种样式；</li>
        <li>选择 SVG 或 PNG，然后点击<strong>下载 ZIP</strong>；</li>
        <li>点击<strong>复制链接</strong>，在其他设备上打开同一组图标，或发给同事。</li>
      </ul>
      <p>常见产品类型的现成图标组合见<Link href="/zh/icons/sets/">图标合集</Link>。</p>
      <h2>通过 URL 获取任意颜色</h2>
      <p>每个图标都可以通过一个固定地址获取 SVG，主色可以任意指定。这适合能从 URL 导入图片的工具，以及无法安装软件包的编程 Agent：</p>
      <Code lang="text" code={`https://icons.kubai.design/api/icon/folder.svg?color=EC4899&variant=soft&size=512`} />
      <ul>
        <li><code>color</code>：六位十六进制颜色值，可带或不带 <code>#</code>。默认值：5393FF。</li>
        <li><code>variant</code>：<code>color</code> 或 <code>soft</code>。</li>
        <li><code>badge</code>：<code>semantic</code> 或十六进制颜色值，用于带角标的图标。</li>
        <li><code>size</code>：宽度和高度，单位为像素，范围 16 到 2048。默认值：96。</li>
      </ul>
      <h2>获取全部图标文件</h2>
      <p>如果需要完整的本地副本，例如搭建素材库或把图标打包进原生应用，可以安装静态软件包：</p>
      <Code lang="bash" code="npm install kubai-icons-static" />
      <p><code>svg/</code> 包含默认蓝色（<code>#5393FF</code>）的全部图标，<code>svg-soft/</code> 包含 soft 样式的全部图标，<code>icons.json</code> 列出每个图标的分类和标签。每个文件都为投影留出了边距，所以要与 24px 的动态图标大小一致，应以 28px 放置文件。</p>
      <Faq
        heading="常见问题"
        items={[
          { q: "有 Figma 插件吗？", a: "没有。可以在图标库中复制 SVG 后粘贴到 Figma，或者导入下载的 SVG 文件。" },
          { q: "导出的文件保留动效吗？", a: "不保留。SVG 和 PNG 导出的是图标的静止状态。动效只在 React、Vue、JavaScript 软件包和 Web Component 中运行。" },
          { q: "可以修改图标，并用于商业项目吗？", a: "可以。图标采用 MIT 许可证，无论是否商用，都可以使用、修改和再分发。请在源文件中保留版权声明。" },
          { q: "为什么同样尺寸下，下载的图标看起来比动态图标小？", a: "文件为投影留出了边距。以 28px 显示的文件与 24px 的动态图标大小一致。" },
        ]}
      />
    </Prose>
  );
}
