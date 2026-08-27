# Workflow: Observe → Converge

## Trigger
Finite long-running engineering task with multiple implementation and review cycles.

## Goal
Reduce a stable acceptance ledger to zero remaining criteria without task multiplication.

## Inputs
Criteria, repository state, tests, policy.

## Baseline
Record initial criterion count, branch or commit state, open diffs, and expected verification gates.

## Stages
1. Observe current artifacts and criterion statuses.
2. Measure remaining criteria and progress events.
3. Diagnose the smallest failed criterion.
4. Form one explicit, testable hypothesis for that failure.
5. Implement the smallest change that closes it.
6. Measure again and update evidence.
7. Run `scripts/convergence_guard.py`.
8. If improved, continue; otherwise re-evaluate within bounded retries.
9. Independent reviewer verifies terminal state.

## Responsible agent
Implementer for stages 3–6; Convergence Reviewer for stage 9.

## Tools
Repository inspection, targeted tests, guard script.

## Outputs
Updated ledger, artifacts, guard decision, verification evidence.

## Checkpoints
Before new work; after every test; before completion or snapshot.

## Metrics
Remaining criteria, cycle count, no-progress cycles, new-work count, rework rate.

## Retry policy
Maximum 2 corrections for the same failed criterion unless a human explicitly extends scope.

## Stop conditions
Guard stop, safety boundary, exhausted retries, or no remaining criteria.

## Failure path
Run `failure-recovery.md`.

## Verification
Independent review of ledger and artifacts.

## Definition of Done
All non-waived criteria passed with evidence, guard says `complete`, and independent review passes.
