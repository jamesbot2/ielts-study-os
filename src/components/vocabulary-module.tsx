"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import {
  createVocabCard,
  getDueVocabCards,
  listVocabCards,
  recordVocabReview,
} from "@/lib/storage/repository";
import { vocabTopics, type VocabEntry } from "@/lib/content/vocabulary";
import { listEnabledVocabularyProviders } from "@/lib/plugins/vocabulary";
import { addProviderEntryToPersonalVocabulary } from "@/lib/plugins/vocabulary/import";
import type { VocabularyProvider, VocabularyBook, CanonicalVocabularyEntry } from "@/lib/plugins/vocabulary/types";
import { collocationGroups } from "@/lib/content/collocations";
import type { VocabularyCard } from "@/lib/storage/types";
import { Spinner } from "@/components/ui";

export function VocabularyModule() {
  const { t, locale } = useI18n();
  const [cards, setCards] = useState<VocabularyCard[]>([]);
  const [dueCards, setDueCards] = useState<VocabularyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showCollocations, setShowCollocations] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
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
          <button className="btn-secondary" onClick={() => { setShowAdd((s) => !s); setShowLibrary(false); }}>
            + {t("vocabulary.addWord")}
          </button>
          <button className="btn-secondary" onClick={() => setShowLibrary((s) => !s)}>
            📚 {t("vocabulary.library")}
          </button>
          <button className="btn-secondary" onClick={() => setShowCollocations((s) => !s)}>
            ✍️ Collocations
          </button>
          <button className="btn-secondary" onClick={() => setShowProviders((s) => !s)}>
            🔌 {locale === "zh" ? "外部词库" : "Word books"}
          </button>
        </div>
      </div>

      {showAdd && <AddWordForm onAdded={() => { setShowAdd(false); load(); }} />}

      {showLibrary && <VocabularyLibrary onAdded={load} />}
      {showCollocations && <CollocationsSection />}
      {showProviders && <WordBooksBrowser onAdded={load} />}

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

