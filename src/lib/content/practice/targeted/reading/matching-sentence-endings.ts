// Original targeted Reading drills — Matching Sentence Endings.

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, matchingQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-matching-sentence-endings-01-p01",
  "The rise of urban forests",
  [
    "Cities around the world are planting trees at an unprecedented rate, and urban forests now feature in the climate plans of dozens of national governments. The benefits most often cited are cooling and carbon capture, but researchers studying the wider effects have found that the value of city trees depends heavily on where and how they are planted.",
    "One long-term study in a mid-sized European city measured temperatures on identical streets with and without tree cover. It found that mature canopies lowered peak summer temperatures by up to four degrees, but only on streets where trees formed a continuous canopy; isolated trees had almost no measurable effect.",
    "A second study examined the relationship between street trees and air quality. Contrary to the popular assumption that trees always clean the air, the researchers found that rows of trees on narrow streets with heavy traffic can actually trap pollutants at ground level, because the canopy blocks the airflow that would otherwise disperse them.",
    "Health researchers have added a further dimension. Surveys of hospital admissions suggest that neighbourhoods with more tree cover report lower rates of stress-related illness, though the authors caution that wealthier districts tend to have both more trees and better health services, making cause and effect difficult to separate.",
    "The practical conclusion is that urban forestry needs planning rather than enthusiasm. Choosing species that tolerate drought, planting them where canopies can join up, and avoiding solid barriers on polluted streets can multiply the benefits of the same budget several times over.",
  ].join("\n\n"),
);

export const matchingSentenceEndingsSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-matching-sentence-endings-01", "Matching sentence endings — Urban forests", "academic", "matching_sentence_endings", 4),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "matching_sentence_endings",
  passages: [p1],
  questions: [
    matchingQuestion("matching_sentence_endings", "matching", "reading-targeted-matching-sentence-endings-01-q01",
      "Complete each sentence with the correct ending.",
      [
        { id: "A", text: "only when trees form a continuous canopy." },
        { id: "B", text: "because the canopy blocks the airflow that would disperse them." },
        { id: "C", text: "making cause and effect hard to separate." },
        { id: "D", text: "rather than enthusiasm." },
        { id: "E", text: "on where and how they are planted." },
        { id: "F", text: "by up to four degrees." },
        { id: "G", text: "than any other single measure." },
        { id: "H", text: "that were planted before 1950." },
      ],
      [
        { id: "mse-01-i1", text: "The value of city trees depends heavily", correctOptionId: "E" },
        { id: "mse-01-i2", text: "Mature canopies lowered peak summer temperatures", correctOptionId: "F" },
        { id: "mse-01-i3", text: "The cooling effect appeared", correctOptionId: "A" },
        { id: "mse-01-i4", text: "Trees on narrow streets can trap pollutants", correctOptionId: "B" },
        { id: "mse-01-i5", text: "Wealthier districts have more trees and better services,", correctOptionId: "C" },
        { id: "mse-01-i6", text: "Urban forestry needs planning", correctOptionId: "D" },
      ],
      "Endings complete each sentence grammatically and semantically; distractors G and H are wrong in scope.", "reading-targeted-matching-sentence-endings-01-p01"),
  ],
};

const p2 = originalPassage(
  "reading-targeted-matching-sentence-endings-02-p01",
  "Starting a neighbourhood food-sharing scheme",
  [
    "Community food-sharing schemes have spread across many towns, and their organisers say the benefits go well beyond the food itself. A scheme typically begins when a few neighbours agree to collect surplus food from local shops and distribute it from a volunteer's garage or a community centre.",
    "The first practical step is to approach shops that regularly discard edible food, such as bakeries and greengrocers. Most are willing to help once they understand that donated food is protected from liability under food-recovery laws, and that collections will be punctual and hygienic.",
    "The second step concerns storage and safety. Perishable food must be refrigerated quickly and given out on the same day, which means organisers need at least two volunteers on every collection day. A simple record of what was collected and where it went satisfies the local authority's requirements in most areas.",
    "The third step is to keep expectations modest. New schemes often collapse because one enthusiastic founder tries to do everything alone. Experienced organisers recommend starting with one shop and one collection day per week, and expanding only when a rota of six or more volunteers is in place.",
    "The wider benefits follow almost automatically. Regular recipients begin to help with collections, neighbours who have never spoken become familiar faces, and shops report fewer complaints about waste disposal. What starts as a practical arrangement, organisers say, quietly becomes part of the community's routine.",
  ].join("\n\n"),
);

export const matchingSentenceEndingsSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-matching-sentence-endings-02", "Matching sentence endings — Food-sharing schemes", "general", "matching_sentence_endings", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "matching_sentence_endings",
  passages: [p2],
  questions: [
    matchingQuestion("matching_sentence_endings", "matching", "reading-targeted-matching-sentence-endings-02-q01",
      "Complete each sentence with the correct ending.",
      [
        { id: "A", text: "because donated food is protected under food-recovery laws." },
        { id: "B", text: "and given out on the same day." },
        { id: "C", text: "because one founder tries to do everything alone." },
        { id: "D", text: "quietly becomes part of the community's routine." },
        { id: "E", text: "to keep expectations modest." },
        { id: "F", text: "that sell only packaged goods." },
        { id: "G", text: "after paying a registration fee." },
        { id: "H", text: "in winter months only." },
        { id: "I", text: "and neighbours who never spoke become familiar faces." },
      ],
      [
        { id: "mse-02-i1", text: "Shops are usually willing to help", correctOptionId: "A" },
        { id: "mse-02-i2", text: "Perishable food must be refrigerated quickly", correctOptionId: "B" },
        { id: "mse-02-i3", text: "New schemes often collapse", correctOptionId: "C" },
        { id: "mse-02-i4", text: "Experienced organisers recommend starting small,", correctOptionId: "E" },
        { id: "mse-02-i5", text: "Regular recipients begin to help with collections,", correctOptionId: "I" },
        { id: "mse-02-i6", text: "A practical arrangement", correctOptionId: "D" },
      ],
      "Endings complete each sentence; distractors F, G and H are wrong in scope.", "reading-targeted-matching-sentence-endings-02-p01"),
  ],
};
