import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/no-build/";
export const metadata = learnMeta(HREF, "zh");

const SCRIPT = `<script type="module" src="https://cdn.jsdelivr.net/npm/kubai-icons@0/dist/cdn/element.js"></script>`;

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="<kubai-icon> Web Component 只需一个 script 标签就能在任意页面中使用全部图标。它不需要打包工具，也不需要安装，可用于纯 HTML、CMS 页面，以及能渲染自定义元素的框架。">
        {page.zhTitle}
      </Title>
      <h2>纯 HTML</h2>
      <p>在 <code>&lt;head&gt;</code> 中或图标之前的任意位置加载一次组件，然后每个图标写一个元素：</p>
      <Code lang="html" code={`${SCRIPT}

<kubai-icon name="folder"></kubai-icon>
<kubai-icon name="bell-off" size="32" color="#F97316" variant="soft" label="Muted"></kubai-icon>`} />
      <p>脚本会在某个图标第一次使用时，从同一个 CDN 加载该图标的文件，所以页面只下载实际显示的图标。图标加载完成前，元素已经占好了尺寸，页面布局不会跳动。</p>
      <h2>属性</h2>
      <table>
        <thead><tr><th>属性</th><th>默认值</th><th>说明</th></tr></thead>
        <tbody>
          <tr><td><code>name</code></td><td>无</td><td>图标的 kebab-case 名称，例如 <code>folder-plus</code>。名称不存在时不显示任何内容。</td></tr>
          <tr><td><code>size</code></td><td>24</td><td>宽度和高度，单位为像素。</td></tr>
          <tr><td><code>color</code></td><td>currentColor</td><td>主色，所有色调都由它计算得出。</td></tr>
          <tr><td><code>variant</code></td><td>color</td><td><code>soft</code> 使用更浅的填充色和更深的轮廓。</td></tr>
          <tr><td><code>badge-color</code></td><td>深灰色</td><td>角标圆底的颜色，也可以设为 <code>semantic</code>。</td></tr>
          <tr><td><code>trigger</code></td><td>hover</td><td><code>hover</code>、<code>parent</code> 或 <code>none</code>，见下文。</td></tr>
          <tr><td><code>label</code></td><td>无</td><td>无障碍名称。不设置时，屏幕阅读器会跳过这个图标。</td></tr>
        </tbody>
      </table>
      <p>之后修改属性（例如在你自己的脚本中修改）会重新绘制图标。</p>
      <h2>悬停链接或按钮时播放动效</h2>
      <p>给链接或按钮加上 <code>data-kubai-trigger</code>，给图标设置 <code>trigger=&quot;parent&quot;</code>。如果没有这个属性，图标会监听它的直接父元素。</p>
      <Code lang="html" code={`<a href="/downloads" data-kubai-trigger>
  <kubai-icon name="download" size="18" trigger="parent"></kubai-icon>
  Downloads
</a>`} />
      <h2>WordPress 和其他 CMS</h2>
      <p>在 WordPress 区块编辑器中添加一个“自定义 HTML”区块，把 script 标签和图标粘贴进去。如果很多页面都会用到图标，可以通过主题或在 head 中插入代码的插件，把 script 标签在站点头部添加一次，区块中只写 <code>&lt;kubai-icon&gt;</code> 元素。支持自定义 HTML 的其他 CMS 和建站工具也可以用同样的方法。</p>
      <Code lang="html" code={`${SCRIPT}

<p style="color: #14B8A6">
  <kubai-icon name="leaf" size="28"></kubai-icon>
  Grown without pesticides
</p>`} />
      <h2>Svelte 和 SvelteKit</h2>
      <p>在 SvelteKit 中把 script 标签加到 <code>src/app.html</code>，在 Vite 应用中加到 <code>index.html</code>。Svelte 会按原样渲染自定义元素，属性也可以绑定：</p>
      <Code lang="svelte" code={`<script>
  let { icon = "folder" } = $props();
</script>

<kubai-icon name={icon} size="24"></kubai-icon>`} />
      <h2>Angular</h2>
      <p>把 script 标签加到 <code>src/index.html</code>。Angular 默认不接受未知元素，需要在组件中加入 <code>CUSTOM_ELEMENTS_SCHEMA</code>：</p>
      <Code lang="ts" code={`import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "app-toolbar",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <button data-kubai-trigger>
      <kubai-icon name="settings" size="18" trigger="parent"></kubai-icon>
      Settings
    </button>
    <kubai-icon [attr.name]="iconName"></kubai-icon>
  \`,
})
export class ToolbarComponent {
  iconName = "inbox";
}`} />
      <p>用 <code>[attr.name]</code> 把组件属性绑定到元素的属性上。</p>
      <h2>Astro</h2>
      <p>在布局的 <code>&lt;head&gt;</code> 中加入带 <code>is:inline</code> 的 script 标签，让 Astro 保持原样输出，然后在任意页面或组件中使用这个元素：</p>
      <Code lang="astro" code={`---
// src/layouts/Base.astro
---
<html lang="en">
  <head>
    <script is:inline type="module" src="https://cdn.jsdelivr.net/npm/kubai-icons@0/dist/cdn/element.js"></script>
  </head>
  <body>
    <kubai-icon name="rocket" size="32"></kubai-icon>
    <slot />
  </body>
</html>`} />
      <h2>完全不用脚本的图片</h2>
      <p>在不允许脚本的地方，例如 README 或 Markdown 页面，可以在 <code>&lt;img&gt;</code> 标签中使用静态 SVG 文件，这种方式没有动效。详见<Link href="/zh/docs/static/">静态 SVG</Link>。</p>
      <Code lang="html" code={`<img src="https://icons.kubai.design/api/icon/folder.svg?color=EC4899" width="28" height="28" alt="" />`} />
      <Faq
        heading="常见问题"
        items={[
          { q: "CDN 脚本加载的是哪个版本？", a: "带 `@0` 的地址会加载最新的 0.x 版本，页面不用修改就能用上新图标。CDN 切换到新版本可能需要一段时间。如果希望页面保持不变，可以固定一个具体版本，例如 `kubai-icons@0.16.0`。" },
          { q: "Web Component 可以在 React 或 Vue 中使用吗？", a: "可以，但在这两个框架中更适合使用 `kubai-icons-react` 和 `kubai-icons-vue`：它们支持服务端渲染，并通过 props 设置。" },
          { q: "怎样查到图标的名称？", a: "打开图标库，按词语或含义搜索即可。每个图标的面板上都会显示它的 kebab-case 名称，例如 `calendar-check`。" },
          { q: "动效对无障碍友好吗？", a: "键盘焦点会像悬停一样播放动效，触屏设备上点按会播放，设置了 `prefers-reduced-motion` 时不播放动画。" },
        ]}
      />
    </Prose>
  );
}
