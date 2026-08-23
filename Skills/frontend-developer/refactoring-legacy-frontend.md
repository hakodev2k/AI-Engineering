# Refactoring Legacy Frontend

## Purpose
Improve legacy frontend structure incrementally while preserving behavior, reducing risk, and creating measurable seams for future change.

## When to use
Use for tightly coupled screens, outdated patterns, duplicated state, obsolete dependencies, weak tests, or gradual framework modernization.

## Inputs
Legacy code, production behavior, defect history, test coverage, dependency constraints, target architecture, and delivery roadmap.

## Context to inspect
Entry points, high-change modules, coupling, global state, side effects, build system, unsupported dependencies, tests, telemetry, and deployment rollback.

## Core knowledge
Large rewrites concentrate risk and delay feedback. Prefer characterization tests, seams, strangler-style replacement, and reversible steps. Refactoring success is reduced change cost without unintended behavior change.

## Procedure
1. Identify the business reason and highest-cost legacy constraint.
2. Capture current observable behavior with tests/telemetry.
3. Map dependencies and choose a narrow seam.
4. Separate behavior-preserving cleanup from feature changes.
5. Introduce adapters around unstable legacy boundaries.
6. Move one coherent responsibility toward the target design.
7. Keep old/new paths interoperable only as long as necessary.
8. Measure bundle, runtime, defect, and delivery impact.
9. Remove obsolete code after consumers migrate.
10. Repeat in bounded slices and update the migration plan.

## Decision points
Rewrite only when incremental seams are impractical and the organization can tolerate replacement risk. Upgrade dependencies/frameworks separately from behavior changes when separation improves diagnosis.

## Common failure patterns
Big-bang rewrites, no characterization tests, permanent compatibility layers, architecture cleanup without business value, changing behavior during refactoring, and leaving duplicate implementations indefinitely.

## Verification
Existing critical behavior remains intact, migrated boundaries have tests, old code is actually removed, production telemetry remains healthy, and the next change is simpler than before.

## Expected output
A staged legacy-modernization change with preserved behavior, reduced coupling, migration evidence, and rollback path.

## Stop conditions
Escalate when current behavior cannot be determined, migration requires unsupported platform changes, or rollback is impossible for a high-risk production path.