# Skill: Wait Loop Baseline and Control

## Purpose
Measure and reduce model turns caused by no-change polling of subagents/background work without hiding meaningful child-state changes.

## Trigger
Use when wait/status/list-agent calls exceed 20% of model-visible tool calls, repeated timeouts occur, or a parent polls a task expected to run longer than the poll interval.

## Inputs
Timestamped orchestration events, child states, wait targets, timeout values, token/latency usage, task-duration estimates.

## Preconditions
The host can observe child state outside or before invoking another model turn.

## Allowed tools
Event/log parser, monotonic clock, state hash, lightweight status API, metrics collector.

## Constraints
Do not suppress terminal/error/approval/security events. Do not extend waits past user/provider cancellation deadlines. Do not mark stale children completed without evidence.

## Procedure
1. Measure baseline wait-family calls, timeout rate, model turns, input tokens, useful state changes, and end-to-end duration.
2. Build a stable state fingerprint from child ID, lifecycle state, progress version/timestamp, approval/error status, and output digest.
3. Coalesce repeated identical fingerprints outside the model loop.
4. Use adaptive polling: begin at configured minimum, double on no change up to maximum, reset on material change.
5. Apply a liveness lease: when `running` has no update beyond the lease, perform one deterministic reconciliation instead of continuing normal polls.
6. Validate wait targets before dispatch; missing exec/child IDs are invalidated immediately.
7. Emit a model-visible event only on material state change, terminal state, required approval/error, or checkpoint deadline.
8. Measure again and compare quality plus resource metrics.

## Decision points
- Invalid wait target => stop polling and re-plan once.
- Stale lease => reconcile once; if still ambiguous, escalate/stop rather than loop.
- No state change => coalesce and back off.
- Terminal/error/approval => emit immediately.

## Expected output
Before/after metrics and controller decisions with state fingerprints and suppression reasons.

## Metrics
Wait calls/task, no-change wait ratio, model turns/task, tokens/task, time-to-observe terminal state, orchestration latency, stale-child recovery rate.

## Verification
Task result must remain equivalent; terminal/error/approval detection must not regress; model-visible no-change turns and tokens must decrease measurably.

## Failure handling
Disable coalescing for the affected child if state fingerprints are unreliable. Retry controller tuning once with a shorter maximum interval.

## Stop conditions
Maximum two tuning cycles; stop on missed critical state transition, ambiguous liveness after reconciliation, or no measurable reduction.