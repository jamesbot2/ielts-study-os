// Original targeted Listening drills — Table Completion.
// The visible table contains blank cells ONLY where answers are asked; no
// target answer is prefilled anywhere in the visible structure.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, textQ } from "./helpers";

const TABLE1 = [
  "TABLE: Language courses at City College.",
  "",
  "| Course   | Level           | Day        | Fee   |",
  "|----------|-----------------|------------|-------|",
  "| French   | _______________ | Wednesday  | £____ |",
  "| Spanish  | Elementary      | __________ | £____ |",
  "| Mandarin | _______________ | Monday     | £____ |",
  "| Italian  | _______________ | Thursday   | £95   |",
  "| German   | Elementary      | __________ | £60   |",
].join("\n");

export const listeningTableCompletion01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-table-completion-01", "Table completion — Language courses", "both", "table_completion", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "table_completion",
  passages: [],
  taskStimulus: TABLE1,
  audio: listeningAudio("listening-targeted-table-completion-01", "Language course options", [
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Thanks for waiting. You asked about our language courses, so here's what's available this term." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "The French class is for complete beginners — it's an introductory course — and it meets on Wednesday evenings. The fee is eighty-five pounds, which includes the course book." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Spanish is elementary level, running on Tuesday. Oh, sorry, let me correct that — I said Tuesday earlier, but it's actually on Thursday. No, wait, my notes here say Tuesday after all. Tuesday, seventy pounds." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Mandarin is a conversational course, aimed at people who already know the basics. It's on Monday afternoons, and it's slightly more expensive because of the small class size — one hundred and ten pounds." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Italian is an intermediate course, meeting on Thursday evenings, and the fee is ninety-five pounds, which is already shown on your sheet." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "And finally German, elementary level, on Friday mornings. That's our cheapest option at sixty pounds." },
  ]),
  questions: [
    textQ("table_completion", "listening-targeted-table-completion-01-q01", "French — Level: __________", "introductory", "The French class is an introductory course for complete beginners.", { wordLimit: 1, evidence: "introductory course", difficulty: 2, tableCellId: "french-level" }),
    textQ("table_completion", "listening-targeted-table-completion-01-q02", "French — Fee: £__________", "85", "The French fee is eighty-five pounds.", { wordLimit: 1, allowNumber: true, evidence: "eighty-five pounds", acceptableAnswers: ["eighty-five"], difficulty: 1, tableCellId: "french-fee" }),
    textQ("table_completion", "listening-targeted-table-completion-01-q03", "Spanish — Day: __________", "Tuesday", "The adviser corrects himself and settles on Tuesday.", { wordLimit: 1, evidence: "Tuesday, seventy pounds", difficulty: 2, tableCellId: "spanish-day" }),
    textQ("table_completion", "listening-targeted-table-completion-01-q04", "Spanish — Fee: £__________", "70", "Spanish is seventy pounds.", { wordLimit: 1, allowNumber: true, evidence: "seventy pounds", acceptableAnswers: ["seventy"], difficulty: 1, tableCellId: "spanish-fee" }),
    textQ("table_completion", "listening-targeted-table-completion-01-q05", "Mandarin — Level: __________", "conversational", "Mandarin is a conversational course for those who know the basics.", { wordLimit: 1, evidence: "conversational course", difficulty: 2, tableCellId: "mandarin-level" }),
    textQ("table_completion", "listening-targeted-table-completion-01-q06", "Mandarin — Fee: £__________", "110", "Mandarin costs one hundred and ten pounds.", { wordLimit: 1, allowNumber: true, evidence: "one hundred and ten pounds", acceptableAnswers: ["110"], difficulty: 2, tableCellId: "mandarin-fee" }),
    textQ("table_completion", "listening-targeted-table-completion-01-q07", "Italian — Level: __________", "intermediate", "Italian is an intermediate course.", { wordLimit: 1, evidence: "intermediate course", difficulty: 1, tableCellId: "italian-level" }),
    textQ("table_completion", "listening-targeted-table-completion-01-q08", "German — Day: __________", "Friday", "German meets on Friday mornings.", { wordLimit: 1, evidence: "Friday mornings", difficulty: 1, tableCellId: "german-day" }),
  ],
};

