"""Bounded agent tools. Tools read from the supplied LearnerContextSnapshot
(never a live learner DB) plus the RAG retriever."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from ..rag.retrieval import HybridRetriever, SearchFilters
from ..llm.base import EmbeddingProvider

SNAPSHOT = dict[str, Any]


@dataclass
class ToolContext:
    snapshot: SNAPSHOT
    retriever: HybridRetriever
    embeddings: EmbeddingProvider
    locale: str = "en"


async def search_knowledge_base(ctx: ToolContext, args: dict[str, Any]) -> dict[str, Any]:
    query = str(args.get("query", ""))
    filters = SearchFilters(
        skill=args.get("skill"),
        test_type=args.get("test_type"),
        source_type=args.get("source_type"),
        official=args.get("official"),
        question_type=args.get("question_type"),
        language=args.get("language"),
    )
    top_k = min(int(args.get("top_k", 8)), 20)
    embedding = await ctx.embeddings.embed_query(query)
    results = ctx.retriever.search(query, embedding, top_k=top_k, filters=filters)
    return {
        "results": [
            {
                "chunkId": r.chunk_id,
                "sourceId": r.source_id,
                "title": r.title,
                "url": r.url,
                "section": r.section,
                "content": r.content,
                "score": r.score,
            }
            for r in results
        ]
    }


def get_profile_summary(ctx: ToolContext, args: dict[str, Any]) -> dict[str, Any]:
    return ctx.snapshot.get("profile", {})


def get_progress_summary(ctx: ToolContext, args: dict[str, Any]) -> dict[str, Any]:
    return ctx.snapshot.get("lessons", {})


def get_recent_mistakes(ctx: ToolContext, args: dict[str, Any]) -> dict[str, Any]:
    return ctx.snapshot.get("mistakes", {})


def get_vocab_due(ctx: ToolContext, args: dict[str, Any]) -> dict[str, Any]:
    return ctx.snapshot.get("vocabulary", {})


def get_mock_history(ctx: ToolContext, args: dict[str, Any]) -> dict[str, Any]:
    return ctx.snapshot.get("mocks", {})


def get_study_plan(ctx: ToolContext, args: dict[str, Any]) -> dict[str, Any]:
    return ctx.snapshot.get("studyPlan", {})


def get_recent_writing(ctx: ToolContext, args: dict[str, Any]) -> dict[str, Any]:
    return ctx.snapshot.get("writing", {})


def get_recent_speaking(ctx: ToolContext, args: dict[str, Any]) -> dict[str, Any]:
    return ctx.snapshot.get("speaking", {})


def recommend_next_activity(ctx: ToolContext, args: dict[str, Any]) -> dict[str, Any]:
    s = ctx.snapshot
    actions: list[dict[str, Any]] = []
    vocab = s.get("vocabulary", {})
    if int(vocab.get("dueNow", 0)) >= 10:
        actions.append({"type": "open_vocabulary", "title": "Review due vocabulary", "href": "/vocabulary", "estimatedMinutes": 10})
    practice = s.get("practice", {})
    acc = practice.get("accuracyBySkill", {})
    weakest = min(acc.items(), key=lambda kv: kv[1].get("accuracy", 1.0), default=None)
    if weakest and weakest[1].get("attempts", 0) >= 2 and weakest[1].get("accuracy", 1.0) < 0.7:
        skill = weakest[0]
        href = f"/practice/{skill}" if skill in ("reading", "listening", "writing", "speaking") else "/practice"
        actions.append({"type": "open_practice", "title": f"Targeted {skill} practice", "href": href, "estimatedMinutes": 20})
    if not actions:
        actions.append({"type": "open_practice", "title": "Start a diagnostic practice set", "href": "/practice", "estimatedMinutes": 20})
    return {"actions": actions[:3]}


TOOLS: dict[str, Any] = {
    "search_knowledge_base": search_knowledge_base,
    "get_profile_summary": get_profile_summary,
    "get_progress_summary": get_progress_summary,
    "get_recent_mistakes": get_recent_mistakes,
    "get_vocab_due": get_vocab_due,
    "get_mock_history": get_mock_history,
    "get_study_plan": get_study_plan,
    "get_recent_writing": get_recent_writing,
    "get_recent_speaking": get_recent_speaking,
    "recommend_next_activity": recommend_next_activity,
}
