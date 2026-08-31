import { notFound } from "next/navigation";
import { allLessons, getLesson, getNextLesson, getPreviousLesson } from "@/lib/content/curriculum";
import { LessonViewer } from "@/components/lesson-viewer";

export function generateStaticParams() {
  return allLessons.map((l) => ({ slug: l.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const next = getNextLesson(slug);
  const previous = getPreviousLesson(slug);

  return (
    <LessonViewer
      lesson={lesson}
      next={next ? { id: next.id, title: next.title.en } : null}
      previous={previous ? { id: previous.id, title: previous.title.en } : null}
    />
  );
}
