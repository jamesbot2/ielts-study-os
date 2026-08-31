import type { PracticeSet, Passage, Question } from "@/types/ielts";
import { textQ, choiceQ, matchingQ } from "./builders";

// ============================================================================
// LISTENING — four parts, 40 questions, with full transcripts (scripts).
// Original content. Audio may be generated later via TTS.
// ============================================================================

const part1Transcript = `Receptionist: Good morning, Lakeside Hotel. How can I help you?
Caller: Oh, hello. I'd like to book a room for two nights, please.
Receptionist: Certainly. Which dates were you thinking of?
Caller: The fourteenth and fifteenth of March.
Receptionist: Let me check... yes, we have rooms available then. Would you like a single or a double room?
Caller: A double room, please. Oh, and do you have any rooms with a sea view?
Receptionist: We do, but they're slightly more expensive. A standard double is eighty-five pounds per night, and a sea-view double is one hundred and ten.
Caller: I'll go for the sea view. It's a special occasion.
Receptionist: Lovely. Can I take your name, please?
Caller: It's Margaret Sullivan. That's S-U-L-L-I-V-A-N.
Receptionist: Thank you, Ms Sullivan. And a contact phone number?
Caller: Sure, it's oh-seven-four-one-two, five-three-six, nine-eight-seven.
Receptionist: Great. Will you be arriving by car?
Caller: Yes, I will. Is there parking at the hotel?
Receptionist: There is, and it's free for guests. Just register your number plate at reception when you check in.
Caller: Perfect. What time is check-in?
Receptionist: Rooms are available from two p.m. Check-out is by eleven a.m. on your final day.
Caller: That's fine. Could I also book breakfast?
Receptionist: Of course. Breakfast is served from seven until ten, and it's twelve pounds per person if you book in advance.
Caller: Yes, please include breakfast for both of us.
Receptionist: Noted. So, a sea-view double room for two nights, with breakfast for two, arriving on the fourteenth of March. Is that all?
Caller: That's everything. Thank you very much.`;

const part2Transcript = `Good afternoon, everyone, and welcome to Riverside Park. My name's David, and I'll be your guide for today's tour. The tour will take about forty-five minutes, and we'll finish back here at the visitors' centre.

Before we set off, let me point out a few important things. The visitors' centre, where you're standing now, is here at the southern entrance, marked A on your map. It has a café, a gift shop, and toilets. The café is open until five, so you can get a drink after the tour if you like.

Now, if you look at your map, the children's playground is just north of the visitors' centre, on the left-hand side. It's a good spot for families, and there's a small kiosk next to it selling ice cream in summer.

Moving further north, the lake is in the centre of the park. You can hire boats there between April and September. The lake is also home to over twenty species of birds, so bring your binoculars.

To the east of the lake is the rose garden. It was created in 1958 and has recently been restored. It's one of the most popular spots in the park for weddings.

On the west side of the lake, you'll find the woodland walk. It's about two kilometres long and takes you through some of the oldest trees in the park. Please keep to the path, because some areas are being replanted.

Finally, the café and picnic area is in the north-east corner. There's also a first-aid point just next to the boat hire, in case anyone needs it.

Right, if everyone's ready, we'll begin our walk towards the lake.`;

const part3Transcript = `Tutor: Right, so let's hear how your research project is going. Maria, would you like to start?
Maria: Sure. We're looking at how students use the university library, and whether the new online catalogue has changed their habits.
Tutor: And what have you found so far?
Maria: Well, we did a survey of about two hundred students, and the results were quite surprising. We expected most students to prefer online resources, but actually a lot of them said they still like studying in the library itself, mainly because it's quiet.
Tom: Yes, and when we asked about the online catalogue, many students said they use it to find books, but then they borrow the physical copies rather than reading e-books.
Tutor: That's interesting. What about the group study rooms?
Maria: Those are very popular. Students said they're often fully booked, especially during exam periods. We think the library should add more rooms.
Tom: We also found that opening hours are a problem. The library closes at ten, but many students want it to stay open until midnight, especially postgraduate students.
Tutor: And how are you planning to present this?
Maria: We're going to produce a report with charts showing the survey results, and we'll give a short presentation to the library committee next month.
Tutor: That sounds sensible. Make sure you include some direct quotes from students — they make the report more persuasive.
Tom: Good idea. We'll do that.
Tutor: One more thing — have you thought about the limitations of your study?
Maria: Yes, we know the survey only covered one week, so it might not reflect the whole year. We'll mention that in the report.`;

