# Skill — Diagnose and Bound Agent Stalls

## Purpose
Detect silent agent/tool stalls early, collect useful diagnostics, and recover only when doing so is safe and still fits the run budget.

## Trigger
Use for scheduled, CI, headless, or long-running agent processes where a silent tool/network/deferred-tool stall can consume most of the allowed runtime.

## Inputs
Command, global timeout, silence timeout, graceful-kill duration, retry limit, idempotency classification, optional activity pattern/stage labels.

## Preconditions
The runner can observe stdout/stderr or explicit heartbeat events and can terminate the process tree.

## Allowed tools
Subprocess management, monotonic clock, stdout/stderr capture, process-tree termination, deterministic log parsing.

## Constraints
A watchdog is a containment/diagnostic layer, not proof of upstream root cause. Do not blindly retry side-effecting operations.

## Procedure
1. Establish baseline runtime and event-silence distributions from healthy runs.
2. Set a global deadline and a shorter silence threshold based on the observed workload.
3. Launch the child process with stdout/stderr pipes and a monotonic clock.
4. Update `last_activity` on every observed output/heartbeat.
5. If silence threshold is exceeded, capture current stage, recent output, elapsed time, process identity, and attempt number.
6. Send graceful termination; after the grace period, kill the process tree if it is still alive.
7. Retry only when the operation is explicitly classified safe/idempotent, retry count is below limit, and enough global budget remains.
8. Apply bounded backoff/jitter before retry.
9. Compare after metrics with baseline and cluster stalls by tool/stage/version.

## Decision points
- Legitimately long silent stage: configure a larger stage-specific threshold, not an unlimited timeout.
- Unknown side-effect status: stop and escalate instead of retrying.
- Repeat stall at the same stage: stop after configured attempts and preserve diagnostics.

## Expected output
Structured run record containing status, elapsed time, silence duration, termination mode, retries, exit code, and recent output.

## Metrics
p95 silence, wasted seconds, watchdog interventions, safe recovery rate, false positives, repeated-stage stalls.

## Verification
Run tests with fast success, deterministic silent child, and retriable/non-retriable scenarios.

## Failure handling
If the watchdog itself cannot observe or terminate the child reliably, fail closed for scheduled production use and fall back to the outer platform timeout.

## Stop conditions
Stop on successful completion, global deadline, non-retriable stall, retry exhaustion, or watchdog internal failure.