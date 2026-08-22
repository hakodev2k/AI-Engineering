# Skill: Orchestration Baseline and Diagnosis

## Purpose
Measure and diagnose idle multi-agent coordination overhead before changing orchestration behavior.

## Trigger
Repeated wait/status turns, stale child state, unexpected token growth, wrong wait-tool selection, or slow child-result recognition.

## Inputs
Lifecycle events, selected tool names, child status snapshots, timestamps, context-token estimates, task completion evidence.

## Preconditions
At least one affected run or reproducible trace is available. Do not infer performance improvements from a single anecdote without a baseline.

## Required context
Only orchestration events and token/latency counters needed for diagnosis; avoid loading unrelated repository content.

## Allowed tools
Trace readers, JSON processors, `scripts/orchestration_watchdog.py`, timing/token metrics, read-only runtime status APIs.

## Constraints
Do not terminate healthy child work solely to reduce token cost. Do not treat UI status as authoritative when runtime lifecycle evidence exists.

## Procedure
1. Capture baseline: orchestration turns, no-progress cycles, wait intervals, estimated tokens, and child terminal-to-recognition latency.
2. Classify each turn as progress-producing or orchestration-only.
3. Compare intended orchestration operation with selected tool.
4. Reconcile lifecycle evidence: terminal events, runtime status, cached/UI status.
5. Identify the first no-progress loop and its trigger.
6. Form one hypothesis: wrong-tool routing, stale state, missing terminal event, or over-frequent polling.
7. Apply the smallest relevant guard/config change.
8. Re-run the same workload or fixture.
9. Compare before/after metrics and verify result collection remains correct.

## Decision points
- Wrong tool family: reconcile immediately.
- Terminal event already observed: collect result, do not poll.
- No-progress budget reached: authoritative reconciliation.
- Token/turn budget exhausted: stop and escalate.

## Expected output
A before/after table with orchestration turns, estimated tokens, p50/p95 wait latency, stale-state count, wrong-tool count, and result-loss status.

## Metrics
Lower orchestration turns/tokens and terminal-to-recognition latency, with unchanged task/result correctness.

## Verification
A separate verifier confirms that any reduction comes from fewer idle coordination turns rather than skipped child work or missing results.

## Failure handling
Maximum 2 optimization iterations. If metrics do not improve or correctness regresses, revert the orchestration change and retain the baseline evidence.

## Stop conditions
Verified improvement; correctness regression; budget exhaustion; or two failed hypotheses.