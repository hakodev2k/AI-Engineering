# Orphan Work Investigation

## Purpose
Investigate work that survives after its parent request, agent run, job, or command has been cancelled.

## Inputs
Cancellation timestamp, correlation/run ID, process/task logs, source entry point, child work identifiers, runtime traces.

## Process
1. Establish the parent lifetime and exact cancellation signal/time.
2. List child tasks/processes/requests created before cancellation.
3. Correlate post-cancel log lines and side effects by run ID.
4. Separate cleanup activity from business activity.
5. Locate the creation site and lifetime owner for every surviving child.
6. Form one hypothesis per survivor: missing token propagation, detached task, swallowed exception, non-cancellable blocking call, retry loop, queue handoff, or cleanup bug.
7. Validate hypotheses individually with code evidence and a reproducible cancellation test.
8. Fix the smallest lifecycle defect.
9. Re-run cancellation at the same checkpoint and confirm zero unauthorized post-cancel work.
10. Preserve before/after evidence.

## Output contract
For each finding: `finding`, `evidence`, `confidence`, `affected_component`, `risk`, `recommended_action`, `verification_status`.

## Stop conditions
Stop when evidence requires production-only tracing not currently approved, when the suspected operation is destructive to reproduce, or after two failed reproduction/repair cycles.