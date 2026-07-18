import { AXIS_POINTS, applicableQuestions, coefficientOf } from "./questions";
import type { Answers, AxisId, AxisScore, Profile, Tier } from "./types";

const AXES: AxisId[] = ["document", "process", "qa", "ai", "project"];
export const calculateAxisScores = (tier: Tier, answers: Answers, profile: Profile): AxisScore[] => {
  const questions = applicableQuestions(tier, answers);
  return AXES.map((axis) => {
    const relevant = questions.filter((question) => question.axis === axis);
    const weighted = relevant.map((question) => ({
      weight: profile.teamSize === "solo" && question.teamShared ? 0.5 : 1,
      coefficient: coefficientOf(question.id, answers) ?? 0,
    }));
    const maxScore = AXIS_POINTS[axis];
    const ratio = weighted.length === 0 ? 1 : weighted.reduce((sum, item) => sum + item.weight * item.coefficient, 0) / weighted.reduce((sum, item) => sum + item.weight, 0);
    return { axis, score: ratio * maxScore, maxScore, ratio };
  });
};

export const scoreAssessment = (tier: Tier, answers: Answers, profile: Profile) => {
  const axisScores = calculateAxisScores(tier, answers, profile);
  const rawScore = axisScores.reduce((sum, axis) => sum + axis.score, 0);
  const caps = [
    ["no_git", answers.Q13 === "other_tools", 49],
    ["no_ticket_mgmt", answers.Q16 === "not_implemented", 59],
    ["no_human_review", answers.Q25 === "not_implemented" || answers.Q15 === "not_implemented", 59],
    ["no_ai_input_rule", answers.Q28 === "not_implemented", 69],
    ["no_spec_docs", answers.Q06 === "rarely_exists", 49],
    ["no_test_and_check", answers.Q21 === "rarely_any" && answers.Q22 === "not_implemented", 59],
  ] as const;
  const triggeredCapIds = caps.filter(([, triggered]) => triggered).map(([id]) => id);
  const cap = caps.filter(([, triggered]) => triggered).reduce((minimum, [, , value]) => Math.min(minimum, value), Infinity);
  return { axisScores, rawScore, totalScore: Math.round(Math.min(rawScore, cap)), triggeredCapIds };
};
