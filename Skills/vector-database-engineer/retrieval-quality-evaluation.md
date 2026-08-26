# Retrieval Quality Evaluation

## Purpose
Measure vector retrieval quality reproducibly so index, embedding, filtering, and ranking changes are evidence-driven.

## When to use
Use before tuning, migrations, releases, and when users report poor retrieval.

## Inputs
Representative queries, relevance judgments, corpus snapshot, retrieval configuration, and target metrics.

## Context to inspect
Inspect query segments, labeling method, corpus/version, exact-search baseline, production click/success signals, and previous evaluations.

## Core knowledge
Recall@k measures relevant-item coverage; Precision@k measures concentration; MRR rewards early first relevant results; NDCG handles graded relevance. ANN recall is distinct from task relevance. Evaluation must avoid leakage and include hard/rare cases.

## Procedure
1. Define retrieval task and what counts as relevance.
2. Sample production-shaped queries across meaningful segments.
3. Create or validate judgments with clear guidelines.
4. Freeze corpus and configuration identifiers.
5. Compute task metrics and ANN recall where applicable.
6. Compare against exact search and current production baseline.
7. Analyze failures by query class, filter selectivity, language, and corpus region.
8. Use held-out queries for tuning validation.
9. Record confidence/variance for noisy metrics.
10. Establish regression thresholds for CI/release gates.

## Decision points
Use graded metrics when relevance has levels; binary recall when missing any relevant result is costly. Supplement offline metrics with online experiments when user behavior is the true objective.

## Common failure patterns
Tiny handpicked query sets; tuning and testing on same labels; confusing ANN recall with relevance; aggregate metrics hiding segment failures; changing corpus between runs; unlabeled negatives treated as irrelevant.

## Verification
Reproduce results from stored configuration, manually inspect sampled wins/losses, and confirm statistical/segment conclusions are stable.

## Expected output
A versioned evaluation report and reusable regression suite.

## Stop conditions
Stop if judgments are materially unreliable, corpus versions differ unknowingly, or metric definitions do not match product objectives.