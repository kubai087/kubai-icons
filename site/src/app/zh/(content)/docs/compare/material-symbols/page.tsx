import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/material-symbols/";
export const metadata = learnMeta(HREF, "zh");

const FACTS: [string, string, string][] = [
  ["风格", "三种风格共用名称：线性、双色面性和分层彩色", "三种风格：Outlined、Rounded 和 Sharp"],
  ["网格", "线性：24 网格，圆角描边。双色：16 网格，实心", "默认尺寸下为 24 网格，光学尺寸可在 20 到 48 之间调整"],
  ["调整方式", "线性：粗细可取大于 0 的任意值，有四种变体，都通过 props 设置", "可变字体的轴：填充、字重（100 到 700）、等级和光学尺寸"],
  ["悬停动效", "每个图标都内置动效：锁梁抬起打开，书签丝带向下伸长", "不内置动效；轴数值之间的变化可以用 CSS 过渡实现"],
  ["图标数量", "线性约 1,280 个，双色 502 个，分层 973 个（加上带角标和带斜线的版本共 3,078 个）", "3,000 个以上，每个都有三种风格"],
  ["提供方式", "React 和 Vue 组件、原生 JavaScript、Web Component 和静态 SVG", "Google Fonts 提供的可变图标字体和 SVG 文件；各框架的封装由社区软件包提供"],
  ["许可证", "MIT", "Apache 2.0"],
];

