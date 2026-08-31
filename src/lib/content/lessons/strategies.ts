import { L, type Lesson } from "../types";

export const strategiesLessons: Lesson[] = [
  {
    id: "strat-general",
    category: "strategies",
    testType: "both",
    order: 1,
    title: L("General study strategy", "总体学习策略"),
    summary: L(
      "How to structure your IELTS preparation efficiently.",
      "如何高效组织你的雅思备考。",
    ),
    sections: [
      {
        heading: L("Core principles", "核心原则"),
        bullets: [
          L("Diagnose first: find your current band and weakest skills before studying randomly.", "先诊断：在盲目学习前弄清当前分数和最薄弱技能。"),
          L("Study skills in balance, but allocate extra time to weak areas.", "均衡学习各项技能，但向薄弱环节多分配时间。"),
          L("Practise under timed, exam-like conditions regularly.", "定期进行限时、模拟考试条件下的练习。"),
          L("Review mistakes systematically — one reviewed mistake is worth more than ten new questions.", "系统复习错题——弄懂一道错题胜过做十道新题。"),
        ],
      },
    ],
    estimatedMinutes: 4,
  },
  {
    id: "strat-listening",
    category: "strategies",
    testType: "both",
    order: 2,
    title: L("Listening strategy summary", "听力策略总结"),
    summary: L("A one-page checklist for Listening.", "听力一页清单。"),
    sections: [
      {
        heading: L("Checklist", "清单"),
        bullets: [
          L("Predict answer type before each gap.", "听前预测每空的答案类型。"),
          L("Listen for paraphrase, not exact words.", "听同义替换而非原词。"),
          L("Track distractors and self-corrections.", "跟踪干扰项和自我纠正。"),
          L("Never get stuck — move on and recover.", "绝不停留——继续前进并补救。"),
          L("Check spelling, word limits and plurals at the end.", "最后检查拼写、字数限制和复数。"),
        ],
      },
    ],
    estimatedMinutes: 3,
  },
  {
    id: "strat-reading",
    category: "strategies",
    testType: "both",
    order: 3,
    title: L("Reading strategy summary", "阅读策略总结"),
    summary: L("A one-page checklist for Reading.", "阅读一页清单。"),
    sections: [
      {
        heading: L("Checklist", "清单"),
        bullets: [
          L("Skim the passage (2–3 min), then read questions with keywords.", "略读文章（2–3 分钟），然后带关键词读题。"),
          L("Scan for the keyword's paraphrase.", "扫读关键词的同义替换。"),
          L("Use ~20 min per passage; never exceed 1 min on one question.", "每篇约 20 分钟；单题不超过 1 分钟。"),
          L("False/No = contradiction; Not Given = not mentioned.", "False/No = 矛盾；Not Given = 未提及。"),
          L("Copy answers exactly; respect word limits.", "答案与原文完全一致；遵守字数限制。"),
        ],
      },
    ],
    estimatedMinutes: 3,
  },
  {
    id: "strat-writing",
    category: "strategies",
    testType: "both",
    order: 4,
    title: L("Writing strategy summary", "写作策略总结"),
    summary: L("Plan before you write; edit after you write.", "写前规划；写后修改。"),
    sections: [
      {
        heading: L("Process", "流程"),
        bullets: [
          L("Spend 2–3 minutes planning structure before writing.", "动笔前花 2–3 分钟规划结构。"),
          L("Task 1: paraphrase + overview + grouped body paragraphs.", "Task 1：改写 + 概述 + 分组主体段。"),
          L("Task 2: clear thesis, one idea per paragraph, supported examples.", "Task 2：清晰论点、每段一个观点、举例支撑。"),
          L("Leave 3–5 minutes to edit grammar, spelling and cohesion.", "留 3–5 分钟修改语法、拼写和衔接。"),
        ],
      },
    ],
    estimatedMinutes: 3,
  },
  {
    id: "strat-speaking",
    category: "strategies",
    testType: "both",
    order: 5,
    title: L("Speaking strategy summary", "口语策略总结"),
    summary: L("A one-page checklist for Speaking.", "口语一页清单。"),
    sections: [
      {
        heading: L("Checklist", "清单"),
        bullets: [
          L("Part 1: direct answer + 1–2 sentences of detail.", "Part 1：直接回答 + 1–2 句细节。"),
          L("Part 2: use the cue card bullets as your structure; keep talking.", "Part 2：以话题卡要点为结构；持续讲下去。"),
          L("Part 3: opinion → reason → example → implication.", "Part 3：观点 → 原因 → 例子 → 影响。"),
          L("Paraphrase when you forget a word; do not stop.", "忘记单词就换说法；不要停下。"),
          L("Use varied grammar and natural discourse markers.", "使用多样的语法和自然的话语标记。"),
        ],
      },
    ],
    estimatedMinutes: 3,
  },
];
