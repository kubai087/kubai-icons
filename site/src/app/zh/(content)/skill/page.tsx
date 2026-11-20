import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Prose, Title, Code } from "@/components/docs/prose";
import { REPO } from "@/lib/site";

export const metadata = pageMeta({ title: "绘制图标的智能体 Skill", path: "/zh/skill/", description: "一个智能体 Skill，可在 Claude Code、Codex 和其他编程智能体中，按 Kubai Icons 图标库的风格绘制新图标：分层动态图标，或实心双色图标。" });

export default function Page() {
  return (
    <Prose>
      <Title lead={"按图标库的风格绘制新图标，可用于 Claude Code、Codex 和其他编程智能体"}>
        Kubai Icons Skill
      </Title>
      <div className="my-5 space-y-5">
          <h2>概述</h2>
          <p>Skill 读取产品的代码或功能列表，为每项功能选定一个日常物品和一个悬停动作，然后绘制图标。每个图标都会在 24 像素和 28 像素两种尺寸下检查，检查依据是一份涵盖画布、图层、描边、光照、颜色、内部图形和动效的书面规范。</p>
          <h2>两种风格</h2>
          <p>Skill 支持两种风格。分层图标由后片和前片组成，带外描边，悬停时做物体本身会做的动作。双色图标是 16 网格的实心图形，浅色主体加品牌色点缀，适用于界面中 16–48 像素的功能图标。请告诉智能体所需的风格；无法判断时，它会先询问。</p>
          <p>图标库中的<Link href="/zh/docs/guides/duotone/">双色图标</Link>由它绘制，在图标库中选择<Link href="/zh/icons/?style=duotone">双色</Link>即可查看。</p>
          <h2>安装</h2>
          <p>Skill 是一个包含说明和脚本的文件夹，因此任何能读取文件、运行命令的编程智能体都可以使用，包括 <a href="https://claude.com/claude-code">Claude Code</a> 和 <a href="https://developers.openai.com/codex">Codex</a>。推荐使用 Claude，本 Skill 基于 Claude 开发和测试。Skill 的自检功能还需要 Node 18 或更高版本以及 Chrome。</p>
          <p>将以下内容粘贴到智能体的输入框中：</p>
        </div>
      <Code code={`请帮我安装 Kubai Icons Skill：
将 ${REPO} 克隆到你的 Skills 文件夹中，目录名为 kubai-icons
（Claude Code 使用 ~/.claude/skills，Codex 使用 ~/.agents/skills；
如果已经存在，则改为拉取最新版本），
确认该文件夹中有 SKILL.md，准备好后告诉我。`} />
      <div className="my-5 space-y-5">
          <p>以上方式会同时安装两种风格。如只需双色风格，从<a href={`${REPO}/releases/latest`}>最新版本</a>下载 <code>kubai-duotone</code>，解压到同一个 Skills 文件夹。</p>
          <h2>使用</h2>
          <p>安装完成后，让智能体为你的项目绘制图标即可，例如：“使用 Kubai Icons Skill，为这个仓库中的功能绘制图标。”不支持 Skill 的智能体可以读取克隆文件夹中的 <code>SKILL.md</code> 并按其说明操作。</p>
          <h2>分享你的图标</h2>
          <p>你绘制的图标可以加入图标库。<Link href="/zh/icons/submit/">提交图标</Link>后，我们会按设计规则审核；通过审核的图标会以 MIT 许可证发布，并为你署名。</p>
          <h2>许可证</h2>
          <p>Skill 依据 <Link href="/zh/license/">Kubai Icons 许可证</Link>以源码可见的方式提供。使用 Skill 绘制的图标归其作者所有。</p>
        </div>
    </Prose>
  );
}
