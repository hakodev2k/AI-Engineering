# Legacy Modernization

## Purpose
Modernize legacy software incrementally while preserving business behavior, controlling migration risk, and improving architecture where evidence supports change.

## When to use
Use when a legacy system blocks delivery, is difficult to operate, depends on obsolete technology, or requires structural change without a full rewrite.

## Inputs
Repository, architecture diagrams, change history, incidents, dependencies, business-critical flows, test coverage, deployment constraints.

## Context to inspect
High-change modules, unsupported dependencies, data ownership, hidden integrations, runtime constraints, operational pain, regression history, and business deadlines.

## Core knowledge
Rewrites carry discovery and migration risk. Safer modernization often uses characterization tests, seams, adapters, strangler patterns, incremental extraction, and explicit migration checkpoints.

## Procedure
1. Identify concrete business and technical drivers.
2. Map critical workflows and hidden dependencies.
3. Establish behavioral baselines and characterization tests.
4. Rank modernization targets by risk, value, and coupling.
5. Create seams around unstable or replaceable areas.
6. Refactor or replace one bounded capability at a time.
7. Keep old and new paths observable during transition.
8. Define data migration and rollback strategies.
9. Remove legacy paths only after verified cutover.
10. Reassess architecture after each increment.

## Decision points
Refactor when behavior is valuable and structure is recoverable; replace when technology or architecture blocks required outcomes; rewrite only when incremental migration is demonstrably worse.

## Common failure patterns
Big-bang rewrites, undocumented behavior loss, migrating code without architecture improvement, premature service extraction, deleting rollback paths too early, and underestimating data migration.

## Verification
Critical workflows pass regression tests, production telemetry confirms behavior, migration can be rolled back or recovered, and targeted maintainability/operability metrics improve.

## Expected output
A staged modernization plan and implementation path with measurable value, bounded risk, and verified compatibility.

## Stop conditions
Stop when critical behavior cannot be characterized, destructive migration lacks approval, or rollback/recovery is impossible for a high-risk change.