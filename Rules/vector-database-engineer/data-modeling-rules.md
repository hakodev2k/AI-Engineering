# Vector Data Modeling

## Purpose
Define durable collection, vector, identifier, metadata, and ownership contracts.

## Scope
Applies to collection design, schemas, IDs, vector fields, metadata, partitioning, and lifecycle attributes.

## MUST
- Every collection MUST define ownership, identifier semantics, vector fields, dimensions, metrics, metadata types, and retention expectations.
- Stable entity identifiers MUST survive reindexing and re-embedding unless an explicit migration requires otherwise.
- Data models MUST distinguish source-of-truth attributes from derived retrieval artifacts.
- Required fields and nullability MUST be validated at ingestion boundaries.
- Schema evolution MUST preserve compatibility or provide a documented migration path.

## MUST NOT
- MUST NOT use opaque dynamic metadata as a substitute for critical schema contracts without validation.
- MUST NOT encode security boundaries solely in naming conventions.
- MUST NOT delete source lineage needed to reconstruct derived vectors.

## SHOULD
- Models SHOULD support deterministic rebuilds from authoritative source data.
- Frequently filtered attributes SHOULD use stable, typed representations.
- Derived fields SHOULD carry version or lineage metadata when their semantics can change.

## Exceptions
Exceptions require documented constraints, compatibility impact, risks, alternatives, and verification.

## Verification
Inspect schemas, validators, sample records, lineage mappings, migration tests, rebuild procedures, and consumer contracts.