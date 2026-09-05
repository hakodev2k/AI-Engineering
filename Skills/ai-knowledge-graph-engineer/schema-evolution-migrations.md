# Schema Evolution and Graph Migrations

## Purpose
Evolve graph schemas, ontologies, and stored data without breaking identifiers, queries, inference, ingestion, or downstream AI applications.

## When to use
Use when renaming concepts, splitting/merging entity types, changing edge semantics, adding constraints, migrating vocabularies, or changing graph technology representations.

## Inputs
Current and target schema, migration scope, query inventory, dependent services, graph volume, rollback requirements, compatibility window.

## Preconditions
A stable migration identifier, backups/snapshots, and dependency inventory exist.

## Context to inspect
Ontology versions, labels/classes, predicates, indexes, SHACL/constraints, ingestion mappings, APIs, RAG prompts, inference rules, exports.

## Core knowledge
Graph schema changes can have wide semantic blast radius because queries and reasoning depend on meaning, not just field names. Dual-read/dual-write, compatibility aliases, and phased backfills reduce risk.

## Procedure
1. Document semantic difference between current and target states.
2. Inventory affected queries, mappings, rules, and consumers.
3. Define forward and rollback transformations.
4. Add target schema and compatibility behavior first.
5. Backfill data idempotently in bounded batches.
6. Validate counts, constraints, and representative traversals.
7. Migrate writers before removing old structures.
8. Migrate readers and AI retrieval paths.
9. Observe a compatibility window.
10. Remove legacy schema only after usage reaches zero.

## Decision points
Use in-place migration for low-risk additive changes; use parallel schema/versioned predicates for semantic changes that need rollback or gradual consumer migration.

## Common failure patterns
Renaming without semantic mapping, breaking stored queries, destructive one-shot migrations, forgetting inferred/materialized facts, and removing old predicates before all consumers migrate.

## Verification
Run migration on representative data, validate old/new query equivalence where intended, verify rollback, and monitor legacy usage.

## Expected output
A phased migration plan, scripts/mappings, compatibility strategy, validation evidence, and deprecation checklist.

## Stop conditions
Escalate when migration changes canonical identity irreversibly, lacks rollback for critical data, or dependent consumers cannot be inventoried.