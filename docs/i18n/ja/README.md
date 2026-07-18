# AI駆動開発導入診断(AI-Driven Development Readiness)

[![Lint & Link Check](https://github.com/yunbow/ai-dev-readiness/actions/workflows/lint.yml/badge.svg)](https://github.com/yunbow/ai-dev-readiness/actions/workflows/lint.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../../LICENSE)

**デモ:** https://yunbow.github.io/ai-dev-readiness/

開発組織・プロジェクトの担当者が簡単なアンケートに回答するだけで、AI駆動開発への準備状況を可視化する静的Webアプリケーションです。

- **AI駆動開発スコア**(100点満点・5軸)
- **AI導入レベル**(Level 1〜5)
- **AI活用による推定開発工数削減率**(範囲表示・上限45%)
- 工程別AI適性 / 強み / 優先改善課題 / 導入ロードマップ
- スコア画像を添えたSNS共有

回答内容と診断結果はブラウザ内(LocalStorage / IndexedDB)だけで処理され、**外部には送信されません**。ログイン不要・無料です。

## 技術スタック

TypeScript / React 19 / Vite 8 / Tailwind CSS 4 / shadcn/ui / React Router(HashRouter)/ idb / html-to-image / Vitest

## 開発

```bash
cd app            # アプリのディレクトリへ移動
npm ci            # 依存関係のインストール
npm run dev       # 開発サーバー起動
npm run test      # 診断ロジックの単体テスト(Vitest)
npm run build     # 型チェック + 本番ビルド(dist/)
npm run preview   # ビルド結果のプレビュー
```

### E2Eスモークテスト

```bash
cd app
npx playwright install chromium   # 初回のみ
npm run build && npm run preview  # 別ターミナルで起動(ポート4173)
node tests/e2e-smoke.mjs
```

## デプロイ(GitHub Pages)

`main` ブランチへの push で `.github/workflows/deploy.yml` がテスト→ビルド→GitHub Pages への公開を実行します。
リポジトリの **Settings → Pages → Build and deployment → Source を「GitHub Actions」** に設定してください。
HashRouter + 相対 `base: "./"` のため、リポジトリ名に依存せず動作します。

## ディレクトリ構成

```text
app/src/
├─ app/             ルーティング・共通レイアウト
├─ pages/           6画面(トップ/診断選択/回答/結果/履歴/About)
├─ components/      assessment / result / share / charts / ui(shadcn)
├─ domain/
│  ├─ assessment/   診断エンジン(質問・採点・削減率・工程適性・改善提案)※React非依存・単体テスト対象
│  └─ history/      履歴レコード型
├─ infrastructure/  localStorage / IndexedDB / PNG画像生成
├─ hooks/ lib/ constants/
docs/design/        実装仕様書(採点仕様・UI仕様・改善提案カタログ)
```

## 診断ロジック

- 評価軸: ドキュメント・形式知化 25点 / 開発プロセス 25点 / 品質保証 20点 / AI利用体制 15点 / プロジェクト適性 15点
- 決定論的なルールベース採点(同じ回答には同じ結果)
- Git未使用など重大な欠落には総合スコアの上限制御あり
- 詳細は `docs/design/01-scoring-spec.md` を参照

## 注意事項

診断結果はアンケート回答に基づく推定値です。実際の削減効果は、システム規模、技術的負債、メンバーのスキル、AIツール、セキュリティ要件、導入範囲などによって異なります。

---

Languages: [English](../../../README.md) | 日本語 | [简体中文](../zh-CN/README.md) | [한국어](../ko/README.md) | [Español](../es/README.md)
