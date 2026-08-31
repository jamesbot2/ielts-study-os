import { notFound } from "next/navigation";
import { getPracticeSet } from "@/lib/content/practice";
import { ReadingRunner } from "@/components/reading-runner";

export default async function ReadingPracticePage({
  params,
}: {
  params: Promise<{ setId: string }>;
}) {
  const { setId } = await params;
  const set = getPracticeSet(setId);
  if (!set || set.kind !== "reading") notFound();
  return <ReadingRunner set={set} />;
}
