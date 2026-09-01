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
  // --- Academic Task 1 (expanded) ---
  {
    id: "acad-t1-pie",
    testType: "academic",
    task: 1,
    title: "Government spending (pie charts)",
    prompt:
      "The pie charts below show how a national government spent its budget in two different years. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visualType: "pie chart",
    visualDescription:
      "2000: education 35%, health 30%, defence 20%, transport 10%, other 5%. 2020: health 40%, education 25%, defence 15%, transport 12%, other 8%.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "acad-t1-table",
    testType: "academic",
    task: 1,
    title: "Rail passengers (table)",
    prompt:
      "The table below shows the number of rail passengers (in millions) in four regions in 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visualType: "table",
    dataTable: { columns: ["Region", "2010", "2020"], rows: [["North", "42", "58"], ["South", "65", "61"], ["East", "18", "34"], ["West", "29", "47"]] },
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "acad-t1-mixed",
    testType: "academic",
    task: 1,
    title: "Energy mix (mixed chart)",
    prompt:
      "The bar chart below shows electricity generation by source in a country, and the table shows average household electricity prices over the same period. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visualType: "mixed (bar + table)",
    visualDescription:
      "Generation (GWh): coal 320→210, gas 250→180, nuclear 150→160, renewables 60→220. Price (cents/kWh): 2010 12.5, 2015 15.0, 2020 18.5.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "acad-t1-process-2",
    testType: "academic",
    task: 1,
    title: "Coffee production (process)",
    prompt:
      "The diagram below shows how coffee is produced from beans to cup. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visualType: "process diagram",
    visualDescription:
      "Steps: cherries picked by hand → sorted and washed → dried in the sun → hulled to remove outer layers → beans roasted → ground → brewed with hot water → served.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "acad-t1-map-2",
    testType: "academic",
    task: 1,
    title: "Campus library (maps)",
    prompt:
      "The maps below show the ground floor of a university library before and after renovation. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visualType: "maps",
    visualDescription:
      "Before: entrance, issue desk, bookshelves, small reading area. After: self-service machines, larger computer zone, quiet study rooms, cafe replacing part of the bookshelves.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "acad-t1-bar-2",
    testType: "academic",
    task: 1,
    title: "Commuting modes (bar chart)",
    prompt:
      "The bar chart below shows the percentage of workers using different modes of transport to commute in a city in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visualType: "bar chart",
    visualDescription:
      "Car 65→45, bus 20→25, train 8→18, bicycle 4→9, walk 3→3 (percent).",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  // --- General Training Task 1 (expanded) ---
  {
    id: "gen-t1-apology",
    testType: "general",
    task: 1,
    title: "Apology letter",
    prompt:
      "You missed a meeting with a colleague because of an unexpected emergency. Write a letter to apologise. In your letter: explain why you missed the meeting, say how you plan to make up for it, suggest a new time to meet.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "gen-t1-application",
    testType: "general",
    task: 1,
    title: "Job application letter",
    prompt:
      "You have seen a job advertisement for a part-time position at a local museum. Write a letter to apply. In your letter: explain why you are interested in the job, describe your relevant experience, say when you are available for an interview.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "gen-t1-recommend",
    testType: "general",
    task: 1,
    title: "Recommendation letter",
    prompt:
      "A friend has asked you to recommend a place for a family holiday. Write a letter to your friend. In your letter: recommend a place you know well, describe what the family can do there, explain why it is suitable for a family.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "gen-t1-thanks",
    testType: "general",
    task: 1,
    title: "Thank-you letter",
    prompt:
      "You recently stayed with a host family during a study trip. Write a letter to thank them. In your letter: say what you enjoyed about your stay, mention something you learned from them, invite them to visit you.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  {
    id: "gen-t1-info",
    testType: "general",
    task: 1,
    title: "Letter asking for information",
    prompt:
      "You are moving to a new city and need information about renting a flat. Write a letter to a local letting agency. In your letter: describe the type of flat you need, ask about rental costs and contracts, ask about the best areas to live.",
    wordLimit: 150,
    suggestedMinutes: 20,
    sourceType: "ORIGINAL",
  },
  // --- Task 2 (expanded) ---
  {
    id: "t2-agree-2",
    testType: "academic",
    task: 2,
    title: "Agree/disagree: university education",
    prompt:
      "Some people believe that university education should be free for everyone. To what extent do you agree or disagree?",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-both-2",
    testType: "academic",
    task: 2,
    title: "Discuss both views: advertising",
    prompt:
      "Some people think advertising is a harmless form of entertainment, while others believe it manipulates people into buying things they do not need. Discuss both views and give your own opinion.",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-problem-2",
    testType: "general",
    task: 2,
    title: "Problem/solution: plastic waste",
    prompt:
      "Plastic waste is damaging the environment in many countries. What problems does plastic waste cause, and what measures can be taken to reduce it?",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-adv-2",
    testType: "general",
    task: 2,
    title: "Advantages/disadvantages: online learning",
    prompt:
      "More and more students are choosing to study online rather than attend classes in person. Do the advantages of this trend outweigh the disadvantages?",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-two-part-2",
    testType: "academic",
    task: 2,
    title: "Two-part: ageing population",
    prompt:
      "In many developed countries, the average age of the population is increasing. What problems does this cause for individuals and society? What can be done to deal with these problems?",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-agree-3",
    testType: "general",
    task: 2,
    title: "Agree/disagree: city living",
    prompt:
      "Some people believe that living in a large city has more disadvantages than advantages. To what extent do you agree or disagree?",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-both-3",
    testType: "academic",
    task: 2,
    title: "Discuss both views: space exploration",
    prompt:
      "Some people believe space exploration is a waste of money, while others think it is essential for humanity's future. Discuss both views and give your own opinion.",
    wordLimit: 250,
    suggestedMinutes: 40,
    sourceType: "ORIGINAL",
  },
  {
    id: "t2-problem-3",
    testType: "academic",
    task: 2,
    title: "Problem/solution: food waste",
    prompt:
      "A large amount of food is wasted every day in many countries. Why is this happening, and what can individuals do to reduce food waste?",
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
