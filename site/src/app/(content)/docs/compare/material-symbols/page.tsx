import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";
import { pascal } from "@/lib/icons";

const HREF = "/docs/compare/material-symbols/";
export const metadata = learnMeta(HREF, "en");

const FACTS: [string, string, string][] = [
  ["Style", "Three styles that share names: line, two-tone solid and layered color", "Three styles: Outlined, Rounded and Sharp"],
  ["Grid", "Line: 24 grid, rounded strokes. Two-tone: 16 grid, solid", "24 grid at the default size, with optical sizes from 20 to 48"],
  ["Adjusting", "Line: any stroke width above 0 and four variants, set with props", "Variable font axes: fill, weight (100 to 700), grade and optical size"],
  ["Hover animation", "Built into every icon: a lock's shackle lifts open, a bookmark ribbon grows down", "None built in; changes between axis values can be animated with CSS"],
  ["Icons", "About 1,280 line, 502 two-tone and 973 layered (3,078 with badged and slashed versions)", "More than 3,000, each in all three styles"],
  ["Delivery", "Components for React and Vue, plain JavaScript, a web component and static SVG", "A variable icon font from Google Fonts and SVG files; community packages wrap them for frameworks"],
  ["License", "MIT", "Apache 2.0"],
];

// The Material Symbols name and the Kubai line icon.
const NAMES: [string, string][] = [
  ["home", "home"], ["search", "search"], ["settings", "settings"], ["person", "user"], ["group", "users"],
  ["person_add", "user-plus"], ["mail", "mail"], ["drafts", "mail-open"], ["notifications", "bell"], ["calendar_today", "calendar"],
  ["schedule", "clock"], ["delete", "trash"], ["folder", "folder"], ["folder_open", "folder-open"], ["description", "file-text"],
  ["download", "download"], ["upload", "upload"], ["favorite", "heart"], ["star", "star"], ["bookmark", "bookmark"],
  ["lock", "lock"], ["lock_open", "lock-open"], ["key", "key"], ["visibility", "eye"], ["visibility_off", "eye-off"], ["notifications_off", "bell-off"],
  ["photo_camera", "camera"], ["image", "image"], ["call", "phone"], ["chat_bubble", "message-circle"], ["send", "send"],
  ["share", "share"], ["location_on", "map-pin"], ["map", "map"], ["public", "globe"], ["shopping_cart", "shopping-cart"],
  ["credit_card", "credit-card"], ["redeem", "gift"], ["light_mode", "sun"], ["dark_mode", "moon"], ["cloud", "cloud"],
  ["terminal", "terminal"], ["database", "database"], ["menu", "menu"], ["filter_alt", "filter"], ["check_circle", "circle-check"],
  ["warning", "triangle-alert"], ["info", "info"], ["rocket_launch", "rocket"], ["layers", "layers"], ["more_horiz", "more-horizontal"],
  ["more_vert", "more-vertical"], ["link", "link"], ["edit", "pencil"], ["content_copy", "copy"], ["logout", "log-out"],
  ["login", "log-in"], ["lightbulb", "lightbulb"], ["close", "x"], ["check", "check"], ["add", "plus"],
  ["remove", "minus"], ["keyboard_arrow_down", "chevron-down"], ["arrow_forward", "arrow-right"], ["progress_activity", "loader-circle"],
];

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Material Symbols is Google's icon set for Material Design, shipped as a variable font with axes for fill, weight, grade and optical size. The Kubai line style is a set of rounded line icons that you size and style with props, and every icon has its own hover motion.">
        {page.title}
      </Title>
      <h2>At a glance</h2>
      <table>
        <thead><tr><th /><th>Kubai Icons</th><th>Material Symbols</th></tr></thead>
        <tbody>
          {FACTS.map(([label, kubai, other]) => (
            <tr key={label}><td className="font-medium whitespace-nowrap text-foreground">{label}</td><td>{kubai}</td><td>{other}</td></tr>
          ))}
        </tbody>
      </table>
      <h2>When to choose Material Symbols</h2>
      <ul>
        <li>Your product follows Material Design, or sits next to Android and Google apps, and icons should match them.</li>
        <li>You want to tune weight and grade to your text, or keep icons sharp at small sizes with optical size.</li>
        <li>You want an icon font: type a name such as <code>home</code> inside a span, with no JavaScript.</li>
        <li>You need a wide range of system and device symbols, each in outlined, rounded and sharp forms.</li>
      </ul>
      <h2>When to choose Kubai Icons</h2>
      <ul>
        <li>You want hover motion without writing it: each icon acts out what it means, and the motion changes its state where it can.</li>
        <li>You want only the icons you use in your bundle: each Kubai icon is its own module, and icons you don&apos;t import are left out.</li>
        <li>You want two-color looks: <code>line-duo</code> puts inner parts in a light tone, and <code>solid-tint</code> puts lines over a light fill.</li>
        <li>You want one set of names across styles: an area can move from line to layered color or two-tone by changing the import.</li>
      </ul>
      <h2>Switching from Material Symbols</h2>
      <p>Material Symbols are most often used as a font, so a switch replaces each span with a component. Install the package for your framework. Here it is React:</p>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>Import from the <code>line</code> path, and move the font settings into props:</p>
      <Code lang="tsx" code={`// Before
<span className="material-symbols-rounded">notifications</span>
<span className="material-symbols-rounded" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
  favorite
</span>

// After
import { Bell, Heart } from "kubai-icons-react/line";

<Bell size={24} />
<Heart size={20} variant="fill" />`} />
      <table>
        <thead><tr><th>Material Symbols</th><th>kubai-icons-react/line</th></tr></thead>
        <tbody>
          <tr><td><code>font-size</code></td><td><code>size</code>, in pixels, default 24</td></tr>
          <tr><td>CSS <code>color</code></td><td><code>color</code>, default <code>currentColor</code>, so the text color still applies</td></tr>
          <tr><td><code>FILL</code> 1</td><td><code>variant=&quot;fill&quot;</code>, or <code>variant=&quot;solid-tint&quot;</code> for lines over a light fill</td></tr>
          <tr><td><code>wght</code></td><td><code>strokeWidth</code>. Choose by eye: about 2 for the default weight of 400, less for lighter weights and more for bolder ones</td></tr>
          <tr><td><code>GRAD</code></td><td>No equivalent; a slightly smaller <code>strokeWidth</code> does the same job on dark backgrounds</td></tr>
          <tr><td><code>opsz</code></td><td>No equivalent; use 2.5 at 16 pixels and 1.5 at 32 pixels and above</td></tr>
          <tr><td>Outlined, Rounded, Sharp</td><td>The line style has rounded strokes, closest to Rounded</td></tr>
        </tbody>
      </table>
      <p>For an accessible name, pass <code>title</code>; without it the icon is hidden from screen readers, as a decorative font icon usually is. If you use Material icons through a component library, the same mapping applies: a size prop such as MUI&apos;s <code>fontSize</code> becomes <code>size</code> in pixels, and a theme color becomes a CSS color. In plain HTML, the web component replaces the span: <code>&lt;kubai-icon name=&quot;bell&quot; icon-style=&quot;line&quot;&gt;</code>; see <Link href="/docs/guides/no-build/">No build step</Link>.</p>
      <h2>What has no direct equivalent</h2>
      <ul>
        <li><strong>Grade and optical size.</strong> Kubai line icons change only their stroke width; pick it for the size and background.</li>
        <li><strong>The sharp style.</strong> Line icons have rounded ends and corners only.</li>
        <li><strong>Names typed as text.</strong> A Material name inside a span becomes an import. For icons chosen at run time, use <Link href="/docs/react/"><code>DynamicIcon</code></Link> from <code>kubai-icons-react/line/dynamic</code>, or the web component; both take the name as a string.</li>
        <li><strong>Objects outside the line set.</strong> Material Symbols covers more objects, especially system and device symbols. Search the <Link href="/icons/?style=line">line icons</Link>; if the object is missing, use the layered or two-tone icon of the same name, or draw it with the <Link href="/skill/">kubai-line skill</Link>.</li>
      </ul>
      <h2>Name table</h2>
      <p>The closest Kubai line icon for common Material Symbols. Material names are in snake case and often use other words, such as <code>person</code> for a user and <code>visibility</code> for an eye.</p>
      <table>
        <thead><tr><th>Material Symbols</th><th>kubai-icons-react/line</th></tr></thead>
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
          { q: "Can I use Material Symbols and Kubai Icons in the same project?", a: "Yes. They don't depend on each other, so you can switch one screen at a time and remove the font once the last span is gone. The drawings differ, so keep one set per toolbar." },
          { q: "How do I match the Material weight?", a: "Put a Material icon at weight 400 next to a Kubai line icon at the same size and start from `strokeWidth={2}`. Go down toward 1.5 for lighter weights and up toward 2.5 for bolder ones." },
          { q: "Do Kubai icons flash in late like a font can?", a: "No. Components render the SVG with the page, also on the server, so there is no moment where the icon name shows as text before a font loads." },
          { q: "Can I use Kubai Icons in commercial projects?", a: "Yes. Kubai Icons is MIT licensed and Material Symbols is Apache 2.0 licensed. Both allow commercial use as long as the license notice is kept." },
        ]}
      />
    </Prose>
  );
}
