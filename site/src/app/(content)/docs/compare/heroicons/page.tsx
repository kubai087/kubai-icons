import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/heroicons/";
export const metadata = learnMeta(HREF, "en");

const FACTS: [string, string, string][] = [
  ["Style", "Three styles that share names: line, two-tone solid and layered color", "Outline icons with a 1.5px stroke, and solid icons"],
  ["Hover animation", "Built into every icon: a lock's shackle lifts open, a folder opens", "None built in; icons are static SVG"],
  ["Icons", "About 1,280 line, 502 two-tone and 973 layered (3,078 with badged and slashed versions)", "More than 300"],
  ["Variants", "Line: outline, line-duo, fill and solid-tint. Two-tone: 16-grid solid. Layered: color and soft", "24px outline, 24px solid, 20px solid and 16px solid"],
  ["Color", "One accent color; light tones, fill tints and gradients are derived from it", "One color, through currentColor"],
  ["Sizing", "A size prop", "CSS classes on the SVG, such as size-6"],
  ["Packages", "React, Vue, plain JavaScript, a web component and static SVG", "React and Vue, plus SVG and JSX to copy from the website"],
  ["License", "MIT", "MIT"],
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
      <Title lead="Heroicons is a compact set of outline and solid icons from the makers of Tailwind CSS. Kubai Icons comes in three styles that share names — line, two-tone solid and layered color — and gives every icon its own hover motion. Both are MIT licensed and have React and Vue packages.">
        {page.title}
      </Title>
      <h2>At a glance</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Heroicons</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>When to choose Heroicons</h2>
      <ul>
        <li>Your interface is built with Tailwind CSS and should look like Tailwind UI.</li>
        <li>You need sharp icons at 16 and 20 pixels: Heroicons has sets drawn for those sizes.</li>
        <li>You want both outline and solid forms of each icon, for example for an active tab.</li>
        <li>A small, general-purpose set covers what you need.</li>
      </ul>
      <h2>When to choose Kubai Icons</h2>
      <ul>
        <li>You want icons with color and depth that still match each other, from one accent color.</li>
        <li>You want hover motion without writing it: each icon acts out what the object does.</li>
        <li>You need objects outside a general UI set, such as kitchen tools, vehicles, sports or lab equipment.</li>
        <li>You use plain JavaScript or a framework without a Heroicons package: the <code>&lt;kubai-icon&gt;</code> web component works anywhere.</li>
      </ul>
      <h2>Switching from Heroicons</h2>
      <p>Install the package for your framework. Here it is React:</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>Heroicons imports each style from its own path, and every name ends in <code>Icon</code>. Kubai Icons also exports each icon with an <code>Icon</code> suffix across all three styles — <code>kubai-icons-react/line</code> for 24-grid outline icons, <code>kubai-icons-react/duotone</code> for 16-grid solid icons, and <code>kubai-icons-react</code> for layered color icons — so names such as <code>BellIcon</code> keep working:</p>
      <Code lang="tsx" code={`// Before
import { HomeIcon, BellIcon } from "@heroicons/react/24/outline";

<HomeIcon className="size-6 text-gray-500" />

// After (line style at 1.5 stroke width; omit "/line" for layered color)
import { HomeIcon, BellIcon } from "kubai-icons-react/line";

<HomeIcon size={24} strokeWidth={1.5} className="text-gray-500" />`} />
      <p>Heroicons are sized with CSS classes; Kubai icons take a <code>size</code> prop in pixels (default 24), and CSS sizing classes such as <code>size-6</code> work too. Color works the same way: both follow <code>currentColor</code>, so text color classes recolor them. For solid 24px icons use <code>variant=&quot;fill&quot;</code> on the line style, and for 16px solid icons use <code>kubai-icons-react/duotone</code>. See the <Link href="/docs/guides/line/">line style</Link> and <Link href="/docs/react/">React props</Link>.</p>
      <h2>Name table</h2>
      <p>The closest Kubai icon for common Heroicons. Both columns are React exports; the Vue packages use the same names.</p>
      <table>
        <thead><tr><th>Heroicons</th><th>kubai-icons-react</th></tr></thead>
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
          { q: "Can I use Heroicons and Kubai Icons in the same project?", a: "Yes. The packages are independent, so you can switch one screen at a time. The two styles look different side by side, so mixing them in one toolbar is best avoided." },
          { q: "Is there a solid or outline style?", a: "Yes. Import from `kubai-icons-react/line` for 24-grid outline icons (and `variant=\"fill\"` for filled shapes), or from `kubai-icons-react/duotone` for solid two-tone icons on a 16 grid." },
          { q: "Do Kubai icons work with Tailwind CSS?", a: "Yes. Icons follow `currentColor`, so classes such as `text-sky-600` set their color, and `className` passes through to the SVG." },
          { q: "How much does an icon add to the bundle?", a: "Minified and gzipped, the first Kubai icon adds about 4 KB including the shared runtime, and each further icon about 0.6 KB. Icons you do not import are removed." },
        ]}
      />
    </Prose>
  );
}
