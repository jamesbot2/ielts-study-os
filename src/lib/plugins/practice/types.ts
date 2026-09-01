// Practice provider foundation. External question banks normalize into the
// existing PracticeSet schema. Not importing any external bank in V0.5.

import type { PracticeSet, TestType } from "@/types/ielts";
import type { PluginHealth, PluginSource } from "../types";

export interface ExternalPracticeSetSummary {
  id: string;
  providerId: string;
  title: string;
  skill: "reading" | "listening" | "writing" | "speaking";
  testType: TestType | "both";
  questionCount: number;
  source: PluginSource;
}

export interface ExternalPracticeSet {
  summary: ExternalPracticeSetSummary;
  // Provider-specific payload; normalization converts it to a PracticeSet.
  raw: unknown;
}

export interface PracticeFilter {
  skill?: "reading" | "listening" | "writing" | "speaking";
  testType?: TestType;
}

export interface PracticeProvider {
  id: string;
  kind: "practice";
  name: string;
  version: string;
  source: PluginSource;
  capabilities: Array<"PRACTICE_LIST_SETS" | "PRACTICE_GET_SET">;
  listSets(filter?: PracticeFilter): Promise<ExternalPracticeSetSummary[]>;
  getSet(id: string): Promise<ExternalPracticeSet>;
  normalize(set: ExternalPracticeSet): Promise<PracticeSet>;
  healthCheck(): Promise<PluginHealth>;
}
