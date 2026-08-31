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
];