function VocabularyLibrary({ onAdded }: { onAdded: () => void }) {
  const { t, locale } = useI18n();
  const [openTopic, setOpenTopic] = useState<string | null>(vocabTopics[0]?.id ?? null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  // Mark words already in the deck as added, to prevent duplicates after reload.
  useEffect(() => {
    listVocabCards().then((cards) => {
      setAdded(new Set(cards.map((c) => c.word.trim().toLowerCase())));
    });
  }, []);

  async function addWord(entry: VocabEntry, topicName: string) {
    await createVocabCard({
      word: entry.word,
      partOfSpeech: entry.pos,
      chineseMeaning: entry.meaningZh,
      englishDefinition: entry.definitionEn,
      collocations: entry.collocations,
      example: entry.example,
      sourceContext: `Built-in library · ${topicName}`,
      sourceSkill: "vocabulary",
      tags: [entry.band],
    });
    setAdded((s) => new Set(s).add(entry.word.trim().toLowerCase()));
    onAdded();
  }

  return (
    <div className="card card-pad mb-4">
      <p className="mb-2 text-sm font-semibold">{t("vocabulary.library")}</p>
      <div className="flex flex-wrap gap-1">
        {vocabTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setOpenTopic(topic.id === openTopic ? null : topic.id)}
            className={`rounded-md border px-2.5 py-1.5 text-xs ${openTopic === topic.id ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted hover:bg-gray-50"}`}
          >
            {locale === "zh" ? topic.nameZh : topic.nameEn}
          </button>
        ))}
      </div>

      {openTopic && (
        <div className="mt-3 space-y-1.5">
          {vocabTopics.find((tp) => tp.id === openTopic)?.words.map((w) => (
            <div key={w.word} className="flex items-start justify-between gap-3 rounded-md border border-border px-3 py-2">
              <div className="min-w-0 text-sm">
                <p>
                  <span className="font-medium">{w.word}</span>{" "}
                  <span className="text-xs text-muted italic">{w.pos}</span>
                  {w.band !== "core" && <span className="ml-1 badge">{w.band}</span>}
                </p>
                <p className="text-xs text-muted">
                  {locale === "zh" ? w.meaningZh : w.definitionEn}
                </p>
                {w.collocations.length > 0 && (
                  <p className="text-xs text-muted">collocations: {w.collocations.join(", ")}</p>
                )}
              </div>
              <button
                className="btn-secondary shrink-0 px-2.5 py-1 text-xs"
                disabled={added.has(w.word.trim().toLowerCase())}
                onClick={() => addWord(w, vocabTopics.find((tp) => tp.id === openTopic)?.nameEn ?? "")}
              >
                {added.has(w.word.trim().toLowerCase()) ? "✓" : `+ ${t("vocabulary.addToDeck")}`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CollocationsSection() {
  const { locale } = useI18n();
  const [open, setOpen] = useState<string | null>(collocationGroups[0]?.id ?? null);

  return (
    <div className="card card-pad mb-4">
      <p className="mb-2 text-sm font-semibold">Collocations</p>
      <div className="flex flex-wrap gap-1">
        {collocationGroups.map((g) => (
          <button
            key={g.id}
            onClick={() => setOpen(g.id === open ? null : g.id)}
            className={`rounded-md border px-2.5 py-1.5 text-xs ${open === g.id ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted hover:bg-gray-50"}`}
          >
            {locale === "zh" ? g.nameZh : g.nameEn}
          </button>
        ))}
      </div>
      {open && (
        <div className="mt-3 space-y-1.5">
          {collocationGroups.find((g) => g.id === open)?.items.map((it) => (
            <div key={it.phrase} className="rounded-md border border-border px-3 py-2 text-sm">
              <p className="font-medium">{it.phrase}</p>
              <p className="text-xs text-muted italic">“{it.example}”</p>
              {it.noteZh && locale === "zh" && <p className="text-xs text-muted">{it.noteZh}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WordBooksBrowser({ onAdded }: { onAdded: () => void }) {
  const { t, locale } = useI18n();
  const [providers, setProviders] = useState<VocabularyProvider[]>([]);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [books, setBooks] = useState<VocabularyBook[]>([]);
  const [bookId, setBookId] = useState<string | null>(null);
  const [entries, setEntries] = useState<CanonicalVocabularyEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<CanonicalVocabularyEntry | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const LIMIT = 30;

  useEffect(() => {
    listEnabledVocabularyProviders().then((p) => {
      setProviders(p);
      if (p.length) setProviderId(p[0].id);
    });
  }, []);

  useEffect(() => {
    if (!providerId) return;
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return;
    setBooks([]);
    setBookId(null);
    setSelected(null);
    setError(null);
    provider.listBooks().then((b) => {
      setBooks(b);
      if (b.length) setBookId(b[0].id);
    }).catch((e) => setError((e as Error).message));
  }, [providerId, providers]);

  useEffect(() => {
    if (!providerId || !bookId) return;
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return;
    setBusy(true);
    setError(null);
    provider.listEntries(bookId, { offset: 0, limit: LIMIT, query: query.trim() || undefined })
      .then((page) => { setEntries(page.entries); setTotal(page.total); setOffset(0); })
      .catch((e) => setError((e as Error).message))
      .finally(() => setBusy(false));
  }, [providerId, bookId, query, providers]);

  async function loadPage(nextOffset: number) {
    if (!providerId || !bookId) return;
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return;
    setBusy(true);
    const page = await provider.listEntries(bookId, { offset: nextOffset, limit: LIMIT, query: query.trim() || undefined });
    setEntries(page.entries);
    setOffset(nextOffset);
    setBusy(false);
  }

  async function open(entry: CanonicalVocabularyEntry) {
    setBusy(true);
    setError(null);
    const provider = providers.find((p) => p.id === providerId);
    try {
      const detail = provider && provider.getEntry ? await provider.getEntry(entry.word) : entry;
      setSelected(detail ?? entry);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function add(entry: CanonicalVocabularyEntry) {
    const res = await addProviderEntryToPersonalVocabulary(entry);
    if (res.created) {
      setAddedIds((s) => new Set(s).add(entry.id));
      onAdded();
    } else {
      setError(locale === "zh" ? "该词已在你的词库中。" : "This word is already in your deck.");
    }
  }

  return (
    <div className="card card-pad mb-4">
      <p className="mb-2 text-sm font-semibold">{locale === "zh" ? "词库" : "Word books"}</p>
      <div className="flex flex-wrap gap-1">
        {providers.map((p) => (
          <button key={p.id} onClick={() => setProviderId(p.id)} className={`rounded-md border px-2.5 py-1.5 text-xs ${providerId === p.id ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted hover:bg-gray-50"}`}>
            {p.name}
          </button>
        ))}
      </div>

      {books.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {books.map((b) => (
            <button key={b.id} onClick={() => setBookId(b.id)} className={`rounded-md border px-2.5 py-1.5 text-xs ${bookId === b.id ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted hover:bg-gray-50"}`}>
              {b.title} {b.wordCount != null ? `(${b.wordCount})` : ""}
            </button>
          ))}
        </div>
      )}

      {bookId && (
        <div className="mt-3 flex gap-2">
          <input className="input flex-1" placeholder={locale === "zh" ? "搜索单词" : "Search words"} value={query} onChange={(e) => setQuery(e.target.value)} />
          <span className="self-center text-xs text-muted">{total} {locale === "zh" ? "个词" : "words"}</span>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-amber-600">{error}</p>}

      {busy && <div className="mt-2"><Spinner /></div>}

      {!busy && entries.length > 0 && (
        <div className="mt-3 grid gap-1 sm:grid-cols-2">
          {entries.map((e) => (
            <button key={e.id} onClick={() => open(e)} className="flex items-center justify-between rounded-md border border-border px-3 py-1.5 text-left text-sm hover:border-accent">
              <span className="font-medium">{e.word}</span>
              {addedIds.has(e.id) && <span className="text-xs text-green-600">✓</span>}
            </button>
          ))}
        </div>
      )}

      {!busy && total > LIMIT && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <button className="btn-secondary px-2 py-1" disabled={offset === 0} onClick={() => loadPage(Math.max(0, offset - LIMIT))}>{locale === "zh" ? "上一页" : "Prev"}</button>
          <span>{Math.floor(offset / LIMIT) + 1} / {Math.ceil(total / LIMIT)}</span>
          <button className="btn-secondary px-2 py-1" disabled={offset + LIMIT >= total} onClick={() => loadPage(offset + LIMIT)}>{locale === "zh" ? "下一页" : "Next"}</button>
        </div>
      )}

      {selected && (
        <div className="mt-3 rounded-md border border-border p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium">{selected.word} {selected.ipa && <span className="text-xs text-muted">{selected.ipa}</span>}</p>
              {selected.partOfSpeech && <span className="badge mt-1">{selected.partOfSpeech}</span>}
              {selected.meaningZh && <p className="mt-1 text-sm">{selected.meaningZh}</p>}
              {selected.definitionEn && <p className="text-sm text-muted">{selected.definitionEn}</p>}
              {selected.examples[0] && <p className="mt-1 text-sm italic text-muted">“{selected.examples[0]}”</p>}
              {selected.collocations.length > 0 && <p className="mt-1 text-xs text-muted">collocations: {selected.collocations.join(", ")}</p>}
              <p className="mt-1 text-[11px] text-muted">{selected.source.providerName}{selected.source.attribution ? ` · ${selected.source.attribution}` : ""}</p>
            </div>
            <button className="btn-primary shrink-0 px-3 py-1.5 text-xs" onClick={() => add(selected)} disabled={addedIds.has(selected.id)}>
              {addedIds.has(selected.id) ? "✓" : `+ ${t("vocabulary.addToDeck")}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
