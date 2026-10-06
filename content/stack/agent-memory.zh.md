---
title: 我读完大厂技术团队的 Agent 记忆实践，发现“记住”不是保存全部聊天记录
type: landing
article: true
article_parent: agent
url: stack/agent/agent-memory/
eyebrow: AGENT MEMORY
summary: 从 Anthropic、AWS、Meta、Microsoft、腾讯和阿里的实践，看懂 Agent 如何选择性地写入、整理、召回、更新与遗忘。
description: 一篇基于互联网大厂技术团队公开资料的 Agent 记忆科普，解释工作记忆、长期记忆、经验记忆、团队记忆及其安全治理。
tags: [Agent Memory, Context Engineering, RAG, AI Agent]
date: 2026-10-07T00:00:00+08:00
authors:
  - me
---

最近，我集中读了 Anthropic、AWS、Meta、Microsoft、腾讯和阿里关于 Agent 记忆的工程文章与产品文档。开始时，我以为这个问题主要是“怎样让模型记住更久”：把聊天记录放进向量数据库，需要时检索回来，似乎就完成了。

读完这些实践后，我发现真正困难的部分几乎都不在“存储”本身。一个能长期工作的 Agent 必须持续回答更棘手的问题：什么值得记住，什么应该尽快忘掉；一段经历应该保存为原始事件、事实、用户偏好，还是可复用的操作方法；不同用户、任务和 Agent 的记忆怎样隔离；旧结论被新信息推翻后，谁来更新；一条被污染的记忆会不会在几天后触发错误操作。

所以，我现在更愿意把 Agent 记忆理解为一套持续运行的上下文管理系统。它不是给模型外挂一个无限硬盘，而是在有限注意力里，把此刻最有用、来源可信、权限允许的信息送到模型面前。

{{< site-shot src="media/agent-memory-article/01-flowchart-memory-lifecycle.png" alt="Agent 将会话、工具结果和任务事件提炼为结构化记忆，再按需召回、更新与遗忘的生命周期示意图" caption="我理解的 Agent 记忆不是无限存储，而是“记录—提炼—组织—召回—更新—遗忘”的持续闭环。" label="AGENT MEMORY LIFECYCLE" loading="eager" >}}

## 先分清：上下文窗口、状态、知识库和记忆不是一回事

大模型本身并不会因为一次对话自动发生持久变化。每次推理时，它看到的是当前上下文窗口中的指令、消息、工具结果和被检索出来的材料。窗口再长，也只是一次推理能够阅读的工作区，不等于跨会话记忆。

我会把相关概念分成四层：

1. **上下文窗口**是模型此刻正在看的工作台，容量有限，内容越多不一定越好。
2. **任务状态**记录当前工作进行到哪里，例如计划、待办、工具执行结果和检查点。
3. **知识库**保存外部事实与文档，通常不因某个用户的一次互动而改变。
4. **Agent 记忆**从交互和行动中提炼对未来有用的信息，并在合适的时间重新注入上下文。

Anthropic 在[上下文工程实践](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)中把上下文称为有限的“注意力预算”。随着内容增加，模型对关键信息的捕捉可能变差。因此，记忆系统的目标不是把过去全部塞回来，而是找到能够支持当前决策的最小高信号集合。

这也是记忆与普通 RAG 最容易混淆的地方。RAG 通常从相对稳定的文档集合中找证据；记忆则来自 Agent 自己经历过的会话、任务、反馈和工具调用，并且需要不断新增、合并、纠错和淘汰。两者都依赖检索，但治理对象与更新节奏并不相同。

## 我看到的第一种共识：短期记忆保存现场，长期记忆提炼意义

AWS 的 [AgentCore Memory](https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-memory-building-context-aware-agents/)把两者分得很清楚：短期记忆按用户和会话保存不可变事件，包括消息、工具结果、状态变化和检查点；长期记忆则从这些原始事件中异步提取偏好、事实、摘要与关键洞察，跨会话保留。

