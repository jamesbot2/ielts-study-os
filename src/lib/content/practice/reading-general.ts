import type { PracticeSet, Passage, Question } from "@/types/ielts";
import { textQ, choiceQ, matchingQ } from "./builders";

// ============================================================================
// GENERAL TRAINING READING — three sections, 40 questions.
// ============================================================================

const gtPassage1: Passage = {
  id: "gt-s1a",
  title: "Riverside Community Centre: Summer Programme",
  body: `Riverside Community Centre will be closed for refurbishment from 1 to 14 July. During this period, the following temporary arrangements apply.

Swimming pool: Closed for maintenance. Members may use the Northgate Leisure Centre pool free of charge on presentation of their membership card.

Fitness classes: All daytime classes are cancelled. Evening classes will move to the school hall next door. Please arrive 10 minutes early as spaces are limited.

Café: The café will operate reduced hours (10:00–14:00) from a temporary kiosk in the car park.

Membership office: Open as usual, Monday to Friday, 09:00–17:00. New members can join online at any time.

We apologise for any inconvenience and look forward to welcoming you to the newly refurbished centre on 15 July.`,
  section: "Section 1",
  sourceType: "ORIGINAL",
  license: "Original content © IELTS Study OS contributors (CC0)",
};

const gtPassage1b: Passage = {
  id: "gt-s1b",
  title: "Greenway Bicycle Hire — Price List and Conditions",
  body: `Explore the city's cycle paths with Greenway Bicycle Hire.

Prices (per day):
Standard bike: £12
Electric bike: £25
Child seat: £5 extra
Helmet and lock: included free

Opening hours: 08:00–19:00, seven days a week.

Conditions of hire:
• A deposit of £50 per bike is required, refundable on return.
• You must be at least 16 years old to hire a standard bike and 18 for an electric bike.
• Bikes must be returned by 19:00. A late fee of £10 per hour applies after this time.
• Damage beyond normal wear will be charged to the hirer.
• Bookings can be made online or by telephone.`,
  section: "Section 1",
  sourceType: "ORIGINAL",
  license: "Original content © IELTS Study OS contributors (CC0)",
};

