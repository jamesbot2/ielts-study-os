// Built-in curated IELTS Resource Center catalog.
// Links to official pages + permissively-licensed open-source projects.
// We link, we do NOT mirror copyrighted tests/audio/PDFs.

import type { Skill } from "@/types/ielts";

export type ResourceCategory =
  | "official"
  | "band-descriptors"
  | "sample-tests"
  | "computer-familiarisation"
  | "listening"
  | "reading"
  | "writing"
  | "speaking"
  | "vocabulary"
  | "grammar"
  | "strategy"
  | "exam-day"
  | "open-source";

export interface ResourceItem {
  id: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  provider: string;
  providerType: "official" | "official-test-admin" | "open-source" | "reference";
  skill: Skill | "all" | "vocabulary" | "grammar";
  testType: "academic" | "general" | "both";
  category: ResourceCategory;
  format: "web" | "pdf" | "interactive" | "video" | "repo";
  url: string;
  language: "en" | "zh" | "both";
  free: boolean;
  official: boolean;
  license: string | null;
  redistributionPolicy: string;
  tags: string[];
  lastVerified: string;
  recommended: boolean;
  // For open-source/project cards: links to the authoritative integration registry.
  integrationId?: string;
}

export const resources: ResourceItem[] = [
  // ---- Start here / official ----
  {
    id: "r-official-test-format",
    titleEn: "Official IELTS test format",
    titleZh: "官方雅思考试形式",
    descriptionEn: "The canonical source for test structure, timings and question counts. Read this first.",
    descriptionZh: "关于考试结构、时长和题量的权威来源，建议优先阅读。",
    provider: "IELTS.org",
    providerType: "official",
    skill: "all",
    testType: "both",
    category: "official",
    format: "web",
    url: "https://ielts.org/take-a-test/test-format",
    language: "en",
    free: true,
    official: true,
    license: null,
    redistributionPolicy: "Link only — do not copy",
    tags: ["structure", "timing", "overview"],
    lastVerified: "2026-08-31",
    recommended: true,
  },
  {
    id: "r-official-sample-questions",
    titleEn: "Official sample test questions",
    titleZh: "官方样题",
    descriptionEn: "Official sample tasks for Listening, Reading, Writing and Speaking.",
    descriptionZh: "听力、阅读、写作和口语的官方样题。",
    provider: "IELTS.org",
    providerType: "official",
    skill: "all",
    testType: "both",
    category: "sample-tests",
    format: "web",
    url: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions",
    language: "en",
    free: true,
    official: true,
    license: null,
    redistributionPolicy: "Link only — do not copy",
    tags: ["samples", "all-skills"],
    lastVerified: "2026-08-31",
    recommended: true,
  },
  {
    id: "r-official-scoring",
    titleEn: "IELTS scoring in detail",
    titleZh: "雅思评分详解",
    descriptionEn: "Band scale, band descriptors and how overall scores are calculated.",
    descriptionZh: "分数等级、评分标准以及总分的计算方式。",
    provider: "IELTS.org",
    providerType: "official",
    skill: "all",
    testType: "both",
    category: "band-descriptors",
    format: "web",
    url: "https://ielts.org/organisations/ielts-for-organisations/ielts-scoring-in-detail",
    language: "en",
    free: true,
    official: true,
    license: null,
    redistributionPolicy: "Link only — do not copy",
    tags: ["scoring", "band-descriptors", "bands"],
    lastVerified: "2026-08-31",
    recommended: true,
  },
  {
    id: "r-one-skill-retake",
    titleEn: "One Skill Retake",
    titleZh: "单科重考",
    descriptionEn: "Official explanation of One Skill Retake and where it is available.",
    descriptionZh: "关于单科重考及其适用范围的官方说明。",
    provider: "IELTS.org",
    providerType: "official",
    skill: "all",
    testType: "both",
    category: "official",
    format: "web",
    url: "https://ielts.org/take-a-test/one-skill-retake",
    language: "en",
    free: true,
    official: true,
    license: null,
    redistributionPolicy: "Link only — do not copy",
    tags: ["policy", "retake"],
    lastVerified: "2026-08-31",
    recommended: false,
  },

  // ---- British Council ----
  {
    id: "r-bc-free-practice",
    titleEn: "British Council — free IELTS practice tests",
    titleZh: "英国文化协会 — 免费雅思练习",
    descriptionEn: "Free official-style practice across all four skills from the British Council.",
    descriptionZh: "英国文化协会提供的四项技能免费练习。",
    provider: "British Council",
    providerType: "official-test-admin",
    skill: "all",
    testType: "both",
    category: "sample-tests",
    format: "web",
    url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests",
    language: "en",
    free: true,
    official: true,
    license: null,
    redistributionPolicy: "Link only — do not copy",
    tags: ["practice", "all-skills", "free"],
    lastVerified: "2026-08-31",
    recommended: true,
  },
  {
    id: "r-bc-computer-familiarisation",
    titleEn: "British Council — IELTS on computer familiarisation",
    titleZh: "英国文化协会 — 机考熟悉练习",
    descriptionEn: "Practice the computer-delivered interface: highlighting, notes, navigation.",
    descriptionZh: "熟悉机考界面：高亮、笔记、导航等操作。",
    provider: "British Council",
    providerType: "official-test-admin",
    skill: "all",
    testType: "both",
    category: "computer-familiarisation",
    format: "interactive",
    url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests/computer",
    language: "en",
    free: true,
    official: true,
    license: null,
    redistributionPolicy: "Link only — do not copy",
    tags: ["computer", "interface", "familiarisation"],
    lastVerified: "2026-08-31",
    recommended: true,
  },

  // ---- IDP ----
  {
    id: "r-idp-prepare",
    titleEn: "IDP — IELTS Prepare",
    titleZh: "IDP — 雅思备考中心",
    descriptionEn: "IDP's preparation hub with guides and familiarisation tests.",
    descriptionZh: "IDP 的备考中心，含指南和机考熟悉测试。",
    provider: "IDP IELTS",
    providerType: "official-test-admin",
    skill: "all",
    testType: "both",
    category: "official",
    format: "web",
    url: "https://ielts.idp.com/prepare",
    language: "en",
    free: true,
    official: true,
    license: null,
    redistributionPolicy: "Link only — do not copy",
    tags: ["prepare", "idp"],
    lastVerified: "2026-08-31",
    recommended: true,
  },
  {
    id: "r-idp-familiarisation",
    titleEn: "IDP — computer familiarisation tests",
    titleZh: "IDP — 机考熟悉测试",
    descriptionEn: "Practice the computer-delivered IELTS experience before test day.",
    descriptionZh: "考前熟悉机考雅思的考试体验。",
    provider: "IDP IELTS",
    providerType: "official-test-admin",
    skill: "all",
    testType: "both",
    category: "computer-familiarisation",
    format: "interactive",
    url: "https://ielts.idp.com/prepare/article-ielts-on-computer-familiarisation-tests",
    language: "en",
    free: true,
    official: true,
    license: null,
    redistributionPolicy: "Link only — do not copy",
    tags: ["computer", "familiarisation", "idp"],
    lastVerified: "2026-08-31",
    recommended: false,
  },

  // ---- Band descriptors ----
  {
    id: "r-writing-band-descriptors",
    titleEn: "Writing band descriptors (public)",
    titleZh: "写作评分标准（公开）",
    descriptionEn: "The public Writing Task 1 and Task 2 band descriptors — the source of truth for Writing scores.",
    descriptionZh: "公开的写作 Task 1 / Task 2 评分标准——写作评分的权威依据。",
    provider: "IELTS.org",
    providerType: "official",
    skill: "writing",
    testType: "both",
    category: "band-descriptors",
    format: "web",
    url: "https://ielts.org/organisations/ielts-for-organisations/ielts-scoring-in-detail",
    language: "en",
    free: true,
    official: true,
    license: null,
    redistributionPolicy: "Link only — do not copy",
    tags: ["writing", "band-descriptors", "criteria"],
    lastVerified: "2026-08-31",
    recommended: true,
  },
  {
    id: "r-speaking-band-descriptors",
    titleEn: "Speaking band descriptors (public)",
    titleZh: "口语评分标准（公开）",
    descriptionEn: "The public Speaking band descriptors for Fluency/Coherence, Lexical Resource, Grammar, Pronunciation.",
    descriptionZh: "公开的口语评分标准（流利度、词汇、语法、发音）。",
    provider: "IELTS.org",
    providerType: "official",
    skill: "speaking",
    testType: "both",
    category: "band-descriptors",
    format: "web",
    url: "https://ielts.org/organisations/ielts-for-organisations/ielts-scoring-in-detail",
    language: "en",
    free: true,
    official: true,
    license: null,
    redistributionPolicy: "Link only — do not copy",
    tags: ["speaking", "band-descriptors", "criteria"],
    lastVerified: "2026-08-31",
    recommended: true,
  },

  // ---- Open-source projects (audited licenses) ----
  {
    id: "r-oss-ists",
    titleEn: "ists — single-user IELTS study OS",
    titleZh: "ists — 单用户雅思学习系统",
    descriptionEn: "Open-source (MIT) IELTS workspace: vocabulary SRS, practice, writing feedback, mock flows. Architecture reference.",
    descriptionZh: "开源（MIT）雅思学习工作台：词汇间隔复习、练习、写作反馈、模拟流程。架构参考。",
    provider: "aimerfeng/ists",
    providerType: "open-source",
    skill: "all",
    testType: "both",
    category: "open-source",
    format: "repo",
    url: "https://github.com/aimerfeng/ists",
    language: "en",
    free: true,
    official: false,
    license: "MIT",
    redistributionPolicy: "MIT — reuse with attribution",
    tags: ["open-source", "architecture", "srs"],
    lastVerified: "2026-08-31",
    recommended: false,
    integrationId: "ists",
  },
  {
    id: "r-oss-reading-mock",
    titleEn: "IELTS Reading mock test (React/Vite)",
    titleZh: "雅思阅读模拟测试（React/Vite）",
    descriptionEn: "MIT-licensed original Academic Reading mock with scoring and review. Reference for exam UX.",
    descriptionZh: "MIT 许可的原创学术阅读模拟，含评分和解析。考试 UX 参考。",
    provider: "sifu-ewu/ielts-reading-mock-test",
    providerType: "open-source",
    skill: "reading",
    testType: "academic",
    category: "open-source",
    format: "repo",
    url: "https://github.com/sifu-ewu/ielts-reading-mock-test",
    language: "en",
    free: true,
    official: false,
    license: "MIT",
    redistributionPolicy: "MIT — reuse with attribution",
    tags: ["open-source", "reading", "mock"],
    lastVerified: "2026-08-31",
    recommended: false,
    integrationId: "ielts-reading-mock",
  },
  {
    id: "r-oss-echo-type",
    titleEn: "EchoType — four-skills English learning",
    titleZh: "EchoType — 四技能英语学习",
    descriptionEn: "MIT-licensed four-skills English app with FSRS and pronunciation. Architecture reference.",
    descriptionZh: "MIT 许可的四技能英语应用，含 FSRS 和发音功能。架构参考。",
    provider: "Talljack/echo-type",
    providerType: "open-source",
    skill: "all",
    testType: "both",
    category: "open-source",
    format: "repo",
    url: "https://github.com/Talljack/echo-type",
    language: "en",
    free: true,
    official: false,
    license: "MIT",
    redistributionPolicy: "MIT — reuse with attribution",
    tags: ["open-source", "four-skills", "fsrs"],
    lastVerified: "2026-08-31",
    recommended: false,
    integrationId: "echo-type",
  },
  {
    id: "r-oss-speaking-ai",
    titleEn: "IELTS Speaking AI (Whisper + RAG)",
    titleZh: "雅思口语 AI（Whisper + RAG）",
    descriptionEn: "MIT-licensed Speaking tutor/grader. Reference for record → transcribe → score flow.",
    descriptionZh: "MIT 许可的口语辅导/评分系统。录音→转写→评分流程参考。",
    provider: "KaichenCurry/ielts-speaking-ai",
    providerType: "open-source",
    skill: "speaking",
    testType: "both",
    category: "open-source",
    format: "repo",
    url: "https://github.com/KaichenCurry/ielts-speaking-ai",
    language: "zh",
    free: true,
    official: false,
    license: "MIT",
    redistributionPolicy: "MIT — reuse with attribution",
    tags: ["open-source", "speaking", "whisper"],
    lastVerified: "2026-08-31",
    recommended: false,
    integrationId: "ielts-speaking-ai",
  },
  {
    id: "r-oss-ielts-practice",
    titleEn: "IELTS Atlas (Reading/Listening practice)",
    titleZh: "IELTS Atlas（阅读/听力练习）",
    descriptionEn: "Popular Chinese-language IELTS practice system. GPL-3.0; ships third-party content with copyright risk — ideas only.",
    descriptionZh: "热门中文雅思练习系统。GPL-3.0；内含第三方内容有版权风险——仅作思路参考。",
    provider: "sallowayma-git/IELTS-practice",
    providerType: "open-source",
    skill: "reading",
    testType: "both",
    category: "open-source",
    format: "repo",
    url: "https://github.com/sallowayma-git/IELTS-practice",
    language: "zh",
    free: true,
    official: false,
    license: "GPL-3.0",
    redistributionPolicy: "GPL-3.0; content has copyright risk — do not reuse content",
    tags: ["open-source", "reading", "listening"],
    lastVerified: "2026-08-31",
    recommended: false,
    integrationId: "ielts-atlas",
  },
];

export function getResources(): ResourceItem[] {
  return resources;
}

export function getRecommendedResources(): ResourceItem[] {
  return resources.filter((r) => r.recommended);
}

export const resourceCategories: { id: ResourceCategory; labelEn: string; labelZh: string }[] = [
  { id: "official", labelEn: "Official IELTS", labelZh: "官方雅思" },
  { id: "sample-tests", labelEn: "Sample tests", labelZh: "样题" },
  { id: "computer-familiarisation", labelEn: "Computer familiarisation", labelZh: "机考熟悉" },
  { id: "band-descriptors", labelEn: "Band descriptors", labelZh: "评分标准" },
  { id: "open-source", labelEn: "Open-source tools", labelZh: "开源工具" },
];
