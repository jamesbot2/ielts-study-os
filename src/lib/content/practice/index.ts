import type { PracticeSet } from "@/types/ielts";
import { academicReadingSet } from "./reading-academic";
import { generalReadingSet } from "./reading-general";
import { listeningSets } from "./listening-sets";

export const readingSets: PracticeSet[] = [academicReadingSet, generalReadingSet];

export { academicReadingSet, generalReadingSet };
export { listeningSets, listeningSet } from "./listening-sets";

export const allPracticeSets: PracticeSet[] = [...readingSets, ...listeningSets];

export function getPracticeSet(id: string): PracticeSet | undefined {
  return allPracticeSets.find((s) => s.meta.id === id);
}

export function getSetsBySkill(skill: "reading" | "listening"): PracticeSet[] {
  return allPracticeSets.filter((s) => s.kind === skill);
}

export function getQuestionById(set: PracticeSet, questionId: string) {
  return set.questions.find((q) => q.id === questionId);
}

export function getPassageById(set: PracticeSet, passageId: string) {
  return set.passages.find((p) => p.id === passageId);
}