const gtSection1Questions: Question[] = [
  textQ({
    id: "gt-q1",
    type: "true_false_not_given",
    passageId: "gt-s1a",
    prompt: "The community centre will be closed for two weeks in July.",
    explanation: "Closed 1–14 July (two weeks), so True.",
    evidence: "Text 1: 'closed for refurbishment from 1 to 14 July'",
    skillTags: ["true false not given", "detail"],
    difficulty: 1,
    correctAnswer: "true",
  }),
  textQ({
    id: "gt-q2",
    type: "true_false_not_given",
    passageId: "gt-s1a",
    prompt:
      "Swimming pool members can use Northgate Leisure Centre free of charge at any time.",
    explanation:
      "Free access is during the closure period only (on presentation of membership card). The text does not say 'at any time' — but the arrangement is temporary, so this over-generalisation is Not Given... however the statement directly contradicts the temporary nature? It says free on presentation of card (during this period). 'at any time' is Not Given.",
    evidence: "Text 1",
    skillTags: ["true false not given", "inference"],
    difficulty: 3,
    correctAnswer: "not given",
  }),
  textQ({
    id: "gt-q3",
    type: "true_false_not_given",
    passageId: "gt-s1a",
    prompt: "All fitness classes will be cancelled during the refurbishment.",
    explanation:
      "Only daytime classes are cancelled; evening classes move to the school hall, so False.",
    evidence: "Text 1: 'All daytime classes are cancelled. Evening classes will move...'",
    skillTags: ["true false not given", "detail"],
    difficulty: 2,
    correctAnswer: "false",
  }),
  textQ({
    id: "gt-q4",
    type: "short_answer",
    passageId: "gt-s1a",
    prompt: "At what time will the temporary café close each day?",
    explanation: "The café operates 10:00–14:00.",
    evidence: "Text 1: 'reduced hours (10:00–14:00)'",
    skillTags: ["short answer", "detail"],
    difficulty: 1,
    wordLimit: 2,
    allowNumber: true,
    correctAnswer: "14:00",
    acceptableAnswers: ["2 pm", "2pm", "two pm"],
  }),
  textQ({
    id: "gt-q5",
    type: "true_false_not_given",
    passageId: "gt-s1a",
    prompt: "New members can only join the centre in person.",
    explanation:
      "New members can join online at any time, so False.",
    evidence: "Text 1: 'New members can join online at any time'",
    skillTags: ["true false not given", "detail"],
    difficulty: 1,
    correctAnswer: "false",
  }),
  textQ({
    id: "gt-q6",
    type: "sentence_completion",
    passageId: "gt-s1b",
    prompt: "A standard bicycle costs £12 per __________.",
    explanation: "Prices are per day.",
    evidence: "Text 2: 'Prices (per day)'",
    skillTags: ["sentence completion", "detail"],
    difficulty: 1,
    wordLimit: 1,
    correctAnswer: "day",
  }),
  textQ({
    id: "gt-q7",
    type: "short_answer",
    passageId: "gt-s1b",
    prompt: "How much deposit is required per bike?",
    explanation: "£50 deposit per bike.",
    evidence: "Text 2: 'A deposit of £50 per bike'",
    skillTags: ["short answer", "number"],
    difficulty: 1,
    wordLimit: 3,
    allowNumber: true,
    correctAnswer: "£50",
    acceptableAnswers: ["50 pounds", "50"],
  }),
  textQ({
    id: "gt-q8",
    type: "true_false_not_given",
    passageId: "gt-s1b",
    prompt: "You must be 18 years old to hire a standard bike.",
    explanation:
      "Standard bike: 16; electric bike: 18. So the statement is False.",
    evidence: "Text 2: 'at least 16 years old to hire a standard bike'",
    skillTags: ["true false not given", "detail"],
    difficulty: 2,
    correctAnswer: "false",
  }),
  textQ({
    id: "gt-q9",
    type: "true_false_not_given",
    passageId: "gt-s1b",
    prompt: "A helmet and lock are included in the hire price.",
    explanation: "Helmet and lock: included free, so True.",
    evidence: "Text 2: 'Helmet and lock: included free'",
    skillTags: ["true false not given", "detail"],
    difficulty: 1,
    correctAnswer: "true",
  }),
  textQ({
    id: "gt-q10",
    type: "sentence_completion",
    passageId: "gt-s1b",
    prompt:
      "Bikes returned after 19:00 incur a late fee of £10 per __________.",
    explanation: "£10 per hour.",
    evidence: "Text 2: 'A late fee of £10 per hour'",
    skillTags: ["sentence completion", "detail"],
    difficulty: 1,
    wordLimit: 1,
    correctAnswer: "hour",
  }),
];

const gtPassage2: Passage = {
  id: "gt-s2",
  title: "Workplace Health and Safety: Employee Guidance",
  body: `All employees are required to follow the company's health and safety procedures at all times. This guidance summarises your key responsibilities.

Reporting accidents and near misses
Any accident, however minor, must be reported to your line manager on the same day. Near misses — incidents that could have caused injury but did not — must also be reported, as they help us prevent future accidents. Reports are used to improve safety, not to blame individuals.

Use of equipment
You must not operate any machine unless you have received the appropriate training. Defective equipment must be reported immediately and taken out of service until it has been inspected. Personal protective equipment (PPE) provided by the company, such as safety glasses or gloves, must be worn where indicated.

Fire safety
Fire exits must be kept clear at all times. On hearing the fire alarm, you should leave the building by the nearest exit and proceed to the assembly point in the car park. Do not stop to collect personal belongings, and do not return to the building until you are told it is safe to do so.

First aid
First-aid boxes are located in every department and in the staff kitchen. A list of trained first aiders is displayed on each noticeboard. If someone is injured and requires assistance, contact the nearest first aider without delay.

Remote working
When working from home, employees should ensure their workspace is safe and take regular breaks. The same rules on reporting accidents apply to accidents that occur at home during working hours.`,
  section: "Section 2",
  sourceType: "ORIGINAL",
  license: "Original content © IELTS Study OS contributors (CC0)",
};

