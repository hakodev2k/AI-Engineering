# Hybrid Search and Ranking

## Purpose
Combine lexical, semantic, metadata, and reranking signals to improve retrieval robustness across exact terms, paraphrases, rare entities, and ambiguous queries.

## When to use
Use when semantic-only or keyword-only retrieval produces systematic misses, or when enterprise queries contain both exact identifiers and conceptual language.

## Inputs
Query logs, corpus, lexical index, vector index, metadata, reranker options, relevance judgments, latency budget, and access constraints.

## Preconditions
At least two retrieval signals can be evaluated independently and merged without bypassing authorization filters.

## Context to inspect
Inspect BM25 scores, vector similarities, filter behavior, candidate overlap, reranker latency, failure queries, and relevance labels.

## Core knowledge
Hybrid retrieval improves coverage because lexical and semantic methods fail differently. Fusion must normalize incomparable scores or use rank-based methods. Rerankers improve precision but add cost and latency.

## Procedure
1. Segment queries by intent, exactness, entity density, and length.
2. Establish lexical and semantic baselines.
3. Retrieve bounded candidate sets from each channel.
4. Apply authorization and hard metadata constraints before unsafe content can surface.
5. Fuse candidates using calibrated score weighting or reciprocal-rank fusion.
6. Add reranking only where measurable quality gains justify latency.
7. Tune candidate counts and weights on held-out judgments.
8. Inspect tail failures and source diversity.
9. Add query-specific routing only when stable patterns justify complexity.
10. Version ranking configuration and monitor regressions.

## Decision points
Favor lexical signals for IDs, acronyms, names, and exact phrases; semantic signals for paraphrase and concept matching. Use reranking for difficult high-value queries, not automatically for every request.

## Common failure patterns
Adding raw scores directly, applying permissions after retrieval, oversized candidate sets, overfitting weights to a small test set, and hiding source-quality problems behind reranking.

## Verification
Compare recall, nDCG or MRR, latency, and access-control correctness against baselines across query segments.

## Expected output
A documented hybrid ranking pipeline with fusion rules, reranking policy, evaluation results, and operational limits.

## Stop conditions
Stop when authorization cannot be enforced before exposure, labeled data is too weak to choose a ranking strategy, or latency budgets make the proposed stack infeasible.