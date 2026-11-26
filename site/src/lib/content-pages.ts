// The English documentation pages that other languages are built from.
import * as page0 from "@/app/(content)/docs/accessibility/page";
import * as page1 from "@/app/(content)/docs/analytics/page";
import * as page2 from "@/app/(content)/docs/contributing/page";
import * as page3 from "@/app/(content)/docs/customize/page";
import * as page4 from "@/app/(content)/docs/design/page";
import * as page5 from "@/app/(content)/docs/javascript/page";
import * as page6 from "@/app/(content)/docs/page";
import * as page7 from "@/app/(content)/docs/performance/page";
import * as page8 from "@/app/(content)/docs/react/page";
import * as page9 from "@/app/(content)/docs/static/page";
import * as page10 from "@/app/(content)/docs/vue/page";
import * as page11 from "@/app/(content)/license/page";
import * as page12 from "@/app/(content)/skill/page";
import * as guide0 from "@/app/(content)/docs/guides/nextjs/page";
import * as guide1 from "@/app/(content)/docs/guides/button-hover/page";
import * as guide2 from "@/app/(content)/docs/guides/tailwind/page";
import * as guide3 from "@/app/(content)/docs/guides/shadcn-ui/page";
import * as guide4 from "@/app/(content)/docs/guides/nuxt/page";
import * as guide5 from "@/app/(content)/docs/guides/no-build/page";
import * as guide6 from "@/app/(content)/docs/guides/colors-dark-mode/page";
import * as guide7 from "@/app/(content)/docs/guides/figma/page";
import * as guide8 from "@/app/(content)/docs/guides/duotone/page";
import * as guide9 from "@/app/(content)/docs/guides/line/page";
import * as compare0 from "@/app/(content)/docs/compare/lucide/page";
import * as compare1 from "@/app/(content)/docs/compare/heroicons/page";
import * as compare2 from "@/app/(content)/docs/compare/phosphor/page";
import * as compare3 from "@/app/(content)/docs/compare/tabler/page";
import * as compare4 from "@/app/(content)/docs/compare/hugeicons/page";
import * as compare5 from "@/app/(content)/docs/compare/material-symbols/page";
import * as compare6 from "@/app/(content)/docs/compare/font-awesome/page";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { Locale } from "./i18n";

export const CONTENT_PAGES: Record<string, { default: (props?: { locale?: Locale }) => ReactNode; metadata: Metadata }> = {
  "docs/accessibility": page0,
  "docs/analytics": page1,
  "docs/contributing": page2,
  "docs/customize": page3,
  "docs/design": page4,
  "docs/javascript": page5,
  "docs": page6,
  "docs/performance": page7,
  "docs/react": page8,
  "docs/static": page9,
  "docs/vue": page10,
  "license": page11,
  "skill": page12,
  "docs/guides/nextjs": guide0,
  "docs/guides/button-hover": guide1,
  "docs/guides/tailwind": guide2,
  "docs/guides/shadcn-ui": guide3,
  "docs/guides/nuxt": guide4,
  "docs/guides/no-build": guide5,
  "docs/guides/colors-dark-mode": guide6,
  "docs/guides/figma": guide7,
  "docs/guides/duotone": guide8,
  "docs/guides/line": guide9,
  "docs/compare/lucide": compare0,
  "docs/compare/heroicons": compare1,
  "docs/compare/phosphor": compare2,
  "docs/compare/tabler": compare3,
  "docs/compare/hugeicons": compare4,
  "docs/compare/material-symbols": compare5,
  "docs/compare/font-awesome": compare6,
};
