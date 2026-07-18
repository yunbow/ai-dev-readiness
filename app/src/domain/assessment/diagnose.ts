import { applicableQuestions } from "./questions";
import { estimateCostReduction } from "./costReduction";
import { levelForScore } from "./level";
import { assessProcessSuitability } from "./processSuitability";
import { generateRecommendations, selectStrengths } from "./recommendations";
import { scoreAssessment } from "./scoring";
import type { DiagnosisInput, DiagnosisResult } from "./types";

export const diagnose = (input: DiagnosisInput): DiagnosisResult => {
  const scoring = scoreAssessment(input.tier, input.answers, input.profile);
  const unknownQuestionIds = applicableQuestions(input.tier, input.answers).flatMap((question) => question.options.find((option) => option.value === input.answers[question.id])?.isUnknown ? [question.id] : []);
  const recommendations = generateRecommendations(input.tier, input.answers);
  return {
    ...scoring,
    level: levelForScore(scoring.totalScore),
    reduction: estimateCostReduction(scoring.totalScore, input.answers, input.profile),
    strengths: selectStrengths(input.tier, input.answers),
    ...recommendations,
    processSuitability: assessProcessSuitability(input.answers, scoring.axisScores),
    unknownQuestionIds,
    planningPhaseWarning: input.answers.Q01 === "planning_phase",
  };
};
