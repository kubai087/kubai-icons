import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/heroicons/";
export const metadata = learnMeta(HREF, "zh");

const FACTS: [string, string, string][] = [
  ["风格", "三种风格共用名称：线性、双色面性和分层彩色", "1.5px 描边的线性图标，以及实心图标"],
  ["悬停动效", "每个图标都内置动效：锁梁抬起打开，文件夹会打开", "不内置动效，图标是静态 SVG"],
  ["图标数量", "线性约 1,280 个，双色 502 个，分层 973 个（加上带角标和带斜线的版本共 3,078 个）", "300 个以上"],
  ["变体", "线性：outline、line-duo、fill 和 solid-tint。双色：16 网格实心。分层：color 和 soft", "24px 线性、24px 实心、20px 实心和 16px 实心"],
  ["颜色", "一个主色，浅色、填充色和渐变都由它派生", "一种颜色，通过 currentColor 设置"],
  ["尺寸", "通过 size prop 设置", "通过 SVG 上的 CSS 类设置，例如 size-6"],
  ["软件包", "React、Vue、原生 JavaScript、Web Component 和静态 SVG", "React 和 Vue，也可以在官网复制 SVG 和 JSX"],
  ["许可证", "MIT", "MIT"],
];

// The Heroicons export, the Kubai icon, and the icon's page when the Kubai icon is a badged version.
const NAMES: [string, string, string?][] = [
  ["HomeIcon", "home"], ["MagnifyingGlassIcon", "search"], ["Cog6ToothIcon", "settings"], ["UserIcon", "user"], ["UsersIcon", "users"],
  ["UserPlusIcon", "user-plus", "user"], ["UserGroupIcon", "user-group"], ["EnvelopeIcon", "mail"], ["EnvelopeOpenIcon", "mail-open"], ["BellIcon", "bell"],
  ["BellSlashIcon", "bell-off", "bell"], ["CalendarIcon", "calendar"], ["ClockIcon", "clock"], ["TrashIcon", "trash"], ["FolderIcon", "folder"],
  ["FolderOpenIcon", "folder-open"], ["FolderPlusIcon", "folder-plus", "folder"], ["DocumentTextIcon", "file-text"], ["DocumentDuplicateIcon", "copy"], ["ArrowDownTrayIcon", "download"],
  ["HeartIcon", "heart"], ["StarIcon", "star"], ["BookmarkIcon", "bookmark"], ["LockClosedIcon", "lock"], ["LockOpenIcon", "lock-open"],
  ["KeyIcon", "key"], ["EyeIcon", "eye"], ["EyeSlashIcon", "eye-off", "eye"], ["CameraIcon", "camera"], ["PhotoIcon", "image"],
  ["PhoneIcon", "phone"], ["ChatBubbleLeftRightIcon", "messages"], ["PaperAirplaneIcon", "send"], ["ShareIcon", "share"], ["MapPinIcon", "map-pin"],
  ["GlobeAltIcon", "globe"], ["ShoppingCartIcon", "shopping-cart"], ["CreditCardIcon", "credit-card"], ["GiftIcon", "gift"], ["SunIcon", "sun"],
  ["MoonIcon", "moon"], ["CommandLineIcon", "terminal"], ["CircleStackIcon", "database"], ["Bars3Icon", "menu"], ["FunnelIcon", "filter"],
  ["CheckCircleIcon", "circle-check"], ["ExclamationTriangleIcon", "triangle-alert"], ["InformationCircleIcon", "info"], ["RocketLaunchIcon", "rocket"], ["LightBulbIcon", "lightbulb"],
];

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Heroicons 是 Tailwind CSS 团队制作的一套精简图标，包含线性和实心两种形式。Kubai Icons 提供名称共用的线性、双色面性和分层彩色三种风格，每个图标都有各自的悬停动效。两者都使用 MIT 许可证，都提供 React 和 Vue 软件包。">
        {page.zhTitle}
      </Title>
      <h2>概览</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Heroicons</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>适合选择 Heroicons 的情况</h2>
      <ul>
        <li>界面基于 Tailwind CSS，希望和 Tailwind UI 的风格一致。</li>
        <li>需要在 16 和 20 像素下依然清晰的图标：Heroicons 有专门为这两种尺寸绘制的图标组。</li>
        <li>每个图标都需要线性和实心两种形式，例如用于选中的标签页。</li>
        <li>一套小而通用的图标已经够用。</li>
      </ul>
      <h2>适合选择 Kubai Icons 的情况</h2>
      <ul>
        <li>希望图标有颜色和层次，同时彼此统一，全部由一个主色派生。</li>
        <li>希望不写代码就有悬停动效：每个图标都会演示物件本身的动作。</li>
        <li>需要通用界面图标以外的物件，例如厨房用具、交通工具、体育用品或实验器材。</li>
        <li>使用原生 JavaScript 或没有 Heroicons 软件包的框架：<code>&lt;kubai-icon&gt;</code> Web Component 在任何页面中都能使用。</li>
      </ul>
      <h2>从 Heroicons 迁移</h2>
      <p>安装对应框架的软件包，以 React 为例：</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>Heroicons 的每种样式都有自己的导入路径，所有名称都以 <code>Icon</code> 结尾。Kubai Icons 在三种风格中同样会以 <code>Icon</code> 后缀导出每个图标——24 网格线性图标用 <code>kubai-icons-react/line</code>，16 网格实心图标用 <code>kubai-icons-react/duotone</code>，分层彩色图标用 <code>kubai-icons-react</code>——所以 <code>BellIcon</code> 这样的名称可以继续使用：</p>
      <Code lang="tsx" code={`// 迁移前
import { HomeIcon, BellIcon } from "@heroicons/react/24/outline";

<HomeIcon className="size-6 text-gray-500" />

// 迁移后（1.5 粗细的线性风格；去掉 "/line" 则为分层彩色）
import { HomeIcon, BellIcon } from "kubai-icons-react/line";

<HomeIcon size={24} strokeWidth={1.5} className="text-gray-500" />`} />
      <p>Heroicons 通过 CSS 类设置尺寸；Kubai 图标提供以像素为单位的 <code>size</code> prop（默认为 24），同时 <code>size-6</code> 等 CSS 尺寸类也同样有效。颜色的用法相同：两者都跟随 <code>currentColor</code>，文字颜色类可以直接改变图标颜色。24px 实心图标可用线性风格的 <code>variant=&quot;fill&quot;</code>，16px 实心图标可用 <code>kubai-icons-react/duotone</code>。详见<Link href="/zh/docs/guides/line/">线性风格</Link>和 <Link href="/zh/docs/react/">React 的 Props</Link>。</p>
      <h2>名称对照表</h2>
      <p>常用 Heroicons 图标对应的最接近的 Kubai 图标。两列都是 React 的导出名，Vue 软件包使用相同的名称。</p>
      <table>
        <thead><tr><th>Heroicons</th><th>kubai-icons-react</th></tr></thead>
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
          { q: "可以在同一个项目里同时使用 Heroicons 和 Kubai Icons 吗？", a: "可以。两个软件包互不依赖，可以逐个页面替换。两种风格放在一起差别明显，建议不要在同一个工具栏里混用。" },
          { q: "有实心或线性样式吗？", a: "有。从 `kubai-icons-react/line` 导入可获得 24 网格的线性图标（设 `variant=\"fill\"` 即为实心图形），从 `kubai-icons-react/duotone` 导入可获得 16 网格的双色实心图标。" },
          { q: "Kubai 图标可以配合 Tailwind CSS 使用吗？", a: "可以。图标跟随 `currentColor`，`text-sky-600` 这样的类可以设置图标颜色，`className` 会透传给 SVG。" },
          { q: "一个图标会让打包体积增加多少？", a: "压缩并 gzip 后，第一个 Kubai 图标连同共享运行时约 4 KB，之后每个图标约 0.6 KB。未导入的图标会被移除。" },
        ]}
      />
    </Prose>
  );
}
