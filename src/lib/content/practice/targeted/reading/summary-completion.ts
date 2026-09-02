// Original targeted Reading drills — Summary Completion.

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, textQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-summary-completion-01-p01",
  "The reintroduction of the beaver",
  [
    "Beavers were hunted to extinction in Britain by the sixteenth century, but in the last twenty years a number of populations have been deliberately reintroduced, most controversially on rivers used for farming. Supporters argue that beaver dams slow the flow of water, reducing the risk of flooding downstream, and create ponds that shelter fish, insects and birds.",
    "Farmers have been more cautious. In some areas beavers felled trees planted for timber and blocked drainage channels, causing fields to flood. Early reintroduction projects therefore required expensive fencing and regular removal of dams, which opponents said proved that the animals were incompatible with modern land use.",
    "The evidence from longer-term studies is more positive than the early disputes suggested. A five-year trial on one river system found that flood peaks downstream fell by almost a third in wet winters, while the cost of managing problem dams declined sharply once trapping and relocation teams gained experience.",
    "Scientists involved in the trial stress that beavers are not a universal solution. On narrow, fast-flowing rivers the animals have little effect, and in areas with valuable riverside crops their activity can still cause serious losses. Most now recommend that reintroduction proceed case by case, with local landowners involved from the start.",
  ].join("\n\n"),
);

export const summaryCompletionSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-summary-completion-01", "Summary completion — The reintroduction of the beaver", "academic", "summary_completion", 4),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "summary_completion",
  passages: [p1],
  questions: [
    textQuestion("summary_completion", "reading-targeted-summary-completion-01-q01", "Beavers were hunted to extinction in Britain by the __________ century.", "sixteenth", "The passage states beavers were hunted to extinction by the sixteenth century.", "reading-targeted-summary-completion-01-p01", { wordLimit: 1, evidence: "sixteenth century", difficulty: 1 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-01-q02", "Beaver dams slow the flow of water and reduce the risk of __________ downstream.", "flooding", "Dams reduce the risk of flooding downstream.", "reading-targeted-summary-completion-01-p01", { wordLimit: 1, evidence: "reducing the risk of flooding", difficulty: 2 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-01-q03", "Farmers complained that beavers blocked __________ channels.", "drainage", "Beavers blocked drainage channels, causing fields to flood.", "reading-targeted-summary-completion-01-p01", { wordLimit: 1, evidence: "blocked drainage channels", difficulty: 2 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-01-q04", "Early projects needed expensive fencing and regular removal of __________.", "dams", "Early projects required fencing and regular dam removal.", "reading-targeted-summary-completion-01-p01", { wordLimit: 1, evidence: "removal of dams", difficulty: 2 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-01-q05", "In a five-year trial, flood peaks fell by almost a __________ in wet winters.", "third", "Flood peaks downstream fell by almost a third.", "reading-targeted-summary-completion-01-p01", { wordLimit: 1, evidence: "almost a third", difficulty: 2 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-01-q06", "The cost of managing problem dams declined once teams gained __________.", "experience", "Costs declined sharply once trapping teams gained experience.", "reading-targeted-summary-completion-01-p01", { wordLimit: 1, evidence: "gained experience", difficulty: 3 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-01-q07", "On narrow, fast-flowing rivers the animals have little __________.", "effect", "On narrow, fast-flowing rivers the animals have little effect.", "reading-targeted-summary-completion-01-p01", { wordLimit: 1, evidence: "little effect", difficulty: 3 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-01-q08", "Scientists recommend that reintroduction proceed case by __________.", "case", "Most recommend proceeding case by case with local landowners.", "reading-targeted-summary-completion-01-p01", { wordLimit: 1, evidence: "case by case", difficulty: 2 }),
  ],
};

const p2 = originalPassage(
  "reading-targeted-summary-completion-02-p01",
  "How to prepare for a job interview",
  [
    "A successful interview usually begins long before the interview itself. Employers consistently report that candidates who have researched the company, and who arrive with two or three thoughtful questions, are remembered far more favourably than those who answer every question well but know nothing about the organisation.",
    "Preparation should start with the job description. List each requirement and write down one example from your own experience that shows you meet it. Examples should follow a simple structure: what the situation was, what you did, and what the result was. Practising these examples aloud, even once, makes them far easier to recall under pressure.",
    "On the day itself, allow more time than you think you need for the journey. Arriving fifteen minutes early gives you time to compose yourself, while arriving late is almost impossible to recover from, however good your answers later.",
    "After the interview, a short thank-you message is still worthwhile. It need not be elaborate: a few lines that mention something specific from the conversation shows attention and professionalism, and keeps your name in the interviewer's mind when the final decision is made.",
  ].join("\n\n"),
);

export const summaryCompletionSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-summary-completion-02", "Summary completion — Preparing for an interview", "general", "summary_completion", 2),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "summary_completion",
  passages: [p2],
  questions: [
    textQuestion("summary_completion", "reading-targeted-summary-completion-02-q01", "Candidates who have researched the __________ are remembered more favourably.", "company", "Candidates who research the company are remembered favourably.", "reading-targeted-summary-completion-02-p01", { wordLimit: 1, evidence: "researched the company", difficulty: 1 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-02-q02", "Preparation should start with the job __________.", "description", "Preparation should start with the job description.", "reading-targeted-summary-completion-02-p01", { wordLimit: 1, evidence: "job description", difficulty: 1 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-02-q03", "Each example should show the situation, what you did, and the __________.", "result", "Examples follow: situation, what you did, result.", "reading-targeted-summary-completion-02-p01", { wordLimit: 1, evidence: "what the result was", difficulty: 2 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-02-q04", "Practising examples __________ makes them easier to recall.", "aloud", "Practising aloud, even once, makes examples easier to recall.", "reading-targeted-summary-completion-02-p01", { wordLimit: 1, evidence: "Practising these examples aloud", difficulty: 2 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-02-q05", "Aim to arrive __________ minutes early.", "fifteen", "Arriving fifteen minutes early gives time to compose yourself.", "reading-targeted-summary-completion-02-p01", { wordLimit: 1, evidence: "fifteen minutes early", difficulty: 1 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-02-q06", "Arriving __________ is almost impossible to recover from.", "late", "Arriving late is almost impossible to recover from.", "reading-targeted-summary-completion-02-p01", { wordLimit: 1, evidence: "arriving late", difficulty: 1 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-02-q07", "A short __________ message after the interview is still worthwhile.", "thank-you", "A short thank-you message is still worthwhile.", "reading-targeted-summary-completion-02-p01", { wordLimit: 1, evidence: "thank-you message", difficulty: 1 }),
    textQuestion("summary_completion", "reading-targeted-summary-completion-02-q08", "The message should mention something specific from the __________.", "conversation", "Mention something specific from the conversation.", "reading-targeted-summary-completion-02-p01", { wordLimit: 1, evidence: "from the conversation", difficulty: 2 }),
  ],
};
