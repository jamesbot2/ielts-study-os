// Original targeted Listening drills — Plan Labelling.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, textQ } from "./helpers";

const PARK_PLAN =
  "PLAN: Riverside Park. Main gate at the BOTTOM (south). A straight path runs north from the gate to the lake in the CENTRE. To the LEFT (west) of the path, before the lake, is the playground; to the RIGHT (east) is the caf\u00e9. North of the lake is the rose garden. The boat hire hut is on the lake's EAST shore.";

export const listeningPlanLabelling01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-plan-labelling-01", "Plan labelling — Riverside Park", "both", "plan_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "plan_labelling",
  passages: [],
  audio: listeningAudio("listening-targeted-plan-labelling-01", "Riverside Park plan", [
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "Welcome to Riverside Park. You've come in through the main gate at the south end, and the path straight ahead of you runs north towards the lake in the centre of the park." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "If you look to your left, just before the lake, you'll see the children's playground — you can't miss the climbing frames." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "On the opposite side of the path, to the east, is the caf\u00e9, which is open until six. It's right next to the path, so it's handy for a stop on the way back." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "Beyond the lake, on the far side, is the rose garden. In June it's spectacular, and there are benches all around it." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "And if you fancy going out on the water, the boat hire hut is on the lake's eastern shore — it's the small building with the blue roof." },
  ]),
  questions: [
    textQ("plan_labelling", "listening-targeted-plan-labelling-01-q01", `${PARK_PLAN}\n\nLabel A: the __________ (south end, where visitors enter)`, "main gate", "Visitors come in through the main gate at the south end.", { wordLimit: 2, evidence: "main gate at the south end", difficulty: 1 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-01-q02", `Label B: the __________ (west of the path, before the lake)`, "playground", "The children's playground is to the left of the path before the lake.", { wordLimit: 1, evidence: "playground", difficulty: 1 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-01-q03", `Label C: the __________ (east of the path, open until six)`, "caf\u00e9", "The caf\u00e9 is east of the path and open until six.", { wordLimit: 1, evidence: "caf\u00e9", difficulty: 1 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-01-q04", `Label D: the __________ (centre of the park)`, "lake", "The lake is in the centre of the park.", { wordLimit: 1, evidence: "lake in the centre", difficulty: 1 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-01-q05", `Label E: the __________ garden (far side of the lake)`, "rose", "The rose garden is beyond the lake.", { wordLimit: 1, evidence: "rose garden", difficulty: 1 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-01-q06", `Label F: the boat hire __________ (lake's eastern shore)`, "hut", "The boat hire hut is on the lake's eastern shore.", { wordLimit: 1, evidence: "boat hire hut", difficulty: 2 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-01-q07", `The boat hire hut has a __________ roof.`, "blue", "It is the small building with the blue roof.", { wordLimit: 1, evidence: "blue roof", difficulty: 2 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-01-q08", `The caf\u00e9 closes at __________ o'clock.`, "6", "The caf\u00e9 is open until six.", { wordLimit: 1, evidence: "open until six", acceptableAnswers: ["six", "6"], difficulty: 2 }),
  ],
};

const CAMPUS_PLAN =
  "PLAN: College campus. Main entrance at the BOTTOM (south). The reception building is directly ahead of the entrance. The library is to the RIGHT (east) of reception; the sports hall is further east, at the campus's east edge. The science block is to the LEFT (west) of reception, with the canteen behind (north of) it. The car park is outside the west edge.";

export const listeningPlanLabelling02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-plan-labelling-02", "Plan labelling — College campus", "both", "plan_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "plan_labelling",
  passages: [],
  audio: listeningAudio("listening-targeted-plan-labelling-02", "College campus plan", [
    { speaker: "Guide", voice: "en_US-ryan-high", text: "OK, this is your campus tour. You came in through the main entrance, and the building straight in front of you is reception — that's where you collect your student card." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "To the right of reception, on the east side, is the library. It's open until ten on weekdays." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "If you carry on further east, right to the edge of the campus, you'll come to the sports hall. That's the newest building here." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "On the other side of reception, to the west, is the science block. The labs are on the top floor." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "And the canteen is just behind the science block, on its north side. It's cheaper than anywhere in town, honestly." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "Oh, and if you drove, the car park is outside the west edge of the campus, near the science block." },
  ]),
  questions: [
    textQ("plan_labelling", "listening-targeted-plan-labelling-02-q01", `${CAMPUS_PLAN}\n\nLabel A: __________ (straight ahead of the main entrance)`, "reception", "Reception is directly ahead of the entrance.", { wordLimit: 1, evidence: "reception", difficulty: 1 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-02-q02", `Label B: the __________ (east of reception, open until ten on weekdays)`, "library", "The library is east of reception.", { wordLimit: 1, evidence: "library", difficulty: 1 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-02-q03", `Label C: the __________ hall (east edge of campus)`, "sports", "The sports hall is at the east edge.", { wordLimit: 1, evidence: "sports hall", difficulty: 1 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-02-q04", `Label D: the __________ block (west of reception)`, "science", "The science block is west of reception.", { wordLimit: 1, evidence: "science block", difficulty: 1 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-02-q05", `Label E: the __________ (north of the science block)`, "canteen", "The canteen is behind the science block on its north side.", { wordLimit: 1, evidence: "canteen", difficulty: 1 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-02-q06", `Label F: the car __________ (outside the west edge)`, "park", "The car park is outside the west edge.", { wordLimit: 1, evidence: "car park", difficulty: 1 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-02-q07", `The labs are on the __________ floor of the science block.`, "top", "The labs are on the top floor.", { wordLimit: 1, evidence: "top floor", difficulty: 2 }),
    textQ("plan_labelling", "listening-targeted-plan-labelling-02-q08", `The library closes at __________ on weekdays.`, "10", "The library is open until ten on weekdays.", { wordLimit: 1, evidence: "until ten", acceptableAnswers: ["ten", "10"], difficulty: 2 }),
  ],
};
