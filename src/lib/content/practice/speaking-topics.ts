import type { SpeakingTopic } from "@/types/ielts";

const baseTopics: SpeakingTopic[] = [
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

// --- Additional topic banks (Part 1 / Part 2 / Part 3) ---
// These are original topic-practice questions, NOT leaked real exam questions.
const moreTopics: SpeakingTopic[] = [
  { id: "daily-routine", name: "Daily Routine", tags: ["routine", "time", "habits"], part1Questions: ["What is your typical morning routine?", "Do you prefer to plan your day or go with the flow?", "Has your daily routine changed much in recent years?"], part2CueCards: [{ id: "daily-1", topic: "A typical day", prompt: "Describe a typical day in your life.", bullets: ["what you do in the morning", "what you do during the day", "what you do in the evening"], followUp: "and explain what you enjoy most about this routine." }], part3Questions: ["Why do some people prefer fixed routines while others prefer variety?", "How has technology changed people's daily routines?", "Is it important to have a good work-life balance?" ] },
  { id: "sports", name: "Sports & Fitness", tags: ["sports", "fitness", "exercise"], part1Questions: ["Do you play any sports?", "What sports are popular in your country?", "Do you prefer watching or playing sports?"], part2CueCards: [{ id: "sports-1", topic: "A sport you enjoy", prompt: "Describe a sport you enjoy playing or watching.", bullets: ["what the sport is", "how you first learned about it", "who you play or watch it with"], followUp: "and explain why you enjoy it." }], part3Questions: ["Why are some sports more popular than others?", "Should children be encouraged to play competitive sports?", "What role do professional athletes play in society?" ] },
  { id: "music", name: "Music", tags: ["music", "art", "leisure"], part1Questions: ["What kind of music do you like?", "Do you play a musical instrument?", "When do you usually listen to music?"], part2CueCards: [{ id: "music-1", topic: "A song you like", prompt: "Describe a song or piece of music that is special to you.", bullets: ["what it is", "when you first heard it", "how it makes you feel"], followUp: "and explain why it is special to you." }], part3Questions: ["Why do people's musical tastes change as they get older?", "Is music education important in schools?", "How has streaming changed the music industry?" ] },
  { id: "films", name: "Films & TV", tags: ["films", "tv", "media"], part1Questions: ["Do you enjoy watching films?", "What kind of films do you like?", "Do you prefer watching films at home or in the cinema?"], part2CueCards: [{ id: "films-1", topic: "A film you enjoyed", prompt: "Describe a film you enjoyed watching.", bullets: ["what the film was", "when you watched it", "what it was about"], followUp: "and explain why you enjoyed it." }], part3Questions: ["Why do some films become popular worldwide?", "Are foreign films important for understanding other cultures?", "How has online streaming changed the way people watch films?" ] },
  { id: "news-media", name: "News & Media", tags: ["news", "media", "information"], part1Questions: ["How do you usually get your news?", "Do you read news every day?", "What kind of news interests you most?"], part2CueCards: [{ id: "news-1", topic: "A news story you remember", prompt: "Describe a news story that you remember well.", bullets: ["what the story was about", "where you saw or heard it", "how people reacted to it"], followUp: "and explain why you remember it." }], part3Questions: ["Is it important to follow the news?", "How has social media changed how people consume news?", "Should governments control what news is published?" ] },
  { id: "social-media", name: "Social Media", tags: ["social media", "internet", "communication"], part1Questions: ["Which social media apps do you use?", "How much time do you spend on social media?", "Do you think social media is good or bad?"], part2CueCards: [{ id: "social-1", topic: "A social media app", prompt: "Describe a social media app you use often.", bullets: ["what the app is", "how you use it", "who you connect with on it"], followUp: "and explain why you use it." }], part3Questions: ["What are the advantages and disadvantages of social media?", "How does social media affect young people?", "Should there be age restrictions on social media?" ] },
  { id: "technology-phones", name: "Technology & Phones", tags: ["technology", "phones", "digital"], part1Questions: ["How often do you use your phone?", "What do you mainly use your phone for?", "Do you think people spend too much time on their phones?"], part2CueCards: [{ id: "phone-1", topic: "An app or device you rely on", prompt: "Describe a piece of technology you rely on daily.", bullets: ["what it is", "how you use it", "what life would be like without it"], followUp: "and explain why you rely on it." }], part3Questions: ["How have smartphones changed the way people communicate?", "What are the downsides of constant connectivity?", "Will technology ever replace face-to-face communication?" ] },
  { id: "photography", name: "Photography", tags: ["photography", "art", "memories"], part1Questions: ["Do you like taking photos?", "What do you usually take photos of?", "Do you prefer taking photos with a phone or a camera?"], part2CueCards: [{ id: "photo-1", topic: "A photo you like", prompt: "Describe a photograph that is meaningful to you.", bullets: ["what it shows", "when it was taken", "who took it"], followUp: "and explain why it is meaningful to you." }], part3Questions: ["Why do people enjoy taking photographs?", "Are photos a good way to preserve memories?", "How has digital photography changed society?" ] },
  { id: "cooking", name: "Cooking", tags: ["cooking", "food", "skills"], part1Questions: ["Do you enjoy cooking?", "Who usually cooks in your home?", "Can you cook any traditional dishes?"], part2CueCards: [{ id: "cooking-1", topic: "A dish you can cook", prompt: "Describe a dish you know how to cook.", bullets: ["what the dish is", "what ingredients you need", "how you cook it"], followUp: "and explain who taught you or how you learned." }], part3Questions: ["Why is home cooking becoming less common in some countries?", "Should cooking be taught in schools?", "How has the food industry changed people's eating habits?" ] },
  { id: "restaurants", name: "Restaurants & Eating Out", tags: ["restaurants", "food", "dining"], part1Questions: ["How often do you eat out?", "What kind of restaurants do you like?", "Do you prefer eating out or eating at home?"], part2CueCards: [{ id: "rest-1", topic: "A restaurant you like", prompt: "Describe a restaurant you enjoy visiting.", bullets: ["where it is", "what kind of food it serves", "who you go there with"], followUp: "and explain why you like it." }], part3Questions: ["Why do people enjoy eating out?", "Is fast food becoming more popular?", "How important is food to a country's culture?" ] },
  { id: "exercise", name: "Health & Exercise", tags: ["health", "exercise", "wellbeing"], part1Questions: ["How often do you exercise?", "What kind of exercise do you do?", "Do you think you are healthy?"], part2CueCards: [{ id: "exercise-1", topic: "An exercise you do", prompt: "Describe a form of exercise you do or would like to do.", bullets: ["what it is", "when you do it", "how it makes you feel"], followUp: "and explain why you do it." }], part3Questions: ["Why do many people find it hard to exercise regularly?", "Should the government promote healthy lifestyles?", "How can schools encourage children to be more active?" ] },
  { id: "holidays", name: "Holidays & Travel", tags: ["holidays", "travel", "leisure"], part1Questions: ["Do you like going on holiday?", "Where did you go on your last holiday?", "Do you prefer relaxing or active holidays?"], part2CueCards: [{ id: "holiday-1", topic: "A holiday you enjoyed", prompt: "Describe a holiday you really enjoyed.", bullets: ["where you went", "who you went with", "what you did there"], followUp: "and explain why you enjoyed it." }], part3Questions: ["Why is travel important to people?", "How has tourism changed in recent years?", "What are the benefits and drawbacks of cheap travel?" ] },
  { id: "transport", name: "Transport", tags: ["transport", "travel", "cities"], part1Questions: ["How do you usually travel around your city?", "Is public transport good where you live?", "Do you prefer driving or taking public transport?"], part2CueCards: [{ id: "transport-1", topic: "A form of transport", prompt: "Describe a form of transport you use regularly.", bullets: ["what it is", "how often you use it", "what you like or dislike about it"], followUp: "and explain why you use it." }], part3Questions: ["How can cities improve public transport?", "Will electric cars solve pollution problems?", "Why do people prefer private cars over public transport?" ] },
  { id: "countryside", name: "Countryside & Nature", tags: ["countryside", "nature", "environment"], part1Questions: ["Do you prefer the city or the countryside?", "How often do you visit the countryside?", "What do you like about nature?"], part2CueCards: [{ id: "country-1", topic: "A place in nature", prompt: "Describe a place in nature that you like.", bullets: ["where it is", "what it looks like", "what you can do there"], followUp: "and explain why you like it." }], part3Questions: ["Why do city dwellers enjoy visiting the countryside?", "Should more land be protected as nature reserves?", "How does urbanisation affect the environment?" ] },
  { id: "animals", name: "Animals & Pets", tags: ["animals", "pets", "nature"], part1Questions: ["Do you like animals?", "Did you have any pets growing up?", "What is your favourite animal?"], part2CueCards: [{ id: "animal-1", topic: "An animal you like", prompt: "Describe an animal you find interesting.", bullets: ["what the animal is", "where you have seen it", "what you know about it"], followUp: "and explain why you find it interesting." }], part3Questions: ["Why do people keep pets?", "Should wild animals be kept in zoos?", "How can we protect endangered species?" ] },
  { id: "weather", name: "Weather & Seasons", tags: ["weather", "seasons", "climate"], part1Questions: ["What is the weather like in your city?", "What is your favourite season?", "Does the weather affect your mood?"], part2CueCards: [{ id: "weather-1", topic: "A kind of weather you like", prompt: "Describe a type of weather you particularly enjoy.", bullets: ["what it is", "when it usually happens", "what you like to do in that weather"], followUp: "and explain why you enjoy it." }], part3Questions: ["How does weather affect people's daily lives?", "Is climate change affecting your country?", "Why do people in different regions react differently to the same weather?" ] },
  { id: "jobs", name: "Jobs & Careers", tags: ["jobs", "careers", "work"], part1Questions: ["What job would you like to do in the future?", "What do you think makes a good job?", "Would you prefer to work for a company or be self-employed?"], part2CueCards: [{ id: "job-1", topic: "A job that is important", prompt: "Describe a job that is important in society.", bullets: ["what the job is", "what the people do", "why it is important"], followUp: "and explain how it benefits society." }], part3Questions: ["Which jobs are most respected in your country?", "Will robots replace many human jobs?", "How can people choose the right career?" ] },
  { id: "business", name: "Business & Money", tags: ["business", "money", "economy"], part1Questions: ["Are you good at saving money?", "Do you prefer spending or saving?", "Have you ever run a small business or sold anything?"], part2CueCards: [{ id: "business-1", topic: "A business you would like to start", prompt: "Describe a business you would like to start.", bullets: ["what the business would be", "who your customers would be", "what you would need to start it"], followUp: "and explain why you would like to start it." }], part3Questions: ["Why do some people start their own business?", "Is it easier to start a business now than in the past?", "Should schools teach financial skills?" ] },
  { id: "shopping", name: "Shopping", tags: ["shopping", "consumerism", "lifestyle"], part1Questions: ["Do you enjoy shopping?", "Do you prefer shopping online or in stores?", "What do you usually buy?"], part2CueCards: [{ id: "shop-1", topic: "Something you bought recently", prompt: "Describe something you bought recently that you are happy with.", bullets: ["what it was", "where you bought it", "why you bought it"], followUp: "and explain why you are happy with it." }], part3Questions: ["Why has online shopping become so popular?", "Do advertisements influence what people buy?", "Is consumerism a problem in modern society?" ] },
  { id: "advertising", name: "Advertising", tags: ["advertising", "media", "consumerism"], part1Questions: ["Do you pay attention to advertisements?", "What kind of ads do you find annoying?", "Have you ever bought something because of an ad?"], part2CueCards: [{ id: "ad-1", topic: "An advertisement you remember", prompt: "Describe an advertisement you remember.", bullets: ["what it advertised", "where you saw it", "what made it memorable"], followUp: "and explain why you remember it." }], part3Questions: ["How effective is advertising today?", "Should advertising aimed at children be banned?", "How has online advertising changed the industry?" ] },
  { id: "fashion", name: "Fashion & Clothes", tags: ["fashion", "clothes", "culture"], part1Questions: ["Do you care about fashion?", "What kind of clothes do you like to wear?", "Where do you usually buy clothes?"], part2CueCards: [{ id: "fashion-1", topic: "An item of clothing you like", prompt: "Describe an item of clothing that you like wearing.", bullets: ["what it is", "where you got it", "when you wear it"], followUp: "and explain why you like it." }], part3Questions: ["Why do fashions change so quickly?", "Is it important to dress well?", "How does clothing reflect a person's identity?" ] },
  { id: "art", name: "Art", tags: ["art", "culture", "creativity"], part1Questions: ["Do you enjoy art?", "Have you ever visited an art gallery?", "Can you draw or paint?"], part2CueCards: [{ id: "art-1", topic: "A work of art", prompt: "Describe a painting, sculpture or artwork you have seen.", bullets: ["what it was", "where you saw it", "what it looked like"], followUp: "and explain why it impressed you." }], part3Questions: ["Why is art important in society?", "Should the government fund the arts?", "How has technology changed how art is created and shared?" ] },
  { id: "history", name: "History", tags: ["history", "culture", "society"], part1Questions: ["Did you enjoy history at school?", "What period of history interests you?", "Do you visit historical places?"], part2CueCards: [{ id: "history-1", topic: "A historical place", prompt: "Describe a historical place you have visited.", bullets: ["where it is", "what happened there", "what it looks like today"], followUp: "and explain why it interested you." }], part3Questions: ["Why is it important to preserve historical sites?", "Should history be a compulsory school subject?", "How do we know what really happened in the past?" ] },
  { id: "traditions", name: "Culture & Traditions", tags: ["traditions", "culture", "festivals"], part1Questions: ["What traditions are important in your country?", "How do you celebrate festivals?", "Are traditions changing in your country?"], part2CueCards: [{ id: "trad-1", topic: "A tradition in your country", prompt: "Describe a tradition in your country.", bullets: ["what the tradition is", "when and where it happens", "who takes part"], followUp: "and explain why it is important." }], part3Questions: ["Why are traditions important?", "Should young people be encouraged to keep traditions?", "How is globalisation affecting local cultures?" ] },
  { id: "festivals", name: "Festivals & Celebrations", tags: ["festivals", "celebrations", "culture"], part1Questions: ["What is your favourite festival?", "How do you usually celebrate special occasions?", "Are there any festivals you would like to attend?"], part2CueCards: [{ id: "fest-1", topic: "A festival you enjoy", prompt: "Describe a festival you enjoy celebrating.", bullets: ["what the festival is", "when it takes place", "how you celebrate it"], followUp: "and explain why you enjoy it." }], part3Questions: ["Why do people celebrate festivals?", "Are traditional festivals losing their meaning?", "How do festivals bring people together?" ] },
  { id: "language", name: "Language & Learning", tags: ["language", "learning", "education"], part1Questions: ["What languages do you speak?", "Why are you learning English?", "Do you find learning languages easy or difficult?"], part2CueCards: [{ id: "lang-1", topic: "A language you would like to learn", prompt: "Describe a language you would like to learn.", bullets: ["what the language is", "why you want to learn it", "how you would go about learning it"], followUp: "and explain how it would benefit you." }], part3Questions: ["Why is learning a second language important?", "Should children learn foreign languages from a young age?", "Will translation technology make language learning unnecessary?" ] },
  { id: "science", name: "Science", tags: ["science", "technology", "education"], part1Questions: ["Did you enjoy science at school?", "What area of science interests you?", "Do you read about scientific discoveries?"], part2CueCards: [{ id: "science-1", topic: "A scientific development", prompt: "Describe a scientific development that interests you.", bullets: ["what it is", "how it works", "how it affects people's lives"], followUp: "and explain why it interests you." }], part3Questions: ["How has science improved our lives?", "Should governments invest more in scientific research?", "What scientific breakthrough would you like to see?" ] },
  { id: "public-services", name: "Public Services", tags: ["public services", "government", "society"], part1Questions: ["What public services do you use regularly?", "Are you satisfied with public services in your area?", "Which public service do you think is most important?"], part2CueCards: [{ id: "service-1", topic: "A public service", prompt: "Describe a public service that you use.", bullets: ["what the service is", "how often you use it", "what you think of it"], followUp: "and explain why it is useful." }], part3Questions: ["Should public services be free?", "How can governments improve public services?", "Is private provision of public services a good idea?" ] },
  { id: "children", name: "Children & Family", tags: ["children", "family", "society"], part1Questions: ["Do you spend time with children?", "What did you enjoy doing as a child?", "Are children's lives different now compared to the past?"], part2CueCards: [{ id: "child-1", topic: "A childhood memory", prompt: "Describe a happy memory from your childhood.", bullets: ["what happened", "where it took place", "who was with you"], followUp: "and explain why you remember it." }], part3Questions: ["How has childhood changed in recent decades?", "Who has more influence on children, parents or friends?", "Should children have more free time or more structured activities?" ] },
  { id: "elderly", name: "Elderly People", tags: ["elderly", "society", "family"], part1Questions: ["Do you spend time with elderly people?", "What can young people learn from the elderly?", "How are elderly people treated in your country?"], part2CueCards: [{ id: "elderly-1", topic: "An elderly person you admire", prompt: "Describe an elderly person you admire.", bullets: ["who they are", "how you know them", "what you admire about them"], followUp: "and explain why you admire them." }], part3Questions: ["What challenges do elderly people face?", "How can society support an ageing population?", "Should the retirement age be increased?" ] },
  { id: "memory", name: "Memory", tags: ["memory", "mind", "psychology"], part1Questions: ["Do you have a good memory?", "How do you remember important things?", "Do you think memory can be improved?"], part2CueCards: [{ id: "memory-1", topic: "Something you will never forget", prompt: "Describe something you will never forget.", bullets: ["what it was", "when it happened", "why it is unforgettable"], followUp: "and explain how it affected you." }], part3Questions: ["Why do we forget some things and remember others?", "How has technology changed how we store memories?", "Are photographs important for memory?" ] },
  { id: "gifts", name: "Gifts & Objects", tags: ["gifts", "objects", "family"], part1Questions: ["Do you like giving or receiving gifts?", "What is the best gift you have received?", "How do you choose gifts for people?"], part2CueCards: [{ id: "gift-1", topic: "A gift you received", prompt: "Describe a gift you received that was special.", bullets: ["what the gift was", "who gave it to you", "why they gave it to you"], followUp: "and explain why it was special." }], part3Questions: ["Why do people give gifts?", "Are expensive gifts better than thoughtful gifts?", "How has online shopping changed gift-giving?" ] },
  { id: "places", name: "Places", tags: ["places", "cities", "travel"], part1Questions: ["What is your favourite place in your city?", "Do you like discovering new places?", "What kind of places do you enjoy visiting?"], part2CueCards: [{ id: "place-1", topic: "A place you would like to visit", prompt: "Describe a place you would like to visit.", bullets: ["where it is", "what you know about it", "what you would do there"], followUp: "and explain why you want to visit it." }], part3Questions: ["Why do some places become popular tourist destinations?", "How does tourism affect local communities?", "Is it better to travel to famous places or less-known places?" ] },
  { id: "events", name: "Events & Celebrations", tags: ["events", "celebrations", "society"], part1Questions: ["What kind of events do you enjoy attending?", "Have you ever organised an event?", "What is the most memorable event you have attended?"], part2CueCards: [{ id: "event-1", topic: "An event you attended", prompt: "Describe an event you attended that you enjoyed.", bullets: ["what the event was", "where and when it took place", "who you went with"], followUp: "and explain why you enjoyed it." }], part3Questions: ["Why do people enjoy attending public events?", "How do events bring communities together?", "Are large events good or bad for cities?" ] },
  { id: "future", name: "The Future", tags: ["future", "society", "technology"], part1Questions: ["How do you imagine your life in ten years?", "Are you optimistic about the future?", "What changes would you like to see in the world?"], part2CueCards: [{ id: "future-1", topic: "A future change", prompt: "Describe a change you hope to see in the future.", bullets: ["what the change is", "why it is needed", "how it could happen"], followUp: "and explain how it would improve people's lives." }], part3Questions: ["What will cities look like in the future?", "How will technology change work?", "What global problems need to be solved?" ] },
];

export const speakingTopics: SpeakingTopic[] = [...baseTopics, ...moreTopics];

export function getSpeakingTopic(id: string): SpeakingTopic | undefined {
  return speakingTopics.find((t) => t.id === id);
}

export function allSpeakingTags(): string[] {
  const tags = new Set<string>();
  for (const t of speakingTopics) for (const tag of t.tags) tags.add(tag);
  return [...tags];
}
