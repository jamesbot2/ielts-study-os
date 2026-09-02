import type { PracticeSet, Question } from "@/types/ielts";
import { textQ, choiceQ, matchingQ } from "./builders";

// ============================================================================
// LISTENING — complete original test: 4 sections, 40 questions.
// Speaker-marked scripts support real TTS audio generation.
// ============================================================================

const part1Script = [
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Good morning, Lakeside Hotel. How can I help you?" },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "Oh, hello. I'd like to book a room for three nights, please." },
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Certainly. Which dates were you thinking of?" },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "The fourteenth, fifteenth and sixteenth of March." },
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Let me check. Yes, we have rooms available then. Would you like a single or a double room?" },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "A double room, please. And do you have any rooms with a sea view?" },
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "We do, but they're slightly more expensive. A standard double is eighty-five pounds per night, and a sea-view double is one hundred and ten." },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "I'll go for the sea view. It's a special occasion." },
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Lovely. Can I take your name, please?" },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "It's Margaret Sullivan. That's S-U-L-L-I-V-A-N." },
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Thank you, Ms Sullivan. And a contact phone number?" },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "Sure, it's oh-seven-four-one-two, five-three-six, nine-eight-seven." },
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Great. Will you be arriving by car?" },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "Yes, I will. Is there parking at the hotel?" },
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "There is, and it's free for guests. Just register your number plate at reception when you check in." },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "Perfect. What time is check-in?" },
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Rooms are available from two p.m. Check-out is by eleven a.m. on your final day." },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "That's fine. Could I also book breakfast?" },
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Of course. Breakfast is served from seven until ten, and it's twelve pounds per person if you book in advance." },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "Yes, please include breakfast for both of us." },
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Noted. So, a sea-view double room for three nights, with breakfast for two, arriving on the fourteenth of March. Is that all?" },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "One more thing — do you have Wi-Fi in the rooms?" },
  { speaker: "Receptionist", voice: "en_US-lessac-medium", text: "Yes, Wi-Fi is free throughout the hotel. The password is 'lakeside'." },
  { speaker: "Caller", voice: "en_GB-northern_english_male-medium", text: "Excellent. That's everything. Thank you very much." },
];

const part2Script = [
  { speaker: "Guide", voice: "en_US-ryan-high", text: "Good afternoon, everyone, and welcome to the City Museum. My name's David, and I'll be your guide today. The tour will take about an hour, and we'll finish back here at the main entrance." },
  { speaker: "Guide", voice: "en_US-ryan-high", text: "Before we set off, let me point out a few important things. The main entrance, where you're standing now, is here at the bottom of your map, marked A. The information desk is just inside, on your right, and that's where you can collect audio guides for five pounds." },
  { speaker: "Guide", voice: "en_US-ryan-high", text: "Now, if you look at your map, the café is directly to the left of the entrance. It's a good spot to rest, and it closes at four thirty." },
  { speaker: "Guide", voice: "en_US-ryan-high", text: "Moving further inside, the main exhibition hall is in the centre of the museum. It currently houses a special exhibition on ancient Egypt, which has been extended until the end of August because it's so popular." },
  { speaker: "Guide", voice: "en_US-ryan-high", text: "To the east of the exhibition hall is the natural history gallery. It was recently refurbished, and it's one of the most popular sections with children, mainly because of the dinosaur skeletons." },
  { speaker: "Guide", voice: "en_US-ryan-high", text: "On the west side of the hall, you'll find the art gallery. Please note that photography is not allowed in this part of the museum." },
  { speaker: "Guide", voice: "en_US-ryan-high", text: "Finally, the gift shop and toilets are in the north-east corner, next to the exit. The gift shop offers a ten percent discount to members." },
  { speaker: "Guide", voice: "en_US-ryan-high", text: "Right, if everyone's ready, we'll begin our walk towards the exhibition hall." },
];

