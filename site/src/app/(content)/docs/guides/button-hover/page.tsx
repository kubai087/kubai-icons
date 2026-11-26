import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/button-hover/";
export const metadata = learnMeta(HREF, "en");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="By default, an icon plays its motion when the icon itself is hovered or receives keyboard focus. In a button, link or card, the icon is a small part of the target, so it reads better when the whole control starts the motion.">
        {page.title}
      </Title>
      <h2>Mark the control, then the icon</h2>
      <p>Add <code>data-kubai-trigger</code> to the element that should start the motion, and <code>trigger=&quot;parent&quot;</code> to the icon. The icon then listens to the closest ancestor that carries <code>data-kubai-trigger</code>. If there is none, it listens to its direct parent.</p>
      <Code lang="tsx" code={`import { Trash } from "kubai-icons-react";

export function DeleteButton() {
  return (
    <button data-kubai-trigger className="btn">
      <Trash size={18} trigger="parent" />
      Delete
    </button>
  );
}`} />
      <p>The same works in Vue:</p>
      <Code lang="vue" code={`<script setup>
import { Trash } from "kubai-icons-vue";
</script>

<template>
  <button data-kubai-trigger class="btn">
    <Trash :size="18" trigger="parent" />
    Delete
  </button>
</template>`} />
      <p>And with the web component:</p>
      <Code lang="html" code={`<a href="/settings" data-kubai-trigger>
  <kubai-icon name="settings" size="18" trigger="parent"></kubai-icon>
  Settings
</a>`} />
      <h2>Cards & list rows</h2>
      <p>The marked element can be as large as you like: a card, a table row or a menu item. Every icon inside it with <code>trigger=&quot;parent&quot;</code> plays together.</p>
      <Code lang="tsx" code={`import { CalendarCheck, Mail } from "kubai-icons-react";

export function InviteCard() {
  return (
    <a href="/invites/42" data-kubai-trigger className="card">
      <CalendarCheck size={28} trigger="parent" />
      <p>Team review, Friday 10:00</p>
      <Mail size={18} trigger="parent" />
    </a>
  );
}`} />
      <h2>Plain JavaScript</h2>
      <p>With <code>createIcon</code>, pass <code>trigger: &quot;parent&quot;</code> and add the icon to the page in the same task that creates it, because the icon looks for its trigger element right after that task:</p>
      <Code lang="js" code={`import { createIcon, Download } from "kubai-icons";

const button = document.querySelector("#export");
button.setAttribute("data-kubai-trigger", "");
button.prepend(createIcon(Download, { size: 18, trigger: "parent" }));`} />
      <p>To bind an icon that you add later, use <code>animate</code> and <code>bindTrigger</code>. See <Link href="/docs/javascript/">JavaScript</Link>.</p>
      <h2>Start the motion from your own state</h2>
      <p>For a motion that follows something other than hover, such as an open panel or a drag over a drop zone, set <code>trigger=&quot;none&quot;</code> and drive the <code>hover</code> prop. <code>true</code> plays the motion and <code>false</code> reverses it.</p>
      <Code lang="tsx" code={`import { useState } from "react";
import { Folder } from "kubai-icons-react";

export function DropZone() {
  const [over, setOver] = useState(false);
  return (
    <div
      onDragEnter={() => setOver(true)}
      onDragLeave={() => setOver(false)}
      onDrop={() => setOver(false)}
    >
      <Folder size={40} trigger="none" hover={over} />
      Drop files here
    </div>
  );
}`} />
      <h2>Keyboard, touch & toggles</h2>
      <ul>
        <li>Keyboard focus on the marked element plays the motion, as hover does. Focus left behind by a mouse click does not.</li>
        <li>On touch screens, a tap plays the motion forward and back.</li>
        <li>Toggle icons, such as <code>Bookmark</code>, switch state when the marked element is clicked. Use <code>active</code> and <code>onActiveChange</code> (or <code>v-model:active</code> in Vue) to keep that state in your app.</li>
        <li>When <code>prefers-reduced-motion</code> is set, icons move straight to their end pose.</li>
      </ul>
      <Faq
        heading="Questions"
        items={[
          { q: "Why doesn't the icon move when I hover it inside my button?", a: "Some component libraries set `pointer-events: none` on icons inside buttons, so the icon never receives hover. Add `data-kubai-trigger` to the button and `trigger=\"parent\"` to the icon, and the button starts the motion instead." },
          { q: "What happens if no element has `data-kubai-trigger`?", a: "With `trigger=\"parent\"`, the icon listens to its direct parent element." },
          { q: "Can one hover play several icons?", a: "Yes. Every icon with `trigger=\"parent\"` inside the same marked element plays when that element is hovered or focused." },
          { q: "Can I stop an icon from animating at all?", a: "Yes. Set `trigger=\"none\"` and leave out the `hover` prop. The icon then stays in its rest pose." },
        ]}
      />
    </Prose>
  );
}
