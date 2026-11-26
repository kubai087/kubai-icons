import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/tailwind/";
export const metadata = learnMeta(HREF, "en");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="Kubai Icons need no Tailwind plugin or configuration. Every tone of an icon is calculated from one accent color, which defaults to currentColor, so the utility classes you already use for text also color the icons.">
        {page.title}
      </Title>
      <p>The examples use React. In Vue, write <code>class</code> instead of <code>className</code>; with the web component, put the classes on <code>&lt;kubai-icon&gt;</code> or a parent.</p>
      <h2>Color</h2>
      <p>Set a text color class on the icon, or on any element around it:</p>
      <Code lang="tsx" code={`import { Leaf, Bell } from "kubai-icons-react";

<Leaf className="text-emerald-500" />

<p className="text-amber-500">
  <Bell /> Reminders
</p>`} />
      <p>Because the gradients, outlines and marks all derive from that one color, a single class changes the whole icon. The <code>color</code> prop does the same and takes precedence over inherited color.</p>
      <h2>Size</h2>
      <p>The <code>size</code> prop sets the width and height in pixels. Tailwind sizing classes work too, since CSS width and height override the SVG&apos;s own attributes:</p>
      <Code lang="tsx" code={`<Folder size={20} />
<Folder className="size-5" />          {/* also 20px */}
<Folder className="size-6 md:size-8" /> {/* responsive */}`} />
      <h2>Dark mode</h2>
      <p>Pair the color with a <code>dark:</code> variant, as you would for text:</p>
      <Code lang="tsx" code={`<Folder className="text-blue-600 dark:text-blue-400" />`} />
      <p>To fade the color when the theme changes, add <code>transition-colors</code>. Transitions on <code>color</code> cross-fade every gradient in the icon.</p>
      <Code lang="tsx" code={`<Folder className="text-blue-600 transition-colors dark:text-blue-400" />`} />
      <p>For the soft variant across a whole theme, see <Link href="/docs/guides/colors-dark-mode/">Colors & dark mode</Link>.</p>
      <h2>Badge color & single tones</h2>
      <p>Icons read a few CSS custom properties, which Tailwind can set with arbitrary properties. For example, <code>--ki-b</code> is the color of the badge disc on badged icons:</p>
      <Code lang="tsx" code={`import { FolderPlus } from "kubai-icons-react";

<FolderPlus className="text-sky-500 [--ki-b:#7C3AED]" />`} />
      <p>The other properties are listed in <Link href="/docs/customize/">Customization</Link>. For badges, the <code>badgeColor</code> prop is usually simpler: <code>badgeColor=&quot;semantic&quot;</code> picks green for add, red for remove and so on.</p>
      <h2>Hover a group</h2>
      <p>Tailwind&apos;s <code>group</code> and <code>group-hover:</code> change styles, but they don&apos;t start an icon&apos;s motion. To play the motion when the group is hovered, add <code>data-kubai-trigger</code> to the same element and <code>trigger=&quot;parent&quot;</code> to the icon:</p>
      <Code lang="tsx" code={`import { Rocket } from "kubai-icons-react";

<a href="/launch" data-kubai-trigger className="group flex items-center gap-2 rounded-lg p-3 hover:bg-zinc-100">
  <Rocket className="size-6 text-zinc-500 group-hover:text-violet-600" trigger="parent" />
  Launch
</a>`} />
      <p>Here the class changes the color on hover and the trigger plays the motion, so both happen together. More patterns are in <Link href="/docs/guides/button-hover/">Play an icon&apos;s animation when its button is hovered</Link>.</p>
      <h2>Static SVG files</h2>
      <p>Files from <code>kubai-icons-static</code> have their colors written in, so text color classes don&apos;t change them. Size them like any image. Each file has a margin for the drop shadow, so a 28px image matches a live icon at 24px:</p>
      <Code lang="html" code={`<img src="https://cdn.jsdelivr.net/npm/kubai-icons-static@0/svg/folder.svg" class="size-7" alt="" />`} />
      <Faq
        heading="Questions"
        items={[
          { q: "Do I need to add the icons to Tailwind's content paths?", a: "No. The icons don't use Tailwind classes, so Tailwind doesn't need to scan the package. Only the classes you write in your own files matter." },
          { q: "Can I use `fill-*` or `stroke-*` utilities?", a: "They aren't the way to recolor these icons, because each icon's fills and outlines are calculated from its accent color. Use a `text-*` class or the `color` prop." },
          { q: "Does `size-5` conflict with the `size` prop?", a: "The class wins, because CSS overrides the width and height attributes that the `size` prop sets. Use one or the other." },
          { q: "Can I use my theme's CSS variables as the color?", a: "Yes. Any CSS color works, including a variable such as `text-(--brand)` in Tailwind v4 or `color=\"var(--brand)\"` on the icon." },
        ]}
      />
    </Prose>
  );
}
