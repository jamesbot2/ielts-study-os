import { NextRequest } from "next/server";
import { z } from "zod";
import { streamText, AiError } from "@/lib/ai";
import { buildCoachContext, coachSystemPrompt } from "@/lib/ai/coach";
import {
  addMessage,
  createConversation,
  listMessages,
} from "@/lib/db/store";

const Body = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1),
  context: z
    .object({
      page: z.string().optional(),
      skill: z.string().optional(),
      questionId: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  const body = Body.parse(await req.json());
  const conversationId = body.conversationId ?? createConversation("coach");

  const history = listMessages(conversationId);
  const coachCtx = buildCoachContext();

  addMessage(conversationId, "user", body.message);

  const system = coachSystemPrompt(coachCtx);
  const pageNote = body.context?.page
    ? `\n\nThe learner is currently viewing: ${body.context.page}${
        body.context.skill ? ` (skill: ${body.context.skill})` : ""
      }.`
    : "";

  const messages = [
    { role: "system" as const, content: system + pageNote },
    ...history.slice(-10).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: body.message },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = "";
      try {
        for await (const delta of streamText({ messages })) {
          full += delta;
          controller.enqueue(encoder.encode(delta));
        }
        addMessage(conversationId, "assistant", full);
      } catch (err) {
        const msg = err instanceof AiError ? err.message : "AI error";
        const fallback = `\n\n[${msg}]`;
        controller.enqueue(encoder.encode(fallback));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Conversation-Id": conversationId,
    },
  });
}
