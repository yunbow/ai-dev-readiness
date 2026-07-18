# AI-Driven Development Readiness

[![Lint & Link Check](https://github.com/yunbow/ai-dev-readiness/actions/workflows/lint.yml/badge.svg)](https://github.com/yunbow/ai-dev-readiness/actions/workflows/lint.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Demo:** https://yunbow.github.io/ai-dev-readiness/

A static web application that visualizes how ready a development organization or project is for AI-driven development, based on answers to a short questionnaire.

- **AI-Driven Development Score** (out of 100, across 5 axes)
- **AI Adoption Level** (Level 1–5)
- **Estimated development effort reduction from AI adoption** (shown as a range, capped at 45%)
- AI suitability by process / strengths / priority improvements / adoption roadmap
- Social sharing with a score image attached

Your answers and results are processed entirely within your browser (LocalStorage / IndexedDB) — **nothing is sent externally**. No login required, and it's free.

## Tech Stack

TypeScript / React 19 / Vite 8 / Tailwind CSS 4 / shadcn/ui / React Router (HashRouter) / idb / html-to-image / Vitest

## Development

```bash
cd app            # move into the app directory
npm ci            # Install dependencies
npm run dev       # Start the dev server
npm run test      # Unit tests for the diagnosis logic (Vitest)
npm run build     # Type check + production build (dist/)
npm run preview   # Preview the build output
```

### E2E Smoke Test

```bash
cd app
npx playwright install chromium   # first time only
npm run build && npm run preview  # start in another terminal (port 4173)
node tests/e2e-smoke.mjs
```

## Deployment (GitHub Pages)

Pushing to the `main` branch runs `.github/workflows/deploy.yml`, which tests, builds, and publishes to GitHub Pages.
Please set the repository's **Settings → Pages → Build and deployment → Source to "GitHub Actions"**.
Thanks to HashRouter and a relative `base: "./"`, it works regardless of the repository name.

## Directory Structure

```text
app/src/
├─ app/             Routing and shared layout
├─ pages/           6 screens (home / assessment select / answers / result / history / About)
├─ components/      assessment / result / share / charts / ui (shadcn)
├─ domain/
│  ├─ assessment/   Diagnosis engine (questions, scoring, reduction rate, process suitability, recommendations) — framework-agnostic, unit tested
│  └─ history/      History record types
├─ infrastructure/  localStorage / IndexedDB / PNG image generation
├─ hooks/ lib/ constants/
docs/design/        Implementation specs (scoring spec, UI spec, recommendation catalog)
```

## Diagnosis Logic

- Evaluation axes: Documentation & Knowledge Formalization 25 pts / Development Process 25 pts / Quality Assurance 20 pts / AI Usage Framework 15 pts / Project Suitability 15 pts
- Deterministic rule-based scoring (the same answers always produce the same result)
- Serious gaps such as not using Git cap the overall score
- See `docs/design/01-scoring-spec.md` for details

## Disclaimer

The diagnosis result is an estimate based on your questionnaire answers. Actual effort reduction varies depending on system scale, technical debt, team skill level, AI tools used, security requirements, adoption scope, and other factors.

---

Languages: English | [日本語](docs/i18n/ja/README.md) | [简体中文](docs/i18n/zh-CN/README.md) | [한국어](docs/i18n/ko/README.md) | [Español](docs/i18n/es/README.md)