这让我意识到，聊天记录更像“原始日志”，而不是已经整理好的记忆。如果用户在十轮对话里反复调整旅行预算，长期记忆不应该存十条互相冲突的数字，而应该保留当前有效的预算、适用场景、更新时间和来源。Microsoft Foundry 的[记忆实现](https://devblogs.microsoft.com/foundry/introducing-memory-in-foundry-agent-service/)也采用提取、合并、冲突处理和按需召回的流程，而不是简单追加全部历史。

从工程角度看，完整事件仍然有价值：它可以帮助审计、回放和重新提炼。但真正进入模型上下文的内容，应该是经过选择和压缩的结果。原始记录负责“发生过什么”，长期记忆负责“以后应该知道什么”。

## 第二种共识：好的记忆不是更多，而是更有结构

Microsoft Research 的 [PlugMem](https://www.microsoft.com/en-us/research/blog/from-raw-interaction-to-reusable-knowledge-rethinking-memory-for-ai-agents/)给我留下很深的印象。团队指出，直接检索长篇交互记录会把低价值内容重新塞进上下文，记得越多，Agent 反而可能越难找到重点。他们把对话、文档和浏览轨迹转换成紧凑的事实与可复用技能，再组织成结构化记忆图谱。

这里的关键变化是：记忆的基本单位不再是一段文本，而是可以参与决策的知识单元。我可以把常见记忆粗略分成几类：

- **语义记忆**：稳定事实、用户偏好、领域规则与实体关系。
- **情景记忆**：某次任务发生了什么、采取了哪些行动、结果如何。
- **程序记忆**：一个成功工作流、排障步骤或可复用技能。
- **工作记忆**：当前计划、临时结论、未解决问题和最近工具结果。

阿里云 AgentLoop 的[记忆模块](https://www.alibabacloud.com/help/en/cms/cloudmonitor-2-0/memory-module-overview)也区分 facts、episodic、summary 等策略，并在检索中组合向量搜索、重排和智能搜索。对我来说，这说明向量数据库只是底层部件之一；真正决定效果的是上层记忆模式、元数据、作用域、更新规则与召回策略。

## 第三种共识：长任务需要“可恢复状态”，而不只是记住用户偏好

谈 Agent 记忆时，很多示例都是“用户喜欢靠窗座位”。但大厂技术团队真正投入生产的场景，往往要求 Agent 在数小时、数天甚至数周后继续工作。

Meta 的 [Ranking Engineer Agent](https://engineering.fb.com/2026/03/17/ml-applications/ranking-engineer-agent-rea-autonomous-ai-system-accelerating-meta-ads-ranking-innovation/)会运行跨天的机器学习实验。训练任务开始后，Agent 进入休眠，后台等待任务完成，再带着计划、实验状态和历史结果恢复。它不仅记住“做到哪一步”，还把成功与失败的实验配置、指标和结论写入历史洞察库，为下一轮假设提供依据。

Anthropic 在[长时间运行 Agent 的工程实践](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)中采用更朴素的方法：让每一轮 Agent 维护进度文件、结构化待办和 Git 提交，使下一次会话能够从可检查的外部状态继续。它证明了一点：记忆不一定必须是复杂数据库，文件、日志、检查点和版本控制同样可以构成可靠的外部记忆。

Microsoft Research 的 [CORPGEN](https://www.microsoft.com/en-us/research/blog/corpgen-advances-ai-agents-for-real-work/)则把工作记忆、结构化长期记忆、语义记忆、分层计划和隔离的子 Agent 结合起来。面对同时推进的任务，最危险的不只是忘记，还有不同任务相互污染。因此，长任务记忆还必须保留任务边界、依赖关系和优先级。

## 第四种共识：个人记忆正在变成团队与组织记忆

Agent 记忆最初常被描述成个性化功能，但我从近期案例里看到，它正在成为组织知识工程的一部分。

Meta 在[“组织第二大脑”](https://engineering.fb.com/2026/09/02/ml-applications/organizational-second-brain-ai-learns-from-experts/)项目中，没有直接把海量文档交给模型临场理解，而是提前把专家的判断提炼成结构化知识文件，把“知道什么”与“怎样推理”拆开。知识文件声明适用条件、依赖和引用关系；专家纠正经过诊断、最小修改、回放、回归测试和人工审核后，才沉淀为新的组织知识。这个系统的重点不是记住一次回答，而是让一次专家纠正变成可追踪、可验证、可复用的长期改进。

腾讯云 [Team Memory](https://developer.cloud.tencent.com/article/2722202)采取了类似的资产化思路：历史会话整理成 Chat Memory，项目文档生成 Wiki，代码仓库形成 CodeGraph，成功的排障与评审流程沉淀为 Skill，再按照团队、角色、Agent 和任务选择性装配。对我来说，这比“共享一个向量库”更接近真实团队协作，因为不同角色本来就不应该读取相同的全部信息。

当记忆从个人走向团队，它就不再只是体验功能，而是需要负责人、版本、权限、依赖、审核和回滚的组织资产。

{{< site-shot src="media/agent-memory-article/02-framework-memory-governance.png" alt="个人、任务、团队和组织记忆通过权限门控向不同角色 Agent 提供不同信息的治理架构图" caption="团队记忆不能是所有 Agent 共用的资料池；它需要隔离、授权、溯源、版本、审计和删除能力。" label="SCOPED MEMORY & GOVERNANCE" >}}

## 第五种共识：遗忘和更新与记住同样重要

如果系统只会追加，长期记忆一定会逐渐出现重复、冲突、过期和噪声。真正可用的记忆必须有生命周期。

我认为至少要回答五个问题：这条信息是否值得写入；它的有效期多长；新信息与旧信息冲突时如何合并；什么条件下应该降低权重或删除；删除后是否还需要保留审计痕迹。AWS 支持为原始事件设置保留期限，并用命名空间隔离不同组织、用户和记忆类型；Microsoft Foundry 会合并相似记忆、处理冲突；阿里云的实现强调在偏好发生变化时更新原记录，而不是无止境追加。

这意味着“忘记”不是缺陷，而是一种质量控制。临时验证码、过期行程、一次性故障日志和长期技术偏好的保留策略显然不应该相同。如果所有信息都被永久保存，系统既昂贵，也可能违反隐私与合规要求。

## 记忆越强，安全边界越需要前移

读到这里，我也越来越警惕一个问题：记忆不仅保存数据，还会改变 Agent 未来的行为。

Microsoft Security 在[记忆安全研究](https://www.microsoft.com/en-us/security/blog/2026/06/22/guarding-ai-memory/)中指出，没有记忆时，攻击者通常需要在一次交互中完成诱导；有了持久记忆，恶意指令可能先被埋入，过一段时间再在其他场景触发。由于触发与写入不在同一上下文里，这类记忆投毒更难被用户察觉，也更难追踪。

因此，我不会允许模型把任何看到的内容直接写入长期记忆。生产系统至少需要：写入前过滤与来源标记，按用户、租户和任务隔离，最小权限控制，敏感信息识别，写入/读取/修改/删除审计，以及让用户查看、纠正和删除个人记忆的入口。高风险记忆还应经过规则或人工批准。

这里有一个很容易被忽略的原则：从网页、邮件和文档中读取到的文字只是外部数据，不天然具备修改长期记忆的权限。记忆写入本身应该被当作一次受控工具调用，而不是普通文本处理。

## 我现在怎样设计一个 Agent 记忆系统？

如果从零开始，我不会先追求“无限记忆”，而会按照下面的顺序做一个最小闭环：

1. **先定义目标**：记忆究竟要减少重复提问、恢复长任务、复用经验，还是支持个性化？
2. **划分作用域**：明确 user、agent、task、team 与 organization 边界，默认互不共享。
3. **保留原始事件**：用会话与任务 ID 记录消息、工具结果和状态变化，设置合理 TTL。
4. **异步提炼**：把原始事件转换成事实、偏好、摘要、情景与技能，并保留来源。
5. **检索与重排**：结合最近性、相关性、重要性、可信度和权限，限制注入数量。
6. **冲突与遗忘**：对新旧信息进行合并、版本化、降权、过期或删除。
7. **建立评测**：不仅测试“能否找到”，还测试任务成功率、错误调用、延迟、成本与用户体验。
8. **补齐治理**：让记忆可查看、可解释、可纠正、可删除、可审计。

Microsoft 的 [STATE-Bench](https://opensource.microsoft.com/blog/2026/05/19/introducing-state-bench-a-benchmark-for-ai-agent-memory/)提醒我，记忆评测不能只考“能否找回五十轮前的名字”。在客服、旅行与购物等真实任务里，更重要的是 Agent 是否学会了正确流程、是否减少重复错误、是否正确改变系统状态，以及用户体验是否真的变好。

## Agent 记忆的本质是什么？

读完这些大厂团队的实践，我的答案是：Agent 记忆不是一个存储功能，而是一套把经历转化为未来行动依据的工程机制。

它需要在三个矛盾之间保持平衡：记得足够多，但不能淹没注意力；复用过去经验，但不能固化错误和过期结论；跨会话、跨 Agent 共享知识，但不能突破用户授权与组织边界。

真正成熟的记忆系统，不是能背出所有聊天记录，而是在正确的任务、正确的时间、以正确的权限，拿出少量真正有用的信息；当信息失效时，它还能解释来源、完成修正，并安全地忘掉。

## 参考资料

- [Anthropic：Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic：Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [AWS：Amazon Bedrock AgentCore Memory — Building context-aware agents](https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-memory-building-context-aware-agents/)
- [Meta Engineering：Ranking Engineer Agent](https://engineering.fb.com/2026/03/17/ml-applications/ranking-engineer-agent-rea-autonomous-ai-system-accelerating-meta-ads-ranking-innovation/)
- [Meta Engineering：An Organizational Second Brain](https://engineering.fb.com/2026/09/02/ml-applications/organizational-second-brain-ai-learns-from-experts/)
- [Microsoft Research：PlugMem](https://www.microsoft.com/en-us/research/blog/from-raw-interaction-to-reusable-knowledge-rethinking-memory-for-ai-agents/)
- [Microsoft Research：CORPGEN](https://www.microsoft.com/en-us/research/blog/corpgen-advances-ai-agents-for-real-work/)
- [Microsoft Open Source：STATE-Bench](https://opensource.microsoft.com/blog/2026/05/19/introducing-state-bench-a-benchmark-for-ai-agent-memory/)
- [Microsoft Security：Guarding AI memory](https://www.microsoft.com/en-us/security/blog/2026/06/22/guarding-ai-memory/)
- [腾讯云：Team Memory](https://developer.cloud.tencent.com/article/2722202)
- [阿里云：AgentLoop Memory module](https://www.alibabacloud.com/help/en/cms/cloudmonitor-2-0/memory-module-overview)

以上资料访问与核对日期为 2026 年 10 月 7 日。文中对各团队共性趋势的归纳属于我的总结，不代表相关公司的统一立场。
