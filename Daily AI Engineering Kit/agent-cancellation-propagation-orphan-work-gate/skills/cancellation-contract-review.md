# Cancellation Contract Review

## Purpose
Prove that cancellation, timeout, or revoked execution intent propagates from each workflow entry point to cancellable child work.

## When to use
Use when adding async work, parallelism, retries, HTTP/database calls, subprocesses, queue processing, or long-running agent/tool operations.

## Inputs
Repository root, changed files, task/operation entry points, configured cancellation primitive, relevant tests.

## Preconditions
Buildable source tree; no unresolved merge conflict; approval status known for production-impacting changes.

## Allowed tools
Repository search, compiler/build, unit/integration tests, static analyzer, local process inspection, read-only logs.

## Constraints
Do not invent cancellation APIs. Do not convert fire-and-forget work into hidden background services. Do not swallow cancellation exceptions solely to make tests pass.

## Procedure
1. Identify request/job/command entry points and their cancellation source.
2. Trace every async edge: awaited call, spawned task, timer, queue send, subprocess, stream, HTTP call, DB call.
3. Classify each child as cancellable, atomic/non-cancellable, or intentionally detached.
4. Verify the parent cancellation object is passed to each cancellable child.
5. Check loops and retry delays observe cancellation before the next iteration.
6. Check side-effect boundaries re-check cancellation immediately before irreversible calls where practical.
7. Check cancellation exceptions retain cancellation semantics and are not converted to success.
8. Verify cleanup is bounded and does not start new business work.
9. Add runtime tests that cancel before I/O, during wait, and during fan-out when applicable.
10. Run `scripts/cancellation_gate.py` and inspect every finding.
11. Inspect the diff for unrelated edits.
12. Hand evidence to the Verification Agent.

## Expected output
Facts, affected paths, propagation gaps, intentionally detached work, test evidence, gate report, unresolved risks, final status.

## Verification
No high-severity unexplained finding; cancellation tests pass; detached work has owner/lifetime semantics; verifier confirms evidence.

## Failure handling
Transient tool failure: max 2 retries. Build/test failure: max 2 repair cycles. Missing cancellation API or ambiguous lifecycle: stop and record open question rather than guessing.

## Stop conditions
Stop before production changes, breaking contracts, destructive cleanup, permission escalation, or after two unsuccessful repair cycles.