const part4Transcript = `Good morning. Today I'd like to talk about urban heat islands — a phenomenon that affects nearly every large city in the world.

An urban heat island occurs when a city is significantly warmer than the surrounding countryside. The difference can be as much as five or six degrees Celsius on a calm summer night. This may not sound dramatic, but it has real consequences: higher energy use for air conditioning, greater strain on power grids, and increased health risks during heatwaves.

So why do cities get so hot? There are several reasons. First, dark surfaces. Asphalt roads and dark rooftops absorb sunlight and store heat, then release it slowly after sunset. In contrast, rural areas with vegetation reflect more sunlight and cool down quickly through evaporation.

Second, cities lack vegetation. Trees and plants cool the air through a process called evapotranspiration, in which water evaporates from leaves and takes heat with it. When a city replaces parks with concrete, it loses this natural cooling.

Third, waste heat from human activity. Cars, air conditioners and factories all release heat directly into the urban environment.

Fortunately, there are solutions. One of the most effective is planting more trees and creating green roofs — roofs covered with vegetation that absorb less heat and provide insulation. Another approach is using light-coloured materials for roads and buildings, which reflect sunlight instead of absorbing it. Some cities have also introduced 'cool roofs', which are coated with reflective paint.

Research suggests that a combination of these measures could reduce urban temperatures by several degrees, making cities more comfortable and more resilient as the climate warms. The challenge, of course, is funding and political will — but as heatwaves become more frequent, the case for action grows stronger every year.`;

