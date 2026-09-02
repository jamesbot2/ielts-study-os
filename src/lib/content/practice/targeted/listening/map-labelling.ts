// Original targeted Listening drills — Map Labelling.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, textQ } from "./helpers";

const TOWN_MAP =
  "MAP: Town centre. The station is at the BOTTOM (south). A main road runs NORTH from the station to the clock tower. The post office is on the LEFT (west) side of the road, opposite the bank. The bank is on the RIGHT (east) side. Past the bank, at the corner, the road turns right; the museum is around that corner. The pharmacy is next to the post office, on its north side. The park is north of the clock tower.";

export const listeningMapLabelling01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-map-labelling-01", "Map labelling — Town centre", "both", "map_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "map_labelling",
  passages: [],
  audio: listeningAudio("listening-targeted-map-labelling-01", "Town centre directions", [
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "Right, you've just come out of the station. The main road runs straight ahead, north, all the way to the clock tower in the middle of the town." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "As you walk up, the post office is on your left, on the west side of the road. It's directly opposite the bank." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "The bank is on the right-hand side, so on the east. If you need cash, that's where the only machine in town is." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "Keep walking past the bank and the road bends to the right at the corner. The museum is just around that corner, on your right." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "Back near the post office, the pharmacy is right next door to it, on the north side. You can't get prescriptions anywhere else on a Sunday." },
    { speaker: "Guide", voice: "en_US-lessac-medium", text: "And if you go all the way to the clock tower, the park is just beyond it, to the north. It's a good place to sit for ten minutes." },
  ]),
  questions: [
    textQ("map_labelling", "listening-targeted-map-labelling-01-q01", `${TOWN_MAP}\n\nLabel A: the __________ (south, where the walk starts)`, "station", "The walk starts at the station.", { wordLimit: 1, evidence: "out of the station", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-01-q02", `Label B: the __________ office (west side of the road)`, "post", "The post office is on the west side.", { wordLimit: 1, evidence: "post office", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-01-q03", `Label C: the __________ (east side, only cash machine in town)`, "bank", "The bank is on the east side with the only machine.", { wordLimit: 1, evidence: "bank", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-01-q04", `Label D: the __________ (around the right-hand corner past the bank)`, "museum", "The museum is around the corner past the bank.", { wordLimit: 1, evidence: "museum", difficulty: 2 }),
    textQ("map_labelling", "listening-targeted-map-labelling-01-q05", `Label E: the __________ (next to the post office, north side)`, "pharmacy", "The pharmacy is next to the post office on its north side.", { wordLimit: 1, evidence: "pharmacy", difficulty: 2 }),
    textQ("map_labelling", "listening-targeted-map-labelling-01-q06", `Label F: the clock __________ (middle of the town)`, "tower", "The clock tower is in the middle of town.", { wordLimit: 1, evidence: "clock tower", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-01-q07", `Label G: the __________ (north of the clock tower)`, "park", "The park is beyond the clock tower to the north.", { wordLimit: 1, evidence: "park", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-01-q08", `The pharmacy is the only place to get prescriptions on a __________.`, "Sunday", "Prescriptions are available there on a Sunday.", { wordLimit: 1, evidence: "on a Sunday", difficulty: 2 }),
  ],
};

const CAMP_MAP =
  "MAP: Holiday camp. The entrance is at the BOTTOM (south). A path leads NORTH past the shop (west side) and the reception office (east side). Further north the path splits: LEFT (west) leads to the swimming pool, RIGHT (east) leads to the restaurant. Between the pool and the restaurant, directly north of the path split, is the children's club. The cabins are along the camp's north edge.";

export const listeningMapLabelling02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-map-labelling-02", "Map labelling — Holiday camp", "both", "map_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "map_labelling",
  passages: [],
  audio: listeningAudio("listening-targeted-map-labelling-02", "Holiday camp map", [
    { speaker: "Host", voice: "en_US-ryan-high", text: "Welcome! You've just come through the entrance at the south end. Follow the path north and you'll pass the shop first, on the west side — it sells everything from milk to postcards." },
    { speaker: "Host", voice: "en_US-ryan-high", text: "Opposite the shop, on the east side, is the reception office. That's where you pick up your key cards and towels." },
    { speaker: "Host", voice: "en_US-ryan-high", text: "Further up, the path splits in two. If you take the left-hand fork, heading west, you'll reach the swimming pool. It opens at seven in the morning." },
    { speaker: "Host", voice: "en_US-ryan-high", text: "The right-hand fork, to the east, takes you to the restaurant. Breakfast is served there from eight to ten." },
    { speaker: "Host", voice: "en_US-ryan-high", text: "Straight ahead between the two forks, just north of where the path splits, is the children's club. It runs activities from nine until four." },
    { speaker: "Host", voice: "en_US-ryan-high", text: "And your cabins are along the north edge of the camp, behind the children's club." },
  ]),
  questions: [
    textQ("map_labelling", "listening-targeted-map-labelling-02-q01", `${CAMP_MAP}\n\nLabel A: the __________ (south, where guests arrive)`, "entrance", "Guests come through the entrance at the south end.", { wordLimit: 1, evidence: "entrance", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-02-q02", `Label B: the __________ (west side of the path, sells milk and postcards)`, "shop", "The shop is on the west side.", { wordLimit: 1, evidence: "shop", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-02-q03", `Label C: the __________ office (east side, key cards and towels)`, "reception", "Reception is on the east side.", { wordLimit: 1, evidence: "reception office", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-02-q04", `Label D: the swimming __________ (west fork, opens at seven)`, "pool", "The pool is at the end of the west fork.", { wordLimit: 1, evidence: "swimming pool", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-02-q05", `Label E: the __________ (east fork, breakfast eight to ten)`, "restaurant", "The restaurant is at the end of the east fork.", { wordLimit: 1, evidence: "restaurant", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-02-q06", `Label F: the children's __________ (north of the path split)`, "club", "The children's club is north of the split.", { wordLimit: 1, evidence: "children's club", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-02-q07", `Label G: the __________ (along the north edge)`, "cabins", "The cabins are along the north edge.", { wordLimit: 1, evidence: "cabins", difficulty: 1 }),
    textQ("map_labelling", "listening-targeted-map-labelling-02-q08", `The children's club runs activities until __________ o'clock.`, "4", "Activities run from nine until four.", { wordLimit: 1, evidence: "nine until four", acceptableAnswers: ["four", "4"], difficulty: 2 }),
  ],
};