const part3Script = [
  { speaker: "Tutor", voice: "en_US-lessac-medium", text: "Right, so let's hear how your research project is going. Maria, would you like to start?" },
  { speaker: "Maria", voice: "en_US-lessac-medium", text: "Sure. We're looking at how students use the university library, and whether the new online catalogue has changed their habits." },
  { speaker: "Tutor", voice: "en_US-lessac-medium", text: "And what have you found so far?" },
  { speaker: "Maria", voice: "en_US-lessac-medium", text: "Well, we did a survey of about two hundred students, and the results were quite surprising. We expected most students to prefer online resources, but actually a lot of them said they still like studying in the library itself, mainly because it's quiet." },
  { speaker: "Tom", voice: "en_GB-northern_english_male-medium", text: "Yes, and when we asked about the online catalogue, many students said they use it to find books, but then they borrow the physical copies rather than reading e-books." },
  { speaker: "Tutor", voice: "en_US-lessac-medium", text: "That's interesting. What about the group study rooms?" },
  { speaker: "Maria", voice: "en_US-lessac-medium", text: "Those are very popular. Students said they're often fully booked, especially during exam periods. We think the library should add more rooms." },
  { speaker: "Tom", voice: "en_GB-northern_english_male-medium", text: "We also found that opening hours are a problem. The library closes at ten, but many students want it to stay open until midnight, especially postgraduate students." },
  { speaker: "Tutor", voice: "en_US-lessac-medium", text: "And how are you planning to present this?" },
  { speaker: "Maria", voice: "en_US-lessac-medium", text: "We're going to produce a report with charts showing the survey results, and we'll give a short presentation to the library committee next month." },
  { speaker: "Tutor", voice: "en_US-lessac-medium", text: "That sounds sensible. Make sure you include some direct quotes from students — they make the report more persuasive." },
  { speaker: "Tom", voice: "en_GB-northern_english_male-medium", text: "Good idea. We'll do that." },
  { speaker: "Tutor", voice: "en_US-lessac-medium", text: "One more thing — have you thought about the limitations of your study?" },
  { speaker: "Maria", voice: "en_US-lessac-medium", text: "Yes, we know the survey only covered one week, so it might not reflect the whole year. We'll mention that in the report." },
];

const part4Script = [
  { speaker: "Lecturer", voice: "en_US-ryan-high", text: "Good morning. Today I'd like to talk about urban heat islands — a phenomenon that affects nearly every large city in the world." },
  { speaker: "Lecturer", voice: "en_US-ryan-high", text: "An urban heat island occurs when a city is significantly warmer than the surrounding countryside. The difference can be as much as five or six degrees Celsius on a calm summer night. This may not sound dramatic, but it has real consequences: higher energy use for air conditioning, greater strain on power grids, and increased health risks during heatwaves." },
  { speaker: "Lecturer", voice: "en_US-ryan-high", text: "So why do cities get so hot? There are several reasons. First, dark surfaces. Asphalt roads and dark rooftops absorb sunlight and store heat, then release it slowly after sunset. In contrast, rural areas with vegetation reflect more sunlight and cool down quickly through evaporation." },
  { speaker: "Lecturer", voice: "en_US-ryan-high", text: "Second, cities lack vegetation. Trees and plants cool the air through a process called evapotranspiration, in which water evaporates from leaves and takes heat with it. When a city replaces parks with concrete, it loses this natural cooling." },
  { speaker: "Lecturer", voice: "en_US-ryan-high", text: "Third, waste heat from human activity. Cars, air conditioners and factories all release heat directly into the urban environment." },
  { speaker: "Lecturer", voice: "en_US-ryan-high", text: "Fortunately, there are solutions. One of the most effective is planting more trees and creating green roofs — roofs covered with vegetation that absorb less heat and provide insulation. Another approach is using light-coloured materials for roads and buildings, which reflect sunlight instead of absorbing it. Some cities have also introduced 'cool roofs', which are coated with reflective paint." },
  { speaker: "Lecturer", voice: "en_US-ryan-high", text: "Research suggests that a combination of these measures could reduce urban temperatures by several degrees, making cities more comfortable and more resilient as the climate warms. The challenge, of course, is funding and political will — but as heatwaves become more frequent, the case for action grows stronger every year." },
];

