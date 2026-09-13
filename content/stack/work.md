---
title: SkillsMP：给 AI 找技能的网站
type: landing
article: true
index: '04'
eyebrow: AI TOOLS
summary: 从普通用户的视角，认识 Agent Skills，以及 SkillsMP 这个开放的 AI 技能生态地图。
tags: [Agent Skills, AI 工具, SkillsMP, 科普]
date: 2026-09-12
authors:
  - me
---

最近，我在使用 AI 工具时发现了一个挺有意思的网站——[SkillsMP](https://skillsmp.com/zh)。

第一次看到“Skills Marketplace”这个名字，我以为它是一个类似手机应用商店的平台：找到喜欢的技能，点击一下就能安装。实际体验之后，我发现它更像一张开放的“AI 技能生态地图”——它把散落在 GitHub 上的 Agent Skills 收集起来，让我们可以集中搜索、浏览和参考。

{{< site-shot src="media/skillsmp-article/01-skillsmp-home-20260913.jpg" alt="SkillsMP 中文首页，展示 Agent Skills Marketplace、搜索框和领域入口" caption="我第一次打开 SkillsMP 时看到的中文首页：可以直接搜索，也可以从教育、市场营销、代码审查等领域开始探索。" href="https://skillsmp.com/zh" label="skillsmp.com/zh" loading="eager" >}}

## 先说清楚：什么是 Agent Skill？

我们平时使用 AI，通常会直接向它提问。例如：“帮我写一篇文章”“检查一下这段代码”或者“分析这份数据”。

问题在于，同一个任务可能有很多种做法。如果每次都从头解释工作流程，不仅麻烦，AI 给出的结果也可能不够稳定。

Agent Skill 可以简单理解为一份写给 AI 的“工作说明书”。它会告诉 AI：

- 在什么情况下启用这项能力；
- 应该按照什么步骤完成任务；
- 需要遵守哪些规则；
- 应该检查哪些问题；
- 可以调用哪些脚本、模板或参考资料。

一个 Skill 通常以 `SKILL.md` 文件为核心，还可能附带脚本、案例、模板和专业资料。它不是给 AI 增加一颗新的“大脑”，而是把某个领域的经验和工作方法整理出来，让 AI 知道这类事情应该怎样做。[SkillsMP 的说明文档](https://skillsmp.com/zh/docs)将其概括为一种可复用的知识包。

如果要打个比方，通用 AI 像是一位能力不错的新员工，而 Skill 就像公司交给他的岗位手册、操作流程和检查清单。

## SkillsMP 解决了什么问题？

现在，越来越多的人开始把自己的工作方法写成 Skill，并公开到 GitHub 上。但是，这些文件分散在大量仓库中，只靠普通搜索很难找到。

SkillsMP 做的事情，就是把公开的 `SKILL.md` 文件收集和整理起来。截至我浏览网站时，首页显示已经收录了超过 320 万个相关文件。用户可以通过关键词、用途、创作者和职业领域等方式进行查找。[SkillsMP 首页](https://skillsmp.com/zh)还提供了教育、市场营销、代码审查等搜索入口，并按照开发、商业、工具、测试与安全等类别整理内容。

{{< site-shot src="media/skillsmp-article/02-skillsmp-search-20260913.jpg" alt="SkillsMP 搜索 frontend design 后的筛选栏和结果列表" caption="以 frontend design 为例，结果页会同时展示筛选条件、来源仓库、更新时间和 GitHub 星标，方便我快速比较不同实例。" href="https://skillsmp.com/zh/search?q=frontend%20design" label="skillsmp.com/zh/search" >}}

我也可以从职业角度寻找灵感。网站基于职业分类建立了数百个细分入口，让我看到不同领域的人正在尝试把哪些经验交给 AI。例如，程序员可能会制作代码审查 Skill，设计师可能会整理界面设计规范，营销人员则可能把市场调研、内容策划和活动复盘写成标准流程。

对我来说，它最有价值的地方不只是“下载一个现成技能”，而是让我看到：原来这些事情也可以整理成 AI 能够执行的流程。

## 我会怎样使用这个网站？

我的使用方法很简单。

假设我希望 AI 更好地帮我制作网页，就可以搜索“frontend design”或“UI/UX”。打开一个 Skill 后，我能够查看它来自哪个 GitHub 仓库、由谁维护、最近是否更新，以及 `SKILL.md` 中写了什么。有些页面还会展示配套文件，并提供安装提示或下载方式。

{{< site-shot src="media/skillsmp-article/03-skillsmp-detail-20260913.jpg" alt="SkillsMP 的 frontend-design Skill 详情页，展示来源、更新时间和安装方式" caption="进入具体 Skill 后，我会先看仓库来源、最近活动、星标和安装说明，再决定它是否值得继续研究。" href="https://skillsmp.com/zh/creators/anthropics/skills/skills-frontend-design" label="skillsmp.com/zh/creators/anthropics/skills" >}}

我一般会重点观察四个方面：

1. 它解决的任务是否足够明确；
2. 它把工作拆成了哪些步骤；
3. 它设置了哪些质量检查；
4. 它引用了哪些脚本、模板和外部工具。

即使我最终不安装，也可以借鉴它的组织方式，进一步编写适合自己的 Skill。SkillsMP 官方也把网站定位为发现和比较公开实例的工具，而不是可以直接照搬的模板库。[关于页面](https://skillsmp.com/zh/about)将其描述为一张开放的 Agent Skills 生态地图。

## Skill 和 MCP 是一回事吗？

刚接触这个领域时，我也容易把 Skill 和 MCP 混在一起。后来我用一个简单的方法来区分：

- Skill 主要告诉 AI“应该怎样做”；
- MCP 主要让 AI“能够连接什么”。

例如，一份市场调研 Skill 可以规定调研步骤、判断标准和报告结构；而 MCP 可以让 AI 连接数据库、搜索服务或其他外部系统。前者更像操作手册，后者更像工具接口。

两者并不冲突。AI 可以按照 Skill 中的流程开展工作，同时通过 MCP 调用外部工具完成其中的具体步骤。

## 使用前，我仍然会保持谨慎

SkillsMP 收录的是公开 GitHub 仓库中的内容，但“被收录”不等于“经过认证”。

网站明确提醒，平台不会为每个 Skill 的质量和安全性背书，也不会保证这些内容已经在真实业务中得到验证。SkillsMP 本身还是一个独立的社区项目，与 OpenAI 或 Anthropic 没有关联。[网站常见问题](https://skillsmp.com/zh#常见问题)建议用户像检查普通开源代码一样检查社区 Skill。

因此，在安装之前，我会先确认：

- Skill 来自哪个仓库和作者；
- 文件中有没有我看不懂的脚本；
- 它要求访问哪些文件、账号或系统权限；
- 仓库是否持续维护；
- 它的规则是否适合我的实际任务。

尤其是涉及账号登录、命令执行、文件修改和外部服务时，我不会因为页面提供了安装命令就直接运行。

## 我的总体感受

在我看来，SkillsMP 的意义不只是提供了一个庞大的 Skill 搜索入口。它还展示了一种新的趋势：人们开始把自己的经验、判断标准和工作流程，整理成 AI 可以理解并重复执行的知识。

过去，我们主要关心“AI 模型聪不聪明”；以后，我们可能会越来越关心“给 AI 配备了什么技能”。

如果把通用 AI 看作一台功能强大的电脑，那么 Agent Skills 就像围绕不同工作场景编写的软件和操作指南。SkillsMP 则像一张不断扩展的软件目录，帮助我了解别人正在创造什么，也让我思考：自己的哪些经验，也可以整理成一项可复用的 AI 技能？
