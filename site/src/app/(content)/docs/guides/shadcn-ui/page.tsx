import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/shadcn-ui/";
export const metadata = learnMeta(HREF, "en");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="shadcn/ui components accept any SVG icon, so Kubai Icons drop in where the default icons go. One detail matters: shadcn/ui styles turn off pointer events on icons inside buttons and menu items, so the control itself has to start the motion.">
        {page.title}
      </Title>
      <h2>Install</h2>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>shadcn/ui components import their own icons from <code>lucide-react</code>. If a file uses both libraries and two names clash, import Kubai&apos;s icon with an alias:</p>
      <Code lang="tsx" code={`import { Settings as SettingsIcon } from "kubai-icons-react";`} />
      <h2>Buttons</h2>
      <p>The shadcn/ui <code>Button</code> includes <code>[&amp;_svg]:pointer-events-none</code> in its classes. Hovering the icon then counts as hovering the button, and the icon itself never receives the hover. Add <code>data-kubai-trigger</code> to the button and <code>trigger=&quot;parent&quot;</code> to the icon, so the button starts the motion:</p>
      <Code lang="tsx" code={`import { Button } from "@/components/ui/button";
import { Download } from "kubai-icons-react";

export function ExportButton() {
  return (
    <Button variant="outline" data-kubai-trigger>
      <Download trigger="parent" />
      Export
    </Button>
  );
}`} />
      <p>The button also sizes icons with <code>[&amp;_svg:not([class*=&apos;size-&apos;])]:size-4</code>, so icons show at 16px whatever their <code>size</code> prop. For another size, give the icon a <code>size-*</code> class, such as <code>className=&quot;size-5&quot;</code>.</p>
      <h2>Buttons that render a link</h2>
      <p>When a button renders a link, through <code>asChild</code> in Radix-based projects or the <code>render</code> prop in Base UI-based ones, props you pass to the button are passed on to the element it renders. Put <code>data-kubai-trigger</code> on the button as before:</p>
      <Code lang="tsx" code={`import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket } from "kubai-icons-react";

// Radix-based projects
<Button asChild data-kubai-trigger>
  <Link href="/deploy"><Rocket trigger="parent" /> Deploy</Link>
</Button>

// Base UI-based projects
<Button nativeButton={false} render={<Link href="/deploy" />} data-kubai-trigger>
  <Rocket trigger="parent" /> Deploy
</Button>`} />
      <h2>Sidebar</h2>
      <p>In a sidebar, the whole menu button should start the motion. Mark <code>SidebarMenuButton</code> the same way:</p>
      <Code lang="tsx" code={`import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Inbox, Calendar, Settings } from "kubai-icons-react";

const items = [
  { title: "Inbox", url: "/inbox", icon: Inbox },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function NavMain() {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild data-kubai-trigger>
            <a href={item.url}>
              <item.icon trigger="parent" />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}`} />
      <h2>Dropdown menus</h2>
      <p><code>DropdownMenuItem</code> also turns off pointer events on its icons. Mark each item:</p>
      <Code lang="tsx" code={`import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, User } from "kubai-icons-react";

<DropdownMenuItem data-kubai-trigger>
  <User trigger="parent" /> Profile
</DropdownMenuItem>
<DropdownMenuItem data-kubai-trigger>
  <LogOut trigger="parent" /> Log out
</DropdownMenuItem>`} />
      <h2>Colors that match your theme</h2>
      <p>Icons take their color from <code>currentColor</code>, so inside a shadcn/ui button they follow the button&apos;s text color in each variant and in dark mode. To give an icon its own color, use a text class or a theme variable:</p>
      <Code lang="tsx" code={`<Bell className="text-primary" />
<Trash color="var(--destructive)" />`} />
      <p>See <Link href="/docs/guides/colors-dark-mode/">Colors and dark mode</Link> for the soft variant and page-wide settings.</p>
      <Faq
        heading="Questions"
        items={[
          { q: "Why does the icon in my shadcn/ui Button not animate on hover?", a: "The Button sets `pointer-events: none` on child SVGs, so the icon never sees the pointer. Add `data-kubai-trigger` to the Button and `trigger=\"parent\"` to the icon." },
          { q: "Why is my icon 16px even though I set `size={24}`?", a: "The Button and menu item styles set `size-4` on any SVG without a `size-*` class, and CSS overrides the size attributes. Add a class such as `size-6` to the icon." },
          { q: "Does keyboard navigation play the motion?", a: "When a marked button receives keyboard focus, its icon plays as it does on hover. Focus left behind by a mouse click does not play it." },
          { q: "Do I need to remove lucide-react?", a: "No. Both libraries can be installed together. Use an import alias where names clash." },
        ]}
      />
    </Prose>
  );
}
