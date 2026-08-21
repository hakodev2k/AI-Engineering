# Workflow: Production Database Change

## Trigger / Goal
Any material production schema, index, configuration, backfill, or data-structure change; reach target state safely.

## Inputs
Validated change contract, current state, workload, migration artifacts, maintenance constraints.

## Preconditions
Owner, reviewer, affected objects, risk, compatibility, observability, recovery strategy, and approval requirements are explicit.

## Stages
1. Intake and risk classification.
2. Parallel read-only evidence: workload analysis and current-state verification when independent.
3. Migration Planner creates ordered transitions.
4. Primary agent consolidates plan and resolves dependencies.
5. Reviewer checks lock/rewrite/capacity/concurrency/recovery risks.
6. Human approval for governed actions.
7. Execute bounded step; checkpoint shared change record.
8. Verify immediately; stop on abort threshold.
9. Continue sequential dependent steps.
10. Independent final verification and handoff.

## Checkpoints
Before first write, after each irreversible boundary, after backfill, before contract cleanup, and at completion.

## Retry
At most two retries only for a proven transient failure and only after actual state is re-read. Never blindly retry ambiguous writes.

## Failure / Escalation
Freeze progression, preserve state/evidence, choose rollback or roll-forward based on observed state; escalate uncertain data loss or approval issue.

## Definition of done
Target schema/data, invariants, app health, workload, replication/storage health, review, evidence, and residual risk are recorded.