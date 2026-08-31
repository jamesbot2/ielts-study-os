// Content source / provenance registry. Lesson content can cite these sources.

export interface Source {
  id: string;
  provider: string;
  title: string;
  url: string;
  official: boolean;
  type: "official" | "official-test-admin" | "reference" | "open-source";
  lastVerified: string; // ISO date
  notes: string;
}

// Source hierarchy: IELTS.org > British Council / IDP > Cambridge > reputable
// educational/open-source > community advice.
export const sources: Source[] = [
  {
    id: "ielts-org",
    provider: "IELTS (jointly owned by British Council, IDP, Cambridge)",
    title: "IELTS.org — official site",
    url: "https://ielts.org",
    official: true,
    type: "official",
    lastVerified: "2026-08-31",
    notes: "Canonical source for test format, scoring, delivery and policy.",
  },
  {
    id: "ielts-org-test-format",
    provider: "IELTS",
    title: "Test format",
    url: "https://ielts.org/take-a-test/test-format",
    official: true,
    type: "official",
    lastVerified: "2026-08-31",
    notes: "Structure, timings and question counts for all four skills.",
  },
  {
    id: "ielts-org-sample-questions",
    provider: "IELTS",
    title: "Sample test questions",
    url: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions",
    official: true,
    type: "official",
    lastVerified: "2026-08-31",
    notes: "Official sample tasks for Listening, Reading, Writing and Speaking.",
  },
  {
    id: "ielts-org-scoring",
    provider: "IELTS",
    title: "IELTS scoring in detail",
    url: "https://ielts.org/organisations/ielts-for-organisations/ielts-scoring-in-detail",
    official: true,
    type: "official",
    lastVerified: "2026-08-31",
    notes: "Band scale, band descriptors, and score calculation guidance.",
  },
  {
    id: "ielts-org-band-descriptors",
    provider: "IELTS",
    title: "Writing & Speaking band descriptors",
    url: "https://ielts.org/organisations/ielts-for-organisations/ielts-scoring-in-detail",
    official: true,
    type: "official",
    lastVerified: "2026-08-31",
    notes: "Public band descriptors for Writing (Task 1/2) and Speaking.",
  },
  {
    id: "ielts-org-one-skill-retake",
    provider: "IELTS",
    title: "One Skill Retake",
    url: "https://ielts.org/take-a-test/one-skill-retake",
    official: true,
    type: "official",
    lastVerified: "2026-08-31",
    notes: "Official explanation of One Skill Retake and availability.",
  },
  {
    id: "bc-take-ielts",
    provider: "British Council",
    title: "Take IELTS (British Council)",
    url: "https://takeielts.britishcouncil.org",
    official: true,
    type: "official-test-admin",
    lastVerified: "2026-08-31",
    notes: "British Council preparation hub.",
  },
  {
    id: "bc-free-practice",
    provider: "British Council",
    title: "Free IELTS practice tests",
    url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests",
    official: true,
    type: "official-test-admin",
    lastVerified: "2026-08-31",
    notes: "Free official-style practice materials across all four skills.",
  },
  {
    id: "bc-computer-familiarisation",
    provider: "British Council",
    title: "IELTS on computer familiarisation",
    url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests/computer",
    official: true,
    type: "official-test-admin",
    lastVerified: "2026-08-31",
    notes: "Practice the computer-delivered interface.",
  },
  {
    id: "idp-prepare",
    provider: "IDP IELTS",
    title: "IDP Prepare",
    url: "https://ielts.idp.com/prepare",
    official: true,
    type: "official-test-admin",
    lastVerified: "2026-08-31",
    notes: "IDP preparation hub and familiarisation tests.",
  },
  {
    id: "idp-familiarisation",
    provider: "IDP IELTS",
    title: "IELTS on computer familiarisation tests",
    url: "https://ielts.idp.com/prepare/article-ielts-on-computer-familiarisation-tests",
    official: true,
    type: "official-test-admin",
    lastVerified: "2026-08-31",
    notes: "Computer-delivered familiarisation practice.",
  },
];

export function getSource(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}
