// Original targeted Listening drills — Short-answer Questions.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, textQ } from "./helpers";

export const listeningShortAnswer01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-short-answer-01", "Short answers — Estate agent viewing", "both", "short_answer", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "short_answer",
  passages: [],
  audio: listeningAudio("listening-targeted-short-answer-01", "Estate agent viewing", [
    { speaker: "Agent", voice: "en_US-lessac-medium", text: "Right, welcome to number fourteen Ash Grove. I'll take you through the house, and just ask if anything's unclear." },
    { speaker: "Buyer", voice: "en_US-ryan-high", text: "Thanks. First question — when was the property built?" },
    { speaker: "Agent", voice: "en_US-lessac-medium", text: "It was built in 1998, and it's been with the same owner since new. The boiler was replaced just two years ago, so that's one thing you won't need to worry about." },
    { speaker: "Buyer", voice: "en_US-ryan-high", text: "Good. And how much is the council tax?" },
    { speaker: "Agent", voice: "en_US-lessac-medium", text: "It's band D, which currently works out at one hundred and sixty-eight pounds a month." },
    { speaker: "Buyer", voice: "en_US-ryan-high", text: "What about the schools? We have two children." },
    { speaker: "Agent", voice: "en_US-lessac-medium", text: "The local primary is a ten-minute walk, and the secondary school runs a bus service from the end of the road. Both are rated good by the inspectors." },
    { speaker: "Buyer", voice: "en_US-ryan-high", text: "And one more — has the roof ever leaked?" },
    { speaker: "Agent", voice: "en_US-lessac-medium", text: "Not in the time the current owner has lived here, no. There was some work on the chimney in 2015, but that was precautionary." },
  ]),
  questions: [
    textQ("short_answer", "listening-targeted-short-answer-01-q01", "When was the property built?", "1998", "The agent says the property was built in 1998.", { wordLimit: 1, allowNumber: true, evidence: "built in 1998", difficulty: 1 }),
    textQ("short_answer", "listening-targeted-short-answer-01-q02", "When was the boiler replaced?", "two years ago", "The boiler was replaced just two years ago.", { wordLimit: 3, evidence: "two years ago", difficulty: 2 }),
    textQ("short_answer", "listening-targeted-short-answer-01-q03", "What council tax band is the property in?", "band D", "The property is in council tax band D.", { wordLimit: 2, evidence: "band D", acceptableAnswers: ["D"], difficulty: 1 }),
    textQ("short_answer", "listening-targeted-short-answer-01-q04", "How much is the council tax per month?", "168 pounds", "Band D is one hundred and sixty-eight pounds a month.", { wordLimit: 2, allowNumber: true, evidence: "one hundred and sixty-eight pounds", acceptableAnswers: ["£168", "168"], difficulty: 2 }),
    textQ("short_answer", "listening-targeted-short-answer-01-q05", "How long does it take to walk to the local primary school?", "ten minutes", "The primary is a ten-minute walk.", { wordLimit: 2, allowNumber: true, evidence: "ten-minute walk", acceptableAnswers: ["10 minutes"], difficulty: 1 }),
    textQ("short_answer", "listening-targeted-short-answer-01-q06", "What service does the secondary school provide?", "a bus service", "The secondary school runs a bus service from the end of the road.", { wordLimit: 3, evidence: "bus service", acceptableAnswers: ["bus service"], difficulty: 2 }),
    textQ("short_answer", "listening-targeted-short-answer-01-q07", "What rating did the inspectors give both schools?", "good", "Both schools are rated good by the inspectors.", { wordLimit: 1, evidence: "rated good", difficulty: 1 }),
    textQ("short_answer", "listening-targeted-short-answer-01-q08", "What work was carried out on the house in 2015?", "chimney work", "There was some work on the chimney in 2015.", { wordLimit: 2, evidence: "work on the chimney", acceptableAnswers: ["the chimney"], difficulty: 2 }),
  ],
};

export const listeningShortAnswer02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-short-answer-02", "Short answers — Tourist information", "both", "short_answer", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "short_answer",
  passages: [],
  audio: listeningAudio("listening-targeted-short-answer-02", "Tourist information", [
    { speaker: "Visitor", voice: "en_US-ryan-high", text: "Hello — we've just arrived and we're only here for the day. What would you recommend we see first?" },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Welcome! I'd start with the old town, it's a five-minute walk from here. The cathedral there dates from the twelfth century, and entry is free before noon." },
    { speaker: "Visitor", voice: "en_US-ryan-high", text: "And the castle? I've heard it's worth a visit." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "It is, but it's closed on Tuesdays, so check before you go. The entrance fee is nine pounds for adults, and children under twelve go free." },
    { speaker: "Visitor", voice: "en_US-ryan-high", text: "What about the boat trip on the river?" },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "The boats leave from the pier every hour on the hour. The trip takes fifty minutes, and the last one leaves at five. If it rains, the upper deck is covered, so it's fine either way." },
    { speaker: "Visitor", voice: "en_US-ryan-high", text: "Lovely. And one last thing — is there anywhere good to eat near the station?" },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "The station café is actually excellent, and it's open until nine, which is later than most places in town." },
  ]),
  questions: [
    textQ("short_answer", "listening-targeted-short-answer-02-q01", "How far is the old town from the information office?", "five minutes", "The old town is a five-minute walk away.", { wordLimit: 2, allowNumber: true, evidence: "five-minute walk", acceptableAnswers: ["5 minutes"], difficulty: 1 }),
    textQ("short_answer", "listening-targeted-short-answer-02-q02", "From which century does the cathedral date?", "the twelfth century", "The cathedral dates from the twelfth century.", { wordLimit: 3, allowNumber: true, evidence: "twelfth century", acceptableAnswers: ["twelfth", "12th century", "12th"], difficulty: 2 }),
    textQ("short_answer", "listening-targeted-short-answer-02-q03", "Until what time is cathedral entry free?", "noon", "Entry is free before noon.", { wordLimit: 1, evidence: "before noon", difficulty: 2 }),
    textQ("short_answer", "listening-targeted-short-answer-02-q04", "On which day is the castle closed?", "Tuesday", "The castle is closed on Tuesdays.", { wordLimit: 1, evidence: "Tuesdays", acceptableAnswers: ["Tuesdays"], difficulty: 1 }),
    textQ("short_answer", "listening-targeted-short-answer-02-q05", "How much is the castle entrance fee for adults?", "9 pounds", "The entrance fee is nine pounds for adults.", { wordLimit: 2, allowNumber: true, evidence: "nine pounds", acceptableAnswers: ["£9", "nine", "9"], difficulty: 1 }),
    textQ("short_answer", "listening-targeted-short-answer-02-q06", "At what age can children enter the castle free?", "under twelve", "Children under twelve go free.", { wordLimit: 2, allowNumber: true, evidence: "under twelve", acceptableAnswers: ["12"], difficulty: 2 }),
    textQ("short_answer", "listening-targeted-short-answer-02-q07", "How long does the river boat trip take?", "50 minutes", "The trip takes fifty minutes.", { wordLimit: 2, allowNumber: true, evidence: "fifty minutes", acceptableAnswers: ["50"], difficulty: 1 }),
    textQ("short_answer", "listening-targeted-short-answer-02-q08", "What time does the last boat leave?", "five", "The last one leaves at five.", { wordLimit: 1, allowNumber: true, evidence: "leaves at five", acceptableAnswers: ["5", "5 pm"], difficulty: 1 }),
  ],
};
