# Skill: Polling Offload

## Purpose
Move deterministic waiting/status checks out of the model inference loop while preserving completion, cancellation, timeout, and evidence.

## Trigger
A tool, process, MCP job, build, deployment, or child agent returns a durable handle plus a non-terminal state.

## Inputs
Handle; status provider command/API adapter; policy; expected terminal states; cancellation source; baseline telemetry.

## Preconditions
The status lookup MUST be idempotent/read-only. The handle MUST be scoped to the current task. The caller MUST keep an outer task deadline.

## Allowed tools
Read-only status API/process query, local script execution, monotonic timer, telemetry writer.

## Constraints
Do not use an LLM to decide every poll. Do not hide failures. Do not extend the task deadline. Do not execute arbitrary provider output. Result payloads must be size-bounded.

## Procedure
1. Record baseline: current model turns, token count, elapsed time, and expected duration.
2. Validate handle, provider, terminal states, timeout, and poll budget.
3. Prefer push/event completion when available.
4. Otherwise start `scripts/wait_broker.py` with exponential backoff and jitter.
5. Emit telemetry only for start, meaningful state transition, and terminal result.
6. Wake the model only on completed/failed/cancelled/timeout or an explicit human interrupt.
7. Compare post-run wait turns/tokens and completion-detection lag to baseline.

## Decision points
- No durable handle: stay synchronous; do not fabricate one.
- Provider is mutating/destructive: block offload.
- Push completion available: use it instead of polling.
- Timeout reached: return timeout evidence; do not silently retry forever.

## Expected output
Terminal event with status, elapsed time, poll count, bounded result, and before/after metrics.

## Metrics
Model wait turns, wait tokens, runtime polls, detection lag, timeout rate, cancellation latency, result correctness.

## Verification
Run productive, failed, cancelled, and timeout fixtures. The terminal state must match the underlying provider. Target >=80% reduction in model wait turns on long fixtures.

## Failure handling
Provider errors terminate the broker and surface evidence. One caller-level recovery retry is allowed only after classifying the provider error as transient.

## Stop conditions
Terminal state, cancellation, timeout, poll budget exhaustion, invalid provider state, or provider integrity failure.
