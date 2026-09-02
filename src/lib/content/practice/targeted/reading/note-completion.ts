// Original targeted Reading drills — Note Completion.

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, textQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-note-completion-01-p01",
  "The life cycle of the monarch butterfly",
  [
    "The monarch butterfly undertakes one of the most remarkable migrations in the animal world. Each autumn, millions of monarchs from Canada and the northern United States fly south to overwinter in a small number of fir forests in central Mexico, a journey of up to four thousand kilometres that no individual butterfly has ever made before.",
    "The journey is completed in stages. The butterflies that arrive in Mexico in November are the great-great-grandchildren of those that left in the spring, because the species produces four generations each year. The first three generations live for only a few weeks as they breed and move northwards; it is the fourth, late-summer generation that delays reproduction and flies south.",
    "On arrival, the migrants cluster in enormous numbers on the trunks and branches of fir trees, where the cool, humid microclimate prevents them from drying out. They remain largely inactive until February, when rising temperatures trigger mating, after which they begin the return journey northwards, laying eggs on milkweed plants as they go.",
    "Scientists have used wing-tagging and, more recently, lightweight radio trackers to confirm the migration routes. The population has declined sharply since the 1990s, mainly because of the loss of milkweed, the only plant on which monarch caterpillars feed, and the illegal logging of the Mexican fir forests.",
  ].join("\n\n"),
);

export const noteCompletionSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-note-completion-01", "Note completion — The monarch butterfly", "academic", "note_completion", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "note_completion",
  passages: [p1],
  questions: [
    textQuestion("note_completion", "reading-targeted-note-completion-01-q01", "Migration distance: up to four thousand __________.", "kilometres", "The journey is up to four thousand kilometres.", "reading-targeted-note-completion-01-p01", { wordLimit: 1, evidence: "four thousand kilometres", difficulty: 1 }),
    textQuestion("note_completion", "reading-targeted-note-completion-01-q02", "Winter destination: fir forests in central __________.", "Mexico", "Monarchs overwinter in fir forests in central Mexico.", "reading-targeted-note-completion-01-p01", { wordLimit: 1, evidence: "central Mexico", difficulty: 1 }),
    textQuestion("note_completion", "reading-targeted-note-completion-01-q03", "Generations per year: __________.", "four", "The species produces four generations each year.", "reading-targeted-note-completion-01-p01", { wordLimit: 1, evidence: "four generations", difficulty: 1 }),
    textQuestion("note_completion", "reading-targeted-note-completion-01-q04", "Arrival month in Mexico: __________.", "November", "Butterflies arrive in Mexico in November.", "reading-targeted-note-completion-01-p01", { wordLimit: 1, evidence: "arrive in Mexico in November", difficulty: 1 }),
    textQuestion("note_completion", "reading-targeted-note-completion-01-q05", "Resting place: trunks and __________ of fir trees.", "branches", "They cluster on the trunks and branches of fir trees.", "reading-targeted-note-completion-01-p01", { wordLimit: 1, evidence: "trunks and branches", difficulty: 1 }),
    textQuestion("note_completion", "reading-targeted-note-completion-01-q06", "Mating is triggered by rising __________ in February.", "temperatures", "Rising temperatures trigger mating.", "reading-targeted-note-completion-01-p01", { wordLimit: 1, evidence: "rising temperatures", difficulty: 2 }),
    textQuestion("note_completion", "reading-targeted-note-completion-01-q07", "Eggs are laid on __________ plants.", "milkweed", "Eggs are laid on milkweed plants, the caterpillars' only food.", "reading-targeted-note-completion-01-p01", { wordLimit: 1, evidence: "milkweed plants", difficulty: 2 }),
    textQuestion("note_completion", "reading-targeted-note-completion-01-q08", "Population decline caused by milkweed loss and illegal __________ of fir forests.", "logging", "Illegal logging of the Mexican fir forests is a cause of decline.", "reading-targeted-note-completion-01-p01", { wordLimit: 1, evidence: "illegal logging", difficulty: 3 }),
  ],
};

const p2 = originalPassage(
  "reading-targeted-note-completion-02-p01",
  "Campus bike hire scheme",
  [
    "The university has introduced a bike hire scheme for students and staff. Bikes can be collected from any of the six hire points marked on the campus map, and they must be returned to any hire point before the library closes. The standard charge is two pounds for the first hour and one pound for each additional hour.",
    "To use the scheme, register at the student services office with your university card. Registration is free, but a deposit of twenty pounds is taken when you collect your first bike and is refunded when your account is closed. Lost bikes are charged at the full replacement cost of one hundred and fifty pounds.",
    "The most popular collection points are outside the main library and beside the sports centre, and bikes there are often unavailable after nine in the morning. The quietest points are at the north residences and the science park, where bikes are usually available throughout the day.",
    "Helmets are not provided but are strongly recommended. Lights are fitted to every bike and switch on automatically after dark. If you find a fault, report it using the number on the frame, and the bike will be collected for repair within two working days.",
  ].join("\n\n"),
);

export const noteCompletionSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-note-completion-02", "Note completion — Campus bike hire scheme", "general", "note_completion", 2),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "note_completion",
  passages: [p2],
  questions: [
    textQuestion("note_completion", "reading-targeted-note-completion-02-q01", "Number of hire points: __________.", "six", "Bikes can be collected from any of the six hire points.", "reading-targeted-note-completion-02-p01", { wordLimit: 1, evidence: "six hire points", difficulty: 1 }),
    textQuestion("note_completion", "reading-targeted-note-completion-02-q02", "First hour charge: __________ pounds.", "two", "The standard charge is two pounds for the first hour.", "reading-targeted-note-completion-02-p01", { wordLimit: 1, evidence: "two pounds", difficulty: 1 }),
    textQuestion("note_completion", "reading-targeted-note-completion-02-q03", "Deposit when collecting the first bike: __________ pounds.", "twenty", "A deposit of twenty pounds is taken.", "reading-targeted-note-completion-02-p01", { wordLimit: 1, evidence: "twenty pounds", difficulty: 1 }),
    textQuestion("note_completion", "reading-targeted-note-completion-02-q04", "Replacement cost for a lost bike: __________ pounds.", "150", "Lost bikes are charged at the full replacement cost of one hundred and fifty pounds.", "reading-targeted-note-completion-02-p01", { wordLimit: 1, evidence: "one hundred and fifty pounds", acceptableAnswers: ["150", "one hundred and fifty"], difficulty: 2 }),
    textQuestion("note_completion", "reading-targeted-note-completion-02-q05", "Bikes at the library point are often unavailable after __________ in the morning.", "nine", "Bikes there are often unavailable after nine in the morning.", "reading-targeted-note-completion-02-p01", { wordLimit: 1, evidence: "after nine", difficulty: 2 }),
    textQuestion("note_completion", "reading-targeted-note-completion-02-q06", "Quietest points: north residences and the science __________.", "park", "The quietest points are at the north residences and the science park.", "reading-targeted-note-completion-02-p01", { wordLimit: 1, evidence: "science park", difficulty: 1 }),
    textQuestion("note_completion", "reading-targeted-note-completion-02-q07", "Lights switch on automatically after __________.", "dark", "Lights switch on automatically after dark.", "reading-targeted-note-completion-02-p01", { wordLimit: 1, evidence: "after dark", difficulty: 1 }),
    textQuestion("note_completion", "reading-targeted-note-completion-02-q08", "Faulty bikes are collected for repair within __________ working days.", "two", "The bike will be collected within two working days.", "reading-targeted-note-completion-02-p01", { wordLimit: 1, evidence: "two working days", difficulty: 2 }),
  ],
};
