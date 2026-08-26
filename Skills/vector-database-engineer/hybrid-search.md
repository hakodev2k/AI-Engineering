# Hybrid Search

## Purpose
Combine lexical and vector retrieval to improve robustness across semantic, exact-term, identifier, and rare-token queries.

## When to use
Use when vector-only retrieval misses exact terminology or lexical-only retrieval misses semantic matches.

## Inputs
Query set, relevance judgments, lexical/vector retrievers, filters, ranking objectives, and latency budget.

## Context to inspect
Inspect tokenization, BM25/lexical settings, vector metric/index, score distributions, fusion logic, reranker, and query classes.

## Core knowledge
Lexical and vector scores are generally not directly comparable. Rank-based fusion such as reciprocal rank fusion avoids fragile score calibration; weighted score fusion can work when normalization is stable. Hybrid systems need evaluation by query segment, not only aggregate metrics.

## Procedure
1. Classify queries where each retriever succeeds/fails.
2. Establish independent lexical and vector baselines.
3. Choose a fusion method and candidate budgets.
4. Apply identical security filters to both paths.
5. Normalize scores only when mathematically justified.
6. Tune weights/rank constants on held-out judgments.
7. Evaluate identifiers, rare terms, long natural-language queries, and ambiguous queries separately.
8. Measure latency and resource amplification.
9. Add reranking only if incremental quality justifies cost.
10. Define fallbacks when one retriever is unavailable.

## Decision points
Prefer rank fusion when score scales are unstable. Prefer calibrated weighted fusion when score meaning is controlled and optimization data is sufficient. Avoid hybrid complexity if one retriever already meets requirements.

## Common failure patterns
Adding raw BM25 and cosine scores; unequal security filtering; tuning on test data; doubling candidate count without capacity planning; duplicate results; no deterministic tie handling; masking weak embeddings with arbitrary weights.

## Verification
Compare NDCG/Recall/MRR and latency against both single-retriever baselines on held-out data and production-shaped load.

## Expected output
A justified hybrid retrieval pipeline with fusion parameters, evaluation evidence, and fallback behavior.

## Stop conditions
Stop if relevance judgments are absent or retrieval paths apply inconsistent authorization.