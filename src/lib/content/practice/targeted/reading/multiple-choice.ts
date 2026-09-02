// Original targeted Reading drills — Multiple Choice (Academic + General).

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, choiceQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-multiple-choice-01-p01",
  "Why some city trees fail",
  [
    "Street trees bring shade, absorb storm water and cool hot pavements, yet in many cities a surprising number of young trees die within their first five years. Researchers who tracked two thousand newly planted trees in three European capitals found that soil compaction was the strongest single predictor of early death. Heavy foot traffic and parked vehicles press the earth around the roots until air and water can no longer move freely, and the tree effectively suffocates.",
    "The second most common cause was watering practice. Trees that received small daily doses of water developed shallow roots near the surface, whereas trees watered deeply once a week sent roots downwards and survived dry spells far better. City maintenance schedules, however, tend to favour the frequent light approach because it is easier to automate.",
    "Species choice also mattered, though less than the researchers expected. Trees selected for fast growth often have brittle wood and short lifespans, but they still survived the early years as well as slower species if soil conditions were good. The report concluded that planting technology matters far more than genetics in the first decade of a tree's life.",
  ].join("\n\n"),
);

export const multipleChoiceSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-multiple-choice-01", "Multiple choice — Why some city trees fail", "academic", "multiple_choice", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "multiple_choice",
  passages: [p1],
  questions: [
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-01-q01", "What was the main cause of early tree death identified by the researchers?", [
      { id: "A", text: "Insufficient watering" },
      { id: "B", text: "Soil compaction" },
      { id: "C", text: "Poor species choice" },
      { id: "D", text: "Air pollution" },
    ], ["B"], "The passage states that soil compaction was the strongest single predictor of early death.", "reading-targeted-multiple-choice-01-p01", { evidence: "soil compaction was the strongest single predictor", difficulty: 2 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-01-q02", "What happens to trees watered lightly every day?", [
      { id: "A", text: "They grow faster than other trees" },
      { id: "B", text: "Their roots stay near the surface" },
      { id: "C", text: "They survive droughts better" },
      { id: "D", text: "They attract more pests" },
    ], ["B"], "Light daily watering produced shallow roots near the surface; deep weekly watering sent roots down.", "reading-targeted-multiple-choice-01-p01", { evidence: "developed shallow roots near the surface", difficulty: 3 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-01-q03", "Why do city maintenance teams prefer frequent light watering?", [
      { id: "A", text: "It is cheaper" },
      { id: "B", text: "It is easier to automate" },
      { id: "C", text: "It suits all tree species" },
      { id: "D", text: "It prevents soil compaction" },
    ], ["B"], "The passage says the frequent light approach is favoured because it is easier to automate.", "reading-targeted-multiple-choice-01-p01", { evidence: "easier to automate", difficulty: 3 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-01-q04", "How did fast-growing species perform in the study?", [
      { id: "A", text: "Much worse than slower species" },
      { id: "B", text: "Much better than slower species" },
      { id: "C", text: "As well as slower species if soil was good" },
      { id: "D", text: "They were not included in the study" },
    ], ["C"], "Fast-growing trees survived as well as slower species when soil conditions were good.", "reading-targeted-multiple-choice-01-p01", { evidence: "survived the early years as well as slower species if soil conditions were good", difficulty: 3 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-01-q05", "What does the report say about genetics?", [
      { id: "A", text: "Genetics matters more than planting technology" },
      { id: "B", text: "Genetics is irrelevant at every stage" },
      { id: "C", text: "Planting technology matters more in the first decade" },
      { id: "D", text: "Only native species should be planted" },
    ], ["C"], "The report concluded planting technology matters far more than genetics in the first decade.", "reading-targeted-multiple-choice-01-p01", { evidence: "planting technology matters far more than genetics", difficulty: 4 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-01-q06", "The researchers' study involved:", [
      { id: "A", text: "one capital city and 500 trees" },
      { id: "B", text: "three capital cities and 2,000 trees" },
      { id: "C", text: "five cities and 10,000 trees" },
      { id: "D", text: "rural forests only" },
    ], ["B"], "The study tracked two thousand newly planted trees in three European capitals.", "reading-targeted-multiple-choice-01-p01", { evidence: "two thousand newly planted trees in three European capitals", difficulty: 2 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-01-q07", "Street trees can cool hot pavements. What else does the passage say they do?", [
      { id: "A", text: "Increase traffic noise" },
      { id: "B", text: "Absorb storm water" },
      { id: "C", text: "Damage buildings" },
      { id: "D", text: "Attract insects" },
    ], ["B"], "The opening sentence lists shade, storm-water absorption and cooling.", "reading-targeted-multiple-choice-01-p01", { evidence: "absorb storm water", difficulty: 2 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-01-q08", "The main audience for this text is most likely:", [
      { id: "A", text: "professional arborists only" },
      { id: "B", text: "city planners and the interested public" },
      { id: "C", text: "children" },
      { id: "D", text: "engineers only" },
    ], ["B"], "The text explains urban tree management for a general educated audience, especially planners and residents.", "reading-targeted-multiple-choice-01-p01", { difficulty: 3 }),
  ],
};

