// Original targeted Reading drills — Table Completion.

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, textQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-table-completion-01-p01",
  "Three renewable energy sources compared",
  [
    "Energy planners evaluating renewable sources look at several characteristics at once, and the three technologies discussed here illustrate how different the trade-offs can be.",
    "Wind power is now the cheapest form of new electricity generation in many regions. Onshore turbines can be installed within a year and produce power almost continuously when the wind blows, but output varies from hour to hour, which means grids need backup or storage. The best sites are often far from cities, requiring long transmission lines.",
    "Solar photovoltaic panels have fallen in price even faster than wind turbines. They can be installed on rooftops in urban areas, close to the point of use, and need little maintenance. Their obvious weakness is that output falls to zero at night and drops sharply in cloudy weather, so storage is essential in any system that depends on them.",
    "Geothermal power draws heat from deep underground to run turbines twenty-four hours a day, regardless of weather. It occupies little surface land for the energy it produces and can keep running for decades. Its drawback is geographical: suitable hot rock lies close to the surface only in a handful of countries, and drilling test wells is expensive and sometimes unsuccessful.",
  ].join("\n\n"),
);

export const tableCompletionSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-table-completion-01", "Table completion — Renewable energy compared", "academic", "table_completion", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "table_completion",
  passages: [p1],
  questions: [
    textQuestion("table_completion", "reading-targeted-table-completion-01-q01", "Wind: time to install onshore turbines — within one __________.", "year", "Onshore turbines can be installed within a year.", "reading-targeted-table-completion-01-p01", { wordLimit: 1, evidence: "within a year", difficulty: 1 }),
    textQuestion("table_completion", "reading-targeted-table-completion-01-q02", "Wind: main weakness — output varies from hour to __________.", "hour", "Output varies from hour to hour.", "reading-targeted-table-completion-01-p01", { wordLimit: 1, evidence: "from hour to hour", difficulty: 1 }),
    textQuestion("table_completion", "reading-targeted-table-completion-01-q03", "Solar: advantage — can be installed on __________ in urban areas.", "rooftops", "Panels can be installed on rooftops close to the point of use.", "reading-targeted-table-completion-01-p01", { wordLimit: 1, evidence: "rooftops", difficulty: 1 }),
    textQuestion("table_completion", "reading-targeted-table-completion-01-q04", "Solar: output falls to zero at __________.", "night", "Output falls to zero at night.", "reading-targeted-table-completion-01-p01", { wordLimit: 1, evidence: "at night", difficulty: 1 }),
    textQuestion("table_completion", "reading-targeted-table-completion-01-q05", "Geothermal: runs turbines __________ hours a day.", "24", "Geothermal runs turbines twenty-four hours a day.", "reading-targeted-table-completion-01-p01", { wordLimit: 2, allowNumber: true, evidence: "twenty-four hours", acceptableAnswers: ["24", "twenty-four"], difficulty: 1 }),
    textQuestion("table_completion", "reading-targeted-table-completion-01-q06", "Geothermal: uses heat from deep __________.", "underground", "Heat is drawn from deep underground.", "reading-targeted-table-completion-01-p01", { wordLimit: 1, evidence: "deep underground", difficulty: 1 }),
    textQuestion("table_completion", "reading-targeted-table-completion-01-q07", "Geothermal: drawback — suitable rock lies near the surface only in a handful of __________.", "countries", "Suitable hot rock lies near the surface in only a handful of countries.", "reading-targeted-table-completion-01-p01", { wordLimit: 1, evidence: "handful of countries", difficulty: 2 }),
    textQuestion("table_completion", "reading-targeted-table-completion-01-q08", "Geothermal: drilling test __________ is expensive.", "wells", "Drilling test wells is expensive and sometimes unsuccessful.", "reading-targeted-table-completion-01-p01", { wordLimit: 1, evidence: "test wells", difficulty: 2 }),
  ],
};

const p2 = originalPassage(
  "reading-targeted-table-completion-02-p01",
  "Library service hours",
  [
    "The Central Library is open to the public seven days a week. On weekdays the building opens at eight in the morning and closes at nine in the evening, except on Wednesdays when a staff meeting means the opening is delayed until ten. Weekend hours are shorter: Saturdays run from nine until five, and Sundays from ten until four.",
    "The children's section keeps slightly different hours. It opens at nine on weekdays and closes at seven, and on Saturdays it is open from ten until one only. The study rooms on the top floor can be booked for two-hour sessions between nine in the morning and eight in the evening on weekdays, but are not available at weekends.",
    "The library's enquiry desk is staffed from nine to six on weekdays. Outside those hours, and all day at weekends, visitors can use the self-service machines to borrow and return items. Photocopying cards can be bought from the machines for two pounds and are topped up in multiples of one pound.",
    "Please note that the library closes completely on the first Monday of January for stocktaking, and that opening hours may be reduced during the summer vacation. Current information is always posted on the library website.",
  ].join("\n\n"),
);

export const tableCompletionSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-table-completion-02", "Table completion — Library service hours", "general", "table_completion", 2),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "table_completion",
  passages: [p2],
  questions: [
    textQuestion("table_completion", "reading-targeted-table-completion-02-q01", "Weekday opening: eight in the morning until __________ in the evening.", "nine", "On weekdays the building closes at nine in the evening.", "reading-targeted-table-completion-02-p01", { wordLimit: 1, evidence: "nine in the evening", difficulty: 1 }),
    textQuestion("table_completion", "reading-targeted-table-completion-02-q02", "Wednesdays: opening delayed until __________.", "ten", "On Wednesdays opening is delayed until ten.", "reading-targeted-table-completion-02-p01", { wordLimit: 1, evidence: "delayed until ten", difficulty: 1 }),
    textQuestion("table_completion", "reading-targeted-table-completion-02-q03", "Saturdays: nine until __________.", "five", "Saturdays run from nine until five.", "reading-targeted-table-completion-02-p01", { wordLimit: 1, evidence: "nine until five", difficulty: 1 }),
    textQuestion("table_completion", "reading-targeted-table-completion-02-q04", "Sundays: ten until __________.", "four", "Sundays run from ten until four.", "reading-targeted-table-completion-02-p01", { wordLimit: 1, evidence: "ten until four", difficulty: 1 }),
    textQuestion("table_completion", "reading-targeted-table-completion-02-q05", "Children's section: closes at __________ on weekdays.", "seven", "The children's section closes at seven on weekdays.", "reading-targeted-table-completion-02-p01", { wordLimit: 1, evidence: "closes at seven", difficulty: 2 }),
    textQuestion("table_completion", "reading-targeted-table-completion-02-q06", "Study rooms: sessions of __________ hours on weekdays.", "two", "Study rooms can be booked for two-hour sessions.", "reading-targeted-table-completion-02-p01", { wordLimit: 1, evidence: "two-hour sessions", difficulty: 2 }),
    textQuestion("table_completion", "reading-targeted-table-completion-02-q07", "Enquiry desk: staffed from nine to __________ on weekdays.", "six", "The enquiry desk is staffed from nine to six.", "reading-targeted-table-completion-02-p01", { wordLimit: 1, evidence: "nine to six", difficulty: 1 }),
    textQuestion("table_completion", "reading-targeted-table-completion-02-q08", "Library closes completely on the first __________ of January.", "Monday", "The library closes on the first Monday of January for stocktaking.", "reading-targeted-table-completion-02-p01", { wordLimit: 1, evidence: "first Monday", difficulty: 2 }),
  ],
};
