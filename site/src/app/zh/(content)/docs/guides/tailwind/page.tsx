import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/tailwind/";
export const metadata = learnMeta(HREF, "zh");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Kubai Icons 不需要 Tailwind 插件，也不需要额外配置。图标的所有色调都由一个主色计算得出，主色默认是 currentColor，所以平时给文字用的工具类也能直接给图标设置颜色。">
        {page.zhTitle}
      </Title>
      <p>下面的示例使用 React。在 Vue 中把 <code>className</code> 换成 <code>class</code>；使用 Web Component 时，把类名加在 <code>&lt;kubai-icon&gt;</code> 或它的父元素上。</p>
      <h2>颜色</h2>
      <p>在图标上，或在包住它的任意元素上，设置文字颜色类：</p>
      <Code lang="tsx" code={`import { Leaf, Bell } from "kubai-icons-react";

<Leaf className="text-emerald-500" />

<p className="text-amber-500">
  <Bell /> Reminders
</p>`} />
      <p>渐变、轮廓和内部图形都由这一个颜色派生，所以一个类就能改变整个图标的颜色。<code>color</code> prop 的效果相同，并且优先于继承来的颜色。</p>
      <h2>尺寸</h2>
      <p><code>size</code> prop 以像素为单位设置宽度和高度。Tailwind 的尺寸类同样有效，因为 CSS 的 width 和 height 会覆盖 SVG 自身的属性：</p>
      <Code lang="tsx" code={`<Folder size={20} />
<Folder className="size-5" />          {/* also 20px */}
<Folder className="size-6 md:size-8" /> {/* responsive */}`} />
      <h2>深色模式</h2>
      <p>和文字一样，给颜色类配一个 <code>dark:</code> 变体：</p>
      <Code lang="tsx" code={`<Folder className="text-blue-600 dark:text-blue-400" />`} />
      <p>如果希望切换主题时颜色平滑过渡，加上 <code>transition-colors</code>。<code>color</code> 的过渡会让图标里的所有渐变平滑过渡到新颜色。</p>
      <Code lang="tsx" code={`<Folder className="text-blue-600 transition-colors dark:text-blue-400" />`} />
      <p>要让整个主题使用 soft 样式，请参阅<Link href="/zh/docs/guides/colors-dark-mode/">颜色和深色模式</Link>。</p>
      <h2>角标颜色和单独的色调</h2>
      <p>图标会读取几个 CSS 自定义属性，Tailwind 可以用任意属性写法来设置它们。例如 <code>--ki-b</code> 是带角标图标的角标圆底颜色：</p>
      <Code lang="tsx" code={`import { FolderPlus } from "kubai-icons-react";

<FolderPlus className="text-sky-500 [--ki-b:#7C3AED]" />`} />
      <p>其他属性见<Link href="/zh/docs/customize/">自定义</Link>。设置角标颜色时，通常用 <code>badgeColor</code> prop 更简单：<code>badgeColor=&quot;semantic&quot;</code> 会为添加用绿色、移除用红色，以此类推。</p>
      <h2>悬停整组元素</h2>
      <p>Tailwind 的 <code>group</code> 和 <code>group-hover:</code> 只改变样式，不会启动图标的动效。要在悬停整组元素时播放动效，在同一个元素上加 <code>data-kubai-trigger</code>，并给图标设置 <code>trigger=&quot;parent&quot;</code>：</p>
      <Code lang="tsx" code={`import { Rocket } from "kubai-icons-react";

<a href="/launch" data-kubai-trigger className="group flex items-center gap-2 rounded-lg p-3 hover:bg-zinc-100">
  <Rocket className="size-6 text-zinc-500 group-hover:text-violet-600" trigger="parent" />
  Launch
</a>`} />
      <p>这里类名负责在悬停时改变颜色，触发器负责播放动效，两者会同时发生。更多写法见<Link href="/zh/docs/guides/button-hover/">悬停按钮时播放图标动效</Link>。</p>
      <h2>静态 SVG 文件</h2>
      <p><code>kubai-icons-static</code> 中的文件已经写入了颜色，文字颜色类不会改变它们。像普通图片一样设置尺寸即可。每个文件都为投影留出了边距，所以 28px 的图片与 24px 的动态图标大小一致：</p>
      <Code lang="html" code={`<img src="https://cdn.jsdelivr.net/npm/kubai-icons-static@0/svg/folder.svg" class="size-7" alt="" />`} />
      <Faq
        heading="常见问题"
        items={[
          { q: "需要把图标包加入 Tailwind 的扫描路径吗？", a: "不需要。图标本身不使用 Tailwind 类，Tailwind 无需扫描这个软件包，只需要扫描你自己写的文件。" },
          { q: "可以用 `fill-*` 或 `stroke-*` 工具类改颜色吗？", a: "不建议。每个图标的填充和轮廓都由主色计算得出，请使用 `text-*` 类或 `color` prop。" },
          { q: "`size-5` 和 `size` prop 冲突吗？", a: "类名优先，因为 CSS 会覆盖 `size` prop 设置的 width 和 height 属性。两者选其一即可。" },
          { q: "可以用主题里的 CSS 变量作为颜色吗？", a: "可以。任何 CSS 颜色都有效，例如 Tailwind v4 中的 `text-(--brand)`，或在图标上设置 `color=\"var(--brand)\"`。" },
        ]}
      />
    </Prose>
  );
}
