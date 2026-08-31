import { notFound } from "next/navigation";
import { listeningSet } from "@/lib/content/practice/listening-sets";
import { academicReadingSet, generalReadingSet } from "@/lib/content/practice";
import { getWritingPrompts } from "@/lib/content/practice/writing-prompts";
import { MockRunner } from "@/components/mock-runner";

const KINDS = ["academic_full", "general_full", "listening", "reading", "reading_general"];

export function generateStaticParams() {
  return KINDS.map((kind) => ({ kind }));
}

export default async function MockRunPage({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params;
  if (!KINDS.includes(kind)) notFound();

  const testType = kind.includes("general") ? "general" : "academic";
  const readingSet = testType === "general" ? generalReadingSet : academicReadingSet;
  const writingPrompts = getWritingPrompts(testType);

  return (
    <MockRunner
      kind={kind}
      testType={testType}
      listeningSet={kind === "reading" || kind === "reading_general" ? null : listeningSet}
      readingSet={kind === "listening" ? null : readingSet}
      writingPrompts={kind === "academic_full" || kind === "general_full" ? writingPrompts : []}
    />
  );
}