const part1Questions: Question[] = [
  textQ({ id: "list-p1-q1", type: "form_completion", prompt: "Room type: double with a __________ view", explanation: "The caller requests a sea-view room.", evidence: "Part 1", skillTags: ["form completion", "detail"], difficulty: 1, wordLimit: 1, allowNumber: false, correctAnswer: "sea" }),
  textQ({ id: "list-p1-q2", type: "form_completion", prompt: "Number of nights: __________", explanation: "Three nights.", evidence: "Part 1", skillTags: ["form completion", "number"], difficulty: 1, wordLimit: 1, allowNumber: true, correctAnswer: "three", acceptableAnswers: ["3"] }),
  textQ({ id: "list-p1-q3", type: "form_completion", prompt: "Date of arrival: __________ March", explanation: "The fourteenth of March.", evidence: "Part 1", skillTags: ["form completion", "date"], difficulty: 2, wordLimit: 1, allowNumber: false, correctAnswer: "fourteenth", acceptableAnswers: ["14th", "14"] }),
  textQ({ id: "list-p1-q4", type: "form_completion", prompt: "Guest surname: __________", explanation: "Sullivan, spelled S-U-L-L-I-V-A-N.", evidence: "Part 1", skillTags: ["form completion", "spelling"], difficulty: 2, wordLimit: 1, allowNumber: false, correctAnswer: "sullivan" }),
  textQ({ id: "list-p1-q5", type: "form_completion", prompt: "Price per night: £__________", explanation: "Sea-view double is £110 per night.", evidence: "Part 1", skillTags: ["form completion", "number"], difficulty: 2, wordLimit: 2, allowNumber: true, correctAnswer: "110", acceptableAnswers: ["£110", "one hundred and ten"] }),
  textQ({ id: "list-p1-q6", type: "form_completion", prompt: "Check-in time: __________ p.m.", explanation: "Rooms available from two p.m.", evidence: "Part 1", skillTags: ["form completion", "time"], difficulty: 2, wordLimit: 2, allowNumber: true, correctAnswer: "two", acceptableAnswers: ["2", "2:00"] }),
  choiceQ({ id: "list-p1-q7", type: "multiple_choice", prompt: "What is the Wi-Fi password at the hotel?", explanation: "The password is 'lakeside'.", evidence: "Part 1", skillTags: ["multiple choice", "detail"], difficulty: 1, options: [["A", "lakeview"], ["B", "lakeside"], ["C", "hotel123"]], correct: ["B"] }),
  textQ({ id: "list-p1-q8", type: "short_answer", prompt: "How much does breakfast cost per person if booked in advance?", explanation: "Twelve pounds per person.", evidence: "Part 1", skillTags: ["short answer", "number"], difficulty: 2, wordLimit: 2, allowNumber: true, correctAnswer: "£12", acceptableAnswers: ["12 pounds", "twelve pounds", "12"] }),
  textQ({ id: "list-p1-q9", type: "short_answer", prompt: "What time is check-out on the final day?", explanation: "By eleven a.m.", evidence: "Part 1", skillTags: ["short answer", "time"], difficulty: 2, wordLimit: 2, allowNumber: true, correctAnswer: "11 a.m.", acceptableAnswers: ["eleven a.m.", "11", "eleven", "11am"] }),
  choiceQ({ id: "list-p1-q10", type: "multiple_choice", prompt: "How many people is breakfast booked for?", explanation: "Breakfast for both of them (two people).", evidence: "Part 1", skillTags: ["multiple choice", "detail"], difficulty: 1, options: [["A", "one"], ["B", "two"], ["C", "three"]], correct: ["B"] }),
];

