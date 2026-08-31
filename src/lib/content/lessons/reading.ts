import { L, type Lesson } from "../types";

export const readingLessons: Lesson[] = [
  {
    id: "read-structure-academic",
    category: "reading",
    testType: "academic",
    order: 1,
    title: L("Academic Reading structure", "学术类阅读结构"),
    summary: L(
      "3 long passages, 40 questions, 60 minutes, increasing difficulty.",
      "3 篇长文章，40 题，60 分钟，难度递增。",
    ),
    sections: [
      {
        heading: L("What to expect", "考试内容"),
        bullets: [
          L("Three passages taken from books, journals, magazines and newspapers.", "三篇选自书籍、期刊、杂志和报纸的文章。"),
          L("Texts are academic but written for a non-specialist audience.", "文章具有学术性，但面向非专业读者。"),
          L("At least one passage contains a detailed logical argument.", "至少一篇文章包含详细的逻辑论证。"),
          L("Cognitive difficulty generally increases from Passage 1 to Passage 3.", "认知难度通常从第一篇到第三篇递增。"),
        ],
        paragraphs: [
          L(
            "You have 60 minutes to answer 40 questions. There is no separate time to transfer answers in computer-delivered Reading — manage your time so you finish all questions within the hour.",
            "你有 60 分钟回答 40 题。机考阅读没有单独誊写时间——请安排好时间，在一小时内完成所有题目。",
          ),
        ],
      },
    ],
    estimatedMinutes: 4,
    relatedQuestionTypes: ["multiple_choice", "true_false_not_given", "yes_no_not_given", "matching_information", "matching_headings", "matching_features", "matching_sentence_endings", "sentence_completion", "summary_completion", "note_completion", "table_completion", "flow_chart_completion", "diagram_labelling", "short_answer"],
  },
  {
    id: "read-structure-general",
    category: "reading",
    testType: "general",
    order: 2,
    title: L("General Training Reading structure", "培训类阅读结构"),
    summary: L(
      "Three sections: social survival, workplace, and a longer general text.",
      "三个部分：社会生存、职场和较长综合文本。",
    ),
    sections: [
      {
        heading: L("The three sections", "三个部分"),
        table: {
          headers: [L("Section", "部分"), L("Content", "内容")],
          rows: [
            [L("Section 1", "第一部分"), L("2–3 short everyday/social 'survival' texts (notices, ads, timetables)", "2–3 篇短小的日常/社会「生存」文本（通知、广告、时刻表）")],
            [L("Section 2", "第二部分"), L("2 workplace-related texts (job descriptions, policies, training)", "2 篇职场相关文本（职位描述、政策、培训）")],
            [L("Section 3", "第三部分"), L("1 longer, more complex general-interest text", "1 篇较长、较复杂的综合类文本")],
          ],
        },
      },
    ],
    estimatedMinutes: 4,
    relatedQuestionTypes: ["multiple_choice", "true_false_not_given", "matching_information", "matching_headings", "matching_features", "matching_sentence_endings", "sentence_completion", "summary_completion", "note_completion", "table_completion", "flow_chart_completion", "diagram_labelling", "short_answer"],
  },
  {
    id: "read-question-types",
    category: "reading",
    testType: "both",
    order: 3,
    title: L("Reading question types", "阅读题型"),
    summary: L("All major Reading question types with approaches.", "所有主要阅读题型及应对方法。"),
    sections: [
      {
        heading: L("True / False / Not Given & Yes / No / Not Given", "判断正误题"),
        paragraphs: [
          L(
            "True/False/Not Given applies to facts in the passage. Yes/No/Not Given applies to the writer's views or claims. The key distinction is between 'False/No' (the passage contradicts the statement) and 'Not Given' (the passage does not say).",
            "True/False/Not Given 适用于文章中的事实。Yes/No/Not Given 适用于作者的观点或主张。关键是区分「False/No」（文章与陈述矛盾）和「Not Given」（文章未提及）。",
          ),
        ],
      },
      {
        heading: L("Matching questions", "配对题"),
        bullets: [
          L("Matching headings: identify the main idea of each paragraph.", "标题配对：识别每段的主旨。"),
          L("Matching information: find WHERE specific information appears.", "信息配对：找到特定信息出现的位置。"),
          L("Matching features: match people/theories to statements.", "特征配对：将人物/理论与其陈述配对。"),
          L("Matching sentence endings: complete sentences using grammar + meaning.", "句子结尾配对：结合语法和语义完成句子。"),
        ],
      },
      {
        heading: L("Completion and short-answer questions", "填空题与简答题"),
        bullets: [
          L("Answers usually come from the passage in order (within a section).", "答案通常按顺序在文章中出现（在某一段内）。"),
          L("Respect word limits and copy spelling exactly from the passage.", "遵守字数限制，拼写与原文完全一致。"),
          L("Check grammar of the gap: a verb, noun, adjective or number?", "检查空格的语法：是动词、名词、形容词还是数字？"),
        ],
      },
    ],
    estimatedMinutes: 8,
    relatedQuestionTypes: ["multiple_choice", "true_false_not_given", "yes_no_not_given", "matching_information", "matching_headings", "matching_features", "matching_sentence_endings", "sentence_completion", "summary_completion", "note_completion", "table_completion", "flow_chart_completion", "diagram_labelling", "short_answer"],
  },
  {
    id: "read-skills",
    category: "reading",
    testType: "both",
    order: 4,
    title: L("Skimming and scanning", "略读与扫读"),
    summary: L(
      "Two complementary reading speeds that together manage the 60-minute limit.",
      "两种互补的阅读速度，共同应对 60 分钟的时间限制。",
    ),
    sections: [
      {
        heading: L("Skimming (overview)", "略读（把握大意）"),
        bullets: [
          L("Read the title, first sentence of each paragraph, and the conclusion.", "读标题、每段首句和结论。"),
          L("Aim to understand the main idea and structure in 2–3 minutes.", "目标是在 2–3 分钟内理解主旨和结构。"),
        ],
      },
      {
        heading: L("Scanning (locating)", "扫读（定位）"),
        bullets: [
          L("Search for specific information: names, numbers, dates, keywords.", "寻找特定信息：名字、数字、日期、关键词。"),
          L("Let your eyes move quickly; do not read every word.", "快速扫视，不要逐字阅读。"),
        ],
      },
      {
        heading: L("Keyword and paraphrase", "关键词与同义替换"),
        paragraphs: [
          L(
            "Questions rarely repeat passage wording. Identify the keyword in the question, then find its synonym or paraphrase in the passage.",
            "题目很少重复原文措辞。找出题目中的关键词，然后在文章中找到其同义词或同义替换。",
          ),
        ],
      },
    ],
    estimatedMinutes: 5,
    relatedQuestionTypes: [],
  },
  {
    id: "read-time-management",
    category: "reading",
    testType: "both",
    order: 5,
    title: L("Time management & answer-order patterns", "时间管理与答案顺序"),
    summary: L(
      "About 20 minutes per passage; know which questions follow order and which do not.",
      "每篇约 20 分钟；了解哪些题型按顺序、哪些不按顺序。",
    ),
    sections: [
      {
        heading: L("Time plan", "时间规划"),
        bullets: [
          L("Aim for ~20 minutes per passage/section (Academic) or a weighted split (General).", "每篇/每部分约 20 分钟（学术类）或加权分配（培训类）。"),
          L("Do not spend more than 1 minute stuck on any single question.", "任何单题停留不要超过 1 分钟。"),
          L("Leave 2–3 minutes at the end to check and fill gaps.", "最后留 2–3 分钟检查并补空。"),
        ],
      },
      {
        heading: L("Order vs non-order question types", "顺序题 vs 非顺序题"),
        bullets: [
          L("Usually in order: completion, short-answer, True/False/Not Given (within a section), sentence completion.", "通常按顺序：填空、简答、判断正误（段内）、句子填空。"),
          L("Usually NOT in order: matching headings, matching information, matching features.", "通常不按顺序：标题配对、信息配对、特征配对。"),
        ],
      },
    ],
    estimatedMinutes: 4,
    relatedQuestionTypes: [],
  },
  {
    id: "read-vocab-in-context",
    category: "reading",
    testType: "both",
    order: 6,
    title: L("Vocabulary in context & avoiding over-reading", "语境词汇与避免过度解读"),
    summary: L(
      "Guess meaning from context; do not infer more than the text supports.",
      "根据语境猜词义；不要推断出文本不支持的内容。",
    ),
    sections: [
      {
        heading: L("Guessing meaning from context", "根据语境猜词义"),
        bullets: [
          L("Look for definitions, examples, contrast words ('but', 'however') and synonyms nearby.", "寻找定义、例子、对比词（but、however）和附近的同义词。"),
          L("Use word parts (prefixes, roots, suffixes).", "利用词根词缀。"),
        ],
      },
      {
        heading: L("Avoiding over-reading", "避免过度解读"),
        paragraphs: [
          L(
            "'Not Given' exists precisely because candidates over-infer. If the statement requires an assumption not stated in the text, it is Not Given — even if it feels true in real life.",
            "「Not Given」的存在正是因为考生会过度推断。如果该陈述需要文本未说明的假设，那就是 Not Given——即使它在现实中感觉正确。",
          ),
        ],
      },
    ],
    estimatedMinutes: 4,
    relatedQuestionTypes: ["true_false_not_given", "yes_no_not_given"],
  },
];