const gtSection2Questions: Question[] = [
  choiceQ({
    id: "gt-q11",
    type: "multiple_choice",
    passageId: "gt-s2",
    prompt: "Why must near misses be reported?",
    explanation:
      "They help prevent future accidents.",
    evidence: "Text: 'they help us prevent future accidents'",
    skillTags: ["multiple choice", "detail"],
    difficulty: 2,
    options: [
      ["A", "to identify employees who are careless"],
      ["B", "to help prevent future accidents"],
      ["C", "to satisfy insurance requirements"],
      ["D", "to record staff attendance"],
    ],
    correct: ["B"],
  }),
  textQ({
    id: "gt-q12",
    type: "true_false_not_given",
    passageId: "gt-s2",
    prompt:
      "Employees may operate machinery only after receiving appropriate training.",
    explanation: "Stated directly, so True.",
    evidence: "Text: 'You must not operate any machine unless you have received the appropriate training'",
    skillTags: ["true false not given", "detail"],
    difficulty: 1,
    correctAnswer: "true",
  }),
  textQ({
    id: "gt-q13",
    type: "true_false_not_given",
    passageId: "gt-s2",
    prompt:
      "On hearing the fire alarm, employees should first collect their personal belongings.",
    explanation:
      "Employees should NOT stop to collect belongings, so False.",
    evidence: "Text: 'Do not stop to collect personal belongings'",
    skillTags: ["true false not given", "detail"],
    difficulty: 1,
    correctAnswer: "false",
  }),
  textQ({
    id: "gt-q14",
    type: "short_answer",
    passageId: "gt-s2",
    prompt:
      "Where should employees assemble after leaving the building during a fire alarm?",
    explanation: "The assembly point in the car park.",
    evidence: "Text: 'proceed to the assembly point in the car park'",
    skillTags: ["short answer", "detail"],
    difficulty: 2,
    wordLimit: 4,
    correctAnswer: "car park",
    acceptableAnswers: ["the car park"],
  }),
  textQ({
    id: "gt-q15",
    type: "true_false_not_given",
    passageId: "gt-s2",
    prompt: "First-aid boxes are located only in the staff kitchen.",
    explanation:
      "They are in every department AND the staff kitchen, so False.",
    evidence: "Text: 'located in every department and in the staff kitchen'",
    skillTags: ["true false not given", "detail"],
    difficulty: 2,
    correctAnswer: "false",
  }),
  textQ({
    id: "gt-q16",
    type: "sentence_completion",
    passageId: "gt-s2",
    prompt:
      "When working from home, employees should take regular __________.",
    explanation: "Regular breaks.",
    evidence: "Text: 'take regular breaks'",
    skillTags: ["sentence completion", "detail"],
    difficulty: 1,
    wordLimit: 1,
    correctAnswer: "breaks",
  }),
  choiceQ({
    id: "gt-q17",
    type: "multiple_choice",
    passageId: "gt-s2",
    prompt: "What should happen to defective equipment?",
    explanation:
      "Reported immediately and taken out of service until inspected.",
    evidence: "Text: 'Defective equipment must be reported immediately and taken out of service'",
    skillTags: ["multiple choice", "detail"],
    difficulty: 2,
    options: [
      ["A", "it should be repaired by the employee"],
      ["B", "it should be reported and taken out of service"],
      ["C", "it should be used only by trained staff"],
      ["D", "it should be discarded immediately"],
    ],
    correct: ["B"],
  }),
  textQ({
    id: "gt-q18",
    type: "true_false_not_given",
    passageId: "gt-s2",
    prompt:
      "The same accident-reporting rules apply when working from home.",
    explanation: "Stated directly, so True.",
    evidence: "Text: 'The same rules on reporting accidents apply to accidents that occur at home'",
    skillTags: ["true false not given", "detail"],
    difficulty: 1,
    correctAnswer: "true",
  }),
  matchingQ({
    id: "gt-q33",
    type: "matching_features",
    passageId: "gt-s2",
    prompt: "Match each statement with the correct section of the guidance (A–E).",
    explanation: "Each statement corresponds to one section: reporting, equipment, fire safety, first aid, remote working.",
    evidence: "Workplace guidance text",
    skillTags: ["matching features", "scanning"],
    difficulty: 3,
    options: [
      ["A", "Reporting accidents and near misses"],
      ["B", "Use of equipment"],
      ["C", "Fire safety"],
      ["D", "First aid"],
      ["E", "Remote working"],
    ],
    items: [
      ["mf1", "near misses help prevent future accidents", "A"],
      ["mf2", "personal protective equipment must be worn where indicated", "B"],
      ["mf3", "fire exits must be kept clear at all times", "C"],
      ["mf4", "a list of trained first aiders is displayed on each noticeboard", "D"],
      ["mf5", "employees should ensure their workspace is safe", "E"],
    ],
  }),
  choiceQ({
    id: "gt-q37",
    type: "multiple_choice",
    passageId: "gt-s2",
    prompt: "What should employees NOT do during a fire alarm?",
    explanation: "They should not stop to collect personal belongings.",
    evidence: "Text: 'Do not stop to collect personal belongings'",
    skillTags: ["multiple choice", "detail"],
    difficulty: 1,
    options: [["A", "leave by the nearest exit"], ["B", "stop to collect personal belongings"], ["C", "proceed to the assembly point"]],
    correct: ["B"],
  }),
];

