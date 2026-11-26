import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/tabler/";
export const metadata = learnMeta(HREF, "en");

const FACTS: [string, string, string][] = [
  ["Style", "Three styles that share names: line, two-tone solid and layered color", "Line icons, with filled versions of some"],
  ["Grid & stroke", "Line: 24 grid, rounded strokes, any width above 0 (default 2). Two-tone: 16 grid, solid", "24 grid, rounded strokes, 2 wide by default and adjustable"],
  ["Hover animation", "Built into every icon: a lock's shackle lifts open, a bookmark ribbon grows down", "None built in; icons are static SVG"],
  ["Icons", "About 1,270 line, 502 two-tone and 973 layered (3,078 with badged and slashed versions)", "More than 5,000 outline icons, about 1,000 of them also filled"],
  ["Variants", "Line: outline, line-duo, fill and solid-tint, for every icon", "Outline, and a separate filled icon where one exists"],
  ["Color", "One color; the light tone and fill tint are mixed from it", "One color for the stroke or the fill"],
  ["Packages", "React, Vue, plain JavaScript, a web component and static SVG", "React, Vue, Svelte, Solid, Preact, Angular, React Native, a webfont and SVG files"],
  ["License", "MIT", "MIT"],
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
      <Title lead="Tabler Icons is a very large set of line icons on a 24 grid with a 2-pixel rounded stroke. The Kubai line style is drawn on the same grid with the same default stroke, comes in four variants, and gives every icon its own hover motion. Both are MIT licensed.">
        {page.title}
      </Title>
      <h2>At a glance</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Tabler Icons</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>When to choose Tabler Icons</h2>
      <ul>
        <li>You need a very wide range of objects in one line style, including niche technical and business topics.</li>
        <li>You need brand logos: Tabler has several hundred <code>brand-</code> icons, and Kubai Icons has none.</li>
        <li>You build for a framework that Kubai Icons has no package for, such as Svelte, Solid, Angular or React Native.</li>
        <li>You want an icon font, or the smallest possible markup: a Tabler icon is a few stroked paths with no runtime.</li>
      </ul>
      <h2>When to choose Kubai Icons</h2>
      <ul>
        <li>You want hover motion without writing it: each icon acts out what it means, and the motion changes its state where it can.</li>
        <li>You want more than outline and filled. Every line icon also has <code>line-duo</code>, with inner parts in a light tone, and <code>solid-tint</code>, with lines over a light fill, set with one prop.</li>
        <li>You want one set of names across styles: an area can move from line to layered color or two-tone by changing the import.</li>
        <li>You want new icons in the same style. The <Link href="/skill/">kubai-line skill</Link> lets a coding agent draw them on the same grid and stroke.</li>
      </ul>
      <h2>Switching from Tabler Icons</h2>
      <p>Install the package for your framework. Here it is React:</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>Import from the <code>line</code> path. Tabler names start with <code>Icon</code>; Kubai names don&apos;t, and also come with an <code>Icon</code> suffix, such as <code>HomeIcon</code>, if you prefer it. A filled Tabler icon becomes the same Kubai icon with a variant:</p>
      <Code lang="tsx" code={`// Before
import { IconHome, IconBell, IconHeartFilled } from "@tabler/icons-react";

<IconHome size={24} stroke={1.5} />
<IconHeartFilled size={20} />

// After
import { Home, Bell, Heart } from "kubai-icons-react/line";

<Home size={24} strokeWidth={1.5} />
<Heart size={20} variant="fill" />`} />
      <table>
        <thead><tr><th>@tabler/icons-react</th><th>kubai-icons-react/line</th></tr></thead>
        <tbody>
          <tr><td><code>size</code></td><td><code>size</code>, in pixels, default 24</td></tr>
          <tr><td><code>color</code></td><td><code>color</code>, default <code>currentColor</code></td></tr>
          <tr><td><code>stroke</code></td><td><code>strokeWidth</code>. Both default to 2, so a default stroke needs no change</td></tr>
          <tr><td><code>Icon…Filled</code></td><td><code>variant=&quot;fill&quot;</code> on the same icon</td></tr>
          <tr><td><code>title</code></td><td><code>title</code>; without it the icon is hidden from screen readers</td></tr>
          <tr><td><code>className</code> and SVG props</td><td>Passed through to the SVG</td></tr>
        </tbody>
      </table>
      <p>Tabler adds the classes <code>tabler-icon</code> and <code>tabler-icon-home</code> to each SVG. If your CSS selects them, use <code>kubai-line</code> and <code>kubai-icon-home</code> instead. In Vue, import from <code>kubai-icons-vue/line</code> and write <code>:stroke-width</code> where you wrote <code>:stroke</code>. If you use the Tabler webfont, replace <code>&lt;i class=&quot;ti ti-home&quot;&gt;</code> with the web component, <code>&lt;kubai-icon name=&quot;home&quot; icon-style=&quot;line&quot;&gt;</code>; see <Link href="/docs/guides/no-build/">No build step</Link>.</p>
      <h2>What has no direct equivalent</h2>
      <ul>
        <li><strong>Brand logos.</strong> Keep Tabler&apos;s <code>brand-</code> icons for those, or use each brand&apos;s own SVG.</li>
        <li><strong>Objects outside the line set.</strong> Tabler covers several times as many objects. Search the <Link href="/icons/?style=line">line icons</Link>; if the object is missing, use the layered or two-tone icon of the same name, or draw it with the skill.</li>
      </ul>
      <h2>Name table</h2>
      <p>The closest Kubai line icon for common Tabler icons. The Vue packages of both libraries use the same names as React.</p>
      <table>
        <thead><tr><th>@tabler/icons-react</th><th>kubai-icons-react/line</th></tr></thead>
        <tbody>
          {NAMES.map(([other, kubai]) => (
            <tr key={other}><td><code>{`Icon${pascal(other)}`}</code></td><td><Link href={`/icons/?style=line&icon=${kubai}`}><code>{pascal(kubai)}</code></Link></td></tr>
          ))}
        </tbody>
      </table>
      <p>For anything else, search the <Link href="/icons/?style=line">icon library</Link> by name or meaning.</p>
      <Faq
        heading="Questions"
        items={[
          { q: "Can I use Tabler Icons and Kubai Icons in the same project?", a: "Yes. The packages are independent, so you can switch one screen at a time. Both are line icons on a 24 grid with a 2-pixel stroke by default, so they sit together better than most pairs, but the drawings still differ, so keep one library per toolbar." },
          { q: "Will my stroke width carry over?", a: "Yes. Tabler's `stroke` and Kubai's `strokeWidth` both measure the stroke at 24 pixels, and both default to 2. Kubai accepts any width above 0." },
          { q: "Is there a filled version of every icon?", a: "Yes. Every line icon has `variant=\"fill\"`, with closed shapes filled and details cut out, and `variant=\"solid-tint\"`, with lines over a light fill." },
          { q: "Can I use Kubai Icons in commercial projects?", a: "Yes. Like Tabler Icons, Kubai Icons is MIT licensed, which allows commercial use as long as the license notice is kept." },
        ]}
      />
    </Prose>
  );
}
