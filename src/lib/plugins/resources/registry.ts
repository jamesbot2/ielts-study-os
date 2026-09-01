// External IELTS project integration map. Registry-driven; used by the
// Resource Center to show explicit integration status.

export type IntegrationMode = "native-provider" | "embedded" | "external" | "reference";

export interface ExternalProjectEntry {
  id: string;
  name: string;
  repository?: string;
  homepage?: string;
  license?: string;
  integrationMode: IntegrationMode;
  status: "active" | "planned" | "external" | "reference";
  capabilities: string[];
  note?: string;
  contentProvenance?: string;
}

export const externalProjects: ExternalProjectEntry[] = [
  {
    id: "baicizhan",
    name: "Baicizhan Vocabulary",
    repository: "https://github.com/lyc8503/baicizhan-word-meaning-API",
    license: "Unspecified (community API; content is proprietary Baicizhan data)",
    integrationMode: "native-provider",
    status: "active",
    capabilities: ["VOCABULARY_LOOKUP"],
    note: "Unofficial community API; data fetched at runtime, not bundled.",
    contentProvenance: "Proprietary Baicizhan data — do not redistribute.",
  },
  {
    id: "ists",
    name: "ists (IELTS Study OS)",
    repository: "https://github.com/aimerfeng/ists",
    license: "MIT",
    integrationMode: "reference",
    status: "reference",
    capabilities: ["architecture"],
    note: "Architecture reference.",
  },
  {
    id: "ielts-reading-mock",
    name: "IELTS Reading Mock (React/Vite)",
    repository: "https://github.com/sifu-ewu/ielts-reading-mock-test",
    license: "MIT",
    integrationMode: "native-provider",
    status: "planned",
    capabilities: ["PRACTICE_LIST_SETS", "PRACTICE_GET_SET"],
    note: "Practice provider planned; original content only.",
  },
  {
    id: "echo-type",
    name: "EchoType",
    repository: "https://github.com/Talljack/echo-type",
    license: "MIT",
    integrationMode: "reference",
    status: "reference",
    capabilities: ["architecture", "fsrs", "pronunciation"],
  },
  {
    id: "ielts-speaking-ai",
    name: "IELTS Speaking AI",
    repository: "https://github.com/KaichenCurry/ielts-speaking-ai",
    license: "MIT",
    integrationMode: "reference",
    status: "reference",
    capabilities: ["speaking", "whisper"],
  },
  {
    id: "ielts-atlas",
    name: "IELTS Atlas",
    repository: "https://github.com/sallowayma-git/IELTS-practice",
    license: "GPL-3.0",
    integrationMode: "external",
    status: "external",
    capabilities: ["external"],
    note: "Content has third-party copyright risk — external link only.",
  },
];

export function getExternalProjects(): ExternalProjectEntry[] {
  return externalProjects;
}
