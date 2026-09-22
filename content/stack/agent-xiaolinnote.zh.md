---
title: 我最近发现的一个大模型学习网站：小林面试笔记
type: landing
article: true
article_parent: agent
url: stack/agent/xiaolinnote/
eyebrow: AI LEARNING
summary: 从普通用户的视角，看看怎样借助问题和图解学习大模型、Agent 与 RAG。
description: 从五大专题、Agent 模拟问答和 RAG 图解认识小林面试笔记，找到适合自己的大模型学习入口。
tags: [大模型, Agent, RAG, 学习资源]
date: 2026-09-16
authors:
  - me
---

想了解大模型，却不知道从哪里开始？我最近看了[小林面试笔记的大模型专题](https://xiaolinnote.com/ai/)。它虽然叫“面试题”，但我觉得不必等到找工作才看：对想弄懂 AI 应用的人来说，这也是一份按问题组织的学习地图。

## 从五个专题找到入口

网站目前把内容分成五个专题：大模型工程、工具调用、RAG、Agent 和 LangChain。简单说，大模型工程解释模型本身如何工作；工具调用讨论怎样让模型连接外部能力；RAG 关注怎样先查资料再回答；Agent 则进一步讨论怎样规划步骤、调用工具并根据结果继续完成任务。LangChain 专题聚焦相关开发框架。这样的分类让我能先找到自己不懂的那一块，而不必从头读完一本厚重的教材。

{{< site-shot src="media/xiaolinnote-article/topic-overview.jpg" alt="小林面试笔记大模型专题页左侧列出 Agent、RAG、工具调用、大模型工程和 LangChain 五个专题" caption="专题页左侧按五个方向组织内容，我可以从最关心的主题进入。截图拍摄于 2026 年 9 月 16 日。" href="https://xiaolinnote.com/ai/" label="xiaolinnote.com/ai" loading="eager" >}}

## 用面试问题检验理解

我喜欢它的一点，是很多文章会先用一段模拟面试对话提出问题，再给出简要回答和详细解析。例如[“什么是 Agent”](https://xiaolinnote.com/ai/agent/1_whatisagent.html)这篇文章，先展示把 Agent 简单理解成“会调用工具的大模型”为什么不够，再逐步解释规划、行动和反馈。即使我暂时不准备面试，也能借这个问题检查自己是否真的理解了概念，而不只是记住一个名词。

{{< site-shot src="media/xiaolinnote-article/agent-question.jpg" alt="什么是 Agent 文章开头的模拟面试对话，围绕工具调用与自主闭环展开" caption="一篇题目的开头会用对话呈现常见误解，再引向简要回答和详细解析。截图拍摄于 2026 年 9 月 16 日。" href="https://xiaolinnote.com/ai/agent/1_whatisagent.html" label="xiaolinnote.com/ai/agent" >}}

## 从 RAG 看见工程细节

另一个值得看的方向是 RAG。假设我想让 AI 回答公司内部文档里的问题，只靠模型原有知识并不合适；RAG 的思路是先从资料中找出相关内容，再让模型据此回答。原站用“开卷考试”的比喻解释它：知识留在外部资料里，模型回答时再去参考，而不是把每次更新都写进模型参数。

{{< article-image src="media/xiaolinnote-article/rag-open-book.webp" alt="闭卷考试与开卷考试的对比：微调把知识写入模型参数，RAG 在回答时参考外部资料" caption="“闭卷”和“开卷”的对比，帮助我理解 RAG 为什么适合接入会更新的知识。配图来自小林面试笔记，版权归原作者。" href="https://xiaolinnote.com/ai/rag/1_whatisrag.html" >}}

网站不仅介绍这条流程，也讨论文档切分、检索优化，以及[如何评估回答效果](https://xiaolinnote.com/ai/rag/18_evaluation.html)。这让我意识到：做出一个能回答问题的演示，与做出一个可靠的知识库应用，中间还有不少工程问题。

## 我会怎样使用这个网站

如果要用这个网站学习，我会先挑与自己目标最相关的专题，每次只看一个问题：先不看答案，试着用自己的话解释；再读文章，找出遗漏的原理和场景；最后想想它能否对应到自己做过的项目。网站作者称题目来自实际面经，但我不会把任何一篇文章当成适用于所有公司的“标准答案”。面试更重要的是讲清自己做过什么、为什么这样选择，以及方案的局限。

## 为什么推荐

总的来说，我推荐小林面试笔记，不是因为它能让人快速背完“大模型八股”，而是因为它把许多抽象技术变成了具体、可追问的问题。对于刚接触 AI 应用、想梳理知识体系，或者准备相关岗位面试的人，这都是一个方便的起点。真正学会之后，我希望自己不仅能回答“这是什么”，也能回答“什么时候用、为什么用，以及出了问题怎么办”。
