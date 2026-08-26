# Distance Metrics and Normalization

## Purpose
Select and validate similarity metrics and vector normalization so ranking semantics match the embedding model.

## When to use
Use during schema/index design, model migration, or when rankings appear inconsistent.

## Inputs
Embedding model documentation, sample vectors, retrieval task, current metric, index configuration, and labeled queries.

## Context to inspect
Inspect embedding generation, normalization code, stored vector norms, database metric configuration, ANN index metric, and reranking stages.

## Core knowledge
Cosine similarity compares direction, dot product also reflects magnitude, and Euclidean distance measures geometric separation. For unit-normalized vectors, cosine/dot-product rankings can become closely related. Metric mismatch between model assumptions, index, and query path silently degrades recall.

## Procedure
1. Identify model-recommended similarity semantics.
2. Sample vector norms and detect whether vectors are normalized.
3. Verify indexing and query APIs use the same metric.
4. Create exact-search baselines for candidate metrics.
5. Compare ranking quality on labeled queries.
6. Measure normalization cost and numerical stability.
7. Confirm persisted and query vectors receive identical transformations.
8. Test zero/invalid vectors and dimensionality errors.
9. Document metric invariants for ingestion and serving.

## Decision points
Normalize when required by model/index semantics or when it simplifies cosine search; avoid unnecessary normalization when magnitude carries intended information. Change metrics only with re-evaluation and, where required, index rebuild.

## Common failure patterns
Normalizing only query vectors; treating distance as similarity; reversing sort order; mixing metrics across indexes; silently padding dimensions; comparing embeddings from different models; assuming all cosine APIs normalize internally.

## Verification
Check mathematical examples, exact-search rankings, ANN recall relative to the same metric, vector norm distributions, and end-to-end retrieval quality.

## Expected output
A validated metric/normalization policy with tests and migration implications.

## Stop conditions
Stop if model semantics cannot be established or a metric change requires an unapproved destructive rebuild.