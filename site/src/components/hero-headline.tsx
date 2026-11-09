"use client";
import { useEffect, useRef, useState } from "react";
import { STORY, useHeroBeat } from "@/components/hero-wall";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/use-locale";
import { HERO_TITLE_ZH } from "@/components/hero-title-zh";

/**
 * The headline as each language would say it: the words before and after the playing icon.
 */
const SLOGANS: Record<Locale, readonly [string, string]> = {
  en: ["Every icon", "knows its move"],
  zh: ["让图标", "动起来"],
  "zh-hant": ["讓圖示", "動起來"],
  ja: ["アイコンに", "命を"],
  ko: ["아이콘에", "생동감을"],
  es: ["Iconos que", "cobran vida"],
  pt: ["Ícones que", "ganham vida"],
  fr: ["Des icônes qui", "prennent vie"],
  de: ["Icons, die", "lebendig werden"],
  it: ["Icone che", "prendono vita"],
  ru: ["Иконки", "оживают"],
  tr: ["Simgeler", "canlanıyor"],
  ar: ["أيقونات", "تنبض بالحياة"],
  hi: ["आइकन जो", "जीवंत हो उठें"],
  id: ["Ikon yang", "terasa hidup"],
  vi: ["Thổi hồn", "vào biểu tượng"],
};
/** Short enough to sit on one line, as the Chinese headline does. */
const ONE_LINE = new Set<Locale>(["zh", "zh-hant", "ja", "ko"]);

/** Scripts whose marks reach above and below the line need more room between lines. */
const TALL_SCRIPTS = new Set<Locale>(["ar", "hi"]);

/** A Chinese phrase drawn as outlines. Its text stays for search engines and screen readers. */
function OutlinedPhrase({ text }: { text: string }) {
  const outline = HERO_TITLE_ZH[text];
  // Text with no outlines yet still shows, in the page's normal font.
  if (!outline) return text;
  const { width, d } = outline;
  return (
    <>
      <span className="sr-only">{text}</span>
      <svg aria-hidden viewBox={`0 0 ${width} 1000`} className="my-[.125em] h-[1em] w-auto shrink-0 fill-current">
        <path d={d} />
      </svg>
    </>
  );
}

/** The headline, with the icons of the wall's story playing inside it. */
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
  const locale = useLocale();
  const [before, after] = SLOGANS[locale];
  const slot = (
      /* The icons of the wall's story take turns here, each playing as its beat comes. */
      <span aria-hidden className="grid size-[1em] shrink-0 *:[grid-area:1/1]">
        {STORY.map(({ Icon, color }, i) => (
          <Icon key={i} size={48} color={color} trigger="none" hover={beat === i} className={cn("size-full transition-opacity duration-300 motion-reduce:transition-none", (beat ?? 0) !== i && "opacity-0")} />
        ))}
      </span>
  );
  if (ONE_LINE.has(locale)) {
    return (
      <h1 ref={ref} className={cn(className, "flex items-center whitespace-nowrap", locale === "ko" ? "gap-[.2em]" : "gap-[.06em]")}>
        <OutlinedPhrase text={before} />
        {slot}
        <OutlinedPhrase text={after} />
      </h1>
    );
  }
  const longest = Math.max(before.length + 2, after.length);
  return (
    <h1 ref={ref} className={cn(className, TALL_SCRIPTS.has(locale) && "leading-[1.35]", "[&>span]:[font-size:min(1em,calc(15em/var(--longest)))] lg:[&>span]:[font-size:min(1em,calc(17em/var(--longest)))]")} style={{ "--longest": longest } as React.CSSProperties}>
      <span className="flex items-center gap-[.24em]">{before}{slot}</span>{" "}
      <span className="block">{after}</span>
    </h1>
  );
}
