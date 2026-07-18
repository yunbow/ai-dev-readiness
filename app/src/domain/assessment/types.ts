export type AxisId = "project" | "document" | "process" | "qa" | "ai";
export type Tier = "quick" | "standard";
export type TeamSize = "solo" | "small" | "large";

export type Profile = { teamSize: TeamSize; regulatedIndustry: boolean };
export type AnswerOption = { value: string; label: string; coefficient: number; isUnknown?: boolean };
export type Question = {
  id: string; axis: AxisId; text: string; description?: string; options: AnswerOption[];
  inQuick: boolean; inStandard: boolean; teamShared?: boolean;
  skipCondition?: { questionId: string; valuesIn: string[] };
  hideCondition?: { questionId: string; valuesIn: string[] };
  strengthText: string;
};
export type ProfileQuestion = { id: "P1" | "P2"; text: string; options: { value: string; label: string }[] };
export type Answers = Record<string, string>;
export type DiagnosisInput = { tier: Tier; answers: Answers; profile: Profile };
export type AxisScore = { axis: AxisId; score: number; maxScore: number; ratio: number };
export type Priority = "high" | "medium" | "low";
export type Recommendation = { id: string; category: AxisId; priority: Priority; title: string; description: string; action: string; expectedEffect: string; relatedQuestionIds: string[] };
export type ProcessId = "requirements" | "design" | "implementation" | "code_review" | "testing" | "documentation" | "release" | "operations";
export type SuitabilityLevel = "recommended" | "conditional" | "not_recommended";
export type DiagnosisResult = {
  totalScore: number; rawScore: number; axisScores: AxisScore[]; level: 1 | 2 | 3 | 4 | 5;
  reduction: { min: number; max: number }; triggeredCapIds: string[];
  strengths: { questionId: string; text: string }[]; issues: Recommendation[];
  nextSteps: { now: Recommendation[]; within1Month: Recommendation[]; within3Months: Recommendation[] };
  processSuitability: { process: ProcessId; level: SuitabilityLevel; noteKey?: string }[];
  unknownQuestionIds: string[]; planningPhaseWarning: boolean;
};
