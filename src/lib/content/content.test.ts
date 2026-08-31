import { describe, it, expect } from "vitest";
import { resources } from "./resources";
import { sources } from "./sources";
import { vocabTopics, allVocabEntries } from "./vocabulary";
import { collocationGroups } from "./collocations";
import { studyGuides } from "./study-guides";
import { allLessons } from "./curriculum";
import { speakingTopics } from "./practice/speaking-topics";

describe("resource catalog", () => {
  it("has a substantial number of built-in resources", () => {
    expect(resources.length).toBeGreaterThanOrEqual(15);
  });

  it("has unique ids", () => {
    expect(new Set(resources.map((r) => r.id)).size).toBe(resources.length);
  });

  it("every resource has a URL and bilingual title/description", () => {
    for (const r of resources) {
      expect(r.url).toMatch(/^https?:\/\//);
      expect(r.titleEn.length).toBeGreaterThan(0);
      expect(r.titleZh.length).toBeGreaterThan(0);
      expect(r.descriptionEn.length).toBeGreaterThan(0);
      expect(r.descriptionZh.length).toBeGreaterThan(0);
    }
  });

  it("official resources are marked official with a provider", () => {
    for (const r of resources.filter((x) => x.official)) {
      expect(r.provider.length).toBeGreaterThan(0);
      expect(r.redistributionPolicy).toMatch(/Link only|link only|do not copy/i);
    }
  });

  it("open-source resources have license metadata", () => {
    for (const r of resources.filter((x) => x.providerType === "open-source")) {
      expect(r.license).toBeTruthy();
    }
  });

  it("includes at least 3 recommended official resources", () => {
    const rec = resources.filter((r) => r.recommended && r.official);
    expect(rec.length).toBeGreaterThanOrEqual(3);
  });
});

describe("source registry", () => {
  it("every source has a URL and verified date", () => {
    for (const s of sources) {
      expect(s.url).toMatch(/^https?:\/\//);
      expect(s.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("lesson source references resolve", () => {
    const ids = new Set(sources.map((s) => s.id));
    for (const lesson of allLessons) {
      for (const sid of lesson.sourceIds ?? []) {
        expect(ids.has(sid), `${lesson.id} references unknown source ${sid}`).toBe(true);
      }
    }
  });
});

describe("vocabulary library", () => {
  it("has many topics and words", () => {
    expect(vocabTopics.length).toBeGreaterThanOrEqual(10);
    expect(allVocabEntries().length).toBeGreaterThanOrEqual(80);
  });

  it("every entry has word, definition and bilingual meaning", () => {
    for (const e of allVocabEntries()) {
      expect(e.word.length).toBeGreaterThan(0);
      expect(e.definitionEn.length).toBeGreaterThan(0);
      expect(e.meaningZh.length).toBeGreaterThan(0);
      expect(e.example.length).toBeGreaterThan(0);
    }
  });
});

describe("collocation bank", () => {
  it("has multiple groups with items", () => {
    expect(collocationGroups.length).toBeGreaterThanOrEqual(5);
    for (const g of collocationGroups) {
      expect(g.items.length).toBeGreaterThanOrEqual(3);
      expect(g.nameZh.length).toBeGreaterThan(0);
    }
  });
});

describe("study guides", () => {
  it("has several guides with schedules", () => {
    expect(studyGuides.length).toBeGreaterThanOrEqual(5);
    for (const g of studyGuides) {
      expect(g.titleZh.length).toBeGreaterThan(0);
      expect(g.schedule.length).toBeGreaterThan(0);
    }
  });
});

describe("speaking topics", () => {
  it("has a large topic library", () => {
    expect(speakingTopics.length).toBeGreaterThanOrEqual(40);
  });

  it("every topic has part 1, part 2 and part 3 questions", () => {
    for (const t of speakingTopics) {
      expect(t.part1Questions.length).toBeGreaterThan(0);
      expect(t.part2CueCards.length).toBeGreaterThan(0);
      expect(t.part3Questions.length).toBeGreaterThan(0);
    }
  });
});

describe("lesson content", () => {
  it("every lesson has a bilingual title and summary", () => {
    for (const l of allLessons) {
      expect(l.title.en.length).toBeGreaterThan(0);
      expect(l.title.zh.length).toBeGreaterThan(0);
      expect(l.summary.en.length).toBeGreaterThan(0);
      expect(l.summary.zh.length).toBeGreaterThan(0);
    }
  });

  it("has a substantial total lesson count", () => {
    expect(allLessons.length).toBeGreaterThanOrEqual(50);
  });
});
