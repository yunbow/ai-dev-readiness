# 为 AI-Driven Development Readiness 做贡献

感谢您有兴趣为本项目做出贡献，我们欢迎任何形式的贡献。

## 贡献方式

### 缺陷报告・功能请求

- 请使用 [GitHub Issues](https://github.com/yunbow/ai-dev-readiness/issues)
- 请尽可能提供复现步骤、预期行为和实际行为

### Pull Request

1. Fork 本仓库
2. 创建工作分支
3. 进行修改
4. 使用能说明变更内容的提交信息进行提交
5. 创建 Pull Request

### 搭建开发环境

```bash
cd app
npm ci
npm run dev
```

### 提交前检查

发送 Pull Request 之前，请确认以下命令均能顺利通过。

```bash
cd app           # 进入 app 目录
npm run build   # 类型检查 + 构建
npm run test    # 单元测试(Vitest)
```

如果修改诊断逻辑(`app/src/domain/assessment/`)，请确认与 `docs/design/01-scoring-spec.md` 规格的一致性，并根据需要添加单元测试。

### 多语言支持(i18n)

界面文本由 `app/src/i18n/locales/{ja,en,zh-CN,ko,es}.json` 统一管理。新增或修改文案时，请同时更新全部 5 种语言的文件。日语(`ja.json`)是翻译的基准。

## 行为准则

请以尊重、建设性的态度参与协作，并让每个人都能轻松加入本项目。

---

Languages: [English](../../../CONTRIBUTING.md) | [日本語](../ja/CONTRIBUTING.md) | 简体中文 | [한국어](../ko/CONTRIBUTING.md) | [Español](../es/CONTRIBUTING.md)
