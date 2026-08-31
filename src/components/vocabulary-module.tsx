"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { apiGet, apiPost } from "@/lib/client/api";
import { Spinner } from "@/components/ui";

interface Card {
  id: string;
  word: string;
  part_of_speech: string | null;
  chinese_meaning: string | null;
  english_definition: string | null;
  ipa: string | null;
  example: string | null;
  ielts_example: string | null;
  due_at: string | null;
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  wordFamily: string[];
}

export function VocabularyModule() {
  const { t } = useI18n();
  const [cards, setCards] = useState<Card[]>([]);
  const [dueCount, setDueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const load = useCallback(async () => {
    const data = await apiGet<{ cards: Card[]; dueCount: number }>("/api/vocabulary");
    setCards(data.cards);
    setDueCount(data.dueCount);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dueCards = cards.filter((c) => !c.due_at || new Date(c.due_at) <= new Date());

  async function rate(rating: "again" | "hard" | "good" | "easy") {
    const card = dueCards[reviewIndex];
    await apiPost("/api/vocabulary/review", { id: card.id, rating });
    if (reviewIndex + 1 < dueCards.length) {
      setReviewIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setReviewing(false);
      setReviewIndex(0);
      setFlipped(false);
      await load();
    }
  }

  if (loading) return <div className="container-page"><Spinner /></div>;

  if (reviewing && dueCards.length > 0) {
    const card = dueCards[reviewIndex];
    return (
      <div className="container-page">
        <p className="mb-4 text-sm text-muted">
          Reviewing {reviewIndex + 1} of {dueCards.length}
        </p>
        <div className="mx-auto max-w-xl">
          <button
            className="card card-pad w-full text-left"
            onClick={() => setFlipped((f) => !f)}
          >
            <p className="text-2xl font-semibold">{card.word}</p>
            {card.ipa && <p className="text-sm text-muted">{card.ipa}</p>}
            {flipped && (
              <div className="mt-4 space-y-2 text-sm">
                {card.chinese_meaning && <p><span className="text-muted">中文:</span> {card.chinese_meaning}</p>}
                {card.english_definition && <p><span className="text-muted">Def:</span> {card.english_definition}</p>}
                {card.example && <p className="italic text-muted">“{card.example}”</p>}
                {card.ielts_example && <p className="text-muted">IELTS: “{card.ielts_example}”</p>}
                {card.synonyms?.length > 0 && <p><span className="text-muted">Synonyms:</span> {card.synonyms.join(", ")}</p>}
                {card.collocations?.length > 0 && <p><span className="text-muted">Collocations:</span> {card.collocations.join(", ")}</p>}
              </div>
            )}
            <p className="mt-3 text-xs text-muted">{flipped ? "Click to hide" : "Click to reveal"}</p>
          </button>
          <div className="mt-4 grid grid-cols-4 gap-2">
            <button className="btn-danger" onClick={() => rate("again")}>{t("vocabulary.again")}</button>
            <button className="btn-secondary" onClick={() => rate("hard")}>{t("vocabulary.hard")}</button>
            <button className="btn-primary" onClick={() => rate("good")}>{t("vocabulary.good")}</button>
            <button className="btn-primary" onClick={() => rate("easy")}>{t("vocabulary.easy")}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("vocabulary.title")}</h1>
          <p className="text-sm text-muted">
            {cards.length} {t("vocabulary.totalCards")} · {dueCount} {t("vocabulary.dueCards")}
          </p>
        </div>
        <div className="flex gap-2">
          {dueCount > 0 && (
            <button className="btn-primary" onClick={() => { setReviewing(true); setReviewIndex(0); setFlipped(false); }}>
              {t("vocabulary.review")} ({dueCount})
            </button>
          )}
          <button className="btn-secondary" onClick={() => setShowAdd((s) => !s)}>
            + {t("vocabulary.addWord")}
          </button>
        </div>
      </div>

      {showAdd && <AddWordForm onAdded={() => { setShowAdd(false); load(); }} />}

      {cards.length === 0 ? (
        <div className="card card-pad text-center text-muted">{t("vocabulary.noCards")}</div>
      ) : (
        <div className="card divide-y divide-border">
          {cards.map((c) => {
            const due = !c.due_at || new Date(c.due_at) <= new Date();
            return (
              <div key={c.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium">
                    {c.word}
                    {c.part_of_speech && <span className="ml-2 text-xs text-muted">{c.part_of_speech}</span>}
                  </p>
                  {c.chinese_meaning && <p className="text-xs text-muted">{c.chinese_meaning}</p>}
                </div>
                <span className={`text-xs ${due ? "font-semibold text-accent" : "text-muted"}`}>
                  {due ? t("vocabulary.dueNow") : c.due_at ? new Date(c.due_at).toLocaleDateString() : "—"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AddWordForm({ onAdded }: { onAdded: () => void }) {
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);
  const [word, setWord] = useState("");
  const [chinese, setChinese] = useState("");
  const [definition, setDefinition] = useState("");

  async function submit() {
    if (!word.trim()) return;
    setSaving(true);
    await apiPost("/api/vocabulary", { word: word.trim(), chineseMeaning: chinese, englishDefinition: definition });
    setSaving(false);
    onAdded();
  }

  return (
    <div className="card card-pad mb-4 grid gap-3 sm:grid-cols-3">
      <input className="input" placeholder={t("vocabulary.word")} value={word} onChange={(e) => setWord(e.target.value)} />
      <input className="input" placeholder={t("vocabulary.chineseMeaning")} value={chinese} onChange={(e) => setChinese(e.target.value)} />
      <input className="input" placeholder={t("vocabulary.englishDefinition")} value={definition} onChange={(e) => setDefinition(e.target.value)} />
      <button className="btn-primary sm:col-span-3" onClick={submit} disabled={saving || !word.trim()}>
        {saving ? <Spinner /> : t("common.save")}
      </button>
    </div>
  );
}
