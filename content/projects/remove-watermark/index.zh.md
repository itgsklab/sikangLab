---
title: Remove Watermark
date: 2026-10-06
weight: 2
featured: true
summary: 面向 DOCX、PDF、CodeCV 简历和图片的本地优先水印处理工具，强调处理前确认、原件保留与结果校验。
project_type: 本地文件处理工具
cover: media/projects/remove-watermark-home.jpg
cover_alt: Remove Watermark 本地文件处理首页
repo_url: https://github.com/itgsklab/Remove-Watermark
tags:
  - Vue 3
  - FastAPI
  - OpenCV
  - PyMuPDF
---

Remove Watermark 是一个本地优先的水印处理工具，面向 DOCX、PDF、CodeCV 简历以及 PNG、JPEG、WebP 图片。

## 核心能力

- 上传后先进行只读扫描，再让用户确认候选项与影响范围。
- 支持 DOCX VML 文字水印、CodeCV PDF、通用 PDF 框选区域和静态图片蒙版处理。
- 始终生成新的结果副本，不覆盖原始文件，并在输出后重新执行结构或像素级校验。
- 任务在独立 worker 中运行，支持记录、取消、恢复和本地产物保留策略。

## 工程实现

前端使用 Vue 3、TypeScript、Vite、Pinia 与 PDF.js；后端基于 FastAPI、SQLite、PyMuPDF、Pillow、NumPy 和 OpenCV。服务默认仅监听本机地址，也支持构建桌面预览包。

[在 GitHub 查看 Remove Watermark 源码](https://github.com/itgsklab/Remove-Watermark)

<!--more-->
