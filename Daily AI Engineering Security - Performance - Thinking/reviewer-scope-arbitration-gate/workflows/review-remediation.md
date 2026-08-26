# Workflow: Review, Arbitrate, Remediate, Verify

## Trigger
Implementation reaches its original acceptance tests and requests independent review.

## Goal
Keep independent verification while preventing self-certification, speculative scope expansion, and unbounded review loops.

## Inputs
Frozen acceptance contract, diff, test results, production assumptions, reviewer findings.

## Baseline
Record original acceptance status, changed files, current review round (`0`), and approved non-goals.

## Stages
1. Observe reviewer findings without changing scope.
2. Measure the original acceptance tests and record pass/fail evidence.
3. Diagnose each finding against criterion, diff, assumptions, and acceptance impact.
4. Arbitrate every potentially blocking finding with `scripts/review_scope_gate.py`.
5. Form the smallest remediation hypothesis for each accepted blocker.
6. Implement only within the approved scope.
7. Measure again using original acceptance tests plus blocker reproductions.
8. If not improved, re-diagnose; allow at most three remediation rounds.
9. Run independent Scope Arbiter verification.
10. Mark `Implemented`, `Measured`, and `Verified` separately.

## Responsible agents
Reviewer finds issues; Scope Arbiter classifies; implementation agent remediates; independent verifier closes.

## Tools
Diff viewer, test runner, repository search, arbitration script.

## Outputs
Arbitration records, deferred findings, before/after evidence, final verification status.

## Checkpoints
Before plan mutation, after each remediation, and before completion.

## Metrics
Review rounds, accepted/deferred findings, original criteria passed, scope changes, elapsed time, rework count.

## Retry policy
Maximum three remediation rounds and two reproduction attempts per finding.

## Stop conditions
Stop on requested scope expansion, exhausted retry budget, contradictory production assumptions, or inability to reproduce a claimed blocker.

## Failure path
Preserve the last passing state and evidence. Do not weaken tests or acceptance criteria to exit the loop.

## Verification
The implementing agent cannot be the sole final verifier.

## Definition of Done
Original criteria pass, every accepted blocker has measured evidence, deferred findings did not mutate scope, independent verification passes, and no unresolved in-scope blocker remains.
