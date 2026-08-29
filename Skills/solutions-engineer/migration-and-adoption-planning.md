# Migration and Adoption Planning

## Purpose
Create a staged path from current state to target solution while controlling technical, operational, and organizational risk.

## When to use
Use for platform replacements, cloud migrations, architecture modernization, or phased product adoption.

## Inputs
Current and target architectures, dependencies, data, downtime tolerance, teams, milestones, rollback constraints.

## Context to inspect
Compatibility, data migration, integrations, identity, training, deployment pipelines, cutover windows, support, and legacy decommissioning.

## Core knowledge
Migration is a sequence of reversible risk reductions. Coexistence, data synchronization, rollback, and organizational readiness often dominate implementation difficulty.

## Procedure
1. Inventory dependencies and migration units.
2. Identify irreversible or high-risk transitions.
3. Define target-state prerequisites.
4. Choose phased, parallel, strangler, or cutover strategy.
5. Plan data movement and reconciliation.
6. Define rollback and decision checkpoints.
7. Address training, support, and operational handoff.
8. Define legacy retirement criteria.

## Decision points
Prefer incremental migration when coexistence is affordable and risk is high; use coordinated cutover when dual operation is infeasible and rollback is credible.

## Common failure patterns
Big-bang plans without rehearsal, missing rollback, prolonged dual-write inconsistency, undeclared dependencies, and no decommission plan.

## Verification
Each phase has entry/exit criteria, validation evidence, ownership, and a tested recovery path.

## Expected output
A staged migration plan with checkpoints and risk controls.

## Stop conditions
Stop when data integrity, rollback, or critical dependency risks cannot be bounded.