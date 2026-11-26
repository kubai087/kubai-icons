import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/hugeicons/";
export const metadata = learnMeta(HREF, "zh");

const FACTS: [string, string, string][] = [
  ["风格", "三种风格共用名称：线性、双色面性和分层彩色", "线性图标；免费版只有 Stroke Rounded 一种风格"],
  ["网格与描边", "线性：24 网格，圆角描边，粗细可取大于 0 的任意值（默认 2）。双色：16 网格，实心", "24 网格，圆角描边，默认粗细 1.5，可调整"],
  ["悬停动效", "每个图标都内置动效：锁梁抬起打开，书签丝带向下长出", "不内置动效，图标是静态 SVG"],
  ["图标数量", "线性约 1,270 个，双色 502 个，分层 973 个（加上带角标和带斜线的版本共 3,078 个）", "免费版有数千个；付费的 Pro 版数量多得多"],
  ["变体", "线性：outline、line-duo、fill 和 solid-tint，全部免费", "免费版只有 Stroke Rounded。Pro 版另有实心、双色、bulk 等风格"],
  ["颜色", "一种颜色，浅色和填充色由它混合得到", "一种颜色；Pro 版的双色风格可设置主色和辅色"],
  ["软件包", "React、Vue、原生 JavaScript、Web Component 和静态 SVG", "React、React Native、Vue、Svelte 和 Angular，图标数据放在单独的软件包里"],
  ["许可证", "MIT", "免费版为 MIT；Pro 版使用 Hugeicons 的付费许可"],
];

