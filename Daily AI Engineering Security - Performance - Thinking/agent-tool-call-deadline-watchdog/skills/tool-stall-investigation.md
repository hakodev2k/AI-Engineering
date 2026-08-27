# Skill: Tool Stall Investigation

## Purpose
Diagnose tool-call stalls using observable timestamps, deadlines, side-effect classification, and bounded recovery.

## Trigger
A tool call exceeds expected latency, an agent remains in tool state without progress, or a new tool adapter is introduced.

## Inputs
Call ID, tool name, start timestamp, deadline class, attempt count, side-effect class, idempotency, total wall time, tool logs.

## Preconditions
Use a monotonic clock for duration. Tool arguments must be schema-validated before dispatch.

## Required context
Current tool policy, baseline latency distribution, and known external dependency limits.

## Allowed tools
Read-only logs, metrics, tests, watchdog script, dependency health checks.

## Constraints
MUST NOT retry consequential or unknown-side-effect calls automatically. MUST NOT extend a deadline merely to make a failing test pass.

## Procedure
1. Capture p50/p95/p99 latency and timeout rate for the tool class.
2. Verify argument/schema validation precedes dispatch.
3. Record `started_ms`, `elapsed_ms`, `deadline_ms`, attempt and side-effect class.
4. Run the watchdog decision.
5. Test one hypothesis at a time: malformed input, dependency stall, lost stream/result, subprocess wait, or missing deadline propagation.
6. For idempotent reads only, perform at most one bounded retry if policy allows.
7. Compare before/after latency and stale-call rate.
8. Hand results to an independent verifier.

## Decision points
- Healthy: elapsed below deadline plus grace.
- Retry: stale, idempotent, read-only, within attempt and wall-clock budgets.
- Escalate: consequential, unknown side effects, exhausted retry budget, or repeated stall.

## Expected output
Facts, baseline metrics, hypothesis, watchdog decision, before/after metrics, verification status.

## Metrics
p95/p99 tool latency, stale-call rate, mean recovery time, retries per call, duplicate-side-effect count.

## Verification
Regression tests pass and an independent reviewer confirms consequential calls never auto-retry.

## Failure handling
Cancel where supported, preserve evidence, surface the blocked call, and require operator review for consequential ambiguity.

## Stop conditions
Maximum two diagnostic hypotheses per incident; stop immediately on possible duplicate write or irreversible action.
