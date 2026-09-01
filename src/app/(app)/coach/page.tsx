import { Suspense } from "react";
import { CoachModule } from "@/components/coach-module";

export default function CoachPage() {
  // useSearchParams inside CoachModule needs a Suspense boundary for static export.
  return (
    <Suspense fallback={<div className="container-page text-sm text-muted">Loading coach…</div>}>
      <CoachModule />
    </Suspense>
  );
}
