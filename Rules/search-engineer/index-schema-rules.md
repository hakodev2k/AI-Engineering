# Index Schema

## Purpose
Keep indexed representations correct, evolvable, and compatible with retrieval requirements.

## Scope
Field mappings, analyzers, stored fields, doc values, vectors, metadata, and schema evolution.

## MUST
- Define each indexed field's semantics, type, analyzer, cardinality expectations, and query use.
- Treat incompatible analyzer, type, or vector-dimension changes as migrations requiring a new index or proven safe strategy.
- Validate mappings before production ingestion.
- Preserve source-of-truth identifiers needed for reconciliation.

## MUST NOT
- Mutate incompatible production mappings in place when rollback is not reliable.
- Index sensitive fields merely because they may be useful later.
- Enable expensive field capabilities globally without measured need.

## SHOULD
- Minimize indexed and stored data to what retrieval, ranking, filtering, or diagnostics require.
- Keep schema definitions version-controlled.

## Exceptions
Exceptions require storage/performance impact, compatibility analysis, rollback, and approval.

## Verification
Inspect mappings, schema diffs, representative documents, migration tests, and index-size/query-cost measurements.