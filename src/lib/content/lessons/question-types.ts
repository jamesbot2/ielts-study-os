import { L, type Lesson } from "../types";

// Deep question-type lessons for Listening and Reading, with worked examples,
// exam tips, common traps and band guidance. Bilingual.

export const deepQuestionTypeLessons: Lesson[] = [
  // ---------- LISTENING ----------
  {
    id: "list-matching",
    category: "listening",
    testType: "both",
    order: 10,
    title: L("Listening: matching questions", "听力：配对题"),
    summary: L(
      "Match items to statements by tracking paraphrase and distractors.",
      "通过追踪同义替换和干扰项来配对题目。",
    ),
    estimatedMinutes: 8,
    difficulty: 2,
    relatedQuestionTypes: ["matching"],
    sections: [
      {
        heading: L("What matching questions look like", "配对题长什么样"),
        paragraphs: [
          L(
            "You hear a conversation or talk and must match a list of items (e.g. speakers, places, courses) to a list of options (e.g. opinions, features, locations). The options are usually labelled A–F, and the items are numbered questions.",
            "你会听到一段对话或独白，需要把一组项目（如说话者、地点、课程）与一组选项（如观点、特征、位置）配对。选项通常标为 A–F，项目则按题号排列。",
          ),
          L(
            "The key challenge: the recording does not use the exact words from the options. It paraphrases them, and it often mentions several options for one item before settling on the correct one.",
            "关键难点：录音不会使用选项中的原词，而是进行同义替换；而且常常会先提到多个选项，最后才确定正确答案。",
          ),
        ],
        callouts: [
          {
            kind: "example",
            title: L("Worked example", "示例"),
            text: [
              L(
                "Item: 'What does Tom think of the new library?' Options: A) too expensive  B) well organised  C) too small.",
                "题目：Tom 对新图书馆怎么看？选项：A) 太贵  B) 组织得好  C) 太小。",
              ),
              L(
                "You hear: 'I thought it would be cramped, but actually everything's easy to find.' The word 'cramped' suggests C, but then 'but actually' corrects this and 'easy to find' paraphrases 'well organised' — the answer is B.",
                "你听到：I thought it would be cramped, but actually everything's easy to find. 「cramped」（狭窄）暗示 C，但「but actually」进行了纠正，「easy to find」（容易找到）是「well organised」（组织得好）的同义替换——答案是 B。",
              ),
            ],
          },
        ],
      },
      {
        heading: L("Strategy", "策略"),
        bullets: [
          L("Before listening, read both the items and the options, and underline keywords.", "听前阅读项目和选项，并划出关键词。"),
          L("Listen for paraphrase of the options, not the exact words.", "注意选项的同义替换，而非原词。"),
          L("Track the order: items are usually mentioned in order, but options may repeat.", "跟踪顺序：项目通常按顺序出现，但选项可能重复。"),
          L("Write a possible letter lightly, then confirm or change it when the speaker corrects themselves.", "先轻写一个可能的字母，听到说话者自我纠正时再确认或更改。"),
        ],
        callouts: [
          {
            kind: "commonMistake",
            title: L("Common trap", "常见陷阱"),
            text: [
              L(
                "Choosing the first option you hear mentioned. Speakers frequently mention a distractor first, then correct it with 'but', 'actually', 'in fact' or 'rather than'.",
                "选择你听到的第一个选项。说话者经常先提到干扰项，然后用 but、actually、in fact 或 rather than 进行纠正。",
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "list-map-labelling",
    category: "listening",
    testType: "both",
    order: 11,
    title: L("Listening: map and plan labelling", "听力：地图与平面图标示"),
    summary: L(
      "Follow directions on a map using landmarks, compass points and position language.",
      "利用地标、方位词和位置语言在地图上跟随路线。",
    ),
    estimatedMinutes: 8,
    difficulty: 2,
    relatedQuestionTypes: ["map_labelling", "plan_labelling"],
    sections: [
      {
        heading: L("How it works", "如何作答"),
        paragraphs: [
          L(
            "You see a map or plan with some labels missing (A, B, C…). The speaker describes a route or location, and you match the described place to the correct position.",
            "你会看到一张地图或平面图，部分标注缺失（A、B、C…）。说话者描述一条路线或位置，你需要把所描述的地点与正确位置对应起来。",
          ),
        ],
        bullets: [
          L("Compass points: north, south, east, west, north-east…", "方位词：north、south、east、west、north-east…"),
          L("Position: next to, opposite, in front of, behind, between, on the corner of", "位置：next to、opposite、in front of、behind、between、on the corner of"),
          L("Direction of travel: go straight on, turn left/right, past the…, head towards", "行进方向：go straight on、turn left/right、past the…、head towards"),
        ],
        callouts: [
          {
            kind: "examTip",
            title: L("Exam tip", "考试技巧"),
            text: [
              L(
                "Look at the map BEFORE the audio starts and predict what each labelled area might be. Note the entrance/start point (often marked 'You are here').",
                "在音频开始前先看地图，预测每个已标注区域可能是什么。注意入口/起点（通常标有 You are here）。",
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "list-form-completion",
    category: "listening",
    testType: "both",
    order: 12,
    title: L("Listening: form and note completion", "听力：表格与笔记填空"),
    summary: L(
      "Complete forms and notes with exact words from the audio, respecting word limits.",
      "用音频中的原词完成表格和笔记，并遵守字数限制。",
    ),
    estimatedMinutes: 8,
    difficulty: 1,
    relatedQuestionTypes: ["form_completion", "note_completion", "table_completion"],
    sections: [
      {
        heading: L("What to listen for", "要听什么"),
        bullets: [
          L("Names are spelled out letter by letter — write each letter accurately.", "名字会逐字母拼读——准确记录每个字母。"),
          L("Numbers: dates, prices, telephone numbers, postcodes, quantities.", "数字：日期、价格、电话号码、邮编、数量。"),
          L("Word limits: 'ONE WORD ONLY', 'NO MORE THAN TWO WORDS AND/OR A NUMBER'.", "字数限制：ONE WORD ONLY、NO MORE THAN TWO WORDS AND/OR A NUMBER。"),
          L("Singular vs plural: the final -s matters and is marked wrong if missing.", "单复数：词尾 -s 很重要，漏写会被判错。"),
        ],
        callouts: [
          {
            kind: "commonMistake",
            title: L("Common trap", "常见陷阱"),
            text: [
              L(
                "Writing 'books' when the answer is 'book'. Always decide from context whether the noun should be plural, and check the grammar of the sentence around the gap.",
                "答案本应是 book，却写成 books。始终根据上下文判断名词是否应为复数，并检查空格前后句子的语法。",
              ),
            ],
          },
          {
            kind: "bandComparison",
            title: L("Band 6 vs Band 7", "6 分 vs 7 分"),
            text: [
              L(
                "Band 6 learners often get simple gaps right but lose marks on spelling, plurals and word limits. Band 7 learners systematically check spelling and grammar and rarely lose easy marks.",
                "6 分学习者常能做对简单填空，但在拼写、复数和字数限制上丢分。7 分学习者会系统地检查拼写和语法，很少丢失容易的分。",
              ),
            ],
          },
        ],
      },
    ],
  },
  // ---------- READING ----------
  {
    id: "read-tfng",
    category: "reading",
    testType: "both",
    order: 20,
    title: L("Reading: True / False / Not Given", "阅读：判断正误（True / False / Not Given）"),
    summary: L(
      "Distinguish what the passage states, what it contradicts, and what it never says.",
      "区分文章陈述的、文章否定的、以及文章从未提及的内容。",
    ),
    estimatedMinutes: 12,
    difficulty: 3,
    relatedQuestionTypes: ["true_false_not_given"],
    sections: [
      {
        heading: L("The three options", "三种判定"),
        bullets: [
          L("TRUE — the statement agrees with information in the passage.", "TRUE — 陈述与文章信息一致。"),
          L("FALSE — the statement contradicts information in the passage.", "FALSE — 陈述与文章信息矛盾。"),
          L("NOT GIVEN — the information is not mentioned at all.", "NOT GIVEN — 信息完全没有提及。"),
        ],
        callouts: [
          {
            kind: "warning",
            title: L("The key distinction", "关键区别"),
            text: [
              L(
                "FALSE means the passage says the OPPOSITE. NOT GIVEN means the passage says NOTHING about it — even if it feels true in real life.",
                "FALSE 表示文章说了相反的内容。NOT GIVEN 表示文章什么都没说——即使它在现实生活中感觉是对的。",
              ),
            ],
          },
        ],
      },
      {
        heading: L("Worked examples", "示例"),
        paragraphs: [
          L("Passage: 'Most commuters in the city travel to work by bus.'", "原文：Most commuters in the city travel to work by bus."),
        ],
        callouts: [
          {
            kind: "example",
            text: [
              L("1) 'The majority of the city's commuters use the bus.' → TRUE (paraphrase of 'most').", "1) 「该市大多数通勤者乘坐公交车。」→ TRUE（most 的同义替换）。"),
              L("2) 'Few commuters in the city travel by bus.' → FALSE ('few' contradicts 'most').", "2) 「该市很少有通勤者乘坐公交车。」→ FALSE（few 与 most 矛盾）。"),
              L("3) 'Commuters find the bus service uncomfortable.' → NOT GIVEN (nothing about comfort).", "3) 「通勤者觉得公交服务不舒服。」→ NOT GIVEN（未提及舒适度）。"),
            ],
          },
        ],
      },
      {
        heading: L("Strategy", "策略"),
        bullets: [
          L("Scan for the statement's keyword, then read the surrounding sentence carefully.", "扫读陈述中的关键词，然后仔细阅读周围句子。"),
          L("Watch for qualifiers: 'most', 'some', 'all', 'often', 'always', 'never'.", "注意限定词：most、some、all、often、always、never。"),
          L("If you cannot find the information after a reasonable search, it is probably Not Given.", "如果合理搜索后仍找不到该信息，很可能就是 Not Given。"),
        ],
        callouts: [
          {
            kind: "commonMistake",
            title: L("Common trap", "常见陷阱"),
            text: [
              L(
                "Answering Not Given too quickly. Always check whether the passage actually says the opposite (which would be False) before choosing Not Given.",
                "过快作答 Not Given。在选择 Not Given 之前，先确认文章是否说了相反内容（那将是 False）。",
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "read-yesno",
    category: "reading",
    testType: "both",
    order: 21,
    title: L("Reading: Yes / No / Not Given", "阅读：作者观点（Yes / No / Not Given）"),
    summary: L(
      "Judge the writer's opinions and claims, not facts.",
      "判断作者的观点和主张，而非事实。",
    ),
    estimatedMinutes: 10,
    difficulty: 3,
    relatedQuestionTypes: ["yes_no_not_given"],
    sections: [
      {
        heading: L("The difference from T/F/NG", "与 T/F/NG 的区别"),
        paragraphs: [
          L(
            "Yes/No/Not Given questions ask about the WRITER'S VIEWS or CLAIMS — what the writer believes, argues or implies. True/False/Not Given questions ask about FACTS stated in the passage.",
            "Yes/No/Not Given 询问作者的观点或主张——作者相信、论证或暗示的内容。True/False/Not Given 询问文章陈述的事实。",
          ),
        ],
        callouts: [
          {
            kind: "example",
            text: [
              L(
                "'The writer believes that cars are the main cause of congestion.' Look for opinion language: 'I believe', 'it seems', 'undoubtedly', 'the real problem is'.",
                "「作者认为汽车是拥堵的主要原因。」寻找观点性语言：I believe、it seems、undoubtedly、the real problem is。",
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "read-matching-headings",
    category: "reading",
    testType: "both",
    order: 22,
    title: L("Reading: matching headings", "阅读：段落标题配对"),
    summary: L(
      "Choose the heading that best summarises each paragraph's main idea.",
      "选择最能概括每段主旨的标题。",
    ),
    estimatedMinutes: 10,
    difficulty: 3,
    relatedQuestionTypes: ["matching_headings"],
    sections: [
      {
        heading: L("Strategy", "策略"),
        bullets: [
          L("Read the FIRST sentence (topic sentence) and sometimes the last sentence of each paragraph.", "阅读每段的第一句（主题句），有时也读最后一句。"),
          L("Ignore details and examples; identify the paragraph's MAIN idea.", "忽略细节和例子；找出段落的主旨。"),
          L("Eliminate headings that are too specific or too general.", "排除过于具体或过于宽泛的标题。"),
          L("There are usually more headings than paragraphs, so some headings are unused.", "标题通常多于段落，因此有些标题用不上。"),
        ],
        callouts: [
          {
            kind: "commonMistake",
            title: L("Common trap", "常见陷阱"),
            text: [
              L(
                "Choosing a heading that matches one DETAIL in the paragraph rather than the main idea. A paragraph about 'causes of X' may mention 'a study in 2010' — do not pick the heading about 'a 2010 study'.",
                "选择了与段落中某个细节相符的标题，而非主旨。一段讲「X 的原因」的文字可能提到「2010 年的一项研究」——不要选「2010 年研究」这个标题。",
              ),
            ],
          },
        ],
      },
    ],
  },
];
