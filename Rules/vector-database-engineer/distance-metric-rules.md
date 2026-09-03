# Distance Metric

## Purpose
Protect semantic correctness by treating vector similarity semantics as a stable data and API contract.

## Scope
Applies to cosine, dot-product, Euclidean, normalization, score interpretation, and metric migrations.

## MUST
- The distance or similarity metric MUST match the embedding model's documented or validated semantics.
- Normalization requirements MUST be explicit and consistently enforced at ingestion and query time.
- Score direction, range, and threshold semantics MUST be documented for downstream consumers.
- Metric changes MUST be treated as compatibility changes and validated against representative relevance datasets.
- Thresholds MUST be recalibrated after any change that can alter score distributions.

## MUST NOT
- MUST NOT compare scores produced by incompatible metrics as if they were equivalent.
- MUST NOT silently change normalization or metric behavior for an existing collection.
- MUST NOT infer business confidence directly from similarity scores without calibration evidence.

## SHOULD
- Metric selection SHOULD be validated with task-level relevance measures.
- Stored metadata SHOULD identify the metric and normalization contract.
- Monitoring SHOULD detect unexpected score-distribution shifts.

## Exceptions
Any deviation requires a documented rationale, empirical evidence, consumer impact analysis, migration plan, and approval for breaking production changes.

## Verification
Inspect collection schemas, embedding documentation, ingestion/query code, calibration tests, relevance evaluations, score histograms, and migration diffs.