# Burst Baseline and Diagnosis Skill

## Purpose
Measure whether agent latency/cost is caused by excessive heterogeneous tool-call bursts and determine a safe checkpoint budget.

## Trigger
High token cost, long silent turns, many consecutive tools, or repeated self-repair calls after errors.

## Inputs
Per-step timestamps, tool names, target/domain labels, prompt/input tokens, result status, user-visible checkpoint events.

## Preconditions
Telemetry is timestamped and belongs to one logical turn/session.

## Required context
No hidden reasoning. Use observable tool events, usage metrics, errors, and outcomes.

## Allowed tools
Trace parser, usage logs, benchmark/replay fixtures, `tool_burst_guard.py`.

## Constraints
Do not optimize by disabling required verification, approvals, tests, or necessary context.

## Procedure
1. Measure baseline calls/turn, tokens/turn, p50/p95 turn latency, completion rate.
2. Segment traces into bursts between valid checkpoints.
3. Identify high-cost bursts and classify causes: recovery thrash, over-decomposition, repeated locality, legitimate pipeline.
4. Form a threshold hypothesis using percentile data rather than arbitrary low caps.
5. Apply policy to historical traces in dry-run mode.
6. Measure prevented calls/tokens and false checkpoints on productive traces.
7. Tune once if needed; maximum 2 threshold iterations.
8. Run live/canary verification.

## Decision points
If productive workflows commonly exceed threshold, raise/compound threshold rather than removing verification. If pathological traces stay below call count but exceed token/time budgets, enable compound metrics.

## Expected output
Baseline table, classified traces, proposed policy, before/after estimates, regression evidence.

## Metrics
Calls/task, tokens/task, p95 latency, task success, checkpoint precision, prevented wasted calls.

## Verification
Replay a mixed corpus containing productive and pathological traces.

## Failure handling
If telemetry lacks usage tokens, use call/time budgets and mark token metric unavailable rather than fabricating it.

## Stop conditions
Stop optimization if completion or security verification regresses materially or after 2 unsuccessful tuning iterations.
