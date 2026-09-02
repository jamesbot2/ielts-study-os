import type { PracticeSet, Passage, Question } from "@/types/ielts";
import { textQ, choiceQ, matchingQ } from "./builders";

// ============================================================================
// ACADEMIC READING — three original passages, 40 questions, all major types.
// ============================================================================

const passage1: Passage = {
  id: "ar-p1",
  title: "The Origins of Glassmaking",
  body: `A. Glass is one of the oldest manufactured materials known to humanity. Archaeological evidence suggests that the first true glass objects were produced in Mesopotamia and ancient Egypt around 3500 BCE, although for many centuries the substance was regarded as a luxury reserved for the wealthy. Early glassmakers discovered that heating a mixture of sand, soda ash and lime to extremely high temperatures produced a molten material which could be shaped before it cooled into a hard, transparent solid.

B. The earliest glass objects were small beads and ornaments, produced by winding molten glass around a removable core. It was not until the technique of glassblowing was developed, probably in the first century BCE in the region of Syria, that glass became cheap enough for everyday use. This innovation transformed the industry, allowing vessels to be produced quickly and in a wide variety of shapes.

C. The Romans played a crucial role in spreading glassmaking across Europe. As the Roman Empire expanded, so too did the demand for glass containers, windows and decorative objects. Roman glassmakers experimented with new recipes, adding manganese to remove the greenish tint caused by iron impurities, and thereby producing the first nearly colourless glass.

D. After the fall of the Roman Empire, glassmaking knowledge was preserved in Byzantium and in the Islamic world. Islamic glassmakers excelled in decoration, developing techniques such as enamelling and gilding. Their richly decorated lamps and vessels were traded across Asia and into Europe, and many of their methods were later adopted by Venetian craftsmen.

E. Venice became the centre of European glassmaking in the medieval period. The famous glassmakers of the island of Murano guarded their recipes so closely that they were forbidden, on pain of death, from leaving the island. Venetian glass was prized for its clarity and its delicate, elaborate forms, and Murano glass remains a symbol of quality to this day.

F. The Industrial Revolution brought glassmaking to the factory floor. In the nineteenth century, new furnaces able to reach higher temperatures and mechanical processes allowed glass to be produced in vast quantities. Perhaps the most significant single invention was the float-glass process, developed in Britain in the 1950s, in which molten glass is floated on a bed of molten tin to produce perfectly flat sheets. This process remains the basis of modern window glass production.

G. Today, glass is found everywhere, from the screens of electronic devices to the optical fibres that carry the internet. Researchers continue to develop new forms of glass, including glass that is flexible, glass that repairs itself, and glass that generates electricity. Far from being a relic of the ancient world, glass is a material at the cutting edge of technology.`,
  section: "Passage 1",
  sourceType: "ORIGINAL",
  license: "Original content © IELTS Study OS contributors (CC0)",
};

