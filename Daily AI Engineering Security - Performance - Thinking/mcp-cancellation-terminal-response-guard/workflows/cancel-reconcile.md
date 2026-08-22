# Workflow: Cancel, Reconcile, and Recover MCP Requests

## Trigger
An MCP request exceeds idle timeout, exceeds absolute timeout, receives explicit user cancellation, loses transport, or lacks an expected terminal event.

## Goal
Convert every request into a bounded terminal or explicit `unknown` state, then recover without unsafe duplicate side effects.

## Inputs
Request/session identity, timestamps, side-effect classification, progress events, cancellation reason, terminal evidence, and policy.

## Baseline
Measure current request age distribution, stuck-request count, cancel-to-terminal latency, session restarts, retries after timeout, and any duplicate effects.

## Context
Cancellation is a lifecycle state transition, not merely an exception. A client should preserve the difference between why cancellation happened and whether the remote request actually terminated.

## Stages
1. **Observe:** create request record at dispatch and record progress/terminal events.
2. **Measure baseline:** capture normal and failure-path durations.
3. **Diagnose:** identify idle, absolute, user, transport, or server trigger.
4. **Form hypothesis:** define the expected terminal/recovery behavior and measurable deadline.
5. **Implement:** evaluate `scripts/cancellation_guard.py` on every lifecycle event.
6. **Request cancellation:** when a timeout fires, send cancellation once and transition to `cancel_requested`.
7. **Await bounded terminal:** wait only `cancel_grace_seconds`.
8. **Reconcile:** if terminal evidence is absent, mark `unknown` and attempt status/session reconciliation up to `max_reconcile_attempts`.
9. **Retry decision:** read-only may retry under policy; side-effecting unknown requests remain blocked unless idempotency/status evidence proves safety.
10. **Measure again:** compare stuck duration, unknown rate, recovery time, restart count, and duplicate effects.
11. **Verify:** independent Protocol Lifecycle Verifier checks all required scenarios.

## Responsible agent
Runtime owner implements. `subagents/protocol-verifier.md` independently verifies.

## Tools
MCP client/server logs, Inspector, deterministic watchdog script, local test harness, and remote operation status APIs where available.

## Outputs
Lifecycle timeline, cancellation reason, terminal/unknown state, retry decision, session-health decision, metrics, and verification result.

## Checkpoints
- Side-effect classification before dispatch.
- Idle and absolute deadlines configured.
- Cancellation reason recorded before cancel signal.
- Terminal evidence or grace expiry recorded.
- Reconciliation before retry.
- Independent verification before rollout completion.

## Metrics
Terminal-outcome percentage, cancel-to-terminal latency, maximum in-flight age, unknown outcome rate, session restarts/request, duplicate side effects, and recovery duration.

## Retry policy
Maximum reconciliation attempts come from policy (default 2). Read-only retry is bounded to one new attempt unless a stricter host policy applies. Unknown side-effecting operations receive zero automatic retries by default.

## Stop conditions
Stop automatic recovery when reconciliation attempts are exhausted, a side-effecting outcome remains unknown, or the session’s protocol state cannot be trusted.

## Failure path
Detection → preserve trace → send at most one cancellation for the current state → wait bounded grace → mark unknown if needed → reconcile → quarantine unsafe retry/session → escalate with evidence.

## Verification
Run `python -m unittest tests/test_cancellation_guard.py`, then execute controlled integration cases for explicit cancellation and lost-terminal response.

## Definition of Done
- **Implemented:** request lifecycle state and cancellation taxonomy are wired in.
- **Measured:** baseline/after stuck and cancel metrics are collected.
- **Verified:** no scenario waits indefinitely; unknown side effects cannot auto-retry; bounded recovery and session-health behavior pass independent tests.
