// Original targeted Listening drills — Sentence Completion.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, textQ } from "./helpers";

export const listeningSentenceCompletion01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-sentence-completion-01", "Sentence completion — City cycling scheme", "both", "sentence_completion", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "sentence_completion",
  passages: [],
  audio: listeningAudio("listening-targeted-sentence-completion-01", "City cycling scheme", [
    { speaker: "Officer", voice: "en_US-lessac-medium", text: "The city's bike share scheme has been running for two years now, and it's been more successful than anyone expected. We originally planned forty docking stations, but demand was so strong that we now operate sixty-two." },
    { speaker: "Officer", voice: "en_US-lessac-medium", text: "The bikes are available from six in the morning until midnight, seven days a week. Riders pay one pound for every thirty minutes, with the first fifteen minutes free." },
    { speaker: "Officer", voice: "en_US-lessac-medium", text: "We carried out a survey last spring, and the results showed that two-thirds of trips replaced journeys that would otherwise have been made by car or taxi. That's the figure we're most proud of." },
    { speaker: "Officer", voice: "en_US-lessac-medium", text: "There have been problems, of course. The main complaint is that stations in the city centre are often empty by mid-morning, so we're adding a redistribution van to move bikes out from the suburbs each day." },
  ]),
  questions: [
    textQ("sentence_completion", "listening-targeted-sentence-completion-01-q01", "The scheme originally planned forty docking stations but now operates __________.", "62", "We now operate sixty-two stations.", { wordLimit: 1, allowNumber: true, evidence: "sixty-two", acceptableAnswers: ["sixty-two"], difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-01-q02", "Bikes are available from six in the morning until __________.", "midnight", "Available until midnight.", { wordLimit: 1, evidence: "midnight", difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-01-q03", "The first __________ minutes of each ride are free.", "15", "The first fifteen minutes are free.", { wordLimit: 1, allowNumber: true, evidence: "fifteen minutes", acceptableAnswers: ["fifteen"], difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-01-q04", "Riders pay one pound for every thirty __________.", "minutes", "One pound for every thirty minutes.", { wordLimit: 1, evidence: "thirty minutes", difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-01-q05", "Two-thirds of trips replaced journeys that would have been made by car or __________.", "taxi", "Journeys otherwise made by car or taxi.", { wordLimit: 1, evidence: "car or taxi", difficulty: 2 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-01-q06", "The survey was carried out last __________.", "spring", "The survey was carried out last spring.", { wordLimit: 1, evidence: "last spring", difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-01-q07", "City-centre stations are often empty by mid-__________.", "morning", "Empty by mid-morning.", { wordLimit: 1, evidence: "mid-morning", difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-01-q08", "A redistribution __________ will move bikes out from the suburbs.", "van", "We're adding a redistribution van.", { wordLimit: 1, evidence: "van", difficulty: 2 }),
  ],
};

export const listeningSentenceCompletion02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-sentence-completion-02", "Sentence completion — Museum audio guide", "both", "sentence_completion", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "sentence_completion",
  passages: [],
  audio: listeningAudio("listening-targeted-sentence-completion-02", "Museum audio guide", [
    { speaker: "Curator", voice: "en_US-ryan-high", text: "Welcome to the maritime gallery. This room tells the story of the town's fishing fleet, which at its peak in 1910 numbered over two hundred boats, all launched from the harbour you can see from the window." },
    { speaker: "Curator", voice: "en_US-ryan-high", text: "The fleet grew so quickly because the railway arrived here in 1885, which meant fresh fish could reach London markets in a single day. Before that, the catch had to be salted or smoked, which made it much less valuable." },
    { speaker: "Curator", voice: "en_US-ryan-high", text: "The industry declined after the Second World War, partly because the larger trawlers could not enter the shallow harbour. The last commercial boat was retired in 1978, and the harbour is now used mainly by pleasure craft." },
    { speaker: "Curator", voice: "en_US-ryan-high", text: "The model in the centre of the room shows the Mary Ann, the oldest surviving example of the town's famous clinker-built boats, in which the planks overlap like the tiles on a roof." },
  ]),
  questions: [
    textQ("sentence_completion", "listening-targeted-sentence-completion-02-q01", "At its peak in 1910, the fishing fleet numbered over __________ boats.", "200", "Over two hundred boats at its peak.", { wordLimit: 1, allowNumber: true, evidence: "two hundred", acceptableAnswers: ["200"], difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-02-q02", "The railway arrived in the town in __________.", "1885", "The railway arrived in 1885.", { wordLimit: 1, allowNumber: true, evidence: "1885", difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-02-q03", "With the railway, fresh fish could reach London in a single __________.", "day", "Reach London markets in a single day.", { wordLimit: 1, evidence: "single day", difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-02-q04", "Before the railway, the catch had to be salted or __________.", "smoked", "The catch had to be salted or smoked.", { wordLimit: 1, evidence: "salted or smoked", difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-02-q05", "The larger trawlers could not enter the __________ harbour.", "shallow", "The larger trawlers could not enter the shallow harbour.", { wordLimit: 1, evidence: "shallow harbour", difficulty: 2 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-02-q06", "The last commercial boat was retired in __________.", "1978", "The last commercial boat was retired in 1978.", { wordLimit: 1, allowNumber: true, evidence: "1978", difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-02-q07", "The harbour is now used mainly by __________ craft.", "pleasure", "Used mainly by pleasure craft.", { wordLimit: 1, evidence: "pleasure craft", difficulty: 1 }),
    textQ("sentence_completion", "listening-targeted-sentence-completion-02-q08", "In clinker-built boats, the planks __________ like roof tiles.", "overlap", "The planks overlap like tiles on a roof.", { wordLimit: 1, evidence: "overlap", difficulty: 2 }),
  ],
};
