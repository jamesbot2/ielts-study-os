// Original targeted Reading drills — Short-answer Questions.

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, textQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-short-answer-01-p01",
  "The world's oldest maps",
  [
    "The oldest known maps were not drawn on paper but scratched into clay tablets by Babylonian scribes more than four thousand years ago. The most famous of these, known as the Babylonian World Map, is a small tablet about twelve centimetres across that shows the world as a flat disc surrounded by a circular ocean, with the city of Babylon placed proudly at the centre.",
    "Mapping developed independently in many cultures. The ancient Greeks were the first to calculate the Earth's circumference with reasonable accuracy, when the scholar Eratosthenes compared the angles of shadows in two cities on the same day in about 240 BC. His estimate of the Earth's size was within a few per cent of the true value.",
    "Chinese cartography reached a peak under the Han dynasty, when the polymath Zhang Heng invented the first seismoscope and produced maps that used a rectangular grid system to represent scale. Grids allowed distances between places to be measured directly from the map, a technique that Europe did not adopt widely until much later.",
    "The great age of European exploration in the fifteenth and sixteenth centuries transformed map-making from a scholarly art into a tool of empire. The Portuguese, who led the first voyages down the African coast, kept their navigation charts as state secrets, and captains were required to hand them in at the end of every voyage.",
  ].join("\n\n"),
);

export const shortAnswerSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-short-answer-01", "Short-answer questions — The world's oldest maps", "academic", "short_answer", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "short_answer",
  passages: [p1],
  questions: [
    textQuestion("short_answer", "reading-targeted-short-answer-01-q01", "What material were the oldest known maps scratched into?", "clay", "The oldest maps were scratched into clay tablets.", "reading-targeted-short-answer-01-p01", { wordLimit: 1, evidence: "clay tablets", difficulty: 1 }),
    textQuestion("short_answer", "reading-targeted-short-answer-01-q02", "Which city was placed at the centre of the Babylonian World Map?", "Babylon", "The city of Babylon was placed at the centre.", "reading-targeted-short-answer-01-p01", { wordLimit: 1, evidence: "Babylon", difficulty: 1 }),
    textQuestion("short_answer", "reading-targeted-short-answer-01-q03", "Who first calculated the Earth's circumference with reasonable accuracy?", "the ancient Greeks", "The ancient Greeks were the first to calculate the circumference.", "reading-targeted-short-answer-01-p01", { wordLimit: 3, evidence: "The ancient Greeks", acceptableAnswers: ["the Greeks", "ancient Greeks"], difficulty: 2 }),
    textQuestion("short_answer", "reading-targeted-short-answer-01-q04", "In approximately which year did Eratosthenes make his calculation?", "240 BC", "Eratosthenes compared shadow angles in about 240 BC.", "reading-targeted-short-answer-01-p01", { wordLimit: 2, evidence: "240 BC", acceptableAnswers: ["240BC", "240"], difficulty: 2 }),
    textQuestion("short_answer", "reading-targeted-short-answer-01-q05", "Which scholar invented the first seismoscope?", "Zhang Heng", "The polymath Zhang Heng invented the first seismoscope.", "reading-targeted-short-answer-01-p01", { wordLimit: 2, evidence: "Zhang Heng", difficulty: 2 }),
    textQuestion("short_answer", "reading-targeted-short-answer-01-q06", "Which dynasty saw the peak of early Chinese cartography?", "the Han dynasty", "Chinese cartography reached a peak under the Han dynasty.", "reading-targeted-short-answer-01-p01", { wordLimit: 3, evidence: "Han dynasty", acceptableAnswers: ["Han"], difficulty: 2 }),
    textQuestion("short_answer", "reading-targeted-short-answer-01-q07", "Which nation kept its navigation charts as state secrets?", "the Portuguese", "The Portuguese kept their navigation charts as state secrets.", "reading-targeted-short-answer-01-p01", { wordLimit: 2, evidence: "Portuguese", acceptableAnswers: ["Portugal"], difficulty: 2 }),
    textQuestion("short_answer", "reading-targeted-short-answer-01-q08", "When did captains have to hand in their charts?", "at the end of every voyage", "Captains handed charts in at the end of every voyage.", "reading-targeted-short-answer-01-p01", { wordLimit: 5, evidence: "at the end of every voyage", difficulty: 3 }),
  ],
};

