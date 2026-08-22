# Skill: Migration Safety Engineering

## Purpose
Move production schema/data from current state to target state with bounded lock time, blast radius, and recovery risk.

## Trigger
DDL, backfill, data conversion, constraint introduction, partition change, column/type change, or large index operation.

## Inputs
Current/target schema, data size/growth, engine/version, traffic profile, lock semantics, replication, deploy sequence, maintenance constraints.

## Procedure
1. Classify operations as metadata-only, scan, rewrite, blocking validation, data movement, or destructive.
2. Identify application compatibility before/during/after each step.
3. Use expand-contract when old/new application versions may overlap.
4. Split large changes into bounded steps; backfill in chunks with checkpoint, throttle, and idempotent predicate.
5. Define timeout/lock guardrails and replication/storage thresholds.
6. Define preflight checks, observability, abort conditions, rollback or roll-forward.
7. Rehearse on representative data when risk is material.
8. Obtain required approvals; execute one state transition at a time.
9. Verify schema, data invariants, application health, workload, lag, and errors.

## Constraints
No destructive default. Never promise rollback when an operation is not actually reversible.

## Outputs
Ordered change plan, compatibility matrix, risk register, guards, evidence, recovery plan.

## Failure handling
Stop on ambiguous partial state; inspect actual schema/data/checkpoints before resuming. At most two bounded execution retries for proven transient failures.

## Stop condition
Target state and invariants are verified, obsolete compatibility artifacts are removed or scheduled with owner, and residual risk is accepted.