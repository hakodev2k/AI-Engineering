# Embedding Rules

## Purpose
Ensure embedding choices are measurable, reproducible, and compatible with retrieval requirements.

## Scope
Embedding models, dimensions, normalization, batching, versioning, and migration.

## MUST
- Embedding model and preprocessing version MUST be recorded with indexed vectors.
- Model changes MUST be evaluated on representative retrieval datasets before migration.
- Query and document embeddings MUST use compatible transformations.
- Dimension or normalization changes MUST have an explicit reindexing strategy.

## MUST NOT
- MUST NOT mix incompatible embedding spaces in one index without a defined routing boundary.
- MUST NOT claim embedding quality improvement without comparative retrieval evidence.
- MUST NOT send restricted content to an embedding provider without approved data handling.

## SHOULD
- Compare quality, latency, cost, multilingual support, and domain fit.
- Batch embedding work within provider and infrastructure limits.

## Exceptions
Partial migrations require explicit version routing and rollback.

## Verification
Inspect model metadata, offline evaluations, index versions, migration tests, and provider security configuration.