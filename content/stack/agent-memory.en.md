---
title: "What I Learned from Big Tech's Agent Memory Systems: Remembering Is Not Saving Every Chat"
type: landing
article: true
article_parent: agent
url: stack/agent/agent-memory/
eyebrow: AGENT MEMORY
summary: Lessons from Anthropic, AWS, Meta, Microsoft, Tencent, and Alibaba on how agents selectively write, organize, retrieve, update, and forget.
description: A first-person guide to working memory, long-term memory, episodic and procedural memory, team memory, evaluation, and security for AI agents.
tags: [Agent Memory, Context Engineering, RAG, AI Agent]
date: 2026-10-07T00:00:00+08:00
authors:
  - me
---

Recently, I read engineering articles and product documentation about agent memory from Anthropic, AWS, Meta, Microsoft, Tencent, and Alibaba. At first, I thought the problem was mainly about helping a model remember for longer: put conversation history in a vector database, retrieve it later, and the job is done.

The more I read, the clearer it became that storage is the easy part. A long-running agent must keep answering harder questions. What deserves to be remembered, and what should be forgotten quickly? Should an experience become a raw event, a fact, a preference, or a reusable procedure? How should memories be isolated across users, tasks, and agents? Who updates an old conclusion when new evidence contradicts it? Could a poisoned memory trigger a harmful action days later?

I now think of agent memory as a continuously operating context-management system. It is not an infinite hard drive attached to a model. Its purpose is to place the most useful, trustworthy, and authorized information inside a limited attention budget at the right moment.

{{< site-shot src="media/agent-memory-article/01-flowchart-memory-lifecycle.png" alt="A lifecycle diagram in which conversations, tool results, and task events become structured memories that are selectively retrieved, updated, and forgotten" caption="My model of agent memory is not unlimited storage. It is a continuous loop of recording, extraction, organization, retrieval, updating, and forgetting." label="AGENT MEMORY LIFECYCLE" loading="eager" >}}

## Context windows, state, knowledge bases, and memory are different things

A language model does not persistently change merely because a conversation happened. For each inference, it sees instructions, messages, tool results, and retrieved material inside the current context window. Even a very large window is only the workspace available to one inference process; it is not cross-session memory.

I separate the surrounding concepts into four layers:

1. **The context window** is the model's current workbench. It is finite, and more content is not always better.
2. **Task state** records where the current job stands: plans, pending work, tool results, and checkpoints.
3. **A knowledge base** stores external facts and documents that usually do not change because of one user's interaction.
4. **Agent memory** extracts information from interactions and actions that may help in the future, then injects it when relevant.

Anthropic's guide to [context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) describes context as a finite attention budget. As the amount of content grows, a model's ability to focus on the important parts can degrade. The goal of memory is therefore not to replay the entire past, but to find the smallest high-signal set that supports the current decision.

This is also where memory is often confused with ordinary RAG. RAG commonly retrieves evidence from a relatively stable document collection. Memory is produced by the agent's own conversations, tasks, feedback, and tool use, and it must continuously be added, consolidated, corrected, and retired. Both rely on retrieval, but they govern different material at different update rhythms.

## The first shared pattern: short-term memory preserves events, long-term memory extracts meaning

[Amazon Bedrock AgentCore Memory](https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-memory-building-context-aware-agents/) draws a clear boundary. Short-term memory stores immutable events organized by actor and session, including messages, tool results, state changes, and checkpoints. Long-term memory asynchronously extracts preferences, facts, summaries, and important insights from those raw events so they can persist across sessions.