const passage1Questions: Question[] = [
  matchingQ({
    id: "ar-p1-q1",
    type: "matching_headings",
    passageId: "ar-p1",
    prompt: "Choose the correct heading for each paragraph (A–G).",
    explanation:
      "Each paragraph has a clear main topic: origin, technique, spread, preservation, Venice, industry, modern use.",
    skillTags: ["matching headings", "main idea"],
    difficulty: 3,
    options: [
      ["i", "A luxury for the privileged few"],
      ["ii", "A technique that changed everything"],
      ["iii", "The Roman contribution to a wider market"],
      ["iv", "Preservation and decoration in the East"],
      ["v", "The rise and secrecy of Venice"],
      ["vi", "From craft to mass production"],
      ["vii", "A material of the future"],
      ["viii", "The invention of colourless glass"],
    ],
    items: [
      ["h-a", "Paragraph A", "i"],
      ["h-b", "Paragraph B", "ii"],
      ["h-c", "Paragraph C", "iii"],
      ["h-d", "Paragraph D", "iv"],
      ["h-e", "Paragraph E", "v"],
      ["h-f", "Paragraph F", "vi"],
      ["h-g", "Paragraph G", "vii"],
    ],
    heading: true,
  }),
  textQ({
    id: "ar-p1-q8",
    type: "true_false_not_given",
    passageId: "ar-p1",
    prompt:
      "Glass was affordable for ordinary people from the very beginning of its manufacture.",
    explanation:
      "Paragraph A states glass 'was regarded as a luxury reserved for the wealthy' for many centuries, so the statement is False.",
    evidence: "Paragraph A: 'for many centuries the substance was regarded as a luxury reserved for the wealthy'",
    skillTags: ["true false not given", "detail"],
    difficulty: 2,
    correctAnswer: "false",
  }),
  textQ({
    id: "ar-p1-q9",
    type: "true_false_not_given",
    passageId: "ar-p1",
    prompt: "Glassblowing was invented before the first glass beads were made.",
    explanation:
      "Paragraph A describes beads as the earliest objects; glassblowing (Paragraph B) came much later, so the statement is False.",
    evidence: "Paragraph B: 'It was not until the technique of glassblowing was developed...'",
    skillTags: ["true false not given", "detail"],
    difficulty: 2,
    correctAnswer: "false",
  }),
  textQ({
    id: "ar-p1-q10",
    type: "true_false_not_given",
    passageId: "ar-p1",
    prompt: "The Romans added manganese to glass to make it heavier.",
    explanation:
      "The passage says manganese removed the greenish tint to produce colourless glass; nothing about weight. The statement contradicts the text (False).",
    evidence: "Paragraph C: 'adding manganese to remove the greenish tint... producing the first nearly colourless glass'",
    skillTags: ["true false not given", "detail"],
    difficulty: 3,
    correctAnswer: "false",
  }),
  textQ({
    id: "ar-p1-q16",
    type: "table_completion",
    passageId: "ar-p1",
    prompt:
      "Complete the table of developments. In the first century BCE, glassblowing was developed in the region of __________.",
    explanation: "Paragraph B states glassblowing was developed in the region of Syria.",
    evidence: "Paragraph B",
    skillTags: ["table completion", "detail"],
    difficulty: 2,
    wordLimit: 1,
    allowNumber: false,
    correctAnswer: "syria",
  }),
  textQ({
    id: "ar-p1-q17",
    type: "true_false_not_given",
    passageId: "ar-p1",
    prompt: "Islamic glassmakers were the first to produce colourless glass.",
    explanation: "The passage attributes the first nearly colourless glass to the Romans (adding manganese), not Islamic glassmakers, so the statement is False.",
    evidence: "Paragraph C vs Paragraph D",
    skillTags: ["true false not given", "detail"],
    difficulty: 3,
    correctAnswer: "false",
  }),
  textQ({
    id: "ar-p1-q18",
    type: "sentence_completion",
    passageId: "ar-p1",
    prompt: "Islamic glassmakers developed techniques such as enamelling and __________.",
    explanation: "Paragraph D lists enamelling and gilding.",
    evidence: "Paragraph D",
    skillTags: ["sentence completion", "detail"],
    difficulty: 1,
    wordLimit: 1,
    allowNumber: false,
    correctAnswer: "gilding",
  }),
];

