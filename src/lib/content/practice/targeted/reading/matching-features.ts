// Original targeted Reading drills — Matching Features.

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, matchingQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-matching-features-01-p01",
  "Three approaches to reducing food waste",
  [
    "Around a third of all food produced for human consumption is never eaten. Three contrasting approaches to the problem have attracted attention in recent years.",
    "Dr Elena Marsh, an economist at the Northern Policy Institute, argues that waste is primarily a pricing problem. Supermarkets order more stock than they can sell because unsold food is cheaper for them than the risk of an empty shelf, and households discard food because it costs so little. Marsh's research suggests that a modest tax on landfill disposal reduces waste more effectively than any awareness campaign.",
    "The Clean Plate Foundation takes a social rather than an economic view. Its founder, Ravi Patel, insists that waste begins in the home, with portion sizes and shopping habits learned in childhood. The foundation runs school programmes in which children weigh their leftover food each day; participating schools typically halve their waste within one term.",
    "A third position comes from logistics researchers at the firm Cold Chain Solutions. They point out that in warm countries, a large share of food spoils before it ever reaches a shop, because storage and transport are inadequate. Their pilot project in two coastal regions used solar-powered cold stores and cut post-harvest losses by almost half.",
    "Critics note that none of these approaches alone can solve the problem. Marsh's tax proposals face political resistance, Patel's school programmes do nothing for farms, and cold-chain investment is useless where roads are impassable. Most experts now argue for combining measures according to local conditions.",
  ].join("\n\n"),
);

export const matchingFeaturesSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-matching-features-01", "Matching features — Approaches to food waste", "academic", "matching_features", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "matching_features",
  passages: [p1],
  questions: [
    matchingQuestion("matching_features", "matching", "reading-targeted-matching-features-01-q01",
      "Match each statement with the person or organisation it refers to.",
      [
        { id: "A", text: "Dr Elena Marsh" },
        { id: "B", text: "Ravi Patel (Clean Plate Foundation)" },
        { id: "C", text: "Cold Chain Solutions" },
        { id: "D", text: "Critics" },
      ],
      [
        { id: "mf-01-i1", text: "believes waste is mainly a problem of prices", correctOptionId: "A" },
        { id: "mf-01-i2", text: "thinks waste begins with habits learned at home", correctOptionId: "B" },
        { id: "mf-01-i3", text: "runs programmes where children weigh leftover food", correctOptionId: "B" },
        { id: "mf-01-i4", text: "focused on spoilage during storage and transport", correctOptionId: "C" },
        { id: "mf-01-i5", text: "used solar-powered cold stores in a pilot project", correctOptionId: "C" },
        { id: "mf-01-i6", text: "proposed a tax on landfill disposal", correctOptionId: "A" },
        { id: "mf-01-i7", text: "argues that no single approach is sufficient", correctOptionId: "D" },
        { id: "mf-01-i8", text: "notes that cold chains fail where roads are impassable", correctOptionId: "D" },
      ],
      "Statements paraphrase the views of specific people or organisations.", "reading-targeted-matching-features-01-p01"),
  ],
};

const p2 = originalPassage(
  "reading-targeted-matching-features-02-p01",
  "Local businesses respond to the flood",
  [
    "When the river flooded the market district last spring, the response of local businesses varied widely.",
    "The owner of the Riverside Bakery, Ana Ferreira, closed for only one week. Her insurers paid quickly, and she used the shutdown to replace ageing ovens. By autumn her sales were higher than before the flood, and she attributes this to customers who wanted to support a shop that had reopened fast.",
    "By contrast, the proprietor of the Old Bridge Bookshop, Marcus Webb, is still fighting his insurance company over whether the damage was caused by floodwater or rising damp. He reopened with borrowed stock, but says a second year like the last would force him to close permanently.",
    "The Green Lane Hardware Store took a different path entirely. Its owner, Priya Nair, had already decided to retire, and the flood made up her mind. She sold the premises to a housing developer and donated her remaining stock to a community repair workshop.",
    "The market's traders' association believes the flood exposed a wider problem: the district's drainage was designed for rainfall levels that no longer occur. Its chair, Tom Okafor, has campaigned for a levy on large riverside developments to pay for upgraded drainage, an idea the council is now studying.",
  ].join("\n\n"),
);

export const matchingFeaturesSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-matching-features-02", "Matching features — Businesses after the flood", "general", "matching_features", 2),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "matching_features",
  passages: [p2],
  questions: [
    matchingQuestion("matching_features", "matching", "reading-targeted-matching-features-02-q01",
      "Match each statement with the person it refers to.",
      [
        { id: "A", text: "Ana Ferreira" },
        { id: "B", text: "Marcus Webb" },
        { id: "C", text: "Priya Nair" },
        { id: "D", text: "Tom Okafor" },
      ],
      [
        { id: "mf-02-i1", text: "reopened after only one week", correctOptionId: "A" },
        { id: "mf-02-i2", text: "is still in dispute with an insurance company", correctOptionId: "B" },
        { id: "mf-02-i3", text: "reopened using borrowed stock", correctOptionId: "B" },
        { id: "mf-02-i4", text: "had already planned to retire", correctOptionId: "C" },
        { id: "mf-02-i5", text: "donated stock to a community repair workshop", correctOptionId: "C" },
        { id: "mf-02-i6", text: "believes the drainage system is outdated", correctOptionId: "D" },
        { id: "mf-02-i7", text: "says customers supported the shop because it reopened quickly", correctOptionId: "A" },
        { id: "mf-02-i8", text: "has campaigned for a levy on riverside developments", correctOptionId: "D" },
      ],
      "Statements paraphrase what each person did or believes.", "reading-targeted-matching-features-02-p01"),
  ],
};
