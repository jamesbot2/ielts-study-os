// Original targeted Listening drills — Table Completion.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, textQ } from "./helpers";

const TABLE1 = "TABLE: Language courses at City College.\n| Course | Level | Day | Fee |\n| French | ________ | Wednesday | £85 |\n| Spanish | Elementary | ________ | £70 |\n| Mandarin | Elementary | Tuesday | £________ |\n| Italian | ________ | Thursday | £95 |\n| German | Elementary | ________ | £60 |";

export const listeningTableCompletion01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-table-completion-01", "Table completion — Language courses", "both", "table_completion", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "table_completion",
  passages: [],
  audio: listeningAudio("listening-targeted-table-completion-01", "Language course options", [
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Thanks for waiting. You asked about our language courses, so here's what's available this term." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "The French class is for complete beginners — it's an introductory course — and it meets on Wednesday evenings. The fee is eighty-five pounds, which includes the course book." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Spanish is elementary level, running on Thursday. Oh, sorry, let me correct that — it's on Tuesday, not Thursday. That one is seventy pounds." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Mandarin is also elementary, on Tuesday afternoons. That's slightly more expensive because of the small class size — one hundred and ten pounds." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Italian is an intermediate course, meeting on Thursday evenings. The fee is ninety-five pounds." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "And finally German, elementary level, on Wednesday mornings. That's our cheapest option at sixty pounds." },
  ]),
  questions: [
    textQ("table_completion", "listening-targeted-table-completion-01-q01", `${TABLE1}\n\nFrench — Level: __________ (for complete beginners)`, "introductory", "The French class is an introductory course for complete beginners.", { wordLimit: 1, evidence: "introductory course", difficulty: 2 }),
    textQ("table_completion", "listening-targeted-table-completion-01-q02", "Spanish — Day: __________ (corrected from Thursday)", "Tuesday", "The adviser first says Thursday, then corrects it to Tuesday.", { wordLimit: 1, evidence: "correct that — it's on Tuesday", difficulty: 2 }),
    textQ("table_completion", "listening-targeted-table-completion-01-q03", "Mandarin — Fee: £__________", "110", "Mandarin costs one hundred and ten pounds.", { wordLimit: 1, allowNumber: true, evidence: "one hundred and ten pounds", acceptableAnswers: ["110"], difficulty: 2 }),
    textQ("table_completion", "listening-targeted-table-completion-01-q04", "Italian — Level: __________", "intermediate", "Italian is an intermediate course.", { wordLimit: 1, evidence: "intermediate course", difficulty: 1 }),
    textQ("table_completion", "listening-targeted-table-completion-01-q05", "German — Day: __________", "Wednesday", "German meets on Wednesday mornings.", { wordLimit: 1, evidence: "Wednesday mornings", difficulty: 1 }),
    textQ("table_completion", "listening-targeted-table-completion-01-q06", "French — Fee: £__________", "85", "The French fee is eighty-five pounds.", { wordLimit: 1, allowNumber: true, evidence: "eighty-five pounds", acceptableAnswers: ["eighty-five"], difficulty: 1 }),
    textQ("table_completion", "listening-targeted-table-completion-01-q07", "Spanish — Fee: £__________", "70", "Spanish is seventy pounds.", { wordLimit: 1, allowNumber: true, evidence: "seventy pounds", acceptableAnswers: ["seventy"], difficulty: 1 }),
    textQ("table_completion", "listening-targeted-table-completion-01-q08", "German — Fee: £__________ (cheapest option)", "60", "German is the cheapest at sixty pounds.", { wordLimit: 1, allowNumber: true, evidence: "sixty pounds", acceptableAnswers: ["sixty"], difficulty: 1 }),
  ],
};

const TABLE2 = "TABLE: Library event schedule.\n| Event | Room | Time |\n| Author talk | Main hall | 6:00 pm |\n| Children's story time | ________ | 10:30 am |\n| Computer help | Room 2 | ________ |\n| Book club | Room 3 | ________ |\n| Film screening | Main hall | 7:00 pm |";

export const listeningTableCompletion02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-table-completion-02", "Table completion — Library events", "both", "table_completion", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "table_completion",
  passages: [],
  audio: listeningAudio("listening-targeted-table-completion-02", "Library event schedule", [
    { speaker: "Librarian", voice: "en_US-ryan-high", text: "Here's what's on at the library this Saturday. The author talk is in the main hall at six in the evening — that's the biggest event of the day." },
    { speaker: "Librarian", voice: "en_US-ryan-high", text: "For younger visitors, children's story time is in the children's corner at half past ten in the morning. No need to book, just turn up." },
    { speaker: "Librarian", voice: "en_US-ryan-high", text: "Our computer help session runs in room two. It starts at two o'clock, and we'd prefer you to book a slot because it's popular." },
    { speaker: "Librarian", voice: "en_US-ryan-high", text: "The book club meets in room three at four thirty, and this month they're discussing a travel memoir." },
    { speaker: "Librarian", voice: "en_US-ryan-high", text: "And to finish the day, we're screening a film in the main hall at seven. Entry is free with a library card." },
  ]),
  questions: [
    textQ("table_completion", "listening-targeted-table-completion-02-q01", `${TABLE2}\n\nChildren's story time — Room: children's __________`, "corner", "Story time is in the children's corner.", { wordLimit: 1, evidence: "children's corner", difficulty: 1 }),
    textQ("table_completion", "listening-targeted-table-completion-02-q02", "Computer help — Time: __________ pm", "2", "Computer help starts at two o'clock.", { wordLimit: 1, allowNumber: true, evidence: "two o'clock", acceptableAnswers: ["two"], difficulty: 1 }),
    textQ("table_completion", "listening-targeted-table-completion-02-q03", "Book club — Time: 4:__________ pm", "30", "The book club meets at four thirty.", { wordLimit: 1, allowNumber: true, evidence: "four thirty", acceptableAnswers: ["thirty"], difficulty: 1 }),
    textQ("table_completion", "listening-targeted-table-completion-02-q04", "Author talk — Time: __________ pm", "6", "The author talk is at six in the evening.", { wordLimit: 1, allowNumber: true, evidence: "six in the evening", acceptableAnswers: ["six"], difficulty: 1 }),
    textQ("table_completion", "listening-targeted-table-completion-02-q05", "Film screening — Room: main __________", "hall", "The film is screened in the main hall.", { wordLimit: 1, evidence: "main hall", difficulty: 1 }),
    textQ("table_completion", "listening-targeted-table-completion-02-q06", "Book club — Room: room __________", "3", "The book club meets in room three.", { wordLimit: 1, allowNumber: true, evidence: "room three", acceptableAnswers: ["three"], difficulty: 1 }),
    textQ("table_completion", "listening-targeted-table-completion-02-q07", "Computer help — booking is preferred because it is __________.", "popular", "It's popular, so booking a slot is preferred.", { wordLimit: 1, evidence: "it's popular", difficulty: 2 }),
    textQ("table_completion", "listening-targeted-table-completion-02-q08", "Film screening — entry is free with a library __________.", "card", "Entry is free with a library card.", { wordLimit: 1, evidence: "library card", difficulty: 1 }),
  ],
};
