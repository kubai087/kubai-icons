import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { DuotoneWall } from "@/learn/duotone-wall";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/duotone/";
export const metadata = learnMeta(HREF, "en");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Besides the layered icons, part of the library comes in a two-tone style: solid shapes on a 16 grid, a light body with accents in your brand color, and a hover motion that acts out what each icon means. It suits interface icons at 16 to 48 pixels: navigation, buttons, lists and tabs.">
        {page.title}
      </Title>
      <DuotoneWall />
      <p>The icons play their motion in turn; an icon under the pointer holds its hover pose. To search, recolor and copy them, choose <strong>Two-tone</strong> in the <Link href="/icons/?style=duotone">icon browser</Link>.</p>
      <h2>Switch style by import path</h2>
      <p>A two-tone icon has the same name and props as the layered one, so switching style is one import. Each package has a <code>duotone</code> path:</p>
      <Code lang="tsx" code={`// Layered
import { Folder, BellOff } from "kubai-icons-react";
// Two-tone
import { Folder, BellOff } from "kubai-icons-react/duotone";

<Folder size={24} color="#5A76F2" />`} />
      <table>
        <thead><tr><th>Package</th><th>Two-tone</th></tr></thead>
        <tbody>
          <tr><td>React</td><td><code>kubai-icons-react/duotone</code></td></tr>
          <tr><td>Vue</td><td><code>kubai-icons-vue/duotone</code></td></tr>
          <tr><td>JavaScript</td><td><code>kubai-icons/duotone</code></td></tr>
          <tr><td>Web component</td><td><code>&lt;kubai-icon name=&quot;folder&quot; icon-style=&quot;duotone&quot;&gt;</code></td></tr>
          <tr><td>Static SVG</td><td><code>kubai-icons-static/svg-duotone/folder.svg</code></td></tr>
        </tbody>
      </table>
      <p>The two-tone set is smaller than the layered one. Most two-tone icons have a layered icon of the same name; a few exist only in this style. The full list is in <code>kubai-icons/duotone/icons.json</code>, where those few carry <code>only: true</code>.</p>
      <h2>Colors</h2>
      <p>The accent follows <code>color</code>, or <code>currentColor</code> when no color is given. The light tone is the accent mixed at 40% with white. To choose it yourself, for example on a dark background, set <code>--kd-b</code>:</p>
      <Code lang="css" code={`.sidebar .kubai-duotone { --kd-b: #2B3566; }`} />
      <p>The <code>variant</code> and <code>badgeColor</code> props of the layered icons don&apos;t apply. Files in <code>svg-duotone/</code> use the default colors, #5A76F2 and #BDC8FA.</p>
      <h2>Motion</h2>
      <p>Each icon plays its motion on hover, with the same <code>trigger</code>, <code>hover</code> and <code>title</code> props as the layered icons. A lid swings open, a page is torn off, a letter comes out of its envelope. Parts that only appear on hover are hidden in the server-rendered markup, so they never flash before the script runs. With reduced motion turned on, icons go straight to their end pose.</p>
      <h2>Variants</h2>
      <p>Variants such as <code>folder-plus</code>, <code>calendar-check</code>, <code>search-sparkle</code> and <code>bell-off</code> add one badge to the same object: a plus, minus, check, cross, sparkle or a slash, always the same size and in the same place.</p>
      <h2>Drawing more</h2>
      <p>The two-tone icons are drawn with the <Link href="/skill/">kubai-duotone skill</Link>, which follows the same rules and checks each icon before it joins the library. Icons you draw with it for your own product belong to you.</p>
      <Faq
        heading="Questions"
        items={[
          { q: "Can I mix the two styles on one page?", a: "Yes, but keep one style per area, such as the two-tone style in the sidebar and the layered style on the marketing pages. Both use the same names, so moving an area from one style to the other is one import." },
          { q: "Why is my icon not in the two-tone set?", a: "The two-tone set covers common interface functions first. Use the layered icon meanwhile, or draw it with the kubai-duotone skill." },
          { q: "Do two-tone icons work without JavaScript?", a: "Yes. The markup renders on the server, and `svg-duotone/` has a standalone file for each icon. Only the hover motion needs the script." },
        ]}
      />
    </Prose>
  );
}
