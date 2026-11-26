"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItem } from "@/components/kit/styles";
import { ClipTip } from "@/components/kit/clip-tip";
import { Glide } from "@/components/kit/glide";
import { BottomNav, useReadingProgress } from "@/components/kit/bottom-nav";
import { cn } from "@/lib/utils";
import { hasIconPages } from "@/lib/i18n";
import { useLocale, useLocalize, useTr } from "@/lib/use-locale";
import { withLearnPages } from "@/learn/pages";

export const DOCS = [
  { group: "Get started", zh: "入门", items: [
    { href: "/docs/", label: "Introduction", zh: "简介" },
  ] },
  { group: "Packages", zh: "软件包", items: [
    { href: "/docs/react/", label: "React", zh: "React" },
    { href: "/docs/vue/", label: "Vue", zh: "Vue" },
    { href: "/docs/javascript/", label: "JavaScript", zh: "JavaScript" },
    { href: "/docs/static/", label: "Static SVG", zh: "静态 SVG" },
  ] },
  { group: "Guides", zh: "指南", items: [
    { href: "/docs/customize/", label: "Customization", zh: "自定义" },
    { href: "/docs/performance/", label: "Performance", zh: "性能" },
    { href: "/docs/accessibility/", label: "Accessibility", zh: "无障碍" },
  ] },
  { group: "Contribute", zh: "参与贡献", items: [
    { href: "/docs/design/", label: "Design language", zh: "设计语言" },
    { href: "/docs/contributing/", label: "Contributing", zh: "贡献指南" },
    { href: "/skill/", label: "Kubai Icons skill", zh: "Kubai Icons Skill" },
  ] },
  { group: "Legal", zh: "法律信息", items: [
    { href: "/docs/analytics/", label: "Privacy", zh: "隐私" },
    { href: "/license/", label: "License", zh: "许可证" },
  ] },
];

/** The docs nav for the current page's language: English and Chinese add their guides and comparisons. */
export function useDocs() {
  return hasIconPages(useLocale()) ? withLearnPages(DOCS) : DOCS;
}

/** A page in the nav: a long title ends in an ellipsis and shows in full in a tooltip. The sheet's rows are taller. */
function NavLink({ href, active, label, sheet }: { href: string; active: boolean; label: string; sheet: boolean }) {
  return <ClipTip label={label} row={<Link href={href} aria-current={active ? "page" : undefined} className={cn(navItem({ active }), sheet && "py-2.5 text-body")} />} />;
}

/** The docs pages in their groups. The wide layout shows them as a sidebar; phones open them from the bottom bar. */
export function DocsNav({ sheet = false }: { sheet?: boolean }) {
  const path = usePathname();
  const tr = useTr();
  const loc = useLocalize();
  const docs = useDocs();
  const current = (href: string) => norm(path ?? "") === norm(loc(href));
  return (
    <nav className={cn("relative isolate", sheet ? "space-y-5" : "space-y-6")}>
      {docs.map((g) => (
        <div key={g.group} className="space-y-1">
          <p className="px-2.5 pb-1 text-control font-semibold text-foreground">{tr(g.group, g.zh)}</p>
          {g.items.map((i) => (
            <NavLink key={i.href} href={loc(i.href)} active={current(i.href)} label={tr(i.label, i.zh)} sheet={sheet} />
          ))}
        </div>
      ))}
      <Glide still selector="[aria-current=page]" className="rounded-control bg-muted" />
    </nav>
  );
}

/** The phone layout's docs navigation: the current page and how far through it the reader is. */
export function DocsBottomNav() {
  const path = usePathname();
  const tr = useTr();
  const loc = useLocalize();
  const page = useDocs().flatMap((g) => g.items).find((i) => norm(path ?? "") === norm(loc(i.href)));
  const progress = useReadingProgress("#docs-content", path);
  return (
    <BottomNav className="md:hidden" title={tr("Docs", "文档")} label={page ? tr(page.label, page.zh) : tr("Docs", "文档")} progress={progress}>
      <DocsNav sheet />
    </BottomNav>
  );
}

const norm = (p: string) => p.replace(/\/$/, "") || "/";
