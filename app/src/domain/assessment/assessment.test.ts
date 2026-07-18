import { describe, expect, it } from "vitest";
import { applicableQuestions, coefficientOf, QUESTIONS } from "./questions";
import { estimateCostReduction } from "./costReduction";
import { diagnose } from "./diagnose";
import { levelForScore } from "./level";
import { scoreAssessment } from "./scoring";
import type { Answers, Profile } from "./types";

const profile: Profile = { teamSize: "small", regulatedIndustry: false };
const answered = (value = "sufficient"): Answers => Object.fromEntries(QUESTIONS.map((question) => [question.id, question.options.find((option) => option.value === value)?.value ?? question.options[0].value]));
describe("assessment domain", () => {
  it("defines all 34 questions and the specified tier counts", () => { expect(QUESTIONS).toHaveLength(34); expect(applicableQuestions("quick", {})).toHaveLength(12); expect(applicableQuestions("standard", {})).toHaveLength(26); });
  it("scores fully sufficient answers at 100 and is deterministic", () => { const input = { tier: "standard" as const, answers: answered(), profile }; expect(diagnose(input)).toEqual(diagnose(input)); expect(diagnose(input).totalScore).toBe(100); });
  it("excludes skipped questions from scoring", () => { const answers = answered(); answers.Q13 = "other_tools"; const result = scoreAssessment("standard", answers, profile); expect(applicableQuestions("standard", answers).map((q) => q.id)).not.toContain("Q14"); expect(applicableQuestions("standard", answers).map((q) => q.id)).not.toContain("Q15"); expect(applicableQuestions("standard", answers).map((q) => q.id)).not.toContain("Q33"); expect(result.totalScore).toBeLessThanOrEqual(49); });
  it("applies solo weighting to team shared questions", () => { const answers = answered(); answers.Q15 = "not_implemented"; const small = scoreAssessment("quick", answers, profile); const solo = scoreAssessment("quick", answers, { ...profile, teamSize: "solo" }); expect(solo.axisScores.find((x) => x.axis === "process")!.score).toBeGreaterThan(small.axisScores.find((x) => x.axis === "process")!.score); });
  it("uses each score level boundary", () => { expect([29, 30, 49, 50, 69, 70, 84, 85].map(levelForScore)).toEqual([1, 2, 2, 3, 3, 4, 4, 5]); });
  it("applies score caps and planning warnings", () => { const answers = answered(); answers.Q06 = "rarely_exists"; answers.Q13 = "other_tools"; const result = diagnose({ tier: "standard", answers, profile }); expect(result.triggeredCapIds).toEqual(expect.arrayContaining(["no_git", "no_spec_docs"])); expect(result.totalScore).toBeLessThanOrEqual(49); answers.Q01 = "planning_phase"; expect(diagnose({ tier: "standard", answers, profile }).planningPhaseWarning).toBe(true); });
  it("calculates reduction adjustments", () => { const answers = answered(); answers.Q01 = "new_development"; answers.Q02 = "web"; expect(estimateCostReduction(90, answers, profile).min).toBe(45); answers.Q01 = "legacy_renewal"; answers.Q06 = "rarely_exists"; answers.Q13 = "other_tools"; answers.Q15 = "not_implemented"; expect(estimateCostReduction(10, answers, { ...profile, regulatedIndustry: true }).min).toBe(0); });
  it("orders high-priority recommendation and collects unknown answers", () => { const answers = answered(); answers.Q06 = "scattered"; answers.Q13 = "unknown"; const result = diagnose({ tier: "standard", answers, profile }); expect(result.issues[0].id).toBe("imp-Q06"); expect(result.unknownQuestionIds).toContain("Q13"); expect(result.nextSteps.now.map((item) => item.priority)).toContain("high"); });
  it("maps Q34 coefficients (sufficient=1.0, unknown=0.2/isUnknown)", () => {
    expect(coefficientOf("Q34", { Q34: "sufficient" })).toBe(1);
    const unknownOption = QUESTIONS.find((question) => question.id === "Q34")!.options.find((option) => option.value === "unknown")!;
    expect(unknownOption.coefficient).toBe(0.2);
    expect(unknownOption.isUnknown).toBe(true);
  });
  it("adds a +2 reduction adjustment when Q34 is sufficient", () => {
    const answers: Answers = { Q01: "existing_feature_addition", Q02: "mobile", Q06: "organized", Q07: "not_implemented", Q08: "not_implemented", Q13: "all_git", Q15: "sufficient", Q17: "not_implemented", Q20: "not_implemented", Q21: "rarely_any", Q25: "sufficient" };
    const without = estimateCostReduction(50, answers, profile);
    const withQ34 = estimateCostReduction(50, { ...answers, Q34: "sufficient" }, profile);
    expect(withQ34.min).toBe(without.min + 2);
    expect(withQ34.max).toBe(without.max + 2);
  });
  it("recommends imp-Q33 and imp-Q34 for low-coefficient answers", () => {
    const answers = answered(); answers.Q33 = "not_implemented"; answers.Q34 = "not_implemented";
    const result = diagnose({ tier: "standard", answers, profile });
    expect(result.issues.map((issue) => issue.id)).toEqual(expect.arrayContaining(["imp-Q33", "imp-Q34"]));
  });
});
