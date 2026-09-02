// Original targeted Reading drills — True / False / Not Given (Academic).

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, textQuestion } from "./helpers";

const passage1 = originalPassage(
  "reading-targeted-tfng-01-p01",
  "The Marston cycling scheme",
  [
    "In 2015 the coastal city of Marston launched a public cycling scheme with five hundred bicycles available at thirty docking stations across the city centre. The scheme was intended to reduce short car journeys, and in its first year the number of bicycle trips recorded in the city rose by eighteen per cent.",
    "By 2019 the network had expanded to one thousand bicycles and sixty stations, including several in the outer suburbs. Surveys conducted by the city council found that the typical user was a commuter aged between twenty-five and forty, and that most trips replaced journeys that would otherwise have been made by car or bus.",
    "The scheme has not been without problems. During the second year a shortage of docking spaces in the busiest districts led to complaints, and a later independent review recommended that stations be redistributed rather than increased in number.",
    "The council has said it remains committed to cycling and is considering a separate scheme for electric bicycles, although no funding decision has yet been announced.",
  ].join("\n\n"),
);

export const tfngSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-tfng-01", "True / False / Not Given — Marston cycling scheme", "academic", "true_false_not_given", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "true_false_not_given",
  passages: [passage1],
  questions: [
    textQuestion("true_false_not_given", "reading-targeted-tfng-01-q01", "The Marston cycling scheme began in 2015.", "TRUE", "The first sentence states that the scheme launched in 2015.", "reading-targeted-tfng-01-p01", { evidence: "In 2015 the coastal city of Marston launched a public cycling scheme", difficulty: 2 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-01-q02", "The scheme started with six hundred bicycles.", "FALSE", "The passage says it launched with five hundred bicycles, so six hundred contradicts the text.", "reading-targeted-tfng-01-p01", { evidence: "five hundred bicycles", difficulty: 2 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-01-q03", "The scheme was funded by the national government.", "NOT GIVEN", "No source of funding is mentioned anywhere in the passage.", "reading-targeted-tfng-01-p01", { difficulty: 2 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-01-q04", "Bicycle trips in the city increased in the first year.", "TRUE", "The passage states that bicycle trips rose by eighteen per cent in the first year.", "reading-targeted-tfng-01-p01", { evidence: "rose by eighteen per cent", difficulty: 3 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-01-q05", "Most users of the scheme were tourists.", "FALSE", "Surveys found the typical user was a commuter aged 25–40, not a tourist.", "reading-targeted-tfng-01-p01", { evidence: "the typical user was a commuter aged between twenty-five and forty", difficulty: 3 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-01-q06", "Some stations in the outer suburbs opened after the launch.", "TRUE", "The network expanded to include several stations in the outer suburbs by 2019.", "reading-targeted-tfng-01-p01", { evidence: "including several in the outer suburbs", difficulty: 3 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-01-q07", "A review recommended adding more stations to solve the shortage.", "FALSE", "The review recommended redistributing stations rather than increasing their number.", "reading-targeted-tfng-01-p01", { evidence: "recommended that stations be redistributed rather than increased", difficulty: 4 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-01-q08", "The council has already approved funding for electric bicycles.", "NOT GIVEN", "The passage says no funding decision has yet been announced.", "reading-targeted-tfng-01-p01", { evidence: "no funding decision has yet been announced", difficulty: 3 }),
  ],
};

const passage2 = originalPassage(
  "reading-targeted-tfng-02-p01",
  "Urban beekeeping",
  [
    "Urban beekeeping has grown rapidly in many European cities over the past decade. Rooftop hives now appear on hotels, office blocks and private homes, and beekeeping societies report that waiting lists for beginners' courses have lengthened considerably.",
    "Supporters argue that city bees often produce more honey than their rural counterparts because urban gardens and parks provide a longer flowering season and a wider variety of plants. Some studies have also suggested that city honey can contain lower levels of certain agricultural pesticides than honey from intensively farmed countryside.",
    "However, researchers have warned that too many hives in one neighbourhood can place pressure on limited nectar sources, weakening colonies and spreading disease. Several cities have responded by introducing voluntary guidelines that ask beekeepers to limit hive numbers.",
    "The question of whether urban bees are healthier than rural bees remains unsettled. A three-year study in one capital city found no significant difference in colony survival, although the authors stressed that their results applied only to a temperate climate.",
  ].join("\n\n"),
);

export const tfngSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-tfng-02", "True / False / Not Given — Urban beekeeping", "academic", "true_false_not_given", 4),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "true_false_not_given",
  passages: [passage2],
  questions: [
    textQuestion("true_false_not_given", "reading-targeted-tfng-02-q01", "Urban beekeeping has become more popular in European cities.", "TRUE", "The first sentence states that urban beekeeping has grown rapidly over the past decade.", "reading-targeted-tfng-02-p01", { evidence: "has grown rapidly", difficulty: 2 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-02-q02", "City bees always produce less honey than rural bees.", "FALSE", "Supporters argue city bees often produce more honey, so 'always less' contradicts the claim.", "reading-targeted-tfng-02-p01", { evidence: "often produce more honey", difficulty: 3 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-02-q03", "Some city honey contains fewer agricultural pesticides than rural honey.", "TRUE", "Studies suggested city honey can contain lower levels of certain agricultural pesticides.", "reading-targeted-tfng-02-p01", { evidence: "lower levels of certain agricultural pesticides", difficulty: 3 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-02-q04", "Urban beekeeping is illegal in most European cities.", "NOT GIVEN", "The passage discusses growth and guidelines but never mentions legality.", "reading-targeted-tfng-02-p01", { difficulty: 2 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-02-q05", "Too many hives can weaken bee colonies.", "TRUE", "Researchers warned that too many hives can weaken colonies and spread disease.", "reading-targeted-tfng-02-p01", { evidence: "weakening colonies", difficulty: 3 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-02-q06", "All European cities have made hive limits compulsory.", "FALSE", "Cities introduced voluntary guidelines, so limits are not compulsory everywhere.", "reading-targeted-tfng-02-p01", { evidence: "voluntary guidelines", difficulty: 4 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-02-q07", "A three-year study proved urban bees are healthier than rural bees.", "FALSE", "The study found no significant difference in colony survival.", "reading-targeted-tfng-02-p01", { evidence: "no significant difference in colony survival", difficulty: 4 }),
    textQuestion("true_false_not_given", "reading-targeted-tfng-02-q08", "The three-year study took place in a tropical country.", "NOT GIVEN", "The authors said results applied to a temperate climate, but the country is not identified.", "reading-targeted-tfng-02-p01", { difficulty: 3 }),
  ],
};
