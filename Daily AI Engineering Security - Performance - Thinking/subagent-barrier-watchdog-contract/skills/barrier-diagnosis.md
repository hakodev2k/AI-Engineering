# Skill: Subagent Barrier Diagnosis

## Purpose
Diagnose stalled multi-agent barriers using observable progress rather than inferred hidden reasoning.

## Trigger
A parent is waiting on children longer than expected, a verification stage does not start, or child cleanup blocks completion.

## Inputs
Child IDs, start timestamps, last meaningful progress timestamps, terminal status, barrier policy, tool/runtime errors.

## Preconditions
Clock source is monotonic enough for deadline evaluation; parent can observe child lifecycle events.

## Required context
Task acceptance criteria, required quorum, child responsibilities, and externally observable progress events.

## Allowed tools
Read-only logs, runtime status APIs, `scripts/barrier_watchdog.py`, tests.

## Constraints
- MUST NOT request hidden chain-of-thought.
- MUST NOT call activity "progress" unless it changes observable task state.
- MUST NOT wait indefinitely for all children when policy allows degraded completion.

## Procedure
1. Record Facts: child state, timestamps, outputs, failures.
2. Record Assumptions separately; do not promote them to facts.
3. Establish baseline expected wall time and progress cadence.
4. Run the deterministic watchdog.
5. Classify each child as completed, running, stalled, failed, or cancelled.
6. Determine whether quorum is already satisfied, still reachable, or unreachable.
7. If stalled, form one recovery hypothesis and permit at most one recovery attempt.
8. Hand the complete ledger to independent verification.

## Decision points
- Release when required evidence/quorum exists.
- Release degraded only when policy allows and verification can proceed safely.
- Block when quorum is unreachable or required evidence is missing.

## Expected output
Facts, Evidence, Assumptions, Barrier Decision, Risks, Verification status.

## Metrics
Barrier wait time, stalled-child rate, downstream verification reach rate, recovery attempts, duplicate parent rework.

## Verification
Independent verifier checks the decision against policy and validates that failed/stalled child work was not silently treated as complete.

## Failure handling
Preserve child outputs and reason codes; do not erase failures. Escalate if a required child cannot be safely replaced.

## Stop conditions
Maximum one recovery attempt per stalled child; after that produce a terminal failed/stalled result.