const passage2: Passage = {
  id: "ar-p2",
  title: "Cities of the Honeybee",
  body: `Urban beekeeping, the practice of keeping honeybee colonies in cities, has grown rapidly in popularity over the past two decades. Rooftops, balconies and community gardens now host hives in cities from London to Tokyo, and the trend shows little sign of slowing.

There are several reasons for this growth. First, cities can offer bees a surprisingly rich diet. Urban parks, gardens and roadside plantings provide a wide variety of flowers across a long season, whereas large areas of intensive farmland may offer only a single crop that blooms for a few weeks. Several studies have found that urban bees can produce more honey per hive than their rural counterparts.

Second, city hives face fewer agricultural pesticides than rural hives. Although urban environments contain other pollutants, the insecticides most harmful to bees are more common in intensive agriculture. This does not mean cities are completely safe for bees; air pollution and limited foraging space remain concerns.

However, scientists have warned that the popularity of urban beekeeping may create problems of its own. The most frequently cited concern is competition. A single honeybee colony may contain up to 50,000 foraging bees, and when many hives are placed close together, they can exhaust the available flowers, leaving wild pollinators such as bumblebees and solitary bees with too little food. Some researchers argue that in certain districts, there are now too many hives for the flowers available.

Another issue is disease. Honeybees can carry pathogens that spread to wild bee populations. Because urban hives are often kept by amateurs, they may be inspected less frequently than rural hives, allowing problems to go unnoticed.

The solution, experts suggest, is not to abandon urban beekeeping but to manage it. They recommend planting more bee-friendly flowers, limiting hive density, and encouraging beekeepers to receive proper training. When managed responsibly, urban hives can both produce honey and raise public awareness of the importance of pollinators.`,
  section: "Passage 2",
  sourceType: "ORIGINAL",
  license: "Original content © IELTS Study OS contributors (CC0)",
};

const passage2Questions: Question[] = [
  matchingQ({
    id: "ar-p2-q14",
    type: "matching_information",
    passageId: "ar-p2",
    prompt:
      "Match each statement with the paragraph (A–E) that contains the information.",
    explanation:
      "Each paragraph covers a distinct idea; scan for paraphrase of each statement.",
    skillTags: ["matching information", "scanning"],
    difficulty: 4,
    options: [
      ["A", "Paragraph A"],
      ["B", "Paragraph B"],
      ["C", "Paragraph C"],
      ["D", "Paragraph D"],
      ["E", "Paragraph E"],
      ["F", "Paragraph F"],
    ],
    items: [
      ["m1", "a comparison of the food supply available to bees in different environments", "B"],
      ["m2", "a warning that disease may spread between bee species", "E"],
      ["m3", "the suggestion that the trend of keeping bees in cities is continuing", "A"],
      ["m4", "a list of measures that could make urban beekeeping sustainable", "F"],
      ["m5", "the idea that city hives may be checked less often than those in the countryside", "E"],
    ],
  }),
  choiceQ({
    id: "ar-p2-q19",
    type: "multiple_choice",
    passageId: "ar-p2",
    prompt: "According to the passage, one reason cities can be good for bees is that",
    explanation:
      "Paragraph B says urban areas provide a wide variety of flowers across a long season.",
    evidence: "Paragraph B: 'provide a wide variety of flowers across a long season'",
    skillTags: ["multiple choice", "detail"],
    difficulty: 3,
    options: [
      ["A", "cities contain no pollutants at all"],
      ["B", "urban flowers bloom over a longer period and in greater variety"],
      ["C", "urban bees never have to compete for food"],
      ["D", "city hives are always inspected by professionals"],
    ],
    correct: ["B"],
  }),
  choiceQ({
    id: "ar-p2-q20",
    type: "multiple_choice",
    passageId: "ar-p2",
    prompt: "What is the main problem caused by keeping too many hives in one area?",
    explanation:
      "Paragraph D describes how many hives exhaust the available flowers, leaving wild pollinators with too little food.",
    evidence: "Paragraph D: 'they can exhaust the available flowers'",
    skillTags: ["multiple choice", "main idea"],
    difficulty: 3,
    options: [
      ["A", "the honey produced is of poor quality"],
      ["B", "bees become more aggressive towards people"],
      ["C", "bees may run out of flowers, harming wild pollinators"],
      ["D", "the hives become too heavy for rooftops"],
    ],
    correct: ["C"],
  }),
  textQ({
    id: "ar-p2-q21",
    type: "summary_completion",
    passageId: "ar-p2",
    prompt:
      "Complete the summary. Choose a word from the passage.\nUrban beekeeping has grown because cities offer bees a __________ diet and fewer agricultural pesticides.",
    explanation:
      "Paragraph B says cities can offer bees a 'surprisingly rich diet'.",
    evidence: "Paragraph B",
    skillTags: ["summary completion", "paraphrase"],
    difficulty: 3,
    wordLimit: 1,
    allowNumber: false,
    correctAnswer: "rich",
  }),
  textQ({
    id: "ar-p2-q22",
    type: "short_answer",
    passageId: "ar-p2",
    prompt: "How many foraging bees can a single honeybee colony contain?",
    explanation: "Paragraph C states up to 50,000 foraging bees.",
    evidence: "Paragraph C: 'up to 50,000 foraging bees'",
    skillTags: ["short answer", "number"],
    difficulty: 1,
    wordLimit: 2,
    allowNumber: true,
    correctAnswer: "50000",
    acceptableAnswers: ["50,000", "50000 bees"],
  }),
  textQ({
    id: "ar-p2-q23",
    type: "true_false_not_given",
    passageId: "ar-p2",
    prompt:
      "Urban bees always produce less honey than rural bees.",
    explanation:
      "The passage says several studies found urban bees can produce MORE honey per hive than rural bees, so False.",
    evidence: "Paragraph B: 'urban bees can produce more honey per hive'",
    skillTags: ["true false not given", "detail"],
    difficulty: 2,
    correctAnswer: "false",
  }),
  choiceQ({
    id: "ar-p2-q24",
    type: "multiple_choice",
    passageId: "ar-p2",
    prompt: "Why do city hives face fewer agricultural pesticides than rural hives?",
    explanation: "The passage says the insecticides most harmful to bees are more common in intensive agriculture.",
    evidence: "Paragraph C",
    skillTags: ["multiple choice", "detail"],
    difficulty: 2,
    options: [
      ["A", "cities use no chemicals at all"],
      ["B", "the most harmful insecticides are more common in intensive agriculture"],
      ["C", "urban air pollution destroys pesticides"],
    ],
    correct: ["B"],
  }),
  textQ({
    id: "ar-p2-q25",
    type: "note_completion",
    passageId: "ar-p2",
    prompt:
      "Complete the notes. Experts recommend planting more bee-friendly flowers, limiting hive density, and encouraging proper __________.",
    explanation: "The final paragraph recommends training for beekeepers.",
    evidence: "Paragraph E",
    skillTags: ["note completion", "detail"],
    difficulty: 2,
    wordLimit: 1,
    allowNumber: false,
    correctAnswer: "training",
  }),
  choiceQ({
    id: "ar-p2-q26",
    type: "multiple_choice",
    passageId: "ar-p2",
    prompt: "What is the writer's overall conclusion about urban beekeeping?",
    explanation: "The passage concludes it should be managed responsibly, not abandoned.",
    evidence: "Paragraph E",
    skillTags: ["multiple choice", "main idea"],
    difficulty: 3,
    options: [
      ["A", "it should be banned in cities"],
      ["B", "it should be managed responsibly"],
      ["C", "it should be left entirely unregulated"],
    ],
    correct: ["B"],
  }),
];

