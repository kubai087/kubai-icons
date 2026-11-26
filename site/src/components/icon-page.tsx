import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Container } from "@/components/kit/layout";
import { chip } from "@/components/kit/styles";
import { cn } from "@/lib/utils";
import { IntentLink } from "@/components/kit/intent-link";
import { IconLinks } from "@/components/browser/icon-links";
import { IconPageView } from "@/components/browser/icon-page-view";
import { allCategories, familyOf, iconByName, relatedTo, localNameOf, zhWords } from "@/lib/catalog";
import { localize, pick, type Locale } from "@/lib/i18n";
import { absolute, iconLabel, pageMeta, SITE_NAME } from "@/lib/seo";
import { REPO, reportIconUrl } from "@/lib/site";
import { localBadgeName, pascal } from "@/lib/icons";
import { collectionsWith } from "@/learn/collections";
import { Faq, type Qa } from "@/learn/faq";
import { Facts, PageSection, Tags } from "@/learn/ui";
import { MotionDemo } from "@/learn/motion-demo";
import motionEn from "@/learn/motion/en.json";
import motionZh from "@/learn/motion/zh.json";

/** An icon's name for readers in a language. */
const titleOf = (name: string, locale: Locale) => pick(locale, iconLabel(name), zhWords(name)[0] ?? iconLabel(name));

/** What the icon shows and how it moves on hover, if it has been written up. */
const motionOf = (name: string, locale: Locale): string | undefined =>
  pick<Record<string, string>>(locale, motionEn, motionZh)[name];

/** Questions a visitor or an assistant is likely to ask about one icon. */
function questionsFor(name: string, label: string, badged: string[], badgeNames: string[], locale: Locale): Qa[] {
  // Code names of the badged versions, such as folder-plus.
  const codes = badged.length ? familyOf(name).filter((i) => i.base).map((i) => i.name) : [];
  const P = pascal(name);
  if (locale === "zh") {
    return [
      { q: `如何在 React 中使用“${label}”图标？`, a: `安装 \`kubai-icons-react\`，然后写 \`import { ${P} } from "kubai-icons-react"\`，再渲染 \`<${P} />\`。Vue 中从 \`kubai-icons-vue\` 导入同名组件；纯 HTML 中使用 \`<kubai-icon name="${name}"></kubai-icon>\`。` },
      { q: `可以修改“${label}”图标的颜色和尺寸吗？`, a: `可以。通过 \`color\` 和 \`size\` 设置，或者用 CSS 的 \`color\` 属性控制；所有色调都由一个主色计算得出。也可以在本页选择颜色后下载 SVG 或 PNG。` },
      ...(badged.length ? [{ q: `“${label}”图标有带角标的版本吗？`, a: `有，共 ${badged.length} 个，角标包括${badgeNames.join("、")}。代码中的名称是在图标名后加角标名，例如 \`${codes[0]}\`。` }] : []),
      { q: `“${label}”图标可以免费商用吗？`, a: "可以。图标以 MIT 许可证发布，允许个人和商业使用、修改和再分发；再分发图标文件时请保留版权声明。" },
    ];
  }
  const lower = label.toLowerCase();
  return [
    { q: `How do I use the ${lower} icon in React?`, a: `Install \`kubai-icons-react\`, add \`import { ${P} } from "kubai-icons-react"\` and render \`<${P} />\`. In Vue, import the same name from \`kubai-icons-vue\`. In plain HTML, use \`<kubai-icon name="${name}"></kubai-icon>\`.` },
    { q: `Can I change the ${lower} icon's color and size?`, a: `Yes. Set \`color\` and \`size\`, or use the CSS \`color\` property; every shade is calculated from one accent color. You can also pick a color on this page and download the icon as SVG or PNG.` },
    ...(badged.length ? [{ q: `Does the ${lower} icon come with badges?`, a: `Yes, ${codes.length}: ${codes.join(", ")}.` }] : []),
    { q: `Is the ${lower} icon free for commercial use?`, a: "Yes. The icons are released under the MIT License, which permits personal and commercial use, modification and redistribution. Keep the copyright notice when you redistribute the icon files." },
  ];
}

export function iconPageMeta(name: string, locale: Locale): Metadata {
  const meta = iconByName(name);
  if (!meta) return {};
  const label = titleOf(name, locale);
  const path = localize(`/icons/${name}/`, locale);
  const motion = motionOf(name, locale);
  if (locale === "zh") {
    return pageMeta({ title: `${label}图标`, path, description: `开源的动态图标“${label}”（${name}）。${motion ?? "带悬停动效。"}提供 React、Vue 组件和 Web Component，也可下载为 SVG 或 PNG。` });
  }
  const tags = meta.tags.slice(0, 3).join(", ");
  return pageMeta({
    title: `${label} icon`,
    path,
    description: motion
      ? `Animated ${label.toLowerCase()} icon. ${motion} Copy it for React, Vue or HTML, or download it as SVG or PNG.`
      : `Animated ${label.toLowerCase()} icon${tags ? ` (${tags})` : ""} with hover motion. Copy it for React, Vue or HTML, or download it as SVG or PNG.`,
  });
}

