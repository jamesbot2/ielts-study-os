import { L, type Lesson } from "../types";

export const grammarLessons: Lesson[] = [
  {
    id: "gram-sentences",
    category: "grammar",
    testType: "both",
    order: 1,
    title: L("Sentence structure", "句子结构"),
    summary: L(
      "Simple, compound, complex and compound-complex sentences.",
      "简单句、并列句、复合句和并列复合句。",
    ),
    sections: [
      {
        heading: L("Four sentence types", "四种句型"),
        bullets: [
          L("Simple: one independent clause. 'Public transport reduces congestion.'", "简单句：一个独立分句。Public transport reduces congestion."),
          L("Compound: two independent clauses joined by a conjunction. '…and…', '…but…'.", "并列句：由连词连接的两个独立分句。"),
          L("Complex: independent + dependent clause. 'Although cars are convenient, they cause pollution.'", "复合句：独立分句 + 从属分句。"),
          L("Compound-complex: two independent clauses + at least one dependent clause.", "并列复合句：两个独立分句 + 至少一个从属分句。"),
        ],
        paragraphs: [
          L(
            "IELTS rewards a RANGE of sentence types used accurately. Do not write only short simple sentences, and do not force long complex ones.",
            "雅思奖励准确使用多种句型。不要只写短简单句，也不要硬凑长复合句。",
          ),
        ],
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "gram-clauses",
    category: "grammar",
    testType: "both",
    order: 2,
    title: L("Clauses", "分句"),
    summary: L(
      "Relative, noun, adverbial and participle clauses.",
      "定语从句、名词性从句、状语从句和分词结构。",
    ),
    sections: [
      {
        heading: L("Clause types", "分句类型"),
        bullets: [
          L("Relative clause: 'The policy, which was introduced last year, has reduced waste.'", "定语从句：The policy, which was introduced last year, has reduced waste."),
          L("Noun clause: 'What the data shows is a clear decline.'", "名词性从句：What the data shows is a clear decline."),
          L("Adverbial clause: 'Because demand rose, prices increased.'", "状语从句：Because demand rose, prices increased."),
          L("Participle clause: 'Facing rising costs, many families cut spending.'", "分词结构：Facing rising costs, many families cut spending."),
        ],
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "gram-agreement",
    category: "grammar",
    testType: "both",
    order: 3,
    title: L("Subject–verb agreement & articles", "主谓一致与冠词"),
    summary: L(
      "Two of the most common IELTS grammar error sources.",
      "雅思语法最常见的两类错误来源。",
    ),
    sections: [
      {
        heading: L("Subject–verb agreement", "主谓一致"),
        bullets: [
          L("Singular subject → singular verb; the number of… takes a singular verb.", "单数主语接单数动词；the number of… 接单数动词。"),
          L("'A number of…' takes a plural verb.", "a number of… 接复数动词。"),
          L("Collective nouns (team, government) can be singular or plural depending on meaning.", "集合名词（team、government）视含义可单可复。"),
        ],
      },
      {
        heading: L("Articles and countable nouns", "冠词与可数名词"),
        bullets: [
          L("Use 'a/an' for singular countable nouns mentioned for the first time.", "首次提到的单数可数名词用 a/an。"),
          L("Use 'the' for specific or previously mentioned items.", "特指或已提及的事物用 the。"),
          L("Uncountable nouns (information, advice, research) take no plural and no 'a'.", "不可数名词（information、advice、research）不加复数、不加 a。"),
        ],
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "gram-tenses-conditionals",
    category: "grammar",
    testType: "both",
    order: 4,
    title: L("Tenses & conditionals", "时态与条件句"),
    summary: L(
      "Consistent tense control and the four conditional patterns.",
      "一致的时态控制和四种条件句。",
    ),
    sections: [
      {
        heading: L("Tense consistency", "时态一致"),
        bullets: [
          L("Do not shift tense without reason within a paragraph.", "段落内不要无故转换时态。"),
          L("Use present for general truths, past for completed events, present perfect for experience up to now.", "一般真理用现在时，已发生事件用过去时，截至现在的经历用现在完成时。"),
        ],
      },
      {
        heading: L("Conditionals", "条件句"),
        bullets: [
          L("Zero: If + present, present (general truths).", "零条件：If + 现在时，现在时（普遍真理）。"),
          L("First: If + present, will + verb (real future).", "第一条件：If + 现在时，will + 动词（真实将来）。"),
          L("Second: If + past, would + verb (unreal present).", "第二条件：If + 过去时，would + 动词（虚拟现在）。"),
          L("Third: If + past perfect, would have + past participle (unreal past).", "第三条件：If + 过去完成时，would have + 过去分词（虚拟过去）。"),
        ],
      },
    ],
    estimatedMinutes: 5,
  },
  {
    id: "gram-passive-modals",
    category: "grammar",
    testType: "both",
    order: 5,
    title: L("Passive voice & modals", "被动语态与情态动词"),
    summary: L(
      "Passive is essential for processes; modals for hedging and speculation.",
      "被动语态对流程图至关重要；情态动词用于委婉和推测。",
    ),
    sections: [
      {
        heading: L("Passive voice", "被动语态"),
        bullets: [
          L("Use passive when the agent is unknown or unimportant: 'The bottles are then sealed.'", "当动作主体未知或不重要时用被动：The bottles are then sealed."),
          L("Essential for Task 1 process descriptions.", "流程图描述中必不可少。"),
        ],
      },
      {
        heading: L("Modals & hedging", "情态动词与委婉表达"),
        bullets: [
          L("Hedge claims: 'This may result in…', 'It could be argued that…'.", "委婉表达：This may result in…、It could be argued that…。"),
          L("Use 'should/must' for strong advice, 'might/could' for possibility.", "强建议用 should/must，可能性用 might/could。"),
        ],
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "gram-punctuation",
    category: "grammar",
    testType: "both",
    order: 6,
    title: L("Punctuation & common errors", "标点与常见错误"),
    summary: L(
      "Commas, semicolons, colons, apostrophes, fragments and run-ons.",
      "逗号、分号、冒号、撇号、残句和连写句。",
    ),
    sections: [
      {
        heading: L("Punctuation", "标点"),
        bullets: [
          L("Comma: separate list items, set off non-defining clauses.", "逗号：分隔列举项、隔开非限定性从句。"),
          L("Semicolon: join two closely related independent clauses.", "分号：连接两个紧密相关的独立分句。"),
          L("Colon: introduce a list or explanation.", "冒号：引出列举或解释。"),
          L("Apostrophe: possession (the city's) and contraction (it's = it is).", "撇号：所有格（the city's）和缩写（it's = it is）。"),
        ],
      },
      {
        heading: L("Fragments and run-ons", "残句与连写句"),
        bullets: [
          L("Fragment: incomplete sentence ('Because the cost is high.'). Attach it to a main clause.", "残句：不完整的句子（Because the cost is high.）。要接主句。"),
          L("Run-on: two independent clauses without proper punctuation or conjunction.", "连写句：两个独立分句之间缺少标点或连词。"),
        ],
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "gram-academic-style",
    category: "grammar",
    testType: "both",
    order: 7,
    title: L("Formal academic style", "正式学术风格"),
    summary: L(
      "Nominalisation, hedging and formal choices for Writing.",
      "写作中的名词化、委婉表达和正式用词。",
    ),
    sections: [
      {
        heading: L("Formal style techniques", "正式风格技巧"),
        bullets: [
          L("Nominalisation: 'The government decided' → 'The government's decision'.", "名词化：The government decided → The government's decision。"),
          L("Avoid contractions in Writing: use 'do not', not 'don't'.", "写作中避免缩写：用 do not，不用 don't。"),
          L("Avoid overly personal phrases: replace 'I think' with hedged claims.", "避免过于个人化的表达：用委婉陈述代替 I think。"),
          L("Choose precise verbs: 'increase dramatically' rather than 'go up a lot'.", "选择准确动词：用 increase dramatically 而非 go up a lot。"),
        ],
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "gram-articles-countability",
    category: "grammar",
    testType: "both",
    order: 8,
    title: L("Articles, countability and quantifiers", "冠词、可数与数量词"),
    summary: L(
      "A/an, the and zero article, plus how countability controls every determiner you choose.",
      "a/an、the 与零冠词，以及可数性如何决定你对限定词的选择。",
    ),
    sections: [
      {
        heading: L("Countability comes first", "先判断可数性"),
        paragraphs: [
          L(
            "Before choosing an article, decide whether the noun is countable or uncountable. Advice, information, research, equipment, furniture and evidence are uncountable in English even when their Chinese translations feel countable.",
            "选择冠词之前，先判断名词是否可数。advice、information、research、equipment、furniture、evidence 在英语中不可数，即使其中文翻译感觉可数。",
          ),
        ],
        callouts: [
          {
            kind: "commonMistake",
            title: L("Common transfer error", "常见迁移错误"),
            items: [
              L("✗ He gave me many advices. → ✓ He gave me a lot of advice.", "✗ He gave me many advices. → ✓ He gave me a lot of advice."),
              L("✗ a useful information → ✓ useful information / a useful piece of information", "✗ a useful information → ✓ useful information / a useful piece of information"),
            ],
          },
        ],
      },
      {
        heading: L("Choosing between a/an, the and zero article", "a/an、the 与零冠词"),
        bullets: [
          L("First mention of something countable and not yet identified: a/an. 'A study found…'", "首次提到且未具体化的可数名词用 a/an。"),
          L("Specific, shared or previously mentioned: the. 'The study found…'", "具体的、双方已知或上文提到过的事物用 the。"),
          L("General plural or uncountable meaning: zero article. 'Research shows…'", "泛指复数或不可数概念用零冠词。"),
          L("Unique things, superlatives and ordinal references: the. 'the only solution', 'the highest rate'.", "独一无二的事物、最高级和序数前用 the。"),
        ],
      },
      {
        heading: L("Quantifier grammar", "数量词语法"),
        bullets: [
          L("many / few + plural countable; much / little + uncountable.", "many/few 接可数复数；much/little 接不可数。"),
          L("a number of + plural verb; the number of + singular verb.", "a number of 接复数动词；the number of 接单数动词。"),
          L("Most / some / all work with both types when meaning allows.", "most/some/all 在语义允许时两种名词都可用。"),
        ],
      },
    ],
    estimatedMinutes: 10,
  },
  {
    id: "gram-relative-clauses",
    category: "grammar",
    testType: "both",
    order: 9,
    title: L("Relative clauses", "关系从句"),
    summary: L(
      "Defining and non-defining relative clauses, relative pronouns, and when to use commas.",
      "限定性与非限定性关系从句、关系代词以及逗号的使用。",
    ),
    sections: [
      {
        heading: L("Defining vs non-defining", "限定性 vs 非限定性"),
        paragraphs: [
          L(
            "A defining relative clause identifies which thing you mean and has no commas. A non-defining clause adds extra information and needs commas.",
            "限定性关系从句指明“哪一个”，不加逗号；非限定性从句补充额外信息，必须加逗号。",
          ),
        ],
        bullets: [
          L("Defining: 'The policy that was introduced last year reduced fares.'", "限定性：去年出台的那项政策降低了票价。"),
          L("Non-defining: 'The policy, which was introduced last year, reduced fares.'", "非限定性：该项政策（去年出台）降低了票价。"),
          L("Do not use 'that' in non-defining clauses.", "非限定性从句中不用 that。"),
        ],
      },
      {
        heading: L("Pronoun choice", "代词选择"),
        bullets: [
          L("who for people; which for things; that for either in defining clauses.", "who 指人；which 指物；that 在限定性从句中两者皆可。"),
          L("where for places, when for times, whose for possession.", "where 指地点，when 指时间，whose 表所属。"),
          L("Omit the pronoun when it is the object of a defining clause: 'the book (that) I read'.", "代词在限定性从句中作宾语时可省略：the book (that) I read。"),
        ],
        callouts: [
          {
            kind: "commonMistake",
            title: L("Watch for", "注意"),
            items: [
              L("✗ The city which I grew up. → ✓ The city where I grew up.", "✗ The city which I grew up. → ✓ The city where I grew up."),
              L("✗ My brother, that lives abroad, is a doctor. → ✓ …, who lives abroad, …", "非限定性从句用 who/which，不用 that。"),
            ],
          },
        ],
      },
      {
        heading: L("IELTS use", "雅思应用"),
        paragraphs: [
          L(
            "Relative clauses let you combine ideas without over-using 'and'. In Writing Task 1: 'The sector which grew fastest was renewables.' In Speaking: 'The place where I feel most relaxed is…'",
            "关系从句能帮你合并信息，避免滥用 and。写作 Task 1：增长最快的行业是可再生能源。口语：我最放松的地方是……",
          ),
        ],
      },
    ],
    estimatedMinutes: 10,
  },
  {
    id: "gram-noun-clauses",
    category: "grammar",
    testType: "both",
    order: 10,
    title: L("Noun clauses", "名词性从句"),
    summary: L(
      "That, whether/if and wh- clauses acting as subjects, objects and complements.",
      "that、whether/if 与 wh- 从句充当主语、宾语和补语。",
    ),
    sections: [
      {
        heading: L("Roles of a noun clause", "名词性从句的作用"),
        bullets: [
          L("Object: 'The report shows that demand fell.'", "宾语：报告显示需求下降了。"),
          L("Subject: 'Whether prices will rise remains unclear.'", "主语：价格是否会上升仍不清楚。"),
          L("Complement: 'The concern is that funding may end.'", "补语：令人担忧的是资金可能会中断。"),
        ],
      },
      {
        heading: L("That vs whether/if", "that 与 whether/if"),
        paragraphs: [
          L(
            "Use that for reported facts, whether/if for yes/no ideas. Do not double the connector: 'The question is whether…' not 'The question is that whether…'.",
            "陈述事实用 that，是非概念用 whether/if。不要重复连词：The question is whether…，而非 that whether…。",
          ),
        ],
      },
      {
        heading: L("Word order", "语序"),
        paragraphs: [
          L(
            "A noun clause keeps statement word order. 'I don't know where the station is', not 'where is the station'.",
            "名词性从句保持陈述语序：I don't know where the station is，而不是 where is the station。",
          ),
        ],
      },
    ],
    estimatedMinutes: 9,
  },
  {
    id: "gram-adverbial-clauses",
    category: "grammar",
    testType: "both",
    order: 11,
    title: L("Adverbial clauses", "状语从句"),
    summary: L(
      "Time, reason, contrast and condition clauses, and the classic although...but error.",
      "时间、原因、让步与条件状语从句，以及 although...but 这一经典错误。",
    ),
    sections: [
      {
        heading: L("Types and connectors", "类型与连接词"),
        bullets: [
          L("Time: when, while, before, after, since, until, as soon as.", "时间：when、while、before、after、since、until、as soon as。"),
          L("Reason: because, since, as.", "原因：because、since、as。"),
          L("Contrast: although, though, even though, whereas, while.", "让步/对比：although、though、even though、whereas、while。"),
          L("Condition: if, unless, provided that.", "条件：if、unless、provided that。"),
        ],
      },
      {
        heading: L("One clause, one connector", "一句只用一个连接词"),
        callouts: [
          {
            kind: "commonMistake",
            title: L("Classic transfer error", "经典迁移错误"),
            items: [
              L("✗ Although it rained, but we still went out. → ✓ Although it rained, we still went out. / It rained, but we still went out.", "although 与 but 不能连用，二选一。"),
              L("✗ Because traffic was heavy, so we were late. → ✓ Because traffic was heavy, we were late.", "because 与 so 同理。"),
            ],
          },
        ],
      },
      {
        heading: L("Position and punctuation", "位置与标点"),
        paragraphs: [
          L(
            "When the adverbial clause comes first, use a comma: 'Although costs rose, demand held.' When it comes second, no comma: 'Demand held although costs rose.'",
            "状语从句在前时用逗号；在后时不用逗号。",
          ),
        ],
      },
    ],
    estimatedMinutes: 9,
  },
  {
    id: "gram-participle-clauses",
    category: "grammar",
    testType: "both",
    order: 12,
    title: L("Participle clauses", "分词短语"),
    summary: L(
      "Using -ing and -ed clauses to compress ideas, with subject-match rules.",
      "用 -ing 与 -ed 分词短语压缩信息，并遵守主语一致规则。",
    ),
    sections: [
      {
        heading: L("Active and passive meanings", "主动与被动含义"),
        bullets: [
          L("-ing = active: 'Households using solar panels cut their bills.'", "-ing 表主动：使用太阳能电池板的家庭降低了账单。"),
          L("-ed = passive: 'Built in 1902, the bridge is now a museum.'", "-ed 表被动：建于 1902 年的这座桥如今是博物馆。"),
        ],
      },
      {
        heading: L("Subject match", "主语一致"),
        callouts: [
          {
            kind: "commonMistake",
            title: L("Dangling participles", "悬垂分词"),
            items: [
              L("✗ Walking to school, the bus passed us. → ✓ While we were walking to school, the bus passed us.", "分词的主语必须与主句主语一致。"),
            ],
          },
        ],
      },
      {
        heading: L("IELTS use", "雅思应用"),
        paragraphs: [
          L(
            "Participle clauses add variety to Task 1 overviews and Task 2 topic sentences: 'Faced with rising rents, many young people delay buying a home.'",
            "分词短语可丰富 Task 1 概述与 Task 2 主题句的表达。",
          ),
        ],
      },
    ],
    estimatedMinutes: 9,
  },
  {
    id: "gram-gerunds-infinitives",
    category: "grammar",
    testType: "both",
    order: 13,
    title: L("Gerunds and infinitives", "动名词与不定式"),
    summary: L(
      "Verb patterns: which verbs take -ing, which take to-infinitive, and how meaning changes.",
      "动词搭配模式：哪些动词接 -ing，哪些接 to do，以及含义变化。",
    ),
    sections: [
      {
        heading: L("Pattern groups", "搭配分组"),
        bullets: [
          L("+ -ing: enjoy, avoid, consider, suggest, finish, practise, mind.", "接 -ing：enjoy、avoid、consider、suggest、finish、practise、mind。"),
          L("+ to-infinitive: decide, hope, plan, agree, refuse, manage, tend.", "接 to do：decide、hope、plan、agree、refuse、manage、tend。"),
          L("Meaning change: remember to do (future task) vs remember doing (past event).", "含义变化：remember to do（未来要做）vs remember doing（过去做过）。"),
        ],
      },
      {
        heading: L("Prepositions take -ing", "介词后接 -ing"),
        paragraphs: [
          L(
            "After prepositions use the -ing form: 'interested in studying', 'before applying', 'despite having'.",
            "介词后用 -ing：interested in studying、before applying、despite having。",
          ),
        ],
      },
    ],
    estimatedMinutes: 9,
  },
  {
    id: "gram-comparisons-quantifiers",
    category: "grammar",
    testType: "both",
    order: 14,
    title: L("Comparatives, superlatives and quantifiers", "比较级、最高级与数量表达"),
    summary: L(
      "Comparison structures for Task 1 data and Task 2 arguments, including common traps.",
      "用于 Task 1 数据和 Task 2 论证的比较结构及其常见陷阱。",
    ),
    sections: [
      {
        heading: L("Core forms", "基本形式"),
        bullets: [
          L("Short adjectives: cheaper, the cheapest. Long adjectives: more expensive, the most expensive.", "短形容词用 -er/-est；长形容词用 more/most。"),
          L("Irregular: good-better-best, bad-worse-worst, far-further-furthest.", "不规则：good-better-best、bad-worse-worst、far-further-furthest。"),
          L("Avoid double marking: ✗ more cheaper.", "避免双重标记：✗ more cheaper。"),
        ],
      },
      {
        heading: L("Task 1 comparison language", "Task 1 比较表达"),
        bullets: [
          L("'twice as high as', 'three times more than', 'half as many as'", "两倍于、三倍于、是……的一半。"),
          L("'the most popular option', 'the second largest category'", "最受欢迎的选择、第二大类。"),
          L("'far / considerably / slightly higher'", "远高于/明显高于/略高于。"),
        ],
      },
    ],
    estimatedMinutes: 9,
  },
  {
    id: "gram-prepositions-collocations",
    category: "grammar",
    testType: "both",
    order: 15,
    title: L("Prepositions and grammatical collocations", "介词与语法搭配"),
    summary: L(
      "High-frequency preposition patterns that IELTS writers and speakers get wrong.",
      "雅思写作与口语中高频出错的介词搭配。",
    ),
    sections: [
      {
        heading: L("High-value collocations", "高频搭配"),
        bullets: [
          L("an increase/decrease in; a rise/fall in; a change in", "in 表变化领域。"),
          L("concerned about; interested in; responsible for; dependent on; different from", "常见形容词搭配。"),
          L("in the past, at present, by 2020, between 2000 and 2010, over the period", "时间介词。"),
          L("reasons for; solutions to; effects on; access to; demand for", "名词搭配。"),
        ],
      },
      {
        heading: L("Transfer traps", "迁移陷阱"),
        paragraphs: [
          L(
            "Preposition choice rarely translates directly. Learn collocations as whole phrases: 'discuss' takes no preposition (discuss the problem, not discuss about).",
            "介词选择很少能直译，应整组记忆：discuss 后不接介词（discuss the problem，而非 discuss about）。",
          ),
        ],
      },
    ],
    estimatedMinutes: 9,
  },
  {
    id: "gram-cohesion-reference",
    category: "grammar",
    testType: "both",
    order: 16,
    title: L("Cohesion, linking and reference", "衔接、连接与指代"),
    summary: L(
      "Conjunctions, linking adverbials and reference words that hold a text together.",
      "使文章连贯的连词、连接副词与指代词。",
    ),
    sections: [
      {
        heading: L("Linking adverbials", "连接副词"),
        bullets: [
          L("Addition: moreover, furthermore, in addition.", "递进：moreover、furthermore、in addition。"),
          L("Contrast: however, on the other hand, in contrast.", "转折：however、on the other hand、in contrast。"),
          L("Result: therefore, as a result, consequently.", "结果：therefore、as a result、consequently。"),
          L("These are adverbials, not conjunctions — they cannot join two clauses with only a comma.", "它们是副词，不是连词，不能仅用逗号连接两个分句。"),
        ],
      },
      {
        heading: L("Reference words", "指代词"),
        paragraphs: [
          L(
            "Use this/these to point back to ideas: 'Rents have risen sharply. This has made city living harder for young people.' Avoid vague 'it' without a clear noun.",
            "用 this/these 回指上文观点；避免没有明确先行词的 it。",
          ),
        ],
        callouts: [
          {
            kind: "commonMistake",
            title: L("Comma splice", "逗号拼接"),
            items: [
              L("✗ Rents rose, however, demand stayed. → ✓ Rents rose. However, demand stayed. / Rents rose; however, demand stayed.", "however 前需要句号或分号。"),
            ],
          },
        ],
      },
    ],
    estimatedMinutes: 10,
  },
  {
    id: "gram-parallelism",
    category: "grammar",
    testType: "both",
    order: 17,
    title: L("Parallelism and coordination", "平行结构与并列"),
    summary: L(
      "Keeping coordinated items in the same grammatical form for clarity and flow.",
      "使并列成分保持相同语法形式，提升清晰度与流畅度。",
    ),
    sections: [
      {
        heading: L("The rule", "规则"),
        paragraphs: [
          L(
            "Items joined by and, or, but, both...and, either...or, not only...but also should share one grammatical form.",
            "由 and/or/but 等连接的并列成分应保持同一语法形式。",
          ),
        ],
        bullets: [
          L("✓ The scheme reduced traffic, improved air quality and saved money.", "三个过去式动词并列。"),
          L("✗ The scheme reduced traffic, improved air quality and it saved money.", "第三个成分变成从句，破坏平行。"),
        ],
      },
      {
        heading: L("IELTS use", "雅思应用"),
        paragraphs: [
          L(
            "Parallel lists appear in Task 2 thesis statements and Task 1 overviews. Consistent form signals control.",
            "平行列表常见于 Task 2 论点句与 Task 1 概述；形式一致体现控制力。",
          ),
        ],
      },
    ],
    estimatedMinutes: 8,
  },
  {
    id: "gram-noun-phrases",
    category: "grammar",
    testType: "both",
    order: 18,
    title: L("Noun phrases and nominalisation", "名词短语与名词化"),
    summary: L(
      "Building dense noun phrases and turning verbs into nouns for academic style.",
      "构建紧凑名词短语，并把动词名词化以增强学术风格。",
    ),
    sections: [
      {
        heading: L("Building a noun phrase", "构建名词短语"),
        paragraphs: [
          L(
            "A noun phrase can include determiners, adjectives, participles and post-modification: 'the rapidly increasing cost of urban housing'.",
            "名词短语可含限定词、形容词、分词与后置修饰：the rapidly increasing cost of urban housing。",
          ),
        ],
      },
      {
        heading: L("Nominalisation", "名词化"),
        bullets: [
          L("'The government decided to invest' → 'the government's decision to invest'", "把动词 decide 变为名词 decision。"),
          L("'Prices increased rapidly' → 'a rapid increase in prices'", "动词名词化后搭配介词 in。"),
          L("Use it selectively — too much nominalisation makes writing dense and lifeless.", "适度使用；过度名词化会让文章沉闷。"),
        ],
      },
    ],
    estimatedMinutes: 9,
  },
  {
    id: "gram-complex-control",
    category: "grammar",
    testType: "both",
    order: 19,
    title: L("Complex sentence control", "复杂句控制"),
    summary: L(
      "Using a range of clause types accurately — complexity is only valuable with control.",
      "准确使用多种从句——只有在控制得当时，复杂才是有价值的。",
    ),
    sections: [
      {
        heading: L("Range vs control", "多样 vs 控制"),
        paragraphs: [
          L(
            "Longer is not better. A short accurate sentence scores better than a long tangled one. Aim for variety: short sentences for key points, longer ones for explanation.",
            "长不等于好。短而准确的句子比冗长绕弯的句子得分更高。关键句用短句，解释说明可用长句。",
          ),
        ],
        bullets: [
          L("Combine related ideas with relative, noun, adverbial or participle clauses — not by chaining 'and'.", "用从句合并相关信息，而不是用 and 罗列。"),
          L("Re-read every long sentence and check: one main idea, one clear subject, one finite verb agreement.", "重读每个长句：一个主旨、一个清晰主语、主谓一致。"),
        ],
      },
    ],
    estimatedMinutes: 9,
  },
  {
    id: "gram-task1-grammar",
    category: "grammar",
    testType: "both",
    order: 20,
    title: L("Academic Task 1 grammar", "学术类 Task 1 语法"),
    summary: L(
      "Tense, comparison and process/map language for describing data.",
      "描述数据所需的时态、比较与流程/地图表达。",
    ),
    sections: [
      {
        heading: L("Tense by time period", "按时段选时态"),
        bullets: [
          L("Past periods: past simple. 'Sales rose between 2000 and 2010.'", "过去时段用一般过去时。"),
          L("Up to the present: present perfect. 'Sales have risen since 2000.'", "延续至今用现在完成时。"),
          L("Projections: is predicted to / is expected to + verb.", "预测：is predicted to / is expected to。"),
        ],
      },
      {
        heading: L("Comparison structures", "比较结构"),
        bullets: [
          L("whereas / while: 'Car use fell, whereas cycling rose.'", "对比两组数据。"),
          L("respectively: 'Sales were 40 and 25 units respectively.'", "分别对应。"),
          L("Increase/decrease as verbs and nouns with correct prepositions: 'an increase of 5%', 'rose by 5%'.", "动词与名词搭配正确介词。"),
        ],
      },
      {
        heading: L("Process and map language", "流程与地图表达"),
        paragraphs: [
          L(
            "Processes use the present passive: 'The bottles are collected, sorted and crushed.' Maps use change language: 'The factory was converted into apartments.'",
            "流程用一般现在时被动语态；地图用变化表达：工厂被改建为公寓。",
          ),
        ],
      },
    ],
    estimatedMinutes: 10,
  },
  {
    id: "gram-task2-grammar",
    category: "grammar",
    testType: "both",
    order: 21,
    title: L("Task 2 argument grammar", "Task 2 论证语法"),
    summary: L(
      "Concession, cause/effect, conditionals and hedging for essay arguments.",
      "议论文中的让步、因果、条件与委婉表达。",
    ),
    sections: [
      {
        heading: L("Concession", "让步"),
        paragraphs: [
          L(
            "Concede before you counter: 'Although online learning is flexible, it can isolate students.' The concession shows balance and control.",
            "先让步再反驳：虽然在线学习灵活，但它可能让学生孤立。让步体现平衡与控制。",
          ),
        ],
      },
      {
        heading: L("Cause and effect", "因果"),
        bullets: [
          L("due to / owing to + noun phrase; because / since / as + clause.", "due to/owing to 接名词短语；because/since/as 接从句。"),
          L("lead to / result in / contribute to + noun.", "导致/促成。"),
        ],
      },
      {
        heading: L("Hedging and stance", "委婉与立场"),
        paragraphs: [
          L(
            "Avoid absolute claims. Prefer: 'This may result in…', 'The evidence suggests that…', 'It could be argued that…' rather than 'This proves…'.",
            "避免绝对断言，使用 may、suggest、could be argued 等委婉表达。",
          ),
        ],
      },
    ],
    estimatedMinutes: 10,
  },
  {
    id: "gram-letter-grammar",
    category: "grammar",
    testType: "both",
    order: 22,
    title: L("General Training letter grammar and register", "培训类信件语法与语体"),
    summary: L(
      "How grammar choices signal formal, semi-formal and informal register.",
      "语法选择如何体现正式、半正式与非正式语体。",
    ),
    sections: [
      {
        heading: L("Requests across registers", "不同语体的请求"),
        bullets: [
          L("Formal: 'I would be grateful if you could…'", "正式：I would be grateful if you could…"),
          L("Semi-formal: 'Could you possibly…?'", "半正式：Could you possibly…?"),
          L("Informal: 'Can you…?'", "非正式：Can you…?"),
        ],
      },
      {
        heading: L("Consistency", "一致性"),
        paragraphs: [
          L(
            "Keep the register consistent: do not mix 'I am writing to inform you' with 'cheers, mate'. Modals (would/could/may) signal politeness; contractions are normal in informal letters but rare in formal ones.",
            "保持语体一致，不要把正式开头与随意结尾混用。情态动词体现礼貌；缩写常见于非正式信件，正式信件中少见。",
          ),
        ],
      },
    ],
    estimatedMinutes: 8,
  },
];
