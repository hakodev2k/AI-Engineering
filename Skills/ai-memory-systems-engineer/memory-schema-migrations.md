# Memory Schema Migrations

## Purpose
Evolve memory schemas, embeddings, metadata, and indexes without corrupting historical data or interrupting retrieval.

## When to use
Use when adding fields, changing memory types, replacing embedding models, restructuring provenance, or migrating stores.

## Inputs
Current and target schemas, stored data volume, migration tooling, compatibility requirements, rollback constraints, index versions.

## Preconditions
Have backups or a proven rollback path and define compatibility between old and new readers/writers.

## Context to inspect
Schema versions, serializers, extraction logic, retrieval filters, derived indexes, caches, backfills, and deployment order.

## Core knowledge
Memory migrations affect authoritative data and derived representations. Safe changes often require dual-read, dual-write, versioned records, or staged backfills rather than one destructive cutover.

## Procedure
1. Document current and target contracts.
2. Classify changes as additive, transformational, or destructive.
3. Define backward/forward compatibility.
4. Version writers and readers explicitly.
5. Build an idempotent migration/backfill.
6. Validate on a representative subset.
7. Migrate derived indexes separately from source-of-truth data.
8. Deploy readers/writers in safe order.
9. Monitor correctness and lag during rollout.
10. Remove compatibility paths only after rollback windows close.

## Decision points
Prefer additive migrations and lazy conversion for large low-risk datasets. Use controlled offline migration when semantic transformations require complete consistency before serving.

## Common failure patterns
Changing embedding model without versioning; destructive field replacement; non-idempotent backfills; mixed readers interpreting values differently.

## Verification
Compare old and new retrieval behavior, validate record counts and invariants, and demonstrate rollback or rebuild procedures.

## Expected output
A staged migration plan with compatibility, validation, monitoring, and rollback evidence.

## Stop conditions
Stop when destructive migration lacks approved recovery or semantic mapping is ambiguous.