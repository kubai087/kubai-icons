"use client";
// The pause switch for the looping icon walls. One choice holds for every wall on the site
// for the visit. With reduced motion the walls never loop, so the switch is hidden.
import { PauseIcon, PlayIcon } from "@/components/kit/ui-icons";
import { Button } from "@/components/ui/button";
import { setWallsPaused, useWallsPaused } from "@/lib/wall-motion";
import { useTr } from "@/lib/use-locale";
import { cn } from "@/lib/utils";

export function WallPause({ className }: { className?: string }) {
  const tr = useTr();
  const paused = useWallsPaused();
  const label = tr("Pause animations", "暂停动画");
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-pressed={paused}
      aria-label={label}
      title={label}
      onClick={() => setWallsPaused(!paused)}
      className={cn("text-muted-foreground hover:text-foreground aria-pressed:bg-muted aria-pressed:text-foreground motion-reduce:hidden pointer-coarse:size-9", className)}
    >
      {paused ? <PlayIcon aria-hidden /> : <PauseIcon aria-hidden />}
    </Button>
  );
}
