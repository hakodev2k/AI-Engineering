# Reranking Pipeline

## Purpose
Improve ordering of retrieved candidates using stronger relevance models while respecting latency and context limits.

## When to use
Use when candidate recall is adequate but relevant passages rank too low.

## Inputs
Candidate lists, relevance judgments, reranker model, token limits, latency/cost budget, query segments.

## Context to inspect
Inspect candidate recall, rank positions, passage lengths, duplicate rate, model truncation behavior, and current answer errors.

## Core knowledge
Reranking cannot recover documents absent from candidate retrieval. Cross-encoders or LLM rerankers can improve precision but add compute and may truncate long passages.

## Procedure
1. Confirm candidate recall before adding reranking.
2. Establish baseline ranking metrics.
3. Select reranker compatible with language/domain and latency.
4. Define candidate depth and passage representation.
5. Preserve metadata and stable IDs through reranking.
6. Evaluate relevance gains on held-out judgments.
7. Test long passages and truncation behavior.
8. Tune top-k passed to generation.
9. Load-test concurrency and tail latency.
10. Define timeout fallback to first-stage ranking.

## Decision points
Use lightweight rerankers for interactive latency; stronger models for high-value offline or latency-tolerant workflows. Increase candidate depth only while incremental recall justifies cost.

## Common failure patterns
Reranking low-recall candidates; passing headings separately from content; no timeout fallback; evaluating only top-1; hidden truncation.

## Verification
Measure NDCG/MRR or task-specific ranking metrics, answer quality, and p95/p99 latency with fallback tests.

## Expected output
A bounded reranking stage with demonstrated relevance gain.

## Stop conditions
Stop when candidate recall is the dominant failure; fix retrieval first.