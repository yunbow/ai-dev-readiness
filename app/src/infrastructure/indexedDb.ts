import { openDB, type DBSchema } from "idb";
import type { HistoryRecord } from "@/domain/history/types";

interface DiagnosisDb extends DBSchema { results: { key: string; value: HistoryRecord; indexes: { "by-created-at": string } }; }
const DB_NAME = "ai-dev-diagnosis";
const STORE = "results";
async function database() {
  if (typeof indexedDB === "undefined") return null;
  try { return await openDB<DiagnosisDb>(DB_NAME, 1, { upgrade(db) { const store = db.createObjectStore(STORE, { keyPath: "id" }); store.createIndex("by-created-at", "createdAt"); } }); } catch { return null; }
}
const validRecord = (value: unknown): value is HistoryRecord => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "string" && (v.tier === "quick" || v.tier === "standard") && typeof v.answers === "object" && typeof v.profile === "object" && typeof v.result === "object" && typeof v.schemaVersion === "number" && typeof v.questionVersion === "number" && typeof v.scoringVersion === "number";
};
export async function saveResult(record: HistoryRecord): Promise<boolean> {
  try { const db = await database(); if (!db) return false; await db.put(STORE, record); const all = await db.getAllFromIndex(STORE, "by-created-at"); for (const old of all.slice(0, Math.max(0, all.length - 20))) await db.delete(STORE, old.id); return true; } catch { return false; }
}
export async function getResults(): Promise<HistoryRecord[]> { try { const db = await database(); if (!db) return []; return (await db.getAllFromIndex(STORE, "by-created-at")).filter(validRecord).reverse(); } catch { return []; } }
export async function getResult(id: string): Promise<HistoryRecord | null> { try { const db = await database(); if (!db) return null; const value = await db.get(STORE, id); return validRecord(value) ? value : null; } catch { return null; } }
export async function deleteResult(id: string): Promise<boolean> { try { const db = await database(); if (!db) return false; await db.delete(STORE, id); return true; } catch { return false; } }
export async function clearResults(): Promise<boolean> { try { const db = await database(); if (!db) return false; await db.clear(STORE); return true; } catch { return false; } }
