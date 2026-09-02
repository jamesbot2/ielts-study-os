// Original targeted Listening drills — Multiple-answer questions (Choose TWO/THREE).

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, choiceQ } from "./helpers";

export const listeningMultipleAnswer01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-multiple-answer-01", "Multiple answer — Library feedback", "both", "multiple_answer", 3),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "multiple_answer",
  passages: [],
  audio: listeningAudio("listening-targeted-multiple-answer-01", "Library feedback meeting", [
    { speaker: "Librarian", voice: "en_US-lessac-medium", text: "Thanks for coming, everyone. The library is reviewing its services, and I'd like to hear what you actually use." },
    { speaker: "Student A", voice: "en_US-ryan-high", text: "I mainly come for the group study rooms. They're almost always full, though — we've started booking days in advance." },
    { speaker: "Student B", voice: "en_GB-northern_english_male-medium", text: "For me it's the online journals. I work part-time, so I do most of my reading at home late at night." },
    { speaker: "Librarian", voice: "en_US-lessac-medium", text: "So the study rooms and the digital collections. Anyone else?" },
    { speaker: "Student C", voice: "en_US-ryan-high", text: "The printing service, definitely. It's cheap and the machines almost never break, which is more than I can say for the ones in town." },
    { speaker: "Student B", voice: "en_GB-northern_english_male-medium", text: "Oh, and the borrowing scheme for laptops — I used that last term when mine needed repairing." },
    { speaker: "Librarian", voice: "en_US-lessac-medium", text: "Right. And which areas could we improve? Let's each name two things." },
    { speaker: "Student A", voice: "en_US-ryan-high", text: "Opening hours, first. Closing at eight means night-before-exam students have nowhere to go. And the caf\u00e9 — it's fine, but the coffee machine is broken half the time." },
    { speaker: "Student C", voice: "en_US-ryan-high", text: "I'd say the noise in the silent area. People treat it like a common room. That, and there are never enough power sockets." },
    { speaker: "Librarian", voice: "en_US-lessac-medium", text: "Thank you — opening hours, caf\u00e9, noise and sockets. We'll take these to the next planning meeting." },
  ]),
  questions: [
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-01-q01", "Choose TWO services that Student B mentions using.", [
      { id: "A", text: "Online journals" },
      { id: "B", text: "Group study rooms" },
      { id: "C", text: "Borrowing a laptop" },
      { id: "D", text: "The printing service" },
      { id: "E", text: "The silent area" },
    ], ["A", "C"], "Student B mentions the online journals and borrowing a laptop; rooms and printing are other students' services, and the silent area is only a complaint.", { selectCount: 2, difficulty: 3 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-01-q02", "Choose TWO improvements the students request.", [
      { id: "A", text: "Longer opening hours" },
      { id: "B", text: "More comfortable chairs" },
      { id: "C", text: "More power sockets" },
      { id: "D", text: "Free parking" },
      { id: "E", text: "A bigger caf\u00e9" },
    ], ["A", "C"], "Student A asks for longer opening hours and Student C for more power sockets; chairs and parking are not mentioned.", { selectCount: 2, difficulty: 2 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-01-q03", "Choose TWO problems mentioned about the library.", [
      { id: "A", text: "The coffee machine is often broken" },
      { id: "B", text: "The study rooms are usually full" },
      { id: "C", text: "The staff are unfriendly" },
      { id: "D", text: "The building is too cold" },
    ], ["A", "B"], "Student A says the rooms are almost always full and the caf\u00e9 coffee machine is broken half the time.", { selectCount: 2, difficulty: 3 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-01-q04", "Choose TWO actions the librarian says the library is taking or will take.", [
      { id: "A", text: "Take the issues to a planning meeting" },
      { id: "B", text: "Extend the opening hours immediately" },
      { id: "C", text: "Buy new furniture" },
      { id: "D", text: "Review the services" },
    ], ["A", "D"], "The librarian is reviewing services and will take the issues to the next planning meeting.", { selectCount: 2, difficulty: 2 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-01-q05", "Choose TWO students who mention using a service.", [
      { id: "A", text: "Student A" },
      { id: "B", text: "Student B" },
      { id: "C", text: "A tutor" },
      { id: "D", text: "A cleaner" },
    ], ["A", "B"], "Student A and Student B both describe services they use; no tutor or cleaner speaks.", { selectCount: 2, difficulty: 1 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-01-q06", "Choose TWO statements about the printing service.", [
      { id: "A", text: "It is cheap" },
      { id: "B", text: "The machines rarely break" },
      { id: "C", text: "It is free" },
      { id: "D", text: "It closes at noon" },
    ], ["A", "B"], "Student C says the printing service is cheap and the machines almost never break.", { selectCount: 2, difficulty: 2 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-01-q07", "Choose TWO statements about the online journals.", [
      { id: "A", text: "They are used by a part-time worker" },
      { id: "B", text: "They are read late at night" },
      { id: "C", text: "They are unavailable at home" },
      { id: "D", text: "They cost extra" },
    ], ["A", "B"], "Student B works part-time and reads the journals at home late at night.", { selectCount: 2, difficulty: 3 }),
  ],
};

