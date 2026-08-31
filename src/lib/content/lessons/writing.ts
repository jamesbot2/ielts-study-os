import { L, type Lesson } from "../types";

export const writingLessons: Lesson[] = [
  {
    id: "write-criteria",
    category: "writing",
    testType: "both",
    order: 1,
    title: L("Writing assessment criteria", "写作评分标准"),
    summary: L(
      "Four official criteria; understand them before you write.",
      "四个官方标准；写作前先理解它们。",
    ),
    sections: [
      {
        heading: L("The four criteria", "四个标准"),
        bullets: [
          L("Task Achievement (Task 1) / Task Response (Task 2): answer the question fully.", "任务完成情况（Task 1）/ 任务回应情况（Task 2）：完整回答问题。"),
          L("Coherence and Cohesion: logical organisation, clear paragraphs, linking.", "连贯与衔接：逻辑组织、清晰分段、连接。"),
          L("Lexical Resource: range and precision of vocabulary, collocations, spelling.", "词汇资源：词汇的范围与准确、搭配、拼写。"),
          L("Grammatical Range and Accuracy: variety and correctness of structures.", "语法多样性与准确性：结构的多样与正确。"),
        ],
      },
      {
        heading: L("Task 2 weighting", "Task 2 权重"),
        paragraphs: [
          L(
            "Task 2 is worth twice Task 1. Spend about 20 minutes on Task 1 and 40 minutes on Task 2.",
            "Task 2 的分值是 Task 1 的两倍。Task 1 约用 20 分钟，Task 2 约用 40 分钟。",
          ),
        ],
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "write-academic-task1",
    category: "writing",
    testType: "academic",
    order: 2,
    title: L("Academic Task 1: describing data", "学术类 Task 1：描述数据"),
    summary: L(
      "Summarise visual information: graphs, charts, tables, maps, processes.",
      "概述视觉信息：图表、表格、地图、流程图。",
    ),
    sections: [
      {
        heading: L("Task types", "任务类型"),
        bullets: [
          L("Line graphs — changes over time", "折线图——随时间变化"),
          L("Bar charts, pie charts, tables — comparisons", "柱状图、饼图、表格——比较"),
          L("Multiple/mixed charts — more than one visual", "多图/混合图——多个视觉"),
          L("Process diagrams — sequence, passive voice", "流程图——顺序、被动语态"),
          L("Maps/plans — change over time or location", "地图/平面图——随时间或位置变化"),
        ],
      },
      {
        heading: L("Structure", "结构"),
        bullets: [
          L("Introduction: paraphrase the task in one sentence.", "引言：用一句话改写题目。"),
          L("Overview: the most important overall trend or comparison (this is essential for a high score).", "概述：最重要的总体趋势或比较（这是拿高分的关键）。"),
          L("Body paragraphs: group and compare specific data; do not describe every number.", "主体段：分组比较具体数据；不要描述每个数字。"),
        ],
      },
      {
        heading: L("Language", "语言"),
        bullets: [
          L("Trends: rise, increase, fall, decline, fluctuate, plateau, peak.", "趋势：上升、增长、下降、减少、波动、持平、达到峰值。"),
          L("Approximations: about, around, just under, roughly.", "近似：约、大约、略低于、大致。"),
          L("Do NOT give opinions or speculate about causes — describe data only.", "不要发表观点或推测原因——只描述数据。"),
        ],
      },
    ],
    estimatedMinutes: 8,
  },
  {
    id: "write-general-task1",
    category: "writing",
    testType: "general",
    order: 3,
    title: L("General Training Task 1: letters", "培训类 Task 1：书信"),
    summary: L(
      "Formal, semi-formal and informal letters for different purposes.",
      "不同用途的正式、半正式和非正式信件。",
    ),
    sections: [
      {
        heading: L("Letter types and purposes", "信件类型与用途"),
        bullets: [
          L("Formal: complaint, application, request for information (to an unknown person/organisation).", "正式：投诉、申请、询问信息（写给陌生人或机构）。"),
          L("Semi-formal: to someone you know but not intimately (landlord, colleague).", "半正式：写给认识但不亲密的人（房东、同事）。"),
          L("Informal: to a friend (thanking, inviting, apologising, explaining).", "非正式：写给朋友（感谢、邀请、道歉、解释）。"),
        ],
      },
      {
        heading: L("Register and structure", "语体与结构"),
        bullets: [
          L("Salutation matches register: 'Dear Sir/Madam' → 'Dear Mr Smith' → 'Hi Tom'.", "称呼与语体匹配：Dear Sir/Madam → Dear Mr Smith → Hi Tom。"),
          L("State the purpose clearly in the opening paragraph.", "开头段明确说明写信目的。"),
          L("Cover EVERY bullet point in the prompt, each in its own paragraph.", "覆盖题目中的每个要点，每个要点单独成段。"),
          L("Close appropriately: 'Yours faithfully' (unknown), 'Yours sincerely' (named), 'Best wishes' (friend).", "结尾恰当：Yours faithfully（不知名）、Yours sincerely（具名）、Best wishes（朋友）。"),
        ],
      },
    ],
    estimatedMinutes: 6,
  },
  {
    id: "write-task2",
    category: "writing",
    testType: "both",
    order: 4,
    title: L("Task 2: essay types", "Task 2：作文类型"),
    summary: L(
      "Recognise the essay type and answer exactly what is asked.",
      "识别作文类型，准确回答题目要求。",
    ),
    sections: [
      {
        heading: L("Common essay types", "常见作文类型"),
        bullets: [
          L("Agree/Disagree: 'To what extent do you agree or disagree?'", "同意/不同意：To what extent do you agree or disagree?"),
          L("Discuss both views (+ your opinion): 'Discuss both views and give your own opinion.'", "讨论双方观点（+你的观点）：Discuss both views and give your own opinion."),
          L("Advantages/Disadvantages: 'Do the advantages outweigh the disadvantages?'", "利弊：Do the advantages outweigh the disadvantages?"),
          L("Problem/Solution & Causes/Solutions: 'What problems does this cause? What solutions…?'", "问题/解决与原因/解决：What problems does this cause? What solutions…?"),
          L("Positive/Negative development: 'Is this a positive or negative development?'", "积极/消极发展：Is this a positive or negative development?"),
          L("Two-part/direct questions: 'Why is this? What can be done…?'", "两问/直接提问：Why is this? What can be done…?"),
        ],
      },
      {
        heading: L("Essay structure", "文章结构"),
        bullets: [
          L("Introduction: paraphrase the topic + clear position (thesis).", "引言：改写话题 + 明确立场（论点）。"),
          L("Body paragraphs: one main idea each, with topic sentence, explanation and example.", "主体段：每段一个中心论点，含主题句、解释和例子。"),
          L("Conclusion: restate position and summarise, no new ideas.", "结论：重申立场并总结，不引入新观点。"),
        ],
      },
    ],
    estimatedMinutes: 6,
  },
  {
    id: "write-language",
    category: "writing",
    testType: "both",
    order: 5,
    title: L("Writing language & editing", "写作语言与修改"),
    summary: L(
      "Lexical precision, grammar range, and how to edit efficiently.",
      "词汇准确、语法多样以及高效修改。",
    ),
    sections: [
      {
        heading: L("Do and avoid", "该做与避免"),
        bullets: [
          L("Use precise vocabulary and natural collocations, not memorised chunks.", "使用准确词汇和自然搭配，而非背诵的语块。"),
          L("Vary sentence length and use complex structures purposefully.", "变化句子长度，有目的地使用复杂结构。"),
          L("Avoid memorised/template-heavy responses — examiners penalise them.", "避免背诵/模板化的回答——考官会扣分。"),
          L("Meet the word minimum (Task 1: 150; Task 2: 250) but prioritise relevance.", "达到最低字数（Task 1：150；Task 2：250），但优先保证切题。"),
        ],
      },
      {
        heading: L("Editing checklist", "修改清单"),
        bullets: [
          L("Did I answer every part of the prompt?", "我回答了题目的每个部分吗？"),
          L("Is there a clear overview (Task 1) / thesis (Task 2)?", "是否有清晰的概述（Task 1）/ 论点（Task 2）？"),
          L("Are paragraphs logically ordered and linked?", "段落是否有逻辑顺序和连接？"),
          L("Any spelling, punctuation or agreement errors?", "有无拼写、标点或主谓一致错误？"),
        ],
      },
    ],
    estimatedMinutes: 5,
  },
];
