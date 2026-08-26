# Skill: Reviewer Scope Analysis

## Purpose
Convert reviewer output into explicit, evidence-backed scope decisions without exposing hidden reasoning.

## Trigger
Any independent review finding that could cause code changes, new tests, a plan revision, or task completion to remain blocked.

## Inputs
Approved goal, acceptance criteria, non-goals, production assumptions, reviewed diff, reviewer finding, reproduction evidence.

## Preconditions
The acceptance contract is frozen for the current task slice. Scope changes require owner approval.

## Required context
Only the approved contract, changed diff, relevant tests, declared assumptions, and reviewer evidence.

## Allowed tools
Read-only repository inspection, test runner, diff tools, `scripts/review_scope_gate.py`.

## Constraints
Reviewer severity is not authorization. Do not add requirements that are absent from the approved contract. Do not request hidden chain-of-thought.

## Procedure
1. Record the finding as Facts, Evidence, Assumptions, Criterion mapping, Reproduction status, and Acceptance impact.
2. Verify the cited behavior exists in or is directly caused by the reviewed diff.
3. Reproduce under declared production assumptions.
4. Map the failure to exactly one approved criterion or mark it unmapped.
5. Run the deterministic gate.
6. Accept blockers only when all four gate conditions pass.
7. Defer unmapped findings; request explicit scope-owner approval before they alter the plan.

## Decision points
- `accept_blocker`: remediate within current task.
- `defer`: preserve finding but do not modify active scope.
- `invalid`: return to reviewer for missing evidence.

## Expected output
A structured finding decision containing criterion ID, evidence, reproduction result, decision, risks, and verification status.

## Metrics
Accepted-blocker ratio, deferred-finding count, review rounds, scope changes requiring approval, original acceptance-test progress.

## Verification
A separate scope arbiter re-runs the gate and checks the cited diff/test evidence.

## Failure handling
Maximum two evidence-collection attempts per finding. If reproduction remains ambiguous, defer and escalate rather than expanding scope.

## Stop conditions
Stop when the finding is deterministically accepted/deferred, retries are exhausted, or a requested scope change reaches the owner.
