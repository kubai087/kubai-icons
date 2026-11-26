import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/hugeicons/";
export const metadata = learnMeta(HREF, "en");

const FACTS: [string, string, string][] = [
  ["Style", "Three styles that share names: line, two-tone solid and layered color", "Line icons; the free set is drawn in one style, Stroke Rounded"],
  ["Grid and stroke", "Line: 24 grid, rounded strokes, any width above 0 (default 2). Two-tone: 16 grid, solid", "24 grid, rounded strokes, 1.5 wide by default and adjustable"],
  ["Hover animation", "Built into every icon: a lock's shackle lifts open, a bookmark ribbon grows down", "None built in; icons are static SVG"],
  ["Icons", "About 1,270 line, 502 two-tone and 973 layered (3,078 with badged and slashed versions)", "Several thousand in the free set; the paid Pro set has many more"],
  ["Variants", "Line: outline, line-duo, fill and solid-tint, all free", "Free: Stroke Rounded only. Pro adds more styles, such as solid, duotone and bulk"],
  ["Color", "One color; the light tone and fill tint are mixed from it", "One color; the two-color Pro styles take a primary and a secondary color"],
  ["Packages", "React, Vue, plain JavaScript, a web component and static SVG", "React, React Native, Vue, Svelte and Angular, with the icon data in a separate package"],
  ["License", "MIT", "Free set MIT; Pro under Hugeicons' paid license"],
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
      <Title lead="Hugeicons is a large line icon library with a free set in one rounded stroke style and a paid Pro set with more styles. The Kubai line style is drawn on the same 24 grid with rounded strokes, has four variants in the free package, and gives every icon its own hover motion.">
        {page.title}
      </Title>
      <h2>At a glance</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Hugeicons</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>When to choose Hugeicons</h2>
      <ul>
        <li>You need a very wide range of objects in one line style.</li>
        <li>You want several drawings of the same object to choose from: many names come in numbered versions, such as <code>Home01Icon</code> to <code>Home03Icon</code> and beyond.</li>
        <li>You build for React Native, Svelte or Angular, where Hugeicons has a package and Kubai Icons does not. On the web, Kubai&apos;s web component works in Svelte and Angular too.</li>
        <li>You have a Pro license and want solid, duotone or other styles from the same family.</li>
      </ul>
      <h2>When to choose Kubai Icons</h2>
      <ul>
        <li>You want hover motion without writing it: each icon acts out what it means, and the motion changes its state where it can.</li>
        <li>You want filled and two-tone looks without a paid plan: <code>fill</code>, <code>line-duo</code> and <code>solid-tint</code> are variants of every free line icon.</li>
        <li>You want one set of names across styles: an area can move from line to layered color or two-tone by changing the import.</li>
        <li>You want new icons in the same style. The <Link href="/skill/">kubai-line skill</Link> lets a coding agent draw them on the same grid and stroke.</li>
      </ul>
      <h2>Hugeicons styles and their Kubai equivalents</h2>
      <p>The free Hugeicons set is one style; the Pro set adds filled and two-color styles. Every Kubai line icon has the matching variants for free, and the two-tone style covers the solid two-color look:</p>
      <table>
        <thead><tr><th>Hugeicons style</th><th>Looks like</th><th>Closest in Kubai</th></tr></thead>
        <tbody>
          <tr><td>Stroke Rounded (free)</td><td>Rounded lines in one color</td><td>Line style, <code>variant=&quot;outline&quot;</code></td></tr>
          <tr><td>Stroke Sharp, Stroke Standard (Pro)</td><td>Lines with square or plain corners</td><td>No sharp-cornered style; use <code>outline</code></td></tr>
          <tr><td>Solid (Pro)</td><td>Filled shapes with details cut out</td><td>Line style, <code>variant=&quot;fill&quot;</code></td></tr>
          <tr><td>Duotone (Pro)</td><td>Lines over areas filled in a lighter color</td><td>Line style, <code>variant=&quot;solid-tint&quot;</code></td></tr>
          <tr><td>Twotone (Pro)</td><td>Lines in two colors</td><td>Line style, <code>variant=&quot;line-duo&quot;</code></td></tr>
          <tr><td>Bulk (Pro)</td><td>Solid shapes in a light tone with darker details</td><td>The <Link href="/docs/guides/duotone/">two-tone style</Link>, <code>kubai-icons-react/duotone</code></td></tr>
        </tbody>
      </table>
      <p>Where Hugeicons takes a primary and a secondary color, Kubai mixes the light tone and the fill tint from one color, or takes them from <code>--kl-light</code> and <code>--kl-fill</code>. See the <Link href="/docs/guides/line/">line guide</Link> for the four ways to color line icons.</p>
      <h2>Switching from Hugeicons</h2>
      <p>Install the package for your framework. Here it is React:</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>Hugeicons renders every icon through one <code>HugeiconsIcon</code> component and takes the drawing from a second package. In Kubai Icons each icon is its own component, imported from the <code>line</code> path:</p>
      <Code lang="tsx" code={`// Before
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, Notification01Icon } from "@hugeicons/core-free-icons";

<HugeiconsIcon icon={Home01Icon} size={24} color="currentColor" strokeWidth={1.5} />

// After
import { Home, Bell } from "kubai-icons-react/line";

<Home size={24} strokeWidth={1.5} />`} />
      <table>
        <thead><tr><th>@hugeicons/react</th><th>kubai-icons-react/line</th></tr></thead>
        <tbody>
          <tr><td><code>icon=&#123;Home01Icon&#125;</code></td><td>The component itself: <code>&lt;Home /&gt;</code></td></tr>
          <tr><td><code>size</code></td><td><code>size</code>, in pixels, default 24</td></tr>
          <tr><td><code>color</code></td><td><code>color</code>, default <code>currentColor</code></td></tr>
          <tr><td><code>strokeWidth</code></td><td><code>strokeWidth</code>. Hugeicons draws at 1.5 when it is not set and Kubai at 2, so set <code>strokeWidth=&#123;1.5&#125;</code> to keep the same weight</td></tr>
          <tr><td><code>absoluteStrokeWidth</code></td><td>No equivalent; the width is measured at 24 pixels and scales with the icon</td></tr>
          <tr><td><code>primaryColor</code>, <code>secondaryColor</code></td><td><code>color</code> with <code>variant=&quot;line-duo&quot;</code>; set the light tone with <code>--kl-light</code></td></tr>
          <tr><td><code>altIcon</code>, <code>showAlt</code></td><td>Render the other icon yourself. Tap icons such as bookmark take <code>active</code> instead</td></tr>
          <tr><td><code>className</code> and SVG props</td><td>Passed through to the SVG</td></tr>
        </tbody>
      </table>
      <p>The older <code>hugeicons-react</code> package, now deprecated, exported each icon as a component, such as <code>&lt;Home01Icon /&gt;</code>; the same name table applies. In Vue, import from <code>kubai-icons-vue/line</code> and write <code>:stroke-width</code>. See <Link href="/docs/guides/line/">Line style</Link> for the variants and colors.</p>
      <h2>What has no direct equivalent</h2>
      <ul>
        <li><strong>Numbered alternatives.</strong> Kubai Icons has one drawing per object, so <code>Home01Icon</code>, <code>Home02Icon</code> and the rest all map to <code>Home</code>.</li>
        <li><strong>Pro styles.</strong> The closest to a solid style are <code>variant=&quot;fill&quot;</code> and the <Link href="/docs/guides/duotone/">two-tone style</Link>. There is no sharp-cornered style.</li>
        <li><strong>Objects outside the line set.</strong> Hugeicons covers more objects. Search the <Link href="/icons/?style=line">line icons</Link>; if the object is missing, use the layered or two-tone icon of the same name, or draw it with the skill.</li>
      </ul>
      <h2>Name table</h2>
      <p>The closest Kubai line icon for common Hugeicons. Where Hugeicons has numbered versions of an object, the table lists one; the others map to the same Kubai icon.</p>
      <table>
        <thead><tr><th>@hugeicons/core-free-icons</th><th>kubai-icons-react/line</th></tr></thead>
        <tbody>
          {NAMES.map(([other, kubai]) => (
            <tr key={other}><td><code>{other}</code></td><td><Link href={`/icons/?style=line&icon=${kubai}`}><code>{pascal(kubai)}</code></Link></td></tr>
          ))}
        </tbody>
      </table>
      <p>For anything else, search the <Link href="/icons/?style=line">icon library</Link> by name or meaning.</p>
      <Faq
        heading="Questions"
        items={[
          { q: "Can I use Hugeicons and Kubai Icons in the same project?", a: "Yes. The packages are independent, so you can switch one screen at a time. Both are rounded line icons on a 24 grid, but the drawings differ, so keep one library per toolbar." },
          { q: "Which stroke width matches Hugeicons?", a: "1.5, which is what Hugeicons draws at by default. Kubai line icons default to 2; set `strokeWidth={1.5}` once on each icon, or wrap the icons you use in your own component." },
          { q: "Is there a solid style?", a: "Every line icon has `variant=\"fill\"`, with closed shapes filled and details cut out. For a solid look in two colors, use the two-tone style from `kubai-icons-react/duotone`." },
          { q: "Can I use Kubai Icons in commercial projects?", a: "Yes. Kubai Icons is MIT licensed, which allows commercial use as long as the license notice is kept. The Hugeicons free packages are MIT licensed too; the Pro icons come under Hugeicons' own paid license." },
        ]}
      />
    </Prose>
  );
}
