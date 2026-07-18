import { STORAGE_KEYS } from "@/constants/storageKeys";
import type { AssessmentDraft } from "@/domain/history/types";
import type { Answers, Profile, Tier } from "@/domain/assessment/types";

const isTier = (value: unknown): value is Tier => value === "quick" || value === "standard";
const isAnswers = (value: unknown): value is Answers =>
  typeof value === "object" && value !== null && Object.values(value).every((item) => typeof item === "string");
const isProfile = (value: unknown): value is Profile => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return ["solo", "small", "large"].includes(String(item.teamSize)) && typeof item.regulatedIndustry === "boolean";
};
const isDraft = (value: unknown): value is AssessmentDraft => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return isTier(item.tier) && isAnswers(item.answers) && isProfile(item.profile) && Number.isInteger(item.currentIndex) && typeof item.updatedAt === "string";
};

function read(key: string): unknown | null {
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) : null; } catch { return null; }
}
function write(key: string, value: unknown): boolean {
  try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
export function isLocalStorageAvailable(): boolean { try { return typeof window !== "undefined" && !!window.localStorage; } catch { return false; } }
export function loadDraft(): AssessmentDraft | null {
  const value = read(STORAGE_KEYS.draft);
  if (value === null) return null;
  if (isDraft(value)) return value;
  clearDraft(); return null;
}
export const saveDraft = (draft: AssessmentDraft) => write(STORAGE_KEYS.draft, draft);
export function clearDraft(): void { try { window.localStorage.removeItem(STORAGE_KEYS.draft); } catch { /* unavailable */ } }
export function loadLatestResultId(): string | null { const value = read(STORAGE_KEYS.latestResultId); return typeof value === "string" ? value : null; }
export const saveLatestResultId = (id: string) => write(STORAGE_KEYS.latestResultId, id);
export function clearAllLocalStorage(): void { try { Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key)); } catch { /* unavailable */ } }
