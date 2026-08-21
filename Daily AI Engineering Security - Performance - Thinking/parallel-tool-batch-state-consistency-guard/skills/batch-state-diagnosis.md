# Skill: Batch State Diagnosis

## Purpose
Diagnose correctness and performance failures caused by parallel tool calls sharing mutable session or agent state.

## Trigger
Use when parallel tool execution produces missing sibling calls, duplicate retries, approval loops, stale handoffs, memory corruption, or worse latency than a sequential baseline.

## Inputs
Tool-call trace, session identifiers, state versions, approval events, handoff events, tool side-effect metadata, and timing data.

## Preconditions
Each observed tool call can be assigned a stable `batch_id` and `tool_call_id`, even if they must be reconstructed from logs.

## Required context
Only observable events and state metadata. Do not request hidden chain-of-thought.

## Allowed tools
Trace/log reader, benchmark runner, schema validator, source inspection, tests, deterministic analyzer.

## Constraints
Do not "fix" the issue by globally disabling parallelism without measuring the trade-off. Do not retry side-effecting tools unless idempotency is proven. Do not infer success from a model narrative when a tool lacks a terminal event.

## Procedure
1. Capture a sequential baseline and current parallel baseline for the same fixture.
2. Normalize trace events to `batch_id`, `tool_call_id`, `session_id`, `session_version`, `event`, `timestamp`, and optional `idempotency_key`.
3. Verify each model-issued call has exactly one start and one terminal event (`succeeded`, `failed`, `rejected`, or `cancelled`).
4. Detect duplicated starts, missing terminals, result-before-start events, and terminal events associated with the wrong session version.
5. Identify stateful events: approval enqueue/dequeue, state mutation, handoff request/commit, retry, and external side effect.
6. Build a per-batch timeline. Mark overlapping stateful writes to the same mutable scope.
7. Form one explicit hypothesis at a time, e.g. session recreation loses pending approval state or handoff commit races reply generation.
8. Change the smallest orchestration boundary that can enforce the invariant: immutable snapshot, per-batch state, version check, barrier, or serialization of only conflicting operations.
9. Rerun the same fixture at least 20 batches or the team's statistically meaningful sample.
10. Compare correctness and latency to both baselines.

## Decision points
- If two calls write the same non-commutative state, serialize or version-gate those writes while preserving other parallel work.
- If continuation crosses an HTTP/UI boundary, persist the batch ledger with the session rather than reconstructing it from model text.
- If a retry targets a side-effecting tool without an idempotency key, block the retry.
- If all invariants pass but latency regresses, profile queue/wait time before changing correctness controls.

## Expected output
A diagnosis containing Facts, Evidence, Hypothesis, Conflicting state scope, Proposed invariant, Before/after metrics, Risks, and Verification status.

## Metrics
p50/p95 batch latency, lost-call rate, duplicate-call rate, non-terminal rate, state-version conflict count, retry count, throughput.

## Verification
Use `scripts/batch_trace_analyzer.py` and an independent verifier. Task completion requires zero lost/duplicate/non-terminal calls in the verification corpus.

## Failure handling
Retry data collection once for malformed traces. If correlation IDs are unavailable, stop and add observability before making a concurrency change.

## Stop conditions
Stop after two unsuccessful remediation cycles, any unbounded retry path, or inability to prove side-effect idempotency.