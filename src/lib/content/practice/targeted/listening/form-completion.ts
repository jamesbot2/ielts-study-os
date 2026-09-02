// Original targeted Listening drills — Form Completion.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, textQ } from "./helpers";

export const listeningFormCompletion01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-form-completion-01", "Form completion — Course enrolment", "both", "form_completion", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "form_completion",
  passages: [],
  audio: listeningAudio("listening-targeted-form-completion-01", "Course enrolment call", [
    { speaker: "Clerk", voice: "en_US-lessac-medium", text: "Westfield College, enrolments." },
    { speaker: "Student", voice: "en_US-ryan-high", text: "Hello, I'd like to enrol on the photography course that starts in September, please." },
    { speaker: "Clerk", voice: "en_US-lessac-medium", text: "Of course. Can I take your full name?" },
    { speaker: "Student", voice: "en_US-ryan-high", text: "It's Daniel Okonkwo. That's O-K-O-N-K-W-O." },
    { speaker: "Clerk", voice: "en_US-lessac-medium", text: "Thank you. And your date of birth?" },
    { speaker: "Student", voice: "en_US-ryan-high", text: "The fourteenth of March, nineteen ninety-eight." },
    { speaker: "Clerk", voice: "en_US-lessac-medium", text: "Great. The course fee is one hundred and eighty-five pounds, which includes all materials except the memory card." },
    { speaker: "Student", voice: "en_US-ryan-high", text: "Fine. Do you need my phone number?" },
    { speaker: "Clerk", voice: "en_US-lessac-medium", text: "Please. And an email for the confirmation." },
    { speaker: "Student", voice: "en_US-ryan-high", text: "The number is oh seven eight four six, double five, two one three. And my email is daniel dot okonkwo at mail dot com." },
    { speaker: "Clerk", voice: "en_US-lessac-medium", text: "07846 55213, daniel.okonkwo@mail.com. The course runs on Tuesday evenings, starting on the ninth of September, in room fourteen of the arts block." },
    { speaker: "Student", voice: "en_US-ryan-high", text: "Tuesdays work well. How do I pay?" },
    { speaker: "Clerk", voice: "en_US-lessac-medium", text: "You can pay by card now, or in person before the first session. A receipt will be emailed to you with the joining instructions." },
    { speaker: "Student", voice: "en_US-ryan-high", text: "I'll pay now by card, thanks." },
  ]),
  questions: [
    textQ("form_completion", "listening-targeted-form-completion-01-q01", "Course name: __________", "photography", "The student asks to enrol on the photography course.", { wordLimit: 1, evidence: "photography course", difficulty: 1 }),
    textQ("form_completion", "listening-targeted-form-completion-01-q02", "Family name: __________", "Okonkwo", "The surname is spelled O-K-O-N-K-W-O.", { wordLimit: 1, evidence: "O-K-O-N-K-W-O", difficulty: 2 }),
    textQ("form_completion", "listening-targeted-form-completion-01-q03", "Date of birth: 14 __________ 1998", "March", "The student says the fourteenth of March, nineteen ninety-eight.", { wordLimit: 1, evidence: "fourteenth of March", difficulty: 2 }),
    textQ("form_completion", "listening-targeted-form-completion-01-q04", "Course fee: £__________", "185", "The fee is one hundred and eighty-five pounds.", { wordLimit: 1, allowNumber: true, evidence: "eighty-five pounds", acceptableAnswers: ["185"], difficulty: 2 }),
    textQ("form_completion", "listening-targeted-form-completion-01-q05", "Fee does NOT include the memory __________.", "card", "All materials are included except the memory card.", { wordLimit: 1, evidence: "memory card", difficulty: 2 }),
    textQ("form_completion", "listening-targeted-form-completion-01-q06", "Phone number: 07846 552__________", "13", "The number ends in two one three.", { wordLimit: 1, allowNumber: true, evidence: "two one three", acceptableAnswers: ["13"], difficulty: 2 }),
    textQ("form_completion", "listening-targeted-form-completion-01-q07", "Course day: __________ evenings", "Tuesday", "The course runs on Tuesday evenings.", { wordLimit: 1, evidence: "Tuesday evenings", difficulty: 1 }),
    textQ("form_completion", "listening-targeted-form-completion-01-q08", "Room number: __________", "14", "The course is in room fourteen of the arts block.", { wordLimit: 1, allowNumber: true, evidence: "room fourteen", acceptableAnswers: ["fourteen", "14"], difficulty: 2 }),
  ],
};

