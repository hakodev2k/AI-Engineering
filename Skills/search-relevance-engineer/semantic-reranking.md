# Semantic Reranking

## Purpose
Apply cross-encoder, LLM, or other expensive semantic models to reorder a bounded candidate set while preserving latency, determinism, and safe fallback behavior.

## When to use
Use when first-stage retrieval has adequate recall but top-result ordering remains semantically weak.

## Inputs
Candidate documents, judged queries, reranking model, candidate depth, latency budget, hardware/runtime constraints.

## Context to inspect
Current candidate generator, document text passed to the model, truncation rules, batching, model version, score handling, caching, and fallback path.

## Core knowledge
Rerankers improve precision only when relevant candidates are already retrieved. Candidate depth, text truncation, batching, and model-domain fit strongly affect value. Expensive models must be isolated from availability-critical retrieval.

## Procedure
1. Confirm first-stage Recall@K is sufficient.
2. Benchmark candidate reranking depths.
3. Define query-document representation and truncation policy.
4. Evaluate candidate models on judged data.
5. Measure batch size and hardware latency.
6. Preserve first-stage scores and provenance.
7. Define timeout and fallback behavior.
8. Add model/version telemetry.
9. Run shadow or canary evaluation.
10. Compare gains by query segment and tail latency.

## Decision points
Use cross-encoders when pairwise semantic precision justifies cost; simpler rankers when latency is strict. Apply reranking selectively to intents where measured gain is material.

## Common failure patterns
Reranking too many candidates, passing irrelevant long text, no timeout, assuming the model can recover missing candidates, score mixing without calibration, and silent model upgrades.

## Verification
Measure NDCG/MRR, p95/p99 latency, timeout rate, fallback quality, and model-version consistency against baseline.

## Expected output
Reranking contract, candidate depth, model version, latency/quality evidence, timeout and fallback policy.

## Stop conditions
Stop when first-stage recall is inadequate, model latency violates SLOs, or evaluation cannot show robust ranking gain.