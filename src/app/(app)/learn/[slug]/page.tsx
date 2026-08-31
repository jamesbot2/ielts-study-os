import { notFound } from "next/navigation";
import { getLesson, getNextLesson, getPreviousLesson } from "@/lib/content/curriculum";
import { getLessonProgress } from "@/lib/db/store";
import { LessonViewer } from "@/components/lesson-viewer";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const next = getNextLesson(slug);
  const previous = getPreviousLesson(slug);
  const progress = getLessonProgress();

  return (
    <LessonViewer
      lesson={lesson}
      next={next ? { id: next.id, title: next.title.en } : null}
      previous={previous ? { id: previous.id, title: previous.title.en } : null}
      initialStatus={progress[slug] ?? "not_started"}
    />
  );
}