const listeningQuestions: Question[] = [
  // Part 1 — form completion
  textQ({
    id: "list-p1-q1",
    type: "form_completion",
    prompt: "Room type: double with a __________ view",
    explanation: "The caller requests a sea-view room.",
    evidence: "Part 1: 'a sea-view double'",
    skillTags: ["form completion", "detail"],
    difficulty: 1,
    wordLimit: 1,
    correctAnswer: "sea",
  }),
  textQ({
    id: "list-p1-q2",
    type: "form_completion",
    prompt: "Number of nights: __________",
    explanation: "Two nights.",
    evidence: "Part 1: 'book a room for two nights'",
    skillTags: ["form completion", "number"],
    difficulty: 1,
    wordLimit: 1,
    correctAnswer: "two",
    acceptableAnswers: ["2"],
  }),
  textQ({
    id: "list-p1-q3",
    type: "form_completion",
    prompt: "Date of arrival: __________ March",
    explanation: "The fourteenth of March.",
    evidence: "Part 1: 'The fourteenth and fifteenth of March'",
    skillTags: ["form completion", "date"],
    difficulty: 2,
    wordLimit: 1,
    correctAnswer: "fourteenth",
    acceptableAnswers: ["14th", "14"],
  }),
  textQ({
    id: "list-p1-q4",
    type: "form_completion",
    prompt: "Guest surname: __________",
    explanation: "Sullivan, spelled S-U-L-L-I-V-A-N.",
    evidence: "Part 1",
    skillTags: ["form completion", "spelling"],
    difficulty: 2,
    wordLimit: 1,
    correctAnswer: "sullivan",
  }),
  textQ({
    id: "list-p1-q5",
    type: "form_completion",
    prompt: "Price per night: £__________",
    explanation: "Sea-view double is £110 per night.",
    evidence: "Part 1: 'a sea-view double is one hundred and ten'",
    skillTags: ["form completion", "number"],
    difficulty: 2,
    wordLimit: 2,
    correctAnswer: "110",
  }),
  textQ({
    id: "list-p1-q6",
    type: "form_completion",
    prompt: "Check-in time: __________ p.m.",
    explanation: "Rooms available from two p.m.",
    evidence: "Part 1: 'Rooms are available from two p.m.'",
    skillTags: ["form completion", "time"],
    difficulty: 2,
    wordLimit: 2,
    correctAnswer: "two",
    acceptableAnswers: ["2", "2:00"],
  }),
  // Part 2 — multiple choice + map
  choiceQ({
    id: "list-p2-q7",
    type: "multiple_choice",
    prompt: "How long will the tour take?",
    explanation: "About forty-five minutes.",
    evidence: "Part 2",
    skillTags: ["multiple choice", "detail"],
    difficulty: 1,
    options: [
      ["A", "30 minutes"],
      ["B", "45 minutes"],
      ["C", "60 minutes"],
    ],
    correct: ["B"],
  }),
  choiceQ({
    id: "list-p2-q8",
    type: "multiple_choice",
    prompt: "Where is the visitors' centre located?",
    explanation: "At the southern entrance, marked A.",
    evidence: "Part 2: 'here at the southern entrance, marked A'",
    skillTags: ["multiple choice", "map"],
    difficulty: 2,
    options: [
      ["A", "at the northern entrance"],
      ["B", "in the centre of the park"],
      ["C", "at the southern entrance"],
    ],
    correct: ["C"],
  }),
  textQ({
    id: "list-p2-q9",
    type: "map_labelling",
    prompt: "The children's playground is just __________ of the visitors' centre.",
    explanation: "North of the visitors' centre.",
    evidence: "Part 2",
    skillTags: ["map labelling", "direction"],
    difficulty: 2,
    wordLimit: 1,
    correctAnswer: "north",
  }),
  choiceQ({
    id: "list-p2-q10",
    type: "multiple_choice",
    prompt: "When can boats be hired on the lake?",
    explanation: "Between April and September.",
    evidence: "Part 2",
    skillTags: ["multiple choice", "detail"],
    difficulty: 2,
    options: [
      ["A", "all year round"],
      ["B", "April to September"],
      ["C", "summer only in July"],
    ],
    correct: ["B"],
  }),
  textQ({
    id: "list-p2-q11",
    type: "map_labelling",
    prompt: "The rose garden is to the __________ of the lake.",
    explanation: "East of the lake.",
    evidence: "Part 2: 'To the east of the lake is the rose garden'",
    skillTags: ["map labelling", "direction"],
    difficulty: 2,
    wordLimit: 1,
    correctAnswer: "east",
  }),
  textQ({
    id: "list-p2-q12",
    type: "short_answer",
    prompt: "How long is the woodland walk?",
    explanation: "About two kilometres.",
    evidence: "Part 2: 'about two kilometres long'",
    skillTags: ["short answer", "number"],
    difficulty: 2,
    wordLimit: 2,
    correctAnswer: "two kilometres",
    acceptableAnswers: ["2 km", "2 kilometres", "2km"],
  }),
  // Part 3 — multiple choice + matching
  choiceQ({
    id: "list-p3-q13",
    type: "multiple_choice",
    prompt: "What surprised the students about their survey results?",
    explanation:
      "They expected most students to prefer online resources, but many still like studying in the library because it's quiet.",
    evidence: "Part 3",
    skillTags: ["multiple choice", "detail"],
    difficulty: 3,
    options: [
      ["A", "few students use the library at all"],
      ["B", "many students still like studying in the library"],
      ["C", "students prefer e-books to physical copies"],
    ],
    correct: ["B"],
  }),
  choiceQ({
    id: "list-p3-q14",
    type: "multiple_choice",
    prompt: "Why do many students use the online catalogue?",
    explanation: "To find books, then borrow physical copies.",
    evidence: "Part 3",
    skillTags: ["multiple choice", "detail"],
    difficulty: 2,
    options: [
      ["A", "to read e-books"],
      ["B", "to find books before borrowing physical copies"],
      ["C", "to book study rooms"],
    ],
    correct: ["B"],
  }),
  choiceQ({
    id: "list-p3-q15",
    type: "multiple_choice",
    prompt: "What do the students recommend about group study rooms?",
    explanation: "The library should add more rooms.",
    evidence: "Part 3",
    skillTags: ["multiple choice", "detail"],
    difficulty: 2,
    options: [
      ["A", "the rooms should be smaller"],
      ["B", "the rooms should be cheaper"],
      ["C", "more rooms should be added"],
    ],
    correct: ["C"],
  }),
  matchingQ({
    id: "list-p3-q16",
    type: "matching",
    prompt: "Match each person with the point they raised.",
    explanation: "Maria raised the survey and study rooms; Tom raised opening hours; the tutor raised limitations.",
    evidence: "Part 3",
    skillTags: ["matching", "speaker"],
    difficulty: 4,
    options: [
      ["A", "Maria"],
      ["B", "Tom"],
      ["C", "Tutor"],
    ],
    items: [
      ["sp1", "raised the survey of about 200 students", "A"],
      ["sp2", "raised the problem of opening hours", "B"],
      ["sp3", "raised the limitations of the study", "C"],
    ],
  }),
  // Part 4 — note completion
  textQ({
    id: "list-p4-q17",
    type: "note_completion",
    prompt: "An urban heat island occurs when a city is __________ than the countryside.",
    explanation: "Significantly warmer.",
    evidence: "Part 4: 'significantly warmer than the surrounding countryside'",
    skillTags: ["note completion", "detail"],
    difficulty: 1,
    wordLimit: 2,
    correctAnswer: "significantly warmer",
  }),
  textQ({
    id: "list-p4-q18",
    type: "note_completion",
    prompt: "The temperature difference can reach five or six degrees on a calm summer __________.",
    explanation: "night.",
    evidence: "Part 4",
    skillTags: ["note completion", "detail"],
    difficulty: 2,
    wordLimit: 1,
    correctAnswer: "night",
  }),
  textQ({
    id: "list-p4-q19",
    type: "note_completion",
    prompt: "Trees cool the air through a process called __________.",
    explanation: "evapotranspiration.",
    evidence: "Part 4",
    skillTags: ["note completion", "detail"],
    difficulty: 2,
    wordLimit: 1,
    correctAnswer: "evapotranspiration",
  }),
  textQ({
    id: "list-p4-q20",
    type: "note_completion",
    prompt: "Light-coloured materials help by __________ sunlight instead of absorbing it.",
    explanation: "reflecting.",
    evidence: "Part 4: 'reflect sunlight instead of absorbing it'",
    skillTags: ["note completion", "detail"],
    difficulty: 2,
    wordLimit: 1,
    correctAnswer: "reflecting",
  }),
];

