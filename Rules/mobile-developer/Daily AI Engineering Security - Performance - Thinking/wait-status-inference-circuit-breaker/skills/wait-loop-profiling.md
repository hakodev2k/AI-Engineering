# Skill: Wait Loop Profiling

## Purpose
Measure coordination-only inference and identify repeated no-progress wait/status loops.

## Trigger
Long-running task with repeated wait/status/list-agent calls, rising quota use, or unexplained idle latency.

## Inputs
Timestamped tool-call log, model-turn token counts, agent/process states, timeout values.

## Preconditions
Logs must distinguish tool name, arguments, result, and model-turn token usage.

## Allowed tools
Read-only log parser, JSON processing, metrics collector.

## Constraints
Do not terminate work based solely on elapsed time. Preserve legitimate long-running processes. Never infer progress from model commentary; use observable state.

## Procedure
1. Capture a baseline window.
2. Normalize each wait/status call into a signature of tool, target, relevant args, result state, and target state version.
3. Count unchanged consecutive signatures and coordination-only model turns.
4. Measure tokens, calls, and wall time spent while state did not change.
5. Separate transient waits from stale/no-target waits.
6. Recommend event-driven wait, backoff, suppression, or circuit breaking.

## Decision points
- Same no-progress signature >=3 times: flag for backoff.
- >=5 unchanged model turns: circuit-breaker candidate.
- Wait references nonexistent/stale target: immediate failure path.

## Expected output
Baseline JSON with total turns, wait turns, timeout rate, unchanged-run length, tokens wasted, and target-state evidence.

## Metrics
Coordination-only turns/task, no-progress token ratio, timeout ratio, median poll interval, useful-state-change latency.

## Verification
Compare pre/post workload on the same fixtures and confirm useful outputs are unchanged while coordination-only calls decrease.

## Failure handling
If logs lack state identity/version, mark evidence incomplete and do not claim optimization.

## Stop conditions
Stop analysis after a representative full task or 500 coordination events, whichever comes first.