const p2 = originalPassage(
  "reading-targeted-short-answer-02-p01",
  "Using the city's recycling service",
  [
    "The city council provides a free weekly recycling collection to every household. Recyclable materials should be placed in the green bin, which is collected on the same day as the general waste but by a different vehicle, usually two or three hours later.",
    "The green bin accepts paper, cardboard, glass bottles, metal cans and plastic containers. It does not accept plastic bags, polystyrene, or food waste; items placed in the wrong bin can cause the whole load to be rejected at the sorting plant. Plastic containers should be rinsed and their lids removed before disposal.",
    "Households that produce large amounts of garden waste can subscribe to a separate brown-bin service, which costs thirty-five pounds per year and runs from March to November. Christmas trees are collected free of charge for two weeks in January if they are left beside the green bin.",
    "If a collection is missed, residents should report it through the council website within forty-eight hours. The council will return within two working days, provided the bin was left out by seven in the morning on collection day and was not overfilled.",
  ].join("\n\n"),
);

export const shortAnswerSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-short-answer-02", "Short-answer questions — The recycling service", "general", "short_answer", 2),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "short_answer",
  passages: [p2],
  questions: [
    textQuestion("short_answer", "reading-targeted-short-answer-02-q01", "Which bin is used for recyclable materials?", "the green bin", "Recyclable materials should be placed in the green bin.", "reading-targeted-short-answer-02-p01", { wordLimit: 3, evidence: "green bin", acceptableAnswers: ["green bin", "green"], difficulty: 1 }),
    textQuestion("short_answer", "reading-targeted-short-answer-02-q02", "What can cause a whole load to be rejected at the sorting plant?", "items placed in the wrong bin", "Wrong items can cause the whole load to be rejected.", "reading-targeted-short-answer-02-p01", { wordLimit: 5, evidence: "items placed in the wrong bin", difficulty: 2 }),
    textQuestion("short_answer", "reading-targeted-short-answer-02-q03", "How much does the brown-bin garden waste service cost per year?", "35 pounds", "The brown-bin service costs thirty-five pounds per year.", "reading-targeted-short-answer-02-p01", { wordLimit: 2, evidence: "thirty-five pounds", acceptableAnswers: ["thirty-five pounds", "35"], difficulty: 1 }),
    textQuestion("short_answer", "reading-targeted-short-answer-02-q04", "In which month is the brown-bin service suspended for the winter?", "December", "The service runs from March to November, so it stops in December.", "reading-targeted-short-answer-02-p01", { wordLimit: 1, evidence: "March to November", acceptableAnswers: ["November"], difficulty: 3 }),
    textQuestion("short_answer", "reading-targeted-short-answer-02-q05", "When are Christmas trees collected free of charge?", "in January", "Christmas trees are collected free for two weeks in January.", "reading-targeted-short-answer-02-p01", { wordLimit: 2, evidence: "in January", difficulty: 1 }),
    textQuestion("short_answer", "reading-targeted-short-answer-02-q06", "Within how many hours should a missed collection be reported?", "48", "Missed collections should be reported within forty-eight hours.", "reading-targeted-short-answer-02-p01", { wordLimit: 2, evidence: "forty-eight hours", acceptableAnswers: ["forty-eight hours", "48 hours"], difficulty: 2 }),
    textQuestion("short_answer", "reading-targeted-short-answer-02-q07", "By what time must the bin be left out on collection day?", "seven in the morning", "The bin must be left out by seven in the morning.", "reading-targeted-short-answer-02-p01", { wordLimit: 3, evidence: "seven in the morning", acceptableAnswers: ["7 in the morning", "seven"], difficulty: 2 }),
    textQuestion("short_answer", "reading-targeted-short-answer-02-q08", "What two items does the green bin NOT accept, besides plastic bags and polystyrene?", "food waste", "It does not accept plastic bags, polystyrene, or food waste.", "reading-targeted-short-answer-02-p01", { wordLimit: 2, evidence: "food waste", difficulty: 2 }),
  ],
};
