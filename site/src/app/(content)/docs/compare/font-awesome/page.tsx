import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/font-awesome/";
export const metadata = learnMeta(HREF, "en");

const FACTS: [string, string, string][] = [
  ["Style", "Three styles that share names: line, two-tone solid and layered color", "Free: solid, regular and brand icons. Pro adds light, thin, duotone and other styles"],
  ["Animation", "A hover motion for each icon that acts out its meaning: a bell rings, a folder opens", "General animations you switch on, such as spin, beat, bounce and shake, that loop on any icon"],
  ["Icons", "About 1,270 line, 502 two-tone and 973 layered (3,078 with badged and slashed versions)", "About 2,000 in the free set, including brand logos; Pro has many more"],
  ["Sizing", "A size prop in pixels", "Sizes relative to the text, such as lg or 2x"],
  ["Color", "One accent color; every shade is derived from it", "One color; duotone icons take a primary and a secondary color"],
  ["Packages", "React, Vue, plain JavaScript, a web component and static SVG", "Web fonts with CSS, SVG with JavaScript, and components for React, Vue and Angular"],
  ["License", "MIT", "Free: icons CC BY 4.0, fonts SIL OFL 1.1, code MIT. Pro: a paid license"],
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
      <Title lead="Font Awesome is a long-running icon toolkit with a free set and a paid Pro set, used as a web font or as SVG components. Kubai Icons comes in three styles that share names, line, two-tone and layered color, and every icon has its own hover motion. Kubai Icons is MIT licensed throughout.">
        {page.title}
      </Title>
      <h2>At a glance</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Font Awesome</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>When to choose Font Awesome</h2>
      <ul>
        <li>You need brand logos: the free set has several hundred, and Kubai Icons has none.</li>
        <li>Your site or theme already loads Font Awesome, and icons are written as classes such as <code>fa-solid fa-house</code>.</li>
        <li>You have a Pro license and want many styles of each icon, or features such as stacking and masking icons.</li>
        <li>You want a looping animation on any icon, such as a spinning loader.</li>
      </ul>
      <h2>When to choose Kubai Icons</h2>
      <ul>
        <li>You want motion that fits each icon: a lock&apos;s shackle lifts open and a trash can&apos;s lid lifts, on hover, instead of the same spin or shake on every icon.</li>
        <li>You want outline, filled and two-color looks without a paid plan: line icons have four variants, and the two-tone style is solid.</li>
        <li>You want only the icons you use in your bundle, with no font, no stylesheet and no icon library to register.</li>
        <li>You want new icons in the same style. The <Link href="/skill/">Kubai Icons skill</Link> lets a coding agent draw them.</li>
      </ul>
      <h2>Switching from Font Awesome</h2>
      <p>Install the package for your framework. Here it is React:</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>First pick the style. Solid Font Awesome icons are closest to the two-tone style, regular ones to the line style, and the layered style adds color and depth. The names are the same in every style that has the icon:</p>
      <Code lang="tsx" code={`// Before
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBell } from "@fortawesome/free-solid-svg-icons";

<FontAwesomeIcon icon={faHouse} size="2x" />
<FontAwesomeIcon icon={faBell} size="lg" shake />

// After
import { Home, Bell } from "kubai-icons-react/duotone";

<Home size={32} />
<Bell size={20} />`} />
      <table>
        <thead><tr><th>@fortawesome/react-fontawesome</th><th>kubai-icons-react</th></tr></thead>
        <tbody>
          <tr><td><code>icon=&#123;faHouse&#125;</code></td><td>The component itself: <code>&lt;Home /&gt;</code></td></tr>
          <tr><td><code>size=&quot;lg&quot;</code>, <code>&quot;2x&quot;</code> …</td><td><code>size</code> in pixels: multiply by your text size, so <code>2x</code> next to 16-pixel text is 32</td></tr>
          <tr><td><code>color</code>, or CSS <code>color</code></td><td><code>color</code>; both follow the text color by default</td></tr>
          <tr><td><code>spin</code>, <code>beat</code>, <code>bounce</code>, <code>shake</code> …</td><td>No looping animations. The icon&apos;s own motion plays on hover; to play it from your code, set <code>hover</code> to true</td></tr>
          <tr><td><code>flip</code>, <code>rotation</code>, <code>transform</code></td><td>CSS <code>transform</code> through <code>className</code> or <code>style</code></td></tr>
          <tr><td><code>fixedWidth</code>, <code>widthAuto</code></td><td>Not needed: every icon is square</td></tr>
          <tr><td><code>title</code></td><td><code>title</code>; without it the icon is hidden from screen readers</td></tr>
          <tr><td>Duotone colors (<code>--fa-primary-color</code> …)</td><td>The two-tone style, or <code>variant=&quot;line-duo&quot;</code> on line icons with <code>--kl-light</code></td></tr>
        </tbody>
      </table>
      <p>If you registered icons with <code>library.add</code> and refer to them by string, such as <code>icon=&quot;house&quot;</code>, import the components instead, or use <Link href="/docs/react/"><code>DynamicIcon</code></Link> when the name comes from data. If you use the web font, replace <code>&lt;i class=&quot;fa-solid fa-house&quot;&gt;</code> with the web component, <code>&lt;kubai-icon name=&quot;home&quot;&gt;</code>, and add <code>icon-style=&quot;duotone&quot;</code> or <code>icon-style=&quot;line&quot;</code> for the other styles; see <Link href="/docs/guides/no-build/">No build step</Link>. Once the last icon is gone, remove the Font Awesome stylesheet or kit script.</p>
      <h2>What has no direct equivalent</h2>
      <ul>
        <li><strong>Brand logos.</strong> Keep <code>@fortawesome/free-brands-svg-icons</code> for those, or use each brand&apos;s own SVG.</li>
        <li><strong>Looping animations.</strong> For a loading spinner, keep a CSS animation on a Kubai icon such as <code>loader</code>, or keep the Font Awesome one.</li>
        <li><strong>Stacking, masking and layering icons.</strong> Kubai badged icons, such as <code>folder-plus</code> and <code>bell-off</code>, cover common combinations in the layered style.</li>
        <li><strong>Pro-only icons and styles.</strong> Search the <Link href="/icons/">icon library</Link> by meaning. The two-tone set is smaller than the others, so check that the icon exists in the style you import.</li>
      </ul>
      <h2>Name table</h2>
      <p>The closest Kubai icon for common Font Awesome Free icons. Font Awesome 6 and later also accept older names as aliases, such as <code>faHome</code> for <code>faHouse</code>.</p>
      <table>
        <thead><tr><th>@fortawesome/free-solid-svg-icons</th><th>kubai-icons-react</th></tr></thead>
        <tbody>
          {NAMES.map(([other, kubai, base]) => (
            <tr key={other}><td><code>{other}</code></td><td><Link href={`/icons/${base ?? kubai}/`}><code>{pascal(kubai)}</code></Link></td></tr>
          ))}
        </tbody>
      </table>
      <p>For anything else, search the <Link href="/icons/">icon library</Link> by name or meaning.</p>
      <Faq
        heading="Questions"
        items={[
          { q: "Can I use Font Awesome and Kubai Icons in the same project?", a: "Yes. The packages are independent, so you can switch one screen at a time. The drawings differ, so keep one library per toolbar, and keep Font Awesome only for what Kubai Icons lacks, such as brand logos." },
          { q: "Is there a solid style like Font Awesome's?", a: "Yes. The two-tone style from `kubai-icons-react/duotone` is solid, on a 16 grid. Line icons also have `variant=\"fill\"`, with closed shapes filled and details cut out." },
          { q: "Can I make an icon move without hover?", a: "Yes. Set `hover` to true to play the icon's motion and back to false to return it, for example when a new message arrives. `trigger=\"parent\"` plays it when a parent element is hovered." },
          { q: "Can I use Kubai Icons in commercial projects?", a: "Yes. Kubai Icons is MIT licensed, which allows commercial use as long as the license notice is kept. Font Awesome Free's icons are under CC BY 4.0, which asks for attribution; Font Awesome Pro needs a paid license." },
        ]}
      />
    </Prose>
  );
}
