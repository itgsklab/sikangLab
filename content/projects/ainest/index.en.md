---
title: AINest
date: 2026-10-06
weight: 1
featured: true
summary: A local-first intelligence workspace for AI practitioners, combining multi-source collection, search, organization, translation, and cross-platform reading.
project_type: AI intelligence workspace
cover: media/projects/ainest-home.png
cover_alt: AINest AI intelligence workspace home screen
repo_url: https://github.com/itgsklab/AINest
tags:
  - React
  - FastAPI
  - Electron
  - SQLite
---

AINest is a local-first AI news collector and reader that turns scattered sources into a searchable, filterable, and continuously updated personal intelligence workspace.

## Core capabilities

- Collects RSS and web sources with scheduling, active discovery, and run logs.
- Uses SQLite and FTS5 for local storage and full-text search.
- Supports categories, favorites, read-later, archives, notes, translation, backup, and restore.
- Ships with a React web interface and an Electron desktop client that can bundle its Python backend runtime.

## Engineering

The backend uses FastAPI, while the frontend is built with React, Vite, and Tailwind CSS. The repository includes pytest, Vitest, ruff, Docker, GitHub Actions, and cross-platform desktop packaging workflows.

[View AINest on GitHub](https://github.com/itgsklab/AINest)

<!--more-->
