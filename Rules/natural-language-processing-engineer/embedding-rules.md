# Embedding Rules

## Purpose
Keep embedding representations measurable, compatible, and safe for downstream semantic use.

## Scope
Embedding models, pooling, normalization, similarity, dimensionality, indexing, and upgrades.

## MUST
- Embedding model, pooling, normalization, dimensionality, and similarity function MUST be versioned as one contract.
- Retrieval or clustering quality MUST be evaluated on task-relevant data before model replacement.
- Indexes MUST be rebuilt or proven compatible when embedding semantics change.
- Thresholds MUST be calibrated against the deployed embedding version.

## MUST NOT
- MUST NOT compare vectors from incompatible embedding spaces as if similarity were meaningful.
- MUST NOT infer semantic equivalence from cosine similarity without task validation.
- MUST NOT roll out embedding changes without accounting for cached or persisted vectors.

## SHOULD
- Evaluation SHOULD include hard negatives, multilingual cases, domain terminology, and drift-sensitive slices.
- Approximate search settings SHOULD be measured for recall/latency trade-offs.

## Exceptions
Compatibility shortcuts require quantitative evidence, bounded duration, rollback, and approval.

## Verification
Check artifact IDs, index metadata, threshold calibration, retrieval metrics, hard-negative tests, vector-store migration status, and before/after latency and quality.