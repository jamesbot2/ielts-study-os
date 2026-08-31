import { notFound } from "next/navigation";
import { getPracticeSet, listeningSets } from "@/lib/content/practice";
import { ListeningRunner } from "@/components/listening-runner";

export function generateStaticParams() {
  return listeningSets.map((s) => ({ setId: s.meta.id }));
}

export default async function ListeningPracticePage({
  params,
}: {
  params: Promise<{ setId: string }>;
}) {
  const { setId } = await params;
  const set = getPracticeSet(setId);
  if (!set || set.kind !== "listening") notFound();
  return <ListeningRunner set={set} />;
}
