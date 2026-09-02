// Original targeted Reading drills — Flow-chart Completion.

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, textQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-flow-chart-completion-01-p01",
  "From cocoa pod to chocolate bar",
  [
    "The transformation of cocoa pods into chocolate involves a long chain of steps, each of which affects the final flavour. The process begins on the plantation, where ripe pods are cut from the tree by hand using a curved knife, then split open to remove the beans and their surrounding pulp.",
    "The beans and pulp are piled into shallow wooden boxes and covered with banana leaves for fermentation, which lasts between five and seven days. During this time the pulp drains away and chemical changes inside the beans develop the precursors of chocolate flavour. Beans that skip this stage taste bitter and flat.",
    "After fermentation the beans are spread on raised tables to dry in the sun, a stage that takes about a week. Once the moisture content has fallen to around seven per cent, the beans are packed into sacks and shipped to factories, where they are roasted at carefully controlled temperatures.",
    "Roasting deepens the flavour and loosens the shells. The beans are then cracked and winnowed, a process that blows away the shells and leaves clean pieces called nibs. The nibs are ground under heat until the cocoa butter inside them melts, producing a thick liquid known as cocoa mass.",
    "In the final stages, the mass is blended with sugar and milk solids, then passed through rollers to refine the particle size and through a conche, where it is stirred and aerated for several hours to remove acidity. The finished chocolate is tempered, poured into moulds and cooled before wrapping.",
  ].join("\n\n"),
);

export const flowChartCompletionSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-flow-chart-completion-01", "Flow-chart completion — Cocoa to chocolate", "academic", "flow_chart_completion", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "flow_chart_completion",
  passages: [p1],
  questions: [
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-01-q01", "Stage 1: ripe pods are cut from the tree by __________.", "hand", "Pods are cut from the tree by hand using a curved knife.", "reading-targeted-flow-chart-completion-01-p01", { wordLimit: 1, evidence: "by hand", difficulty: 1 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-01-q02", "Stage 2: beans and pulp are covered with banana __________.", "leaves", "The beans are covered with banana leaves for fermentation.", "reading-targeted-flow-chart-completion-01-p01", { wordLimit: 1, evidence: "banana leaves", difficulty: 1 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-01-q03", "Stage 3: fermentation lasts between five and seven __________.", "days", "Fermentation lasts between five and seven days.", "reading-targeted-flow-chart-completion-01-p01", { wordLimit: 1, evidence: "five and seven days", difficulty: 1 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-01-q04", "Stage 4: beans are dried in the __________.", "sun", "Beans are spread on raised tables to dry in the sun.", "reading-targeted-flow-chart-completion-01-p01", { wordLimit: 1, evidence: "dry in the sun", difficulty: 1 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-01-q05", "Stage 5: winnowing blows away the __________.", "shells", "Winnowing blows away the shells and leaves clean nibs.", "reading-targeted-flow-chart-completion-01-p01", { wordLimit: 1, evidence: "blows away the shells", difficulty: 2 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-01-q06", "Stage 6: ground nibs become a liquid called cocoa __________.", "mass", "The nibs are ground to produce cocoa mass.", "reading-targeted-flow-chart-completion-01-p01", { wordLimit: 1, evidence: "cocoa mass", difficulty: 2 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-01-q07", "Stage 7: the mass is blended with sugar and milk __________.", "solids", "The mass is blended with sugar and milk solids.", "reading-targeted-flow-chart-completion-01-p01", { wordLimit: 1, evidence: "milk solids", difficulty: 2 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-01-q08", "Stage 8: chocolate is stirred and aerated in a __________.", "conche", "The chocolate is stirred and aerated in a conche.", "reading-targeted-flow-chart-completion-01-p01", { wordLimit: 1, evidence: "a conche", difficulty: 2 }),
  ],
};

const p2 = originalPassage(
  "reading-targeted-flow-chart-completion-02-p01",
  "How to report a repair in your rented flat",
  [
    "If something breaks in your rented flat, follow the steps below to get it repaired as quickly as possible.",
    "First, check whether the fault is an emergency. Burst pipes, electrical sparks and broken locks are emergencies and should be reported by telephone immediately, day or night. All other faults should be reported using the online form on the landlord's website.",
    "Second, complete the form with your address, the date the fault appeared, and a short description. You should also say when you will be at home for the repair visit. The system will give you a reference number, which you should note down, as it appears on all later correspondence.",
    "Third, the landlord's maintenance team will contact you within two working days to arrange a visit. If the repair cannot be fixed on the first visit, the team will order parts and book a second appointment before leaving.",
    "Finally, when the repair is finished, sign the completion note that the technician provides. If the same fault returns within thirty days, the repair is covered by the original job and you will not be charged again.",
  ].join("\n\n"),
);

export const flowChartCompletionSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-flow-chart-completion-02", "Flow-chart completion — Reporting a repair", "general", "flow_chart_completion", 2),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "flow_chart_completion",
  passages: [p2],
  questions: [
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-02-q01", "Step 1: emergencies such as burst pipes are reported by __________.", "telephone", "Emergencies should be reported by telephone immediately.", "reading-targeted-flow-chart-completion-02-p01", { wordLimit: 1, evidence: "by telephone", difficulty: 1 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-02-q02", "Step 2: other faults are reported using the online __________.", "form", "All other faults should be reported using the online form.", "reading-targeted-flow-chart-completion-02-p01", { wordLimit: 1, evidence: "online form", difficulty: 1 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-02-q03", "Step 3: the system gives you a __________ number.", "reference", "The system will give you a reference number.", "reading-targeted-flow-chart-completion-02-p01", { wordLimit: 1, evidence: "reference number", difficulty: 1 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-02-q04", "Step 4: the maintenance team contacts you within __________ working days.", "two", "The team will contact you within two working days.", "reading-targeted-flow-chart-completion-02-p01", { wordLimit: 1, evidence: "two working days", difficulty: 1 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-02-q05", "Step 5: if parts are needed, the team books a second __________.", "appointment", "The team will order parts and book a second appointment.", "reading-targeted-flow-chart-completion-02-p01", { wordLimit: 1, evidence: "second appointment", difficulty: 2 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-02-q06", "Step 6: sign the __________ note when the repair is finished.", "completion", "Sign the completion note that the technician provides.", "reading-targeted-flow-chart-completion-02-p01", { wordLimit: 1, evidence: "completion note", difficulty: 1 }),
    textQuestion("flow_chart_completion", "reading-targeted-flow-chart-completion-02-q07", "Step 7: a returning fault is covered within __________ days.", "thirty", "If the same fault returns within thirty days it is covered.", "reading-targeted-flow-chart-completion-02-p01", { wordLimit: 1, evidence: "thirty days", difficulty: 2 }),
  ],
};
