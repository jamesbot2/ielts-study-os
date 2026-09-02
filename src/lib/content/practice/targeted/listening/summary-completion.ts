// Original targeted Listening drills — Summary Completion.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, textQ } from "./helpers";

export const listeningSummaryCompletion01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-summary-completion-01", "Summary completion — Community garden project", "both", "summary_completion", 3),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "summary_completion",
  passages: [],
  audio: listeningAudio("listening-targeted-summary-completion-01", "Community garden project", [
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "The Greenfield community garden began three years ago, when a group of residents transformed a disused car park into a shared growing space. The project was initially funded by a small council grant, and it now has more than forty regular members." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "The garden is organised around raised beds, which make planting easier for older members and for people with limited mobility. Most plots grow vegetables, though a few are kept for flowers to attract pollinating insects." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "Water comes from two large tanks that collect rainwater from the roof of the nearby community centre. This has reduced the garden's mains water use by around two-thirds, which keeps the running costs low." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "The organisers say the biggest surprise has been the social impact. A survey of members found that most joined to grow food, but the friendships formed there are now the main reason people stay." },
  ]),
  questions: [
    textQ("summary_completion", "listening-targeted-summary-completion-01-q01", "The garden was created from an unused __________ three years ago.", "car park", "Residents transformed a disused car park.", { wordLimit: 2, evidence: "disused car park", difficulty: 1 }),
    textQ("summary_completion", "listening-targeted-summary-completion-01-q02", "Early money came from a council __________.", "grant", "The project was initially funded by a small council grant.", { wordLimit: 1, evidence: "council grant", difficulty: 1 }),
    textQ("summary_completion", "listening-targeted-summary-completion-01-q03", "The project now has over __________ regular members.", "40", "It now has more than forty regular members.", { wordLimit: 1, allowNumber: true, evidence: "forty", acceptableAnswers: ["forty"], difficulty: 1 }),
    textQ("summary_completion", "listening-targeted-summary-completion-01-q04", "Planting happens in raised __________, which are easier for older members to use.", "beds", "The garden is organised around raised beds.", { wordLimit: 1, evidence: "raised beds", difficulty: 1 }),
    textQ("summary_completion", "listening-targeted-summary-completion-01-q05", "A few plots grow __________ to attract pollinating insects.", "flowers", "A few beds are kept for flowers.", { wordLimit: 1, evidence: "flowers", difficulty: 1 }),
    textQ("summary_completion", "listening-targeted-summary-completion-01-q06", "Water is collected from the community centre's __________.", "roof", "Tanks collect rainwater from the roof.", { wordLimit: 1, evidence: "roof", difficulty: 2 }),
    textQ("summary_completion", "listening-targeted-summary-completion-01-q07", "Mains water use has fallen by about two-__________.", "thirds", "Reduced by around two-thirds.", { wordLimit: 1, evidence: "two-thirds", difficulty: 2 }),
    textQ("summary_completion", "listening-targeted-summary-completion-01-q08", "Most members stay mainly because of the __________ they have formed.", "friendships", "The friendships formed are the main reason people stay.", { wordLimit: 1, evidence: "friendships", difficulty: 2 }),
  ],
};

export const listeningSummaryCompletion02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-summary-completion-02", "Summary completion — History of the postcard", "both", "summary_completion", 3),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "summary_completion",
  passages: [],
  audio: listeningAudio("listening-targeted-summary-completion-02", "History of the postcard", [
    { speaker: "Guide", voice: "en_US-ryan-high", text: "The picture postcard seems completely ordinary today, but it caused a small revolution when it first appeared. The first illustrated postcards were printed in Austria in 1869, and within a few years millions were being sent across Europe every year." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "At first, postcards were plain on one side and decorated on the other, because postal rules allowed only the address to be written beside the stamp. It was not until 1902, in Britain, that the divided back was introduced, letting senders write a message and the address on the same side." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "The change made postcards enormously popular. By the eve of the First World War, the British public alone was sending around nine hundred million postcards a year, and collecting them became a fashionable hobby." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "Sales then fell for decades, overtaken first by the telephone and later by the camera. Yet postcards never disappeared, and today they are bought mainly by tourists as souvenirs rather than for sending messages." },
  ]),
  questions: [
    textQ("summary_completion", "listening-targeted-summary-completion-02-q01", "The first illustrated postcards were printed in __________ in 1869.", "Austria", "The first illustrated postcards were printed in Austria.", { wordLimit: 1, evidence: "Austria", difficulty: 1 }),
    textQ("summary_completion", "listening-targeted-summary-completion-02-q02", "Early postcards allowed only the __________ to be written on the back.", "address", "Only the address could be written beside the stamp.", { wordLimit: 1, evidence: "address", difficulty: 2 }),
    textQ("summary_completion", "listening-targeted-summary-completion-02-q03", "The divided back was introduced in Britain in __________.", "1902", "It was introduced in 1902.", { wordLimit: 1, allowNumber: true, evidence: "1902", difficulty: 1 }),
    textQ("summary_completion", "listening-targeted-summary-completion-02-q04", "The change let senders write the message and address on the same __________.", "side", "Message and address on the same side.", { wordLimit: 1, evidence: "same side", difficulty: 1 }),
    textQ("summary_completion", "listening-targeted-summary-completion-02-q05", "Before the First World War, Britain sent about __________ million postcards a year.", "900", "Around nine hundred million postcards a year.", { wordLimit: 1, allowNumber: true, evidence: "nine hundred million", acceptableAnswers: ["900"], difficulty: 2 }),
    textQ("summary_completion", "listening-targeted-summary-completion-02-q06", "Collecting postcards became a fashionable __________.", "hobby", "Collecting them became a fashionable hobby.", { wordLimit: 1, evidence: "hobby", difficulty: 1 }),
    textQ("summary_completion", "listening-targeted-summary-completion-02-q07", "Sales were later overtaken by the telephone and then the __________.", "camera", "Overtaken first by the telephone and later by the camera.", { wordLimit: 1, evidence: "camera", difficulty: 2 }),
    textQ("summary_completion", "listening-targeted-summary-completion-02-q08", "Today postcards are bought mainly by tourists as __________.", "souvenirs", "Bought mainly by tourists as souvenirs.", { wordLimit: 1, evidence: "souvenirs", difficulty: 1 }),
  ],
};
