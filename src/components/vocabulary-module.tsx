"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import {
  createVocabCard,
  getDueVocabCards,
  listVocabCards,
  recordVocabReview,
} from "@/lib/storage/repository";
import type { VocabularyCard } from "@/lib/storage/types";
import { Spinner } from "@/components/ui";

export function VocabularyModule() {
  const { t } = useI18n();
  const [cards, setCards] = useState<VocabularyCard[]>([]);
  const [dueCards, setDueCards] = useState<VocabularyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const load = useCallback(async () => {
    const [all, due] = await Promise.all([listVocabCards(), getDueVocabCards()]);
    setCards(all);
    setDueCards(due);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function rate(rating: "again" | "hard" | "good" | "easy") {
    const card = dueCards[reviewIndex];
    if (!card) return;
    await recordVocabReview(card.id, rating);
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
                {card.chineseMeaning && <p><span className="text-muted">中文:</span> {card.chineseMeaning}</p>}
                {card.englishDefinition && <p><span className="text-muted">Def:</span> {card.englishDefinition}</p>}
                {card.example && <p className="italic text-muted">“{card.example}”</p>}
                {card.ieltsExample && <p className="text-muted">IELTS: “{card.ieltsExample}”</p>}
                {card.synonyms.length > 0 && <p><span className="text-muted">Synonyms:</span> {card.synonyms.join(", ")}</p>}
                {card.collocations.length > 0 && <p><span className="text-muted">Collocations:</span> {card.collocations.join(", ")}</p>}
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
            {cards.length} {t("vocabulary.totalCards")} · {dueCards.length} {t("vocabulary.dueCards")}
          </p>
        </div>
        <div className="flex gap-2">
          {dueCards.length > 0 && (
            <button className="btn-primary" onClick={() => { setReviewing(true); setReviewIndex(0); setFlipped(false); }}>
              {t("vocabulary.review")} ({dueCards.length})
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
            const due = !c.due || new Date(c.due) <= new Date();
            return (
              <div key={c.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium">
                    {c.word}
                    {c.partOfSpeech && <span className="ml-2 text-xs text-muted">{c.partOfSpeech}</span>}
                  </p>
                  {c.chineseMeaning && <p className="text-xs text-muted">{c.chineseMeaning}</p>}
                </div>
                <span className={`text-xs ${due ? "font-semibold text-accent" : "text-muted"}`}>
                  {due ? t("vocabulary.dueNow") : c.due ? new Date(c.due).toLocaleDateString() : "—"}
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
    await createVocabCard({ word: word.trim(), chineseMeaning: chinese, englishDefinition: definition });
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
