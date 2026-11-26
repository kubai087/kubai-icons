import { DocsFooter } from "@/components/docs/docs-footer";
import { DocsBottomNav, DocsNav } from "@/components/docs/docs-nav";
import { Container } from "@/components/kit/layout";
import { PageFade } from "@/components/kit/page-fade";

// Docs, Skill and License share this frame, so moving between them changes only the
// article. The minimum height keeps the footer below the fold on short pages. Phones get
// the page list from a bar at the bottom of the screen instead of the sidebar.
export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="min-h-[calc(100dvh-var(--header))] pt-8 md:grid md:grid-cols-[200px_1fr] md:content-start md:gap-10 md:pt-10">
      <aside className="sticky top-[calc(var(--header)+2.5rem)] min-w-0 self-start max-md:hidden md:max-h-[calc(100dvh-var(--header)-3.5rem)] md:overflow-y-auto">
        <DocsNav />
      </aside>
      <div id="docs-content" className="min-w-0"><PageFade>{children}<DocsFooter /></PageFade></div>
      <DocsBottomNav />
    </Container>
  );
}