export const listeningFormCompletion02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-form-completion-02", "Form completion — Hotel booking", "both", "form_completion", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "form_completion",
  passages: [],
  audio: listeningAudio("listening-targeted-form-completion-02", "Hotel booking", [
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "The Harbour Hotel, how may I help?" },
    { speaker: "Guest", voice: "en_GB-northern_english_male-medium", text: "I'd like to book a room for two nights, from the twenty-fifth of August, please." },
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Let me look. We have a standard double at eighty-six pounds a night, or a sea-view room at one hundred and ten." },
    { speaker: "Guest", voice: "en_GB-northern_english_male-medium", text: "The standard double is fine. Is breakfast included?" },
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "It isn't, I'm afraid, but guests get ten per cent off at the caf\u00e9 next door with their room key." },
    { speaker: "Guest", voice: "en_GB-northern_english_male-medium", text: "Understood. My name is Helen Marsh — M-A-R-S-H." },
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Thank you. Could I take a contact number?" },
    { speaker: "Guest", voice: "en_GB-northern_english_male-medium", text: "Sure, it's oh one one three, seven nine four, double eight six two." },
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "0113 794 8862. And what time will you arrive on the twenty-fifth?" },
    { speaker: "Guest", voice: "en_GB-northern_english_male-medium", text: "Around four in the afternoon. Oh, and could I have a room on a high floor if possible?" },
    { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "I've noted that. The reference for your booking is HB two nine seven one. Check-in is from three o'clock." },
  ]),
  questions: [
    textQ("form_completion", "listening-targeted-form-completion-02-q01", "Arrival date: 25 __________", "August", "The booking is from the twenty-fifth of August.", { wordLimit: 1, evidence: "twenty-fifth of August", difficulty: 1 }),
    textQ("form_completion", "listening-targeted-form-completion-02-q02", "Number of nights: __________", "2", "The guest books two nights.", { wordLimit: 1, allowNumber: true, evidence: "two nights", acceptableAnswers: ["two", "2"], difficulty: 1 }),
    textQ("form_completion", "listening-targeted-form-completion-02-q03", "Standard double rate: £__________ per night", "86", "The standard double costs eighty-six pounds a night.", { wordLimit: 1, allowNumber: true, evidence: "eighty-six pounds", acceptableAnswers: ["86"], difficulty: 2 }),
    textQ("form_completion", "listening-targeted-form-completion-02-q04", "Sea-view room rate: £__________ per night", "110", "The sea-view room costs one hundred and ten.", { wordLimit: 1, allowNumber: true, evidence: "one hundred and ten", acceptableAnswers: ["110"], difficulty: 2 }),
    textQ("form_completion", "listening-targeted-form-completion-02-q05", "Guest name: Helen __________", "Marsh", "The name is Helen Marsh, spelled M-A-R-S-H.", { wordLimit: 1, evidence: "M-A-R-S-H", difficulty: 2 }),
    textQ("form_completion", "listening-targeted-form-completion-02-q06", "Contact number: 0113 794 __________", "8862", "The number ends with double eight six two.", { wordLimit: 1, allowNumber: true, evidence: "double eight six two", acceptableAnswers: ["8862"], difficulty: 2 }),
    textQ("form_completion", "listening-targeted-form-completion-02-q07", "Arrival time: around __________ pm", "4", "The guest will arrive around four in the afternoon.", { wordLimit: 1, allowNumber: true, evidence: "four in the afternoon", acceptableAnswers: ["four", "4"], difficulty: 1 }),
    textQ("form_completion", "listening-targeted-form-completion-02-q08", "Booking reference: __________ 2971", "HB", "The reference is HB two nine seven one.", { wordLimit: 1, evidence: "HB two nine seven one", difficulty: 2 }),
  ],
};
