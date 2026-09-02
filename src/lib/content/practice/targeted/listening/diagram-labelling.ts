// Original targeted Listening drills — Diagram Labelling.
// The visual shows blank outlined parts only; the AUDIO provides every answer.

import type { PracticeSet } from "@/types/ielts";
import { listeningTargetedMeta, listeningAudio, markerQ } from "./helpers";

const FILTER_VISUAL = {
  kind: "diagram" as const,
  width: 220,
  height: 320,
  shapes: [
    { id: "lid", shape: "rect" as const, x: 70, y: 20, w: 80, h: 22, className: "fill-white stroke-gray-500" },
    { id: "spout", shape: "polygon" as const, points: "150,22 178,22 150,42", className: "fill-white stroke-gray-500" },
    { id: "funnel", shape: "polygon" as const, points: "70,48 150,48 128,118 92,118", className: "fill-white stroke-gray-500" },
    { id: "cartridge", shape: "rect" as const, x: 92, y: 70, w: 36, h: 44, className: "fill-gray-100 stroke-gray-500" },
    { id: "chamber", shape: "rect" as const, x: 60, y: 126, w: 100, h: 120, className: "fill-blue-50 stroke-gray-500" },
    { id: "handle", shape: "polygon" as const, points: "160,150 190,150 190,260 160,260", className: "fill-white stroke-gray-500" },
  ],
  markers: [
    { id: "lid", label: "A", x: 70, y: 14 },
    { id: "spout", label: "B", x: 182, y: 26 },
    { id: "funnel", label: "C", x: 60, y: 70 },
    { id: "cartridge", label: "D", x: 84, y: 96 },
    { id: "chamber", label: "E", x: 52, y: 190 },
    { id: "handle", label: "F", x: 196, y: 205 },
  ],
};

export const listeningDiagramLabelling01: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-diagram-labelling-01", "Diagram labelling — Water filter jug", "both", "diagram_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "diagram_labelling",
  passages: [],
  visual: FILTER_VISUAL,
  audio: listeningAudio("listening-targeted-diagram-labelling-01", "Water filter jug", [
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "Today we're looking at how a water filter jug works. Let's go through its parts from the top down." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "At the very top is the lid, which has a small spout so you can pour without removing it." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "Under the lid is the upper funnel. That's where you pour the tap water in — it holds about one litre at a time." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "Inside the funnel sits the cartridge. This is the part that actually removes impurities, and it should be replaced every four weeks." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "The filtered water then collects in the chamber below the funnel. The clear section lets you see how much you have left." },
    { speaker: "Presenter", voice: "en_US-lessac-medium", text: "And finally, attached to the side of the jug is the handle, which is wide enough to grip even when the jug is full." },
  ]),
  questions: [
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q01", "lid", "A", "lid", "Marker A is at the very top — the lid.", { difficulty: 1, evidence: "lid" }),
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q02", "spout", "B", "spout", "Marker B is the small spout on the lid, used for pouring without removing it.", { difficulty: 2, evidence: "small spout" }),
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q03", "funnel", "C", "funnel", "Marker C is under the lid — the upper funnel where tap water is poured in.", { difficulty: 1, evidence: "upper funnel" }),
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q04", "cartridge", "D", "cartridge", "Marker D sits inside the funnel — the cartridge that removes impurities.", { difficulty: 2, evidence: "cartridge" }),
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q05", "chamber", "E", "chamber", "Marker E is below the funnel — the chamber holding the filtered water.", { difficulty: 1, evidence: "chamber" }),
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-01-q06", "handle", "F", "handle", "Marker F is attached to the side — the handle.", { difficulty: 1, evidence: "handle" }),
  ],
};

