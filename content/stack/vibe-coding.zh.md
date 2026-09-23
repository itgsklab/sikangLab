---
title: 我读完大厂技术团队的 Vibe Coding 实践，发现真正的变化不只是“用嘴写代码”
type: landing
article: true
article_parent: agent
url: stack/agent/vibe-coding/
eyebrow: AI ENGINEERING
summary: 从 Google、Meta、GitHub、Anthropic、阿里、腾讯与字节团队的实践，看懂 Vibe Coding 是什么，以及它怎样走向工程化。
description: 一篇基于互联网公司技术团队公开文章的 Vibe Coding 科普，讨论原型、规格、上下文、测试、安全与生产落地。
tags: [Vibe Coding, AI 编程, Coding Agent, 工程实践]
date: 2026-09-23
authors:
  - me
---

最近，我集中读了一批关于 Vibe Coding 的文章。资料既有 Google、Meta、GitHub、Anthropic 和 Vercel 的工程博客，也有淘特导购、腾讯云 CloudBase、字节跳动 TRAE 设计团队公开的实践。读完之后，我最大的感受是：大家嘴上都在谈“自然语言写代码”，真正投入工程时，注意力却都转向了同一批老问题——需求是否清楚、上下文是否完整、结果怎样验证、权限如何收住、出了故障谁来负责。

所以，我现在更愿意把 Vibe Coding 看成一种快速探索软件的方式，而不是软件工程的替代品。它降低了把想法变成可运行程序的门槛，但程序越接近真实业务，传统工程能力就越不能省略。

## Vibe Coding 到底是什么？

这个词由 Andrej Karpathy 在 2025 年 2 月的一则公开帖子中带火。他描述的是一种近乎“忘掉代码存在”的状态：人用自然语言说出需求，模型生成和修改代码，人主要看运行结果，再继续告诉模型哪里不对。

按照这个最初的语境，Vibe Coding 并不等同于一切 AI 辅助编程。让 AI 补全一个函数、解释报错或写单元测试，仍然可以是普通的软件开发；真正的 Vibe Coding 更强调把实现细节大量交给模型，用“描述—运行—观察—再描述”的循环推进。

这一区别很重要。它解释了为什么 Vibe Coding 特别适合周末项目、界面草图和快速原型：这些场景允许我先追求“能不能跑起来”，再决定是否值得继续投入。但如果我要修改支付、权限、数据迁移或已有大型系统，仅凭页面看起来正常，显然不够。

## 我看到的第一种实践：让想法更快变成原型

