# Schema Change Coordination During Migration

## Purpose
Prevent schema drift from invalidating baseline copies, CDC, application compatibility, or reconciliation during a live migration.

## When to use
Use whenever source development continues while migration preparation or synchronization is active.

## Inputs
Release calendar, migration strategy, CDC capabilities, schema deployment process, application compatibility policy, and source/target DDL.

## Core knowledge
DDL changes can break replication mappings, invalidate transformations, alter defaults, or make old/new application versions incompatible. Freezing everything is not always practical; controlled dual application may be safer.

## Procedure
1. Define which schema changes are safe, coordinated, or prohibited during each migration phase.
2. Route proposed DDL through migration impact review.
3. Test DDL against CDC/replication behavior.
4. Apply compatible changes to source and target in an explicit order.
5. Preserve expand/contract compatibility for mixed application versions.
6. Update transformation and reconciliation rules.
7. Rehearse material schema changes.
8. Detect unauthorized drift using metadata comparison.
9. Freeze high-risk DDL before final cutover.
10. Record final schema versions at the consistency point.

## Decision points
Use expand/contract when rolling application deployment must coexist; use a short freeze when synchronization tooling cannot safely evolve schema.

## Common failure patterns
Unannounced DDL, target-only manual changes, dropping columns before old consumers retire, and CDC silently excluding new columns.

## Verification
Source and target schemas match the approved mapping and replication tests cover the current schema version.

## Expected output
A controlled schema-change policy with traceable version alignment.

## Stop conditions
Stop migration progression when unauthorized drift or unsupported DDL has occurred until consistency is restored.