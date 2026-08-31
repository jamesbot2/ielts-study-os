import { notFound } from "next/navigation";
import { allLessons, getLesson } from "@/lib/content/curriculum";
import { LessonViewer } from "@/components/lesson-viewer";

export function generateStaticParams() {
  return allLessons.map((l) => ({ slug: l.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  return <LessonViewer lesson={lesson} />;
}
