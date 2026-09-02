// Original targeted Listening drills — Flow-chart Completion.
// Every scored unit is a genuine blank node in the process.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, textQ } from "./helpers";

const FLOW1 = [
  "FLOW CHART: How to renew your library membership.",
  "",
  "START",
  "↓",
  "Log in using the membership __________",
  "↓",
  "Check the personal details are still __________",
  "↓",
  "Update the __________ if it has changed",
  "↓",
  "Pay the standard fee of £__________",
  "↓",
  "Reduced fee for students: £__________",
  "↓",
  "Receive confirmation by __________",
  "↓",
  "Card arrives within __________ working days",
  "↓",
  "Activate the card at the __________",
  "↓",
  "FINISH",
].join("\n");

export const listeningFlowChartCompletion01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-flow-chart-completion-01", "Flow-chart completion — Renewing membership", "both", "flow_chart_completion", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "flow_chart_completion",
  passages: [],
  taskStimulus: FLOW1,
  audio: listeningAudio("listening-targeted-flow-chart-completion-01", "Renewing your membership", [
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "If your membership has lapsed, renewing it online only takes a few minutes. I'll talk you through the steps in order." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "First, log in to your account. You'll need your membership number, which is printed on the back of your old card, just above the barcode." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Once you're in, check that your personal details are still correct. If your address has changed, update it straight away, because that's where we post the new card." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Next, pay the renewal fee. The standard fee is fifteen pounds, though students and over-sixties pay ten." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "After you've paid, we'll email you a confirmation — normally within the hour — and then process your card. It normally arrives within five working days, though in busy periods it can take up to ten." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "And that's it — once your card arrives, just bring it to the desk to activate it on your first visit." },
  ]),
  questions: [
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-01-q01", "Step 1: log in using the membership __________", "number", "You need your membership number to log in.", { wordLimit: 1, evidence: "membership number", difficulty: 1, flowNodeId: "node-number" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-01-q02", "Step 2: check the personal details are still __________", "correct", "Check that your personal details are still correct.", { wordLimit: 1, evidence: "still correct", difficulty: 1, flowNodeId: "node-correct" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-01-q03", "Step 3: update the __________ if it has changed", "address", "If your address has changed, update it straight away.", { wordLimit: 1, evidence: "address has changed", difficulty: 1, flowNodeId: "node-address" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-01-q04", "Step 4: pay the standard fee of £__________", "15", "The standard fee is fifteen pounds.", { wordLimit: 1, allowNumber: true, evidence: "fifteen pounds", acceptableAnswers: ["fifteen"], difficulty: 1, flowNodeId: "node-fee" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-01-q05", "Reduced fee for students and over-60s: £__________", "10", "Students and over-sixties pay ten.", { wordLimit: 1, allowNumber: true, evidence: "pay ten", acceptableAnswers: ["ten"], difficulty: 2, flowNodeId: "node-reduced" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-01-q06", "Step 5: receive confirmation by __________", "email", "We'll email you a confirmation normally within the hour.", { wordLimit: 1, evidence: "email you a confirmation", difficulty: 1, flowNodeId: "node-email" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-01-q07", "Step 6: card arrives within __________ working days", "5", "It normally arrives within five working days.", { wordLimit: 1, allowNumber: true, evidence: "five working days", acceptableAnswers: ["five"], difficulty: 1, flowNodeId: "node-days" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-01-q08", "Step 7: activate the card at the __________", "desk", "Bring it to the desk to activate it.", { wordLimit: 1, evidence: "desk", difficulty: 1, flowNodeId: "node-desk" }),
  ],
};

const FLOW2 = [
  "FLOW CHART: How to make a reservation at the college restaurant.",
  "",
  "START",
  "↓",
  "Choose the date and number of __________",
  "↓",
  "Bookings can be for up to __________ people",
  "↓",
  "Choose the dining room or the __________",
  "↓",
  "Pay a deposit of £__________ per person",
  "↓",
  "The deposit comes off the final __________",
  "↓",
  "Receive confirmation by __________",
  "↓",
  "For Fridays, book at least a __________ ahead",
  "↓",
  "Check details and __________ if anything is wrong",
  "↓",
  "FINISH",
].join("\n");

export const listeningFlowChartCompletion02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-flow-chart-completion-02", "Flow-chart completion — Restaurant reservation", "both", "flow_chart_completion", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "flow_chart_completion",
  passages: [],
  taskStimulus: FLOW2,
  audio: listeningAudio("listening-targeted-flow-chart-completion-02", "Restaurant reservation", [
    { speaker: "Manager", voice: "en_US-ryan-high", text: "The college restaurant now takes bookings online, and the process is straightforward. Let me go through it stage by stage." },
    { speaker: "Manager", voice: "en_US-ryan-high", text: "First, choose your date and tell us how many guests are in your party. We can take bookings for up to twelve people." },
    { speaker: "Manager", voice: "en_US-ryan-high", text: "Next, decide where you'd like to sit. We have the main dining room, or the garden terrace in summer — the terrace is lovely but it does close if it rains." },
    { speaker: "Manager", voice: "en_US-ryan-high", text: "Once you've chosen, we ask for a deposit of five pounds per person. That comes off your final bill, so it's not an extra charge." },
    { speaker: "Manager", voice: "en_US-ryan-high", text: "Finally, we'll send you a confirmation by email, normally within the hour. Please check it carefully, and ring us if any detail is wrong." },
    { speaker: "Manager", voice: "en_US-ryan-high", text: "And one tip — if you're booking for a Friday evening, do it at least a week ahead, because that's our busiest time." },
  ]),
  questions: [
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-02-q01", "Step 1: choose the date and number of __________", "guests", "Tell us how many guests are in your party.", { wordLimit: 1, evidence: "guests", difficulty: 1, flowNodeId: "node-guests" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-02-q02", "Bookings can be for up to __________ people", "12", "We can take bookings for up to twelve people.", { wordLimit: 1, allowNumber: true, evidence: "twelve people", acceptableAnswers: ["twelve"], difficulty: 1, flowNodeId: "node-max" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-02-q03", "Step 2: choose the dining room or the __________", "terrace", "The garden terrace is available in summer.", { wordLimit: 1, evidence: "garden terrace", difficulty: 1, flowNodeId: "node-terrace" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-02-q04", "Step 3: pay a deposit of £__________ per person", "5", "The deposit is five pounds per person.", { wordLimit: 1, allowNumber: true, evidence: "five pounds", acceptableAnswers: ["five"], difficulty: 1, flowNodeId: "node-deposit" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-02-q05", "The deposit comes off the final __________", "bill", "It comes off your final bill.", { wordLimit: 1, evidence: "final bill", difficulty: 1, flowNodeId: "node-bill" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-02-q06", "Step 4: receive confirmation by __________", "email", "We'll send a confirmation by email.", { wordLimit: 1, evidence: "by email", difficulty: 1, flowNodeId: "node-email" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-02-q07", "For Fridays, book at least a __________ ahead", "week", "Book at least a week ahead for Friday evenings.", { wordLimit: 1, evidence: "a week ahead", difficulty: 2, flowNodeId: "node-week" }),
    textQ("flow_chart_completion", "listening-targeted-flow-chart-completion-02-q08", "Check details and __________ if anything is wrong", "ring", "Ring us if any detail is wrong.", { wordLimit: 1, evidence: "ring us", difficulty: 2, flowNodeId: "node-ring" }),
  ],
};
