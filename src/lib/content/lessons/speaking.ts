import { L, type Lesson } from "../types";

export const speakingLessons: Lesson[] = [
  {
    id: "speak-structure",
    category: "speaking",
    testType: "both",
    order: 1,
    title: L("Speaking structure", "口语结构"),
    summary: L(
      "Three parts, 11–14 minutes, four assessment criteria.",
      "三个部分，11–14 分钟，四个评分标准。",
    ),
    sections: [
      {
        heading: L("The three parts", "三个部分"),
        table: {
          headers: [L("Part", "部分"), L("Time", "时间"), L("Content", "内容")],
          rows: [
            [L("Part 1", "Part 1"), L("4–5 min", "4–5 分钟"), L("Familiar/personal topics (home, work, hobbies)", "熟悉/个人话题（家、工作、爱好）")],
            [L("Part 2", "Part 2"), L("3–4 min", "3–4 分钟"), L("Cue card: 1 min prep, then 1–2 min long turn", "话题卡：1 分钟准备，然后 1–2 分钟独白")],
            [L("Part 3", "Part 3"), L("4–5 min", "4–5 分钟"), L("Abstract discussion related to Part 2 theme", "与 Part 2 主题相关的抽象讨论")],
          ],
        },
        paragraphs: [
          L(
            "The examiner assesses Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation — all equally weighted.",
            "考官评估流利度与连贯性、词汇资源、语法多样性与准确性、发音——权重相等。",
          ),
        ],
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "speak-part1",
    category: "speaking",
    testType: "both",
    order: 2,
    title: L("Part 1 strategies", "Part 1 策略"),
    summary: L(
      "Give natural, extended answers without rambling.",
      "给出自然、扩展的回答而不啰嗦。",
    ),
    sections: [
      {
        heading: L("How to answer", "如何作答"),
        bullets: [
          L("Answer directly, then add 1–2 sentences of detail (reason, example, contrast).", "直接回答，然后补充 1–2 句细节（原因、例子、对比）。"),
          L("Do not give one-word answers; do not give a 1-minute speech either.", "不要只回答一个词；也不要长篇大论。"),
          L("Use the present, past and future naturally ('I usually… but last year…').", "自然使用现在、过去和将来时态。"),
        ],
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "speak-part2",
    category: "speaking",
    testType: "both",
    order: 3,
    title: L("Part 2: the long turn", "Part 2：长独白"),
    summary: L(
      "Use the 1-minute prep; structure your 1–2 minute talk.",
      "利用 1 分钟准备时间；组织 1–2 分钟的讲述。",
    ),
    sections: [
      {
        heading: L("Preparation", "准备"),
        bullets: [
          L("Use the cue card bullets as your structure — cover every point.", "以话题卡的要点为结构——覆盖每个要点。"),
          L("Jot down 3–4 keywords, not full sentences.", "记下 3–4 个关键词，而非完整句子。"),
          L("Prepare a past-tense story or example to fill the middle.", "准备一个过去时态的故事或例子来充实中间部分。"),
        ],
      },
      {
        heading: L("During the talk", "讲述时"),
        bullets: [
          L("Introduce the topic, develop each bullet, and give a brief closing feeling.", "引入话题，展开每个要点，最后简述感受。"),
          L("Keep talking for the full time; do not stop early.", "尽量讲满时间；不要过早结束。"),
          L("If you forget a word, paraphrase — fluency matters more.", "如果忘了某个词，就换个说法——流利度更重要。"),
        ],
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "speak-part3",
    category: "speaking",
    testType: "both",
    order: 4,
    title: L("Part 3: abstract discussion", "Part 3：抽象讨论"),
    summary: L(
      "Develop ideas with reasons, examples, comparisons and speculation.",
      "用原因、例子、比较和推测来展开观点。",
    ),
    sections: [
      {
        heading: L("Idea development", "观点展开"),
        bullets: [
          L("Use a clear structure: opinion → reason → example → implication.", "使用清晰结构：观点 → 原因 → 例子 → 影响。"),
          L("Compare past and present, or advantages and disadvantages.", "比较过去与现在，或利弊。"),
          L("Speculate about the future ('In the future, … might …').", "对未来进行推测。"),
        ],
      },
      {
        heading: L("Handling unfamiliar questions", "应对陌生问题"),
        bullets: [
          L("Buy time naturally: 'That's an interesting question…'", "自然地争取时间：That's an interesting question…"),
          L("It is fine to say 'I'm not an expert, but in my view…'", "可以说 I'm not an expert, but in my view…"),
          L("Stay on topic; give a general opinion and support it.", "保持切题；给出总体观点并加以支持。"),
        ],
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "speak-pronunciation",
    category: "speaking",
    testType: "both",
    order: 5,
    title: L("Pronunciation & fluency", "发音与流利度"),
    summary: L(
      "Stress, rhythm, intonation and connected speech matter more than a 'perfect' accent.",
      "重音、节奏、语调和连读比「完美」口音更重要。",
    ),
    sections: [
      {
        heading: L("Pronunciation features", "发音特征"),
        bullets: [
          L("Word stress: 'PHO-to-graph' vs 'pho-TOG-ra-phy'.", "单词重音：PHO-to-graph vs pho-TOG-ra-phy。"),
          L("Sentence stress: emphasise content words.", "句子重音：强调实词。"),
          L("Intonation: rising/falling patterns for meaning.", "语调：升降调表达含义。"),
          L("Connected speech: 'gonna', 'wanna' are fine in speech; natural linking helps fluency.", "连读：口语中 gonna、wanna 可以接受；自然连读有助于流利度。"),
        ],
      },
      {
        heading: L("Fluency features", "流利度特征"),
        bullets: [
          L("Use discourse markers: 'actually', 'on the whole', 'for instance'.", "使用话语标记：actually、on the whole、for instance。"),
          L("Self-correction is normal and acceptable — but do not over-correct.", "自我纠正是正常的、可接受的——但不要过度纠正。"),
          L("Reduce fillers ('um', 'uh') — pause silently instead.", "减少填充词（um、uh）——宁可短暂停顿。"),
        ],
      },
    ],
    estimatedMinutes: 5,
  },
];
