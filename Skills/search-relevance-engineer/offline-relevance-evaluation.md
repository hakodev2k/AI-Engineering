# Offline Relevance Evaluation

## Purpose
Evaluate search changes reproducibly before production using judged query sets, ranking metrics, segment analysis, and regression inspection.

## When to use
Use before changing analyzers, retrieval logic, rankers, embeddings, business rules, or search schemas.

## Inputs
Versioned judgments, baseline and candidate result sets, query segments, ranking metrics, experiment metadata.

## Context to inspect
Current benchmark set, metric definitions, candidate depth, tie handling, filtering logic, statistical methodology, and previous regressions.

## Core knowledge
No single metric captures search quality. NDCG measures graded ordering, MRR emphasizes first relevant result, Recall@K measures candidate coverage, and precision-oriented measures reflect top-result quality. Aggregate gains can hide critical segment losses.

## Procedure
1. Freeze benchmark and metric definitions for the comparison.
2. Generate deterministic baseline and candidate rankings.
3. Compute primary and secondary metrics.
4. Break results down by intent, query length, frequency, locale, and critical business segments.
5. Calculate per-query deltas.
6. Inspect largest wins and regressions manually.
7. Use bootstrap or paired statistical tests where sample size permits.
8. Check sensitivity to candidate depth and missing judgments.
9. Record configuration and model/index versions.
10. Gate rollout on explicit regression thresholds.

## Decision points
Choose metrics that match the user task rather than whichever improves most. Accept a global gain with segment loss only when the trade-off is explicit and approved.

## Common failure patterns
Metric shopping, comparing different query sets, ignoring unjudged documents, only reporting averages, and combining multiple simultaneous changes without attribution.

## Verification
Evaluation is verified when rerunning the same versions reproduces results and regression queries are explainable from score or feature evidence.

## Expected output
Reproducible evaluation report, segment metrics, per-query regression set, statistical evidence, and rollout recommendation.

## Stop conditions
Stop when benchmark versions differ, result generation is nondeterministic without explanation, or judgment coverage is too weak to support the conclusion.