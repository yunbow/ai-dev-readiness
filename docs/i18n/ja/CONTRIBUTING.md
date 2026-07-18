# Contributing to AI-Driven Development Readiness

ご協力ありがとうございます。本プロジェクトへの貢献を歓迎します。

## 貢献の方法

### 不具合報告・機能要望

- [GitHub Issues](https://github.com/yunbow/ai-dev-readiness/issues) をご利用ください
- 再現手順、期待する動作、実際の動作を可能な範囲で記載してください

### Pull Request

1. リポジトリをFork
2. 作業用ブランチを作成
3. 変更を実施
4. 変更内容が分かるコミットメッセージを付けてコミット
5. Pull Requestを作成

### 開発環境のセットアップ

```bash
cd app
npm ci
npm run dev
```

### 変更前の確認

Pull Requestを送る前に、以下がすべて通ることを確認してください。

```bash
cd app           # アプリのディレクトリへ移動
npm run build   # 型チェック + ビルド
npm run test    # 単体テスト(Vitest)
```

診断ロジック(`app/src/domain/assessment/`)を変更する場合は、`docs/design/01-scoring-spec.md` の仕様との整合性を確認し、必要に応じて単体テストを追加してください。

### 多言語対応(i18n)

UIテキストは `app/src/i18n/locales/{ja,en,zh-CN,ko,es}.json` で管理しています。文言を追加・変更する場合は、5言語すべてのファイルを同時に更新してください。日本語(`ja.json`)が翻訳の基準です。

## Code of Conduct

敬意を持って、建設的に、そして誰もが参加しやすい態度でご協力ください。

---

Languages: [English](../../../CONTRIBUTING.md) | 日本語 | [简体中文](../zh-CN/CONTRIBUTING.md) | [한국어](../ko/CONTRIBUTING.md) | [Español](../es/CONTRIBUTING.md)
