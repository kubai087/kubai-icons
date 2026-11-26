import { SetsIndex, setsIndexMeta } from "@/learn/set-page";

export const metadata = setsIndexMeta("zh", "duotone");

export default function Page() {
  return <SetsIndex locale="zh" style="duotone" />;
}
