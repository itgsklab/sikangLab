---
title: "SkillsMP: A Place to Discover Skills for AI"
type: landing
article: true
article_parent: work
url: stack/work/skillsmp/
eyebrow: AI TOOLS
summary: A beginner-friendly introduction to Agent Skills and the open ecosystem mapped by SkillsMP.
description: Learn what Agent Skills are, how SkillsMP helps people discover them, and what to check before using community packages.
tags: [Agent Skills, AI Tools, SkillsMP, Guide]
date: 2026-09-12
authors:
  - me
---

While exploring AI tools, I recently found an interesting site called [SkillsMP](https://skillsmp.com/zh).

At first, the name “Skills Marketplace” made me imagine an app store where I could find a skill and install it with one click. After trying it, I found a better description: it is an open map of the AI skill ecosystem. It gathers Agent Skills scattered across GitHub and makes them easier to search, browse, and compare.

{{< site-shot src="media/skillsmp-article/01-skillsmp-home-20260913.jpg" alt="The Chinese SkillsMP homepage with a search box and topic shortcuts" caption="The SkillsMP homepage lets me search directly or start from areas such as education, marketing, and code review. Screenshot taken on September 13, 2026." href="https://skillsmp.com/zh" label="skillsmp.com/zh" loading="eager" >}}

## What is an Agent Skill?

We usually give an AI a direct request: write an article, review code, or analyze data. The same task can be completed in many ways, however. Repeating the workflow every time is tedious, and the result may be inconsistent.

An Agent Skill can be understood as a working guide for AI. It can explain:

- when the capability should be used;
- what steps to follow;
- what rules must be respected;
- what quality checks to perform;
- what scripts, templates, or references are available.

A Skill normally centers on a `SKILL.md` file and may include scripts, examples, templates, and specialist references. It does not give the model a new brain. It packages domain experience into a form the AI can follow repeatedly. [SkillsMP's documentation](https://skillsmp.com/zh/docs) describes it as reusable knowledge.

If a general AI is a capable new employee, a Skill is the role handbook, operating procedure, and checklist provided by the team.

## What problem does SkillsMP solve?

More people are publishing their workflows as Skills on GitHub, but the files are spread across a huge number of repositories. Ordinary search makes them difficult to discover.

SkillsMP collects and organizes public `SKILL.md` files. Users can search by keyword, purpose, creator, and professional field. The homepage also offers entry points for common tasks and groups results into areas such as development, business, tools, testing, and security.

{{< site-shot src="media/skillsmp-article/02-skillsmp-search-20260913.jpg" alt="SkillsMP search results for frontend design with filters and repository metadata" caption="A result page shows filters, source repositories, update times, and GitHub stars, making it easier to compare examples." href="https://skillsmp.com/zh/search?q=frontend%20design" label="skillsmp.com/zh/search" >}}

The site is useful not only for downloading a ready-made Skill. It also reveals which parts of professional work people are turning into AI-readable processes. Developers may publish code-review workflows, designers may capture interface standards, and marketers may document research and campaign-review methods.

## How I use the site

If I want an AI to help build a better interface, I might search for “frontend design” or “UI/UX.” On a Skill page I can see its GitHub repository, maintainer, recent activity, and the contents of its `SKILL.md`. Some pages also show supporting files and installation guidance.

{{< site-shot src="media/skillsmp-article/03-skillsmp-detail-20260913.jpg" alt="A SkillsMP detail page showing the source, update history, and installation instructions for a frontend design Skill" caption="Before going further, I check the repository source, recent activity, stars, and installation details." href="https://skillsmp.com/zh/creators/anthropics/skills/skills-frontend-design" label="skillsmp.com/zh/creators/anthropics/skills" >}}

I pay attention to four questions:

1. Is the task clearly defined?
2. How is the work broken into steps?
3. What quality checks are included?
4. What scripts, templates, or external tools does it reference?

Even if I do not install the Skill, its structure may help me design one that fits my own work.

## Are Skills and MCP the same thing?

They are easy to confuse at first. My simplest distinction is:

- A Skill mainly tells the AI **how to work**.
- MCP mainly tells the AI **what it can connect to**.

A market-research Skill can define the research steps, evaluation criteria, and report structure. MCP can connect the AI to a database, search service, or external system. The workflow and the tool interface complement each other.

## Stay careful before installing

SkillsMP indexes public GitHub repositories, but being indexed does not mean being certified. The platform does not guarantee the quality, security, or production readiness of every Skill, and it is an independent community project rather than an OpenAI or Anthropic service.

Before installing anything, I check the source repository and author, read unfamiliar scripts, review requested file and account permissions, look for ongoing maintenance, and decide whether the workflow fits my task. I never run an installation command blindly when it can access accounts, execute commands, or modify files.

## My overall impression

SkillsMP is more than a large search portal. It reflects a broader shift: people are beginning to package experience, judgment, and workflows into knowledge that AI can understand and repeat.

If general AI is a powerful computer, Agent Skills are the software and operating guides created for different jobs. SkillsMP is a growing catalog that shows what others are building—and encourages me to ask which parts of my own experience could become reusable AI capabilities.
