# Hybrid Search

## Purpose
Ensure lexical, vector, filtering, and reranking signals are combined predictably and measurably.

## Scope
Applies to hybrid retrieval pipelines, score fusion, candidate generation, reranking, and fallback behavior.

## MUST
- Each retrieval stage MUST have an explicit purpose, candidate budget, timeout, and failure behavior.
- Score fusion or ranking logic MUST account for incompatible score scales through a documented normalization or rank-based method.
- Hybrid changes MUST be evaluated against vector-only and lexical-only baselines where those baselines are applicable.
- Filter semantics MUST remain consistent across retrieval branches.
- Degraded-mode behavior MUST be defined when one retrieval dependency fails.

## MUST NOT
- MUST NOT add ranking signals without measuring their effect on relevance and latency.
- MUST NOT combine raw heterogeneous scores under an assumption of comparability.
- MUST NOT silently drop mandatory authorization or tenancy filters during fallback.

## SHOULD
- Candidate generation and reranking budgets SHOULD be tuned jointly.
- Fusion parameters SHOULD be versioned and reproducible.
- Query classes SHOULD use differentiated retrieval strategies only when evidence supports the complexity.

## Exceptions
Exceptions require measured justification, documented operational risk, alternative considered, and verification.

## Verification
Review ranking code/configuration, relevance reports, latency traces, fallback tests, filter tests, score distributions, and production metrics.