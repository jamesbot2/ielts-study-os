import { notFound } from "next/navigation";
import { getWritingPrompt, writingPrompts } from "@/lib/content/practice/writing-prompts";
import { WritingEditor } from "@/components/writing-editor";

export function generateStaticParams() {
  return writingPrompts.map((p) => ({ promptId: p.id }));
}

export default async function WritingPromptPage({
  params,
}: {
  params: Promise<{ promptId: string }>;
}) {
  const { promptId } = await params;
  const prompt = getWritingPrompt(promptId);
  if (!prompt) notFound();
  return <WritingEditor prompt={prompt} />;
}