This made me see chat history as a raw log, not as finished memory. If a user changes a travel budget several times, long-term memory should not retain ten conflicting numbers. It should preserve the currently valid budget, its scope, update time, and source. [Memory in Microsoft Foundry Agent Service](https://devblogs.microsoft.com/foundry/introducing-memory-in-foundry-agent-service/) follows a similar cycle of extraction, consolidation, conflict handling, and selective retrieval instead of endlessly appending history.

Complete events still matter for replay, audit, and reprocessing. But what enters the model's context should be the selected and compressed result. Raw records answer “what happened”; long-term memory answers “what should remain useful later.”

## The second shared pattern: useful memory is structured, not merely larger

Microsoft Research's [PlugMem](https://www.microsoft.com/en-us/research/blog/from-raw-interaction-to-reusable-knowledge-rethinking-memory-for-ai-agents/) made a strong impression on me. The team argues that retrieving long interaction traces can flood the context with low-value material. More retained history may make the important signal harder to find. PlugMem converts dialogues, documents, and browsing traces into compact facts and reusable skills organized in a structured memory graph.

The important shift is that the unit of memory is no longer a text chunk but a knowledge unit that can support a decision. I find it useful to group memories into four rough types:

- **Semantic memory**: stable facts, user preferences, domain rules, and entity relationships.
- **Episodic memory**: what happened in a particular task, what actions were taken, and how it ended.
- **Procedural memory**: a successful workflow, troubleshooting routine, or reusable skill.
- **Working memory**: the current plan, temporary conclusions, open questions, and recent tool results.

Alibaba Cloud's [AgentLoop Memory module](https://www.alibabacloud.com/help/en/cms/cloudmonitor-2-0/memory-module-overview) likewise distinguishes strategies such as facts, episodic memory, and summaries, while combining vector search, reranking, and intelligent search. To me, this confirms that a vector database is only one low-level component. The real behavior comes from schemas, metadata, scopes, update policies, and retrieval strategies above it.

## The third shared pattern: long tasks need recoverable state, not only user preferences

Many memory demos revolve around facts like “the user prefers a window seat.” Production agents inside large technology teams often face a harder requirement: continuing useful work hours, days, or weeks later.

Meta's [Ranking Engineer Agent](https://engineering.fb.com/2026/03/17/ml-applications/ranking-engineer-agent-rea-autonomous-ai-system-accelerating-meta-ads-ranking-innovation/) manages machine-learning experiments that span days. After launching a training job, the agent hibernates, waits through a background system, and resumes with the plan, experiment state, and historical results intact. It remembers not only where it stopped, but also writes configurations, metrics, successes, and failures into a historical insight store that informs the next hypothesis.

Anthropic's [engineering pattern for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) uses a simpler mechanism: each agent session maintains a progress file, structured tasks, and Git commits, allowing the next session to continue from inspectable external state. Memory does not always require a sophisticated database. Files, logs, checkpoints, and version control can form a dependable external memory system.

Microsoft Research's [CORPGEN](https://www.microsoft.com/en-us/research/blog/corpgen-advances-ai-agents-for-real-work/) combines working memory, structured long-term memory, semantic memory, hierarchical planning, and isolated subagents. When an agent handles many tasks at once, forgetting is not the only danger; information from one task can contaminate another. Long-horizon memory must therefore preserve task boundaries, dependencies, and priorities.

## The fourth shared pattern: personal memory is becoming team and organizational memory

Agent memory was initially framed as a personalization feature. Recent cases show it becoming part of organizational knowledge engineering.

In Meta's [Organizational Second Brain](https://engineering.fb.com/2026/09/02/ml-applications/organizational-second-brain-ai-learns-from-experts/), the team does not ask a model to interpret a giant document collection from scratch on every run. Expert judgment is distilled into structured knowledge files, while “what the agent knows” is separated from “how it reasons.” Knowledge files declare applicability, dependencies, and references. An expert correction becomes organizational knowledge only after diagnosis, minimal edits, replay, regression testing, and human review. The goal is not to remember one answer; it is to turn one correction into a traceable, verified, reusable improvement.

Tencent's [Team Memory](https://developer.cloud.tencent.com/article/2722202) follows a similar asset-oriented pattern. Past sessions become Chat Memory, project documents become a Wiki, repositories become a CodeGraph, and successful troubleshooting or review workflows become Skills. Those assets are then selectively attached by team, role, agent, and task. This is closer to real collaboration than sharing one giant vector index because different roles should not receive the same complete information.

Once memory moves from individuals to teams, it becomes an organizational asset that needs ownership, versions, permissions, dependencies, review, and rollback.

{{< site-shot src="media/agent-memory-article/02-framework-memory-governance.png" alt="A governance architecture in which personal, task, team, and organizational memory provide different authorized subsets to role-specific agents" caption="Team memory cannot be a shared pool that every agent reads. It needs isolation, authorization, provenance, versioning, audit, and deletion." label="SCOPED MEMORY & GOVERNANCE" >}}

## The fifth shared pattern: forgetting and updating matter as much as remembering

A system that only appends will eventually fill with duplicates, contradictions, stale facts, and noise. Useful memory needs a lifecycle.

At a minimum, I want answers to five questions: Is this worth writing? How long is it valid? How are conflicting memories merged? When should an item be down-ranked or deleted? Should an audit trail remain after deletion? AWS supports retention periods for raw events and namespaces for isolating organizations, users, and memory types. Microsoft Foundry consolidates similar items and resolves conflicts. Alibaba's implementation updates a preference when it changes instead of continually appending alternatives.

Forgetting is therefore quality control, not a defect. A one-time verification code, an expired itinerary, a transient failure log, and a long-term coding preference should not share the same retention policy. Keeping everything forever is expensive and may violate privacy or compliance requirements.

## Stronger memory requires earlier security controls

Memory does more than store data. It changes how an agent behaves in the future.

Microsoft Security's research on [guarding AI memory](https://www.microsoft.com/en-us/security/blog/2026/06/22/guarding-ai-memory/) explains that without memory, an attacker often has to succeed inside one interaction. With persistent memory, malicious instructions can be planted first and triggered in a different context days later. The separation between exposure and execution makes memory poisoning harder for users to notice and harder for teams to investigate.

I would never allow a model to write everything it sees directly into long-term memory. A production system needs write-time filtering and provenance, isolation by user, tenant, and task, least-privilege access, sensitive-data detection, audit logs for reads and writes, and a way for users to inspect, correct, and delete personal memory. High-risk memories should require deterministic rules or human approval.

One principle is especially important: text read from a webpage, email, or document is external data. It does not automatically have permission to modify long-term memory. A memory write should be treated as a governed tool call, not as ordinary text processing.

## How I would design an agent memory system now

If I were starting from scratch, I would not begin with “unlimited memory.” I would build a minimal closed loop in this order:

1. **Define the objective**: should memory reduce repeated questions, resume long tasks, reuse experience, or personalize behavior?
2. **Define scopes**: separate user, agent, task, team, and organization by default.
3. **Retain raw events**: record messages, tool results, and state changes under session and task IDs with an appropriate TTL.
4. **Extract asynchronously**: turn events into facts, preferences, summaries, episodes, and skills while preserving provenance.
5. **Retrieve and rerank**: combine recency, relevance, importance, trust, and authorization, with strict injection limits.
6. **Resolve and forget**: merge, version, down-rank, expire, or delete conflicting and stale items.
7. **Evaluate behavior**: test task success, faulty tool calls, latency, cost, and user experience—not only retrieval accuracy.
8. **Add governance**: make memory inspectable, explainable, correctable, deletable, and auditable.

Microsoft's [STATE-Bench](https://opensource.microsoft.com/blog/2026/05/19/introducing-state-bench-a-benchmark-for-ai-agent-memory/) reminded me that memory evaluation cannot stop at “can the agent retrieve a name from fifty turns ago?” In realistic support, travel, and shopping tasks, what matters is whether the agent learns the right procedure, avoids repeated errors, changes system state correctly, and genuinely improves the user's experience.

## What is agent memory, really?

After reading these large-team practices, my answer is that agent memory is not a storage feature. It is an engineering mechanism that turns experience into evidence for future action.

It has to balance three tensions: remember enough without drowning attention; reuse experience without preserving errors and stale conclusions; share knowledge across sessions and agents without crossing user authorization or organizational boundaries.

A mature memory system does not recite every chat. It surfaces a small amount of genuinely useful information for the right task, at the right time, under the right permissions. When that information becomes wrong, the system can explain its source, correct it, and forget it safely.

## References

- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [AWS: Amazon Bedrock AgentCore Memory — Building context-aware agents](https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-memory-building-context-aware-agents/)
- [Meta Engineering: Ranking Engineer Agent](https://engineering.fb.com/2026/03/17/ml-applications/ranking-engineer-agent-rea-autonomous-ai-system-accelerating-meta-ads-ranking-innovation/)
- [Meta Engineering: An Organizational Second Brain](https://engineering.fb.com/2026/09/02/ml-applications/organizational-second-brain-ai-learns-from-experts/)
- [Microsoft Research: PlugMem](https://www.microsoft.com/en-us/research/blog/from-raw-interaction-to-reusable-knowledge-rethinking-memory-for-ai-agents/)
- [Microsoft Research: CORPGEN](https://www.microsoft.com/en-us/research/blog/corpgen-advances-ai-agents-for-real-work/)
- [Microsoft Open Source: STATE-Bench](https://opensource.microsoft.com/blog/2026/05/19/introducing-state-bench-a-benchmark-for-ai-agent-memory/)
- [Microsoft Security: Guarding AI memory](https://www.microsoft.com/en-us/security/blog/2026/06/22/guarding-ai-memory/)
- [Tencent Cloud: Team Memory](https://developer.cloud.tencent.com/article/2722202)
- [Alibaba Cloud: AgentLoop Memory module](https://www.alibabacloud.com/help/en/cms/cloudmonitor-2-0/memory-module-overview)

The sources above were accessed and checked on October 7, 2026. The synthesis of shared patterns is my own and does not represent a unified position of the companies cited.
