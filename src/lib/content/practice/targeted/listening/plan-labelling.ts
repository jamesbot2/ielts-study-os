// Original targeted Listening drills — Plan Labelling.
// The visual shows blank markers only; the AUDIO provides every answer.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, markerQ } from "./helpers";

const PARK_VISUAL = {
  kind: "plan" as const,
  width: 400,
  height: 300,
  shapes: [
    { id: "border", shape: "rect" as const, x: 10, y: 10, w: 380, h: 280, className: "fill-green-50 stroke-gray-400" },
    { id: "path", shape: "line" as const, x: 200, y: 290, x2: 200, y2: 120, className: "stroke-amber-500" },
    { id: "north", shape: "rect" as const, x: 188, y: 14, w: 24, h: 18, className: "fill-transparent stroke-transparent", label: "N ↑" },
  ],
  markers: [
    { id: "gate", label: "A", x: 200, y: 282 },
    { id: "playground", label: "B", x: 125, y: 200 },
    { id: "lake", label: "C", x: 200, y: 95 },
    { id: "cafe", label: "D", x: 275, y: 200 },
    { id: "rose", label: "E", x: 200, y: 45 },
    { id: "boats", label: "F", x: 268, y: 105 },
  ],
};

export const listeningPlanLabelling01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-plan-labelling-01", "Plan labelling — Riverside Park", "both", "plan_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "plan_labelling",
  passages: [],
  visual: PARK_VISUAL,
  audio: listeningAudio("listening-targeted-plan-labelling-01", "Riverside Park plan", [
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "Welcome to Riverside Park. You've come in through the main gate at the south end, and the path straight ahead of you runs north towards the lake in the centre of the park." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "If you look to your left, just before the lake, you'll see the children's playground — you can't miss the climbing frames." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "On the opposite side of the path, to the east, is the café, which is open until six. It's right next to the path, so it's handy for a stop on the way back." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "Beyond the lake, on the far side, is the rose garden. In June it's spectacular, and there are benches all around it." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "And if you fancy going out on the water, the boat hire hut is on the lake's eastern shore — it's the small building with the blue roof." },
  ]),
  questions: [
    markerQ("plan_labelling", "listening-targeted-plan-labelling-01-q01", "gate", "A", "main gate", "The guide says visitors come in through the main gate at the south end, where marker A sits.", { difficulty: 1, evidence: "main gate at the south end" }),
    markerQ("plan_labelling", "listening-targeted-plan-labelling-01-q02", "playground", "B", "playground", "Marker B is on the left of the path before the lake — the children's playground.", { difficulty: 1, evidence: "children's playground" }),
    markerQ("plan_labelling", "listening-targeted-plan-labelling-01-q03", "lake", "C", "lake", "Marker C is in the centre of the park — the lake the path runs towards.", { difficulty: 1, evidence: "lake in the centre" }),
    markerQ("plan_labelling", "listening-targeted-plan-labelling-01-q04", "cafe", "D", "café", "Marker D is east of the path — the café open until six.", { acceptableAnswers: ["cafe"], difficulty: 2, evidence: "café" }),
    markerQ("plan_labelling", "listening-targeted-plan-labelling-01-q05", "rose", "E", "rose garden", "Marker E is beyond the lake — the rose garden.", { difficulty: 2, evidence: "rose garden" }),
    markerQ("plan_labelling", "listening-targeted-plan-labelling-01-q06", "boats", "F", "boat hire hut", "Marker F is on the lake's eastern shore — the boat hire hut with the blue roof.", { difficulty: 2, evidence: "boat hire hut", wordLimit: 3 }),
  ],
};

const CAMPUS_VISUAL = {
  kind: "plan" as const,
  width: 400,
  height: 300,
  shapes: [
    { id: "border", shape: "rect" as const, x: 10, y: 10, w: 380, h: 280, className: "fill-gray-50 stroke-gray-400" },
    { id: "path", shape: "line" as const, x: 200, y: 290, x2: 200, y2: 150, className: "stroke-amber-500" },
    { id: "west-path", shape: "line" as const, x: 200, y: 150, x2: 90, y2: 150, className: "stroke-amber-500" },
    { id: "east-path", shape: "line" as const, x: 200, y: 150, x2: 310, y2: 150, className: "stroke-amber-500" },
    { id: "north", shape: "rect" as const, x: 188, y: 14, w: 24, h: 18, className: "fill-transparent stroke-transparent", label: "N ↑" },
  ],
  markers: [
    { id: "reception", label: "A", x: 200, y: 170 },
    { id: "library", label: "B", x: 270, y: 150 },
    { id: "sports", label: "C", x: 370, y: 150 },
    { id: "science", label: "D", x: 130, y: 150 },
    { id: "canteen", label: "E", x: 130, y: 90 },
    { id: "car-park", label: "F", x: 45, y: 220 },
  ],
};

export const listeningPlanLabelling02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-plan-labelling-02", "Plan labelling — College campus", "both", "plan_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "plan_labelling",
  passages: [],
  visual: CAMPUS_VISUAL,
  audio: listeningAudio("listening-targeted-plan-labelling-02", "College campus plan", [
    { speaker: "Guide", voice: "en_US-ryan-high", text: "OK, this is your campus tour. You came in through the main entrance, and the building straight in front of you is reception — that's where you collect your student card." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "To the right of reception, on the east side, is the library. It's open until ten on weekdays." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "If you carry on further east, right to the edge of the campus, you'll come to the sports hall. That's the newest building here." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "On the other side of reception, to the west, is the science block. The labs are on the top floor." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "And the canteen is just behind the science block, on its north side. It's cheaper than anywhere in town, honestly." },
    { speaker: "Guide", voice: "en_US-ryan-high", text: "Oh, and if you drove, the car park is outside the west edge of the campus, near the science block." },
  ]),
  questions: [
    markerQ("plan_labelling", "listening-targeted-plan-labelling-02-q01", "reception", "A", "reception", "The building straight ahead of the entrance is reception.", { difficulty: 1, evidence: "reception" }),
    markerQ("plan_labelling", "listening-targeted-plan-labelling-02-q02", "library", "B", "library", "Marker B is to the right of reception, on the east side — the library.", { difficulty: 1, evidence: "library" }),
    markerQ("plan_labelling", "listening-targeted-plan-labelling-02-q03", "sports", "C", "sports hall", "Marker C is at the east edge of the campus — the sports hall.", { difficulty: 1, evidence: "sports hall" }),
    markerQ("plan_labelling", "listening-targeted-plan-labelling-02-q04", "science", "D", "science block", "Marker D is to the west of reception — the science block.", { difficulty: 1, evidence: "science block" }),
    markerQ("plan_labelling", "listening-targeted-plan-labelling-02-q05", "canteen", "E", "canteen", "Marker E is behind the science block on its north side — the canteen.", { difficulty: 2, evidence: "canteen" }),
    markerQ("plan_labelling", "listening-targeted-plan-labelling-02-q06", "car-park", "F", "car park", "Marker F is outside the west edge — the car park.", { difficulty: 1, evidence: "car park" }),
  ],
};
