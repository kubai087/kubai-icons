import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/nextjs/";
export const metadata = learnMeta(HREF, "en");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="kubai-icons-react works in the App Router and the Pages Router with no configuration. Icons render as SVG on the server, so they show in the first HTML, and their hover motion is added on hydration.">
        {page.title}
      </Title>
      <h2>Install</h2>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <h2>Use an icon in a Server Component</h2>
      <p>Import icons by name. A page or layout can stay a Server Component: each icon is its own client module, so only the icons you render reach the browser.</p>
      <Code lang="tsx" code={`// app/page.tsx
import { Folder, Bell } from "kubai-icons-react";

export default function Home() {
  return (
    <main>
      <h1><Folder size={32} /> Projects</h1>
      <Bell color="#F59E0B" title="Notifications" />
    </main>
  );
}`} />
      <p>Without a <code>title</code>, an icon is hidden from screen readers. Add one when the icon carries meaning on its own, as the bell does here. See <Link href="/docs/accessibility/">Accessibility</Link>.</p>
      <h2>Play the motion when a link is hovered</h2>
      <p>By default, an icon plays its motion when the icon itself is hovered or focused. In a nav link, it reads better when the whole link starts it. Mark the link with <code>data-kubai-trigger</code> and set <code>trigger=&quot;parent&quot;</code> on the icon:</p>
      <Code lang="tsx" code={`import Link from "next/link";
import { Settings } from "kubai-icons-react";

export function SettingsLink() {
  return (
    <Link href="/settings" data-kubai-trigger className="flex items-center gap-2">
      <Settings size={18} trigger="parent" />
      Settings
    </Link>
  );
}`} />
      <h2>Icons chosen at runtime</h2>
      <p>When the icon name comes from data, such as a CMS or a database, use <code>DynamicIcon</code>. It loads each icon as a separate chunk the first time it is shown. It renders an empty placeholder on the server, so prefer named imports for icons that are always on the page.</p>
      <Code lang="tsx" code={`"use client";
import { DynamicIcon } from "kubai-icons-react/dynamic";

export function CategoryIcon({ name }: { name: string }) {
  return <DynamicIcon name={name} size={20} />;
}`} />
      <h2>Faster dev server</h2>
      <p>In development, <code>next dev</code> may load the package index, which references every icon. Importing each icon from its own file avoids that and keeps reloads quick:</p>
      <Code lang="tsx" code={`import Folder from "kubai-icons-react/icons/folder";`} />
      <p>Production builds remove unused icons either way. See <Link href="/docs/performance/">Performance</Link>.</p>
      <h2>Color & theme</h2>
      <p>Icons take their color from <code>currentColor</code>, so they follow the text color of the element around them, including in dark mode. To set a soft look for the whole app, set the variant once on the <code>&lt;body&gt;</code>. See <Link href="/docs/guides/colors-dark-mode/">Colors & dark mode</Link>.</p>
      <Faq
        heading="Questions"
        items={[
          { q: "Do the icons need `\"use client\"`?", a: "No. Each icon module already declares itself a client module, so you can import icons into Server Components directly. Only your own components that use hooks or `DynamicIcon` need the directive." },
          { q: "Do the icons cause a layout shift?", a: "No. The SVG is in the server HTML at its final size, and the motion only changes shapes inside it." },
          { q: "Does the motion respect reduced motion settings?", a: "Yes. When `prefers-reduced-motion` is set, an icon moves straight to its end pose without animating." },
          { q: "How much does an icon add to the bundle?", a: "Minified and gzipped, the first icon adds about 4 KB including the shared runtime, and each further icon about 0.6 KB." },
        ]}
      />
    </Prose>
  );
}