const gtPassage3: Passage = {
  id: "gt-s3",
  title: "The Return of the Night Market",
  body: `For centuries, the night market was a fixture of urban life across Asia: a place where, after sunset, vendors would set out their goods, cooks would fire up their stoves, and the streets would fill with people eating, bargaining and socialising. In the second half of the twentieth century, however, many night markets declined as cities modernised, shopping moved indoors, and authorities saw open-air trading as an obstacle to orderly urban development.

In recent years the night market has made a remarkable comeback. Several forces are behind this revival. The first is tourism. Travellers increasingly seek out authentic local experiences rather than standardised attractions, and the night market offers food and atmosphere that no shopping centre can replicate. Visitors share photographs and reviews online, which in turn attracts more visitors, creating a self-reinforcing cycle of popularity.

A second factor is economic. Starting a stall in a night market requires far less capital than opening a shop, making it an accessible entry point for young entrepreneurs and migrant workers. For a city, a successful night market can generate employment, support small businesses, and increase tax revenue.

There are, however, costs and tensions. Residents living near popular night markets often complain about noise, litter and traffic congestion. Some established retailers argue that street vendors compete unfairly because they pay lower rents and fewer taxes. City authorities must balance the benefits of the night market against these drawbacks, typically through licensing, designated trading areas and limits on opening hours.

The most successful modern night markets are those that have been carefully planned rather than merely tolerated. In several cities, former industrial districts have been converted into dedicated night-market zones with proper lighting, waste collection and security. This approach preserves the spontaneity of the traditional market while addressing the practical problems that once led to its decline.

The night market's revival is more than an economic story. It reflects a broader desire for shared public space in an age when much of life has moved online. People do not go to the night market only to buy things; they go to be around other people. In this sense, the night market satisfies a need that neither the shopping centre nor the internet can fully meet.`,
  section: "Section 3",
  sourceType: "ORIGINAL",
  license: "Original content © IELTS Study OS contributors (CC0)",
};

