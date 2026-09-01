// Core IELTS domain types shared across the application.

export type Skill = "listening" | "reading" | "writing" | "speaking";
export type TestType = "academic" | "general";
export type SectionBand = number | null;

export type QuestionType =
  // Listening + Reading shared
  | "multiple_choice"
  | "matching"
  | "sentence_completion"
  | "summary_completion"
  | "note_completion"
  | "table_completion"
  | "flow_chart_completion"
  | "diagram_labelling"
  | "short_answer"
  | "form_completion"
  // Reading-specific
  | "true_false_not_given"
  | "yes_no_not_given"
  | "matching_headings"
  | "matching_information"
  | "matching_features"
  | "matching_sentence_endings"
  // Listening-specific
  | "plan_labelling"
  | "map_labelling"
  | "multiple_answer";

export type QuestionAnswerType =
  | "single_choice"
  | "multiple_choice"
  | "text"
  | "number"
  | "matching"
  | "heading_matching";

export interface QuestionOption {
  id: string;
  label: string; // e.g. "A"
  text: string;
  // For matching questions, this maps option -> target
  targetId?: string;
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  answerType: QuestionAnswerType;
  prompt: string;
  // For reading: passage context
  passageId?: string;
  // Human-readable explanation (why the correct answer is correct)
  explanation: string;
  // Evidence location in passage/transcript (reading/listening)
  evidence?: string;
  // Skill tags for analytics
  skillTags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  // Estimated IELTS band range this question targets
  bandRange: { min: number; max: number };
}

export interface TextQuestion extends BaseQuestion {
  answerType: "text" | "number";
  // Accepted answers (normalized before comparison)
  correctAnswer: string;
  acceptableAnswers?: string[];
  // Word-limit instruction (e.g. "NO MORE THAN TWO WORDS AND/OR A NUMBER")
  wordLimit?: number;
  allowNumber?: boolean;
}

export interface ChoiceQuestion extends BaseQuestion {
  answerType: "single_choice" | "multiple_choice";
  options: QuestionOption[];
  // For single choice: id(s) of correct option; multiple choice: all correct
  correctAnswers: string[];
  // For multiple choice, the number to select
  selectCount?: number;
}

export interface MatchingQuestion extends BaseQuestion {
  answerType: "matching" | "heading_matching";
  // Options (e.g. headings A-G, or list of items)
  options: QuestionOption[];
  // Items to match (e.g. paragraphs 1-5) each with a correct option id
  items: { id: string; text: string; correctOptionId: string }[];
}

export type Question = TextQuestion | ChoiceQuestion | MatchingQuestion;

export interface Passage {
  id: string;
  title: string;
  body: string; // Markdown-ish plain text
  // For general training: section label
  section?: string;
  sourceType: SourceType;
  license: string;
}

export interface AudioAsset {
  id: string;
  title: string;
  // URL or data reference; local audio may be stored under /content/audio
  src?: string;
  durationSeconds?: number;
  transcript?: string;
  parts?: { part: number; title: string; startSecond?: number; src?: string }[];
  // Speaker-marked script for TTS generation (and for transcript display).
  script?: { part: number; lines: { speaker: string; voice?: string; text: string }[] }[];
}

export type SourceType =
  | "ORIGINAL"
  | "AI_GENERATED"
  | "OPEN_LICENSED"
  | "USER_IMPORTED";

