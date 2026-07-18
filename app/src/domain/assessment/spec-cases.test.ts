import { describe, expect, it } from "vitest";
import { QUESTIONS, applicableQuestions } from "./questions";
import { diagnose } from "./diagnose";
import { scoreAssessment } from "./scoring";
import type { Answers, Profile } from "./types";

const profile: Profile = { teamSize: "small", regulatedIndustry: false };

const allBest = (): Answers =>
  Object.fromEntries(QUESTIONS.map((q) => [q.id, [...q.options].sort((a, b) => b.coefficient - a.coefficient)[0].value]));
const allWorst = (): Answers =>
  Object.fromEntries(QUESTIONS.map((q) => [q.id, [...q.options].sort((a, b) => a.coefficient - b.coefficient)[0].value]));

describe("上限制御(個別・複数)", () => {
  const capCases: [string, Answers, number][] = [
    ["no_git", { Q13: "other_tools" }, 49],
    ["no_ticket_mgmt", { Q16: "not_implemented" }, 59],
    ["no_human_review", { Q25: "not_implemented" }, 59],
    ["no_ai_input_rule", { Q28: "not_implemented" }, 69],
    ["no_spec_docs", { Q06: "rarely_exists" }, 49],
    ["no_test_and_check", { Q21: "rarely_any", Q22: "not_implemented" }, 59],
  ];
  for (const [id, overrides, cap] of capCases) {
    it(`${id} 単独発動で上限 ${cap} 点`, () => {
      const answers = { ...allBest(), ...overrides };
      const result = scoreAssessment("standard", answers, profile);
      expect(result.triggeredCapIds).toEqual([id]);
      expect(result.totalScore).toBe(cap);
      expect(result.rawScore).toBeGreaterThan(cap);
    });
  }
  it("複数該当時は最小の上限を適用する", () => {
    const answers = { ...allBest(), Q13: "other_tools", Q16: "not_implemented" };
    const result = scoreAssessment("standard", answers, profile);
    expect(result.totalScore).toBe(49);
  });
});

describe("境界値", () => {
  it("全問最低回答で project 以外の軸が 0 になる", () => {
    const result = diagnose({ tier: "standard", answers: allWorst(), profile });
    for (const axis of result.axisScores.filter((a) => a.axis !== "project")) expect(axis.score).toBe(0);
    expect(result.rawScore).toBeLessThan(5);
    expect(result.strengths).toHaveLength(0);
  });
});

describe("工程別適性", () => {
  it("release は Q20>=0.6 かつ Q25=1.0 で recommended、noteKey を常に持つ", () => {
    const result = diagnose({ tier: "standard", answers: allBest(), profile });
    const release = result.processSuitability.find((p) => p.process === "release")!;
    expect(release.level).toBe("recommended");
    expect(release.noteKey).toBeTruthy();
  });
  it("documentation は最低回答でも not_recommended にならない", () => {
    const result = diagnose({ tier: "standard", answers: allWorst(), profile });
    const documentation = result.processSuitability.find((p) => p.process === "documentation")!;
    expect(documentation.level).not.toBe("not_recommended");
  });
});

describe("強み選定", () => {
  it("全問満点で3件・軸が重複しない", () => {
    const result = diagnose({ tier: "standard", answers: allBest(), profile });
    expect(result.strengths).toHaveLength(3);
    const axes = result.strengths.map((s) => QUESTIONS.find((q) => q.id === s.questionId)!.axis);
    expect(new Set(axes).size).toBe(3);
  });
});

describe("組み合わせケース(要件書 §25.2)", () => {
  it("ケース1: 基盤十分 → 80点以上・Level4以上・削減率30%以上", () => {
    const answers = { ...allBest(), Q01: "new_development", Q02: "web" };
    const result = diagnose({ tier: "standard", answers, profile });
    expect(result.totalScore).toBeGreaterThanOrEqual(80);
    expect(result.level).toBeGreaterThanOrEqual(4);
    expect(result.reduction.min).toBeGreaterThanOrEqual(30);
  });

  it("ケース2: チャット中心 → 50点未満・文書化(imp-Q06)が上位課題", () => {
    const answers: Answers = {
      Q01: "existing_feature_addition", Q02: "business_system", Q04: "partial_area",
      Q05: "partial", Q06: "scattered", Q07: "not_implemented", Q08: "not_implemented", Q09: "partial",
      Q13: "all_git", Q14: "partial", Q15: "partial", Q16: "not_implemented", Q17: "not_implemented",
      Q18: "partial", Q20: "partial",
      Q21: "rarely_any", Q22: "partial", Q24: "partial", Q25: "partial", Q26: "partial",
      Q27: "partial_members", Q28: "partial", Q29: "partial", Q30: "partial",
    };
    const result = diagnose({ tier: "standard", answers, profile });
    expect(result.totalScore).toBeLessThan(50);
    expect(result.issues.slice(0, 5).map((i) => i.id)).toContain("imp-Q06");
  });

  it("ケース3: Git未使用 → 49点以下・imp-Q13 が「今すぐ実施」に含まれる", () => {
    const answers: Answers = {
      Q01: "existing_feature_addition", Q02: "business_system", Q04: "partial_area",
      Q05: "partial", Q06: "scattered", Q07: "not_implemented", Q08: "not_implemented", Q09: "partial",
      Q13: "other_tools", Q16: "not_implemented", Q17: "not_implemented", Q18: "partial", Q20: "not_implemented",
      Q21: "rarely_any", Q22: "partial", Q24: "not_implemented", Q25: "partial", Q26: "partial",
      Q27: "trial_only", Q28: "not_implemented", Q29: "not_implemented", Q30: "not_implemented",
    };
    const result = diagnose({ tier: "standard", answers, profile });
    expect(result.totalScore).toBeLessThanOrEqual(49);
    expect(result.nextSteps.now.map((i) => i.id)).toContain("imp-Q13");
  });

  it("ケース4: レガシー・仕様不明 → 実装工程は recommended にならない", () => {
    const answers: Answers = {
      Q01: "legacy_renewal", Q02: "business_system", Q04: "single_person",
      Q05: "partial", Q06: "rarely_exists", Q07: "partial", Q08: "partial", Q09: "partial",
      Q13: "all_git", Q14: "partial", Q15: "partial", Q16: "sufficient", Q17: "partial",
      Q18: "partial", Q20: "partial",
      Q21: "rarely_any", Q22: "partial", Q24: "partial", Q25: "partial", Q26: "partial",
      Q27: "partial_members", Q28: "partial", Q29: "partial", Q30: "partial",
    };
    const result = diagnose({ tier: "standard", answers, profile });
    const implementation = result.processSuitability.find((p) => p.process === "implementation")!;
    expect(implementation.level).not.toBe("recommended");
  });

  it("簡易診断でも全質問が applicable で診断できる", () => {
    const quickAnswers = Object.fromEntries(
      applicableQuestions("quick", {}).map((q) => [q.id, q.options[0].value]),
    );
    const result = diagnose({ tier: "quick", answers: quickAnswers, profile });
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.axisScores).toHaveLength(5);
  });
});
