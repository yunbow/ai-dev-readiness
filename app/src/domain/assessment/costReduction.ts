import { coefficientOf } from "./questions";
import type { Answers, Profile } from "./types";
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const estimateCostReduction = (totalScore: number, answers: Answers, profile: Profile): { min: number; max: number } => {
  const base = totalScore < 30 ? [3, 8] : totalScore < 50 ? [8, 15] : totalScore < 70 ? [15, 25] : totalScore < 85 ? [25, 35] : [35, 45];
  const c = (answers.Q01 === "new_development" ? 3 : answers.Q01 === "maintenance" ? -3 : answers.Q01 === "legacy_renewal" ? -5 : 0)
    + (["web", "api_backend"].includes(answers.Q02) ? 2 : 0)
    + (profile.regulatedIndustry ? -5 : 0)
    + ((coefficientOf("Q21", answers) ?? -1) >= .6 && (coefficientOf("Q20", answers) ?? -1) >= .6 ? 3 : 0)
    + ((coefficientOf("Q17", answers) ?? -1) >= .6 ? 2 : 0)
    + ((coefficientOf("Q34", answers) ?? -1) >= .6 ? 2 : 0)
    + ((coefficientOf("Q07", answers) ?? -1) >= .6 && (coefficientOf("Q08", answers) ?? -1) >= .6 ? 2 : 0)
    + (coefficientOf("Q25", answers) === 0 || coefficientOf("Q15", answers) === 0 ? -5 : 0)
    + (["scattered", "rarely_exists"].includes(answers.Q06) ? -5 : 0)
    + (answers.Q13 === "other_tools" ? -8 : 0);
  const min = clamp(base[0] + c, 0, 45); const max = clamp(base[1] + c, 0, 45);
  return min <= max ? { min, max } : { min: max, max: min };
};
