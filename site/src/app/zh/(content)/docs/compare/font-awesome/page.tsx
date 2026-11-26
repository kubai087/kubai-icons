import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/font-awesome/";
export const metadata = learnMeta(HREF, "zh");

const FACTS: [string, string, string][] = [
  ["风格", "三种风格共用名称：线性、双色面性和分层彩色", "免费版：solid、regular 和品牌图标。Pro 版另有 light、thin、duotone 等风格"],
  ["动效", "每个图标有各自的悬停动效，表现自身含义：铃铛会摇动，文件夹会打开", "可开启的通用动画，例如 spin、beat、bounce 和 shake，可用于任何图标并循环播放"],
  ["图标数量", "线性约 1,270 个，双色 502 个，分层 973 个（加上带角标和带斜线的版本共 3,078 个）", "免费版约 2,000 个，包括品牌图标；Pro 版数量多得多"],
  ["尺寸", "size prop，单位为像素", "相对文字大小的尺寸，例如 lg 或 2x"],
  ["颜色", "一个主色，所有色调都由它派生", "一种颜色；duotone 图标可设置主色和辅色"],
  ["软件包", "React、Vue、原生 JavaScript、Web Component 和静态 SVG", "Web 字体加 CSS、SVG 加 JavaScript，以及 React、Vue 和 Angular 组件"],
  ["许可证", "MIT", "免费版：图标 CC BY 4.0，字体 SIL OFL 1.1，代码 MIT。Pro 版：付费许可"],
];

