// Original targeted Listening drills — Multiple Choice.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, choiceQ } from "./helpers";

export const listeningMultipleChoice01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-multiple-choice-01", "Multiple choice — Booking a school trip", "both", "multiple_choice", 3),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "multiple_choice",
  passages: [],
  audio: listeningAudio("listening-targeted-multiple-choice-01", "Booking a school trip", [
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Oakfield Activity Centre, good morning." },
    { speaker: "Teacher", voice: "en_US-ryan-high", text: "Oh, hello. I'd like to ask about a visit for a school group, please. We're thinking of coming in early June, on the twelfth, if that's possible." },
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Let me check. The twelfth is fine, yes, although the climbing wall is closed that week for repainting." },
    { speaker: "Teacher", voice: "en_US-ryan-high", text: "That's a pity. The children were really looking forward to the climbing wall. Could we switch to the canoeing session instead?" },
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Of course. Canoeing is the same price, and it's actually more popular. Just bear in mind children need a signed permission form for any water activity." },
    { speaker: "Teacher", voice: "en_US-ryan-high", text: "Right, I'll send those out with the letters. How many children can one instructor take?" },
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Twelve. So if you bring twenty-four, we'd assign two instructors, and the whole group can go together." },
    { speaker: "Teacher", voice: "en_US-ryan-high", text: "And lunch? I remember last time we had to eat outside because the dining hall was fully booked." },
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "The dining hall is available this time — I can reserve it for one o'clock. There's also a picnic area if you'd rather be outdoors, but the hall is booked for you from one until two." },
    { speaker: "Teacher", voice: "en_US-ryan-high", text: "The hall, please. And do you still charge an entry fee for adults?" },
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Adults are free, yes. The children's fee is six pounds fifty each, and that includes all equipment." },
    { speaker: "Teacher", voice: "en_US-ryan-high", text: "Perfect. I'll confirm by email this afternoon." },
  ]),
  questions: [
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-01-q01", "Why is the climbing wall unavailable on the visit date?", [
      { id: "A", text: "It is fully booked" },
      { id: "B", text: "It is being repainted" },
      { id: "C", text: "It is too expensive" },
    ], ["B"], "The receptionist says the wall is closed that week for repainting.", { evidence: "closed that week for repainting", difficulty: 1 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-01-q02", "What do children need for water activities?", [
      { id: "A", text: "A swimming certificate" },
      { id: "B", text: "A signed permission form" },
      { id: "C", text: "Their own equipment" },
    ], ["B"], "Children need a signed permission form for any water activity.", { evidence: "signed permission form", difficulty: 2 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-01-q03", "How many children can one instructor take?", [
      { id: "A", text: "Ten" },
      { id: "B", text: "Twelve" },
      { id: "C", text: "Twenty-four" },
    ], ["B"], "One instructor takes twelve children.", { evidence: "Twelve", difficulty: 1 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-01-q04", "Where will the group eat lunch?", [
      { id: "A", text: "In the dining hall" },
      { id: "B", text: "In the picnic area" },
      { id: "C", text: "Outside on the grass" },
    ], ["A"], "The teacher chooses the dining hall, reserved from one until two.", { evidence: "The hall, please", difficulty: 2 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-01-q05", "What is the children's entry fee?", [
      { id: "A", text: "£6.50" },
      { id: "B", text: "£7.50" },
      { id: "C", text: "£5.60" },
    ], ["A"], "The children's fee is six pounds fifty each.", { evidence: "six pounds fifty", difficulty: 2 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-01-q06", "What is included in the children's fee?", [
      { id: "A", text: "Lunch" },
      { id: "B", text: "All equipment" },
      { id: "C", text: "Transport" },
    ], ["B"], "The fee includes all equipment.", { evidence: "includes all equipment", difficulty: 2 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-01-q07", "What does the teacher plan to do next?", [
      { id: "A", text: "Visit the centre in person" },
      { id: "B", text: "Confirm by email" },
      { id: "C", text: "Send the payment" },
    ], ["B"], "The teacher will confirm by email this afternoon.", { evidence: "confirm by email", difficulty: 1 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-01-q08", "What did the group do for lunch on a previous visit?", [
      { id: "A", text: "Ate in the dining hall" },
      { id: "B", text: "Ate outside" },
      { id: "C", text: "Brought no lunch" },
    ], ["B"], "Last time they had to eat outside because the hall was fully booked.", { evidence: "had to eat outside", difficulty: 3 }),
  ],
};

