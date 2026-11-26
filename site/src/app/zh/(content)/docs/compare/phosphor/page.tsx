import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/phosphor/";
export const metadata = learnMeta(HREF, "zh");

const FACTS: [string, string, string][] = [
  ["风格", "三种风格共用名称：线性、双色面性和分层彩色", "扁平图标，有六种字重"],
  ["悬停动效", "每个图标都内置动效：锁梁抬起打开，文件夹会打开", "不内置动效，图标是静态 SVG"],
  ["图标数量", "线性约 1,280 个，双色 502 个，分层 973 个（加上带角标和带斜线的版本共 3,078 个）", "1,500 个以上，每个都有全部字重"],
  ["变体", "线性：粗细可调，并提供 outline、line-duo、fill 和 solid-tint。分层：color 和 soft", "thin、light、regular、bold、fill 和 duotone"],
  ["颜色", "一个主色，浅色、填充色和渐变都由它派生", "一种颜色；duotone 会加一层同色的浅色填充"],
  ["软件包", "React、Vue、原生 JavaScript、Web Component 和静态 SVG", "React、Vue、用于网页的图标字体、SVG 文件，以及 Flutter、SwiftUI 等平台的库"],
  ["许可证", "MIT", "MIT"],
];

// The Phosphor React export, the Kubai icon, and the icon's page when the Kubai icon is a badged version.
const NAMES: [string, string, string?][] = [
  ["HouseIcon", "home"], ["MagnifyingGlassIcon", "search"], ["GearIcon", "settings"], ["UserIcon", "user"], ["UsersIcon", "users"],
  ["UserPlusIcon", "user-plus", "user"], ["EnvelopeIcon", "mail"], ["EnvelopeOpenIcon", "mail-open"], ["BellIcon", "bell"], ["BellSlashIcon", "bell-off", "bell"],
  ["CalendarIcon", "calendar"], ["ClockIcon", "clock"], ["TrashIcon", "trash"], ["FolderIcon", "folder"], ["FolderOpenIcon", "folder-open"],
  ["FileTextIcon", "file-text"], ["DownloadSimpleIcon", "download"], ["HeartIcon", "heart"], ["StarIcon", "star"], ["BookmarkIcon", "bookmark"],
  ["LockIcon", "lock"], ["LockOpenIcon", "lock-open"], ["KeyIcon", "key"], ["EyeIcon", "eye"], ["EyeSlashIcon", "eye-off", "eye"],
  ["CameraIcon", "camera"], ["ImageIcon", "image"], ["MusicNotesIcon", "music"], ["PhoneIcon", "phone"], ["PaperPlaneTiltIcon", "send"],
  ["ShareNetworkIcon", "share"], ["MapPinIcon", "map-pin"], ["MapTrifoldIcon", "map"], ["GlobeIcon", "globe"], ["ShoppingCartIcon", "shopping-cart"],
  ["CreditCardIcon", "credit-card"], ["GiftIcon", "gift"], ["SunIcon", "sun"], ["MoonIcon", "moon"], ["CloudIcon", "cloud"],
  ["TerminalWindowIcon", "terminal"], ["DatabaseIcon", "database"], ["ListIcon", "menu"], ["FunnelIcon", "filter"], ["CheckCircleIcon", "circle-check"],
  ["WarningIcon", "triangle-alert"], ["InfoIcon", "info"], ["RocketIcon", "rocket"], ["StackIcon", "layers"], ["DotsThreeIcon", "more-horizontal"],
];

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Phosphor 是一套规模较大、使用灵活的图标库，每个图标都有六种字重。Kubai Icons 提供名称共用的三种风格——粗细可调且包含四种变体的线性图标、双色面性图标和分层彩色图标——每个图标都有各自的悬停动效。两者都使用 MIT 许可证，都提供 React 和 Vue 软件包。">
        {page.zhTitle}
      </Title>
      <h2>概览</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Phosphor</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>适合选择 Phosphor 的情况</h2>
      <ul>
        <li>希望图标的粗细和字体搭配，从 thin 到 bold 可选，选中状态可以换成 fill。</li>
        <li>需要在大量不同物件上保持同一种扁平风格。</li>
        <li>所用平台没有 Kubai Icons 的软件包，例如 Flutter 或 SwiftUI。</li>
        <li>在纯 HTML 中更习惯使用图标字体。</li>
      </ul>
      <h2>适合选择 Kubai Icons 的情况</h2>
      <ul>
        <li>希望图标有颜色和层次，同时彼此统一，全部由一个主色派生。</li>
        <li>希望不写代码就有悬停动效：每个图标都会演示物件本身的动作。</li>
        <li>需要同一图形的相关状态，例如 <code>folder-plus</code>、<code>user-check</code> 或 <code>bell-off</code>。</li>
        <li>以后需要同一风格的新图标。<Link href="/zh/skill/">Kubai Icons Skill</Link> 可以让编程 Agent 绘制新图标。</li>
      </ul>
      <h2>从 Phosphor 迁移</h2>
      <p>安装对应框架的软件包，以 React 为例：</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>两套图标都以 <code>Icon</code> 后缀导出每个图标，所以只需修改导入路径和名称不同的图标：</p>
      <Code lang="tsx" code={`// 迁移前
import { HouseIcon, BellIcon } from "@phosphor-icons/react";

<HouseIcon size={24} weight="duotone" />

// 迁移后（线性风格；去掉 "/line" 为分层彩色，改用 "/duotone" 为双色实心）
import { HomeIcon, BellIcon } from "kubai-icons-react/line";

<HomeIcon size={24} variant="solid-tint" />`} />
      <p><code>size</code> 和 <code>color</code> 的用法相同。在线性风格（<code>kubai-icons-react/line</code>）中，Phosphor 从细到粗的 <code>weight</code> 可改用 <code>strokeWidth</code>（可取大于 0 的任意值，默认 2），<code>weight=&quot;fill&quot;</code> 改用 <code>variant=&quot;fill&quot;</code>，<code>weight=&quot;duotone&quot;</code> 改用 <code>variant=&quot;solid-tint&quot;</code> 或 <code>&quot;line-duo&quot;</code>。Phosphor 的 <code>mirrored</code> 在 Kubai 中没有对应的 prop，需要时可以用 CSS 翻转图标。Phosphor 用 <code>IconContext</code> 设置的默认值，在 Kubai 中通过继承实现：<code>color</code> 和样式会跟随最近一个设置了它们的父元素。详见<Link href="/zh/docs/guides/line/">线性风格</Link>和<Link href="/zh/docs/customize/">自定义</Link>。</p>
      <h2>名称对照表</h2>
      <p>常用 Phosphor 图标对应的最接近的 Kubai 图标。Phosphor 也会导出不带后缀的旧名称，例如 <code>House</code>，这些名称现已弃用。</p>
      <table>
        <thead><tr><th>@phosphor-icons/react</th><th>kubai-icons-react</th></tr></thead>
        <tbody>
          {NAMES.map(([other, kubai, base]) => (
            <tr key={other}><td><code>{other}</code></td><td><Link href={`/zh/icons/${base ?? kubai}/`}><code>{`${pascal(kubai)}Icon`}</code></Link></td></tr>
          ))}
        </tbody>
      </table>
      <p>其他图标可以在<Link href="/zh/icons/">图标库</Link>中按名称或含义搜索。</p>
      <Faq
        heading="常见问题"
        items={[
          { q: "可以在同一个项目里同时使用 Phosphor 和 Kubai Icons 吗？", a: "可以。两个软件包互不依赖，可以逐个页面替换。两种风格放在一起差别明显，建议不要在同一个工具栏里混用。" },
          { q: "有 thin 或 bold 这样的字重吗？", a: "有。在线性风格（`kubai-icons-react/line`）中，可以把 `strokeWidth` 设为大于 0 的任意值（例如细体用 1.5、常规用 2、粗体用 2.5），也可以用 `variant=\"fill\"` 获得实心图形。" },
          { q: "一个图标会让打包体积增加多少？", a: "压缩并 gzip 后，第一个 Kubai 图标连同共享运行时约 4 KB，之后每个图标约 0.6 KB。未导入的图标会被移除。" },
          { q: "可以在商业项目中使用 Kubai Icons 吗？", a: "可以。和 Phosphor 一样，Kubai Icons 使用 MIT 许可证，允许商业使用，只需保留许可证声明。" },
        ]}
      />
    </Prose>
  );
}
