// Original targeted Listening drills — Map Labelling.
// The visual shows blank markers only; the AUDIO provides every answer.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, markerQ } from "./helpers";

const TOWN_VISUAL = {
  kind: "map" as const,
  width: 400,
  height: 300,
  shapes: [
    { id: "road", shape: "line" as const, x: 200, y: 290, x2: 200, y2: 120, className: "stroke-gray-500" },
    { id: "bend", shape: "line" as const, x: 200, y: 120, x2: 290, y2: 120, className: "stroke-gray-500" },
    { id: "station-label", shape: "rect" as const, x: 170, y: 286, w: 60, h: 14, className: "fill-transparent stroke-transparent", label: "Station" },
    { id: "north", shape: "rect" as const, x: 188, y: 8, w: 24, h: 18, className: "fill-transparent stroke-transparent", label: "N ↑" },
  ],
  markers: [
    { id: "post", label: "A", x: 150, y: 240 },
    { id: "bank", label: "B", x: 250, y: 240 },
    { id: "museum", label: "C", x: 320, y: 100 },
    { id: "pharmacy", label: "D", x: 120, y: 210 },
    { id: "tower", label: "E", x: 200, y: 110 },
    { id: "park", label: "F", x: 200, y: 60 },
  ],
};

export const listeningMapLabelling01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-map-labelling-01", "Map labelling — Town centre", "both", "map_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "map_labelling",
  passages: [],
  visual: TOWN_VISUAL,
  audio: listeningAudio("listening-targeted-map-labelling-01", "Town centre directions", [
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "Right, you've just come out of the station. The main road runs straight ahead, north, all the way to the clock tower in the middle of the town." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "As you walk up, the post office is on your left, on the west side of the road. It's directly opposite the bank." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "The bank is on the right-hand side, so on the east. If you need cash, that's where the only machine in town is." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "Keep walking past the bank and the road bends to the right at the corner. The museum is just around that corner, on your right." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "Back near the post office, the pharmacy is right next door to it, on the north side. You can't get prescriptions anywhere else on a Sunday." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "And if you go all the way to the clock tower, the park is just beyond it, to the north. It's a good place to sit for ten minutes." },
  ]),
  questions: [
    markerQ("map_labelling", "listening-targeted-map-labelling-01-q01", "post", "A", "post office", "Marker A is on the west side of the road — the post office.", { difficulty: 1, evidence: "post office" }),
    markerQ("map_labelling", "listening-targeted-map-labelling-01-q02", "bank", "B", "bank", "Marker B is on the east side, with the only cash machine in town — the bank.", { difficulty: 1, evidence: "bank" }),
    markerQ("map_labelling", "listening-targeted-map-labelling-01-q03", "museum", "C", "museum", "Marker C is around the right-hand bend past the bank — the museum.", { difficulty: 2, evidence: "museum" }),
    markerQ("map_labelling", "listening-targeted-map-labelling-01-q04", "pharmacy", "D", "pharmacy", "Marker D is next to the post office on its north side — the pharmacy.", { difficulty: 2, evidence: "pharmacy" }),
    markerQ("map_labelling", "listening-targeted-map-labelling-01-q05", "tower", "E", "clock tower", "Marker E is in the middle of town — the clock tower.", { difficulty: 1, evidence: "clock tower" }),
    markerQ("map_labelling", "listening-targeted-map-labelling-01-q06", "park", "F", "park", "Marker F is just north of the clock tower — the park.", { difficulty: 1, evidence: "park" }),
  ],
};

const CAMP_VISUAL = {
  kind: "map" as const,
  width: 400,
  height: 300,
  shapes: [
    { id: "path", shape: "line" as const, x: 200, y: 290, x2: 200, y2: 160, className: "stroke-gray-500" },
    { id: "west-fork", shape: "line" as const, x: 200, y: 160, x2: 90, y2: 120, className: "stroke-gray-500" },
    { id: "east-fork", shape: "line" as const, x: 200, y: 160, x2: 310, y2: 120, className: "stroke-gray-500" },
    { id: "entrance-label", shape: "rect" as const, x: 165, y: 286, w: 70, h: 14, className: "fill-transparent stroke-transparent", label: "Entrance" },
    { id: "north", shape: "rect" as const, x: 188, y: 8, w: 24, h: 18, className: "fill-transparent stroke-transparent", label: "N ↑" },
  ],
  markers: [
    { id: "shop", label: "A", x: 140, y: 240 },
    { id: "reception", label: "B", x: 260, y: 240 },
    { id: "pool", label: "C", x: 70, y: 105 },
    { id: "restaurant", label: "D", x: 330, y: 105 },
    { id: "club", label: "E", x: 200, y: 130 },
    { id: "cabins", label: "F", x: 200, y: 55 },
  ],
};

export const listeningMapLabelling02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-map-labelling-02", "Map labelling — Holiday camp", "both", "map_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "map_labelling",
  passages: [],
  visual: CAMP_VISUAL,
  audio: listeningAudio("listening-targeted-map-labelling-02", "Holiday camp map", [
    { speaker: "Host", voice: "en_US-ryan-high", text: "Welcome! You've just come through the entrance at the south end. Follow the path north and you'll pass the shop first, on the west side — it sells everything from milk to postcards." },
    { speaker: "Host", voice: "en_US-ryan-high", text: "Opposite the shop, on the east side, is the reception office. That's where you pick up your key cards and towels." },
    { speaker: "Host", voice: "en_US-ryan-high", text: "Further up, the path splits in two. If you take the left-hand fork, heading west, you'll reach the swimming pool. It opens at seven in the morning." },
    { speaker: "Host", voice: "en_US-ryan-high", text: "The right-hand fork, to the east, takes you to the restaurant. Breakfast is served there from eight to ten." },
    { speaker: "Host", voice: "en_US-ryan-high", text: "Straight ahead between the two forks, just north of where the path splits, is the children's club. It runs activities from nine until four." },
    { speaker: "Host", voice: "en_US-ryan-high", text: "And your cabins are along the north edge of the camp, behind the children's club." },
  ]),
  questions: [
    markerQ("map_labelling", "listening-targeted-map-labelling-02-q01", "shop", "A", "shop", "Marker A is on the west side of the path — the shop selling milk and postcards.", { difficulty: 1, evidence: "shop" }),
    markerQ("map_labelling", "listening-targeted-map-labelling-02-q02", "reception", "B", "reception office", "Marker B is on the east side — the reception office for key cards and towels.", { difficulty: 1, evidence: "reception office" }),
    markerQ("map_labelling", "listening-targeted-map-labelling-02-q03", "pool", "C", "swimming pool", "Marker C is at the end of the west fork — the swimming pool.", { difficulty: 1, evidence: "swimming pool" }),
    markerQ("map_labelling", "listening-targeted-map-labelling-02-q04", "restaurant", "D", "restaurant", "Marker D is at the end of the east fork — the restaurant.", { difficulty: 1, evidence: "restaurant" }),
    markerQ("map_labelling", "listening-targeted-map-labelling-02-q05", "club", "E", "children's club", "Marker E is north of the path split — the children's club.", { difficulty: 1, evidence: "children's club" }),
    markerQ("map_labelling", "listening-targeted-map-labelling-02-q06", "cabins", "F", "cabins", "Marker F is along the north edge — the cabins.", { difficulty: 1, evidence: "cabins" }),
  ],
};
