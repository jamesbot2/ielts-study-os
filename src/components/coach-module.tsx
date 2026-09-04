"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import { getAiClient, isAiAvailable } from "@/lib/ai/client";
import { buildLearnerContextSnapshot, type PageContext } from "@/lib/coach/context";
import { isAllowedInternalHref } from "@/lib/coach/links";
import { parseCoachContext } from "@/lib/coach/page-link";
import type { CitationRef, ActionProposal } from "@/lib/coach/types";
import {
  createConversation,
  listConversations,
  deleteConversation,
  listMessages,
  addMessage,
  createStudyTask,
} from "@/lib/storage/repository";
import type { AiMessage } from "@/lib/storage/types";
import { Send, Square, Plus, Trash2, Eye, ExternalLink, Check } from "lucide-react";

interface UiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: CitationRef[];
  actions?: ActionProposal[];
  error?: boolean;
}

function parsePageContext(params: URLSearchParams): PageContext | undefined {
  const parsed = parseCoachContext(params);
  if (parsed) return parsed;
  const route = params.get("route");
  return route ? { route } : undefined;
}

export function CoachModule() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<{ id: string; title: string | null; updatedAt: string }[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showTransparency, setShowTransparency] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pageContext = parsePageContext(searchParams);

  const refreshConversations = useCallback(async () => {
    setConversations(await listConversations("coach"));
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    const msgs = await listMessages(id);
    setConversationId(id);
    setMessages(msgs.map((m: AiMessage) => ({
      id: m.id,
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
      citations: m.citations as CitationRef[] | undefined,
      actions: m.actions as ActionProposal[] | undefined,
    })));
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const cs = await listConversations("coach");
      if (!active) return;
      setConversations(cs);
      if (cs.length) await loadConversation(cs[0].id);
    })();
    return () => { active = false; };
  }, [loadConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function stop() {
    abortRef.current?.abort();
  }

  function newChat() {
    stop();
    setConversationId(null);
    setMessages([]);
    setError(null);
    setInput("");
    setShowHistory(false);
  }

  async function handleDelete(id: string) {
    await deleteConversation(id);
    if (conversationId === id) newChat();
    await refreshConversations();
  }

  async function send() {
    if (!input.trim() || streaming) return;
    const text = input.trim();
    setInput("");
    setError(null);
    const pageCtx = pageContext;

    if (!isAiAvailable()) {
      setMessages((m) => [...m, { id: `local-${Date.now()}`, role: "assistant", content: t("coach.notConfigured") }]);
      return;
    }

    // Create a conversation lazily; title from the first user message.
    let cid = conversationId;
    if (!cid) {
      cid = await createConversation("coach", text.slice(0, 60));
      setConversationId(cid);
      await refreshConversations();
    }

    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", content: text }]);
    await addMessage(cid, "user", text);

    setStreaming(true);
    const assistantId = `a-${Date.now()}`;
    setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "" }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const snapshot = await buildLearnerContextSnapshot(pageCtx);
      const history = messages.slice(-12).map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
      const client = getAiClient();

      const { text: finalText, citations, actions } = await client.coachAgent(
        {
          conversationId: cid,
          message: text,
          learnerContext: snapshot,
          pageContext: pageCtx,
          locale,
          history,
        },
        (event) => {
          if (event.type === "delta") {
            setMessages((m) => {
              const copy = [...m];
              const idx = copy.findIndex((x) => x.id === assistantId);
              if (idx >= 0) copy[idx] = { ...copy[idx], content: copy[idx].content + event.text };
              return copy;
            });
          } else if (event.type === "citation") {
            setMessages((m) => {
              const copy = [...m];
              const idx = copy.findIndex((x) => x.id === assistantId);
              if (idx >= 0) copy[idx] = { ...copy[idx], citations: [...(copy[idx].citations ?? []), event.citation] };
              return copy;
            });
          } else if (event.type === "action_proposal") {
            setMessages((m) => {
              const copy = [...m];
              const idx = copy.findIndex((x) => x.id === assistantId);
              if (idx >= 0) copy[idx] = { ...copy[idx], actions: [...(copy[idx].actions ?? []), event.action] };
              return copy;
            });
          }
        },
        controller.signal,
      );

      // Never persist a silent empty assistant reply: if the stream produced no
      // text, no citations and no actions, treat it as a failure.
      if (!finalText.trim() && citations.length === 0 && actions.length === 0) {
        throw new Error("AI Coach response stream ended unexpectedly.");
      }
      await addMessage(cid, "assistant", finalText, { citations, actions });
    } catch (e) {
      const isAbort = (e as Error).name === "AbortError";
      if (!isAbort) {
        const msg = (e as Error).message;
        setError(msg);
        setMessages((m) => {
          const copy = [...m];
          const idx = copy.findIndex((x) => x.id === assistantId);
          if (idx >= 0) copy[idx] = { ...copy[idx], content: msg, error: true };
          return copy;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  async function acceptAction(action: ActionProposal) {
    if (action.type === "create_study_task") {
      await createStudyTask(action.title, "coach", action.date ?? new Date().toISOString().slice(0, 10), {
        titleZh: action.titleZh ?? undefined,
        href: isAllowedInternalHref(action.href) ? action.href : undefined,
        estimatedMinutes: action.estimatedMinutes ?? undefined,
      });
    }
    // Mark the action as accepted in the UI.
    setMessages((m) => m.map((msg) => ({
      ...msg,
      actions: msg.actions?.map((a) => (a === action ? { ...a, accepted: true } : a)),
    })));
  }

  return (
    <div className="container-page flex h-[calc(100vh-3rem)] flex-col">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">{t("coach.title")}</h1>
          <p className="text-sm text-muted">{t("coach.context")}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary px-2.5 py-1.5 text-xs" onClick={() => setShowTransparency((s) => !s)}>
            <Eye className="h-3.5 w-3.5" /> {locale === "zh" ? "教练可见的数据" : "What the coach can see"}
          </button>
          <button className="btn-secondary px-2.5 py-1.5 text-xs" onClick={() => setShowHistory((s) => !s)}>
            {locale === "zh" ? "历史记录" : "History"}
          </button>
          <button className="btn-secondary px-2.5 py-1.5 text-xs" onClick={newChat}>
            <Plus className="h-3.5 w-3.5" /> {locale === "zh" ? "新对话" : "New chat"}
          </button>
        </div>
      </div>

      {showTransparency && (
        <div className="mb-3 rounded-md border border-border bg-surface p-3 text-xs text-muted">
          <p className="mb-1 font-semibold">{locale === "zh" ? "AI 教练会读取以下本地数据摘要（不含音频/全文/密钥）：" : "The AI coach reads these summarized local data (no audio, full essays, or secrets):"}</p>
          <div className="grid gap-1 sm:grid-cols-2">
            {["Profile", "Lesson progress", "Recent practice", "Mistakes", "Vocabulary", "Mocks", "Writing", "Speaking", "Study plan", "Current page"].map((k) => (
              <span key={k} className="rounded bg-gray-50 px-2 py-0.5">{k}</span>
            ))}
          </div>
        </div>
      )}

      {showHistory && (
        <div className="mb-3 rounded-md border border-border bg-surface p-3">
          <p className="mb-2 text-xs font-semibold">{locale === "zh" ? "对话历史" : "Conversations"}</p>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {conversations.length === 0 && <p className="text-xs text-muted">{locale === "zh" ? "暂无历史对话" : "No conversations yet"}</p>}
            {conversations.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2 rounded px-2 py-1 text-xs hover:bg-gray-50">
                <button className="min-w-0 flex-1 truncate text-left" onClick={() => { loadConversation(c.id); setShowHistory(false); }}>
                  {c.title ?? c.updatedAt.slice(0, 16)}
                </button>
                <button className="text-muted hover:text-red-600" onClick={() => handleDelete(c.id)} aria-label="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto rounded-lg border border-border bg-surface p-4">
        {messages.length === 0 && <p className="text-sm text-muted">{t("coach.inputPlaceholder")}</p>}
        {messages.map((m) => (
          <div key={m.id} className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${m.role === "user" ? "bg-accent text-white" : m.error ? "bg-red-50" : "bg-gray-100"}`}>
              <p className="whitespace-pre-wrap">{m.content || (streaming && m.role === "assistant" ? "…" : "")}</p>

              {m.citations && m.citations.length > 0 && (
                <div className="mt-2 border-t border-border pt-2">
                  <p className="mb-1 text-[11px] font-semibold text-muted">{locale === "zh" ? "来源" : "Sources"}</p>
                  {m.citations.map((c) => (
                    <span key={c.id} className="mr-2 inline-block text-[11px]">
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                          {c.title}{c.section ? ` · ${c.section}` : ""}
                        </a>
                      ) : (
                        <span className="text-muted">{c.title}</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {m.actions && m.actions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {m.actions.map((a, i) => {
                    const accepted = (a as { accepted?: boolean }).accepted;
                    return (
                      <div key={i} className="flex items-center gap-2 rounded border border-border bg-white px-2 py-1.5">
                        <span className="min-w-0 flex-1 text-xs">{a.title}{a.estimatedMinutes ? ` · ${a.estimatedMinutes} min` : ""}</span>
                        {accepted ? (
                          <span className="flex items-center gap-1 text-xs text-green-600"><Check className="h-3.5 w-3.5" /> {locale === "zh" ? "已添加" : "Added"}</span>
                        ) : a.href && isAllowedInternalHref(a.href) ? (
                          <a href={a.href} className="btn-secondary px-2 py-0.5 text-[11px]">
                            <ExternalLink className="h-3 w-3" /> {locale === "zh" ? "打开" : "Open"}
                          </a>
                        ) : null}
                        {!accepted && a.type === "create_study_task" && (
                          <button className="btn-primary px-2 py-0.5 text-[11px]" onClick={() => acceptAction(a)}>
                            {locale === "zh" ? "加入学习计划" : "Add to study plan"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && !streaming && (
        <div className="mt-2 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700">
          <span>{error}</span>
          <button className="underline" onClick={send}>Retry</button>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          className="input flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={t("coach.inputPlaceholder")}
        />
        {streaming ? (
          <button className="btn-secondary" onClick={stop} aria-label="Stop generation">
            <Square className="h-4 w-4" />
          </button>
        ) : null}
        <button className="btn-primary" onClick={send} disabled={streaming || !input.trim()}>
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
