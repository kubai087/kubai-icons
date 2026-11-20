import Link from "next/link";
import { Code, Prose, Title } from "@/components/docs/prose";
import { Faq } from "@/learn/faq";
import { learnMeta, learnPage } from "@/learn/pages";

const HREF = "/docs/guides/shadcn-ui/";
export const metadata = learnMeta(HREF, "zh");

export default function Page() {
  const page = learnPage(HREF);
  return (
    <Prose>
      <Title lead="shadcn/ui 组件可以放入任意 SVG 图标，Kubai Icons 可以直接替换默认图标的位置。需要注意一点：shadcn/ui 的样式会关闭按钮和菜单项内图标的指针事件，所以要由控件本身来触发动效。">
        {page.zhTitle}
      </Title>
      <h2>安装</h2>
      <Code lang="bash" code="npm install kubai-icons-react" />
      <p>shadcn/ui 组件自身从 <code>lucide-react</code> 导入图标。如果同一个文件同时使用两个库，且名称冲突，可以用别名导入 Kubai 的图标：</p>
      <Code lang="tsx" code={`import { Settings as SettingsIcon } from "kubai-icons-react";`} />
      <h2>按钮</h2>
      <p>shadcn/ui 的 <code>Button</code> 类名中包含 <code>[&amp;_svg]:pointer-events-none</code>。这样一来，悬停在图标上等同于悬停在按钮上，图标本身收不到悬停事件。给按钮加上 <code>data-kubai-trigger</code>，给图标设置 <code>trigger=&quot;parent&quot;</code>，就会由按钮触发动效：</p>
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
      <p>按钮还会通过 <code>[&amp;_svg:not([class*=&apos;size-&apos;])]:size-4</code> 统一图标尺寸，所以无论 <code>size</code> prop 设为多少，图标都显示为 16px。需要其他尺寸时，给图标加一个 <code>size-*</code> 类，例如 <code>className=&quot;size-5&quot;</code>。</p>
      <h2>渲染为链接的按钮</h2>
      <p>按钮渲染为链接时（基于 Radix 的项目用 <code>asChild</code>，基于 Base UI 的项目用 <code>render</code> prop），传给按钮的 props 会转交给实际渲染的元素。像前面一样，把 <code>data-kubai-trigger</code> 加在按钮上即可：</p>
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
      <h2>侧边栏</h2>
      <p>在侧边栏中，应该由整个菜单按钮触发动效。用同样的方式标记 <code>SidebarMenuButton</code>：</p>
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
      <h2>下拉菜单</h2>
      <p><code>DropdownMenuItem</code> 同样会关闭内部图标的指针事件。给每个菜单项加上标记：</p>
      <Code lang="tsx" code={`import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, User } from "kubai-icons-react";

<DropdownMenuItem data-kubai-trigger>
  <User trigger="parent" /> Profile
</DropdownMenuItem>
<DropdownMenuItem data-kubai-trigger>
  <LogOut trigger="parent" /> Log out
</DropdownMenuItem>`} />
      <h2>与主题一致的颜色</h2>
      <p>图标的颜色来自 <code>currentColor</code>，所以在 shadcn/ui 按钮中，图标会跟随按钮在各个变体和深色模式下的文字颜色。要单独设置图标颜色，可以用文字颜色类或主题变量：</p>
      <Code lang="tsx" code={`<Bell className="text-primary" />
<Trash color="var(--destructive)" />`} />
      <p>soft 样式和整页设置见<Link href="/zh/docs/guides/colors-dark-mode/">颜色和深色模式</Link>。</p>
      <Faq
        heading="常见问题"
        items={[
          { q: "为什么 shadcn/ui Button 里的图标悬停时没有动效？", a: "Button 给内部 SVG 设置了 `pointer-events: none`，图标收不到指针事件。给 Button 加上 `data-kubai-trigger`，给图标设置 `trigger=\"parent\"` 即可。" },
          { q: "为什么设置了 `size={24}`，图标还是 16px？", a: "Button 和菜单项的样式会给没有 `size-*` 类的 SVG 设置 `size-4`，而 CSS 会覆盖尺寸属性。给图标加一个类，例如 `size-6`。" },
          { q: "用键盘操作时会播放动效吗？", a: "被标记的按钮获得键盘焦点时，图标会像悬停时一样播放。鼠标点击后留下的焦点不会触发。" },
          { q: "需要移除 lucide-react 吗？", a: "不需要。两个库可以同时安装，名称冲突时用导入别名区分。" },
        ]}
      />
    </Prose>
  );
}
