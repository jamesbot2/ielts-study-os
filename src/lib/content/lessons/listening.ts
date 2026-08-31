import { L, type Lesson } from "../types";

export const listeningLessons: Lesson[] = [
  {
    id: "list-structure",
    category: "listening",
    testType: "both",
    order: 1,
    title: L("Listening structure", "听力结构"),
    summary: L(
      "4 parts, 40 questions, one recording play, multiple accents.",
      "4 个部分，40 题，录音只播放一次，多种口音。",
    ),
    sections: [
      {
        heading: L("The four parts", "四个部分"),
        table: {
          headers: [L("Part", "部分"), L("Context", "场景"), L("Format", "形式")],
          rows: [
            [L("Part 1", "Part 1"), L("Everyday social (e.g. booking, enquiry)", "日常社交（如预订、咨询）"), L("Conversation between two speakers", "两人对话")],
            [L("Part 2", "Part 2"), L("Everyday social (e.g. a talk, tour, announcement)", "日常社交（如演讲、导览、公告）"), L("Monologue", "独白")],
            [L("Part 3", "Part 3"), L("Academic/training (e.g. discussion between students)", "学术/培训（如学生讨论）"), L("Conversation between up to four speakers", "最多四人的对话")],
            [L("Part 4", "Part 4"), L("Academic (e.g. a lecture)", "学术（如讲座）"), L("Monologue", "独白")],
          ],
        },
        paragraphs: [
          L(
            "The recording is played ONCE. Questions get progressively harder. You hear a range of English accents (British, Australian, North American, New Zealand).",
            "录音只播放一次。题目难度逐渐增加。你会听到多种英语口音（英国、澳大利亚、北美、新西兰）。",
          ),
        ],
      },
    ],
    estimatedMinutes: 4,
    relatedQuestionTypes: ["multiple_choice", "matching", "plan_labelling", "map_labelling", "diagram_labelling", "form_completion", "note_completion", "table_completion", "flow_chart_completion", "summary_completion", "sentence_completion", "short_answer"],
  },
  {
    id: "list-question-types",
    category: "listening",
    testType: "both",
    order: 2,
    title: L("Listening question types", "听力题型"),
    summary: L("Every major Listening question type, with how to approach it.", "所有主要听力题型及应对方法。"),
    sections: [
      {
        heading: L("Completion questions", "填空题"),
        bullets: [
          L("Form / note / table / flow-chart / summary / sentence completion — write words from the audio.", "表格/笔记/表格/流程图/摘要/句子填空——写下音频中的单词。"),
          L("Respect the word limit (e.g. 'NO MORE THAN TWO WORDS AND/OR A NUMBER').", "遵守字数限制（如「不超过两个单词和/或一个数字」）。"),
          L("Spelling must be correct; singular/plural must match.", "拼写必须正确；单复数必须匹配。"),
        ],
      },
      {
        heading: L("Choice and matching questions", "选择题与配对题"),
        bullets: [
          L("Multiple choice — read the stem, listen for paraphrase, not exact words.", "单选题——读题干，听同义替换而非原词。"),
          L("Multiple-answer — select more than one option as instructed.", "多选题——按指示选择多个选项。"),
          L("Matching — match items (e.g. speakers to statements) using distractors.", "配对题——利用干扰项将项目（如说话者与陈述）配对。"),
        ],
      },
      {
        heading: L("Diagram / map / plan labelling", "图表/地图/平面图标示"),
        bullets: [
          L("Use compass points and landmarks: 'next to', 'opposite', 'on the left of'.", "使用方位和地标：「在…旁边」「在…对面」「在…左边」。"),
          L("Follow the speaker's route in order; answers usually come in sequence.", "按顺序跟随说话者的路线；答案通常按顺序出现。"),
        ],
      },
    ],
    estimatedMinutes: 6,
    relatedQuestionTypes: ["multiple_choice", "multiple_answer", "matching", "plan_labelling", "map_labelling", "diagram_labelling", "form_completion", "note_completion", "table_completion", "flow_chart_completion", "summary_completion", "sentence_completion", "short_answer"],
  },
  {
    id: "list-strategies",
    category: "listening",
    testType: "both",
    order: 3,
    title: L("Listening strategies", "听力策略"),
    summary: L(
      "Prediction, paraphrase, distractors and how to recover after missing an answer.",
      "预测、同义替换、干扰项以及漏听后如何补救。",
    ),
    sections: [
      {
        heading: L("Before and during", "听前与听中"),
        bullets: [
          L("Predict: read the question, identify the part of speech and likely answer type (number, name, place).", "预测：读题，判断词性和可能的答案类型（数字、名字、地点）。"),
          L("Underline keywords, then listen for synonyms and paraphrase.", "划出关键词，然后听同义词和同义替换。"),
          L("Watch for distractors: speakers often correct themselves ('…no wait, actually…').", "注意干扰项：说话者常自我纠正（「…不，等等，其实是…」）。"),
          L("Signposting words ('however', 'so', 'the main point is') signal answers.", "信号词（however、so、the main point is）提示答案。"),
        ],
      },
      {
        heading: L("If you miss an answer", "如果漏听了答案"),
        bullets: [
          L("Never get stuck. Guess logically and move on — a missed answer must not cost the next one.", "绝不停留。合理猜测后继续——漏掉一题不能连累下一题。"),
          L("Use the checking period at the end to revisit and complete answers.", "利用最后的检查时间回顾并补全答案。"),
          L("Write an answer for every question; there is no penalty for wrong answers.", "每题都写答案；答错不扣分。"),
        ],
      },
      {
        heading: L("Numbers, dates, spelling", "数字、日期、拼写"),
        bullets: [
          L("Numbers: distinguish 15 vs 50 ('fifteen' vs 'fifty').", "数字：区分 15 和 50。"),
          L("Dates: know formats (12th March / March 12).", "日期：熟悉格式（12th March / March 12）。"),
          L("Names: speakers spell them out — transcribe each letter accurately.", "名字：说话者会拼读——准确记录每个字母。"),
          L("Plural/singular: final -s matters.", "单复数：词尾 -s 很重要。"),
        ],
      },
    ],
    estimatedMinutes: 6,
    relatedQuestionTypes: [],
  },
  {
    id: "list-checking",
    category: "listening",
    testType: "both",
    order: 4,
    title: L("Checking your answers", "检查答案"),
    summary: L(
      "Use the final checking period and the on-screen navigator wisely.",
      "合理利用最后检查时间和屏幕导航。",
    ),
    sections: [
      {
        heading: L("The checking period", "检查时间"),
        paragraphs: [
          L(
            "In computer-delivered Listening, after the recording ends you get a short period to check and transfer answers. On a computer, answers are typed as you go, so use this time to check spelling, word limits and any questions you skipped.",
            "在机考听力中，录音结束后会有短暂时间检查和提交答案。电脑上答案随听随打，因此利用这段时间检查拼写、字数限制和跳过的题目。",
          ),
        ],
      },
      {
        heading: L("Common checking points", "常见检查点"),
        bullets: [
          L("Spelling (especially names and numbers)", "拼写（尤其是名字和数字）"),
          L("Word-limit compliance", "字数限制合规"),
          L("Singular/plural agreement", "单复数一致"),
          L("Unanswered questions — fill them all in", "未答题目——全部填上"),
        ],
      },
    ],
    estimatedMinutes: 3,
    relatedQuestionTypes: [],
  },
];
