// Original targeted Listening drills — Matching.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, matchingQ } from "./helpers";

export const listeningMatching01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-matching-01", "Matching — Course recommendations", "both", "matching", 3),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "matching",
  passages: [],
  audio: listeningAudio("listening-targeted-matching-01", "Course recommendations", [
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "So let's match each of you with the right evening course. First, Ana — you said you wanted something creative but also practical?" },
    { speaker: "Ana", voice: "en_US-ryan-high", text: "Yes, I'd love to be able to make things. I was thinking pottery, but the beginner class is full." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Then take woodwork. It's very hands-on, and the tutor says beginners pick it up quickly." },
    { speaker: "Ben", voice: "en_GB-northern_english_male-medium", text: "I need something for my job, honestly. I write reports but I'm slow at typing, and my presentations look terrible." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "The computer skills course covers exactly that — documents and slides, one evening a week." },
    { speaker: "Cara", voice: "en_US-ryan-high", text: "For me it's more about health. I sit at a desk all day, and my back is starting to complain." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "We have a yoga class on Tuesdays. It's gentle and specifically aimed at office workers." },
    { speaker: "Dan", voice: "en_GB-northern_english_male-medium", text: "I'd like to cook properly instead of heating things up. Nothing too fancy." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "The basic cookery course, then. You start with soups and simple sauces, and by the end you can manage a full dinner." },
  ]),
  questions: [
    matchingQ("matching", "listening-targeted-matching-01-q01", "Match each person with the course recommended for them.", [
      { id: "A", text: "Woodwork" },
      { id: "B", text: "Computer skills" },
      { id: "C", text: "Yoga" },
      { id: "D", text: "Basic cookery" },
      { id: "E", text: "Pottery" },
    ], [
      { id: "m1-ana", text: "Ana", correctOptionId: "A" },
      { id: "m1-ben", text: "Ben", correctOptionId: "B" },
      { id: "m1-cara", text: "Cara", correctOptionId: "C" },
      { id: "m1-dan", text: "Dan", correctOptionId: "D" },
    ], "Each person receives a recommendation matched to their stated need; pottery was Ana's original wish but the class was full.", 2),
    matchingQ("matching", "listening-targeted-matching-01-q02", "Match each person with the reason they give for choosing a course.", [
      { id: "A", text: "To make things with their hands" },
      { id: "B", text: "To improve work documents" },
      { id: "C", text: "To ease back pain" },
      { id: "D", text: "To cook real meals" },
    ], [
      { id: "m1b-ana", text: "Ana", correctOptionId: "A" },
      { id: "m1b-ben", text: "Ben", correctOptionId: "B" },
      { id: "m1b-cara", text: "Cara", correctOptionId: "C" },
      { id: "m1b-dan", text: "Dan", correctOptionId: "D" },
    ], "Each person states their motivation directly.", 1),
  ],
};

export const listeningMatching02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-matching-02", "Matching — Who said what", "both", "matching", 3),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "matching",
  passages: [],
  audio: listeningAudio("listening-targeted-matching-02", "Office move discussion", [
    { speaker: "Manager", voice: "en_US-lessac-medium", text: "Right, let's settle the details of the office move. The new floor is smaller, so we need to decide what happens to the furniture." },
    { speaker: "Ella", voice: "en_US-ryan-high", text: "I think we should keep the big meeting table. It's the only place the whole team can sit together, and clients use it too." },
    { speaker: "Farid", voice: "en_GB-northern_english_male-medium", text: "The old filing cabinets, though — nobody uses them any more. Everything's digital now, so they can go to recycling." },
    { speaker: "Grace", voice: "en_US-ryan-high", text: "What about the plants? I'll volunteer to water them if we keep them, because they make the office feel much less like a box." },
    { speaker: "Manager", voice: "en_US-lessac-medium", text: "And the notice board?" },
    { speaker: "Farid", voice: "en_GB-northern_english_male-medium", text: "That should stay. It's where we post the health and safety information — we're legally required to display it somewhere." },
    { speaker: "Ella", voice: "en_US-ryan-high", text: "The spare monitors can be sold, surely? There are at least six of them in the cupboard and we never use them." },
    { speaker: "Manager", voice: "en_US-lessac-medium", text: "Fine. Table and board stay, cabinets recycled, monitors sold, and Grace takes charge of the plants." },
  ]),
  questions: [
    matchingQ("matching", "listening-targeted-matching-02-q01", "Match each item with what will happen to it.", [
      { id: "A", text: "Keep it" },
      { id: "B", text: "Recycle it" },
      { id: "C", text: "Sell it" },
      { id: "D", text: "Store it" },
    ], [
      { id: "m2-table", text: "Meeting table", correctOptionId: "A" },
      { id: "m2-cabinets", text: "Filing cabinets", correctOptionId: "B" },
      { id: "m2-monitors", text: "Spare monitors", correctOptionId: "C" },
      { id: "m2-board", text: "Notice board", correctOptionId: "A" },
    ], "The table and board stay, the cabinets go to recycling, and the monitors are sold.", 2),
    matchingQ("matching", "listening-targeted-matching-02-q02", "Match each person with the point they raised.", [
      { id: "A", text: "Ella" },
      { id: "B", text: "Farid" },
      { id: "C", text: "Grace" },
    ], [
      { id: "m2b-i1", text: "said the notice board must stay for legal reasons", correctOptionId: "B" },
      { id: "m2b-i2", text: "offered to water the plants", correctOptionId: "C" },
      { id: "m2b-i3", text: "said the cabinets are no longer used", correctOptionId: "B" },
      { id: "m2b-i4", text: "said the table is used by clients", correctOptionId: "A" },
      { id: "m2b-i5", text: "suggested selling the monitors", correctOptionId: "A" },
    ], "Each statement maps to the speaker who made it.", 3),
  ],
};
