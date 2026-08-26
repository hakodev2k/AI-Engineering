# Hybrid Retrieval and Fusion

## Purpose
Combine lexical, semantic, and optionally structured retrieval so complementary signals improve candidate recall.

## When to use
Use when no single retriever reliably handles both natural-language intent and exact terminology.

## Inputs
Outputs from candidate retrievers, relevance labels, score distributions, latency budget, query segments.

## Context to inspect
Inspect overlap between retrievers, unique relevant hits, rank distributions, filters, candidate counts, and failure slices.

## Core knowledge
Scores from heterogeneous retrievers are often incomparable. Rank-based fusion such as reciprocal rank fusion avoids naive score-scale assumptions. More candidates can increase reranking cost and noise.

## Procedure
1. Benchmark each retriever independently.
2. Measure complementary relevant hits and redundant noise.
3. Apply identical security and scope filters.
4. Select fusion method appropriate to score calibration.
5. Tune candidate depths on held-out queries.
6. Deduplicate equivalent passages using stable identities.
7. Feed fused candidates to reranking when justified.
8. Evaluate query segments, not just aggregate metrics.
9. Measure added latency and cost.
10. Define fallback when one retrieval backend fails.

## Decision points
Use rank fusion when scores are not calibrated. Weighted score fusion is appropriate only after validating normalization and stability. Query routing may outperform universal hybrid retrieval for strongly distinct query classes.

## Common failure patterns
Adding rankings directly; retrieving huge pools; inconsistent filters; duplicate chunks dominating results; tuning on test data.

## Verification
Compare recall, ranking, answer quality, latency, and backend-degradation tests against single-retriever baselines.

## Expected output
A hybrid strategy with quantified incremental value and bounded operational cost.

## Stop conditions
Stop when retriever outputs cannot enforce equivalent access-control semantics.