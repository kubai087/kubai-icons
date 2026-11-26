import { SetsIndex, setsIndexMeta } from "@/learn/set-page";

export const metadata = setsIndexMeta("en", "duotone");

export default function Page() {
  return <SetsIndex locale="en" style="duotone" />;
}
