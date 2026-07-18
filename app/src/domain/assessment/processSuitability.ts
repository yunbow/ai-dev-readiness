import { coefficientOf } from "./questions";
import type { Answers, AxisScore, ProcessId, SuitabilityLevel } from "./types";
type Item = { process: ProcessId; level: SuitabilityLevel; noteKey?: string };
const average = (ids: string[], answers: Answers): number | null => { const values = ids.map((id) => coefficientOf(id, answers)).filter((value): value is number => value !== null); return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null; };
const axisRatio = (scores: AxisScore[], axis: AxisScore["axis"]) => scores.find((score) => score.axis === axis)?.ratio ?? 0;
export const assessProcessSuitability = (answers: Answers, axisScores: AxisScore[]): Item[] => {
  const document = axisRatio(axisScores, "document"), qa = axisRatio(axisScores, "qa");
  const q = (id: string) => coefficientOf(id, answers); const design = average(["Q07", "Q09", "Q10"], answers); const review = average(["Q15", "Q23", "Q24", "Q29"], answers); const operations = average(["Q12", "Q26", "Q22"], answers);
  return [
    { process: "requirements", level: document >= .7 && (q("Q17") === null || q("Q17")! >= .6) ? "recommended" : document >= .4 ? "conditional" : "not_recommended" },
    { process: "design", level: design !== null && design >= .7 ? "recommended" : design !== null && design >= .4 ? "conditional" : "not_recommended", ...(design === null || design < .4 ? { noteKey: "designNote" } : {}) },
    { process: "implementation", level: document >= .6 && qa >= .6 ? "recommended" : document >= .35 || qa >= .35 ? "conditional" : "not_recommended" },
    { process: "code_review", level: q("Q15") !== null && q("Q15")! >= .6 && review !== null && review >= .6 ? "recommended" : review !== null && review >= .3 ? "conditional" : "not_recommended", noteKey: "codeReviewNote" },
    { process: "testing", level: q("Q21") !== null && q("Q21")! >= .6 && (q("Q24") === null || q("Q24")! >= .6) ? "recommended" : (q("Q21") ?? -1) >= .2 || (q("Q24") ?? -1) >= .6 ? "conditional" : "not_recommended" },
    { process: "documentation", level: (q("Q08") ?? -1) >= .6 || document >= .5 ? "recommended" : "conditional", noteKey: "documentationNote" },
    { process: "release", level: (q("Q20") ?? -1) >= .6 && q("Q25") === 1 ? "recommended" : (q("Q20") ?? -1) >= .6 || (q("Q25") ?? -1) >= .6 ? "conditional" : "not_recommended", noteKey: "releaseNote" },
    { process: "operations", level: operations === null ? "conditional" : operations >= .6 ? "recommended" : operations >= .3 ? "conditional" : "not_recommended", noteKey: "operationsNote" },
  ];
};
