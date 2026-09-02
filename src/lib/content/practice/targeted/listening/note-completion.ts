// Original targeted Listening drills — Note Completion.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, textQ } from "./helpers";

export const listeningNoteCompletion01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-note-completion-01", "Note completion — Urban wildlife lecture", "both", "note_completion", 3),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "note_completion",
  passages: [],
  audio: listeningAudio("listening-targeted-note-completion-01", "Urban wildlife lecture", [
    { speaker: "Lecturer", voice: "en_US-lessac-medium", text: "Right, this week we're looking at why some animals do unexpectedly well in cities. I'll start with the red fox, which is now more common in many urban areas than in the surrounding countryside." },
    { speaker: "Lecturer", voice: "en_US-lessac-medium", text: "The first reason is food. Foxes are opportunistic feeders, and cities provide a reliable supply all year round — from rubbish bins, to be honest, but also deliberately, because some residents leave out scraps for them." },
    { speaker: "Lecturer", voice: "en_US-lessac-medium", text: "The second factor is shelter. Gardens, sheds and the space under railway lines all give foxes safe places to rest during the day, and importantly, a place to raise their cubs in spring." },
    { speaker: "Lecturer", voice: "en_US-lessac-medium", text: "A third point, which surprises many people, is that the city is often safer than the countryside. Urban foxes face far fewer large predators, and road accidents, although they happen, kill far fewer foxes than hunting does in rural areas." },
    { speaker: "Lecturer", voice: "en_US-lessac-medium", text: "Now, there are of course problems. Foxes do sometimes damage gardens, and they can carry a skin disease called mange, which makes their fur fall out. The standard advice from wildlife groups is simple: don't feed them, and secure your bins with a lid." },
    { speaker: "Lecturer", voice: "en_US-lessac-medium", text: "So to summarise — three reasons for urban success: a reliable food supply, plenty of sheltered places, and a relative absence of predators. Next week we'll do the same analysis for hedgehogs." },
  ]),
  questions: [
    textQ("note_completion", "listening-targeted-note-completion-01-q01", "Topic: urban __________ of the red fox", "success", "The lecture summarises three reasons for urban success.", { wordLimit: 1, evidence: "urban success", difficulty: 2 }),
    textQ("note_completion", "listening-targeted-note-completion-01-q02", "Reason 1 — food: cities provide a reliable supply all year __________.", "round", "A reliable supply all year round.", { wordLimit: 1, evidence: "all year round", difficulty: 1 }),
    textQ("note_completion", "listening-targeted-note-completion-01-q03", "Food sources include bins and __________ left out by residents.", "scraps", "Some residents leave out scraps deliberately.", { wordLimit: 1, evidence: "leave out scraps", difficulty: 2 }),
    textQ("note_completion", "listening-targeted-note-completion-01-q04", "Reason 2 — shelter: gardens, sheds and space under __________ lines.", "railway", "Space under railway lines provides rest places.", { wordLimit: 1, evidence: "railway lines", difficulty: 2 }),
    textQ("note_completion", "listening-targeted-note-completion-01-q05", "Shelter is also important for raising __________ in spring.", "cubs", "A place to raise their cubs in spring.", { wordLimit: 1, evidence: "cubs", difficulty: 1 }),
    textQ("note_completion", "listening-targeted-note-completion-01-q06", "Reason 3 — safety: urban foxes face fewer large __________.", "predators", "Far fewer large predators in the city.", { wordLimit: 1, evidence: "predators", difficulty: 2 }),
    textQ("note_completion", "listening-targeted-note-completion-01-q07", "Problem — disease: mange makes the fur fall __________.", "out", "Mange makes their fur fall out.", { wordLimit: 1, evidence: "fur fall out", difficulty: 1 }),
    textQ("note_completion", "listening-targeted-note-completion-01-q08", "Advice: do not feed foxes and secure bins with a __________.", "lid", "Secure your bins with a lid.", { wordLimit: 1, evidence: "lid", difficulty: 1 }),
  ],
};

