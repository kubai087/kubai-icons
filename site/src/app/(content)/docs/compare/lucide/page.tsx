import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/lucide/";
export const metadata = learnMeta(HREF, "en");

const FACTS: [string, string, string][] = [
  ["Style", "Three styles that share names: line, two-tone solid and layered color", "Outline icons drawn with a 2px stroke on a 24×24 grid"],
  ["Hover animation", "Built into every icon: a lock's shackle lifts open, a folder opens", "None built in; icons are static SVG"],
  ["Icons", "About 1,280 line, 502 two-tone and 973 layered (3,078 with badged and slashed versions)", "More than 1,600"],
  ["Variants", "Line: outline, line-duo, fill and solid-tint, with any stroke width above 0. Layered: color and soft, plus badged versions", "One style, with adjustable stroke width"],
  ["Color", "One accent color; light tones, fill tints and gradients are derived from it", "One color for the stroke"],
  ["Packages", "React, Vue, plain JavaScript, a web component and static SVG", "React, React Native, Vue, Svelte, Preact, Solid, Angular, Astro, plain JavaScript and static SVG"],
  ["License", "MIT", "ISC"],
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
      <Title lead="Lucide is a large, community-run set of outline icons on a 24 grid. Kubai Icons comes in three styles that share names — line icons on the same 24 grid, solid two-tone icons and layered color icons — and gives every icon its own hover motion. Both are open source and work with React, Vue and plain SVG.">
        {page.title}
      </Title>
      <h2>At a glance</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Lucide</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>When to choose Lucide</h2>
      <ul>
        <li>Your interface uses thin line icons, and icons should stay quiet next to text.</li>
        <li>You need an object that only a very large set has, or many icons for niche technical topics.</li>
        <li>You build for a framework that Kubai Icons has no package for, such as React Native, Svelte or Angular. Kubai&apos;s web component covers the web ones.</li>
        <li>You want the smallest possible markup per icon: a Lucide icon is a few stroked paths with no runtime.</li>
      </ul>
      <h2>When to choose Kubai Icons</h2>
      <ul>
        <li>You want icons with color and depth that still match each other, from one accent color.</li>
        <li>You want hover motion without writing it: each icon acts out what the object does, in about half a second.</li>
        <li>You need related states in the same drawing, such as <code>folder-plus</code>, <code>user-check</code> or <code>bell-off</code>.</li>
        <li>You want new icons in the same style. The <Link href="/skill/">Kubai Icons skill</Link> lets a coding agent draw them.</li>
      </ul>
      <h2>Switching from Lucide</h2>
      <p>Install the package for your framework. Here it is React:</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>Then change the imports. Many names are the same, because both sets use short English names in PascalCase:</p>
      <Code lang="tsx" code={`// Before
import { House, Bell, Settings } from "lucide-react";

// After (line style on the same 24 grid; omit "/line" for layered color icons)
import { Home, Bell, Settings } from "kubai-icons-react/line";`} />
      <p><code>size</code>, <code>color</code> and <code>strokeWidth</code> work the same way in the line style: <code>size</code> sets the width and height in pixels, <code>color</code> defaults to <code>currentColor</code>, and <code>strokeWidth</code> defaults to 2 (drop <code>absoluteStrokeWidth</code>). For filled or two-tone line looks, set <code>variant</code> to <code>&quot;fill&quot;</code>, <code>&quot;line-duo&quot;</code> or <code>&quot;solid-tint&quot;</code>; for layered color icons, import from <code>kubai-icons-react</code> instead. Other SVG props, such as <code>className</code>, pass through. See the <Link href="/docs/guides/line/">line style</Link> and <Link href="/docs/react/">React props</Link>.</p>
      <h2>Name table</h2>
      <p>The closest Kubai icon for common Lucide icons. Recent lucide-react versions also export older names as aliases, such as <code>AlertTriangle</code>.</p>
      <table>
        <thead><tr><th>lucide-react</th><th>kubai-icons-react</th></tr></thead>
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
          { q: "Can I use Lucide and Kubai Icons in the same project?", a: "Yes. The packages are independent, so you can switch one screen at a time. The two styles look different side by side, so mixing them in one toolbar is best avoided." },
          { q: "Is there an outline style like Lucide's?", a: "Yes. Import from `kubai-icons-react/line` (or `kubai-icons-vue/line`): rounded strokes on a 24 grid with `strokeWidth` defaulting to 2, plus `line-duo`, `fill` and `solid-tint` variants." },
          { q: "How much does an icon add to the bundle?", a: "Minified and gzipped, the first Kubai icon adds about 4 KB including the shared runtime, and each further icon about 0.6 KB. Icons you do not import are removed." },
          { q: "Can I use Kubai Icons in commercial projects?", a: "Yes. Kubai Icons is MIT licensed and Lucide is ISC licensed. Both allow commercial use as long as the license notice is kept." },
        ]}
      />
    </Prose>
  );
}