// The Material Symbols name and the Kubai line icon.
const NAMES: [string, string][] = [
  ["home", "home"], ["search", "search"], ["settings", "settings"], ["person", "user"], ["group", "users"],
  ["person_add", "user-plus"], ["mail", "mail"], ["drafts", "mail-open"], ["notifications", "bell"], ["calendar_today", "calendar"],
  ["schedule", "clock"], ["delete", "trash"], ["folder", "folder"], ["folder_open", "folder-open"], ["description", "file-text"],
  ["download", "download"], ["upload", "upload"], ["favorite", "heart"], ["star", "star"], ["bookmark", "bookmark"],
  ["lock", "lock"], ["lock_open", "lock-open"], ["key", "key"], ["visibility", "eye"], ["visibility_off", "eye-off"], ["notifications_off", "bell-off"],
  ["photo_camera", "camera"], ["image", "image"], ["call", "phone"], ["chat_bubble", "message-circle"], ["send", "send"],
  ["share", "share"], ["location_on", "map-pin"], ["map", "map"], ["public", "globe"], ["shopping_cart", "shopping-cart"],
  ["credit_card", "credit-card"], ["redeem", "gift"], ["light_mode", "sun"], ["dark_mode", "moon"], ["cloud", "cloud"],
  ["terminal", "terminal"], ["database", "database"], ["menu", "menu"], ["filter_alt", "filter"], ["check_circle", "circle-check"],
  ["warning", "triangle-alert"], ["info", "info"], ["rocket_launch", "rocket"], ["layers", "layers"], ["more_horiz", "more-horizontal"],
  ["more_vert", "more-vertical"], ["link", "link"], ["edit", "pencil"], ["content_copy", "copy"], ["logout", "log-out"],
  ["login", "log-in"], ["lightbulb", "lightbulb"], ["close", "x"], ["check", "check"], ["add", "plus"],
  ["remove", "minus"], ["keyboard_arrow_down", "chevron-down"], ["arrow_forward", "arrow-right"], ["progress_activity", "loader-circle"],
];

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Material Symbols 是 Google 为 Material Design 提供的图标，以可变字体发布，可以调整填充、字重、等级和光学尺寸。Kubai 的线性风格是一套圆角线性图标，尺寸和样式通过 props 设置，每个图标都有各自的悬停动效。">
        {page.zhTitle}
      </Title>
      <h2>概览</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Material Symbols</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>适合选择 Material Symbols 的情况</h2>
      <ul>
        <li>产品遵循 Material Design，或者和 Android、Google 应用放在一起，图标需要与之一致。</li>
        <li>需要按文字调整字重和等级，或者用光学尺寸让小尺寸图标保持清晰。</li>
        <li>希望使用图标字体：在 span 中写上 <code>home</code> 这样的名称即可显示，不需要 JavaScript。</li>
        <li>需要大量系统和设备相关的符号，并且每个都有 outlined、rounded 和 sharp 三种形式。</li>
      </ul>
      <h2>适合选择 Kubai Icons 的情况</h2>
      <ul>
        <li>希望不写代码就有悬停动效：每个图标都会表现自身的含义，能表现状态变化的会直接表现出来。</li>
        <li>希望打包结果里只有用到的图标：每个 Kubai 图标都是单独的模块，未导入的图标不会打包。</li>
        <li>需要双色效果：<code>line-duo</code> 让内部部件显示为浅色，<code>solid-tint</code> 在描边下方填浅色。</li>
        <li>希望各风格使用同一套名称：某个区域从线性换成分层彩色或双色，只需修改 import。</li>
      </ul>
      <h2>从 Material Symbols 迁移</h2>
      <p>Material Symbols 大多以字体方式使用，所以迁移时要把每个 span 换成组件。安装对应框架的软件包，以 React 为例：</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>从 <code>line</code> 路径导入，把字体设置改写成 props：</p>
      <Code lang="tsx" code={`// 迁移前
<span className="material-symbols-rounded">notifications</span>
<span className="material-symbols-rounded" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
  favorite
</span>

// 迁移后
import { Bell, Heart } from "kubai-icons-react/line";

<Bell size={24} />
<Heart size={20} variant="fill" />`} />
      <table>
        <thead><tr><th>Material Symbols</th><th>kubai-icons-react/line</th></tr></thead>
        <tbody>
          <tr><td><code>font-size</code></td><td><code>size</code>，单位为像素，默认 24</td></tr>
          <tr><td>CSS <code>color</code></td><td><code>color</code>，默认 <code>currentColor</code>，所以文字颜色依然生效</td></tr>
          <tr><td><code>FILL</code> 1</td><td><code>variant=&quot;fill&quot;</code>；需要描边下方填浅色时用 <code>variant=&quot;solid-tint&quot;</code></td></tr>
          <tr><td><code>wght</code></td><td><code>strokeWidth</code>。按视觉效果选择：默认字重 400 约对应 2，字重更细时取小一些，更粗时取大一些</td></tr>
          <tr><td><code>GRAD</code></td><td>没有对应项；在深色背景上把 <code>strokeWidth</code> 略微调小，效果相近</td></tr>
          <tr><td><code>opsz</code></td><td>没有对应项；16 像素时用 2.5，32 像素及以上用 1.5</td></tr>
          <tr><td>Outlined、Rounded、Sharp</td><td>线性风格是圆角描边，最接近 Rounded</td></tr>
        </tbody>
      </table>
      <p>需要无障碍名称时传入 <code>title</code>；不传时图标对屏幕阅读器隐藏，和作为装饰的字体图标通常的处理一样。如果通过组件库使用 Material 图标，对应方式相同：MUI 的 <code>fontSize</code> 这类尺寸参数改为以像素为单位的 <code>size</code>，主题色改为 CSS 颜色。在纯 HTML 中用 Web Component 替换 span：<code>&lt;kubai-icon name=&quot;bell&quot; icon-style=&quot;line&quot;&gt;</code>，详见<Link href="/zh/docs/guides/no-build/">无需构建工具</Link>。</p>
      <h2>没有直接对应的部分</h2>
      <ul>
        <li><strong>等级和光学尺寸。</strong>Kubai 线性图标只调整描边粗细，按尺寸和背景选择合适的值即可。</li>
        <li><strong>Sharp 风格。</strong>线性图标的端点和转角都是圆角。</li>
        <li><strong>以文本形式写的名称。</strong>写在 span 里的 Material 名称要改成 import。运行时才确定的图标，可以使用 <code>kubai-icons-react/line/dynamic</code> 中的 <Link href="/zh/docs/react/"><code>DynamicIcon</code></Link> 或 Web Component，两者都接受字符串形式的名称。</li>
        <li><strong>线性风格里没有的物件。</strong>Material Symbols 覆盖的物件更多，尤其是系统和设备类符号。先在<Link href="/zh/icons/?style=line">线性图标</Link>中搜索；没有的话，可以使用同名的分层或双色图标，或用 <Link href="/zh/skill/">kubai-line Skill</Link> 绘制。</li>
      </ul>
      <h2>名称对照表</h2>
      <p>常用 Material Symbols 对应的最接近的 Kubai 线性图标。Material 的名称使用下划线分隔，用词也常常不同，例如用户是 <code>person</code>，眼睛是 <code>visibility</code>。</p>
      <table>
        <thead><tr><th>Material Symbols</th><th>kubai-icons-react/line</th></tr></thead>
        <tbody>
          {NAMES.map(([other, kubai]) => (
            <tr key={other}><td><code>{other}</code></td><td><Link href={`/zh/icons/?style=line&icon=${kubai}`}><code>{pascal(kubai)}</code></Link></td></tr>
          ))}
        </tbody>
      </table>
      <p>其他图标可以在<Link href="/zh/icons/?style=line">图标库</Link>中按名称或含义搜索。</p>
      <Faq
        heading="常见问题"
        items={[
          { q: "可以在同一个项目里同时使用 Material Symbols 和 Kubai Icons 吗？", a: "可以。两者互不依赖，可以逐个页面替换，最后一个 span 换掉后再移除字体。两者图形不同，建议同一个工具栏只用一套。" },
          { q: "怎样和 Material 的字重对齐？", a: "把字重 400 的 Material 图标和同尺寸的 Kubai 线性图标放在一起，从 `strokeWidth={2}` 开始比较。字重更细时往 1.5 调，更粗时往 2.5 调。" },
          { q: "Kubai 图标会像字体那样晚一步显示吗？", a: "不会。组件随页面一起输出 SVG，在服务端渲染时也一样，不会出现字体加载前先显示图标名称文字的情况。" },
          { q: "可以在商业项目中使用 Kubai Icons 吗？", a: "可以。Kubai Icons 使用 MIT 许可证，Material Symbols 使用 Apache 2.0 许可证，两者都允许商业使用，只需保留许可证声明。" },
        ]}
      />
    </Prose>
  );
}
