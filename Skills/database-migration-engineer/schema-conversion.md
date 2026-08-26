# Schema Conversion

## Purpose
Convert database structure to the target platform while preserving data meaning, integrity, operability, and maintainability.

## When to use
Use when target DDL differs from source or when migration is an opportunity to remove source-specific constructs.

## Inputs
Source DDL, target platform constraints, compatibility assessment, data profiles, application contracts, and naming standards.

## Core knowledge
Schema conversion includes tables, constraints, indexes, sequences, generated columns, views, routines, triggers, partitions, privileges, and metadata. Mechanical conversion can preserve technical debt or introduce semantic drift.

## Procedure
1. Capture source schema from authoritative metadata.
2. Map types with explicit precision, scale, length, timezone, and encoding rules.
3. Convert keys, constraints, defaults, and generated values.
4. Rework indexes for target access patterns rather than blindly cloning them.
5. Convert partitions, views, routines, and triggers.
6. Preserve comments and ownership metadata where useful.
7. Produce deterministic, version-controlled DDL.
8. Apply to a clean target repeatedly to prove idempotent deployment workflow.
9. Run structural and semantic validation.
10. Review with application owners.

## Decision points
Preserve schema shape when minimizing application change is the dominant constraint; redesign only when benefits justify added migration and regression risk.

## Common failure patterns
Implicit type narrowing, missing defaults, invalid index assumptions, changed identifier casing, disabled constraints left disabled, and manual target drift.

## Verification
Compare object inventories, constraints, type semantics, generated values, and representative application operations.

## Expected output
Reviewed target DDL plus a traceable source-to-target mapping.

## Stop conditions
Stop on lossy mappings, unresolved generated-value semantics, or structural changes lacking consumer impact analysis.