export const listeningMultipleAnswer02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-multiple-answer-02", "Multiple answer — Moving house", "both", "multiple_answer", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "multiple_answer",
  passages: [],
  audio: listeningAudio("listening-targeted-multiple-answer-02", "Moving house advice", [
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Welcome to the housing advice line. How can I help today?" },
    { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "We're moving to the city next month and we've never rented through an agency before. What should we prepare?" },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "The two documents you'll definitely need are proof of income, usually three recent payslips, and photo identification. A reference from a previous landlord helps a lot as well." },
    { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "And how much should we expect to pay before we move in?" },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Normally one month's rent in advance plus a deposit equal to one month's rent. Some agencies also charge an administration fee, but that's becoming less common." },
    { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "What about viewing a property? We've both got jobs, so evenings are easiest for us." },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Most agencies offer evening viewings, yes. I'd book two or three on the same evening and take notes, because it's easy to confuse properties afterwards. Check the water pressure and whether the windows open properly." },
    { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "Useful. And the contract — anything we should look out for?" },
    { speaker: "Adviser", voice: "en_US-lessac-medium", text: "Two things: how long the fixed term is, and the notice period. Six-month terms are standard, and notice is usually one month. If there's a break clause, make sure you understand it." },
    { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "Brilliant, thank you. That's very clear." },
  ]),
  questions: [
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-02-q01", "Choose TWO documents the adviser says are essential.", [
      { id: "A", text: "Proof of income" },
      { id: "B", text: "Photo identification" },
      { id: "C", text: "A bank statement from abroad" },
      { id: "D", text: "A driving licence from any country" },
    ], ["A", "B"], "Proof of income and photo identification are the two essentials.", { selectCount: 2, difficulty: 1 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-02-q02", "Choose TWO payments usually made before moving in.", [
      { id: "A", text: "One month's rent in advance" },
      { id: "B", text: "A deposit of one month's rent" },
      { id: "C", text: "Six months' rent" },
      { id: "D", text: "A painting fee" },
    ], ["A", "B"], "One month's rent in advance plus a deposit equal to one month's rent.", { selectCount: 2, difficulty: 1 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-02-q03", "Choose TWO things to check during a viewing.", [
      { id: "A", text: "Water pressure" },
      { id: "B", text: "Whether the windows open" },
      { id: "C", text: "The colour of the walls" },
      { id: "D", text: "The neighbours' names" },
    ], ["A", "B"], "Check the water pressure and whether the windows open properly.", { selectCount: 2, difficulty: 2 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-02-q04", "Choose TWO contract details to look out for.", [
      { id: "A", text: "Length of the fixed term" },
      { id: "B", text: "The notice period" },
      { id: "C", text: "The landlord's age" },
      { id: "D", text: "The colour of the front door" },
    ], ["A", "B"], "Look at the fixed term and the notice period.", { selectCount: 2, difficulty: 1 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-02-q05", "Choose TWO statements about viewing times.", [
      { id: "A", text: "Evening viewings are available" },
      { id: "B", text: "Booking several on one evening is recommended" },
      { id: "C", text: "Viewings only happen at weekends" },
      { id: "D", text: "Viewings must be alone" },
    ], ["A", "B"], "Most agencies offer evenings, and the adviser suggests booking two or three together.", { selectCount: 2, difficulty: 2 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-02-q06", "Choose TWO standard terms mentioned.", [
      { id: "A", text: "A six-month fixed term" },
      { id: "B", text: "One month's notice" },
      { id: "C", text: "A three-year lease" },
      { id: "D", text: "Weekly rent payments" },
    ], ["A", "B"], "Six-month terms are standard and notice is usually one month.", { selectCount: 2, difficulty: 2 }),
    choiceQ("multiple_answer", "multiple_choice", "listening-targeted-multiple-answer-02-q07", "Choose TWO ways the caller is helped.", [
      { id: "A", text: "Advice on documents" },
      { id: "B", text: "Advice on checking properties" },
      { id: "C", text: "A free removal van" },
      { id: "D", text: "A paid deposit loan" },
    ], ["A", "B"], "The adviser covers documents and property checks; no removal van or loan is offered.", { selectCount: 2, difficulty: 3 }),
  ],
};