const part2Questions: Question[] = [
  choiceQ({ id: "list-p2-q11", type: "multiple_choice", prompt: "How long will the tour take?", explanation: "About an hour.", evidence: "Part 2", skillTags: ["multiple choice", "detail"], difficulty: 1, options: [["A", "30 minutes"], ["B", "45 minutes"], ["C", "about an hour"]], correct: ["C"] }),
  choiceQ({ id: "list-p2-q12", type: "multiple_choice", prompt: "How much do audio guides cost?", explanation: "Five pounds.", evidence: "Part 2", skillTags: ["multiple choice", "number"], difficulty: 1, options: [["A", "free"], ["B", "£5"], ["C", "£10"]], correct: ["B"] }),
  textQ({ id: "list-p2-q13", type: "map_labelling", prompt: "The café is directly to the __________ of the main entrance.", explanation: "To the left of the entrance.", evidence: "Part 2", skillTags: ["map labelling", "direction"], difficulty: 2, wordLimit: 1, allowNumber: false, correctAnswer: "left" }),
  textQ({ id: "list-p2-q14", type: "map_labelling", prompt: "The natural history gallery is to the __________ of the exhibition hall.", explanation: "East of the exhibition hall.", evidence: "Part 2", skillTags: ["map labelling", "direction"], difficulty: 2, wordLimit: 1, allowNumber: false, correctAnswer: "east" }),
  choiceQ({ id: "list-p2-q15", type: "multiple_choice", prompt: "Until when has the special Egypt exhibition been extended?", explanation: "Until the end of August.", evidence: "Part 2", skillTags: ["multiple choice", "detail"], difficulty: 2, options: [["A", "end of July"], ["B", "end of August"], ["C", "end of September"]], correct: ["B"] }),
  textQ({ id: "list-p2-q16", type: "short_answer", prompt: "In which part of the museum is photography not allowed?", explanation: "The art gallery.", evidence: "Part 2", skillTags: ["short answer", "detail"], difficulty: 2, wordLimit: 2, allowNumber: false, correctAnswer: "art gallery", acceptableAnswers: ["the art gallery"] }),
  choiceQ({ id: "list-p2-q17", type: "multiple_choice", prompt: "What discount do members receive at the gift shop?", explanation: "Ten percent.", evidence: "Part 2", skillTags: ["multiple choice", "number"], difficulty: 1, options: [["A", "5%"], ["B", "10%"], ["C", "15%"]], correct: ["B"] }),
  textQ({ id: "list-p2-q18", type: "short_answer", prompt: "What time does the café close?", explanation: "Four thirty.", evidence: "Part 2", skillTags: ["short answer", "time"], difficulty: 2, wordLimit: 2, allowNumber: true, correctAnswer: "4:30", acceptableAnswers: ["four thirty", "4.30"] }),
  choiceQ({ id: "list-p2-q19", type: "multiple_choice", prompt: "Why is the natural history gallery popular with children?", explanation: "Mainly because of the dinosaur skeletons.", evidence: "Part 2", skillTags: ["multiple choice", "detail"], difficulty: 2, options: [["A", "the interactive displays"], ["B", "the dinosaur skeletons"], ["C", "the gift shop"]], correct: ["B"] }),
  textQ({ id: "list-p2-q20", type: "map_labelling", prompt: "The gift shop is in the __________ corner of the museum.", explanation: "North-east corner.", evidence: "Part 2", skillTags: ["map labelling", "direction"], difficulty: 2, wordLimit: 2, allowNumber: false, correctAnswer: "north-east", acceptableAnswers: ["northeast", "north east"] }),
];

