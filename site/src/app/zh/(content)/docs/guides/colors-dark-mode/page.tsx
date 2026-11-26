import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/colors-dark-mode/";
export const metadata = learnMeta(HREF, "zh");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="每个图标都有渐变、轮廓和内部图形，但只需要设置一个主色，其余色调都在 CSS 中由它计算得出。所以换色、主题和深色模式，归结起来就是设置这一个颜色，需要时再选择一种样式。">
        {page.zhTitle}
      </Title>
      <h2>主色</h2>
      <p>主色默认是 <code>currentColor</code>，也就是图标周围的文字颜色。可以用 <code>color</code> prop 在图标上设置，也可以在图标或任意祖先元素上设置 CSS <code>color</code> 属性：</p>
      <Code lang="tsx" code={`import { Folder, Leaf } from "kubai-icons-react";

<Folder color="#6366F1" />

<span style={{ color: "#14B8A6" }}>
  <Leaf /> Sustainability
</span>`} />
      <p>任何 CSS 颜色都可以使用，包括主题变量，例如 <code>color=&quot;var(--brand)&quot;</code>。色调由 <code>color-mix()</code> 计算，所以给 <code>color</code> 加上过渡后，所有渐变都会平滑过渡到新颜色：</p>
      <Code lang="css" code={`.kubai-icon { transition: color .3s ease; }`} />
      <h2>角标</h2>
      <p>带角标的图标（例如 <code>folder-plus</code> 或 <code>user-check</code>）在一角有一个圆形角标，默认是深灰色圆底加白色符号。<code>badgeColor</code> 可以把圆底设为任意颜色，<code>badgeColor=&quot;semantic&quot;</code> 会为每种角标选择合适的颜色：添加用绿色，移除用红色，警告用琥珀色。</p>
      <Code lang="tsx" code={`import { FolderPlus } from "kubai-icons-react";

<FolderPlus />                          {/* dark badge */}
<FolderPlus badgeColor="semantic" />    {/* green plus */}
<FolderPlus badgeColor="#7C3AED" />`} />
      <h2>color 和 soft 两种样式</h2>
      <p>默认的 <code>color</code> 样式使用饱和度较高的填充色。<code>soft</code> 使用更浅的填充色和更深的轮廓，并以深色绘制原本白色的内部图形。可以只给一个图标设置：</p>
      <Code lang="tsx" code={`<Folder variant="soft" />`} />
      <p>也可以给整个页面或某个区域设置一次。样式和颜色一样会向下继承，离图标最近的设置优先：先看图标自己的 prop，再看最近的元素，最后是默认值。</p>
      <Code lang="tsx" code={`import { Folder, VARIANTS } from "kubai-icons-react";

<body style={VARIANTS.soft}>
  <Folder />                  {/* soft */}
  <Folder variant="color" />  {/* color */}
</body>`} />
      <p>在 Vue 中，用 <code>:style</code> 绑定同一个对象。不使用框架时，调用 <code>setVariant</code>：</p>
      <Code lang="js" code={`import { setVariant } from "kubai-icons/runtime";

setVariant(document.documentElement, "soft");`} />
      <h2>深色模式</h2>
      <p>主色跟随文字颜色，所以主题切换时，图标会随文字颜色一起变化。如果希望每个主题使用特定的主色，可以把它放在 CSS 变量中：</p>
      <Code lang="css" code={`:root { --icon-accent: #2563EB; }
.dark { --icon-accent: #60A5FA; }`} />
      <Code lang="tsx" code={`<Folder color="var(--icon-accent)" />`} />
      <p>要让样式随主题切换，在主题变化时调用 <code>setVariant</code>。下面的例子跟随系统设置；如果应用里有自己的主题开关，就在开关的逻辑中调用：</p>
      <Code lang="js" code={`import { setVariant } from "kubai-icons/runtime";

const dark = matchMedia("(prefers-color-scheme: dark)");
const apply = () => setVariant(document.documentElement, dark.matches ? "soft" : "color");
apply();
dark.addEventListener("change", apply);`} />
      <p>React 和 Vue 软件包也导出了 <code>setVariant</code>，在这两个框架中不需要另外导入。</p>
      <h2>单独设置某个色调</h2>
      <p>需要更细的控制时，在图标或任意祖先元素上设置以下自定义属性。内部图形指图标上绘制的线条和符号。</p>
      <table>
        <thead><tr><th>属性</th><th>控制的内容</th></tr></thead>
        <tbody>
          <tr><td><code>--ki-c</code></td><td>渐变和浅色内部图形的基础色。默认值：<code>currentColor</code>。</td></tr>
          <tr><td><code>--ki-e</code></td><td>轮廓和深色内部图形的基础色。默认值：<code>--ki-c</code>。</td></tr>
          <tr><td><code>--ki-w</code></td><td>默认为白色的内部图形的颜色。</td></tr>
          <tr><td><code>--ki-b</code></td><td>角标圆底的颜色。默认值：中性深灰色。</td></tr>
          <tr><td><code>--ki-l</code></td><td>大面积实色填充向顶部淡化为白色的程度，从 0% 到 100%。</td></tr>
        </tbody>
      </table>
      <p>soft 样式会设置除 <code>--ki-b</code> 以外的所有属性。</p>
      <h2>静态文件和下载</h2>
      <p>静态 SVG 文件已经写入了颜色。<code>kubai-icons-static</code> 中，<code>svg/</code> 是默认蓝色（<code>#5393FF</code>），<code>svg-soft/</code> 是 soft 样式。需要其他颜色时，可以通过 URL 获取图标，也可以在<Link href="/zh/icons/">图标库</Link>中选好颜色和样式后下载：</p>
      <Code lang="html" code={`<img src="https://icons.kubai.design/api/icon/folder.svg?color=EC4899&variant=soft" width="28" height="28" alt="" />`} />
      <p>静态文件不会自动适配深色模式。可以为每个主题准备一个文件，例如用 <code>&lt;picture&gt;</code> 元素配合 <code>prefers-color-scheme</code> 媒体查询切换。</p>
      <Faq
        heading="常见问题"
        items={[
          { q: "为什么我的图标是灰色的？", a: "没有设置 `color` 时，主色是 `currentColor`，图标会使用周围的文字颜色。在图标上设置 `color` prop 或 CSS 颜色即可。" },
          { q: "轮廓能和填充用不同的颜色吗？", a: "可以。`--ki-c` 是填充和浅色内部图形的基础色，`--ki-e` 是轮廓和深色内部图形的基础色，可以在图标或祖先元素上分别设置。" },
          { q: "深色模式下应该用哪种样式？", a: "两种都可以。根据图标在你的背景上的显示效果来选择，然后在主题变化时用 `setVariant` 或 `variant` prop 切换。" },
          { q: "改颜色会让图标重新渲染吗？", a: "不会。颜色由 CSS 控制，给整页图标换色只是一次样式修改。" },
        ]}
      />
    </Prose>
  );
}
