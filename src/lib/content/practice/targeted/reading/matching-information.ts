// Original targeted Reading drills — Matching Information (which paragraph contains...).

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, matchingQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-matching-information-01-p01",
  "A brief history of the shipping container",
  [
    "A. Before the 1950s, cargo was moved by hand. Longshoremen unloaded sacks, barrels and crates piece by piece, and a single ship could spend more days in port than at sea. Loading costs were so high that some economists argued sea trade would never become cheap enough to support global manufacturing.",
    "B. The idea of a standard steel box was not new, but earlier attempts had failed because each port used different cranes and regulations. The breakthrough came when one shipping company persuaded ports, railways and trucking firms to accept a single box size. Standardisation, not the box itself, was the real invention.",
    "C. The results were dramatic. By the 1970s port labour costs had fallen by more than eighty per cent, and goods could travel from factory to shop without ever being unpacked. Critics warned of job losses among dock workers, and indeed many traditional ports declined while new container terminals flourished.",
    "D. Today the container is so ordinary that it is almost invisible, yet it shapes where factories are built, what goods cost and even where cities grow. Some historians rank it alongside the steam engine as one of the most consequential technologies of the modern economy.",
  ].join("\n\n"),
);

export const matchingInformationSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-matching-information-01", "Matching information — The shipping container", "academic", "matching_information", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "matching_information",
  passages: [p1],
  questions: [
    matchingQuestion("matching_information", "matching", "reading-targeted-matching-information-01-q01",
      "Which paragraph contains the following information?",
      [{ id: "A", text: "Paragraph A" }, { id: "B", text: "Paragraph B" }, { id: "C", text: "Paragraph C" }, { id: "D", text: "Paragraph D" }],
      [
        { id: "mi-01-i1", text: "a description of how goods were handled before standard containers", correctOptionId: "A" },
        { id: "mi-01-i2", text: "the claim that standardisation was the true invention", correctOptionId: "B" },
        { id: "mi-01-i3", text: "a statistic about falling labour costs", correctOptionId: "C" },
        { id: "mi-01-i4", text: "a warning about the effect on dock workers' jobs", correctOptionId: "C" },
        { id: "mi-01-i5", text: "a comparison with the steam engine", correctOptionId: "D" },
        { id: "mi-01-i6", text: "the reason earlier container attempts failed", correctOptionId: "B" },
        { id: "mi-01-i7", text: "the opinion that sea trade might never become cheap", correctOptionId: "A" },
        { id: "mi-01-i8", text: "the idea that containers influence where cities grow", correctOptionId: "D" },
      ],
      "Each statement paraphrases information located in a specific paragraph.", "reading-targeted-matching-information-01-p01"),
  ],
};

const p2 = originalPassage(
  "reading-targeted-matching-information-02-p01",
  "How a small town library reinvented itself",
  [
    "A. The Hartfield library opened in 1931 and for sixty years did exactly what libraries had always done: it lent books. Visitor numbers began falling in the 1990s, and by 2005 the building was in poor repair, with staff wondering whether the town council would close it.",
    "B. Rather than campaign simply for more funding, the library asked residents what they actually wanted. The most common request was a quiet place to study in the evenings, followed by help with online forms and job applications. The library responded by extending opening hours and hiring two part-time digital assistants.",
    "C. The changes produced results quickly. Evening visits tripled within two years, and the number of people using the library's computers passed a thousand per month. Just as important, the library began running conversation clubs for new residents learning the local language.",
    "D. The library's manager believes the lesson is simple: a library that only lends books is competing with the internet, but a library that provides space, help and community is competing with nothing at all.",
  ].join("\n\n"),
);

export const matchingInformationSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-matching-information-02", "Matching information — A reinvented library", "general", "matching_information", 2),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "matching_information",
  passages: [p2],
  questions: [
    matchingQuestion("matching_information", "matching", "reading-targeted-matching-information-02-q01",
      "Which paragraph contains the following information?",
      [{ id: "A", text: "Paragraph A" }, { id: "B", text: "Paragraph B" }, { id: "C", text: "Paragraph C" }, { id: "D", text: "Paragraph D" }],
      [
        { id: "mi-02-i1", text: "the year the library opened", correctOptionId: "A" },
        { id: "mi-02-i2", text: "the residents' most common request", correctOptionId: "B" },
        { id: "mi-02-i3", text: "the hiring of digital assistants", correctOptionId: "B" },
        { id: "mi-02-i4", text: "a tripling in evening visits", correctOptionId: "C" },
        { id: "mi-02-i5", text: "conversation clubs for new residents", correctOptionId: "C" },
        { id: "mi-02-i6", text: "concern that the council might close the building", correctOptionId: "A" },
        { id: "mi-02-i7", text: "the manager's view that a lending-only library competes with the internet", correctOptionId: "D" },
        { id: "mi-02-i8", text: "help with online forms and job applications", correctOptionId: "B" },
      ],
      "Each statement paraphrases information located in a specific paragraph.", "reading-targeted-matching-information-02-p01"),
  ],
};
