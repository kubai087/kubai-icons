"use client";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/kit/ui-icons";
import { Moon, Sun } from "kubai-icons-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTr } from "@/lib/use-locale";
import { cn } from "@/lib/utils";

function useThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const flip = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");
  const toggle = () => {
    // The theme changes at once; a cross-fade of the whole page only delays it.
    flip();
  };
  return toggle;
}

/** The theme switch as a row of a menu. It names the theme it switches to; CSS picks the
 * wording, so the first paint already matches the page's theme. */
export function ThemeMenuItem({ className }: { className?: string }) {
  const toggle = useThemeSwitch();
  const tr = useTr();
  return (
    <DropdownMenuItem className={className} onClick={toggle} closeOnClick={false}>
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
      <span className="dark:hidden">{tr("Switch to dark mode", "切换到深色模式")}</span>
      <span className="hidden dark:inline">{tr("Switch to light mode", "切换到浅色模式")}</span>
    </DropdownMenuItem>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const toggle = useThemeSwitch();
  const tr = useTr();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={tr("Toggle dark mode", "切换深色模式")}
      onClick={toggle}
      className={cn("text-muted-foreground hover:text-foreground", className)}
    >
      <Sun size={18} color="#F59E0B" trigger="parent" className="size-[18px] dark:hidden" />
      <Moon size={18} color="#818CF8" trigger="parent" className="hidden size-[18px] dark:block" />
    </Button>
  );
}
