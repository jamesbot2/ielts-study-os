// Original targeted Reading drills — Yes / No / Not Given (writer's claims).

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, textQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-ynng-01-p01",
  "In defence of the paper book",
  [
    "Many commentators assume that printed books are an outdated technology, destined to be replaced by screens. I believe this view is mistaken, because it confuses the durability of a format with its usefulness. The printed book survives not from habit or nostalgia, but because it remains, for many readers, the least distracting way to absorb a long argument.",
    "It is sometimes claimed that e-readers allow people to read more. In my experience the opposite is often true: a device that offers messages, games and the entire internet is a machine designed to interrupt, while a paper book asks for nothing except attention. Reading on paper therefore tends to be deeper rather than merely faster.",
    "There is also the question of ownership. When you buy an electronic book you typically acquire a licence to read it, not the book itself, and that licence can be withdrawn. A shelf of paper books, by contrast, is property in the fullest sense and can be lent, resold or simply kept for fifty years.",
    "None of this means that digital publishing should be resisted. Its contribution to education in remote areas is beyond question. But the survival of print alongside the screen is something to celebrate, not to mourn.",
  ].join("\n\n"),
);

export const ynngSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-ynng-01", "Yes / No / Not Given — In defence of the paper book", "academic", "yes_no_not_given", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "yes_no_not_given",
  passages: [p1],
  questions: [
    textQuestion("yes_no_not_given", "reading-targeted-ynng-01-q01", "The writer believes printed books survive because people are nostalgic.", "NO", "The writer explicitly rejects nostalgia as the reason: the book survives 'not from habit or nostalgia'.", "reading-targeted-ynng-01-p01", { evidence: "survives not from habit or nostalgia", difficulty: 2 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-01-q02", "The writer thinks printed books are less distracting than e-readers.", "YES", "The writer calls the paper book 'the least distracting way to absorb a long argument'.", "reading-targeted-ynng-01-p01", { evidence: "the least distracting way", difficulty: 2 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-01-q03", "The writer believes e-readers always make people read less.", "NO", "The writer says the opposite is 'often true' in their experience — a qualified claim, not an absolute one.", "reading-targeted-ynng-01-p01", { evidence: "often true", difficulty: 4 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-01-q04", "The writer has used an e-reader for more than ten years.", "NOT GIVEN", "The writer's personal device history is never mentioned.", "reading-targeted-ynng-01-p01", { difficulty: 2 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-01-q05", "The writer believes buyers of electronic books genuinely own them.", "NO", "The writer argues you acquire only a licence, 'not the book itself'.", "reading-targeted-ynng-01-p01", { evidence: "a licence to read it, not the book itself", difficulty: 3 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-01-q06", "The writer thinks digital publishing should be resisted.", "NO", "The writer says none of this means digital publishing should be resisted.", "reading-targeted-ynng-01-p01", { evidence: "None of this means that digital publishing should be resisted", difficulty: 3 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-01-q07", "The writer believes digital books have helped education in remote areas.", "YES", "The writer states this contribution is 'beyond question'.", "reading-targeted-ynng-01-p01", { evidence: "beyond question", difficulty: 2 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-01-q08", "The writer believes print books will eventually disappear entirely.", "NO", "The writer celebrates the survival of print and believes it will coexist with screens.", "reading-targeted-ynng-01-p01", { evidence: "survival of print alongside the screen is something to celebrate", difficulty: 3 }),
  ],
};

const p2 = originalPassage(
  "reading-targeted-ynng-02-p01",
  "The case for later school starts",
  [
    "School districts around the world have been debating whether secondary schools should begin the day later. Having studied teenage sleep patterns for fifteen years, I am convinced that early starts are one of the most damaging features of modern schooling, and that the evidence against them is now overwhelming.",
    "Adolescents undergo a biological shift that delays the release of melatonin, the hormone that signals sleep. As a result, telling a fifteen-year-old to sleep at nine o'clock is about as realistic as asking an adult to sleep at six. In my view, schools that start before nine in the morning are systematically depriving their students of the sleep their bodies require.",
    "Opponents argue that later starts would disrupt bus schedules and after-school sport. These are real concerns, but I would point out that they are administrative problems with administrative solutions, whereas chronic sleep loss is a health problem that follows a child for years.",
    "Some studies claim that later starts improve grades only modestly. Even if that is true, the strongest argument for change is not academic performance but health: we know that sleep-deprived teenagers face higher risks of anxiety and injury.",
  ].join("\n\n"),
);

export const ynngSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-ynng-02", "Yes / No / Not Given — The case for later school starts", "academic", "yes_no_not_given", 4),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "yes_no_not_given",
  passages: [p2],
  questions: [
    textQuestion("yes_no_not_given", "reading-targeted-ynng-02-q01", "The writer has studied teenage sleep for fifteen years.", "YES", "The writer states they have studied teenage sleep patterns for fifteen years.", "reading-targeted-ynng-02-p01", { evidence: "fifteen years", difficulty: 1 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-02-q02", "The writer believes early school starts damage students.", "YES", "The writer calls early starts 'one of the most damaging features of modern schooling'.", "reading-targeted-ynng-02-p01", { evidence: "most damaging features", difficulty: 2 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-02-q03", "The writer believes melatonin is a hormone that promotes wakefulness.", "NO", "The writer describes melatonin as 'the hormone that signals sleep'.", "reading-targeted-ynng-02-p01", { evidence: "signals sleep", difficulty: 3 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-02-q04", "The writer works as a school principal.", "NOT GIVEN", "The writer's occupation is never stated.", "reading-targeted-ynng-02-p01", { difficulty: 2 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-02-q05", "The writer considers bus-schedule objections to be unsolvable.", "NO", "The writer calls them administrative problems with administrative solutions.", "reading-targeted-ynng-02-p01", { evidence: "administrative problems with administrative solutions", difficulty: 3 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-02-q06", "The writer believes grade improvement is the strongest argument for later starts.", "NO", "The writer says the strongest argument is health, not academic performance.", "reading-targeted-ynng-02-p01", { evidence: "the strongest argument for change is not academic performance but health", difficulty: 3 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-02-q07", "The writer claims sleep-deprived teenagers face higher risks of anxiety.", "YES", "The writer states this as a known fact about health risks.", "reading-targeted-ynng-02-p01", { evidence: "higher risks of anxiety and injury", difficulty: 2 }),
    textQuestion("yes_no_not_given", "reading-targeted-ynng-02-q08", "The writer believes schools should start at exactly ten o'clock.", "NOT GIVEN", "The writer argues for later starts but never specifies an exact time.", "reading-targeted-ynng-02-p01", { difficulty: 2 }),
  ],
};
