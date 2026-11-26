import type { Metadata } from "next";
import { SetPageBody, setMeta, setParams } from "@/learn/set-page";

export const dynamicParams = false;
export const generateStaticParams = () => setParams("duotone");

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return setMeta((await params).id, "en", "duotone");
}

export default async function Page({ params }: Props) {
  return <SetPageBody id={(await params).id} locale="en" style="duotone" />;
}
