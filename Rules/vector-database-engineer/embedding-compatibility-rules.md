# Embedding Compatibility

## Purpose
Prevent silent retrieval corruption when embedding models, dimensions, preprocessing, or versions change.

## Scope
Applies to embedding producers, vector schemas, model upgrades, backfills, and mixed-version datasets.

## MUST
- Every stored vector population MUST be traceable to embedding model identity/version, dimension, preprocessing contract, and generation date or lineage.
- Ingestion MUST reject vectors that violate the collection dimension or declared embedding contract.
- Model upgrades MUST include relevance comparison, migration strategy, backfill plan, and rollback criteria.
- Queries MUST use embeddings compatible with the indexed population unless cross-model compatibility is empirically proven.
- Partial migrations MUST explicitly isolate or route vector populations when score spaces are incompatible.

## MUST NOT
- MUST NOT mix embeddings from semantically incompatible models in one search space without validated compatibility.
- MUST NOT overwrite embedding lineage during re-embedding.
- MUST NOT assume equal dimensions imply compatible vector spaces.

## SHOULD
- Embedding contracts SHOULD be machine-readable and versioned.
- Re-embedding SHOULD be resumable, idempotent, observable, and rate-controlled.
- Canary evaluation SHOULD precede large-scale model migrations.

## Exceptions
Exceptions require evidence of compatibility, bounded blast radius, explicit risk ownership, verification, and approval for production migrations.

## Verification
Check schema validation, lineage metadata, model manifests, migration plans, relevance tests, backfill checkpoints, and query routing behavior.