// Built-in study guides. Framed as suggested structures, NOT score guarantees.

export interface StudyGuide {
  id: string;
  titleEn: string;
  titleZh: string;
  summaryEn: string;
  summaryZh: string;
  durationDays: number;
  target: { from: string; to: string } | null;
  schedule: { phase: string; phaseZh: string; focus: string; focusZh: string; days: string }[];
  tips: { en: string; zh: string }[];
}

export const studyGuides: StudyGuide[] = [
  {
    id: "guide-30-day",
    titleEn: "30-day IELTS study plan",
    titleZh: "30 天雅思学习计划",
    summaryEn: "A focused one-month plan for learners with limited time.",
    summaryZh: "适合时间有限的学习者的一个月集中计划。",
    durationDays: 30,
    target: null,
    schedule: [
      { phase: "Days 1–5", phaseZh: "第 1–5 天", focus: "Diagnose: take a timed Reading + Listening mock to find your current band", focusZh: "诊断：限时完成阅读 + 听力模拟，确定当前分数", days: "5" },
      { phase: "Days 6–15", phaseZh: "第 6–15 天", focus: "Build skills: one Reading and one Listening section daily, plus 10 vocabulary words", focusZh: "建立技能：每天一节阅读 + 听力，外加 10 个词汇", days: "10" },
      { phase: "Days 16–23", phaseZh: "第 16–23 天", focus: "Writing + Speaking: two Task 2 essays and two Speaking recordings per day", focusZh: "写作 + 口语：每天两篇 Task 2 作文和两段口语录音", days: "8" },
      { phase: "Days 24–28", phaseZh: "第 24–28 天", focus: "Full timed mocks under exam conditions", focusZh: "考试条件下进行全真限时模拟", days: "5" },
      { phase: "Days 29–30", phaseZh: "第 29–30 天", focus: "Review mistakes, light practice, rest before test day", focusZh: "复习错题、轻松练习、考前休息", days: "2" },
    ],
    tips: [
      { en: "Study every day, even if only for 30 minutes.", zh: "每天坚持学习，哪怕只有 30 分钟。" },
      { en: "Prioritise your weakest skill.", zh: "优先攻克你最薄弱的技能。" },
    ],
  },
  {
    id: "guide-60-day",
    titleEn: "60-day IELTS study plan",
    titleZh: "60 天雅思学习计划",
    summaryEn: "A balanced two-month plan covering all four skills.",
    summaryZh: "覆盖四项技能的均衡两个月计划。",
    durationDays: 60,
    target: null,
    schedule: [
      { phase: "Weeks 1–2", phaseZh: "第 1–2 周", focus: "IELTS fundamentals + diagnostic + build study routine", focusZh: "雅思基础 + 诊断 + 建立学习习惯", days: "14" },
      { phase: "Weeks 3–4", phaseZh: "第 3–4 周", focus: "Listening + Reading question types and strategies", focusZh: "听力 + 阅读题型与策略", days: "14" },
      { phase: "Weeks 5–6", phaseZh: "第 5–6 周", focus: "Writing Task 1 + Task 2 structure and practice", focusZh: "写作 Task 1 + Task 2 结构与练习", days: "14" },
      { phase: "Weeks 7–8", phaseZh: "第 7–8 周", focus: "Speaking fluency + full mocks + mistake review", focusZh: "口语流利度 + 全真模拟 + 错题复习", days: "14" },
    ],
    tips: [
      { en: "Alternate input skills (Listening/Reading) with output skills (Writing/Speaking).", zh: "输入技能（听/读）与输出技能（写/说）交替进行。" },
      { en: "Track your band score weekly to see progress.", zh: "每周记录分数以观察进步。" },
    ],
  },
  {
    id: "guide-90-day",
    titleEn: "90-day IELTS study plan",
    titleZh: "90 天雅思学习计划",
    summaryEn: "A thorough three-month plan for a full foundation-to-exam journey.",
    summaryZh: "从基础到考试的完整三个月计划。",
    durationDays: 90,
    target: null,
    schedule: [
      { phase: "Month 1", phaseZh: "第 1 个月", focus: "Fundamentals, grammar review, vocabulary foundation, Listening/Reading basics", focusZh: "基础、语法复习、词汇积累、听读入门", days: "30" },
      { phase: "Month 2", phaseZh: "第 2 个月", focus: "Question-type mastery + Writing development + Speaking topics", focusZh: "题型精通 + 写作提升 + 口语话题", days: "30" },
      { phase: "Month 3", phaseZh: "第 3 个月", focus: "Timed mocks, band-descriptor review, targeted weak-area work", focusZh: "限时模拟、评分标准复习、针对性补弱", days: "30" },
    ],
    tips: [
      { en: "Use the Mistake Book as your main review tool.", zh: "把错题本作为主要复习工具。" },
      { en: "Do at least one full timed mock every two weeks.", zh: "每两周至少做一次全真限时模拟。" },
    ],
  },
  {
    id: "guide-band-4-6",
    titleEn: "IELTS 4.5 → 6.0",
    titleZh: "雅思 4.5 → 6.0",
    summaryEn: "For learners building core English and exam familiarity.",
    summaryZh: "适合正在夯实核心英语与考试熟悉度的学习者。",
    durationDays: 60,
    target: { from: "4.5", to: "6.0" },
    schedule: [
      { phase: "Phase 1", phaseZh: "第一阶段", focus: "Core grammar (tenses, articles, sentence structure) + basic vocabulary", focusZh: "核心语法（时态、冠词、句式）+ 基础词汇", days: "20" },
      { phase: "Phase 2", phaseZh: "第二阶段", focus: "Reading/Listening accuracy + question-type familiarity", focusZh: "阅读/听力准确率 + 题型熟悉", days: "20" },
      { phase: "Phase 3", phaseZh: "第三阶段", focus: "Simple clear Writing + Part 1/2 Speaking + mocks", focusZh: "清晰简洁的写作 + 口语 Part 1/2 + 模拟", days: "20" },
    ],
    tips: [
      { en: "Focus on accuracy and clarity before complex language.", zh: "先求准确和清晰，再求复杂表达。" },
      { en: "Master the most common question types first.", zh: "先掌握最常见的题型。" },
    ],
  },
  {
    id: "guide-band-6-7",
    titleEn: "IELTS 6.0 → 7.0",
    titleZh: "雅思 6.0 → 7.0",
    summaryEn: "For learners moving from competent to a strong band 7.",
    summaryZh: "适合从合格迈向高分 7 分的学习者。",
    durationDays: 60,
    target: { from: "6.0", to: "7.0" },
    schedule: [
      { phase: "Phase 1", phaseZh: "第一阶段", focus: "Paraphrase and synonym skills + advanced vocabulary", focusZh: "同义替换能力 + 高级词汇", days: "20" },
      { phase: "Phase 2", phaseZh: "第二阶段", focus: "Writing band-descriptor work + Task 2 essay quality", focusZh: "写作评分标准 + Task 2 作文质量", days: "20" },
      { phase: "Phase 3", phaseZh: "第三阶段", focus: "Speaking fluency/coherence + full mocks + fine-tuning", focusZh: "口语流利度与连贯 + 全真模拟 + 精细调整", days: "20" },
    ],
    tips: [
      { en: "Study the public band descriptors to understand the gap to 7.", zh: "研读公开评分标准，理解与 7 分的差距。" },
      { en: "Reduce fillers and increase lexical range in Speaking.", zh: "减少口语填充词，扩大词汇范围。" },
    ],
  },
  {
    id: "guide-working-student",
    titleEn: "Working-student plan (2 hours/day)",
    titleZh: "在职学习计划（每天 2 小时）",
    summaryEn: "A sustainable plan for people with jobs and limited time.",
    summaryZh: "适合有工作、时间有限者的可持续计划。",
    durationDays: 90,
    target: null,
    schedule: [
      { phase: "Weekday", phaseZh: "工作日", focus: "30 min vocabulary/SRS + 45 min one skill + 30 min review", focusZh: "30 分钟词汇/复习 + 45 分钟单项技能 + 30 分钟复习", days: "5/wk" },
      { phase: "Weekend", phaseZh: "周末", focus: "One full timed section or mock + mistake review", focusZh: "一次完整限时模拟或部分 + 错题复习", days: "2/wk" },
    ],
    tips: [
      { en: "Consistency beats intensity — protect your daily slot.", zh: "坚持比强度更重要——保住每天的学习时间。" },
      { en: "Use commute time for listening and vocabulary review.", zh: "利用通勤时间做听力和词汇复习。" },
    ],
  },
];

export function getStudyGuides(): StudyGuide[] {
  return studyGuides;
}
