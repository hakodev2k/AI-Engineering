# Workflow: Cache Affinity Regression Verification

**Trigger:** session-id, routing, provider, model or prompt-prefix code changes.  
**Goal:** detect silent loss of cache reuse before release.

## Baseline
A previously accepted trace or a controlled uncached/cached reference workload.

## Stages
1. Run `python -m unittest tests/test_cache_affinity_profiler.py`.
2. Execute a representative multi-turn agent workload.
3. Collect sanitized JSONL telemetry for every model call.
4. Run `python scripts/cache_affinity_profiler.py --trace candidate.jsonl --thresholds config/thresholds.json --baseline baseline.jsonl`.
5. Confirm session-id count and prefix-hash count match intended invariants.
6. Inspect provider changes and classify legitimate failovers.
7. Confirm required instructions/tool schemas remain present and task-quality checks pass.
8. Independent verifier reviews metrics and exceptions.

## Metrics
Cache-hit ratio, cached-token share, fresh input tokens, longest cold streak, provider changes and quality regression rate.

## Retry policy
One implementation correction followed by one full rerun.

## Stop conditions
Second failure, missing telemetry, required-context loss, or quality/security regression.

## Failure path
Block release of the cache optimization and restore the last verified request path.

## Verification
Independent verifier signs off on measured before/after evidence.

## Definition of Done
Profiler passes agreed thresholds, fresh-input-token metrics are not worse than baseline without justified failover, required context is preserved, and quality/security tests pass.