const passage3: Passage = {
  id: "ar-p3",
  title: "How Memory Works: Encoding, Storage and Retrieval",
  body: `Memory is not a single mental process but a collection of systems that allow us to record, retain and reconstruct experience. Psychologists commonly describe three stages of memory: encoding, in which information is first converted into a form the brain can hold; storage, in which it is maintained over time; and retrieval, in which it is brought back into consciousness.

Encoding can occur automatically or through effort. Automatic encoding happens without deliberate attention, which is why people can often describe what they ate for breakfast without having tried to remember it. Effortful encoding, by contrast, requires focused study and is greatly strengthened by elaboration — the process of linking new information to what is already known. This is why a student who relates a new idea to personal experience tends to remember it better than one who merely rereads a textbook.

Storage is not a passive filing system. Information is held in several forms: sensory memory, which lasts only a fraction of a second; short-term memory, which can hold a limited amount of information for around twenty seconds; and long-term memory, which has a vast capacity and can persist for a lifetime. The transfer of information from short-term to long-term memory is aided by consolidation, a process that appears to occur partly during sleep.

Retrieval is the stage most students overlook. The act of recalling information is itself a powerful way of strengthening memory — a phenomenon known as the testing effect. Repeated testing has been shown to produce more durable learning than repeated study, yet many learners continue to rely on passive rereading, a strategy that produces an illusion of familiarity without genuine retention.

Memory is also reconstructive rather than a perfect recording. When we recall an event, we do not replay a video; we rebuild it from fragments, filling gaps with plausible detail. This is why eyewitness testimony can be unreliable, and why two honest witnesses may give very different accounts of the same event.

Finally, forgetting is not necessarily a failure. The brain appears to forget irrelevant information in order to make efficient use of its resources. Forgetting the details of an unimportant meeting may free capacity for information that matters more. Understanding this can help learners stop fearing forgetfulness and instead adopt strategies — spacing, testing and elaboration — that work with, rather than against, the brain's natural processes.`,
  section: "Passage 3",
  sourceType: "ORIGINAL",
  license: "Original content © IELTS Study OS contributors (CC0)",
};

