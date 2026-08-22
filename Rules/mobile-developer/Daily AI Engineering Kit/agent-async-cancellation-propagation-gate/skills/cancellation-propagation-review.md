# Cancellation Propagation Review

## Purpose
Find and safely correct async execution paths that ignore, replace, swallow, or fail to propagate cancellation.

## When to use
Use for changes involving HTTP handlers, background jobs, message consumers, database calls, outbound HTTP calls, long polling, retries, loops, delays, or other asynchronous work.

## Inputs
- Repository root.
- Changed files or target execution path.
- Triggering entry point such as controller, endpoint, job, consumer, command handler, or worker.
- Existing tests and cancellation semantics.

## Preconditions
- Repository can be inspected without elevated production permissions.
- The target execution path can be traced to side-effecting operations.

## Allowed tools
Read/search repository files, run tests/build/static analysis, inspect diffs, and execute `scripts/scan-cancellation-risk.py` and `scripts/validate-assessment.py`.

## Constraints
- Prefer the smallest safe change.
- Do not alter public contracts solely to add a token without approval when the change is breaking.
- Do not convert expected cancellation into an application error.
- Do not hide cancellation by catching `OperationCanceledException` without preserving semantics.

## Procedure
1. Identify the async entry point and the cancellation source.
2. Trace the token through every awaited boundary until work terminates or reaches a deliberate non-cancelable boundary.
3. Inventory database, HTTP, queue, delay, stream, lock, loop, and retry calls in that path.
4. Run `python scripts/scan-cancellation-risk.py <repo-root> --json` and record relevant findings.
5. Separate confirmed defects from scanner heuristics.
6. For each confirmed defect, define the expected behavior when cancellation occurs before start, during I/O, and during retry/backoff.
7. Implement the smallest safe propagation change.
8. Add or update tests that cancel work and prove downstream operations stop or observe the token.
9. Run targeted tests, then the relevant build/test suite.
10. Inspect the diff for unintended public API, retry, transaction, or exception-handling changes.
11. Produce an assessment matching `schemas/assessment.schema.json`.
12. Have the Verification Agent independently check the evidence before status can become `pass`.

## Expected output
An assessment containing scope, concrete findings, evidence, tests executed, verification flags, and remaining risks.

## Verification
A `pass` requires static scan review, targeted cancellation tests, diff review, and independent verification.

## Failure handling
- Tool/transient failure: retry at most 2 times, preserving command output.
- Test failure: diagnose and fix at most 2 cycles; then stop with `fail` or `blocked`.
- Permission/environment failure: stop and report the missing capability; do not increase permissions.
- Approval-required change: set `needs-approval` and stop before the change.

## Stop conditions
Stop when verified, after 2 unsuccessful fix/retest cycles, when evidence is insufficient, or before any approval-required action.
