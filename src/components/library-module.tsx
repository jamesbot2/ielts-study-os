"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { resources as builtinResources, resourceCategories, type ResourceItem } from "@/lib/content/resources";
import {
  createImportedMaterial,
  deleteImportedMaterial,
  listImportedMaterials,
} from "@/lib/storage/repository";
import type { ImportedMaterial } from "@/lib/storage/types";
import { Spinner } from "@/components/ui";
import { Search, ExternalLink, Star } from "lucide-react";

const SKILL_OPTIONS = [
  { id: "all", en: "All skills", zh: "全部技能" },
  { id: "listening", en: "Listening", zh: "听力" },
  { id: "reading", en: "Reading", zh: "阅读" },
  { id: "writing", en: "Writing", zh: "写作" },
  { id: "speaking", en: "Speaking", zh: "口语" },
  { id: "vocabulary", en: "Vocabulary", zh: "词汇" },
  { id: "grammar", en: "Grammar", zh: "语法" },
] as const;

export function LibraryModule() {
  const { t, locale } = useI18n();
  const [materials, setMaterials] = useState<ImportedMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [officialOnly, setOfficialOnly] = useState(false);

  useEffect(() => {
    listImportedMaterials().then((m) => {
      setMaterials(m);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return builtinResources.filter((r) => {
      if (officialOnly && !r.official) return false;
      if (skillFilter !== "all" && r.skill !== skillFilter && r.skill !== "all") return false;
      if (q) {
        const hay = `${r.titleEn} ${r.titleZh} ${r.descriptionEn} ${r.descriptionZh} ${r.provider} ${r.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, skillFilter, officialOnly]);

  const recommended = builtinResources.filter((r) => r.recommended);

  if (loading) return <div className="container-page"><Spinner /></div>;

  return (
    <div className="container-page">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("library.title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("library.subtitle")}</p>
        </div>
        <button className="btn-secondary" onClick={() => setShowImport((s) => !s)}>
          + {t("library.import")}
        </button>
      </div>

      <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">
        {t("library.copyrightNotice")}
      </div>

      {showImport && <ImportForm onDone={() => { setShowImport(false); listImportedMaterials().then(setMaterials); }} />}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
          <input
            className="input pl-8"
            placeholder={t("library.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="input w-auto" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
          {SKILL_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>{locale === "zh" ? s.zh : s.en}</option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm text-muted">
          <input type="checkbox" checked={officialOnly} onChange={(e) => setOfficialOnly(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
          {t("library.officialOnly")}
        </label>
      </div>

      {/* Recommended */}
      <section className="mb-6">
        <h2 className="mb-2 flex items-center gap-1.5 text-base font-semibold">
          <Star className="h-4 w-4 text-accent" /> {t("library.recommended")}
        </h2>
        <div className="grid gap-2 md:grid-cols-2">
          {recommended.map((r) => (
            <ResourceCard key={r.id} resource={r} locale={locale} t={t} />
          ))}
        </div>
      </section>

      {/* All built-in resources */}
      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">
          {t("library.builtIn")} <span className="text-sm font-normal text-muted">· {filtered.length} {t("library.results")}</span>
        </h2>
        {filtered.length === 0 ? (
          <div className="card card-pad text-center text-muted">{t("library.noResults")}</div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {filtered.map((r) => (
              <ResourceCard key={r.id} resource={r} locale={locale} t={t} />
            ))}
          </div>
        )}
      </section>

      {/* My imported materials */}
      <section>
        <h2 className="mb-2 text-base font-semibold">{t("library.myImported")}</h2>
        {materials.length === 0 ? (
          <div className="card card-pad text-sm text-muted">
            {t("library.empty")}{" "}
            <button className="ml-1 underline" onClick={() => setShowImport(true)}>{t("library.import")}</button>
          </div>
        ) : (
          <div className="card divide-y divide-border">
            {materials.map((m) => (
              <div key={m.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{m.title}</p>
                  <p className="text-xs text-muted">
                    {m.skill} · {m.testType} · {m.format}
                    {m.sourceType === "AI_GENERATED" && <span className="ml-2 text-amber-600">AI-generated</span>}
                  </p>
                  {m.content && <p className="mt-1 line-clamp-2 text-xs text-muted">{m.content.slice(0, 200)}</p>}
                </div>
                <button
                  className="text-xs text-muted hover:text-red-600"
                  onClick={async () => { await deleteImportedMaterial(m.id); listImportedMaterials().then(setMaterials); }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ResourceCard({
  resource,
  locale,
  t,
}: {
  resource: ResourceItem;
  locale: "en" | "zh";
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const title = locale === "zh" ? resource.titleZh : resource.titleEn;
  const desc = locale === "zh" ? resource.descriptionZh : resource.descriptionEn;
  const cat = resourceCategories.find((c) => c.id === resource.category);

  return (
    <div className="card card-pad flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium leading-snug">{title}</p>
          <p className="mt-0.5 text-xs text-muted">{resource.provider}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1">
          {resource.official && <span className="badge badge-accent">{t("library.official")}</span>}
          {resource.free && <span className="badge">{t("library.free")}</span>}
        </div>
      </div>

      <p className="mt-2 flex-1 text-sm text-muted">{desc}</p>

      <div className="mt-2 flex flex-wrap gap-1">
        {cat && <span className="badge">{locale === "zh" ? cat.labelZh : cat.labelEn}</span>}
        {resource.testType !== "both" && <span className="badge">{resource.testType}</span>}
        {resource.license && <span className="badge">{resource.license}</span>}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
        <span className="text-[11px] text-muted">{t("library.lastVerified")} {resource.lastVerified}</span>
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex px-3 py-1.5 text-xs">
          <ExternalLink className="h-3.5 w-3.5" /> {t("library.openResource")}
        </a>
      </div>
    </div>
  );
}

function ImportForm({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    title: "",
    skill: "reading",
    testType: "academic",
    format: "text",
    content: "",
    sourceType: "USER_IMPORTED",
    sourceName: "",
    license: "Personal use",
  });
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!form.title.trim()) return;
    setSaving(true);
    await createImportedMaterial({
      title: form.title,
      skill: form.skill,
      testType: form.testType as "academic" | "general" | "both",
      sourceType: form.sourceType as "USER_IMPORTED",
      sourceName: form.sourceName,
      license: form.license,
      copyrightStatus: "User-provided",
      format: form.format,
      content: form.content,
    });
    setSaving(false);
    onDone();
  }

  return (
    <div className="card card-pad mb-4 grid gap-3 sm:grid-cols-2">
      <input className="input" placeholder={t("library.title2")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <select className="input" value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })}>
        {["reading", "listening", "writing", "speaking", "vocabulary", "grammar"].map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select className="input" value={form.testType} onChange={(e) => setForm({ ...form, testType: e.target.value })}>
        <option value="academic">academic</option>
        <option value="general">general</option>
        <option value="both">both</option>
      </select>
      <select className="input" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
        <option value="text">text</option>
        <option value="markdown">markdown</option>
      </select>
      <input className="input" placeholder="Source name (optional)" value={form.sourceName} onChange={(e) => setForm({ ...form, sourceName: e.target.value })} />
      <textarea
        className="input min-h-[120px] sm:col-span-2"
        placeholder={t("library.content")}
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />
      <button className="btn-primary sm:col-span-2" onClick={submit} disabled={saving || !form.title.trim()}>
        {saving ? <Spinner /> : t("common.save")}
      </button>
    </div>
  );
}
