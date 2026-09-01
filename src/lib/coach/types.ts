// Shared types for the AI Coach: citations, action proposals, and the
// streaming event protocol between the web client and the AI/RAG service.

export interface CitationRef {
  id: string;
  sourceId: string;
  title: string;
  url?: string;
  section?: string;
  sourceType?: "official" | "official_test_admin" | "open_licensed" | "original" | "reference";
}

export type ActionType = "create_study_task" | "open_lesson" | "open_practice" | "open_vocabulary";

export interface ActionProposal {
  type: ActionType;
  title: string;
  titleZh?: string;
  href?: string;
  date?: string;
  estimatedMinutes?: number;
  description?: string;
}

// NDJSON event stream emitted by POST /api/coach/agent.
export type CoachStreamEvent =
  | { type: "delta"; text: string }
  | { type: "citation"; citation: CitationRef }
  | { type: "action_proposal"; action: ActionProposal }
  | { type: "tool_status"; name: string; status: "start" | "done" }
  | { type: "error"; message: string }
  | { type: "done" };

export interface CoachAgentRequest {
  conversationId?: string;
  message: string;
  learnerContext: unknown; // LearnerContextSnapshot
  pageContext?: unknown;
  locale: "en" | "zh";
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface CoachAgentResult {
  text: string;
  citations: CitationRef[];
  actions: ActionProposal[];
}
