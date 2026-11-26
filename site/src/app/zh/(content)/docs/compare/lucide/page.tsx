import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/lucide/";
export const metadata = learnMeta(HREF, "zh");

const FACTS: [string, string, string][] = [
  ["风格", "三种风格共用名称：线性、双色面性和分层彩色", "线性图标，在 24×24 网格上用 2px 描边绘制"],
  ["悬停动效", "每个图标都内置动效：锁梁抬起打开，文件夹会打开", "不内置动效，图标是静态 SVG"],
  ["图标数量", "线性约 1,280 个，双色 502 个，分层 973 个（加上带角标和带斜线的版本共 3,078 个）", "1,600 个以上"],
  ["变体", "线性：outline、line-duo、fill 和 solid-tint，粗细可取大于 0 的任意值。分层：color 和 soft，另有带角标版本", "一种样式，描边粗细可调"],
  ["颜色", "一个主色，浅色、填充色和渐变都由它派生", "描边使用一种颜色"],
  ["软件包", "React、Vue、原生 JavaScript、Web Component 和静态 SVG", "React、React Native、Vue、Svelte、Preact、Solid、Angular、Astro、原生 JavaScript 和静态 SVG"],
  ["许可证", "MIT", "ISC"],
];

// The lucide-react export, the Kubai icon, and the icon's page when the Kubai icon is a badged version.
const NAMES: [string, string, string?][] = [
  ["House", "home"], ["Search", "search"], ["Settings", "settings"], ["User", "user"], ["Users", "users"],
  ["UserPlus", "user-plus", "user"], ["Mail", "mail"], ["Bell", "bell"], ["BellOff", "bell-off", "bell"], ["Calendar", "calendar"],
  ["Clock", "clock"], ["Trash", "trash"], ["Folder", "folder"], ["FolderOpen", "folder-open"], ["FileText", "file-text"],
  ["Download", "download"], ["Heart", "heart"], ["Star", "star"], ["Bookmark", "bookmark"], ["Lock", "lock"],
  ["LockOpen", "lock-open"], ["Key", "key"], ["Eye", "eye"], ["EyeOff", "eye-off", "eye"], ["Camera", "camera"],
  ["Image", "image"], ["Phone", "phone"], ["MessageCircle", "message-circle"], ["Send", "send"], ["Share2", "share"],
  ["MapPin", "map-pin"], ["Globe", "globe"], ["ShoppingCart", "shopping-cart"], ["CreditCard", "credit-card"], ["Gift", "gift"],
  ["Sun", "sun"], ["Moon", "moon"], ["Cloud", "cloud"], ["Terminal", "terminal"], ["Database", "database"],
  ["Menu", "menu"], ["Funnel", "filter"], ["Link", "link"], ["Pencil", "pencil"], ["Copy", "copy"],
  ["LogOut", "log-out"], ["CircleCheck", "circle-check"], ["Info", "info"], ["Rocket", "rocket"], ["Ellipsis", "more-horizontal"],
];

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Lucide 是一套由社区维护的大型 24 网格线性图标库。Kubai Icons 提供名称共用的三种风格——同样基于 24 网格的线性图标、双色面性图标和分层彩色图标——每个图标都有各自的悬停动效。两者都开源，都可以在 React、Vue 和纯 SVG 中使用。">
        {page.zhTitle}
      </Title>
      <h2>概览</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Lucide</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>适合选择 Lucide 的情况</h2>
      <ul>
        <li>界面使用细线图标，图标在文字旁边需要保持低调。</li>
        <li>需要的物件只有非常大的图标库才有，或者需要大量细分技术领域的图标。</li>
        <li>所用框架没有 Kubai Icons 的软件包，例如 React Native、Svelte 或 Angular。Web 端的框架可以使用 Kubai 的 Web Component。</li>
        <li>希望每个图标的代码尽量少：Lucide 图标只有几条描边路径，不需要运行时。</li>
      </ul>
      <h2>适合选择 Kubai Icons 的情况</h2>
      <ul>
        <li>希望图标有颜色和层次，同时彼此统一，全部由一个主色派生。</li>
        <li>希望不写代码就有悬停动效：每个图标都会演示物件本身的动作，时长约半秒。</li>
        <li>需要同一图形的相关状态，例如 <code>folder-plus</code>、<code>user-check</code> 或 <code>bell-off</code>。</li>
        <li>以后需要同一风格的新图标。<Link href="/zh/skill/">Kubai Icons Skill</Link> 可以让编程 Agent 绘制新图标。</li>
      </ul>
      <h2>从 Lucide 迁移</h2>
      <p>安装对应框架的软件包，以 React 为例：</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>然后修改导入语句。两套图标都使用 PascalCase 的简短英文名称，所以很多名称相同：</p>
      <Code lang="tsx" code={`// 迁移前
import { House, Bell, Settings } from "lucide-react";

// 迁移后（同为 24 网格的线性风格；去掉 "/line" 则为分层彩色图标）
import { Home, Bell, Settings } from "kubai-icons-react/line";`} />
      <p>在线性风格中，<code>size</code>、<code>color</code> 和 <code>strokeWidth</code> 的用法相同：<code>size</code> 设置宽高（单位为像素），<code>color</code> 默认为 <code>currentColor</code>，<code>strokeWidth</code> 默认为 2（去掉 <code>absoluteStrokeWidth</code>）。需要填充或双色线性效果时，把 <code>variant</code> 设为 <code>&quot;fill&quot;</code>、<code>&quot;line-duo&quot;</code> 或 <code>&quot;solid-tint&quot;</code>；需要分层彩色图标时，改为从 <code>kubai-icons-react</code> 导入。<code>className</code> 等其他 SVG 属性会透传。详见<Link href="/zh/docs/guides/line/">线性风格</Link>和 <Link href="/zh/docs/react/">React 的 Props</Link>。</p>
      <h2>名称对照表</h2>
      <p>常用 Lucide 图标对应的最接近的 Kubai 图标。较新的 lucide-react 也会以别名导出旧名称，例如 <code>AlertTriangle</code>。</p>
      <table>
        <thead><tr><th>lucide-react</th><th>kubai-icons-react</th></tr></thead>
        <tbody>
          {NAMES.map(([other, kubai, base]) => (
            <tr key={other}><td><code>{other}</code></td><td><Link href={`/zh/icons/${base ?? kubai}/`}><code>{pascal(kubai)}</code></Link></td></tr>
          ))}
        </tbody>
      </table>
      <p>其他图标可以在<Link href="/zh/icons/">图标库</Link>中按名称或含义搜索。</p>
      <Faq
        heading="常见问题"
        items={[
          { q: "可以在同一个项目里同时使用 Lucide 和 Kubai Icons 吗？", a: "可以。两个软件包互不依赖，可以逐个页面替换。两种风格放在一起差别明显，建议不要在同一个工具栏里混用。" },
          { q: "有类似 Lucide 的线性样式吗？", a: "有。从 `kubai-icons-react/line`（或 `kubai-icons-vue/line`）导入即可：基于 24 网格的圆角描边图标，`strokeWidth` 默认为 2，并提供 `line-duo`、`fill` 和 `solid-tint` 变体。" },
          { q: "一个图标会让打包体积增加多少？", a: "压缩并 gzip 后，第一个 Kubai 图标连同共享运行时约 4 KB，之后每个图标约 0.6 KB。未导入的图标会被移除。" },
          { q: "可以在商业项目中使用 Kubai Icons 吗？", a: "可以。Kubai Icons 使用 MIT 许可证，Lucide 使用 ISC 许可证，两者都允许商业使用，只需保留许可证声明。" },
        ]}
      />
    </Prose>
  );
}
