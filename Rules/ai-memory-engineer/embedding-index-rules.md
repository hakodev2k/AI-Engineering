# Embedding and Index Rules

## Purpose
Keep semantic indexes reproducible, compatible, and safe across embedding or retrieval changes.

## Scope
Embedding models, chunking, dimensions, normalization, vector indexes, metadata filters, and rebuilds.

## MUST
- Persisted embeddings MUST record the embedding model or immutable version used to create them.
- Index configuration changes MUST be benchmarked on representative retrieval tasks before promotion.
- Metadata required for authorization, validity, or deletion MUST remain queryable after indexing.
- Re-embedding jobs MUST define coexistence, cutover, and rollback behavior.

## MUST NOT
- MUST NOT mix incompatible embedding spaces in one retrieval index without an explicit bridging strategy.
- MUST NOT drop authorization metadata to improve index performance.
- MUST NOT claim recall improvement without measured evaluation.

## SHOULD
- Prefer deterministic chunking and preprocessing.
- Rebuild indexes in isolated versions before traffic cutover.

## Exceptions
Exceptions require compatibility evidence, bounded risk, and approval.

## Verification
Review index manifests, embedding versions, retrieval benchmarks, metadata-filter tests, and cutover evidence.