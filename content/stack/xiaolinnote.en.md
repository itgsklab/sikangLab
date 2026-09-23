---
title: A Visual Guide to Xiaolin's AI Interview Notes
type: landing
article: true
article_parent: work
url: stack/work/xiaolinnote/
eyebrow: AI LEARNING
summary: A beginner-friendly look at learning LLMs, Agents, and RAG through questions and diagrams.
description: Explore Xiaolin's AI interview notes through five topic areas, Agent Q&A, and visual RAG explanations.
tags: [LLM, Agent, RAG, Learning Resources]
date: 2026-09-16
authors:
  - me
---

Interested in large language models but unsure where to begin? I recently explored [Xiaolin's AI interview notes](https://xiaolinnote.com/ai/). Despite the name, the site is useful far beyond interview preparation. For anyone trying to understand modern AI applications, it works as a learning map organized around concrete questions.

## Five topics provide a clear starting point

The site groups its material into five areas: LLM engineering, tool calling, RAG, Agents, and LangChain. LLM engineering explains how models and model-powered applications work. Tool calling covers how a model connects to external capabilities. RAG focuses on retrieving evidence before generating an answer. Agents go one step further by planning actions, using tools, and responding to results. The LangChain section looks at the surrounding development framework.

This structure lets me start with the part I do not understand instead of reading a large textbook from beginning to end.

{{< site-shot src="media/xiaolinnote-article/topic-overview.jpg" alt="The Xiaolin AI topic page lists Agent, RAG, tool calling, LLM engineering, and LangChain" caption="The topic page organizes the material into five directions, so I can begin with the subject that matters most to me. Screenshot taken on September 16, 2026." href="https://xiaolinnote.com/ai/" label="xiaolinnote.com/ai" loading="eager" >}}

## Questions reveal whether I truly understand

One feature I like is the simulated interview dialogue at the beginning of many articles. A short answer is followed by a more detailed explanation. In the article [“What is an Agent?”](https://xiaolinnote.com/ai/agent/1_whatisagent.html), the discussion first shows why describing an Agent as merely “an LLM that can call tools” is incomplete, then introduces planning, action, and feedback.

Even when I am not preparing for an interview, these questions help me test whether I can explain an idea in my own words instead of simply recognizing the terminology.

{{< site-shot src="media/xiaolinnote-article/agent-question.jpg" alt="A simulated interview dialogue about what makes an Agent more than a tool-calling model" caption="Each question starts with a common misunderstanding before moving into a concise answer and a deeper explanation. Screenshot taken on September 16, 2026." href="https://xiaolinnote.com/ai/agent/1_whatisagent.html" label="xiaolinnote.com/ai/agent" >}}

## RAG makes the engineering details visible

RAG is another useful topic. Suppose I want an AI assistant to answer questions about a company's internal documentation. The model's original training data will not contain the latest policy. RAG addresses this by finding relevant material first, then asking the model to answer with that material as context.

The original site compares this with an open-book exam: knowledge remains in external documents and is consulted when needed, rather than being written into model parameters every time something changes.

{{< article-image src="media/xiaolinnote-article/rag-open-book.webp" alt="A comparison between closed-book fine-tuning and open-book retrieval-augmented generation" caption="The closed-book and open-book comparison explains why RAG is well suited to knowledge that changes over time. Image from Xiaolin's interview notes; copyright belongs to the original author." href="https://xiaolinnote.com/ai/rag/1_whatisrag.html" >}}

The site also covers document chunking, retrieval improvements, and [answer evaluation](https://xiaolinnote.com/ai/rag/18_evaluation.html). That makes an important point: a demo that returns an answer is not yet a dependable knowledge application. Retrieval quality, supporting evidence, and failure handling all matter.

## How I would use the site

I would choose one topic connected to my current goal and study one question at a time. Before reading the answer, I would try to explain it myself. Then I would compare my explanation with the article, note the missing principles or scenarios, and connect the idea to a project I have actually built.

The questions may come from real interview experiences, but I would not treat any article as a universal script. A strong interview answer still needs to explain what I built, why I made particular choices, and where the limitations are.

## Why I recommend it

I recommend Xiaolin's notes because they turn abstract AI concepts into concrete questions that can be examined and followed up. The site is a practical starting point for newcomers, developers building an AI knowledge map, and candidates preparing for related roles.

The real goal is not only to answer “What is it?” but also “When should I use it?”, “Why does it work?”, and “What happens when it fails?”
