import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FolderFriend = { slug: string; name: string; site: string; host: string; image: string };

/**
 * One accent per folder. Every other colour comes from it the way the icons recolour: a
 * darker back, a paler front, a darker band along each bottom edge.
 */
const ACCENTS = ["#5393FF", "#8B7CFF", "#FF7AB6", "#FF9D4D", "#2FBF8A", "#25B4D6", "#F2B33D", "#FF6B6B", "#6F86FF"];

const tones = (accent: string) =>
  ({
    "--a": accent,
    "--lo-top": `color-mix(in oklab, ${accent} 62%, white)`,
    "--lo-bot": `color-mix(in oklab, ${accent} 74%, white)`,
    "--lo-band": `color-mix(in oklab, ${accent} 86%, black)`,
    "--up-top": `color-mix(in oklab, ${accent} 26%, white)`,
    "--up-bot": `color-mix(in oklab, ${accent} 42%, white)`,
    "--up-band": `color-mix(in oklab, ${accent} 64%, white)`,
    "--shade": `color-mix(in oklab, ${accent} 28%, transparent)`,
  }) as CSSProperties;

// The folder icon's own outline, in its 32-unit grid: a back with a tab and a front panel.
const VIEW = "3 1 25 23";
const BACK = "M4 4.2Q4 2 6.2 2L9.8 2Q11.2 2 12.19 2.99L13.21 4.01Q14.2 5 15.6 5L24.8 5Q27 5 27 7.2L27 20.8Q27 23 24.8 23L6.2 23Q4 23 4 20.8Z";
const FRONT = "M4 7.2Q4 5 6.2 5L24.8 5Q27 5 27 7.2L27 20.8Q27 23 24.8 23L6.2 23Q4 23 4 20.8Z";

const stop = (offset: number, color: string) => <stop offset={offset} style={{ stopColor: `var(${color})` }} />;
const layer = "absolute inset-0 size-full overflow-visible";
const ease = "duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none";
/** Open on hover and keyboard focus, and always on touch screens, where nothing hovers. */
const open = "group-hover:[--open:1] group-focus-visible:[--open:1] pointer-coarse:[--open:1]";

/** A folder in the icon set's style, holding whatever sits between its back and front. */
function Folder({ id, dashed, children }: { id: string; dashed?: boolean; children?: ReactNode }) {
  return (
    <div className={cn("relative aspect-[25/23] [--open:0] [perspective:900px]", open)}>
      <svg viewBox={VIEW} className={cn(layer, !dashed && "drop-shadow-[0_10px_14px_var(--shade)]")} aria-hidden>
        <defs>
          <linearGradient id={`${id}-lo`} x1="0" y1="0" x2="0" y2="1">
            {stop(0, "--lo-top")}
            {stop(0.95, "--lo-bot")}
            {stop(0.95, "--lo-band")}
            {stop(1, "--lo-band")}
          </linearGradient>
        </defs>
        <path
          d={BACK}
          fill={dashed ? "none" : `url(#${id}-lo)`}
          stroke={dashed ? "currentColor" : "var(--a)"}
          strokeWidth={2}
          strokeDasharray={dashed ? "5 5" : undefined}
          vectorEffect="non-scaling-stroke"
          className={cn(dashed && "text-border")}
        />
      </svg>
      {children}
      <svg
        viewBox={VIEW}
        className={cn(layer, "origin-[50%_95.6%] transition-transform will-change-transform", ease)}
        style={{ transform: "rotateX(calc(var(--open) * -38deg)) translateY(calc(var(--open) * 2%))" }}
        aria-hidden
      >
        <defs>
          <linearGradient id={`${id}-up`} x1="0" y1="0" x2="0" y2="1">
            {stop(0, "--up-top")}
            {stop(0.94, "--up-bot")}
            {stop(0.94, "--up-band")}
            {stop(1, "--up-band")}
          </linearGradient>
        </defs>
        <path
          d={FRONT}
          fill={dashed ? undefined : `url(#${id}-up)`}
          stroke={dashed ? "currentColor" : "var(--a)"}
          strokeWidth={2}
          strokeDasharray={dashed ? "5 5" : undefined}
          vectorEffect="non-scaling-stroke"
          className={cn(dashed && "fill-background text-border")}
        />
        {!dashed && <path d="M6.4 5.9H24.6" stroke="white" strokeOpacity={0.7} strokeWidth={1.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" />}
        {dashed && <path d="M15.5 11V17M12.5 14H18.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" className="text-muted-foreground" />}
      </svg>
    </div>
  );
}

/**
 * Friends' sites as folders in the icon set's style, each holding its share image like the
 * folder icon holds a sheet of paper. Hovering opens the folder and lifts the page out.
 * Pure CSS; the last folder is an empty one that asks for a link exchange.
 */
export function FriendFolders({ friends, invite }: { friends: FolderFriend[]; invite: { title: string; action: string; href: string } }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-12 pt-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-10 xl:grid-cols-5">
      {friends.map((f, i) => (
        <li key={f.slug}>
          <a href={f.site} target="_blank" rel="noopener" className="group block space-y-3 outline-none" style={tones(ACCENTS[i % ACCENTS.length])}>
            <Folder id={`folder-${f.slug}`}>
              <div
                className={cn("absolute top-[7%] left-[8%] w-[84%] overflow-hidden rounded-[6%/11%] bg-white shadow-[0_2px_8px_rgb(0_0_0/0.12)] transition-transform", ease)}
                style={{ aspectRatio: "1200 / 630", transform: "translateY(calc(var(--open) * -42%)) scale(calc(1 + var(--open) * 0.04))" }}
              >
                <img src={f.image} alt="" width={1200} height={630} loading="lazy" decoding="async" className="block size-full object-cover" />
              </div>
            </Folder>
            <div className="text-center">
              <p className="truncate text-control font-medium group-focus-visible:underline">{f.name}</p>
              <p className="truncate text-caption text-muted-foreground">{f.host}</p>
            </div>
          </a>
        </li>
      ))}
      <li>
        <a href={invite.href} target="_blank" rel="noreferrer" className="group block space-y-3 outline-none">
          <Folder id="folder-invite" dashed />
          <div className="text-center">
            <p className="truncate text-control font-medium group-focus-visible:underline">{invite.title}</p>
            <p className="truncate text-caption text-muted-foreground">{invite.action}</p>
          </div>
        </a>
      </li>
    </ul>
  );
}
