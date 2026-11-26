import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/colors-dark-mode/";
export const metadata = learnMeta(HREF, "en");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Each icon has gradients, outlines and marks, but you set only one accent color. Every other tone is calculated from it in CSS, so recoloring, theming and dark mode come down to setting that one color and, if you like, a variant.">
        {page.title}
      </Title>
      <h2>The accent color</h2>
      <p>By default the accent is <code>currentColor</code>, the text color around the icon. Set it on the icon with the <code>color</code> prop, or with the CSS <code>color</code> property on the icon or any ancestor:</p>
      <Code lang="tsx" code={`import { Folder, Leaf } from "kubai-icons-react";

<Folder color="#6366F1" />

<span style={{ color: "#14B8A6" }}>
  <Leaf /> Sustainability
</span>`} />
      <p>Any CSS color works, including a theme variable such as <code>color=&quot;var(--brand)&quot;</code>. The tones are calculated with <code>color-mix()</code>, so a transition on <code>color</code> cross-fades every gradient:</p>
      <Code lang="css" code={`.kubai-icon { transition: color .3s ease; }`} />
      <h2>Badges</h2>
      <p>Badged icons, such as <code>folder-plus</code> or <code>user-check</code>, have a disc in one corner. It is dark gray with a white glyph by default. <code>badgeColor</code> sets the disc to any color, and <code>badgeColor=&quot;semantic&quot;</code> picks one that suits each badge: green for add, red for remove, amber for warning.</p>
      <Code lang="tsx" code={`import { FolderPlus } from "kubai-icons-react";

<FolderPlus />                          {/* dark badge */}
<FolderPlus badgeColor="semantic" />    {/* green plus */}
<FolderPlus badgeColor="#7C3AED" />`} />
      <h2>The color & soft variants</h2>
      <p>The default <code>color</code> variant uses saturated fills. <code>soft</code> uses lighter fills and darker outlines, and draws the white marks in a dark tone. Set it on one icon:</p>
      <Code lang="tsx" code={`<Folder variant="soft" />`} />
      <p>Or set it once for a whole page or section. The variant is inherited like color, and the closest setting wins: the icon&apos;s own prop, then the nearest element, then the default.</p>
      <Code lang="tsx" code={`import { Folder, VARIANTS } from "kubai-icons-react";

<body style={VARIANTS.soft}>
  <Folder />                  {/* soft */}
  <Folder variant="color" />  {/* color */}
</body>`} />
      <p>In Vue, bind the same object with <code>:style</code>. Without a framework, call <code>setVariant</code>:</p>
      <Code lang="js" code={`import { setVariant } from "kubai-icons/runtime";

setVariant(document.documentElement, "soft");`} />
      <h2>Dark mode</h2>
      <p>Because the accent follows the text color, icons already change with your theme&apos;s text. When you want a specific accent in each theme, keep it in a CSS variable:</p>
      <Code lang="css" code={`:root { --icon-accent: #2563EB; }
.dark { --icon-accent: #60A5FA; }`} />
      <Code lang="tsx" code={`<Folder color="var(--icon-accent)" />`} />
      <p>To switch the variant with the theme, call <code>setVariant</code> whenever the theme changes. This example follows the system setting; with a theme switch in your app, call it from there instead:</p>
      <Code lang="js" code={`import { setVariant } from "kubai-icons/runtime";

const dark = matchMedia("(prefers-color-scheme: dark)");
const apply = () => setVariant(document.documentElement, dark.matches ? "soft" : "color");
apply();
dark.addEventListener("change", apply);`} />
      <p>The React and Vue packages export <code>setVariant</code> too, so you don&apos;t need a separate import there.</p>
      <h2>Individual tones</h2>
      <p>For finer control, set these custom properties on an icon or any ancestor. Marks are the lines and symbols drawn on an icon.</p>
      <table>
        <thead><tr><th>Property</th><th>Controls</th></tr></thead>
        <tbody>
          <tr><td><code>--ki-c</code></td><td>Base color for gradients and light marks. Default: <code>currentColor</code>.</td></tr>
          <tr><td><code>--ki-e</code></td><td>Base color for outlines and dark marks. Default: <code>--ki-c</code>.</td></tr>
          <tr><td><code>--ki-w</code></td><td>Color of the marks that are white by default.</td></tr>
          <tr><td><code>--ki-b</code></td><td>Color of the badge disc. Default: neutral dark gray.</td></tr>
          <tr><td><code>--ki-l</code></td><td>How far large solid fills fade to white toward the top, from 0% to 100%.</td></tr>
        </tbody>
      </table>
      <p>The soft variant sets all of these except <code>--ki-b</code>.</p>
      <h2>Static files & downloads</h2>
      <p>Static SVG files have their colors written in. <code>kubai-icons-static</code> ships <code>svg/</code> in the default blue (<code>#5393FF</code>) and <code>svg-soft/</code> in the soft variant. For another color, request the icon by URL, or download it from the <Link href="/icons/">icon browser</Link> in a chosen color and variant:</p>
      <Code lang="html" code={`<img src="https://icons.kubai.design/api/icon/folder.svg?color=EC4899&variant=soft" width="28" height="28" alt="" />`} />
      <p>Static files don&apos;t follow dark mode by themselves. Use a separate file per theme, for example with a <code>&lt;picture&gt;</code> element and a <code>prefers-color-scheme</code> media query.</p>
      <Faq
        heading="Questions"
        items={[
          { q: "Why does my icon look gray?", a: "With no `color` set, the accent is `currentColor`, so the icon takes the text color around it. Set the `color` prop or a CSS color on the icon." },
          { q: "Can I give outlines a different color from the fills?", a: "Yes. `--ki-c` is the base for fills and light marks, and `--ki-e` for outlines and dark marks. Set them separately on the icon or an ancestor." },
          { q: "Which variant should I use in dark mode?", a: "Either works. Pick by how the icons read on your background, then switch with `setVariant` or a `variant` prop when the theme changes." },
          { q: "Do color changes re-render the icons?", a: "No. Colors are CSS, so changing the color of a page of icons is a single style change." },
        ]}
      />
    </Prose>
  );
}
