import type { WritingPrompt } from "@/types/ielts";

export const writingPrompts: WritingPrompt[] = [
  // --- Academic Task 1 ---
  {
    id: "acad-t1-line",
    testType: "academic",
    task: 1,
    title: "Internet users by age group (line graph)",
    prompt:
      "The line graph below shows the percentage of people in three age groups who used the internet in a European country between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visualType: "line graph",
    visualDescription:
      "Three lines (16-24, 25-54, 55+). 16-24 rises from 40% to nearly 100% by 2010 and stays flat. 25-54 rises steadily from 25% to 95%. 55+ starts at 5%, stays low until 2010, then rises sharply to 60% by 2020.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "acad-t1-bar",
    testType: "academic",
    task: 1,
    title: "Household energy consumption (bar chart)",
    prompt:
      "The bar chart below shows the average monthly energy consumption in kilowatt-hours for five household activities in 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visualType: "bar chart",
    visualDescription:
      "Five bars pairs (2010 vs 2020): heating 500→380, cooling 120→210, lighting 80→60, appliances 200→260, water heating 150→170.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "acad-t1-process",
    testType: "academic",
    task: 1,
    title: "Recycling plastic bottles (process)",
    prompt:
      "The diagram below shows the process by which plastic bottles are recycled. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visualType: "process diagram",
    visualDescription:
      "Steps: 1) bottles collected from homes, 2) sorted by type at a facility, 3) cleaned and crushed into flakes, 4) flakes melted into pellets, 5) pellets moulded into new products, 6) products sold and used again.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "acad-t1-map",
    testType: "academic",
    task: 1,
    title: "Town centre redevelopment (maps)",
    prompt:
      "The maps below show the centre of a small town in 2000 and the proposed redevelopment for 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visualType: "maps",
    visualDescription:
      "2000: main road, small shops, a car park, an old factory. 2025 plan: pedestrian zone, shopping centre, park, new bus station replacing the car park, factory converted into apartments.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  // --- General Training Task 1 ---
  {
    id: "gen-t1-complaint",
    testType: "general",
    task: 1,
    title: "Complaint letter",
    prompt:
      "You recently bought a laptop online, but it arrived damaged. Write a letter to the store. In your letter: describe the problem with the laptop, explain how this has affected you, say what you would like the store to do.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "gen-t1-invite",
    testType: "general",
    task: 1,
    title: "Invitation letter (informal)",
    prompt:
      "Your friend is visiting your city next month. Write a letter to invite them to stay with you. In your letter: suggest some activities you could do together, describe where you live, offer to help them plan their visit.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "gen-t1-request",
    testType: "general",
    task: 1,
    title: "Request for information (formal)",
    prompt:
      "You would like to enrol in a language course at a college in another city. Write a letter to the admissions office. In your letter: explain why you want to take the course, ask about course dates and fees, ask about accommodation options.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  // --- Task 2 ---
  {
    id: "t2-agree",
    testType: "academic",
    task: 2,
    title: "Agree/disagree: technology in education",
    prompt:
      "Some people believe that computers and the internet will soon replace teachers in the classroom. To what extent do you agree or disagree?",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-both-views",
    testType: "academic",
    task: 2,
    title: "Discuss both views: remote work",
    prompt:
      "Some people think that working from home benefits employees more than employers, while others believe the opposite. Discuss both views and give your own opinion.",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-problem-solution",
    testType: "academic",
    task: 2,
    title: "Problem/solution: urban congestion",
    prompt:
      "Traffic congestion is a growing problem in many large cities. What problems does this cause, and what measures could be taken to solve them?",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-adv-disadv",
    testType: "general",
    task: 2,
    title: "Advantages/disadvantages: tourism",
    prompt:
      "International tourism has become a huge industry, but it also creates problems for local communities. Do the advantages of international tourism outweigh the disadvantages?",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-positive-negative",
    testType: "general",
    task: 2,
    title: "Positive/negative: social media",
    prompt:
      "Social media has changed the way people communicate with each other. Is this a positive or negative development?",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-two-part",
    testType: "academic",
    task: 2,
    title: "Two-part: childhood obesity",
    prompt:
      "In many countries, the number of children who are overweight is increasing. Why is this happening? What can be done to solve this problem?",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
];

export function getWritingPrompt(id: string): WritingPrompt | undefined {
  return writingPrompts.find((p) => p.id === id);
}

export function getWritingPrompts(testType?: "academic" | "general", task?: 1 | 2): WritingPrompt[] {
  return writingPrompts.filter(
    (p) => (!testType || p.testType === testType) && (!task || p.task === task),
  );
}
