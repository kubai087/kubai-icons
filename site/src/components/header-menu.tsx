"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiFeedbackLine, RiGithubLine, RiLinksLine, RiMoreFill, RiTwitterXLine, RiUploadLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { track } from "@/lib/analytics";
import { absolute } from "@/lib/seo";
import { AUTHOR, feedbackUrl, REPO } from "@/lib/site";
import { ThemeMenuItem } from "./theme-toggle";
import { useLocalize, useTr } from "@/lib/use-locale";

/** Each row is a full-size touch target. */
const ITEM = "min-h-11 gap-2.5 px-2.5";
/** Rows the bar itself shows from lg. */
const BAR_LG = `${ITEM} lg:hidden`;

/** The header's secondary links, gathered into one menu where the bar is too narrow for them. */
export function HeaderMenu({ className }: { className?: string }) {
  const path = usePathname() ?? "/";
  const tr = useTr();
  const loc = useLocalize();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label={tr("More links", "更多链接")} className={className} />}>
        <RiMoreFill className="size-[18px] text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-52 p-1.5">
        <DropdownMenuItem className={BAR_LG} render={<Link href={loc("/icons/submit/")} />}>
          <RiUploadLine />{tr("Submit an icon", "提交图标")}
        </DropdownMenuItem>
        <DropdownMenuItem className={BAR_LG} render={<Link href={loc("/links/")} />}>
          <RiLinksLine />{tr("Partners", "合作伙伴")}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="lg:hidden" />
        <DropdownMenuItem className={BAR_LG} render={<a href={feedbackUrl(absolute(path))} target="_blank" rel="noreferrer" />} onClick={() => track("feedback_open")}>
          <RiFeedbackLine />{tr("Feedback", "反馈")}
        </DropdownMenuItem>
        <DropdownMenuItem className={BAR_LG} render={<a href={REPO} target="_blank" rel="noreferrer" />}>
          <RiGithubLine />GitHub
        </DropdownMenuItem>
        <DropdownMenuItem className={BAR_LG} render={<a href={AUTHOR.x} target="_blank" rel="noreferrer" />} onClick={() => track("author_x_open", { place: "header_menu" })}>
          <RiTwitterXLine />{tr("{name} on X", "{name} 的 X 主页", { name: AUTHOR.name })}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="lg:hidden" />
        <ThemeMenuItem className={BAR_LG} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
