import type { AnswerOption, Answers, AxisId, ProcessId, ProfileQuestion, Question, Tier } from "./types";

const standard: AnswerOption[] = [
  { value: "sufficient", label: "十分に実施している", coefficient: 1 },
  { value: "partial", label: "一部実施している", coefficient: 0.6 },
  { value: "not_implemented", label: "実施していない", coefficient: 0 },
  { value: "unknown", label: "分からない", coefficient: 0.2, isUnknown: true },
];
const options = (items: [string, string, number, boolean?][]): AnswerOption[] => items.map(([value, label, coefficient, isUnknown]) => ({ value, label, coefficient, ...(isUnknown ? { isUnknown } : {}) }));
const q = (id: string, axis: Question["axis"], text: string, inQuick: boolean, inStandard: boolean, strengthText: string, extra: Partial<Question> = {}): Question => ({ id, axis, text, inQuick, inStandard, strengthText, options: standard, ...extra });

export const QUESTIONS: Question[] = [
  q("Q01", "project", "対象となる開発はどの種類ですか", true, true, "開発対象に応じたAI活用の見通しが立っている", { options: options([["new_development", "新規開発", 1], ["existing_feature_addition", "既存システムへの機能追加", .9], ["maintenance", "保守・運用中心", .6], ["legacy_renewal", "レガシーシステム刷新", .3], ["planning_phase", "開発前の企画・検討段階", .2]]) }),
  q("Q02", "project", "主な開発対象は何ですか", false, true, "AI支援と親和性の高い開発対象である", { options: options([["web", "Webアプリケーション", 1], ["mobile", "モバイルアプリ", .8], ["business_system", "業務システム", .8], ["api_backend", "API・バックエンド", 1], ["data_ml", "データ分析・機械学習", .6], ["embedded", "組込み・制御システム", .3], ["other", "その他", .5]]) }),
  q("Q03", "project", "使用技術は現在も広く利用されている一般的な技術ですか", false, true, "一般的な技術スタックを採用している", { options: options([["sufficient", "十分に該当する", 1], ["partial", "一部該当する", .6], ["not_implemented", "該当しない", 0], ["unknown", "分からない", .2, true]]) }),
  q("Q04", "project", "システム仕様を理解している担当者は複数人いますか", false, true, "仕様理解が複数人に共有されている", { teamShared: true, options: options([["multiple_people", "複数人が理解している", 1], ["partial_area", "一部領域のみ複数人が理解している", .6], ["single_person", "特定の担当者に依存している", .3], ["unknown", "分からない", .2, true]]) }),
  q("Q05", "document", "プロジェクトのREADMEや環境構築手順は整備されていますか", true, true, "READMEと環境構築手順が整備されている", { description: "プロジェクト概要、起動方法、環境変数、開発手順、テスト方法など" }),
  q("Q06", "document", "要件や仕様は、チャットや口頭以外の場所に整理されていますか", true, true, "要件・仕様が一元的に整理されている", { options: options([["organized", "Wiki、ドキュメント管理ツール、チケット等に整理されている", 1], ["partial", "一部のみ整理されている", .6], ["scattered", "主にExcel、メール、チャットに分散している", .3], ["rarely_exists", "ほとんど残っていない", 0]]) }),
  q("Q07", "document", "重要な設計判断や技術選定の理由が文書として残っていますか", true, true, "設計判断や技術選定の理由が文書化されている", { description: "ADR(Architecture Decision Record)などの形式に限らず、判断理由を後から確認できる状態を指します" }),
  q("Q08", "document", "コーディングガイドラインや命名規則がありますか", true, true, "コーディング規約が明文化されている"),
  q("Q09", "document", "API仕様や外部システム連携仕様が整理されていますか", false, true, "API・外部連携仕様が整理されている"),
  q("Q10", "document", "DB設計やデータ項目の意味が文書化されていますか", false, false, "DB設計とデータ定義が文書化されている"),
  q("Q11", "document", "業務ルールや例外処理が文書化されていますか", false, false, "業務ルールと例外処理が文書化されている"),
  q("Q12", "document", "過去の障害、注意事項、既知の問題を確認できる場所がありますか", false, false, "過去の障害や注意事項がナレッジ化されている", { hideCondition: { questionId: "Q01", valuesIn: ["new_development"] } }),
  q("Q13", "process", "ソースコードをGitで管理していますか", true, true, "Gitによるバージョン管理が定着している", { options: options([["all_git", "すべてGitで管理している", 1], ["partial_git", "一部のみGitで管理している", .6], ["other_tools", "Git以外またはファイル共有で管理している", 0], ["unknown", "分からない", .2, true]]) }),
  q("Q14", "process", "Gitのコミットメッセージにルールがありますか", false, false, "コミットメッセージの規約が定着している", { skipCondition: { questionId: "Q13", valuesIn: ["other_tools"] }, description: "変更目的が分かる、チケット番号が記載される、変更単位が適切であるなど" }),
  q("Q15", "process", "Pull RequestまたはMerge Requestによるレビューを行っていますか", true, true, "Pull Requestによるレビュー運用が定着している", { teamShared: true, skipCondition: { questionId: "Q13", valuesIn: ["other_tools"] } }),
  q("Q16", "process", "チケット管理ツールを使用していますか", true, true, "チケット管理が開発プロセスに定着している", { teamShared: true, description: "GitHub Issues、Jira、Backlog、Redmine、Azure DevOps、Linear など" }),
  q("Q17", "process", "チケットに目的、要件、完了条件が記載されていますか", true, true, "チケットに目的・要件・完了条件が記載されている", { teamShared: true }),
  q("Q18", "process", "開発タスクを数時間から数日程度の単位に分割できていますか", false, true, "開発タスクが適切な粒度に分割されている"),
  q("Q19", "process", "開発、レビュー、テスト、リリースの手順が定義されていますか", false, false, "開発からリリースまでの手順が定義されている"),
  q("Q20", "process", "CI/CDまたは自動ビルドの仕組みがありますか", true, true, "CI/CDまたは自動ビルドが整備されている"),
  q("Q33", "process", "小さな単位でのこまめなコミットや、問題発生時のロールバック・リバートの活用が定着していますか", false, true, "小さなコミットとロールバック運用が定着している", { skipCondition: { questionId: "Q13", valuesIn: ["other_tools"] }, description: "作業を小さい単位でコミットする、問題時にrevertや直前の状態へ戻す運用など" }),
  q("Q21", "qa", "自動テストがありますか", true, true, "自動テストが整備されている", { options: options([["multiple_types", "単体・結合・E2Eの複数種類がある", 1], ["some", "一部の自動テストがある", .6], ["rarely_any", "ほとんどない", 0], ["unknown", "分からない", .2, true]]) }),
  q("Q22", "qa", "変更後に実施すべき確認項目が明確ですか", false, true, "変更後の確認項目が明確になっている"),
  q("Q23", "qa", "コードレビューの基準がありますか", false, false, "コードレビュー基準が明文化されている", { teamShared: true }),
  q("Q24", "qa", "静的解析、Lint、型チェックを自動実行していますか", false, true, "静的解析・Lint・型チェックが自動化されている"),
  q("Q25", "qa", "本番反映前に人間による承認がありますか", false, true, "本番反映前の人間承認が定着している"),
  q("Q26", "qa", "機密情報や個人情報の取扱ルールがありますか", false, true, "機密情報・個人情報の取扱ルールが整備されている"),
  q("Q27", "ai", "AIコーディングツールを開発業務で使用していますか", false, true, "AIコーディングツールを継続的に活用している", { options: options([["continuous_team_use", "チームで継続利用している", 1], ["partial_members", "一部メンバーが利用している", .6], ["trial_only", "試験利用のみ", .3], ["not_used", "利用していない", 0]]) }),
  q("Q28", "ai", "AIに入力してよい情報と禁止情報が定義されていますか", true, true, "AIへの入力ルールが明確に定義されている"),
  q("Q29", "ai", "AIが生成したコードを人間がレビューするルールがありますか", false, true, "AI生成コードの人間レビューがルール化されている"),
  q("Q30", "ai", "AIに参照させるガイドラインや指示ファイルがありますか", false, true, "AI参照用のガイドライン・指示ファイルが整備されている", { description: "AGENTS.md、CLAUDE.md、Copilot instructions など" }),
  q("Q31", "ai", "AI利用の効果を測る指標がありますか", false, false, "AI利用効果を測定する指標がある"),
  q("Q32", "ai", "AI導入の責任者または推進担当者がいますか", false, false, "AI導入の推進体制が整っている", { teamShared: true }),
  q("Q34", "ai", "AIツールが、社内ドキュメントやコードベース、ナレッジベースなどの社内データを安全に参照できる状態になっていますか", false, true, "AIが社内データを安全に参照できる環境が整っている", { description: "リポジトリ内のドキュメント整備やツール連携などにより、機密情報の取扱ルールに従ってAIから参照できる状態を指します", options: options([["sufficient", "必要な社内データの多くを参照できる", 1], ["partial", "一部の社内データを参照できる", .6], ["not_implemented", "参照できる状態になっていない", 0], ["unknown", "分からない", .2, true]]) }),
];

