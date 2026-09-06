# Provenance and Lineage Rules

## Purpose
Keep persistent memory traceable to its source, transformations, and downstream use.

## Scope
Sources, extractors, summarizers, embeddings, merges, migrations, and consumers.

## MUST
- Persisted memories MUST retain enough provenance to identify origin and transformation path.
- Derived memories MUST distinguish original evidence from generated summaries or inferences.
- Lineage MUST survive schema migrations and re-embedding where auditability is required.
- High-impact decisions using memory MUST be traceable to the records retrieved.

## MUST NOT
- MUST NOT strip provenance merely to reduce payload size when it is required for verification.
- MUST NOT present transformed content as verbatim source evidence.
- MUST NOT fabricate missing source metadata.

## SHOULD
- Use immutable source identifiers where practical.
- Record model or transformation version for generated memory artifacts.

## Exceptions
Exceptions require documented limits and an alternative verification mechanism.

## Verification
Inspect lineage metadata, transformation logs, retrieval traces, migration tests, and audit samples.