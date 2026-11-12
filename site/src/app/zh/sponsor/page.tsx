import { Heading, NarrowPage } from "@/components/kit/layout";
import { pageMeta } from "@/lib/seo";
import { asset, AUTHOR } from "@/lib/site";

export const metadata = pageMeta({ title: "赞助", path: "/zh/sponsor/", description: "通过支付宝或微信支付，支持免费开源图标库 Kubai Icons 的开发。" });

const METHODS = [
  { name: "支付宝", src: "/sponsor/alipay.png" },
  { name: "微信支付", src: "/sponsor/wechat.png" },
];

export default function Page() {
  return (
    <NarrowPage>
      <Heading level={1} title="赞助 Kubai Icons" />
      <div className="grid gap-4 sm:grid-cols-2">
        {METHODS.map((m) => (
          <figure key={m.name} className="space-y-3 rounded-card border p-5">
            <div className="mx-auto w-full max-w-56 overflow-hidden rounded-lg bg-white">
              <img src={asset(m.src)} alt={`${m.name}收款二维码`} width={448} height={448} className="block h-auto w-full" />
            </div>
            <figcaption className="text-center font-medium">{m.name}</figcaption>
          </figure>
        ))}
      </div>
      <section id="slot" className="scroll-mt-(--header) space-y-4 pt-4">
        <Heading title="赞助位" lead="同一时间只展示一个产品，位置在 GitHub README、本站首页和页脚，内容为产品图标、名称和一句介绍，并标注为赞助。每月 150 美元。" />
        <a href={AUTHOR.x} target="_blank" rel="noreferrer" className="inline-block font-medium underline underline-offset-4">在 X 上联系我</a>
      </section>
    </NarrowPage>
  );
}
