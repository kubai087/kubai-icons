import { SetsIndex, setsIndexMeta } from "@/learn/set-page";

export const metadata = setsIndexMeta("zh", "line");

export default function Page() {
  return <SetsIndex locale="zh" style="line" />;
}
