# Contributing to AI-Driven Development Readiness

Thank you for your interest in contributing. Contributions to this project are welcome.

## How to Contribute

### Bug Reports & Feature Requests

- Please use [GitHub Issues](https://github.com/yunbow/ai-dev-readiness/issues)
- Include reproduction steps, expected behavior, and actual behavior where possible

### Pull Requests

1. Fork the repository
2. Create a working branch
3. Make your changes
4. Commit with a message that clearly describes the change
5. Open a Pull Request

### Setting Up the Development Environment

```bash
cd app
npm ci
npm run dev
```

### Before Submitting

Before sending a Pull Request, make sure all of the following pass.

```bash
cd app           # move into the app directory
npm run build   # type check + build
npm run test    # unit tests (Vitest)
```

If you change the diagnosis logic (`app/src/domain/assessment/`), verify consistency with the spec at `docs/design/01-scoring-spec.md` and add unit tests as needed.

### Internationalization (i18n)

UI text is managed in `app/src/i18n/locales/{ja,en,zh-CN,ko,es}.json`. When adding or changing text, update all 5 language files at the same time. Japanese (`ja.json`) is the reference for translation.

## Code of Conduct

Please contribute respectfully, constructively, and in a way that keeps this project welcoming to everyone.

---

Languages: English | [日本語](docs/i18n/ja/CONTRIBUTING.md) | [简体中文](docs/i18n/zh-CN/CONTRIBUTING.md) | [한국어](docs/i18n/ko/CONTRIBUTING.md) | [Español](docs/i18n/es/CONTRIBUTING.md)
