# Metric Learning and Visual Retrieval

## Purpose
Build embedding and retrieval systems that rank visually or semantically relevant items with measurable, stable behavior across changing catalogs and domains.

## When to use
Use for similarity search, deduplication, visual product search, identity matching, clustering, or retrieval stages feeding downstream models.

## Inputs
Query/gallery data, relevance or pair labels, candidate corpus size, latency target, embedding model, hard negatives, and index constraints.

## Preconditions
Relevance semantics are defined and evaluation queries represent production intent.

## Context to inspect
Inspect label granularity, near-duplicates, class identity leakage, candidate growth, embedding dimension, normalization, approximate-nearest-neighbor index, and privacy implications.

## Core knowledge
Contrastive/triplet-style objectives, classification-derived embeddings, hard-negative mining, normalization, ANN recall, reranking, and index freshness jointly determine retrieval quality. Offline pair accuracy is insufficient.

## Procedure
1. Define what constitutes relevant, near-relevant, and incorrect retrieval.
2. Build representative query and gallery splits without identity leakage.
3. Establish pretrained embedding and lexical/metadata baselines where applicable.
4. Select embedding dimension and similarity function.
5. Design positive and hard-negative sampling.
6. Train or fine-tune while monitoring collapse and class shortcuts.
7. Evaluate Recall@K, precision, ranking metrics, and critical slices.
8. Benchmark exact search before selecting ANN parameters.
9. Measure index recall, memory, build time, and query latency.
10. Test new-item insertion and index refresh behavior.
11. Inspect nearest neighbors for recurring semantic errors.
12. Version embedding model and index compatibility together.

## Decision points
Use reranking when first-stage retrieval is fast but ambiguous. Prefer metadata filters when they encode hard business constraints. Increase embedding size only when quality gains justify index cost.

## Common failure patterns
Random splits leaking identities, easy negatives inflating results, stale embeddings after model changes, ANN parameters hiding model quality, and similarity thresholds copied across domains.

## Verification
Verify retrieval metrics on held-out identities/slices, exact-versus-ANN recall, target latency, index refresh correctness, and model-index version compatibility.

## Expected output
A validated embedding/retrieval pipeline with index settings, thresholds, evaluation evidence, and operational update procedure.

## Stop conditions
Stop if relevance cannot be defined consistently, identity/privacy use is unauthorized, or candidate/index constraints make required recall infeasible.