# Schema Evolution and Migrations

## Purpose
Evolve graph schemas, ontologies, labels, relationships, constraints, and identifiers without breaking consumers or corrupting historical meaning.

## When to use
Use when renaming concepts, splitting or merging types, changing relationship semantics, introducing constraints, or migrating identifiers.

## Inputs
Current and target schema, migration requirements, data volume, consumer inventory, query contracts, rollback constraints, and compatibility window.

## Preconditions
Know which consumers depend on current semantics and whether dual-read/dual-write is feasible.

## Context to inspect
Existing data distributions, legacy labels/types, indexes, constraints, ontology versions, downstream queries, caches, and ingestion mappings.

## Core knowledge
Graph schema changes can have semantic as well as structural impact. Backward-compatible expansion is safer than in-place reinterpretation. Identifier changes are especially risky because edges, embeddings, caches, and external references may depend on them.

## Procedure
1. Define old and new semantics precisely.
2. Classify the change as additive, compatible, or breaking.
3. Inventory affected writers, readers, validations, and derived artifacts.
4. Design migration and rollback paths.
5. Introduce new structures before removing old ones when possible.
6. Backfill in restartable batches.
7. Validate counts, identities, edges, and invariants after each phase.
8. Support dual-read or compatibility mapping during transition.
9. Migrate indexes and constraints deliberately.
10. Update ingestion and query contracts.
11. Remove legacy structures only after usage evidence reaches zero.
12. Record semantic version and migration history.

## Decision points
Use lazy migration when access is sparse and compatibility can remain; eager migration when consistency or performance requires a uniform graph. Avoid identifier replacement unless benefits justify broad referential risk.

## Common failure patterns
Renaming labels without consumer audit; changing meaning under the same identifier; non-idempotent backfills; removing old edges too early; and no rollback evidence.

## Verification
Run pre/post invariant checks, consumer contract tests, sample semantic comparisons, migration replay, and rollback rehearsal.

## Expected output
A phased migration plan, compatibility strategy, validated scripts/jobs, rollback procedure, and completion evidence.

## Stop conditions
Stop when consumer ownership is unknown, migration is destructive without backup/rollback, or semantic compatibility cannot be established.