Google 的开发者团队把 Agent Development Kit 与 Gemini CLI 组合，用经过压缩、专门面向模型整理的 `llms-full.txt` 提供框架上下文。团队展示的重点不是让模型凭空猜 API，而是先把正确的组件、约定和示例放进上下文，再让它根据高层需求生成 Agent。[Google 的文章](https://developers.googleblog.com/simplify-agent-building-adk-gemini-cli/)称这能减少查文档和切换环境的摩擦，让开发者更快得到可运行原型。

字节跳动 TRAE 设计团队的[公开实践](https://developer.volcengine.com/articles/7563898752441073706)也很有代表性。设计师并不是只说一句“做一个高级感页面”，而是明确 React、Vite、Tailwind 和 Framer Motion 等技术栈，再拆解需求、逐步调整结构与视觉细节。对我来说，这说明所谓“凭感觉”并不等于“不给约束”：审美判断可以保持感性，交给模型的任务仍然需要具体。

这类用法最直接的价值，是让产品、设计和开发更早看到一个可以交互的东西。过去讨论停留在文字或静态稿上，现在可以先生成一个版本，通过真实操作暴露遗漏的问题。此时生成的代码更像讨论媒介，而不是已经完成的产品。

## 第二种实践：从 Vibe Coding 走向规格驱动

当任务从新项目原型转向长期维护的代码库，团队很快会碰到一个问题：模型能生成很多代码，却不一定理解真正的业务意图。

GitHub 在介绍 [Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) 时直接指出，Vibe Coding 很适合快速原型，但面对关键应用和现有代码库时可靠性不足。它给出的方向是规格驱动开发：先把要解决的问题、约束、计划和任务写清楚，再让 Agent 实现。这里的变化不是把自然语言丢掉，而是把随口说的提示词升级成可以审查、追踪和验证的规格。

淘特导购团队的[《AI 编码实践：从 Vibe Coding 到 SDD》](https://developer.aliyun.com/article/1709229)呈现了类似演进。他们从代码补全走向 Agent Coding，随后加入 Rules 约束并尝试 SDD（Specification Driven Development）。团队也没有把 SDD 描述成万能答案，而是承认历史代码接入、工具成熟度和落地成本等问题，最终采用轻量技术方案、规则约束、Agent 实现与架构文档汇总相结合的方式。

我很认同这种“不追求纯粹”的选择。真实团队很少需要一套漂亮但沉重的理论，更需要一套成员愿意持续使用、出现问题能够回溯的工作流。

## 第三种实践：先把代码库教给 Agent

AI 写错代码，很多时候并不是不会写语法，而是不知道这个仓库里那些没有写进文档的约定。

Meta 在一篇关于大型数据管道的[工程文章](https://engineering.fb.com/2026/04/06/developer-tools/how-meta-used-ai-to-map-tribal-knowledge-in-large-scale-data-pipelines/)中提到，他们面对的是跨四个仓库、三种语言、四千多个文件的系统。团队没有继续堆更长的临时提示词，而是先用多个 Agent 整理代码结构和隐性知识，生成简洁的上下文文件，再通过多轮独立检查提高质量。文章强调“指南针，而不是百科全书”：上下文要帮助 Agent 找到修改入口、依赖关系和容易出错的地方，而不是无差别塞进全部资料。

Anthropic 分享的 [Claude Code 实践](https://www.anthropic.com/engineering/claude-code-best-practices)也把上下文当作基础设施。团队建议在仓库中维护常用命令、核心文件、代码规范、测试方式和协作约定，并采用“探索—计划—编码—提交”的节奏。先让 Agent 阅读和计划，再进入实现，通常比上来就让它改代码更可靠。

这让我意识到，团队使用 Coding Agent 的关键资产可能不只是模型或编辑器，还包括一套持续更新、机器可以理解的工程说明。过去只存在于资深同事脑中的知识，需要被写出来；否则 Agent 只会在代码里反复猜测。

## 第四种实践：生成更快以后，验证必须跟上

AI 可以在几分钟内生成大量代码，但评审者的阅读速度并不会同步提升。生成速度越快，错误进入系统的速度也可能越快。

Anthropic 推荐的一个典型流程是先写测试、确认测试失败，再让 Agent 编写实现直到测试通过，同时禁止它为了“变绿”随意修改测试。Meta 则在 Agent 编码加速之后继续研究按变更即时生成测试的方法。这些实践共同指向一个事实：Agent 最擅长的是能够从环境获得明确反馈的任务，测试、类型检查、静态分析和运行日志就是它的反馈回路。

但自动测试也不是最终答案。测试只能证明已经写出的断言，不能证明需求本身正确。架构取舍、数据风险、用户体验和业务边界，仍然需要人来判断。因此，我不会把“所有测试通过”理解成“可以放心上线”，而会把它看成进入人工审查的最低条件之一。

## 第五种实践：从能运行到能上线，中间隔着一整套基础设施

腾讯云 CloudBase 团队在介绍 [OpenVibeCoding](https://cloudbase.cloud.tencent.com/blog/2026/05/26/openvibecoding) 和[平台基础设施](https://cloudbase.cloud.tencent.com/blog/2026/06/03/vibe-coding-cloudbase)时，把问题拆得很具体：Agent 需要可恢复的运行时和隔离沙箱；应用需要数据库、认证、存储和托管；多用户平台需要租户隔离、权限和计费；长时间运行还要处理状态、事件、中断与恢复。

Vercel 在[新版 v0 的介绍](https://vercel.com/blog/introducing-the-new-v0)中也区分了快速生成和生产交付。它指出，企业里的真实工作更多发生在已有代码库中，原型若脱离现有配置、权限和部署环境，最终仍可能需要重写。更值得警惕的是“影子 IT”：员工可以快速生成应用，也可能把凭证、公司数据和有漏洞的代码一起发布出去。

这部分彻底打破了“模型会写代码，软件就完成了”的想象。真正上线的应用仍然要回答：密钥放在哪里？谁能访问数据？Agent 可以执行哪些命令？失败能否恢复？日志能否追踪？成本有没有上限？这些问题不会因为生成界面只用了十分钟就自动消失。

## 我现在怎样使用 Vibe Coding？

结合这些团队的经验，我会把任务分成三个层级。

第一层是探索。一次性脚本、交互原型和个人小工具，我可以大胆使用对话式循环，快速验证想法。这时最重要的是明确目标、频繁运行，并避免接触真实敏感数据。

第二层是可维护项目。一旦代码需要继续迭代，我就会补上需求说明、目录约定、技术边界和测试，让 Agent 先读再改；每次改动尽量小，确保我能看懂差异并独立验证。

第三层是生产系统。涉及用户数据、资金、权限或核心业务时，我会把 Agent 当作执行速度很快的协作者，而不是最终责任人。隔离环境、最小权限、代码审查、自动化测试、监控和回滚都不能因为“AI 写的”而省略。

## Vibe Coding 会取代程序员吗？

读完这些文章，我的答案是：它首先取代的是一部分从想法到首个版本之间的机械劳动，而不是对问题负责的人。

程序员的工作重心正在移动。手写每一行代码的重要性可能下降，但定义问题、拆分任务、组织上下文、设计验证方式和判断风险的价值反而上升。不会写代码的人也能做出以前做不到的原型；有工程经验的人则能借助 Agent 更快地跨语言、跨框架完成实现。两者都获得了更强的创造能力，也都需要面对更大的误用空间。

如果只看演示，Vibe Coding 像是“用嘴写代码”；如果看大厂技术团队的真实实践，它更像是一次软件生产方式的重新分工：人把更多精力放在意图、约束和验收上，Agent 承担搜索、生成、修改和重复执行。真正成熟的标志，不是人完全不看代码，而是团队即使生成得更快，依然知道如何证明它正确、限制它的权限，并为上线结果负责。

## 参考资料

- [Google Developers：Simplify your Agent “vibe building” flow with ADK and Gemini CLI](https://developers.googleblog.com/simplify-agent-building-adk-gemini-cli/)
- [Meta Engineering：How Meta Used AI to Map Tribal Knowledge in Large-Scale Data Pipelines](https://engineering.fb.com/2026/04/06/developer-tools/how-meta-used-ai-to-map-tribal-knowledge-in-large-scale-data-pipelines/)
- [GitHub Blog：Spec-driven development with AI](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [Anthropic Engineering：Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Anthropic Engineering：Beyond permission prompts: making Claude Code more secure and autonomous](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [Vercel：Introducing the new v0](https://vercel.com/blog/introducing-the-new-v0)
- [淘特导购团队：AI 编码实践——从 Vibe Coding 到 SDD](https://developer.aliyun.com/article/1709229)
- [腾讯云 CloudBase：我们把一套完整的 Vibe Coding 平台开源了](https://cloudbase.cloud.tencent.com/blog/2026/05/26/openvibecoding)
- [腾讯云 CloudBase：为 Agent 重新设计云](https://cloudbase.cloud.tencent.com/blog/2026/06/03/vibe-coding-cloudbase)
- [TRAE 设计团队如何玩转 Vibe Coding](https://developer.volcengine.com/articles/7563898752441073706)

以上资料访问与核对日期为 2026 年 9 月 23 日。文中对各团队共性趋势的归纳属于我的总结，不代表相关公司的统一立场。
