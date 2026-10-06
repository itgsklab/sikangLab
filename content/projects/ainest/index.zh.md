---
title: AINest
date: 2026-10-06
weight: 1
featured: true
summary: 面向 AI 从业者的本地优先资讯工作台，聚合多源内容，并提供检索、分类、收藏、翻译和跨平台阅读。
project_type: AI 情报工作台
cover: media/projects/ainest-home.png
cover_alt: AINest AI 资讯工作台首页
repo_url: https://github.com/itgsklab/AINest
tags:
  - React
  - FastAPI
  - Electron
  - SQLite
---

AINest 是一个本地优先的 AI 资讯采集与阅读器，把分散的信息源整理成可以检索、筛选和持续追踪的个人情报工作台。

## 核心能力

- 从 RSS 与 Web 数据源采集内容，支持调度、主动发现和运行日志。
- 使用 SQLite 与 FTS5 提供本地存储和全文检索。
- 支持分类、收藏、稍后阅读、归档、备注、翻译、备份与恢复。
- 同时提供 React Web 前端与 Electron 桌面端，桌面版本可携带 Python 后端运行时。

## 工程实现

后端基于 FastAPI，前端使用 React、Vite 与 Tailwind CSS。项目包含 pytest、Vitest、ruff、Docker 和 GitHub Actions，并提供跨平台桌面构建流程。

[在 GitHub 查看 AINest 源码](https://github.com/itgsklab/AINest)

<!--more-->
