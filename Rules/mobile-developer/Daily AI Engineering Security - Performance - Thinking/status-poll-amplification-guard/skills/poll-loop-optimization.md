# Skill — Poll Loop Optimization

## Purpose
Reduce redundant model-visible polling while preserving timely detection of material state changes.

## Trigger
Use when an agent waits on a long-running command, subagent, CI job, deployment, queue, or external workflow.

## Inputs
Baseline poll trace, material status fields, initial/max interval, max polls, max wall-clock wait, expected duration class, stale-state threshold.

## Preconditions
A status source exists and can be queried without requiring a model turn.

## Procedure
1. Measure baseline polls, no-change percentage, model turns, tokens, and detection latency.
2. Define material status fields; exclude volatile timestamps/noisy payload fields.
3. Fingerprint each normalized status.
4. On unchanged non-terminal state, suppress model emission and exponentially back off up to max interval.
5. On material change, emit compact status and reset interval.
6. On terminal state, emit immediately and stop.
7. If identical deterministic failure signatures repeat twice without state mutation, circuit-break.
8. If stale-running age or poll/wall-clock budget is exceeded, escalate instead of continuing.
9. Measure again and compare against baseline.

## Decision points
- State changed -> emit/reset.
- State unchanged -> suppress/back off.
- Terminal -> emit/stop.
- Repeated deterministic failure -> circuit-break.
- Budget exhausted/stale state -> escalate.

## Expected output
A bounded poll policy and before/after metrics.

## Metrics
Polls/task, visible events/task, suppression ratio, model calls/tokens, detection latency, stale-state and circuit-break counts.

## Verification
Run unit tests and replay a captured baseline trace through the controller.

## Failure handling
Invalid status/config returns a hard error. Retry collection once; never convert unknown state into success.

## Stop conditions
Terminal event, circuit breaker, poll budget exhausted, wall-clock budget exceeded, or explicit cancellation.