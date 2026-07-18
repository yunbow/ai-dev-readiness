import { useEffect, useMemo, useState } from "react";
import type { Answers, Profile, Tier } from "@/domain/assessment/types";
import { PROFILE_QUESTIONS, applicableQuestions } from "@/domain/assessment/questions";
import { clearDraft, loadDraft, saveDraft } from "@/infrastructure/localStorage";

const emptyProfile: Profile = { teamSize: "small", regulatedIndustry: false };
export function useAssessment(tier: Tier) {
  const stored = useMemo(() => { const draft = loadDraft(); return draft?.tier === tier ? draft : null; }, [tier]);
  const [answers, setAnswers] = useState<Answers>(stored?.answers ?? {});
  const [profile, setProfile] = useState<Profile>(stored?.profile ?? emptyProfile);
  const [index, setIndex] = useState(stored?.currentIndex ?? 0);
  const questions = applicableQuestions(tier, answers);
  const items = [...PROFILE_QUESTIONS, ...questions];
  const safeIndex = Math.min(index, Math.max(0, items.length - 1));
  const current = items[safeIndex];
  useEffect(() => { saveDraft({ tier, answers, profile, currentIndex: index, updatedAt: new Date().toISOString() }); }, [tier, answers, profile, index]);
  const value = current ? answers[current.id] : undefined;
  const select = (next: string) => { if (current?.id === "P1") { setProfile((p) => ({ ...p, teamSize: next as Profile["teamSize"] })); setAnswers((a) => ({ ...a, P1: next })); } else if (current?.id === "P2") { setProfile((p) => ({ ...p, regulatedIndustry: next === "yes" })); setAnswers((a) => ({ ...a, P2: next })); } else if (current) setAnswers((a) => ({ ...a, [current.id]: next })); };
  return { answers, profile, index: safeIndex, setIndex, items, current, value, select, clearDraft };
}