export const listeningNoteCompletion02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-note-completion-02", "Note completion — Volunteer orientation", "both", "note_completion", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "note_completion",
  passages: [],
  audio: listeningAudio("listening-targeted-note-completion-02", "Volunteer orientation", [
    { speaker: "Coordinator", voice: "en_US-ryan-high", text: "Welcome to the food bank, and thanks for volunteering. Let me run through the basics so you know what to expect on your first shift." },
    { speaker: "Coordinator", voice: "en_US-ryan-high", text: "Shifts start at nine in the morning, but please arrive fifteen minutes early so we can brief you. The morning shift finishes at twelve thirty, and the afternoon shift runs from one until four." },
    { speaker: "Coordinator", voice: "en_US-ryan-high", text: "Your main task will be sorting donations. We separate tins, packets and fresh produce, and we check every date label — anything past its date goes to the compost collection rather than the shelves." },
    { speaker: "Coordinator", voice: "en_US-ryan-high", text: "We also pack emergency parcels for families. Each parcel should contain enough for three days, and we always include rice, pasta, tinned vegetables and tea." },
    { speaker: "Coordinator", voice: "en_US-ryan-high", text: "For health and safety, please wear closed shoes, and if you're lifting heavy boxes, always bend your knees — we'd rather you ask for help than hurt your back." },
    { speaker: "Coordinator", voice: "en_US-ryan-high", text: "Finally, if you can't make a shift, phone the office at least twenty-four hours before, so we can find a replacement. That's really important, because the service depends on people turning up." },
  ]),
  questions: [
    textQ("note_completion", "listening-targeted-note-completion-02-q01", "Arrival time: __________ minutes before the shift", "15", "Arrive fifteen minutes early for the briefing.", { wordLimit: 1, allowNumber: true, evidence: "fifteen minutes early", acceptableAnswers: ["fifteen"], difficulty: 1 }),
    textQ("note_completion", "listening-targeted-note-completion-02-q02", "Morning shift ends at 12:__________.", "30", "The morning shift finishes at twelve thirty.", { wordLimit: 1, allowNumber: true, evidence: "twelve thirty", acceptableAnswers: ["thirty"], difficulty: 1 }),
    textQ("note_completion", "listening-targeted-note-completion-02-q03", "Main task: sorting __________.", "donations", "Your main task will be sorting donations.", { wordLimit: 1, evidence: "donations", difficulty: 1 }),
    textQ("note_completion", "listening-targeted-note-completion-02-q04", "Out-of-date items go to the __________ collection.", "compost", "Anything past its date goes to the compost collection.", { wordLimit: 1, evidence: "compost collection", difficulty: 2 }),
    textQ("note_completion", "listening-targeted-note-completion-02-q05", "Emergency parcels contain food for __________ days.", "3", "Each parcel should contain enough for three days.", { wordLimit: 1, allowNumber: true, evidence: "three days", acceptableAnswers: ["three"], difficulty: 1 }),
    textQ("note_completion", "listening-targeted-note-completion-02-q06", "Parcels always include rice, pasta, tinned vegetables and __________.", "tea", "We always include rice, pasta, tinned vegetables and tea.", { wordLimit: 1, evidence: "tea", difficulty: 1 }),
    textQ("note_completion", "listening-targeted-note-completion-02-q07", "Safety: wear __________ shoes and bend your knees when lifting.", "closed", "Please wear closed shoes.", { wordLimit: 1, evidence: "closed shoes", difficulty: 1 }),
    textQ("note_completion", "listening-targeted-note-completion-02-q08", "Cancelling a shift: phone at least __________ hours before.", "24", "Phone at least twenty-four hours before.", { wordLimit: 1, allowNumber: true, evidence: "twenty-four hours", acceptableAnswers: ["twenty-four"], difficulty: 2 }),
  ],
};