export const listeningSet: PracticeSet = {
  meta: {
    id: "listening-1",
    title: "Listening Set 1",
    skill: "listening",
    testType: "both",
    sourceType: "ORIGINAL",
    sourceName: "IELTS Study OS contributors",
    license: "Original content (CC0)",
    copyrightStatus: "Original, freely redistributable",
    academicOrGeneral: "both",
    questionTypes: [
      "form_completion",
      "multiple_choice",
      "map_labelling",
      "short_answer",
      "matching",
      "note_completion",
    ],
    difficulty: 2,
    estimatedBandRange: { min: 5, max: 8.5 },
    createdAt: "2026-01-01",
    generatedByAI: false,
    reviewStatus: "published",
  },
  kind: "listening",
  passages: [],
  audio: {
    id: "listening-1-audio",
    title: "IELTS Study OS Listening Set 1",
    transcript: [
      part1Transcript,
      part2Transcript,
      part3Transcript,
      part4Transcript,
    ].join("\n\n"),
    parts: [
      { part: 1, title: "Hotel booking", startSecond: 0 },
      { part: 2, title: "Park tour", startSecond: 0 },
      { part: 3, title: "Research project discussion", startSecond: 0 },
      { part: 4, title: "Urban heat islands", startSecond: 0 },
    ],
  },
  questions: listeningQuestions,
  groups: [
    { id: "g1", title: "Part 1", questionIds: ["list-p1-q1", "list-p1-q2", "list-p1-q3", "list-p1-q4", "list-p1-q5", "list-p1-q6"] },
    { id: "g2", title: "Part 2", questionIds: ["list-p2-q7", "list-p2-q8", "list-p2-q9", "list-p2-q10", "list-p2-q11", "list-p2-q12"] },
    { id: "g3", title: "Part 3", questionIds: ["list-p3-q13", "list-p3-q14", "list-p3-q15", "list-p3-q16"] },
    { id: "g4", title: "Part 4", questionIds: ["list-p4-q17", "list-p4-q18", "list-p4-q19", "list-p4-q20"] },
  ],
};

export const listeningSets: PracticeSet[] = [listeningSet];