const part3Questions: Question[] = [
  choiceQ({ id: "list-p3-q21", type: "multiple_choice", prompt: "What surprised the students about their survey results?", explanation: "They expected most students to prefer online resources, but many still like studying in the library because it's quiet.", evidence: "Part 3", skillTags: ["multiple choice", "detail"], difficulty: 3, options: [["A", "few students use the library"], ["B", "many students still like studying in the library"], ["C", "students prefer e-books"]], correct: ["B"] }),
  choiceQ({ id: "list-p3-q22", type: "multiple_choice", prompt: "Why do many students use the online catalogue?", explanation: "To find books before borrowing physical copies.", evidence: "Part 3", skillTags: ["multiple choice", "detail"], difficulty: 2, options: [["A", "to read e-books"], ["B", "to find books before borrowing physical copies"], ["C", "to book study rooms"]], correct: ["B"] }),
  choiceQ({ id: "list-p3-q23", type: "multiple_choice", prompt: "What do the students recommend about group study rooms?", explanation: "The library should add more rooms.", evidence: "Part 3", skillTags: ["multiple choice", "detail"], difficulty: 2, options: [["A", "make them smaller"], ["B", "charge for them"], ["C", "add more rooms"]], correct: ["C"] }),
  matchingQ({ id: "list-p3-q24", type: "matching", prompt: "Match each person with the point they raised.", explanation: "Maria raised the survey and study rooms; Tom raised opening hours; the tutor raised limitations.", evidence: "Part 3", skillTags: ["matching", "speaker"], difficulty: 4, options: [["A", "Maria"], ["B", "Tom"], ["C", "Tutor"]], items: [["sp1", "raised the survey of about 200 students", "A"], ["sp2", "raised the problem of opening hours", "B"], ["sp3", "raised the limitations of the study", "C"]] }),
  choiceQ({ id: "list-p3-q25", type: "multiple_choice", prompt: "When does the library currently close?", explanation: "At ten.", evidence: "Part 3", skillTags: ["multiple choice", "time"], difficulty: 1, options: [["A", "9 p.m."], ["B", "10 p.m."], ["C", "midnight"]], correct: ["B"] }),
  textQ({ id: "list-p3-q26", type: "short_answer", prompt: "How will the students present their findings?", explanation: "A report with charts and a short presentation.", evidence: "Part 3", skillTags: ["short answer", "detail"], difficulty: 2, wordLimit: 3, allowNumber: false, correctAnswer: "report and presentation", acceptableAnswers: ["a report and presentation", "report with charts"] }),
  choiceQ({ id: "list-p3-q27", type: "multiple_choice", prompt: "What does the tutor suggest including to make the report more persuasive?", explanation: "Direct quotes from students.", evidence: "Part 3", skillTags: ["multiple choice", "detail"], difficulty: 2, options: [["A", "more statistics"], ["B", "direct quotes from students"], ["C", "photographs"]], correct: ["B"] }),
  textQ({ id: "list-p3-q28", type: "short_answer", prompt: "What limitation do the students identify about their survey?", explanation: "It only covered one week.", evidence: "Part 3", skillTags: ["short answer", "detail"], difficulty: 2, wordLimit: 3, allowNumber: false, correctAnswer: "one week", acceptableAnswers: ["only one week", "a week"] }),
];

