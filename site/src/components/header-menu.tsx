"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible } from "@base-ui/react/collapsible";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { ChevronDownIcon, ExternalLinkIcon, GithubIcon, LanguagesIcon, MessageIcon, MoreIcon, UploadIcon, Link2Icon, XBrandIcon, XIcon } from "@/components/kit/ui-icons";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { track } from "@/lib/analytics";
import { absolute } from "@/lib/seo";
import { AUTHOR, feedbackUrl, REPO } from "@/lib/site";
import { LanguageItems, useLanguages } from "./language-switch";
import { ThemeMenuItem } from "./theme-toggle";
import { useResetAcrossLg } from "@/lib/use-reset-across-lg";
import { useLocalize, useTr } from "@/lib/use-locale";
import { cn } from "@/lib/utils";

/** Each row is a full-size touch target. */
const ITEM = "min-h-11 gap-2.5 rounded-lg px-3";
/** Marks a link that leaves the site. */
const Away = () => <ExternalLinkIcon className="ms-auto size-3.5 text-muted-foreground" />;

const header = () => document.querySelector("[data-site-header]");

/**
 * Where the bar is too narrow, its secondary links and the language list share one menu:
 * a rounded panel under the header with one row per item. The languages fold into a single
 * row showing the current one, and open in place below it.
 */
export function HeaderMenu({ className }: { className?: string }) {
  return <HeaderMenuPanel key={useResetAcrossLg()} className={className} />;
}

function HeaderMenuPanel({ className }: { className?: string }) {
  const path = usePathname() ?? "/";
  const tr = useTr();
  const loc = useLocalize();
  const { current, links } = useLanguages();
  const [languagesOpen, setLanguagesOpen] = useState(false);
  return (
    <DropdownMenu onOpenChangeComplete={(open) => !open && setLanguagesOpen(false)}>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label={tr("Menu", "菜单")} className={cn("group", className)} />}>
        <MoreIcon className="size-[18px] text-muted-foreground group-data-popup-open:hidden" />
        <XIcon className="hidden size-[18px] text-muted-foreground group-data-popup-open:block" />
      </DropdownMenuTrigger>
      <MenuPrimitive.Portal>
        {/* Dims the page under the panel; the header stays as it is, so its button can close the menu. */}
        <MenuPrimitive.Backdrop className="fixed inset-x-0 top-(--header) bottom-0 z-40 bg-black/10 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:bg-black/40" />
        <MenuPrimitive.Positioner anchor={header} side="bottom" align="end" sideOffset={6} collisionPadding={0} className="isolate z-50 outline-none">
          <MenuPrimitive.Popup
            data-slot="dropdown-menu-content"
            className={cn(
              "mx-2 max-h-[calc(var(--available-height)-0.5rem)] w-[calc(var(--anchor-width)-1rem)] origin-top overflow-y-auto overscroll-contain rounded-2xl bg-popover p-2 text-popover-foreground shadow-xl ring-1 ring-foreground/10 outline-none sm:w-80",
              // Drops in from just under the header and leaves the same way.
              "transition-[opacity,translate,scale] duration-200 ease-out data-ending-style:-translate-y-2 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:-translate-y-2 data-starting-style:scale-[0.98] data-starting-style:opacity-0",
            )}
          >
            <DropdownMenuItem className={ITEM} render={<Link href={loc("/icons/submit/")} />}>
              <UploadIcon />{tr("Submit an icon", "提交图标")}
            </DropdownMenuItem>
            <DropdownMenuItem className={ITEM} render={<a href={feedbackUrl(absolute(path))} target="_blank" rel="noreferrer" />} onClick={() => track("feedback_open")}>
              <MessageIcon />{tr("Feedback", "反馈")}<Away />
            </DropdownMenuItem>
            <DropdownMenuItem className={ITEM} render={<a href={REPO} target="_blank" rel="noreferrer" />}>
              <GithubIcon />GitHub<Away />
            </DropdownMenuItem>
            <DropdownMenuItem className={ITEM} render={<a href={AUTHOR.x} target="_blank" rel="noreferrer" />} onClick={() => track("author_x_open", { place: "header_menu" })}>
              <XBrandIcon />{tr("{name} on X", "{name} 的 X 主页", { name: AUTHOR.name })}<Away />
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-1 my-1.5" />
            <ThemeMenuItem className={ITEM} />
            <Collapsible.Root open={languagesOpen} onOpenChange={setLanguagesOpen}>
              {/* The list opens downward and the rows above stay where they are; the panel scrolls once it is full. */}
              <DropdownMenuItem className={ITEM} closeOnClick={false} aria-expanded={languagesOpen} onClick={() => setLanguagesOpen((o) => !o)}>
                <LanguagesIcon />{tr("Language", "语言")}
                <span className="ms-auto text-muted-foreground">{current}</span>
                <ChevronDownIcon className={cn("text-muted-foreground transition-transform duration-200", languagesOpen && "rotate-180")} />
              </DropdownMenuItem>
              <Collapsible.Panel className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
                <LanguageItems links={links} className="min-h-10 rounded-lg ps-9.5 pe-3" marked />
              </Collapsible.Panel>
            </Collapsible.Root>
            <DropdownMenuSeparator className="mx-1 my-1.5" />
            <DropdownMenuItem className={ITEM} render={<Link href={loc("/links/")} />}>
              <Link2Icon />{tr("Partners", "合作伙伴")}
            </DropdownMenuItem>
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </DropdownMenu>
  );
}
