import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/tabler/";
export const metadata = learnMeta(HREF, "zh");

const FACTS: [string, string, string][] = [
  ["风格", "三种风格共用名称：线性、双色面性和分层彩色", "线性图标，部分图标另有填充版本"],
  ["网格与描边", "线性：24 网格，圆角描边，粗细可取大于 0 的任意值（默认 2）。双色：16 网格，实心", "24 网格，圆角描边，默认粗细 2，可调整"],
  ["悬停动效", "每个图标都内置动效：锁梁抬起打开，书签丝带向下伸长", "不内置动效，图标是静态 SVG"],
  ["图标数量", "线性约 1,280 个，双色 502 个，分层 973 个（加上带角标和带斜线的版本共 3,078 个）", "线性图标 5,000 个以上，其中约 1,000 个另有填充版本"],
  ["变体", "线性：outline、line-duo、fill 和 solid-tint，每个图标都有", "线性，以及部分图标单独提供的填充版本"],
  ["颜色", "一种颜色，浅色和填充色由它混合得到", "描边或填充使用一种颜色"],
  ["软件包", "React、Vue、原生 JavaScript、Web Component 和静态 SVG", "React、Vue、Svelte、Solid、Preact、Angular、React Native、图标字体和 SVG 文件"],
  ["许可证", "MIT", "MIT"],
];