const part4Questions: Question[] = [
  textQ({ id: "list-p4-q29", type: "note_completion", prompt: "An urban heat island occurs when a city is __________ than the countryside.", explanation: "Significantly warmer.", evidence: "Part 4", skillTags: ["note completion", "detail"], difficulty: 1, wordLimit: 2, allowNumber: false, correctAnswer: "significantly warmer" }),
  textQ({ id: "list-p4-q30", type: "note_completion", prompt: "The temperature difference can reach five or six degrees on a calm summer __________.", explanation: "night.", evidence: "Part 4", skillTags: ["note completion", "detail"], difficulty: 2, wordLimit: 1, allowNumber: false, correctAnswer: "night" }),
  textQ({ id: "list-p4-q31", type: "note_completion", prompt: "Dark surfaces absorb sunlight and store heat, releasing it slowly after __________.", explanation: "Sunset.", evidence: "Part 4", skillTags: ["note completion", "detail"], difficulty: 2, wordLimit: 1, allowNumber: false, correctAnswer: "sunset" }),
  textQ({ id: "list-p4-q32", type: "note_completion", prompt: "Trees cool the air through a process called __________.", explanation: "Evapotranspiration.", evidence: "Part 4", skillTags: ["note completion", "detail"], difficulty: 2, wordLimit: 1, allowNumber: false, correctAnswer: "evapotranspiration" }),
  textQ({ id: "list-p4-q33", type: "note_completion", prompt: "Light-coloured materials help by __________ sunlight instead of absorbing it.", explanation: "Reflecting.", evidence: "Part 4", skillTags: ["note completion", "detail"], difficulty: 2, wordLimit: 1, allowNumber: false, correctAnswer: "reflecting" }),
  choiceQ({ id: "list-p4-q34", type: "multiple_choice", prompt: "Which of these is NOT mentioned as a cause of urban heat islands?", explanation: "The lecture lists dark surfaces, lack of vegetation, and waste heat — not high-rise winds.", evidence: "Part 4", skillTags: ["multiple choice", "detail"], difficulty: 3, options: [["A", "dark surfaces"], ["B", "lack of vegetation"], ["C", "high-rise winds"]], correct: ["C"] }),
  textQ({ id: "list-p4-q35", type: "note_completion", prompt: "Green roofs are covered with __________ that absorb less heat.", explanation: "Vegetation.", evidence: "Part 4", skillTags: ["note completion", "detail"], difficulty: 2, wordLimit: 1, allowNumber: false, correctAnswer: "vegetation" }),
  textQ({ id: "list-p4-q36", type: "note_completion", prompt: "'Cool roofs' are coated with __________ paint.", explanation: "Reflective.", evidence: "Part 4", skillTags: ["note completion", "detail"], difficulty: 2, wordLimit: 1, allowNumber: false, correctAnswer: "reflective" }),
  choiceQ({ id: "list-p4-q37", type: "multiple_choice", prompt: "What is the main challenge mentioned for implementing these solutions?", explanation: "Funding and political will.", evidence: "Part 4", skillTags: ["multiple choice", "main idea"], difficulty: 3, options: [["A", "lack of technology"], ["B", "funding and political will"], ["C", "public opposition"]], correct: ["B"] }),
  textQ({ id: "list-p4-q38", type: "short_answer", prompt: "What type of roofs provide insulation and absorb less heat?", explanation: "Green roofs.", evidence: "Part 4", skillTags: ["short answer", "detail"], difficulty: 1, wordLimit: 2, allowNumber: false, correctAnswer: "green roofs", acceptableAnswers: ["green roofs"] }),
];

export const listeningSet: PracticeSet = {
  meta: {
    id: "listening-1",
    title: "Listening Test 1",
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
    title: "IELTS Study OS Listening Test 1",
    transcript: [part1Script, part2Script, part3Script, part4Script]
      .map((lines) => lines.map((l) => l.text).join(" "))
      .join("\n\n"),
    parts: [
      { part: 1, title: "Hotel booking", src: "/audio/listening-1/part1.mp3" },
      { part: 2, title: "City museum tour", src: "/audio/listening-1/part2.mp3" },
      { part: 3, title: "Research project discussion", src: "/audio/listening-1/part3.mp3" },
      { part: 4, title: "Urban heat islands", src: "/audio/listening-1/part4.mp3" },
    ],
    script: [
      { part: 1, lines: part1Script },
      { part: 2, lines: part2Script },
      { part: 3, lines: part3Script },
      { part: 4, lines: part4Script },
    ],
  },
  questions: [...part1Questions, ...part2Questions, ...part3Questions, ...part4Questions],
  groups: [
    { id: "g1", title: "Part 1", questionIds: part1Questions.map((q) => q.id) },
    { id: "g2", title: "Part 2", questionIds: part2Questions.map((q) => q.id) },
    { id: "g3", title: "Part 3", questionIds: part3Questions.map((q) => q.id) },
    { id: "g4", title: "Part 4", questionIds: part4Questions.map((q) => q.id) },
  ],
};

export const listeningSets: PracticeSet[] = [listeningSet];
