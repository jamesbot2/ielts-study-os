import { isAiConfigured } from "@/lib/ai";
import { CoachModule } from "@/components/coach-module";

export default function CoachPage() {
  return <CoachModule configured={isAiConfigured()} />;
}
