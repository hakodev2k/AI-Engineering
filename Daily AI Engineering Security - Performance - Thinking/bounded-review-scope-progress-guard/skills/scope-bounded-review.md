# Skill — Scope-Bounded Review

## Purpose
Convert broad review output into bounded engineering decisions without suppressing valid evidence or allowing reviewers to redefine scope.

## Trigger
Any executor/reviewer/orchestrator loop where review findings can create new implementation work.

## Inputs
Approved requirements, production assumptions, reviewed diff, test evidence, reviewer findings, progress ledger.

## Preconditions
The active objective and acceptance criteria are explicit enough to identify requirement IDs.

## Required context
Facts, requirements, assumptions, diff, test/evidence outputs. Hidden chain-of-thought is neither required nor requested.

## Allowed tools
Repository diff, test runner, issue/evidence lookup, `scripts/review_scope_gate.py`.

## Constraints
Do not downgrade safety findings merely because they are inconvenient. Legitimate out-of-scope risks are deferred and escalated, not deleted.

## Procedure
1. Freeze the approved requirement ledger for the current review cycle.
2. For each finding, capture requirement mapping, diff causality, reproduction under stated assumptions, and concrete evidence.
3. Run the deterministic scope gate.
4. Send only valid blockers to the executor.
5. Put deferred findings in a separate owner-review ledger.
6. Increment the production-progress counter only for accepted state-changing work.
7. After each cycle, apply the cycle budget and no-progress stop condition.
8. Request independent verification before completion when risk warrants it.

## Decision points
`block` means bounded rework; `defer` means no active-scope change; `stop` means no justified continuation; `escalate` means owner decision required.

## Expected output
Facts, Findings, Requirement mapping, Evidence, Decision, Deferred risks, Progress delta, Verification status.

## Metrics
Valid-blocker precision, review cycles/task, deferred-scope count, progress units/cycle, unsupported blocker count, rework volume.

## Verification
Compare final diff against original approved requirements and confirm every blocking rework item had evidence and requirement mapping.

## Failure handling
Maximum 2 rework cycles by default. On exhausted cycles, preserve evidence and escalate; never silently expand scope.

## Stop conditions
No measurable progress without a valid blocker; owner-required scope change; exhausted retry budget; contradictory requirements that cannot be resolved from evidence.
