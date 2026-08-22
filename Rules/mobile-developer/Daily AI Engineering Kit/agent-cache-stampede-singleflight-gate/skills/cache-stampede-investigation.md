# Cache Stampede Investigation

## Purpose
Find cache keys or code paths where concurrent misses can fan out into duplicate origin/database calls.

## When to use
Use after latency spikes, origin saturation, cache expiry incidents, or before introducing expensive cached computations.

## Inputs
- Repository path
- Cache implementation and key builders
- Origin/data-source calls
- Metrics or logs if available

## Preconditions
- Read access to repository and telemetry
- No production mutation is required

## Allowed tools
Repository search, logs, metrics, profilers, tests, local scripts.

## Constraints
Do not flush production caches, change cluster topology, or alter production TTLs without approval.

## Procedure
1. Locate cache read/write APIs and key construction.
2. Trace every miss path to the origin call.
3. Identify high-cost or high-fan-out origin operations.
4. Check whether concurrent requests for the same key are coalesced.
5. Check lock ownership, timeout, cancellation, and exception release behavior.
6. Check TTL synchronization; flag large groups of keys with identical expiry.
7. Check stale-value behavior during refresh and origin failure.
8. Check negative caching for repeated not-found/error-safe outcomes.
9. Collect evidence from code, tests, traces, and metrics.
10. Classify each finding and hand it to the planner.

## Expected output
Structured findings matching `schemas/analysis-result.schema.json`.

## Verification
A finding is confirmed only when the miss path and concurrency behavior are evidenced by code, test, trace, or reproducible load.

## Failure handling
If telemetry is unavailable, mark observability gaps explicitly and use repository evidence only. Do not infer production frequency from code alone.

## Stop conditions
Stop when all relevant cache miss paths are classified or a required dependency cannot be inspected.
