# Skill: Streamed Tool-Argument Investigation

## Purpose
Diagnose performance and correctness failures in streamed tool/function-call argument handling using reproducible evidence.

## Trigger
Use when a tool call is slow, silent, malformed, truncated, repeatedly retried, or begins execution before its arguments are complete.

## Inputs
- Provider/model and API mode.
- Ordered raw stream events with timestamps.
- Tool call id/name.
- Current aggregation/parser implementation.
- Tool schema and whether incremental execution is intentionally supported.
- Baseline latency/CPU/allocation data if available.

## Preconditions
Capture raw events without secrets. Redact credentials and private payload values while preserving event type, sizes, timestamps, ordering, and structural JSON shape.

## Required context
Provider streaming contract, adapter implementation, execution gate, configured budgets in `config/policy.json`, and representative payload sizes.

## Allowed tools
Source inspection, local deterministic scripts, profilers, benchmark tools, unit tests, trace/log readers, and public documentation/issues.

## Constraints
- MUST NOT execute side-effecting tools from partial arguments during investigation.
- MUST preserve event order and final authoritative payload.
- MUST distinguish true deltas from cumulative snapshots.
- MUST NOT infer parser complexity from one timing point; test multiple payload sizes.

## Procedure
1. Record a baseline with payload sizes at least 4 KiB, 16 KiB, 64 KiB, and the largest realistic size.
2. Count stream events, bytes, parse attempts, total bytes reparsed, elapsed aggregation time, and time to final arguments.
3. Classify each provider event as `delta`, `snapshot`, or `final` using documented semantics and captured behavior.
4. Verify whether the current adapter concatenates snapshots, reparses the full prefix, performs repair parsing per chunk, or starts the tool before finalization.
5. Reproduce with `scripts/stream_arg_guard.py --benchmark` and a representative fixture.
6. Form one primary hypothesis: repeated-prefix work, incorrect stream semantics, early execution, malformed final payload, or provider-side buffering.
7. Apply only the smallest integration change that addresses the measured cause.
8. Re-run the same benchmark and regression fixtures.
9. Have an independent verifier compare final normalized arguments byte-for-byte or semantically against the authoritative final payload.

## Decision points
- If no final event arrives, classify as truncated and stop; do not execute.
- If a snapshot is not a prefix-compatible continuation, replace the accumulated preview rather than concatenate it.
- If the provider final payload differs from preview, final wins and the mismatch is logged.
- If the payload exceeds policy, fail explicitly instead of increasing limits automatically.
- If guarded processing does not beat baseline outside normal benchmark noise, do not claim a performance improvement.

## Expected output
A diagnosis containing baseline, evidence, hypothesis, implementation change, before/after measurements, correctness result, risks, and verification status.

## Metrics
Elapsed aggregation time, parse attempts, bytes processed, peak buffered bytes, malformed events, preview mismatches, time-to-final-args, and execution-before-final violations.

## Verification
The same fixture must produce identical final arguments, bounded resource use, no unbounded waits, and no regression greater than policy threshold.

## Failure handling
Retry a benchmark at most 3 times for measurement noise. If provider behavior is nondeterministic, preserve traces and report a confidence interval instead of forcing a conclusion.

## Stop conditions
Stop when final semantics cannot be determined, required traces are missing, configured safety budgets are exceeded, or three benchmark repetitions remain inconclusive.
