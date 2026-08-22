# Cache Stampede Assessment Skill

## Purpose
Prove whether a cache miss or expiry can trigger excessive concurrent backend regeneration and verify that mitigation bounds the load.

## When to use
Use for cache-backed API endpoints, expensive database queries, remote API responses, distributed caches, hot keys, scheduled refreshes, or incidents showing synchronized backend spikes after cache expiry.

## Inputs
Target code path, cache keys, TTL/expiry policy, cache provider, backend dependency, concurrency characteristics, metrics/logs, relevant tests, and `config/cache-policy.json`.

## Preconditions
The target cache path is identifiable and can be inspected or tested without destructive production actions.

## Allowed tools
Repository search/read, bundled scanner/simulator, project tests/build, read-only metrics/logs, disposable load-test environments.

## Constraints
Scanner output is heuristic. Do not claim a stampede from a fixed TTL alone. Do not flush production caches or change production TTLs without approval.

## Procedure
1. Identify the cache read path, key cardinality, TTL, and regeneration function.
2. Trace a cold miss and an expiry miss through every backend call.
3. Determine the maximum number of callers that can regenerate the same key concurrently.
4. Inspect whether the implementation has single-flight, per-key locking, stale-while-revalidate, request coalescing, or another bounded-regeneration mechanism.
5. Check whether expiry is synchronized across many keys/instances; identify TTL jitter or equivalent spreading.
6. Check failure behavior: stale fallback, negative caching, bounded retry, circuit breaker, timeout, and cancellation.
7. Run `python3 scripts/scan-cache-stampede.py <repo> --output scan.json`; review each hit in context.
8. Run `python3 scripts/simulate-stampede.py --clients 32 --latency-ms 150 --output simulation.json` to demonstrate the difference between unprotected and single-flight regeneration.
9. Design a repository-specific concurrent-miss test around the actual cache abstraction and backend. Record concurrent callers and backend invocation count.
10. Test the expiry boundary and verify backend calls remain within the repository's intended regeneration bound.
11. Test backend failure during regeneration and prove callers do not create an unbounded retry or fallback storm.
12. Implement the smallest safe mitigation, preserving cache semantics and correctness.
13. Re-run focused load/tests, build/static checks, and inspect the diff.
14. Produce an assessment matching `schemas/assessment.schema.json` and validate it with `scripts/validate-assessment.py`.

## Expected output
Evidence-backed findings, backend call counts, verification flags, recommendations, and remaining risks.

## Verification
A `pass` requires a concurrent-miss test, backend call-count evidence, expiry-spread verification, and a tested failure path.

## Failure handling
Retry transient test/tool failures at most twice. Preserve load-test parameters and output. Deterministic failures require diagnosis before rerun. Escalate permission/environment blockers.

## Stop conditions
Stop before approval-required actions, after two repeated transient failures, when cache-key scope cannot be identified, or when verification would require unsafe production mutation.
