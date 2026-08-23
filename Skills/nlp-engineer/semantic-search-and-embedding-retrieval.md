# Semantic Search and Embedding Retrieval

## Purpose
Design embedding-based retrieval that returns relevant, diverse, permission-safe text under production latency and scale constraints.

## When to use
Use for semantic search, retrieval augmentation, recommendation over text, duplicate detection, or nearest-neighbor matching.

## Inputs
Corpus, queries, relevance judgments, metadata, ACLs, latency/scale targets, embedding candidates.

## Preconditions
A representative query set and relevance criteria exist.

## Context to inspect
Corpus size, chunking, language mix, metadata, access rules, lexical baseline, query distribution, update frequency.

## Core knowledge
Retrieval quality depends on representation, chunking, index configuration, negative examples, filtering, and evaluation—not only embedding model choice.

## Procedure
1. Define query and relevance units.
2. Build lexical baseline.
3. Create representative judged query set.
4. Select embedding model and similarity metric.
5. Design chunk boundaries and metadata.
6. Build ANN index with ACL filtering.
7. Measure recall@k, MRR/nDCG where appropriate, latency, and slice quality.
8. Inspect hard negatives and near-duplicate results.
9. Add hybrid retrieval or reranking if evidence supports it.
10. Validate incremental indexing and deletion behavior.

## Decision points
Use hybrid lexical+semantic retrieval when exact terms, identifiers, or rare names matter. Add reranking when candidate recall is good but top ordering is weak.

## Common failure patterns
No judged benchmark, embedding documents at arbitrary chunk sizes, filtering after retrieval and leaking inaccessible items, stale vectors, and optimizing index speed while recall collapses.

## Verification
Offline retrieval metrics, ACL tests, update/delete tests, and production-like latency tests pass.

## Expected output
Retrieval pipeline, index configuration, benchmark, filtering contract, and quality/latency report.

## Stop conditions
Stop when relevance cannot be defined, ACL enforcement is uncertain, or corpus/query mismatch prevents meaningful evaluation.