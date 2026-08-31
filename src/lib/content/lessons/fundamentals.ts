import { L, type Lesson } from "../types";

export const fundamentalsLessons: Lesson[] = [
  {
    id: "fund-what-is-ielts",
    category: "fundamentals",
    testType: "both",
    order: 1,
    title: L("What is IELTS?", "什么是雅思？"),
    summary: L(
      "The International English Language Testing System, trusted by universities, employers and governments worldwide.",
      "国际英语语言测试系统，受到全球大学、雇主和政府信赖。",
    ),
    sections: [
      {
        heading: L("Overview", "概述"),
        paragraphs: [
          L(
            "IELTS (International English Language Testing System) is one of the world's most widely used English language tests. It measures listening, reading, writing and speaking for people who want to study, work or migrate to an English-speaking environment.",
            "雅思（国际英语语言测试系统）是全球使用最广泛的英语语言测试之一。它衡量听力、阅读、写作和口语，面向希望到英语环境学习、工作或移民的人群。",
          ),
          L(
            "IELTS is jointly owned by the British Council, IDP IELTS, and Cambridge University Press & Assessment. It has set the standard for English testing since 1980.",
            "雅思由英国文化协会、IDP 雅思和剑桥大学考试委员会共同拥有。自 1980 年以来一直是英语测试的标杆。",
          ),
        ],
      },
      {
        heading: L("Who uses IELTS", "谁使用雅思"),
        bullets: [
          L("Universities and colleges for admission (especially Academic IELTS)", "大学和学院招生（尤其是学术类雅思）"),
          L("Professional registration bodies (medicine, nursing, engineering, law)", "专业注册机构（医学、护理、工程、法律）"),
          L("Immigration authorities (General Training IELTS)", "移民部门（培训类雅思）"),
          L("Employers assessing workplace English", "评估职场英语的雇主"),
        ],
      },
    ],
    estimatedMinutes: 3,
  },
  {
    id: "fund-academic-vs-general",
    category: "fundamentals",
    testType: "both",
    order: 2,
    title: L("Academic vs General Training", "学术类 vs 培训类"),
    summary: L(
      "Two versions share Listening and Speaking but differ in Reading and Writing.",
      "两种版本共享听力和口语，但阅读和写作不同。",
    ),
    sections: [
      {
        heading: L("The two versions", "两种版本"),
        paragraphs: [
          L(
            "IELTS Academic is for people applying for higher education or professional registration. IELTS General Training is for those migrating to an English-speaking country or applying for secondary education, training programmes or work experience.",
            "学术类雅思面向申请高等教育或专业注册的人。培训类雅思面向移民到英语国家，或申请中学教育、培训项目或工作经验的人。",
          ),
        ],
      },
      {
        heading: L("Key differences", "主要区别"),
        table: {
          headers: [L("Component", "部分"), L("Academic", "学术类"), L("General Training", "培训类")],
          rows: [
            [L("Listening", "听力"), L("Same test", "相同"), L("Same test", "相同")],
            [L("Reading", "阅读"), L("3 long academic texts", "3 篇长篇学术文章"), L("Survival, workplace and general-interest texts", "生存、职场和综合类文章")],
            [L("Writing Task 1", "写作 Task 1"), L("Describe data: graph, chart, map, process", "描述数据：图表、地图、流程图"), L("Write a letter (formal/semi-formal/informal)", "写信（正式/半正式/非正式）")],
            [L("Writing Task 2", "写作 Task 2"), L("Essay (same style)", "议论文（相同形式）"), L("Essay (same style)", "议论文（相同形式）")],
            [L("Speaking", "口语"), L("Same test", "相同"), L("Same test", "相同")],
          ],
        },
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "fund-test-structure",
    category: "fundamentals",
    testType: "both",
    order: 3,
    title: L("Test structure and timings", "考试结构与时间"),
    summary: L(
      "Four sections, around 2 hours 40 minutes total (plus Speaking).",
      "四个部分，总计约 2 小时 40 分钟（另加口语）。",
    ),
    sections: [
      {
        heading: L("Component order and timing", "各部分顺序与时间"),
        table: {
          headers: [L("Component", "部分"), L("Time", "时间"), L("Questions/Tasks", "题目/任务")],
          rows: [
            [L("Listening", "听力"), L("30 min + check time", "30 分钟 + 检查时间"), L("40 questions", "40 题")],
            [L("Reading", "阅读"), L("60 minutes", "60 分钟"), L("40 questions", "40 题")],
            [L("Writing", "写作"), L("60 minutes", "60 分钟"), L("Task 1 + Task 2", "Task 1 + Task 2")],
            [L("Speaking", "口语"), L("11–14 minutes", "11–14 分钟"), L("Parts 1, 2, 3", "Part 1、2、3")],
          ],
        },
        paragraphs: [
          L(
            "In computer-delivered IELTS, Listening, Reading and Writing are taken on a computer in one sitting. The Speaking test is usually taken face-to-face or via video call, and may be on the same day or a different day.",
            "在机考雅思中，听力、阅读和写作在电脑上一次完成。口语通常面对面或通过视频进行，可能在同一天或不同日期。",
          ),
        ],
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "fund-scoring",
    category: "fundamentals",
    testType: "both",
    order: 4,
    title: L("Scoring and band scores", "评分与分数"),
    summary: L(
      "Scores run from 0 to 9 in whole and half bands; overall is the rounded average.",
      "分数从 0 到 9，包括整数和半分；总分是四舍五入的平均分。",
    ),
    sections: [
      {
        heading: L("The 0–9 scale", "0–9 分制"),
        paragraphs: [
          L(
            "Each of the four skills receives a band score from 0 to 9, in whole or half bands. The Overall Band Score is the average of the four scores, rounded to the nearest half band.",
            "四项技能各获得 0–9 分，可为整数或半分。总分是四项平均后四舍五入到最近的半分。",
          ),
        ],
      },
      {
        heading: L("Rounding rule", "四舍五入规则"),
        bullets: [
          L("If the average ends in .25, it rounds UP to the next half band.", "如果平均分小数部分为 .25，向上取整到下一个半分。"),
          L("If the average ends in .75, it rounds UP to the next whole band.", "如果平均分小数部分为 .75，向上取整到下一个整数分。"),
          L("Example: 6 + 6.5 + 6 + 6 = 24.5 → 6.125 → Overall 6.0", "例如：6 + 6.5 + 6 + 6 = 24.5 → 6.125 → 总分 6.0"),
          L("Example: 7 + 6.5 + 6.5 + 6 = 26 → 6.5 → Overall 6.5", "例如：7 + 6.5 + 6.5 + 6 = 26 → 6.5 → 总分 6.5"),
          L("Example: 8 + 8 + 7.5 + 7.5 = 31 → 7.75 → Overall 8.0", "例如：8 + 8 + 7.5 + 7.5 = 31 → 7.75 → 总分 8.0"),
        ],
      },
      {
        heading: L("What band scores mean", "分数含义"),
        table: {
          headers: [L("Band", "分数"), L("Level", "等级"), L("Description", "描述")],
          rows: [
            [L("9", "9"), L("Expert user", "专家用户"), L("Fully operational command", "完全熟练掌握")],
            [L("8", "8"), L("Very good user", "优秀用户"), L("Occasional unsystematic inaccuracies", "偶尔出现非系统性错误")],
            [L("7", "7"), L("Good user", "良好用户"), L("Operational command, occasional inaccuracies", "可操作运用，偶尔出错")],
            [L("6", "6"), L("Competent user", "合格用户"), L("Generally effective command", "基本有效运用")],
            [L("5", "5"), L("Modest user", "中等用户"), L("Partial command", "部分掌握")],
            [L("4", "4"), L("Limited user", "有限用户"), L("Basic competence in familiar situations", "熟悉情境下的基本能力")],
          ],
        },
      },
    ],
    estimatedMinutes: 6,
  },
  {
    id: "fund-listening-scoring",
    category: "fundamentals",
    testType: "both",
    order: 5,
    title: L("Listening scoring", "听力评分"),
    summary: L(
      "40 questions; one mark each; raw score converts to a band.",
      "40 题，每题 1 分；原始分换算为分数。",
    ),
    sections: [
      {
        heading: L("How it works", "如何评分"),
        paragraphs: [
          L(
            "Listening has 40 questions, each worth one mark. The raw score (number correct) converts to a band score using a conversion table. Answers must be spelled correctly; word limits must be respected.",
            "听力共 40 题，每题 1 分。原始分（答对题数）通过换算表转换为分数。答案拼写必须正确，且必须遵守字数限制。",
          ),
        ],
      },
      {
        heading: L("Approximate conversion", "近似换算"),
        table: {
          headers: [L("Raw score", "原始分"), L("Band", "分数")],
          rows: [
            [L("39–40", "39–40"), L("9.0", "9.0")],
            [L("37–38", "37–38"), L("8.5", "8.5")],
            [L("35–36", "35–36"), L("8.0", "8.0")],
            [L("32–34", "32–34"), L("7.5", "7.5")],
            [L("30–31", "30–31"), L("7.0", "7.0")],
            [L("26–29", "26–29"), L("6.5", "6.5")],
            [L("23–25", "23–25"), L("6.0", "6.0")],
            [L("18–22", "18–22"), L("5.5", "5.5")],
            [L("16–17", "16–17"), L("5.0", "5.0")],
          ],
        },
        paragraphs: [
          L(
            "These thresholds are approximate: official IELTS states exact raw-score cut-offs may vary slightly between test versions.",
            "这些阈值是近似值：雅思官方表示，不同考试版本的实际原始分阈值可能略有差异。",
          ),
        ],
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "fund-reading-scoring",
    category: "fundamentals",
    testType: "both",
    order: 6,
    title: L("Reading scoring", "阅读评分"),
    summary: L(
      "Academic and General Training use different conversion tables.",
      "学术类和培训类使用不同的换算表。",
    ),
    sections: [
      {
        heading: L("Academic vs General Training", "学术类 vs 培训类"),
        paragraphs: [
          L(
            "Both have 40 questions worth one mark each, but the General Training conversion table is stricter: you generally need a higher raw score for the same band because the texts are considered less demanding.",
            "两者都有 40 题、每题 1 分，但培训类的换算表更严格：通常需要更高的原始分才能达到同样的分数，因为文本难度被认为较低。",
          ),
        ],
      },
      {
        heading: L("Approximate Academic conversion", "学术类近似换算"),
        table: {
          headers: [L("Raw score", "原始分"), L("Band", "分数")],
          rows: [
            [L("39–40", "39–40"), L("9.0", "9.0")],
            [L("37–38", "37–38"), L("8.5", "8.5")],
            [L("35–36", "35–36"), L("8.0", "8.0")],
            [L("33–34", "33–34"), L("7.5", "7.5")],
            [L("30–32", "30–32"), L("7.0", "7.0")],
            [L("27–29", "27–29"), L("6.5", "6.5")],
            [L("23–26", "23–26"), L("6.0", "6.0")],
          ],
        },
      },
      {
        heading: L("Approximate General Training conversion", "培训类近似换算"),
        table: {
          headers: [L("Raw score", "原始分"), L("Band", "分数")],
          rows: [
            [L("40", "40"), L("9.0", "9.0")],
            [L("39", "39"), L("8.5", "8.5")],
            [L("38", "38"), L("8.0", "8.0")],
            [L("36–37", "36–37"), L("7.5", "7.5")],
            [L("34–35", "34–35"), L("7.0", "7.0")],
            [L("32–33", "32–33"), L("6.5", "6.5")],
            [L("30–31", "30–31"), L("6.0", "6.0")],
          ],
        },
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "fund-writing-scoring",
    category: "fundamentals",
    testType: "both",
    order: 7,
    title: L("Writing scoring", "写作评分"),
    summary: L(
      "Four criteria; Task 2 carries double the weight of Task 1.",
      "四个标准；Task 2 权重是 Task 1 的两倍。",
    ),
    sections: [
      {
        heading: L("The four criteria", "四个标准"),
        bullets: [
          L("Task Achievement (Task 1) / Task Response (Task 2)", "任务完成情况（Task 1）/ 任务回应情况（Task 2）"),
          L("Coherence and Cohesion", "连贯与衔接"),
          L("Lexical Resource", "词汇资源"),
          L("Grammatical Range and Accuracy", "语法多样性与准确性"),
        ],
      },
      {
        heading: L("Weighting", "权重"),
        paragraphs: [
          L(
            "Task 2 is worth twice as much as Task 1. The Writing band is calculated as (Task 1 + Task 2 × 2) ÷ 3, then rounded to the nearest half band.",
            "Task 2 的分值是 Task 1 的两倍。写作分数按 (Task 1 + Task 2 × 2) ÷ 3 计算，再四舍五入到最近的半分。",
          ),
        ],
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "fund-speaking-scoring",
    category: "fundamentals",
    testType: "both",
    order: 8,
    title: L("Speaking scoring", "口语评分"),
    summary: L(
      "Four equally-weighted criteria assessed by a certified examiner.",
      "由认证考官按四个等权标准评分。",
    ),
    sections: [
      {
        heading: L("The four criteria", "四个标准"),
        bullets: [
          L("Fluency and Coherence", "流利度与连贯性"),
          L("Lexical Resource", "词汇资源"),
          L("Grammatical Range and Accuracy", "语法多样性与准确性"),
          L("Pronunciation", "发音"),
        ],
        paragraphs: [
          L(
            "Each criterion is equally weighted; the Speaking band is the average of the four, rounded to the nearest half band.",
            "每个标准权重相等；口语分数是四项平均后四舍五入到最近的半分。",
          ),
        ],
      },
    ],
    estimatedMinutes: 3,
  },
  {
    id: "fund-computer-delivery",
    category: "fundamentals",
    testType: "both",
    order: 9,
    title: L("Computer-delivered IELTS", "机考雅思"),
    summary: L(
      "Computer-delivered is the primary format; know the interface before test day.",
      "机考是主要形式；考试前先熟悉界面。",
    ),
    sections: [
      {
        heading: L("Current format", "当前形式"),
        paragraphs: [
          L(
            "Computer-delivered IELTS is now the primary delivery format. You take Listening, Reading and Writing on a computer. You can highlight text, make notes, and navigate questions on screen. The Listening recording plays once with a checking period at the end.",
            "机考雅思现在是主要的考试形式。你在电脑上完成听力、阅读和写作。你可以高亮文本、做笔记并在屏幕上导航题目。听力录音只播放一次，最后有检查时间。",
          ),
          L(
            "In selected markets, a 'Writing on Paper' option may be available, where only the Writing component is completed on paper. Always confirm the exact format with your test centre.",
            "在部分市场，可能提供「纸笔写作」选项，即仅写作部分在纸上完成。请务必向考试中心确认具体形式。",
          ),
        ],
      },
      {
        heading: L("Interface concepts", "界面概念"),
        bullets: [
          L("Question navigator shows answered / unanswered / flagged states", "题目导航显示已答/未答/已标记状态"),
          L("Text highlighting and notes are available in Reading", "阅读中可高亮文本和做笔记"),
          L("Listening audio plays once; answers are typed on screen", "听力音频只播放一次；答案在屏幕上输入"),
          L("Writing is typed; word count is displayed", "写作需打字；显示字数"),
        ],
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "fund-test-day",
    category: "fundamentals",
    testType: "both",
    order: 10,
    title: L("Test-day workflow", "考试当天流程"),
    summary: L(
      "Registration, identity check, then Listening → Reading → Writing; Speaking separately.",
      "注册、身份核验，然后听力 → 阅读 → 写作；口语另考。",
    ),
    sections: [
      {
        heading: L("On the day", "当天流程"),
        bullets: [
          L("Arrive early with valid ID (usually the same passport/national ID used to register)", "携带有效证件提前到场（通常与报名时相同）"),
          L("Electronic devices are stored before the test", "电子设备在考前存放"),
          L("Listening, Reading and Writing run consecutively with no long breaks", "听力、阅读、写作连续进行，无长休息"),
          L("Speaking is scheduled separately (same day or within a window)", "口语单独安排（当天或一段时间内）"),
        ],
      },
    ],
    estimatedMinutes: 3,
  },
  {
    id: "fund-one-skill-retake",
    category: "fundamentals",
    testType: "both",
    order: 11,
    title: L("One Skill Retake & result validity", "单科重考与成绩有效期"),
    summary: L(
      "One Skill Retake lets you retake one component; results are typically valid for two years.",
      "单科重考允许你重考一个部分；成绩通常两年有效。",
    ),
    sections: [
      {
        heading: L("One Skill Retake", "单科重考"),
        paragraphs: [
          L(
            "IELTS One Skill Retake allows you to retake a single component (Listening, Reading, Writing or Speaking) if you did not achieve your desired score the first time. Availability varies by test centre, so check with your provider.",
            "雅思单科重考允许你在首次未达到目标分数时重考单个部分（听力、阅读、写作或口语）。是否提供因考点而异，请向考试机构确认。",
          ),
        ],
      },
      {
        heading: L("Result validity", "成绩有效期"),
        paragraphs: [
          L(
            "IELTS results are generally valid for two years from the test date, but receiving organisations may set their own requirements — always confirm with the institution.",
            "雅思成绩一般自考试日期起两年内有效，但接收机构可能有自己的要求——请务必与相关机构确认。",
          ),
        ],
      },
    ],
    estimatedMinutes: 2,
  },
  {
    id: "fund-target-scores",
    category: "fundamentals",
    testType: "both",
    order: 12,
    title: L("Target scores and requirements", "目标分数与要求"),
    summary: L(
      "Typical university and immigration requirements, as general guidance.",
      "典型的大学和移民要求，作为一般参考。",
    ),
    sections: [
      {
        heading: L("Common requirements (general guidance)", "常见要求（一般参考）"),
        table: {
          headers: [L("Purpose", "用途"), L("Typical overall band", "常见总分要求")],
          rows: [
            [L("Undergraduate study", "本科学习"), L("6.0–6.5", "6.0–6.5")],
            [L("Postgraduate study", "研究生学习"), L("6.5–7.5", "6.5–7.5")],
            [L("Professional registration", "专业注册"), L("7.0–7.5 (often with per-skill minimums)", "7.0–7.5（常含单项最低分）")],
            [L("Skilled migration (varies by country)", "技术移民（因国家而异）"), L("6.0–8.0", "6.0–8.0")],
          ],
        },
        paragraphs: [
          L(
            "These are rough ranges only. Always check the specific requirement of your university, employer or immigration programme, including any per-skill minimums.",
            "这些仅为大致范围。请务必查询你申请的大学、雇主或移民项目的具体要求，包括单项最低分。",
          ),
        ],
      },
    ],
    estimatedMinutes: 3,
  },
  {
    id: "fund-misconceptions",
    category: "fundamentals",
    testType: "both",
    order: 13,
    title: L("Common misconceptions", "常见误区"),
    summary: L("Clear up the myths that waste study time.", "澄清浪费学习时间的误区。"),
    sections: [
      {
        heading: L("Myths vs reality", "误区 vs 事实"),
        bullets: [
          L("Myth: 'I must use a British accent.' Reality: IELTS accepts all standard English accents.", "误区：必须用英式口音。事实：雅思接受所有标准英语口音。"),
          L("Myth: 'More words = higher writing score.' Reality: quality and task relevance matter more than length.", "误区：字数越多写作分越高。事实：质量与切题比长度更重要。"),
          L("Myth: 'Memorised essays score well.' Reality: memorised/template-heavy responses are penalised.", "误区：背诵范文能得高分。事实：背诵/模板化回答会被扣分。"),
          L("Myth: 'There is a pass/fail.' Reality: IELTS reports a band score; there is no pass or fail.", "误区：雅思有及格线。事实：雅思报告分数，没有通过或不通过。"),
          L("Myth: 'I can pause the Listening audio.' Reality: the recording plays once.", "误区：可以暂停听力音频。事实：录音只播放一次。"),
        ],
      },
    ],
    estimatedMinutes: 3,
  },
];
