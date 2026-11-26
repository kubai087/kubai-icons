import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Prose, Title, Code } from "@/components/docs/prose";
import type { Locale } from "@/lib/i18n";
import { installSkillPrompt, REPO } from "@/lib/site";

export const metadata = pageMeta({ title: "Agent skill for drawing icons", path: "/skill/", description: "An agent skill that draws new icons in the styles of the Kubai Icons library, layered and animated, solid two-tone or line, in Claude Code, Codex and other coding agents." });

export default function Page({ locale = "en" }: { locale?: Locale } = {}) {
  return (
    <Prose>
      <Title lead={"Draws new icons in the style of the library. Works with Claude Code, Codex and other coding agents."}>
        Kubai Icons skill
      </Title>
      <div className="my-5 space-y-5">
          <h2>Overview</h2>
          <p>The skill reads a product&apos;s code or feature list, assigns an everyday object and a hover action to each feature, and draws the icons. Each icon is checked at 24 and 28 pixels against a written specification that covers canvas, layers, outlines, light, color, marks and motion.</p>
          <h2>Three styles</h2>
          <p>The skill draws in three styles. Layered icons have back and front pieces, outside outlines and the hover motion the object itself would make. Two-tone icons are solid shapes on a 16 grid, with a light body and accents in your brand color, for interface icons at 16 to 48 pixels. Line icons are rounded strokes on a 24 grid, with a stroke width that follows your text from 0.5 to 3 and four variants from one drawing, for icons that sit next to text. Tell the agent which style you want; it asks when it can&apos;t tell.</p>
          <p>The <Link href="/docs/guides/duotone/">two-tone icons</Link> and the <Link href="/docs/guides/line/">line icons</Link> in the library were drawn with it, and the icon browser shows them under <Link href="/icons/?style=duotone">Two-tone</Link> and <Link href="/icons/?style=line">Line</Link>.</p>
          <h2>Install</h2>
          <p>The skill is a folder of instructions and scripts, so any coding agent that can read files and run commands can use it, including <a href="https://claude.com/claude-code">Claude Code</a> and <a href="https://developers.openai.com/codex">Codex</a>. We recommend Claude, which the skill was developed and tested with. Its self-check also needs Node 18 or later and Chrome.</p>
          <p>Paste the following into your agent:</p>
        </div>
      <Code code={installSkillPrompt(locale)} />
      <div className="my-5 space-y-5">
          <p>This installs all three styles. For the two-tone or the line style on its own, download <code>kubai-duotone</code> or <code>kubai-line</code> from the <a href={`${REPO}/releases/tag/v2.1.0`}>latest release</a> and unzip it into the same skills folder.</p>
          <h2>Use</h2>
          <p>Once the skill is installed, ask your agent to draw icons for your project, for example: &quot;Use the Kubai Icons skill to draw icons for the features in this repository.&quot; An agent without skill support can read <code>SKILL.md</code> from the cloned folder and follow it.</p>
          <h2>Share your icons</h2>
          <p>Icons you draw can join the library. <Link href="/icons/submit/">Submit an icon</Link> and it will be reviewed against the design rules; accepted icons are published under the MIT License, credited to you.</p>
          <h2>License</h2>
          <p>The skill is source-available under the <Link href="/license/">Kubai Icons License</Link>. Icons drawn with it belong to their author.</p>
        </div>
    </Prose>
  );
}
