"""Offline filter-contract tests against InMemoryKnowledgeRepository.
The same corpus/assertions are run against PostgreSQL in test_postgres.py."""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.rag.retrieval import SearchFilters
from app.storage.repository import InMemoryKnowledgeRepository
from tests.corpus import seed_corpus


@pytest.fixture()
def repo():
    r = InMemoryKnowledgeRepository()
    seed_corpus(r, dim=8)
    return r


def _ids(results):
    return {r.chunk_id for r in results}


def test_vector_skill_and_test_type(repo):
    results = repo.search_vector([0.1] * 8, SearchFilters(skill="reading", test_type="academic"), 10)
    assert _ids(results) == {"c-acad-read-mh"}


def test_vector_source_type_and_official(repo):
    results = repo.search_vector([0.1] * 8, SearchFilters(source_type="original"), 10)
    assert _ids(results) == {"c-acad-write-proc", "c-gen-write-letter"}
    results = repo.search_vector([0.1] * 8, SearchFilters(official=True), 10)
    assert _ids(results) == {"c-acad-read-mh", "c-gen-read-mc"}


def test_vector_question_type(repo):
    results = repo.search_vector([0.1] * 8, SearchFilters(question_type="matching_headings"), 10)
    assert _ids(results) == {"c-acad-read-mh"}


def test_vector_language(repo):
    results = repo.search_vector([0.1] * 8, SearchFilters(language="en"), 10)
    assert len(results) == 4


def test_lexical_skill_and_test_type(repo):
    results = repo.search_lexical("Reading headings", SearchFilters(skill="reading", test_type="academic"), 10)
    assert _ids(results) == {"c-acad-read-mh"}


def test_lexical_source_type_and_official(repo):
    results = repo.search_lexical("writing", SearchFilters(source_type="original", official=False), 10)
    assert _ids(results) == {"c-acad-write-proc", "c-gen-write-letter"}


def test_lexical_question_type(repo):
    results = repo.search_lexical("Multiple Choice", SearchFilters(question_type="multiple_choice"), 10)
    assert _ids(results) == {"c-gen-read-mc"}


def test_filter_parity_allowed_domains(repo):
    # The same filter must produce the same allowed set across vector + lexical.
    f = SearchFilters(test_type="general")
    v = _ids(repo.search_vector([0.1] * 8, f, 10))
    l = _ids(repo.search_lexical("Reading Writing", f, 10))
    assert v == l == {"c-gen-read-mc", "c-gen-write-letter"}
