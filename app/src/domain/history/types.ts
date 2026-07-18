import type { Answers, DiagnosisResult, Profile, Tier } from "@/domain/assessment/types";

export type HistoryRecord = {
  id: string;
  createdAt: string;
  tier: Tier;
  answers: Answers;
  profile: Profile;
  result: DiagnosisResult;
  schemaVersion: number;
  questionVersion: number;
  scoringVersion: number;
};

export type AssessmentDraft = {
  tier: Tier;
  answers: Answers;
  profile: Profile;
  currentIndex: number;
  updatedAt: string;
};
