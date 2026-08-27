# Skill: Context Compaction Diagnosis

## Purpose
Diagnose non-converging context recovery using observable token/state evidence.

## Trigger
Context-limit rejection, repeated compaction, compaction timeout, or compaction retry with rising input size.

## Inputs
Token counts, context limit, summary output reserve, retry count, failure fingerprint, persisted retry-debris count, and recovery logs.

## Preconditions
Token accounting is available and source conversation remains preserved.

## Required context
Only state needed to determine convergence; do not request hidden chain-of-thought.

## Allowed tools
Token counters, log readers, `scripts/compaction_guard.py`, unit tests.

## Constraints
MUST NOT delete correctness-critical context merely to force a retry. MUST NOT retry an identical deterministic overflow indefinitely.

## Procedure
1. Record the first failing request as baseline.
2. Separate source conversation from failure/retry artifacts.
3. Calculate reserved output headroom.
4. Fingerprint the failure class and normalized provider error.
5. Run the guard.
6. If retry is allowed, confirm input shrinks by policy minimum before sending.
7. If stopped, create a bounded continuation summary and independently verify required facts survived.

## Decision points
Retry only when headroom is sufficient, retry debris is bounded, failure fingerprint changed when required, and input is monotonically smaller.

## Expected output
Facts, Evidence, Hypothesis, Decision, Metrics, Verification status.

## Metrics
Input delta/retry, tokens burned on failed retries, recovery success rate, post-recovery regression rate.

## Verification
A verifier compares a sampled set of task-critical facts before and after recovery.

## Failure handling
At most two automatic attempts. Fallback to fresh continuation. Escalate when a correctness-critical fact cannot be safely summarized.

## Stop conditions
Identical failure, no monotonic shrink, insufficient headroom, excess retry debris, or attempt limit.
