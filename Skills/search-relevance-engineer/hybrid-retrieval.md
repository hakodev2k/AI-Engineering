# Hybrid Retrieval

## Purpose
Combine lexical and semantic retrieval so exactness and conceptual recall reinforce each other without producing unstable or opaque candidate sets.

## When to use
Use when neither keyword nor vector retrieval alone covers the query distribution adequately.

## Inputs
Lexical and vector candidate sets, judged queries, score distributions, query segments, latency budget, fusion capabilities.

## Context to inspect
Candidate depths, normalization methods, reciprocal-rank fusion, weighted score fusion, duplicate handling, filters, and downstream rerankers.

## Core knowledge
Lexical and vector scores are usually not directly comparable. Rank-based fusion is robust when calibration is weak; score fusion can be stronger when distributions are stable and calibrated. Candidate diversity matters before reranking.

## Procedure
1. Measure lexical-only and vector-only strengths by query segment.
2. Set candidate depths independently.
3. Deduplicate by stable document identity.
4. Start with a robust rank-based fusion baseline.
5. Evaluate weighted fusion only with calibrated evidence.
6. Preserve provenance signals for downstream ranking.
7. Tune fusion by segment rather than only globally when justified.
8. Test filters consistently across both retrieval paths.
9. Measure incremental recall and latency.
10. Validate fallback behavior when one retriever is unavailable.

## Decision points
Choose reciprocal-rank fusion when component scores differ in scale or drift; score fusion when calibration is controlled. Use conditional routing when some intents clearly require only one retriever.

## Common failure patterns
Adding scores with arbitrary weights, double-counting duplicated results, unequal filter semantics, excessive candidate depth, and hiding which retriever contributed a result.

## Verification
Compare Recall@K, NDCG, latency, candidate overlap, and failure behavior to both single-retriever baselines.

## Expected output
Fusion design, candidate depths, provenance fields, evaluation evidence, latency impact, and fallback strategy.

## Stop conditions
Stop when retriever outputs cannot be deduplicated reliably, filters differ semantically, or latency cost exceeds the allowed budget without measurable relevance gain.