const passage3Questions: Question[] = [
  textQ({
    id: "ar-p3-q24",
    type: "yes_no_not_given",
    passageId: "ar-p3",
    prompt:
      "The writer believes that rereading is the most effective study technique.",
    explanation:
      "The writer criticises passive rereading as producing 'an illusion of familiarity without genuine retention', so No.",
    evidence: "Paragraph 4: 'an illusion of familiarity without genuine retention'",
    skillTags: ["yes no not given", "writer's view"],
    difficulty: 3,
    correctAnswer: "no",
  }),
  textQ({
    id: "ar-p3-q25",
    type: "yes_no_not_given",
    passageId: "ar-p3",
    prompt:
      "The writer suggests that forgetting is always a sign of a failing memory.",
    explanation:
      "The writer says forgetting is 'not necessarily a failure', so No.",
    evidence: "Paragraph 6: 'forgetting is not necessarily a failure'",
    skillTags: ["yes no not given", "writer's view"],
    difficulty: 2,
    correctAnswer: "no",
  }),
  textQ({
    id: "ar-p3-q26",
    type: "yes_no_not_given",
    passageId: "ar-p3",
    prompt:
      "The writer claims that all memories are stored in a single unified system.",
    explanation:
      "The opening sentence says memory is 'a collection of systems', so No.",
    evidence: "Paragraph 1: 'a collection of systems'",
    skillTags: ["yes no not given", "writer's view"],
    difficulty: 2,
    correctAnswer: "no",
  }),
  matchingQ({
    id: "ar-p3-q27",
    type: "matching_sentence_endings",
    passageId: "ar-p3",
    prompt: "Complete each sentence with the correct ending (A–F).",
    explanation:
      "Match by meaning and grammar: each stem pairs with exactly one ending from the passage.",
    skillTags: ["matching sentence endings", "grammar"],
    difficulty: 4,
    options: [
      ["A", "happens without deliberate attention"],
      ["B", "occurs partly during sleep"],
      ["C", "is strengthened by linking new and old knowledge"],
      ["D", "is a powerful way to strengthen memory"],
      ["E", "lasts only a fraction of a second"],
      ["F", "frees capacity for more important information"],
    ],
    items: [
      ["s1", "Automatic encoding", "A"],
      ["s2", "Elaboration", "C"],
      ["s3", "Consolidation", "B"],
      ["s4", "Retrieval practice", "D"],
    ],
  }),
  textQ({
    id: "ar-p3-q31",
    type: "short_answer",
    passageId: "ar-p3",
    prompt:
      "Which type of memory has the largest capacity according to the passage?",
    explanation: "Paragraph 3: long-term memory 'has a vast capacity'.",
    evidence: "Paragraph 3",
    skillTags: ["short answer", "detail"],
    difficulty: 1,
    wordLimit: 3,
    correctAnswer: "long-term memory",
  }),
  choiceQ({
    id: "ar-p3-q32",
    type: "multiple_choice",
    passageId: "ar-p3",
    prompt: "Why can two honest witnesses give different accounts of the same event?",
    explanation:
      "Memory is reconstructive; we rebuild events from fragments, so accounts differ.",
    evidence: "Paragraph 5: 'we rebuild it from fragments'",
    skillTags: ["multiple choice", "detail"],
    difficulty: 3,
    options: [
      ["A", "because one of them is always lying"],
      ["B", "because memory is reconstructed rather than replayed"],
      ["C", "because events are too short to remember"],
      ["D", "because witnesses rarely pay attention"],
    ],
    correct: ["B"],
  }),
  textQ({
    id: "ar-p3-q33",
    type: "sentence_completion",
    passageId: "ar-p3",
    prompt:
      "Short-term memory can hold information for around __________ seconds.",
    explanation: "Paragraph 3 states 'around twenty seconds'.",
    evidence: "Paragraph 3",
    skillTags: ["sentence completion", "number"],
    difficulty: 1,
    wordLimit: 2,
    allowNumber: true,
    correctAnswer: "twenty",
    acceptableAnswers: ["20"],
  }),
  textQ({
    id: "ar-p3-q34",
    type: "yes_no_not_given",
    passageId: "ar-p3",
    prompt:
      "The writer believes repeated testing produces more durable learning than repeated study.",
    explanation: "Paragraph 4 states this directly, so Yes.",
    evidence: "Paragraph 4: 'Repeated testing has been shown to produce more durable learning than repeated study'",
    skillTags: ["yes no not given", "writer's view"],
    difficulty: 1,
    correctAnswer: "yes",
  }),
  textQ({
    id: "ar-p3-q35",
    type: "note_completion",
    passageId: "ar-p3",
    prompt:
      "Complete the notes. The three stages of memory are encoding, storage and __________.",
    explanation: "Paragraph 1 lists the three stages: encoding, storage and retrieval.",
    evidence: "Paragraph 1",
    skillTags: ["note completion", "detail"],
    difficulty: 1,
    wordLimit: 1,
    allowNumber: false,
    correctAnswer: "retrieval",
  }),
  choiceQ({
    id: "ar-p3-q36",
    type: "multiple_choice",
    passageId: "ar-p3",
    prompt: "What is the 'testing effect'?",
    explanation: "Paragraph 4: the act of recalling information strengthens memory.",
    evidence: "Paragraph 4",
    skillTags: ["multiple choice", "detail"],
    difficulty: 2,
    options: [
      ["A", "tests make students anxious"],
      ["B", "recalling information strengthens memory"],
      ["C", "testing is faster than studying"],
    ],
    correct: ["B"],
  }),
  choiceQ({
    id: "ar-p3-q37",
    type: "multiple_choice",
    passageId: "ar-p3",
    prompt: "Why can eyewitness testimony be unreliable?",
    explanation: "Paragraph 5: memory is reconstructive — we rebuild events from fragments.",
    evidence: "Paragraph 5",
    skillTags: ["multiple choice", "detail"],
    difficulty: 2,
    options: [
      ["A", "witnesses usually lie"],
      ["B", "memory is reconstructive, not a perfect recording"],
      ["C", "events happen too quickly"],
    ],
    correct: ["B"],
  }),
];

export const academicReadingSet: PracticeSet = {
  meta: {
    id: "academic-reading-1",
    title: "Academic Reading Set 1",
    skill: "reading",
    testType: "academic",
    sourceType: "ORIGINAL",
    sourceName: "IELTS Study OS contributors",
    license: "Original content (CC0)",
    copyrightStatus: "Original, freely redistributable",
    academicOrGeneral: "academic",
    questionTypes: [
      "matching_headings",
      "true_false_not_given",
      "sentence_completion",
      "short_answer",
      "matching_information",
      "multiple_choice",
      "summary_completion",
      "yes_no_not_given",
      "matching_sentence_endings",
    ],
    difficulty: 3,
    estimatedBandRange: { min: 5, max: 8.5 },
    createdAt: "2026-01-01",
    generatedByAI: false,
    reviewStatus: "published",
  },
  kind: "reading",
  passages: [passage1, passage2, passage3],
  questions: [...passage1Questions, ...passage2Questions, ...passage3Questions],
};
