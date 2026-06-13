---
title: DeepSeek Usage
description: A self-hosted dashboard for visualising DeepSeek AI API usage — daily costs, token consumption, cache hit rates, and per-key breakdowns
created: 2026-06-13
thumbnail: "deepseek-usage.jpg"
icon: "deepseek-usage-icon.png"
tags:
  - web
  - dashboard
  - api
  - nodejs
  - analytics
  - tool
livePreviewUrl: https://shajanjacob.com/deepseek-usage/
sourceCodeUrl: https://github.com/shajanjp/deepseek-usage/
---

A self-hosted dashboard for visualising your DeepSeek AI API usage — daily costs, token consumption, cache hit rates, and per-key breakdowns. Data is fetched directly from the [DeepSeek Platform API](https://platform.deepseek.com) and rendered client-side.

<img src="./deepseek-usage.jpg" alt="DeepSeek Usage Dashboard desktop screenshot" style="height: auto; width: 100%;">

## Features

- **Daily cost & token usage** — see how many tokens you're using (input, output, cached) and what it costs, day by day.
- **Cache hit rate tracking** — monitor how effectively your prompts hit the context cache.
- **Per-API-key breakdown** — compare usage across multiple API keys.
- **Drag & drop CSV import** — upload exported CSV files directly in the browser (works offline).
- **Live data from DeepSeek** — the backend proxies the DeepSeek API so you never expose your bearer token to the frontend.
- **Static HTML dashboard** — no build step, no framework, no JavaScript bundler. Just open and go.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A DeepSeek API bearer token from [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)
- `unzip` on your system (macOS / Linux — available by default)

![Mobile dashboard](./deepseek-usage-mobile.jpg)
