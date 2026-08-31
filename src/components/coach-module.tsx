"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function CoachModule({ configured }: { configured: boolean }) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || streaming) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMessage }]);
    setStreaming(true);

    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, message: userMessage, context: { page: "coach" } }),
    });

    const newConvId = res.headers.get("X-Conversation-Id");
    if (newConvId) setConversationId(newConvId);

    if (!res.ok || !res.body) {
      setMessages((m) => [...m, { role: "assistant", content: t("coach.notConfigured") }]);
      setStreaming(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let acc = "";
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      acc += decoder.decode(value, { stream: true });
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: acc };
        return copy;
      });
    }
    setStreaming(false);
  }

  return (
    <div className="container-page flex h-[calc(100vh-3rem)] flex-col">
      <h1 className="mb-2 text-2xl font-semibold">{t("coach.title")}</h1>
      <p className="mb-4 text-sm text-muted">{t("coach.context")}</p>

      {!configured && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">
          {t("coach.notConfigured")}{" "}
          <a href="/settings" className="underline">Settings</a>
        </div>
      )}

      <div className="flex-1 overflow-y-auto rounded-lg border border-border bg-surface p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted">
            {t("coach.inputPlaceholder")}
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${m.role === "user" ? "bg-accent text-white" : "bg-gray-100"}`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="input flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t("coach.inputPlaceholder")}
        />
        <button className="btn-primary" onClick={send} disabled={streaming || !input.trim()}>
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
