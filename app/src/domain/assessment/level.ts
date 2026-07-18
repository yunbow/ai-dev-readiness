export type LevelInfo = { level: 1 | 2 | 3 | 4 | 5; name: string; summary: string; recommendedUses: string[] };
// 要件定義書 §14 のレベル定義
export const LEVELS: LevelInfo[] = [
  { level: 1, name: "Level 1:AI導入前の基盤整備が必要です", summary: "まずは開発の土台づくりから始めましょう。AIは学習や整理の相棒として活用できます。", recommendedUses: ["コード説明", "ドキュメント作成補助", "アイデア整理", "学習支援"] },
  { level: 2, name: "Level 2:限定的なAI支援が可能です", summary: "リスクの小さい範囲でAI支援を活用できます。", recommendedUses: ["小規模なコード生成", "テストケース案", "コードレビュー補助", "既存コードの説明"] },
  { level: 3, name: "Level 3:人間主導のAI開発が可能です", summary: "人間の管理のもとで、実務タスクにAIを活用できます。", recommendedUses: ["チケット単位の実装", "テストコード生成", "リファクタリング", "設計レビュー", "ドキュメント更新"] },
  { level: 4, name: "Level 4:AI駆動開発に適しています", summary: "レビューと品質保証の体制を活かして、AIに幅広い開発タスクを任せられます。", recommendedUses: ["AIによる機能実装", "複数ファイル変更", "テスト・レビューの自動化", "AIエージェントによるタスク実行"] },
  { level: 5, name: "Level 5:AIエージェント活用に適しています", summary: "品質ゲートを備えた継続的なAI駆動開発に取り組める状態です。", recommendedUses: ["複数エージェント運用", "要件から実装までの半自動化", "自動レビュー", "自動テスト", "品質ゲート付きの継続的AI開発"] },
];
export const levelForScore = (score: number): 1 | 2 | 3 | 4 | 5 => score < 30 ? 1 : score < 50 ? 2 : score < 70 ? 3 : score < 85 ? 4 : 5;
export const levelInfoForScore = (score: number): LevelInfo => LEVELS[levelForScore(score) - 1];
