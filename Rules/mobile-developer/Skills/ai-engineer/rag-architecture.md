# Retrieval-Augmented Generation Architecture

## Purpose
Design RAG systems that retrieve trustworthy context and produce grounded answers with measurable retrieval and generation quality.

## When to use
Use when answers depend on private, changing, large, or domain-specific knowledge that should not be baked into model weights.

## Inputs
Knowledge sources, query patterns, freshness requirements, permissions, latency target, evaluation set, model and vector/search infrastructure.

## Preconditions
Confirm that retrieval is the right solution; deterministic database/API lookup may be simpler for structured facts.

## Context to inspect
Document formats, chunking, metadata, access controls, indexing pipeline, search quality, citations, query logs, current hallucination patterns.

## Core knowledge
RAG quality is bounded by ingestion, representation, retrieval, ranking, context construction, and generation. Vector similarity alone is rarely sufficient. Hybrid lexical/vector search, metadata filters, reranking, query rewriting, and source attribution may improve results. Retrieval permissions must be enforced before content reaches the model.

## Procedure
1. Define answerable questions and source-of-truth boundaries.
2. Normalize and clean source documents while preserving provenance.
3. Choose chunk boundaries based on semantic units and retrieval behavior.
4. Attach metadata for source, version, ACL, date, and domain filters.
5. Select embeddings and indexing strategy using representative data.
6. Implement lexical/vector/hybrid retrieval as justified by evaluations.
7. Add reranking when first-stage recall is good but precision is weak.
8. Build context with deduplication, ordering, token budgeting, and citations.
9. Instruct the model to distinguish retrieved evidence from unsupported inference.
10. Evaluate retrieval recall/precision separately from final answer quality.
11. Monitor stale indexes, permission drift, and retrieval failures in production.

## Decision points
Use hybrid search when exact identifiers and semantic concepts both matter. Use reranking when latency budget allows and candidate quality benefits. Prefer structured queries for strongly relational/filter-heavy data.

## Common failure patterns
Arbitrary chunk sizes, no metadata, retrieving unauthorized content, evaluating only final answers, context stuffing, stale indexes, duplicate chunks, and assuming embeddings solve exact-match queries.

## Verification
Measure retrieval metrics on labeled queries, inspect source coverage, test ACL isolation, verify citations, and run end-to-end groundedness evaluations.

## Expected output
A documented RAG pipeline with evidence for chunking, retrieval, ranking, context policy, and operational monitoring.

## Stop conditions
Stop when source authority is unclear, ACLs cannot be enforced, or the evaluation set does not represent real retrieval behavior.