export const listeningMultipleChoice02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-multiple-choice-02", "Multiple choice — Choosing a laptop", "both", "multiple_choice", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "multiple_choice",
  passages: [],
  audio: listeningAudio("listening-targeted-multiple-choice-02", "Choosing a laptop", [
    { speaker: "Assistant", voice: "en_US-lessac-medium", text: "Hi there, are you looking for anything in particular today?" },
    { speaker: "Customer", voice: "en_US-ryan-high", text: "Yes — a laptop for university. I need something light enough to carry every day, and the battery has to last through a full day of lectures." },
    { speaker: "Assistant", voice: "en_US-lessac-medium", text: "Then I'd avoid the Stream 15. It's powerful, but it weighs over two kilos and the battery manages about five hours. It's really aimed at gamers." },
    { speaker: "Customer", voice: "en_US-ryan-high", text: "Okay, not that one. What about this silver one here?" },
    { speaker: "Assistant", voice: "en_US-lessac-medium", text: "The Feather 13? That's our lightest model — just over a kilo — and the battery lasts eleven hours. The only downside is the storage: a hundred and twenty-eight gigabytes, which is a bit tight if you keep a lot of videos." },
    { speaker: "Customer", voice: "en_US-ryan-high", text: "I mostly write essays and stream films, so that's probably fine. Does it have a good screen for long study sessions?" },
    { speaker: "Assistant", voice: "en_US-lessac-medium", text: "It does, but to be honest, if screen comfort matters most I'd look at the Vision 14. It's a little heavier, at one and a half kilos, and the battery is ten hours, but the display is much easier on the eyes." },
    { speaker: "Customer", voice: "en_US-ryan-high", text: "Hmm. The Feather is cheaper, isn't it?" },
    { speaker: "Assistant", voice: "en_US-lessac-medium", text: "Actually no — the Feather is our premium model. The Vision is on special offer this month, so it's a hundred pounds less." },
    { speaker: "Customer", voice: "en_US-ryan-high", text: "Interesting. And can I add extra memory to the Vision later?" },
    { speaker: "Assistant", voice: "en_US-lessac-medium", text: "You can, yes — the memory is user-upgradable, unlike the Feather where it's fixed. I'd say the Vision is the better fit for a student." },
    { speaker: "Customer", voice: "en_US-ryan-high", text: "I think you're right. I'll take the Vision 14." },
  ]),
  questions: [
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-02-q01", "What does the customer need the laptop for?", [
      { id: "A", text: "Gaming" },
      { id: "B", text: "University study" },
      { id: "C", text: "Work presentations" },
    ], ["B"], "The customer needs a laptop for university.", { evidence: "a laptop for university", difficulty: 1 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-02-q02", "Why does the assistant rule out the Stream 15?", [
      { id: "A", text: "It is too expensive" },
      { id: "B", text: "It is heavy with a short battery life" },
      { id: "C", text: "It has no screen" },
    ], ["B"], "The Stream weighs over two kilos and the battery lasts about five hours.", { evidence: "weighs over two kilos", difficulty: 2 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-02-q03", "How long does the Feather 13's battery last?", [
      { id: "A", text: "Five hours" },
      { id: "B", text: "Ten hours" },
      { id: "C", text: "Eleven hours" },
    ], ["C"], "The Feather's battery lasts eleven hours.", { evidence: "eleven hours", difficulty: 1 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-02-q04", "What is the Feather's main weakness?", [
      { id: "A", text: "Limited storage" },
      { id: "B", text: "Poor screen" },
      { id: "C", text: "Slow processor" },
    ], ["A"], "Its storage is only a hundred and twenty-eight gigabytes.", { evidence: "a bit tight", difficulty: 2 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-02-q05", "Which model has the most comfortable screen?", [
      { id: "A", text: "Stream 15" },
      { id: "B", text: "Feather 13" },
      { id: "C", text: "Vision 14" },
    ], ["C"], "The Vision's display is much easier on the eyes.", { evidence: "easier on the eyes", difficulty: 2 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-02-q06", "Which model is currently cheaper?", [
      { id: "A", text: "Feather 13" },
      { id: "B", text: "Vision 14" },
      { id: "C", text: "They cost the same" },
    ], ["B"], "The Vision is on special offer and costs a hundred pounds less.", { evidence: "a hundred pounds less", difficulty: 3 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-02-q07", "What can be upgraded on the Vision later?", [
      { id: "A", text: "The battery" },
      { id: "B", text: "The memory" },
      { id: "C", text: "The screen" },
    ], ["B"], "The memory is user-upgradable on the Vision.", { evidence: "user-upgradable", difficulty: 2 }),
    choiceQ("multiple_choice", "single_choice", "listening-targeted-multiple-choice-02-q08", "Which laptop does the customer finally choose?", [
      { id: "A", text: "Stream 15" },
      { id: "B", text: "Feather 13" },
      { id: "C", text: "Vision 14" },
    ], ["C"], "The customer says: I'll take the Vision 14.", { evidence: "take the Vision 14", difficulty: 1 }),
  ],
};