const BICYCLE_VISUAL = {
  kind: "diagram" as const,
  width: 320,
  height: 200,
  shapes: [
    { id: "front-wheel", shape: "circle" as const, cx: 70, cy: 140, r: 42, className: "fill-white stroke-gray-500" },
    { id: "rear-wheel", shape: "circle" as const, cx: 250, cy: 140, r: 42, className: "fill-white stroke-gray-500" },
    { id: "frame", shape: "line" as const, x: 70, y: 140, x2: 160, y2: 70, className: "stroke-gray-500" },
    { id: "frame2", shape: "line" as const, x: 160, y: 70, x2: 250, y2: 140, className: "stroke-gray-500" },
    { id: "frame3", shape: "line" as const, x: 70, y: 140, x2: 160, y2: 140, className: "stroke-gray-500" },
    { id: "saddle-post", shape: "line" as const, x: 160, y: 70, x2: 170, y2: 40, className: "stroke-gray-500" },
    { id: "handle-post", shape: "line" as const, x: 70, y: 140, x2: 80, y2: 60, className: "stroke-gray-500" },
    { id: "gears", shape: "circle" as const, cx: 250, cy: 140, r: 10, className: "fill-gray-100 stroke-gray-500" },
    { id: "chain-ring", shape: "circle" as const, cx: 160, cy: 140, r: 16, className: "fill-gray-100 stroke-gray-500" },
    { id: "chain", shape: "line" as const, x: 176, y: 140, x2: 240, y2: 140, className: "stroke-gray-600" },
  ],
  markers: [
    { id: "handlebars", label: "A", x: 88, y: 48 },
    { id: "front-wheel", label: "B", x: 70, y: 190 },
    { id: "saddle", label: "C", x: 178, y: 26 },
    { id: "rear-wheel", label: "D", x: 250, y: 190 },
    { id: "pedals", label: "E", x: 150, y: 165 },
    { id: "chain", label: "F", x: 210, y: 152 },
  ],
};

export const listeningDiagramLabelling02: PracticeSet = {
  meta: listeningTargetedMeta("listening-targeted-diagram-labelling-02", "Diagram labelling — Bicycle parts", "both", "diagram_labelling", 2),
  kind: "listening",
  practiceMode: "targeted",
  targetQuestionType: "diagram_labelling",
  passages: [],
  visual: BICYCLE_VISUAL,
  audio: listeningAudio("listening-targeted-diagram-labelling-02", "Bicycle parts", [
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "Let's run through the main parts of the bike before your first ride. Starting at the front: those are the handlebars, which you use for steering." },
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "Below the handlebars is the front wheel. Make sure the tyre is firm before every ride — squeeze it with your thumb." },
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "In the middle of the frame is the saddle. That's the seat, and we'll adjust its height before we set off." },
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "Behind the saddle is the rear wheel. The brake lever on the right handlebar controls it." },
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "Now the pedals, down between the two wheels. Pushing them turns the chain, which runs around the gears at the back." },
    { speaker: "Instructor", voice: "en_US-ryan-high", text: "If the chain ever comes off, stop pedalling immediately and let me know." },
  ]),
  questions: [
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q01", "handlebars", "A", "handlebars", "Marker A is at the front — the handlebars used for steering.", { difficulty: 1, evidence: "handlebars" }),
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q02", "front-wheel", "B", "front wheel", "Marker B is below the handlebars — the front wheel.", { difficulty: 1, evidence: "front wheel" }),
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q03", "saddle", "C", "saddle", "Marker C is in the middle of the frame — the saddle, the seat.", { difficulty: 1, evidence: "saddle" }),
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q04", "rear-wheel", "D", "rear wheel", "Marker D is behind the saddle — the rear wheel.", { difficulty: 1, evidence: "rear wheel" }),
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q05", "pedals", "E", "pedals", "Marker E sits between the wheels — the pedals that turn the chain.", { difficulty: 2, evidence: "pedals" }),
    markerQ("diagram_labelling", "listening-targeted-diagram-labelling-02-q06", "chain", "F", "chain", "Marker F runs around the gears at the back — the chain.", { difficulty: 2, evidence: "chain" }),
  ],
};
