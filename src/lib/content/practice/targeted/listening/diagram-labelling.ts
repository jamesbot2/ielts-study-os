// Original targeted Listening drills — Diagram Labelling.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, textQ } from "./helpers";

const FILTER_DIAGRAM =
  "DIAGRAM: A water filter jug, labelled top to bottom. At the TOP: the LID with a small pour spout. Below the lid: the UPPER FUNNEL where tap water is poured in. Inside the funnel: the CARTRIDGE that removes impurities. Below the funnel: the COLLECTION CHAMBER holding filtered water. At the BOTTOM: the HANDLE attached to the side.";

export const listeningDiagramLabelling01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-diagram-labelling-01", "Diagram labelling — Water filter jug", "both", "diagram_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "diagram_labelling",
  passages: [],
  audio: listeningAudio("listening-targeted-diagram-labelling-01", "Water filter jug", [
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "Today we're looking at how a water filter jug works. Let's go through its parts from the top down." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "At the very top is the lid, which has a small spout so you can pour without removing it." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "Under the lid is the upper funnel. That's where you pour the tap water in — it holds about one litre at a time." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "Inside the funnel sits the cartridge. This is the part that actually removes impurities, and it should be replaced every four weeks." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "The filtered water then collects in the chamber below the funnel. The clear section lets you see how much you have left." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "And finally, attached to the side of the jug is the handle, which is wide enough to grip even when the jug is full." },
  ]),
  questions: [
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q01", `${FILTER_DIAGRAM}\n\nLabel A: the __________ (top part, with a spout)`, "lid", "The lid is at the very top with a small spout.", { wordLimit: 1, evidence: "lid", difficulty: 1 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q02", `Label B: the upper __________ (where tap water is poured in)`, "funnel", "The upper funnel holds the tap water.", { wordLimit: 1, evidence: "upper funnel", difficulty: 1 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q03", `Label C: the __________ (inside the funnel, removes impurities)`, "cartridge", "The cartridge removes impurities.", { wordLimit: 1, evidence: "cartridge", difficulty: 1 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q04", `Label D: the collection __________ (below the funnel, clear section)`, "chamber", "The filtered water collects in the chamber.", { wordLimit: 1, evidence: "chamber", difficulty: 1 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q05", `Label E: the __________ (attached to the side)`, "handle", "The handle is attached to the side.", { wordLimit: 1, evidence: "handle", difficulty: 1 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q06", `The funnel holds about __________ litre(s) at a time.`, "1", "The funnel holds about one litre at a time.", { wordLimit: 1, evidence: "one litre", acceptableAnswers: ["one", "1"], difficulty: 2 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q07", `The cartridge should be replaced every __________ weeks.`, "4", "Replace the cartridge every four weeks.", { wordLimit: 1, evidence: "every four weeks", acceptableAnswers: ["four", "4"], difficulty: 2 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q08", `The clear section shows how much filtered water is __________.`, "left", "The clear section lets you see how much you have left.", { wordLimit: 1, evidence: "how much you have left", difficulty: 2 }),
  ],
};

const BICYCLE_DIAGRAM =
  "DIAGRAM: A bicycle, labelled clockwise from the front. At the FRONT: the HANDLEBARS for steering. Below them: the FRONT WHEEL. In the CENTRE of the frame: the SADDLE where the rider sits. Behind the saddle: the REAR WHEEL. Between the two wheels, on the frame: the PEDALS which drive the CHAIN. The chain runs around the GEARS at the rear wheel.";

export const listeningDiagramLabelling02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-diagram-labelling-02", "Diagram labelling — Bicycle parts", "both", "diagram_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "diagram_labelling",
  passages: [],
  audio: listeningAudio("listening-targeted-diagram-labelling-02", "Bicycle parts", [
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "Let's run through the main parts of the bike before your first ride. Starting at the front: those are the handlebars, which you use for steering." },
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "Below the handlebars is the front wheel. Make sure the tyre is firm before every ride — squeeze it with your thumb." },
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "In the middle of the frame is the saddle. That's the seat, and we'll adjust its height before we set off." },
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "Behind the saddle is the rear wheel. The brake lever on the right handlebar controls it." },
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "Now the pedals, down between the two wheels. Pushing them turns the chain, which runs around the gears at the back." },
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "If the chain ever comes off, stop pedalling immediately and let me know." },
  ]),
  questions: [
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q01", `${BICYCLE_DIAGRAM}\n\nLabel A: the __________ (front, used for steering)`, "handlebars", "The handlebars at the front are for steering.", { wordLimit: 1, evidence: "handlebars", difficulty: 1 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q02", `Label B: the front __________ (below the handlebars)`, "wheel", "The front wheel is below the handlebars.", { wordLimit: 1, evidence: "front wheel", difficulty: 1 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q03", `Label C: the __________ (centre of the frame, the seat)`, "saddle", "The saddle is the seat in the centre.", { wordLimit: 1, evidence: "saddle", difficulty: 1 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q04", `Label D: the rear __________ (behind the saddle)`, "wheel", "The rear wheel is behind the saddle.", { wordLimit: 1, evidence: "rear wheel", difficulty: 1 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q05", `Label E: the __________ (between the wheels, drive the chain)`, "pedals", "The pedals turn the chain.", { wordLimit: 1, evidence: "pedals", difficulty: 1 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q06", `Label F: the __________ (runs around the gears at the back)`, "chain", "The chain runs around the gears.", { wordLimit: 1, evidence: "chain", difficulty: 1 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q07", `The rear brake is controlled by the lever on the __________ handlebar.`, "right", "The brake lever on the right handlebar controls the rear wheel.", { wordLimit: 1, evidence: "right handlebar", difficulty: 2 }),
    textQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q08", `Before every ride, squeeze the front __________ with your thumb.`, "tyre", "Check the front tyre is firm before every ride.", { wordLimit: 1, evidence: "tyre", difficulty: 2 }),
  ],
};