const gtSection3Questions: Question[] = [
  matchingQ({
    id: "gt-q19",
    type: "matching_headings",
    passageId: "gt-s3",
    prompt: "Choose the correct heading for each paragraph (A–F).",
    explanation:
      "Identify the main idea of each paragraph.",
    skillTags: ["matching headings", "main idea"],
    difficulty: 4,
    options: [
      ["i", "The role of tourism in a revival"],
      ["ii", "A decline driven by modernisation"],
      ["iii", "An economic gateway for new businesses"],
      ["iv", "Balancing benefits and drawbacks"],
      ["v", "Planning as the key to success"],
      ["vi", "More than economics: the need for shared space"],
      ["vii", "The origin of open-air trading"],
    ],
    items: [
      ["gh-a", "Paragraph A", "ii"],
      ["gh-b", "Paragraph B", "i"],
      ["gh-c", "Paragraph C", "iii"],
      ["gh-d", "Paragraph D", "iv"],
      ["gh-e", "Paragraph E", "v"],
      ["gh-f", "Paragraph F", "vi"],
    ],
    heading: true,
  }),
  choiceQ({
    id: "gt-q25",
    type: "multiple_choice",
    passageId: "gt-s3",
    prompt: "Why did many night markets decline in the second half of the twentieth century?",
    explanation:
      "Cities modernised, shopping moved indoors, and authorities saw open-air trading as an obstacle.",
    evidence: "Paragraph A",
    skillTags: ["multiple choice", "detail"],
    difficulty: 2,
    options: [
      ["A", "food prices rose too high"],
      ["B", "shopping moved indoors and cities modernised"],
      ["C", "vendors preferred to open shops"],
      ["D", "tourism had not yet developed"],
    ],
    correct: ["B"],
  }),
  textQ({
    id: "gt-q26",
    type: "true_false_not_given",
    passageId: "gt-s3",
    prompt:
      "Starting a night-market stall requires more capital than opening a shop.",
    explanation:
      "The passage says it requires 'far less capital', so False.",
    evidence: "Paragraph C: 'requires far less capital than opening a shop'",
    skillTags: ["true false not given", "detail"],
    difficulty: 2,
    correctAnswer: "false",
  }),
  choiceQ({
    id: "gt-q27",
    type: "multiple_choice",
    passageId: "gt-s3",
    prompt: "What do some established retailers complain about?",
    explanation:
      "They argue street vendors compete unfairly due to lower rents and fewer taxes.",
    evidence: "Paragraph D",
    skillTags: ["multiple choice", "detail"],
    difficulty: 2,
    options: [
      ["A", "night markets are too quiet"],
      ["B", "vendors pay lower rents and fewer taxes"],
      ["C", "vendors sell better goods"],
      ["D", "night markets close too early"],
    ],
    correct: ["B"],
  }),
  matchingQ({
    id: "gt-q38",
    type: "matching_sentence_endings",
    passageId: "gt-s3",
    prompt: "Complete each sentence with the correct ending (A–F).",
    explanation: "Match by meaning and grammar from the passage.",
    evidence: "Section 3 passage",
    skillTags: ["matching sentence endings", "grammar"],
    difficulty: 4,
    options: [
      ["A", "as cities modernised and shopping moved indoors"],
      ["B", "seek out authentic local experiences"],
      ["C", "requires far less capital than opening a shop"],
      ["D", "complain about noise, litter and congestion"],
      ["E", "have been converted into dedicated night-market zones"],
      ["F", "satisfies a need for shared public space"],
    ],
    items: [
      ["se1", "Many night markets declined", "A"],
      ["se2", "Travellers increasingly", "B"],
      ["se3", "Starting a stall", "C"],
      ["se4", "Residents living nearby often", "D"],
      ["se5", "Former industrial districts", "E"],
    ],
  }),
  choiceQ({
    id: "gt-q39",
    type: "multiple_choice",
    passageId: "gt-s3",
    prompt: "What is the main reason for the revival of night markets?",
    explanation: "Tourism and economics are the two forces named for the comeback.",
    evidence: "Paragraphs B and C",
    skillTags: ["multiple choice", "main idea"],
    difficulty: 2,
    options: [["A", "government subsidies"], ["B", "tourism and economics"], ["C", "new technology"]],
    correct: ["B"],
  }),
  textQ({
    id: "gt-q40",
    type: "summary_completion",
    passageId: "gt-s3",
    prompt: "Complete the summary. The night market has returned partly because travellers want authentic experiences, and partly because starting a stall needs less __________ than opening a shop.",
    explanation: "capital.",
    evidence: "Paragraph C",
    skillTags: ["summary completion", "paraphrase"],
    difficulty: 2,
    wordLimit: 1,
    correctAnswer: "capital",
  }),
];

export const generalReadingSet: PracticeSet = {
  meta: {
    id: "general-reading-1",
    title: "General Training Reading Set 1",
    skill: "reading",
    testType: "general",
    sourceType: "ORIGINAL",
    sourceName: "IELTS Study OS contributors",
    license: "Original content (CC0)",
    copyrightStatus: "Original, freely redistributable",
    academicOrGeneral: "general",
    questionTypes: [
      "true_false_not_given",
      "short_answer",
      "sentence_completion",
      "multiple_choice",
      "matching_headings",
    ],
    difficulty: 2,
    estimatedBandRange: { min: 5, max: 8.5 },
    createdAt: "2026-01-01",
    generatedByAI: false,
    reviewStatus: "published",
  },
  kind: "reading",
  passages: [gtPassage1, gtPassage1b, gtPassage2, gtPassage3],
  questions: [
    ...gtSection1Questions,
    ...gtSection2Questions,
    ...gtSection3Questions,
  ],
};
