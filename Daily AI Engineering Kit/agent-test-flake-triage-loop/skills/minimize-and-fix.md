# Skill: Minimize and Fix a Flaky Test

## Purpose
Validate one cause at a time and implement the smallest change that removes nondeterminism without hiding failures.

## Inputs
- Investigation handoff from `skills/reproduce-and-classify.md`.
- Evidence directory.
- Relevant source and test files.

## Preconditions
At least one evidence-backed hypothesis exists. If none exists, return to investigation rather than guessing.

## Process
1. Select the highest-confidence hypothesis.
2. Define one falsifiable experiment and the expected result if the hypothesis is correct.
3. Make the smallest temporary diagnostic change needed to test the hypothesis; avoid permanent sleeps, retries, assertion weakening, or test disabling.
4. Run the target repeatedly with the same reproduction command.
5. If evidence contradicts the hypothesis, revert diagnostic-only edits, preserve findings, and try the next hypothesis. Try at most three hypotheses per triage cycle.
6. Once the cause is supported, implement the minimal durable fix. Prefer deterministic clocks/data, scoped state, proper synchronization, isolated resources, explicit lifecycle management, or condition-based waits.
7. Run formatting/static checks relevant to changed files.
8. Run the target for the configured post-fix attempt count.
9. Run the nearest relevant suite once.
10. Inspect `git diff` and record remaining risk.

## Expected output
- Root cause and evidence.
- Files changed and rationale.
- Validation commands/results.
- Any approval-required action not executed.
- Remaining risks.

## Verification
A fix is not complete unless repeated target runs contain zero failures, the nearest suite passes, and the final verifier independently reviews evidence and diff.

## Failure handling
A failed experiment is evidence, not a reason to broaden edits. After three unsupported hypotheses, stop with `needs-investigation`. Tool failures may be retried twice; test failures after a fix require re-planning, not indefinite retries.

## Stop conditions
Stop on approval boundaries, exhausted hypothesis budget, environment blockers, or evidence that the failure is outside the repository's control.