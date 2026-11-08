"use client";
import { useEffect, useRef, useState } from "react";
import { STORY, useHeroBeat } from "@/components/hero-wall";
import { cn } from "@/lib/utils";
import { useTr } from "@/lib/use-locale";
import { HERO_TITLE_ZH } from "@/components/hero-title-zh";

const LINES = ["Folders open.", "Bells ring.", "Locks unlock."];
// One sentence, with each icon between the two halves of its phrase.
const LINES_ZH = ["让文件夹|打开，", "铃铛|摇响，", "锁|弹开"];

/** A Chinese phrase drawn as outlines. Its text stays for search engines and screen readers. */
function OutlinedPhrase({ text }: { text: string }) {
  const { width, d } = HERO_TITLE_ZH[text];
  return (
    <>
      <span className="sr-only">{text}</span>
      <svg aria-hidden viewBox={`0 0 ${width} 1000`} className="my-[.125em] h-[1em] w-auto shrink-0 fill-current">
        <path d={d} />
      </svg>
    </>
  );
}

/** The headline: each line lights up and plays its icon, in step with the icon wall. */
export function HeroHeadline({ className }: { className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  const beat = useHeroBeat(visible);
  const lines = useTr()(LINES, LINES_ZH);

  return (
    <h1 ref={ref} className={cn(className, lines === LINES_ZH && "flex flex-wrap")}>
      {lines.map((line, i) => {
        const { Icon, color } = STORY[i];
        const [before, after] = line.split("|");
        return (
          <span key={line}>
            <span className={cn("flex items-center gap-[.2em] whitespace-nowrap transition-colors duration-300 motion-reduce:transition-none", beat !== null && beat !== i && "text-muted-foreground/70")}>
              {after === undefined ? before : <OutlinedPhrase text={before} />}
              <Icon size={48} color={color} trigger="none" hover={beat === i} className="size-[.8em] shrink-0" />
              {after === undefined ? null : <OutlinedPhrase text={after} />}
            </span>{after ? null : " "}
          </span>
        );
      })}
    </h1>
  );
}
