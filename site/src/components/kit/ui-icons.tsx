"use client";
// The site's interface icons, all from our own line set. Icons on controls that do something
// (copy, download, save, switch theme …) move when the control around them is hovered; the rest
// (chevrons, checks, close buttons, status marks) are still, and carry no motion runtime. Size them
// with a size-* class like any other svg; they draw in the surrounding text colour.
import { forwardRef, useId, useMemo, type SVGProps } from "react";
import type { KubaiIconData } from "kubai-icons";
import { lineIconMarkup } from "kubai-icons/runtime";
import type { KubaiIconComponent, KubaiIconProps } from "kubai-icons-react";
// Still icons: the data alone.
import arrowLeft from "kubai-icons/line/icons/arrow-left";
import check from "kubai-icons/line/icons/check";
import chevronDown from "kubai-icons/line/icons/chevron-down";
import chevronRight from "kubai-icons/line/icons/chevron-right";
import chevronUp from "kubai-icons/line/icons/chevron-up";
import circle from "kubai-icons/line/icons/circle";
import circleAlert from "kubai-icons/line/icons/circle-alert";
import circleCheck from "kubai-icons/line/icons/circle-check";
import circleX from "kubai-icons/line/icons/circle-x";
import fileCode from "kubai-icons/line/icons/file-code";
import info from "kubai-icons/line/icons/info";
import loaderCircle from "kubai-icons/line/icons/loader-circle";
import play from "kubai-icons/line/icons/play";
import search from "kubai-icons/line/icons/search";
import triangleAlert from "kubai-icons/line/icons/triangle-alert";
import x from "kubai-icons/line/icons/x";
// Moving icons: the React components, with their hover motion.
import Bookmark from "kubai-icons-react/line/icons/bookmark";
import Copy from "kubai-icons-react/line/icons/copy";
import Download from "kubai-icons-react/line/icons/download";
import ExternalLink from "kubai-icons-react/line/icons/external-link";
import Languages from "kubai-icons-react/line/icons/languages";
import Link from "kubai-icons-react/line/icons/link";
import Link2 from "kubai-icons-react/line/icons/link-2";
import MessageSquareText from "kubai-icons-react/line/icons/message-square-text";
import MoonLine from "kubai-icons-react/line/icons/moon";
import MoreHorizontal from "kubai-icons-react/line/icons/more-horizontal";
import Pause from "kubai-icons-react/line/icons/pause";
import Play from "kubai-icons-react/line/icons/play";
import Plus from "kubai-icons-react/line/icons/plus";
import SunLine from "kubai-icons-react/line/icons/sun";
import Upload from "kubai-icons-react/line/icons/upload";

type Variant = "outline" | "fill";
export type UiIconProps = Omit<SVGProps<SVGSVGElement>, "ref" | "color"> & { size?: number | string; strokeWidth?: number; title?: string };

/** A still line icon: its markup and nothing else. */
function still(icon: KubaiIconData, name: string, variant?: Variant) {
  const C = forwardRef<SVGSVGElement, UiIconProps>(({ size = 24, strokeWidth, title, className, ...rest }, ref) => {
    // Masks in the markup need an id of their own on the page.
    const id = "k" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const inner = useMemo(() => ({ __html: (title ? `<title>${title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</title>` : "") + lineIconMarkup(icon, { strokeWidth, variant }).replace(/__K__/g, id) }), [strokeWidth, title, id]);
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={icon.viewBox}
        width={size}
        height={size}
        fill="none"
        overflow="visible"
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        className={["kubai-icon kubai-line", `kubai-icon-${icon.name}`, className].filter(Boolean).join(" ")}
        dangerouslySetInnerHTML={inner}
        {...rest}
      />
    );
  });
  C.displayName = name;
  return C;
}

/** A line icon that plays its motion when the control around it is hovered. */
function moving(Icon: KubaiIconComponent, name: string, variant?: Variant) {
  const C = forwardRef<SVGSVGElement, UiIconProps & Pick<KubaiIconProps, "hover">>((props, ref) => <Icon ref={ref} trigger="parent" variant={variant} {...props} />);
  C.displayName = name;
  return C;
}

export const ArrowLeftIcon = still(arrowLeft, "ArrowLeftIcon");
export const CheckIcon = still(check, "CheckIcon");
export const ChevronDownIcon = still(chevronDown, "ChevronDownIcon");
export const ChevronRightIcon = still(chevronRight, "ChevronRightIcon");
export const ChevronUpIcon = still(chevronUp, "ChevronUpIcon");
export const CircleIcon = still(circle, "CircleIcon");
export const CircleAlertIcon = still(circleAlert, "CircleAlertIcon");
export const CircleCheckIcon = still(circleCheck, "CircleCheckIcon");
export const CircleCheckFillIcon = still(circleCheck, "CircleCheckFillIcon", "fill");
export const CircleXIcon = still(circleX, "CircleXIcon");
export const FileCodeIcon = still(fileCode, "FileCodeIcon");
export const InfoIcon = still(info, "InfoIcon");
export const LoaderIcon = still(loaderCircle, "LoaderIcon");
export const PlayFillIcon = still(play, "PlayFillIcon", "fill");
export const SearchIcon = still(search, "SearchIcon");
export const TriangleAlertIcon = still(triangleAlert, "TriangleAlertIcon");
export const XIcon = still(x, "XIcon");

export const BookmarkIcon = moving(Bookmark, "BookmarkIcon");
export const BookmarkFillIcon = moving(Bookmark, "BookmarkFillIcon", "fill");
export const CopyIcon = moving(Copy, "CopyIcon");
export const DownloadIcon = moving(Download, "DownloadIcon");
export const ExternalLinkIcon = moving(ExternalLink, "ExternalLinkIcon");
export const LanguagesIcon = moving(Languages, "LanguagesIcon");
export const LinkIcon = moving(Link, "LinkIcon");
export const Link2Icon = moving(Link2, "Link2Icon");
export const MessageIcon = moving(MessageSquareText, "MessageIcon");
export const MoreIcon = moving(MoreHorizontal, "MoreIcon");
export const PauseIcon = moving(Pause, "PauseIcon");
export const PlayIcon = moving(Play, "PlayIcon");
export const PlusIcon = moving(Plus, "PlusIcon");
export const MoonIcon = moving(MoonLine, "MoonIcon");
export const SunIcon = moving(SunLine, "SunIcon");
export const UploadIcon = moving(Upload, "UploadIcon");

// Brand marks are drawn as their owners publish them, not redrawn in our line style.
type MarkProps = Omit<SVGProps<SVGSVGElement>, "ref">;

/** The GitHub mark. */
export function GithubIcon({ className, ...props }: MarkProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} fill="currentColor" aria-hidden className={className} {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

/** The X (formerly Twitter) logo. */
export function XBrandIcon({ className, ...props }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden className={className} {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}
