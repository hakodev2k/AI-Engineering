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
1. **Observe** — collect reviewer findings without changing scope.
2. **Measure baseline** — run original acceptance tests and record pass/fail evidence.
3. **Diagnose** — map each finding to criterion, diff, assumptions, and acceptance impact.
4. **Arbitrate** — run `scripts/review_scope_gate.py` for every potentially blocking finding.
5. **Form hypothesis** — for accepted blockers, state the smallest change expected to restore the mapped criterion.
6. **Implement improvement** — implementation agent changes only approved scope.
7. **Measure again** — rerun original acceptance tests plus the accepted blocker reproduction.
8. **Improved?** — if no, retry only after re-diagnosis; maximum 3 remediation rounds total.
9. **Independent verify** — Scope Arbiter checks evidence and completion status.
10. **Complete** — mark `Implemented`, `Measured`, `Verified` separately.

## Responsible agent
Reviewer finds issues; Scope Arbiter classifies; implementation agent remediates; independent verifier closes.

## Tools
Diff viewer, test runner, repository search, arbitration script.

## Outputs
Arbitration records, deferred findings, before/after test evidence, final verification status.

## Checkpoints
Before any plan change; after each remediation; before completion.

## Metrics
Review rounds, accepted/deferred findings, criteria passed, scope changes, elapsed time, rework count.

## Retry policy
Maximum 3 remediation rounds and maximum 2 reproduction attempts per finding.

## Stop conditions
Stop and escalate on requested scope expansion, exhausted retry budget, contradictory production assumptions, or inability to reproduce a claimed blocker.

## Failure path
Preserve the last passing state and evidence. Do not weaken tests or acceptance criteria to exit the loop.

## Verification
The implementing agent cannot be the sole final verifier.

## Definition of Done
Original criteria pass; every accepted blocker has measured evidence; deferred findings did not mutate scope; independent verification passes; no unresolved in-scope blocker remains.