const p2 = originalPassage(
  "reading-targeted-multiple-choice-02-p01",
  "Northbridge community garden rules",
  [
    "Welcome to the Northbridge Community Garden. Plots are allocated for one growing season at a time, and members must renew their plot by 31 January each year. Plots that are not renewed by that date are offered to the next person on the waiting list.",
    "Gardeners may grow vegetables, herbs and flowers, but trees and hedges are not permitted because their roots can damage the shared water pipes. Compost bins are provided in the corner beside the tool shed, and all green waste should be placed there rather than in household bins.",
    "The garden gate is kept locked, and each member receives a key for a small deposit. Children are welcome but must be supervised at all times. Dogs are not allowed inside the fence, although they may be tied to the rail outside the gate.",
    "If you no longer wish to keep your plot, please inform the committee at least two weeks before the end of the month so that the plot can be reallocated. Members who fail to maintain their plot for two consecutive months may be asked to give it up.",
  ].join("\n\n"),
);

export const multipleChoiceSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-multiple-choice-02", "Multiple choice — Community garden rules", "general", "multiple_choice", 2),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "multiple_choice",
  passages: [p2],
  questions: [
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-02-q01", "When must members renew their plot?", [
      { id: "A", text: "By 31 December" },
      { id: "B", text: "By 31 January" },
      { id: "C", text: "By the end of spring" },
      { id: "D", text: "Every two years" },
    ], ["B"], "Plots must be renewed by 31 January each year.", "reading-targeted-multiple-choice-02-p01", { evidence: "by 31 January", difficulty: 1 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-02-q02", "Why are trees not permitted on plots?", [
      { id: "A", text: "They block sunlight" },
      { id: "B", text: "Their roots can damage water pipes" },
      { id: "C", text: "They attract dogs" },
      { id: "D", text: "They take too long to grow" },
    ], ["B"], "Tree roots can damage the shared water pipes.", "reading-targeted-multiple-choice-02-p01", { evidence: "damage the shared water pipes", difficulty: 1 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-02-q03", "What happens to a plot that is not renewed in time?", [
      { id: "A", text: "It is destroyed" },
      { id: "B", text: "It is offered to the next person on the waiting list" },
      { id: "C", text: "It is kept for the member anyway" },
      { id: "D", text: "It becomes a compost area" },
    ], ["B"], "Unrenewed plots are offered to the next person on the waiting list.", "reading-targeted-multiple-choice-02-p01", { evidence: "offered to the next person on the waiting list", difficulty: 2 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-02-q04", "Where should green waste be placed?", [
      { id: "A", text: "In household bins" },
      { id: "B", text: "In the compost bins beside the tool shed" },
      { id: "C", text: "Outside the gate" },
      { id: "D", text: "In the water pipes" },
    ], ["B"], "Compost bins are provided in the corner beside the tool shed for all green waste.", "reading-targeted-multiple-choice-02-p01", { evidence: "corner beside the tool shed", difficulty: 1 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-02-q05", "What is the rule about dogs?", [
      { id: "A", text: "Dogs are allowed anywhere" },
      { id: "B", text: "Dogs must be tied inside the garden" },
      { id: "C", text: "Dogs are not allowed inside the fence" },
      { id: "D", text: "Dogs may run free if supervised" },
    ], ["C"], "Dogs are not allowed inside the fence but may be tied outside the gate.", "reading-targeted-multiple-choice-02-p01", { evidence: "Dogs are not allowed inside the fence", difficulty: 1 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-02-q06", "What must members do if they want to give up a plot?", [
      { id: "A", text: "Inform the committee two weeks before month-end" },
      { id: "B", text: "Find a replacement gardener themselves" },
      { id: "C", text: "Pay a penalty fee" },
      { id: "D", text: "Remove all plants immediately" },
    ], ["A"], "Members should inform the committee at least two weeks before the end of the month.", "reading-targeted-multiple-choice-02-p01", { evidence: "at least two weeks before the end of the month", difficulty: 2 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-02-q07", "When might a member be asked to give up their plot?", [
      { id: "A", text: "After one missed payment" },
      { id: "B", text: "If they fail to maintain it for two consecutive months" },
      { id: "C", text: "If they grow flowers" },
      { id: "D", text: "If they visit too often" },
    ], ["B"], "Plots not maintained for two consecutive months may be reallocated.", "reading-targeted-multiple-choice-02-p01", { evidence: "two consecutive months", difficulty: 2 }),
    choiceQuestion("multiple_choice", "reading-targeted-multiple-choice-02-q08", "The main purpose of this text is to:", [
      { id: "A", text: "advertise plots for sale" },
      { id: "B", text: "explain the rules for garden members" },
      { id: "C", text: "teach gardening techniques" },
      { id: "D", text: "warn about pests" },
    ], ["B"], "The text is an information sheet explaining membership rules.", "reading-targeted-multiple-choice-02-p01", { difficulty: 2 }),
  ],
};
