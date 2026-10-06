---
title: Remove Watermark
date: 2026-10-06
weight: 2
featured: true
summary: A local-first watermark processing tool for DOCX, PDF, CodeCV resumes, and images, with confirmation, source preservation, and output validation built into the workflow.
project_type: Local file-processing tool
cover: media/projects/remove-watermark-home.jpg
cover_alt: Remove Watermark local file-processing home screen
repo_url: https://github.com/itgsklab/Remove-Watermark
tags:
  - Vue 3
  - FastAPI
  - OpenCV
  - PyMuPDF
---

Remove Watermark is a local-first watermark processing tool for DOCX, PDF, CodeCV resumes, and PNG, JPEG, or WebP images.

## Core capabilities

- Performs a read-only scan before asking the user to confirm candidates and affected areas.
- Handles DOCX VML text watermarks, CodeCV PDFs, selected regions in general PDFs, and masks on static images.
- Always creates a new output copy instead of overwriting the source, then validates document structure or unaffected pixels.
- Runs work in isolated workers with task history, cancellation, recovery, and local retention policies.

## Engineering

The frontend uses Vue 3, TypeScript, Vite, Pinia, and PDF.js. The backend is built with FastAPI, SQLite, PyMuPDF, Pillow, NumPy, and OpenCV. The service listens on localhost by default and can also be packaged as a desktop preview application.

[View Remove Watermark on GitHub](https://github.com/itgsklab/Remove-Watermark)

<!--more-->
