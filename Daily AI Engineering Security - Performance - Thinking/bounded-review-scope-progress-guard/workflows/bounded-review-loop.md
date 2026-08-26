# Workflow — Bounded Review Loop

## Trigger
Implementation reaches a review checkpoint.

## Goal
Resolve evidenced in-scope defects without allowing review to become an unbounded requirement-generation loop.

## Inputs
Approved requirements, deployment assumptions, diff, test results, reviewer findings, progress ledger.

## Baseline
Record current accepted implementation state, open approved requirements, review cycle number, and production-progress units.

## Stages
1. **Observe:** collect reviewer findings without changing scope.
2. **Measure baseline:** freeze requirement IDs and current progress units.
3. **Diagnose:** classify each finding by requirement mapping, diff causality, reproducibility and evidence.
4. **Form hypothesis:** identify which defect in the current diff explains each valid blocker.
5. **Implement improvement:** executor addresses only valid blockers.
6. **Measure again:** update passing tests/accepted artifacts and progress units.
7. **Improved?** If no, retry once within the configured budget; if yes, independently verify.

## Responsible agent
Coordinator manages state; executor performs bounded rework; Independent Scope Reviewer verifies.

## Tools
Diff inspection, test runner, `scripts/review_scope_gate.py`.

## Outputs
Classified findings, deferred-risk ledger, before/after progress, verification decision.

## Checkpoints
Before rework authorization; after rework; before final completion.

## Metrics
Review cycles, progress units/cycle, blocker precision, deferred findings, rework size, unsupported blocker count.

## Retry policy
Default maximum 2 review cycles.

## Stop conditions
Cycle budget exhausted; no measurable progress with no valid blocker; scope change requires owner approval; evidence is contradictory.

## Failure path
Preserve findings and evidence, mark unresolved blocker, escalate to owner rather than widening the task.

## Verification
Final reviewer must compare the resulting diff against the original approved requirement ledger.

## Definition of Done
All approved requirements satisfied; no valid blocker remains; out-of-scope findings are deferred; progress measured; independent verification complete.
