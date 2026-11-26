import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { LineWall } from "@/learn/style-wall";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/line/";
export const metadata = learnMeta(HREF, "en");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Besides the layered and two-tone icons, the library comes in a line style: rounded strokes on a 24 grid, a stroke width you can set to any value above 0, four variants, and a hover motion that acts out what each icon means. It suits interface icons that sit next to text, at 16 to 32 pixels.">
        {page.title}
      </Title>
      <LineWall />
      <p>The icons play their motion in turn; an icon under the pointer holds its hover pose. To search, recolor, change the variant or the stroke width and copy them, choose <strong>Line</strong> in the <Link href="/icons/?style=line">icon browser</Link>.</p>
      <h2>Switch style by import path</h2>
      <p>A line icon has the same name as the layered one where the library has both, so switching style is one import. Each package has a <code>line</code> path:</p>
      <Code lang="tsx" code={`// Layered
import { Lock, Camera } from "kubai-icons-react";
// Line
import { Lock, Camera } from "kubai-icons-react/line";

<Lock size={24} strokeWidth={2} variant="line-duo" />`} />
      <table>
        <thead><tr><th>Package</th><th>Line</th></tr></thead>
        <tbody>
          <tr><td>React</td><td><code>kubai-icons-react/line</code></td></tr>
          <tr><td>Vue</td><td><code>kubai-icons-vue/line</code></td></tr>
          <tr><td>JavaScript</td><td><code>kubai-icons/line</code></td></tr>
          <tr><td>Web component</td><td><code>&lt;kubai-icon name=&quot;lock&quot; icon-style=&quot;line&quot; stroke-width=&quot;2&quot;&gt;</code></td></tr>
          <tr><td>Static SVG</td><td><code>kubai-icons-static/svg-line/lock.svg</code></td></tr>
        </tbody>
      </table>
      <p>Most line icons have a layered icon of the same name; a few exist only in this style. The full list is in <code>kubai-icons/line/icons.json</code>, where those few carry <code>only: true</code>.</p>
      <h2>Stroke width</h2>
      <p><code>strokeWidth</code> takes any width above 0, and defaults to 2; the browser on this site offers 0.25 to 3 and starts at 1.75. Match it to the weight of the text beside the icon: 1.5 for light text, 2 for regular, 2.25 for medium and 2.5 for bold. In Vue write <code>:stroke-width</code>, and on the web component <code>stroke-width</code>.</p>
      <p>At 24 pixels and a width of 2, every edge falls on whole pixels. Outlines are placed by their outer edge, so an icon keeps its size at every width, and its small details move to keep their spacing. Widths from 1.5 to 2.5 are checked icon by icon; the rest are drawn from the nearest checked width.</p>
      <h2>Variants</h2>
      <table>
        <thead><tr><th><code>variant</code></th><th>Looks like</th></tr></thead>
        <tbody>
          <tr><td><code>outline</code> (default)</td><td>Lines in one color.</td></tr>
          <tr><td><code>line-duo</code></td><td>Inner and key parts in a light tone, under the lines in the full color.</td></tr>
          <tr><td><code>fill</code></td><td>Closed shapes filled, with details cut out of them.</td></tr>
          <tr><td><code>solid-tint</code></td><td>Lines in the full color over areas filled in a light tint, including areas that only look closed, such as the inside of a refresh arrow.</td></tr>
        </tbody>
      </table>
      <p>One object always keeps one tone: the light tone of <code>line-duo</code> marks a whole part, such as the lens of a camera, never half of a shape.</p>
      <h2>Colors</h2>
      <p>A line icon uses up to three colors: the lines, a light tone and a fill tint. Which of them a variant shows:</p>
      <table>
        <thead><tr><th><code>variant</code></th><th>Lines & shapes</th><th>Light tone</th><th>Fill tint</th></tr></thead>
        <tbody>
          <tr><td><code>outline</code></td><td>Every line</td><td>–</td><td>–</td></tr>
          <tr><td><code>line-duo</code></td><td>The outer lines</td><td>Inner and key parts</td><td>–</td></tr>
          <tr><td><code>fill</code></td><td>Every shape, filled</td><td>–</td><td>–</td></tr>
          <tr><td><code>solid-tint</code></td><td>Every line</td><td>–</td><td>The areas inside</td></tr>
        </tbody>
      </table>
      <p>There are four ways to set them, from the simplest:</p>
      <ol>
        <li><strong>One color.</strong> Set <code>color</code>, or leave it out and the icon takes the text color (<code>currentColor</code>). The lines use it; the light tone is it mixed 42% toward white and the tint 20%, so one color gives a matching set.</li>
        <li><strong>Mix toward your background.</strong> On a dark or colored background, set <code>--kl-bg</code> to that background, and the light tone and the tint mix toward it instead of white.</li>
        <li><strong>Choose the tones.</strong> <code>--kl-light</code> sets the light tone of <code>line-duo</code> and <code>--kl-fill</code> the tint of <code>solid-tint</code>, for a brand accent beside neutral lines, for example.</li>
        <li><strong>Fixed colors in a file.</strong> <code>lineStill()</code> writes a standalone SVG with the three colors written into it, for design tools and places without CSS.</li>
      </ol>
      <Code lang="css" code={`.dark .kubai-line { --kl-bg: #0B0D14; }
.sidebar .kubai-line { --kl-light: #BDC8FA; --kl-fill: #E8ECFD; }`} />
      <p>The <code>badgeColor</code> prop of the layered icons doesn&apos;t apply. Files in <code>svg-line/</code> are the outline variant at a width of 2, in <code>currentColor</code>.</p>
      <h2>Motion</h2>
      <p>Each icon plays its motion on hover, with the same <code>trigger</code>, <code>hover</code> and <code>title</code> props as the other styles. Where it can, the motion changes the icon&apos;s state: a lock&apos;s shackle lifts open, a bookmark ribbon grows down, a trash can&apos;s lid lifts and a slash draws across the icon it turns off. Some move parts in depth while the outline stays still: a globe&apos;s meridians turn round it, the pages of an open book turn over, a laptop&apos;s screen closes on its hinge; strokes keep their width throughout. With reduced motion turned on, icons stay still.</p>
      <h2>Drawing more</h2>
      <p>The line icons are drawn with the <Link href="/skill/">kubai-line skill</Link>, which follows the same grid, stroke and layout rules and checks each icon at every width before it joins the library. Icons you draw with it for your own product belong to you.</p>
      <Faq
        heading="Questions"
        items={[
          { q: "Can I mix the line style with the others?", a: "Yes, but keep one style per area, such as line icons in a toolbar and layered icons on the marketing pages. Names are shared where both styles have the object, so moving an area from one style to another is one import." },
          { q: "Which stroke width should I use?", a: "Start with 2 at 24 pixels. Use 1.5 next to light text or at 32 pixels and above, and 2.5 next to bold text or at 16 pixels, where thin lines fade." },
          { q: "Why is my icon not in the line set?", a: "The line set covers common interface functions first. Use the layered or two-tone icon meanwhile, or draw it with the kubai-line skill." },
          { q: "Do line icons work without JavaScript?", a: "Yes. The markup renders on the server at the chosen width and variant, and `svg-line/` has a standalone file for each icon. Only the hover motion needs the script." },
        ]}
      />
    </Prose>
  );
}
