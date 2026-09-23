---
title: "What I Learned from Big Tech's Vibe Coding Practices: It Is More Than ‘Coding by Talking’"
type: landing
article: true
article_parent: work
url: stack/work/vibe-coding/
eyebrow: AI CODING
summary: A practical explanation of Vibe Coding through engineering lessons from Google, Meta, GitHub, Anthropic, Alibaba, Tencent, ByteDance, and Vercel.
description: A first-person guide to Vibe Coding, covering prototypes, specifications, repository context, testing, security, and production delivery.
tags: [Vibe Coding, AI Coding, Coding Agent, Engineering]
date: 2026-09-23
authors:
  - me
---

Recently, I read a concentrated set of articles about Vibe Coding. They included engineering posts from Google, Meta, GitHub, Anthropic, and Vercel, as well as public write-ups from Taote, Tencent CloudBase, and ByteDance's TRAE design team. My biggest takeaway was surprisingly consistent: people may talk about “writing code with natural language,” but once the work becomes real engineering, their attention returns to familiar questions. Is the requirement clear? Is the context complete? How will the result be verified? Are permissions constrained? Who is accountable when something fails?

That is why I now see Vibe Coding as a fast way to explore software, not as a replacement for software engineering. It lowers the barrier between an idea and a running program. The closer that program gets to real users and real business, however, the less engineering discipline can be skipped.

{{< site-shot src="media/vibe-coding-article/vibe-coding-loop.png" alt="An illustration of the Vibe Coding loop from a natural-language idea to AI-generated code, a running preview, test feedback, and another iteration" caption="My model of Vibe Coding is not one-shot generation. It is a fast loop of describe, generate, run, verify, and describe again." label="VIBE CODING LOOP" loading="eager" >}}

## What exactly is Vibe Coding?

Andrej Karpathy popularized the term in a public post in February 2025. He described a state in which you almost “forget that the code even exists”: you state what you want in natural language, the model generates and edits the code, you watch the result, and then you tell the model what should change.

In that original sense, Vibe Coding is not the same as every form of AI-assisted programming. Asking AI to complete a function, explain an error, or write a unit test can still fit inside ordinary software development. Vibe Coding more strongly emphasizes handing implementation details to the model and moving through a describe-run-observe-describe loop.

That distinction matters. It explains why Vibe Coding works so well for weekend projects, interface sketches, and rapid prototypes: in those settings I can first ask whether the idea can run, then decide whether it deserves more investment. But if I am changing payments, permissions, data migrations, or a large existing system, a page that merely looks correct is obviously not enough.

## The first pattern I found: turning ideas into prototypes faster