// The Font Awesome Free export, the Kubai icon, and the icon's page when the Kubai icon is a badged version.
const NAMES: [string, string, string?][] = [
  ["faHouse", "home"], ["faMagnifyingGlass", "search"], ["faGear", "settings"], ["faUser", "user"], ["faUsers", "users"],
  ["faUserPlus", "user-plus", "user"], ["faEnvelope", "mail"], ["faEnvelopeOpen", "mail-open"], ["faBell", "bell"], ["faBellSlash", "bell-off", "bell"],
  ["faCalendar", "calendar"], ["faClock", "clock"], ["faTrashCan", "trash"], ["faFolder", "folder"], ["faFolderOpen", "folder-open"],
  ["faFileLines", "file-text"], ["faDownload", "download"], ["faHeart", "heart"], ["faStar", "star"], ["faBookmark", "bookmark"],
  ["faLock", "lock"], ["faLockOpen", "lock-open"], ["faKey", "key"], ["faEye", "eye"], ["faEyeSlash", "eye-off", "eye"],
  ["faCamera", "camera"], ["faImage", "image"], ["faPhone", "phone"], ["faComment", "message-circle"], ["faComments", "messages"],
  ["faPaperPlane", "send"], ["faShareNodes", "share"], ["faLocationDot", "map-pin"], ["faMap", "map"], ["faGlobe", "globe"],
  ["faCartShopping", "shopping-cart"], ["faCreditCard", "credit-card"], ["faGift", "gift"], ["faSun", "sun"], ["faMoon", "moon"],
  ["faCloud", "cloud"], ["faTerminal", "terminal"], ["faDatabase", "database"], ["faBars", "menu"], ["faFilter", "filter"],
  ["faCircleCheck", "circle-check"], ["faTriangleExclamation", "triangle-alert"], ["faCircleInfo", "info"], ["faRocket", "rocket"], ["faLayerGroup", "layers"],
  ["faEllipsis", "more-horizontal"], ["faLink", "link"], ["faPen", "pencil"], ["faCopy", "copy"], ["faRightFromBracket", "log-out"],
  ["faLightbulb", "lightbulb"], ["faCircleXmark", "circle-x"], ["faCircleQuestion", "circle-help"], ["faThumbsUp", "thumbs-up"], ["faShieldHalved", "shield"],
];

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Font Awesome 是一套历史较长的图标工具包，分为免费版和付费的 Pro 版，可以作为 Web 字体或 SVG 组件使用。Kubai Icons 有线性、双色和分层彩色三种风格，名称共用，每个图标都有各自的悬停动效，全部使用 MIT 许可证。">
        {page.zhTitle}
      </Title>
      <h2>概览</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Font Awesome</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>适合选择 Font Awesome 的情况</h2>
      <ul>
        <li>需要品牌图标：免费版有几百个，Kubai Icons 没有品牌图标。</li>
        <li>网站或主题已经加载了 Font Awesome，图标以 <code>fa-solid fa-house</code> 这样的类名写在页面里。</li>
        <li>已购买 Pro 版，需要每个图标的多种风格，或者需要图标叠放、遮罩等功能。</li>
        <li>需要在任意图标上循环播放动画，例如旋转的加载图标。</li>
      </ul>
      <h2>适合选择 Kubai Icons 的情况</h2>
      <ul>
        <li>希望动效和图标含义对应：悬停时锁梁抬起打开、垃圾桶的盖子抬起，而不是所有图标都用同样的旋转或抖动。</li>
        <li>不付费也能用线性、填充和双色效果：线性图标有四种变体，双色风格是实心的。</li>
        <li>希望打包结果里只有用到的图标，不需要字体、样式表，也不需要注册图标库。</li>
        <li>以后需要同一风格的新图标。<Link href="/zh/skill/">Kubai Icons Skill</Link> 可以让编程 Agent 绘制新图标。</li>
      </ul>
      <h2>从 Font Awesome 迁移</h2>
      <p>安装对应框架的软件包，以 React 为例：</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>先选择风格。Font Awesome 的 solid 图标最接近双色风格，regular 图标最接近线性风格，分层风格则增加了颜色和层次。只要某个风格里有这个图标，名称就相同：</p>
      <Code lang="tsx" code={`// 迁移前
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBell } from "@fortawesome/free-solid-svg-icons";

<FontAwesomeIcon icon={faHouse} size="2x" />
<FontAwesomeIcon icon={faBell} size="lg" shake />

// 迁移后
import { Home, Bell } from "kubai-icons-react/duotone";

<Home size={32} />
<Bell size={20} />`} />
      <table>
        <thead><tr><th>@fortawesome/react-fontawesome</th><th>kubai-icons-react</th></tr></thead>
        <tbody>
          <tr><td><code>icon=&#123;faHouse&#125;</code></td><td>直接使用组件：<code>&lt;Home /&gt;</code></td></tr>
          <tr><td><code>size=&quot;lg&quot;</code>、<code>&quot;2x&quot;</code> 等</td><td>以像素为单位的 <code>size</code>：乘以文字大小换算，例如文字为 16 像素时，<code>2x</code> 是 32</td></tr>
          <tr><td><code>color</code> 或 CSS <code>color</code></td><td><code>color</code>；两者默认都跟随文字颜色</td></tr>
          <tr><td><code>spin</code>、<code>beat</code>、<code>bounce</code>、<code>shake</code> 等</td><td>没有循环动画。图标自身的动效在悬停时播放；需要由代码触发时，把 <code>hover</code> 设为 true</td></tr>
          <tr><td><code>flip</code>、<code>rotation</code>、<code>transform</code></td><td>通过 <code>className</code> 或 <code>style</code> 使用 CSS <code>transform</code></td></tr>
          <tr><td><code>fixedWidth</code>、<code>widthAuto</code></td><td>不需要：所有图标都是正方形</td></tr>
          <tr><td><code>title</code></td><td><code>title</code>；不设置时图标对读屏软件隐藏</td></tr>
          <tr><td>duotone 的颜色（<code>--fa-primary-color</code> 等）</td><td>使用双色风格，或在线性图标上用 <code>variant=&quot;line-duo&quot;</code> 加 <code>--kl-light</code></td></tr>
        </tbody>
      </table>
      <p>如果用 <code>library.add</code> 注册过图标，并以 <code>icon=&quot;house&quot;</code> 这样的字符串引用，改为导入组件；名称来自数据时可以使用 <Link href="/zh/docs/react/"><code>DynamicIcon</code></Link>。使用 Web 字体的，把 <code>&lt;i class=&quot;fa-solid fa-house&quot;&gt;</code> 换成 Web Component：<code>&lt;kubai-icon name=&quot;home&quot;&gt;</code>，其他风格加上 <code>icon-style=&quot;duotone&quot;</code> 或 <code>icon-style=&quot;line&quot;</code>，详见<Link href="/zh/docs/guides/no-build/">无需构建工具</Link>。最后一个图标替换完后，移除 Font Awesome 的样式表或 Kit 脚本。</p>
      <h2>没有直接对应的部分</h2>
      <ul>
        <li><strong>品牌图标。</strong>这部分继续使用 <code>@fortawesome/free-brands-svg-icons</code>，或使用各品牌官方提供的 SVG。</li>
        <li><strong>循环动画。</strong>加载中的旋转图标，可以给 <code>loader</code> 这样的 Kubai 图标加 CSS 动画，或者继续使用 Font Awesome 的。</li>
        <li><strong>图标的叠放、遮罩和分层组合。</strong>常见的组合可以使用分层风格中带角标的图标，例如 <code>folder-plus</code> 和 <code>bell-off</code>。</li>
        <li><strong>只有 Pro 版才有的图标和风格。</strong>在<Link href="/zh/icons/">图标库</Link>中按含义搜索。双色风格的图标数量比其他风格少，导入前先确认该风格里有这个图标。</li>
      </ul>
      <h2>名称对照表</h2>
      <p>常用 Font Awesome 免费图标对应的最接近的 Kubai 图标。Font Awesome 6 及以后的版本也接受旧名称作为别名，例如 <code>faHome</code> 对应 <code>faHouse</code>。</p>
      <table>
        <thead><tr><th>@fortawesome/free-solid-svg-icons</th><th>kubai-icons-react</th></tr></thead>
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
          { q: "可以在同一个项目里同时使用 Font Awesome 和 Kubai Icons 吗？", a: "可以。两个软件包互不依赖，可以逐个页面替换。两者图形不同，建议同一个工具栏只用一套，Font Awesome 只保留 Kubai Icons 没有的部分，例如品牌图标。" },
          { q: "有类似 Font Awesome 的实心风格吗？", a: "有。`kubai-icons-react/duotone` 中的双色风格是实心的，使用 16 网格。线性图标也可以用 `variant=\"fill\"`，封闭图形填实，细节镂空。" },
          { q: "不悬停也能让图标播放动效吗？", a: "可以。把 `hover` 设为 true 会播放动效，设回 false 会恢复原状，例如在收到新消息时使用。`trigger=\"parent\"` 会在悬停父元素时播放。" },
          { q: "可以在商业项目中使用 Kubai Icons 吗？", a: "可以。Kubai Icons 使用 MIT 许可证，允许商业使用，只需保留许可证声明。Font Awesome 免费版的图标使用 CC BY 4.0，要求署名；Pro 版需要付费许可。" },
        ]}
      />
    </Prose>
  );
}