export interface ContentMeta {
  id: string;
  title: string;
  skill: Skill;
  testType: TestType | "both";
  sourceType: SourceType;
  sourceName: string;
  sourceReference?: string;
  license: string;
  copyrightStatus: string;
  academicOrGeneral: TestType | "both";
  questionTypes: QuestionType[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedBandRange: { min: number; max: number };
  createdAt: string;
  verifiedAt?: string;
  generatedByAI: boolean;
  generationModel?: string;
  reviewStatus: "draft" | "reviewed" | "published";
}

export type PracticeMode = "full" | "targeted";

export interface PracticeSet {
  meta: ContentMeta;
  kind: "reading" | "listening";
  passages: Passage[];
  audio?: AudioAsset;
  questions: Question[];
  // Grouping for synchronized question display (listening parts)
  groups?: { id: string; title: string; questionIds: string[] }[];
  // Targeted drill metadata. Full tests are practiceMode "full".
  practiceMode?: PracticeMode;
  targetQuestionType?: QuestionType;
}

// --- Writing ---

export type WritingTaskNumber = 1 | 2;

export interface WritingPrompt {
  id: string;
  testType: TestType;
  task: WritingTaskNumber;
  title: string;
  prompt: string;
  // For Task 1 visual data description (line graph, bar chart, ...)
  visualType?: string;
  visualDescription?: string;
  dataTable?: { columns: string[]; rows: string[][] };
  wordLimit: number;
  suggestedMinutes: number;
  sourceType: SourceType;
}

export type WritingCriterion =
  | "taskAchievement"
  | "taskResponse"
  | "coherenceCohesion"
  | "lexicalResource"
  | "grammaticalRange";

export interface CriterionScore {
  criterion: WritingCriterion;
  band: number;
  rationale: string;
}

export interface WritingEvaluation {
  id: string;
  estimatedOverallBand: number;
  criterionScores: CriterionScore[];
  strengths: string[];
  weaknesses: string[];
  sentenceLevelIssues: {
    sentence: string;
    issue: string;
    correction?: string;
  }[];
  grammarIssues: string[];
  lexicalIssues: string[];
  coherenceIssues: string[];
  taskResponseIssues: string[];
  missingRequirements: string[];
  suggestedCorrections: string[];
  improvedSentences: { original: string; improved: string; reason: string }[];
  vocabularySuggestions: { word: string; suggestion: string; reason: string }[];
  nextPracticeTargets: string[];
  examinerStyleSummary: string;
  // Band X+1 gap analysis
  bandGapAnalysis: string;
  generatedBy: "ai" | "manual";
  model?: string;
}

// --- Speaking ---

export type SpeakingPart = 1 | 2 | 3;

export type SpeakingCriterion =
  | "fluencyCoherence"
  | "lexicalResource"
  | "grammaticalRange"
  | "pronunciation";

export interface SpeakingTopic {
  id: string;
  name: string;
  tags: string[];
  part1Questions: string[];
  part2CueCards: CueCard[];
  part3Questions: string[];
}

export interface CueCard {
  id: string;
  topic: string;
  prompt: string; // main topic line
  bullets: string[];
  followUp?: string;
}

export interface SpeakingEvaluation {
  id: string;
  estimatedOverallBand: number;
  criterionScores: {
    criterion: SpeakingCriterion;
    band: number;
    rationale: string;
    // pronunciation is only estimated when audio analysis supports it
    supported: boolean;
  }[];
  transcriptMetrics: TranscriptMetrics;
  audioMetrics?: AudioMetrics;
  strengths: string[];
  weaknesses: string[];
  grammarIssues: string[];
  betterVocabulary: { used: string; suggestion: string }[];
  improvedVersions: { original: string; improved: string }[];
  answerDevelopmentSuggestions: string[];
  weakestCriterion: SpeakingCriterion;
  nextRecommendedDrills: string[];
  generatedBy: "ai" | "manual";
}

export interface TranscriptMetrics {
  durationSeconds: number;
  wordCount: number;
  wordsPerMinute: number;
  fillerCount: number;
  fillerWords: string[];
  repeatedWords: { word: string; count: number }[];
  vocabularyDiversity: number; // type-token ratio
  sentenceCount: number;
  avgSentenceLength: number;
}

export interface AudioMetrics {
  pronunciationScore?: number;
  confidence?: number;
  lowConfidenceWords?: string[];
}

// --- Scoring ---

export interface RawBandTable {
  // [minimum raw score, band], descending
  thresholds: [number, number][];
}