export const AXIS_POINTS = { document: 25, process: 25, qa: 20, ai: 15, project: 15 } as const;
export const AXIS_LABELS: Record<AxisId, string> = { document: "ドキュメント・形式知化", process: "開発プロセス", qa: "品質保証", ai: "AI利用体制", project: "プロジェクト適性" };
export const PROCESS_LABELS: Record<ProcessId, string> = { requirements: "要件整理", design: "設計", implementation: "実装", code_review: "コードレビュー", testing: "テスト", documentation: "ドキュメント作成", release: "リリース", operations: "運用・障害対応" };
// 採点対象外のプロフィール質問(01-scoring-spec.md §3)
export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  { id: "P1", text: "この診断の対象となる開発体制の規模を教えてください", options: [
    { value: "solo", label: "個人開発(1人)" },
    { value: "small", label: "2〜5人のチーム" },
    { value: "large", label: "6人以上のチーム" },
  ] },
  { id: "P2", text: "金融・医療・公共など、規制やセキュリティ要件が特に厳しい領域の開発ですか", options: [
    { value: "yes", label: "該当する" },
    { value: "no", label: "該当しない" },
    { value: "unknown", label: "分からない" },
  ] },
];
export const applicableQuestions = (tier: Tier, answers: Answers): Question[] => QUESTIONS.filter((question) => {
  const enabled = tier === "quick" ? question.inQuick : question.inStandard;
  const excluded = [question.skipCondition, question.hideCondition].some((condition) => condition !== undefined && condition.valuesIn.includes(answers[condition.questionId] ?? ""));
  return enabled && !excluded;
});
export const coefficientOf = (questionId: string, answers: Answers): number | null => {
  const question = QUESTIONS.find((item) => item.id === questionId);
  const option = question?.options.find((item) => item.value === answers[questionId]);
  return option?.coefficient ?? null;
};
