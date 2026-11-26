import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/no-build/";
export const metadata = learnMeta(HREF, "en");

const SCRIPT = `<script type="module" src="https://cdn.jsdelivr.net/npm/kubai-icons@0/dist/cdn/element.js"></script>`;

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="The <kubai-icon> web component brings every icon to any page with one script tag. It needs no bundler and no install, and it works in plain HTML, CMS pages and frameworks that render custom elements.">
        {page.title}
      </Title>
      <h2>Plain HTML</h2>
      <p>Load the component once, in the <code>&lt;head&gt;</code> or anywhere before the icons. Then write one element per icon:</p>
      <Code lang="html" code={`${SCRIPT}

<kubai-icon name="folder"></kubai-icon>
<kubai-icon name="bell-off" size="32" color="#F97316" variant="soft" label="Muted"></kubai-icon>`} />
      <p>The script loads each icon&apos;s file from the same CDN the first time that icon is used, so a page downloads only the icons it shows. The element reserves its size before the icon arrives, so the layout doesn&apos;t shift.</p>
      <h2>Attributes</h2>
      <table>
        <thead><tr><th>Attribute</th><th>Default</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>name</code></td><td>None</td><td>The icon&apos;s kebab-case name, such as <code>folder-plus</code>. An unknown name renders nothing.</td></tr>
          <tr><td><code>size</code></td><td>24</td><td>Width and height in pixels.</td></tr>
          <tr><td><code>color</code></td><td>currentColor</td><td>The accent color that every tone is calculated from.</td></tr>
          <tr><td><code>variant</code></td><td>color</td><td><code>soft</code> uses lighter fills and darker outlines.</td></tr>
          <tr><td><code>badge-color</code></td><td>dark gray</td><td>Color of the badge disc, or <code>semantic</code>.</td></tr>
          <tr><td><code>trigger</code></td><td>hover</td><td><code>hover</code>, <code>parent</code> or <code>none</code>. See below.</td></tr>
          <tr><td><code>label</code></td><td>None</td><td>Accessible name. Without it, screen readers skip the icon.</td></tr>
        </tbody>
      </table>
      <p>Changing an attribute later, for example from your own script, redraws the icon.</p>
      <h2>Play the motion when a link or button is hovered</h2>
      <p>Add <code>data-kubai-trigger</code> to the link or button and <code>trigger=&quot;parent&quot;</code> to the icon. Without the attribute, the icon listens to its direct parent.</p>
      <Code lang="html" code={`<a href="/downloads" data-kubai-trigger>
  <kubai-icon name="download" size="18" trigger="parent"></kubai-icon>
  Downloads
</a>`} />
      <h2>WordPress & other CMSs</h2>
      <p>In the WordPress block editor, add a <strong>Custom HTML</strong> block and paste the script tag and the icons into it. If you use icons on many pages, add the script tag once to the site&apos;s header instead, through your theme or a plugin that inserts code into the head, and use only the <code>&lt;kubai-icon&gt;</code> elements in your blocks. The same approach works in any CMS or site builder that accepts custom HTML.</p>
      <Code lang="html" code={`${SCRIPT}

<p style="color: #14B8A6">
  <kubai-icon name="leaf" size="28"></kubai-icon>
  Grown without pesticides
</p>`} />
      <h2>Svelte & SvelteKit</h2>
      <p>Add the script tag to <code>src/app.html</code> in SvelteKit, or to <code>index.html</code> in a Vite app. Svelte renders custom elements as they are, and attributes can be bound:</p>
      <Code lang="svelte" code={`<script>
  let { icon = "folder" } = $props();
</script>

<kubai-icon name={icon} size="24"></kubai-icon>`} />
      <h2>Angular</h2>
      <p>Add the script tag to <code>src/index.html</code>. Angular rejects unknown elements unless the component allows them, so add <code>CUSTOM_ELEMENTS_SCHEMA</code>:</p>
      <Code lang="ts" code={`import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "app-toolbar",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <button data-kubai-trigger>
      <kubai-icon name="settings" size="18" trigger="parent"></kubai-icon>
      Settings
    </button>
    <kubai-icon [attr.name]="iconName"></kubai-icon>
  \`,
})
export class ToolbarComponent {
  iconName = "inbox";
}`} />
      <p>Use <code>[attr.name]</code> to bind an attribute from a component property.</p>
      <h2>Astro</h2>
      <p>Add the script tag to your layout&apos;s <code>&lt;head&gt;</code> with <code>is:inline</code>, so Astro leaves it as it is, then use the element in any page or component:</p>
      <Code lang="astro" code={`---
// src/layouts/Base.astro
---
<html lang="en">
  <head>
    <script is:inline type="module" src="https://cdn.jsdelivr.net/npm/kubai-icons@0/dist/cdn/element.js"></script>
  </head>
  <body>
    <kubai-icon name="rocket" size="32"></kubai-icon>
    <slot />
  </body>
</html>`} />
      <h2>Images without any script</h2>
      <p>Where scripts aren&apos;t allowed, such as a README or a Markdown page, use a static SVG file in an <code>&lt;img&gt;</code> tag. It has no motion. See <Link href="/docs/static/">Static SVG</Link>.</p>
      <Code lang="html" code={`<img src="https://icons.kubai.design/api/icon/folder.svg?color=EC4899" width="28" height="28" alt="" />`} />
      <Faq
        heading="Questions"
        items={[
          { q: "Which version does the CDN script load?", a: "A URL with `@0` loads the latest 0.x release, so new icons become available without changing the page. The CDN can take a while to switch to a new release. Pin an exact version, such as `kubai-icons@0.9.0`, to keep a page unchanged." },
          { q: "Does the web component work with React or Vue?", a: "It does, but the `kubai-icons-react` and `kubai-icons-vue` packages are a better fit there: they render on the server and take props." },
          { q: "How do I find an icon's name?", a: "Search the icon browser at /icons/. The name is shown on each icon's panel and page, in kebab-case, such as `calendar-check`." },
          { q: "Is the motion accessible?", a: "Keyboard focus plays the motion as hover does, a tap plays it on touch screens, and `prefers-reduced-motion` skips the animation." },
        ]}
      />
    </Prose>
  );
}
