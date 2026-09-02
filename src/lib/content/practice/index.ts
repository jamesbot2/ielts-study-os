import type { PracticeSet } from "@/types/ielts";
import { academicReadingSet } from "./reading-academic";
import { generalReadingSet } from "./reading-general";
import { listeningSets } from "./listening-sets";
import { targetedReadingSets } from "./targeted/reading";
import { targetedListeningSets } from "./targeted/listening";

export const readingSets: PracticeSet[] = [academicReadingSet, generalReadingSet];

export { academicReadingSet, generalReadingSet };
export { listeningSets, listeningSet } from "./listening-sets";
export { targetedReadingSets } from "./targeted/reading";
export { targetedListeningSets } from "./targeted/listening";

export const allPracticeSets: PracticeSet[] = [...readingSets, ...targetedReadingSets, ...listeningSets, ...targetedListeningSets];

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
