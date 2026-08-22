# Lifecycle Hooks

## Pre-task: timeout risk scan

Trigger: before implementation when timeout/retry/client code is in scope.

Preconditions: repository root exists and Python 3 is available.

Action:
`python3 scripts/scan-timeout-risk.py <repo-root> --json`

Expected result: JSON evidence packet and exit code 0, 1, or 2 according to risk score.

Failure behavior: malformed invocation or unreadable repository blocks execution; scanner risk exit codes do not by themselves prove a defect.

Blocks execution: only operational scanner failure or confirmed blocking finding.

## Post-edit: targeted test checkpoint

Trigger: after edits affecting timeout, retry, cancellation, or downstream calls.

Preconditions: relevant project test command is known.

Action: execute the narrowest tests that prove success within deadline plus cutoff/cancellation behavior.

Expected result: all targeted tests pass.

Failure behavior: preserve command/output and enter the bounded fix-retest loop from `workflows/timeout-budget-review.md`.

Blocks execution: yes after two unsuccessful fix-retest cycles.

## Final verification: assessment contract

Trigger: before declaring the workflow complete.

Preconditions: final assessment JSON exists and contains evidence from the current diff/test run.

Action:
`python3 scripts/validate-assessment.py <assessment.json>`

Expected result: `VALID` with exit code 0.

Failure behavior: completion is blocked until the contract is corrected from real evidence. Do not remove required fields or weaken validation.

Blocks execution: yes.

## Final verification: diff review

Trigger: immediately before completion.

Preconditions: a working-tree or PR diff is available.

Action: inspect changed timeout constants, retry policies, cancellation usage, config files, and unrelated changes.

Expected result: only intended changes remain and no approval boundary was crossed silently.

Failure behavior: revert or separate unintended changes; if approval is required, stop with `needs-approval`.

Blocks execution: yes.
