// Original targeted Reading drills — Sentence Completion.

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, textQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-sentence-completion-01-p01",
  "The discovery of penicillin",
  [
    "In September 1928 the Scottish scientist Alexander Fleming returned to his laboratory after a holiday and noticed something unusual. A culture dish of bacteria that he had left by an open window had been contaminated by a mould, and around the mould the bacteria had stopped growing. Fleming identified the mould as a species of Penicillium and gave the name penicillin to the substance it produced.",
    "Fleming published his findings the following year, but the paper attracted little attention. He was unable to produce penicillin in large quantities, and for a decade the discovery remained a laboratory curiosity. The task of turning it into a medicine fell to a team at Oxford University, led by Howard Florey and Ernst Chain, who developed methods for growing the mould in bulk.",
    "The first patient to be treated was a police officer suffering from a severe infection in 1941. He improved dramatically after receiving penicillin, but the supply ran out and he died. This tragedy convinced the Oxford team that mass production was essential, and wartime funding soon made it possible.",
    "By the end of the Second World War penicillin was being manufactured on an industrial scale and had saved the lives of countless wounded soldiers. Fleming, Florey and Chain shared the Nobel Prize in Physiology or Medicine in 1945 for what the committee called one of the greatest medical advances of the century.",
  ].join("\n\n"),
);

export const sentenceCompletionSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-sentence-completion-01", "Sentence completion — The discovery of penicillin", "academic", "sentence_completion", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "sentence_completion",
  passages: [p1],
  questions: [
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-01-q01", "Fleming noticed that bacteria had stopped growing around a __________ that contaminated his culture dish.", "mould", "The passage states a mould had contaminated the dish and the bacteria around it stopped growing.", "reading-targeted-sentence-completion-01-p01", { wordLimit: 1, evidence: "contaminated by a mould", difficulty: 2 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-01-q02", "Fleming named the antibacterial substance __________.", "penicillin", "Fleming gave the name penicillin to the substance the mould produced.", "reading-targeted-sentence-completion-01-p01", { wordLimit: 1, evidence: "gave the name penicillin", difficulty: 1 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-01-q03", "Fleming was unable to produce penicillin in large __________.", "quantities", "He was unable to produce penicillin in large quantities.", "reading-targeted-sentence-completion-01-p01", { wordLimit: 1, evidence: "large quantities", difficulty: 2 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-01-q04", "The task of turning penicillin into medicine fell to a team at __________ University.", "Oxford", "The team was at Oxford University, led by Florey and Chain.", "reading-targeted-sentence-completion-01-p01", { wordLimit: 1, evidence: "Oxford University", difficulty: 1 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-01-q05", "The first patient treated was a __________ officer.", "police", "The first patient was a police officer with a severe infection.", "reading-targeted-sentence-completion-01-p01", { wordLimit: 1, evidence: "police officer", difficulty: 1 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-01-q06", "The first patient died because the __________ of penicillin ran out.", "supply", "The supply ran out and the patient died.", "reading-targeted-sentence-completion-01-p01", { wordLimit: 1, evidence: "the supply ran out", difficulty: 2 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-01-q07", "Fleming, Florey and Chain shared the Nobel Prize in __________ in 1945.", "Physiology or Medicine", "The trio shared the Nobel Prize in Physiology or Medicine in 1945.", "reading-targeted-sentence-completion-01-p01", { wordLimit: 3, evidence: "Physiology or Medicine", difficulty: 2 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-01-q08", "Mass production was made possible by wartime __________.", "funding", "Wartime funding soon made mass production possible.", "reading-targeted-sentence-completion-01-p01", { wordLimit: 1, evidence: "wartime funding", difficulty: 2 }),
  ],
};

const p2 = originalPassage(
  "reading-targeted-sentence-completion-02-p01",
  "Joining the Riverside Sports Club",
  [
    "The Riverside Sports Club welcomes new members of all ages and abilities. Membership runs for a full year from the date of joining, and the standard annual fee is forty-five pounds, with a reduced rate of thirty pounds for students and for anyone over sixty-five.",
    "New members must complete a short induction before using the gym. Inductions take place every Saturday morning at ten o'clock and last about thirty minutes. They cover how to use the equipment safely and how to book classes through the club's website.",
    "The club's facilities include a gym, two tennis courts and a swimming pool. The pool is closed for maintenance on the first Monday of every month, and the courts can be booked up to seven days in advance. Members may bring one guest to the club twice per month, but guests must sign in at the reception desk.",
    "Membership can be cancelled at any time, but fees are not refundable after the first month. Anyone who wishes to renew should do so before the expiry date shown on their membership card, as places in popular classes are allocated first to renewing members.",
  ].join("\n\n"),
);

export const sentenceCompletionSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-sentence-completion-02", "Sentence completion — Joining the sports club", "general", "sentence_completion", 2),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "sentence_completion",
  passages: [p2],
  questions: [
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-02-q01", "The standard annual fee is forty-five __________.", "pounds", "The standard annual fee is forty-five pounds.", "reading-targeted-sentence-completion-02-p01", { wordLimit: 1, evidence: "forty-five pounds", difficulty: 1 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-02-q02", "Students pay a reduced rate of __________ pounds.", "thirty", "The reduced rate is thirty pounds for students and over-65s.", "reading-targeted-sentence-completion-02-p01", { wordLimit: 1, evidence: "thirty pounds", difficulty: 1 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-02-q03", "New members must complete an __________ before using the gym.", "induction", "A short induction must be completed before using the gym.", "reading-targeted-sentence-completion-02-p01", { wordLimit: 1, evidence: "complete a short induction", difficulty: 1 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-02-q04", "Inductions take place on __________ mornings.", "Saturday", "Inductions take place every Saturday morning at ten o'clock.", "reading-targeted-sentence-completion-02-p01", { wordLimit: 1, evidence: "every Saturday morning", difficulty: 1 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-02-q05", "The swimming pool is closed on the first __________ of every month.", "Monday", "The pool closes for maintenance on the first Monday of each month.", "reading-targeted-sentence-completion-02-p01", { wordLimit: 1, evidence: "first Monday", difficulty: 1 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-02-q06", "Tennis courts can be booked up to __________ days in advance.", "seven", "Courts can be booked up to seven days in advance.", "reading-targeted-sentence-completion-02-p01", { wordLimit: 1, evidence: "seven days", difficulty: 1 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-02-q07", "Members may bring one __________ twice per month.", "guest", "Members may bring one guest twice per month.", "reading-targeted-sentence-completion-02-p01", { wordLimit: 1, evidence: "one guest", difficulty: 1 }),
    textQuestion("sentence_completion", "reading-targeted-sentence-completion-02-q08", "Fees are not refundable after the first __________.", "month", "Fees are not refundable after the first month.", "reading-targeted-sentence-completion-02-p01", { wordLimit: 1, evidence: "first month", difficulty: 1 }),
  ],
};
