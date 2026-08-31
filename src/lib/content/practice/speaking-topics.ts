import type { SpeakingTopic } from "@/types/ielts";

// Extensible speaking topic library. Part 2 cue cards follow the
// "Describe… You should say…" structure used in the real test.
export const speakingTopics: SpeakingTopic[] = [
  {
    id: "work",
    name: "Work",
    tags: ["work", "career", "jobs"],
    part1Questions: [
      "Do you work or are you a student?",
      "What do you like most about your work?",
      "What kind of work would you like to do in the future?",
    ],
    part2CueCards: [
      {
        id: "work-1",
        topic: "A job you would like to have",
        prompt: "Describe a job you would like to have in the future.",
        bullets: [
          "what the job is",
          "what you would need to do in this job",
          "why you are interested in it",
        ],
        followUp: "and explain why you think you would be good at this job.",
      },
    ],
    part3Questions: [
      "What jobs are most respected in your country?",
      "Is it better to change jobs often or stay in one job for a long time?",
    ],
  },
  {
    id: "study",
    name: "Study",
    tags: ["study", "education", "school"],
    part1Questions: [
      "What subject are you studying?",
      "Why did you choose this subject?",
      "Do you prefer studying alone or with others?",
    ],
    part2CueCards: [
      {
        id: "study-1",
        topic: "A subject you enjoyed at school",
        prompt: "Describe a subject you enjoyed studying at school.",
        bullets: ["what the subject was", "who taught it", "what you learned"],
        followUp: "and explain why you enjoyed it.",
      },
    ],
    part3Questions: [
      "Should schools focus more on practical or academic skills?",
      "How has technology changed the way students learn?",
    ],
  },
  {
    id: "hometown",
    name: "Hometown",
    tags: ["hometown", "city", "places"],
    part1Questions: [
      "Where is your hometown?",
      "What do you like about your hometown?",
      "Has your hometown changed much in recent years?",
    ],
    part2CueCards: [
      {
        id: "hometown-1",
        topic: "A place in your hometown you like",
        prompt: "Describe a place in your hometown that you like visiting.",
        bullets: ["where it is", "what you can do there", "who you go with"],
        followUp: "and explain why you like this place.",
      },
    ],
    part3Questions: [
      "Why do some people prefer living in small towns?",
      "What are the advantages of living in a big city?",
    ],
  },
  {
    id: "home",
    name: "Home",
    tags: ["home", "accommodation", "living"],
    part1Questions: [
      "Do you live in a house or an apartment?",
      "What is your favourite room?",
      "Would you like to change anything about your home?",
    ],
    part2CueCards: [
      {
        id: "home-1",
        topic: "An ideal home",
        prompt: "Describe your ideal home.",
        bullets: ["where it would be", "what it would look like", "who would live there"],
        followUp: "and explain why this would be your ideal home.",
      },
    ],
    part3Questions: [
      "Why do housing prices differ so much between cities?",
      "Is it better to rent or buy a home?",
    ],
  },
  {
    id: "technology",
    name: "Technology",
    tags: ["technology", "internet", "digital"],
    part1Questions: [
      "How often do you use your phone?",
      "What technology could you not live without?",
      "Has technology made your life easier?",
    ],
    part2CueCards: [
      {
        id: "tech-1",
        topic: "A useful piece of technology",
        prompt: "Describe a piece of technology that you find useful.",
        bullets: ["what it is", "how you use it", "how it has changed your life"],
        followUp: "and explain why you find it so useful.",
      },
    ],
    part3Questions: [
      "What are the dangers of children using technology too much?",
      "How will artificial intelligence change our daily lives?",
    ],
  },
  {
    id: "travel",
    name: "Travel",
    tags: ["travel", "tourism", "holiday"],
    part1Questions: [
      "Do you like travelling?",
      "Where did you go on your last holiday?",
      "Do you prefer travelling alone or with others?",
    ],
    part2CueCards: [
      {
        id: "travel-1",
        topic: "A memorable journey",
        prompt: "Describe a memorable journey you have taken.",
        bullets: ["where you went", "how you travelled", "what happened during the journey"],
        followUp: "and explain why it was memorable.",
      },
    ],
    part3Questions: [
      "What are the advantages and disadvantages of tourism for a country?",
      "How has travel changed over the last few decades?",
    ],
  },
  {
    id: "environment",
    name: "Environment",
    tags: ["environment", "climate", "nature"],
    part1Questions: [
      "Do you do anything to help the environment?",
      "Is recycling common in your area?",
      "What environmental issue concerns you most?",
    ],
    part2CueCards: [
      {
        id: "env-1",
        topic: "An environmental problem",
        prompt: "Describe an environmental problem in your country.",
        bullets: ["what the problem is", "what causes it", "how it affects people"],
        followUp: "and explain what could be done about it.",
      },
    ],
    part3Questions: [
      "Should governments or individuals take more responsibility for the environment?",
      "What role should renewable energy play in the future?",
    ],
  },
  {
    id: "health",
    name: "Health",
    tags: ["health", "fitness", "lifestyle"],
    part1Questions: [
      "What do you do to stay healthy?",
      "Do you think you have a healthy diet?",
      "How much exercise do you get each week?",
    ],
    part2CueCards: [
      {
        id: "health-1",
        topic: "A healthy habit",
        prompt: "Describe a healthy habit you have or would like to have.",
        bullets: ["what the habit is", "when you started it", "how it helps you"],
        followUp: "and explain why you think it is important.",
      },
    ],
    part3Questions: [
      "Why do many people find it hard to stay healthy?",
      "Should the government do more to promote public health?",
    ],
  },
  {
    id: "books",
    name: "Books & Media",
    tags: ["books", "media", "reading"],
    part1Questions: [
      "Do you enjoy reading books?",
      "What kind of books do you like?",
      "Do you prefer paper books or e-books?",
    ],
    part2CueCards: [
      {
        id: "books-1",
        topic: "A book that influenced you",
        prompt: "Describe a book that had an influence on you.",
        bullets: ["what the book was", "when you read it", "what it was about"],
        followUp: "and explain how it influenced you.",
      },
    ],
    part3Questions: [
      "Why do some people prefer watching films to reading books?",
      "Will printed books disappear in the future?",
    ],
  },
  {
    id: "food",
    name: "Food",
    tags: ["food", "cooking", "culture"],
    part1Questions: [
      "What is your favourite food?",
      "Do you enjoy cooking?",
      "What food is popular in your country?",
    ],
    part2CueCards: [
      {
        id: "food-1",
        topic: "A special meal",
        prompt: "Describe a special meal you enjoyed.",
        bullets: ["where you had it", "who you were with", "what you ate"],
        followUp: "and explain why it was special.",
      },
    ],
    part3Questions: [
      "Why has fast food become so popular?",
      "Is traditional food being lost in your country?",
    ],
  },
  {
    id: "future",
    name: "Future",
    tags: ["future", "plans", "ambition"],
    part1Questions: [
      "What are your plans for the future?",
      "Where do you see yourself in five years?",
      "Is it important to plan for the future?",
    ],
    part2CueCards: [
      {
        id: "future-1",
        topic: "A goal you want to achieve",
        prompt: "Describe a goal you hope to achieve in the future.",
        bullets: ["what the goal is", "when you set it", "what you need to do to achieve it"],
        followUp: "and explain why this goal is important to you.",
      },
    ],
    part3Questions: [
      "Why do some people achieve their goals while others do not?",
      "Should young people be encouraged to have ambitious goals?",
    ],
  },
  {
    id: "society",
    name: "Society",
    tags: ["society", "culture", "cities"],
    part1Questions: [
      "How would you describe the people in your country?",
      "What changes would you like to see in your society?",
      "Is your country a good place to live?",
    ],
    part2CueCards: [
      {
        id: "society-1",
        topic: "A social change you would like to see",
        prompt: "Describe a change you would like to see in your society.",
        bullets: ["what the change is", "why it is needed", "how it could be achieved"],
        followUp: "and explain what difference it would make.",
      },
    ],
    part3Questions: [
      "What responsibilities do individuals have to society?",
      "How do social values change from one generation to the next?",
    ],
  },
];

export function getSpeakingTopic(id: string): SpeakingTopic | undefined {
  return speakingTopics.find((t) => t.id === id);
}

export function allSpeakingTags(): string[] {
  const tags = new Set<string>();
  for (const t of speakingTopics) for (const tag of t.tags) tags.add(tag);
  return [...tags];
}
