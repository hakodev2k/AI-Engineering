# Embedding Model Rules

## Purpose
Control embedding-model selection and lifecycle so vector representations remain measurable, compatible, and safe to evolve.

## Scope
Applies to embedding models, tokenization, vector dimensionality, normalization, batching, versioning, and migrations.

## MUST
- Embedding-model selection MUST be supported by retrieval evaluation on representative domain queries.
- Every indexed vector MUST be attributable to an embedding model and version.
- Query and corpus embeddings MUST use compatible models and preprocessing unless a validated cross-model design exists.
- Model changes MUST include reindexing or compatibility strategy, rollback, cost estimate, and before/after quality evidence.
- Dimensionality, normalization, distance metric assumptions, and input limits MUST be explicit.
- Sensitive content sent to external embedding providers MUST comply with approved data-handling constraints.

## MUST NOT
- A production embedding model MUST NOT be replaced solely because a benchmark or vendor claims it is newer or better.
- Vectors produced by incompatible model versions MUST NOT be silently mixed in one retrieval population.
- Truncation MUST NOT silently remove semantically critical content.

## SHOULD
- Evaluate multilingual, domain-specific, long-context, and cost characteristics when relevant.
- Keep embedding inference reproducible enough to rebuild indexes.
- Monitor embedding latency, failures, token volume, and cost.

## Exceptions
Exceptions require documented evidence, compatibility analysis, risk, compensating controls, and approval for changes with production or data-governance impact.

## Verification
Review benchmark results, model/version metadata, index configuration, reindex tests, provider data policies, truncation metrics, and retrieval regressions.