# AI驱动开发导入诊断(AI-Driven Development Readiness)

[![Lint & Link Check](https://github.com/yunbow/ai-dev-readiness/actions/workflows/lint.yml/badge.svg)](https://github.com/yunbow/ai-dev-readiness/actions/workflows/lint.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../../LICENSE)

**演示:** https://yunbow.github.io/ai-dev-readiness/

这是一个静态Web应用程序，只需开发组织或项目负责人回答简单的问卷，即可将其对AI驱动开发的准备程度可视化。

- **AI驱动开发评分**(满分100分，5个维度)
- **AI导入等级**(Level 1〜5)
- **通过AI应用可预估的开发工时削减率**(以区间形式显示，上限45%)
- 工程别AI适用性 / 优势 / 优先改进事项 / 导入路线图
- 附带评分图片的社交媒体分享

您的回答内容和诊断结果仅在浏览器内(LocalStorage / IndexedDB)处理，**不会发送到外部**。无需登录，完全免费。

## 技术栈

TypeScript / React 19 / Vite 8 / Tailwind CSS 4 / shadcn/ui / React Router(HashRouter)/ idb / html-to-image / Vitest

## 开发

```bash
cd app            # 进入 app 目录
npm ci            # 安装依赖
npm run dev       # 启动开发服务器
npm run test      # 诊断逻辑的单元测试(Vitest)
npm run build     # 类型检查 + 生产环境构建(dist/)
npm run preview   # 预览构建结果
```

### 端到端(E2E)冒烟测试

```bash
cd app
npx playwright install chromium   # 仅首次需要
npm run build && npm run preview  # 在另一个终端中启动(端口4173)
node tests/e2e-smoke.mjs
```

## 部署(GitHub Pages)

推送到 `main` 分支时，`.github/workflows/deploy.yml` 会依次执行测试→构建→发布到 GitHub Pages。
请将仓库的 **Settings → Pages → Build and deployment → Source 设置为「GitHub Actions」**。
由于采用了 HashRouter 和相对路径 `base: "./"`，因此不依赖仓库名称即可正常运行。

## 目录结构

```text
app/src/
├─ app/             路由与通用布局
├─ pages/           6个页面(首页/诊断选择/回答/结果/历史记录/About)
├─ components/      assessment / result / share / charts / ui(shadcn)
├─ domain/
│  ├─ assessment/   诊断引擎(问题・评分・削减率・工程适用性・改进建议)※不依赖React・单元测试对象
│  └─ history/      历史记录类型
├─ infrastructure/  localStorage / IndexedDB / PNG图片生成
├─ hooks/ lib/ constants/
docs/design/        实现规格说明书(评分规格・UI规格・改进建议目录)
```

## 诊断逻辑

- 评估维度: 文档化与知识固化 25分 / 开发流程 25分 / 质量保证 20分 / AI应用体制 15分 / 项目适配性 15分
- 确定性的基于规则的评分(相同的回答始终得到相同的结果)
- 若存在未使用Git等重大缺失项，将对总分设置上限
- 详见 `docs/design/01-scoring-spec.md`

## 注意事项

诊断结果是基于问卷回答得出的估算值。实际的削减效果会因系统规模、技术债务、成员技能、AI工具、安全要求、导入范围等因素而有所不同。

---

Languages: [English](../../../README.md) | [日本語](../ja/README.md) | 简体中文 | [한국어](../ko/README.md) | [Español](../es/README.md)