// The Hugeicons free export and the Kubai line icon.
const NAMES: [string, string][] = [
  ["Home01Icon", "home"], ["Search01Icon", "search"], ["Settings01Icon", "settings"], ["UserIcon", "user"], ["UserGroupIcon", "users"],
  ["UserAdd01Icon", "user-plus"], ["Mail01Icon", "mail"], ["MailOpen01Icon", "mail-open"], ["Notification01Icon", "bell"], ["Calendar01Icon", "calendar"],
  ["Clock01Icon", "clock"], ["Delete02Icon", "trash"], ["Folder01Icon", "folder"], ["FolderOpenIcon", "folder-open"], ["FileTextIcon", "file-text"],
  ["Download01Icon", "download"], ["Upload01Icon", "upload"], ["FavouriteIcon", "heart"], ["StarIcon", "star"], ["Bookmark01Icon", "bookmark"],
  ["LockIcon", "lock"], ["LockOpenIcon", "lock-open"], ["Key01Icon", "key"], ["ViewIcon", "eye"], ["ViewOffIcon", "eye-off"],
  ["Camera01Icon", "camera"], ["Image01Icon", "image"], ["CallIcon", "phone"], ["BubbleChatIcon", "message-circle"], ["SentIcon", "send"],
  ["Share01Icon", "share"], ["Location01Icon", "map-pin"], ["MapsIcon", "map"], ["GlobeIcon", "globe"], ["ShoppingCart01Icon", "shopping-cart"],
  ["CreditCardIcon", "credit-card"], ["GiftIcon", "gift"], ["Sun01Icon", "sun"], ["Moon02Icon", "moon"], ["CloudIcon", "cloud"],
  ["ComputerTerminal01Icon", "terminal"], ["DatabaseIcon", "database"], ["Menu01Icon", "menu"], ["FilterIcon", "filter"], ["CheckmarkCircle01Icon", "circle-check"],
  ["InformationCircleIcon", "info"], ["RocketIcon", "rocket"], ["Layers01Icon", "layers"], ["MoreHorizontalIcon", "more-horizontal"], ["MoreVerticalIcon", "more-vertical"],
  ["Link01Icon", "link"], ["PencilIcon", "pencil"], ["Copy01Icon", "copy"], ["Logout01Icon", "log-out"], ["Login01Icon", "log-in"],
  ["BulbIcon", "lightbulb"], ["Cancel01Icon", "x"], ["Tick02Icon", "check"], ["Add01Icon", "plus"], ["MinusSignIcon", "minus"],
];

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Hugeicons 是一套规模较大的线性图标库，免费版只有一种圆角描边风格，付费的 Pro 版有更多风格。Kubai 的线性风格同样在 24 网格上用圆角描边绘制，免费软件包里就有四种变体，每个图标都有各自的悬停动效。">
        {page.zhTitle}
      </Title>
      <h2>概览</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Hugeicons</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>适合选择 Hugeicons 的情况</h2>
      <ul>
        <li>需要在大量不同物件上保持同一种线性风格。</li>
        <li>希望同一物件有几种画法可选：很多名称带编号，例如 <code>Home01Icon</code>、<code>Home02Icon</code>、<code>Home03Icon</code> 等。</li>
        <li>项目使用 React Native、Svelte 或 Angular，Hugeicons 有对应的软件包，Kubai Icons 没有。在网页端，Svelte 和 Angular 也可以使用 Kubai 的 Web Component。</li>
        <li>已购买 Pro 版，需要同一套图标的实心、双色等其他风格。</li>
      </ul>
      <h2>适合选择 Kubai Icons 的情况</h2>
      <ul>
        <li>希望不写代码就有悬停动效：每个图标都会表现自身的含义，能表现状态变化的会直接表现出来。</li>
        <li>不付费也能用填充和双色效果：<code>fill</code>、<code>line-duo</code> 和 <code>solid-tint</code> 是每个免费线性图标都有的变体。</li>
        <li>希望各风格使用同一套名称：某个区域从线性换成分层彩色或双色，只需修改 import。</li>
        <li>以后需要同一风格的新图标。<Link href="/zh/skill/">kubai-line Skill</Link> 可以让编程 Agent 按同样的网格和描边绘制新图标。</li>
      </ul>
      <h2>Hugeicons 的风格与 Kubai 中的对应</h2>
      <p>Hugeicons 免费版只有一种风格，Pro 版另有实心和双色的风格。Kubai 的每个线性图标都免费提供相应的变体，实心双色的效果则由双色风格提供：</p>
      <table>
        <thead><tr><th>Hugeicons 风格</th><th>外观</th><th>Kubai 中最接近的</th></tr></thead>
        <tbody>
          <tr><td>Stroke Rounded（免费）</td><td>单色圆角线条</td><td>线性风格，<code>variant=&quot;outline&quot;</code></td></tr>
          <tr><td>Stroke Sharp、Stroke Standard（Pro）</td><td>直角或普通转角的线条</td><td>没有直角风格，用 <code>outline</code></td></tr>
          <tr><td>Solid（Pro）</td><td>实心形状，细节镂空</td><td>线性风格，<code>variant=&quot;fill&quot;</code></td></tr>
          <tr><td>Duotone（Pro）</td><td>线条加浅色填充的区域</td><td>线性风格，<code>variant=&quot;solid-tint&quot;</code></td></tr>
          <tr><td>Twotone（Pro）</td><td>两种颜色的线条</td><td>线性风格，<code>variant=&quot;line-duo&quot;</code></td></tr>
          <tr><td>Bulk（Pro）</td><td>浅色实心形状加深色细节</td><td><Link href="/zh/docs/guides/duotone/">双色风格</Link>，<code>kubai-icons-react/duotone</code></td></tr>
        </tbody>
      </table>
      <p>Hugeicons 的双色风格要分别传入主色和辅色；Kubai 从一个颜色混合出浅色和填充色，也可以用 <code>--kl-light</code> 和 <code>--kl-fill</code> 单独指定。四种设色方法见<Link href="/zh/docs/guides/line/">线性风格指南</Link>。</p>
      <h2>从 Hugeicons 迁移</h2>
      <p>安装对应框架的软件包，以 React 为例：</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>Hugeicons 用同一个 <code>HugeiconsIcon</code> 组件渲染所有图标，图形数据从另一个软件包导入。Kubai Icons 的每个图标都是单独的组件，从 <code>line</code> 路径导入：</p>
      <Code lang="tsx" code={`// 迁移前
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, Notification01Icon } from "@hugeicons/core-free-icons";

<HugeiconsIcon icon={Home01Icon} size={24} color="currentColor" strokeWidth={1.5} />

// 迁移后
import { Home, Bell } from "kubai-icons-react/line";

<Home size={24} strokeWidth={1.5} />`} />
      <table>
        <thead><tr><th>@hugeicons/react</th><th>kubai-icons-react/line</th></tr></thead>
        <tbody>
          <tr><td><code>icon=&#123;Home01Icon&#125;</code></td><td>直接使用组件：<code>&lt;Home /&gt;</code></td></tr>
          <tr><td><code>size</code></td><td><code>size</code>，单位为像素，默认 24</td></tr>
          <tr><td><code>color</code></td><td><code>color</code>，默认 <code>currentColor</code></td></tr>
          <tr><td><code>strokeWidth</code></td><td><code>strokeWidth</code>。不设置时 Hugeicons 按 1.5 绘制，Kubai 按 2 绘制，所以要保持原来的粗细，需写 <code>strokeWidth=&#123;1.5&#125;</code></td></tr>
          <tr><td><code>absoluteStrokeWidth</code></td><td>没有对应项；粗细按 24 像素计算，随图标一起缩放</td></tr>
          <tr><td><code>primaryColor</code>、<code>secondaryColor</code></td><td><code>color</code> 加 <code>variant=&quot;line-duo&quot;</code>；浅色用 <code>--kl-light</code> 设置</td></tr>
          <tr><td><code>altIcon</code>、<code>showAlt</code></td><td>自行切换渲染另一个图标。书签这类点按切换的图标可以用 <code>active</code></td></tr>
          <tr><td><code>className</code> 等 SVG 属性</td><td>透传到 SVG</td></tr>
        </tbody>
      </table>
      <p>旧的 <code>hugeicons-react</code> 软件包已弃用，它把每个图标导出为组件，例如 <code>&lt;Home01Icon /&gt;</code>，同样适用下面的名称对照表。在 Vue 中从 <code>kubai-icons-vue/line</code> 导入，粗细写作 <code>:stroke-width</code>。变体和颜色详见<Link href="/zh/docs/guides/line/">线性风格</Link>。</p>
      <h2>没有直接对应的部分</h2>
      <ul>
        <li><strong>带编号的多种画法。</strong>Kubai Icons 每个物件只有一种画法，<code>Home01Icon</code>、<code>Home02Icon</code> 等都对应 <code>Home</code>。</li>
        <li><strong>Pro 版的风格。</strong>最接近实心风格的是 <code>variant=&quot;fill&quot;</code> 和<Link href="/zh/docs/guides/duotone/">双色风格</Link>。没有直角风格。</li>
        <li><strong>线性风格里没有的物件。</strong>Hugeicons 覆盖的物件更多。先在<Link href="/zh/icons/?style=line">线性图标</Link>中搜索；没有的话，可以使用同名的分层或双色图标，或用 Skill 绘制。</li>
      </ul>
      <h2>名称对照表</h2>
      <p>常用 Hugeicons 图标对应的最接近的 Kubai 线性图标。同一物件有多个编号版本时，表中只列一个，其他编号对应同一个 Kubai 图标。</p>
      <table>
        <thead><tr><th>@hugeicons/core-free-icons</th><th>kubai-icons-react/line</th></tr></thead>
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
          { q: "可以在同一个项目里同时使用 Hugeicons 和 Kubai Icons 吗？", a: "可以。两个软件包互不依赖，可以逐个页面替换。两者都是 24 网格的圆角线性图标，但图形有差别，建议同一个工具栏只用一套。" },
          { q: "粗细设成多少和 Hugeicons 一致？", a: "1.5，这是 Hugeicons 的默认粗细。Kubai 线性图标默认为 2，可以在每个图标上写 `strokeWidth={1.5}`，或者把用到的图标包一层自己的组件。" },
          { q: "有实心风格吗？", a: "每个线性图标都可以用 `variant=\"fill\"`，封闭图形填实，细节镂空。需要双色的实心效果，可以使用 `kubai-icons-react/duotone` 中的双色风格。" },
          { q: "可以在商业项目中使用 Kubai Icons 吗？", a: "可以。Kubai Icons 使用 MIT 许可证，允许商业使用，只需保留许可证声明。Hugeicons 的免费软件包同样使用 MIT 许可证，Pro 版图标使用 Hugeicons 自己的付费许可。" },
        ]}
      />
    </Prose>
  );
}
