// Pure parser for the Coach NDJSON event stream. Used by the AI client and
// unit-tested independently.

import type { CitationRef, ActionProposal, CoachStreamEvent } from "./types";

export function parseCoachNdjson(text: string): CoachStreamEvent[] {
  const events: CoachStreamEvent[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    try {
      events.push(JSON.parse(line) as CoachStreamEvent);
    } catch {
      // Skip malformed lines; never crash the caller.
    }
  }
  return events;
}

export interface CoachAgentAccumulator {
  text: string;
  citations: CitationRef[];
  actions: ActionProposal[];
}

export function reduceCoachEvents(events: CoachStreamEvent[]): CoachAgentAccumulator {
  const acc: CoachAgentAccumulator = { text: "", citations: [], actions: [] };
  for (const e of events) {
    if (e.type === "delta") acc.text += e.text;
    else if (e.type === "citation") acc.citations.push(e.citation);
    else if (e.type === "action_proposal") acc.actions.push(e.action);
  }
  return acc;
}
