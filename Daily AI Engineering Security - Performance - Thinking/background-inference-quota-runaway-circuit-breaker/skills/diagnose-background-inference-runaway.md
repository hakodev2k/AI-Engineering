# Skill — Diagnose Background Inference Runaway

## Purpose
Determine whether autonomous background model calls are justified by changing state or are consuming quota without useful progress.

## Trigger
Unexpected quota drain, repeated background calls, stale-running workers, idle inference, or a new background-worker implementation.

## Inputs
Sanitized worker event stream, request timestamps, worker/turn IDs, pending-input/follow-up flags, progress fingerprints, token counters, durable output changes.

## Preconditions
Events MUST be correlated to a worker and logical turn. Progress fingerprints MUST represent durable state/output change rather than HTTP success alone.

## Required context
Worker lifecycle, parent-child relationship, retry policy, quota semantics, durable completion state, and expected event cadence.

## Allowed tools
Read-only logs/traces, `scripts/inference_loop_guard.py`, test runner, quota/usage telemetry, process/state inspection.

## Constraints
MUST NOT weaken correctness or abandon legitimate work solely to reduce calls. MUST NOT treat cached tokens as free. MUST preserve evidence before recovery.

## Procedure
1. Measure baseline background calls, idle calls, token use, and no-progress durations.
2. Correlate calls by worker and turn.
3. Identify calls made with no pending input and no required follow-up.
4. Fingerprint durable progress and find repeated same-turn/no-change sequences.
5. Separate transient retry from deterministic failure such as oversized unchanged input.
6. Form a single root-cause hypothesis.
7. Add or tune call-admission/circuit-breaker logic.
8. Replay the incident trace and representative legitimate traces.
9. Compare call counts, tokens, completion rate, and false blocks.
10. Hand results to an independent verifier.

## Decision points
Terminal/no-input call: block. Same-turn request budget exceeded: block and recover. No-progress timeout exceeded: block and inspect. New dependency/input state: reset bounded progress budget. Deterministic oversized input: do not retry unchanged payload.

## Expected output
Facts, evidence, root cause, baseline, policy decision, before/after metrics, blocked-call evidence, recovery path, verification status.

## Metrics
Background calls/task, idle calls/task, repeated-turn count, no-progress duration, tokens after terminal state, quota share, mean time to break, false-block rate.

## Verification
Incident replay must be blocked before runaway amplification while legitimate progress traces remain allowed.

## Failure handling
Maximum two automated recovery attempts. If state is ambiguous after recovery, stop autonomous calls and escalate with evidence.

## Stop conditions
Stop successfully after deterministic guard and independent verification pass; stop unsuccessfully after bounded recovery, missing correlation data, or false-block regression.
