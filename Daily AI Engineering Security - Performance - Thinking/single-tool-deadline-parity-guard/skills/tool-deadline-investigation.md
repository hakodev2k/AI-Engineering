# Skill: Tool Deadline Investigation

## Purpose
Find and eliminate unbounded or inconsistent waits in agent tool execution.

## Trigger
Hung turn, timeout regression, new executor/transport, new long-running tool, or liveness incident.

## Inputs
Executor code paths; timeout config; traces; tool latency samples; cancellation behavior; retry policy.

## Preconditions
Use mock stalled tools before production tests. Establish a latency baseline first.

## Required context
Single/sequential/parallel paths, transport, subprocess ownership, idempotency, expected long-running behavior.

## Allowed tools
Read-only code/config inspection, trace/log analysis, mock HTTP/MCP/subprocess fixtures, checker, benchmark timer.

## Constraints
No destructive retry tests against production. Do not infer performance improvement without before/after measurement.

## Procedure
1. Inventory every awaited tool path.
2. Measure normal P50/P95/P99 and current stalled-call behavior.
3. Map hard, idle, startup, and total-turn timeouts separately.
4. Identify uncovered awaits and inconsistent timeout dispositions.
5. Verify what cancellation actually stops: task, socket, subprocess, server request.
6. Form a path-specific deadline hypothesis from baseline.
7. Implement finite hard deadline and, if needed, idle/progress timeout.
8. Emit normalized `tool_timeout`-class result.
9. Replay never-returning and slow-progress fixtures.
10. Compare recovery latency, normal-call regressions, leaked resources, retries.

## Decision points
Missing finite deadline: BLOCK. Timeout without cleanup: BLOCK for resource-owning calls. Non-idempotent ambiguous timeout: no automatic retry. Legitimate long tool: configure larger hard limit plus heartbeat/idle policy, not infinity.

## Expected output
Path inventory, baseline, root cause, before/after metrics, cleanup evidence, retry decision.

## Metrics
Time-to-recovery, P95/P99 latency, timeout rate, false timeout rate, orphan count, task success.

## Verification
Every stalled fixture exits within configured limit+tolerance and leaves no owned resource running.

## Failure handling
At most two tuning cycles; revert if false timeouts materially regress success.

## Stop conditions
Stop if safe cancellation is impossible or deadline tuning would require an infinite bound.