Google's developer team combined the Agent Development Kit with Gemini CLI and supplied framework context through a compressed, model-oriented `llms-full.txt`. The point was not to let the model guess APIs. The team first placed the right components, conventions, and examples into context, then asked it to create an agent from a high-level requirement. [Google's article](https://developers.googleblog.com/simplify-agent-building-adk-gemini-cli/) explains how this reduces documentation lookup and context switching so developers can reach a working prototype sooner.

The [public practice shared by ByteDance's TRAE design team](https://developer.volcengine.com/articles/7563898752441073706) is equally revealing. The designers did not stop at “make me a premium-looking page.” They named React, Vite, Tailwind, and Framer Motion, then broke the work down and refined the structure and visual details step by step. To me, that shows that coding “by vibe” does not mean working without constraints. Aesthetic judgment can remain intuitive while the task handed to the model stays concrete.

The most immediate value is that product, design, and engineering can see and use something interactive much earlier. A discussion that once stayed in prose or static mockups can begin with a generated version whose real behavior exposes missing assumptions. At this stage, the generated code is better treated as a medium for discussion than as a finished product.

## The second pattern: moving from Vibe Coding to specifications

When the task moves from a greenfield prototype to a codebase that must be maintained, teams quickly encounter the same problem: a model can generate a great deal of code without understanding the actual business intent.

In its introduction to [Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/), GitHub says directly that Vibe Coding is useful for rapid prototyping but is not reliable enough for critical applications and existing systems. Its proposed direction is spec-driven development: define the problem, constraints, plan, and tasks before the agent implements them. Natural language does not disappear; an improvised prompt becomes a specification that can be reviewed, tracked, and verified.

Taote's shopping-guide team describes a similar evolution in [AI Coding Practice: From Vibe Coding to SDD](https://developer.aliyun.com/article/1709229). They moved from completion to agentic coding, then added Rules and experimented with Specification Driven Development. They do not present SDD as a universal answer. The article acknowledges legacy-code adoption, tooling maturity, and rollout costs, and settles on a hybrid of lightweight technical plans, rule constraints, agent implementation, and consolidated architecture documentation.

I agree with this refusal to chase methodological purity. Real teams rarely need an elegant but heavy theory. They need a workflow people will keep using and one that lets them trace what happened when something goes wrong.

## The third pattern: teach the agent the codebase first

When AI writes the wrong code, the problem is often not syntax. The model simply does not know the conventions that were never documented.

In an [engineering article about large-scale data pipelines](https://engineering.fb.com/2026/04/06/developer-tools/how-meta-used-ai-to-map-tribal-knowledge-in-large-scale-data-pipelines/), Meta describes a system spanning four repositories, three languages, and more than four thousand files. Instead of writing ever-longer temporary prompts, the team used multiple agents to map the structure and tribal knowledge, produced compact context files, and improved quality through independent review passes. Their principle was “a compass, not an encyclopedia”: context should help an agent find the entry point, dependencies, and danger zones rather than dump every available document into the prompt.

[Anthropic's Claude Code practices](https://www.anthropic.com/engineering/claude-code-best-practices) also treat context as infrastructure. The team recommends keeping common commands, core files, coding conventions, testing instructions, and collaboration rules in the repository, then following an explore-plan-code-commit rhythm. Asking an agent to read and plan before it edits is usually more reliable than telling it to change code immediately.

This made me realize that a team's key Coding Agent asset may be neither the model nor the editor. It may be a continuously maintained, machine-readable description of how the system works. Knowledge that used to exist only in senior engineers' heads has to be written down; otherwise the agent can do little more than guess from the code.

## The fourth pattern: faster generation requires faster verification

AI can generate a large volume of code in minutes, but reviewers do not suddenly read faster. As generation accelerates, mistakes can enter the system faster too.

One workflow Anthropic recommends is to write tests first, confirm that they fail, and then ask the agent to implement until they pass—without allowing it to edit the tests merely to turn them green. After accelerating agentic coding, Meta has also explored generating tests just in time for a change. These practices point to the same fact: agents perform best when the environment gives them explicit feedback. Tests, type checks, static analysis, and runtime logs form that feedback loop.

Automated tests are still not the final answer. They prove only the assertions someone wrote; they do not prove that the requirement itself is correct. Architecture tradeoffs, data risk, user experience, and business boundaries still require human judgment. I therefore treat “all tests pass” as one minimum condition for human review, not as permission to ship without thinking.

## The fifth pattern: an entire infrastructure layer separates “it runs” from “it ships”

In posts introducing [OpenVibeCoding](https://cloudbase.cloud.tencent.com/blog/2026/05/26/openvibecoding) and its [platform infrastructure](https://cloudbase.cloud.tencent.com/blog/2026/06/03/vibe-coding-cloudbase), Tencent CloudBase breaks the problem into concrete pieces. An agent needs a recoverable runtime and an isolated sandbox. An application needs a database, authentication, storage, and hosting. A multi-user platform needs tenant isolation, permissions, and billing. Long-running work needs state, events, interruption, and recovery.

Vercel makes a similar distinction between rapid generation and production delivery in [its introduction to the new v0](https://vercel.com/blog/introducing-the-new-v0). Most enterprise work happens inside existing codebases. A prototype detached from existing configuration, permissions, and deployment environments may ultimately need to be rebuilt. “Shadow IT” is another danger: employees can generate applications quickly, but they can also publish credentials, company data, or vulnerable code just as quickly.

This breaks the fantasy that software is finished once the model can write code. A production application still has to answer basic questions: Where are secrets stored? Who can read the data? Which commands may the agent execute? Can a failed run recover? Are logs traceable? Is spending capped? None of these questions disappears because generating the interface took ten minutes.

{{< site-shot src="media/vibe-coding-article/production-guardrails.png" alt="An engineering illustration in which an AI prototype passes through specifications, repository context, tests, a permission sandbox, and monitoring before becoming a production application" caption="Specifications, context, tests, isolation, and observability are the engineering guardrails between a prototype and production." label="FROM PROTOTYPE TO PRODUCTION" >}}

## How I use Vibe Coding now

Based on these teams' experience, I divide work into three levels.

The first is exploration. For one-off scripts, interactive prototypes, and small personal tools, I use the conversational loop aggressively to test ideas. The priorities are a clear goal, frequent execution, and avoiding real sensitive data.

The second is a maintainable project. Once the code must continue evolving, I add requirements, directory conventions, technical boundaries, and tests. The agent reads before it edits, and each change remains small enough for me to understand the diff and verify it independently.

The third is a production system. When users' data, money, permissions, or core business processes are involved, I treat the agent as a very fast collaborator—not as the final accountable party. Isolation, least privilege, code review, automated tests, monitoring, and rollback do not become optional because AI wrote the code.

## Will Vibe Coding replace programmers?

After reading these articles, my answer is that it first replaces some of the mechanical work between an idea and its first runnable version—not the person responsible for defining and owning the problem.

The center of gravity in programming is shifting. Hand-writing every line may matter less, while defining problems, decomposing tasks, organizing context, designing verification, and judging risk matter more. Someone who cannot traditionally code can create prototypes that were previously out of reach. An experienced engineer can use an agent to cross languages and frameworks faster. Both gain creative leverage, and both inherit more room for misuse.

If I look only at demos, Vibe Coding resembles “coding by talking.” If I look at the practices of major technology teams, it looks more like a redistribution of software work: people concentrate on intent, constraints, and acceptance; agents handle search, generation, editing, and repetition. Maturity does not mean humans stop reading code. It means the team can still prove the result, limit its permissions, and take responsibility for what reaches production—even when generation becomes much faster.

## References

- [Google Developers: Simplify your Agent “vibe building” flow with ADK and Gemini CLI](https://developers.googleblog.com/simplify-agent-building-adk-gemini-cli/)
- [Meta Engineering: How Meta Used AI to Map Tribal Knowledge in Large-Scale Data Pipelines](https://engineering.fb.com/2026/04/06/developer-tools/how-meta-used-ai-to-map-tribal-knowledge-in-large-scale-data-pipelines/)
- [GitHub Blog: Spec-driven development with AI](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [Anthropic Engineering: Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Anthropic Engineering: Beyond permission prompts: making Claude Code more secure and autonomous](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [Vercel: Introducing the new v0](https://vercel.com/blog/introducing-the-new-v0)
- [Taote: AI Coding Practice — From Vibe Coding to SDD](https://developer.aliyun.com/article/1709229)
- [Tencent CloudBase: We Open-Sourced a Complete Vibe Coding Platform](https://cloudbase.cloud.tencent.com/blog/2026/05/26/openvibecoding)
- [Tencent CloudBase: Redesigning the Cloud for Agents](https://cloudbase.cloud.tencent.com/blog/2026/06/03/vibe-coding-cloudbase)
- [How the TRAE Design Team Uses Vibe Coding](https://developer.volcengine.com/articles/7563898752441073706)

The sources above were accessed and checked on September 23, 2026. The synthesis of shared trends is my own and does not represent a unified position of the companies cited.
