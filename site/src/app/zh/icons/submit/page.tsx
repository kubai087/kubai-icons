import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container, Heading } from "@/components/kit/layout";
import { SubmitForm } from "@/components/submit-form";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "提交图标",
  path: "/zh/icons/submit/",
  description: "提交使用 Kubai Icons Skill 或手工绘制的图标。收录后加入开源图标库并署名。",
});

export default function SubmitPage() {
  return (
    <Container className="max-w-4xl space-y-8 pt-8 pb-section">
      <Breadcrumbs trail={[{ name: "图标", path: "/zh/icons/" }, { name: "提交", path: "/zh/icons/submit/" }]} />
      <Heading level={1} title="提交图标" lead="提交使用 Skill 或手工绘制的图标" />
      <SubmitForm />
    </Container>
  );
}