/** One icon's page, in either language. */
export function IconPageBody({ name, locale }: { name: string; locale: Locale }) {
  const meta = iconByName(name);
  if (!meta) notFound();
  const label = titleOf(name, locale);
  const categories = allCategories();
  const category = categories.find((c) => c.id === meta.category);
  const categoryName = category ? pick(locale, category.en, category.zh ?? category.en) : undefined;
  const family = familyOf(name);
  const badged = family.filter((i) => i.base).map((i) => pick(locale, i.name, localNameOf(i, locale) ?? i.name));
  // What each badge shows, without repeating the icon's own name.
  const badgeNames = family.filter((i) => i.base).map((i) => localBadgeName(i, locale));
  const related = relatedTo(meta);
  const terms = pick(locale, meta.tags, zhWords(name));
  const motion = motionOf(name, locale);
  const sets = collectionsWith(name);
  return (
    <Container className="space-y-12 pt-8 pb-section">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ImageObject",
          name: pick(locale, "{label} icon", "{label}图标", { label }),
          contentUrl: absolute(`/icons/${name}/preview.svg`),
          encodingFormat: "image/svg+xml",
          creditText: SITE_NAME,
          creator: { "@type": "Person", name: "Kubai087", url: "https://github.com/kubai087" },
          license: `${REPO}/blob/master/LICENSE-ICONS`,
          acquireLicensePage: absolute(localize("/license/", locale)),
        }}
      />
      <Breadcrumbs
        trail={[
          { name: pick(locale, "Icons", "图标"), path: localize("/icons/", locale) },
          ...(category ? [{ name: categoryName!, path: localize(`/icons/category/${category.id}/`, locale) }] : []),
          { name: label, path: localize(`/icons/${name}/`, locale) },
        ]}
      />
      <div className="grid gap-x-8 gap-y-12 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
        <IconPageView meta={meta} related={family} categories={categories} heading={pick(locale, "{label} icon", "{label}图标", { label })} />
        {/* A card like the panel beside it, so the two line up at the top. */}
        <section aria-labelledby="about-icon" className="overflow-hidden rounded-panel border">
          <h2 id="about-icon" className="border-b px-4 py-3 font-heading text-subheading font-semibold">{pick(locale, "About this icon", "关于此图标")}</h2>
          <Facts
            bare
            stackAtXl
            rows={[
              ...(motion ? [{ label: pick(locale, "Hover motion", "悬停动效"), value: <MotionDemo meta={meta} text={motion} /> }] : []),
              ...(category ? [{ label: pick(locale, "Category", "分类"), value: <IntentLink href={localize(`/icons/category/${category.id}/`, locale)} className="underline underline-offset-4 hover:text-foreground">{categoryName}</IntentLink> }] : []),
              ...(badgeNames.length ? [{
                label: pick(locale, "Badged versions ({count})", "带角标的版本（{count} 个）", { count: badgeNames.length }),
                value: <Tags items={badgeNames} />,
              }] : []),
              ...(sets.length ? [{
                label: pick(locale, "In icon sets", "所属合集"),
                value: (
                  <ul className="flex flex-wrap gap-1.5">
                    {sets.map((c) => (
                      <li key={c.id}><IntentLink href={localize(`/icons/sets/${c.id}/`, locale)} className={cn(chip(), "border")}>{pick(locale, c.title, c.zhTitle)}</IntentLink></li>
                    ))}
                  </ul>
                ),
              }] : []),
              ...(terms.length ? [{ label: pick(locale, "Search words", "相关词"), value: <Tags items={terms} /> }] : []),
            ]}
          />
          <p className="border-t px-4 py-3 text-control text-muted-foreground"><a href={reportIconUrl(name)} target="_blank" rel="noreferrer" className="underline underline-offset-4 transition-colors hover:text-foreground">{pick(locale, "Report a problem with this icon", "报告此图标的问题")}</a></p>
        </section>
      </div>
      {related.length > 0 && (
        <PageSection title={pick(locale, "Related icons", "相关图标")}>
          <IconLinks icons={related} locale={locale} />
        </PageSection>
      )}
      <Faq grid heading={pick(locale, "Questions", "常见问题")} items={questionsFor(name, label, badged, badgeNames, locale)} />
    </Container>
  );
}