const TABLE2 = [
  "TABLE: Library event schedule.",
  "",
  "| Event          | Room          | Time     |",
  "|----------------|---------------|----------|",
  "| Author talk    | Main hall     | ________ |",
  "| Story time     | _____________ | 10:30 am |",
  "| Computer help  | _____________ | ________ |",
  "| Book club      | Room 3        | ________ |",
  "| Film screening | Main hall     | ________ |",
  "| Poetry reading | _____________ | ________ |",
].join("\n");

export const listeningTableCompletion02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-table-completion-02", "Table completion — Library events", "both", "table_completion", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "table_completion",
  passages: [],
  taskStimulus: TABLE2,
  audio: listeningAudio("listening-targeted-table-completion-02", "Library event schedule", [
    { speaker: "Librarian", voice: "en_US-ryan-high", text: "Here's what's on at the library this Saturday. The author talk is in the main hall at six in the evening — that's the biggest event of the day." },
    { speaker: "Librarian", voice: "en_US-ryan-high", text: "For younger visitors, children's story time is in the children's corner at half past ten in the morning. No need to book, just turn up." },
    { speaker: "Librarian", voice: "en_US-ryan-high", text: "Our computer help session runs in room two, starting at two o'clock. We'd prefer you to book a slot because it's popular." },
    { speaker: "Librarian", voice: "en_US-ryan-high", text: "The book club meets in room three at four thirty, and this month they're discussing a travel memoir." },
    { speaker: "Librarian", voice: "en_US-ryan-high", text: "And to finish the day, we're screening a film in the main hall at seven. Entry is free with a library card." },
    { speaker: "Librarian", voice: "en_US-ryan-high", text: "One more thing — there's also a poetry reading in the garden at three in the afternoon, weather permitting." },
  ]),
  questions: [
    textQ("table_completion", "listening-targeted-table-completion-02-q01", "Author talk — Time: __________ pm", "6", "The author talk is at six in the evening.", { wordLimit: 1, allowNumber: true, evidence: "six in the evening", acceptableAnswers: ["six"], difficulty: 1, tableCellId: "talk-time" }),
    textQ("table_completion", "listening-targeted-table-completion-02-q02", "Story time — Room: children's __________", "corner", "Story time is in the children's corner.", { wordLimit: 1, evidence: "children's corner", difficulty: 1, tableCellId: "story-room" }),
    textQ("table_completion", "listening-targeted-table-completion-02-q03", "Computer help — Room: room __________", "2", "Computer help runs in room two.", { wordLimit: 1, allowNumber: true, evidence: "room two", acceptableAnswers: ["two"], difficulty: 1, tableCellId: "computer-room" }),
    textQ("table_completion", "listening-targeted-table-completion-02-q04", "Computer help — Time: __________ pm", "2", "Computer help starts at two o'clock.", { wordLimit: 1, allowNumber: true, evidence: "two o'clock", acceptableAnswers: ["two"], difficulty: 2, tableCellId: "computer-time" }),
    textQ("table_completion", "listening-targeted-table-completion-02-q05", "Book club — Time: __________", "4:30", "The book club meets at four thirty.", { wordLimit: 2, allowNumber: true, evidence: "four thirty", acceptableAnswers: ["four thirty"], difficulty: 2, tableCellId: "bookclub-time" }),
    textQ("table_completion", "listening-targeted-table-completion-02-q06", "Film screening — Time: __________ pm", "7", "The film is screened at seven.", { wordLimit: 1, allowNumber: true, evidence: "at seven", acceptableAnswers: ["seven"], difficulty: 1, tableCellId: "film-time" }),
    textQ("table_completion", "listening-targeted-table-completion-02-q07", "Poetry reading — Room: the __________", "garden", "The poetry reading is in the garden.", { wordLimit: 1, evidence: "in the garden", difficulty: 2, tableCellId: "poetry-room" }),
    textQ("table_completion", "listening-targeted-table-completion-02-q08", "Poetry reading — Time: __________ pm", "three", "The poetry reading is at three in the afternoon.", { wordLimit: 1, allowNumber: true, evidence: "three in the afternoon", acceptableAnswers: ["3"], difficulty: 1, tableCellId: "poetry-time" }),
  ],
};
