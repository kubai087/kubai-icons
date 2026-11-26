import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/phosphor/";
export const metadata = learnMeta(HREF, "en");

const FACTS: [string, string, string][] = [
  ["Style", "Three styles that share names: line, two-tone solid and layered color", "Flat icons in six weights"],
  ["Hover animation", "Built into every icon: a lock's shackle lifts open, a folder opens", "None built in; icons are static SVG"],
  ["Icons", "About 1,280 line, 502 two-tone and 973 layered (3,078 with badged and slashed versions)", "More than 1,500, each in every weight"],
  ["Variants", "Line: adjustable stroke width, plus outline, line-duo, fill and solid-tint. Layered: color and soft", "Thin, light, regular, bold, fill and duotone"],
  ["Color", "One accent color; light tones, fill tints and gradients are derived from it", "One color; duotone adds a lighter fill of the same color"],
  ["Packages", "React, Vue, plain JavaScript, a web component and static SVG", "React, Vue, an icon font for the web, SVG files, and libraries for Flutter, SwiftUI and other platforms"],
  ["License", "MIT", "MIT"],
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
      <Title lead="Phosphor is a large, flexible icon family where every icon comes in six weights. Kubai Icons comes in three styles that share names — line icons with adjustable stroke width and four variants, solid two-tone icons and layered color icons — and gives every icon its own hover motion. Both are MIT licensed and have React and Vue packages.">
        {page.title}
      </Title>
      <h2>At a glance</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Phosphor</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>When to choose Phosphor</h2>
      <ul>
        <li>You want to match icon weight to your typography, from thin to bold, or switch to fill for active states.</li>
        <li>You need one flat style across a very wide range of objects.</li>
        <li>You build for a platform that Kubai Icons has no package for, such as Flutter or SwiftUI.</li>
        <li>You prefer an icon font for plain HTML.</li>
      </ul>
      <h2>When to choose Kubai Icons</h2>
      <ul>
        <li>You want icons with color and depth that still match each other, from one accent color.</li>
        <li>You want hover motion without writing it: each icon acts out what the object does.</li>
        <li>You need related states in the same drawing, such as <code>folder-plus</code>, <code>user-check</code> or <code>bell-off</code>.</li>
        <li>You want new icons in the same style. The <Link href="/skill/">Kubai Icons skill</Link> lets a coding agent draw them.</li>
      </ul>
      <h2>Switching from Phosphor</h2>
      <p>Install the package for your framework. Here it is React:</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>Both libraries export each icon with an <code>Icon</code> suffix, so only the import path and the names that differ change:</p>
      <Code lang="tsx" code={`// Before
import { HouseIcon, BellIcon } from "@phosphor-icons/react";

<HouseIcon size={24} weight="duotone" />

// After (line style; omit "/line" for layered color or use "/duotone" for solid two-tone)
import { HomeIcon, BellIcon } from "kubai-icons-react/line";

<HomeIcon size={24} variant="solid-tint" />`} />
      <p><code>size</code> and <code>color</code> work the same way. In the line style (<code>kubai-icons-react/line</code>), replace Phosphor&apos;s thin-to-bold <code>weight</code> with <code>strokeWidth</code> (any value above 0, default 2), <code>weight=&quot;fill&quot;</code> with <code>variant=&quot;fill&quot;</code>, and <code>weight=&quot;duotone&quot;</code> with <code>variant=&quot;solid-tint&quot;</code> or <code>&quot;line-duo&quot;</code>. Phosphor&apos;s <code>mirrored</code> has no Kubai prop; flip the icon with CSS if you need it. Defaults that Phosphor sets with <code>IconContext</code> are set in Kubai by inheritance: <code>color</code> and the variant follow the nearest parent that sets them. See the <Link href="/docs/guides/line/">line style</Link> and <Link href="/docs/customize/">Customization</Link>.</p>
      <h2>Name table</h2>
      <p>The closest Kubai icon for common Phosphor icons. Phosphor also exports the older names without the suffix, such as <code>House</code>, which are now deprecated.</p>
      <table>
        <thead><tr><th>@phosphor-icons/react</th><th>kubai-icons-react</th></tr></thead>
        <tbody>
          {NAMES.map(([other, kubai, base]) => (
            <tr key={other}><td><code>{other}</code></td><td><Link href={`/icons/${base ?? kubai}/`}><code>{`${pascal(kubai)}Icon`}</code></Link></td></tr>
          ))}
        </tbody>
      </table>
      <p>For anything else, search the <Link href="/icons/">icon library</Link> by name or meaning.</p>
      <Faq
        heading="Questions"
        items={[
          { q: "Can I use Phosphor and Kubai Icons in the same project?", a: "Yes. The packages are independent, so you can switch one screen at a time. The two styles look different side by side, so mixing them in one toolbar is best avoided." },
          { q: "Is there a thin or bold weight?", a: "Yes, in the line style (`kubai-icons-react/line`): set `strokeWidth` to any value above 0 (for example 1.5 for light, 2 for regular and 2.5 for bold), or use `variant=\"fill\"` for filled shapes." },
          { q: "How much does an icon add to the bundle?", a: "Minified and gzipped, the first Kubai icon adds about 4 KB including the shared runtime, and each further icon about 0.6 KB. Icons you do not import are removed." },
          { q: "Can I use Kubai Icons in commercial projects?", a: "Yes. Like Phosphor, Kubai Icons is MIT licensed, which allows commercial use as long as the license notice is kept." },
        ]}
      />
    </Prose>
  );
}
