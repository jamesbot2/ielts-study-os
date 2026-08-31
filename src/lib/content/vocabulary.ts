// Built-in IELTS vocabulary learning library, organised by topic.
// Original, curated content. Learners can add any entry to their personal deck.

export interface VocabEntry {
  word: string;
  pos: string; // part of speech
  definitionEn: string;
  meaningZh: string;
  collocations: string[];
  example: string;
  band: "core" | "band6" | "band7";
  writingRelevance: boolean;
  speakingRelevance: boolean;
}

export interface VocabTopic {
  id: string;
  nameEn: string;
  nameZh: string;
  words: VocabEntry[];
}

export const vocabTopics: VocabTopic[] = [
  {
    id: "education",
    nameEn: "Education",
    nameZh: "教育",
    words: [
      { word: "curriculum", pos: "noun", definitionEn: "the subjects taught in a school or course", meaningZh: "课程体系", collocations: ["national curriculum", "broad curriculum", "curriculum design"], example: "The school has introduced coding into its curriculum.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "literacy", pos: "noun", definitionEn: "the ability to read and write", meaningZh: "读写能力", collocations: ["literacy rate", "digital literacy", "improve literacy"], example: "Improving adult literacy is a government priority.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "assess", pos: "verb", definitionEn: "to judge the quality or level of something", meaningZh: "评估", collocations: ["assess performance", "assess progress", "formally assess"], example: "Teachers assess students continuously throughout the year.", band: "band6", writingRelevance: true, speakingRelevance: false },
      { word: "tuition", pos: "noun", definitionEn: "the teaching of a student, or the fees paid for it", meaningZh: "学费；授课", collocations: ["tuition fees", "private tuition", "university tuition"], example: "University tuition fees have risen sharply in recent years.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "scholarship", pos: "noun", definitionEn: "money given to a student to help pay for education", meaningZh: "奖学金", collocations: ["win a scholarship", "full scholarship", "award a scholarship"], example: "She won a scholarship to study medicine abroad.", band: "core", writingRelevance: true, speakingRelevance: true },
      { word: "vocational", pos: "adjective", definitionEn: "relating to skills needed for a particular job", meaningZh: "职业的", collocations: ["vocational training", "vocational skills", "vocational courses"], example: "Vocational training helps young people enter the workforce.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "pedagogy", pos: "noun", definitionEn: "the method and practice of teaching", meaningZh: "教学法", collocations: ["modern pedagogy", "pedagogy of teaching", "effective pedagogy"], example: "Modern pedagogy emphasises active learning over rote memorisation.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "rote learning", pos: "noun phrase", definitionEn: "learning by repetition without understanding", meaningZh: "死记硬背", collocations: ["rely on rote learning", "discourage rote learning", "rote memorisation"], example: "Critics say the exam system encourages rote learning.", band: "band7", writingRelevance: true, speakingRelevance: true },
    ],
  },
  {
    id: "environment",
    nameEn: "Environment",
    nameZh: "环境",
    words: [
      { word: "sustainable", pos: "adjective", definitionEn: "able to continue without harming the environment", meaningZh: "可持续的", collocations: ["sustainable development", "sustainable energy", "sustainable practices"], example: "We need sustainable solutions to the climate crisis.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "emissions", pos: "noun (pl.)", definitionEn: "gases released into the air, especially by vehicles and industry", meaningZh: "排放物", collocations: ["carbon emissions", "reduce emissions", "greenhouse gas emissions"], example: "The city has pledged to cut carbon emissions by half.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "deforestation", pos: "noun", definitionEn: "the cutting down of forests", meaningZh: "滥伐森林", collocations: ["tackle deforestation", "rampant deforestation", "halt deforestation"], example: "Deforestation threatens biodiversity in tropical regions.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "biodiversity", pos: "noun", definitionEn: "the variety of plants and animals in an area", meaningZh: "生物多样性", collocations: ["protect biodiversity", "loss of biodiversity", "rich biodiversity"], example: "Protecting biodiversity is essential for healthy ecosystems.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "renewable", pos: "adjective", definitionEn: "able to be replaced naturally and not run out", meaningZh: "可再生的", collocations: ["renewable energy", "renewable resources", "renewable sources"], example: "Investing in renewable energy creates jobs and cuts pollution.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "contaminate", pos: "verb", definitionEn: "to make something dirty or poisonous", meaningZh: "污染", collocations: ["contaminate water", "contaminate the soil", "heavily contaminated"], example: "Industrial waste has contaminated the river.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "conservation", pos: "noun", definitionEn: "the protection of plants, animals and natural areas", meaningZh: "保护（自然资源）", collocations: ["wildlife conservation", "conservation efforts", "environmental conservation"], example: "Conservation efforts have saved several species from extinction.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "landfill", pos: "noun", definitionEn: "a place where waste is buried in the ground", meaningZh: "垃圾填埋场", collocations: ["send to landfill", "landfill site", "reduce landfill waste"], example: "Most household waste still ends up in landfill.", band: "band6", writingRelevance: true, speakingRelevance: true },
    ],
  },
  {
    id: "technology",
    nameEn: "Technology",
    nameZh: "科技",
    words: [
      { word: "innovation", pos: "noun", definitionEn: "a new idea, method or product", meaningZh: "创新", collocations: ["technological innovation", "drive innovation", "constant innovation"], example: "Technological innovation has transformed how we work.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "automation", pos: "noun", definitionEn: "the use of machines to do work previously done by people", meaningZh: "自动化", collocations: ["workplace automation", "increasing automation", "fear of automation"], example: "Automation is changing the nature of many jobs.", band: "band7", writingRelevance: true, speakingRelevance: true },
      { word: "obsolete", pos: "adjective", definitionEn: "no longer used because something newer exists", meaningZh: "过时的", collocations: ["become obsolete", "render obsolete", "obsolete technology"], example: "Many skills quickly become obsolete in a fast-changing economy.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "ubiquitous", pos: "adjective", definitionEn: "present or found everywhere", meaningZh: "无处不在的", collocations: ["ubiquitous technology", "become ubiquitous", "ubiquitous smartphones"], example: "Smartphones are now ubiquitous in developed countries.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "artificial intelligence", pos: "noun", definitionEn: "computer systems that perform tasks needing human intelligence", meaningZh: "人工智能", collocations: ["advances in AI", "AI-driven", "develop AI"], example: "Artificial intelligence is already used in medicine and finance.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "digital divide", pos: "noun", definitionEn: "the gap between those who can use technology and those who cannot", meaningZh: "数字鸿沟", collocations: ["bridge the digital divide", "widen the digital divide", "narrow the digital divide"], example: "Rural areas risk being left behind by the digital divide.", band: "band7", writingRelevance: true, speakingRelevance: true },
      { word: "streamline", pos: "verb", definitionEn: "to make a process more efficient", meaningZh: "精简、使高效", collocations: ["streamline processes", "streamline operations", "help streamline"], example: "The new software helps streamline the application process.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "cutting-edge", pos: "adjective", definitionEn: "the most modern and advanced", meaningZh: "尖端的", collocations: ["cutting-edge technology", "cutting-edge research", "cutting-edge design"], example: "The hospital uses cutting-edge imaging technology.", band: "band7", writingRelevance: true, speakingRelevance: true },
    ],
  },
  {
    id: "health",
    nameEn: "Health",
    nameZh: "健康",
    words: [
      { word: "sedentary", pos: "adjective", definitionEn: "spending a lot of time sitting and not moving", meaningZh: "久坐的", collocations: ["sedentary lifestyle", "sedentary job", "increasingly sedentary"], example: "A sedentary lifestyle increases the risk of heart disease.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "obesity", pos: "noun", definitionEn: "the condition of being very overweight", meaningZh: "肥胖症", collocations: ["childhood obesity", "rising obesity", "tackle obesity"], example: "Childhood obesity has become a serious public health issue.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "preventive", pos: "adjective", definitionEn: "intended to stop illness before it happens", meaningZh: "预防性的", collocations: ["preventive care", "preventive measures", "preventive medicine"], example: "Preventive care is cheaper than treating illness later.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "life expectancy", pos: "noun", definitionEn: "the average number of years a person is expected to live", meaningZh: "预期寿命", collocations: ["increase life expectancy", "life expectancy rises", "average life expectancy"], example: "Life expectancy has risen steadily over the past century.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "wellbeing", pos: "noun", definitionEn: "the state of being healthy and comfortable", meaningZh: "身心健康", collocations: ["mental wellbeing", "physical wellbeing", "promote wellbeing"], example: "Employers are paying more attention to staff wellbeing.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "chronic", pos: "adjective", definitionEn: "(of illness) lasting a long time", meaningZh: "慢性的", collocations: ["chronic disease", "chronic illness", "chronic pain"], example: "Chronic diseases such as diabetes are on the rise.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "epidemic", pos: "noun", definitionEn: "a widespread occurrence of a disease", meaningZh: "流行病", collocations: ["obesity epidemic", "contain an epidemic", "global epidemic"], example: "Governments acted quickly to contain the epidemic.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "nutrition", pos: "noun", definitionEn: "the food needed for health and growth", meaningZh: "营养", collocations: ["poor nutrition", "balanced nutrition", "nutrition education"], example: "Poor nutrition in childhood can affect development.", band: "band6", writingRelevance: true, speakingRelevance: true },
    ],
  },
  {
    id: "government",
    nameEn: "Government & Policy",
    nameZh: "政府与政策",
    words: [
      { word: "legislation", pos: "noun", definitionEn: "laws considered together", meaningZh: "立法；法规", collocations: ["pass legislation", "introduce legislation", "new legislation"], example: "The government introduced legislation to protect consumers.", band: "band6", writingRelevance: true, speakingRelevance: false },
      { word: "subsidise", pos: "verb", definitionEn: "to pay part of the cost of something", meaningZh: "补贴", collocations: ["subsidise public transport", "heavily subsidised", "subsidise farmers"], example: "The state subsidises public transport to keep fares low.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "regulate", pos: "verb", definitionEn: "to control something by rules", meaningZh: "监管", collocations: ["regulate the industry", "strictly regulated", "regulate advertising"], example: "Governments need to regulate online platforms more effectively.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "allocate", pos: "verb", definitionEn: "to give resources for a particular purpose", meaningZh: "分配", collocations: ["allocate resources", "allocate funds", "allocate a budget"], example: "More funds should be allocated to public health.", band: "band6", writingRelevance: true, speakingRelevance: false },
      { word: "infrastructure", pos: "noun", definitionEn: "basic systems and services a society needs", meaningZh: "基础设施", collocations: ["transport infrastructure", "invest in infrastructure", "ageing infrastructure"], example: "Investment in infrastructure is vital for economic growth.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "bureaucracy", pos: "noun", definitionEn: "complicated official rules and processes", meaningZh: "官僚主义；繁文缛节", collocations: ["excessive bureaucracy", "cut bureaucracy", "bureaucratic red tape"], example: "Excessive bureaucracy discourages small businesses.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "taxation", pos: "noun", definitionEn: "the system of collecting taxes", meaningZh: "征税", collocations: ["progressive taxation", "fair taxation", "higher taxation"], example: "Fair taxation can help reduce inequality.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "accountability", pos: "noun", definitionEn: "the responsibility to explain and be judged for actions", meaningZh: "问责制", collocations: ["public accountability", "ensure accountability", "lack of accountability"], example: "Greater accountability is needed in public spending.", band: "band7", writingRelevance: true, speakingRelevance: false },
    ],
  },
  {
    id: "society",
    nameEn: "Society",
    nameZh: "社会",
    words: [
      { word: "inequality", pos: "noun", definitionEn: "the unfair difference between groups of people", meaningZh: "不平等", collocations: ["social inequality", "income inequality", "reduce inequality"], example: "Income inequality has widened in many countries.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "cohesion", pos: "noun", definitionEn: "the state of a group staying together", meaningZh: "凝聚力", collocations: ["social cohesion", "community cohesion", "strengthen cohesion"], example: "Shared public spaces strengthen social cohesion.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "stereotype", pos: "noun", definitionEn: "a fixed, oversimplified idea about a group", meaningZh: "刻板印象", collocations: ["gender stereotype", "reinforce stereotypes", "challenge stereotypes"], example: "The media often reinforces gender stereotypes.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "marginalised", pos: "adjective", definitionEn: "treated as unimportant or without power", meaningZh: "被边缘化的", collocations: ["marginalised groups", "marginalised communities", "socially marginalised"], example: "Programs should support marginalised communities.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "urbanisation", pos: "noun", definitionEn: "the growth of cities as people move into them", meaningZh: "城市化", collocations: ["rapid urbanisation", "process of urbanisation", "unplanned urbanisation"], example: "Rapid urbanisation puts pressure on housing and transport.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "integration", pos: "noun", definitionEn: "the process of combining people or things together", meaningZh: "融合；一体化", collocations: ["social integration", "integration of immigrants", "cultural integration"], example: "Language classes help with the integration of newcomers.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "demographic", pos: "adjective", definitionEn: "relating to the structure of a population", meaningZh: "人口的", collocations: ["demographic change", "demographic shift", "demographic trends"], example: "An ageing population is a major demographic challenge.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "civic", pos: "adjective", definitionEn: "relating to citizens and their community", meaningZh: "公民的", collocations: ["civic duty", "civic engagement", "civic pride"], example: "Voting is often seen as a civic duty.", band: "band7", writingRelevance: true, speakingRelevance: false },
    ],
  },
  {
    id: "crime",
    nameEn: "Crime & Justice",
    nameZh: "犯罪与司法",
    words: [
      { word: "deterrent", pos: "noun", definitionEn: "something that discourages people from doing something", meaningZh: "威慑", collocations: ["act as a deterrent", "effective deterrent", "crime deterrent"], example: "Harsh penalties are not always an effective deterrent.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "rehabilitation", pos: "noun", definitionEn: "helping someone return to normal life after crime or illness", meaningZh: "改造；康复", collocations: ["rehabilitation programs", "focus on rehabilitation", "offender rehabilitation"], example: "Rehabilitation is often more effective than punishment.", band: "band7", writingRelevance: true, speakingRelevance: true },
      { word: "offender", pos: "noun", definitionEn: "a person who commits a crime", meaningZh: "罪犯", collocations: ["repeat offender", "young offender", "first-time offender"], example: "Young offenders may benefit more from education than prison.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "surveillance", pos: "noun", definitionEn: "the monitoring of people's activities", meaningZh: "监控", collocations: ["CCTV surveillance", "mass surveillance", "government surveillance"], example: "Public surveillance cameras are common in many cities.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "juvenile", pos: "adjective", definitionEn: "relating to young people who commit crimes", meaningZh: "青少年的（犯罪）", collocations: ["juvenile crime", "juvenile delinquency", "juvenile offenders"], example: "Juvenile crime has fallen in recent years.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "conviction", pos: "noun", definitionEn: "the decision that someone is guilty of a crime", meaningZh: "定罪", collocations: ["criminal conviction", "wrongful conviction", "secure a conviction"], example: "He has no previous criminal convictions.", band: "band6", writingRelevance: true, speakingRelevance: false },
      { word: "deter", pos: "verb", definitionEn: "to discourage someone from acting", meaningZh: "威慑；阻止", collocations: ["deter crime", "deter criminals", "deter people from"], example: "Visible policing can deter street crime.", band: "band6", writingRelevance: true, speakingRelevance: false },
      { word: "rehabilitate", pos: "verb", definitionEn: "to help someone return to a normal life", meaningZh: "改造；使康复", collocations: ["rehabilitate offenders", "rehabilitate prisoners", "successfully rehabilitate"], example: "The goal should be to rehabilitate offenders, not just punish them.", band: "band7", writingRelevance: true, speakingRelevance: false },
    ],
  },
  {
    id: "economy",
    nameEn: "Economy & Business",
    nameZh: "经济与商业",
    words: [
      { word: "inflation", pos: "noun", definitionEn: "a general rise in prices", meaningZh: "通货膨胀", collocations: ["rising inflation", "control inflation", "inflation rate"], example: "Rising inflation has reduced people's purchasing power.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "productivity", pos: "noun", definitionEn: "the rate at which goods are produced", meaningZh: "生产率", collocations: ["improve productivity", "labour productivity", "boost productivity"], example: "Better training can improve workforce productivity.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "recession", pos: "noun", definitionEn: "a period when the economy is doing badly", meaningZh: "经济衰退", collocations: ["enter a recession", "economic recession", "deep recession"], example: "The country entered a recession after the crisis.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "entrepreneur", pos: "noun", definitionEn: "a person who starts a business", meaningZh: "企业家", collocations: ["successful entrepreneur", "aspiring entrepreneur", "young entrepreneur"], example: "Successful entrepreneurs often take calculated risks.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "outsource", pos: "verb", definitionEn: "to pay another company to do work for you", meaningZh: "外包", collocations: ["outsource production", "outsource jobs", "outsource work"], example: "Many firms outsource production to lower-cost countries.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "consumerism", pos: "noun", definitionEn: "the belief that buying goods is important", meaningZh: "消费主义", collocations: ["mass consumerism", "rise of consumerism", "excessive consumerism"], example: "Critics argue that consumerism drives waste and debt.", band: "band7", writingRelevance: true, speakingRelevance: true },
      { word: "prosperity", pos: "noun", definitionEn: "the state of being successful and wealthy", meaningZh: "繁荣", collocations: ["economic prosperity", "shared prosperity", "bring prosperity"], example: "Trade has brought prosperity to the region.", band: "band6", writingRelevance: true, speakingRelevance: false },
      { word: "globalisation", pos: "noun", definitionEn: "the process of the world becoming more connected", meaningZh: "全球化", collocations: ["economic globalisation", "effects of globalisation", "anti-globalisation"], example: "Globalisation has linked economies more closely than ever.", band: "band6", writingRelevance: true, speakingRelevance: true },
    ],
  },
  {
    id: "media",
    nameEn: "Media & Culture",
    nameZh: "媒体与文化",
    words: [
      { word: "censorship", pos: "noun", definitionEn: "the control of what can be published or shown", meaningZh: "审查", collocations: ["press censorship", "strict censorship", "internet censorship"], example: "The debate over internet censorship is ongoing.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "bias", pos: "noun", definitionEn: "an unfair preference for one side", meaningZh: "偏见；偏向", collocations: ["media bias", "political bias", "unconscious bias"], example: "Readers should be aware of potential media bias.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "misinformation", pos: "noun", definitionEn: "false or misleading information", meaningZh: "错误信息", collocations: ["spread misinformation", "combat misinformation", "online misinformation"], example: "Social media can spread misinformation rapidly.", band: "band7", writingRelevance: true, speakingRelevance: true },
      { word: "sensationalism", pos: "noun", definitionEn: "presenting stories in an exaggerated, shocking way", meaningZh: "耸人听闻", collocations: ["media sensationalism", "tabloid sensationalism", "avoid sensationalism"], example: "Tabloid sensationalism often distorts the facts.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "credibility", pos: "noun", definitionEn: "the quality of being trusted and believed", meaningZh: "可信度", collocations: ["lose credibility", "undermine credibility", "media credibility"], example: "Inaccurate reporting undermines a newspaper's credibility.", band: "band6", writingRelevance: true, speakingRelevance: false },
      { word: "mainstream", pos: "adjective", definitionEn: "accepted by most people", meaningZh: "主流的", collocations: ["mainstream media", "mainstream culture", "mainstream society"], example: "The story was widely covered by mainstream media.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "portray", pos: "verb", definitionEn: "to show or describe someone in a particular way", meaningZh: "描绘；刻画", collocations: ["portray as", "portray accurately", "portray a character"], example: "Films often portray scientists as lonely geniuses.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "propaganda", pos: "noun", definitionEn: "information used to promote a political cause", meaningZh: "宣传（含贬义）", collocations: ["state propaganda", "spread propaganda", "political propaganda"], example: "During wartime, governments often use propaganda.", band: "band7", writingRelevance: true, speakingRelevance: true },
    ],
  },
  {
    id: "urbanisation",
    nameEn: "Urbanisation & Cities",
    nameZh: "城市化与城市",
    words: [
      { word: "congestion", pos: "noun", definitionEn: "the state of being overcrowded, especially traffic", meaningZh: "拥堵", collocations: ["traffic congestion", "ease congestion", "urban congestion"], example: "Traffic congestion costs the city billions each year.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "commute", pos: "verb/noun", definitionEn: "to travel regularly between home and work", meaningZh: "通勤", collocations: ["daily commute", "long commute", "commute by train"], example: "Many workers face a long daily commute into the city.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "amenities", pos: "noun (pl.)", definitionEn: "useful facilities in a place", meaningZh: "便利设施", collocations: ["local amenities", "public amenities", "basic amenities"], example: "The new neighbourhood has excellent local amenities.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "affordable housing", pos: "noun phrase", definitionEn: "housing that people on low incomes can afford", meaningZh: "经济适用房", collocations: ["provide affordable housing", "shortage of affordable housing", "build affordable housing"], example: "The shortage of affordable housing is a growing problem.", band: "band7", writingRelevance: true, speakingRelevance: true },
      { word: "gentrification", pos: "noun", definitionEn: "the process of a poor area becoming more expensive and fashionable", meaningZh: "士绅化", collocations: ["rapid gentrification", "process of gentrification", "effects of gentrification"], example: "Gentrification has pushed out many long-term residents.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "sprawl", pos: "noun", definitionEn: "the uncontrolled spread of a city", meaningZh: "城市无序扩张", collocations: ["urban sprawl", "suburban sprawl", "limit sprawl"], example: "Urban sprawl consumes farmland and increases car dependence.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "pedestrianise", pos: "verb", definitionEn: "to make a street for walkers only", meaningZh: "步行化", collocations: ["pedestrianise the centre", "pedestrianised street", "fully pedestrianised"], example: "The city centre has been pedestrianised to reduce pollution.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "overcrowding", pos: "noun", definitionEn: "too many people in one place", meaningZh: "过度拥挤", collocations: ["prison overcrowding", "overcrowding in schools", "reduce overcrowding"], example: "Overcrowding on public transport is a daily frustration.", band: "band6", writingRelevance: true, speakingRelevance: true },
    ],
  },
  {
    id: "tourism",
    nameEn: "Tourism & Travel",
    nameZh: "旅游",
    words: [
      { word: "heritage", pos: "noun", definitionEn: "traditions and buildings passed down from the past", meaningZh: "遗产", collocations: ["cultural heritage", "world heritage site", "preserve heritage"], example: "The old town is a UNESCO world heritage site.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "ecotourism", pos: "noun", definitionEn: "responsible travel to natural areas", meaningZh: "生态旅游", collocations: ["promote ecotourism", "ecotourism industry", "sustainable ecotourism"], example: "Ecotourism can fund conservation if managed well.", band: "band7", writingRelevance: true, speakingRelevance: true },
      { word: "commercialisation", pos: "noun", definitionEn: "making something focused on making money", meaningZh: "商业化", collocations: ["commercialisation of culture", "excessive commercialisation", "commercialisation of tourism"], example: "The commercialisation of festivals has worried some locals.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "infrastructure", pos: "noun", definitionEn: "basic systems supporting tourism (roads, airports)", meaningZh: "基础设施", collocations: ["tourism infrastructure", "develop infrastructure", "improve infrastructure"], example: "The region needs better tourism infrastructure.", band: "band6", writingRelevance: true, speakingRelevance: false },
      { word: "authentic", pos: "adjective", definitionEn: "real and genuine, not fake or mass-produced", meaningZh: "真实的；地道的", collocations: ["authentic experience", "authentic culture", "truly authentic"], example: "Travellers increasingly seek authentic local experiences.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "souvenir", pos: "noun", definitionEn: "an item bought as a reminder of a place", meaningZh: "纪念品", collocations: ["buy souvenirs", "tourist souvenir", "souvenir shop"], example: "The streets were lined with souvenir shops.", band: "core", writingRelevance: false, speakingRelevance: true },
      { word: "seasonal", pos: "adjective", definitionEn: "happening only at certain times of the year", meaningZh: "季节性的", collocations: ["seasonal tourism", "seasonal jobs", "highly seasonal"], example: "The island's economy is highly seasonal.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "overtourism", pos: "noun", definitionEn: "too many tourists in one destination", meaningZh: "过度旅游", collocations: ["combat overtourism", "problem of overtourism", "suffer from overtourism"], example: "Several cities have introduced measures to combat overtourism.", band: "band7", writingRelevance: true, speakingRelevance: true },
    ],
  },
  {
    id: "global-issues",
    nameEn: "Global Issues",
    nameZh: "全球议题",
    words: [
      { word: "poverty", pos: "noun", definitionEn: "the state of being very poor", meaningZh: "贫困", collocations: ["extreme poverty", "reduce poverty", "live in poverty"], example: "Aid programs aim to reduce extreme poverty.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "famine", pos: "noun", definitionEn: "a severe shortage of food", meaningZh: "饥荒", collocations: ["widespread famine", "suffer from famine", "prevent famine"], example: "The drought led to widespread famine in the region.", band: "band7", writingRelevance: true, speakingRelevance: true },
      { word: "humanitarian", pos: "adjective", definitionEn: "concerned with reducing human suffering", meaningZh: "人道主义的", collocations: ["humanitarian aid", "humanitarian crisis", "humanitarian relief"], example: "Humanitarian aid was sent to the affected areas.", band: "band7", writingRelevance: true, speakingRelevance: true },
      { word: "refugee", pos: "noun", definitionEn: "a person forced to leave their country", meaningZh: "难民", collocations: ["refugee crisis", "refugee camp", "accept refugees"], example: "The war created millions of refugees.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "sustainability", pos: "noun", definitionEn: "meeting needs without harming future generations", meaningZh: "可持续性", collocations: ["environmental sustainability", "long-term sustainability", "ensure sustainability"], example: "Sustainability must guide economic development.", band: "band6", writingRelevance: true, speakingRelevance: true },
      { word: "eradicate", pos: "verb", definitionEn: "to completely remove or destroy", meaningZh: "根除", collocations: ["eradicate poverty", "eradicate disease", "eradicate corruption"], example: "Vaccination has helped eradicate several diseases.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "exploitation", pos: "noun", definitionEn: "treating people unfairly for your own benefit", meaningZh: "剥削", collocations: ["labour exploitation", "exploitation of workers", "child exploitation"], example: "Campaigners highlight the exploitation of factory workers.", band: "band7", writingRelevance: true, speakingRelevance: false },
      { word: "inequality", pos: "noun", definitionEn: "the unfair difference between rich and poor", meaningZh: "不平等", collocations: ["global inequality", "growing inequality", "wealth inequality"], example: "Global inequality remains a major challenge.", band: "band6", writingRelevance: true, speakingRelevance: true },
    ],
  },
];

export function getVocabTopic(id: string): VocabTopic | undefined {
  return vocabTopics.find((t) => t.id === id);
}

export function allVocabEntries(): VocabEntry[] {
  return vocabTopics.flatMap((t) => t.words);
}
