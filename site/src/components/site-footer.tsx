"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { RiGithubLine } from "@remixicon/react";
import { AuthorLink } from "@/components/author-link";
import { FeedbackLink } from "@/components/feedback-link";
import { Logo } from "@/components/logo";
import { AUTHOR, REPO } from "@/lib/site";
import { Container } from "@/components/kit/layout";
import { quietLink } from "@/components/kit/styles";
import { cn } from "@/lib/utils";
import { useLocalize, useTr } from "@/lib/use-locale";

const link = cn("block w-fit py-1 pointer-coarse:py-2", quietLink);

const GITHUB = "https://github.com/kubai087";
const MORE = [
  { name: "Lumno", site: "https://lumno.kubai.design/", repo: `${GITHUB}/lumno-extension` },
  { name: "Lumno Web", site: "https://lumno.kubai.design/", repo: `${GITHUB}/lumno-web` },
  { name: "PRO Threads", site: "https://www.kubai.design/pro-threads/", repo: `${GITHUB}/pro-threads` },
  { name: "Glasswork", site: "https://www.kubai.design/glasswork/", repo: `${GITHUB}/glasswork` },
];

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <nav aria-label={title} className="space-y-2">
      <p className="text-caption font-medium text-foreground">{title}</p>
      <div className="text-control">{children}</div>
    </nav>
  );
}

export function SiteFooter() {
  const tr = useTr();
  const loc = useLocalize();
  return (
    <footer className="mt-section border-t">
      {/* The description on the left and the link columns on the right, stacked below 1280px so the columns keep their width. */}
      <Container className="grid gap-x-16 gap-y-10 py-12 xl:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="space-y-3">
          <Link href={loc("/")} className="flex w-fit items-center gap-2 text-subheading font-semibold">
            <Logo size={24} />
            Kubai Icons
          </Link>
          <p className="max-w-64 text-control text-pretty text-muted-foreground">{tr("Open-source animated icons for React, Vue and the web.", "开源图标库，每个图标都有专属动效")}</p>
          <p className="pt-1 text-caption text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <AuthorLink place="footer" className="tap relative font-medium text-foreground underline-offset-4 hover:underline">{AUTHOR.name}</AuthorLink>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          <Column title={tr("Library", "图标库")}>
            <Link href={loc("/icons/")} className={link}>{tr("Icons", "图标")}</Link>
            <Link href={loc("/icons/submit/")} className={link}>{tr("Submit an icon", "提交图标")}</Link>
            <Link href={loc("/docs/")} className={link}>{tr("Docs", "文档")}</Link>
            <Link href={loc("/skill/")} className={link}>Skill</Link>
          </Column>
          <Column title={tr("Project", "项目")}>
            <a href={REPO} target="_blank" rel="noreferrer" className={link}>GitHub</a>
            <a href={`${REPO}/releases`} target="_blank" rel="noreferrer" className={link}>{tr("Releases", "更新日志")}</a>
            <FeedbackLink className={link}>{tr("Feedback", "反馈")}</FeedbackLink>
            <Link href={loc("/links/")} className={link}>{tr("Partners", "合作伙伴")}</Link>
          </Column>
          <Column title={tr("Legal", "法律信息")}>
            <Link href={loc("/license/")} className={link}>{tr("License", "许可证")}</Link>
            <Link href={loc("/docs/analytics/")} className={link}>{tr("Privacy", "隐私")}</Link>
          </Column>
          <Column title={tr("More by Kubai087", "Kubai087 的其他作品")}>
            {MORE.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <a href={p.site} target="_blank" rel="noreferrer" className={link}>{p.name}</a>
                <a href={p.repo} target="_blank" rel="noreferrer" aria-label={tr("{name} on GitHub", "{name} 的 GitHub 仓库", { name: p.name })} title={tr("{name} on GitHub", "{name} 的 GitHub 仓库", { name: p.name })} className={cn("grid size-5 place-items-center pointer-coarse:size-8", quietLink)}>
                  <RiGithubLine className="size-3.5" />
                </a>
              </div>
            ))}
            <a href="https://www.kubai.design/" target="_blank" rel="noreferrer" className={link}>kubai.design</a>
          </Column>
        </div>
      </Container>
    </footer>
  );
}
