# Delivery Planning and Decomposition

## Purpose
Decompose complex engineering work into independently valuable, testable, low-risk increments.

## When to use
Use for epics, migrations, refactors, platform work, and features spanning multiple systems.

## Inputs
Technical scope, dependencies, risks, acceptance criteria, team capacity, release constraints.

## Context to inspect
Inspect deployment boundaries, ownership, dependency lead times, testing environments, feature flags, and rollback capabilities.

## Core knowledge
Good decomposition reduces batch size and uncertainty while preserving end-to-end learning. Plans should expose dependencies rather than hide them inside large tasks.

## Procedure
1. Define the end state and success evidence.
2. Map dependencies and irreversible steps.
3. Identify vertical slices that can be verified independently.
4. Separate discovery from known implementation.
5. Sequence risk-reduction work early.
6. Define integration checkpoints.
7. Add rollout, migration, observability, and rollback work.
8. Assign clear ownership.
9. Estimate ranges based on uncertainty.
10. Update the plan as evidence changes.

## Decision points
Prefer vertical slices over layer-by-layer completion. Use parallel work only when coordination cost and merge risk remain controlled.

## Common failure patterns
Huge tasks, hidden migration work, estimates without uncertainty, late integration, and treating deployment as outside implementation.

## Verification
Each increment has a demonstrable outcome, dependencies are explicit, and the plan includes validation and rollback.

## Expected output
A sequenced delivery plan with slices, dependencies, risks, owners, and evidence gates.

## Stop conditions
Stop when dependencies or critical requirements are unresolved enough to make sequencing misleading.