// The Tabler icon name (the React export is Icon + PascalCase) and the Kubai line icon.
const NAMES: [string, string][] = [
  ["home", "home"], ["search", "search"], ["settings", "settings"], ["user", "user"], ["users", "users"],
  ["user-plus", "user-plus"], ["mail", "mail"], ["mail-opened", "mail-open"], ["bell", "bell"], ["calendar", "calendar"],
  ["clock", "clock"], ["trash", "trash"], ["folder", "folder"], ["folder-open", "folder-open"], ["file-text", "file-text"],
  ["download", "download"], ["upload", "upload"], ["heart", "heart"], ["star", "star"], ["bookmark", "bookmark"],
  ["lock", "lock"], ["lock-open", "lock-open"], ["key", "key"], ["eye", "eye"], ["eye-off", "eye-off"], ["bell-off", "bell-off"],
  ["camera", "camera"], ["camera-off", "camera-off"], ["photo", "image"], ["phone", "phone"], ["message-circle", "message-circle"],
  ["send", "send"], ["share", "share"], ["map-pin", "map-pin"], ["map", "map"], ["world", "globe"],
  ["shopping-cart", "shopping-cart"], ["credit-card", "credit-card"], ["gift", "gift"], ["sun", "sun"], ["moon", "moon"],
  ["cloud", "cloud"], ["terminal", "terminal"], ["database", "database"], ["menu-2", "menu"], ["filter", "filter"],
  ["circle-check", "circle-check"], ["alert-triangle", "triangle-alert"], ["info-circle", "info"], ["rocket", "rocket"], ["stack-2", "layers"],
  ["dots", "more-horizontal"], ["dots-vertical", "more-vertical"], ["link", "link"], ["pencil", "pencil"], ["copy", "copy"],
  ["logout", "log-out"], ["login", "log-in"], ["bulb", "lightbulb"], ["x", "x"], ["check", "check"],
  ["plus", "plus"], ["minus", "minus"], ["chevron-down", "chevron-down"], ["arrow-right", "arrow-right"], ["loader-2", "loader-circle"],
];

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Tabler Icons 是一套规模很大的线性图标库，在 24 网格上用 2 像素圆角描边绘制。Kubai 的线性风格使用同样的网格和同样的默认粗细，提供四种变体，每个图标都有各自的悬停动效。两者都使用 MIT 许可证。">
        {page.zhTitle}
      </Title>
      <h2>概览</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Tabler Icons</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>适合选择 Tabler Icons 的情况</h2>
      <ul>
        <li>需要在大量不同物件上保持同一种线性风格，包括细分的技术和业务领域。</li>
        <li>需要品牌图标：Tabler 有几百个 <code>brand-</code> 图标，Kubai Icons 没有品牌图标。</li>
        <li>所用框架没有 Kubai Icons 的软件包，例如 Svelte、Solid、Angular 或 React Native。</li>
        <li>希望使用图标字体，或者希望每个图标的代码尽量少：Tabler 图标只有几条描边路径，不需要运行时。</li>
      </ul>
      <h2>适合选择 Kubai Icons 的情况</h2>
      <ul>
        <li>希望不写代码就有悬停动效：每个图标都会表现自身的含义，能表现状态变化的会直接表现出来。</li>
        <li>需要线性和填充以外的效果。每个线性图标都有 <code>line-duo</code>（内部部件为浅色）和 <code>solid-tint</code>（描边下方填浅色），用一个 prop 切换。</li>
        <li>希望各风格使用同一套名称：某个区域从线性换成分层彩色或双色，只需修改 import。</li>
        <li>以后需要同一风格的新图标。<Link href="/zh/skill/">kubai-line Skill</Link> 可以让编程 Agent 按同样的网格和描边绘制新图标。</li>
      </ul>
      <h2>从 Tabler Icons 迁移</h2>
      <p>安装对应框架的软件包，以 React 为例：</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>从 <code>line</code> 路径导入。Tabler 的名称以 <code>Icon</code> 开头，Kubai 的名称没有这个前缀，也可以使用带 <code>Icon</code> 后缀的写法，例如 <code>HomeIcon</code>。Tabler 的填充图标对应同一个 Kubai 图标加上变体：</p>
      <Code lang="tsx" code={`// 迁移前
import { IconHome, IconBell, IconHeartFilled } from "@tabler/icons-react";

<IconHome size={24} stroke={1.5} />
<IconHeartFilled size={20} />

// 迁移后
import { Home, Bell, Heart } from "kubai-icons-react/line";

<Home size={24} strokeWidth={1.5} />
<Heart size={20} variant="fill" />`} />
      <table>
        <thead><tr><th>@tabler/icons-react</th><th>kubai-icons-react/line</th></tr></thead>
        <tbody>
          <tr><td><code>size</code></td><td><code>size</code>，单位为像素，默认 24</td></tr>
          <tr><td><code>color</code></td><td><code>color</code>，默认 <code>currentColor</code></td></tr>
          <tr><td><code>stroke</code></td><td><code>strokeWidth</code>。两者默认都是 2，没改过粗细的可以不写</td></tr>
          <tr><td><code>Icon…Filled</code></td><td>同一个图标加 <code>variant=&quot;fill&quot;</code></td></tr>
          <tr><td><code>title</code></td><td><code>title</code>；不设置时图标对屏幕阅读器隐藏</td></tr>
          <tr><td><code>className</code> 等 SVG 属性</td><td>透传到 SVG</td></tr>
        </tbody>
      </table>
      <p>Tabler 会给每个 SVG 加上 <code>tabler-icon</code> 和 <code>tabler-icon-home</code> 这样的类名。如果 CSS 选择了这些类名，改为 <code>kubai-line</code> 和 <code>kubai-icon-home</code>。在 Vue 中从 <code>kubai-icons-vue/line</code> 导入，把 <code>:stroke</code> 改为 <code>:stroke-width</code>。使用 Tabler 图标字体的，把 <code>&lt;i class=&quot;ti ti-home&quot;&gt;</code> 换成 Web Component：<code>&lt;kubai-icon name=&quot;home&quot; icon-style=&quot;line&quot;&gt;</code>，详见<Link href="/zh/docs/guides/no-build/">无需构建工具</Link>。</p>
      <h2>没有直接对应的部分</h2>
      <ul>
        <li><strong>品牌图标。</strong>这部分继续使用 Tabler 的 <code>brand-</code> 图标，或使用各品牌官方提供的 SVG。</li>
        <li><strong>线性风格里没有的物件。</strong>Tabler 覆盖的物件多出几倍。先在<Link href="/zh/icons/?style=line">线性图标</Link>中搜索；没有的话，可以使用同名的分层或双色图标，或用 Skill 绘制。</li>
      </ul>
      <h2>名称对照表</h2>
      <p>常用 Tabler 图标对应的最接近的 Kubai 线性图标。两套图标的 Vue 软件包与 React 使用相同的名称。</p>
      <table>
        <thead><tr><th>@tabler/icons-react</th><th>kubai-icons-react/line</th></tr></thead>
        <tbody>
          {NAMES.map(([other, kubai]) => (
            <tr key={other}><td><code>{`Icon${pascal(other)}`}</code></td><td><Link href={`/zh/icons/?style=line&icon=${kubai}`}><code>{pascal(kubai)}</code></Link></td></tr>
          ))}
        </tbody>
      </table>
      <p>其他图标可以在<Link href="/zh/icons/?style=line">图标库</Link>中按名称或含义搜索。</p>
      <Faq
        heading="常见问题"
        items={[
          { q: "可以在同一个项目里同时使用 Tabler Icons 和 Kubai Icons 吗？", a: "可以。两个软件包互不依赖，可以逐个页面替换。两者都是 24 网格、默认 2 像素描边的线性图标，放在一起比大多数组合协调，但图形仍有差别，建议同一个工具栏只用一套。" },
          { q: "原来设置的粗细能直接沿用吗？", a: "可以。Tabler 的 `stroke` 和 Kubai 的 `strokeWidth` 都按 24 像素下的粗细计算，默认都是 2。Kubai 可取大于 0 的任意值。" },
          { q: "每个图标都有填充版本吗？", a: "有。每个线性图标都可以用 `variant=\"fill\"`（封闭图形填实，细节镂空）和 `variant=\"solid-tint\"`（描边下方填浅色）。" },
          { q: "可以在商业项目中使用 Kubai Icons 吗？", a: "可以。和 Tabler Icons 一样，Kubai Icons 使用 MIT 许可证，允许商业使用，只需保留许可证声明。" },
        ]}
      />
    </Prose>
  );
}
