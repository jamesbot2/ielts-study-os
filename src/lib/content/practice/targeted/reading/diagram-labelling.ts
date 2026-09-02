// Original targeted Reading drills — Diagram Labelling.

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, textQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-diagram-labelling-01-p01",
  "Parts of a traditional windmill",
  [
    "A traditional windmill converts the energy of the wind into the turning motion that drives the millstones. The most visible part is the sails, four wooden frames covered with cloth, which catch the wind and rotate slowly. The sails are fixed to a long horizontal shaft called the windshaft, which passes through the upper part of the mill.",
    "Inside the mill, a large wooden wheel known as the brake wheel is mounted on the windshaft. Its teeth engage with a smaller vertical wheel called the wallower, transferring the turning motion downwards through the main shaft, which runs through the centre of the building from top to bottom.",
    "At the base of the main shaft is the great spur wheel, which drives the smaller stone nuts connected to the millstones. The upper millstone, called the runner stone, turns above a fixed lower stone; grain is fed between them and ground into flour. The flour falls into a chute and is collected in sacks on the ground floor.",
    "The whole building can be turned to face the wind by means of the tail pole, a long beam that extends from the rear of the mill to the ground, where it rests on a wheel. The cap of the mill, which carries the sails and windshaft, rotates on rollers so that the sails always face into the wind.",
  ].join("\n\n"),
);

export const diagramLabellingSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-diagram-labelling-01", "Diagram labelling — Parts of a windmill", "academic", "diagram_labelling", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "diagram_labelling",
  passages: [p1],
  questions: [
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-01-q01", "Label 1: the four wooden frames that catch the wind are the __________.", "sails", "The sails are four wooden frames covered with cloth that catch the wind.", "reading-targeted-diagram-labelling-01-p01", { wordLimit: 1, evidence: "the sails, four wooden frames", difficulty: 1 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-01-q02", "Label 2: the horizontal shaft carrying the sails is the __________.", "windshaft", "The sails are fixed to a long horizontal shaft called the windshaft.", "reading-targeted-diagram-labelling-01-p01", { wordLimit: 1, evidence: "windshaft", difficulty: 2 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-01-q03", "Label 3: the large wooden wheel on the windshaft is the __________ wheel.", "brake", "A large wooden wheel known as the brake wheel is mounted on the windshaft.", "reading-targeted-diagram-labelling-01-p01", { wordLimit: 1, evidence: "brake wheel", difficulty: 2 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-01-q04", "Label 4: the smaller vertical wheel is the __________.", "wallower", "The smaller vertical wheel is called the wallower.", "reading-targeted-diagram-labelling-01-p01", { wordLimit: 1, evidence: "wallower", difficulty: 2 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-01-q05", "Label 5: the shaft running through the centre of the building is the __________ shaft.", "main", "The main shaft runs through the centre of the building.", "reading-targeted-diagram-labelling-01-p01", { wordLimit: 1, evidence: "main shaft", difficulty: 2 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-01-q06", "Label 6: the wheel at the base of the main shaft is the great __________ wheel.", "spur", "At the base is the great spur wheel.", "reading-targeted-diagram-labelling-01-p01", { wordLimit: 1, evidence: "spur wheel", difficulty: 2 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-01-q07", "Label 7: the upper millstone that turns is the __________ stone.", "runner", "The upper millstone is called the runner stone.", "reading-targeted-diagram-labelling-01-p01", { wordLimit: 1, evidence: "runner stone", difficulty: 2 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-01-q08", "Label 8: the long beam used to turn the mill is the tail __________.", "pole", "The tail pole is a long beam extending from the rear of the mill.", "reading-targeted-diagram-labelling-01-p01", { wordLimit: 1, evidence: "tail pole", difficulty: 2 }),
  ],
};

const p2 = originalPassage(
  "reading-targeted-diagram-labelling-02-p01",
  "The layers of a green roof",
  [
    "A green roof is a living layer of plants grown on top of a building, and its success depends on the layers beneath the plants being installed in the right order.",
    "The lowest layer is the waterproof membrane, which protects the building itself from moisture. It must cover the entire roof surface, including the edges, before anything else is added.",
    "Above the membrane lies a root barrier, a tough sheet that stops plant roots from piercing the membrane below. On top of this is the drainage layer, a lightweight board or mat that allows excess water to flow towards the roof outlets while retaining a little moisture.",
    "The drainage layer is covered with a filter fabric, which prevents fine soil particles from being washed into the drains. Finally comes the growing medium, a lightweight soil substitute typically five to fifteen centimetres deep, into which the plants are set.",
    "Around the edges of the roof, a strip of gravel forms a maintenance border. This keeps plants away from the outlets and gives workers a safe place to walk during inspections, which should be carried out at least twice a year.",
  ].join("\n\n"),
);

export const diagramLabellingSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-diagram-labelling-02", "Diagram labelling — Layers of a green roof", "general", "diagram_labelling", 2),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "diagram_labelling",
  passages: [p2],
  questions: [
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-02-q01", "Layer 1 (bottom): the waterproof __________.", "membrane", "The lowest layer is the waterproof membrane.", "reading-targeted-diagram-labelling-02-p01", { wordLimit: 1, evidence: "waterproof membrane", difficulty: 1 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-02-q02", "Layer 2: the root __________.", "barrier", "Above the membrane lies a root barrier.", "reading-targeted-diagram-labelling-02-p01", { wordLimit: 1, evidence: "root barrier", difficulty: 1 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-02-q03", "Layer 3: the __________ layer allows excess water to flow away.", "drainage", "The drainage layer allows excess water to flow towards the outlets.", "reading-targeted-diagram-labelling-02-p01", { wordLimit: 1, evidence: "drainage layer", difficulty: 1 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-02-q04", "Layer 4: the filter __________ prevents soil washing into drains.", "fabric", "The filter fabric prevents fine soil particles from being washed away.", "reading-targeted-diagram-labelling-02-p01", { wordLimit: 1, evidence: "filter fabric", difficulty: 2 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-02-q05", "Layer 5 (top): the growing __________.", "medium", "Finally comes the growing medium, a lightweight soil substitute.", "reading-targeted-diagram-labelling-02-p01", { wordLimit: 1, evidence: "growing medium", difficulty: 1 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-02-q06", "Growing medium depth: five to fifteen __________.", "centimetres", "The medium is typically five to fifteen centimetres deep.", "reading-targeted-diagram-labelling-02-p01", { wordLimit: 1, evidence: "centimetres", difficulty: 2 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-02-q07", "Around the edges: a strip of __________.", "gravel", "A strip of gravel forms a maintenance border.", "reading-targeted-diagram-labelling-02-p01", { wordLimit: 1, evidence: "gravel", difficulty: 1 }),
    textQuestion("diagram_labelling", "reading-targeted-diagram-labelling-02-q08", "Inspections should be carried out at least __________ a year.", "twice", "Inspections should be carried out at least twice a year.", "reading-targeted-diagram-labelling-02-p01", { wordLimit: 1, evidence: "twice a year", difficulty: 2 }),
  ],
};
